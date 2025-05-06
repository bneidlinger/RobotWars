/**
 * ParticleSystem.js - A generalized particle effects system for Robot Wars
 * 
 * This system manages various types of particle effects (explosions, trails, dust, debris, etc.)
 * and provides a unified interface for creating, updating, and rendering particles.
 */

class ParticleSystem {
    constructor() {
        // Active particle arrays by category
        this.particles = {
            explosion: [],
            smoke: [],
            spark: [],
            debris: [],
            trail: [],
            dust: [],
            impact: []
        };
        
        // Configuration for maximum particles by type
        this.maxParticles = {
            explosion: 50,
            smoke: 200,
            spark: 150,
            debris: 100,
            trail: 300,
            dust: 100,
            impact: 75
        };
        
        // Default template configurations for each particle type
        this.templates = {
            // Explosion particles - orange/red/yellow fireballs with rapid fade
            explosion: {
                size: { min: 8, max: 15 },
                alpha: { min: 0.7, max: 1.0 },
                speed: { min: 1, max: 3 },
                lifetime: { min: 500, max: 800 },
                fadeSpeed: 0.01,
                shrinkSpeed: 0.02,
                gravity: 0.02,
                colors: ['#ff5500', '#ff8800', '#ffaa00', '#ffcc00'],
                glow: true,
                glowSize: 2.5,
                shape: 'circle'
            },
            
            // Smoke particles - gray clouds with growth and slow fade
            smoke: {
                size: { min: 5, max: 10 },
                alpha: { min: 0.4, max: 0.7 },
                speed: { min: 0.5, max: 1.5 },
                lifetime: { min: 1000, max: 2000 },
                growth: 0.05,
                fadeSpeed: 0.005,
                gravity: -0.1, // Negative means rise up
                colors: ['rgba(80,80,80,0.8)', 'rgba(100,100,100,0.8)', 'rgba(120,120,120,0.7)'],
                glow: false,
                shape: 'circle'
            },
            
            // Spark particles - bright fast-moving particles with quick fade
            spark: {
                size: { min: 1, max: 3 },
                alpha: { min: 0.8, max: 1.0 },
                speed: { min: 3, max: 6 },
                lifetime: { min: 300, max: 600 },
                fadeSpeed: 0.02,
                shrinkSpeed: 0.01,
                gravity: 0.05,
                colors: ['#ffff00', '#ffcc00', '#ffffff', '#ffaa00'],
                glow: true,
                glowSize: 4,
                shape: 'circle'
            },
            
            // Debris particles - physical chunks with gravity and bouncing
            debris: {
                size: { min: 2, max: 5 },
                alpha: { min: 0.8, max: 1.0 },
                speed: { min: 2, max: 4 },
                lifetime: { min: 800, max: 1500 },
                fadeSpeed: 0.006,
                shrinkSpeed: 0.004,
                gravity: 0.15,
                bounce: 0.4, // Bounce elasticity (0-1)
                colors: ['#555555', '#777777', '#333333', '#999999'],
                glow: false,
                shape: 'polygon'
            },
            
            // Trail particles - follow moving objects
            trail: {
                size: { min: 3, max: 5 },
                alpha: { min: 0.3, max: 0.7 },
                speed: { min: 0.1, max: 0.5 },
                lifetime: { min: 400, max: 700 },
                fadeSpeed: 0.02,
                shrinkSpeed: 0.01,
                gravity: 0,
                colors: ['rgba(255,160,50,0.6)', 'rgba(255,120,50,0.5)', 'rgba(200,200,200,0.5)'],
                glow: false,
                shape: 'circle'
            },
            
            // Dust particles - subtle environmental effects
            dust: {
                size: { min: 2, max: 4 },
                alpha: { min: 0.1, max: 0.3 },
                speed: { min: 0.2, max: 0.6 },
                lifetime: { min: 2000, max: 4000 },
                fadeSpeed: 0.003,
                shrinkSpeed: 0,
                growth: 0.001,
                gravity: -0.01,
                colors: ['rgba(200,200,200,0.3)', 'rgba(180,180,180,0.3)', 'rgba(160,160,160,0.3)'],
                glow: false,
                shape: 'circle'
            },
            
            // Impact particles - quick flash with debris
            impact: {
                size: { min: 4, max: 8 },
                alpha: { min: 0.6, max: 0.9 },
                speed: { min: 1, max: 3 },
                lifetime: { min: 300, max: 500 },
                fadeSpeed: 0.02,
                shrinkSpeed: 0.01,
                gravity: 0,
                colors: ['#ffffff', '#ffee88', '#ffcc00'],
                glow: true,
                glowSize: 3,
                shape: 'circle'
            }
        };
    }
    
    /**
     * Creates a new particle effect at the specified location
     * @param {string} type - Type of particle effect to create (explosion, smoke, etc.)
     * @param {number} x - X coordinate of effect center
     * @param {number} y - Y coordinate of effect center
     * @param {number} count - Number of particles to create
     * @param {Object} options - Optional override settings for the particle template
     * @returns {Array} Array of created particles (useful for tracking specific effects)
     */
    createEffect(type, x, y, count = 10, options = {}) {
        // Get the template for this particle type or use a default
        const template = this.templates[type] || this.templates.smoke;
        
        // Limit the maximum count to prevent performance issues
        const safeCount = Math.min(count, 100); 
        
        // Array to hold all particles for this effect
        const createdParticles = [];
        
        // Create the requested number of particles
        for (let i = 0; i < safeCount; i++) {
            // Generate a particle using the template and any custom options
            const particle = this._createParticle(x, y, template, options);
            
            // Add to the appropriate category array
            if (this.particles[type]) {
                // Check if we need to remove old particles to stay under the limit
                if (this.particles[type].length >= this.maxParticles[type]) {
                    // Find the oldest particle to replace
                    let oldestIdx = 0;
                    let oldestTime = this.particles[type][0].createdAt || Date.now();
                    
                    for (let j = 1; j < this.particles[type].length; j++) {
                        const time = this.particles[type][j].createdAt || Date.now();
                        if (time < oldestTime) {
                            oldestTime = time;
                            oldestIdx = j;
                        }
                    }
                    
                    // Replace the oldest particle
                    this.particles[type][oldestIdx] = particle;
                    createdParticles.push(particle);
                } else {
                    // Add new particle
                    this.particles[type].push(particle);
                    createdParticles.push(particle);
                }
            }
        }
        
        return createdParticles;
    }
    
    /**
     * Creates a particle emitter that continually spawns particles
     * @param {string} type - Type of particles to emit
     * @param {number} x - Initial X coordinate of emitter
     * @param {number} y - Initial Y coordinate of emitter
     * @param {Object} emitterOptions - Options for the emitter behavior
     * @param {Object} particleOptions - Options for the emitted particles
     * @returns {Object} Emitter object that can be updated or stopped
     */
    createEmitter(type, x, y, emitterOptions = {}, particleOptions = {}) {
        // Default emitter options
        const options = {
            rate: emitterOptions.rate || 10, // Particles per second
            duration: emitterOptions.duration || 0, // 0 = infinite
            radius: emitterOptions.radius || 0, // Spawn radius
            angle: emitterOptions.angle || { min: 0, max: 360 }, // Emission angle range
            active: true,
            createdAt: Date.now(),
            update: function(dt, x, y) {
                // If emitter has a set position, use it, otherwise use passed coordinates
                const emitX = this.x !== undefined ? this.x : x;
                const emitY = this.y !== undefined ? this.y : y;
                
                // Check if we should stop the emitter based on duration
                if (this.duration > 0 && Date.now() - this.createdAt > this.duration) {
                    this.active = false;
                    return false;
                }
                
                // Calculate how many particles to emit this frame
                // rate is particles per second, dt is in milliseconds
                const particlesToEmit = Math.floor((this.rate * dt) / 1000);
                
                // Emit particles
                if (particlesToEmit > 0 && this.active) {
                    for (let i = 0; i < particlesToEmit; i++) {
                        // Calculate emission position within radius
                        let posX = emitX, posY = emitY;
                        if (this.radius > 0) {
                            const angle = Math.random() * Math.PI * 2;
                            const distance = Math.random() * this.radius;
                            posX += Math.cos(angle) * distance;
                            posY += Math.sin(angle) * distance;
                        }
                        
                        // Create particle at calculated position
                        particleSystem.createEffect(type, posX, posY, 1, particleOptions);
                    }
                }
                
                return this.active;
            }
        };
        
        // Override with any custom emitter options
        Object.assign(options, emitterOptions);
        
        // Add to emitters list for tracking
        this.emitters = this.emitters || [];
        this.emitters.push(options);
        
        return options;
    }
    
    /**
     * Creates a particle with randomized properties based on a template
     * @param {number} x - X coordinate of the particle
     * @param {number} y - Y coordinate of the particle
     * @param {Object} template - Template settings
     * @param {Object} options - Custom override options
     * @returns {Object} A new particle object
     * @private
     */
    _createParticle(x, y, template, options = {}) {
        // Get the current time for tracking particle age
        const now = Date.now();
        
        // Choose a random angle for the particle's movement
        const angle = options.angle !== undefined ? 
            options.angle : Math.random() * Math.PI * 2;
        
        // Get random values from ranges
        const size = this._getRandomRange(options.size || template.size);
        const alpha = this._getRandomRange(options.alpha || template.alpha);
        const speed = this._getRandomRange(options.speed || template.speed);
        const lifetime = this._getRandomRange(options.lifetime || template.lifetime);
        
        // Calculate velocity components based on angle and speed
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        // Select a random color from the available colors
        const colors = options.colors || template.colors;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Create the particle object with default values from template and any overrides
        const particle = {
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            size: size,
            initialSize: size, // Remember initial size for scaling effects
            alpha: alpha,
            initialAlpha: alpha, // Remember initial alpha for fading
            fadeSpeed: options.fadeSpeed || template.fadeSpeed || 0.01,
            shrinkSpeed: options.shrinkSpeed || template.shrinkSpeed || 0,
            growth: options.growth || template.growth || 0,
            gravity: options.gravity || template.gravity || 0,
            color: color,
            glow: options.glow !== undefined ? options.glow : template.glow,
            glowSize: options.glowSize || template.glowSize || 2,
            lifetime: lifetime,
            age: 0,
            createdAt: now,
            bounce: options.bounce || template.bounce || 0,
            shape: options.shape || template.shape || 'circle',
            rotation: Math.random() * Math.PI * 2, // Random rotation for non-circular shapes
            rotationSpeed: (Math.random() - 0.5) * 0.1, // Random rotation speed
            // For polygons, generate point data
            points: options.points || this._generatePolygonPoints(size, options.complexity || 5)
        };
        
        return particle;
    }
    
    /**
     * Generate random points for a polygon-shaped particle
     * @param {number} size - Base size of the particle
     * @param {number} complexity - Number of vertices to generate
     * @returns {Array} Array of point coordinates
     * @private
     */
    _generatePolygonPoints(size, complexity) {
        const points = [];
        const pointCount = 3 + Math.floor(Math.random() * complexity);
        const angleStep = (Math.PI * 2) / pointCount;
        
        for (let i = 0; i < pointCount; i++) {
            const angle = i * angleStep;
            // Vary the distance from center to create an irregular shape
            const distance = size * (0.7 + Math.random() * 0.6);
            points.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance
            });
        }
        
        return points;
    }
    
    /**
     * Get a random value from a range object
     * @param {Object|number} range - Range object with min/max or a fixed value
     * @returns {number} Random value within the range
     * @private
     */
    _getRandomRange(range) {
        if (typeof range === 'object' && range !== null) {
            return range.min + Math.random() * (range.max - range.min);
        }
        return range || 0;
    }
    
    /**
     * Updates all active particles based on elapsed time
     * @param {number} dt - Delta time in milliseconds since last update
     */
    update(dt) {
        // Convert milliseconds to seconds for physics calculations
        const dtSec = dt / 1000;
        
        // Update emitters first
        if (this.emitters && this.emitters.length > 0) {
            for (let i = this.emitters.length - 1; i >= 0; i--) {
                const emitter = this.emitters[i];
                // If emitter's update returns false, remove it
                if (!emitter.update(dt, emitter.x, emitter.y)) {
                    this.emitters.splice(i, 1);
                }
            }
        }
        
        // Update all particle categories
        for (const type in this.particles) {
            if (!this.particles[type]) continue;
            
            const particles = this.particles[type];
            
            // Update all particles of this type
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                
                // Update age
                p.age += dt;
                
                // Remove if past lifetime
                if (p.lifetime && p.age >= p.lifetime) {
                    particles.splice(i, 1);
                    continue;
                }
                
                // Apply physics
                
                // Gravity
                if (p.gravity) {
                    p.vy += p.gravity * dtSec;
                }
                
                // Update position
                p.x += p.vx;
                p.y += p.vy;
                
                // Bounce off bottom of screen
                if (p.bounce && p.y > this.height && p.vy > 0) {
                    p.vy = -p.vy * p.bounce;
                    p.vx *= 0.9; // Add some horizontal friction
                }
                
                // Size changes
                if (p.shrinkSpeed) {
                    p.size -= p.shrinkSpeed * dt;
                    // Remove if too small
                    if (p.size <= 0.1) {
                        particles.splice(i, 1);
                        continue;
                    }
                } else if (p.growth) {
                    p.size += p.growth * dt;
                }
                
                // Alpha/fading
                if (p.fadeSpeed) {
                    p.alpha -= p.fadeSpeed * dt;
                    // Remove if invisible
                    if (p.alpha <= 0) {
                        particles.splice(i, 1);
                        continue;
                    }
                }
                
                // Update rotation for non-circular particles
                if (p.shape !== 'circle' && p.rotationSpeed) {
                    p.rotation += p.rotationSpeed * dt;
                }
            }
        }
    }
    
    /**
     * Renders all active particles to the canvas
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    render(ctx) {
        // If we don't have a context, exit
        if (!ctx) return;
        
        ctx.save();
        
        // Store canvas dimensions for reference
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        
        // Render each type of particle
        for (const type in this.particles) {
            if (!this.particles[type] || this.particles[type].length === 0) continue;
            
            const particles = this.particles[type];
            
            // Set appropriate composite operation based on particle type
            if (type === 'explosion' || type === 'spark' || type === 'impact') {
                ctx.globalCompositeOperation = 'lighter';
            } else {
                ctx.globalCompositeOperation = 'source-over';
            }
            
            // Render all particles of this type
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                
                // Skip invalid particles
                if (!p || typeof p.x !== 'number' || typeof p.y !== 'number') continue;
                
                // Setup drawing style
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                
                // Add glow effect if the particle has it
                if (p.glow) {
                    ctx.shadowColor = p.color;
                    ctx.shadowBlur = p.size * p.glowSize;
                }
                
                // Draw the particle using its specified shape
                switch (p.shape) {
                    case 'polygon':
                        // Draw an irregular polygon
                        if (p.points && p.points.length >= 3) {
                            ctx.save();
                            ctx.translate(p.x, p.y);
                            ctx.rotate(p.rotation);
                            
                            ctx.beginPath();
                            ctx.moveTo(p.points[0].x, p.points[0].y);
                            for (let j = 1; j < p.points.length; j++) {
                                ctx.lineTo(p.points[j].x, p.points[j].y);
                            }
                            ctx.closePath();
                            ctx.fill();
                            
                            ctx.restore();
                        } else {
                            // Fallback to circle if points are invalid
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        break;
                        
                    case 'rect':
                        // Draw a rectangle with optional rotation
                        ctx.save();
                        ctx.translate(p.x, p.y);
                        ctx.rotate(p.rotation);
                        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                        ctx.restore();
                        break;
                        
                    case 'triangle':
                        // Draw a triangle
                        ctx.save();
                        ctx.translate(p.x, p.y);
                        ctx.rotate(p.rotation);
                        
                        ctx.beginPath();
                        ctx.moveTo(0, -p.size);
                        ctx.lineTo(-p.size * 0.866, p.size * 0.5);
                        ctx.lineTo(p.size * 0.866, p.size * 0.5);
                        ctx.closePath();
                        ctx.fill();
                        
                        ctx.restore();
                        break;
                    
                    case 'circle':
                    default:
                        // Default to simple circle for most particles
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                }
                
                // Reset shadow settings to improve performance
                if (p.glow) {
                    ctx.shadowBlur = 0;
                }
            }
        }
        
        ctx.restore();
    }
    
    /**
     * Creates an explosion effect at the specified position
     * @param {number} x - X coordinate of explosion center
     * @param {number} y - Y coordinate of explosion center
     * @param {number} size - Size of the explosion (scale factor)
     * @param {Object} options - Custom options for the explosion particles
     */
    createExplosion(x, y, size = 1, options = {}) {
        // Determine basic parameters based on size
        const particleCount = Math.floor(20 * size);
        const smokeCount = Math.floor(15 * size);
        const sparkCount = Math.floor(30 * size);
        const debrisCount = Math.floor(10 * size);
        
        // Create main explosion particles
        this.createEffect('explosion', x, y, particleCount, {
            size: { min: 8 * size, max: 15 * size },
            speed: { min: 1 * size, max: 3 * size },
            ...options
        });
        
        // Create accompanying smoke
        this.createEffect('smoke', x, y, smokeCount, {
            size: { min: 5 * size, max: 10 * size },
            speed: { min: 0.5 * size, max: 1.5 * size }
        });
        
        // Create accompanying sparks
        this.createEffect('spark', x, y, sparkCount, {
            size: { min: 1 * size, max: 3 * size },
            speed: { min: 3 * size, max: 6 * size }
        });
        
        // Create debris
        this.createEffect('debris', x, y, debrisCount, {
            size: { min: 2 * size, max: 5 * size },
            speed: { min: 2 * size, max: 4 * size }
        });
        
        // Create a brief flash of light
        this.createEffect('impact', x, y, 3, {
            size: { min: 20 * size, max: 30 * size },
            lifetime: { min: 100, max: 200 },
            fadeSpeed: 0.05,
            speed: 0
        });
    }
    
    /**
     * Creates a missile trail emitter
     * @param {Object} missile - Missile object to track
     * @param {string} type - Type of missile (determines trail appearance)
     * @returns {Object} Emitter object that follows the missile
     */
    createMissileTrail(missile, type = 'standard') {
        const trailOptions = {
            standard: {
                rate: 25,
                color: 'rgba(255,160,50,0.6)',
                size: { min: 3, max: 5 },
                lifetime: { min: 400, max: 600 }
            },
            laser: {
                rate: 35,
                color: 'rgba(0,200,255,0.6)',
                size: { min: 2, max: 4 },
                lifetime: { min: 300, max: 500 },
                glow: true,
                glowSize: 3
            },
            plasma: {
                rate: 30,
                color: 'rgba(0,255,100,0.7)',
                size: { min: 3, max: 6 },
                lifetime: { min: 400, max: 700 },
                glow: true,
                glowSize: 2.5
            },
            heavy: {
                rate: 20,
                color: 'rgba(100,100,100,0.8)',
                size: { min: 4, max: 7 },
                lifetime: { min: 600, max: 900 }
            }
        };
        
        const options = trailOptions[type] || trailOptions.standard;
        
        // Create an emitter that follows the missile
        const emitter = this.createEmitter('trail', missile.x, missile.y, {
            rate: options.rate,
            radius: 2,
            // Update function to track missile position
            update: function(dt) {
                if (!missile || missile.destroyed) {
                    return false; // Stop the emitter if missile is gone
                }
                this.x = missile.x;
                this.y = missile.y;
                
                // Calculate how many particles to emit this frame
                const particlesToEmit = Math.floor((this.rate * dt) / 1000);
                
                // Emit trail particles behind the missile
                if (particlesToEmit > 0) {
                    for (let i = 0; i < particlesToEmit; i++) {
                        // Calculate emission position with slight randomization
                        const offsetX = (Math.random() - 0.5) * 2;
                        const offsetY = (Math.random() - 0.5) * 2;
                        
                        // Get angle opposite to missile direction
                        const rads = missile.direction * Math.PI / 180;
                        const trailX = missile.x - Math.cos(rads) * 5 + offsetX;
                        const trailY = missile.y + Math.sin(rads) * 5 + offsetY;
                        
                        // Create particle
                        particleSystem.createEffect('trail', trailX, trailY, 1, {
                            angle: rads + Math.PI, // Opposite to missile direction
                            color: options.color,
                            size: options.size,
                            lifetime: options.lifetime,
                            glow: options.glow,
                            glowSize: options.glowSize
                        });
                    }
                }
                
                return true; // Keep the emitter active
            }
        });
        
        return emitter;
    }
    
    /**
     * Clear all particles of a specific type or all particles if no type specified
     * @param {string} type - Particle type to clear (omit to clear all)
     */
    clearParticles(type = null) {
        if (type && this.particles[type]) {
            this.particles[type] = [];
        } else if (!type) {
            // Clear all particle types
            for (const t in this.particles) {
                this.particles[t] = [];
            }
        }
    }
    
    /**
     * Returns the total number of active particles
     * @returns {number} Total particle count
     */
    getParticleCount() {
        let count = 0;
        for (const type in this.particles) {
            count += this.particles[type].length;
        }
        return count;
    }
}

// Create a global instance for use throughout the application
const particleSystem = new ParticleSystem();

// Make the particle system available globally
window.particleSystem = particleSystem;