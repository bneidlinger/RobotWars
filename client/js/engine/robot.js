class Robot {
    constructor(id, x, y, direction, code) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = direction; // in degrees, 0 is east, 90 is north
        this.speed = 0;
        this.damage = 0;
        this.code = code;
        this.radius = 15;
        this.color = this.generateColor();
        this.scanResult = null;
        this.cooldown = 0; // Cooldown for firing
        this.missiles = [];
        
        // Initialize visual properties for rendering
        this.visuals = {
            turret: { type: 'standard', color: this.color },
            chassis: { type: 'medium', color: this.color },
            mobility: { type: 'wheels' },
            beacon: { type: 'none', color: '#ffffff', strobe: false } // New beacon property
        };
        
        // Damage visualization properties
        this.damageEffects = {
            smoke: [],      // Array of smoke particles
            fire: [],       // Array of fire particles
            bodyDamage: [], // Array of damaged body parts
            lastHitTime: 0, // Time of last hit for temporary effects
            hitPositions: [] // Track positions of hits for more accurate effect placement
        };
        
        // Constants for effect limits
        this.MAX_SMOKE_PARTICLES = 25;
        this.MAX_FIRE_PARTICLES = 15;
        this.MAX_BODY_DAMAGE = 12;
    }

    generateColor() {
        const colors = ['#ff6b6b', '#48dbfb', '#1dd1a1', '#feca57', '#ff9ff3'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(arena) {
        // Move robot based on speed and direction
        if (this.speed !== 0) {
            const radians = this.direction * Math.PI / 180;
            const dx = Math.cos(radians) * this.speed;
            const dy = Math.sin(radians) * this.speed;

            // Calculate new position
            let newX = this.x + dx;
            let newY = this.y - dy; // Canvas y-axis is inverted

            // Check arena boundaries
            if (newX - this.radius < 0) newX = this.radius;
            if (newX + this.radius > arena.width) newX = arena.width - this.radius;
            if (newY - this.radius < 0) newY = this.radius;
            if (newY + this.radius > arena.height) newY = arena.height - this.radius;

            this.x = newX;
            this.y = newY;
        }

        // Update missiles
        for (let i = this.missiles.length - 1; i >= 0; i--) {
            const missile = this.missiles[i];
            missile.update();

            // Remove missiles that are out of bounds
            if (missile.x < 0 || missile.x > arena.width ||
                missile.y < 0 || missile.y > arena.height) {
                this.missiles.splice(i, 1);
            }
        }

        // Decrease cooldown
        if (this.cooldown > 0) {
            this.cooldown--;
        }
        
        // Update damage visual effects
        this._updateDamageEffects();
    }
    
    /**
     * Updates all visual damage effects (smoke, fire, body damage)
     * @private
     */
    _updateDamageEffects() {
        const now = Date.now();
        
        // 1. Update smoke particles
        for (let i = this.damageEffects.smoke.length - 1; i >= 0; i--) {
            const smoke = this.damageEffects.smoke[i];
            
            // Move smoke
            smoke.x += smoke.vx;
            smoke.y += smoke.vy;
            
            // Grow and fade smoke
            smoke.size += smoke.growth;
            smoke.alpha -= smoke.fadeSpeed;
            
            // Remove if fully faded
            if (smoke.alpha <= 0) {
                this.damageEffects.smoke.splice(i, 1);
            }
        }
        
        // 2. Update fire particles
        for (let i = this.damageEffects.fire.length - 1; i >= 0; i--) {
            const fire = this.damageEffects.fire[i];
            
            // Move fire
            fire.x += fire.vx;
            fire.y += fire.vy;
            
            // Shrink and fade fire
            fire.size -= fire.shrinkSpeed;
            fire.alpha -= fire.fadeSpeed;
            
            // Remove if too small or fully faded
            if (fire.size <= 0.5 || fire.alpha <= 0) {
                this.damageEffects.fire.splice(i, 1);
            }
        }
        
        // 3. Update temporary body damage effects (sparks, flash)
        for (let i = this.damageEffects.bodyDamage.length - 1; i >= 0; i--) {
            const damage = this.damageEffects.bodyDamage[i];
            
            // If it's a temporary effect with duration
            if (damage.type === 'sparkHit' && damage.startTime && damage.duration) {
                if (now - damage.startTime > damage.duration) {
                    this.damageEffects.bodyDamage.splice(i, 1);
                }
            }
        }
        
        // 4. Generate constant smoke/fire for heavily damaged robots
        // Use damage points as emission sources if available
        let smokeSource, fireSource;
        
        // Pick a random damage point as smoke/fire source if available
        // Filter to only get permanent damage marks as sources
        const damageSources = this.damageEffects.bodyDamage.filter(d => d.type === 'dent');
        
        if (damageSources.length > 0) {
            const randomDamageIndex = Math.floor(Math.random() * damageSources.length);
            smokeSource = damageSources[randomDamageIndex];
        }
        
        // If no damage sources, use recent hit positions
        if (!smokeSource && this.damageEffects.hitPositions.length > 0) {
            const randomHitIndex = Math.floor(Math.random() * this.damageEffects.hitPositions.length);
            smokeSource = this.damageEffects.hitPositions[randomHitIndex];
        }
        
        // If still no source, fallback to random position
        if (!smokeSource) {
            const angle = Math.random() * Math.PI * 2;
            const distance = this.radius * 0.7;
            smokeSource = {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance
            };
        }
        
        // Similar source selection for fire
        fireSource = smokeSource; // Use same source for simplicity
        
        // Emit smoke based on damage level and respecting limits
        if (this.damage >= 40 && Math.random() < 0.05 + (this.damage / 500)) {
            if (this.damageEffects.smoke.length < this.MAX_SMOKE_PARTICLES) {
                // Apply small random offset to source position
                const offsetAngle = Math.random() * Math.PI * 2;
                const offsetDist = Math.random() * this.radius * 0.3;
                const sourceX = smokeSource.x + Math.cos(offsetAngle) * offsetDist;
                const sourceY = smokeSource.y + Math.sin(offsetAngle) * offsetDist;
                
                this.damageEffects.smoke.push({
                    x: sourceX,
                    y: sourceY,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: -0.3 - Math.random() * 0.3,
                    size: 2 + Math.random() * 3,
                    alpha: 0.2 + Math.random() * 0.3,
                    growth: 0.03 + Math.random() * 0.03,
                    fadeSpeed: 0.005 + Math.random() * 0.005,
                    color: this.damage > 70 ? 'rgba(40,40,40,0.6)' : 'rgba(120,120,120,0.5)',
                    createdAt: now
                });
            }
        }
        
        // Emit fire for severely damaged robots, respecting limits
        if (this.damage >= 75 && Math.random() < 0.03 + ((this.damage - 75) / 200)) {
            if (this.damageEffects.fire.length < this.MAX_FIRE_PARTICLES) {
                // Apply small random offset to source position
                const offsetAngle = Math.random() * Math.PI * 2;
                const offsetDist = Math.random() * this.radius * 0.2;
                const sourceX = fireSource.x + Math.cos(offsetAngle) * offsetDist;
                const sourceY = fireSource.y + Math.sin(offsetAngle) * offsetDist;
                
                this.damageEffects.fire.push({
                    x: sourceX,
                    y: sourceY,
                    vx: (Math.random() - 0.5) * 0.1,
                    vy: -0.2 - Math.random() * 0.3,
                    size: 3 + Math.random() * 2,
                    alpha: 0.6 + Math.random() * 0.3,
                    fadeSpeed: 0.01 + Math.random() * 0.01,
                    shrinkSpeed: 0.02 + Math.random() * 0.03,
                    color: Math.random() < 0.5 ? '#ff9900' : '#ff5500',
                    createdAt: now
                });
            } else if (this.damageEffects.fire.length > 0) {
                // Replace oldest fire particle if at limit
                const oldestIdx = this._findOldestParticleIndex(this.damageEffects.fire);
                if (oldestIdx >= 0) {
                    // Apply small random offset to source position
                    const offsetAngle = Math.random() * Math.PI * 2;
                    const offsetDist = Math.random() * this.radius * 0.2;
                    const sourceX = fireSource.x + Math.cos(offsetAngle) * offsetDist;
                    const sourceY = fireSource.y + Math.sin(offsetAngle) * offsetDist;
                    
                    this.damageEffects.fire[oldestIdx] = {
                        x: sourceX,
                        y: sourceY,
                        vx: (Math.random() - 0.5) * 0.1,
                        vy: -0.2 - Math.random() * 0.3,
                        size: 3 + Math.random() * 2,
                        alpha: 0.6 + Math.random() * 0.3,
                        fadeSpeed: 0.01 + Math.random() * 0.01,
                        shrinkSpeed: 0.02 + Math.random() * 0.03,
                        color: Math.random() < 0.5 ? '#ff9900' : '#ff5500',
                        createdAt: now
                    };
                }
            }
        }
    }

    draw(ctx) {
        // Save context for transformations
        ctx.save();
        
        // Base position for all relative effects
        const baseX = this.x;
        const baseY = this.y;
        
        // 1. Draw smoke particles (behind robot)
        this._drawSmokeEffects(ctx, baseX, baseY);
        
        // 2. Draw robot body
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // 3. Draw permanent body damage (dents, scorch marks)
        this._drawBodyDamageEffects(ctx, baseX, baseY);
        
        // 4. Draw direction indicator
        const radians = this.direction * Math.PI / 180;
        const indicatorLength = this.radius * 1.5;
        const endX = this.x + Math.cos(radians) * indicatorLength;
        const endY = this.y - Math.sin(radians) * indicatorLength;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 5. Draw fire effects (on top of robot)
        this._drawFireEffects(ctx, baseX, baseY);
        
        // 6. Draw hit flash/spark effects
        this._drawHitEffects(ctx, baseX, baseY);

        // 7. Draw missiles
        this.missiles.forEach(missile => missile.draw(ctx));

        // 8. Draw robot ID
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Robot ${this.id}`, this.x, this.y - this.radius - 5);

        // 9. Draw damage bar
        const damageWidth = this.radius * 2;
        const damageHeight = 4;
        const damageX = this.x - this.radius;
        const damageY = this.y + this.radius + 5;

        // Background
        ctx.fillStyle = '#555';
        ctx.fillRect(damageX, damageY, damageWidth, damageHeight);

        // Health remaining
        const healthWidth = damageWidth * (1 - this.damage / 100);
        ctx.fillStyle = this.damage < 50 ? '#4CAF50' : this.damage < 75 ? '#FFC107' : '#F44336';
        ctx.fillRect(damageX, damageY, healthWidth, damageHeight);
        
        // Debug visual indicator for damage effects
        // Show number of damage effects present
        if (this.damage > 0) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            const smokeCount = this.damageEffects.smoke.length;
            const fireCount = this.damageEffects.fire.length;
            const dmgCount = this.damageEffects.bodyDamage.filter(d => d.type === 'dent').length;
            
            if (smokeCount > 0 || fireCount > 0 || dmgCount > 0) {
                ctx.fillText(`S:${smokeCount} F:${fireCount} D:${dmgCount}`, this.x, this.y + this.radius + 15);
            }
        }
        
        // Restore context
        ctx.restore();
    }
    
    /**
     * Draw smoke particles
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} baseX - Base x position
     * @param {number} baseY - Base y position
     * @private
     */
    _drawSmokeEffects(ctx, baseX, baseY) {
        ctx.save();
        
        // Get robot's rotation in radians for applying to effects
        const robotRadians = this.direction * Math.PI / 180;
        
        // Safety check to ensure damageEffects and smoke array exist
        if (!this.damageEffects || !this.damageEffects.smoke) {
            console.warn(`[RENDER ERROR] Missing damageEffects or smoke array for robot`);
            ctx.restore();
            return;
        }
        
        const smokeCount = this.damageEffects.smoke.length;
        if (smokeCount > 0 && Math.random() < 0.01) {
            console.log(`[RENDER DEBUG] Drawing ${smokeCount} smoke particles for robot`);
        }
        
        this.damageEffects.smoke.forEach(smoke => {
            // Calculate position considering robot rotation
            const rotatedX = smoke.x * Math.cos(robotRadians) - smoke.y * Math.sin(robotRadians);
            const rotatedY = smoke.x * Math.sin(robotRadians) + smoke.y * Math.cos(robotRadians);
            
            // Set color and alpha - pre-calculate the color string only once
            let smokeColor;
            const smokeBaseColor = smoke.color || 'rgba(100,100,100,0.5)';
            if (smokeBaseColor.startsWith('rgba')) {
                // Extract RGB part of the rgba color
                const rgbPart = smokeBaseColor.substring(0, smokeBaseColor.lastIndexOf(','));
                smokeColor = `${rgbPart}, ${smoke.alpha})`;
            } else {
                // Use default with specified alpha
                smokeColor = `rgba(100,100,100,${smoke.alpha})`;
            }
            ctx.fillStyle = smokeColor;
            
            // Draw smoke particle as a circle
            ctx.beginPath();
            ctx.arc(
                baseX + rotatedX,
                baseY + rotatedY,
                smoke.size,
                0,
                Math.PI * 2
            );
            ctx.fill();
        });
        ctx.restore();
    }
    
    /**
     * Draw fire particles
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} baseX - Base x position
     * @param {number} baseY - Base y position
     * @private
     */
    _drawFireEffects(ctx, baseX, baseY) {
        ctx.save();
        
        // Add glow effect for fire
        ctx.globalCompositeOperation = 'lighter';
        
        // Get robot's rotation in radians for applying to effects
        const robotRadians = this.direction * Math.PI / 180;
        
        // Safety check to ensure damageEffects and fire array exist
        if (!this.damageEffects || !this.damageEffects.fire) {
            console.warn(`[RENDER ERROR] Missing damageEffects or fire array for robot`);
            ctx.restore();
            return;
        }
        
        const fireCount = this.damageEffects.fire.length;
        if (fireCount > 0 && Math.random() < 0.01) {
            console.log(`[RENDER DEBUG] Drawing ${fireCount} fire particles for robot with damage: ${this.damage}`);
        }
        
        this.damageEffects.fire.forEach(fire => {
            // Calculate position considering robot rotation
            const rotatedX = fire.x * Math.cos(robotRadians) - fire.y * Math.sin(robotRadians);
            const rotatedY = fire.x * Math.sin(robotRadians) + fire.y * Math.cos(robotRadians);
            
            // Set color and alpha
            ctx.fillStyle = fire.color || '#ff7700';
            ctx.globalAlpha = fire.alpha;
            
            // Apply rotation to fire particles based on robot rotation PLUS flame direction
            ctx.translate(baseX + rotatedX, baseY + rotatedY);
            ctx.rotate(robotRadians - Math.PI/2); // Flames should point up relative to robot
            
            // Draw fire particle as a triangle-like shape
            const fireHeight = fire.size * 1.5;
            const fireWidth = fire.size * 0.8;
            
            ctx.beginPath();
            ctx.moveTo(0, -fireHeight); // Top
            ctx.lineTo(-fireWidth, fireHeight * 0.3); // Bottom left
            ctx.lineTo(fireWidth, fireHeight * 0.3); // Bottom right
            ctx.closePath();
            ctx.fill();
            
            // Add a small glow/inner fire
            ctx.fillStyle = '#ffffaa';
            ctx.globalAlpha = fire.alpha * 0.7;
            ctx.beginPath();
            ctx.arc(0, -fireHeight * 0.3, fire.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // Reset transformation
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        });
        
        ctx.restore();
    }
    
    /**
     * Draw body damage effects (dents, scorch marks)
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} baseX - Base x position
     * @param {number} baseY - Base y position
     * @private
     */
    _drawBodyDamageEffects(ctx, baseX, baseY) {
        ctx.save();
        
        // Get robot's rotation in radians for applying to effects
        const robotRadians = this.direction * Math.PI / 180;
        
        // Safety check to ensure damageEffects and bodyDamage array exist
        if (!this.damageEffects || !this.damageEffects.bodyDamage) {
            console.warn(`[RENDER ERROR] Missing damageEffects or bodyDamage array for robot`);
            ctx.restore();
            return;
        }
        
        const damageCount = this.damageEffects.bodyDamage.length;
        if (damageCount > 0 && Math.random() < 0.01) {
            console.log(`[RENDER DEBUG] Drawing ${damageCount} body damage effects for robot with damage: ${this.damage}`);
        }
        
        this.damageEffects.bodyDamage.forEach(damage => {
            if (damage.type === 'dent') {
                // Calculate position considering robot rotation
                const rotatedX = damage.x * Math.cos(robotRadians) - damage.y * Math.sin(robotRadians);
                const rotatedY = damage.x * Math.sin(robotRadians) + damage.y * Math.cos(robotRadians);
                
                // Draw dent/scorch mark
                ctx.fillStyle = damage.color || 'rgba(30,30,30,0.7)';
                
                // Apply rotation to effect (damage rotation + robot rotation)
                ctx.translate(baseX + rotatedX, baseY + rotatedY);
                ctx.rotate(damage.rotation || 0);
                
                // Draw the damage effect using pre-computed shape type
                if (damage.shapeType === 'polygon') {
                    // Irregular polygon for a dent
                    ctx.beginPath();
                    
                    // Use pre-computed points if available
                    if (damage.points && damage.points.length > 0) {
                        for (let i = 0; i < damage.points.length; i++) {
                            const point = damage.points[i];
                            if (i === 0) {
                                ctx.moveTo(point.x, point.y);
                            } else {
                                ctx.lineTo(point.x, point.y);
                            }
                        }
                    } else {
                        // Fallback if points weren't pre-computed
                        const points = 5 + Math.floor(Math.random() * 3);
                        const angleStep = (Math.PI * 2) / points;
                        for (let i = 0; i < points; i++) {
                            const distort = 0.7 + Math.random() * 0.6;
                            const px = Math.cos(i * angleStep) * damage.size * distort;
                            const py = Math.sin(i * angleStep) * damage.size * distort;
                            
                            if (i === 0) {
                                ctx.moveTo(px, py);
                            } else {
                                ctx.lineTo(px, py);
                            }
                        }
                    }
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // Simple circle for a burn mark
                    ctx.beginPath();
                    ctx.arc(0, 0, damage.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Reset transformation
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        });
        
        ctx.restore();
    }
    
    /**
     * Draw hit flash/spark effects
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} baseX - Base x position
     * @param {number} baseY - Base y position
     * @private
     */
    _drawHitEffects(ctx, baseX, baseY) {
        ctx.save();
        
        const now = Date.now();
        
        // Get robot's rotation in radians for applying to effects
        const robotRadians = this.direction * Math.PI / 180;
        
        // Safety check to ensure damageEffects and bodyDamage array exist
        if (!this.damageEffects || !this.damageEffects.bodyDamage) {
            console.warn(`[RENDER ERROR] Missing damageEffects or bodyDamage array for robot`);
            ctx.restore();
            return;
        }
        
        // Add glow effect for sparks
        ctx.globalCompositeOperation = 'lighter';
        
        this.damageEffects.bodyDamage.forEach(damage => {
            if (damage.type === 'sparkHit') {
                // Calculate position considering robot rotation
                const rotatedX = damage.x * Math.cos(robotRadians) - damage.y * Math.sin(robotRadians);
                const rotatedY = damage.x * Math.sin(robotRadians) + damage.y * Math.cos(robotRadians);
                
                // Calculate fade based on elapsed time
                const elapsed = now - damage.startTime;
                const progress = elapsed / damage.duration;
                
                if (progress <= 1) {
                    const fade = 1 - progress;
                    
                    // Draw spark/flash
                    ctx.fillStyle = damage.color || '#ffcc00';
                    ctx.globalAlpha = fade;
                    
                    // Draw spark as a small circle with glow
                    ctx.shadowColor = damage.color || '#ffcc00';
                    ctx.shadowBlur = damage.size * 2;
                    
                    ctx.beginPath();
                    ctx.arc(
                        baseX + rotatedX,
                        baseY + rotatedY,
                        damage.size * fade, // Shrinks as it fades
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                    
                    // Reset shadow for other draws
                    ctx.shadowBlur = 0;
                }
            }
        });
        
        // Recent hit flash effect (full-robot glow on hit)
        // Safety check for lastHitTime
        if (!this.damageEffects.lastHitTime) {
            this.damageEffects.lastHitTime = 0;
        }
        const timeSinceHit = now - this.damageEffects.lastHitTime;
        if (timeSinceHit < 200) { // Flash effect lasts 200ms
            const hitFade = 1 - (timeSinceHit / 200);
            
            // Determine flash color based on damage level
            let flashColor;
            if (this.damage < 50) {
                flashColor = `rgba(255,255,255,${hitFade * 0.6})`;
            } else {
                flashColor = `rgba(255,${50 + 150 * (1 - this.damage/100)},0,${hitFade * 0.6})`;
            }
            
            // Draw a glow around the robot
            ctx.strokeStyle = flashColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(baseX, baseY, this.radius + 3, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    /**
     * Draw hit flash/spark effects
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} baseX - Base x position
     * @param {number} baseY - Base y position
     * @private
     */
    _drawHitEffects(ctx, baseX, baseY) {
        ctx.save();
        
        const now = Date.now();
        
        // Add glow effect for sparks
        ctx.globalCompositeOperation = 'lighter';
        
        this.damageEffects.bodyDamage.forEach(damage => {
            if (damage.type === 'sparkHit') {
                // Calculate fade based on elapsed time
                const elapsed = now - damage.startTime;
                const progress = elapsed / damage.duration;
                
                if (progress <= 1) {
                    const fade = 1 - progress;
                    
                    // Draw spark/flash
                    ctx.fillStyle = damage.color || '#ffcc00';
                    ctx.globalAlpha = fade;
                    
                    // Draw spark as a small circle with glow
                    ctx.shadowColor = damage.color || '#ffcc00';
                    ctx.shadowBlur = damage.size * 2;
                    
                    ctx.beginPath();
                    ctx.arc(
                        baseX + damage.x,
                        baseY + damage.y,
                        damage.size * fade, // Shrinks as it fades
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                    
                    // Reset shadow for other draws
                    ctx.shadowBlur = 0;
                }
            }
        });
        
        // Recent hit flash effect (full-robot glow on hit)
        // Safety check for lastHitTime
        if (!this.damageEffects.lastHitTime) {
            this.damageEffects.lastHitTime = 0;
        }
        const timeSinceHit = now - this.damageEffects.lastHitTime;
        if (timeSinceHit < 200) { // Flash effect lasts 200ms
            const hitFade = 1 - (timeSinceHit / 200);
            
            // Draw a glow around the robot
            ctx.strokeStyle = this.damage < 50 ? 'rgba(255,255,255,0.6)' : 'rgba(255,50,0,0.6)';
            ctx.globalAlpha = hitFade * 0.6;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(baseX, baseY, this.radius + 3, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    // Robot API Methods
    drive(direction, speed) {
        // Normalize direction to 0-359
        this.direction = ((direction % 360) + 360) % 360;

        // Clamp speed to -5 to 5
        this.speed = Math.max(-5, Math.min(5, speed));
    }

    scan(direction, resolution = 10) {
        // Scan in the specified direction with given resolution
        const radians = direction * Math.PI / 180;
        const scanRange = 300; // Maximum scan range

        // Reset scan result
        this.scanResult = null;

        // Perform scan logic (will be implemented in the game.js)
        return this.scanResult;
    }

    fire(direction, power = 1) {
        // Check cooldown
        if (this.cooldown > 0) {
            return false;
        }

        // Clamp power between 1 and 3
        power = Math.max(1, Math.min(3, power));

        // Set cooldown based on power (higher power = longer cooldown)
        this.cooldown = power * 5;

        // Get the turret type from robot's visuals if available
        const turretType = this.visuals?.turret?.type || 'standard';

        // Create missile
        const radians = direction * Math.PI / 180;
        const missileSpeed = 7 + power;
        const missile = new Missile(
            this.x + Math.cos(radians) * (this.radius + 5),
            this.y - Math.sin(radians) * (this.radius + 5),
            direction,
            missileSpeed,
            power,
            turretType // Pass the turret type to the missile
        );

        this.missiles.push(missile);
        return true;
    }

    takeDamage(amount, source, hitX, hitY) {
        this.damage += amount;
        
        // Record the hit time for temporary visual effects
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
        
        // Add visual damage effects based on current damage level
        this._addVisualDamageEffects(amount, hitPosition);
        
        if (this.damage >= 100) {
            this.damage = 100;
            return true; // Robot destroyed
        }
        return false;
    }
    
    /**
     * Adds visual damage effects based on the current damage level and hit amount
     * @param {number} hitAmount - Amount of damage just taken
     * @param {object} hitPosition - Position of hit relative to robot center
     * @private
     */
    _addVisualDamageEffects(hitAmount, hitPosition) {
        // Quick hit flash or spark effect on any hit
        if (hitAmount > 0) {
            // Add impact sparks (temporary effect)
            const sparkCount = Math.min(5, hitAmount);
            for (let i = 0; i < sparkCount; i++) {
                // Use hit position with small random offset
                const offsetAngle = Math.random() * Math.PI * 2;
                const offsetDist = Math.random() * this.radius * 0.4;
                
                this.damageEffects.bodyDamage.push({
                    type: 'sparkHit',
                    x: hitPosition.x + Math.cos(offsetAngle) * offsetDist,
                    y: hitPosition.y + Math.sin(offsetAngle) * offsetDist,
                    size: 1 + Math.random() * 2,
                    duration: 300 + Math.random() * 200,
                    startTime: Date.now(),
                    color: '#ffcc00'
                });
            }
        }
        
        // Add visual damage effects based on damage thresholds
        
        // Smoke at moderate damage (30%+)
        if (this.damage >= 30 && Math.random() < 0.3) {
            // Small chance to add smoke at each hit, respecting particle limit
            if (this.damageEffects.smoke.length < this.MAX_SMOKE_PARTICLES) {
                // Use hit position as the smoke source
                this.damageEffects.smoke.push({
                    x: hitPosition.x,
                    y: hitPosition.y,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: -0.5 - Math.random() * 0.5, // Upward drift
                    size: 3 + Math.random() * 4,
                    alpha: 0.3 + Math.random() * 0.3,
                    growth: 0.05 + Math.random() * 0.05,
                    fadeSpeed: 0.005 + Math.random() * 0.01,
                    color: this.damage > 70 ? 'rgba(30,30,30,0.7)' : 'rgba(150,150,150,0.6)',
                    createdAt: Date.now() // Track when this particle was created
                });
            } else {
                // Replace oldest smoke particle if at limit
                const oldestIdx = this._findOldestParticleIndex(this.damageEffects.smoke);
                if (oldestIdx >= 0) {
                    this.damageEffects.smoke[oldestIdx] = {
                        x: hitPosition.x,
                        y: hitPosition.y,
                        vx: (Math.random() - 0.5) * 0.3,
                        vy: -0.5 - Math.random() * 0.5,
                        size: 3 + Math.random() * 4,
                        alpha: 0.3 + Math.random() * 0.3,
                        growth: 0.05 + Math.random() * 0.05,
                        fadeSpeed: 0.005 + Math.random() * 0.01,
                        color: this.damage > 70 ? 'rgba(30,30,30,0.7)' : 'rgba(150,150,150,0.6)',
                        createdAt: Date.now()
                    };
                }
            }
        }
        
        // Fire/flame effects at high damage (60%+)
        if (this.damage >= 60 && Math.random() < 0.2) {
            // Small chance to add fire at each hit when heavily damaged
            if (this.damageEffects.fire.length < this.MAX_FIRE_PARTICLES) {
                // Use hit position as the fire source with small offset
                const offsetAngle = Math.random() * Math.PI * 2;
                const offsetDist = Math.random() * this.radius * 0.3;
                
                this.damageEffects.fire.push({
                    x: hitPosition.x + Math.cos(offsetAngle) * offsetDist,
                    y: hitPosition.y + Math.sin(offsetAngle) * offsetDist,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: -0.3 - Math.random() * 0.4, // Upward flame
                    size: 4 + Math.random() * 3,
                    alpha: 0.7 + Math.random() * 0.3,
                    fadeSpeed: 0.01 + Math.random() * 0.01,
                    shrinkSpeed: 0.02 + Math.random() * 0.02,
                    color: Math.random() < 0.3 ? '#ff9900' : '#ff5500', // Orange/red flame color
                    createdAt: Date.now()
                });
            } else {
                // Replace oldest fire particle if at limit
                const oldestIdx = this._findOldestParticleIndex(this.damageEffects.fire);
                if (oldestIdx >= 0) {
                    const offsetAngle = Math.random() * Math.PI * 2;
                    const offsetDist = Math.random() * this.radius * 0.3;
                    
                    this.damageEffects.fire[oldestIdx] = {
                        x: hitPosition.x + Math.cos(offsetAngle) * offsetDist,
                        y: hitPosition.y + Math.sin(offsetAngle) * offsetDist,
                        vx: (Math.random() - 0.5) * 0.2,
                        vy: -0.3 - Math.random() * 0.4,
                        size: 4 + Math.random() * 3,
                        alpha: 0.7 + Math.random() * 0.3,
                        fadeSpeed: 0.01 + Math.random() * 0.01,
                        shrinkSpeed: 0.02 + Math.random() * 0.02,
                        color: Math.random() < 0.3 ? '#ff9900' : '#ff5500',
                        createdAt: Date.now()
                    };
                }
            }
        }
        
        // Permanent body damage effects at various thresholds
        // We'll add a new damage mark at 20%, 40%, 60%, and 80% damage
        const damageThresholds = [20, 40, 60, 80];
        const previousDamage = this.damage - hitAmount;
        
        // Check if we've crossed any damage thresholds
        for (const threshold of damageThresholds) {
            if (previousDamage < threshold && this.damage >= threshold) {
                // Check body damage limit
                if (this.damageEffects.bodyDamage.filter(d => d.type === 'dent').length < this.MAX_BODY_DAMAGE) {
                    // Use hit position for the damage placement with small randomization
                    const offsetAngle = Math.random() * Math.PI * 2;
                    const offsetDist = Math.random() * this.radius * 0.3;
                    const damageSize = 2 + Math.random() * 3;
                    
                    // Pre-determine the shape type to avoid random check during drawing
                    const shapeType = Math.random() < 0.3 ? 'polygon' : 'circle';
                    const points = [];
                    
                    // Pre-calculate polygon points if needed
                    if (shapeType === 'polygon') {
                        const pointCount = 5 + Math.floor(Math.random() * 3);
                        const angleStep = (Math.PI * 2) / pointCount;
                        
                        for (let i = 0; i < pointCount; i++) {
                            const distort = 0.7 + Math.random() * 0.6;
                            const px = Math.cos(i * angleStep) * damageSize * distort;
                            const py = Math.sin(i * angleStep) * damageSize * distort;
                            points.push({ x: px, y: py });
                        }
                    }
                    
                    this.damageEffects.bodyDamage.push({
                        type: 'dent',
                        x: hitPosition.x + Math.cos(offsetAngle) * offsetDist,
                        y: hitPosition.y + Math.sin(offsetAngle) * offsetDist,
                        size: damageSize,
                        shapeType: shapeType,
                        points: points, // Only used if shapeType is 'polygon'
                        // Higher damage levels cause more severe/darker damage
                        color: `rgba(30, 30, 30, ${0.6 + (threshold / 100) * 0.4})`,
                        rotation: Math.random() * Math.PI
                    });
                }
            }
        }
    }
    
    /**
     * Finds the index of the oldest particle in an array
     * @param {Array} particleArray - Array of particles with createdAt timestamps
     * @returns {number} Index of the oldest particle, or -1 if array is empty
     * @private
     */
    _findOldestParticleIndex(particleArray) {
        if (particleArray.length === 0) return -1;
        
        let oldestIdx = 0;
        let oldestTime = particleArray[0].createdAt || Date.now();
        
        for (let i = 1; i < particleArray.length; i++) {
            const time = particleArray[i].createdAt || Date.now();
            if (time < oldestTime) {
                oldestTime = time;
                oldestIdx = i;
            }
        }
        
        return oldestIdx;
    }
}

class Missile {
    constructor(x, y, direction, speed, power, turretType = 'standard') {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.power = power;
        this.radius = 3 + power;
        this.turretType = turretType; // Store the turret type for rendering
    }

    update() {
        const radians = this.direction * Math.PI / 180;
        this.x += Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed; // Canvas y-axis is inverted
    }
}

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f39c12';
        ctx.fill();
    }
}