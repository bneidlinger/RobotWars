// server/server-collision.js

/**
 * Server-side collision detection system for Robot Wars.
 * Handles interactions between robots, missiles, and arena boundaries.
 * Modifies the game state directly (e.g., applies damage).
 */
class ServerCollisionSystem {
    constructor(gameInstance) {
        this.game = gameInstance; // Reference to the GameInstance
        this.arenaWidth = 600; // TODO: Get these from GameInstance or config
        this.arenaHeight = 600;
    }

    /**
     * Checks all relevant collisions for the current game tick.
     */
    checkAllCollisions() {
        // Order matters: Check missile hits before robot-robot overlaps maybe?
        this.checkMissileRobotCollisions();
        this.checkRobotRobotCollisions();
         // Missile boundary checks are handled within robot.update now, but could be moved here.
         // this.checkMissileBoundaryCollisions();
    }

    /**
     * Checks for collisions between missiles and robots.
     * Applies damage and removes missiles upon collision.
     */
    checkMissileRobotCollisions() {
        const robots = this.game.robots; // Array of ServerRobot
        // No, we need the central list from game instance
        // const allMissiles = this.game.allMissiles; // Array of ServerMissile

        // Iterate through each robot as a potential target
        robots.forEach(targetRobot => {
            // Skip already dead robots
            if (!targetRobot.isAlive) return;

            // Iterate through all *other* robots to check *their* missiles
            robots.forEach(firingRobot => {
                 // Don't check a robot's missiles against itself
                 if (targetRobot.id === firingRobot.id) return;

                // Check missiles fired by the 'firingRobot'
                for (let i = firingRobot.missiles.length - 1; i >= 0; i--) {
                    const missile = firingRobot.missiles[i];

                    // Simple circle collision check
                    const dx = targetRobot.x - missile.x;
                    const dy = targetRobot.y - missile.y;
                    const distanceSquared = dx * dx + dy * dy; // Use squared distance to avoid sqrt
                    const radiiSum = targetRobot.radius + missile.radius;
                    const radiiSumSquared = radiiSum * radiiSum;

                    if (distanceSquared < radiiSumSquared) {
                        // --- COLLISION DETECTED ---

                        // Apply damage to the target robot
                        const damageAmount = missile.power * 10; // Example damage calculation
                        const wasDestroyed = targetRobot.takeDamage(damageAmount);
                        console.log(`[Collision] Missile from ${firingRobot.id} hit ${targetRobot.id}. Damage: ${damageAmount}. Destroyed: ${wasDestroyed}`);

                        // Remove the missile from the firing robot's list
                        firingRobot.missiles.splice(i, 1);

                        // TODO: Trigger explosion effect?
                        // The GameInstance could have an 'explosions' array or emit an event.
                        // this.game.createExplosion(missile.x, missile.y, missile.power);

                        // If the target was destroyed, maybe credit the firing robot? (Future feature)
                        // if (wasDestroyed) { ... }

                        // Since the missile is gone, continue to the next missile
                    }
                } // End loop through firingRobot's missiles
             }); // End loop through potential firing robots
        }); // End loop through potential target robots
    }

    /**
     * Checks for collisions between robots to prevent overlap.
     * Applies minor damage and pushes robots apart.
     */
     checkRobotRobotCollisions() {
        const robots = this.game.robots;
        const numRobots = robots.length;

        for (let i = 0; i < numRobots; i++) {
            const robotA = robots[i];
            if (!robotA.isAlive) continue; // Skip dead robots

            for (let j = i + 1; j < numRobots; j++) {
                const robotB = robots[j];
                if (!robotB.isAlive) continue; // Skip dead robots

                const dx = robotB.x - robotA.x;
                const dy = robotB.y - robotA.y;
                const distanceSquared = dx * dx + dy * dy;
                const minDistance = robotA.radius + robotB.radius;
                const minDistanceSquared = minDistance * minDistance;

                if (distanceSquared < minDistanceSquared && distanceSquared > 0.001) { // Avoid division by zero if perfectly overlapped
                    // --- OVERLAP DETECTED ---
                     // console.log(`[Collision] Robot ${robotA.id} and ${robotB.id} collided.`); // Original log (optional)

                    const distance = Math.sqrt(distanceSquared);
                    const overlap = minDistance - distance;

                    // Calculate separation vector (normalized dx, dy)
                    const separationX = dx / distance;
                    const separationY = dy / distance;

                    // --- START COLLISION DEBUG LOGGING ---
                    console.log(`[DEBUG COLL ${robotA.id}/${robotB.id}] Pre-Push: A=(${robotA.x.toFixed(2)}, ${robotA.y.toFixed(2)}), B=(${robotB.x.toFixed(2)}, ${robotB.y.toFixed(2)})`);
                    // --- END COLLISION DEBUG LOGGING ---

                    // Move robots apart by half the overlap distance each
                    const moveDist = overlap / 2;
                    robotA.x -= separationX * moveDist;
                    robotA.y -= separationY * moveDist;
                    robotB.x += separationX * moveDist;
                    robotB.y += separationY * moveDist;

                    // --- START COLLISION DEBUG LOGGING ---
                    console.log(`[DEBUG COLL ${robotA.id}/${robotB.id}] Post-Push: A=(${robotA.x.toFixed(2)}, ${robotA.y.toFixed(2)}), B=(${robotB.x.toFixed(2)}, ${robotB.y.toFixed(2)})`);
                    // --- END COLLISION DEBUG LOGGING ---


                    // Apply small collision damage
                    robotA.takeDamage(0.5); // Very minor damage for bumps
                    robotB.takeDamage(0.5);

                    // Optional: Apply a small impulse/change in velocity if physics are more complex later

                    // Re-check boundaries after push-apart (simple clamp)
                    // Store pre-clamp values for comparison logging
                    const preClampAx = robotA.x; const preClampAy = robotA.y;
                    const preClampBx = robotB.x; const preClampBy = robotB.y;

                    robotA.x = Math.max(robotA.radius, Math.min(this.arenaWidth - robotA.radius, robotA.x));
                    robotA.y = Math.max(robotA.radius, Math.min(this.arenaHeight - robotA.radius, robotA.y));
                    robotB.x = Math.max(robotB.radius, Math.min(this.arenaWidth - robotB.radius, robotB.x));
                    robotB.y = Math.max(robotB.radius, Math.min(this.arenaHeight - robotB.radius, robotB.y));

                    // --- START COLLISION DEBUG LOGGING ---
                    // Log ONLY if clamping actually changed the value
                    if (robotA.x !== preClampAx || robotA.y !== preClampAy) {
                         console.log(`[DEBUG COLL ${robotA.id}] Clamped A after push from (${preClampAx.toFixed(2)}, ${preClampAy.toFixed(2)}) to (${robotA.x.toFixed(2)}, ${robotA.y.toFixed(2)})`);
                    }
                    if (robotB.x !== preClampBx || robotB.y !== preClampBy) {
                         console.log(`[DEBUG COLL ${robotB.id}] Clamped B after push from (${preClampBx.toFixed(2)}, ${preClampBy.toFixed(2)}) to (${robotB.x.toFixed(2)}, ${robotB.y.toFixed(2)})`);
                    }
                    // --- END COLLISION DEBUG LOGGING ---

                } // End if (overlap detected)
            } // End inner loop (robotB)
        } // End outer loop (robotA)
    } // End checkRobotRobotCollisions method

    // Optional: Move missile boundary check here if not handled in robot.update
    // checkMissileBoundaryCollisions() { ... }
}

module.exports = ServerCollisionSystem;