// server/server-robot.js

/**
 * Represents a missile's state on the server.
 */
class ServerMissile {
    constructor(x, y, direction, speed, power, ownerId) {
        this.id = `m-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.power = power;
        this.ownerId = ownerId;
        this.radius = 3 + power;
    }
    update(deltaTime) {
        const moveSpeed = this.speed * deltaTime * 60;
        const radians = this.direction * Math.PI / 180;
        this.x += Math.cos(radians) * moveSpeed;
        this.y -= Math.sin(radians) * moveSpeed;
    }
}


/**
 * Represents a Robot's state and behavior on the server side.
 * Stores visual configuration and name provided during initialization. // <-- Updated description
 */
class ServerRobot {
    /**
     * Creates a ServerRobot instance.
     * @param {string} id - Unique identifier for the robot.
     * @param {number} x - Initial X coordinate.
     * @param {number} y - Initial Y coordinate.
     * @param {number} direction - Initial direction in degrees.
     * @param {object} visuals - Visual configuration object { turret: {type, color}, chassis: {type, color}, mobility: {type} }.
     * @param {string} name - The display name for the robot.
     */
    constructor(id, x, y, direction, visuals, name) { // Updated constructor signature
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = 0;
        this.targetSpeed = 0;
        this.targetDirection = direction;
        this._damage = 0;
        this.radius = 15; // Base radius, could potentially be modified by chassis type later
        // this.color = this.generateColor(); // Removed old color generation
        this.cooldown = 0;
        this.missiles = [];
        this.state = 'active';
        this.destructionTime = null;
        this.destructionNotified = false;
        this.lastDamageCause = null;

        // --- Store Visuals and Name ---
        this.visuals = visuals || { // Provide default visuals if none passed
            turret: { type: 'standard', color: '#ffffff' },
            chassis: { type: 'medium', color: '#aaaaaa' },
            mobility: { type: 'wheels' }
        };
        this.name = name || `Robot_${id.substring(0, 4)}`; // Use provided name or generate default
        // --- End Store ---

        // Removed this.appearance property
    }

    get damage() {
        return this._damage;
    }

    get isAlive() {
        return this.state === 'active';
    }

    // Removed generateColor() method

    // --- update (No changes needed) ---
    update(deltaTime, arenaWidth, arenaHeight) {
        for (let i = this.missiles.length - 1; i >= 0; i--) {
            const missile = this.missiles[i];
            missile.update(deltaTime);
            if (missile.x < 0 || missile.x > arenaWidth || missile.y < 0 || missile.y > arenaHeight) {
                this.missiles.splice(i, 1);
            }
        }
        if (this.state !== 'active') return;
        if (this.cooldown > 0) this.cooldown = Math.max(0, this.cooldown - 1);
        this.speed = this.targetSpeed;
        this.direction = this.targetDirection;
        if (this.speed !== 0) {
            const moveSpeed = this.speed * deltaTime * 60;
            const radians = this.direction * Math.PI / 180;
            const dx = Math.cos(radians) * moveSpeed;
            const dy = Math.sin(radians) * moveSpeed;
            let newX = this.x + dx;
            let newY = this.y - dy;
            newX = Math.max(this.radius, Math.min(arenaWidth - this.radius, newX));
            newY = Math.max(this.radius, Math.min(arenaHeight - this.radius, newY));
            this.x = newX;
            this.y = newY;
        }
    }

    // --- drive (No changes needed) ---
    drive(direction, speed) {
        if (this.state !== 'active') return;
        this.targetDirection = ((Number(direction) % 360) + 360) % 360;
        this.targetSpeed = Math.max(-5, Math.min(5, Number(speed)));
    }

    // --- fire (No changes needed) ---
    fire(direction, power = 1) {
        if (this.state !== 'active' || this.cooldown > 0) return { success: false };
        const clampedPower = Math.max(1, Math.min(3, Number(power)));
        this.cooldown = clampedPower * 10 + 10;
        const fireDirection = ((Number(direction) % 360) + 360) % 360;
        const radians = fireDirection * Math.PI / 180;
        const missileSpeed = 7 + clampedPower;
        const startOffset = this.radius + 5;
        const missileStartX = this.x + Math.cos(radians) * startOffset;
        const missileStartY = this.y - Math.sin(radians) * startOffset;
        const missile = new ServerMissile(missileStartX, missileStartY, fireDirection, missileSpeed, clampedPower, this.id);
        this.missiles.push(missile);
        const fireEventData = { type: 'fire', x: missileStartX, y: missileStartY, ownerId: this.id };
        return { success: true, eventData: fireEventData };
    }

    // --- takeDamage (No changes needed) ---
    takeDamage(amount, cause = 'missile') {
        if (this.state !== 'active') return { destroyed: false, hit: false };
        const damageAmount = Math.max(0, Number(amount));
        if (damageAmount <= 0) return { destroyed: false, hit: false };
        this.lastDamageCause = cause;
        this._damage = Math.min(100, this._damage + damageAmount);
        if (this._damage >= 100) {
            this._damage = 100;
            this.state = 'destroyed';
            this.destructionTime = Date.now();
            this.speed = 0; this.targetSpeed = 0;
            console.log(`[${this.id}] Robot destroyed by ${damageAmount} damage via ${cause}!`);
            return { destroyed: true, hit: true, x: this.x, y: this.y, cause: cause };
        } else {
            console.log(`[${this.id}] Took ${damageAmount} damage via ${cause}. Current health: ${100 - this._damage}`);
            return { destroyed: false, hit: true, x: this.x, y: this.y };
        }
    }
}

module.exports = ServerRobot;