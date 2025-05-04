// Aggressive Bot AI profile - Relentlessly pursues and fires powerful shots

// Initialize state if it doesn't exist
if (typeof state.dir === 'undefined') {
    state.dir = Math.random() * 360; // Start in a random direction
    state.scanTimer = 0;
    state.targetDir = null;
    state.targetRange = null;
    state.huntMode = false;
    console.log("Aggressive Bot initialized.");
}

// --- Scanning for Target ---
state.scanTimer++;
let scanWidth = state.huntMode ? 30 : 90; // Narrow scan when hunting, wide scan when searching

if (state.scanTimer > 15) { // Scan more frequently (twice per second)
    let scanDir = state.targetDir !== null ? state.targetDir : state.dir;
    let scanResult = robot.scan(scanDir, scanWidth);
    
    if (scanResult) {
        // Target acquired!
        state.targetDir = scanResult.direction;
        state.targetRange = scanResult.distance;
        state.huntMode = true;
        
        // Fire at high power when close, medium power when farther
        let firePower = state.targetRange < 200 ? 3 : 2;
        robot.fire(state.targetDir, firePower);
    } else if (state.huntMode) {
        // Lost the target, widen search around last known direction
        state.huntMode = false;
        // Reset after losing target
        if (Math.random() < 0.3) {
            state.targetDir = null;
        }
    }
    
    state.scanTimer = 0;
}

// --- Movement ---
if (state.huntMode && state.targetDir !== null) {
    // Pursuit mode - move toward target
    robot.drive(state.targetDir, 5); // Maximum speed toward target
} else {
    // Search mode - spin in place to find target
    robot.drive((state.dir + 5) % 360, 1); // Slow turn to search
    state.dir = (state.dir + 5) % 360;
}