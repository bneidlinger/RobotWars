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
        this.updateParticleEffects(deltaTime); // Update particle effects
        
        // Update robot damage effects for all active robots
        if (this.robots && this.robots.length > 0) {
            this.robots.forEach(robot => {
                // Only update if robot has damage effects method
                if (robot._updateDamageEffects) {
                    robot._updateDamageEffects();
                }
            });
        }

        // Update screen shake state
        this.updateScreenShake(); // Update shake effect

        // Draw the current state
        if (this.renderer) {
            // Pass current shake magnitude to the renderer
            this.renderer.draw(
                this.missiles,
                this.activeExplosions, // Keep for potential non-death explosions
                this.activeFlashes,
                this.activeParticleEffects, // Pass particle effects
                this.shakeMagnitude         // Pass shake magnitude
            );
        }

        // Request the next frame
        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    /** Update state based on data received from the server */
    updateFromServer(gameState) {
        if (!gameState) return;

        // Store previous robot damage values for detecting changes
        const previousRobots = new Map();
        this.robots.forEach(robot => {
            previousRobots.set(robot.id, { 
                damage: robot.damage,
                x: robot.x,
                y: robot.y
            });
        });
        
        // Update core game entities
        this.robots = gameState.robots || [];
        this.missiles = gameState.missiles || [];
        this.gameId = gameState.gameId || this.gameId; // Keep existing if not provided
        this.gameName = gameState.gameName || this.gameName;
        
        // Initialize damage effect properties for new robots
        this.robots.forEach(robot => {
            // If robot didn't have damage effects, initialize them
            if (!robot.damageEffects) {
                robot.damageEffects = {
                    smoke: [],
                    fire: [],
                    bodyDamage: [],
                    lastHitTime: 0,
                    hitPositions: []
                };
                
                // Add takeDamage method if not present
                if (!robot.takeDamage) {
                    robot.takeDamage = function(amount, source, hitX, hitY) {
                        // Record the hit time for visual effects
                        this.damageEffects.lastHitTime = Date.now();
                        
                        // Calculate hit position if not provided (relative to robot center)
                        let hitPosition;
                        if (hitX !== undefined && hitY !== undefined) {
                            // Convert absolute hit coordinates to relative
                            hitPosition = {
                                x: hitX - this.x,
                                y: hitY - this.y
                            };
                        } else {
                            // Generate a random position based on robot's radius
                            const hitAngle = Math.random() * Math.PI * 2;
                            const hitDistance = Math.random() * this.radius * 0.8;
                            hitPosition = {
                                x: Math.cos(hitAngle) * hitDistance,
                                y: Math.sin(hitAngle) * hitDistance
                            };
                        }
                        
                        // Store hit position for effect placement (keep last 5 hits)
                        this.damageEffects.hitPositions.unshift(hitPosition);
                        if (this.damageEffects.hitPositions.length > 5) {
                            this.damageEffects.hitPositions.pop();
                        }
                    };
                }
            }
            
            // Detect damage increases from server update and create appropriate visual effects
            const previousState = previousRobots.get(robot.id);
            if (previousState && robot.damage > previousState.damage) {
                // Calculate position where damage was taken (use previous position)
                const damageAmount = robot.damage - previousState.damage;
                robot.takeDamage(damageAmount, 'update', previousState.x, previousState.y);
            }
        });

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

        // Handle Hit Events with visual damage effects
        if (Array.isArray(gameState.hitEvents)) {
            gameState.hitEvents.forEach(hitEvent => {
                // Play hit sound
                if (window.audioManager?.playSound) {
                    window.audioManager.playSound('hit');
                }
                
                // Find the robot that was hit and apply visual damage effects
                if (hitEvent.robotId && hitEvent.x !== undefined && hitEvent.y !== undefined) {
                    const hitRobot = this.robots.find(robot => robot.id === hitEvent.robotId);
                    if (hitRobot) {
                        // Estimate damage amount based on hit type or use a default
                        const damageAmount = hitEvent.damage || 
                                            (hitEvent.cause === 'missile' ? 10 : 
                                             hitEvent.cause === 'collision' ? 2 : 5);
                        
                        // Apply visual damage to the robot
                        hitRobot.takeDamage(damageAmount, hitEvent.cause, hitEvent.x, hitEvent.y);
                    }
                }
            });
        }

        // Handle OLD Explosion Events (Sound Only Currently)
        // These might be missile impacts on walls or other non-death explosions
        // NOTE: Robot deaths are now handled by 'robotDestroyed' event
        if (Array.isArray(gameState.explosions)) {
             gameState.explosions.forEach(explosionData => {
                // Play generic explosion sound ONLY FOR THESE non-death explosions
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


    /**
     * Creates an enhanced particle explosion effect at the specified coordinates.
     * @param {number} x - Center X coordinate.
     * @param {number} y - Center Y coordinate.
     * @returns {object} The particle effect object to be added to activeParticleEffects.
     */
    createParticleExplosion(x, y) {
        const particles = [];
        const numSparks = 50 + Math.floor(Math.random() * 30); // 50-79 sparks (more sparks!)
        const numSmoke = 10 + Math.floor(Math.random() * 8);   // 10-17 smoke puffs (more smoke!)
        const numDebris = 15 + Math.floor(Math.random() * 10); // 15-24 debris chunks
        const baseSpeed = 4; // Faster particles
        const maxLifeSpark = 1.0; // seconds (longer life)
        const maxLifeSmoke = 2.0; // seconds (longer smoke trails)
        const maxLifeDebris = 0.8; // seconds
        
        // Create multiple flashes for a more dramatic effect
        // Main central flash
        particles.push({
            x: x, y: y, vx: 0, vy: 0,
            startTime: Date.now(),
            lifespan: 0.2, // slightly longer flash
            maxLifespan: 0.2,
            color: '#FFFFFF',
            size: 40 + Math.random() * 15, // Larger initial flash
            type: 'flash'
        });
        
        // Secondary flashes
        for (let i = 0; i < 3; i++) {
            const flashAngle = Math.random() * Math.PI * 2;
            const flashDistance = Math.random() * 20;
            particles.push({
                x: x + Math.cos(flashAngle) * flashDistance, 
                y: y + Math.sin(flashAngle) * flashDistance,
                vx: 0, vy: 0,
                startTime: Date.now() + Math.random() * 100, // Staggered timing
                lifespan: 0.1 + Math.random() * 0.1,
                maxLifespan: 0.1 + Math.random() * 0.1,
                color: '#FFDD99', // Slightly orange tint
                size: 20 + Math.random() * 15,
                type: 'flash'
            });
        }

        // Add sparks/debris with varying colors
        for (let i = 0; i < numSparks; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = baseSpeed + Math.random() * baseSpeed * 2.0; // More speed variation
            const life = maxLifeSpark * (0.4 + Math.random() * 0.6);
            
            // More varied colors - occasional blue/white hot sparks among the orange/yellow
            let color;
            if (Math.random() < 0.15) {  // 15% chance of blue/white hot spark
                const blueVal = Math.floor(200 + Math.random() * 55);
                color = `rgb(${Math.floor(blueVal * 0.8)}, ${Math.floor(blueVal * 0.9)}, ${blueVal})`;
            } else {
                const redVal = Math.floor(180 + Math.random() * 75); // 180-255
                color = `rgb(${redVal}, ${Math.floor(redVal * 0.6)}, ${Math.floor(redVal * 0.1)})`; // Yellow/Orange/Red range
            }

            particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: -Math.sin(angle) * speed, 
                startTime: Date.now(),
                lifespan: life,
                maxLifespan: life,
                color: color,
                size: 2 + Math.random() * 4, // Slightly larger sparks
                type: 'spark'
            });
        }

        // Add metal debris chunks
        for (let i = 0; i < numDebris; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = baseSpeed * 0.7 + Math.random() * baseSpeed;
            const life = maxLifeDebris * (0.5 + Math.random() * 0.5);
            const debrisVal = Math.floor(60 + Math.random() * 80); // Metal colors (60-140)
            let color;
            
            // Occasional glowing hot debris
            if (Math.random() < 0.3) {
                // Glowing orange/red hot metal
                color = `rgb(${150 + Math.floor(Math.random() * 105)}, ${50 + Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 30)})`;
            } else {
                // Regular metal color
                color = `rgb(${debrisVal}, ${debrisVal}, ${debrisVal})`;
            }

            particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: -Math.sin(angle) * speed,
                startTime: Date.now(),
                lifespan: life,
                maxLifespan: life,
                color: color,
                size: 3 + Math.random() * 5, // Larger debris chunks
                type: 'debris'
            });
        }

        // Add smoke puffs with more variety
        for (let i = 0; i < numSmoke; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = baseSpeed * 0.2 + Math.random() * baseSpeed * 0.4; // Slower smoke
            const life = maxLifeSmoke * (0.7 + Math.random() * 0.3);
            
            // Smoke color variations - dark greys with occasional dark orange/black (fire smoke)
            let color;
            if (Math.random() < 0.3) {
                // Fire smoke - dark with orange tint
                const smokeVal = Math.floor(40 + Math.random() * 30);
                color = `rgba(${smokeVal + 20}, ${smokeVal}, ${smokeVal - 10}, 0.75)`;
            } else {
                // Regular dark smoke
                const smokeVal = Math.floor(60 + Math.random() * 50);
                color = `rgba(${smokeVal}, ${smokeVal}, ${smokeVal}, 0.7)`;
            }

            particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: -Math.sin(angle) * speed - 0.1 - Math.random() * 0.2, // Add slight upward drift
                startTime: Date.now() + Math.floor(Math.random() * 300), // Staggered start times
                lifespan: life,
                maxLifespan: life,
                color: color,
                size: 8 + Math.random() * 12, // Larger smoke particles
                type: 'smoke'
            });
        }
        
        // Create an effect object to return
        return {
            id: `pExpl-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            x: x, y: y,
            particles: particles,
            startTime: Date.now(),
            isComplete: false
        };
    }

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

    /**
     * Handles the 'robotDestroyed' event from the server.
     * Creates a particle explosion, triggers screen shake, and PLAYS THE NEW ROBOT DEATH SOUND.
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

        // --- START: Play specific robot death sound ---
        // Play the new 'robotDeath' sound instead of the generic 'explode'
        if (window.audioManager?.playSound) {
            window.audioManager.playSound('robotDeath'); // <<< Use the new sound key
        }
        // --- END: Play specific robot death sound ---

        // NOTE: We are no longer playing 'explode' sound here or adding to activeExplosions for robot death.
    }

} // End Game Class