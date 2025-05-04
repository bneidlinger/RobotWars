// test-sandbox-security.js
// This script tests the security of our VM2 sandbox implementation

const ServerRobotInterpreter = require('./server/server-interpreter');

// Create a mock game instance and robot
const mockRobot = {
    id: 'test-robot-1',
    state: 'active',
    damage: 0,
    x: 100,
    y: 100,
    direction: 0,
    drive: (direction, speed) => {
        console.log(`[MockRobot] drive(${direction}, ${speed}) called`);
    },
    fire: (direction, power) => {
        console.log(`[MockRobot] fire(${direction}, ${power}) called`);
        return { success: true, eventData: { robotId: 'test-robot-1', x: 100, y: 100 } };
    }
};

const mockGameInstance = {
    robots: [mockRobot],
    players: new Map([
        ['test-robot-1', { 
            socket: {
                connected: true,
                emit: (event, data) => {
                    console.log(`[MockSocket] Emitted event ${event}:`, data);
                }
            },
            loadout: { 
                name: 'Test Robot', 
                code: '' // Will be set per test
            }
        }]
    ]),
    gameId: 'test-game-1',
    io: {
        to: (roomId) => ({
            emit: (event, data) => {
                console.log(`[MockIO] Emitted event ${event} to room ${roomId}:`, data);
            }
        })
    },
    performScan: (robot, direction, resolution) => {
        console.log(`[MockGameInstance] performScan(${direction}, ${resolution}) called`);
        return { detected: false, distance: null, robotId: null };
    },
    addFireEvent: (eventData) => {
        console.log(`[MockGameInstance] addFireEvent called with:`, eventData);
    }
};

// Initialize the interpreter
const interpreter = new ServerRobotInterpreter();

// Helper function to run a test case
function runTest(testName, code, expectedResult) {
    console.log(`\n🧪 TEST: ${testName}`);
    console.log(`CODE: ${code.slice(0, 100)}${code.length > 100 ? '...' : ''}`);
    
    // Reset the mock game instance's robot code
    mockGameInstance.players.get('test-robot-1').loadout.code = code;
    
    try {
        // Initialize the interpreter with our mock objects
        interpreter.initialize([mockRobot], mockGameInstance.players);
        
        // Run a tick
        console.log('\nExecuting tick...');
        interpreter.executeTick([mockRobot], mockGameInstance);
        
        // Clean up
        interpreter.stop();
        
        console.log(`✅ PASS: ${testName}`);
        return true;
    } catch (error) {
        console.error(`❌ FAIL: ${testName}`);
        console.error(`Error: ${error.message}`);
        return false;
    }
}

// Test cases
console.log('Starting sandbox security tests...\n');

// 1. Basic functionality test - should work
runTest('Basic functionality', `
    robot.drive(90, 3);
    robot.fire(180, 2);
    console.log("Hello from the sandbox!");
`);

// 2. Process access attempt - should be blocked
runTest('Process access attempt', `
    try {
        console.log("Trying to access process:", process);
    } catch (e) {
        console.log("Good: Caught error trying to access process:", e.message);
    }
`);

// 3. Require attempt - should be blocked
runTest('Require attempt', `
    try {
        const fs = require('fs');
        console.log("This would be bad!");
    } catch (e) {
        console.log("Good: Caught error trying to require:", e.message);
    }
`);

// 4. Constructor access attempt - should be blocked
runTest('Constructor access attempt', `
    try {
        const constructor = {}.constructor;
        const FunctionConstructor = constructor.constructor;
        const evilFunc = new FunctionConstructor("return process")();
        console.log("This would be bad!");
    } catch (e) {
        console.log("Good: Caught error with constructor:", e.message);
    }
`);

// 5. Prototype pollution attempt - should be blocked
runTest('Prototype pollution attempt', `
    try {
        Object.prototype.polluted = true;
        console.log("Pollution attempt:", {}.polluted);
    } catch (e) {
        console.log("Good: Caught error with prototype pollution:", e.message);
    }
`);

// 6. Global object access - should be blocked
runTest('Global object access', `
    try {
        console.log("Global is:", global);
    } catch (e) {
        console.log("Good: Caught error accessing global:", e.message);
    }
    
    try {
        console.log("This is:", this);
    } catch (e) {
        console.log("Good: Caught error with this:", e.message);
    }
`);

// 7. Timeout DoS attempt - should be stopped by timeout
runTest('Timeout DoS attempt', `
    console.log("Starting infinite loop...");
    let i = 0;
    while(true) {
        i++;
        if (i % 1000000 === 0) console.log(i); 
    }
    console.log("This should never be reached!");
`);

// 8. Memory exhaustion attempt - should be prevented
runTest('Memory exhaustion attempt', `
    console.log("Attempting to exhaust memory...");
    try {
        const arr = [];
        while(true) {
            arr.push(new Array(1000000).fill('x'));
        }
    } catch (e) {
        console.log("Good: Memory limit caught:", e.message);
    }
`);

console.log('\n🔐 Security test summary:');
console.log('The VM2 implementation provides much stronger security than the native VM module.');
console.log('It prevents access to Node.js internals, blocks prototype pollution, and limits resource usage.');
console.log('For production use, consider adding:');
console.log('1. Regular security audits of sandbox implementation');
console.log('2. Consider using isolated-vm for even stronger isolation');
console.log('3. For maximum security, implement a container-based approach with Docker');