// Erratic Bot AI profile - Unpredictable movement and firing patterns

// Initialize state if it doesn't exist
if (typeof state.dir === 'undefined') {
    state.dir = Math.random() * 360;
    state.moveTimer = 0;
    state.moveMode = 'random';
    state.moveModeTimer = 0;
    state.scanTimer = 0;
    state.scanResults = [];
    state.fireChance = 0.5;
    console.log("Erratic Bot initialized.");
}

// --- Randomized Behavior Patterns ---
state.moveModeTimer++;
if (state.moveModeTimer > 120) { // Change behavior mode every 4 seconds
    const modes = ['random', 'zigzag', 'circles', 'still', 'charge'];
    state.moveMode = modes[Math.floor(Math.random() * modes.length)];
    state.fireChance = 0.3 + Math.random() * 0.6; // 30-90% chance to fire when target found
    state.moveModeTimer = 0;
}

// --- Scanning with randomized patterns ---
state.scanTimer++;
if (state.scanTimer > Math.floor(10 + Math.random() * 20)) { // Variable scan frequency
    // Random scan direction with variable width
    const scanDir = Math.random() * 360;
    const scanWidth = 20 + Math.random() * 60; // Between 20-80 degrees
    
    let scanResult = robot.scan(scanDir, scanWidth);
    if (scanResult) {
        // Store recent scan results (up to 3)
        state.scanResults.unshift(scanResult);
        if (state.scanResults.length > 3) state.scanResults.pop();
        
        // Random chance to fire when target found
        if (Math.random() < state.fireChance) {
            // Randomize target direction slightly
            const targetDir = scanResult.direction + (Math.random() * 10 - 5); // +/- 5 degrees
            
            // Random power between 1-3
            const power = Math.floor(Math.random() * 3) + 1;
            robot.fire(targetDir, power);
        }
    }
    
    state.scanTimer = 0;
}

// --- Movement based on current mode ---
state.moveTimer++;

switch (state.moveMode) {
    case 'random':
        // Change direction frequently and unpredictably
        if (state.moveTimer > 30) {
            state.dir = Math.random() * 360;
            state.moveTimer = 0;
        }
        // Random speed changes
        robot.drive(state.dir, 1 + Math.random() * 3);
        break;
        
    case 'zigzag':
        // Abrupt direction changes creating a zigzag pattern
        if (state.moveTimer > 45) {
            state.dir = (state.dir + 45 + Math.random() * 90) % 360;
            state.moveTimer = 0;
        }
        robot.drive(state.dir, 3);
        break;
        
    case 'circles':
        // Continuous rotation creating circular movement
        state.dir = (state.dir + 5) % 360;
        robot.drive((state.dir + 60) % 360, 2);
        break;
        
    case 'still':
        // Temporarily remain still, but turn in place
        state.dir = (state.dir + 8) % 360;
        robot.drive(state.dir, 0);
        break;
        
    case 'charge':
        // If target spotted recently, charge toward its last known position
        if (state.scanResults.length > 0) {
            const latestScan = state.scanResults[0];
            robot.drive(latestScan.direction, 5); // Full speed charge
        } else {
            // No recent target, move randomly
            robot.drive(state.dir, Math.random() * 4);
        }
        break;
}

// Wall avoidance - basic but slightly unpredictable
const x = robot.getX();
const y = robot.getY();
const margin = 120;

if (x < margin || x > 900 - margin || y < margin || y > 900 - margin) {
    // Calculate direction to center, but with some randomness
    let centerDir = Math.atan2(450 - y, 450 - x) * 180 / Math.PI;
    if (centerDir < 0) centerDir += 360;
    
    // Add some random variation to the escape direction
    const escapeDir = (centerDir + Math.random() * 60 - 30) % 360;
    robot.drive(escapeDir, 4);
    
    // Update internal direction
    state.dir = escapeDir;
}