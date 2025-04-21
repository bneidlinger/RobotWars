// server/server-interpreter.js
const vm = require('vm');

// EXECUTION_TIMEOUT is not currently used per-tick, only during init.
// const EXECUTION_TIMEOUT = 50;

/**
 * Executes robot AI code safely within a sandboxed environment on the server.
 * Manages the execution context, provides a controlled API, and directly triggers
 * events (like robotLog, fire) on the GameInstance via safe API methods. // <-- Updated description
 */
class ServerRobotInterpreter {
    constructor() {
        this.robotContexts = {}; // Stores the unique sandboxed context for each robot
        this.robotTickFunctions = {}; // Stores the executable function compiled from robot code
        this.currentRobotId = null; // Temporarily holds the ID of the robot currently executing
        this.currentGameInstance = null; // Temporarily holds a reference to the GameInstance
    }

    initialize(robots, playersDataMap) {
        console.log("[Interpreter] Initializing robot interpreters...");
        robots.forEach(robot => {
            const playerData = playersDataMap.get(robot.id);
            const playerSocket = playerData ? playerData.socket : null; // Needed for init error reporting

            if (!playerData || typeof playerData.code !== 'string' || playerData.code.trim() === '') {
                console.error(`[Interpreter] No valid code for robot ${robot.id}. Disabling.`);
                this.robotTickFunctions[robot.id] = null;
                this.robotContexts[robot.id] = null;
                return;
            }

            const sandbox = {
                state: {},
                robot: { // API available to the robot code
                    drive: (direction, speed) => this.safeDrive(robot.id, direction, speed),
                    scan: (direction, resolution) => this.safeScan(robot.id, direction, resolution),
                    fire: (direction, power) => this.safeFire(robot.id, direction, power),
                    damage: () => this.safeDamage(robot.id),
                    getX: () => this.safeGetX(robot.id),
                    getY: () => this.safeGetY(robot.id),
                    getDirection: () => this.safeGetDirection(robot.id),
                },
                console: {
                    log: (...args) => {
                        // Log server-side (optional)
                        // console.log(`[Robot ${robot.id} Log]`, ...args);
                        const messageString = args.map(arg => {
                            try {
                                // Basic string conversion, handle objects with JSON
                                return (typeof arg === 'object' && arg !== null) ? JSON.stringify(arg) : String(arg);
                            } catch (e) { return '[Unloggable Object]'; } // Handle circular refs etc.
                        }).join(' ');

                        // --- START OF CHANGE: Emit to game room including robotId ---
                        // Ensure game instance context is available (should be during execution)
                        // Note: this.currentGameInstance is set during executeTick
                        if (this.currentGameInstance && this.currentGameInstance.io && this.currentGameInstance.gameId) {
                            this.currentGameInstance.io.to(this.currentGameInstance.gameId).emit('robotLog', {
                                robotId: robot.id, // Include the ID of the robot that logged
                                message: messageString
                            });
                        } else {
                            // Fallback or error if game instance isn't set (shouldn't normally happen during tick)
                            // console.warn(`[Interpreter] Cannot emit robotLog for ${robot.id}: No currentGameInstance context during console.log.`);
                            // If there's a socket, maybe still send to owner as fallback?
                            if (playerSocket?.connected) {
                                playerSocket.emit('robotLog', {
                                    robotId: robot.id,
                                    message: `(Context Issue) ${messageString}`
                                });
                             }
                        }
                        // --- END OF CHANGE ---
                    }
                },
                // Limited Math object (can be expanded if needed)
                Math: {
                    abs: Math.abs, acos: Math.acos, asin: Math.asin, atan: Math.atan, atan2: Math.atan2,
                    ceil: Math.ceil, cos: Math.cos, floor: Math.floor, max: Math.max, min: Math.min,
                    pow: Math.pow, random: Math.random, round: Math.round, sin: Math.sin, sqrt: Math.sqrt,
                    tan: Math.tan, PI: Math.PI
                },
                // Explicitly allow certain safe Number properties/methods if needed
                Number: {
                    isFinite: Number.isFinite, isNaN: Number.isNaN, parseFloat: Number.parseFloat, parseInt: Number.parseInt
                },
                // Disable potentially harmful globals explicitly
                setTimeout: undefined, setInterval: undefined, setImmediate: undefined,
                clearTimeout: undefined, clearInterval: undefined, clearImmediate: undefined,
                require: undefined, process: undefined, global: undefined, globalThis: undefined,
                Buffer: undefined, // etc.
            };

            // Create the context using the sandboxed environment
            this.robotContexts[robot.id] = vm.createContext(sandbox);

            try {
                // Wrap user code in a function for better isolation and execution control
                const wrappedCode = `(function() { "use strict";\n${playerData.code}\n});`;
                // Compile the script
                const script = new vm.Script(wrappedCode, {
                    filename: `robot_${robot.id}.js`, // Useful for error reporting
                    displayErrors: true
                });

                // Run the script once to get the function it returns
                // Timeout during initialization prevents infinite loops in top-level code
                this.robotTickFunctions[robot.id] = script.runInContext(this.robotContexts[robot.id], { timeout: 500 }); // 500ms timeout for init

                // Check if the result is actually a function
                if (typeof this.robotTickFunctions[robot.id] !== 'function') {
                     throw new Error("Compiled code did not produce a function. Ensure your code is wrapped correctly or is just statements.");
                }
                console.log(`[Interpreter] Compiled function for robot ${robot.id}`);

            } catch (error) {
                console.error(`[Interpreter] Error initializing/compiling function for robot ${robot.id}:`, error.message);
                // Report initialization error back to the specific player
                if (playerSocket?.connected) {
                    playerSocket.emit('codeError', { robotId: robot.id, message: `Initialization Error: ${error.message}` });
                }
                this.robotTickFunctions[robot.id] = null; // Disable this robot
                this.robotContexts[robot.id] = null;
            }
        });
        console.log("[Interpreter] Initialization complete.");
    }

    /**
     * Executes one tick of AI code for all active robots.
     * Safe API methods called within the robot code might trigger events on the GameInstance.
     * @param {ServerRobot[]} robots - Array of all robot instances in the game.
     * @param {GameInstance} gameInstance - Reference to the current game instance.
     * @returns {Array} An empty array (events are now triggered via side effects in safe API calls).
     */
    executeTick(robots, gameInstance) {
        this.currentGameInstance = gameInstance; // Provide context for safe methods
        const results = []; // Keep array structure, though not used for sound events currently

        robots.forEach(robot => {
            // Only execute if robot is active and has a valid compiled function/context
            if (robot.state === 'active' && this.robotTickFunctions[robot.id] && this.robotContexts[robot.id]) {
                this.currentRobotId = robot.id; // Set context for safe API calls
                const tickFunction = this.robotTickFunctions[robot.id];
                const context = this.robotContexts[robot.id];
                const playerData = gameInstance.players.get(robot.id); // Find player data (including socket)
                const playerSocket = playerData ? playerData.socket : null;

                try {
                    // Execute the robot's compiled code function for this tick
                    // No per-tick timeout applied here to avoid complexity, relies on server stability
                    // A more robust solution might involve worker threads or limits on computation steps.
                    tickFunction.call(context.robot); // Pass the 'robot' API object as 'this' inside the function

                    // Event generation (like 'fire' or 'log') happens *inside* the safe API calls triggered by tickFunction

                } catch (error) {
                    console.error(`[Interpreter] Runtime error for robot ${robot.id}:`, error.message, error.stack);
                    // Report runtime error back to the specific player
                    if (playerSocket?.connected) {
                        playerSocket.emit('codeError', { robotId: robot.id, message: `Runtime Error: ${error.message}` });
                    }
                    // Optional: Disable robot on repeated/critical errors?
                    // this.robotTickFunctions[robot.id] = null; // Consider disabling the robot
                } finally {
                    this.currentRobotId = null; // Clear context after execution attempt
                }
            }
        });

        this.currentGameInstance = null; // Clear game context after all robots run
        return results; // Return empty array
    }

    // --- Safe API Methods ---
    // These methods are called *from* the sandboxed robot code via the 'robot' object.
    // They ensure the action is performed by the correct robot and interact with the GameInstance.

    /** Safely retrieves the ServerRobot instance for the currently executing robot. @private */
    getCurrentRobot() {
        // Uses the temporary context variables set during executeTick
        if (!this.currentRobotId || !this.currentGameInstance) return null;
        // Find the robot object within the game instance's list
        return this.currentGameInstance.robots.find(r => r.id === this.currentRobotId);
    }

    /** Safely delegates drive command to the correct robot instance. */
    safeDrive(robotId, direction, speed) {
        // Ensure the call is from the currently executing robot
        if (robotId !== this.currentRobotId) return;
        const robot = this.getCurrentRobot();
        // Ensure robot exists, is active, and parameters are valid numbers
        if (robot?.state === 'active' && typeof direction === 'number' && typeof speed === 'number') {
            robot.drive(direction, speed);
        }
    }

    /** Safely delegates scan command to the GameInstance. */
    safeScan(robotId, direction, resolution) {
        if (robotId !== this.currentRobotId || !this.currentGameInstance) return null;
        const robot = this.getCurrentRobot();
        // Ensure robot exists, is active, and parameters are valid numbers
        if (robot?.state === 'active' && typeof direction === 'number') {
            // Use default resolution if not provided or invalid
            const res = (typeof resolution === 'number' && resolution > 0) ? resolution : 10;
            // Delegate scan logic to the GameInstance
            return this.currentGameInstance.performScan(robot, direction, res);
        }
        return null; // Return null if scan cannot be performed
    }

    /** Safely delegates fire command AND triggers fire event on GameInstance. */
    safeFire(robotId, direction, power) {
        // Check execution context
        if (robotId !== this.currentRobotId) return false;
        const robot = this.getCurrentRobot();

        // Also check robot state, game instance availability, and direction validity
        if (robot?.state === 'active' && this.currentGameInstance && typeof direction === 'number') {
            // Delegate the actual firing logic (cooldown check, missile creation) to the robot instance
            const fireResult = robot.fire(direction, power); // Returns { success: boolean, eventData?: object }

            // If the robot's fire method was successful (e.g., cooldown allowed),
            // trigger the corresponding event on the GameInstance using the provided eventData.
            if (fireResult.success && fireResult.eventData && typeof this.currentGameInstance.addFireEvent === 'function') {
                this.currentGameInstance.addFireEvent(fireResult.eventData);
            }

            // Return the success status back to the robot's code
            return fireResult.success;
        }
        return false; // Cannot fire (e.g., robot destroyed, invalid params)
    }


    /** Safely retrieves the current damage of the robot. */
    safeDamage(robotId) {
        if (robotId !== this.currentRobotId) return 100; // Return max damage if called incorrectly
        const robot = this.getCurrentRobot();
        return robot ? robot.damage : 100; // Return current damage or max if robot not found
    }

    /** Safely retrieves the robot's X coordinate. */
    safeGetX(robotId) {
        if (robotId !== this.currentRobotId) return null;
        const robot = this.getCurrentRobot();
        return robot ? robot.x : null;
    }

    /** Safely retrieves the robot's Y coordinate. */
    safeGetY(robotId) {
        if (robotId !== this.currentRobotId) return null;
        const robot = this.getCurrentRobot();
        return robot ? robot.y : null;
    }

    /** Safely retrieves the robot's current direction (degrees). */
    safeGetDirection(robotId) {
        if (robotId !== this.currentRobotId) return null;
        const robot = this.getCurrentRobot();
        return robot ? robot.direction : null;
    }

    /** Cleans up interpreter state (contexts, functions) when the game ends. */
    stop() {
        console.log("[Interpreter] Stopping and cleaning up contexts/functions.");
        this.robotContexts = {};
        this.robotTickFunctions = {};
        this.currentRobotId = null;
        this.currentGameInstance = null;
    }
}

module.exports = ServerRobotInterpreter;