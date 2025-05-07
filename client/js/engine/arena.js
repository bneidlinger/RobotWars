// client/js/engine/arena.js
// This class will be exposed to the global window object at the end of the file

/**
 * Manages the rendering of the game arena canvas, including the background,
 * grid, robots (based on visual loadout data), missiles (with unique visuals/trails),
 * scorch marks, muzzle flashes, and enhanced particle-based explosion effects.
 */
class Arena { // File name remains Arena, class concept is Renderer
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) throw new Error(`Canvas element with ID "${canvasId}" not found.`);
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) throw new Error(`Failed to get 2D context for canvas "${canvasId}".`);

        this.width = this.canvas.width;
        this.height = this.canvas.height;
        if (!this.width || this.width <= 0 || !this.height || this.height <= 0) {
            console.error(`Canvas "${canvasId}" has invalid dimensions (${this.canvas.width}x${this.canvas.height}). Halting setup.`);
            throw new Error(`Canvas "${canvasId}" requires valid width and height attributes.`);
        }
        console.log(`Renderer initialized with dimensions: ${this.width}x${this.height}`);

        this.robots = []; // Populated by Game class with data from server

        // Background Canvas for Persistence (scorch marks, grid)
        this.backgroundCanvas = document.createElement('canvas');
        this.backgroundCanvas.width = this.width;
        this.backgroundCanvas.height = this.height;
        this.backgroundCtx = this.backgroundCanvas.getContext('2d');
        if (!this.backgroundCtx) throw new Error(`Failed to get 2D context for background canvas.`);

        // Grid Configuration
        this.gridSize = 50;
        this.gridColor = '#444444';

        // Shadow Configuration
        this.shadowConfig = {
            enabled: true,            // Can be toggled off for performance
            offsetX: 5,               // X offset for shadow from robot position
            offsetY: 5,               // Y offset for shadow from robot position
            blur: 5,                  // Blur amount for the shadow
            color: 'rgba(0,0,0,0.4)', // Shadow color and opacity
            scale: 0.85               // Size of shadow relative to robot (0.5-1.0)
        };
        
        // Dynamic Lighting Configuration
        this.lightingConfig = {
            enabled: true,            // Can be toggled off for performance
            explosionLight: {
                radius: 150,          // Light radius for explosions
                intensity: 0.7,       // Light intensity (0-1)
                duration: 800,        // Duration in ms
                falloff: 2            // Light falloff (1-3, higher = sharper falloff)
            },
            missileLight: {
                radius: 50,           // Light radius for missile firing
                intensity: 0.4,       // Light intensity (0-1)
                duration: 300,        // Duration in ms
                falloff: 1.5          // Light falloff
            }
        };
        
        // Ambient Lighting Configuration
        this.ambientConfig = {
            enabled: true,                // Can be toggled on/off
            mode: 'day',                  // 'day', 'night', 'dusk'
            nightIntensity: 0.7,          // Darkness level for night mode (0-1)
            duskIntensity: 0.4,           // Darkness level for dusk/dawn mode (0-1)
            colorFilter: {                // Color tint for different lighting conditions
                day: { r: 255, g: 255, b: 255 },      // Normal daylight (no tint)
                night: { r: 40, g: 45, b: 80 },       // Blue-ish night tint
                dusk: { r: 255, g: 180, b: 130 }      // Orange-ish sunset tint
            },
            spotlights: {
                enabled: true,            // Enable spotlight effects at night
                count: 4,                 // Number of spotlights
                intensity: 0.4,           // Spotlight intensity
                radius: 200,              // Spotlight radius
                movement: {               // Spotlight movement pattern
                    enabled: true,        // Whether spotlights move
                    speed: 0.0002,        // Movement speed factor
                    range: 0.3            // Movement range (fraction of arena size)
                }
            }
        };
        
        // Active Light Sources Array
        this.activeLightSources = [];
        
        // Permanent Light Sources (like arena spotlights)
        this.permanentLightSources = [];

        // Persistent Scorch Marks
        this.scorchMarks = []; // Array to track all scorch marks
        this.loadScorchMarks(); // Load saved scorch marks from localStorage

        // Background Texture Loading
        this.backgroundPattern = null;
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => {
            if (this.ctx && this.backgroundCtx) {
                this.backgroundPattern = this.ctx.createPattern(this.backgroundImage, 'repeat');
                console.log("Arena background texture loaded.");
                this.redrawArenaBackground(); // Redraw background once image is loaded
            } else { console.error("Context lost before background pattern could be created/drawn."); }
        };
        this.backgroundImage.onerror = () => {
            console.error("Failed to load arena background texture.");
            this.redrawArenaBackground(); // Draw fallback color/grid
        };
        this.backgroundImage.src = 'assets/images/metal_floor.png'; // Path to your texture

        this.redrawArenaBackground(); // Initial draw (might be fallback color initially)
        
        // Initialize night mode
        // Default is day mode as defined in ambientConfig
        // Uncomment the line below to initially set night mode
        // this.setAmbientMode('night');
        
        // Initialize spotlights if currently in night mode
        if (this.ambientConfig.enabled && 
            this.ambientConfig.mode !== 'day' && 
            this.ambientConfig.spotlights.enabled) {
            this.initSpotlights();
        }
    }

    // --- Coordinate Translation Helpers ---
    // Currently 1:1, but could be used for camera panning/zooming later
    translateX(gameX) { return gameX; }
    translateY(gameY) { return gameY; }

    // --- Background Canvas Methods ---
    /** Draws the background texture/color */
    drawBackgroundTexture(targetCtx) {
        targetCtx.clearRect(0, 0, this.width, this.height);
        targetCtx.fillStyle = this.backgroundPattern || '#2c2c2c'; // Use pattern or fallback color
        targetCtx.fillRect(0, 0, this.width, this.height);
    }
    /** Draws the grid lines */
    drawGridLines(targetCtx) {
        targetCtx.save();
        targetCtx.strokeStyle = this.gridColor;
        targetCtx.lineWidth = 0.5;
        // Vertical lines
        for (let x = this.gridSize; x < this.width; x += this.gridSize) {
            targetCtx.beginPath(); targetCtx.moveTo(x, 0); targetCtx.lineTo(x, this.height); targetCtx.stroke();
        }
        // Horizontal lines
        for (let y = this.gridSize; y < this.height; y += this.gridSize) {
            targetCtx.beginPath(); targetCtx.moveTo(0, y); targetCtx.lineTo(this.width, y); targetCtx.stroke();
        }
        targetCtx.restore();
    }
    /** 
     * Redraws the persistent background canvas (texture, grid, and saved scorch marks)
     * @param {boolean} clearScorchMarks - If true, all scorch marks will be cleared
     */
    redrawArenaBackground(clearScorchMarks = false) {
        console.log("Redrawing arena background canvas" + (clearScorchMarks ? " (clearing all scorch marks)" : ""));
        if (!this.backgroundCtx) return;
        
        // Clear canvas and draw base elements
        this.drawBackgroundTexture(this.backgroundCtx);
        this.drawGridLines(this.backgroundCtx);
        
        // Clear scorch marks if requested
        if (clearScorchMarks) {
            this.scorchMarks = [];
            this.saveScorchMarks();
            console.log("All scorch marks have been cleared");
        } else {
            // Draw stored scorch marks on top of the background
            this.drawStoredScorchMarks();
        }
    }
    /** 
     * Load saved scorch marks from localStorage 
     */
    loadScorchMarks() {
        try {
            const savedScorchMarks = localStorage.getItem('robotWarsScorchMarks');
            if (savedScorchMarks) {
                this.scorchMarks = JSON.parse(savedScorchMarks);
                console.log(`Loaded ${this.scorchMarks.length} scorch marks from storage`);
            } else {
                console.log('No saved scorch marks found');
                this.scorchMarks = [];
            }
        } catch (e) {
            console.error('Error loading scorch marks:', e);
            this.scorchMarks = [];
        }
    }
    
    /** 
     * Save scorch marks to localStorage 
     */
    saveScorchMarks() {
        try {
            // Limit the number of scorch marks to prevent excessive storage
            const maxScorchMarks = 50;
            if (this.scorchMarks.length > maxScorchMarks) {
                // Remove oldest marks if we exceed the limit
                this.scorchMarks = this.scorchMarks.slice(-maxScorchMarks);
            }
            
            localStorage.setItem('robotWarsScorchMarks', JSON.stringify(this.scorchMarks));
        } catch (e) {
            console.error('Error saving scorch marks:', e);
        }
    }

    /** 
     * Draw all stored scorch marks to the background canvas 
     */
    drawStoredScorchMarks() {
        if (!this.backgroundCtx || !this.scorchMarks.length) return;
        
        this.scorchMarks.forEach(mark => {
            const canvasX = this.translateX(mark.x);
            const canvasY = this.translateY(mark.y);
            
            // Draw the base scorch mark
            this.backgroundCtx.fillStyle = `rgba(${mark.r}, ${mark.g}, ${mark.b}, ${mark.alpha})`;
            this.backgroundCtx.beginPath();
            this.backgroundCtx.arc(canvasX, canvasY, mark.radius, 0, Math.PI * 2);
            this.backgroundCtx.fill();
            
            // Add some texture to the scorch mark
            if (mark.details) {
                mark.details.forEach(detail => {
                    const detailX = canvasX + detail.offsetX;
                    const detailY = canvasY + detail.offsetY;
                    
                    this.backgroundCtx.fillStyle = `rgba(${detail.r}, ${detail.g}, ${detail.b}, ${detail.alpha})`;
                    this.backgroundCtx.beginPath();
                    this.backgroundCtx.arc(detailX, detailY, detail.radius, 0, Math.PI * 2);
                    this.backgroundCtx.fill();
                });
            }
        });
    }
    
    /** 
     * Adds a randomized scorch mark to the persistent background canvas and saves it
     */
    addScorchMark(x, y, radius) {
        if (!this.backgroundCtx) return;
        
        const canvasX = this.translateX(x);
        const canvasY = this.translateY(y);
        
        // Create a randomized scorch mark
        const baseRadius = radius * (0.9 + Math.random() * 0.4); // Vary the radius slightly
        const alpha = 0.5 + Math.random() * 0.3; // Random transparency
        
        // Random color variations - mostly black but with occasional dark red or brown tints
        let r, g, b;
        if (Math.random() < 0.3) {
            // Dark red/brown tint for some scorch marks (like heated metal)
            r = 30 + Math.floor(Math.random() * 20);
            g = 15 + Math.floor(Math.random() * 10);
            b = 10 + Math.floor(Math.random() * 5);
        } else {
            // Standard dark/black scorch mark
            const darkVal = 15 + Math.floor(Math.random() * 10);
            r = darkVal;
            g = darkVal;
            b = darkVal;
        }
        
        // Draw the primary scorch mark
        this.backgroundCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        this.backgroundCtx.beginPath();
        this.backgroundCtx.arc(canvasX, canvasY, baseRadius, 0, Math.PI * 2);
        this.backgroundCtx.fill();
        
        // Create some additional texture details
        const numDetails = 2 + Math.floor(Math.random() * 4); // 2-5 detail spots
        const details = [];
        
        for (let i = 0; i < numDetails; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * baseRadius * 0.7; // Within 70% of the radius
            const detailRadius = baseRadius * 0.1 + Math.random() * baseRadius * 0.3; // 10%-40% of main radius
            
            // Calculate offset
            const offsetX = Math.cos(angle) * distance;
            const offsetY = Math.sin(angle) * distance;
            
            // Randomize detail color - darker or lighter than the main mark
            let detailR, detailG, detailB, detailAlpha;
            if (Math.random() < 0.7) {
                // Darker spot
                detailR = Math.max(0, r - 10 - Math.floor(Math.random() * 10));
                detailG = Math.max(0, g - 10 - Math.floor(Math.random() * 10));
                detailB = Math.max(0, b - 5 - Math.floor(Math.random() * 10));
                detailAlpha = alpha + 0.1;
            } else {
                // Lighter spot (ash)
                detailR = Math.min(60, r + 20 + Math.floor(Math.random() * 20));
                detailG = Math.min(60, g + 20 + Math.floor(Math.random() * 20));
                detailB = Math.min(60, b + 20 + Math.floor(Math.random() * 20));
                detailAlpha = alpha - 0.1;
            }
            
            // Draw the detail
            this.backgroundCtx.fillStyle = `rgba(${detailR}, ${detailG}, ${detailB}, ${detailAlpha})`;
            this.backgroundCtx.beginPath();
            this.backgroundCtx.arc(canvasX + offsetX, canvasY + offsetY, detailRadius, 0, Math.PI * 2);
            this.backgroundCtx.fill();
            
            // Store detail data
            details.push({
                offsetX, offsetY, radius: detailRadius,
                r: detailR, g: detailG, b: detailB, alpha: detailAlpha
            });
        }
        
        // Store the scorch mark data
        this.scorchMarks.push({
            x, y, radius: baseRadius, r, g, b, alpha, details,
            timestamp: Date.now()
        });
        
        // Save updated scorch marks
        this.saveScorchMarks();
    }

    // === START: Enhanced Robot Drawing System ===
    /**
     * Main function to draw all robots based on data from Game class,
     * using the 'visuals' property for component types and colors.
     * Includes name and health bar. Checks visibility flag.
     * Now includes shadows beneath robots.
     */
    drawRobots() {
        const ctx = this.ctx;
        if (!ctx || !this.robots) return;

        const baseRadius = 15; // Use a consistent base size reference

        // First pass - Draw all robot shadows
        // Drawing shadows first ensures they appear beneath all robots
        if (this.shadowConfig.enabled) {
            this.robots.forEach(robotData => {
                // Skip if data is missing or robot is not visible/alive
                if (!robotData || !robotData.isAlive) return;
                
                // Ensure visuals data exists, provide defaults if missing
                const visuals = robotData.visuals || {
                    chassis: { type: 'medium', color: '#aaaaaa' }
                };
                const chassisType = visuals.chassis?.type || 'medium';
                
                // Get robot position 
                const robotX = this.translateX(robotData.x || 0);
                const robotY = this.translateY(robotData.y || 0);
                
                // Draw the shadow (passing robot data, position, base size, and chassis type)
                this._drawShadow(ctx, robotData, robotX, robotY, baseRadius, chassisType);
            });
        }

        // Second pass - Draw all robots (main rendering)
        this.robots.forEach(robotData => {
            // Skip if data is missing or robot is not visible/alive
            // Use robotData.isAlive which comes from the server state
            if (!robotData || !robotData.isAlive) return;

            // Ensure visuals data exists, provide defaults if missing
            const visuals = robotData.visuals || {
                turret: { type: 'standard', color: '#ffffff' },
                chassis: { type: 'medium', color: '#aaaaaa' },
                mobility: { type: 'wheels' },
                beacon: { type: 'none', color: '#ffffff', strobe: false }
            };
            const chassisColor = visuals.chassis?.color || '#aaaaaa';
            const turretColor = visuals.turret?.color || '#ffffff';
            const mobilityType = visuals.mobility?.type || 'wheels';
            const chassisType = visuals.chassis?.type || 'medium';
            const turretType = visuals.turret?.type || 'standard';
            const beaconType = visuals.beacon?.type || 'none';
            const beaconColor = visuals.beacon?.color || '#ffffff';
            const beaconStrobe = visuals.beacon?.strobe || false;

            // Get robot position and direction
            const robotX = this.translateX(robotData.x || 0);
            const robotY = this.translateY(robotData.y || 0);
            const robotDir = robotData.direction || 0; // Robot's body direction
            const radians = robotDir * Math.PI / 180;

            // Initialize damage effects if missing
            if (!robotData.damageEffects) {
                robotData.damageEffects = {
                    smoke: [],
                    fire: [],
                    bodyDamage: [],
                    lastHitTime: 0,
                    hitPositions: []
                };
            }

            // Make sure all damage effect arrays exist
            if (!robotData.damageEffects.smoke) robotData.damageEffects.smoke = [];
            if (!robotData.damageEffects.fire) robotData.damageEffects.fire = [];
            if (!robotData.damageEffects.bodyDamage) robotData.damageEffects.bodyDamage = [];
            if (!robotData.damageEffects.hitPositions) robotData.damageEffects.hitPositions = [];
            if (robotData.damageEffects.lastHitTime === undefined) robotData.damageEffects.lastHitTime = 0;

            // --- Draw Damage Effects (Behind Robot) - Smoke ---
            if (robotData.damageEffects.smoke.length > 0) {
                this._drawSmokeEffects(ctx, robotData, robotX, robotY, radians);
            }

            ctx.save(); // Save context state before drawing this robot

            // Translate and rotate context to robot's position and orientation
            ctx.translate(robotX, robotY);
            ctx.rotate(radians);

            // --- Draw Robot Components (Layered) ---
            ctx.lineWidth = 1; // Base line width
            ctx.strokeStyle = '#111'; // Base stroke color (outline)

            // 1. Draw Mobility (Bottom Layer)
            this._drawMobility(ctx, mobilityType, baseRadius, chassisColor);

            // 2. Draw Chassis (Middle Layer)
            this._drawChassis(ctx, chassisType, chassisColor, baseRadius);

            // --- Draw Damage Effects (On Robot) - Body Damage ---
            if (robotData.damageEffects.bodyDamage.length > 0) {
                this._drawBodyDamageEffects(ctx, robotData, baseRadius);
            }

            // 3. Draw Turret (Top Layer) - Turret might face a different direction (TODO: add turret direction if needed)
            this._drawTurret(ctx, turretType, turretColor, baseRadius);
            
            // 4. Draw Beacon (if enabled) - Top of turret
            if (beaconType !== 'none') {
                this._drawBeacon(ctx, beaconType, beaconColor, beaconStrobe, baseRadius);
            }

            ctx.restore(); // Restore rotation/translation

            // --- Draw Damage Effects (On Top of Robot) - Fire and Hit Effects ---
            // Fire effects
            if (robotData.damageEffects.fire.length > 0) {
                this._drawFireEffects(ctx, robotData, robotX, robotY, radians);
            }
            
            // Hit flash effects - always check for these even if bodyDamage is empty
            this._drawHitEffects(ctx, robotData, robotX, robotY);
            
            // Ensure radius is set for hit effects
            if (robotData.radius === undefined) {
                robotData.radius = baseRadius; // Use same base radius for consistency
            }

            // --- Draw Name and Health Bar (Common Elements) ---
            // Position relative to the un-rotated canvas
            const textYOffset = baseRadius + 3;
            const barYOffset = textYOffset + 15; // Place bar below name
            const barWidth = baseRadius * 2;
            const barHeight = 5;
            const barX = robotX - baseRadius;
            const barY = robotY + barYOffset;

            // Name Text
            ctx.fillStyle = '#ffffff';
            ctx.font = "14px 'VT323', monospace";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom'; // Align text bottom relative to its position
            const displayName = robotData.name || 'Unnamed Bot'; // Use name from server data
            ctx.shadowColor = 'black'; ctx.shadowBlur = 2; // Add subtle shadow for readability
            ctx.fillText(displayName, robotX, robotY + textYOffset);
            ctx.shadowBlur = 0; // Reset shadow

            // Health Bar
            // Ensure damage is within 0-100 range
            const damageClamped = Math.max(0, Math.min(100, robotData.damage || 0));
            const healthPercent = 1 - (damageClamped / 100);
            // Background of the bar
            ctx.fillStyle = '#555555'; ctx.fillRect(barX, barY, barWidth, barHeight);
            // Health portion (colored based on health remaining)
            if (healthPercent > 0) {
                ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : // Green > 50%
                                healthPercent > 0.25 ? '#FFC107' : // Yellow > 25%
                                                       '#F44336';   // Red <= 25%
                ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
            }
            // Border for the bar
            ctx.strokeStyle = '#222222'; ctx.lineWidth = 0.5; ctx.strokeRect(barX, barY, barWidth, barHeight);
            // --- End Name/Health Bar ---
        }); // End forEach robot
    }

    /**
     * Draws the mobility component of a robot
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {string} mobilityType - Type of mobility component (wheels, treads, hover, etc.)
     * @param {number} baseRadius - Base radius for scaling
     * @param {string} chassisColor - Color of chassis for coordinate mobility elements
     */
    _drawMobility(ctx, mobilityType, baseRadius, chassisColor) {
        ctx.fillStyle = '#555'; // Default mobility color
        const darkAccent = this._darkenColor(chassisColor, 0.7); // Darker shade of chassis color

        let treadWidth = baseRadius * 2.0;
        let treadHeight = baseRadius * 0.6;
        let wheelRadius = baseRadius * 0.5;
        let hoverRadiusX = baseRadius * 1.2;
        let hoverRadiusY = baseRadius * 0.8;

        switch (mobilityType) {
            case 'treads':
                ctx.fillStyle = darkAccent;
                ctx.fillRect(-treadWidth / 2, -treadHeight * 1.5, treadWidth, treadHeight); // Top tread
                ctx.fillRect(-treadWidth / 2, treadHeight * 0.5, treadWidth, treadHeight);  // Bottom tread
                ctx.strokeRect(-treadWidth / 2, -treadHeight * 1.5, treadWidth, treadHeight);
                ctx.strokeRect(-treadWidth / 2, treadHeight * 0.5, treadWidth, treadHeight);
                // Tread details
                ctx.fillStyle = '#333';
                const segmentWidth = 5; const segmentGap = 4;
                for (let x = -treadWidth/2 + 2; x < treadWidth/2 - 2; x += segmentGap) {
                    ctx.fillRect(x, -treadHeight * 1.5 + 2, segmentWidth, treadHeight - 4);
                    ctx.fillRect(x, treadHeight * 0.5 + 2, segmentWidth, treadHeight - 4);
                }
                break;

            case 'hover':
                ctx.save(); // Glow effect
                ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
                ctx.beginPath(); ctx.ellipse(0, 0, hoverRadiusX * 1.2, hoverRadiusY * 1.2, 0, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = 'rgba(160, 190, 255, 0.2)';
                ctx.beginPath(); ctx.ellipse(0, 0, hoverRadiusX * 0.9, hoverRadiusY * 0.9, 0, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
                // Base pad
                ctx.beginPath(); ctx.ellipse(0, 0, hoverRadiusX, hoverRadiusY, 0, 0, Math.PI * 2);
                ctx.fillStyle = darkAccent; ctx.fill();
                ctx.strokeStyle = '#88aaff'; ctx.lineWidth = 1; ctx.stroke();
                // Vents
                ctx.fillStyle = '#222';
                ctx.beginPath(); ctx.ellipse(-hoverRadiusX * 0.4, 0, hoverRadiusX * 0.2, hoverRadiusY * 0.3, 0, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(hoverRadiusX * 0.4, 0, hoverRadiusX * 0.2, hoverRadiusY * 0.3, 0, 0, Math.PI * 2); ctx.fill();
                break;

            case 'quad':
                ctx.fillStyle = darkAccent;
                const offsetX = baseRadius * 0.9; const offsetY = baseRadius * 0.6;
                // Wheels
                ctx.beginPath(); ctx.arc(-offsetX, -offsetY, wheelRadius * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(offsetX, -offsetY, wheelRadius * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(-offsetX, offsetY, wheelRadius * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(offsetX, offsetY, wheelRadius * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                // Hubs
                ctx.fillStyle = '#222';
                ctx.beginPath(); ctx.arc(-offsetX, -offsetY, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(offsetX, -offsetY, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(-offsetX, offsetY, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(offsetX, offsetY, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                break;

            case 'legs':
                ctx.fillStyle = darkAccent;
                const legLength = baseRadius * 0.7; const legWidth = baseRadius * 0.2;
                const drawLeg = (angle, segment1Angle, segment2Angle) => {
                    ctx.save(); ctx.rotate(angle);
                    ctx.fillRect(0, -legWidth/2, legLength, legWidth); ctx.strokeRect(0, -legWidth/2, legLength, legWidth);
                    ctx.translate(legLength, 0); ctx.rotate(segment1Angle);
                    ctx.fillRect(0, -legWidth/2, legLength*0.7, legWidth); ctx.strokeRect(0, -legWidth/2, legLength*0.7, legWidth);
                    // Optional: Add a third segment
                    // ctx.translate(legLength*0.7, 0); ctx.rotate(segment2Angle);
                    // ctx.fillRect(0, -legWidth/2, legLength*0.5, legWidth); ctx.strokeRect(0, -legWidth/2, legLength*0.5, legWidth);
                    ctx.restore();
                };
                drawLeg(Math.PI / 6, Math.PI / 4, -Math.PI / 6); // Front-right
                drawLeg(-Math.PI / 6, -Math.PI / 4, Math.PI / 6); // Back-right
                drawLeg(Math.PI * 5 / 6, -Math.PI / 4, Math.PI / 6); // Front-left
                drawLeg(-Math.PI * 5 / 6, Math.PI / 4, -Math.PI / 6); // Back-left
                break;

            case 'wheels': default:
                ctx.fillStyle = darkAccent;
                // Wheels
                ctx.beginPath(); ctx.arc(-baseRadius * 0.8, 0, wheelRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); // Left
                ctx.beginPath(); ctx.arc(baseRadius * 0.8, 0, wheelRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();  // Right
                // Hubs
                ctx.fillStyle = '#222';
                ctx.beginPath(); ctx.arc(-baseRadius * 0.8, 0, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(baseRadius * 0.8, 0, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                break;
        }
    }

    /**
     * Draws the chassis component of a robot
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {string} chassisType - Type of chassis (medium, heavy, light, etc.)
     * @param {string} chassisColor - Color of the chassis
     * @param {number} baseRadius - Base radius for scaling
     */
    _drawChassis(ctx, chassisType, chassisColor, baseRadius) {
        ctx.fillStyle = chassisColor;
        ctx.strokeStyle = '#111'; // Reset stroke color

        switch (chassisType) {
            case 'heavy':
                const heavyWidth = baseRadius * 2.4; const heavyHeight = baseRadius * 1.6; const heavyBorderRadius = 4;
                this._drawRoundedRect(ctx, -heavyWidth/2, -heavyHeight/2, heavyWidth, heavyHeight, heavyBorderRadius);
                // Armor plates/details
                ctx.fillStyle = this._darkenColor(chassisColor, 0.8);
                this._drawRoundedRect(ctx, -heavyWidth/2 + 4, -heavyHeight/2 + 3, heavyWidth - 8, heavyHeight/4, 2); // Top strip
                this._drawRoundedRect(ctx, -heavyWidth/2 + 4, heavyHeight/2 - heavyHeight/4 - 3, heavyWidth - 8, heavyHeight/4, 2); // Bottom strip
                // Center detail
                ctx.fillStyle = this._darkenColor(chassisColor, 0.6);
                ctx.beginPath(); ctx.arc(0, 0, heavyHeight/4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                break;

            case 'light':
                const lightWidth = baseRadius * 1.7; const lightHeight = baseRadius * 1.2;
                // Pointy front shape
                ctx.beginPath();
                ctx.moveTo(lightWidth/2, 0); ctx.lineTo(lightWidth/4, -lightHeight/2); ctx.lineTo(-lightWidth/2, -lightHeight/2);
                ctx.lineTo(-lightWidth/2, lightHeight/2); ctx.lineTo(lightWidth/4, lightHeight/2); ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Detail lines
                ctx.strokeStyle = this._darkenColor(chassisColor, 0.7);
                ctx.beginPath(); ctx.moveTo(-lightWidth/3, -lightHeight/2); ctx.lineTo(0, 0); ctx.lineTo(-lightWidth/3, lightHeight/2); ctx.stroke();
                break;

            case 'hexagonal':
                const hexWidth = baseRadius * 2.2; const hexHeight = baseRadius * 1.5; const hexSide = hexHeight / 2;
                ctx.beginPath();
                ctx.moveTo(hexWidth/2, 0); ctx.lineTo(hexWidth/4, -hexSide); ctx.lineTo(-hexWidth/4, -hexSide);
                ctx.lineTo(-hexWidth/2, 0); ctx.lineTo(-hexWidth/4, hexSide); ctx.lineTo(hexWidth/4, hexSide); ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Center detail
                ctx.fillStyle = this._darkenColor(chassisColor, 0.85);
                ctx.beginPath(); ctx.arc(0, 0, hexHeight/4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                break;

            case 'triangular':
                const triWidth = baseRadius * 2.2; const triHeight = baseRadius * 1.8;
                ctx.beginPath();
                ctx.moveTo(triWidth/2, 0); ctx.lineTo(-triWidth/2, -triHeight/2); ctx.lineTo(-triWidth/2, triHeight/2); ctx.closePath();
                ctx.fill(); ctx.stroke();
                // Inner triangle detail
                ctx.fillStyle = this._darkenColor(chassisColor, 0.8);
                ctx.beginPath(); ctx.moveTo(triWidth/4, 0); ctx.lineTo(-triWidth/3, -triHeight/3); ctx.lineTo(-triWidth/3, triHeight/3); ctx.closePath();
                ctx.fill(); ctx.stroke();
                break;

            case 'medium': default:
                const mediumWidth = baseRadius * 2.0; const mediumHeight = baseRadius * 1.4; const mediumBorderRadius = 3;
                this._drawRoundedRect(ctx, -mediumWidth/2, -mediumHeight/2, mediumWidth, mediumHeight, mediumBorderRadius);
                // Detail lines
                ctx.strokeStyle = this._darkenColor(chassisColor, 0.7);
                ctx.beginPath(); ctx.moveTo(-mediumWidth/3, -mediumHeight/2); ctx.lineTo(-mediumWidth/3, mediumHeight/2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(mediumWidth/6, -mediumHeight/2); ctx.lineTo(mediumWidth/6, mediumHeight/2); ctx.stroke();
                break;
        }
    }

    /**
     * Draws the turret component of a robot
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {string} turretType - Type of turret (standard, cannon, laser, etc.)
     * @param {string} turretColor - Color of the turret
     * @param {number} baseRadius - Base radius for scaling
     */
    _drawTurret(ctx, turretType, turretColor, baseRadius) {
        ctx.fillStyle = turretColor;
        ctx.strokeStyle = '#111'; // Reset stroke for turret

        switch (turretType) {
            case 'cannon':
                const cannonBaseRadius = baseRadius * 0.7; const cannonLength = baseRadius * 1.5; const cannonWidth = baseRadius * 0.4;
                // Base
                ctx.beginPath(); ctx.rect(-cannonBaseRadius * 0.5, -cannonBaseRadius * 0.8, cannonBaseRadius, cannonBaseRadius * 1.6); ctx.fill(); ctx.stroke();
                // Barrel
                ctx.fillRect(cannonBaseRadius * 0.5, -cannonWidth / 2, cannonLength, cannonWidth); ctx.strokeRect(cannonBaseRadius * 0.5, -cannonWidth / 2, cannonLength, cannonWidth);
                // Barrel reinforcement
                ctx.fillStyle = this._darkenColor(turretColor, 0.8);
                ctx.fillRect(cannonBaseRadius * 0.5, -cannonWidth / 2, cannonWidth/2, cannonWidth); ctx.strokeRect(cannonBaseRadius * 0.5, -cannonWidth / 2, cannonWidth/2, cannonWidth);
                // Muzzle brake
                ctx.fillStyle = this._darkenColor(turretColor, 0.6);
                ctx.fillRect(cannonBaseRadius * 0.5 + cannonLength - cannonWidth/2, -cannonWidth/2 - cannonWidth/4, cannonWidth/2, cannonWidth * 1.5);
                ctx.strokeRect(cannonBaseRadius * 0.5 + cannonLength - cannonWidth/2, -cannonWidth/2 - cannonWidth/4, cannonWidth/2, cannonWidth * 1.5);
                break;

            case 'laser':
                const laserBaseRadius = baseRadius * 0.5; const laserLength = baseRadius * 1.7; const laserWidth = baseRadius * 0.2;
                // Base
                ctx.beginPath(); ctx.arc(0, 0, laserBaseRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                // Barrel
                ctx.fillRect(laserBaseRadius*0.8, -laserWidth / 2, laserLength, laserWidth); ctx.strokeRect(laserBaseRadius*0.8, -laserWidth / 2, laserLength, laserWidth);
                // Energy coils
                const coilCount = 3; const coilSpacing = laserLength / (coilCount + 1); const coilHeight = laserWidth * 2;
                ctx.fillStyle = this._lightenColor(turretColor, 1.3);
                for (let i = 1; i <= coilCount; i++) {
                    const coilX = laserBaseRadius*0.8 + i * coilSpacing;
                    ctx.beginPath(); ctx.rect(coilX - laserWidth/2, -coilHeight/2, laserWidth, coilHeight); ctx.fill(); ctx.stroke();
                }
                // Emitter tip
                ctx.fillStyle = '#88CCFF'; ctx.beginPath(); ctx.arc(laserBaseRadius*0.8 + laserLength, 0, laserWidth, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                break;

            case 'dual':
                const dualBaseRadius = baseRadius * 0.6; const dualLength = baseRadius * 1.2; const dualWidth = baseRadius * 0.25; const dualGap = dualWidth * 0.8;
                // Base
                ctx.beginPath(); ctx.arc(0, 0, dualBaseRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                // Center detail
                ctx.fillStyle = this._darkenColor(turretColor, 0.8); ctx.beginPath(); ctx.arc(0, 0, dualBaseRadius * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                // Barrels
                ctx.fillStyle = turretColor;
                ctx.fillRect(dualBaseRadius*0.8, -dualGap/2 - dualWidth, dualLength, dualWidth); ctx.strokeRect(dualBaseRadius*0.8, -dualGap/2 - dualWidth, dualLength, dualWidth); // Upper
                ctx.fillRect(dualBaseRadius*0.8, dualGap/2, dualLength, dualWidth); ctx.strokeRect(dualBaseRadius*0.8, dualGap/2, dualLength, dualWidth); // Lower
                break;

            case 'missile':
                const missileBaseRadius = baseRadius * 0.7; const missileLength = baseRadius * 1.1; const missileWidth = baseRadius * 1.0; const missileCount = 3;
                // Base
                this._drawRoundedRect(ctx, -missileBaseRadius*0.7, -missileBaseRadius*0.7, missileBaseRadius*1.4, missileBaseRadius*1.4, 2);
                // Launcher box
                ctx.fillStyle = this._darkenColor(turretColor, 0.8);
                this._drawRoundedRect(ctx, missileBaseRadius*0.6, -missileWidth/2, missileLength, missileWidth, 2);
                // Missile tubes
                const tubeHeight = missileWidth / (missileCount + 1); ctx.fillStyle = '#333';
                for (let i = 1; i <= missileCount; i++) {
                    const tubeY = -missileWidth/2 + i * tubeHeight;
                    this._drawRoundedRect(ctx, missileBaseRadius*0.7, tubeY - tubeHeight*0.4, missileLength*0.8, tubeHeight*0.8, 2);
                }
                break;

            case 'standard': default:
                const stdBaseRadius = baseRadius * 0.6; const stdLength = baseRadius * 1.3; const stdWidth = baseRadius * 0.3;
                // Base
                ctx.beginPath(); ctx.arc(0, 0, stdBaseRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                // Center detail
                ctx.fillStyle = this._darkenColor(turretColor, 0.8); ctx.beginPath(); ctx.arc(0, 0, stdBaseRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                // Barrel
                ctx.fillStyle = turretColor;
                ctx.fillRect(stdBaseRadius*0.8, -stdWidth / 2, stdLength, stdWidth); ctx.strokeRect(stdBaseRadius*0.8, -stdWidth / 2, stdLength, stdWidth);
                // Barrel detail/tip
                ctx.fillStyle = this._darkenColor(turretColor, 0.7);
                ctx.fillRect(stdBaseRadius*0.8 + stdLength - stdWidth, -stdWidth / 2, stdWidth, stdWidth); ctx.strokeRect(stdBaseRadius*0.8 + stdLength - stdWidth, -stdWidth / 2, stdWidth, stdWidth);
                break;
        }
    }

    /** Helper method to draw a rounded rectangle */
    _drawRoundedRect(ctx, x, y, width, height, radius) {
        radius = Math.min(radius, Math.min(width / 2, height / 2)); // Prevent overly large radius
        ctx.beginPath();
        ctx.moveTo(x + radius, y); ctx.lineTo(x + width - radius, y); ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius); ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height); ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius); ctx.arcTo(x, y, x + radius, y, radius); ctx.closePath();
        ctx.fill(); ctx.stroke();
    }

    /** Helper method to darken a hex color */
    _darkenColor(color, factor) {
        let r = parseInt(color.substring(1, 3), 16); let g = parseInt(color.substring(3, 5), 16); let b = parseInt(color.substring(5, 7), 16);
        r = Math.max(0, Math.floor(r * factor)); g = Math.max(0, Math.floor(g * factor)); b = Math.max(0, Math.floor(b * factor));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /** Helper method to lighten a hex color */
    _lightenColor(color, factor) {
        let r = parseInt(color.substring(1, 3), 16); let g = parseInt(color.substring(3, 5), 16); let b = parseInt(color.substring(5, 7), 16);
        r = Math.min(255, Math.floor(r * factor)); g = Math.min(255, Math.floor(g * factor)); b = Math.min(255, Math.floor(b * factor));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    /**
     * Draws a beacon/light on top of a robot
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {string} beaconType - Type of beacon (led, robot, antenna)
     * @param {string} beaconColor - Color of the beacon light
     * @param {boolean} strobe - Whether the beacon should strobe/flash
     * @param {number} baseRadius - Base radius for scaling
     */
    _drawBeacon(ctx, beaconType, beaconColor, strobe, baseRadius) {
        // Skip if type is none or not specified
        if (!beaconType || beaconType === 'none') return;
        
        // Determine if this frame should show the light (for strobing effect)
        const shouldFlash = strobe ? (Date.now() % 1000 < 500) : true;
        
        // Base beacon properties
        const beaconSize = baseRadius * 0.3;
        const beaconHeight = baseRadius * 0.6;
        const yOffset = -baseRadius * 0.5; // Raise above the turret
        
        // Save context for glow effects
        ctx.save();
        
        // Draw different beacon types
        switch (beaconType) {
            case 'led':
                // Simple LED bulb with glow
                // Base
                ctx.fillStyle = '#333333';
                ctx.beginPath();
                ctx.arc(0, yOffset - beaconSize * 0.5, beaconSize * 1.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#222222';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // Light dome
                if (shouldFlash) {
                    // Light is on
                    // Add glow effect
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.shadowColor = beaconColor;
                    ctx.shadowBlur = beaconSize * 4;
                    
                    // Outer glow
                    ctx.fillStyle = this._lightenColor(beaconColor, 0.7);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconSize, beaconSize * 1.5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Bright center
                    ctx.fillStyle = this._lightenColor(beaconColor, 1.2);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconSize, beaconSize, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Light is off (just draw the dome)
                    ctx.fillStyle = this._darkenColor(beaconColor, 0.5);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconSize, beaconSize, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#222222';
                    ctx.stroke();
                }
                break;
                
            case 'robot':
                // Robot-style light with tech details
                // Base mounting plate
                ctx.fillStyle = '#333333';
                this._drawRoundedRect(ctx, -beaconSize * 1.5, yOffset - beaconSize * 0.5, beaconSize * 3, beaconSize, beaconSize * 0.3);
                
                // Tech details on base
                ctx.fillStyle = '#222222';
                this._drawRoundedRect(ctx, -beaconSize * 1.2, yOffset - beaconSize * 0.3, beaconSize * 0.7, beaconSize * 0.6, beaconSize * 0.2);
                this._drawRoundedRect(ctx, beaconSize * 0.5, yOffset - beaconSize * 0.3, beaconSize * 0.7, beaconSize * 0.6, beaconSize * 0.2);
                
                // Light housing
                ctx.fillStyle = '#444444';
                ctx.beginPath();
                ctx.arc(0, yOffset - beaconSize * 0.7, beaconSize * 0.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#222222';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                if (shouldFlash) {
                    // Light is on
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.shadowColor = beaconColor;
                    ctx.shadowBlur = beaconSize * 4;
                    
                    // Outer glow
                    ctx.fillStyle = this._lightenColor(beaconColor, 0.8);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconSize * 0.7, beaconSize, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Bright center
                    ctx.fillStyle = this._lightenColor(beaconColor, 1.3);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconSize * 0.7, beaconSize * 0.6, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Light is off
                    ctx.fillStyle = this._darkenColor(beaconColor, 0.4);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconSize * 0.7, beaconSize * 0.6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#222222';
                    ctx.stroke();
                }
                break;
                
            case 'antenna':
                // Antenna with light on top
                // Antenna base
                ctx.fillStyle = '#333333';
                ctx.beginPath();
                ctx.arc(0, yOffset, beaconSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#222222';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // Antenna pole
                ctx.fillStyle = '#666666';
                ctx.fillRect(-beaconSize * 0.2, yOffset - beaconHeight, beaconSize * 0.4, beaconHeight);
                ctx.strokeStyle = '#444444';
                ctx.strokeRect(-beaconSize * 0.2, yOffset - beaconHeight, beaconSize * 0.4, beaconHeight);
                
                // Optional antenna details
                ctx.fillStyle = '#888888';
                ctx.fillRect(-beaconSize * 0.3, yOffset - beaconHeight * 0.7, beaconSize * 0.6, beaconSize * 0.3);
                ctx.strokeStyle = '#444444';
                ctx.strokeRect(-beaconSize * 0.3, yOffset - beaconHeight * 0.7, beaconSize * 0.6, beaconSize * 0.3);
                
                if (shouldFlash) {
                    // Light is on
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.shadowColor = beaconColor;
                    ctx.shadowBlur = beaconSize * 4;
                    
                    // Outer glow
                    ctx.fillStyle = this._lightenColor(beaconColor, 0.8);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconHeight - beaconSize * 0.5, beaconSize * 1.2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Bright center
                    ctx.fillStyle = this._lightenColor(beaconColor, 1.3);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconHeight - beaconSize * 0.5, beaconSize * 0.8, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Light is off
                    ctx.fillStyle = this._darkenColor(beaconColor, 0.4);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconHeight - beaconSize * 0.5, beaconSize * 0.8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#222222';
                    ctx.stroke();
                }
                break;
                
            default:
                // Simple beacon as fallback
                if (shouldFlash) {
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.shadowColor = beaconColor;
                    ctx.shadowBlur = beaconSize * 3;
                    
                    ctx.fillStyle = beaconColor;
                    ctx.beginPath();
                    ctx.arc(0, yOffset, beaconSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
        }
        
        // Restore context
        ctx.restore();
    }
    
    /**
     * Draws a shadow beneath a robot, with dynamic properties based on robot movement
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} robotData - Robot data from server
     * @param {number} robotX - Robot's x position on canvas
     * @param {number} robotY - Robot's y position on canvas
     * @param {number} baseRadius - Base radius of the robot
     * @param {string} chassisType - Type of chassis (affects shadow shape)
     * @private
     */
    _drawShadow(ctx, robotData, robotX, robotY, baseRadius, chassisType) {
        // Skip shadow rendering if disabled
        if (!this.shadowConfig.enabled) return;
        
        // Get robot direction for shadow orientation
        const robotDir = robotData.direction || 0;
        const directionRad = robotDir * Math.PI / 180;
        
        // Calculate movement speed if velocity data is available
        let speed = 0;
        if (robotData.vx !== undefined && robotData.vy !== undefined) {
            speed = Math.sqrt(robotData.vx * robotData.vx + robotData.vy * robotData.vy);
        }
        
        // Dynamic shadow position based on light source and movement
        // When moving fast, shadow extends further in direction of movement
        const dynamicOffsetX = this.shadowConfig.offsetX + Math.cos(directionRad) * speed * 0.2;
        const dynamicOffsetY = this.shadowConfig.offsetY + Math.sin(directionRad) * speed * 0.2;
        
        const shadowX = robotX + dynamicOffsetX;
        const shadowY = robotY + dynamicOffsetY;
        
        // Save context state
        ctx.save();
        
        // Set shadow properties
        ctx.fillStyle = this.shadowConfig.color;
        
        // Calculate shadow size based on robot dimensions and configured scale
        // Shadow stretches slightly in direction of movement when moving
        const shadowScale = this.shadowConfig.scale;
        const stretchFactor = 1 + Math.min(0.3, speed * 0.01); // Limit stretch to 30%
        
        // Apply rotation to context for directional shadows
        ctx.translate(shadowX, shadowY);
        if (speed > 0.5) { // Only rotate shadow if moving significantly
            ctx.rotate(directionRad);
        }
        
        // Choose shadow shape based on robot chassis type and apply directional effects
        // Note: We're using simpler shapes for shadows than the actual robots
        switch(chassisType) {
            case 'heavy':
                // Rectangular shadow with rounded corners for heavy chassis
                const heavyWidth = baseRadius * 2.4 * shadowScale;
                const heavyHeight = baseRadius * 1.6 * shadowScale;
                const heavyBorderRadius = 4 * shadowScale;
                
                // Stretch in direction of movement
                const stretchedWidth = speed > 0.5 ? heavyWidth * stretchFactor : heavyWidth;
                
                // Apply blur if enabled
                if (this.shadowConfig.blur > 0) {
                    ctx.shadowColor = this.shadowConfig.color;
                    ctx.shadowBlur = this.shadowConfig.blur;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                }
                
                // Draw the heavy chassis shadow
                this._drawRoundedRect(
                    ctx, 
                    -stretchedWidth/2, 
                    -heavyHeight/2, 
                    stretchedWidth, 
                    heavyHeight, 
                    heavyBorderRadius
                );
                break;
                
            case 'triangular':
                // Triangular shadow
                const triWidth = baseRadius * 2.2 * shadowScale;
                const triHeight = baseRadius * 1.8 * shadowScale;
                const stretchedTriWidth = speed > 0.5 ? triWidth * stretchFactor : triWidth;
                
                // Apply blur if enabled
                if (this.shadowConfig.blur > 0) {
                    ctx.shadowColor = this.shadowConfig.color;
                    ctx.shadowBlur = this.shadowConfig.blur;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                }
                
                // Draw triangular shadow
                ctx.beginPath();
                ctx.moveTo(stretchedTriWidth/2, 0);
                ctx.lineTo(-stretchedTriWidth/2, -triHeight/2);
                ctx.lineTo(-stretchedTriWidth/2, triHeight/2);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'hexagonal':
                // Hexagonal shadow
                const hexWidth = baseRadius * 2.2 * shadowScale;
                const hexHeight = baseRadius * 1.5 * shadowScale;
                const hexSide = hexHeight / 2;
                const stretchedHexWidth = speed > 0.5 ? hexWidth * stretchFactor : hexWidth;
                
                // Apply blur if enabled
                if (this.shadowConfig.blur > 0) {
                    ctx.shadowColor = this.shadowConfig.color;
                    ctx.shadowBlur = this.shadowConfig.blur;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                }
                
                // Draw hexagonal shadow
                ctx.beginPath();
                ctx.moveTo(stretchedHexWidth/2, 0);
                ctx.lineTo(stretchedHexWidth/4, -hexSide);
                ctx.lineTo(-stretchedHexWidth/4, -hexSide);
                ctx.lineTo(-stretchedHexWidth/2, 0);
                ctx.lineTo(-stretchedHexWidth/4, hexSide);
                ctx.lineTo(stretchedHexWidth/4, hexSide);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'light':
                // Light chassis unique shadow shape
                const lightWidth = baseRadius * 1.7 * shadowScale;
                const lightHeight = baseRadius * 1.2 * shadowScale;
                const stretchedLightWidth = speed > 0.5 ? lightWidth * stretchFactor : lightWidth;
                
                // Apply blur if enabled
                if (this.shadowConfig.blur > 0) {
                    ctx.shadowColor = this.shadowConfig.color;
                    ctx.shadowBlur = this.shadowConfig.blur;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                }
                
                // Draw pointy-fronted shadow for light chassis
                ctx.beginPath();
                ctx.moveTo(stretchedLightWidth/2, 0);
                ctx.lineTo(stretchedLightWidth/4, -lightHeight/2);
                ctx.lineTo(-stretchedLightWidth/2, -lightHeight/2);
                ctx.lineTo(-stretchedLightWidth/2, lightHeight/2);
                ctx.lineTo(stretchedLightWidth/4, lightHeight/2);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'medium':
            default:
                // Elliptical shadow for most robots
                // Apply blur if enabled
                if (this.shadowConfig.blur > 0) {
                    ctx.shadowColor = this.shadowConfig.color;
                    ctx.shadowBlur = this.shadowConfig.blur;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                }
                
                // Calculate shadow size - stretches in direction of movement
                const shadowRadius = baseRadius * (1.9 * shadowScale);
                const shadowRadiusX = speed > 0.5 ? shadowRadius * stretchFactor : shadowRadius;
                const shadowRadiusY = shadowRadius * 0.6;
                
                // Draw elliptical shadow
                ctx.beginPath();
                ctx.ellipse(0, 0, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
        
        // Restore context
        ctx.restore();
    }
    
    /**
     * Draw smoke particles for a robot
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} robotData - Robot data from server
     * @param {number} baseX - Robot's x position on canvas
     * @param {number} baseY - Robot's y position on canvas
     * @param {number} robotRadians - Robot's rotation in radians
     * @private
     */
    _drawSmokeEffects(ctx, robotData, baseX, baseY, robotRadians) {
        ctx.save();
        
        // We already verified the array exists and has items in drawRobots
        const smokeCount = robotData.damageEffects.smoke.length;
        if (smokeCount > 0 && Math.random() < 0.005) { // Reduced frequency of debug logs
            console.log(`[RENDER DEBUG] Drawing ${smokeCount} smoke particles for robot ${robotData.id || 'unknown'}`);
        }
        
        robotData.damageEffects.smoke.forEach(smoke => {
            try {
                // Ensure smoke object has required properties
                if (!smoke || typeof smoke.x !== 'number' || typeof smoke.y !== 'number') return;
                
                // Calculate position considering robot rotation
                const rotatedX = smoke.x * Math.cos(robotRadians) - smoke.y * Math.sin(robotRadians);
                const rotatedY = smoke.x * Math.sin(robotRadians) + smoke.y * Math.cos(robotRadians);
                
                // Set color and alpha - pre-calculate the color string only once
                let smokeColor;
                const smokeBaseColor = smoke.color || 'rgba(100,100,100,0.5)';
                const alpha = smoke.alpha || 0.5; // Default alpha if missing
                
                try {
                    if (smokeBaseColor.startsWith('rgba')) {
                        // Extract RGB part of the rgba color
                        const rgbPart = smokeBaseColor.substring(0, smokeBaseColor.lastIndexOf(','));
                        smokeColor = `${rgbPart}, ${alpha})`;
                    } else {
                        // Use default with specified alpha
                        smokeColor = `rgba(100,100,100,${alpha})`;
                    }
                } catch (e) {
                    // Fallback color if parsing fails
                    smokeColor = `rgba(100,100,100,${alpha})`;
                }
                
                ctx.fillStyle = smokeColor;
                
                // Draw smoke particle as a circle with soft edge
                const size = smoke.size || 3; // Default size if missing
                
                // Add a subtle blur to soften smoke edges
                ctx.shadowColor = smokeColor;
                ctx.shadowBlur = size * 0.8;
                
                // Draw main smoke circle
                ctx.beginPath();
                ctx.arc(
                    baseX + rotatedX,
                    baseY + rotatedY,
                    size,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                
                // Add a subtle variation in the smoke (slight texture)
                const currentAlpha = ctx.globalAlpha;
                ctx.globalAlpha = currentAlpha * 0.6;
                ctx.fillStyle = smokeColor;
                
                // Draw a smaller, offset circle within the smoke for texture
                const innerSize = size * 0.6;
                const offsetX = (Math.random() - 0.5) * size * 0.3;
                const offsetY = (Math.random() - 0.5) * size * 0.3;
                
                ctx.beginPath();
                ctx.arc(
                    baseX + rotatedX + offsetX,
                    baseY + rotatedY + offsetY,
                    innerSize,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                
                // Reset
                ctx.globalAlpha = currentAlpha;
                ctx.shadowBlur = 0;
            } catch (e) {
                // Silently skip rendering this particle if it has issues
                console.warn("[RENDER WARNING] Failed to render smoke particle", e);
            }
        });
        
        ctx.restore();
    }
    
    /**
     * Draw fire particles for a robot
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} robotData - Robot data from server
     * @param {number} baseX - Robot's x position on canvas
     * @param {number} baseY - Robot's y position on canvas
     * @param {number} robotRadians - Robot's rotation in radians
     * @private
     */
    _drawFireEffects(ctx, robotData, baseX, baseY, robotRadians) {
        ctx.save();
        
        // Add glow effect for fire
        ctx.globalCompositeOperation = 'lighter';
        
        // We already verified the array exists and has items in drawRobots
        const fireCount = robotData.damageEffects.fire.length;
        if (fireCount > 0 && Math.random() < 0.005) { // Reduced frequency of debug logs
            console.log(`[RENDER DEBUG] Drawing ${fireCount} fire particles for robot ${robotData.id || 'unknown'} with damage: ${robotData.damage || 0}`);
        }
        
        robotData.damageEffects.fire.forEach(fire => {
            try {
                // Ensure fire object has required properties
                if (!fire || typeof fire.x !== 'number' || typeof fire.y !== 'number') return;
                
                // Calculate position considering robot rotation
                const rotatedX = fire.x * Math.cos(robotRadians) - fire.y * Math.sin(robotRadians);
                const rotatedY = fire.x * Math.sin(robotRadians) + fire.y * Math.cos(robotRadians);
                
                // Set color and alpha with safe defaults
                ctx.fillStyle = fire.color || '#ff7700';
                ctx.globalAlpha = fire.alpha || 0.7; // Default alpha if missing
                
                // Apply rotation to fire particles based on robot rotation PLUS flame direction
                ctx.translate(baseX + rotatedX, baseY + rotatedY);
                ctx.rotate(robotRadians - Math.PI/2); // Flames should point up relative to robot
                
                // Draw fire particle as a triangle-like shape
                const size = fire.size || 3; // Default size if missing
                const fireHeight = size * 1.6; // Taller flames
                const fireWidth = size * 0.9; // Slightly wider flames
                
                // Add enhanced glow effect if the fire has the glow property
                if (fire.glow) {
                    // Add outer glow
                    ctx.shadowColor = fire.color || '#ff7700';
                    ctx.shadowBlur = size * 2.5;
                    
                    // Draw a subtle glow base
                    const glowAlpha = ctx.globalAlpha;
                    ctx.globalAlpha = glowAlpha * 0.3;
                    ctx.beginPath();
                    ctx.arc(0, -fireHeight * 0.3, fireHeight * 0.8, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Restore normal alpha
                    ctx.globalAlpha = glowAlpha;
                }
                
                // Draw main flame shape
                ctx.beginPath();
                ctx.moveTo(0, -fireHeight); // Top
                ctx.bezierCurveTo(
                    -fireWidth * 0.3, -fireHeight * 0.5, // Control point 1
                    -fireWidth, fireHeight * 0.1, // Control point 2
                    -fireWidth * 0.8, fireHeight * 0.3 // End point 1 (bottom left)
                );
                ctx.lineTo(fireWidth * 0.8, fireHeight * 0.3); // Bottom right corner
                ctx.bezierCurveTo(
                    fireWidth, fireHeight * 0.1, // Control point 1
                    fireWidth * 0.3, -fireHeight * 0.5, // Control point 2
                    0, -fireHeight // End point 2 (top)
                );
                ctx.closePath();
                ctx.fill();
                
                // Add inner hot core
                ctx.fillStyle = fire.glow ? '#ffffcc' : '#ffffaa'; // Brighter core for glow flames
                ctx.globalAlpha = (fire.alpha || 0.7) * 0.8;
                ctx.beginPath();
                ctx.arc(0, -fireHeight * 0.4, size * 0.4, 0, Math.PI * 2);
                ctx.fill();
                
                // Reset transformation
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            } catch (e) {
                // Silently skip rendering this particle if it has issues
                console.warn("[RENDER WARNING] Failed to render fire particle", e);
                // Reset transformation in case of error
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        });
        
        ctx.restore();
    }
    
    /**
     * Draw body damage effects (dents, scorch marks) for a robot
     * @param {CanvasRenderingContext2D} ctx - Canvas context already transformed to robot's coordinates
     * @param {Object} robotData - Robot data from server
     * @param {number} baseRadius - Robot's base radius for sizing
     * @private
     */
    _drawBodyDamageEffects(ctx, robotData, baseRadius) {
        // We're already in the transformed robot coordinate system
        // We already verified the array exists and has items in drawRobots
        
        const damageCount = robotData.damageEffects.bodyDamage.filter(d => d.type === 'dent').length;
        if (damageCount > 0 && Math.random() < 0.005) { // Reduced frequency of debug logs
            console.log(`[RENDER DEBUG] Drawing ${damageCount} body damage effects for robot ${robotData.id || 'unknown'} with damage: ${robotData.damage || 0}`);
        }
        
        robotData.damageEffects.bodyDamage.forEach(damage => {
            try {
                if (!damage || damage.type !== 'dent') return;
                
                // Ensure damage object has required properties
                if (typeof damage.x !== 'number' || typeof damage.y !== 'number') return;
                
                // Draw dent/scorch mark
                ctx.fillStyle = damage.color || 'rgba(30,30,30,0.7)';
                
                // Apply rotation to effect (damage rotation)
                ctx.save();
                ctx.translate(damage.x, damage.y);
                ctx.rotate(damage.rotation || 0);
                
                // Get damage size with default if missing
                const size = damage.size || 2;
                
                // Draw the damage effect using pre-computed shape type
                if (damage.shapeType === 'polygon') {
                    // Irregular polygon for a dent
                    ctx.beginPath();
                    
                    // Use pre-computed points if available
                    if (damage.points && Array.isArray(damage.points) && damage.points.length > 0) {
                        let pointsValid = true;
                        
                        for (let i = 0; i < damage.points.length; i++) {
                            const point = damage.points[i];
                            if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
                                pointsValid = false;
                                break;
                            }
                            
                            if (i === 0) {
                                ctx.moveTo(point.x, point.y);
                            } else {
                                ctx.lineTo(point.x, point.y);
                            }
                        }
                        
                        if (!pointsValid) {
                            // Fallback to circle if points are invalid
                            ctx.beginPath();
                            ctx.arc(0, 0, size, 0, Math.PI * 2);
                        }
                    } else {
                        // Fallback if points weren't pre-computed
                        const points = 5 + Math.floor(Math.random() * 3);
                        const angleStep = (Math.PI * 2) / points;
                        
                        ctx.beginPath();
                        for (let i = 0; i < points; i++) {
                            const distort = 0.7 + Math.random() * 0.6;
                            const px = Math.cos(i * angleStep) * size * distort;
                            const py = Math.sin(i * angleStep) * size * distort;
                            
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
                    ctx.arc(0, 0, size, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.restore();
            } catch (e) {
                // Silently skip rendering this damage mark if it has issues
                console.warn("[RENDER WARNING] Failed to render body damage effect", e);
                // Ensure context is restored if error occurs
                ctx.restore();
            }
        });
    }
    
    /**
     * Draw hit flash/spark effects for a robot
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} robotData - Robot data from server
     * @param {number} baseX - Robot's x position on canvas
     * @param {number} baseY - Robot's y position on canvas
     * @private
     */
    _drawHitEffects(ctx, robotData, baseX, baseY) {
        ctx.save();
        
        const now = Date.now();
        
        // Add glow effect for sparks
        ctx.globalCompositeOperation = 'lighter';
        
        // We already initialized the damage effects structure in drawRobots
        
        // 1. Draw spark hit effects
        if (robotData.damageEffects.bodyDamage && robotData.damageEffects.bodyDamage.length > 0) {
            robotData.damageEffects.bodyDamage.forEach(damage => {
                try {
                    // Skip if not a spark hit or missing required properties
                    if (!damage || damage.type !== 'sparkHit' || 
                        typeof damage.x !== 'number' || 
                        typeof damage.y !== 'number' ||
                        !damage.startTime ||
                        !damage.duration) return;
                    
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
                        ctx.shadowBlur = (damage.size || 2) * 2;
                        
                        ctx.beginPath();
                        ctx.arc(
                            baseX + damage.x,
                            baseY + damage.y,
                            (damage.size || 2) * fade, // Shrinks as it fades
                            0,
                            Math.PI * 2
                        );
                        ctx.fill();
                        
                        // Reset shadow for other draws
                        ctx.shadowBlur = 0;
                    }
                } catch (e) {
                    // Silently skip rendering this effect if it has issues
                    console.warn("[RENDER WARNING] Failed to render spark hit effect", e);
                }
            });
        }
        
        // 2. Draw recent hit flash effect (full-robot glow on hit)
        try {
            // Make sure lastHitTime exists
            const lastHitTime = robotData.damageEffects.lastHitTime || 0;
            const robotRadius = robotData.radius || 15; // Default to baseRadius if missing
            const robotDamage = robotData.damage || 0;
            
            const timeSinceHit = now - lastHitTime;
            if (timeSinceHit < 200) { // Flash effect lasts 200ms
                const hitFade = 1 - (timeSinceHit / 200);
                
                // Determine flash color based on damage level
                let flashColor;
                if (robotDamage < 50) {
                    flashColor = `rgba(255,255,255,${hitFade * 0.6})`;
                } else {
                    const greenValue = Math.max(50, Math.min(255, 50 + 150 * (1 - robotDamage/100)));
                    flashColor = `rgba(255,${greenValue},0,${hitFade * 0.6})`;
                }
                
                // Draw a glow around the robot
                ctx.strokeStyle = flashColor;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(baseX, baseY, robotRadius + 3, 0, Math.PI * 2);
                ctx.stroke();
            }
        } catch (e) {
            // Silently skip rendering this effect if it has issues
            console.warn("[RENDER WARNING] Failed to render hit flash effect", e);
        }
        
        ctx.restore();
    }
    // === END: Enhanced Robot Drawing System ===


    // --- Enhanced drawMissiles for more unique visuals ---
    /** Draws missiles with unique visuals and trails based on turretType */
    drawMissiles(missiles) {
        const ctx = this.ctx;
        if (!ctx || !missiles || missiles.length === 0) return;

        missiles.forEach(missile => {
            const missileX = this.translateX(missile.x);
            const missileY = this.translateY(missile.y);
            const radius = missile.radius || 4;
            const directionRad = (missile.direction || 0) * Math.PI / 180;
            const turretType = missile.turretType || 'standard'; // Default if missing

            ctx.save();

            // --- Turret-Specific Drawing ---
            switch (turretType) {
                case 'cannon':
                    // UPGRADED CANNON MISSILE: Heavier, more substantial projectile with smoke trail
                    
                    // Smoke trail particles (more dynamic than just a gradient)
                    const smokeParticles = 5;
                    const cannonTrailLength = radius * 5;
                    
                    for (let i = 0; i < smokeParticles; i++) {
                        const distance = (i / smokeParticles) * cannonTrailLength;
                        const smokePosX = missileX - Math.cos(directionRad) * distance;
                        const smokePosY = missileY + Math.sin(directionRad) * distance;
                        const smokeRadius = radius * (0.8 - (i / smokeParticles) * 0.5);
                        const alpha = 0.7 - (i / smokeParticles) * 0.6;
                        
                        // Random offset for more natural smoke appearance
                        const offsetAngle = Math.random() * Math.PI * 2;
                        const offsetDist = Math.random() * radius * 0.4;
                        const finalX = smokePosX + Math.cos(offsetAngle) * offsetDist;
                        const finalY = smokePosY + Math.sin(offsetAngle) * offsetDist;
                        
                        // Smoke puff
                        ctx.fillStyle = `rgba(100, 100, 100, ${alpha})`;
                        ctx.beginPath();
                        ctx.arc(finalX, finalY, smokeRadius, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // Main projectile - larger, more detailed
                    ctx.fillStyle = '#D9531E'; // Darker Orange/Red base
                    ctx.beginPath(); 
                    ctx.arc(missileX, missileY, radius * 1.2, 0, Math.PI * 2); 
                    ctx.fill();
                    
                    // Shell casing effect - dark outline
                    ctx.strokeStyle = '#8B2500';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(missileX, missileY, radius * 1.2, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Hot core/impact point
                    const glowX = missileX + Math.cos(directionRad) * radius * 0.3;
                    const glowY = missileY - Math.sin(directionRad) * radius * 0.3;
                    
                    // Outer glow
                    ctx.fillStyle = 'rgba(255, 140, 0, 0.6)';
                    ctx.beginPath();
                    ctx.arc(glowX, glowY, radius * 0.7, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Inner hot core
                    ctx.fillStyle = 'rgba(255, 235, 100, 0.8)';
                    ctx.beginPath();
                    ctx.arc(glowX, glowY, radius * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                    break;

                case 'laser':
                    // UPGRADED LASER: Beam-like projectile with glow effects
                    
                    // Prepare for glow effects
                    ctx.shadowColor = '#88CCFF';
                    ctx.shadowBlur = radius * 2;
                    
                    // Main laser beam - elongated in direction of travel
                    const beamLength = radius * 4;
                    const beamWidth = radius * 0.7;
                    
                    // Calculate beam endpoints
                    const beamFrontX = missileX + Math.cos(directionRad) * beamLength * 0.5;
                    const beamFrontY = missileY - Math.sin(directionRad) * beamLength * 0.5;
                    const beamBackX = missileX - Math.cos(directionRad) * beamLength * 0.5;
                    const beamBackY = missileY + Math.sin(directionRad) * beamLength * 0.5;
                    
                    // Draw the beam
                    ctx.translate(missileX, missileY);
                    ctx.rotate(directionRad);
                    
                    // Outer glow
                    ctx.fillStyle = 'rgba(120, 180, 255, 0.4)';
                    ctx.fillRect(-beamLength * 0.5, -beamWidth, beamLength, beamWidth * 2);
                    
                    // Core beam
                    ctx.fillStyle = '#88CCFF'; // Bright blue
                    ctx.fillRect(-beamLength * 0.5, -beamWidth * 0.5, beamLength, beamWidth);
                    
                    // Brightest center
                    ctx.fillStyle = 'rgba(240, 255, 255, 0.9)'; // Almost white
                    ctx.fillRect(-beamLength * 0.5, -beamWidth * 0.25, beamLength, beamWidth * 0.5);
                    
                    // Reset transform
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    
                    // Additional energy particles around beam
                    for (let i = 0; i < 4; i++) {
                        const particleAngle = Math.random() * Math.PI * 2;
                        const particleDist = Math.random() * radius * 0.8;
                        const particleX = missileX + Math.cos(particleAngle) * particleDist;
                        const particleY = missileY + Math.sin(particleAngle) * particleDist;
                        
                        ctx.fillStyle = 'rgba(173, 216, 230, 0.7)';
                        ctx.beginPath();
                        ctx.arc(particleX, particleY, radius * 0.3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    // Reset shadow
                    ctx.shadowBlur = 0;
                    break;

                case 'dual':
                    // UPGRADED DUAL MISSILES: Twin projectiles that orbit each other
                    
                    // Trail: Energetic yellow-orange with particles
                    const dualTrailLength = radius * 4;
                    
                    // Base trail gradient
                    const dualTailEndX = missileX - Math.cos(directionRad) * dualTrailLength;
                    const dualTailEndY = missileY + Math.sin(directionRad) * dualTrailLength;
                    const dualGradient = ctx.createLinearGradient(missileX, missileY, dualTailEndX, dualTailEndY);
                    dualGradient.addColorStop(0, `rgba(255, 200, 80, 0.8)`); // Brighter Yellow-Orange
                    dualGradient.addColorStop(0.7, `rgba(255, 100, 0, 0.4)`); // Fade to orange
                    dualGradient.addColorStop(1, `rgba(128, 50, 0, 0)`); // Disappear
                    
                    // Draw wider energy trail
                    ctx.strokeStyle = dualGradient;
                    ctx.lineWidth = radius * 1.2;
                    ctx.lineCap = 'round';
                    ctx.beginPath(); 
                    ctx.moveTo(missileX, missileY); 
                    ctx.lineTo(dualTailEndX, dualTailEndY); 
                    ctx.stroke();
                    
                    // Calculate orbit positions for twin projectiles
                    const orbitRadius = radius * 0.6;
                    const orbitAngle = (Date.now() / 100) % (Math.PI * 2); // Rotation over time
                    
                    // Positions of the two projectiles
                    const proj1X = missileX + Math.cos(directionRad + Math.PI/2) * orbitRadius * Math.sin(orbitAngle);
                    const proj1Y = missileY - Math.sin(directionRad + Math.PI/2) * orbitRadius * Math.sin(orbitAngle);
                    const proj2X = missileX + Math.cos(directionRad + Math.PI/2) * orbitRadius * Math.sin(orbitAngle + Math.PI);
                    const proj2Y = missileY - Math.sin(directionRad + Math.PI/2) * orbitRadius * Math.sin(orbitAngle + Math.PI);
                    
                    // Energetic glow effect
                    ctx.shadowColor = 'rgba(255, 200, 0, 0.7)';
                    ctx.shadowBlur = radius;
                    
                    // Draw the twin projectiles
                    ctx.fillStyle = '#FFA500'; // Orange base
                    
                    // First projectile
                    ctx.beginPath();
                    ctx.arc(proj1X, proj1Y, radius * 0.7, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Second projectile
                    ctx.beginPath();
                    ctx.arc(proj2X, proj2Y, radius * 0.7, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Energy connection between projectiles
                    ctx.strokeStyle = 'rgba(255, 220, 100, 0.7)';
                    ctx.lineWidth = radius * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(proj1X, proj1Y);
                    ctx.lineTo(proj2X, proj2Y);
                    ctx.stroke();
                    
                    // Reset shadow effect
                    ctx.shadowBlur = 0;
                    break;

                case 'missile': // Missile Launcher Turret
                    // UPGRADED MISSILE: Rocket-like with flame propulsion
                    
                    // Flame/exhaust trail with animated particles
                    const rocketTrailLength = radius * 6;
                    const trailParticleCount = 6;
                    
                    // Base trail
                    const rocketTailEndX = missileX - Math.cos(directionRad) * rocketTrailLength;
                    const rocketTailEndY = missileY + Math.sin(directionRad) * rocketTrailLength;
                    
                    // Flame core gradient
                    const flameGradient = ctx.createLinearGradient(missileX, missileY, 
                        missileX - Math.cos(directionRad) * radius * 3,
                        missileY + Math.sin(directionRad) * radius * 3);
                    flameGradient.addColorStop(0, 'rgba(255, 255, 200, 0.9)'); // White-hot at missile
                    flameGradient.addColorStop(0.2, 'rgba(255, 200, 50, 0.8)'); // Yellow-orange
                    flameGradient.addColorStop(0.6, 'rgba(255, 100, 20, 0.6)'); // Orange-red
                    flameGradient.addColorStop(1, 'rgba(100, 100, 100, 0.1)'); // Fade to smoke
                    
                    // Draw flame core
                    ctx.strokeStyle = flameGradient;
                    ctx.lineWidth = radius * 0.9;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(missileX, missileY);
                    ctx.lineTo(missileX - Math.cos(directionRad) * radius * 3, 
                              missileY + Math.sin(directionRad) * radius * 3);
                    ctx.stroke();
                    
                    // Exhaust smoke particles
                    for (let i = 0; i < trailParticleCount; i++) {
                        const distance = radius * (2 + i * 0.7); // Start beyond the flame
                        const particleX = missileX - Math.cos(directionRad) * distance;
                        const particleY = missileY + Math.sin(directionRad) * distance;
                        
                        // Random spread perpendicular to direction
                        const spread = (Math.random() - 0.5) * radius * 1.5;
                        const perpX = particleX + Math.cos(directionRad + Math.PI/2) * spread;
                        const perpY = particleY - Math.sin(directionRad + Math.PI/2) * spread;
                        
                        // Particle size and alpha decreases with distance
                        const particleRadius = radius * (0.7 - i * 0.08);
                        const alpha = 0.6 - (i / trailParticleCount) * 0.5;
                        
                        // Draw smoke particle
                        ctx.fillStyle = `rgba(150, 150, 150, ${alpha})`;
                        ctx.beginPath();
                        ctx.arc(perpX, perpY, particleRadius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    // Draw rocket body - now more detailed
                    ctx.fillStyle = '#C0C0C0'; // Silver base
                    
                    // Rotate to draw elongated rocket shape
                    ctx.translate(missileX, missileY);
                    ctx.rotate(directionRad);
                    
                    // Rocket body
                    ctx.beginPath();
                    ctx.ellipse(0, 0, radius * 1.8, radius * 0.8, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Nosecone
                    ctx.fillStyle = '#888888';
                    ctx.beginPath();
                    ctx.moveTo(radius * 1.8, 0);
                    ctx.lineTo(radius * 2.5, 0);
                    ctx.lineTo(radius * 1.8, radius * 0.8);
                    ctx.lineTo(radius * 1.8, -radius * 0.8);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Fins
                    ctx.fillStyle = '#A0A0A0';
                    // Top fin
                    ctx.beginPath();
                    ctx.moveTo(-radius * 1.5, 0);
                    ctx.lineTo(-radius * 2.2, -radius * 1.2);
                    ctx.lineTo(-radius * 1.8, -radius * 0.2);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Bottom fin
                    ctx.beginPath();
                    ctx.moveTo(-radius * 1.5, 0);
                    ctx.lineTo(-radius * 2.2, radius * 1.2);
                    ctx.lineTo(-radius * 1.8, radius * 0.2);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Reset transform
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    break;


                case 'standard':
                default:
                    // UPGRADED STANDARD MISSILE: Enhanced with better trail and effects
                    
                    // Trail: Brighter, more dynamic gradient
                    const stdTrailLength = radius * 5;
                    const stdTailEndX = missileX - Math.cos(directionRad) * stdTrailLength;
                    const stdTailEndY = missileY + Math.sin(directionRad) * stdTrailLength;
                    
                    // Create more vibrant gradient
                    const stdGradient = ctx.createLinearGradient(missileX, missileY, stdTailEndX, stdTailEndY);
                    stdGradient.addColorStop(0, `rgba(255, 180, 0, 0.85)`); // Brighter orange near missile
                    stdGradient.addColorStop(0.6, `rgba(255, 100, 0, 0.5)`); // Orange-red middle
                    stdGradient.addColorStop(1, `rgba(200, 50, 0, 0)`); // Fade to transparent red
                    
                    // Draw trail with variable width
                    ctx.strokeStyle = stdGradient;
                    ctx.lineWidth = radius * 1.1; // Slightly thicker
                    ctx.lineCap = 'round'; // Rounded ends look better
                    ctx.beginPath();
                    ctx.moveTo(missileX, missileY);
                    ctx.lineTo(stdTailEndX, stdTailEndY);
                    ctx.stroke();
                    
                    // Add small flame particles to trail
                    const particleCount = 3;
                    for (let i = 0; i < particleCount; i++) {
                        const distance = (i / particleCount) * stdTrailLength * 0.6;
                        const particleX = missileX - Math.cos(directionRad) * distance;
                        const particleY = missileY + Math.sin(directionRad) * distance;
                        
                        // Random offset for more natural look
                        const offsetAngle = Math.random() * Math.PI * 2;
                        const offsetDist = Math.random() * radius * 0.5;
                        const finalX = particleX + Math.cos(offsetAngle) * offsetDist;
                        const finalY = particleY + Math.sin(offsetAngle) * offsetDist;
                        
                        // Reduce size and opacity with distance
                        const particleSize = radius * (0.6 - (i / particleCount) * 0.4);
                        const alpha = 0.7 - (i / particleCount) * 0.5;
                        
                        // Draw spark particle
                        ctx.fillStyle = `rgba(255, 150, 0, ${alpha})`;
                        ctx.beginPath();
                        ctx.arc(finalX, finalY, particleSize, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    // Add subtle glow to missile
                    ctx.shadowColor = 'rgba(255, 120, 0, 0.7)';
                    ctx.shadowBlur = radius * 0.8;
                    
                    // Main missile body - more detailed
                    ctx.fillStyle = '#FFA500'; // Base orange color
                    ctx.beginPath();
                    ctx.arc(missileX, missileY, radius * 1.1, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Leading edge/impact point (in direction of travel)
                    const impactX = missileX + Math.cos(directionRad) * radius * 0.5;
                    const impactY = missileY - Math.sin(directionRad) * radius * 0.5;
                    
                    // Highlight for depth
                    ctx.fillStyle = 'rgba(255, 220, 120, 0.8)';
                    ctx.beginPath();
                    ctx.arc(impactX, impactY, radius * 0.6, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Reset shadow
                    ctx.shadowBlur = 0;
                    break;
            }
            // --- END: Turret-Specific Drawing ---

            ctx.restore();
        });
    }
    // --- END: Enhanced drawMissiles ---

    /** Draws active muzzle flash effects */
    drawMuzzleFlashes(activeFlashes) {
        const ctx = this.ctx;
        if (!ctx || !activeFlashes || activeFlashes.length === 0) return;

        const now = Date.now();

        activeFlashes.forEach(flash => {
            const elapsedTime = now - flash.startTime;
            const progress = Math.min(elapsedTime / flash.duration, 1);
            // Should already be filtered by Game.js, but good safety check
            if (progress >= 1) return;

            const alpha = 1.0 - progress; // Fade out effect
            const flashX = this.translateX(flash.x); // Position where missile spawned
            const flashY = this.translateY(flash.y);
            const directionRad = flash.direction * Math.PI / 180; // Direction flash points

            ctx.save();
            ctx.translate(flashX, flashY); // Move origin to flash position
            ctx.rotate(directionRad);      // Rotate context to match firing direction
            ctx.globalAlpha = alpha;       // Apply fade effect

            // --- Draw flash based on turret type ---
            switch (flash.type) { // flash.type now comes from ServerRobot.fire eventData
                case 'cannon':
                case 'standard':
                case 'dual': // Using a star shape for these
                    const flashSize = 15 + (flash.type === 'cannon' ? 5 : 0); // Cannon gets bigger flash
                    ctx.fillStyle = `rgba(255, 223, 0, ${alpha})`; // Yellow/Gold core
                    ctx.strokeStyle = `rgba(255, 165, 0, ${alpha * 0.5})`; // Orange border
                    ctx.lineWidth = 2;
                    // Draw a star shape
                    ctx.beginPath();
                    for (let i = 0; i < 10; i++) { // 5 points, 10 vertices
                        const outerRadius = flashSize * (1 - progress); // Flash shrinks over time
                        const innerRadius = outerRadius / 2;
                        const radius = i % 2 === 0 ? outerRadius : innerRadius;
                        // Calculate vertex position using cosine and sine
                        ctx.lineTo(Math.cos(i * Math.PI / 5) * radius, Math.sin(i * Math.PI / 5) * radius);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    break;

                case 'laser':
                    const beamLength = 40 * (1 - progress * 0.5); // Beam shrinks, less dramatically
                    const beamWidth = 6 * (1 - progress);      // Beam gets thinner
                    ctx.fillStyle = `rgba(173, 216, 230, ${alpha})`; // Light blue color
                    // Add a glow effect
                    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                    ctx.shadowBlur = 10 * (1-progress);
                    // Draw a rectangle extending forward from the origin (barrel tip)
                    ctx.fillRect(0, -beamWidth / 2, beamLength, beamWidth);
                    // Draw a brighter core inside the beam
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`; // White core
                    ctx.fillRect(0, -beamWidth / 4, beamLength * 0.8, beamWidth / 2);
                    // Reset shadow for other drawings
                    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
                    break;

                case 'missile': // Draw a smoke puff for missile launch
                    const puffRadius = 12 * (1 + progress); // Puff expands outwards
                    const puffColor = `rgba(160, 160, 160, ${alpha * 0.8})`; // Grey smoke color
                    ctx.fillStyle = puffColor;
                    ctx.beginPath();
                    // Draw circle slightly offset behind origin to simulate coming from barrel
                    ctx.arc(-puffRadius * 0.2, 0, puffRadius, 0, Math.PI * 2);
                    ctx.fill();
                    // Add a smaller, darker inner puff for variation
                    ctx.fillStyle = `rgba(100, 100, 100, ${alpha * 0.6})`;
                    ctx.beginPath();
                    ctx.arc(-puffRadius*0.1, 0, puffRadius*0.6, 0, Math.PI*2);
                    ctx.fill();
                    break;

                default: // Fallback for unknown types (optional)
                    break;
            }
            // --- End flash drawing ---

            ctx.restore(); // Restore translation, rotation, and alpha
        });
    }

    // --- START: Enhanced drawParticleEffects ---
    /** Draws enhanced particle-based explosion effects with improved rendering */
    drawParticleEffects(particleEffects) {
        const ctx = this.ctx;
        if (!ctx || !particleEffects || particleEffects.length === 0) return;

        particleEffects.forEach(effect => {
            effect.particles.forEach(p => {
                // Calculate alpha based on remaining lifespan and particle type
                const lifeRatio = Math.max(0, p.lifespan / p.maxLifespan); // Ensure ratio is not negative
                let alpha = 1.0;
                let drawSize = p.size;

                ctx.save();

                // Apply type-specific rendering styles based on particle type
                switch (p.type) {
                    case 'smoke':
                        // Smoke fades out and expands over time
                        alpha = lifeRatio * 0.7; // Smoke starts semi-transparent
                        drawSize = p.size * (1.8 - lifeRatio * 0.8); // Smoke expands more as it fades
                        
                        // Extract base color and apply alpha for smoke
                        try { 
                            let baseColor = p.color.substring(0, p.color.lastIndexOf(',')) + ',';
                            ctx.fillStyle = baseColor + alpha.toFixed(2) + ')';
                        } catch(e) {
                            ctx.fillStyle = `rgba(100, 100, 100, ${alpha.toFixed(2)})`; // Fallback grey
                        }
                        
                        // Draw smoke as fuzzy circles instead of squares for better appearance
                        ctx.globalAlpha = alpha * 0.7;
                        ctx.shadowColor = ctx.fillStyle;
                        ctx.shadowBlur = 5;
                        ctx.beginPath();
                        ctx.arc(this.translateX(p.x), this.translateY(p.y), drawSize/2, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                        
                    case 'spark':
                        // Sparks have a tail/motion blur and a fade effect
                        alpha = lifeRatio * 0.9; // Sparks stay brighter longer
                        drawSize = p.size * (lifeRatio * 0.8 + 0.2); // Sparks shrink but maintain some size
                        
                        // Add a glow effect to sparks
                        ctx.shadowColor = p.color;
                        ctx.shadowBlur = 3;
                        ctx.globalAlpha = alpha;
                        ctx.fillStyle = p.color;
                        
                        // Draw spark with motion trail
                        const sparkX = this.translateX(p.x);
                        const sparkY = this.translateY(p.y);
                        
                        // Motion trail in direction of movement (subtle)
                        if (Math.abs(p.vx) > 0.1 || Math.abs(p.vy) > 0.1) {
                            const trailLength = Math.min(5, Math.sqrt(p.vx*p.vx + p.vy*p.vy) * 0.8);
                            const dirX = -p.vx / (Math.abs(p.vx) + 0.001); // Normalize with safety
                            const dirY = -p.vy / (Math.abs(p.vy) + 0.001);
                            
                            // Create a gradient for the trail
                            const trail = ctx.createLinearGradient(
                                sparkX, sparkY,
                                sparkX + dirX * trailLength, sparkY + dirY * trailLength
                            );
                            trail.addColorStop(0, p.color);
                            trail.addColorStop(1, 'rgba(0,0,0,0)');
                            
                            ctx.strokeStyle = trail;
                            ctx.lineWidth = drawSize;
                            ctx.beginPath();
                            ctx.moveTo(sparkX, sparkY);
                            ctx.lineTo(sparkX + dirX * trailLength, sparkY + dirY * trailLength);
                            ctx.stroke();
                        }
                        
                        // Draw the spark head
                        ctx.beginPath();
                        ctx.arc(sparkX, sparkY, Math.max(0.5, drawSize/2), 0, Math.PI * 2);
                        ctx.fill();
                        break;
                        
                    case 'debris':
                        // Debris particles with more detailed rendering
                        alpha = lifeRatio * 0.9;
                        ctx.globalAlpha = alpha;
                        ctx.fillStyle = p.color;
                        ctx.strokeStyle = this._darkenColor(p.color, 0.7);
                        ctx.lineWidth = 1;
                        
                        // Draw debris as small polygons instead of circles for better visual
                        const debrisX = this.translateX(p.x);
                        const debrisY = this.translateY(p.y);
                        const cornerCount = 3 + Math.floor(Math.random() * 3); // 3-5 corners
                        
                        ctx.beginPath();
                        for (let i = 0; i < cornerCount; i++) {
                            const angle = (i / cornerCount) * Math.PI * 2;
                            const distVariation = 0.7 + Math.random() * 0.6; // Random distance variation
                            const cornerX = debrisX + Math.cos(angle) * (drawSize/2) * distVariation;
                            const cornerY = debrisY + Math.sin(angle) * (drawSize/2) * distVariation;
                            
                            if (i === 0) {
                                ctx.moveTo(cornerX, cornerY);
                            } else {
                                ctx.lineTo(cornerX, cornerY);
                            }
                        }
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        break;
                        
                    case 'flash':
                        // Flash effect with glow
                        alpha = Math.pow(lifeRatio, 0.5); // Flash fades quickly
                        drawSize = p.size * (1 + (1-lifeRatio)*0.7); // Flash expands more
                        
                        ctx.globalAlpha = alpha;
                        ctx.fillStyle = p.color;
                        
                        // Add a strong glow effect to flashes
                        ctx.shadowColor = p.color;
                        ctx.shadowBlur = 15;
                        
                        // Draw the flash
                        ctx.beginPath();
                        ctx.arc(this.translateX(p.x), this.translateY(p.y), Math.max(0.1, drawSize/2), 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Draw inner brighter core
                        ctx.globalAlpha = alpha * 1.5; // Brighter center
                        ctx.beginPath();
                        ctx.arc(this.translateX(p.x), this.translateY(p.y), Math.max(0.1, drawSize/4), 0, Math.PI * 2);
                        ctx.fill();
                        break;
                        
                    default:
                        // Default particle behavior
                        ctx.globalAlpha = lifeRatio;
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(this.translateX(p.x), this.translateY(p.y), drawSize/2, 0, Math.PI * 2);
                        ctx.fill();
                }

                ctx.restore(); // Restore context state
            });
            
            // Add scorch mark when effect starts (once per explosion)
            if (!effect.scorchAdded && effect.particles.length > 0) {
                const scorchRadius = 20 + Math.random() * 15; // Varied scorch size
                this.addScorchMark(effect.x, effect.y, scorchRadius);
                effect.scorchAdded = true; // Mark as done
            }
        });
    }
    // --- END: Enhanced drawParticleEffects ---

    // --- START: Dynamic Lighting System ---
    /**
     * Adds a temporary light source at the specified position
     * @param {number} x - X position of the light source
     * @param {number} y - Y position of the light source
     * @param {string} type - Type of light ('explosion' or 'missile')
     * @param {string} color - Color of the light (e.g., '#ff9900' for fire)
     */
    addLightSource(x, y, type = 'explosion', color = '#ff9900') {
        if (!this.lightingConfig.enabled) return;
        
        // Select light configuration based on type
        const lightConfig = type === 'missile' 
            ? this.lightingConfig.missileLight 
            : this.lightingConfig.explosionLight;
        
        // Adjust light properties based on ambient lighting
        let radius = lightConfig.radius;
        let intensity = lightConfig.intensity;
        let duration = lightConfig.duration;
        
        // Make lights more visible at night
        if (this.ambientConfig.enabled && this.ambientConfig.mode !== 'day') {
            // Increase radius, intensity, and duration at night for more dramatic effect
            const nightBoost = this.ambientConfig.mode === 'night' ? 1.5 : 1.2; // Bigger boost at night than dusk
            
            radius *= nightBoost;
            intensity = Math.min(1.0, intensity * nightBoost); // Cap at 1.0
            duration *= 1.2; // Make light effects last longer at night
        }
        
        // Create light source object
        const light = {
            x: this.translateX(x),
            y: this.translateY(y),
            radius: radius,
            intensity: intensity,
            color: color,
            startTime: Date.now(),
            duration: duration,
            falloff: lightConfig.falloff,
            type: type
        };
        
        // Add to active light sources
        this.activeLightSources.push(light);
        
        // For debugging
        //console.log(`Added ${type} light at (${x}, ${y})`);
    }
    
    /**
     * Updates light sources, removing expired ones
     */
    updateLightSources() {
        if (!this.lightingConfig.enabled || this.activeLightSources.length === 0) return;
        
        const now = Date.now();
        
        // Remove expired light sources
        this.activeLightSources = this.activeLightSources.filter(light => {
            return now - light.startTime < light.duration;
        });
    }
    
    /**
     * Draws all active light sources and their shadows
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawLightSources(ctx) {
        if (!this.lightingConfig.enabled || this.activeLightSources.length === 0) return;
        
        const now = Date.now();
        
        // Process each light source
        this.activeLightSources.forEach(light => {
            // Calculate light fade based on elapsed time
            const elapsed = now - light.startTime;
            const progress = Math.min(1, elapsed / light.duration);
            const fade = 1 - progress;
            
            // Skip if completely faded
            if (fade <= 0) return;
            
            // Draw light glow
            const adjustedIntensity = light.intensity * fade;
            
            // Set up gradient for light falloff
            const gradient = ctx.createRadialGradient(
                light.x, light.y, 0,
                light.x, light.y, light.radius * (1 + progress * 0.2) // Light expands slightly as it fades
            );
            
            // Parse color to create transparent version
            let r, g, b;
            try {
                if (light.color.startsWith('#')) {
                    // Hex color
                    r = parseInt(light.color.substring(1, 3), 16);
                    g = parseInt(light.color.substring(3, 5), 16);
                    b = parseInt(light.color.substring(5, 7), 16);
                } else if (light.color.startsWith('rgb')) {
                    // RGB color 
                    const matches = light.color.match(/\d+/g);
                    if (matches && matches.length >= 3) {
                        r = parseInt(matches[0]);
                        g = parseInt(matches[1]);
                        b = parseInt(matches[2]);
                    } else {
                        r = 255; g = 153; b = 0; // Default orange for fallback
                    }
                } else {
                    r = 255; g = 153; b = 0; // Default orange for fallback
                }
            } catch (e) {
                r = 255; g = 153; b = 0; // Default orange for fallback
            }
            
            // Create gradient stops
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${adjustedIntensity})`);
            gradient.addColorStop(Math.pow(0.5, light.falloff), `rgba(${r}, ${g}, ${b}, ${adjustedIntensity * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            // Save context state
            ctx.save();
            
            // Set blend mode for additive lighting
            ctx.globalCompositeOperation = 'lighter';
            
            // Draw light radial gradient
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(light.x, light.y, light.radius * (1 + progress * 0.2), 0, Math.PI * 2);
            ctx.fill();
            
            // Restore context
            ctx.restore();
            
            // Draw dynamic shadows from this light source if enabled
            if (this.shadowConfig.enabled) {
                this._drawDynamicShadows(ctx, light);
            }
        });
    }
    
    /**
     * Draws dynamic shadows cast by objects from a light source
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} light - Light source data
     * @private
     */
    _drawDynamicShadows(ctx, light) {
        // Skip if no robots to cast shadows
        if (!this.robots || this.robots.length === 0) return;
        
        // Calculate light fade based on elapsed time
        const elapsed = Date.now() - light.startTime;
        const progress = Math.min(1, elapsed / light.duration);
        const fade = 1 - progress;
        
        // Skip if completely faded
        if (fade <= 0) return;
        
        // For each robot, calculate and draw shadow projected away from light
        this.robots.forEach(robotData => {
            // Skip if robot is not visible or alive
            if (!robotData || !robotData.isAlive) return;
            
            // Get robot position
            const robotX = this.translateX(robotData.x || 0);
            const robotY = this.translateY(robotData.y || 0);
            
            // Calculate vector from light to robot (shadow direction)
            const dx = robotX - light.x;
            const dy = robotY - light.y;
            
            // Calculate distance from light to robot
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Skip if robot is outside light radius (plus some margin)
            if (distance > light.radius * 1.5) return;
            
            // Calculate shadow length based on distance from light
            // Closer to light = longer shadow
            const shadowLength = Math.max(20, 50 * (1 - distance / light.radius));
            
            // Normalize direction vector
            const dirX = dx / distance;
            const dirY = dy / distance;
            
            // Calculate shadow end point
            const shadowEndX = robotX + dirX * shadowLength;
            const shadowEndY = robotY + dirY * shadowLength;
            
            // Calculate shadow opacity based on light intensity and distance
            const shadowOpacity = 0.4 * fade * (1 - distance / light.radius);
            
            // Save context
            ctx.save();
            
            // Set shadow properties
            ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity})`;
            
            // Determine robot size (approximate from baseRadius)
            const baseRadius = robotData.radius || 15;
            const robotWidth = baseRadius * 2;
            
            // Calculate shadow width at robot position (perpendicular to shadow direction)
            const perpX = -dirY; // Perpendicular vector
            const perpY = dirX;  // Perpendicular vector
            
            // Draw shadow as a trapezoid shape
            ctx.beginPath();
            // Start with points at robot position
            ctx.moveTo(robotX + perpX * robotWidth/2, robotY + perpY * robotWidth/2);
            ctx.lineTo(robotX - perpX * robotWidth/2, robotY - perpY * robotWidth/2);
            // End with points at shadow end (narrower for perspective effect)
            ctx.lineTo(shadowEndX - perpX * robotWidth/4, shadowEndY - perpY * robotWidth/4);
            ctx.lineTo(shadowEndX + perpX * robotWidth/4, shadowEndY + perpY * robotWidth/4);
            ctx.closePath();
            ctx.fill();
            
            // Restore context
            ctx.restore();
        });
    }
    // --- END: Dynamic Lighting System ---
    
    // --- START: Ambient Lighting System ---
    /**
     * Initializes arena spotlights for night mode
     * Called once when the arena is created or when mode changes to night
     */
    initSpotlights() {
        // Clear any existing spotlights
        this.permanentLightSources = [];
        
        if (!this.ambientConfig.enabled || 
            this.ambientConfig.mode === 'day' || 
            !this.ambientConfig.spotlights.enabled) {
            return; // No spotlights needed
        }
        
        // Create arena spotlights
        const spotCount = this.ambientConfig.spotlights.count;
        const radius = this.ambientConfig.spotlights.radius;
        const intensity = this.ambientConfig.spotlights.intensity;
        
        // Generate spotlights positioned around the arena
        for (let i = 0; i < spotCount; i++) {
            // Spotlights positioned at corners and midpoints of edges for even distribution
            let x, y;
            
            // Calculate base position on arena border
            const angle = (i / spotCount) * Math.PI * 2;
            const borderDistance = 0.8; // Distance from center to border (as a fraction of half-width/height)
            
            x = this.width/2 + (this.width/2 * borderDistance) * Math.cos(angle);
            y = this.height/2 + (this.height/2 * borderDistance) * Math.sin(angle);
            
            // Randomize color slightly for visual interest
            // Use either white-ish or slight yellow tint
            let color;
            if (Math.random() < 0.7) {
                // White-ish spotlight
                color = '#f0f0ff';
            } else {
                // Slight yellow tint
                color = '#ffffcc';
            }
            
            // Create spotlight
            this.permanentLightSources.push({
                x,
                y,
                baseX: x,     // Store original position for movement calculations
                baseY: y,
                radius,
                intensity,
                color,
                falloff: 1.2,
                movement: {
                    phase: Math.random() * Math.PI * 2, // Random starting phase
                    speed: this.ambientConfig.spotlights.movement.speed * (0.7 + Math.random() * 0.6) // Slight randomization in speed
                }
            });
        }
    }
    
    /**
     * Updates permanent light sources like spotlights, including their movement
     */
    updatePermanentLights() {
        if (!this.ambientConfig.enabled || 
            this.ambientConfig.mode === 'day' ||
            !this.ambientConfig.spotlights.enabled ||
            !this.ambientConfig.spotlights.movement.enabled ||
            this.permanentLightSources.length === 0) {
            return; // No movement needed
        }
        
        const now = Date.now();
        const movementRange = this.ambientConfig.spotlights.movement.range;
        
        // Update each spotlight position
        this.permanentLightSources.forEach(light => {
            if (!light.movement) return;
            
            // Calculate new position using sinusoidal movement
            const xOffset = Math.sin(now * light.movement.speed + light.movement.phase) * (this.width * movementRange);
            const yOffset = Math.cos(now * light.movement.speed * 0.7 + light.movement.phase) * (this.height * movementRange);
            
            light.x = light.baseX + xOffset;
            light.y = light.baseY + yOffset;
        });
    }
    
    /**
     * Draws the ambient lighting effect (day/night/dusk overlay)
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawAmbientLighting(ctx) {
        if (!this.ambientConfig.enabled || this.ambientConfig.mode === 'day') {
            return; // No ambient overlay needed for daylight
        }
        
        // Select intensity based on mode
        let intensity = this.ambientConfig.mode === 'night' 
            ? this.ambientConfig.nightIntensity 
            : this.ambientConfig.duskIntensity;
        
        // Select color filter based on mode
        const colorFilter = this.ambientConfig.colorFilter[this.ambientConfig.mode];
        
        // Save context
        ctx.save();
        
        // Create ambient overlay
        ctx.globalCompositeOperation = 'multiply'; // Multiply blend mode darkens underlying content
        
        // Fill screen with ambient color
        ctx.fillStyle = `rgba(${colorFilter.r}, ${colorFilter.g}, ${colorFilter.b}, ${intensity})`;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // If in night mode with spotlights, draw spotlight clearings
        if (this.ambientConfig.mode === 'night' && 
            this.ambientConfig.spotlights.enabled &&
            this.permanentLightSources.length > 0) {
            
            // Switch to destination-out to cut holes in the darkness
            ctx.globalCompositeOperation = 'destination-out';
            
            // Draw each spotlight as a soft clearing in the darkness
            this.permanentLightSources.forEach(light => {
                // Create radial gradient for soft-edged light cone
                const gradient = ctx.createRadialGradient(
                    light.x, light.y, 0,
                    light.x, light.y, light.radius
                );
                
                // Center of spotlight is mostly clear
                gradient.addColorStop(0, `rgba(255, 255, 255, ${light.intensity})`);
                // Edge fades to transparent
                gradient.addColorStop(0.7, `rgba(255, 255, 255, ${light.intensity * 0.3})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                // Draw spotlight cone
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        // Restore context
        ctx.restore();
    }
    
    /**
     * Draws spotlights as actual light sources (for glow effects)
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawSpotlights(ctx) {
        if (!this.ambientConfig.enabled || 
            this.ambientConfig.mode === 'day' ||
            !this.ambientConfig.spotlights.enabled ||
            this.permanentLightSources.length === 0) {
            return; // No spotlights to draw
        }
        
        // Save context
        ctx.save();
        
        // Set blend mode for additive lighting
        ctx.globalCompositeOperation = 'lighter';
        
        // Draw each spotlight glow
        this.permanentLightSources.forEach(light => {
            // Extract RGB values from color
            let r = 255, g = 255, b = 255; // Default white
            if (light.color.startsWith('#')) {
                r = parseInt(light.color.substring(1, 3), 16);
                g = parseInt(light.color.substring(3, 5), 16);
                b = parseInt(light.color.substring(5, 7), 16);
            }
            
            // Create gradient for light glow
            const gradient = ctx.createRadialGradient(
                light.x, light.y, 0,
                light.x, light.y, light.radius * 0.5 // Spotlight glow is smaller than its area of effect
            );
            
            // Create gradient stops for realistic light falloff
            const adjustedIntensity = light.intensity * 0.5; // Reduce intensity for glow effect
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${adjustedIntensity})`);
            gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${adjustedIntensity * 0.3})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            // Draw spotlight glow
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(light.x, light.y, light.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Restore context
        ctx.restore();
    }
    
    /**
     * Sets the ambient lighting mode
     * @param {string} mode - 'day', 'night', or 'dusk'
     */
    setAmbientMode(mode) {
        if (!['day', 'night', 'dusk'].includes(mode)) {
            console.error(`Invalid ambient lighting mode: ${mode}. Valid modes are 'day', 'night', or 'dusk'.`);
            return;
        }
        
        // Set new mode
        this.ambientConfig.mode = mode;
        
        // Initialize spotlights if needed
        if (mode === 'night' && this.ambientConfig.spotlights.enabled) {
            this.initSpotlights();
        }
        
        console.log(`Ambient lighting mode set to: ${mode}`);
    }
    
    /**
     * Toggles through ambient lighting modes in the sequence: day -> dusk -> night -> day
     * Can be called from the UI to allow users to toggle lighting
     * @returns {string} The new lighting mode
     */
    toggleLightingMode() {
        // Get current mode
        const currentMode = this.ambientConfig.mode;
        
        // Determine next mode in sequence
        let nextMode;
        switch(currentMode) {
            case 'day': 
                nextMode = 'dusk';
                break;
            case 'dusk': 
                nextMode = 'night';
                break;
            case 'night':
            default:
                nextMode = 'day'; 
                break;
        }
        
        // Set new mode
        this.setAmbientMode(nextMode);
        
        return nextMode;
    }
    
    /**
     * Public method to get the current lighting mode
     * @returns {string} Current lighting mode ('day', 'night', or 'dusk')
     */
    getLightingMode() {
        return this.ambientConfig.mode;
    }
    
    /**
     * Enables or disables spotlights in night mode
     * @param {boolean} enabled - Whether spotlights should be enabled
     */
    setSpotlightsEnabled(enabled) {
        this.ambientConfig.spotlights.enabled = !!enabled;
        
        // If enabling spotlights in night mode, initialize them
        if (enabled && this.ambientConfig.mode === 'night') {
            this.initSpotlights();
        } else if (!enabled) {
            // Clear spotlights if disabling
            this.permanentLightSources = [];
        }
        
        return this.ambientConfig.spotlights.enabled;
    }
    // --- END: Ambient Lighting System ---

    // --- START: Removed old drawEffects ---
    /*
    drawEffects(activeExplosions) {
        // ... old implementation removed ...
    }
    */
    // --- END: Removed old drawEffects ---


    /** Clears main canvas and draws the persistent background */
    clear() {
        if (!this.ctx || !this.backgroundCanvas) return;
        // Clear the entire canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        // Draw the pre-rendered background (texture, grid, scorch marks)
        this.ctx.drawImage(this.backgroundCanvas, 0, 0);
    }

    /**
     * Main drawing loop method - called by Game.js.
     * Includes optional screen shake, dynamic lighting, and ambient lighting effects.
     * @param {Array} missiles - Array of missile data from game state.
     * @param {Array} activeExplosions - Array of simple explosion objects (e.g., for missile impacts).
     * @param {Array} activeFlashes - Array of active muzzle flash objects.
     * @param {Array} particleEffects - Array of active particle effect objects (for robot deaths).
     * @param {number} [shakeMagnitude=0] - Current magnitude for screen shake effect.
     */
    draw(missiles, activeExplosions, activeFlashes, particleEffects, shakeMagnitude = 0) { // Updated Signature
        if (!this.ctx || !this.backgroundCanvas) {
            console.error("Cannot draw, context/background missing!");
            return;
        }
        
        // Update dynamic lighting systems
        this.updateLightSources();
        this.updatePermanentLights(); // Update spotlight positions
        
        // Check for new explosion events and create light sources
        if (particleEffects && particleEffects.length > 0) {
            particleEffects.forEach(effect => {
                // Add light for fresh explosions (use a flag to avoid adding multiple lights)
                if (!effect.lightAdded && effect.particles && effect.particles.length > 0) {
                    // For robot deaths/explosions
                    this.addLightSource(effect.x, effect.y, 'explosion', '#ff6600');
                    effect.lightAdded = true;
                }
            });
        }
        
        // Create light sources for muzzle flashes
        if (activeFlashes && activeFlashes.length > 0) {
            activeFlashes.forEach(flash => {
                // Add light for fresh muzzle flashes (use timestamp to avoid duplicates)
                const now = Date.now();
                if (!flash.lightAdded && now - flash.startTime < 50) { // Only add light if flash is new
                    // Different light colors based on weapon type
                    let flashColor;
                    switch (flash.type) {
                        case 'laser': flashColor = '#88ccff'; break;  // Blue for lasers
                        case 'missile': flashColor = '#ffcc44'; break; // Yellow for missiles 
                        case 'cannon': flashColor = '#ff9933'; break;  // Orange for cannons
                        default: flashColor = '#ffaa00'; break;        // Default orange-yellow
                    }
                    
                    this.addLightSource(flash.x, flash.y, 'missile', flashColor);
                    flash.lightAdded = true;
                }
            });
        }
        
        // 1. Clear the dynamic canvas and draw the static background
        this.clear();

        // --- Screen Shake Start ---
        let shakeX = 0; let shakeY = 0;
        if(shakeMagnitude > 0) {
            shakeX = (Math.random() - 0.5) * 2 * shakeMagnitude;
            shakeY = (Math.random() - 0.5) * 2 * shakeMagnitude;
        }
        this.ctx.save(); // Save context before shake translation
        this.ctx.translate(shakeX, shakeY);
        // --- Screen Shake End ---
        
        // 2. Draw shadows for permanent light sources like spotlights
        if (this.ambientConfig.enabled && 
            this.ambientConfig.mode !== 'day' &&
            this.ambientConfig.spotlights.enabled) {
            this.permanentLightSources.forEach(light => {
                this._drawDynamicShadows(this.ctx, light);
            });
        }
        
        // 3. Draw shadows for dynamic light sources (explosions/missiles)
        this.drawLightSources(this.ctx);

        // 4. Draw Robots (including their permanent shadows)
        this.drawRobots();

        // 5. Draw Missiles (now with unique visuals/trails)
        this.drawMissiles(missiles);

        // 6. Draw NEW Particle Effects (for robot destruction)
        this.drawParticleEffects(particleEffects);

        // 7. Draw Muzzle Flashes
        this.drawMuzzleFlashes(activeFlashes);
        
        // 8. Draw Dynamic Lighting (glow effect on top of everything)
        // The shadows are drawn earlier, but the actual light glow should be on top
        // Light sources were already computed earlier, just drawing the glow here
        if (this.lightingConfig.enabled && this.activeLightSources.length > 0) {
            // Save context state
            this.ctx.save();
            
            // Set blend mode for additive lighting
            this.ctx.globalCompositeOperation = 'lighter';
            
            // Draw each light glow
            this.activeLightSources.forEach(light => {
                // Skip if the light has faded completely
                const elapsed = Date.now() - light.startTime;
                const progress = Math.min(1, elapsed / light.duration);
                const fade = 1 - progress;
                if (fade <= 0) return;
                
                // Draw light glow
                const adjustedIntensity = light.intensity * fade;
                
                // Set up gradient for light falloff
                const gradient = this.ctx.createRadialGradient(
                    light.x, light.y, 0,
                    light.x, light.y, light.radius * (1 + progress * 0.2)
                );
                
                // Parse light color
                let r = 255, g = 153, b = 0; // Default
                if (light.color.startsWith('#')) {
                    r = parseInt(light.color.substring(1, 3), 16);
                    g = parseInt(light.color.substring(3, 5), 16);
                    b = parseInt(light.color.substring(5, 7), 16);
                }
                
                // Create gradient stops
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${adjustedIntensity})`);
                gradient.addColorStop(Math.pow(0.3, light.falloff), `rgba(${r}, ${g}, ${b}, ${adjustedIntensity * 0.5})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                // Draw light
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
                this.ctx.fill();
            });
            
            // Restore context
            this.ctx.restore();
        }
        
        // 9. Draw spotlight glows (if in night mode)
        this.drawSpotlights(this.ctx);
        
        // 10. Apply ambient lighting overlay (night/dusk effect) 
        // This needs to be drawn after all regular content
        this.drawAmbientLighting(this.ctx);

        // --- Screen Shake Restore ---
        this.ctx.restore(); // Restore context after drawing everything (removes shake translation)
        // --- Screen Shake End ---
    }
} // End Arena (Renderer) Class

// Expose class to window global scope
window.Arena = Arena;