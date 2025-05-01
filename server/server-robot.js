// server/server-robot.js

/**
 * Represents a missile's state on the server.
 * Now includes the turret type that fired it for visual differentiation.
 */
class ServerMissile {
    /**
     * Creates a ServerMissile instance.
     * @param {number} x - Initial X coordinate.
     * @param {number} y - Initial Y coordinate.
     * @param {number} direction - Direction in degrees.
     * @param {number} speed - Speed of the missile.
     * @param {number} power - Power level (affects damage and radius).
     * @param {string} ownerId - ID of the robot that fired the missile.
     * @param {string} turretType - The type of turret that fired the missile (e.g., 'standard', 'cannon').
     */
    constructor(x, y, direction, speed, power, ownerId, turretType) { // Added turretType
        this.id = `m-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.power = power;
        this.ownerId = ownerId;
        this.radius = 3 + power;
        this.turretType = turretType; // <<< STORED turretType
    }

    update(deltaTime) {
        const moveSpeed = this.speed * deltaTime * 60;
        const radians = this.direction * Math.PI / 180;
        this.x += Math.cos(radians) * moveSpeed;
        this.y -= Math.sin(radians) * moveSpeed; // Correct for canvas Y-down
    }
}


/**
 * Represents a Robot's state and behavior on the server side.
 * Stores visual configuration and name provided during initialization.
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
    constructor(id, x, y, direction, visuals, name) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = 0;
        this.targetSpeed = 0;
        this.targetDirection = direction;
        this._damage = 0;
        this.radius = 15; // Base radius, could potentially be modified by chassis type later
        this.cooldown = 0;
        this.missiles = [];
        this.state = 'active'; // 'active', 'destroyed'
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
    }

    get damage() {
        return this._damage;
    }

    get isAlive() {
        return this.state === 'active';
    }

    // --- update ---
    update(deltaTime, arenaWidth, arenaHeight) {
        // Update missiles first
        for (let i = this.missiles.length - 1; i >= 0; i--) {
            const missile = this.missiles[i];
            missile.update(deltaTime);
            // Remove missiles that go out of bounds
            if (missile.x < 0 || missile.x > arenaWidth || missile.y < 0 || missile.y > arenaHeight) {
                this.missiles.splice(i, 1);
            }
        }

        // Don't update robot physics if not active
        if (this.state !== 'active') return;

        // Update cooldown
        if (this.cooldown > 0) {
            this.cooldown = Math.max(0, this.cooldown - 1); // Decrease cooldown, ensuring it doesn't go below 0
        }

        // Update speed and direction based on targets set by drive()
        this.speed = this.targetSpeed;
        this.direction = this.targetDirection;

        // Apply movement if speed is not zero
        if (this.speed !== 0) {
            const moveSpeed = this.speed * deltaTime * 60; // Scale speed by delta time and factor (60 for ~pixels/sec)
            const radians = this.direction * Math.PI / 180;
            const dx = Math.cos(radians) * moveSpeed;
            const dy = Math.sin(radians) * moveSpeed; // Note: positive dy moves DOWN in canvas coords

            let newX = this.x + dx;
            let newY = this.y - dy; // Subtract dy because positive Y is down on canvas

            // Clamp position to arena boundaries, considering robot radius
            newX = Math.max(this.radius, Math.min(arenaWidth - this.radius, newX));
            newY = Math.max(this.radius, Math.min(arenaHeight - this.radius, newY));

            this.x = newX;
            this.y = newY;
        }
    }

    // --- drive ---
    drive(direction, speed) {
        if (this.state !== 'active') return; // Cannot drive if destroyed

        // Normalize direction to 0-359 degrees
        // Use Number() to handle potential non-numeric inputs gracefully (becomes NaN)
        this.targetDirection = ((Number(direction) % 360) + 360) % 360;
        if (isNaN(this.targetDirection)) this.targetDirection = 0; // Default direction if input was invalid

        // Clamp speed between -5 and 5
        // Use Number() to handle potential non-numeric inputs
        this.targetSpeed = Math.max(-5, Math.min(5, Number(speed)));
        if (isNaN(this.targetSpeed)) this.targetSpeed = 0; // Default speed if input was invalid
    }

    // --- fire ---
    /**
     * Attempts to fire a missile.
     * @param {number} direction - Firing direction in degrees.
     * @param {number} [power=1] - Power level (1-3).
     * @returns {{success: boolean, eventData?: object}} Object indicating success and event data if successful.
     */
    fire(direction, power = 1) {
        // Cannot fire if destroyed or on cooldown
        if (this.state !== 'active' || this.cooldown > 0) {
             return { success: false }; // Indicate failure, no event data needed
        }

        // Validate and clamp power
        // Use Number() to handle non-numeric inputs
        const clampedPower = Math.max(1, Math.min(3, Number(power)));
        if(isNaN(clampedPower) || clampedPower < 1) {
             console.warn(`[${this.id}] Invalid fire power: ${power}. Defaulting to 1.`);
             power = 1; // Use validated 'power' variable now
        } else {
            power = clampedPower; // Use the validated value
        }

        // Set cooldown based on power
        this.cooldown = power * 10 + 10; // Example: Power 1=20 ticks, Power 3=40 ticks

        // Validate and normalize direction
        // Use Number() to handle non-numeric inputs
        let fireDirection = ((Number(direction) % 360) + 360) % 360;
         if (isNaN(fireDirection)) {
              console.warn(`[${this.id}] Invalid fire direction: ${direction}. Defaulting to 0.`);
              fireDirection = 0; // Use validated 'fireDirection' variable now
         }

        // Calculate missile properties
        const radians = fireDirection * Math.PI / 180;
        const missileSpeed = 7 + power; // Speed increases with power
        const startOffset = this.radius + 5; // Start missile just outside the robot's radius

        const missileStartX = this.x + Math.cos(radians) * startOffset;
        const missileStartY = this.y - Math.sin(radians) * startOffset; // Correct for canvas Y-down

        // --- START: Get Turret Type ---
        // Safely get the turret type from the robot's visuals data
        const turretType = this.visuals?.turret?.type || 'standard';
        // --- END: Get Turret Type ---

        // Create and add the missile
        // --- START: Pass Turret Type to Missile ---
        const missile = new ServerMissile(
            missileStartX, missileStartY, fireDirection, missileSpeed, power, this.id,
            turretType // Pass the turret type
        );
        this.missiles.push(missile);
        // --- END: Pass Turret Type to Missile ---

        // Prepare event data, INCLUDING direction and turret type for muzzle flash
        const fireEventData = {
            type: 'fire', // Used for muzzle flash type lookup on client
            x: missileStartX, // Where the missile/flash appears
            y: missileStartY,
            ownerId: this.id,
            direction: fireDirection, // Direction the missile/flash should face
            turretType: turretType    // Pass turret type for client muzzle flash style
        };

        // Return success and the event data
        return { success: true, eventData: fireEventData };
    }


    // --- takeDamage ---
    /**
     * Applies damage to the robot.
     * @param {number} amount - The amount of damage to apply.
     * @param {string} [cause='missile'] - The cause of the damage ('missile', 'collision', 'selfDestruct', etc.).
     * @returns {{destroyed: boolean, hit: boolean, x?: number, y?: number, cause?: string}} Object indicating if destroyed, if hit occurred, and details.
     */
    takeDamage(amount, cause = 'missile') {
        // Cannot take damage if already destroyed
        if (this.state !== 'active') {
            return { destroyed: false, hit: false }; // No hit occurred if already destroyed
        }

        const damageAmount = Math.max(0, Number(amount)); // Ensure damage is non-negative number
        if (damageAmount <= 0 || isNaN(damageAmount)) {
            return { destroyed: false, hit: false }; // No damage applied, so no hit
        }

        // Store the cause for potential game logic or logging
        this.lastDamageCause = cause;

        // Store current position BEFORE applying damage, useful for hit events
        const hitX = this.x;
        const hitY = this.y;

        // Apply damage, clamped to 100
        this._damage = Math.min(100, this._damage + damageAmount);

        if (this._damage >= 100) {
            this._damage = 100; // Ensure it doesn't exceed 100
            this.state = 'destroyed'; // Update state
            this.destructionTime = Date.now(); // Record time of destruction
            this.speed = 0; // Stop movement immediately
            this.targetSpeed = 0;
            console.log(`[${this.id}] Robot destroyed by ${damageAmount.toFixed(1)} damage via ${cause}!`);
            return { destroyed: true, hit: true, x: hitX, y: hitY, cause: cause }; // Return hit details
        } else {
            // Damage taken, but not destroyed
            // console.log(`[${this.id}] Took ${damageAmount.toFixed(1)} damage via ${cause}. Current health: ${(100 - this._damage).toFixed(1)}%`); // DEBUG: Optional verbose logging
            return { destroyed: false, hit: true, x: hitX, y: hitY }; // Return hit details
        }
    }
}

module.exports = ServerRobot;