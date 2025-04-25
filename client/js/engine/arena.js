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


    // === START: Refactored drawRobots function ===
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

            // --- Draw Robot Components (Layered, Placeholders) ---
            ctx.lineWidth = 1; // Base line width
            ctx.strokeStyle = '#111'; // Base stroke color

            // 1. Draw Mobility (Bottom Layer)
            ctx.fillStyle = '#555'; // Default mobility color
            let treadWidth = baseRadius * 2.0;
            let treadHeight = baseRadius * 0.6;
            let wheelRadius = baseRadius * 0.5;
            let hoverRadiusX = baseRadius * 1.2;
            let hoverRadiusY = baseRadius * 0.8;
            switch (mobilityType) {
                case 'treads':
                    ctx.fillRect(-treadWidth / 2, -treadHeight * 1.5, treadWidth, treadHeight); // Top tread
                    ctx.fillRect(-treadWidth / 2, treadHeight * 0.5, treadWidth, treadHeight);  // Bottom tread
                    ctx.strokeRect(-treadWidth / 2, -treadHeight * 1.5, treadWidth, treadHeight);
                    ctx.strokeRect(-treadWidth / 2, treadHeight * 0.5, treadWidth, treadHeight);
                    break;
                case 'hover':
                    ctx.save();
                    ctx.fillStyle = 'rgba(100, 150, 255, 0.3)'; // Semi-transparent blue glow
                    ctx.beginPath();
                    ctx.ellipse(0, 0, hoverRadiusX * 1.2, hoverRadiusY * 1.2, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                    ctx.beginPath();
                    ctx.ellipse(0, 0, hoverRadiusX, hoverRadiusY, 0, 0, Math.PI * 2);
                    ctx.fillStyle = '#444'; ctx.fill(); // Darker base
                    ctx.strokeStyle = '#88aaff'; ctx.lineWidth = 1; ctx.stroke();
                    break;
                case 'wheels': default:
                    ctx.beginPath(); ctx.arc(-baseRadius * 0.8, 0, wheelRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); // Left wheel
                    ctx.beginPath(); ctx.arc(baseRadius * 0.8, 0, wheelRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();  // Right wheel
                    break;
            }

            // 2. Draw Chassis (Middle Layer)
            ctx.fillStyle = chassisColor;
            let chassisWidth, chassisHeight;
            switch (chassisType) {
                case 'heavy': chassisWidth = baseRadius * 2.4; chassisHeight = baseRadius * 1.6; break;
                case 'light': chassisWidth = baseRadius * 1.7; chassisHeight = baseRadius * 1.2; break;
                case 'medium': default: chassisWidth = baseRadius * 2.0; chassisHeight = baseRadius * 1.4; break;
            }
            // Draw slightly rounded rectangle for chassis
            const borderRadius = 3;
            ctx.beginPath();
            ctx.moveTo(-chassisWidth / 2 + borderRadius, -chassisHeight / 2);
            ctx.lineTo(chassisWidth / 2 - borderRadius, -chassisHeight / 2);
            ctx.arcTo(chassisWidth / 2, -chassisHeight / 2, chassisWidth / 2, -chassisHeight / 2 + borderRadius, borderRadius);
            ctx.lineTo(chassisWidth / 2, chassisHeight / 2 - borderRadius);
            ctx.arcTo(chassisWidth / 2, chassisHeight / 2, chassisWidth / 2 - borderRadius, chassisHeight / 2, borderRadius);
            ctx.lineTo(-chassisWidth / 2 + borderRadius, chassisHeight / 2);
            ctx.arcTo(-chassisWidth / 2, chassisHeight / 2, -chassisWidth / 2, chassisHeight / 2 - borderRadius, borderRadius);
            ctx.lineTo(-chassisWidth / 2, -chassisHeight / 2 + borderRadius);
            ctx.arcTo(-chassisWidth / 2, -chassisHeight / 2, -chassisWidth / 2 + borderRadius, -chassisHeight / 2, borderRadius);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();


            // 3. Draw Turret (Top Layer) - Facing right (0 degrees in local coords)
            ctx.fillStyle = turretColor;
            ctx.strokeStyle = '#111'; // Reset stroke for turret
            let turretBaseRadius, barrelLength, barrelWidth;
            switch (turretType) {
                case 'cannon':
                    turretBaseRadius = baseRadius * 0.7; barrelLength = baseRadius * 1.5; barrelWidth = baseRadius * 0.4;
                    // Wider base
                    ctx.beginPath(); ctx.rect(-turretBaseRadius * 0.5, -turretBaseRadius * 0.8, turretBaseRadius, turretBaseRadius * 1.6); ctx.fill(); ctx.stroke();
                    // Barrel
                    ctx.fillRect(turretBaseRadius * 0.5, -barrelWidth / 2, barrelLength, barrelWidth); ctx.strokeRect(turretBaseRadius * 0.5, -barrelWidth / 2, barrelLength, barrelWidth);
                    break;
                case 'laser':
                    turretBaseRadius = baseRadius * 0.5; barrelLength = baseRadius * 1.7; barrelWidth = baseRadius * 0.2;
                    // Smaller base
                    ctx.beginPath(); ctx.arc(0, 0, turretBaseRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                    // Thin barrel
                    ctx.fillRect(turretBaseRadius*0.8, -barrelWidth / 2, barrelLength, barrelWidth); ctx.strokeRect(turretBaseRadius*0.8, -barrelWidth / 2, barrelLength, barrelWidth);
                    break;
                case 'standard': default:
                    turretBaseRadius = baseRadius * 0.6; barrelLength = baseRadius * 1.3; barrelWidth = baseRadius * 0.3;
                    // Standard round base
                    ctx.beginPath(); ctx.arc(0, 0, turretBaseRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                    // Standard barrel
                    ctx.fillRect(turretBaseRadius*0.8, -barrelWidth / 2, barrelLength, barrelWidth); ctx.strokeRect(turretBaseRadius*0.8, -barrelWidth / 2, barrelLength, barrelWidth);
                    break;
            }
            // --- End Draw Robot Components ---

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
    // === END: Refactored drawRobots function ===


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