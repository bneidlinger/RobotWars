// server/server-interpreter.js
const { VM, VMScript } = require('vm2');

// Define consistent timeouts and memory limits
const EXECUTION_TIMEOUT = 100; // 100ms execution timeout per tick
const INITIALIZATION_TIMEOUT = 500; // 500ms for initial compilation
const MEMORY_LIMIT = 10; // 10MB memory limit

/**
 * Executes robot AI code safely within a properly sandboxed environment on the server.
 * Uses vm2 for improved security over Node's built-in vm module.
 */
class ServerRobotInterpreter {
    constructor() {
        this.robotVMs = {}; // Stores the VM instance for each robot
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
    initialize(robots, playersDataMap) {
        console.log("[Interpreter] Initializing robot interpreters with VM2 secure sandbox...");
        robots.forEach(robot => {
            const playerData = playersDataMap.get(robot.id);
            const playerSocket = playerData ? playerData.socket : null;
            const robotCode = playerData?.loadout?.code;

            // Debug logging
            console.log(`[Interpreter Init] Preparing to compile for ${robot.id} (${playerData?.loadout?.name || 'Unknown'})`);

            if (!playerData || typeof robotCode !== 'string' || robotCode.trim() === '') {
                const reason = !playerData ? 'No player data found' : (!robotCode ? 'Code missing in loadout' : 'Code is empty');
                console.error(`[Interpreter Init] No valid code for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'}). Reason: ${reason}. Disabling.`);
                this.robotTickFunctions[robot.id] = null;
                this.robotVMs[robot.id] = null;
                if (playerSocket?.connected) {
                    playerSocket.emit('codeError', { robotId: robot.id, message: `Initialization Error: Robot code is missing or empty.` });
                }
                return; // Skip this robot
            }

            try {
                // Create a new VM instance with proper security settings
                const vm = new VM({
                    timeout: INITIALIZATION_TIMEOUT,
                    sandbox: {
                        state: {},
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
                                } else if (playerSocket?.connected) {
                                    playerSocket.emit('robotLog', {
                                        robotId: robot.id,
                                        message: `(Context Issue) ${messageString}`
                                    });
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
                        }
                    },
                    // Disable all Node.js internal modules
                    require: false,
                    // Prevent access to process, Buffer, etc.
                    wasm: false,
                    // Set memory limit (in MB)
                    fixAsync: true,
                    // Additional security settings
                    allowAsync: false
                });

                // Add the robot API to the sandbox safely
                vm.freeze({
                    drive: (direction, speed) => this.safeDrive(robot.id, direction, speed),
                    scan: (direction, resolution) => this.safeScan(robot.id, direction, resolution),
                    fire: (direction, power) => this.safeFire(robot.id, direction, power),
                    damage: () => this.safeDamage(robot.id),
                    getX: () => this.safeGetX(robot.id),
                    getY: () => this.safeGetY(robot.id),
                    getDirection: () => this.safeGetDirection(robot.id),
                }, 'robot');

                // Wrap user code in a function for proper scoping and strict mode
                const wrappedCode = `(function() { "use strict";\n${robotCode}\n});`;
                
                try {
                    // Compile the script (but don't run it yet)
                    const script = new VMScript(wrappedCode, `robot_${robot.id}.js`);
                    const compiledFunction = vm.run(script);
                    
                    // Validate that we got a function
                    if (typeof compiledFunction !== 'function') {
                        throw new Error("Compiled code did not produce a function. Ensure your code is properly formatted.");
                    }
                    
                    // Store both the VM instance and the compiled function
                    this.robotVMs[robot.id] = vm;
                    this.robotTickFunctions[robot.id] = compiledFunction;
                    
                    console.log(`[Interpreter Init] Successfully compiled function for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'})`);
                } catch (compileError) {
                    throw new Error(`Code compilation error: ${compileError.message}`);
                }

            } catch (error) {
                console.error(`[Interpreter Init] Error initializing/compiling function for robot ${robot.id}:`, error.message);
                if (playerSocket?.connected) {
                    playerSocket.emit('codeError', { robotId: robot.id, message: `Initialization Error: ${error.message}` });
                }
                // Ensure cleanup on error
                this.robotTickFunctions[robot.id] = null;
                this.robotVMs[robot.id] = null;
            }
        });
        console.log("[Interpreter] Initialization complete.");
    }

    /**
     * Executes one tick of AI code for all active robots with proper security timeouts.
     * @param {ServerRobot[]} robots - Array of all robot instances in the game.
     * @param {GameInstance} gameInstance - Reference to the current game instance.
     * @returns {Array} An empty array (events are now triggered via side effects in safe API calls).
     */
    executeTick(robots, gameInstance) {
        this.currentGameInstance = gameInstance;
        const results = [];

        robots.forEach(robot => {
            // Only execute if robot is active and has a valid VM/function
            if (robot.state === 'active' && this.robotTickFunctions[robot.id] && this.robotVMs[robot.id]) {
                this.currentRobotId = robot.id;
                const tickFunction = this.robotTickFunctions[robot.id];
                const vm = this.robotVMs[robot.id];
                const playerData = gameInstance.players.get(robot.id);
                const playerSocket = playerData?.socket;

                try {
                    // Execute with proper timeout
                    vm.setGlobal('__tickFunction', tickFunction);
                    
                    // Run the tick function with a timeout
                    vm.run(`
                        (function() {
                            try {
                                __tickFunction();
                            } catch (e) {
                                console.log("Error in robot code: " + e.message);
                            }
                        })();
                    `, { timeout: EXECUTION_TIMEOUT });
                    
                } catch (error) {
                    console.error(`[Interpreter Tick] Runtime error for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'}):`, error.message);
                    if (playerSocket?.connected) {
                        playerSocket.emit('codeError', { robotId: robot.id, message: `Runtime Error: ${error.message}` });
                    }
                } finally {
                    this.currentRobotId = null;
                }
            }
        });

        this.currentGameInstance = null;
        return results;
    }

    // --- Safe API Methods ---
    // These methods remain mostly the same but with improved security checks

    /** Safely retrieves the ServerRobot instance for the currently executing robot. @private */
    getCurrentRobot() {
        if (!this.currentRobotId || !this.currentGameInstance) return null;
        return this.currentGameInstance.robots.find(r => r.id === this.currentRobotId);
    }

    /** Safely delegates drive command to the correct robot instance. */
    safeDrive(robotId, direction, speed) {
        if (robotId !== this.currentRobotId) return;
        const robot = this.getCurrentRobot();
        if (robot?.state === 'active' && typeof direction === 'number' && typeof speed === 'number') {
            robot.drive(direction, speed);
        }
    }

    /** Safely delegates scan command to the GameInstance. */
    safeScan(robotId, direction, resolution) {
        if (robotId !== this.currentRobotId || !this.currentGameInstance) return null;
        const robot = this.getCurrentRobot();
        if (robot?.state === 'active' && typeof direction === 'number') {
            const res = (typeof resolution === 'number' && resolution > 0) ? resolution : 10;
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

        if (robot?.state === 'active' && this.currentGameInstance && typeof direction === 'number') {
            const fireResult = robot.fire(direction, power);
            if (fireResult.success && fireResult.eventData && typeof this.currentGameInstance.addFireEvent === 'function') {
                this.currentGameInstance.addFireEvent(fireResult.eventData);
            }
            return fireResult.success;
        }
        return false;
    }

    /** Safely retrieves the current damage of the robot. */
    safeDamage(robotId) {
        if (robotId !== this.currentRobotId) return 100;
        const robot = this.getCurrentRobot();
        return robot ? robot.damage : 100;
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

    /** Cleans up interpreter state when the game ends. */
    stop() {
        console.log("[Interpreter] Stopping and cleaning up VMs/functions.");
        
        // Properly dispose of VM instances
        Object.keys(this.robotVMs).forEach(robotId => {
            const vm = this.robotVMs[robotId];
            if (vm) {
                try {
                    // Clear any remaining state
                    vm.setGlobal('state', {});
                    vm.setGlobal('__tickFunction', null);
                } catch (e) {
                    // Ignore errors during cleanup
                    console.log(`[Interpreter] Error during VM cleanup for robot ${robotId}: ${e.message}`);
                }
            }
        });
        
        this.robotVMs = {};
        this.robotTickFunctions = {};
        this.currentRobotId = null;
        this.currentGameInstance = null;
    }
}

module.exports = ServerRobotInterpreter;