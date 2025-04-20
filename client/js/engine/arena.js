// client/js/engine/arena.js

/**
 * Manages the rendering of the game arena canvas, including the background,
 * grid, robots, missiles, scorch marks, and visual effects like explosions.
 * (Class internally referred to as Renderer)
 */
class Arena { // File name remains Arena, class concept is Renderer
    /**
     * Creates an Arena/Renderer instance.
     * @param {string} canvasId - The ID of the HTML canvas element.
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element with ID "${canvasId}" not found.`);
        }
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error(`Failed to get 2D context for canvas "${canvasId}".`);
        }

        // --- Use Dimensions from HTML Attributes ---
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        if (!this.width || this.width <= 0 || !this.height || this.height <= 0) {
            console.error(`Canvas "${canvasId}" has invalid dimensions (${this.canvas.width}x${this.canvas.height}). Halting setup.`);
            throw new Error(`Canvas "${canvasId}" requires valid width and height attributes.`);
        }
        console.log(`Renderer initialized with dimensions: ${this.width}x${this.height}`);

        // Array to hold robot *data objects* received from the Game class for rendering
        this.robots = []; // Populated by Game class

        // --- START CHANGE: Background Canvas for Persistence ---
        this.backgroundCanvas = document.createElement('canvas');
        this.backgroundCanvas.width = this.width;
        this.backgroundCanvas.height = this.height;
        this.backgroundCtx = this.backgroundCanvas.getContext('2d');
        if (!this.backgroundCtx) {
            throw new Error(`Failed to get 2D context for background canvas.`);
        }
        // --- END CHANGE ---

        // Configuration for the grid
        this.gridSize = 50;
        this.gridColor = '#444444';

        // --- Background Texture Loading ---
        this.backgroundPattern = null;
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => {
            if (this.ctx && this.backgroundCtx) { // Need both contexts
                this.backgroundPattern = this.ctx.createPattern(this.backgroundImage, 'repeat');
                console.log("Arena background texture loaded.");
                this.redrawArenaBackground(); // Draw initial background once loaded
            } else {
                console.error("Context lost before background pattern could be created/drawn.");
            }
        };
        this.backgroundImage.onerror = () => {
            console.error("Failed to load arena background texture.");
            this.redrawArenaBackground(); // Draw fallback background if texture fails
        };
        this.backgroundImage.src = 'assets/images/metal_floor.png'; // Relative to index.html

        // Initial draw of background (might be fallback color until image loads)
        this.redrawArenaBackground();
    }

    // --- START CHANGE: Coordinate Translation Helpers ---
    /** Translates game X coordinate to canvas X coordinate. */
    translateX(gameX) {
        // For now, simple 1:1 mapping
        return gameX;
    }
    /** Translates game Y coordinate to canvas Y coordinate. */
    translateY(gameY) {
        // For now, simple 1:1 mapping
        return gameY;
    }
    // --- END CHANGE ---


    // --- START CHANGE: Methods for Background Canvas ---
    /**
     * Draws the background (texture or fallback color) onto the background canvas.
     */
    drawBackgroundTexture(targetCtx) {
        targetCtx.clearRect(0, 0, this.width, this.height);
        if (this.backgroundPattern) {
            targetCtx.fillStyle = this.backgroundPattern;
        } else {
            targetCtx.fillStyle = '#2c2c2c'; // Fallback dark grey
        }
        targetCtx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Draws the background grid lines onto the background canvas.
     */
    drawGridLines(targetCtx) {
        targetCtx.save();
        targetCtx.strokeStyle = this.gridColor;
        targetCtx.lineWidth = 0.5;
        for (let x = this.gridSize; x < this.width; x += this.gridSize) {
            targetCtx.beginPath(); targetCtx.moveTo(x, 0); targetCtx.lineTo(x, this.height); targetCtx.stroke();
        }
        for (let y = this.gridSize; y < this.height; y += this.gridSize) {
            targetCtx.beginPath(); targetCtx.moveTo(0, y); targetCtx.lineTo(this.width, y); targetCtx.stroke();
        }
        targetCtx.restore();
    }

    /**
     * Redraws the entire background canvas (texture, grid). Call this to clear scorch marks.
     */
    redrawArenaBackground() {
        console.log("Redrawing arena background canvas (clears scorch marks).");
        if (!this.backgroundCtx) return;
        this.drawBackgroundTexture(this.backgroundCtx);
        this.drawGridLines(this.backgroundCtx);
    }


    /**
     * Adds a persistent scorch mark to the background canvas.
     * @param {number} x - Game X coordinate of the center.
     * @param {number} y - Game Y coordinate of the center.
     * @param {number} radius - Radius of the scorch mark in game units.
     */
    addScorchMark(x, y, radius) {
        if (!this.backgroundCtx) return;
        const canvasX = this.translateX(x);
        const canvasY = this.translateY(y);
        // Use a semi-transparent dark color
        this.backgroundCtx.fillStyle = 'rgba(20, 20, 20, 0.65)'; // Darker, slightly less transparent
        this.backgroundCtx.beginPath();
        // Use canvas coordinates and radius (assuming 1:1 scale for now)
        this.backgroundCtx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
        this.backgroundCtx.fill();
        console.log(`Added scorch mark at (${x.toFixed(0)}, ${y.toFixed(0)}) radius ${radius}`);
    }
    // --- END CHANGE: Background Canvas Methods ---


    // --- Robot Specific Drawing Functions ---
    // (No changes needed in these individual draw functions)
    drawDefaultBot(ctx, robotData) { /* ... remains same ... */
        const radius = robotData.radius || 15;
        ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = robotData.color; ctx.fill();
        ctx.strokeStyle = '#111'; ctx.lineWidth = 1; ctx.stroke();
        // Turret/Direction indicator
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(radius * 1.5, 0);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    }
    drawTankBot(ctx, robotData) { /* ... remains same ... */
        const radius = robotData.radius || 15;
        const width = radius * 2.2; const height = radius * 1.8;
        ctx.fillStyle = robotData.color; ctx.strokeStyle = '#111'; ctx.lineWidth = 1;
        ctx.fillRect(-width / 2, -height / 2, width, height); ctx.strokeRect(-width / 2, -height / 2, width, height);
        // Turret circle
        ctx.beginPath(); ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = '#aaa'; ctx.fill(); ctx.stroke();
        // Turret barrel
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(radius * 1.7, 0);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    }
    drawSpikeBot(ctx, robotData) { /* ... remains same ... */
        const radius = robotData.radius || 15; const numSpikes = 8;
        // Body
        ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = robotData.color; ctx.fill();
        ctx.strokeStyle = '#111'; ctx.lineWidth = 1; ctx.stroke();
        // Spikes
        ctx.beginPath();
        for (let i = 0; i < numSpikes; i++) {
            const angle = (i / numSpikes) * Math.PI * 2;
            const startX = Math.cos(angle) * radius * 0.8; const startY = Math.sin(angle) * radius * 0.8;
            const endX = Math.cos(angle) * radius * 1.4; const endY = Math.sin(angle) * radius * 1.4;
            ctx.moveTo(startX, startY); ctx.lineTo(endX, endY);
        }
        ctx.strokeStyle = '#ccc'; ctx.lineWidth = 2; ctx.stroke();
        // Turret
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(radius * 1.5, 0);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    }
    drawTriBot(ctx, robotData) { /* ... remains same ... */
        const radius = robotData.radius || 15; const size = radius * 1.8;
        // Body
        ctx.beginPath(); ctx.moveTo(size * 0.6, 0); ctx.lineTo(-size * 0.4, size * 0.5);
        ctx.lineTo(-size * 0.4, -size * 0.5); ctx.closePath();
        ctx.fillStyle = robotData.color; ctx.fill();
        ctx.strokeStyle = '#111'; ctx.lineWidth = 1; ctx.stroke();
        // Turret circle
        ctx.beginPath(); ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#aaa'; ctx.fill(); ctx.stroke();
        // Turret barrel
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(radius * 1.6, 0);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    }

    /**
     * Main function to draw all robots based on data from Game class.
     * Includes name and health bar. Checks visibility flag.
     */
    drawRobots() {
        const ctx = this.ctx;
        if (!ctx || !this.robots) return; // Check if robots array exists

        this.robots.forEach(robotData => {
            // START CHANGE: Check visibility flag from Game.js
            if (!robotData || !robotData.visible) return;
            // END CHANGE

            ctx.save();
            const robotX = this.translateX(robotData.x || 0);
            const robotY = this.translateY(robotData.y || 0);
            const robotDir = robotData.direction || 0;
            const radians = robotDir * Math.PI / 180;

            ctx.translate(robotX, robotY);
            ctx.rotate(radians);

            // Draw specific appearance
            switch (robotData.appearance) {
                case 'tank': this.drawTankBot(ctx, robotData); break;
                case 'spike': this.drawSpikeBot(ctx, robotData); break;
                case 'tri': this.drawTriBot(ctx, robotData); break;
                case 'default': default: this.drawDefaultBot(ctx, robotData); break;
            }
            ctx.restore(); // Restore rotation/translation

            // Draw common elements (Name, Health Bar) - outside the save/restore block
            const robotRadius = robotData.radius || 15; // Use radius from data

            // Name Text
            ctx.fillStyle = '#ffffff';
            ctx.font = "14px 'VT323', monospace";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            const displayName = robotData.name || 'Unknown';
            ctx.shadowColor = 'black'; ctx.shadowBlur = 2;
            ctx.fillText(displayName, robotX, robotY + robotRadius + 3);
            ctx.shadowBlur = 0;

            // Health Bar
            const barWidth = robotRadius * 2; const barHeight = 5;
            const barX = robotX - robotRadius; const barY = robotY + robotRadius + 18;
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
        });
    }

    /**
     * Draws missiles based on data provided by Game class.
     * @param {Array<object>} missiles - Array of missile data objects { x, y, radius }.
     */
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

    // --- START CHANGE: New Explosion Rendering ---
    /**
     * Draws and updates client-side explosion effects based on data from Game class.
     * @param {Array<object>} activeExplosions - Array of explosion effect objects from Game.js.
     */
    drawEffects(activeExplosions) {
        const ctx = this.ctx;
        if (!ctx || !activeExplosions || activeExplosions.length === 0) return;

        const now = Date.now();

        // Iterate backwards for safe removal
        for (let i = activeExplosions.length - 1; i >= 0; i--) {
            const explosion = activeExplosions[i];
            const elapsedTime = now - explosion.startTime;
            const progress = Math.min(elapsedTime / explosion.duration, 1); // 0 to 1

            // Remove finished explosions from the array passed by reference
            if (progress >= 1) {
                activeExplosions.splice(i, 1);
                continue;
            }

            // Calculate current size and color
            // Let's use an easing function for radius (e.g., easeOutQuad) for better feel
            const easeOutProgress = progress * (2 - progress);
            const currentRadius = explosion.maxRadius * easeOutProgress;

            // Cycle through colors based on progress
            const colorIndex = Math.floor(progress * explosion.colorSequence.length);
            const color = explosion.colorSequence[colorIndex] || explosion.colorSequence[explosion.colorSequence.length - 1];

            // Draw the circle
            ctx.save();
            ctx.globalAlpha = 1.0 - progress; // Fade out
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(
                this.translateX(explosion.x),
                this.translateY(explosion.y),
                currentRadius, // Use potentially scaled radius if needed
                0, Math.PI * 2
            );
            ctx.fill();
            ctx.restore(); // Resets globalAlpha
        }
    }
    // --- END CHANGE: New Explosion Rendering ---

    // --- START CHANGE: Remove old client-side explosion methods ---
    // drawExplosions() - REPLACED by drawEffects()
    // createExplosion() - REMOVED (logic moved to Game.js)
    // --- END CHANGE ---


    /**
     * Clears the main canvas and redraws the persistent background canvas onto it.
     * Essentially prepares the frame but doesn't draw dynamic elements.
     */
    clear() {
        if (!this.ctx || !this.backgroundCanvas) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        // Draw the background canvas (including grid and scorch marks)
        this.ctx.drawImage(this.backgroundCanvas, 0, 0);
    }

    /**
     * Main drawing method called every frame by the Game's render loop.
     * Orchestrates drawing the background, robots, missiles, and effects.
     * @param {Array<object>} missiles - Array of missile data objects from Game.js.
     * @param {Array<object>} activeExplosions - Array of explosion effect objects from Game.js.
     */
    draw(missiles, activeExplosions) { // Accept missiles and explosions
        if (!this.ctx || !this.backgroundCanvas) {
             console.error("Cannot draw, rendering context or background canvas missing!");
             return;
        }
        // 1. Clear main canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 2. Draw the persistent background (texture, grid, scorch marks)
        this.ctx.drawImage(this.backgroundCanvas, 0, 0);

        // 3. Draw Robots (checks visibility flag)
        this.drawRobots();

        // 4. Draw Missiles
        this.drawMissiles(missiles);

        // 5. Draw Effects (Explosions) on top
        this.drawEffects(activeExplosions);
    }
} // End Arena (Renderer) Class