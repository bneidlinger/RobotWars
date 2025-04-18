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
     * @param {Array<{socket: SocketIO.Socket, code: string, appearance: string}>} playersData - Array of player data including chosen appearance.
     */
    constructor(gameId, io, playersData) {
        this.gameId = gameId;
        this.io = io; // Socket.IO server instance for broadcasting
        this.players = new Map(); // Map: socket.id -> { socket, robot, code, appearance }
        this.robots = []; // Array of ServerRobot instances in this game
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
            const startX = index % 2 === 0 ? 100 : ARENA_WIDTH - 100; // Alternate sides
            const startY = 100 + Math.floor(index / 2) * (ARENA_HEIGHT - 200); // Stagger vertically if more than 2
            const startDir = index % 2 === 0 ? 0 : 180; // Face towards center/opponent

            // Create the ServerRobot instance, passing the chosen appearance
            const robot = new ServerRobot(
                playerData.socket.id,
                startX, startY, startDir,
                playerData.appearance // Pass the appearance identifier
            );
            this.robots.push(robot);

            // Store player data, including appearance, associated with the robot
            this.players.set(playerData.socket.id, {
                socket: playerData.socket,
                robot: robot,
                code: playerData.code,
                appearance: playerData.appearance // Store appearance here as well
            });

            console.log(`[${gameId}] Added player ${playerData.socket.id} (Appearance: ${playerData.appearance}) with Robot ${robot.id}`);

            // Add the player's socket to the dedicated Socket.IO room for this game
            playerData.socket.join(this.gameId);
            console.log(`[${gameId}] Player ${playerData.socket.id} joined Socket.IO room.`);
        });

        // Initialize the interpreter AFTER all robots and player data are set up
        this.interpreter.initialize(this.robots, this.players);

        console.log(`[${gameId}] Game Instance Initialization complete.`);
    }

    /**
     * Starts the main game loop interval.
     */
    startGameLoop() {
        console.log(`[${this.gameId}] Starting game loop (Tick Rate: ${TICK_RATE}/s).`);
        this.lastTickTime = Date.now();

        // Ensure no previous loop is running
        if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);

        // Set up the fixed-step game loop
        this.gameLoopInterval = setInterval(() => {
            const now = Date.now();
            // Calculate delta time in seconds for physics/movement calculations
            const deltaTime = (now - this.lastTickTime) / 1000.0;
            this.lastTickTime = now;

            // Execute one tick of the game simulation
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
        // Clean up interpreter state (e.g., clear contexts/functions)
        this.interpreter.stop();

        // Note: Game over notification is usually handled by checkGameOver before calling stopGameLoop
    }

    /**
     * Executes a single tick of the game simulation, including AI, physics, collisions, and state updates.
     * @param {number} deltaTime - The time elapsed since the last tick, in seconds.
     */
    tick(deltaTime) {
        try {
            // --- Start of Tick ---
            // Clear transient data from the previous tick
            this.explosionsToBroadcast = [];

            // 1. Execute Robot AI Code
            //    Interpreter runs each robot's compiled function, potentially modifying robot state (targetSpeed, targetDirection, firing).
            this.interpreter.executeTick(this.robots, this);

            // 2. Update Robot and Missile Physics/Movement
            //    Applies movement, updates cooldowns, handles boundaries, moves missiles.
            this.robots.forEach(robot => {
                robot.update(deltaTime, ARENA_WIDTH, ARENA_HEIGHT);
            });

            // 3. Check for and Resolve Collisions
            //    Detects and handles missile-robot and robot-robot interactions, applies damage.
            this.collisionSystem.checkAllCollisions();

            // 4. Check for Game Over Condition
            //    Determines if a winner has emerged. If so, stops the loop and notifies players.
            if (this.checkGameOver()) {
                // checkGameOver calls stopGameLoop and notifies clients if true
                return; // Exit tick processing early as the game has ended
            }

            // --- State Broadcasting ---
            // 5. Gather the current state of all entities for clients.
            const gameState = this.getGameState();
            // 6. Broadcast the state to all clients in this game's room.
            this.io.to(this.gameId).emit('gameStateUpdate', gameState);

        } catch (error) {
             console.error(`[${this.gameId}] CRITICAL ERROR during tick:`, error);
             // Consider stopping the game loop or handling the error more gracefully
             // this.stopGameLoop();
             // this.io.to(this.gameId).emit('gameError', { message: 'Critical server error during game tick.' });
        }
    }

    /**
     * Checks if the game has reached an end condition (e.g., only one robot left alive).
     * If the game is over, it stops the loop and notifies clients.
     * @returns {boolean} True if the game is over, false otherwise.
     */
    checkGameOver() {
        // Count how many robots are still marked as alive
        const aliveRobots = this.robots.filter(r => r.isAlive);

        // Game ends if 1 or 0 robots are left alive (and we started with at least 2 robots).
        if (aliveRobots.length <= 1 && this.robots.length >= 2) {
            const winner = aliveRobots[0]; // Could be undefined if 0 left (draw/mutual destruction)
            const winnerId = winner ? winner.id : null;
            const reason = winner ? "Last robot standing!" : "Mutual Destruction!";

            console.log(`[${this.gameId}] Game Over detected. Reason: ${reason}. Winner: ${winnerId || 'None'}`);

            // Notify clients about the game end, reason, and winner.
            this.io.to(this.gameId).emit('gameOver', {
                reason: reason,
                winner: winnerId
            });

            // Stop the simulation loop for this game instance.
            this.stopGameLoop();
            return true; // Game is over
        }
        return false; // Game continues
    }

    /**
     * Creates data for a visual explosion effect to be sent to clients.
     * This method should be called by the collision system or other game logic that causes explosions.
     * @param {number} x - X coordinate of the explosion center.
     * @param {number} y - Y coordinate of the explosion center.
     * @param {number} size - A multiplier affecting the visual size (e.g., based on missile power).
     */
    createExplosion(x, y, size) {
        const explosionData = {
            // Simple unique ID for the explosion event on the client
            id: `e-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            x: x,
            y: y,
            size: size,
        };
        // Add to the list that will be included in the next gameStateUpdate packet
        this.explosionsToBroadcast.push(explosionData);
    }

    /**
     * Gathers the current state of the game (robots, missiles, effects)
     * into a serializable object suitable for broadcasting to clients via Socket.IO.
     * @returns {object} The current game state snapshot.
     */
    getGameState() {
        // Collect all active missiles from all robots' lists
        const activeMissiles = [];
        this.robots.forEach(robot => {
            activeMissiles.push(...robot.missiles);
        });

        // Construct the state object
        const state = {
            gameId: this.gameId,
            // Map robot instances to plain data objects
            robots: this.robots.map(robot => ({
                id: robot.id,
                x: robot.x,
                y: robot.y,
                direction: robot.direction,
                damage: robot.damage,
                color: robot.color,
                isAlive: robot.isAlive,
                appearance: robot.appearance // Include appearance identifier
            })),
            // Map missile instances to plain data objects
            missiles: activeMissiles.map(missile => ({
                id: missile.id,
                x: missile.x,
                y: missile.y,
                radius: missile.radius
            })),
            // Include any explosions triggered during this tick
            explosions: this.explosionsToBroadcast, // Send the list collected this tick
            timestamp: Date.now() // Include a server timestamp
        };

        // Clear the per-tick explosion list *after* adding it to the state object.
        // Moved clearing to the start of the tick() method for clarity.
        // this.explosionsToBroadcast = [];

        return state;
    }

    /**
     * Performs a scan operation for a given robot, finding the nearest opponent within an arc.
     * Called by the interpreter's safeScan method.
     * @param {ServerRobot} scanningRobot - The robot performing the scan.
     * @param {number} direction - The center direction of the scan arc (degrees, 0=East, 90=North).
     * @param {number} resolution - The width of the scan arc (degrees).
     * @returns {object | null} An object with { distance, direction, id } of the closest detected robot, or null if none found.
     */
    performScan(scanningRobot, direction, resolution) {
        // Normalize inputs
        const scanDirection = ((Number(direction) % 360) + 360) % 360;
        const halfResolution = Math.max(1, Number(resolution) / 2); // Ensure minimum 1 degree arc
        const scanRange = 800; // Maximum scan distance

        // Define scan arc boundaries in degrees [0, 360)
        let startAngleDeg = (scanDirection - halfResolution + 360) % 360;
        let endAngleDeg = (scanDirection + halfResolution + 360) % 360;
        const wrapsAround = startAngleDeg > endAngleDeg; // Check if arc crosses the 0/360 degree line

        let closestTargetInfo = null; // Stores { distance, direction, id }
        let closestDistanceSq = scanRange * scanRange; // Use squared distance for comparison efficiency

        this.robots.forEach(targetRobot => {
            // Skip self and dead robots
            if (scanningRobot.id === targetRobot.id || !targetRobot.isAlive) {
                return;
            }

            const dx = targetRobot.x - scanningRobot.x;
            const dy = targetRobot.y - scanningRobot.y; // Use server coordinates
            const distanceSq = dx * dx + dy * dy;

            // Early exit if target is further than current closest or out of max range
            if (distanceSq >= closestDistanceSq) {
                return;
            }

            // Calculate angle to target: atan2(-dy, dx) for 0=East, 90=North convention
            let angleToTargetDeg = Math.atan2(-dy, dx) * 180 / Math.PI;
            angleToTargetDeg = (angleToTargetDeg + 360) % 360; // Normalize angle to [0, 360)

            // Check if the calculated angle falls within the scan arc
            let inArc = false;
            if (wrapsAround) { // Arc crosses 0/360 (e.g., 350 to 10)
                inArc = (angleToTargetDeg >= startAngleDeg || angleToTargetDeg <= endAngleDeg);
            } else { // Arc does not wrap (e.g., 80 to 100)
                inArc = (angleToTargetDeg >= startAngleDeg && angleToTargetDeg <= endAngleDeg);
            }

            if (inArc) {
                // Found a new closest robot within the arc
                closestDistanceSq = distanceSq;
                closestTargetInfo = {
                    distance: Math.sqrt(distanceSq), // Calculate actual distance only for the final result
                    direction: angleToTargetDeg, // Report angle using the 0=East convention
                    id: targetRobot.id // Include the ID of the detected robot
                };
            }
        });

        return closestTargetInfo; // Return data for the closest robot, or null if none found
    }

    /**
     * Removes a player and marks their robot as inactive upon disconnection.
     * Called by the GameManager.
     * @param {string} socketId - The ID of the disconnecting player's socket.
     */
    removePlayer(socketId) {
        console.log(`[${this.gameId}] Handling removal of player ${socketId}.`);
        const playerData = this.players.get(socketId);
        if (playerData) {
            // Mark the robot as not alive
            if (playerData.robot) {
                 playerData.robot.isAlive = false;
                 playerData.robot.speed = 0; // Stop movement
                 playerData.robot.targetSpeed = 0;
                 console.log(`[${this.gameId}] Marked robot ${playerData.robot.id} as inactive.`);
            }

            // Have the socket leave the Socket.IO room for this game
            playerData.socket.leave(this.gameId);
            // Remove player data from the active players map for this game
            this.players.delete(socketId);

            // Check if removing this player triggers the game over condition
            // (e.g., if only one player remains)
            this.checkGameOver();
        } else {
             console.warn(`[${this.gameId}] Tried to remove player ${socketId}, but they were not found in the player map.`);
        }
    }

    /**
     * Checks if the game instance has no active players left in its map.
     * Used by GameManager to determine if the instance can be cleaned up.
     * @returns {boolean} True if the player map is empty, false otherwise.
     */
    isEmpty() {
        return this.players.size === 0;
    }

    /**
     * Placeholder for queueing actions received directly from clients.
     * Not used in the current server-side interpreter model.
     * @param {string} socketId - The ID of the player sending the action.
     * @param {object} action - The action object sent by the client.
     */
    queueAction(socketId, action) {
        // Implementation needed only if moving away from fully server-side AI execution
        // (e.g., for client-side prediction / server reconciliation model)
        console.warn(`[${this.gameId}] queueAction called but not implemented for player ${socketId}. Action:`, action);
    }
}

module.exports = GameInstance;