// client/js/engine/arena.js

/**
 * Manages the rendering of the game arena canvas, including the background,
 * grid, robots (based on server data including names), missiles, and visual effects like explosions.
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

        // --- Get the 2D Rendering Context ---
        this.ctx = this.canvas.getContext('2d');

        // --- Crucial Check: Ensure Context Was Obtained ---
        if (!this.ctx) {
            throw new Error(`Failed to get 2D rendering context for canvas "${canvasId}". Check browser compatibility or potential conflicts.`);
        }

        // --- Use Dimensions from HTML Attributes ---
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // --- Crucial Check: Ensure width/height are valid from HTML ---
        if (!this.width || this.width <= 0 || !this.height || this.height <= 0) {
            console.error(`Canvas "${canvasId}" has invalid dimensions defined in HTML (width: ${this.canvas.width}, height: ${this.canvas.height}). Halting Arena setup.`);
            throw new Error(`Canvas "${canvasId}" requires valid width and height attributes in the HTML.`);
        }
        console.log(`Arena initialized with dimensions from HTML: ${this.width}x${this.height}`);
        // --- End Dimension Handling ---

        // Array to hold robot data objects received from the server for rendering
        this.robots = []; // Populated by Game class

        // Array to hold client-side explosion effect data
        this.explosions = [];

        // Configuration for the grid
        this.gridSize = 50;
        this.gridColor = '#444444'; // Keep grid subtle in dark theme
        // Grid text color might not be needed if not drawing coords

        // --- Background Texture Loading ---
        this.backgroundPattern = null;
        this.backgroundImage = new Image();

        this.backgroundImage.onload = () => {
            if (this.ctx) {
                this.backgroundPattern = this.ctx.createPattern(this.backgroundImage, 'repeat');
                console.log("Arena background texture loaded successfully.");
                if (typeof game !== 'undefined' && !game.running) {
                    this.draw(); // Redraw background if game hasn't started yet
                }
            } else {
                console.error("Context lost before background pattern could be created.");
            }
        };
        this.backgroundImage.onerror = () => {
            console.error("Failed to load arena background texture from: " + this.backgroundImage.src);
        };
        // Ensure this path is correct relative to your index.html
        this.backgroundImage.src = 'assets/images/metal_floor.png'; // Keep metal floor
        // --- End Background Texture Loading ---
    }

    /**
     * Draws the background (texture or fallback color).
     */
    drawBackground() {
        const ctx = this.ctx;
        if (!ctx) return;
        ctx.clearRect(0, 0, this.width, this.height);

        if (this.backgroundPattern) {
            ctx.fillStyle = this.backgroundPattern;
            ctx.fillRect(0, 0, this.width, this.height);
        } else {
            ctx.fillStyle = '#2c2c2c'; // Fallback dark grey if texture fails
            ctx.fillRect(0, 0, this.width, this.height);
        }
    }

    /**
     * Draws the background grid lines.
     */
    drawGrid() {
        const ctx = this.ctx;
        if (!ctx) return;
        ctx.save();
        ctx.strokeStyle = this.gridColor;
        ctx.lineWidth = 0.5; // Keep lines thin

        for (let x = this.gridSize; x < this.width; x += this.gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.height); ctx.stroke();
        }
        for (let y = this.gridSize; y < this.height; y += this.gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.width, y); ctx.stroke();
        }
        ctx.restore();
    }

    // --- Robot Specific Drawing Functions ---
    // (These remain the same as before: drawDefaultBot, drawTankBot, drawSpikeBot, drawTriBot)

    drawDefaultBot(ctx, robotData) {
        const radius = robotData.radius || 15;
        ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = robotData.color; ctx.fill();
        ctx.strokeStyle = '#111'; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(radius * 1.5, 0);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    }

    drawTankBot(ctx, robotData) {
        const radius = robotData.radius || 15;
        const width = radius * 2.2; const height = radius * 1.8;
        ctx.fillStyle = robotData.color; ctx.strokeStyle = '#111'; ctx.lineWidth = 1;
        ctx.fillRect(-width / 2, -height / 2, width, height); ctx.strokeRect(-width / 2, -height / 2, width, height);
        ctx.beginPath(); ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = '#aaa'; ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(radius * 1.7, 0);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    }

    drawSpikeBot(ctx, robotData) {
        const radius = robotData.radius || 15; const numSpikes = 8;
        ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = robotData.color; ctx.fill();
        ctx.strokeStyle = '#111'; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath();
        for (let i = 0; i < numSpikes; i++) {
            const angle = (i / numSpikes) * Math.PI * 2;
            const startX = Math.cos(angle) * radius * 0.8; const startY = Math.sin(angle) * radius * 0.8;
            const endX = Math.cos(angle) * radius * 1.4; const endY = Math.sin(angle) * radius * 1.4;
            ctx.moveTo(startX, startY); ctx.lineTo(endX, endY);
        }
        ctx.strokeStyle = '#ccc'; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(radius * 1.5, 0);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    }

    drawTriBot(ctx, robotData) {
        const radius = robotData.radius || 15; const size = radius * 1.8;
        ctx.beginPath(); ctx.moveTo(size * 0.6, 0); ctx.lineTo(-size * 0.4, size * 0.5);
        ctx.lineTo(-size * 0.4, -size * 0.5); ctx.closePath();
        ctx.fillStyle = robotData.color; ctx.fill();
        ctx.strokeStyle = '#111'; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#aaa'; ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(radius * 1.6, 0);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    }

    /**
     * Main function to draw all robots, including name and health bar.
     */
    drawRobots() {
        const ctx = this.ctx;
        if (!ctx) return;

        this.robots.forEach(robotData => {
            if (!robotData || !robotData.isAlive) return;

            ctx.save();

            const robotX = robotData.x || 0;
            const robotY = robotData.y || 0;
            const robotDir = robotData.direction || 0;
            const radians = robotDir * Math.PI / 180;

            ctx.translate(robotX, robotY);
            ctx.rotate(radians);

            // Select and call the appropriate appearance drawing function
            switch (robotData.appearance) {
                case 'tank': this.drawTankBot(ctx, robotData); break;
                case 'spike': this.drawSpikeBot(ctx, robotData); break;
                case 'tri': this.drawTriBot(ctx, robotData); break;
                case 'default':
                default: this.drawDefaultBot(ctx, robotData); break;
            }

            ctx.restore(); // Restore context (removes transform)

            // --- Draw common elements (Name, Health Bar) ---
            const robotRadius = robotData.radius || 15;

            // Name Text (Draw first, below the robot)
            ctx.fillStyle = '#ffffff'; // White text color for visibility on dark bg
            // Use the retro font if desired, otherwise fallback to Arial
            ctx.font = "14px 'VT323', monospace"; // Adjusted size for VT323
            // ctx.font = '11px Arial'; // Alternative standard font
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top'; // Align text top so it sits below the Y coordinate
            const displayName = robotData.name || 'Unknown'; // Use name from data, fallback
            // Add a small shadow/outline for better readability on textured background
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 2;
            ctx.fillText(displayName, robotX, robotY + robotRadius + 3); // Position below radius + spacing
            ctx.shadowBlur = 0; // Reset shadow

            // Health Bar (Draw below the name)
            const barWidth = robotRadius * 2;
            const barHeight = 5; // Keep bar slim
            const barX = robotX - robotRadius;
            const barY = robotY + robotRadius + 18; // Adjusted Y position below name (consider font size)
            const damageClamped = Math.max(0, Math.min(100, robotData.damage || 0));
            const healthPercent = 1 - (damageClamped / 100);

            // Draw background bar
            ctx.fillStyle = '#555555';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            // Draw health portion
            if (healthPercent > 0) {
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
     * @param {Array<object>} missiles - An array of missile data objects.
     */
    drawMissiles(missiles) {
        const ctx = this.ctx;
        if (!ctx || !missiles || missiles.length === 0) return;

        ctx.save();
        ctx.fillStyle = '#FFA500'; // Bright orange for missiles
        missiles.forEach(missile => {
            const missileX = missile.x || 0;
            const missileY = missile.y || 0;
            const missileRadius = missile.radius || 5;
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
        if (!ctx || this.explosions.length === 0) return;

        ctx.save();
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            const explosionX = explosion.x || 0;
            const explosionY = explosion.y || 0;

            ctx.beginPath();
            ctx.globalAlpha = Math.max(0, explosion.alpha || 0);
            ctx.arc(explosionX, explosionY, explosion.radius || 5, 0, Math.PI * 2);
            ctx.fillStyle = explosion.color || '#FF4500';
            ctx.fill();

            explosion.radius += explosion.speed || 1;
            explosion.alpha -= explosion.decay || 0.02;

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
     * @param {number} [size=1] - Size multiplier.
     */
    createExplosion(x, y, size = 1) {
        const colors = ['#FFA500', '#FF4500', '#FFD700', '#DC143C', '#FF6347'];
        const baseRadius = 3; const baseSpeed = 0.5; const baseDecay = 0.015;
        this.explosions.push({
            x: x, y: y,
            radius: baseRadius * Math.max(1, size),
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1.0,
            speed: baseSpeed + Math.random() * 0.5 * Math.max(1, size),
            decay: baseDecay + Math.random() * 0.01
        });
    }

    /**
     * Clears the canvas and redraws the background and grid.
     */
    clear() {
        if (!this.ctx) return;
        this.drawBackground();
        this.drawGrid();
    }

    /**
     * Main drawing method called every frame by the Game's render loop.
     */
    draw() {
        if (!this.ctx) {
             console.error("Cannot draw arena, rendering context is missing!");
             return;
        }
        this.drawBackground();
        this.drawGrid();
        this.drawRobots(); // Draws robots with names/health bars
        if (typeof game !== 'undefined' && game.missiles) {
             this.drawMissiles(game.missiles);
        }
        this.drawExplosions();
    }
} // End Arena Class