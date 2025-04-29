// server/server-interpreter.js
const vm = require('vm');

// EXECUTION_TIMEOUT is not currently used per-tick, only during init.
// const EXECUTION_TIMEOUT = 50;

/**
 * Executes robot AI code safely within a sandboxed environment on the server.
 * Manages the execution context, provides a controlled API, and directly triggers
 * events (like robotLog, fire) on the GameInstance via safe API methods.
 */
class ServerRobotInterpreter {
    constructor() {
        this.robotContexts = {}; // Stores the unique sandboxed context for each robot
        this.robotTickFunctions = {}; // Stores the executable function compiled from robot code
        this.currentRobotId = null; // Temporarily holds the ID of the robot currently executing
        this.currentGameInstance = null; // Temporarily holds a reference to the GameInstance
    }

    /**
     * Initializes the interpreter contexts and compiles functions for each robot.
     * @param {ServerRobot[]} robots - Array of robot instances.
     * @param {Map<string, object>} playersDataMap - Map where key is robotId and value is
     *        { socket, loadout: { name, visuals, code }, robot: ServerRobot }.
     */
    initialize(robots, playersDataMap) { // Added clarification to JSDoc
        console.log("[Interpreter] Initializing robot interpreters...");
        robots.forEach(robot => {
            const playerData = playersDataMap.get(robot.id);
            const playerSocket = playerData ? playerData.socket : null; // Needed for init error reporting

            const robotCode = playerData?.loadout?.code; // Safely access nested code

            // --- START: Added Debug Logging ---
            console.log(`[Interpreter Init] Preparing to compile for ${robot.id} (${playerData?.loadout?.name || 'Unknown'}). Code received:`);
            console.log("---------------- CODE START ----------------");
            // Log the actual code content, or a message if it's missing/undefined
            console.log(robotCode !== null && robotCode !== undefined ? robotCode : '!!! CODE MISSING OR UNDEFINED !!!');
            console.log("----------------- CODE END -----------------");
            // --- END: Added Debug Logging ---

            if (!playerData || typeof robotCode !== 'string' || robotCode.trim() === '') {
                const reason = !playerData ? 'No player data found' : (!robotCode ? 'Code missing in loadout' : 'Code is empty');
                console.error(`[Interpreter Init] No valid code for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'}). Reason: ${reason}. Disabling.`);
                this.robotTickFunctions[robot.id] = null;
                this.robotContexts[robot.id] = null;
                // Optional: Notify player if applicable
                 if (playerSocket?.connected) {
                     playerSocket.emit('codeError', { robotId: robot.id, message: `Initialization Error: Robot code is missing or empty.` });
                 }
                return; // Skip this robot
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
                        const messageString = args.map(arg => {
                            try {
                                return (typeof arg === 'object' && arg !== null) ? JSON.stringify(arg) : String(arg);
                            } catch (e) { return '[Unloggable Object]'; }
                        }).join(' ');

                        if (this.currentGameInstance && this.currentGameInstance.io && this.currentGameInstance.gameId) {
                            this.currentGameInstance.io.to(this.currentGameInstance.gameId).emit('robotLog', {
                                robotId: robot.id,
                                message: messageString
                            });
                        } else {
                             if (playerSocket?.connected) {
                                playerSocket.emit('robotLog', {
                                    robotId: robot.id,
                                    message: `(Context Issue) ${messageString}`
                                });
                             }
                        }
                    }
                },
                Math: {
                    abs: Math.abs, acos: Math.acos, asin: Math.asin, atan: Math.atan, atan2: Math.atan2,
                    ceil: Math.ceil, cos: Math.cos, floor: Math.floor, max: Math.max, min: Math.min,
                    pow: Math.pow, random: Math.random, round: Math.round, sin: Math.sin, sqrt: Math.sqrt,
                    tan: Math.tan, PI: Math.PI
                },
                Number: {
                    isFinite: Number.isFinite, isNaN: Number.isNaN, parseFloat: Number.parseFloat, parseInt: Number.parseInt
                },
                // Disable potentially harmful globals
                setTimeout: undefined, setInterval: undefined, setImmediate: undefined,
                clearTimeout: undefined, clearInterval: undefined, clearImmediate: undefined,
                require: undefined, process: undefined, global: undefined, globalThis: undefined,
                Buffer: undefined,
            };

            this.robotContexts[robot.id] = vm.createContext(sandbox);

            try {
                // Use the robotCode variable which contains the fetched code
                const wrappedCode = `(function() { "use strict";\n${robotCode}\n});`;
                const script = new vm.Script(wrappedCode, {
                    filename: `robot_${robot.id}.js`,
                    displayErrors: true
                });

                // Compile the script in the sandbox context
                this.robotTickFunctions[robot.id] = script.runInContext(this.robotContexts[robot.id], { timeout: 500 }); // Added timeout for safety

                // Validate that the compilation produced a callable function
                if (typeof this.robotTickFunctions[robot.id] !== 'function') {
                     throw new Error("Compiled code did not produce a function. Ensure your code is wrapped correctly or is just statements.");
                }
                console.log(`[Interpreter Init] Successfully compiled function for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'})`);

            } catch (error) {
                console.error(`[Interpreter Init] Error initializing/compiling function for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'}):`, error.message);
                if (playerSocket?.connected) {
                    playerSocket.emit('codeError', { robotId: robot.id, message: `Initialization Error: ${error.message}` });
                }
                // Ensure cleanup on error
                this.robotTickFunctions[robot.id] = null;
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
                    // Ensure context.robot exists before calling (it should, from sandbox creation)
                    if (context && context.robot) {
                        tickFunction.call(context.robot); // Pass the 'robot' API object as 'this' inside the function
                    } else {
                         console.error(`[Interpreter Tick] Missing context or context.robot for robot ${robot.id}. Cannot execute.`);
                    }

                } catch (error) {
                    console.error(`[Interpreter Tick] Runtime error for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'}):`, error.message, error.stack);
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
        if (!this.currentRobotId || !this.currentGameInstance) return null;
        // Find the robot instance within the current game instance's robot list
        return this.currentGameInstance.robots.find(r => r.id === this.currentRobotId);
    }

    /** Safely delegates drive command to the correct robot instance. */
    safeDrive(robotId, direction, speed) {
        if (robotId !== this.currentRobotId) return;
        const robot = this.getCurrentRobot();
        // Check if robot exists and is active before calling method
        if (robot?.state === 'active' && typeof direction === 'number' && typeof speed === 'number') {
            robot.drive(direction, speed);
        }
    }

    /** Safely delegates scan command to the GameInstance. */
    safeScan(robotId, direction, resolution) {
        if (robotId !== this.currentRobotId || !this.currentGameInstance) return null;
        const robot = this.getCurrentRobot();
        // Check if robot exists and is active before calling method
        if (robot?.state === 'active' && typeof direction === 'number') {
            const res = (typeof resolution === 'number' && resolution > 0) ? resolution : 10;
            // Ensure gameInstance has the performScan method
            if (typeof this.currentGameInstance.performScan === 'function') {
                return this.currentGameInstance.performScan(robot, direction, res);
            }
        }
        return null;
    }

    /** Safely delegates fire command AND triggers fire event on GameInstance. */
    safeFire(robotId, direction, power) {
        if (robotId !== this.currentRobotId) return false;
        const robot = this.getCurrentRobot();

        // Check if robot exists, is active, and gameInstance is set
        if (robot?.state === 'active' && this.currentGameInstance && typeof direction === 'number') {
            const fireResult = robot.fire(direction, power); // fire() returns { success: bool, eventData: obj|null }

            // If fire was successful and produced event data, trigger the event on GameInstance
            if (fireResult.success && fireResult.eventData && typeof this.currentGameInstance.addFireEvent === 'function') {
                this.currentGameInstance.addFireEvent(fireResult.eventData);
            }
            return fireResult.success;
        }
        return false;
    }


    /** Safely retrieves the current damage of the robot. */
    safeDamage(robotId) {
        if (robotId !== this.currentRobotId) return 100; // Return max damage if called improperly
        const robot = this.getCurrentRobot();
        return robot ? robot.damage : 100; // Return 100 if robot instance not found
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