// server/server-interpreter.js
const ivm = require('isolated-vm');

// Define consistent timeouts and memory limits
const EXECUTION_TIMEOUT = 100; // 100ms execution timeout per tick
const INITIALIZATION_TIMEOUT = 500; // 500ms for initial compilation/setup
const MEMORY_LIMIT = 10; // 10MB memory limit per robot isolate

/**
 * Executes robot AI code safely within a properly sandboxed environment on the server.
 *
 * Uses `isolated-vm` (V8 isolates) rather than vm2. Each robot runs in its own
 * isolate with a hard memory limit and a per-tick execution timeout. The isolate
 * shares NO objects or prototypes with the host: user code sees only the standard
 * ECMAScript built-ins (Math, Number, JSON, Array, ...) plus the specific host
 * functions we explicitly bridge in as `ivm.Reference`s (the robot API and
 * console.log). There is no `require`, `process`, `Buffer`, or any path back to
 * the host realm, which closes the sandbox-escape/RCE exposure that vm2 carried.
 *
 * Bridging model:
 *  - Host callbacks are injected as `ivm.Reference`s and invoked synchronously
 *    from inside the isolate via `.applySync(...)`. Arguments and return values
 *    cross the isolate boundary by structured copy (`{ copy: true }`), so only
 *    plain data — never live host objects — is ever exchanged.
 *  - `state` lives as a global object INSIDE the isolate and persists across
 *    ticks (the isolate/context is reused each tick), matching the previous
 *    per-robot persistent `state` behavior.
 */
class ServerRobotInterpreter {
    constructor() {
        this.isolates = {};          // robotId -> ivm.Isolate
        this.contexts = {};          // robotId -> ivm.Context
        this.tickScripts = {};       // robotId -> ivm.Script (compiled per-tick runner)
        this.currentRobotId = null;  // Temporarily holds the ID of the robot currently executing
        this.currentGameInstance = null; // Temporarily holds a reference to the GameInstance
    }

    /**
     * Initializes an isolate and compiles the tick function for each robot.
     * @param {ServerRobot[]} robots - Array of robot instances.
     * @param {Map<string, object>} playersDataMap - Map where key is robotId and value is
     *        { socket, loadout: { name, visuals, code }, robot: ServerRobot }.
     */
    initialize(robots, playersDataMap) {
        console.log("[Interpreter] Initializing robot interpreters with isolated-vm secure sandbox...");
        robots.forEach(robot => {
            const playerData = playersDataMap.get(robot.id);
            const playerSocket = playerData ? playerData.socket : null;
            const robotCode = playerData?.loadout?.code;

            console.log(`[Interpreter Init] Preparing to compile for ${robot.id} (${playerData?.loadout?.name || 'Unknown'})`);

            if (!playerData || typeof robotCode !== 'string' || robotCode.trim() === '') {
                const reason = !playerData ? 'No player data found' : (!robotCode ? 'Code missing in loadout' : 'Code is empty');
                console.error(`[Interpreter Init] No valid code for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'}). Reason: ${reason}. Disabling.`);
                this._disableRobot(robot.id);
                if (playerSocket?.connected) {
                    playerSocket.emit('codeError', { robotId: robot.id, message: `Initialization Error: Robot code is missing or empty.` });
                }
                return; // Skip this robot
            }

            let isolate = null;
            try {
                // Each robot gets its own isolate with a hard memory ceiling.
                isolate = new ivm.Isolate({ memoryLimit: MEMORY_LIMIT });
                const context = isolate.createContextSync();
                const jail = context.global;

                // --- Bridge host functions in as References ---
                // Each closes over robot.id so the host-side safe* methods can verify
                // the caller is the robot currently executing.
                jail.setSync('_log', new ivm.Reference((messageString) => {
                    const msg = String(messageString);
                    // Prefer broadcasting to the whole game room (players + spectators);
                    // fall back to the owning socket if the game context isn't set.
                    if (this.currentGameInstance && this.currentGameInstance.io && this.currentGameInstance.gameId) {
                        this.currentGameInstance.io.to(this.currentGameInstance.gameId).emit('robotLog', {
                            robotId: robot.id,
                            message: msg
                        });
                    } else if (playerSocket?.connected) {
                        playerSocket.emit('robotLog', {
                            robotId: robot.id,
                            message: `(Context Issue) ${msg}`
                        });
                    }
                }));
                jail.setSync('_drive', new ivm.Reference((direction, speed) => this.safeDrive(robot.id, direction, speed)));
                jail.setSync('_scan', new ivm.Reference((direction, resolution) => this.safeScan(robot.id, direction, resolution)));
                jail.setSync('_fire', new ivm.Reference((direction, power) => this.safeFire(robot.id, direction, power)));
                jail.setSync('_damage', new ivm.Reference(() => this.safeDamage(robot.id)));
                jail.setSync('_getX', new ivm.Reference(() => this.safeGetX(robot.id)));
                jail.setSync('_getY', new ivm.Reference(() => this.safeGetY(robot.id)));
                jail.setSync('_getDirection', new ivm.Reference(() => this.safeGetDirection(robot.id)));

                // --- Bootstrap the in-isolate API surface ---
                // Builds `state`, `console`, and `robot` from the raw References, then
                // clears the raw References off the global so user code interacts only
                // with the friendly wrappers. Arguments/returns are structured-copied
                // across the boundary; a non-cloneable argument (e.g. a function) makes
                // the call a safe no-op, matching the previous type-checked behavior.
                const bootstrap = `
                    (function() {
                        var refs = {
                            log: _log, drive: _drive, scan: _scan, fire: _fire,
                            damage: _damage, getX: _getX, getY: _getY, getDirection: _getDirection
                        };
                        var COPY = { arguments: { copy: true }, result: { copy: true } };
                        var ARGS_COPY = { arguments: { copy: true } };

                        globalThis.state = {};

                        globalThis.console = Object.freeze({
                            log: function() {
                                var args = Array.prototype.slice.call(arguments);
                                var msg;
                                try {
                                    msg = args.map(function(a) {
                                        if (typeof a === 'object' && a !== null) {
                                            try { return JSON.stringify(a); } catch (e) { return '[Unloggable Object]'; }
                                        }
                                        return String(a);
                                    }).join(' ');
                                } catch (e) { msg = '[Unloggable Object]'; }
                                try { refs.log.applySync(undefined, [msg], ARGS_COPY); } catch (e) {}
                            }
                        });

                        globalThis.robot = Object.freeze({
                            drive: function(direction, speed) {
                                try { refs.drive.applySync(undefined, [direction, speed], ARGS_COPY); } catch (e) {}
                            },
                            scan: function(direction, resolution) {
                                try { return refs.scan.applySync(undefined, [direction, resolution], COPY); } catch (e) { return null; }
                            },
                            fire: function(direction, power) {
                                try { return refs.fire.applySync(undefined, [direction, power], COPY); } catch (e) { return false; }
                            },
                            damage: function() {
                                try { return refs.damage.applySync(undefined, [], COPY); } catch (e) { return 100; }
                            },
                            getX: function() {
                                try { return refs.getX.applySync(undefined, [], COPY); } catch (e) { return null; }
                            },
                            getY: function() {
                                try { return refs.getY.applySync(undefined, [], COPY); } catch (e) { return null; }
                            },
                            getDirection: function() {
                                try { return refs.getDirection.applySync(undefined, [], COPY); } catch (e) { return null; }
                            }
                        });

                        // Hide the raw References from user code (defense in depth).
                        globalThis._log = undefined; globalThis._drive = undefined; globalThis._scan = undefined;
                        globalThis._fire = undefined; globalThis._damage = undefined; globalThis._getX = undefined;
                        globalThis._getY = undefined; globalThis._getDirection = undefined;
                    })();
                `;
                isolate.compileScriptSync(bootstrap).runSync(context, { timeout: INITIALIZATION_TIMEOUT });

                // --- Compile the user code into a persistent tick function ---
                // Wrapped in a strict-mode function so `state`/`robot`/`console` resolve
                // to the globals above. Defining it does not execute the body.
                const defineTick = `globalThis.__tickFunction = (function() { "use strict";\n${robotCode}\n});`;
                try {
                    isolate.compileScriptSync(defineTick).runSync(context, { timeout: INITIALIZATION_TIMEOUT });
                } catch (compileError) {
                    throw new Error(`Code compilation error: ${compileError.message}`);
                }

                // Validate that we actually produced a callable tick function.
                const isFn = isolate.compileScriptSync(`typeof globalThis.__tickFunction === 'function'`).runSync(context, { timeout: INITIALIZATION_TIMEOUT });
                if (!isFn) {
                    throw new Error("Compiled code did not produce a function. Ensure your code is properly formatted.");
                }

                // Pre-compile the per-tick runner once; reused every tick.
                const tickRunner = `
                    (function() {
                        try {
                            globalThis.__tickFunction();
                        } catch (e) {
                            globalThis.console.log("Error in robot code: " + (e && e.message ? e.message : e));
                        }
                    })();
                `;
                const tickScript = isolate.compileScriptSync(tickRunner);

                // Store isolate, context, and compiled tick script.
                this.isolates[robot.id] = isolate;
                this.contexts[robot.id] = context;
                this.tickScripts[robot.id] = tickScript;

                console.log(`[Interpreter Init] Successfully compiled function for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'})`);

            } catch (error) {
                console.error(`[Interpreter Init] Error initializing/compiling function for robot ${robot.id}:`, error.message);
                if (playerSocket?.connected) {
                    playerSocket.emit('codeError', { robotId: robot.id, message: `Initialization Error: ${error.message}` });
                }
                // Ensure cleanup on error (dispose the partially-created isolate).
                if (isolate && !isolate.isDisposed) {
                    try { isolate.dispose(); } catch (e) { /* ignore */ }
                }
                this._disableRobot(robot.id);
            }
        });
        console.log("[Interpreter] Initialization complete.");
    }

    /**
     * Executes one tick of AI code for all active robots with proper security timeouts.
     * @param {ServerRobot[]} robots - Array of all robot instances in the game.
     * @param {GameInstance} gameInstance - Reference to the current game instance.
     * @returns {Array} An empty array (events are triggered via side effects in safe API calls).
     */
    executeTick(robots, gameInstance) {
        this.currentGameInstance = gameInstance;

        robots.forEach(robot => {
            const isolate = this.isolates[robot.id];
            const context = this.contexts[robot.id];
            const tickScript = this.tickScripts[robot.id];

            // Only execute if robot is active and has a live isolate/context/script.
            if (robot.state === 'active' && isolate && !isolate.isDisposed && context && tickScript) {
                this.currentRobotId = robot.id;
                const playerData = gameInstance.players.get(robot.id);
                const playerSocket = playerData?.socket;

                try {
                    // vm.run/runSync enforces the timeout on the isolate's execution.
                    tickScript.runSync(context, { timeout: EXECUTION_TIMEOUT });
                } catch (error) {
                    // A memory-limit breach DISPOSES the isolate permanently; a timeout or
                    // ordinary runtime error leaves it reusable. Distinguish the two so a
                    // single runaway tick doesn't take out an otherwise-recoverable bot.
                    if (isolate.isDisposed) {
                        console.error(`[Interpreter Tick] Isolate for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'}) was disposed (likely memory limit exceeded). Disabling robot.`);
                        this._disableRobot(robot.id);
                        if (playerSocket?.connected) {
                            playerSocket.emit('codeError', { robotId: robot.id, message: `Runtime Error: Robot exceeded the memory limit and was disabled.` });
                        }
                    } else {
                        console.error(`[Interpreter Tick] Runtime error for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'}):`, error.message);
                        if (playerSocket?.connected) {
                            playerSocket.emit('codeError', { robotId: robot.id, message: `Runtime Error: ${error.message}` });
                        }
                    }
                } finally {
                    this.currentRobotId = null;
                }
            }
        });

        this.currentGameInstance = null;
        return [];
    }

    /** Tears down and forgets a single robot's isolate. @private */
    _disableRobot(robotId) {
        const isolate = this.isolates[robotId];
        if (isolate && !isolate.isDisposed) {
            try { isolate.dispose(); } catch (e) { /* already gone */ }
        }
        this.isolates[robotId] = null;
        this.contexts[robotId] = null;
        this.tickScripts[robotId] = null;
    }

    // --- Safe API Methods ---
    // Called (synchronously) from inside the isolate via bridged References. They
    // verify the caller is the currently-executing robot and validate all inputs.

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

    /** Cleans up interpreter state when the game ends. Disposes every isolate. */
    stop() {
        console.log("[Interpreter] Stopping and cleaning up isolates.");
        Object.keys(this.isolates).forEach(robotId => {
            const isolate = this.isolates[robotId];
            if (isolate && !isolate.isDisposed) {
                try {
                    isolate.dispose();
                } catch (e) {
                    console.log(`[Interpreter] Error disposing isolate for robot ${robotId}: ${e.message}`);
                }
            }
        });

        this.isolates = {};
        this.contexts = {};
        this.tickScripts = {};
        this.currentRobotId = null;
        this.currentGameInstance = null;
    }
}

module.exports = ServerRobotInterpreter;
