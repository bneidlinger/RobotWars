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

        // Set canvas drawing buffer size based on its display size (handles CSS resizing)
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;

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
            this.backgroundPattern = this.ctx.createPattern(this.backgroundImage, 'repeat');
            console.log("Arena background texture loaded successfully.");
            if (typeof game !== 'undefined' && !game.running) {
                this.draw(); // Redraw background if game hasn't started yet
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
     * Main function to draw all robots, selecting the specific drawing
     * function based on the robot's appearance property. Handles
     * translation, rotation, and common elements like ID/Health bar.
     */
    drawRobots() {
        const ctx = this.ctx; // Use the context obtained in the constructor

        this.robots.forEach(robotData => {
            if (!robotData || !robotData.isAlive) return;

            ctx.save(); // Save context state before transforming

            // Translate origin to robot's position and rotate
            ctx.translate(robotData.x, robotData.y);
            const radians = robotData.direction * Math.PI / 180;
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
            const displayId = typeof robotData.id === 'string' && robotData.id.length > 6 ? robotData.id.substring(0, 4) + '...' : robotData.id;
            ctx.fillText(`ID: ${displayId}`, robotData.x, robotData.y - robotRadius - 12);

            // Health Bar
            const barWidth = robotRadius * 2; const barHeight = 5;
            const barX = robotData.x - robotRadius; const barY = robotData.y + robotRadius + 4;
            ctx.fillStyle = '#555555'; ctx.fillRect(barX, barY, barWidth, barHeight);
            const damageClamped = Math.max(0, Math.min(100, robotData.damage || 0));
            const healthPercent = 1 - (damageClamped / 100);
            const healthWidth = barWidth * healthPercent;
            ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#F44336';
            if (healthWidth > 0) ctx.fillRect(barX, barY, healthWidth, barHeight);
            ctx.strokeStyle = '#222222'; ctx.lineWidth = 0.5; ctx.strokeRect(barX, barY, barWidth, barHeight);
        });
    }

    /**
     * Draws missiles based on data provided.
     * @param {Array<object>} missiles - An array of missile data objects.
     */
    drawMissiles(missiles) {
        const ctx = this.ctx;
        if (missiles && missiles.length > 0) {
            ctx.save();
            ctx.fillStyle = '#FFA500'; // Missile color
            missiles.forEach(missile => {
                ctx.beginPath();
                ctx.arc(missile.x, missile.y, missile.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.restore();
        }
    }

    /**
     * Draws and updates client-side explosion effects.
     */
    drawExplosions() {
        const ctx = this.ctx;
        if (this.explosions.length === 0) return;

        ctx.save();
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            ctx.beginPath();
            ctx.globalAlpha = explosion.alpha;
            ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            ctx.fillStyle = explosion.color;
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
     * Creates a client-side explosion effect.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} [size=1] - Size multiplier.
     */
    createExplosion(x, y, size = 1) {
        const colors = ['#FFA500', '#FF4500', '#FFD700', '#DC143C', '#FF6347'];
        this.explosions.push({
            x: x, y: y, radius: 3 * size,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1.0, speed: 0.5 + Math.random() * 0.5 * size,
            decay: 0.015 + Math.random() * 0.01
        });
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
        this.drawBackground();
        this.drawGrid();
        this.drawRobots(); // Uses data in this.robots (set by Game class)
        // Draw missiles using data from Game class
        if (typeof game !== 'undefined' && game.missiles) {
             this.drawMissiles(game.missiles);
        }
        this.drawExplosions(); // Draw client-side visual effects
    }
} // End Arena Class