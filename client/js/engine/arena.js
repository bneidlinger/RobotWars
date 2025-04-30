// client/js/engine/arena.js

/**
 * Manages the rendering of the game arena canvas, including the background,
 * grid, robots (based on visual loadout data), missiles, scorch marks, // <-- Updated description
 * and visual effects like explosions.
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

        this.robots = []; // Populated by Game class

        // Background Canvas for Persistence
        this.backgroundCanvas = document.createElement('canvas');
        this.backgroundCanvas.width = this.width;
        this.backgroundCanvas.height = this.height;
        this.backgroundCtx = this.backgroundCanvas.getContext('2d');
        if (!this.backgroundCtx) throw new Error(`Failed to get 2D context for background canvas.`);

        // Grid Configuration
        this.gridSize = 50;
        this.gridColor = '#444444';

        // Background Texture Loading
        this.backgroundPattern = null;
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => {
            if (this.ctx && this.backgroundCtx) {
                this.backgroundPattern = this.ctx.createPattern(this.backgroundImage, 'repeat');
                console.log("Arena background texture loaded.");
                this.redrawArenaBackground();
            } else { console.error("Context lost before background pattern could be created/drawn."); }
        };
        this.backgroundImage.onerror = () => {
            console.error("Failed to load arena background texture.");
            this.redrawArenaBackground(); // Draw fallback
        };
        this.backgroundImage.src = 'assets/images/metal_floor.png';

        this.redrawArenaBackground(); // Initial draw
    }

    // --- Coordinate Translation Helpers (No changes needed) ---
    translateX(gameX) { return gameX; }
    translateY(gameY) { return gameY; }

    // --- Background Canvas Methods (No changes needed) ---
    drawBackgroundTexture(targetCtx) {
        targetCtx.clearRect(0, 0, this.width, this.height);
        targetCtx.fillStyle = this.backgroundPattern || '#2c2c2c';
        targetCtx.fillRect(0, 0, this.width, this.height);
    }
    drawGridLines(targetCtx) {
        targetCtx.save();
        targetCtx.strokeStyle = this.gridColor;
        targetCtx.lineWidth = 0.5;
        for (let x = this.gridSize; x < this.width; x += this.gridSize) { targetCtx.beginPath(); targetCtx.moveTo(x, 0); targetCtx.lineTo(x, this.height); targetCtx.stroke(); }
        for (let y = this.gridSize; y < this.height; y += this.gridSize) { targetCtx.beginPath(); targetCtx.moveTo(0, y); targetCtx.lineTo(this.width, y); targetCtx.stroke(); }
        targetCtx.restore();
    }
    redrawArenaBackground() {
        console.log("Redrawing arena background canvas (clears scorch marks).");
        if (!this.backgroundCtx) return;
        this.drawBackgroundTexture(this.backgroundCtx);
        this.drawGridLines(this.backgroundCtx);
    }
    addScorchMark(x, y, radius) {
        if (!this.backgroundCtx) return;
        const canvasX = this.translateX(x);
        const canvasY = this.translateY(y);
        this.backgroundCtx.fillStyle = 'rgba(20, 20, 20, 0.65)';
        this.backgroundCtx.beginPath();
        this.backgroundCtx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
        this.backgroundCtx.fill();
        // console.log(`Added scorch mark at (${x.toFixed(0)}, ${y.toFixed(0)}) radius ${radius}`);
    }

    // --- Removed Old Individual Robot Drawing Functions ---
    // drawDefaultBot(ctx, robotData) { ... } -> REMOVED
    // drawTankBot(ctx, robotData) { ... } -> REMOVED
    // drawSpikeBot(ctx, robotData) { ... } -> REMOVED
    // drawTriBot(ctx, robotData) { ... } -> REMOVED


    // === START: Enhanced Robot Drawing System ===
    /**
     * Main function to draw all robots based on data from Game class,
     * using the 'visuals' property for component types and colors.
     * Includes name and health bar. Checks visibility flag.
     * Now supports an expanded set of variants for each robot component.
     */
    drawRobots() {
        const ctx = this.ctx;
        if (!ctx || !this.robots) return;

        const baseRadius = 15; // Use a consistent base size reference

        this.robots.forEach(robotData => {
            // Skip if data is missing or robot is not visible
            if (!robotData || !robotData.visible) return;

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
            const robotDir = robotData.direction || 0;
            const radians = robotDir * Math.PI / 180;

            // Translate and rotate context to robot's position and orientation
            ctx.translate(robotX, robotY);
            ctx.rotate(radians);

            // --- Draw Robot Components (Layered) ---
            ctx.lineWidth = 1; // Base line width
            ctx.strokeStyle = '#111'; // Base stroke color

            // 1. Draw Mobility (Bottom Layer)
            this._drawMobility(ctx, mobilityType, baseRadius, chassisColor);

            // 2. Draw Chassis (Middle Layer)
            this._drawChassis(ctx, chassisType, chassisColor, baseRadius);

            // 3. Draw Turret (Top Layer)
            this._drawTurret(ctx, turretType, turretColor, baseRadius);

            ctx.restore(); // Restore rotation/translation

            // --- Draw Name and Health Bar (Common Elements) ---
            // (Position relative to the un-rotated canvas)
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
            ctx.textBaseline = 'bottom'; // Align to bottom for consistent spacing above bar
            const displayName = robotData.name || 'Unnamed Bot';
            ctx.shadowColor = 'black'; ctx.shadowBlur = 2;
            ctx.fillText(displayName, robotX, robotY + textYOffset);
            ctx.shadowBlur = 0;

            // Health Bar
            const damageClamped = Math.max(0, Math.min(100, robotData.damage || 0));
            const healthPercent = 1 - (damageClamped / 100);
            // Background
            ctx.fillStyle = '#555555'; ctx.fillRect(barX, barY, barWidth, barHeight);
            // Health portion
            if (healthPercent > 0) {
                ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#F44336';
                ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
            }
            // Border
            ctx.strokeStyle = '#222222'; ctx.lineWidth = 0.5; ctx.strokeRect(barX, barY, barWidth, barHeight);
            // --- End Name/Health Bar ---
        }); // End forEach robot
    }

    /**
     * Draws the mobility component of a robot
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {string} mobilityType - Type of mobility component
     * @param {number} baseRadius - Base radius for scaling
     * @param {string} chassisColor - Color of chassis for coordinate mobility elements
     */
    _drawMobility(ctx, mobilityType, baseRadius, chassisColor) {
        ctx.fillStyle = '#555'; // Default mobility color
        const darkAccent = this._darkenColor(chassisColor, 0.7);
        
        let treadWidth = baseRadius * 2.0;
        let treadHeight = baseRadius * 0.6;
        let wheelRadius = baseRadius * 0.5;
        let hoverRadiusX = baseRadius * 1.2;
        let hoverRadiusY = baseRadius * 0.8;
        
        switch (mobilityType) {
            case 'treads':
                // Main treads
                ctx.fillStyle = darkAccent;
                ctx.fillRect(-treadWidth / 2, -treadHeight * 1.5, treadWidth, treadHeight); // Top tread
                ctx.fillRect(-treadWidth / 2, treadHeight * 0.5, treadWidth, treadHeight);  // Bottom tread
                ctx.strokeRect(-treadWidth / 2, -treadHeight * 1.5, treadWidth, treadHeight);
                ctx.strokeRect(-treadWidth / 2, treadHeight * 0.5, treadWidth, treadHeight);
                
                // Tread details - small rectangles to simulate treads
                ctx.fillStyle = '#333';
                const segmentWidth = 5;
                const segmentGap = 4;
                for (let x = -treadWidth/2 + 2; x < treadWidth/2 - 2; x += segmentGap) {
                    // Top tread details
                    ctx.fillRect(x, -treadHeight * 1.5 + 2, segmentWidth, treadHeight - 4);
                    // Bottom tread details
                    ctx.fillRect(x, treadHeight * 0.5 + 2, segmentWidth, treadHeight - 4);
                }
                break;
                
            case 'hover':
                // Hover effect glow
                ctx.save();
                ctx.fillStyle = 'rgba(100, 150, 255, 0.3)'; // Semi-transparent blue glow
                ctx.beginPath();
                ctx.ellipse(0, 0, hoverRadiusX * 1.2, hoverRadiusY * 1.2, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Inner glow
                ctx.fillStyle = 'rgba(160, 190, 255, 0.2)';
                ctx.beginPath();
                ctx.ellipse(0, 0, hoverRadiusX * 0.9, hoverRadiusY * 0.9, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                
                // Base hover pad
                ctx.beginPath();
                ctx.ellipse(0, 0, hoverRadiusX, hoverRadiusY, 0, 0, Math.PI * 2);
                ctx.fillStyle = darkAccent;
                ctx.fill();
                ctx.strokeStyle = '#88aaff';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // Hover vents
                ctx.fillStyle = '#222';
                ctx.beginPath();
                ctx.ellipse(-hoverRadiusX * 0.4, 0, hoverRadiusX * 0.2, hoverRadiusY * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(hoverRadiusX * 0.4, 0, hoverRadiusX * 0.2, hoverRadiusY * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'quad':
                // Four wheels at corners
                ctx.fillStyle = darkAccent;
                const offsetX = baseRadius * 0.9;
                const offsetY = baseRadius * 0.6;
                
                // Draw four wheels
                ctx.beginPath(); ctx.arc(-offsetX, -offsetY, wheelRadius * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(offsetX, -offsetY, wheelRadius * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(-offsetX, offsetY, wheelRadius * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(offsetX, offsetY, wheelRadius * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                
                // Wheel details
                ctx.fillStyle = '#222';
                ctx.beginPath(); ctx.arc(-offsetX, -offsetY, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(offsetX, -offsetY, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(-offsetX, offsetY, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(offsetX, offsetY, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                break;
                
            case 'legs':
                // Spider-like leg arrangement
                ctx.fillStyle = darkAccent;
                const legLength = baseRadius * 0.7;
                const legWidth = baseRadius * 0.2;
                
                // Four legs with joints
                // Front-right leg
                ctx.save();
                ctx.rotate(Math.PI/6);
                ctx.fillRect(0, -legWidth/2, legLength, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength, legWidth);
                ctx.translate(legLength, 0);
                ctx.rotate(Math.PI/4);
                ctx.fillRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.restore();
                
                // Back-right leg
                ctx.save();
                ctx.rotate(-Math.PI/6);
                ctx.fillRect(0, -legWidth/2, legLength, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength, legWidth);
                ctx.translate(legLength, 0);
                ctx.rotate(-Math.PI/4);
                ctx.fillRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.restore();
                
                // Front-left leg
                ctx.save();
                ctx.rotate(Math.PI*5/6);
                ctx.fillRect(0, -legWidth/2, legLength, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength, legWidth);
                ctx.translate(legLength, 0);
                ctx.rotate(-Math.PI/4);
                ctx.fillRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.restore();
                
                // Back-left leg
                ctx.save();
                ctx.rotate(-Math.PI*5/6);
                ctx.fillRect(0, -legWidth/2, legLength, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength, legWidth);
                ctx.translate(legLength, 0);
                ctx.rotate(Math.PI/4);
                ctx.fillRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.restore();
                break;

            case 'wheels': default:
                // Standard two wheels
                ctx.fillStyle = darkAccent;
                
                // Main wheels
                ctx.beginPath(); ctx.arc(-baseRadius * 0.8, 0, wheelRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); // Left wheel
                ctx.beginPath(); ctx.arc(baseRadius * 0.8, 0, wheelRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();  // Right wheel
                
                // Wheel hubs
                ctx.fillStyle = '#222';
                ctx.beginPath(); ctx.arc(-baseRadius * 0.8, 0, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(baseRadius * 0.8, 0, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                break;
        }
    }

    /**
     * Draws the chassis component of a robot
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {string} chassisType - Type of chassis
     * @param {string} chassisColor - Color of the chassis
     * @param {number} baseRadius - Base radius for scaling
     */
    _drawChassis(ctx, chassisType, chassisColor, baseRadius) {
        ctx.fillStyle = chassisColor;
        
        switch (chassisType) {
            case 'heavy':
                // Heavy armored chassis - more square, thicker
                const heavyWidth = baseRadius * 2.4;
                const heavyHeight = baseRadius * 1.6;
                const heavyBorderRadius = 4;
                
                // Draw chassis body (rounded rectangle)
                this._drawRoundedRect(ctx, -heavyWidth/2, -heavyHeight/2, heavyWidth, heavyHeight, heavyBorderRadius);
                
                // Draw armor plates/details
                ctx.fillStyle = this._darkenColor(chassisColor, 0.8);
                
                // Top armor strip
                this._drawRoundedRect(ctx, -heavyWidth/2 + 4, -heavyHeight/2 + 3, heavyWidth - 8, heavyHeight/4, 2);
                
                // Bottom armor strip
                this._drawRoundedRect(ctx, -heavyWidth/2 + 4, heavyHeight/2 - heavyHeight/4 - 3, heavyWidth - 8, heavyHeight/4, 2);
                
                // Center detail
                ctx.fillStyle = this._darkenColor(chassisColor, 0.6);
                ctx.beginPath();
                ctx.arc(0, 0, heavyHeight/4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;
                
            case 'light':
                // Light agile chassis - streamlined, angular
                const lightWidth = baseRadius * 1.7;
                const lightHeight = baseRadius * 1.2;
                
                // Main chassis - pointy front
                ctx.beginPath();
                ctx.moveTo(lightWidth/2, 0); // Front point
                ctx.lineTo(lightWidth/4, -lightHeight/2); // Top-right corner
                ctx.lineTo(-lightWidth/2, -lightHeight/2); // Top-left corner
                ctx.lineTo(-lightWidth/2, lightHeight/2); // Bottom-left corner
                ctx.lineTo(lightWidth/4, lightHeight/2); // Bottom-right corner
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Detail lines
                ctx.strokeStyle = this._darkenColor(chassisColor, 0.7);
                ctx.beginPath();
                ctx.moveTo(-lightWidth/3, -lightHeight/2);
                ctx.lineTo(0, 0);
                ctx.lineTo(-lightWidth/3, lightHeight/2);
                ctx.stroke();
                break;
                
            case 'hexagonal':
                // Hex-shaped chassis
                const hexWidth = baseRadius * 2.2;
                const hexHeight = baseRadius * 1.5;
                const hexSide = hexHeight / 2;
                
                // Draw hexagon
                ctx.beginPath();
                ctx.moveTo(hexWidth/2, 0); // Right point
                ctx.lineTo(hexWidth/4, -hexSide); // Top-right
                ctx.lineTo(-hexWidth/4, -hexSide); // Top-left
                ctx.lineTo(-hexWidth/2, 0); // Left point
                ctx.lineTo(-hexWidth/4, hexSide); // Bottom-left
                ctx.lineTo(hexWidth/4, hexSide); // Bottom-right
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Hex detail
                ctx.fillStyle = this._darkenColor(chassisColor, 0.85);
                ctx.beginPath();
                ctx.arc(0, 0, hexHeight/4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;
                
            case 'triangular':
                // Triangle-shaped chassis
                const triWidth = baseRadius * 2.2;
                const triHeight = baseRadius * 1.8;
                
                // Draw Triangle
                ctx.beginPath();
                ctx.moveTo(triWidth/2, 0); // Point facing forward
                ctx.lineTo(-triWidth/2, -triHeight/2); // Top-left
                ctx.lineTo(-triWidth/2, triHeight/2); // Bottom-left
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Triangle details - smaller inner triangle
                ctx.fillStyle = this._darkenColor(chassisColor, 0.8);
                ctx.beginPath();
                ctx.moveTo(triWidth/4, 0);
                ctx.lineTo(-triWidth/3, -triHeight/3);
                ctx.lineTo(-triWidth/3, triHeight/3);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;

            case 'medium': default:
                // Standard rounded chassis
                const mediumWidth = baseRadius * 2.0;
                const mediumHeight = baseRadius * 1.4;
                const mediumBorderRadius = 3;
                
                // Draw chassis body
                this._drawRoundedRect(ctx, -mediumWidth/2, -mediumHeight/2, mediumWidth, mediumHeight, mediumBorderRadius);
                
                // Add detail lines
                ctx.strokeStyle = this._darkenColor(chassisColor, 0.7);
                ctx.beginPath();
                ctx.moveTo(-mediumWidth/3, -mediumHeight/2);
                ctx.lineTo(-mediumWidth/3, mediumHeight/2);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(mediumWidth/6, -mediumHeight/2);
                ctx.lineTo(mediumWidth/6, mediumHeight/2);
                ctx.stroke();
                
                // Reset stroke style
                ctx.strokeStyle = '#111';
                break;
        }
    }

    /**
     * Draws the turret component of a robot
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {string} turretType - Type of turret
     * @param {string} turretColor - Color of the turret
     * @param {number} baseRadius - Base radius for scaling
     */
    _drawTurret(ctx, turretType, turretColor, baseRadius) {
        ctx.fillStyle = turretColor;
        ctx.strokeStyle = '#111'; // Reset stroke for turret
        
        switch (turretType) {
            case 'cannon':
                // Heavy cannon turret
                const cannonBaseRadius = baseRadius * 0.7; 
                const cannonLength = baseRadius * 1.5; 
                const cannonWidth = baseRadius * 0.4;
                
                // Rectangular turret base
                ctx.beginPath(); 
                ctx.rect(-cannonBaseRadius * 0.5, -cannonBaseRadius * 0.8, cannonBaseRadius, cannonBaseRadius * 1.6); 
                ctx.fill(); 
                ctx.stroke();
                
                // Cannon barrel
                ctx.fillRect(cannonBaseRadius * 0.5, -cannonWidth / 2, cannonLength, cannonWidth); 
                ctx.strokeRect(cannonBaseRadius * 0.5, -cannonWidth / 2, cannonLength, cannonWidth);
                
                // Barrel reinforcement
                ctx.fillStyle = this._darkenColor(turretColor, 0.8);
                ctx.fillRect(cannonBaseRadius * 0.5, -cannonWidth / 2, cannonWidth/2, cannonWidth);
                ctx.strokeRect(cannonBaseRadius * 0.5, -cannonWidth / 2, cannonWidth/2, cannonWidth);
                
                // Muzzle brake
                ctx.fillStyle = this._darkenColor(turretColor, 0.6);
                ctx.fillRect(cannonBaseRadius * 0.5 + cannonLength - cannonWidth/2, -cannonWidth/2 - cannonWidth/4, cannonWidth/2, cannonWidth * 1.5);
                ctx.strokeRect(cannonBaseRadius * 0.5 + cannonLength - cannonWidth/2, -cannonWidth/2 - cannonWidth/4, cannonWidth/2, cannonWidth * 1.5);
                break;
                
            case 'laser':
                // High-tech laser turret
                const laserBaseRadius = baseRadius * 0.5; 
                const laserLength = baseRadius * 1.7; 
                const laserWidth = baseRadius * 0.2;
                
                // Round turret base
                ctx.beginPath(); 
                ctx.arc(0, 0, laserBaseRadius, 0, Math.PI * 2); 
                ctx.fill(); 
                ctx.stroke();
                
                // Thin laser barrel
                ctx.fillRect(laserBaseRadius*0.8, -laserWidth / 2, laserLength, laserWidth); 
                ctx.strokeRect(laserBaseRadius*0.8, -laserWidth / 2, laserLength, laserWidth);
                
                // Energy coils around barrel
                const coilCount = 3;
                const coilSpacing = laserLength / (coilCount + 1);
                const coilHeight = laserWidth * 2;
                
                ctx.fillStyle = this._lightenColor(turretColor, 1.3);
                for (let i = 1; i <= coilCount; i++) {
                    const coilX = laserBaseRadius*0.8 + i * coilSpacing;
                    ctx.beginPath();
                    ctx.rect(coilX - laserWidth/2, -coilHeight/2, laserWidth, coilHeight);
                    ctx.fill();
                    ctx.stroke();
                }
                
                // Emitter tip
                ctx.fillStyle = '#88CCFF';
                ctx.beginPath();
                ctx.arc(laserBaseRadius*0.8 + laserLength, 0, laserWidth, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;
                
            case 'dual':
                // Dual barrel turret
                const dualBaseRadius = baseRadius * 0.6;
                const dualLength = baseRadius * 1.2;
                const dualWidth = baseRadius * 0.25;
                const dualGap = dualWidth * 0.8;
                
                // Round base with detail
                ctx.beginPath();
                ctx.arc(0, 0, dualBaseRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                // Detail circle in center
                ctx.fillStyle = this._darkenColor(turretColor, 0.8);
                ctx.beginPath();
                ctx.arc(0, 0, dualBaseRadius * 0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                // Reset fill color
                ctx.fillStyle = turretColor;
                
                // Upper barrel
                ctx.fillRect(dualBaseRadius*0.8, -dualGap/2 - dualWidth, dualLength, dualWidth);
                ctx.strokeRect(dualBaseRadius*0.8, -dualGap/2 - dualWidth, dualLength, dualWidth);
                
                // Lower barrel
                ctx.fillRect(dualBaseRadius*0.8, dualGap/2, dualLength, dualWidth);
                ctx.strokeRect(dualBaseRadius*0.8, dualGap/2, dualLength, dualWidth);
                break;
                
            case 'missile':
                // Missile launcher turret
                const missileBaseRadius = baseRadius * 0.7;
                const missileLength = baseRadius * 1.1;
                const missileWidth = baseRadius * 1.0;
                const missileCount = 3; // Visible missile tubes
                
                // Rectangular base
                this._drawRoundedRect(ctx, -missileBaseRadius*0.7, -missileBaseRadius*0.7, missileBaseRadius*1.4, missileBaseRadius*1.4, 2);
                
                // Launcher box
                ctx.fillStyle = this._darkenColor(turretColor, 0.8);
                this._drawRoundedRect(ctx, missileBaseRadius*0.6, -missileWidth/2, missileLength, missileWidth, 2);
                
                // Missile tubes
                const tubeHeight = missileWidth / (missileCount + 1);
                ctx.fillStyle = '#333';
                
                for (let i = 1; i <= missileCount; i++) {
                    const tubeY = -missileWidth/2 + i * tubeHeight;
                    this._drawRoundedRect(ctx, missileBaseRadius*0.7, tubeY - tubeHeight*0.4, missileLength*0.8, tubeHeight*0.8, 2);
                }
                break;

            case 'standard': default:
                // Standard turret with medium barrel
                const stdBaseRadius = baseRadius * 0.6; 
                const stdLength = baseRadius * 1.3; 
                const stdWidth = baseRadius * 0.3;
                
                // Round turret base
                ctx.beginPath(); 
                ctx.arc(0, 0, stdBaseRadius, 0, Math.PI * 2); 
                ctx.fill(); 
                ctx.stroke();
                
                // Center detail
                ctx.fillStyle = this._darkenColor(turretColor, 0.8);
                ctx.beginPath();
                ctx.arc(0, 0, stdBaseRadius * 0.4, 0, Math.PI * 2);
                ctx.fill();
                
                // Reset fill color for barrel
                ctx.fillStyle = turretColor;
                
                // Standard barrel
                ctx.fillRect(stdBaseRadius*0.8, -stdWidth / 2, stdLength, stdWidth); 
                ctx.strokeRect(stdBaseRadius*0.8, -stdWidth / 2, stdLength, stdWidth);
                
                // Barrel detail
                ctx.fillStyle = this._darkenColor(turretColor, 0.7);
                ctx.fillRect(stdBaseRadius*0.8 + stdLength - stdWidth, -stdWidth / 2, stdWidth, stdWidth);
                ctx.strokeRect(stdBaseRadius*0.8 + stdLength - stdWidth, -stdWidth / 2, stdWidth, stdWidth);
                break;
        }
    }

    /**
     * Helper method to draw a rounded rectangle
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {number} x - X coordinate of top-left corner
     * @param {number} y - Y coordinate of top-left corner
     * @param {number} width - Width of rectangle
     * @param {number} height - Height of rectangle
     * @param {number} radius - Corner radius
     */
    _drawRoundedRect(ctx, x, y, width, height, radius) {
        // Ensure radius is not too large for the rectangle
        radius = Math.min(radius, Math.min(width / 2, height / 2));
        
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Helper method to darken a color
     * @param {string} color - Hex color string
     * @param {number} factor - Factor to darken by (0-1, where lower is darker)
     * @returns {string} Darkened hex color
     */
    _darkenColor(color, factor) {
        // Convert hex to RGB
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);
        
        // Apply darkening factor
        r = Math.max(0, Math.floor(r * factor));
        g = Math.max(0, Math.floor(g * factor));
        b = Math.max(0, Math.floor(b * factor));
        
        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /**
     * Helper method to lighten a color
     * @param {string} color - Hex color string
     * @param {number} factor - Factor to lighten by (>1 for lighter)
     * @returns {string} Lightened hex color
     */
    _lightenColor(color, factor) {
        // Convert hex to RGB
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);
        
        // Apply lightening factor
        r = Math.min(255, Math.floor(r * factor));
        g = Math.min(255, Math.floor(g * factor));
        b = Math.min(255, Math.floor(b * factor));
        
        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    // === END: Enhanced Robot Drawing System ===


    /** Draws missiles (No change needed) */
    drawMissiles(missiles) {
        const ctx = this.ctx;
        if (!ctx || !missiles || missiles.length === 0) return;
        ctx.save();
        ctx.fillStyle = '#FFA500'; // Bright orange
        missiles.forEach(missile => {
            ctx.beginPath();
            ctx.arc(this.translateX(missile.x), this.translateY(missile.y), missile.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }

    /** Draws explosion effects (No change needed) */
    drawEffects(activeExplosions) {
        const ctx = this.ctx;
        if (!ctx || !activeExplosions || activeExplosions.length === 0) return;
        const now = Date.now();
        for (let i = activeExplosions.length - 1; i >= 0; i--) {
            const explosion = activeExplosions[i];
            const elapsedTime = now - explosion.startTime;
            const progress = Math.min(elapsedTime / explosion.duration, 1);
            if (progress >= 1) { activeExplosions.splice(i, 1); continue; }
            const easeOutProgress = progress * (2 - progress);
            const currentRadius = explosion.maxRadius * easeOutProgress;
            const colorIndex = Math.floor(progress * explosion.colorSequence.length);
            const color = explosion.colorSequence[colorIndex] || explosion.colorSequence[explosion.colorSequence.length - 1];
            ctx.save();
            ctx.globalAlpha = 1.0 - progress; ctx.fillStyle = color; ctx.beginPath();
            ctx.arc(this.translateX(explosion.x), this.translateY(explosion.y), currentRadius, 0, Math.PI * 2);
            ctx.fill(); ctx.restore();
        }
    }

    /** Clears main canvas and draws background (No change needed) */
    clear() {
        if (!this.ctx || !this.backgroundCanvas) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.backgroundCanvas, 0, 0);
    }

    /** Main drawing loop method (No change needed in call structure) */
    draw(missiles, activeExplosions) {
        if (!this.ctx || !this.backgroundCanvas) { console.error("Cannot draw, context/background missing!"); return; }
        this.ctx.clearRect(0, 0, this.width, this.height);        // 1. Clear
        this.ctx.drawImage(this.backgroundCanvas, 0, 0);          // 2. Draw Background (inc. scorch marks)
        this.drawRobots();                                        // 3. Draw Robots (uses new logic)
        this.drawMissiles(missiles);                              // 4. Draw Missiles
        this.drawEffects(activeExplosions);                       // 5. Draw Effects (Explosions)
    }
} // End Arena (Renderer) Class