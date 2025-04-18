// server/server-robot.js

/**
 * Represents a missile's state on the server.
 */
class ServerMissile {
    constructor(x, y, direction, speed, power, ownerId) {
        this.id = `m-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`; // Simple unique ID
        this.x = x;
        this.y = y;
        this.direction = direction; // degrees (0=East, 90=North)
        this.speed = speed; // units per second (needs scaling by deltaTime)
        this.power = power;
        this.ownerId = ownerId; // ID of the robot that fired it
        this.radius = 3 + power; // Size based on power
    }

    /**
     * Updates the missile's position based on its speed and direction.
     * @param {number} deltaTime - Time elapsed since the last tick in seconds.
     */
    update(deltaTime) {
        // Note: Increased multiplier for more noticeable movement per tick
        const moveSpeed = this.speed * deltaTime * 40; // Scale speed by time and a factor (adjust 60 base if needed)
        const radians = this.direction * Math.PI / 180;
        this.x += Math.cos(radians) * moveSpeed;
        // Assuming server Y matches canvas (up is negative delta) for consistency:
        this.y -= Math.sin(radians) * moveSpeed;
    }
}


/**
 * Represents a Robot's state and behavior on the server side.
 * Managed by the GameInstance and manipulated by the ServerRobotInterpreter.
 * Includes properties for position, damage, appearance, etc.
 */
class ServerRobot {
    /**
     * Creates a new ServerRobot instance.
     * @param {string} id - Unique identifier (usually player's socket.id).
     * @param {number} x - Initial X coordinate.
     * @param {number} y - Initial Y coordinate.
     * @param {number} direction - Initial direction in degrees (0=East, 90=North).
     * @param {string} [appearance='default'] - Identifier for the robot's visual style.
     */
    constructor(id, x, y, direction, appearance = 'default') {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = direction; // Current direction (degrees)
        this.speed = 0; // Current actual speed
        this.targetSpeed = 0; // Speed requested by drive()
        this.targetDirection = direction; // Direction requested by drive()
        this._damage = 0; // Internal damage value (0-100)
        this.radius = 15; // Collision radius (can potentially vary by appearance later)
        this.color = this.generateColor(); // Assign a unique color based on ID
        this.cooldown = 0; // Weapon cooldown in ticks
        this.missiles = []; // Array of ServerMissile objects fired by this robot
        this.isAlive = true; // Flag indicating if the robot is active
        // Store the appearance identifier chosen by the player
        this.appearance = appearance;
    }

    /**
     * Public getter for the robot's current damage level.
     * @returns {number} The current damage (0-100).
     */
    get damage() {
        return this._damage;
    }

    /**
     * Generates a consistent color based on the robot's ID using HSL.
     * @returns {string} An HSL color string (e.g., "hsl(120, 70%, 50%)").
     */
    generateColor() {
        let hash = 0;
        for (let i = 0; i < this.id.length; i++) {
            hash = this.id.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash; // Convert to 32bit integer
        }
        const hue = Math.abs(hash % 360); // Ensure hue is positive
        // Use saturation=70%, lightness=50% for vibrant but not overly bright colors
        return `hsl(${hue}, 70%, 50%)`;
    }

    /**
     * Updates the robot's state for a single game tick.
     * Handles cooldown reduction, movement based on speed/direction,
     * arena boundary checks, and updating owned missiles.
     * @param {number} deltaTime - Time elapsed since the last tick in seconds.
     * @param {number} arenaWidth - The width of the game arena.
     * @param {number} arenaHeight - The height of the game arena.
     */
    update(deltaTime, arenaWidth, arenaHeight) {
        // Only update if the robot is alive
        if (!this.isAlive) return;

        // Update weapon cooldown (decrease by 1 each tick)
        if (this.cooldown > 0) {
            this.cooldown = Math.max(0, this.cooldown - 1);
        }

        // Apply target speed and direction set by drive() command instantly
        this.speed = this.targetSpeed;
        this.direction = this.targetDirection;

        // Update position if the robot is moving
        if (this.speed !== 0) {
            // Note: Increased multiplier for more noticeable movement per tick
            const moveSpeed = this.speed * deltaTime * 60; // Scale speed by time and factor (adjust 60 if needed)
            const radians = this.direction * Math.PI / 180;
            const dx = Math.cos(radians) * moveSpeed;
            const dy = Math.sin(radians) * moveSpeed; // Y direction depends on coordinate system

            let newX = this.x + dx;
            // Assuming server Y matches canvas (up is negative delta):
            let newY = this.y - dy;

            // --- START DEBUG LOGGING ---
            console.log(`[DEBUG ${this.id}] Pre-clamp: newX=${newX.toFixed(2)}, newY=${newY.toFixed(2)}, arenaW=${arenaWidth}, arenaH=${arenaHeight}, radius=${this.radius}`);
            // --- END DEBUG LOGGING ---

            // Clamp position to stay within arena boundaries, considering radius
            newX = Math.max(this.radius, Math.min(arenaWidth - this.radius, newX));
            newY = Math.max(this.radius, Math.min(arenaHeight - this.radius, newY));

            // Assign the clamped values
            this.x = newX;
            this.y = newY;

            // --- START DEBUG LOGGING ---
            console.log(`[DEBUG ${this.id}] Post-clamp: this.x=${this.x.toFixed(2)}, this.y=${this.y.toFixed(2)}`);
            // --- END DEBUG LOGGING ---

        } // End of if (this.speed !== 0)

        // Update all missiles fired by this robot
        for (let i = this.missiles.length - 1; i >= 0; i--) {
            const missile = this.missiles[i];
            missile.update(deltaTime);
            // Remove missile if it goes out of the arena boundaries
            // Check against 0 and arena dimensions for missile center
            if (missile.x < 0 || missile.x > arenaWidth || missile.y < 0 || missile.y > arenaHeight) {
                // console.log(`[${this.id}] Missile ${missile.id} went out of bounds.`); // Optional: Keep this log if needed
                this.missiles.splice(i, 1);
            }
        }
    } // End of update method

    // --- API Methods (Called via ServerRobotInterpreter's safe methods) ---

    /**
     * Sets the robot's target direction and speed.
     * @param {number} direction - Target direction in degrees (0=East, 90=North).
     * @param {number} speed - Target speed (-5 to 5).
     */
    drive(direction, speed) {
        if (!this.isAlive) return; // Dead robots don't drive

        // Normalize direction to be within [0, 360)
        this.targetDirection = ((Number(direction) % 360) + 360) % 360;
        // Clamp speed to defined limits
        this.targetSpeed = Math.max(-5, Math.min(5, Number(speed)));
    }

    /**
     * Fires a missile from the robot if cooldown allows.
     * @param {number} direction - Direction to fire in degrees (0=East, 90=North).
     * @param {number} [power=1] - Power of the missile (1-3), affecting speed, size, and cooldown.
     * @returns {boolean} True if the missile was successfully fired, false otherwise.
     */
    fire(direction, power = 1) {
        if (!this.isAlive || this.cooldown > 0) {
            return false; // Cannot fire if dead or cooling down
        }

        // Clamp power and calculate cooldown duration in ticks
        const clampedPower = Math.max(1, Math.min(3, Number(power)));
        this.cooldown = clampedPower * 10 + 10; // Example: Power 1=20 ticks, Power 3=40 ticks

        // Normalize firing direction
        const fireDirection = ((Number(direction) % 360) + 360) % 360;
        const radians = fireDirection * Math.PI / 180;
        const missileSpeed = 7 + clampedPower; // Base speed plus bonus from power
        const startOffset = this.radius + 5; // Start missile just outside the robot's radius

        // Calculate missile's starting position based on robot's center and direction
        const missileStartX = this.x + Math.cos(radians) * startOffset;
        const missileStartY = this.y - Math.sin(radians) * startOffset; // Assumes canvas-style Y

        // Create the new missile instance
        const missile = new ServerMissile(
            missileStartX,
            missileStartY,
            fireDirection,
            missileSpeed,
            clampedPower,
            this.id // Pass this robot's ID as the owner
        );

        // Add the missile to this robot's list (GameInstance will collect these for state/collisions)
        this.missiles.push(missile);
        // console.log(`[${this.id}] Fired missile towards ${fireDirection.toFixed(1)}`); // Debug log
        return true; // Missile fired successfully
    }

    /**
     * Applies damage to the robot. If damage reaches 100, marks the robot as dead.
     * @param {number} amount - The amount of damage to apply (non-negative).
     * @returns {boolean} True if this damage caused the robot to be destroyed, false otherwise.
     */
    takeDamage(amount) {
        if (!this.isAlive) return true; // Already dead, count as destroyed

        // Ensure damage amount is non-negative
        const damageAmount = Math.max(0, Number(amount));

        // Apply damage, capping at 100
        this._damage = Math.min(100, this._damage + damageAmount);

        // Check if the robot was destroyed by this damage
        if (this._damage >= 100) {
            this.isAlive = false; // Mark as destroyed
            this.speed = 0; // Stop all movement
            this.targetSpeed = 0;
            this.missiles = []; // Destroy any active missiles (optional, depends on game rules)
            console.log(`[${this.id}] Robot destroyed by ${damageAmount} damage!`);
            return true; // Was destroyed
        }
        return false; // Damaged but survived
    }
}

// Export the ServerRobot class for use in GameInstance and potentially elsewhere
module.exports = ServerRobot;