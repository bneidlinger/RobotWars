// Standard Bot AI profile - A balanced, straightforward opponent

// Initialize state if it doesn't exist
if (typeof state.dir === 'undefined') {
    state.dir = Math.random() * 360; // Start in a random direction
    state.moveTimer = 0;
    state.scanTimer = 0;
    console.log("Standard Bot initialized.");
}

// --- Movement ---
state.moveTimer++;
// Drive straight most of the time
robot.drive(state.dir, 2);
// Turn ~ every 3 seconds (assuming 30 ticks/sec)
if (state.moveTimer > 90) {
    state.dir = (state.dir + (Math.random() * 90 - 45)) % 360; // Turn randomly +/- 45 deg
    state.moveTimer = 0;
}

// --- Scanning & Firing ---
state.scanTimer++;
// Scan less frequently than moving, ~ every 1 second
if (state.scanTimer > 30) {
    let scanResult = robot.scan(state.dir, 45); // Scan ahead in a 45 deg arc
    if (scanResult) {
        // Aim and fire!
        robot.fire(scanResult.direction, 1); // Fire low power shots
    }
    state.scanTimer = 0;
}