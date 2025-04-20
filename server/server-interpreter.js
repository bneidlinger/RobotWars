// server/server-interpreter.js
const vm = require('vm');

// EXECUTION_TIMEOUT is not currently used per-tick, only during init.
// const EXECUTION_TIMEOUT = 50;

/**
 * Executes robot AI code safely within a sandboxed environment on the server.
 * Manages the execution context, provides a controlled API, and directly triggers
 * sound events (like fire) on the GameInstance via safe API methods. // <-- Updated description
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
            const playerSocket = playerData ? playerData.socket : null;

            if (!playerData || typeof playerData.code !== 'string' || playerData.code.trim() === '') {
                console.error(`[Interpreter] No valid code for robot ${robot.id}. Disabling.`);
                this.robotTickFunctions[robot.id] = null; this.robotContexts[robot.id] = null;
                return;
            }

            const sandbox = {
                state: {},
                robot: { // API available to the robot code
                    drive: (direction, speed) => this.safeDrive(robot.id, direction, speed),
                    scan: (direction, resolution) => this.safeScan(robot.id, direction, resolution),
                    // START CHANGE: Safe fire now triggers event on game instance
                    fire: (direction, power) => this.safeFire(robot.id, direction, power),
                    // END CHANGE
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
                                return (typeof arg === 'object' && arg !== null) ? JSON.stringify(arg) : String(arg);
                            } catch (e) { return '[Unloggable]'; }
                        }).join(' ');
                        // Emit to specific client if connected
                        if (playerSocket?.connected) {
                            playerSocket.emit('robotLog', { message: messageString });
                        }
                    }
                },
                Math: Math,
                // Disable harmful globals
                // setTimeout: null, setInterval: null, require: null, process: null, global: null,
            };

            this.robotContexts[robot.id] = vm.createContext(sandbox);

            try {
                // Wrap code in a function for execution context
                const wrappedCode = `(function() { "use strict"; ${playerData.code} });`;
                const script = new vm.Script(wrappedCode, { filename: `robot_${robot.id}.js`, displayErrors: true });
                this.robotTickFunctions[robot.id] = script.runInContext(this.robotContexts[robot.id], { timeout: 500 });

                if (typeof this.robotTickFunctions[robot.id] !== 'function') {
                     throw new Error("Compiled code did not produce a function.");
                }
                console.log(`[Interpreter] Compiled function for robot ${robot.id}`);

            } catch (error) {
                console.error(`[Interpreter] Error initializing function for robot ${robot.id}:`, error.message);
                if (playerSocket?.connected) {
                    playerSocket.emit('codeError', { robotId: robot.id, message: `Init Error: ${error.message}` });
                }
                this.robotTickFunctions[robot.id] = null; // Disable on error
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
     * @returns {Array} An empty array (events are triggered via side effects in safe API calls).
     */
    executeTick(robots, gameInstance) {
        this.currentGameInstance = gameInstance; // Provide context for safe methods
        const results = []; // Keep array for potential future use, but not for current sound events

        robots.forEach(robot => {
            if (robot.state === 'active' && this.robotTickFunctions[robot.id] && this.robotContexts[robot.id]) {
                this.currentRobotId = robot.id;
                const tickFunction = this.robotTickFunctions[robot.id];
                const context = this.robotContexts[robot.id];
                const playerData = gameInstance.players.get(robot.id);
                const playerSocket = playerData ? playerData.socket : null;

                try {
                    // Execute the robot's compiled code function for this tick
                    tickFunction.call(context); // Events triggered by safeFire inside this call

                } catch (error) {
                    console.error(`[Interpreter] Runtime error for robot ${robot.id}:`, error.message);
                    if (playerSocket?.connected) {
                        playerSocket.emit('codeError', { robotId: robot.id, message: `Runtime Error: ${error.message}` });
                    }
                    // Optional: Disable robot on error?
                    // this.robotTickFunctions[robot.id] = null;
                } finally {
                    this.currentRobotId = null; // Clear context after execution
                }
            }
        });

        this.currentGameInstance = null; // Clear game context after all robots run
        return results; // Return empty array for now
    }

    // --- Safe API Methods ---

    /** Safely retrieves the ServerRobot instance for the currently executing robot. @private */
    getCurrentRobot() {
        if (!this.currentRobotId || !this.currentGameInstance) return null;
        return this.currentGameInstance.robots.find(r => r.id === this.currentRobotId);
    }

    /** Safely delegates drive command. */
    safeDrive(robotId, direction, speed) {
        if (robotId !== this.currentRobotId) return;
        const robot = this.getCurrentRobot();
        if (robot?.state === 'active' && typeof direction === 'number' && typeof speed === 'number') {
            robot.drive(direction, speed);
        }
    }

    /** Safely delegates scan command. */
    safeScan(robotId, direction, resolution) {
        if (robotId !== this.currentRobotId || !this.currentGameInstance) return null;
        const robot = this.getCurrentRobot();
        if (robot?.state === 'active' && typeof direction === 'number') {
            const res = (typeof resolution === 'number' && resolution > 0) ? resolution : 10;
            return this.currentGameInstance.performScan(robot, direction, res);
        }
        return null;
    }

    /** Safely delegates fire command AND triggers fire event on GameInstance. */
    safeFire(robotId, direction, power) {
        if (robotId !== this.currentRobotId) return false; // Check execution context
        const robot = this.getCurrentRobot();

        // Also check robot state and game instance availability
        if (robot?.state === 'active' && this.currentGameInstance && typeof direction === 'number') {
            // Delegate the actual firing logic to the robot
            const fireResult = robot.fire(direction, power); // Gets { success: boolean, eventData?: object }

            // START CHANGE: If fire was successful, trigger event on GameInstance
            if (fireResult.success && fireResult.eventData && typeof this.currentGameInstance.addFireEvent === 'function') {
                this.currentGameInstance.addFireEvent(fireResult.eventData);
            }
            // END CHANGE

            return fireResult.success; // Return success status to the robot code
        }
        return false; // Cannot fire
    }


    /** Safely retrieves robot damage. */
    safeDamage(robotId) {
        if (robotId !== this.currentRobotId) return 100;
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

    /** Cleans up interpreter state when the game ends. */
    stop() {
        console.log("[Interpreter] Stopping and cleaning up contexts/functions.");
        this.robotContexts = {};
        this.robotTickFunctions = {};
        this.currentRobotId = null;
        this.currentGameInstance = null;
    }
}

module.exports = ServerRobotInterpreter;