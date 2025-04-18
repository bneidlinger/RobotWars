// server/game-instance.js
const ServerRobot = require('./server-robot');
const ServerRobotInterpreter = require('./server-interpreter');
const ServerCollisionSystem = require('./server-collision'); // Handles collisions

// --- Game Simulation Constants ---
const TICK_RATE = 30; // Updates per second
const ARENA_WIDTH = 600; // Match canvas size
const ARENA_HEIGHT = 600; // Match canvas size

/**
 * Represents a single active game match on the server.
 * Manages the game state, robots, interpreter, collisions, and game loop.
 */
class GameInstance {
    /**
     * Creates a new game instance.
     * @param {string} gameId - A unique identifier for this game.
     * @param {SocketIO.Server} io - The main Socket.IO server instance.
     * @param {Array<{socket: SocketIO.Socket, code: string, appearance: string, name: string, isReady: boolean}>} playersData - Array of player data.
     */
    constructor(gameId, io, playersData) {
        this.gameId = gameId;
        this.io = io; // Socket.IO server instance for broadcasting
        this.players = new Map(); // Map: socket.id -> { socket, robot, code, appearance, name }
        this.robots = []; // Array of ServerRobot instances in this game
        this.playerNames = new Map(); // Map: socket.id -> name (for easier lookup during logs/events)
        this.interpreter = new ServerRobotInterpreter(); // Handles robot code execution
        this.collisionSystem = new ServerCollisionSystem(this); // Handles collisions
        this.gameLoopInterval = null; // Stores the setInterval ID for the game loop
        this.lastTickTime = 0; // Timestamp of the last tick
        // Stores explosion data generated this tick to send to clients
        this.explosionsToBroadcast = [];

        console.log(`[${gameId}] Initializing Game Instance...`);

        // Initialize players and their robots based on received data
        playersData.forEach((playerData, index) => {
            // Assign starting positions (simple alternating sides)
            const startX = index % 2 === 0 ? 100 : ARENA_WIDTH - 100;
            const startY = 100 + Math.floor(index / 2) * (ARENA_HEIGHT - 200);
            const startDir = index % 2 === 0 ? 0 : 180;

            // Create the ServerRobot instance, passing appearance
            const robot = new ServerRobot(
                playerData.socket.id,
                startX, startY, startDir,
                playerData.appearance // Pass the appearance identifier
            );
            // Assign the name directly to the robot instance
            robot.name = playerData.name;
            this.robots.push(robot);

            // Store player data associated with the robot
            this.players.set(playerData.socket.id, {
                socket: playerData.socket,
                robot: robot,
                code: playerData.code,
                appearance: playerData.appearance,
                name: playerData.name // Store name here as well
            });
            // Store name in the separate map for quick lookups
            this.playerNames.set(playerData.socket.id, playerData.name);

            console.log(`[${gameId}] Added player ${playerData.name} (${playerData.socket.id}) (Appearance: ${playerData.appearance}) with Robot ${robot.id}`);

            // Add the player's socket to the dedicated Socket.IO room for this game
            playerData.socket.join(this.gameId);
            console.log(`[${gameId}] Player ${playerData.name} joined Socket.IO room.`);
        });

        // Initialize the interpreter AFTER all robots and player data are set up
        // Pass the players map which now includes the name for potential use in error messages etc.
        this.interpreter.initialize(this.robots, this.players);

        console.log(`[${gameId}] Game Instance Initialization complete.`);
    }

    /**
     * Starts the main game loop interval.
     */
    startGameLoop() {
        console.log(`[${this.gameId}] Starting game loop (Tick Rate: ${TICK_RATE}/s).`);
        this.lastTickTime = Date.now();

        if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);

        this.gameLoopInterval = setInterval(() => {
            const now = Date.now();
            const deltaTime = (now - this.lastTickTime) / 1000.0;
            this.lastTickTime = now;
            this.tick(deltaTime);
        }, 1000 / TICK_RATE);
    }

    /**
     * Stops the main game loop interval and performs cleanup.
     */
    stopGameLoop() {
        console.log(`[${this.gameId}] Stopping game loop.`);
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
        this.interpreter.stop(); // Clean up interpreter state
    }

    /**
     * Executes a single tick of the game simulation.
     * @param {number} deltaTime - The time elapsed since the last tick, in seconds.
     */
    tick(deltaTime) {
        try {
            this.explosionsToBroadcast = []; // Clear explosions from previous tick

            // 1. Execute Robot AI Code
            this.interpreter.executeTick(this.robots, this);

            // 2. Update Robot and Missile Physics/Movement
            this.robots.forEach(robot => {
                robot.update(deltaTime, ARENA_WIDTH, ARENA_HEIGHT);
            });

            // 3. Check for and Resolve Collisions
            this.collisionSystem.checkAllCollisions();

            // 4. Check for Game Over Condition
            if (this.checkGameOver()) {
                return; // Exit tick processing early
            }

            // 5. Gather and Broadcast Game State
            const gameState = this.getGameState();
            this.io.to(this.gameId).emit('gameStateUpdate', gameState);

        } catch (error) {
             console.error(`[${this.gameId}] CRITICAL ERROR during tick:`, error);
             // Consider stopping the game or notifying players
             // this.stopGameLoop();
             // this.io.to(this.gameId).emit('gameError', { message: 'Critical server error during game tick.' });
        }
    }

    /**
     * Checks if the game has ended. If so, stops loop and notifies clients.
     * @returns {boolean} True if the game is over, false otherwise.
     */
    checkGameOver() {
        const aliveRobots = this.robots.filter(r => r.isAlive);

        if (aliveRobots.length <= 1 && this.robots.length >= 2) {
            const winnerRobot = aliveRobots[0]; // Could be undefined if 0 left
            const winnerName = winnerRobot ? winnerRobot.name : 'None'; // Get name from robot instance
            const winnerId = winnerRobot ? winnerRobot.id : null;
            const reason = winnerRobot ? "Last robot standing!" : "Mutual Destruction!";

            console.log(`[${this.gameId}] Game Over detected. Reason: ${reason}. Winner: ${winnerName} (${winnerId || 'N/A'})`);

            // Notify clients about the game end, including winner's name
            this.io.to(this.gameId).emit('gameOver', {
                reason: reason,
                winnerId: winnerId, // Keep ID for any client-side logic needing it
                winnerName: winnerName // Provide name for easy display
            });

            this.stopGameLoop();
            return true; // Game is over
        }
        return false; // Game continues
    }

    /**
     * Creates data for a visual explosion effect to be sent to clients.
     * Called by collision system or other logic.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} size - Size multiplier.
     */
    createExplosion(x, y, size) {
        const explosionData = {
            id: `e-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            x: x,
            y: y,
            size: size,
        };
        this.explosionsToBroadcast.push(explosionData);
    }

    /**
     * Gathers the current game state into a serializable object for clients.
     * @returns {object} The current game state snapshot.
     */
    getGameState() {
        const activeMissiles = [];
        this.robots.forEach(robot => {
            activeMissiles.push(...robot.missiles);
        });

        const state = {
            gameId: this.gameId,
            // Map robot instances to plain data objects, including name
            robots: this.robots.map(robot => ({
                id: robot.id,
                x: robot.x,
                y: robot.y,
                direction: robot.direction,
                damage: robot.damage,
                color: robot.color, // Color is generated in ServerRobot constructor
                isAlive: robot.isAlive,
                appearance: robot.appearance,
                name: robot.name // Include the name stored on the robot instance
            })),
            missiles: activeMissiles.map(missile => ({
                id: missile.id,
                x: missile.x,
                y: missile.y,
                radius: missile.radius
            })),
            explosions: this.explosionsToBroadcast, // Send explosions triggered this tick
            timestamp: Date.now()
        };

        // Note: Clearing explosionsToBroadcast moved to start of tick()

        return state;
    }

    /**
     * Performs a scan operation for a given robot.
     * @param {ServerRobot} scanningRobot - The robot performing the scan.
     * @param {number} direction - Center direction of the scan arc (degrees).
     * @param {number} resolution - Width of the scan arc (degrees).
     * @returns {object | null} Object with { distance, direction, id, name } of the closest detected robot, or null.
     */
    performScan(scanningRobot, direction, resolution) {
        const scanDirection = ((Number(direction) % 360) + 360) % 360;
        const halfResolution = Math.max(1, Number(resolution) / 2);
        const scanRange = 800;
        let startAngleDeg = (scanDirection - halfResolution + 360) % 360;
        let endAngleDeg = (scanDirection + halfResolution + 360) % 360;
        const wrapsAround = startAngleDeg > endAngleDeg;

        let closestTargetInfo = null;
        let closestDistanceSq = scanRange * scanRange;

        this.robots.forEach(targetRobot => {
            if (scanningRobot.id === targetRobot.id || !targetRobot.isAlive) {
                return;
            }

            const dx = targetRobot.x - scanningRobot.x;
            const dy = targetRobot.y - scanningRobot.y;
            const distanceSq = dx * dx + dy * dy;

            if (distanceSq >= closestDistanceSq) {
                return;
            }

            let angleToTargetDeg = Math.atan2(-dy, dx) * 180 / Math.PI;
            angleToTargetDeg = (angleToTargetDeg + 360) % 360;

            let inArc = false;
            if (wrapsAround) {
                inArc = (angleToTargetDeg >= startAngleDeg || angleToTargetDeg <= endAngleDeg);
            } else {
                inArc = (angleToTargetDeg >= startAngleDeg && angleToTargetDeg <= endAngleDeg);
            }

            if (inArc) {
                closestDistanceSq = distanceSq;
                closestTargetInfo = {
                    distance: Math.sqrt(distanceSq),
                    direction: angleToTargetDeg,
                    id: targetRobot.id,
                    name: targetRobot.name // Include name in scan result
                };
            }
        });

        return closestTargetInfo;
    }

    /**
     * Removes a player upon disconnection, marking their robot as inactive.
     * @param {string} socketId - The ID of the disconnecting player's socket.
     */
    removePlayer(socketId) {
        // Use the playerNames map for logging
        const playerName = this.playerNames.get(socketId) || socketId.substring(0,4)+'...';
        console.log(`[${this.gameId}] Handling removal of player ${playerName} (${socketId}).`);

        const playerData = this.players.get(socketId);
        if (playerData) {
            // Mark the robot as inactive
            if (playerData.robot) {
                 playerData.robot.isAlive = false;
                 playerData.robot.speed = 0;
                 playerData.robot.targetSpeed = 0;
                 console.log(`[${this.gameId}] Marked robot for ${playerName} as inactive.`);
            }

            playerData.socket.leave(this.gameId); // Ensure socket leaves the room
            this.players.delete(socketId); // Remove from active player map
            this.playerNames.delete(socketId); // Remove from name map

            // Check if removing this player triggers game over
            this.checkGameOver();
        } else {
             console.warn(`[${this.gameId}] Tried to remove player ${socketId}, but they were not found in the player map.`);
        }
    }

    /**
     * Checks if the game instance has no active players left.
     * @returns {boolean} True if the player map is empty, false otherwise.
     */
    isEmpty() {
        return this.players.size === 0;
    }

    /**
     * Placeholder for queueing actions received directly from clients.
     * @param {string} socketId - Player's socket ID.
     * @param {object} action - Action object.
     */
    queueAction(socketId, action) {
        const playerName = this.playerNames.get(socketId) || socketId;
        console.warn(`[${this.gameId}] queueAction called but not implemented for player ${playerName}. Action:`, action);
    }
}

module.exports = GameInstance;