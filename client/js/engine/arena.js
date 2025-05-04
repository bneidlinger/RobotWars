// client/js/engine/arena.js

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
     */
    drawRobots() {
        const ctx = this.ctx;
        if (!ctx || !this.robots) return;

        const baseRadius = 15; // Use a consistent base size reference

        this.robots.forEach(robotData => {
            // Skip if data is missing or robot is not visible/alive
            // Use robotData.isAlive which comes from the server state
            if (!robotData || !robotData.isAlive) return;

            // Ensure visuals data exists, provide defaults if missing
            const visuals = robotData.visuals || {
                turret: { type: 'standard', color: '#ffffff' },
                chassis: { type: 'medium', color: '#aaaaaa' },
                mobility: { type: 'wheels' }
            };
            const chassisColor = visuals.chassis?.color || '#aaaaaa';
            const turretColor = visuals.turret?.color || '#ffffff';
            const mobilityType = visuals.mobility?.type || 'wheels';
            const chassisType = visuals.chassis?.type || 'medium';
            const turretType = visuals.turret?.type || 'standard';

            ctx.save(); // Save context state before drawing this robot

            // Get robot position and direction
            const robotX = this.translateX(robotData.x || 0);
            const robotY = this.translateY(robotData.y || 0);
            const robotDir = robotData.direction || 0; // Robot's body direction
            const radians = robotDir * Math.PI / 180;

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

            // 3. Draw Turret (Top Layer) - Turret might face a different direction (TODO: add turret direction if needed)
            this._drawTurret(ctx, turretType, turretColor, baseRadius);

            ctx.restore(); // Restore rotation/translation

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
     * Includes optional screen shake.
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

        // 2. Draw Robots
        this.drawRobots();

        // 3. Draw Missiles (now with unique visuals/trails)
        this.drawMissiles(missiles);

        // 4. Draw OLD Explosions (e.g., for simple missile impacts if needed)
        // If particle explosions completely replace these, you can remove this call.
        // For now, assume they might coexist for different event types.
        // this.drawEffects(activeExplosions); // <<< Kept commented out, assuming replacement

        // 5. Draw NEW Particle Effects (for robot destruction)
        this.drawParticleEffects(particleEffects); // <<< ADDED CALL

        // 6. Draw Muzzle Flashes
        this.drawMuzzleFlashes(activeFlashes);

        // --- Screen Shake Restore ---
        this.ctx.restore(); // Restore context after drawing everything (removes shake translation)
        // --- Screen Shake End ---
    }
} // End Arena (Renderer) Class