// server/server-interpreter.js
const vm = require('vm'); // Use Node.js VM module for better sandboxing

// Maximum execution time allowed for the initial compilation/run *if* enforced per call later
const EXECUTION_TIMEOUT = 50; // Milliseconds. NOTE: Timeout currently only applies during initialization.

/**
 * Executes robot AI code safely within a sandboxed environment on the server.
 * Manages the execution context and provides a controlled API for robots.
 * This version compiles the code into a function during initialization for better scoping.
 */
class ServerRobotInterpreter {
    constructor() {
        // Stores the unique sandboxed context for each robot (persists between ticks)
        this.robotContexts = {};
        // Stores the actual executable function compiled from the robot's code
        this.robotTickFunctions = {};
        // Temporarily holds the ID of the robot currently executing code
        this.currentRobotId = null;
        // Temporarily holds a reference to the GameInstance for context during execution
        this.currentGameInstance = null;
    }

    /**
     * Initializes the interpreter for a set of robots.
     * Compiles the code for each robot into a function and creates its sandboxed execution context.
     * @param {ServerRobot[]} robots - An array of ServerRobot instances.
     * @param {Map<string, {socket: SocketIO.Socket, robot: ServerRobot, code: string}>} playersDataMap - Map from robot ID (socket.id) to player data.
     */
    initialize(robots, playersDataMap) {
        console.log("[Interpreter] Initializing robot interpreters (Function Mode)...");

        robots.forEach(robot => {
            const playerData = playersDataMap.get(robot.id);
            const playerSocket = playerData ? playerData.socket : null; // Get socket reference

            // Ensure we have player data and valid code for this robot
            if (!playerData || typeof playerData.code !== 'string' || playerData.code.trim() === '') {
                console.error(`[Interpreter] No player data or valid code found for robot ${robot.id}. Robot will be disabled.`);
                this.robotTickFunctions[robot.id] = null; // Mark as disabled
                this.robotContexts[robot.id] = null;
                return;
            }

            // --- Create the Sandboxed Environment (Context) ---
            // Defines everything the robot's code can access.
            const sandbox = {
                // Persistent state object (accessible as 'state' or 'this.state' inside function)
                state: {},

                // Safe API object (accessible as 'robot' or 'this.robot')
                robot: {
                    drive: (direction, speed) => this.safeDrive(robot.id, direction, speed),
                    scan: (direction, resolution) => this.safeScan(robot.id, direction, resolution),
                    fire: (direction, power) => this.safeFire(robot.id, direction, power),
                    damage: () => this.safeDamage(robot.id),
                    getX: () => this.safeGetX(robot.id),
                    getY: () => this.safeGetY(robot.id),
                    getDirection: () => this.safeGetDirection(robot.id),
                },

                // --- START MODIFIED CONSOLE ---
                console: {
                    log: (...args) => {
                        // 1. Log server-side as before (optional, but useful for server debug)
                        console.log(`[Robot ${robot.id} Log]`, ...args);

                        // 2. Format message for client
                        // Simple approach: convert all args to strings and join
                        const messageString = args.map(arg => {
                            try {
                                // Handle different types reasonably
                                if (typeof arg === 'object' && arg !== null) {
                                    // Be careful with circular references in complex objects
                                    // A simple depth limit or specific property selection might be safer
                                    return JSON.stringify(arg, null, 2); // Pretty print object slightly
                                }
                                return String(arg); // Convert others to string
                            } catch (e) {
                                return '[Unloggable Value]';
                            }
                        }).join(' ');

                        // 3. Emit to the specific client's socket if connected
                        // Use the playerSocket variable captured in the outer scope
                        if (playerSocket && playerSocket.connected) {
                            playerSocket.emit('robotLog', { message: messageString });
                        }
                    }
                },
                // --- END MODIFIED CONSOLE ---

                // Standard Math library (accessible as 'Math' or 'this.Math')
                Math: Math,

                // Explicitly disable potentially harmful globals within the sandbox
                // setTimeout: null, setInterval: null, require: null, process: null, global: null,
            };

            // Create the persistent VM context using the sandbox
            this.robotContexts[robot.id] = vm.createContext(sandbox);

            // --- Compile Code into a Reusable Function ---
            try {
                // 1. Wrap the user's code inside an anonymous function string.
                // Using "use strict" is generally good practice.
                const wrappedCode = `
                    (function() {
                        "use strict";
                        // User code goes here. It can access 'state', 'robot', 'console', 'Math'
                        // either directly or via 'this' (e.g., this.state.myVar = 1)
                        ${playerData.code}
                    }); // Semicolon here is important for safety
                `;

                // 2. Compile the wrapper function string into a vm.Script object.
                const script = new vm.Script(wrappedCode, {
                    filename: `robot_${robot.id}_function.js`, // For stack traces
                    displayErrors: true
                });

                // 3. Run the compiled script *once* within the context.
                // The result of running the script `(function(){...});` IS the function.
                // Store this executable function.
                this.robotTickFunctions[robot.id] = script.runInContext(this.robotContexts[robot.id], {
                     // Timeout for this initial run/compilation step
                     timeout: 500 // Allow half a second for potentially complex initial setup
                });

                // 4. Type check: Ensure we actually got a function back.
                if (typeof this.robotTickFunctions[robot.id] !== 'function') {
                     throw new Error("Compilation did not produce an executable function.");
                }

                console.log(`[Interpreter] Successfully compiled code into function for robot ${robot.id}`);

            } catch (error) {
                // Handle errors during compilation or the initial run
                console.error(`[Interpreter] Error compiling/initializing function for robot ${robot.id}:`, error.message);
                 // Use the playerSocket variable captured in the outer scope
                if (playerSocket && playerSocket.connected) {
                    playerSocket.emit('codeError', {
                        robotId: robot.id,
                        message: `Compilation/Initialization Error: ${error.message}`
                    });
                }
                // Disable the robot if compilation/initialization fails
                this.robotTickFunctions[robot.id] = null;
                this.robotContexts[robot.id] = null;
            }
        });
        console.log("[Interpreter] Initialization complete.");
    }

    /**
     * Executes one tick of AI code for all active robots by calling their compiled function.
     * Called by the GameInstance's main game loop (`tick` method).
     * @param {ServerRobot[]} robots - Array of all robot instances in the game.
     * @param {GameInstance} gameInstance - Reference to the current game instance for context.
     */
    executeTick(robots, gameInstance) {
        // Store game instance context for use by safe API methods during this tick
        this.currentGameInstance = gameInstance;

        robots.forEach(robot => {
            // Check if robot is alive and has a valid *function* and context
            if (robot.isAlive && this.robotTickFunctions[robot.id] && this.robotContexts[robot.id]) {

                // Set the ID of the currently executing robot for validation in safe methods
                this.currentRobotId = robot.id;
                const tickFunction = this.robotTickFunctions[robot.id];
                const context = this.robotContexts[robot.id]; // The sandbox object
                const playerData = gameInstance.players.get(robot.id); // Get player data again for socket access in error handling
                const playerSocket = playerData ? playerData.socket : null; // Get socket for error handling

                try {
                    // *** Execute the stored function for this tick ***
                    tickFunction.call(context /*, arguments if any */);

                } catch (error) {
                    // Handle runtime errors *inside* the robot's code during the call
                    console.error(`[Interpreter] Runtime error during function execution for robot ${robot.id}:`, error.message);
                    // Notify the client about the runtime error
                     // Use the playerSocket captured just above
                    if (playerSocket && playerSocket.connected) {
                        playerSocket.emit('codeError', {
                            robotId: robot.id,
                            message: `Runtime Error: ${error.message}`
                        });
                    }
                    // Optional: Consider disabling the robot after repeated errors?
                    // this.robotTickFunctions[robot.id] = null; // Example: disable after first error
                } finally {
                     // Important: Clear the current robot ID after its execution attempt
                     this.currentRobotId = null;
                }
            } // End if (robot should execute)
        }); // End robots.forEach

        // Clear the game instance context after all robots have executed for this tick
        this.currentGameInstance = null;
    } // End executeTick()

    // --- Safe API Methods ---

    /** Safely retrieves the ServerRobot instance for the currently executing robot. @private */
    getCurrentRobot() {
        if (!this.currentRobotId || !this.currentGameInstance) return null;
        const data = this.currentGameInstance.players.get(this.currentRobotId);
        return data ? data.robot : null;
    }

    /** Safely delegates drive command. */
    safeDrive(robotId, direction, speed) {
        if (robotId !== this.currentRobotId) return;
        const robot = this.getCurrentRobot();
        if (robot && typeof direction === 'number' && typeof speed === 'number') {
            robot.drive(direction, speed);
        } else if (robot) {
            console.warn(`[Interpreter] Invalid drive(${direction}, ${speed}) call for robot ${robotId}`);
        }
    }

    /** Safely delegates scan command and returns result. */
    safeScan(robotId, direction, resolution) {
        if (robotId !== this.currentRobotId || !this.currentGameInstance) return null;
        const robot = this.getCurrentRobot();
        if (robot && typeof direction === 'number' && typeof resolution === 'number') {
            return this.currentGameInstance.performScan(robot, direction, resolution);
        } else if (robot) {
            console.warn(`[Interpreter] Invalid scan(${direction}, ${resolution}) call for robot ${robotId}`);
        }
        return null;
    }

    /** Safely delegates fire command and returns success/failure. */
    safeFire(robotId, direction, power) {
        if (robotId !== this.currentRobotId) return false;
        const robot = this.getCurrentRobot();
        if (robot && typeof direction === 'number') {
            // Allow power to be optional or undefined, defaulting inside robot.fire
            return robot.fire(direction, power);
        } else if (robot) {
            console.warn(`[Interpreter] Invalid fire(${direction}, ${power}) call for robot ${robotId}`);
        }
        return false;
    }

    /** Safely retrieves robot damage. */
    safeDamage(robotId) {
        if (robotId !== this.currentRobotId) return 100; // Assume max damage if invalid call
        const robot = this.getCurrentRobot();
        return robot ? robot.damage : 100;
    }

    /** Safely retrieves robot X coordinate. */
    safeGetX(robotId) {
        if (robotId !== this.currentRobotId) return null;
        const robot = this.getCurrentRobot();
        return robot ? robot.x : null;
    }

    /** Safely retrieves robot Y coordinate. */
    safeGetY(robotId) {
        if (robotId !== this.currentRobotId) return null;
        const robot = this.getCurrentRobot();
        return robot ? robot.y : null;
    }

    /** Safely retrieves robot direction. */
    safeGetDirection(robotId) {
        if (robotId !== this.currentRobotId) return null;
        const robot = this.getCurrentRobot();
        return robot ? robot.direction : null;
    }

    /**
     * Cleans up interpreter state, called when the game ends.
     */
    stop() {
        console.log("[Interpreter] Stopping and cleaning up contexts/functions.");
        // Clear stored contexts and functions to release memory
        this.robotContexts = {};
        this.robotTickFunctions = {}; // Clear the stored functions
        this.currentRobotId = null;
        this.currentGameInstance = null;
    }
}

module.exports = ServerRobotInterpreter;