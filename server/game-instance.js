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
 * Manages game state, robots (with visual loadouts), interpreter, collisions, // <-- Updated description
 * game loop, delayed game over logic, sound event collection & broadcasting,
 * and notifies GameManager upon completion.
 */
class GameInstance {
    /**
     * Creates a GameInstance.
     * @param {string} gameId - Unique ID for the game.
     * @param {SocketIO.Server} io - Socket.IO server instance.
     * @param {Array<object>} playersData - Array of player data objects.
     *        Expected structure: { socket, loadout: { name, visuals, code }, isReady }
     * @param {function} gameOverCallback - Callback function for GameManager.
     * @param {string} [gameName=''] - Display name for the game.
     * @param {boolean} [isTestGame=false] - Flag indicating if this is a test game.
     */
    constructor(gameId, io, playersData, gameOverCallback, gameName = '', isTestGame = false) {
        this.gameId = gameId;
        this.io = io;
        // Players map stores the full original data structure from GameManager
        // Key: robotId (socketId or dummyId), Value: { socket, loadout: { name, visuals, code }, robot: ServerRobot }
        this.players = new Map();
        this.robots = []; // Array of ServerRobot instances
        // this.playerNames = new Map(); // Potentially redundant if name is in players map
        this.interpreter = new ServerRobotInterpreter();
        this.collisionSystem = new ServerCollisionSystem(this);
        this.gameLoopInterval = null;
        this.lastTickTime = 0;
        this.explosionsToBroadcast = [];
        this.fireEventsToBroadcast = [];
        this.hitEventsToBroadcast = [];
        this.gameOverCallback = gameOverCallback;
        this.gameName = gameName || `Game ${gameId}`;
        this.spectatorRoom = `spectator-${this.gameId}`;
        this.gameEnded = false;
        this.isTestGame = isTestGame; // Store the flag passed from GameManager

        console.log(`[${this.gameId} - '${this.gameName}'] Initializing Game Instance (Test: ${this.isTestGame})...`);
        this._initializePlayers(playersData); // Pass the structured data
        // Interpreter initialization needs the code from the loadout
        this.interpreter.initialize(this.robots, this.players); // Pass players map which contains loadout.code
        console.log(`[${this.gameId}] Game Instance Initialization complete.`);
    }

    /**
     * Helper to initialize players and robots using the structured loadout data.
     * @param {Array<object>} playersData - Array of player data { socket, loadout, isReady }
     */
    _initializePlayers(playersData) {
        playersData.forEach((playerData, index) => {
            // Ensure loadout exists and has minimum required fields
            if (!playerData.loadout || !playerData.loadout.name || !playerData.loadout.visuals || typeof playerData.loadout.code !== 'string') {
                 console.error(`[${this.gameId}] Invalid or missing loadout data for participant at index ${index}. Skipping.`);
                 // Potentially abort game creation? For now, just skip this player.
                 return;
            }

            const { socket, loadout } = playerData;
            const { name, visuals, code } = loadout; // Destructure loadout

            const startX = index % 2 === 0 ? 150 : ARENA_WIDTH - 150;
            const startY = 100 + Math.floor(index / 2) * (ARENA_HEIGHT - 200);
            const startDir = index % 2 === 0 ? 0 : 180;
            const robotId = socket ? socket.id : `dummy-bot-${this.gameId}`; // Use socket ID or generate dummy ID

            // --- Create ServerRobot instance, passing visuals and name ---
            const robot = new ServerRobot(
                robotId,
                startX, startY, startDir,
                visuals, // Pass the visuals object
                name     // Pass the name
            );
            // robot.name = name; // Name is now set in constructor

            this.robots.push(robot);

            // --- Store the full playerData (including loadout) and the robot instance ---
            this.players.set(robotId, {
                socket: socket,
                loadout: loadout, // Store the original loadout data
                robot: robot      // Store the created robot instance
            });
            // this.playerNames.set(robot.id, name); // Can likely remove this map

            console.log(`[${this.gameId}] Added participant ${name} (${robot.id}), Socket: ${socket ? 'Yes' : 'No'}`);
            if (socket) {
                socket.join(this.gameId);
            }
        });
    }

    // --- startGameLoop, stopGameLoop (No changes needed) ---
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
        if (this.gameLoopInterval) { clearInterval(this.gameLoopInterval); this.gameLoopInterval = null; }
    }

    // --- tick (No changes needed in the core tick logic) ---
    tick(deltaTime) {
        try {
            if (this.gameEnded) return;

            this.explosionsToBroadcast = [];
            this.fireEventsToBroadcast = [];
            this.hitEventsToBroadcast = [];

            // 1. Execute Robot AI Code
            const executionResults = this.interpreter.executeTick(this.robots, this);
            // No change needed here, interpreter uses the players map which has code

            // 2. Update Robot Physics/Movement
            this.robots.forEach(robot => robot.update(deltaTime, ARENA_WIDTH, ARENA_HEIGHT));

            // 3. Check Collisions
            this.collisionSystem.checkAllCollisions();

            // 4. Emit 'robotDestroyed' event
            this.robots.forEach(robot => {
                if (robot.state === 'destroyed' && !robot.destructionNotified) {
                    const destructionData = { robotId: robot.id, x: robot.x, y: robot.y, cause: robot.lastDamageCause || 'unknown' };
                    this.io.to(this.gameId).to(this.spectatorRoom).emit('robotDestroyed', destructionData);
                    robot.destructionNotified = true;
                }
            });

            // 5. Check for Game Over
            if (this.checkGameOver()) { return; }

            // 6. Broadcast State
            const gameState = this.getGameState(); // Updated to include visuals
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

    // --- addFireEvent, addHitEvent (No changes needed) ---
    addFireEvent(eventData) { if (eventData?.type === 'fire') this.fireEventsToBroadcast.push(eventData); }
    addHitEvent(x, y, targetId) { this.hitEventsToBroadcast.push({ type: 'hit', x, y, targetId }); }

    // --- checkGameOver (No changes needed, uses players map correctly) ---
    checkGameOver() {
        if (this.gameEnded || !this.gameLoopInterval) return true;
        let potentialLoser = null;
        let destructionPending = false;
        const now = Date.now();
        for (const robot of this.robots) {
            if (robot.state === 'destroyed') {
                if (now >= (robot.destructionTime + DESTRUCTION_VISUAL_DELAY_MS)) { potentialLoser = robot; break; }
                else { destructionPending = true; }
            }
        }
        if (destructionPending && !potentialLoser) return false; // Wait

        const activeRobots = this.robots.filter(r => r.state === 'active');
        let isGameOver = false;
        let winner = null;
        let loser = null;
        let reason = 'elimination';

        if (potentialLoser) {
             isGameOver = true;
             loser = this.players.get(potentialLoser.id); // Get full player data
             winner = Array.from(this.players.values()).find(p => p.robot && p.robot.id !== potentialLoser.id);
             reason = `${loser?.loadout?.name || 'A robot'} was destroyed!`; // Use loadout name
        } else if (!destructionPending && activeRobots.length <= 1 && this.robots.length >= 2) {
             isGameOver = true;
             if (activeRobots.length === 1) {
                 winner = this.players.get(activeRobots[0].id);
                 loser = Array.from(this.players.values()).find(p => p.robot && p.robot.id !== activeRobots[0].id);
                 reason = "Last robot standing!";
             } else { reason = "Mutual Destruction!"; }
        }

        if (isGameOver) {
            this.gameEnded = true;
            this.stopGameLoop();

            // Adjust for Test Games (Use loadout name)
            if (this.isTestGame) {
                const realPlayerEntry = Array.from(this.players.values()).find(p => p.socket !== null);
                const botEntry = Array.from(this.players.values()).find(p => p.socket === null);
                if(realPlayerEntry && botEntry){
                    const realPlayer = realPlayerEntry; const botPlayer = botEntry;
                    if (potentialLoser?.id === realPlayer.robot.id || (activeRobots.length===1 && activeRobots[0].id === botPlayer.robot.id)) { winner = botPlayer; loser = realPlayer; }
                    else if (potentialLoser?.id === botPlayer.robot.id || (activeRobots.length===1 && activeRobots[0].id === realPlayer.robot.id)) { winner = realPlayer; loser = botPlayer; }
                    else { winner = null; loser = null; }
                    // Update reason based on winner/loser using loadout names
                    if (winner && loser) reason = `${winner.loadout.name} defeated ${loser.loadout.name}!`;
                    else if (winner) reason = `${winner.loadout.name} is the last one standing!`;
                    else reason = "Mutual Destruction in test game!";
                } else { reason = "Test game ended unexpectedly"; winner=null; loser=null; }
            }

            const finalWinnerData = {
                gameId: this.gameId,
                winnerId: winner ? winner.robot.id : null,
                winnerName: winner ? winner.loadout.name : 'None', // Use name from loadout
                reason: reason,
                wasTestGame: this.isTestGame
            };

            console.log(`[${this.gameId}] Final Game Over. Winner: ${finalWinnerData.winnerName}.`);
            this.io.to(this.gameId).emit('gameOver', finalWinnerData);
            this.io.to(this.spectatorRoom).emit('spectateGameOver', finalWinnerData);
            if (typeof this.gameOverCallback === 'function') this.gameOverCallback(this.gameId, finalWinnerData);
            return true;
        }
        return false;
    }

    // --- createExplosion (No changes needed) ---
    createExplosion(x, y, size) { this.explosionsToBroadcast.push({ id: `e-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`, x, y, size }); }

    /** Gathers the current game state including robot visuals */
    getGameState() {
        const activeMissiles = [];
        this.robots.forEach(robot => activeMissiles.push(...robot.missiles));

        return {
            gameId: this.gameId,
            gameName: this.gameName,
            robots: this.robots.map(r => ({
                id: r.id,
                x: r.x, y: r.y,
                direction: r.direction,
                damage: r.damage,
                // color: r.color, // Color might now come from visuals? Keep base for now.
                isAlive: r.isAlive,
                name: r.name,
                visuals: r.visuals, // <<< ADDED visuals object
                // appearance: r.appearance, // <<< REMOVED old appearance string
            })),
            missiles: activeMissiles.map(m => ({
                id: m.id, x: m.x, y: m.y, radius: m.radius, ownerId: m.ownerId
            })),
            explosions: this.explosionsToBroadcast,
            fireEvents: this.fireEventsToBroadcast,
            hitEvents: this.hitEventsToBroadcast,
            timestamp: Date.now()
        };
    }

    // --- performScan (No changes needed) ---
    performScan(scanningRobot, direction, resolution) {
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
                closestTargetInfo = { distance: Math.sqrt(distanceSq), direction: angleToTargetDeg, id: targetRobot.id, name: targetRobot.name };
            }
        });
        return closestTargetInfo;
    }

    // --- triggerSelfDestruct (No changes needed) ---
    triggerSelfDestruct(robotId) {
         const playerData = this.players.get(robotId);
         if (playerData?.robot?.state === 'active') {
             const robot = playerData.robot;
             console.log(`[${this.gameId}] Triggering self-destruct for ${robot.name} (${robot.id}).`);
             const result = robot.takeDamage(1000, 'selfDestruct');
             this.createExplosion(robot.x, robot.y, 5);
             console.log(`[${this.gameId}] Self-destruct applied. Destroyed: ${result.destroyed}`);
         } else { console.warn(`[${this.gameId}] Self-destruct failed for ${robotId}: Not found or not active.`); }
    }

    // --- removePlayer (No changes needed) ---
    removePlayer(robotId) {
        const playerData = this.players.get(robotId);
        const playerName = playerData?.loadout?.name || robotId.substring(0,8)+'...'; // Use name from loadout
        console.log(`[${this.gameId}] Handling removal of participant ${playerName} (${robotId}).`);
        if (playerData?.robot) {
             playerData.robot.state = 'destroyed';
             if (!playerData.robot.destructionTime) playerData.robot.destructionTime = Date.now();
             playerData.robot.damage = 100;
             playerData.robot.speed = 0; playerData.robot.targetSpeed = 0;
             console.log(`[${this.gameId}] Marked robot for ${playerName} as destroyed.`);
        }
        this.players.delete(robotId);
        // this.playerNames.delete(robotId); // No longer needed?
    }

    // --- isEmpty (No changes needed) ---
    isEmpty() { return Array.from(this.players.values()).every(p => p.socket === null); }

    // --- cleanup (No changes needed) ---
    cleanup() {
        console.log(`[${this.gameId}] Cleaning up instance.`);
        this.io.socketsLeave(this.spectatorRoom);
        this.io.socketsLeave(this.gameId);
        if(this.interpreter) this.interpreter.stop();
    }

} // End GameInstance

module.exports = GameInstance;