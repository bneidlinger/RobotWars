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
        const moveSpeed = this.speed * deltaTime * 60; // Scale speed by time and a factor
        const radians = this.direction * Math.PI / 180;
        this.x += Math.cos(radians) * moveSpeed;
        this.y -= Math.sin(radians) * moveSpeed; // Assuming server Y matches canvas (up is negative delta)
    }
}


/**
 * Represents a Robot's state and behavior on the server side.
 */
class ServerRobot {
    constructor(id, x, y, direction, appearance = 'default') {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = 0;
        this.targetSpeed = 0;
        this.targetDirection = direction;
        this._damage = 0;
        this.radius = 15;
        this.color = this.generateColor();
        this.cooldown = 0;
        this.missiles = [];
        this.state = 'active'; // 'active' | 'destroyed'
        this.destructionTime = null;
        this.destructionNotified = false; // Flag if 'robotDestroyed' event was sent
        this.appearance = appearance;
        // START CHANGE: Track cause of last damage for destruction event
        this.lastDamageCause = null;
        // END CHANGE
    }

    get damage() {
        return this._damage;
    }

    get isAlive() {
        return this.state === 'active';
    }

    generateColor() {
        let hash = 0;
        for (let i = 0; i < this.id.length; i++) {
            hash = this.id.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 50%)`;
    }

    update(deltaTime, arenaWidth, arenaHeight) {
        // Missile updates happen regardless of owner's state
        for (let i = this.missiles.length - 1; i >= 0; i--) {
            const missile = this.missiles[i];
            missile.update(deltaTime);
            if (missile.x < 0 || missile.x > arenaWidth || missile.y < 0 || missile.y > arenaHeight) {
                this.missiles.splice(i, 1);
            }
        }

        // Only update movement/cooldown if active
        if (this.state !== 'active') {
            return;
        }

        if (this.cooldown > 0) {
            this.cooldown = Math.max(0, this.cooldown - 1);
        }

        this.speed = this.targetSpeed;
        this.direction = this.targetDirection;

        if (this.speed !== 0) {
            const moveSpeed = this.speed * deltaTime * 60;
            const radians = this.direction * Math.PI / 180;
            const dx = Math.cos(radians) * moveSpeed;
            const dy = Math.sin(radians) * moveSpeed;

            let newX = this.x + dx;
            let newY = this.y - dy; // Canvas-style Y

            // Clamp position
            newX = Math.max(this.radius, Math.min(arenaWidth - this.radius, newX));
            newY = Math.max(this.radius, Math.min(arenaHeight - this.radius, newY));

            this.x = newX;
            this.y = newY;
        }
    }

    drive(direction, speed) {
        if (this.state !== 'active') return;
        this.targetDirection = ((Number(direction) % 360) + 360) % 360;
        this.targetSpeed = Math.max(-5, Math.min(5, Number(speed)));
    }

    /**
     * Fires a missile from the robot if cooldown allows.
     * @param {number} direction - Direction to fire in degrees (0=East, 90=North).
     * @param {number} [power=1] - Power of the missile (1-3).
     * @returns {object} Result object: { success: boolean, eventData?: { type: 'fire', x, y, ownerId } }
     */
    fire(direction, power = 1) {
        if (this.state !== 'active' || this.cooldown > 0) {
            return { success: false }; // Cannot fire
        }

        const clampedPower = Math.max(1, Math.min(3, Number(power)));
        this.cooldown = clampedPower * 10 + 10; // Example cooldown

        const fireDirection = ((Number(direction) % 360) + 360) % 360;
        const radians = fireDirection * Math.PI / 180;
        const missileSpeed = 7 + clampedPower;
        const startOffset = this.radius + 5;

        const missileStartX = this.x + Math.cos(radians) * startOffset;
        const missileStartY = this.y - Math.sin(radians) * startOffset;

        const missile = new ServerMissile(
            missileStartX, missileStartY, fireDirection,
            missileSpeed, clampedPower, this.id
        );
        this.missiles.push(missile);

        // START CHANGE: Return success and event data
        const fireEventData = {
            type: 'fire', // Identify event type
            x: missileStartX, // Location of the fire event
            y: missileStartY,
            ownerId: this.id // Who fired it
        };
        return { success: true, eventData: fireEventData };
        // END CHANGE
    }

    /**
     * Applies damage to the robot. If damage reaches 100, marks the robot as destroyed.
     * @param {number} amount - The amount of damage to apply (non-negative).
     * @param {string} [cause='missile'] - The cause of damage (e.g., 'missile', 'collision', 'selfDestruct').
     * @returns {object} Result: { destroyed: boolean, hit: boolean, x?: number, y?: number, cause?: string }
     */
    takeDamage(amount, cause = 'missile') {
        if (this.state !== 'active') {
            // Still return 'hit: false' to distinguish from a successful hit on an active robot
            return { destroyed: false, hit: false };
        }

        const damageAmount = Math.max(0, Number(amount));
        if (damageAmount <= 0) {
             return { destroyed: false, hit: false }; // No damage applied
        }

        // START CHANGE: Store cause before applying damage
        this.lastDamageCause = cause;
        // END CHANGE

        this._damage = Math.min(100, this._damage + damageAmount);

        if (this._damage >= 100) {
            this._damage = 100;
            this.state = 'destroyed';
            this.destructionTime = Date.now();
            this.speed = 0;
            this.targetSpeed = 0;
            console.log(`[${this.id}] Robot destroyed by ${damageAmount} damage via ${cause}!`);
            // Destruction returns specific data including cause
            return { destroyed: true, hit: true, x: this.x, y: this.y, cause: cause }; // Destroyed counts as a hit
        } else {
            // START CHANGE: Return hit confirmation and location if damaged but not destroyed
            console.log(`[${this.id}] Took ${damageAmount} damage via ${cause}. Current health: ${100 - this._damage}`);
            return { destroyed: false, hit: true, x: this.x, y: this.y }; // Damaged but survived
            // END CHANGE
        }
    }
}

module.exports = ServerRobot;
