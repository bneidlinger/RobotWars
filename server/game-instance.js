// server/game-instance.js
const ServerRobot = require('./server-robot');
const ServerRobotInterpreter = require('./server-interpreter');
const ServerCollisionSystem = require('./server-collision');

// --- Game Simulation Constants ---
const TICK_RATE = 30;
const ARENA_WIDTH = 900;
const ARENA_HEIGHT = 900;
const DESTRUCTION_VISUAL_DELAY_MS = 1500; // 1.5 seconds

/**
 * Represents a single active game match on the server.
 * Manages game state, robots, interpreter, collisions, game loop,
 * delayed game over logic, sound event collection & broadcasting, // <-- Updated description
 * and notifies GameManager upon completion.
 */
class GameInstance {
    constructor(gameId, io, playersData, gameOverCallback, gameName = '', isTestGame = false) {
        this.gameId = gameId;
        this.io = io;
        this.players = new Map();
        this.robots = [];
        this.playerNames = new Map();
        this.interpreter = new ServerRobotInterpreter();
        this.collisionSystem = new ServerCollisionSystem(this);
        this.gameLoopInterval = null;
        this.lastTickTime = 0;
        this.explosionsToBroadcast = []; // Visual explosion effects
        // START CHANGE: Add arrays for sound events
        this.fireEventsToBroadcast = [];   // { type: 'fire', x, y, ownerId }
        this.hitEventsToBroadcast = [];    // { type: 'hit', x, y, targetId }
        // END CHANGE
        this.gameOverCallback = gameOverCallback;
        this.gameName = gameName || `Game ${gameId}`;
        this.spectatorRoom = `spectator-${this.gameId}`;
        this.gameEnded = false;
        this.isTestGame = isTestGame;

        console.log(`[${this.gameId} - '${this.gameName}'] Initializing Game Instance (Test: ${this.isTestGame})...`);
        this._initializePlayers(playersData);
        this.interpreter.initialize(this.robots, this.players);
        console.log(`[${this.gameId}] Game Instance Initialization complete.`);
    }

    /** Helper to initialize players and robots */
    _initializePlayers(playersData) {
        playersData.forEach((playerData, index) => {
            const startX = index % 2 === 0 ? 150 : ARENA_WIDTH - 150;
            const startY = 100 + Math.floor(index / 2) * (ARENA_HEIGHT - 200);
            const startDir = index % 2 === 0 ? 0 : 180;
            const robotId = playerData.socket ? playerData.socket.id : `dummy-bot-${this.gameId}`;

            const robot = new ServerRobot(robotId, startX, startY, startDir, playerData.appearance);
            robot.name = playerData.name;
            this.robots.push(robot);

            this.players.set(robotId, { socket: playerData.socket, robot, ...playerData });
            this.playerNames.set(robot.id, playerData.name);

            console.log(`[${this.gameId}] Added participant ${playerData.name} (${robot.id}), Socket: ${playerData.socket ? 'Yes' : 'No'}`);
            if (playerData.socket) {
                playerData.socket.join(this.gameId);
            }
        });
    }

    startGameLoop() {
        console.log(`[${this.gameId}] Starting game loop.`);
        this.lastTickTime = Date.now();
        this.gameEnded = false;
        if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = setInterval(() => {
            if (this.gameEnded) { this.stopGameLoop(); return; }
            const now = Date.now();
            const deltaTime = (now - this.lastTickTime) / 1000.0;
            this.lastTickTime = now;
            this.tick(deltaTime);
        }, 1000 / TICK_RATE);
    }

    stopGameLoop() {
        console.log(`[${this.gameId}] Stopping game loop.`);
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
    }

    tick(deltaTime) {
        try {
            if (this.gameEnded) return;

            // START CHANGE: Clear transient event lists
            this.explosionsToBroadcast = [];
            this.fireEventsToBroadcast = [];
            this.hitEventsToBroadcast = [];
            // END CHANGE

            // 1. Execute Robot AI Code - This now returns results including potential fire events
            const executionResults = this.interpreter.executeTick(this.robots, this);
            // START CHANGE: Collect fire events from interpreter results
            executionResults.forEach(result => {
                if (result && result.fireEventData) {
                    this.addFireEvent(result.fireEventData);
                }
            });
            // END CHANGE

            // 2. Update Robot and Missile Physics/Movement
            this.robots.forEach(robot => {
                robot.update(deltaTime, ARENA_WIDTH, ARENA_HEIGHT);
            });

            // 3. Check for and Resolve Collisions
            // Collision system calls takeDamage, which returns hit results
            // It now also calls this.addHitEvent internally
            this.collisionSystem.checkAllCollisions();

            // 4. Emit robotDestroyed event for newly destroyed robots
            this.robots.forEach(robot => {
                if (robot.state === 'destroyed' && !robot.destructionNotified) {
                    const destructionData = {
                        robotId: robot.id,
                        x: robot.x, y: robot.y,
                        cause: robot.lastDamageCause || 'unknown'
                    };
                    this.io.to(this.gameId).to(this.spectatorRoom).emit('robotDestroyed', destructionData);
                    robot.destructionNotified = true;
                }
            });

            // 5. Check for Game Over Condition (handles delay)
            if (this.checkGameOver()) { return; }

            // 6. Gather and Broadcast State (including new sound events)
            const gameState = this.getGameState();
            this.io.to(this.gameId).to(this.spectatorRoom).emit('gameStateUpdate', gameState);

        } catch (error) {
             console.error(`[${this.gameId}] CRITICAL ERROR during tick:`, error);
             this.gameEnded = true;
             this.stopGameLoop();
             this.io.to(this.gameId).to(this.spectatorRoom).emit('gameError', { message: `Critical server error in '${this.gameName}'. Game aborted.` });
             if (typeof this.gameOverCallback === 'function') {
                 this.gameOverCallback(this.gameId, { winnerId: null, winnerName: 'None', reason: 'Server Error', wasTestGame: this.isTestGame });
             }
        }
    }

    // START CHANGE: Methods to add sound events
    /** Adds a fire event to the list for broadcasting. */
    addFireEvent(eventData) {
        if (eventData && eventData.type === 'fire') {
            this.fireEventsToBroadcast.push(eventData);
            // console.log(`[${this.gameId}] Added fire event from ${eventData.ownerId}`); // Optional Log
        } else {
             console.warn(`[${this.gameId}] Attempted to add invalid fire event:`, eventData);
        }
    }

    /** Adds a hit event to the list for broadcasting. Called by CollisionSystem. */
    addHitEvent(x, y, targetId) {
        this.hitEventsToBroadcast.push({ type: 'hit', x, y, targetId });
        // console.log(`[${this.gameId}] Added hit event for ${targetId} at (${x.toFixed(0)}, ${y.toFixed(0)})`); // Optional Log
    }
    // END CHANGE

    checkGameOver() {
        if (this.gameEnded || !this.gameLoopInterval) return true;

        let potentialLoser = null;
        let destructionPending = false;
        const now = Date.now();

        for (const robot of this.robots) {
            if (robot.state === 'destroyed') {
                if (now >= (robot.destructionTime + DESTRUCTION_VISUAL_DELAY_MS)) {
                    potentialLoser = robot; break;
                } else {
                    destructionPending = true;
                }
            }
        }

        if (destructionPending && !potentialLoser) return false; // Wait for delay

        const activeRobots = this.robots.filter(r => r.state === 'active');
        let isGameOver = false;
        let winner = null;
        let loser = null;
        let reason = 'elimination';

        if (potentialLoser) {
             isGameOver = true;
             loser = this.players.get(potentialLoser.id);
             winner = Array.from(this.players.values()).find(p => p.robot && p.robot.id !== potentialLoser.id);
             reason = `${loser?.name || 'A robot'} was destroyed!`;
        } else if (!destructionPending && activeRobots.length <= 1 && this.robots.length >= 2) {
             isGameOver = true;
             if (activeRobots.length === 1) {
                 winner = this.players.get(activeRobots[0].id);
                 loser = Array.from(this.players.values()).find(p => p.robot && p.robot.id !== activeRobots[0].id);
                 reason = "Last robot standing!";
             } else {
                 reason = "Mutual Destruction!";
             }
        }

        if (isGameOver) {
            this.gameEnded = true;
            this.stopGameLoop();

            // Adjust for Test Games
            if (this.isTestGame) {
                const realPlayerEntry = Array.from(this.players.entries()).find(([id, data]) => data.socket !== null);
                const botEntry = Array.from(this.players.entries()).find(([id, data]) => data.socket === null);
                if(realPlayerEntry && botEntry){
                    const realPlayer = realPlayerEntry[1]; const botPlayer = botEntry[1];
                    // Simplified test game win/loss logic based on final state
                    if (potentialLoser?.id === realPlayer.robot.id || (activeRobots.length===1 && activeRobots[0].id === botPlayer.robot.id)) {
                        winner = botPlayer; loser = realPlayer; // Player Lost or Bot Won
                    } else if (potentialLoser?.id === botPlayer.robot.id || (activeRobots.length===1 && activeRobots[0].id === realPlayer.robot.id)) {
                        winner = realPlayer; loser = botPlayer; // Player Won or Bot Lost
                    } else { // Draw
                        winner = null; loser = null;
                    }
                    if(winner) winner.name = winner.socket ? winner.name : botPlayer.name;
                    if(loser) loser.name = loser.socket ? loser.name : botPlayer.name;
                    // Update reason based on winner/loser
                    if (winner && loser) reason = `${winner.name} defeated ${loser.name}!`;
                    else if (winner) reason = `${winner.name} is the last one standing!`;
                    else reason = "Mutual Destruction in test game!";

                } else { reason = "Test game ended unexpectedly"; winner=null; loser=null; }
            }

            const finalWinnerData = {
                gameId: this.gameId,
                winnerId: winner ? winner.robot.id : null,
                winnerName: winner ? winner.name : 'None',
                reason: reason,
                wasTestGame: this.isTestGame
            };

            console.log(`[${this.gameId}] Final Game Over. Winner: ${finalWinnerData.winnerName}.`);
            this.io.to(this.gameId).emit('gameOver', finalWinnerData);
            this.io.to(this.spectatorRoom).emit('spectateGameOver', finalWinnerData);

            if (typeof this.gameOverCallback === 'function') {
                this.gameOverCallback(this.gameId, finalWinnerData);
            }
            return true;
        }
        return false;
    }

    createExplosion(x, y, size) {
        const explosionData = { id: `e-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`, x, y, size };
        this.explosionsToBroadcast.push(explosionData);
    }

    getGameState() {
        const activeMissiles = [];
        this.robots.forEach(robot => activeMissiles.push(...robot.missiles));

        return {
            gameId: this.gameId,
            gameName: this.gameName,
            robots: this.robots.map(r => ({
                id: r.id, x: r.x, y: r.y, direction: r.direction,
                damage: r.damage, color: r.color, isAlive: r.isAlive,
                appearance: r.appearance, name: r.name
            })),
            missiles: activeMissiles.map(m => ({
                id: m.id, x: m.x, y: m.y, radius: m.radius, ownerId: m.ownerId
            })),
            explosions: this.explosionsToBroadcast, // Visual effects
            // START CHANGE: Include sound event arrays
            fireEvents: this.fireEventsToBroadcast,
            hitEvents: this.hitEventsToBroadcast,
            // END CHANGE
            timestamp: Date.now()
        };
    }

    performScan(scanningRobot, direction, resolution) {
        // (Scan logic remains the same as before)
        if (scanningRobot.state !== 'active') return null;

        const scanDirection = ((Number(direction) % 360) + 360) % 360;
        const halfResolution = Math.max(1, Number(resolution) / 2);
        const scanRange = 800;
        let startAngleDeg = (scanDirection - halfResolution + 360) % 360;
        let endAngleDeg = (scanDirection + halfResolution + 360) % 360;
        const wrapsAround = startAngleDeg > endAngleDeg;

        let closestTargetInfo = null;
        let closestDistanceSq = scanRange * scanRange;

        this.robots.forEach(targetRobot => {
            if (scanningRobot.id === targetRobot.id || targetRobot.state !== 'active') return;

            const dx = targetRobot.x - scanningRobot.x;
            const dy = targetRobot.y - scanningRobot.y;
            const distanceSq = dx * dx + dy * dy;

            if (distanceSq >= closestDistanceSq) return;

            let angleToTargetDeg = Math.atan2(-dy, dx) * 180 / Math.PI;
            angleToTargetDeg = (angleToTargetDeg + 360) % 360;

            let inArc = wrapsAround ? (angleToTargetDeg >= startAngleDeg || angleToTargetDeg <= endAngleDeg)
                                    : (angleToTargetDeg >= startAngleDeg && angleToTargetDeg <= endAngleDeg);

            if (inArc) {
                closestDistanceSq = distanceSq;
                closestTargetInfo = {
                    distance: Math.sqrt(distanceSq), direction: angleToTargetDeg,
                    id: targetRobot.id, name: targetRobot.name
                };
            }
        });
        return closestTargetInfo;
    }

    triggerSelfDestruct(robotId) {
         const playerData = this.players.get(robotId);
         if (playerData?.robot?.state === 'active') {
             const robot = playerData.robot;
             console.log(`[${this.gameId}] Triggering self-destruct for ${robot.name} (${robot.id}).`);
             const result = robot.takeDamage(1000, 'selfDestruct');
             // Tick loop handles event emission and delayed game over
             this.createExplosion(robot.x, robot.y, 5); // Immediate visual effect
             console.log(`[${this.gameId}] Self-destruct applied. Destroyed: ${result.destroyed}`);
         } else {
             console.warn(`[${this.gameId}] Self-destruct failed for ${robotId}: Not found or not active.`);
         }
    }

    removePlayer(robotId) {
        const playerName = this.playerNames.get(robotId) || robotId.substring(0,8)+'...';
        console.log(`[${this.gameId}] Handling removal of participant ${playerName} (${robotId}).`);
        const playerData = this.players.get(robotId);
        if (playerData?.robot) {
             playerData.robot.state = 'destroyed';
             if (!playerData.robot.destructionTime) playerData.robot.destructionTime = Date.now();
             playerData.robot.damage = 100;
             playerData.robot.speed = 0; playerData.robot.targetSpeed = 0;
             console.log(`[${this.gameId}] Marked robot for ${playerName} as destroyed.`);
        }
        this.players.delete(robotId);
        this.playerNames.delete(robotId);
    }

    isEmpty() {
        if (this.players.size === 0) return true;
        return Array.from(this.players.values()).every(p => p.socket === null);
    }

    cleanup() {
        console.log(`[${this.gameId}] Cleaning up instance.`);
        this.io.socketsLeave(this.spectatorRoom);
        this.io.socketsLeave(this.gameId);
        if(this.interpreter) this.interpreter.stop();
    }

} // End GameInstance

module.exports = GameInstance;

