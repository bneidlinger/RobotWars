// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db'); // Import db module

const router = express.Router();
const saltRounds = 10; // Cost factor for bcrypt hashing

// --- DEFINE DEFAULT SNIPPETS ---
// (Code content copied from client/js/utils/storage.js)
const defaultSnippets = [
    {
        name: 'Simple Tank',
        code: `// Simple Tank Bot (using state object)\n// Moves in a straight line until hit, then changes direction\n\n// Initialize state ONCE\nif (typeof state.currentDirection === 'undefined') {\n    state.currentDirection = 0;\n    state.lastDamage = 0; // Track damage from previous tick\n    console.log('Simple Tank Initialized');\n}\n\n// Check if damage increased since last tick\nif (robot.damage() > state.lastDamage) {\n    console.log('Tank hit! Changing direction.');\n    state.currentDirection = (state.currentDirection + 90 + Math.random() * 90) % 360;\n}\nstate.lastDamage = robot.damage(); // Update damage tracking\n\n// Move forward\nrobot.drive(state.currentDirection, 3);\n\n// Scan for enemies - use 'let' for temporary variable\nlet scanResult = robot.scan(state.currentDirection, 45);\n\n// Fire if enemy detected\nif (scanResult) {\n    robot.fire(scanResult.direction, 2);\n}`
    },
    {
        name: 'Scanner Bot',
        code: `// Scanner Bot (using state object)\n// Constantly rotates scanner and moves/fires if enemy found\n\n// Initialize state ONCE\nif (typeof state.scanAngle === 'undefined') {\n    state.scanAngle = 0;\n    console.log('Scanner Bot Initialized');\n}\n\n// Rotate scan angle\nstate.scanAngle = (state.scanAngle + 5) % 360;\n\n// Scan for enemies - Use 'let' because it's recalculated each tick\nlet scanResult = robot.scan(state.scanAngle, 20);\n\n// If enemy detected, move toward it and fire\nif (scanResult) {\n    robot.drive(scanResult.direction, 3);\n    robot.fire(scanResult.direction, 3);\n} else {\n    // If no enemy, keep rotating but move slowly forward\n    robot.drive(state.scanAngle, 1);\n}`
    },
    {
        name: 'Aggressive Bot',
        code: `// Aggressive Bot (using state object)\n// Seeks out enemies and fires continuously\n\n// Initialize state ONCE\nif (typeof state.targetDirection === 'undefined') {\n    state.targetDirection = null;\n    state.searchDirection = 0;\n    state.searchMode = true;\n    state.timeSinceScan = 0;\n    console.log('Aggressive Bot Initialized');\n}\n\nstate.timeSinceScan++;\n\n// If we have a target, track and fire\nif (!state.searchMode && state.targetDirection !== null) {\n    if (state.timeSinceScan > 5) {\n        // scanResult is correctly scoped here with 'const'\n        const scanResult = robot.scan(state.targetDirection, 15);\n        state.timeSinceScan = 0;\n\n        if (scanResult) {\n            state.targetDirection = scanResult.direction;\n        } else {\n            console.log('Aggro Bot lost target, returning to search.');\n            state.searchMode = true;\n            state.targetDirection = null;\n        }\n    }\n    if (state.targetDirection !== null) {\n        robot.drive(state.targetDirection, 4);\n        robot.fire(state.targetDirection, 3);\n    }\n\n} else { // In search mode\n    if (state.timeSinceScan > 2) {\n        state.searchDirection = (state.searchDirection + 15) % 360;\n        // scanResult is correctly scoped here with 'const'\n        const scanResult = robot.scan(state.searchDirection, 30);\n        state.timeSinceScan = 0;\n\n        if (scanResult) {\n            console.log('Aggro Bot found target!');\n            state.targetDirection = scanResult.direction;\n            state.searchMode = false;\n            robot.drive(state.targetDirection, 4);\n            robot.fire(state.targetDirection, 3);\n        } else {\n            robot.drive(state.searchDirection, 1);\n        }\n    } else {\n         robot.drive(state.searchDirection, 1);\n    }\n}`
    },
    {
    name: 'Spider Bot',
    code: `// Spider Bot AI - Ambush Tactician
// This bot uses a multi-phase strategy:
// 1. Patrol - move to walls and along them
// 2. Observe - scan widely for enemies
// 3. Ambush - when enemy spotted, close distance and attack with precision

// Initialize state values ONCE
if (typeof state.phase === 'undefined') {
    // Main state tracking
    state.phase = 'patrol';  // 'patrol', 'observe', 'ambush'
    state.patrolDirection = Math.floor(Math.random() * 4) * 90; // Random initial direction
    state.observeCounter = 0;
    state.scanAngle = 0;
    state.targetInfo = null;
    state.lastDamage = 0;
    state.wallProximity = false;
    state.stuckCounter = 0;
    state.lastX = null;
    state.lastY = null;
    state.changeDirectionCounter = 0;

    // Advanced targeting
    state.targetHistory = [];
    state.missCounter = 0;
    state.hitCounter = 0;

    console.log("Spider Bot initialized in patrol phase.");
}

// --- UTILITY FUNCTIONS ---

// Track if we're stuck by checking position changes
function checkIfStuck() {
    if (state.lastX === null) {
        state.lastX = robot.getX();
        state.lastY = robot.getY();
        return false;
    }

    const currentX = robot.getX();
    const currentY = robot.getY();
    const distance = Math.sqrt(Math.pow(currentX - state.lastX, 2) + Math.pow(currentY - state.lastY, 2));

    state.lastX = currentX;
    state.lastY = currentY;

    // If barely moving, increment stuck counter
    if (distance < 0.5) {
        state.stuckCounter++;
        if (state.stuckCounter > 5) {
            state.stuckCounter = 0;
            return true;
        }
    } else {
        state.stuckCounter = 0;
    }

    return false;
}

// Calculate distance to arena edge in specific direction
function distanceToWall(direction) {
    const angleRad = direction * Math.PI / 180;
    const x = robot.getX();
    const y = robot.getY();

    // Calculate distances to walls based on direction
    let distX, distY;
    if (Math.cos(angleRad) > 0) {
        distX = (900 - 15) - x; // Right wall (arena width minus robot radius)
    } else {
        distX = x - 15; // Left wall (considering robot radius)
    }

    if (Math.sin(angleRad) > 0) {
        distY = y - 15; // Bottom wall (considering robot radius and inverted Y)
    } else {
        distY = (900 - 15) - y; // Top wall (arena height minus robot radius)
    }

    // Adjust for angle
    const cosAbs = Math.abs(Math.cos(angleRad));
    const sinAbs = Math.abs(Math.sin(angleRad));

    if (cosAbs < 0.001) return distY / sinAbs;
    if (sinAbs < 0.001) return distX / cosAbs;

    return Math.min(distX / cosAbs, distY / sinAbs);
}

// Predict enemy position based on movement history
function predictTargetPosition() {
    if (!state.targetInfo || state.targetHistory.length < 3) return state.targetInfo;

    // Calculate average velocity from history
    let sumDx = 0;
    let sumDy = 0;

    for (let i = 1; i < state.targetHistory.length; i++) {
        const prev = state.targetHistory[i-1];
        const curr = state.targetHistory[i];
        sumDx += curr.x - prev.x;
        sumDy += curr.y - prev.y;
    }

    const avgDx = sumDx / (state.targetHistory.length - 1);
    const avgDy = sumDy / (state.targetHistory.length - 1);

    // Predict position with lead time based on distance
    const leadTime = state.targetInfo.distance / 15; // Adjust factor based on missile speed

    const predicted = {
        x: state.targetInfo.x + avgDx * leadTime,
        y: state.targetInfo.y + avgDy * leadTime,
        distance: state.targetInfo.distance // Will recalculate
    };

    // Recalculate direction and distance to predicted position
    const myX = robot.getX();
    const myY = robot.getY();
    const dx = predicted.x - myX;
    const dy = myY - predicted.y; // Y is inverted in canvas coordinates

    predicted.direction = Math.atan2(dy, dx) * 180 / Math.PI;
    predicted.direction = (predicted.direction + 360) % 360; // Normalize

    predicted.distance = Math.sqrt(dx*dx + dy*dy);

    return predicted;
}

// --- PHASE HANDLERS ---

// Patrol mode - move along walls to find good ambush positions
function handlePatrol() {
    const isStuck = checkIfStuck();
    state.changeDirectionCounter++;

    // Scan while moving
    const scanDir = (state.patrolDirection + 45) % 360;
    const scanResult = robot.scan(scanDir, 90);

    // If enemy found, switch to ambush
    if (scanResult) {
        state.targetInfo = scanResult;
        state.targetInfo.x = robot.getX() + Math.cos(scanResult.direction * Math.PI / 180) * scanResult.distance;
        state.targetInfo.y = robot.getY() - Math.sin(scanResult.direction * Math.PI / 180) * scanResult.distance;
        state.targetHistory = [{ x: state.targetInfo.x, y: state.targetInfo.y, time: Date.now() }];
        state.phase = 'ambush';
        console.log(\`Spider found prey at distance \${scanResult.distance.toFixed(0)}! Switching to ambush mode.\`);
        return;
    }

    // Check distance to wall in current direction
    const wallDist = distanceToWall(state.patrolDirection);

    // Decision logic for patrol
    if (isStuck || state.changeDirectionCounter > 60 || (state.wallProximity && wallDist > 200)) {
        // Turn roughly 90 degrees when stuck, been going too long in one direction, or lost wall contact
        const turnAmount = 90 + (Math.random() * 20 - 10);
        state.patrolDirection = (state.patrolDirection + turnAmount) % 360;
        state.wallProximity = false;
        state.changeDirectionCounter = 0;
        console.log(\`Spider changing patrol direction to \${state.patrolDirection.toFixed(0)}°\`);
    }
    else if (wallDist < 50 && !state.wallProximity) {
        // Found a wall, align with it
        state.wallProximity = true;
        // Turn to move along the wall (roughly 90 degrees)
        state.patrolDirection = (state.patrolDirection + 90) % 360;
        console.log(\`Spider found wall. Aligning to move along it: \${state.patrolDirection.toFixed(0)}°\`);
    }

    // If we've been patrolling for a while, switch to observe mode
    if (Math.random() < 0.005) { // Small chance each tick
        state.phase = 'observe';
        state.observeCounter = 0;
        console.log("Spider entering observation mode...");
        return;
    }

    // Move in patrol direction
    robot.drive(state.patrolDirection, 2); // Slower movement for better control
}

// Observe mode - scan extensively around for enemies
function handleObserve() {
    // Increment counter and rotate scan angle
    state.observeCounter++;
    state.scanAngle = (state.scanAngle + 15) % 360;

    // Do a wide scan
    const scanResult = robot.scan(state.scanAngle, 30);

    // If enemy found, switch to ambush
    if (scanResult) {
        state.targetInfo = scanResult;
        state.targetInfo.x = robot.getX() + Math.cos(scanResult.direction * Math.PI / 180) * scanResult.distance;
        state.targetInfo.y = robot.getY() - Math.sin(scanResult.direction * Math.PI / 180) * scanResult.distance;
        state.targetHistory = [{ x: state.targetInfo.x, y: state.targetInfo.y, time: Date.now() }];
        state.phase = 'ambush';
        console.log(\`Spider spotted prey at distance \${scanResult.distance.toFixed(0)}! Entering ambush mode.\`);
        return;
    }

    // After complete 360° scan or timeout, switch back to patrol
    if (state.observeCounter >= 24) { // 24 * 15° = 360°
        state.phase = 'patrol';
        console.log("Observation complete. Returning to patrol pattern.");
        return;
    }

    // Rotate in place while scanning
    robot.drive(state.scanAngle, 0.5);
}

// Ambush mode - attack target with precision
function handleAmbush() {
    // Verify target still exists with narrow scan in last known direction
    const scanResolution = 20;
    const scanResult = robot.scan(state.targetInfo.direction, scanResolution);

    if (scanResult) {
        // Update target information
        state.targetInfo = scanResult;
        state.targetInfo.x = robot.getX() + Math.cos(scanResult.direction * Math.PI / 180) * scanResult.distance;
        state.targetInfo.y = robot.getY() - Math.sin(scanResult.direction * Math.PI / 180) * scanResult.distance;

        // Update target history for prediction
        state.targetHistory.push({
            x: state.targetInfo.x,
            y: state.targetInfo.y,
            time: Date.now()
        });

        // Keep history at manageable size
        if (state.targetHistory.length > 5) {
            state.targetHistory.shift();
        }

        // Get predicted target position if we have enough history
        let firingDirection = scanResult.direction;
        if (state.targetHistory.length >= 3) {
            const predicted = predictTargetPosition();
            firingDirection = predicted.direction;
        }

        // Approach or maintain optimal attack distance
        const optimalDistance = 150;
        const approachSpeed = scanResult.distance > optimalDistance ? 3 :
                              scanResult.distance < optimalDistance / 2 ? -3 : 0;

        // Move toward target while adjusting distance
        robot.drive(scanResult.direction, approachSpeed);

        // Fire at predicted position with adaptive power based on distance
        const firePower = scanResult.distance < 100 ? 3 :
                          scanResult.distance < 300 ? 2 : 1;
        const fireResult = robot.fire(firingDirection, firePower);

        // Track hits and misses for future improvement
        if (fireResult) {
            // TODO: In a more advanced version, we could track time to hit
            state.hitCounter++;
        } else {
            state.missCounter++;
        }
    } else {
        // Lost target, expand search briefly
        state.targetInfo.direction = (state.targetInfo.direction + (Math.random() * 40 - 20)) % 360;
        const widerScanResult = robot.scan(state.targetInfo.direction, scanResolution * 2);

        if (widerScanResult) {
            // Found again with wider scan
            state.targetInfo = widerScanResult;
            state.targetInfo.x = robot.getX() + Math.cos(widerScanResult.direction * Math.PI / 180) * widerScanResult.distance;
            state.targetInfo.y = robot.getY() - Math.sin(widerScanResult.direction * Math.PI / 180) * widerScanResult.distance;
            console.log("Spider reacquired target with wider scan!");
        } else {
            // Target truly lost, switch back to observe mode
            console.log("Target lost. Switching to observation mode.");
            state.phase = 'observe';
            state.observeCounter = 0;
            state.targetInfo = null;
            return;
        }
    }
}

// Check for damage and respond
function handleDamage() {
    if (robot.damage() > state.lastDamage) {
        const damageAmount = robot.damage() - state.lastDamage;
        state.lastDamage = robot.damage();

        // Heavy damage response
        if (damageAmount > 10) {
            console.log(\`Spider took significant damage (\${damageAmount.toFixed(1)}). Taking evasive action!\`);
            // Randomly choose between doubling down (if in ambush) or retreating
            if (state.phase === 'ambush' && state.targetInfo && Math.random() < 0.6) {
                // Double down - attack more aggressively
                console.log("Spider aggressively countering attack!");
            } else {
                // Retreat and reset phase
                const retreatDirection = (robot.getDirection() + 180) % 360;
                robot.drive(retreatDirection, 5);
                state.phase = 'patrol';
                state.patrolDirection = retreatDirection;
                return true; // Signal retreat handled
            }
        }
    }

    // Update damage tracking regardless
    state.lastDamage = robot.damage();
    return false;
}

// --- MAIN LOOP EXECUTION ---

// First check for damage response
const retreating = handleDamage();
if (!retreating) {
    // Execute current phase logic if not retreating
    switch (state.phase) {
        case 'patrol':
            handlePatrol();
            break;
        case 'observe':
            handleObserve();
            break;
        case 'ambush':
            handleAmbush();
            break;
        default:
            // Failsafe - reset to patrol
            state.phase = 'patrol';
            console.log("Invalid phase detected. Resetting to patrol.");
            handlePatrol();
    }
}`
},
{
    name: 'Rover Bot',
    code: `// Rover Bot AI - Exploration Strategist
// A methodical bot that explores the arena in a grid pattern,
// mapping out sectors and engaging enemies with calculated precision.

// Initialize state values ONCE
if (typeof state.initialized === 'undefined') {
    // Core state tracking
    state.initialized = true;
    state.mode = 'explore';  // 'explore', 'engage', 'retreat'
    state.lastDamage = 0;
    state.moveSpeed = 3;

    // Position tracking
    state.lastX = robot.getX();
    state.lastY = robot.getY();
    state.stuckCounter = 0;

    // Grid-based exploration
    state.gridSize = 150;
    state.currentQuadrant = { x: 0, y: 0 };
    state.visitedQuadrants = {};
    state.explorationDirection = Math.floor(Math.random() * 4) * 90;
    state.destinationQuadrant = null;

    // Combat tracking
    state.targetInfo = null;
    state.targetLastSeen = 0;
    state.scanDirection = 0;
    state.engagementStartDamage = 0;
    state.firePattern = 0;
    state.targetHistory = [];

    // Calculate initial quadrant
    updateCurrentQuadrant();

    console.log("Rover Bot initialized. Beginning grid exploration protocol.");
}

// --- UTILITY FUNCTIONS ---

// Update the current grid quadrant based on position
function updateCurrentQuadrant() {
    const x = robot.getX();
    const y = robot.getY();

    state.currentQuadrant = {
        x: Math.floor(x / state.gridSize),
        y: Math.floor(y / state.gridSize)
    };

    // Mark current quadrant as visited
    const quadKey = \`\${state.currentQuadrant.x},\${state.currentQuadrant.y}\`;
    state.visitedQuadrants[quadKey] = (state.visitedQuadrants[quadKey] || 0) + 1;
}

// Check if the robot is stuck by monitoring position changes
function checkIfStuck() {
    const x = robot.getX();
    const y = robot.getY();

    const distance = Math.sqrt(Math.pow(x - state.lastX, 2) + Math.pow(y - state.lastY, 2));

    state.lastX = x;
    state.lastY = y;

    // If barely moving, increment stuck counter
    if (distance < 1) {
        state.stuckCounter++;
        if (state.stuckCounter > 5) {
            state.stuckCounter = 0;
            return true;
        }
    } else {
        // Reset counter if moving properly
        state.stuckCounter = Math.max(0, state.stuckCounter - 1);
    }

    return false;
}

// Find least visited adjacent quadrant for exploration
function findNextExplorationTarget() {
    const current = state.currentQuadrant;
    const adjacentQuadrants = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 }
    ];

    // Filter out quadrants outside the arena
    const validQuadrants = adjacentQuadrants.filter(q =>
        q.x >= 0 && q.x < 900/state.gridSize &&
        q.y >= 0 && q.y < 900/state.gridSize
    );

    // Find the least visited quadrant
    let leastVisited = validQuadrants[0];
    let leastVisitCount = Infinity;

    for (const q of validQuadrants) {
        const quadKey = \`\${q.x},\${q.y}\`;
        const visitCount = state.visitedQuadrants[quadKey] || 0;

        if (visitCount < leastVisitCount) {
            leastVisited = q;
            leastVisitCount = visitCount;
        }
    }

    return leastVisited;
}

// Calculate center coordinates of a quadrant
function quadrantCenter(quadrant) {
    return {
        x: (quadrant.x * state.gridSize) + (state.gridSize / 2),
        y: (quadrant.y * state.gridSize) + (state.gridSize / 2)
    };
}

// Calculate direction to a point
function directionTo(targetX, targetY) {
    const dx = targetX - robot.getX();
    const dy = robot.getY() - targetY; // Y is inverted in canvas

    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < 0) angle += 360;

    return angle;
}

// Calculate distance to a point
function distanceTo(targetX, targetY) {
    const dx = targetX - robot.getX();
    const dy = targetY - robot.getY();
    return Math.sqrt(dx*dx + dy*dy);
}

// Predict target position based on movement history
function predictTargetPosition() {
    if (!state.targetInfo || state.targetHistory.length < 3) {
        return state.targetInfo;
    }

    // Calculate average velocity vector
    let totalDx = 0;
    let totalDy = 0;
    const historyCount = state.targetHistory.length - 1;

    for (let i = 1; i < state.targetHistory.length; i++) {
        const prev = state.targetHistory[i-1];
        const curr = state.targetHistory[i];
        totalDx += curr.x - prev.x;
        totalDy += curr.y - prev.y;
    }

    const avgVx = totalDx / historyCount;
    const avgVy = totalDy / historyCount;

    // Adjust prediction based on target distance
    const predictionFactor = state.targetInfo.distance / 120;

    // Predict future position
    const predictedX = state.targetInfo.x + (avgVx * predictionFactor);
    const predictedY = state.targetInfo.y + (avgVy * predictionFactor);

    // Calculate direction to the predicted position
    const predictedDirection = directionTo(predictedX, predictedY);

    return {
        direction: predictedDirection,
        distance: distanceTo(predictedX, predictedY),
        x: predictedX,
        y: predictedY
    };
}

// --- MODE HANDLERS ---

// Exploration mode - grid-based searching
function handleExplore() {
    // First check if we're stuck
    if (checkIfStuck()) {
        console.log("Rover detection: Navigation obstacle. Changing direction.");
        state.explorationDirection = (state.explorationDirection + 90 + Math.floor(Math.random() * 180)) % 360;
        robot.drive(state.explorationDirection, state.moveSpeed);
        return;
    }

    // Update our current quadrant position
    updateCurrentQuadrant();

    // Wide scan while exploring
    state.scanDirection = (state.scanDirection + 45) % 360;
    const scanResult = robot.scan(state.scanDirection, 60);

    // If enemy found, switch to engage mode
    if (scanResult) {
        console.log(\`Rover detected target at range \${scanResult.distance.toFixed(0)}. Initiating engagement protocol.\`);
        state.mode = 'engage';
        state.targetInfo = scanResult;

        // Calculate absolute target position for tracking
        const angleRad = scanResult.direction * Math.PI / 180;
        state.targetInfo.x = robot.getX() + Math.cos(angleRad) * scanResult.distance;
        state.targetInfo.y = robot.getY() - Math.sin(angleRad) * scanResult.distance;

        // Reset target history
        state.targetHistory = [{
            x: state.targetInfo.x,
            y: state.targetInfo.y,
            time: Date.now()
        }];

        state.engagementStartDamage = robot.damage();
        return;
    }

    // If we have a destination quadrant, check if we've reached it
    if (state.destinationQuadrant) {
        const center = quadrantCenter(state.destinationQuadrant);
        const distance = distanceTo(center.x, center.y);

        if (distance < 20) {
            // Reached destination quadrant
            console.log(\`Rover has reached quadrant (\${state.destinationQuadrant.x},\${state.destinationQuadrant.y}). Continuing exploration.\`);
            state.destinationQuadrant = null;
        } else {
            // Continue moving to destination
            const direction = directionTo(center.x, center.y);
            robot.drive(direction, state.moveSpeed);
            return;
        }
    }

    // Select new destination if needed
    if (!state.destinationQuadrant) {
        state.destinationQuadrant = findNextExplorationTarget();
        console.log(\`Rover plotting course to quadrant (\${state.destinationQuadrant.x},\${state.destinationQuadrant.y}).\`);

        const center = quadrantCenter(state.destinationQuadrant);
        state.explorationDirection = directionTo(center.x, center.y);
    }

    // Move toward destination quadrant
    robot.drive(state.explorationDirection, state.moveSpeed);
}

// Engagement mode - combat with target
function handleEngage() {
    const now = Date.now();
    const targetAge = now - state.targetLastSeen;

    // Try to locate the target
    let scanResolution = 15;
    let targetDirection = state.targetInfo ? state.targetInfo.direction : state.scanDirection;

    // Scan with priority in last known direction, but widen search if target aging
    if (targetAge > 1000) {
        scanResolution = Math.min(45, 15 + Math.floor(targetAge / 200));
        // Also scan in more directions if target getting old
        if (targetAge > 2000) {
            state.scanDirection = (state.scanDirection + 60) % 360;
            targetDirection = state.scanDirection;
        }
    }

    const scanResult = robot.scan(targetDirection, scanResolution);

    if (scanResult) {
        // Target found
        state.targetInfo = scanResult;
        state.targetLastSeen = now;

        // Calculate absolute position
        const angleRad = scanResult.direction * Math.PI / 180;
        state.targetInfo.x = robot.getX() + Math.cos(angleRad) * scanResult.distance;
        state.targetInfo.y = robot.getY() - Math.sin(angleRad) * scanResult.distance;

        // Update target history
        state.targetHistory.push({
            x: state.targetInfo.x,
            y: state.targetInfo.y,
            time: now
        });

        // Keep history manageable
        if (state.targetHistory.length > 6) {
            state.targetHistory.shift();
        }

        // Determine optimal engagement distance based on damage taken
        const damageTaken = robot.damage() - state.engagementStartDamage;
        let optimalDistance;

        if (damageTaken > 20) {
            // Taking significant damage, keep distance
            optimalDistance = 250;
            state.moveSpeed = 4; // Move faster when under threat
        } else {
            // Normal engagement
            optimalDistance = 175;
            state.moveSpeed = 3;
        }

        // Get predicted target position
        const predicted = predictTargetPosition();

        // Movement logic - maintain optimal distance
        const targetDistance = scanResult.distance;
        const moveDirection = scanResult.direction;

        let moveSpeed;
        if (targetDistance > optimalDistance + 30) {
            // Too far, move closer
            moveSpeed = state.moveSpeed;
        } else if (targetDistance < optimalDistance - 30) {
            // Too close, back away
            moveSpeed = -state.moveSpeed;
        } else {
            // At good distance, strafe
            moveSpeed = 0.5;
            // Orbit the target
            const strafeDirection = (scanResult.direction + 90) % 360;
            robot.drive(strafeDirection, moveSpeed);
            // Don't continue with the approach code
            moveSpeed = 0;
        }

        if (moveSpeed !== 0) {
            // Direct approach/retreat
            robot.drive(moveDirection, moveSpeed);
        }

        // Fire with pattern variation for unpredictability
        state.firePattern = (state.firePattern + 1) % 3;
        let fireDirection;

        if (state.firePattern === 0 || state.targetHistory.length < 3) {
            // Direct fire
            fireDirection = scanResult.direction;
        } else {
            // Predictive fire
            fireDirection = predicted.direction;
        }

        // Adjust power based on distance
        const firePower = targetDistance < 100 ? 3 :
                          targetDistance < 250 ? 2 : 1;

        robot.fire(fireDirection, firePower);

    } else {
        // Target not found in scan

        // If target is definitely lost, return to explore mode
        if (targetAge > 3000 || !state.targetInfo) {
            console.log("Rover has lost target contact. Returning to exploration protocol.");
            state.mode = 'explore';
            state.targetInfo = null;
            return;
        }

        // Otherwise move toward last known position while widening search
        if (state.targetInfo) {
            robot.drive(state.targetInfo.direction, state.moveSpeed * 0.5);
        } else {
            // Default to spinning in place if truly lost
            robot.drive(state.scanDirection, 0);
        }
    }
}

// Retreat mode - get to safety after taking damage
function handleRetreat() {
    // Only stay in retreat mode for a short time
    if (state.retreatTimer <= 0) {
        console.log("Rover retreat complete. Returning to exploration.");
        state.mode = 'explore';
        return;
    }

    state.retreatTimer--;

    // Continue moving in retreat direction
    robot.drive(state.retreatDirection, state.moveSpeed);

    // Scan behind to see if being followed
    const backScanDir = (state.retreatDirection + 180) % 360;
    const scanResult = robot.scan(backScanDir, 30);

    if (scanResult) {
        // Target following - fire backwards to deter
        robot.fire(scanResult.direction, 1);
    }
}

// --- DAMAGE HANDLER ---

// Check for damage and react
function handleDamage() {
    const currentDamage = robot.damage();
    const damageIncrease = currentDamage - state.lastDamage;

    if (damageIncrease > 0) {
        // Update last damage
        state.lastDamage = currentDamage;

        // Significant damage taken
        if (damageIncrease > 15) {
            console.log(\`Rover alert: Sustained significant damage (\${damageIncrease.toFixed(1)}). Initiating tactical retreat.\`);

            // Set retreat direction away from current heading
            state.retreatDirection = (robot.getDirection() + 180) % 360;
            state.retreatTimer = 30; // Retreat for 30 ticks
            state.mode = 'retreat';
            return true;
        }
        // Moderate damage
        else if (damageIncrease > 5 && state.mode === 'engage') {
            // Modify engagement strategy but don't retreat
            console.log(\`Rover damage report: Taking fire (\${damageIncrease.toFixed(1)}). Adjusting engagement pattern.\`);

            // Increase movement speed and strafe more
            state.moveSpeed = 4;
        }
    } else {
        // Update last damage tracking regardless
        state.lastDamage = currentDamage;
    }

    return false;
}

// --- MAIN EXECUTION ---

// Check for damage first - may change mode
const isRetreating = handleDamage();

if (!isRetreating) {
    // Handle current mode
    switch (state.mode) {
        case 'explore':
            handleExplore();
            break;
        case 'engage':
            handleEngage();
            break;
        case 'retreat':
            handleRetreat();
            break;
        default:
            // Fallback if somehow in invalid mode
            console.log("Rover error: Invalid mode detected. Resetting to explore.");
            state.mode = 'explore';
            handleExplore();
    }
}`
}
];
// --- END DEFAULT SNIPPETS ---


// --- Registration ---
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // --- Basic Server-Side Validation ---
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    if (password.length < 4 || password.length > 10) {
        return res.status(400).json({ message: 'Password must be between 4 and 10 characters.' });
    }
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
         return res.status(400).json({ message: 'Password must be alphanumeric.' });
    }
    if (username.length < 3 || username.length > 20) {
         return res.status(400).json({ message: 'Username must be between 3 and 20 characters.' });
    }
     if (!/^[a-zA-Z0-9_]+$/.test(username)) { // Allow underscore in username
          return res.status(400).json({ message: 'Username must be alphanumeric or underscore.' });
     }
    // --- End Validation ---

    // --- Use Database Transaction ---
    let client = null; // Define client variable outside try
    try {
        // 1. Connect a client from the pool
        client = await db.pool.connect();
        console.log(`[Auth Register] DB client acquired for ${username}`);

        // 2. Start Transaction
        await client.query('BEGIN');
        console.log(`[Auth Register] Transaction BEGIN for ${username}`);

        // 3. Check if username already exists WITHIN transaction for safety
        // (Unique constraint will catch race conditions, but this check provides
        // a slightly cleaner exit path if the user was created between the
        // pre-check (if we had one) and BEGIN)
        const existingUser = await client.query('SELECT id FROM users WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            await client.query('ROLLBACK'); // Abort transaction
            // DO NOT release client here, finally block handles it.
            console.log(`[Auth Register] Registration failed: Username '${username}' already taken. Transaction ROLLBACK.`);
            return res.status(409).json({ message: 'Username already taken.' });
        }

        // 4. Hash the password
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 5. Insert the new user (Use the client)
        const newUserResult = await client.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
            [username, passwordHash]
        );
        const newUserId = newUserResult.rows[0].id;
        const newUsername = newUserResult.rows[0].username;
        console.log(`[Auth Register] User inserted for ${username} (ID: ${newUserId}).`);

        // 6. Insert Default Snippets (Use the client)
        console.log(`[Auth Register] Inserting ${defaultSnippets.length} default snippets for user ID ${newUserId}...`);
        const snippetInsertPromises = defaultSnippets.map(snippet => {
            return client.query(
                'INSERT INTO code_snippets (user_id, name, code) VALUES ($1, $2, $3)',
                [newUserId, snippet.name, snippet.code]
            );
        });
        // Wait for all snippet inserts to complete
        await Promise.all(snippetInsertPromises);
        console.log(`[Auth Register] Default snippets inserted for user ID ${newUserId}.`);

        // 7. Commit Transaction
        await client.query('COMMIT');
        console.log(`[Auth Register] Transaction COMMIT for ${username}.`);

        // --- Transaction successful, now handle session and response ---
        console.log(`[Auth Register] User registered successfully: ${newUsername} (ID: ${newUserId})`);
        req.session.regenerate((err) => {
            if (err) {
                console.error(`[Auth Register] Session regeneration error after registration for ${username}:`, err);
                // Still return success, but log the session error
                return res.status(201).json({
                    message: 'Registration successful, but session creation failed.',
                    user: { id: newUserId, username: newUsername }
                });
            }
            req.session.userId = newUserId;
            req.session.username = newUsername;
            console.log(`[Auth Register] Session created for ${username}.`);
            res.status(201).json({ // 201 Created
                message: 'Registration successful!',
                user: { id: newUserId, username: newUsername }
            });
        });

    } catch (error) {
        // --- Error Handling ---
        console.error(`[Auth Register] Error during registration transaction for ${username}:`, error);
        if (client) {
            try {
                // Attempt to rollback only if transaction was potentially started
                await client.query('ROLLBACK');
                console.log(`[Auth Register] Transaction ROLLBACK executed due to error for ${username}.`);
            } catch (rollbackError) {
                console.error(`[Auth Register] Error during ROLLBACK for ${username}:`, rollbackError);
            }
        }

        // --- Specific error handling for duplicate key ---
        // Check PostgreSQL error code '23505' for unique constraint violation
        if (error.code === '23505' && error.constraint && error.constraint.includes('users_username_key')) {
             console.warn(`[Auth Register] Caught duplicate username constraint violation for ${username}.`);
             // Return 409 Conflict instead of 500
             res.status(409).json({ message: 'Username already taken.' });
        } else {
             // Return generic 500 for other errors
            res.status(500).json({ message: 'Internal server error during registration.' });
        }
        // --- End Specific error handling ---

    } finally {
        // --- IMPORTANT: Release Client (ONLY HERE) ---
        // This block executes regardless of whether the try block succeeded or failed.
        if (client) {
            client.release(); // Release the client back to the pool
            console.log(`[Auth Register] DB client released for ${username}.`);
        }
    }
}); // <-- End of router.post('/register', ...) block


// --- Login ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // --- Validation for LOGIN: Only check if fields are present ---
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    // --- NO OTHER PASSWORD/USERNAME VALIDATION HERE ---

    try {
        // 1. Find the user by username
        const result = await db.query('SELECT id, username, password_hash FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            console.log(`[Auth] Login failed: User '${username}' not found.`);
            return res.status(401).json({ message: 'Invalid credentials.' }); // Use generic message
        }

        // 2. Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            console.log(`[Auth] Login failed: Incorrect password for user '${username}'.`);
            return res.status(401).json({ message: 'Invalid credentials.' }); // Use generic message
        }

        // 3. Passwords match - Regenerate session to prevent fixation attacks
        req.session.regenerate((err) => {
            if (err) {
                console.error('[Auth] Session regeneration error:', err);
                return res.status(500).json({ message: 'Internal server error during login.' });
            }

            // Store user information in session
            req.session.userId = user.id;
            req.session.username = user.username;

            console.log(`[Auth] User logged in successfully: ${user.username} (ID: ${user.id})`);
            res.status(200).json({
                message: 'Login successful!',
                user: { id: user.id, username: user.username }
            });
        });

    } catch (error) {
        console.error('[Auth] Login error:', error);
        res.status(500).json({ message: 'Internal server error during login.' });
    }
});


// --- Logout ---
router.post('/logout', (req, res) => {
    const currentUsername = req.session?.username; // Get username before destroying
    req.session.destroy((err) => {
        if (err) {
            console.error('[Auth] Logout error:', err);
            return res.status(500).json({ message: 'Could not log out, please try again.' });
        }
        // Ensure the cookie is cleared even if session store removal has latency
        res.clearCookie('connect.sid', { path: '/' }); // Specify path if needed
        console.log(`[Auth] User '${currentUsername || 'Unknown'}' logged out successfully.`);
        res.status(200).json({ message: 'Logout successful.' });
    });
});


// --- Check Session Status ---
router.get('/me', (req, res) => {
    // Check the session object attached to the request
    if (req.session && req.session.userId && req.session.username) {
        // User is logged in according to the session
        res.status(200).json({
            isLoggedIn: true,
            user: {
                id: req.session.userId,
                username: req.session.username
            }
        });
    } else {
        // No valid session found
        res.status(200).json({ isLoggedIn: false });
    }
});


module.exports = router;