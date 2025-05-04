// Defensive Bot AI profile - Evades and only shoots when threatened

// Initialize state if it doesn't exist
if (typeof state.dir === 'undefined') {
    state.dir = Math.random() * 360;
    state.scanTimer = 0;
    state.evasionTimer = 0;
    state.threatDir = null;
    state.threatRange = null;
    state.evading = false;
    state.wallAvoidanceTimer = 0;
    console.log("Defensive Bot initialized.");
}

// --- Scanning for Threats ---
state.scanTimer++;
if (state.scanTimer > 15) { // Frequent scanning (twice per second)
    // Full 360-degree scan to detect threats from any direction
    for (let scanAngle = 0; scanAngle < 360; scanAngle += 60) {
        let scanResult = robot.scan(scanAngle, 60);
        if (scanResult) {
            // Threat detected!
            state.threatDir = scanResult.direction;
            state.threatRange = scanResult.distance;
            state.evading = true;
            state.evasionTimer = 45; // Start evasive maneuvers for 1.5 seconds
            
            // Only fire if threat is close and we're not actively evading
            if (scanResult.distance < 200 && state.evasionTimer < 15) {
                robot.fire(state.threatDir, 1); // Low power defensive shots
            }
            
            break; // Exit scan loop once threat is found
        }
    }
    
    state.scanTimer = 0;
}

// --- Evasive Movement ---
if (state.evading) {
    if (state.evasionTimer > 0) {
        state.evasionTimer--;
        
        // Calculate evasion direction (perpendicular to threat direction)
        let evasionDir = (state.threatDir + 90 + (Math.random() < 0.5 ? 0 : 180)) % 360;
        
        // Move at medium-high speed to evade
        robot.drive(evasionDir, 4);
    } else {
        state.evading = false;
    }
} else {
    // Default defensive patrol - move in a large arc
    state.dir = (state.dir + 1) % 360;
    robot.drive(state.dir, 2);
    
    // Wall avoidance behavior
    state.wallAvoidanceTimer++;
    if (state.wallAvoidanceTimer > 60) { // Check every 2 seconds
        let x = robot.getX();
        let y = robot.getY();
        
        // If close to a wall, turn away
        if (x < 150 || x > 750 || y < 150 || y > 750) {
            // Calculate direction toward center
            let centerDir = Math.atan2(450 - y, 450 - x) * 180 / Math.PI;
            if (centerDir < 0) centerDir += 360;
            
            state.dir = centerDir;
        }
        
        state.wallAvoidanceTimer = 0;
    }
}