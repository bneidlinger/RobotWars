// server/game-instance.js
const ServerRobot = require('./server-robot');
const ServerRobotInterpreter = require('./server-interpreter');
const ServerCollisionSystem = require('./server-collision');

// --- Game Simulation Constants ---
const TICK_RATE = 30; // Updates per second
const ARENA_WIDTH = 900; // Match canvas size
const ARENA_HEIGHT = 900; // Match canvas size
// START CHANGE: Delay for explosion/visuals before game over screen
const DESTRUCTION_VISUAL_DELAY_MS = 1500; // 1.5 seconds
// END CHANGE

/**
 * Represents a single active game match on the server.
 * Manages the game state, robots (including potential AI dummies),
 * interpreter, collisions, game loop, delayed game over logic, // <-- Updated description
 * broadcasts state to players and spectators, handles self-destruct requests,
 * and notifies the GameManager upon game completion via a callback.
 */
class GameInstance {
    /**
     * Creates a new game instance.
     * @param {string} gameId - A unique identifier for this game.
     * @param {SocketIO.Server} io - The main Socket.IO server instance.
     * @param {Array<{socket: SocketIO.Socket | null, code: string, appearance: string, name: string, isReady: boolean}>} playersData - Array of player data (socket can be null for AI).
     * @param {Function} gameOverCallback - Function provided by GameManager to call when the game ends. Expects (gameId, winnerData) object.
     * @param {string} gameName - Thematic name for the game
     * @param {boolean} isTestGame - Flag indicating if this is a test game vs AI.
     */
    constructor(gameId, io, playersData, gameOverCallback, gameName = '', isTestGame = false) { // Added isTestGame flag
        this.gameId = gameId;
        this.io = io; // Socket.IO server instance for broadcasting
        this.players = new Map(); // robot.id -> { socket, robot, code, appearance, name }
        this.robots = []; // Array of ServerRobot instances in this game
        this.playerNames = new Map(); // Map: robot.id -> name (for easier lookup during logs/events)
        this.interpreter = new ServerRobotInterpreter(); // Handles robot code execution
        this.collisionSystem = new ServerCollisionSystem(this); // Handles collisions
        this.gameLoopInterval = null; // Stores the setInterval ID for the game loop
        this.lastTickTime = 0; // Timestamp of the last tick
        this.explosionsToBroadcast = []; // Stores explosion data generated this tick
        this.gameOverCallback = gameOverCallback;
        this.gameName = gameName || `Game ${gameId}`; // Use provided name or generate default
        this.spectatorRoom = `spectator-${this.gameId}`;
        this.gameEnded = false; // Flag to prevent multiple game over triggers
        this.isTestGame = isTestGame; // Store if this is a test game


        console.log(`[${this.gameId} - '${this.gameName}'] Initializing Game Instance (Test: ${this.isTestGame})...`);

        // Initialize players and their robots
        playersData.forEach((playerData, index) => {
            const startX = index % 2 === 0 ? 150 : ARENA_WIDTH - 150;
            const startY = 100 + Math.floor(index / 2) * (ARENA_HEIGHT - 200);
            const startDir = index % 2 === 0 ? 0 : 180;
            const robotId = playerData.socket ? playerData.socket.id : `dummy-bot-${this.gameId}`;

            const robot = new ServerRobot(robotId, startX, startY, startDir, playerData.appearance);
            robot.name = playerData.name;
            this.robots.push(robot);

            this.players.set(robotId, {
                socket: playerData.socket,
                robot: robot,
                code: playerData.code,
                appearance: playerData.appearance,
                name: playerData.name
            });
            this.playerNames.set(robot.id, playerData.name);

            console.log(`[${this.gameId}] Added participant ${playerData.name} (${robot.id}), Socket: ${playerData.socket ? 'Yes' : 'No'}`);

            if (playerData.socket) {
                playerData.socket.join(this.gameId);
                console.log(`[${this.gameId}] Player ${playerData.name} joined game room.`);
            }
        });

        this.interpreter.initialize(this.robots, this.players);
        console.log(`[${this.gameId}] Game Instance Initialization complete.`);
    }

    /** Starts the main game loop interval. */
    startGameLoop() {
        console.log(`[${this.gameId}] Starting game loop.`);
        this.lastTickTime = Date.now();
        this.gameEnded = false; // Reset ended flag

        if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);

        this.gameLoopInterval = setInterval(() => {
            if (this.gameEnded) { // Double check before ticking
                this.stopGameLoop();
                return;
            }
            const now = Date.now();
            const deltaTime = (now - this.lastTickTime) / 1000.0;
            this.lastTickTime = now;
            this.tick(deltaTime);
        }, 1000 / TICK_RATE);
    }

    /** Stops the main game loop interval and performs cleanup. */
    stopGameLoop() {
        console.log(`[${this.gameId}] Stopping game loop.`);
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
        // Don't stop interpreter here, wait until game instance is fully removed
    }

    /** Executes a single tick of the game simulation. */
    tick(deltaTime) {
        try {
            if (this.gameEnded) return; // Prevent tick execution after game over is decided

            this.explosionsToBroadcast = [];

            // 1. Execute Robot AI Code
            this.interpreter.executeTick(this.robots, this);

            // 2. Update Robot and Missile Physics/Movement
            this.robots.forEach(robot => {
                robot.update(deltaTime, ARENA_WIDTH, ARENA_HEIGHT);
            });

            // 3. Check for and Resolve Collisions
            // Collision system calls robot.takeDamage(), which might change state
            this.collisionSystem.checkAllCollisions();

            // START CHANGE: Emit robotDestroyed event for newly destroyed robots
            this.robots.forEach(robot => {
                if (robot.state === 'destroyed' && !robot.destructionNotified) {
                    const destructionData = {
                        robotId: robot.id,
                        x: robot.x,
                        y: robot.y,
                        cause: robot.lastDamageCause || 'missile' // Get cause stored by takeDamage
                    };
                    // Emit to game room AND spectator room
                    this.io.to(this.gameId).to(this.spectatorRoom).emit('robotDestroyed', destructionData);
                    robot.destructionNotified = true; // Mark as notified
                    console.log(`[${this.gameId}] Emitted robotDestroyed for ${robot.id} (Cause: ${destructionData.cause})`);
                }
            });
            // END CHANGE

            // 4. Check for Game Over Condition (handles delay now)
            if (this.checkGameOver()) {
                // checkGameOver calls stopGameLoop and notifies if true
                return;
            }

            // 5. Gather and Broadcast State
            const gameState = this.getGameState();
            this.io.to(this.gameId).to(this.spectatorRoom).emit('gameStateUpdate', gameState);

        } catch (error) {
             console.error(`[${this.gameId}] CRITICAL ERROR during tick:`, error);
             this.stopGameLoop();
             this.gameEnded = true; // Mark as ended to prevent further processing
             this.io.to(this.gameId).to(this.spectatorRoom).emit('gameError', { message: `Critical server error in '${this.gameName}'. Game aborted.` });
             if (typeof this.gameOverCallback === 'function') {
                 this.gameOverCallback(this.gameId, { winnerId: null, winnerName: 'None', reason: 'Server Error', wasTestGame: this.isTestGame });
             }
        }
    }

    /**
     * Checks if the game has reached an end condition, considering the visual delay.
     * If the game is over, it stops the loop, notifies clients, and calls the GameManager callback.
     * @returns {boolean} True if the game is over, false otherwise.
     */
    checkGameOver() {
        if (this.gameEnded || !this.gameLoopInterval) {
             return true; // Already ended or loop stopped
        }

        // START CHANGE: Delayed game over logic
        let potentialLoser = null; // Robot whose timer has expired
        let destructionPending = false; // Flag if any robot is destroyed but timer hasn't passed

        const now = Date.now();
        for (const robot of this.robots) {
            if (robot.state === 'destroyed') {
                if (now >= (robot.destructionTime + DESTRUCTION_VISUAL_DELAY_MS)) {
                    // Delay has passed for this destroyed robot
                    potentialLoser = robot;
                    // Found a loser whose timer expired, no need to check further losers this tick
                    break;
                } else {
                    // A robot is destroyed, but we're waiting for the visual delay
                    destructionPending = true;
                }
            }
        }

        // If a destruction is pending visual delay, wait for the next tick
        if (destructionPending && !potentialLoser) {
            return false; // Game continues, waiting for delay
        }

        // If we are here, either:
        // 1. A potentialLoser was found (their timer expired).
        // 2. No destruction is pending (no one is destroyed, or their timers expired previously).

        // Check active robots *now* (only needed if no potentialLoser was identified by timer)
        const activeRobots = this.robots.filter(r => r.state === 'active');

        // Determine if the game should end based on loser or remaining active robots
        let isGameOver = false;
        let winner = null;
        let loser = null;
        let reason = 'elimination';

        if (potentialLoser) {
             // Game ends because a robot's destruction timer expired
             isGameOver = true;
             loser = this.players.get(potentialLoser.id); // Get full player data for loser
             // Winner is the other participant (assumes 2 player games for now)
             winner = Array.from(this.players.values()).find(p => p.robot && p.robot.id !== potentialLoser.id);
             reason = `${loser?.name || 'A robot'} was destroyed!`;
             console.log(`[${this.gameId}] Game Over: Timer expired for ${potentialLoser.id}`);

        } else if (!destructionPending && activeRobots.length <= 1 && this.robots.length >= 2) {
             // Game ends because only 0 or 1 robots are left active, and no delay is pending
             isGameOver = true;
             if (activeRobots.length === 1) {
                 winner = this.players.get(activeRobots[0].id);
                 loser = Array.from(this.players.values()).find(p => p.robot && p.robot.id !== activeRobots[0].id);
                 reason = "Last robot standing!";
             } else { // activeRobots.length === 0
                 reason = "Mutual Destruction!";
                 // Both players are losers in a draw
                 winner = null; // No winner
                 loser = null; // Both destroyed simultaneously, maybe set both? Keep null for simplicity.
             }
             console.log(`[${this.gameId}] Game Over: Active robots <= 1. Reason: ${reason}`);
        }

        // If game over condition met
        if (isGameOver) {
            this.gameEnded = true; // Set flag to prevent re-entry/further ticks
            this.stopGameLoop(); // Stop simulation loop

            // --- Adjust winner/loser for Test Games ---
            if (this.isTestGame) {
                const realPlayerEntry = Array.from(this.players.entries()).find(([id, data]) => data.socket !== null);
                const botEntry = Array.from(this.players.entries()).find(([id, data]) => data.socket === null);

                if (!realPlayerEntry || !botEntry) {
                     console.error(`[${this.gameId}] Test game over, but couldn't find real player or bot entry!`);
                     // Fallback to generic no-winner scenario
                     winner = null;
                     loser = null;
                     reason = "Test game ended unexpectedly";
                } else {
                    const realPlayer = realPlayerEntry[1];
                    const botPlayer = botEntry[1];

                    // Determine outcome based on who the potentialLoser was or remaining active state
                    if (potentialLoser && potentialLoser.id === realPlayer.robot.id) { // Player lost
                        winner = botPlayer;
                        loser = realPlayer;
                        reason = `${realPlayer.name} was destroyed by ${botPlayer.name}!`;
                    } else if (potentialLoser && potentialLoser.id === botPlayer.robot.id) { // Bot lost
                        winner = realPlayer;
                        loser = botPlayer;
                        reason = `${realPlayer.name} destroyed ${botPlayer.name}!`;
                    } else if (activeRobots.length === 1 && activeRobots[0].id === realPlayer.robot.id) { // Player is last standing
                        winner = realPlayer;
                        loser = botPlayer;
                        reason = `${realPlayer.name} is the last one standing!`;
                    } else if (activeRobots.length === 1 && activeRobots[0].id === botPlayer.robot.id) { // Bot is last standing
                        winner = botPlayer; // Bot wins in this case
                        loser = realPlayer;
                        reason = `${botPlayer.name} defeated ${realPlayer.name}!`;
                    } else if (activeRobots.length === 0) { // Draw
                        winner = null;
                        loser = null; // Treat both as losers in draw?
                        reason = "Mutual Destruction in test game!";
                    }
                    // Override display names for clarity
                    if (winner) winner.name = winner.socket ? winner.name : botPlayer.name; // Use correct bot name
                    if (loser) loser.name = loser.socket ? loser.name : botPlayer.name; // Use correct bot name
                }
            }
            // --- End Test Game Adjustment ---


            // Prepare final winner data object for emission/callback
            const finalWinnerData = {
                gameId: this.gameId,
                winnerId: winner ? winner.robot.id : null,
                winnerName: winner ? winner.name : 'None', // Use adjusted name
                reason: reason,
                wasTestGame: this.isTestGame // Include test game flag
            };

            console.log(`[${this.gameId}] Final Game Over. Winner: ${finalWinnerData.winnerName}. Reason: ${finalWinnerData.reason}.`);

            // Notify players IN THE GAME ROOM
            // For test games, only the real player is in this room.
             this.io.to(this.gameId).emit('gameOver', finalWinnerData);
             console.log(`[${this.gameId}] Emitted 'gameOver' to game room ${this.gameId}.`);

            // Notify SPECTATORS
            this.io.to(this.spectatorRoom).emit('spectateGameOver', finalWinnerData);
            console.log(`[${this.gameId}] Emitted 'spectateGameOver' to spectator room ${this.spectatorRoom}.`);

            // Call the GameManager callback
            if (typeof this.gameOverCallback === 'function') {
                this.gameOverCallback(this.gameId, finalWinnerData); // Pass final data
            } else {
                console.warn(`[${this.gameId}] gameOverCallback is not a function!`);
            }
            return true; // Game is definitively over
        }
        // END CHANGE

        return false; // Game continues
    }


    /** Creates data for a visual explosion effect to be sent to clients. */
    createExplosion(x, y, size) {
        const explosionData = {
            id: `e-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            x: x, y: y, size: size,
        };
        this.explosionsToBroadcast.push(explosionData);
    }

    /** Gathers the current state of the game into a serializable object. */
    getGameState() {
        const activeMissiles = [];
        this.robots.forEach(robot => {
            // Collect missiles even from destroyed robots
            activeMissiles.push(...robot.missiles);
        });

        const state = {
            gameId: this.gameId,
            gameName: this.gameName,
            robots: this.robots.map(robot => ({
                id: robot.id,
                x: robot.x, y: robot.y,
                direction: robot.direction,
                damage: robot.damage,
                color: robot.color,
                // START CHANGE: Send isAlive based on getter for client compatibility
                isAlive: robot.isAlive,
                // END CHANGE
                appearance: robot.appearance,
                name: robot.name
            })),
            missiles: activeMissiles.map(missile => ({
                id: missile.id, x: missile.x, y: missile.y,
                radius: missile.radius, ownerId: missile.ownerId
            })),
            explosions: this.explosionsToBroadcast,
            timestamp: Date.now()
        };
        return state;
    }

    /** Performs a scan operation for a given robot. */
    performScan(scanningRobot, direction, resolution) {
        if (scanningRobot.state !== 'active') return null; // Destroyed robots cannot scan

        const scanDirection = ((Number(direction) % 360) + 360) % 360;
        const halfResolution = Math.max(1, Number(resolution) / 2);
        const scanRange = 800;
        let startAngleDeg = (scanDirection - halfResolution + 360) % 360;
        let endAngleDeg = (scanDirection + halfResolution + 360) % 360;
        const wrapsAround = startAngleDeg > endAngleDeg;

        let closestTargetInfo = null;
        let closestDistanceSq = scanRange * scanRange;

        this.robots.forEach(targetRobot => {
            // Skip self and non-active robots
            if (scanningRobot.id === targetRobot.id || targetRobot.state !== 'active') {
                return;
            }

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
                    distance: Math.sqrt(distanceSq),
                    direction: angleToTargetDeg,
                    id: targetRobot.id,
                    name: targetRobot.name
                };
            }
        });
        return closestTargetInfo;
    }

    /** Triggers the self-destruction sequence for a specific robot. */
    triggerSelfDestruct(robotId) {
         const playerData = this.players.get(robotId);

         if (playerData && playerData.robot && playerData.robot.state === 'active') { // Check state
             const robot = playerData.robot;
             console.log(`[${this.gameId}] Triggering self-destruct for robot ${robot.name} (${robot.id}).`);

             // START CHANGE: Call takeDamage, remove direct checkGameOver
             // This returns { destroyed: true, ... } and sets state/time internally
             const result = robot.takeDamage(1000, 'selfDestruct'); // Deal massive damage

             // The main tick loop will now detect this state change, emit robotDestroyed,
             // and eventually trigger checkGameOver after the delay.

             // Create a big explosion (still useful here for immediate visual cue)
             this.createExplosion(robot.x, robot.y, 5); // Size 5 explosion

             console.log(`[${this.gameId}] Self-destruct damage applied. Destruction result:`, result.destroyed);
             // END CHANGE

         } else {
             console.warn(`[${this.gameId}] Could not trigger self-destruct for ${robotId}. Robot not found or not active.`);
         }
    }

    /** Removes a player and marks their robot as inactive/destroyed. */
    removePlayer(robotId) {
        const playerName = this.playerNames.get(robotId) || robotId.substring(0,8)+'...';
        console.log(`[${this.gameId}] Handling removal of participant ${playerName} (${robotId}).`);

        const playerData = this.players.get(robotId);
        if (playerData) {
            if (playerData.robot) {
                 // START CHANGE: Set state directly for clarity on removal
                 playerData.robot.state = 'destroyed';
                 if (!playerData.robot.destructionTime) { // Only set if not already set
                     playerData.robot.destructionTime = Date.now();
                 }
                 playerData.robot.damage = 100; // Ensure damage reflects state
                 playerData.robot.speed = 0;
                 playerData.robot.targetSpeed = 0;
                 // END CHANGE
                 console.log(`[${this.gameId}] Marked robot for ${playerName} as destroyed.`);
            }
            this.players.delete(robotId);
            this.playerNames.delete(robotId);
        } else {
             console.warn(`[${this.gameId}] Tried to remove participant ${robotId}, but not found.`);
        }
    }

    /** Checks if the game instance has no *real* players left. */
    isEmpty() {
        // A game is empty if the map is empty OR all remaining entries have null sockets (dummy bots)
        if (this.players.size === 0) return true;
        return Array.from(this.players.values()).every(p => p.socket === null);
    }

    /** Cleans up resources associated with this game instance. */
    cleanup() {
        console.log(`[${this.gameId}] Cleaning up instance. Removing spectators from ${this.spectatorRoom}`);
        this.io.socketsLeave(this.spectatorRoom);
        this.io.socketsLeave(this.gameId);
        // Stop interpreter if it's still running (should be stopped by game over, but belt-and-suspenders)
        if(this.interpreter) {
            this.interpreter.stop();
        }
        console.log(`[${this.gameId}] Cleanup complete.`);
    }

} // End GameInstance

module.exports = GameInstance;