// Sniper Bot AI profile - Keeps distance and makes precise, powerful shots

// Initialize state if it doesn't exist
if (typeof state.dir === 'undefined') {
    state.dir = Math.random() * 360;
    state.scanTimer = 0;
    state.repositionTimer = 0;
    state.targetDir = null;
    state.targetRange = null;
    state.optimalRange = 350; // Optimal sniping distance
    state.engaged = false;
    console.log("Sniper Bot initialized.");
}

// --- Scanning for Targets ---
state.scanTimer++;
if (state.scanTimer > 20) { // Scan every 2/3 second
    // Perform a narrow, precise scan
    let scanResult = robot.scan(state.dir, 30);
    
    if (scanResult) {
        // Target acquired
        state.targetDir = scanResult.direction;
        state.targetRange = scanResult.distance;
        state.engaged = true;
        
        // Fire high-power shots from optimal range
        if (Math.abs(state.targetRange - state.optimalRange) < 100) {
            // Calculate potential angular error - simulate aiming precision
            const aimError = Math.random() * 6 - 3; // +/- 3 degrees of precision
            robot.fire(state.targetDir + aimError, 3); // Maximum power
        }
    } else if (state.engaged) {
        // Slowly track in the direction of last known target position
        state.dir = state.targetDir;
    } else {
        // No target - sweep scan area
        state.dir = (state.dir + 10) % 360;
    }
    
    state.scanTimer = 0;
}

// --- Movement & Positioning ---
if (state.engaged && state.targetRange !== null) {
    // Calculate direction to maintain optimal range
    let moveDir;
    
    if (state.targetRange < state.optimalRange - 50) {
        // Too close - back away
        moveDir = (state.targetDir + 180) % 360;
        robot.drive(moveDir, 3);
    } else if (state.targetRange > state.optimalRange + 50) {
        // Too far - move closer but not directly
        const approachOffset = 30; // Approach at an angle
        moveDir = (state.targetDir + (Math.random() < 0.5 ? approachOffset : -approachOffset)) % 360;
        robot.drive(moveDir, 2);
    } else {
        // At optimal range - strafe perpendicular to target
        const strafeDir = (state.targetDir + 90 + (Math.random() < 0.5 ? 0 : 180)) % 360;
        robot.drive(strafeDir, 1.5);
    }
    
    // Periodically reposition even at optimal range
    state.repositionTimer++;
    if (state.repositionTimer > 150) { // Every 5 seconds
        const newStrafeDir = (state.targetDir + 90 + (Math.random() < 0.5 ? 0 : 180)) % 360;
        robot.drive(newStrafeDir, 3);
        state.repositionTimer = 0;
    }
} else {
    // Patrol movement when no target
    robot.drive(state.dir, 1);
    
    // Check if near arena edges and avoid them
    const x = robot.getX();
    const y = robot.getY();
    
    if (x < 150 || x > 750 || y < 150 || y > 750) {
        // Calculate direction to arena center
        const centerDir = Math.atan2(450 - y, 450 - x) * 180 / Math.PI;
        robot.drive(centerDir < 0 ? centerDir + 360 : centerDir, 2);
    }
}