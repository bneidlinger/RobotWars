// client/js/engine/arena.js

/**
 * Manages the rendering of the game arena canvas, including the background,
 * grid, robots (based on server data), missiles, and visual effects like explosions.
 */
class Arena {
    /**
     * Creates an Arena instance.
     * @param {string} canvasId - The ID of the HTML canvas element.
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        // --- Crucial Check: Ensure Canvas Element Exists ---
        if (!this.canvas) {
            throw new Error(`Canvas element with ID "${canvasId}" not found in the HTML.`);
        }

        // --- V V V --- GET THE 2D RENDERING CONTEXT --- V V V ---
        // This is essential for drawing anything on the canvas.
        this.ctx = this.canvas.getContext('2d');
        // --- ^ ^ ^ --- GET THE 2D RENDERING CONTEXT --- ^ ^ ^ ---

        // --- Crucial Check: Ensure Context Was Obtained ---
        if (!this.ctx) {
            throw new Error(`Failed to get 2D rendering context for canvas "${canvasId}". Check browser compatibility or potential conflicts.`);
        }

        // --- Updated Dimension Handling ---
        // Use the width and height attributes defined in the HTML
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // --- Crucial Check: Ensure width/height are valid from HTML ---
        if (!this.width || this.width <= 0 || !this.height || this.height <= 0) {
            console.error(`Canvas "${canvasId}" has invalid dimensions defined in HTML (width: ${this.canvas.width}, height: ${this.canvas.height}). Halting Arena setup.`);
            throw new Error(`Canvas "${canvasId}" requires valid width and height attributes in the HTML.`);
            // If you wanted a fallback (less safe):
            // console.warn(`Canvas "${canvasId}" missing valid dimensions in HTML. Falling back to 600x600.`);
            // this.width = this.canvas.width = 600;
            // this.height = this.canvas.height = 600;
        }
        console.log(`Arena initialized with dimensions from HTML: ${this.width}x${this.height}`);
        // --- End Updated Dimension Handling ---

        // Array to hold robot data objects received from the server for rendering
        // This array is populated/updated by the Game class.
        this.robots = [];

        // Array to hold client-side explosion effect data
        this.explosions = [];

        // Configuration for the grid
        this.gridSize = 50;
        this.gridColor = '#444444';
        this.gridTextColor = '#666666';

        // --- Background Texture Loading ---
        this.backgroundPattern = null;
        this.backgroundImage = new Image();

        this.backgroundImage.onload = () => {
            // Ensure context is still valid before creating pattern
            if (this.ctx) {
                this.backgroundPattern = this.ctx.createPattern(this.backgroundImage, 'repeat');
                console.log("Arena background texture loaded successfully.");
                // Redraw immediately if game hasn't started yet (to show background)
                if (typeof game !== 'undefined' && !game.running) {
                    this.draw();
                }
            } else {
                console.error("Context lost before background pattern could be created.");
            }
        };

        this.backgroundImage.onerror = () => {
            console.error("Failed to load arena background texture from: " + this.backgroundImage.src);
        };

        // Ensure this path is correct relative to your index.html
        this.backgroundImage.src = 'assets/images/metal_floor.png';
        // --- End Background Texture Loading ---
    }

    /**
     * Draws the background (texture or fallback color).
     */
    drawBackground() {
        // Using 'this.ctx' which should now be defined
        const ctx = this.ctx;
        if (!ctx) return; // Guard against missing context
        ctx.clearRect(0, 0, this.width, this.height); // Clear previous frame

        if (this.backgroundPattern) {
            ctx.fillStyle = this.backgroundPattern;
            ctx.fillRect(0, 0, this.width, this.height);
        } else {
            ctx.fillStyle = '#2c2c2c'; // Fallback solid color
            ctx.fillRect(0, 0, this.width, this.height);
        }
    }

    /**
     * Draws the background grid lines.
     */
    drawGrid() {
        const ctx = this.ctx;
        if (!ctx) return; // Guard against missing context
        ctx.save();
        ctx.strokeStyle = this.gridColor;
        ctx.lineWidth = 0.5;

        for (let x = this.gridSize; x < this.width; x += this.gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.height); ctx.stroke();
        }
        for (let y = this.gridSize; y < this.height; y += this.gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.width, y); ctx.stroke();
        }
        ctx.restore();
    }

    // --- Robot Specific Drawing Functions ---

    drawDefaultBot(ctx, robotData) {
        const radius = robotData.radius || 15;
        ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = robotData.color; ctx.fill();
        ctx.strokeStyle = '#111'; ctx.lineWidth = 1; ctx.stroke();
        // Turret indicator
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(radius * 1.5, 0);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    }

    drawTankBot(ctx, robotData) {
        const radius = robotData.radius || 15;
        const width = radius * 2.2; const height = radius * 1.8;
        ctx.fillStyle = robotData.color; ctx.strokeStyle = '#111'; ctx.lineWidth = 1;
        // Main body
        ctx.fillRect(-width / 2, -height / 2, width, height); ctx.strokeRect(-width / 2, -height / 2, width, height);
        // Turret base
        ctx.beginPath(); ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = '#aaa'; ctx.fill(); ctx.stroke();
        // Turret barrel
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(radius * 1.7, 0);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    }

    drawSpikeBot(ctx, robotData) {
        const radius = robotData.radius || 15; const numSpikes = 8;
        // Main body
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
        // Turret indicator (optional)
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(radius * 1.5, 0);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    }

    drawTriBot(ctx, robotData) {
        const radius = robotData.radius || 15; const size = radius * 1.8;
        // Triangular body
        ctx.beginPath(); ctx.moveTo(size * 0.6, 0); // Nose
        ctx.lineTo(-size * 0.4, size * 0.5); // Bottom left corner
        ctx.lineTo(-size * 0.4, -size * 0.5); // Top left corner
        ctx.closePath();
        ctx.fillStyle = robotData.color; ctx.fill();
        ctx.strokeStyle = '#111'; ctx.lineWidth = 1; ctx.stroke();
        // Center circle (optional)
        ctx.beginPath(); ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#aaa'; ctx.fill(); ctx.stroke();
        // Turret indicator
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(radius * 1.6, 0);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    }

    /**
     * Main function to draw all robots, selecting the specific drawing
     * function based on the robot's appearance property. Handles
     * translation, rotation, and common elements like ID/Health bar.
     */
    drawRobots() {
        const ctx = this.ctx; // Use the context obtained in the constructor
        if (!ctx) return; // Guard against missing context

        this.robots.forEach(robotData => {
            // Skip drawing if robot data is missing or robot is not alive
            if (!robotData || !robotData.isAlive) return;

            ctx.save(); // Save context state before transforming

            // Translate origin to robot's position and rotate
            // Ensure x, y, and direction are valid numbers
            const robotX = robotData.x || 0;
            const robotY = robotData.y || 0;
            const robotDir = robotData.direction || 0;
            const radians = robotDir * Math.PI / 180;

            ctx.translate(robotX, robotY);
            ctx.rotate(radians); // Rotate canvas for the robot's body/turret

            // --- Select and call the appropriate drawing function ---
            switch (robotData.appearance) {
                case 'tank': this.drawTankBot(ctx, robotData); break;
                case 'spike': this.drawSpikeBot(ctx, robotData); break;
                case 'tri': this.drawTriBot(ctx, robotData); break;
                case 'default':
                default: this.drawDefaultBot(ctx, robotData); break;
            }

            ctx.restore(); // Restore context (removes transform)

            // --- Draw common elements (ID, Health Bar) ---
            // Drawn *after* restoring context, relative to original canvas coordinates
            const robotRadius = robotData.radius || 15;

            // ID Text
            ctx.fillStyle = '#ffffff'; ctx.font = '10px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            // Display shorter ID if too long
            const displayId = typeof robotData.id === 'string' && robotData.id.length > 6 ? robotData.id.substring(0, 4) + '...' : robotData.id || 'N/A';
            ctx.fillText(`ID: ${displayId}`, robotX, robotY - robotRadius - 12);

            // Health Bar
            const barWidth = robotRadius * 2; const barHeight = 5;
            const barX = robotX - robotRadius; const barY = robotY + robotRadius + 4;
            const damageClamped = Math.max(0, Math.min(100, robotData.damage || 0)); // Ensure damage is 0-100
            const healthPercent = 1 - (damageClamped / 100);

            // Draw background bar
            ctx.fillStyle = '#555555';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            // Draw health portion
            if (healthPercent > 0) { // Only draw if health is positive
                ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#F44336';
                const healthWidth = barWidth * healthPercent;
                ctx.fillRect(barX, barY, healthWidth, barHeight);
            }

            // Draw border for the bar
            ctx.strokeStyle = '#222222'; ctx.lineWidth = 0.5;
            ctx.strokeRect(barX, barY, barWidth, barHeight);
        });
    }

    /**
     * Draws missiles based on data provided.
     * @param {Array<object>} missiles - An array of missile data objects received from the server.
     */
    drawMissiles(missiles) {
        const ctx = this.ctx;
        if (!ctx || !missiles || missiles.length === 0) return; // Guard against missing context or empty array

        ctx.save();
        ctx.fillStyle = '#FFA500'; // Consistent missile color
        missiles.forEach(missile => {
            // Ensure missile data is valid before drawing
            const missileX = missile.x || 0;
            const missileY = missile.y || 0;
            const missileRadius = missile.radius || 5; // Default radius if missing
            ctx.beginPath();
            ctx.arc(missileX, missileY, missileRadius, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }

    /**
     * Draws and updates client-side explosion effects.
     */
    drawExplosions() {
        const ctx = this.ctx;
        if (!ctx || this.explosions.length === 0) return; // Guard against missing context or no explosions

        ctx.save();
        // Iterate backwards for safe removal while iterating
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];

            // Guard against incomplete explosion data
            const explosionX = explosion.x || 0;
            const explosionY = explosion.y || 0;

            ctx.beginPath();
            ctx.globalAlpha = Math.max(0, explosion.alpha || 0); // Ensure alpha is valid
            ctx.arc(explosionX, explosionY, explosion.radius || 5, 0, Math.PI * 2); // Use default radius if needed
            ctx.fillStyle = explosion.color || '#FF4500'; // Use default color if needed
            ctx.fill();

            // Update explosion properties for the next frame
            explosion.radius += explosion.speed || 1;
            explosion.alpha -= explosion.decay || 0.02;

            // Remove explosion if it's faded out
            if (explosion.alpha <= 0) {
                this.explosions.splice(i, 1);
            }
        }
        ctx.restore();
    }

    /**
     * Creates a client-side explosion effect instance.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} [size=1] - Size multiplier affecting radius, speed.
     */
    createExplosion(x, y, size = 1) {
        const colors = ['#FFA500', '#FF4500', '#FFD700', '#DC143C', '#FF6347'];
        const baseRadius = 3;
        const baseSpeed = 0.5;
        const baseDecay = 0.015;

        this.explosions.push({
            x: x,
            y: y,
            radius: baseRadius * Math.max(1, size), // Ensure size contributes positively
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1.0,
            speed: baseSpeed + Math.random() * 0.5 * Math.max(1, size),
            decay: baseDecay + Math.random() * 0.01 // Decay speed less affected by size
        });
    }

    /**
     * Clears the canvas and redraws the background and grid.
     * Useful for reset or pre-game state.
     */
    clear() {
        if (!this.ctx) return;
        this.drawBackground();
        this.drawGrid();
    }

    /**
     * Main drawing method called every frame by the Game's render loop.
     * Orchestrates drawing the background, grid, robots, missiles, and effects.
     */
    draw() {
        // Ensure ctx is valid before drawing
        if (!this.ctx) {
             console.error("Cannot draw arena, rendering context is missing!");
             return;
        }

        // 1. Draw background (texture or solid color)
        this.drawBackground();

        // 2. Draw grid lines
        this.drawGrid();

        // 3. Draw robots based on data in this.robots (set externally by Game class)
        this.drawRobots();

        // 4. Draw missiles using data from Game class
        // Ensure game object and missiles array exist
        if (typeof game !== 'undefined' && game.missiles) {
             this.drawMissiles(game.missiles);
        }

        // 5. Draw client-side visual effects (explosions)
        this.drawExplosions();
    }
} // End Arena Class