// server/db-scripts/utils/sandbox-harness.js
//
// Dev/test harness for the isolated-vm robot sandbox. Runs arbitrary bot code
// through the REAL ServerRobotInterpreter against a mock GameInstance and reports
// exactly what the bot was able to do: which robot-API calls it made, what it
// logged, whether it errored, whether it was disabled, and how long a tick took.
//
// Used for security (escape attempts) and correctness (API parity) testing.
//
//   const { runBot } = require('./sandbox-harness');
//   const r = runBot('robot.drive(90, 3);', { ticks: 1 });
//   console.log(r);
//
// A "leak" is any host value that reached bot code — the harness plants several
// canaries on the host global and checks whether the bot could observe them.

const path = require('path');
const ServerRobotInterpreter = require(path.join(__dirname, '..', '..', 'server-interpreter.js'));

// A canary placed on the host global; if a bot can read process/require/etc.
// and reflect it back through the observed channels, we detect an escape.
global.__HOST_CANARY__ = 'HOST-SECRET-CANARY-9f3a';

/**
 * Run a bot's code through the sandbox for N ticks.
 * @param {string} code - The robot AI source.
 * @param {object} [opts]
 * @param {number} [opts.ticks=1] - How many ticks to execute.
 * @param {object|null} [opts.scanResult] - What performScan should return.
 * @returns {object} Structured observations.
 */
function runBot(code, opts = {}) {
    const ticks = opts.ticks || 1;
    const scanResult = opts.scanResult !== undefined
        ? opts.scanResult
        : { distance: 42, direction: 90, id: 'enemy-1', name: 'Enemy' };

    const obs = {
        logs: [],
        codeErrors: [],
        driveCalls: [],
        scanCalls: [],
        fireCalls: [],
        hostThrew: null,     // any exception that escaped into host code
        initialized: false,
        disabledAfter: null, // tick index at which the robot got disabled, if any
        tickMs: [],
        // Anything here that contains the canary means the host realm leaked.
        suspicious: [],
    };

    const robot = {
        id: 'bot-under-test',
        name: 'BotUnderTest',
        state: 'active',
        x: 100, y: 150, direction: 45, damage: 12,
        drive(dir, spd) { obs.driveCalls.push({ dir, spd }); },
        fire(dir, pwr) {
            obs.fireCalls.push({ dir, pwr });
            return { success: true, eventData: { type: 'fire', x: 0, y: 0, ownerId: 'bot-under-test', direction: Number(dir) || 0, turretType: 'standard' } };
        },
    };

    // Mock socket captures codeError / robotLog emissions.
    const socket = {
        connected: true,
        emit(event, data) {
            if (event === 'robotLog') obs.logs.push(data.message);
            else if (event === 'codeError') obs.codeErrors.push(data.message);
            const s = JSON.stringify(data || '');
            if (s.includes('HOST-SECRET-CANARY')) obs.suspicious.push({ via: 'socket:' + event, data: s.slice(0, 200) });
        },
    };

    const gameInstance = {
        gameId: 'harness-game',
        io: { to() { return { emit(event, data) {
            if (event === 'robotLog') { obs.logs.push(data.message); }
            const s = JSON.stringify(data || '');
            if (s.includes('HOST-SECRET-CANARY')) obs.suspicious.push({ via: 'io:' + event, data: s.slice(0, 200) });
        } }; } },
        players: new Map([['bot-under-test', { socket, loadout: { name: 'BotUnderTest', code }, robot }]]),
        robots: [robot],
        performScan(r, dir, res) { obs.scanCalls.push({ dir, res }); return scanResult; },
        addFireEvent() {},
    };

    const interp = new ServerRobotInterpreter();
    try {
        interp.initialize([robot], gameInstance.players);
        obs.initialized = !!(interp.isolates['bot-under-test']);
        for (let t = 0; t < ticks; t++) {
            const start = process.hrtime.bigint();
            interp.executeTick([robot], gameInstance);
            const end = process.hrtime.bigint();
            obs.tickMs.push(Number(end - start) / 1e6);
            if (obs.disabledAfter === null && !interp.isolates['bot-under-test'] && obs.initialized) {
                obs.disabledAfter = t;
            }
        }
    } catch (e) {
        obs.hostThrew = String(e && e.stack ? e.stack : e).slice(0, 500);
    } finally {
        try { interp.stop(); } catch (e) { /* ignore */ }
    }

    // Any log/error text containing the canary means a host value crossed over.
    for (const l of obs.logs) if (String(l).includes('HOST-SECRET-CANARY')) obs.suspicious.push({ via: 'log', data: String(l).slice(0, 200) });
    for (const e of obs.codeErrors) if (String(e).includes('HOST-SECRET-CANARY')) obs.suspicious.push({ via: 'codeError', data: String(e).slice(0, 200) });

    obs.escaped = obs.suspicious.length > 0;
    return obs;
}

module.exports = { runBot };

// Allow running a single ad-hoc bot from the CLI: node sandbox-harness.js "robot.drive(1,2)"
if (require.main === module) {
    const code = process.argv[2] || 'console.log("hello from bot"); robot.drive(90, 3);';
    const ticks = parseInt(process.argv[3] || '1', 10);
    console.log(JSON.stringify(runBot(code, { ticks }), null, 2));
    process.exit(0);
}
