// server/game-instance.js
const ServerRobot = require('./server-robot');
const ServerRobotInterpreter = require('./server-interpreter'); // Corrected require name
const ServerCollisionSystem = require('./server-collision'); // Handles collisions

// --- Game Simulation Constants ---
const TICK_RATE = 30; // Updates per second
const ARENA_WIDTH = 900; // Match canvas size
const ARENA_HEIGHT = 900; // Match canvas size

/**
 * Represents a single active game match on the server.
 * Manages the game state, robots (including potential AI dummies),
 * interpreter, collisions, game loop,
 * broadcasts state to players and spectators, handles self-destruct requests, // <-- Added self-destruct
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
     */
    constructor(gameId, io, playersData, gameOverCallback, gameName = '') {
        this.gameId = gameId;
        this.io = io; // Socket.IO server instance for broadcasting
        // Map: socket.id (for real players) or dummy ID -> { socket, robot, code, appearance, name }
        this.players = new Map();
        this.robots = []; // Array of ServerRobot instances in this game
        this.playerNames = new Map(); // Map: robot.id -> name (for easier lookup during logs/events)
        this.interpreter = new ServerRobotInterpreter(); // Handles robot code execution
        this.collisionSystem = new ServerCollisionSystem(this); // Handles collisions
        this.gameLoopInterval = null; // Stores the setInterval ID for the game loop
        this.lastTickTime = 0; // Timestamp of the last tick
        // Stores explosion data generated this tick to send to clients
        this.explosionsToBroadcast = [];
        // Store the callback function provided by GameManager
        this.gameOverCallback = gameOverCallback;
        // Store game name
        this.gameName = gameName || `Game ${gameId}`; // Use provided name or generate default
        // Define the spectator room name for this instance
        this.spectatorRoom = `spectator-${this.gameId}`;


        console.log(`[${this.gameId} - '${this.gameName}'] Initializing Game Instance...`);

        // Initialize players and their robots based on received data
        playersData.forEach((playerData, index) => {
            // Assign starting positions (simple alternating sides)
            const startX = index % 2 === 0 ? 150 : ARENA_WIDTH - 150; // Spread out a bit more
            const startY = 100 + Math.floor(index / 2) * (ARENA_HEIGHT - 200);
            const startDir = index % 2 === 0 ? 0 : 180;

            // Determine the ID: socket ID for real players, dummy ID for AI
            // Use gameId in dummy ID to ensure uniqueness across multiple test games
            const robotId = playerData.socket ? playerData.socket.id : `dummy-bot-${this.gameId}`;

            // Create the ServerRobot instance, passing appearance
            const robot = new ServerRobot(
                robotId, // Use determined ID
                startX, startY, startDir,
                playerData.appearance // Pass the appearance identifier
            );
            // Assign the name directly to the robot instance
            robot.name = playerData.name;
            this.robots.push(robot);

            // Store player data associated with the robot, using the robot's ID as the key
            this.players.set(robotId, {
                socket: playerData.socket, // Can be null
                robot: robot,
                code: playerData.code,
                appearance: playerData.appearance,
                name: playerData.name // Store name here as well
            });
            // Store name in the separate map for quick lookups using robot ID
            this.playerNames.set(robot.id, playerData.name);

            console.log(`[${this.gameId} - '${this.gameName}'] Added participant ${playerData.name} (${robot.id}) (Appearance: ${playerData.appearance}) with Robot ${robot.id}. Socket: ${playerData.socket ? 'Yes' : 'No'}`);

            // Add the player's socket to the dedicated Socket.IO room for this game
            // Only join room if it's a real player with a socket
            if (playerData.socket) {
                playerData.socket.join(this.gameId);
                console.log(`[${this.gameId} - '${this.gameName}'] Player ${playerData.name} joined Socket.IO room.`);
            }
        });

        // Initialize the interpreter AFTER all robots and player data are set up
        // Pass the list of robots and the full players map (which includes null sockets for dummies)
        this.interpreter.initialize(this.robots, this.players); // Pass the map containing potentially null sockets

        console.log(`[${this.gameId} - '${this.gameName}'] Game Instance Initialization complete.`);
    }

    /**
     * Starts the main game loop interval.
     */
    startGameLoop() {
        console.log(`[${this.gameId} - '${this.gameName}'] Starting game loop (Tick Rate: ${TICK_RATE}/s).`);
        this.lastTickTime = Date.now();

        if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);

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
        console.log(`[${this.gameId} - '${this.gameName}'] Stopping game loop.`);
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
        this.interpreter.stop(); // Clean up interpreter state
        // Note: Spectator room cleanup will happen in GameManager when the instance is removed
    }

    /**
     * Executes a single tick of the game simulation: AI, movement, collisions, game over check, state broadcast.
     * @param {number} deltaTime - The time elapsed since the last tick, in seconds.
     */
    tick(deltaTime) {
        try {
            // --- Start of Tick ---
            this.explosionsToBroadcast = []; // Clear transient data from the previous tick

            // 1. Execute Robot AI Code (Interpreter handles both real and dummy AI)
            this.interpreter.executeTick(this.robots, this);

            // 2. Update Robot and Missile Physics/Movement
            this.robots.forEach(robot => {
                // Pass arena dimensions to robot update
                robot.update(deltaTime, ARENA_WIDTH, ARENA_HEIGHT);
            });

            // 3. Check for and Resolve Collisions
            this.collisionSystem.checkAllCollisions(); // Needs access to ARENA dimensions if boundary checks move there

            // 4. Check for Game Over Condition
            if (this.checkGameOver()) {
                // checkGameOver calls stopGameLoop and notifies clients/GameManager if true
                return; // Exit tick processing early as the game has ended
            }

            // --- State Broadcasting ---
            // 5. Gather the current state of all entities for clients.
            const gameState = this.getGameState();

            // 6. Broadcast the state to ALL clients in this game's room AND the spectator room.
            // For test games, gameId room only contains the one real player.
            this.io.to(this.gameId).to(this.spectatorRoom).emit('gameStateUpdate', gameState);

        } catch (error) {
             console.error(`[${this.gameId} - '${this.gameName}'] CRITICAL ERROR during tick:`, error);
             // Consider stopping the game or notifying players
             this.stopGameLoop(); // Stop loop on critical error
             // Notify players and spectators of the error
             this.io.to(this.gameId).to(this.spectatorRoom).emit('gameError', { message: `Critical server error during game tick for '${this.gameName}'. Game aborted.` });
             // Manually trigger game over callback with no winner due to error
             if (typeof this.gameOverCallback === 'function') {
                  // Determine if it was a test game to pass flag back
                  const wasTest = this.gameName.startsWith("Test Arena");
                 this.gameOverCallback(this.gameId, { winnerId: null, winnerName: 'None', reason: 'Server Error', wasTestGame: wasTest });
             }
        }
    }

    /**
     * Checks if the game has reached an end condition (e.g., only one robot left alive).
     * If the game is over, it stops the loop, notifies clients (players AND spectators),
     * and calls the GameManager's game over callback.
     * @returns {boolean} True if the game is over, false otherwise.
     */
    checkGameOver() {
        // Only proceed if the game loop is actually running
        // This prevents multiple gameOver events if checkGameOver is called after stopGameLoop
        if (!this.gameLoopInterval) {
            return true; // Consider game over if loop isn't running
        }

        // Count how many robots are still marked as alive
        const aliveRobots = this.robots.filter(r => r.isAlive);

        // Game ends if 1 or 0 robots are left alive (and we started with at least 2 robots).
        if (aliveRobots.length <= 1 && this.robots.length >= 2) {
            const winnerRobot = aliveRobots[0]; // Could be undefined if 0 left (draw/mutual destruction)

            // Prepare winner data object
            let winnerData = { // Use let so we can add wasTestGame later if needed
                gameId: this.gameId, // Add gameId for context on client/server
                winnerId: winnerRobot ? winnerRobot.id : null,
                winnerName: winnerRobot ? winnerRobot.name : 'None', // Get name from robot instance
                reason: winnerRobot ? "Last robot standing!" : "Mutual Destruction!"
            };

            console.log(`[${this.gameId} - '${this.gameName}'] Game Over detected. Reason: ${winnerData.reason}. Winner: ${winnerData.winnerName} (${winnerData.winnerId || 'N/A'})`);

            // --- STOP GAME LOOP FIRST ---
            // Stop the simulation loop for this game instance BEFORE sending events.
            this.stopGameLoop();
            // --- END STOP GAME LOOP ---


            // Identify the real player socket ID in this game (the one that's not null)
            const realPlayerEntry = Array.from(this.players.entries()).find(([id, data]) => data.socket !== null);
            const realPlayerSocketId = realPlayerEntry ? realPlayerEntry[0] : null;

            // Notify players *in the game room* about the game end
            // If it's a test game, target the specific real player socket ID, otherwise broadcast to room
            const target = realPlayerSocketId || this.gameId;
            console.log(`[${this.gameId} - '${this.gameName}'] Emitting gameOver to target: ${target}`);
            this.io.to(target).emit('gameOver', winnerData); // GameManager callback adds wasTestGame flag before passing to client

            // Notify spectators *in the spectator room* about the game end (if any exist)
            this.io.to(this.spectatorRoom).emit('spectateGameOver', winnerData);
            console.log(`[${this.gameId} - '${this.gameName}'] Notified spectator room ${this.spectatorRoom} of game over.`);


            // Call the GameManager callback to handle lobby events etc.
            // Pass gameId along with winnerData for context in GameManager
            // The callback *must* add the wasTestGame flag if appropriate
            if (typeof this.gameOverCallback === 'function') {
                this.gameOverCallback(this.gameId, winnerData); // Pass gameId now
            } else {
                console.warn(`[${this.gameId}] gameOverCallback is not a function!`);
            }

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
     * Gathers the current state of the game (robots, missiles, effects)
     * into a serializable object suitable for broadcasting to clients via Socket.IO.
     * Includes the gameName.
     * @returns {object} The current game state snapshot.
     */
    getGameState() {
        // Collect all active missiles from all robots' lists
        const activeMissiles = [];
        this.robots.forEach(robot => {
            // Keep collecting missiles even if robot just died, until they hit/expire
            activeMissiles.push(...robot.missiles);
        });

        // Construct the state object
        const state = {
            gameId: this.gameId,
            gameName: this.gameName, // Include game name in state updates
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
            // Map missile instances to plain data objects
            missiles: activeMissiles.map(missile => ({
                id: missile.id,
                x: missile.x,
                y: missile.y,
                radius: missile.radius,
                ownerId: missile.ownerId // Include owner ID
            })),
            // Include any explosions triggered during this tick
            explosions: this.explosionsToBroadcast,
            timestamp: Date.now() // Include a server timestamp
        };

        return state;
    }

    /**
     * Performs a scan operation for a given robot, finding the nearest opponent within an arc.
     * Called by the interpreter's safeScan method.
     * @param {ServerRobot} scanningRobot - The robot performing the scan.
     * @param {number} direction - The center direction of the scan arc (degrees, 0=East, 90=North).
     * @param {number} resolution - The width of the scan arc (degrees).
     * @returns {object | null} An object with { distance, direction, id, name } of the closest detected robot, or null if none found.
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

        let closestTargetInfo = null; // Stores { distance, direction, id, name }
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
            if (distanceSq >= closestDistanceSq || distanceSq > scanRange * scanRange) {
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
                    id: targetRobot.id, // Include the ID of the detected robot
                    name: targetRobot.name // Include the Name of the detected robot
                };
            }
        });

        return closestTargetInfo; // Return data for the closest robot, or null if none found
    }

    /**
     * Triggers the self-destruction sequence for a specific robot.
     * Marks the robot as dead, applies max damage, creates an explosion,
     * and checks for game over.
     * @param {string} robotId - The ID of the robot to self-destruct (should be a real player's socket ID).
     */
    triggerSelfDestruct(robotId) {
         const playerData = this.players.get(robotId);

         if (playerData && playerData.robot && playerData.robot.isAlive) {
             const robot = playerData.robot;
             console.log(`[${this.gameId} - '${this.gameName}'] Triggering self-destruct for robot ${robot.name} (${robot.id}).`);

             // Force death
             robot.takeDamage(100); // This sets isAlive = false and damage = 100

             // Create a big explosion
             this.createExplosion(robot.x, robot.y, 5); // Size 5 explosion

             // Check game over condition immediately after destruction
             // This will stop the loop and trigger the callback if necessary
             this.checkGameOver();
         } else {
             console.warn(`[${this.gameId} - '${this.gameName}'] Could not trigger self-destruct for ${robotId}. Robot not found, already dead, or invalid ID.`);
         }
    }

    /**
     * Removes a player (real or dummy) and marks their robot as inactive upon disconnection or game end.
     * Called by the GameManager.
     * @param {string} robotId - The ID of the robot whose participant is being removed.
     */
    removePlayer(robotId) {
        // Use the playerNames map for logging
        const playerName = this.playerNames.get(robotId) || robotId.substring(0,8)+'...';
        console.log(`[${this.gameId} - '${this.gameName}'] Handling removal of participant ${playerName} (${robotId}).`);

        const playerData = this.players.get(robotId);
        if (playerData) {
            // Mark the robot as inactive
            if (playerData.robot) {
                 playerData.robot.isAlive = false;
                 playerData.robot.damage = 100; // Ensure damage reflects death state
                 playerData.robot.speed = 0; // Stop movement
                 playerData.robot.targetSpeed = 0;
                 console.log(`[${this.gameId} - '${this.gameName}'] Marked robot for ${playerName} as inactive.`);
            }

            // Socket leaving room happens automatically on disconnect for real players
            // Remove player data from the active players map for this game
            this.players.delete(robotId);
            // Remove from name map
            this.playerNames.delete(robotId);

        } else {
             console.warn(`[${this.gameId} - '${this.gameName}'] Tried to remove participant ${robotId}, but they were not found in the player map.`);
        }
    }

    /**
     * Checks if the game instance has no *real* players left in its map.
     * A game with only a dummy bot (null socket) is considered empty for cleanup.
     * Used by GameManager to determine if the instance can be cleaned up.
     * @returns {boolean} True if no real players remain, false otherwise.
     */
    isEmpty() {
        // A test game is considered "empty" for cleanup purposes
        // if the *only* entry left has a null socket (the dummy bot),
        // or if the map is completely empty.
        return this.players.size === 0 || Array.from(this.players.values()).every(p => p.socket === null);
    }

    // Placeholder for queueAction - remains unchanged
    queueAction(socketId, action) {
        const playerName = this.playerNames.get(socketId) || socketId;
        console.warn(`[${this.gameId}] queueAction called but not implemented for player ${playerName}. Action:`, action);
    }

    // --- New method for cleanup ---
    /**
     * Cleans up resources associated with this game instance, specifically the spectator room.
     * Called by GameManager before deleting the instance.
     */
    cleanup() {
        console.log(`[${this.gameId} - '${this.gameName}'] Cleaning up instance. Making sockets leave spectator room: ${this.spectatorRoom}`);
        // Force any remaining sockets out of the spectator room
        // This helps ensure spectators disconnected uncleanly are removed from the room state
        this.io.socketsLeave(this.spectatorRoom);
        // Also force any remaining real players out of the game room (should be redundant)
        this.io.socketsLeave(this.gameId);
    }

} // End of GameInstance class definition

module.exports = GameInstance;
