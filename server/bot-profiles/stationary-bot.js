// Stationary Bot AI profile - A simple non-moving, non-firing target

// Initialize state if it doesn't exist
if (typeof state.initialized === 'undefined') {
    state.initialized = true;
    console.log("Stationary Target Bot initialized.");
    
    // Pick a static position that's not too close to the edge
    state.fixedX = 300 + Math.floor(Math.random() * 300); // Between 300-600
    state.fixedY = 300 + Math.floor(Math.random() * 300); // Between 300-600
    
    // Move to the fixed position on first initialization
    const x = robot.getX();
    const y = robot.getY();
    
    // Calculate direction to target position
    const dx = state.fixedX - x;
    const dy = state.fixedY - y;
    const targetDir = Math.atan2(-dy, dx) * 180 / Math.PI;
    const direction = targetDir < 0 ? targetDir + 360 : targetDir;
    
    // Initial movement to position (will stop once there)
    state.movingToPosition = true;
    state.moveDirection = direction;
}

// Check if we need to move to our fixed position
if (state.movingToPosition) {
    const x = robot.getX();
    const y = robot.getY();
    
    // Check if we've reached the target position (within 10 pixels)
    const dx = state.fixedX - x;
    const dy = state.fixedY - y;
    const distanceSquared = dx * dx + dy * dy;
    
    if (distanceSquared <= 100) { // 10^2 
        // We've reached our position, stop moving
        state.movingToPosition = false;
        robot.drive(0, 0); // Stop
    } else {
        // Keep moving toward the position
        robot.drive(state.moveDirection, 3);
    }
} else {
    // Stand completely still - no movement or scanning
    robot.drive(0, 0);
}