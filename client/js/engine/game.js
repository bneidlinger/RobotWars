// client/js/engine/game.js

/**
 * Main client-side game logic class.
 * Manages the game loop, state updates from the server, robot data,
 * client-side effects (muzzle flashes, PARTICLE EXPLOSIONS, screen shake),
 * sound triggering, and coordinates with the renderer (Arena.js).
 */
class Game {
    constructor(canvasId) {
        console.log("Initializing Game...");
        this.canvasId = canvasId;
        this.renderer = null; // Will be initialized in start()
        this.robots = []; // Array of robot data from server
        this.missiles = []; // Array of missile data from server
        this.activeFlashes = []; // Muzzle flashes
        this.activeExplosions = []; // OLD simple explosions (maybe keep for non-death impacts?)
        this.activeParticleEffects = []; // NEW particle explosions (for robot deaths)
        this.gameId = null;
        this.gameName = null;
        this.playerId = null; // Client's own player ID
        this.isRunning = false;
        this.isSpectating = false;
        this.lastUpdateTime = 0;
        this.animationFrameId = null;

        // --- START: Screen Shake Properties ---
        this.shakeEndTime = 0;
        this.shakeMagnitude = 0;
        this.baseShakeMagnitude = 5; // How intense the shake is
        this.shakeDuration = 200; // How long the shake lasts in ms
        // --- END: Screen Shake Properties ---

        // Attempt to initialize renderer immediately
        try {
            this.renderer = new Arena(this.canvasId);
            console.log("Game: Arena renderer initialized successfully.");
        } catch (error) {
            console.error("Game: Failed to initialize Arena renderer:", error);
            // Handle initialization failure (e.g., show error message)
            alert(`Fatal Error: Could not initialize game graphics. ${error.message}`);
        }

        console.log("Game initialized.");
    }

    setPlayerId(id) {
        this.playerId = id;
        console.log(`Game: Player ID set to ${id}`);
    }

    /** Starts the game loop */
    start() {
        if (this.isRunning) return;
        console.log(`Game: Starting loop for game: ${this.gameName || this.gameId || 'Unknown'}`);
        this.isRunning = true;
        this.lastUpdateTime = performance.now();
        this.loop(); // Start the loop
    }

    /** Stops the game loop */
    stop() {
        if (!this.isRunning) return;
        console.log("Game: Stopping loop.");
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        // Clear transient game state? (Optional)
        this.robots = [];
        this.missiles = [];
        this.activeFlashes = [];
        this.activeExplosions = [];
        this.activeParticleEffects = []; // Clear particle effects too
        this.shakeMagnitude = 0; // Reset shake
        // Optionally clear the dashboard/logs via their handlers
        if (window.dashboard?.updateStats) window.dashboard.updateStats([], {});
        if (window.clearRobotLog) window.clearRobotLog();
        if (window.clearOpponentLog) window.clearOpponentLog();
    }

    /** The main game loop, using requestAnimationFrame */
    loop() {
        if (!this.isRunning) return;

        const now = performance.now();
        const deltaTime = (now - this.lastUpdateTime) / 1000.0; // Delta time in seconds
        this.lastUpdateTime = now;

        // Update effects before drawing
        this.updateEffects(deltaTime);
        this.updateParticleEffects(deltaTime); // <<< ADDED: Update particle effects

        // Update screen shake state
        this.updateScreenShake(); // <<< ADDED: Update shake effect

        // Draw the current state
        if (this.renderer) {
            // Pass current shake magnitude to the renderer
            this.renderer.draw(
                this.missiles,
                this.activeExplosions, // Keep for potential non-death explosions
                this.activeFlashes,
                this.activeParticleEffects, // <<< ADDED: Pass particle effects
                this.shakeMagnitude         // <<< ADDED: Pass shake magnitude
            );
        }

        // Request the next frame
        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    /** Update state based on data received from the server */
    updateFromServer(gameState) {
        if (!gameState) return;

        // Update core game entities
        this.robots = gameState.robots || [];
        this.missiles = gameState.missiles || [];
        this.gameId = gameState.gameId || this.gameId; // Keep existing if not provided
        this.gameName = gameState.gameName || this.gameName;

        // Update renderer's robot data copy
        if (this.renderer) {
            this.renderer.robots = this.robots;
        }

        // Update dashboard stats
        if (window.dashboard?.updateStats) {
            window.dashboard.updateStats(this.robots, { gameName: this.gameName });
        }

        // --- Process Events for Sound and Visual Effects ---

        // Handle Firing Events (Muzzle Flash + Sound)
        if (Array.isArray(gameState.fireEvents)) {
            gameState.fireEvents.forEach(fireEvent => {
                // Add muzzle flash visual effect
                this.activeFlashes.push({
                    id: `f-${Date.now()}-${Math.random()}`,
                    type: fireEvent.turretType, // Use turretType from event
                    x: fireEvent.x,
                    y: fireEvent.y,
                    direction: fireEvent.direction,
                    startTime: Date.now(),
                    duration: 150 // Muzzle flash duration in ms
                });
                // Play fire sound
                if (window.audioManager?.playSound) {
                    window.audioManager.playSound('fire');
                }
            });
        }

        // Handle Hit Events (Sound Only Currently)
        if (Array.isArray(gameState.hitEvents)) {
            gameState.hitEvents.forEach(hitEvent => {
                // Play hit sound
                if (window.audioManager?.playSound) {
                    window.audioManager.playSound('hit');
                }
                 // TODO: Add visual impact spark effect here?
                 // e.g., this.createImpactSpark(hitEvent.x, hitEvent.y);
            });
        }

        // Handle OLD Explosion Events (Sound Only Currently)
        // These might be missile impacts on walls or other non-death explosions
        if (Array.isArray(gameState.explosions)) {
             gameState.explosions.forEach(explosionData => {
                // Play explosion sound
                if (window.audioManager?.playSound) {
                    window.audioManager.playSound('explode');
                }
                 // If using old simple explosions for impacts, add them here:
                 // this.activeExplosions.push({ ...explosionData, startTime: Date.now(), duration: 500, maxRadius: 10 + explosionData.size * 5, colorSequence: [...] });
            });
        }

        // Ensure the loop is running if it wasn't (e.g., after spectate ends and game starts)
        if (!this.isRunning && (this.robots.length > 0 || this.missiles.length > 0)) {
             console.log("Game: State received, ensuring loop is running.");
             this.start();
        }
    }

    /** Update lifetimes and remove completed effects */
    updateEffects(deltaTime) {
        const now = Date.now();

        // Update Muzzle Flashes
        this.activeFlashes = this.activeFlashes.filter(flash => {
            return now < flash.startTime + flash.duration;
        });

        // Update OLD Explosions (if still used for impacts)
        this.activeExplosions = this.activeExplosions.filter(explosion => {
             return now < explosion.startTime + explosion.duration;
        });
    }

    // --- START: New Particle Effect Update ---
    /** Update lifetimes and positions of particles in explosions */
    updateParticleEffects(deltaTime) {
        const now = Date.now();
        const gravity = 0; // Optional: Add downward acceleration
        const friction = 0.99; // Optional: Air resistance

        // Iterate backwards for safe removal of effects
        for (let i = this.activeParticleEffects.length - 1; i >= 0; i--) {
            const effect = this.activeParticleEffects[i];

            // Iterate backwards for safe removal of particles
            for (let j = effect.particles.length - 1; j >= 0; j--) {
                const p = effect.particles[j];
                const elapsed = (now - p.startTime) / 1000.0; // Time in seconds
                p.lifespan = Math.max(0, p.maxLifespan - elapsed);

                if (p.lifespan <= 0) {
                    effect.particles.splice(j, 1); // Remove dead particle
                    continue; // Skip further updates for this particle
                }

                // Update position based on velocity and deltaTime
                // Scale velocity by 60 to approximate pixels per second if velocity is per-tick
                p.x += p.vx * deltaTime * 60;
                p.y += p.vy * deltaTime * 60;

                // Apply optional physics
                // p.vy += gravity * deltaTime * 60;
                // p.vx *= friction;
                // p.vy *= friction;
            }

            // Check if the effect has any particles left
            if (effect.particles.length === 0) {
                effect.isComplete = true; // Mark effect for removal
            }
        }

        // Filter out completed effects
        this.activeParticleEffects = this.activeParticleEffects.filter(effect => !effect.isComplete);
    }
    // --- END: New Particle Effect Update ---

    // --- START: New Screen Shake Update ---
    /** Updates the screen shake magnitude based on time */
    updateScreenShake() {
        const now = Date.now();
        if (now >= this.shakeEndTime) {
            this.shakeMagnitude = 0; // Shake duration ended
        } else {
            // Optional: Could add easing (e.g., fade out shake)
            // const timeLeft = this.shakeEndTime - now;
            // const progress = timeLeft / this.shakeDuration;
            // this.shakeMagnitude = this.baseShakeMagnitude * progress; // Linear fade
        }
    }
    // --- END: New Screen Shake Update ---


    // --- START: New Particle Explosion Creation ---
    /**
     * Creates a particle explosion effect at the specified coordinates.
     * @param {number} x - Center X coordinate.
     * @param {number} y - Center Y coordinate.
     * @returns {object} The particle effect object to be added to activeParticleEffects.
     */
    createParticleExplosion(x, y) {
        const particles = [];
        const numSparks = 30 + Math.floor(Math.random() * 20); // 30-49 sparks
        const numSmoke = 5 + Math.floor(Math.random() * 5);   // 5-9 smoke puffs
        const baseSpeed = 3;
        const maxLifeSpark = 0.8; // seconds
        const maxLifeSmoke = 1.5; // seconds

        // Add initial flash (simple particle)
        particles.push({
            x: x, y: y, vx: 0, vy: 0,
            startTime: Date.now(),
            lifespan: 0.15, // short bright flash
            maxLifespan: 0.15,
            color: '#FFFFFF',
            size: 25 + Math.random() * 10,
            type: 'flash'
        });

        // Add sparks/debris
        for (let i = 0; i < numSparks; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = baseSpeed + Math.random() * baseSpeed * 1.5; // Vary speed
            const life = maxLifeSpark * (0.5 + Math.random() * 0.5);
            const colorVal = Math.floor(150 + Math.random() * 105); // 150-255
            const color = `rgb(${colorVal}, ${Math.floor(colorVal * 0.7)}, ${Math.floor(colorVal * 0.2)})`; // Yellow/Orange/Red range

            particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: -Math.sin(angle) * speed, // Y-down
                startTime: Date.now(),
                lifespan: life,
                maxLifespan: life,
                color: color,
                size: 2 + Math.random() * 3,
                type: 'spark'
                // Optional: Add gravity vy += gravity * dt
            });
        }

        // Add smoke puffs
        for (let i = 0; i < numSmoke; i++) {
             const angle = Math.random() * Math.PI * 2;
             const speed = baseSpeed * 0.3 + Math.random() * baseSpeed * 0.5; // Slower smoke
             const life = maxLifeSmoke * (0.7 + Math.random() * 0.3);
             const greyVal = Math.floor(80 + Math.random() * 40); // Darker grey range
             const color = `rgba(${greyVal}, ${greyVal}, ${greyVal}, 0.7)`; // Semi-transparent

             particles.push({
                 x: x, y: y,
                 vx: Math.cos(angle) * speed,
                 vy: -Math.sin(angle) * speed, // Y-down
                 startTime: Date.now(),
                 lifespan: life,
                 maxLifespan: life,
                 color: color,
                 size: 8 + Math.random() * 8, // Larger smoke
                 type: 'smoke'
             });
        }

        return {
            id: `pExpl-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            x: x, y: y, // Center (not really needed if particles have coords)
            particles: particles,
            startTime: Date.now(), // Effect start time (for potential grouping)
            isComplete: false // Flag to mark for removal
        };
    }
    // --- END: New Particle Explosion Creation ---

    /** Handles the 'gameStart' event from the server */
    handleGameStart(data) {
        console.log(`Game: handleGameStart received for game ${data.gameId} ('${data.gameName}')`);
        this.gameId = data.gameId;
        this.gameName = data.gameName || data.gameId;
        this.isSpectating = false;
        // Update controls state via global controls object
        if (window.controls?.setState) window.controls.setState('playing');
        this.start(); // Start the game loop
    }

    /** Handles the 'gameOver' event from the server */
    handleGameOver(data) {
        console.log(`Game: handleGameOver received for game ${data.gameId}. Winner: ${data.winnerName}`);
        this.stop(); // Stop the game loop
        this.gameId = null; // Clear game ID
        this.gameName = null;
        this.isSpectating = false;
        // Update controls state via global controls object
        if (window.controls?.setState) window.controls.setState('lobby');
        // Optionally display winner message in event log
        if (window.addEventLogMessage) window.addEventLogMessage(`--- Game Over! Winner: ${data.winnerName || 'None'} ---`, 'event');
    }

    /** Handles the 'spectateStart' event */
    handleSpectateStart(data) {
        console.log(`Game: handleSpectateStart received for game ${data.gameId} ('${data.gameName}')`);
        this.stop(); // Stop any current local loop
        this.gameId = data.gameId;
        this.gameName = data.gameName || data.gameId;
        this.isSpectating = true;
        // Update controls state via global controls object
        if (window.controls?.setState) window.controls.setState('spectating');
        if (window.updateLobbyStatus) window.updateLobbyStatus(`Spectating: ${this.gameName}`);
        this.start(); // Start the loop to render received spectate updates
    }

    /** Handles the 'spectateGameOver' event */
    handleSpectateEnd(data) {
        console.log(`Game: handleSpectateEnd received for game ${data.gameId}. Winner: ${data.winnerName}`);
        this.stop();
        this.gameId = null;
        this.gameName = null;
        this.isSpectating = false;
        // Update controls state via global controls object
        if (window.controls?.setState) window.controls.setState('lobby');
        if (window.updateLobbyStatus) window.updateLobbyStatus('Spectated game finished. Ready Up or Test Code!');
    }

    // --- START: Modified handleRobotDestroyed ---
    /**
     * Handles the 'robotDestroyed' event from the server.
     * Creates a particle explosion and triggers screen shake.
     */
    handleRobotDestroyed(data) {
        // data should contain { robotId, x, y, cause }
        if (!data) return;
        console.log(`Game: Robot ${data.robotId} destroyed at (${data.x}, ${data.y}) by ${data.cause}`);

        // Create and add the new particle explosion
        const particleEffect = this.createParticleExplosion(data.x, data.y);
        this.activeParticleEffects.push(particleEffect);

        // Trigger screen shake
        this.shakeEndTime = Date.now() + this.shakeDuration;
        this.shakeMagnitude = this.baseShakeMagnitude;

        // Play explosion sound (if not already handled by an explosion event)
        // Check if an explosion event for this robot death was already processed via updateFromServer
        // This is a bit tricky. For now, let's assume robotDestroyed is the primary trigger
        // for the death sound AND the visual effect.
        if (window.audioManager?.playSound) {
            window.audioManager.playSound('explode');
        }

        // *** REMOVED adding to this.activeExplosions for robot death ***
        // // Example of adding to the OLD simple explosion system (if needed)
        // this.activeExplosions.push({
        //     id: `expl-${data.robotId}-${Date.now()}`,
        //     x: data.x,
        //     y: data.y,
        //     startTime: Date.now(),
        //     duration: 800, // Longer duration for robot death
        //     maxRadius: 40, // Bigger radius
        //     // Example color sequence for robot death
        //     colorSequence: ['#FFFFFF', '#FFFACD', '#FFD700', '#FFA500', '#FF8C00', '#FF4500', '#DC143C', '#A0522D', '#808080', '#404040']
        // });
    }
    // --- END: Modified handleRobotDestroyed ---

} // End Game Class