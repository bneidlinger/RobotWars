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
 * Manages game state, robots (with visual loadouts), interpreter, collisions,
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
        this.interpreter = new ServerRobotInterpreter();
        this.collisionSystem = new ServerCollisionSystem(this);
        this.gameLoopInterval = null;
        this.lastTickTime = 0;
        this.explosionsToBroadcast = [];
        this.fireEventsToBroadcast = []; // Will contain { type, x, y, ownerId, direction }
        this.hitEventsToBroadcast = []; // Will contain { type, x, y, targetId }
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

            // Stagger starting positions
            const startX = index % 2 === 0 ? 150 : ARENA_WIDTH - 150;
            const startY = 100 + Math.floor(index / 2) * (ARENA_HEIGHT - 200); // Adjust Y for more players if needed
            const startDir = index % 2 === 0 ? 0 : 180; // Face opponents
            const robotId = socket ? socket.id : `dummy-bot-${this.gameId}`; // Use socket ID or generate dummy ID

            // --- Create ServerRobot instance, passing visuals and name ---
            const robot = new ServerRobot(
                robotId,
                startX, startY, startDir,
                visuals, // Pass the visuals object
                name     // Pass the name
            );

            this.robots.push(robot);

            // --- Store the full playerData (including loadout) and the robot instance ---
            this.players.set(robotId, {
                socket: socket,
                loadout: loadout, // Store the original loadout data
                robot: robot      // Store the created robot instance
            });

            console.log(`[${this.gameId}] Added participant ${name} (${robot.id}), Socket: ${socket ? 'Yes' : 'No'}`);
            if (socket) {
                // Join the game-specific room
                socket.join(this.gameId);
            }
        });
    }

    // --- startGameLoop, stopGameLoop ---
    startGameLoop() {
        console.log(`[${this.gameId}] Starting game loop.`);
        this.lastTickTime = Date.now();
        this.gameEnded = false;
        if (this.gameLoopInterval) clearInterval(this.gameLoopInterval); // Clear any existing interval
        // Use arrow function to maintain 'this' context
        this.gameLoopInterval = setInterval(() => {
            if (this.gameEnded) { // Check if game has ended during the tick
                this.stopGameLoop();
                return;
            }
            const now = Date.now();
            const deltaTime = (now - this.lastTickTime) / 1000.0; // Delta time in seconds
            this.lastTickTime = now;
            this.tick(deltaTime); // Execute the game tick
        }, 1000 / TICK_RATE); // Execute TICK_RATE times per second
    }

    stopGameLoop() {
        console.log(`[${this.gameId}] Stopping game loop.`);
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
    }

    // --- tick ---
    tick(deltaTime) {
        try {
            // Stop processing if the game has already ended
            if (this.gameEnded) return;

            // Clear per-tick broadcast arrays
            this.explosionsToBroadcast = [];
            this.fireEventsToBroadcast = [];
            this.hitEventsToBroadcast = [];

            // 1. Execute Robot AI Code
            // The interpreter's safe API methods might populate fireEventsToBroadcast
            this.interpreter.executeTick(this.robots, this);

            // 2. Update Robot Physics/Movement (including missiles)
            this.robots.forEach(robot => robot.update(deltaTime, ARENA_WIDTH, ARENA_HEIGHT));

            // 3. Check Collisions
            // Collision checks might populate hitEventsToBroadcast and explosionsToBroadcast
            this.collisionSystem.checkAllCollisions();

            // 4. Emit 'robotDestroyed' event for newly destroyed robots
            this.robots.forEach(robot => {
                // Check if robot is destroyed and notification hasn't been sent
                if (robot.state === 'destroyed' && !robot.destructionNotified) {
                    const destructionData = {
                        robotId: robot.id,
                        x: robot.x, y: robot.y, // Location of destruction
                        cause: robot.lastDamageCause || 'unknown'
                    };
                    // Broadcast to game participants and spectators
                    this.io.to(this.gameId).to(this.spectatorRoom).emit('robotDestroyed', destructionData);
                    robot.destructionNotified = true; // Mark as notified
                }
            });

            // 5. Check for Game Over condition
            // This also handles stopping the loop and calling the game over callback
            if (this.checkGameOver()) {
                return; // Exit tick early if game over condition met
            }

            // 6. Broadcast Game State
            // Gather the current state including pending events/explosions
            const gameState = this.getGameState();
            // Broadcast to game participants and spectators
            this.io.to(this.gameId).to(this.spectatorRoom).emit('gameStateUpdate', gameState);

        } catch (error) {
             console.error(`[${this.gameId}] CRITICAL ERROR during tick:`, error);
             this.gameEnded = true; // Stop the game immediately
             this.stopGameLoop();
             // Notify clients of the error
             this.io.to(this.gameId).to(this.spectatorRoom).emit('gameError', { message: `Critical server error in '${this.gameName}'. Game aborted.` });
             // Notify the GameManager
             if (typeof this.gameOverCallback === 'function') {
                 this.gameOverCallback(this.gameId, { winnerId: null, winnerName: 'None', reason: 'Server Error', wasTestGame: this.isTestGame });
             }
        }
    }

    // --- addFireEvent, addHitEvent ---
    /** Stores a fire event to be broadcast in the next game state update. */
    addFireEvent(eventData) {
        // Ensure it has the expected structure (including direction)
        if (eventData?.type === 'fire' && typeof eventData.direction === 'number') {
            this.fireEventsToBroadcast.push(eventData);
        } else {
            console.warn(`[${this.gameId}] Invalid fire event data received:`, eventData);
        }
    }

    /** Stores a hit event to be broadcast in the next game state update. */
    addHitEvent(x, y, targetId) {
        this.hitEventsToBroadcast.push({ type: 'hit', x, y, targetId });
    }

    // --- checkGameOver ---
    checkGameOver() {
        // Don't check if already ended or loop stopped
        if (this.gameEnded || !this.gameLoopInterval) return true; // Return true to indicate it *is* over

        let potentialLoser = null;
        let destructionPending = false; // Is any robot currently in the 'destroyed' state but waiting for visual delay?
        const now = Date.now();

        // Check if any destroyed robot's visual delay has passed
        for (const robot of this.robots) {
            if (robot.state === 'destroyed') {
                if (now >= (robot.destructionTime + DESTRUCTION_VISUAL_DELAY_MS)) {
                    // This robot's delay is over, they are the definitive loser (or one of them)
                    potentialLoser = robot;
                    break; // Found the first loser whose delay expired
                } else {
                    // A robot is destroyed, but we're still waiting
                    destructionPending = true;
                }
            }
        }

        // If a loser's delay just finished, the game ends now
        if (potentialLoser) {
            destructionPending = false; // No longer pending, we have a loser
        } else if (destructionPending) {
            return false; // Game not over yet, wait for visual delay
        }

        // --- Game Over Conditions Check ---
        const activeRobots = this.robots.filter(r => r.state === 'active');
        let isGameOver = false;
        let winner = null; // Stores the full player data object { socket, loadout, robot }
        let loser = null; // Stores the full player data object
        let reason = 'elimination';

        if (potentialLoser) {
             // Game ended because a robot's destruction delay finished
             isGameOver = true;
             loser = this.players.get(potentialLoser.id); // Get full player data for the loser
             // Winner is the other player (assuming 2-player game)
             winner = Array.from(this.players.values()).find(p => p.robot && p.robot.id !== potentialLoser.id);
             reason = `${loser?.loadout?.name || 'A robot'} was destroyed!`; // Use loadout name
        } else if (!destructionPending && activeRobots.length <= 1 && this.robots.length >= 2) {
            // Game ended because only 1 or 0 robots are left active, and no destruction delays are pending
             isGameOver = true;
             if (activeRobots.length === 1) {
                 // One winner left standing
                 winner = this.players.get(activeRobots[0].id);
                 loser = Array.from(this.players.values()).find(p => p.robot && p.robot.id !== activeRobots[0].id);
                 reason = "Last robot standing!";
             } else {
                 // Mutual Destruction (0 active robots left)
                 reason = "Mutual Destruction!";
                 winner = null; // No winner
                 loser = null; // No single loser (both lost)
             }
        }
        // --- End Game Over Conditions Check ---

        // --- Process Game Over ---
        if (isGameOver) {
            this.gameEnded = true; // Mark game as ended
            this.stopGameLoop(); // Stop the simulation

            // Adjust winner/loser determination specifically for Test Games
            if (this.isTestGame) {
                // Find the real player and the dummy bot from the players map
                const realPlayerEntry = Array.from(this.players.values()).find(p => p.socket !== null);
                const botEntry = Array.from(this.players.values()).find(p => p.socket === null);

                if(realPlayerEntry && botEntry){
                    const realPlayer = realPlayerEntry;
                    const botPlayer = botEntry;

                    // Determine winner based on who is still active or who was the potentialLoser
                    if (potentialLoser?.id === realPlayer.robot.id || (activeRobots.length===1 && activeRobots[0].id === botPlayer.robot.id)) {
                        // Real player lost or bot is the only one left
                        winner = botPlayer; loser = realPlayer;
                    } else if (potentialLoser?.id === botPlayer.robot.id || (activeRobots.length===1 && activeRobots[0].id === realPlayer.robot.id)) {
                         // Bot lost or real player is the only one left
                        winner = realPlayer; loser = botPlayer;
                    } else {
                        // Mutual destruction in test game
                        winner = null; loser = null;
                    }

                    // Update reason using loadout names for test game clarity
                    if (winner && loser) reason = `${winner.loadout.name} defeated ${loser.loadout.name}!`;
                    else if (winner) reason = `${winner.loadout.name} is the last one standing!`;
                    else reason = "Mutual Destruction in test game!";

                } else {
                    // Should not happen if initialized correctly
                    reason = "Test game ended unexpectedly (participant data missing)"; winner=null; loser=null;
                }
            }

            // --- Prepare final winner data object ---
            const finalWinnerData = {
                gameId: this.gameId,
                winnerId: winner ? winner.robot.id : null, // ID of the winning robot
                winnerName: winner ? winner.loadout.name : 'None', // Name from the winner's loadout
                reason: reason,
                wasTestGame: this.isTestGame // Include flag indicating if it was a test game
            };

            console.log(`[${this.gameId}] Final Game Over. Winner: ${finalWinnerData.winnerName}. Reason: ${reason}`);

            // Notify participants and spectators
            this.io.to(this.gameId).emit('gameOver', finalWinnerData);
            this.io.to(this.spectatorRoom).emit('spectateGameOver', finalWinnerData);

            // Trigger the callback to notify GameManager
            if (typeof this.gameOverCallback === 'function') {
                this.gameOverCallback(this.gameId, finalWinnerData);
            }
            return true; // Indicate game is over
        }
        // --- End Process Game Over ---

        return false; // Game is not over yet
    }

    // --- createExplosion ---
    /** Adds an explosion effect to be broadcast in the next state update. */
    createExplosion(x, y, size) {
        // Use a more unique ID combining time and random hex
        const explosionId = `e-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
        this.explosionsToBroadcast.push({ id: explosionId, x, y, size });
    }

    /** Gathers the current game state including robot visuals and pending events */
    getGameState() {
        const activeMissiles = [];
        // Collect all missiles from all robots
        this.robots.forEach(robot => {
            // Ensure robot.missiles is an array before spreading
            if(Array.isArray(robot.missiles)) {
                activeMissiles.push(...robot.missiles);
            }
        });

        return {
            gameId: this.gameId,
            gameName: this.gameName,
            robots: this.robots.map(r => ({
                id: r.id,
                x: r.x, y: r.y,
                direction: r.direction, // Robot body direction
                damage: r.damage,
                isAlive: r.isAlive,
                name: r.name, // Robot's display name
                visuals: r.visuals, // Visual configuration object
            })),
            missiles: activeMissiles.map(m => ({
                id: m.id,
                x: m.x, y: m.y,
                radius: m.radius,
                ownerId: m.ownerId,
                direction: m.direction // Missile travel direction <<< ENSURE THIS IS PRESENT
            })),
            // Include the lists of events to be processed by the client renderer this frame
            explosions: this.explosionsToBroadcast,
            fireEvents: this.fireEventsToBroadcast, // <<< Includes direction now
            hitEvents: this.hitEventsToBroadcast,
            timestamp: Date.now()
        };
    }

    // --- performScan ---
    /**
     * Performs a scan for a robot, returning the closest active opponent found within the arc.
     * @param {ServerRobot} scanningRobot - The robot performing the scan.
     * @param {number} direction - The center direction of the scan arc (degrees).
     * @param {number} resolution - The width of the scan arc (degrees).
     * @returns {object|null} Info about the closest target ({ distance, direction, id, name }) or null if none found.
     */
    performScan(scanningRobot, direction, resolution) {
        // Cannot scan if not active
        if (scanningRobot.state !== 'active') return null;

        // Validate inputs
        const scanDirection = ((Number(direction) % 360) + 360) % 360;
        const halfResolution = Math.max(1, Number(resolution) / 2); // Ensure at least 1 degree half-width
        const scanRange = 800; // Maximum scan distance

        // Calculate scan arc boundaries
        let startAngleDeg = (scanDirection - halfResolution + 360) % 360;
        let endAngleDeg = (scanDirection + halfResolution + 360) % 360;

        // Handle arc wrapping around 0/360 degrees
        const wrapsAround = startAngleDeg > endAngleDeg;

        let closestTargetInfo = null;
        let closestDistanceSq = scanRange * scanRange; // Compare squared distances initially

        // Iterate through all other robots in the game
        this.robots.forEach(targetRobot => {
            // Skip self and non-active robots
            if (scanningRobot.id === targetRobot.id || targetRobot.state !== 'active') return;

            const dx = targetRobot.x - scanningRobot.x;
            const dy = targetRobot.y - scanningRobot.y; // Use standard math coordinates for angle calc
            const distanceSq = dx * dx + dy * dy;

            // Skip if target is further than the current closest or outside scan range
            if (distanceSq >= closestDistanceSq) return;

            // Calculate angle from scanning robot to target robot
            // Use atan2(y, x) for correct quadrant; negate dy because positive Y is down in game coords
            let angleToTargetDeg = Math.atan2(-dy, dx) * 180 / Math.PI;
            angleToTargetDeg = (angleToTargetDeg + 360) % 360; // Normalize to 0-360

            // Check if the target angle falls within the scan arc
            let inArc;
            if (wrapsAround) {
                // Arc wraps around 0/360 (e.g., 350 to 10)
                inArc = (angleToTargetDeg >= startAngleDeg || angleToTargetDeg <= endAngleDeg);
            } else {
                // Normal arc (e.g., 80 to 100)
                inArc = (angleToTargetDeg >= startAngleDeg && angleToTargetDeg <= endAngleDeg);
            }

            // If target is within the arc and closer than previous closest
            if (inArc) {
                closestDistanceSq = distanceSq; // Update closest distance squared
                // Store target info (calculate sqrt distance only for the final result)
                closestTargetInfo = {
                    distance: Math.sqrt(distanceSq),
                    direction: angleToTargetDeg,
                    id: targetRobot.id,
                    name: targetRobot.name // Include target name
                };
            }
        });

        return closestTargetInfo; // Return null or the closest target's info
    }


    // --- triggerSelfDestruct ---
    /** Marks a specific robot for destruction. */
    triggerSelfDestruct(robotId) {
         const playerData = this.players.get(robotId);
         // Check if player data and robot exist, and robot is currently active
         if (playerData?.robot?.state === 'active') {
             const robot = playerData.robot;
             console.log(`[${this.gameId}] Triggering self-destruct for ${robot.name} (${robot.id}).`);
             // Apply lethal damage
             const result = robot.takeDamage(1000, 'selfDestruct'); // Cause massive damage
             // Create a visual explosion effect
             this.createExplosion(robot.x, robot.y, 5); // Use max power explosion visual
             console.log(`[${this.gameId}] Self-destruct applied. Destroyed: ${result.destroyed}`);
         } else {
             console.warn(`[${this.gameId}] Self-destruct failed for ${robotId}: Not found or not active.`);
         }
    }

    // --- removePlayer ---
    /** Handles removing a player (e.g., on disconnect) from the game instance. */
    removePlayer(robotId) {
        const playerData = this.players.get(robotId);
        // Use the robot's name from the loadout if available
        const playerName = playerData?.loadout?.name || robotId.substring(0,8)+'...';
        console.log(`[${this.gameId}] Handling removal of participant ${playerName} (${robotId}).`);

        // Mark the robot as destroyed immediately if it exists
        if (playerData?.robot) {
             playerData.robot.state = 'destroyed';
             if (!playerData.robot.destructionTime) {
                // Set destruction time if not already set (e.g., disconnected before being hit)
                playerData.robot.destructionTime = Date.now();
             }
             playerData.robot.damage = 100; // Ensure damage is maxed
             playerData.robot.speed = 0; playerData.robot.targetSpeed = 0; // Stop movement
             console.log(`[${this.gameId}] Marked robot for ${playerName} as destroyed due to removal.`);
        }

        // Remove the player entry from the game's map
        this.players.delete(robotId);

        // Note: The game over check in the main tick loop will handle ending the game
        // if this removal results in only one or zero active players remaining.
    }

    // --- isEmpty ---
    /** Checks if the game has any connected human players left. */
    isEmpty() {
        // Check if all entries in the players map have a null socket
        return Array.from(this.players.values()).every(p => p.socket === null);
    }

    // --- cleanup ---
    /** Performs cleanup tasks when the game instance is no longer needed. */
    cleanup() {
        console.log(`[${this.gameId}] Cleaning up instance.`);
        // Make all connected sockets leave the game-specific rooms
        this.io.socketsLeave(this.spectatorRoom);
        this.io.socketsLeave(this.gameId);
        // Stop the interpreter if it's running
        if(this.interpreter) {
            this.interpreter.stop();
        }
        // Clear internal references (helps garbage collection)
        this.players.clear();
        this.robots = [];
        this.interpreter = null;
        this.collisionSystem = null;
    }

} // End GameInstance

module.exports = GameInstance;