// server/server-collision.js

/**
 * Server-side collision detection system for Robot Wars.
 * Handles interactions between robots, missiles, and arena boundaries.
 * Modifies the game state directly (e.g., applies damage) and
 * notifies the GameInstance about hit events for sound triggers. // <-- Updated description
 */
class ServerCollisionSystem {
    constructor(gameInstance) {
        this.game = gameInstance; // Reference to the GameInstance
        this.arenaWidth = 900; // TODO: Get from config/GameInstance
        this.arenaHeight = 900;
    }

    /**
     * Checks all relevant collisions for the current game tick.
     */
    checkAllCollisions() {
        this.checkMissileRobotCollisions();
        this.checkRobotRobotCollisions();
    }

    /**
     * Checks for collisions between missiles and robots.
     * Applies damage, removes missiles, and generates hit/explosion events.
     */
    checkMissileRobotCollisions() {
        const robots = this.game.robots;

        robots.forEach(targetRobot => {
            // Skip robots that are not active (already destroyed)
            if (targetRobot.state !== 'active') return; // Use state check

            robots.forEach(firingRobot => {
                if (targetRobot.id === firingRobot.id) return;

                for (let i = firingRobot.missiles.length - 1; i >= 0; i--) {
                    const missile = firingRobot.missiles[i];

                    const dx = targetRobot.x - missile.x;
                    const dy = targetRobot.y - missile.y;
                    const distanceSquared = dx * dx + dy * dy;
                    const radiiSum = targetRobot.radius + missile.radius;
                    const radiiSumSquared = radiiSum * radiiSum;

                    if (distanceSquared < radiiSumSquared) {
                        // --- COLLISION DETECTED ---
                        const damageAmount = missile.power * 10;

                        // START CHANGE: Capture result from takeDamage
                        const result = targetRobot.takeDamage(damageAmount, 'missile'); // Pass cause
                        // END CHANGE

                        console.log(`[Collision] Missile from ${firingRobot.id} hit ${targetRobot.id}. Damage: ${damageAmount}. Destroyed: ${result.destroyed}. Hit: ${result.hit}`);

                        // START CHANGE: Generate hit event if damage was applied
                        if (result.hit && typeof this.game.addHitEvent === 'function') {
                            // Use the location from the result object (where the robot was when hit)
                            this.game.addHitEvent(result.x, result.y, targetRobot.id);
                        }
                        // END CHANGE

                        // Trigger visual explosion effect via GameInstance
                        if (typeof this.game.createExplosion === 'function') {
                            this.game.createExplosion(missile.x, missile.y, missile.power);
                        }

                        // Remove the missile
                        firingRobot.missiles.splice(i, 1);

                        // Game over check happens later in the game loop after all collisions/updates
                    }
                }
            });
        });
    }

    /**
     * Checks for collisions between robots to prevent overlap.
     * Applies minor damage, pushes robots apart, and generates hit events.
     */
     checkRobotRobotCollisions() {
        const robots = this.game.robots;
        const numRobots = robots.length;

        for (let i = 0; i < numRobots; i++) {
            const robotA = robots[i];
            // Skip non-active robots
            if (robotA.state !== 'active') continue;

            for (let j = i + 1; j < numRobots; j++) {
                const robotB = robots[j];
                // Skip non-active robots
                if (robotB.state !== 'active') continue;

                const dx = robotB.x - robotA.x;
                const dy = robotB.y - robotA.y;
                const distanceSquared = dx * dx + dy * dy;
                const minDistance = robotA.radius + robotB.radius;
                const minDistanceSquared = minDistance * minDistance;

                if (distanceSquared < minDistanceSquared && distanceSquared > 0.001) {
                    // --- OVERLAP DETECTED ---
                    const distance = Math.sqrt(distanceSquared);
                    const overlap = minDistance - distance;
                    const separationX = dx / distance;
                    const separationY = dy / distance;
                    const moveDist = overlap / 2;

                    // Move robots apart
                    robotA.x -= separationX * moveDist;
                    robotA.y -= separationY * moveDist;
                    robotB.x += separationX * moveDist;
                    robotB.y += separationY * moveDist;

                    // Apply small collision damage & Generate Hit Events
                    // START CHANGE: Generate hit events for robot-robot collision
                    const collisionDamage = 0.5;
                    const resultA = robotA.takeDamage(collisionDamage, 'collision');
                    const resultB = robotB.takeDamage(collisionDamage, 'collision');

                    if (resultA.hit && typeof this.game.addHitEvent === 'function') {
                         this.game.addHitEvent(resultA.x, resultA.y, robotA.id);
                    }
                    if (resultB.hit && typeof this.game.addHitEvent === 'function') {
                         this.game.addHitEvent(resultB.x, resultB.y, robotB.id);
                    }
                    // END CHANGE

                    // Clamp positions after push
                    robotA.x = Math.max(robotA.radius, Math.min(this.arenaWidth - robotA.radius, robotA.x));
                    robotA.y = Math.max(robotA.radius, Math.min(this.arenaHeight - robotA.radius, robotA.y));
                    robotB.x = Math.max(robotB.radius, Math.min(this.arenaWidth - robotB.radius, robotB.x));
                    robotB.y = Math.max(robotB.radius, Math.min(this.arenaHeight - robotB.radius, robotB.y));

                } // End if overlap
            } // End inner loop
        } // End outer loop
    } // End checkRobotRobotCollisions
}

module.exports = ServerCollisionSystem;