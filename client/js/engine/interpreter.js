class RobotInterpreter {
    constructor() {
        this.robotFunctions = {};
        this.running = false;
    }

    initialize(robots) {
        this.running = true;

        // Create sandboxed environment for each robot
        robots.forEach(robot => {
            try {
                // Create a function wrapper for the robot code
                const functionBody = `
                    "use strict";
                    // 'this' here refers to the interpreter instance passed via .call()
                    let robot = {
                        drive: (direction, speed) => this.safeDrive(${robot.id}, direction, speed),
                        scan: (direction, resolution) => this.safeScan(${robot.id}, direction, resolution),
                        fire: (direction, power) => this.safeFire(${robot.id}, direction, power),
                        damage: () => this.safeDamage(${robot.id})
                    };

                    // Robot AI function that will be called each tick
                    function run() {
                        ${robot.code}
                    }

                    return run;
                `;

                // Create function from the code using the Function constructor.
                // The 'this' inside the function body needs to be set when called.
                const createRobotFunction = new Function(functionBody);
                this.robotFunctions[robot.id] = createRobotFunction.call(this); // Get the 'run' function
            } catch (error) {
                console.error(`Error initializing robot ${robot.id}:`, error);
                this.robotFunctions[robot.id] = () => {
                    console.log(`Robot ${robot.id} has invalid code and is disabled.`);
                };
            }
        });
    }

    // *** Restored executeTick method ***
    executeTick(robots, game) {
        if (!this.running) return;

        robots.forEach(robot => {
            // Only execute code for active robots
            if (robot.damage < 100 && this.robotFunctions[robot.id]) {
                try {
                    // Set the current robot and game context for the safe API methods
                    this.currentRobot = robot;
                    this.currentGame = game;

                    // Get the robot's specific AI function
                    const runFunction = this.robotFunctions[robot.id];

                    // Execute the robot's AI function, setting 'this' correctly
                    // so the arrow functions inside the sandbox can find safeDrive etc.
                    if (typeof runFunction === 'function') {
                         runFunction.call(this);
                    } else {
                         // This might happen if initialization failed badly
                         // console.warn(`Robot ${robot.id} does not have a valid run function.`);
                         // Optionally disable it permanently here
                         // this.robotFunctions[robot.id] = null;
                    }

                } catch (error) {
                    console.error(`Error executing robot ${robot.id}:`, error);
                    // Optional: Disable the robot after an error
                    // this.robotFunctions[robot.id] = () => {};
                } finally {
                    // Clear context after execution (good practice)
                    this.currentRobot = null;
                    this.currentGame = null;
                }
            }
        });
    } // *** End of executeTick method ***

    stop() {
        this.running = false;
        this.robotFunctions = {}; // Clear functions when stopping
    }

    // Safe API methods - These are called FROM the sandboxed code via the 'robot' object
    safeDrive(robotId, direction, speed) {
        // Check if the call is coming from the currently executing robot
        if (this.currentRobot && this.currentRobot.id === robotId) {
            this.currentRobot.drive(direction, speed);
        } else {
            console.warn(`Robot ${robotId} (or external code) tried to call safeDrive improperly.`);
        }
    }

    safeScan(robotId, direction, resolution) {
        if (this.currentRobot && this.currentRobot.id === robotId && this.currentGame) {
            // The actual scan logic is in the Game class
            return this.currentGame.performScan(this.currentRobot, direction, resolution);
        } else {
             console.warn(`Robot ${robotId} (or external code) tried to call safeScan improperly.`);
        }
        return null;
    }

    safeFire(robotId, direction, power) {
        if (this.currentRobot && this.currentRobot.id === robotId) {
            return this.currentRobot.fire(direction, power);
        } else {
             console.warn(`Robot ${robotId} (or external code) tried to call safeFire improperly.`);
        }
        return false;
    }

    safeDamage(robotId) {
        if (this.currentRobot && this.currentRobot.id === robotId) {
            return this.currentRobot.damage;
        } else {
             console.warn(`Robot ${robotId} (or external code) tried to call safeDamage improperly.`);
        }
        return 0; // Or maybe null/undefined to indicate an issue
    }
}