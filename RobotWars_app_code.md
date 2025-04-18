# RobotWars App Code Export

## package.json

```code
{
  "name": "robot-wars",
  "version": "1.0.0",
  "description": "Online Robot Wars Game",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.21.2",
    "socket.io": "^4.8.1"
  },
  "author": "",
  "license": "ISC"
}
```

## client/css/main.css

```code
/* client/css/main.css - Retro Font Mix with Modern Theme */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    /* --- 80s Retro Font --- */
    font-family: 'VT323', monospace;
    font-size: 20px; /* Base size for VT323 */
    /* --- End Retro Font --- */

    /* Keep modern dark theme */
    background-color: #1e1e1e;
    color: #e0e0e0;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #444;
}

header h1 {
    /* --- 80s Retro Font --- */
    font-family: 'Press Start 2P', cursive;
    font-size: 1.8rem; /* Adjust if needed */
    /* --- End Retro Font --- */

    color: #4CAF50;
    margin: 0;
}

nav {
    display: flex;
    gap: 10px;
    align-items: center;
}

/* Keep modern button and select styling */
button, select {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    /* --- 80s Retro Font --- */
    font-family: 'VT323', monospace;
    font-size: 15px; /* Adjust if needed */
    /* --- End Retro Font --- */
}

button:hover, select:hover {
    background-color: #45a049;
}

/* Style disabled buttons */
button:disabled {
    background-color: #555; /* Darker grey when disabled */
    color: #aaa;
    cursor: not-allowed;
}
button:disabled:hover {
    background-color: #555; /* Prevent hover effect when disabled */
}


/* Keep modern select specific styling */
select {
    background-color: #333;
}
select:disabled {
    background-color: #555;
    color: #aaa;
    cursor: not-allowed;
}

/* Style the player name input */
input#playerName {
     /* --- 80s Retro Font --- */
    font-family: 'VT323', monospace;
    font-size: 15px; /* Match button/select size */
     /* --- End Retro Font --- */

    background-color: #333;
    color: #e0e0e0;
    border: 1px solid #555;
    padding: 8px;
    border-radius: 4px;
    margin-right: 5px;
}
input#playerName:disabled {
    background-color: #555;
    color: #aaa;
    cursor: not-allowed;
}


/* Keep modern grid layout */
main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.game-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

#arena {
    /* Keep modern arena styling */
    background-color: #2c2c2c;
    border: 2px solid #444;
    border-radius: 8px;
    /* width/height set by HTML attributes */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 100%;
    display: block; /* Helps prevent extra space below */
}

/* Keep modern stats panel styling */
.stats-panel {
    background-color: #333;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Apply retro font to panel titles */
.stats-panel h3, .editor-container h3, .api-help h4, #lobby-area h3, #game-history-log h4 {
     /* --- 80s Retro Font --- */
    font-family: 'VT323', monospace;
    font-size: 18px; /* Adjust if needed */
     /* --- End Retro Font --- */
     margin-bottom: 10px;
     color: #4CAF50; /* Match header color accent */
}


.editor-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* CodeMirror Styling */
.CodeMirror {
    height: 400px; /* Adjust height as needed */
    border-radius: 8px;
    border: 1px solid #444; /* Subtle border */

    /* --- 80s Retro Font --- */
    font-family: 'VT323', monospace;
    font-size: 16px; /* Adjust for readability */
    /* --- End Retro Font --- */
}
/* Style CodeMirror when read-only */
.CodeMirror-readonly .CodeMirror-cursor {
    display: none !important; /* Hide cursor when read-only */
}
.CodeMirror-readonly {
    background-color: #2a2a2a !important; /* Slightly different background when read-only */
}


/* Keep modern API help styling */
.api-help {
    background-color: #333;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.api-help ul {
    list-style-position: inside;
    padding-left: 5px;
}

.api-help li {
    margin-bottom: 5px;
}

/* Style code snippets within API help */
.api-help code {
    /* --- 80s Retro Font --- */
    font-family: 'VT323', monospace;
    /* Inherit size or slightly smaller */
    /* --- End Retro Font --- */

    background-color: #444; /* Keep modern snippet style */
    padding: 2px 4px;
    border-radius: 3px;
    color: #f0f0f0; /* Lighter color for code */
}


/* --- Lobby Area Grid Layout --- */
#lobby-area {
    margin-top: 20px;
    background: #333;
    padding: 15px;
    border-radius: 8px;
    display: grid; /* Use grid */
    grid-template-columns: 1fr 1fr; /* Two equal columns */
    gap: 20px; /* Space between columns */
    border-top: 2px solid #444; /* Add a separator from main content */
}

/* Styles for elements within the first column of the lobby area */
#lobby-area > div:first-child {
    /* Styles specific to the first column if needed */
}

/* Styles for elements within the second column (Game History) */
#lobby-area > div:last-child {
    /* Styles specific to the second column if needed */
}

#lobby-status {
    margin-bottom: 10px;
    font-weight: bold;
    color: #e0e0e0;
}

#event-log {
    height: 150px; /* Adjust height as needed */
    overflow-y: scroll;
    border: 1px solid #555;
    margin-bottom: 10px;
    padding: 5px;
    background: #222;
    font-size: 14px;
    font-family: 'VT323', monospace;
}

#chat-area {
    display: flex;
    gap: 5px;
}

#chat-input {
    flex-grow: 1;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #555;
    background: #2a2a2a;
    color: #e0e0e0;
    font-family: 'VT323', monospace;
    font-size: 14px;
}

#send-chat {
    /* Inherits general button styles */
    /* Add specific overrides if needed */
    padding: 8px 16px; /* Match other buttons */
    font-size: 15px;
}


/* --- Game History Log Styling --- */
#game-history-log {
    /* Container takes up the second grid column */
    font-family: 'VT323', monospace; /* Use retro font */
}

/* #game-history-log h4 already styled by shared header styles */

#game-history-list {
    /* Style the list area */
    height: 195px; /* Roughly match event log height, adjusted for less padding */
    overflow-y: auto; /* Scroll if content exceeds height */
    background: #222; /* Match event log background */
    border: 1px solid #555; /* Match event log border */
    padding: 8px;
    font-size: 14px; /* Match event log font size */
}

#game-history-list > div { /* Style individual history entries */
    margin-bottom: 4px;
    padding-bottom: 4px;
    border-bottom: 1px dashed #444; /* Separator line */
    color: #cccccc; /* Slightly dimmer than chat */
    word-wrap: break-word; /* Prevent long names from breaking layout */
}

#game-history-list > div:last-child { /* Remove border from last item */
    border-bottom: none;
    margin-bottom: 0;
}

/* --- Responsive Adjustments --- */
@media (max-width: 900px) {
    main {
        grid-template-columns: 1fr; /* Stack game and editor */
    }
}

@media (max-width: 768px) { /* Adjust breakpoint if needed */
    #lobby-area {
        grid-template-columns: 1fr; /* Stack lobby columns */
    }
    #game-history-log {
         margin-top: 20px; /* Add space when stacked */
    }
}
```

## client/js/engine/arena.js

```code
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
```

## client/js/engine/collision.js

```code
/**
 * Collision detection system for Robot Wars
 * Handles collisions between robots, missiles, and arena boundaries
 */
class CollisionSystem {
    constructor(game) {
        this.game = game;
    }

    /**
     * Check all possible collisions in the game
     */
    checkCollisions() {
        this.checkRobotMissileCollisions();
        this.checkRobotRobotCollisions();
        this.checkMissileBoundaryCollisions();
    }

    /**
     * Check for collisions between robots and missiles
     */
    checkRobotMissileCollisions() {
        const robots = this.game.robots;

        robots.forEach(robotA => {
            robots.forEach(robotB => {
                if (robotA.id !== robotB.id) {
                    // Check if any of robotB's missiles hit robotA
                    for (let i = robotB.missiles.length - 1; i >= 0; i--) {
                        const missile = robotB.missiles[i];
                        const dx = robotA.x - missile.x;
                        const dy = robotA.y - missile.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < robotA.radius + missile.radius) {
                            // Collision detected
                            robotB.missiles.splice(i, 1);

                            // Create explosion
                            this.game.arena.createExplosion(missile.x, missile.y, missile.power);

                            // Apply damage based on missile power
                            const damage = 10 * missile.power;
                            const destroyed = robotA.takeDamage(damage);

                            // Check if robot was destroyed
                            if (destroyed) {
                                this.game.arena.createExplosion(robotA.x, robotA.y, 5);
                                console.log(`Robot ${robotA.id} was destroyed!`);
                            }
                        }
                    }
                }
            });
        });
    }

    /**
     * Check for collisions between robots and prevent overlap
     */
    checkRobotRobotCollisions() {
        const robots = this.game.robots;

        for (let i = 0; i < robots.length; i++) {
            for (let j = i + 1; j < robots.length; j++) {
                const robotA = robots[i];
                const robotB = robots[j];

                // Skip robots that are destroyed
                if (robotA.damage >= 100 || robotB.damage >= 100) continue;

                const dx = robotB.x - robotA.x;
                const dy = robotB.y - robotA.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = robotA.radius + robotB.radius;

                // If robots are overlapping
                if (distance < minDistance) {
                    // Calculate collision response
                    const angle = Math.atan2(dy, dx);
                    const overlap = minDistance - distance;

                    // Move robots apart
                    const moveX = Math.cos(angle) * overlap / 2;
                    const moveY = Math.sin(angle) * overlap / 2;

                    robotA.x -= moveX;
                    robotA.y -= moveY;
                    robotB.x += moveX;
                    robotB.y += moveY;

                    // Apply minor damage from collision
                    robotA.takeDamage(1);
                    robotB.takeDamage(1);
                }
            }
        }
    }

    /**
     * Check for missiles hitting arena boundaries
     */
    checkMissileBoundaryCollisions() {
        const arena = this.game.arena;
        const robots = this.game.robots;

        robots.forEach(robot => {
            for (let i = robot.missiles.length - 1; i >= 0; i--) {
                const missile = robot.missiles[i];

                // Check if missile is out of bounds
                if (missile.x - missile.radius < 0 ||
                    missile.x + missile.radius > arena.width ||
                    missile.y - missile.radius < 0 ||
                    missile.y + missile.radius > arena.height) {

                    // Create small explosion at boundary
                    this.game.arena.createExplosion(missile.x, missile.y, missile.power / 2);

                    // Remove the missile
                    robot.missiles.splice(i, 1);
                }
            }
        });
    }
}
```

## client/js/engine/game.js

```code
// client/js/engine/game.js

/**
 * Client-side Game class for Robot Wars.
 * Manages the connection to the server, receives game state,
 * renders the game arena based on server information, and handles
 * player game lifecycle and spectator mode transitions using the Controls state machine. // <-- Updated description
 * Does NOT run the simulation locally.
 */
class Game {
    /**
     * Creates a Game instance.
     * @param {string} arenaId - The ID of the HTML canvas element used for the arena.
     */
    constructor(arenaId) {
        // Arena handles drawing the canvas, grid, robots, and visual effects (explosions)
        try {
            this.arena = new Arena(arenaId); // Arena constructor might throw if canvas/context fails
        } catch (error) {
            console.error("Failed to initialize Arena:", error);
            alert(`Critical Error: Could not initialize game graphics.\n${error.message}`);
            // Attempt to prevent further errors if arena failed
            this.arena = null; // Mark arena as unusable
        }

        // Store local representations of game state received from the server
        this.robots = []; // Data objects for robots, including appearance and name
        this.missiles = []; // Data objects for missiles (Arena will access this to draw)

        // State variables for the client game flow
        this.running = false; // Is the rendering loop active?
        this.animationFrame = null; // ID for requestAnimationFrame
        this.myPlayerId = null; // This client's unique ID
        this.lastServerState = null; // The most recent gameState received
        this.gameId = null; // ID of the current server game instance being played OR spectated
        this.gameName = null; // Name of the current game being played OR spectated
    }

    /**
     * Stores the player ID assigned by the server.
     * Called by network.js upon receiving the 'assignId' event.
     * @param {string} id - The socket ID assigned by the server.
     */
    setPlayerId(id) {
        this.myPlayerId = id;
        console.log("My Player ID assigned:", this.myPlayerId);
    }

    /**
     * Updates the local game representation based on state received from the server.
     * Called by network.js upon receiving the 'gameStateUpdate' event.
     * This includes updating robot positions, damage, appearance, name, missiles, and triggering explosions.
     * @param {object} gameState - The game state object sent by the server.
     */
    updateFromServer(gameState) {
        if (!gameState) return;

        // Only update if the game ID matches the one we are playing/spectating
        // Network.js should filter, but double-checking is safe.
        if (gameState.gameId !== this.gameId) {
             // console.warn(`Received gameState for ${gameState.gameId}, but current game is ${this.gameId}. Skipping.`);
             return;
        }

        this.lastServerState = gameState;
        // Update game name if it changed (unlikely but possible)
        this.gameName = gameState.gameName || this.gameName || gameState.gameId; // Keep existing if not provided, fallback to ID

        // --- Update Robots ---
        if (gameState.robots) {
            // Map server robot data to simple objects for rendering
            this.robots = gameState.robots.map(serverRobotData => ({
                id: serverRobotData.id,
                x: serverRobotData.x,
                y: serverRobotData.y,
                direction: serverRobotData.direction,
                damage: serverRobotData.damage,
                color: serverRobotData.color,
                isAlive: serverRobotData.isAlive,
                radius: 15, // Assuming fixed radius for client rendering logic
                appearance: serverRobotData.appearance || 'default',
                name: serverRobotData.name || 'Unknown'
            }));
            if (this.arena) {
                this.arena.robots = this.robots;
            }
        } else {
            this.robots = [];
            if (this.arena) {
                 this.arena.robots = [];
            }
        }

        // --- Update Missiles ---
        if (gameState.missiles) {
            this.missiles = gameState.missiles.map(serverMissileData => ({
                id: serverMissileData.id,
                x: serverMissileData.x,
                y: serverMissileData.y,
                radius: serverMissileData.radius
            }));
        } else {
            this.missiles = [];
        }

        // --- Trigger Client-Side Explosions ---
        if (this.arena && gameState.explosions && gameState.explosions.length > 0) {
            gameState.explosions.forEach(expData => {
                if (typeof this.arena.createExplosion === 'function') {
                    this.arena.createExplosion(expData.x, expData.y, expData.size);
                }
            });
        }

        // --- Update UI Elements (Dashboard) ---
        if (window.dashboard && typeof window.dashboard.updateStats === 'function') {
             const context = { gameName: this.gameName };
             window.dashboard.updateStats(this.robots, context);
        }
    }

    /**
     * The main client-side rendering loop. Runs via requestAnimationFrame.
     * Delegates the actual drawing work to the Arena's draw() method.
     */
    clientRenderLoop() {
        if (!this.running) return;
        if (this.arena) {
            this.arena.draw(); // Arena accesses this.robots and this.missiles
        } else {
             console.error("Render loop cannot run because Arena object is missing.");
             this.stop();
             return;
        }
        this.animationFrame = requestAnimationFrame(this.clientRenderLoop.bind(this));
    }

    /**
     * Starts the client-side rendering loop.
     * Typically called when 'gameStart' or 'spectateStart' is received.
     */
    startRenderLoop() {
        if (this.running) return;
        if (!this.arena) {
             console.error("Cannot start render loop because Arena is not initialized.");
             return;
        }
        console.log("Starting client render loop...");
        this.running = true;
        this.clientRenderLoop();
    }

    /**
     * Stops the client-side rendering loop.
     * Called on disconnection, 'gameOver', 'spectateGameOver', or before starting new game/spectate.
     */
    stop() {
        if (!this.running) return;
        console.log("Stopping client render loop.");
        this.running = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    /** Clears local game state (robots, missiles, etc.) and resets arena/dashboard */
    clearLocalState() {
        console.log("Clearing local game state (robots, missiles, arena, dashboard)...");
        if (this.arena) {
            this.arena.explosions = []; // Clear visual effects in arena
            this.arena.robots = []; // Clear arena's robot list
            this.arena.clear(); // Draw background/grid immediately
        }
        this.missiles = []; // Clear missile list in game state
        this.robots = []; // Clear robot list
        this.lastServerState = null; // Clear last known state
        this.gameId = null; // Clear game ID/Name
        this.gameName = null;
        // Clear dashboard (pass empty context)
        if (window.dashboard && typeof window.dashboard.updateStats === 'function') {
            window.dashboard.updateStats([], {});
        } else {
            console.warn("Dashboard object or updateStats method not found during clearLocalState.");
        }
    }


    // --- Game Lifecycle & Spectator Handlers (Called by network.js) ---

    /**
     * Handles the 'gameStart' event from the server. Prepares the client for playing the match.
     * @param {object} data - Data associated with the game start { gameId, gameName, players }.
     */
    handleGameStart(data) {
        console.log("Game Start signal received:", data);
        this.stop();
        this.clearLocalState();

        this.gameId = data.gameId;
        this.gameName = data.gameName || data.gameId; // Store game name

        if (data.players) {
            console.log("Players in this game:", data.players.map(p => `${p.name} (${p.appearance})`).join(', '));
        }

        this.startRenderLoop();

        // --- Update Controls state to 'playing' ---
        if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
             controls.setState('playing'); // Use the new state manager
        } else {
             console.warn("Controls object or setState method not found, UI may not lock correctly for game start.");
        }

        if (typeof window.updateLobbyStatus === 'function') {
             window.updateLobbyStatus(`Playing Game: ${this.gameName}`);
        }
    }

    /**
     * Handles the 'gameOver' event from the server (for players). Cleans up the client state and UI.
     * @param {object} data - Data associated with the game end { gameId, winnerId, winnerName, reason }.
     */
    handleGameOver(data) {
        console.log("Game Over signal received (as player):", data);
        this.stop(); // Stop the rendering loop

        // Display winner message
        let winnerDisplayName = 'None';
        if (data.winnerName) winnerDisplayName = data.winnerName;
        else if (data.winnerId) winnerDisplayName = `ID: ${data.winnerId.substring(0, 6)}...`;

        const endedGameName = this.gameName || data.gameId; // Use stored name if available
        const message = `Game '${endedGameName}' Over! ${data.reason || 'Match ended.'} Winner: ${winnerDisplayName}`;
        alert(message); // Display name (or fallback) in alert

        // --- Update Controls state back to 'lobby' ---
        if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
             controls.setState('lobby'); // Use the new state manager
        } else {
            console.warn("Controls object or setState method not found, UI may not reset correctly after game over.");
        }

        // Update lobby status display
        if (typeof window.updateLobbyStatus === 'function') {
             window.updateLobbyStatus('Game Over. Ready Up for another match!');
        }

        // Clear the display after a short delay
         setTimeout(() => {
              this.clearLocalState();
         }, 2000); // 2-second delay
    }


    // --- Spectator Mode Handlers ---

    /**
     * Handles the 'spectateStart' event from the server. Prepares the client for spectating.
     * @param {object} spectateData - Data associated with spectating { gameId, gameName }.
     */
    handleSpectateStart(spectateData) {
        console.log("Starting spectate mode for game:", spectateData);
        this.stop(); // Ensure any previous rendering is stopped
        this.clearLocalState(); // Clear state from any previous session

        this.gameId = spectateData.gameId; // Store the ID of the game being spectated
        this.gameName = spectateData.gameName || spectateData.gameId; // Store the name

        // --- Update Controls state to 'spectating' ---
        if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
            controls.setState('spectating'); // Use the new state manager
        } else {
            console.warn("Controls object or setState method not found, UI may not lock correctly for spectating.");
        }

        // Update UI (lobby status) to show spectating status
        if (typeof window.updateLobbyStatus === 'function') {
             window.updateLobbyStatus(`Spectating Game: ${this.gameName}`);
        }

        // Start rendering the spectated game
        this.startRenderLoop();
    }

    /**
     * Handles the 'spectateGameOver' event from the server. Transitions client back to lobby state.
     * @param {object} gameOverData - Data associated with the game end { gameId, winnerId, winnerName, reason }.
     */
    handleSpectateEnd(gameOverData) {
        console.log("Spectate mode ended:", gameOverData);
        this.stop(); // Stop the rendering loop

         // --- Update Controls state back to 'lobby' ---
        if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
            controls.setState('lobby'); // Use the new state manager
        } else {
             console.warn("Controls object or setState method not found, UI may not reset correctly after spectating.");
        }

        // Update UI (lobby status) to show returned to lobby
        if (typeof window.updateLobbyStatus === 'function') {
             window.updateLobbyStatus('Returned to Lobby. Enter name & code, then Ready Up!');
        }

        // Display game over message to the spectator
        let winnerDisplayName = gameOverData.winnerName || (gameOverData.winnerId ? `ID: ${gameOverData.winnerId.substring(0, 6)}...` : 'None');
        const endedGameName = this.gameName || gameOverData.gameId; // Use stored name
        const message = `Spectated game '${endedGameName}' finished!\nWinner: ${winnerDisplayName}. (${gameOverData.reason || 'Match ended.'})`;
        alert(message);

        // Clear the display and state after a shorter delay
        setTimeout(() => {
             this.clearLocalState();
        }, 1500); // 1.5-second delay
    }

} // End Game Class
```

## client/js/engine/interpreter.js

```code
class RobotInterpreter {
    constructor() {
        this.robotFunctions = {};
        this.running = false;
    }

    initialize(robots) {
        this.running = true;

        // Create sandboxed environment for each robot
        robots.forEach(robot => {
            try {
                // Create a function wrapper for the robot code
                const functionBody = `
                    "use strict";
                    // 'this' here refers to the interpreter instance passed via .call()
                    let robot = {
                        drive: (direction, speed) => this.safeDrive(${robot.id}, direction, speed),
                        scan: (direction, resolution) => this.safeScan(${robot.id}, direction, resolution),
                        fire: (direction, power) => this.safeFire(${robot.id}, direction, power),
                        damage: () => this.safeDamage(${robot.id})
                    };

                    // Robot AI function that will be called each tick
                    function run() {
                        ${robot.code}
                    }

                    return run;
                `;

                // Create function from the code using the Function constructor.
                // The 'this' inside the function body needs to be set when called.
                const createRobotFunction = new Function(functionBody);
                this.robotFunctions[robot.id] = createRobotFunction.call(this); // Get the 'run' function
            } catch (error) {
                console.error(`Error initializing robot ${robot.id}:`, error);
                this.robotFunctions[robot.id] = () => {
                    console.log(`Robot ${robot.id} has invalid code and is disabled.`);
                };
            }
        });
    }

    // *** Restored executeTick method ***
    executeTick(robots, game) {
        if (!this.running) return;

        robots.forEach(robot => {
            // Only execute code for active robots
            if (robot.damage < 100 && this.robotFunctions[robot.id]) {
                try {
                    // Set the current robot and game context for the safe API methods
                    this.currentRobot = robot;
                    this.currentGame = game;

                    // Get the robot's specific AI function
                    const runFunction = this.robotFunctions[robot.id];

                    // Execute the robot's AI function, setting 'this' correctly
                    // so the arrow functions inside the sandbox can find safeDrive etc.
                    if (typeof runFunction === 'function') {
                         runFunction.call(this);
                    } else {
                         // This might happen if initialization failed badly
                         // console.warn(`Robot ${robot.id} does not have a valid run function.`);
                         // Optionally disable it permanently here
                         // this.robotFunctions[robot.id] = null;
                    }

                } catch (error) {
                    console.error(`Error executing robot ${robot.id}:`, error);
                    // Optional: Disable the robot after an error
                    // this.robotFunctions[robot.id] = () => {};
                } finally {
                    // Clear context after execution (good practice)
                    this.currentRobot = null;
                    this.currentGame = null;
                }
            }
        });
    } // *** End of executeTick method ***

    stop() {
        this.running = false;
        this.robotFunctions = {}; // Clear functions when stopping
    }

    // Safe API methods - These are called FROM the sandboxed code via the 'robot' object
    safeDrive(robotId, direction, speed) {
        // Check if the call is coming from the currently executing robot
        if (this.currentRobot && this.currentRobot.id === robotId) {
            this.currentRobot.drive(direction, speed);
        } else {
            console.warn(`Robot ${robotId} (or external code) tried to call safeDrive improperly.`);
        }
    }

    safeScan(robotId, direction, resolution) {
        if (this.currentRobot && this.currentRobot.id === robotId && this.currentGame) {
            // The actual scan logic is in the Game class
            return this.currentGame.performScan(this.currentRobot, direction, resolution);
        } else {
             console.warn(`Robot ${robotId} (or external code) tried to call safeScan improperly.`);
        }
        return null;
    }

    safeFire(robotId, direction, power) {
        if (this.currentRobot && this.currentRobot.id === robotId) {
            return this.currentRobot.fire(direction, power);
        } else {
             console.warn(`Robot ${robotId} (or external code) tried to call safeFire improperly.`);
        }
        return false;
    }

    safeDamage(robotId) {
        if (this.currentRobot && this.currentRobot.id === robotId) {
            return this.currentRobot.damage;
        } else {
             console.warn(`Robot ${robotId} (or external code) tried to call safeDamage improperly.`);
        }
        return 0; // Or maybe null/undefined to indicate an issue
    }
}
```

## client/js/engine/robot.js

```code
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
    }

    draw(ctx) {
        // Draw robot body
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw direction indicator
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

        // Draw missiles
        this.missiles.forEach(missile => missile.draw(ctx));

        // Draw robot ID
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Robot ${this.id}`, this.x, this.y - this.radius - 5);

        // Draw damage bar
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

        // Create missile
        const radians = direction * Math.PI / 180;
        const missileSpeed = 7 + power;
        const missile = new Missile(
            this.x + Math.cos(radians) * (this.radius + 5),
            this.y - Math.sin(radians) * (this.radius + 5),
            direction,
            missileSpeed,
            power
        );

        this.missiles.push(missile);
        return true;
    }

    takeDamage(amount) {
        this.damage += amount;
        if (this.damage >= 100) {
            this.damage = 100;
            return true; // Robot destroyed
        }
        return false;
    }
}

class Missile {
    constructor(x, y, direction, speed, power) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.power = power;
        this.radius = 3 + power;
    }

    update() {
        const radians = this.direction * Math.PI / 180;
        this.x += Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed; // Canvas y-axis is inverted
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f39c12';
        ctx.fill();
    }
}
```

## client/js/ui/controls.js

```code
// client/js/ui/controls.js

/**
 * Controls handler for Robot Wars.
 * Manages UI state ('lobby', 'waiting', 'playing', 'spectating'), button interactions,
 * code loading, appearance selection, player name input, and sends relevant data/signals
 * to the server via the network handler.
 */
class Controls {
    /**
     * Creates an instance of Controls.
     * @param {Game} game - Reference to the main game object.
     * @param {Network} network - Reference to the network handler object.
     */
    constructor(game, network) {
        this.game = game;
        this.network = network; // Store network reference
        // UI State Machine: 'lobby', 'waiting', 'playing', 'spectating'
        this.uiState = 'lobby'; // Initial state
        this.isClientReady = false; // Still track if ready *within* lobby/waiting states

        if (!this.game || !this.network) {
             console.error("Controls initialized without valid game or network reference!");
        }
        this.setupEventListeners();
        this.loadPlayerName();
        this.updateUIForState(); // Set initial UI based on 'lobby' state
        console.log('Controls initialized with game and network references');
    }

    /** Sets the internal state and updates the UI accordingly */
    setState(newState) {
        // List of valid states
        const validStates = ['lobby', 'waiting', 'playing', 'spectating'];
        if (!validStates.includes(newState)) {
            console.error(`Attempted to set invalid UI state: ${newState}`);
            return;
        }

        if (this.uiState === newState) {
             // console.log(`Controls UI State already '${newState}'. No change.`); // Optional log
             return; // No change needed
        }

        console.log(`Controls UI State changing from '${this.uiState}' to '${newState}'`);
        this.uiState = newState;

        // Reset internal ready flag when leaving waiting state or entering non-lobby states
        if (newState !== 'waiting') {
            this.isClientReady = false;
        }

        this.updateUIForState();
    }

    /** Updates all relevant UI elements based on the current this.uiState */
    updateUIForState() {
        // Get elements
        const readyButton = document.getElementById('btn-ready');
        const appearanceSelect = document.getElementById('robot-appearance-select');
        const playerNameInput = document.getElementById('playerName');
        const sampleCodeSelect = document.getElementById('sample-code');
        const resetButton = document.getElementById('btn-reset');
        const editorIsAvailable = typeof editor !== 'undefined';

        // Defaults (most restrictive)
        let readyButtonText = "Loading...";
        let readyButtonColor = '#777';
        let readyButtonDisabled = true;
        let inputsDisabled = true;
        let editorReadOnly = true;

        switch (this.uiState) {
            case 'lobby': // Can interact, ready button shows "Ready Up"
                readyButtonText = "Ready Up";
                readyButtonColor = '#4CAF50'; // Green
                readyButtonDisabled = false;
                inputsDisabled = false;
                editorReadOnly = false;
                break;

            case 'waiting': // Can only click "Unready"
                readyButtonText = "Waiting... (Click to Unready)";
                readyButtonColor = '#FFA500'; // Orange
                readyButtonDisabled = false; // Must be enabled to unready
                inputsDisabled = true; // Other inputs locked
                editorReadOnly = true;
                break;

            case 'playing': // All interaction disabled
                readyButtonText = "Game in Progress...";
                readyButtonColor = '#777'; // Grey
                readyButtonDisabled = true;
                inputsDisabled = true;
                editorReadOnly = true;
                break;

            case 'spectating': // All interaction disabled
                readyButtonText = "Spectating...";
                readyButtonColor = '#4682B4'; // Steel Blue
                readyButtonDisabled = true;
                inputsDisabled = true;
                editorReadOnly = true;
                break;

            default:
                 console.error("Invalid uiState during UI update:", this.uiState);
                 // Keep defaults (disabled) in case of error
                 readyButtonText = "Error";
                 break;
        }

        // Apply UI changes
        if (readyButton) {
            readyButton.textContent = readyButtonText;
            readyButton.style.backgroundColor = readyButtonColor;
            readyButton.disabled = readyButtonDisabled;
        } else { console.warn("Ready button not found during UI update."); }

        if (appearanceSelect) { appearanceSelect.disabled = inputsDisabled; }
         else { console.warn("Appearance select not found during UI update."); }

        if (playerNameInput) { playerNameInput.disabled = inputsDisabled; }
         else { console.warn("Player name input not found during UI update."); }

        if (sampleCodeSelect) { sampleCodeSelect.disabled = inputsDisabled; }
         else { console.warn("Sample code select not found during UI update."); }

        if (resetButton) { resetButton.disabled = inputsDisabled; } // Reset follows other inputs now
         else { console.warn("Reset button not found during UI update."); }

        try {
            if (editorIsAvailable) {
                editor.setOption("readOnly", editorReadOnly);
            } else if (this.uiState !== 'lobby') { // Only warn if editor should be RO but isn't available
                 // console.warn("CodeMirror editor not available for readOnly update."); // Can be noisy
            }
        } catch (e) {
             console.error("Error setting CodeMirror readOnly option:", e);
        }


        // console.log(`UI Updated for state: ${this.uiState}. Inputs Disabled: ${inputsDisabled}, Ready Button Disabled: ${readyButtonDisabled}`); // Debug log
    }


    /**
     * Sets up event listeners for UI elements like buttons and selects.
     */
    setupEventListeners() {
        // Get references to the DOM elements
        const readyButton = document.getElementById('btn-ready');
        const resetButton = document.getElementById('btn-reset');
        const sampleCodeSelect = document.getElementById('sample-code');
        const appearanceSelect = document.getElementById('robot-appearance-select');
        const playerNameInput = document.getElementById('playerName');

        // Check if elements exist to prevent errors
        if (!readyButton || !resetButton || !sampleCodeSelect || !appearanceSelect || !playerNameInput) {
            console.error("One or more control elements (button#btn-ready, select, player name input) not found in the DOM!");
            return; // Stop setup if elements are missing
        }

        // --- Ready/Unready Button Listener ---
        readyButton.addEventListener('click', () => {
            // Check network connection first
            if (!this.network || !this.network.socket || !this.network.socket.connected) {
                 console.error("Network handler not available or not connected in Controls.");
                 alert("Not connected to server. Please check connection and refresh.");
                 return;
            }

            // Action depends on current state
            if (this.uiState === 'lobby') {
                // --- Action: Ready Up ---
                console.log('Ready Up button clicked (State: lobby)');
                const playerCode = (typeof editor !== 'undefined') ? editor.getValue() : '';
                const nameValue = playerNameInput.value.trim();
                const chosenAppearance = appearanceSelect.value || 'default';

                // Validate inputs before sending
                if (!playerCode) { alert("Code editor is empty!"); return; }
                if (!nameValue) { alert("Please enter a player name."); return; }

                // Basic name sanitization (redundant with server but good practice)
                const finalPlayerName = nameValue.substring(0, 24).replace(/<[^>]*>/g, "");
                 if (!finalPlayerName) { alert("Invalid player name."); return; }
                 playerNameInput.value = finalPlayerName; // Update input field with sanitized name

                this.savePlayerName(finalPlayerName);
                this.network.sendCodeAndAppearance(playerCode, chosenAppearance, finalPlayerName);
                this.isClientReady = true; // Set internal ready flag
                this.setState('waiting'); // Transition UI to waiting state

            } else if (this.uiState === 'waiting') {
                // --- Action: Unready ---
                console.log('Unready button clicked (State: waiting)');
                this.network.sendUnreadySignal();
                this.isClientReady = false; // Clear internal ready flag
                this.setState('lobby'); // Transition UI back to lobby state
            } else {
                 // Button should be disabled in playing/spectating states, but log if clicked somehow
                 console.warn(`Ready button clicked in unexpected/disabled state: ${this.uiState}. Ignoring.`);
            }
        });

        // --- Reset Button Listener ---
        resetButton.addEventListener('click', () => {
            // Only allow reset in lobby state
            if (this.uiState !== 'lobby') {
                 console.warn(`Reset clicked in non-lobby state: ${this.uiState}. Ignoring.`);
                 return;
            }
            console.log('Reset button clicked (State: lobby)');
            // No need to send unready signal to server if already in lobby state

            // Clear the local canvas presentation
            if (this.game && this.game.arena && typeof this.game.arena.clear === 'function') {
                this.game.arena.clear(); // Clears and draws background/grid
            }

            // Reset robot stats display locally
            if (window.dashboard && typeof window.dashboard.updateStats === 'function') {
                 window.dashboard.updateStats([], {}); // Clear stats panel with empty context
            }

             // Notify user in log
             if (typeof window.addEventLogMessage === 'function') {
                 window.addEventLogMessage('UI reset.', 'info');
             }
             // Optionally clear code editor or reset to default?
             // if (typeof editor !== 'undefined') editor.setValue('// Reset Code...');
        });

        // --- Sample Code Loader Listener ---
        sampleCodeSelect.addEventListener('change', function() { // Using function for 'this' context
            // Only allow loading in lobby state
            if (this.uiState !== 'lobby') {
                 console.warn(`Sample code change attempt in non-lobby state: ${this.uiState}. Ignoring.`);
                 this.value = ''; // Reset dropdown to default option
                 return;
            }

            const sample = this.value;
            // Check if the loadSampleCode function exists (defined in editor.js)
            if (sample && typeof loadSampleCode === 'function') {
                loadSampleCode(sample);
                // Log that sample was loaded
                 if (typeof window.addEventLogMessage === 'function') {
                     window.addEventLogMessage(`Loaded sample code: ${sample}`, 'info');
                 }
                 // Reset dropdown back to default after loading to avoid confusion
                 // this.value = ''; // Optional: reset select after loading
            } else if (!sample) {
                // User selected the "Load Sample Code..." option, do nothing.
            } else {
                 console.error("loadSampleCode function not found!");
            }
        }.bind(this)); // Bind 'this' to access Controls instance state

        // --- Player Name Persistence Listener ---
        // Save name when the input loses focus
        playerNameInput.addEventListener('blur', () => {
            // Only allow editing/saving in lobby state
            if (this.uiState === 'lobby') {
                const nameValue = playerNameInput.value.trim();
                // Sanitize again on blur
                const finalPlayerName = nameValue.substring(0, 24).replace(/<[^>]*>/g, "");
                playerNameInput.value = finalPlayerName; // Update field with sanitized version
                this.savePlayerName(finalPlayerName);
            }
        });

        // Also save on Enter press in name field
         playerNameInput.addEventListener('keypress', (event) => {
             if (event.key === 'Enter') {
                  // Only process if in lobby state
                 if (this.uiState === 'lobby') {
                     event.preventDefault(); // Prevent potential form submission
                     playerNameInput.blur(); // Trigger the blur event to save
                 }
             }
         });

    } // End setupEventListeners


    // --- The methods setReadyState, setPlayingState, setSpectatingState ---
    // --- have been REMOVED. Use controls.setState('lobby' | 'waiting' | 'playing' | 'spectating') ---
    // --- from game.js or other relevant places. ---


    /**
     * Saves the player name to localStorage.
     * @param {string} name - The name to save.
     */
    savePlayerName(name) {
        if (typeof localStorage !== 'undefined') {
            // Avoid saving empty string or just whitespace
            const trimmedName = name ? name.trim() : '';
            if (trimmedName) {
                localStorage.setItem('robotWarsPlayerName', trimmedName);
                 // console.log(`Saved name: ${trimmedName}`); // Debug log
            } else {
                // Clear if name is effectively empty
                 localStorage.removeItem('robotWarsPlayerName');
                 // console.log("Cleared saved name."); // Debug log
            }
        }
    }

    /**
     * Loads the player name from localStorage and populates the input field.
     * Sanitizes the loaded name.
     */
    loadPlayerName() {
        const playerNameInput = document.getElementById('playerName');
        if (playerNameInput && typeof localStorage !== 'undefined') {
            const savedName = localStorage.getItem('robotWarsPlayerName');
            if (savedName) {
                // Sanitize loaded name just in case it was manipulated
                 const finalPlayerName = savedName.substring(0, 24).replace(/<[^>]*>/g, "");
                playerNameInput.value = finalPlayerName;
                console.log('Player name loaded:', finalPlayerName);
            } else {
                 console.log('No player name found in localStorage.');
            }
        }
    }

} // End Controls Class

// The DOMContentLoaded listener for initialization is in main.js
```

## client/js/ui/dashboard.js

```code
// client/js/ui/dashboard.js

/**
 * Dashboard UI handler for Robot Wars
 * Manages the stats panel display.
 */
class Dashboard {
    constructor() {
        this.statsPanel = document.getElementById('robot-stats');
        this.gameTitleElement = null; // Element to display game name (optional)
        this.statsContainer = null; // Container for the actual robot stats divs

        // Try to find/create a title element and stats container within the panel
        this.createLayoutElements();

        if (!this.statsPanel) {
            console.error("Dashboard stats panel element '#robot-stats' not found!");
        } else {
            console.log('Dashboard initialized');
        }
    }

    /** Create or find the elements for title and stats list */
    createLayoutElements() {
        if (!this.statsPanel) return;

        // Title Element
        this.gameTitleElement = document.getElementById('dashboard-game-title');
        if (!this.gameTitleElement) {
            this.gameTitleElement = document.createElement('div');
            this.gameTitleElement.id = 'dashboard-game-title';
            // Style the title element (adjust as needed)
            this.gameTitleElement.style.fontWeight = 'bold';
            this.gameTitleElement.style.marginBottom = '10px';
            this.gameTitleElement.style.paddingBottom = '5px';
            this.gameTitleElement.style.borderBottom = '1px solid #555';
            this.gameTitleElement.style.color = '#4CAF50'; // Match theme accent
            this.gameTitleElement.style.fontFamily = "'VT323', monospace"; // Use retro font
            this.gameTitleElement.style.fontSize = '18px'; // Adjust size
            this.gameTitleElement.style.display = 'none'; // Hidden initially
            // Prepend it to the stats panel
            this.statsPanel.insertBefore(this.gameTitleElement, this.statsPanel.firstChild);
        }

        // Stats Container Element
        this.statsContainer = document.getElementById('robot-stats-list');
        if (!this.statsContainer) {
            this.statsContainer = document.createElement('div');
            this.statsContainer.id = 'robot-stats-list';
            // Append it after the title (or as the only child if title failed)
            this.statsPanel.appendChild(this.statsContainer);
        }
    }

    /**
     * Update robot stats display based on the provided robot data.
     * @param {Array<object>} robots - Array of robot data objects received from the server state.
     *                                  Each object should have id, name, damage, color, isAlive.
     * @param {object} [context={}] - Optional context object (e.g., { gameName }).
     */
    updateStats(robots, context = {}) {
        // Ensure container exists
        if (!this.statsContainer) {
            console.warn("Stats container not found in dashboard.");
            return;
        }

        // Update Game Title display
        if (this.gameTitleElement) {
            const showTitle = context.gameName && robots && robots.length > 0;
            this.gameTitleElement.textContent = showTitle ? `Stats for: ${context.gameName}` : '';
            this.gameTitleElement.style.display = showTitle ? '' : 'none';
        }

        // Clear previous stats from the container
        this.statsContainer.innerHTML = ''; // Simple way to clear children

        // Guard against invalid input
        if (!Array.isArray(robots)) {
            const noDataDiv = document.createElement('div');
            noDataDiv.textContent = 'Invalid robot data received.';
            this.statsContainer.appendChild(noDataDiv);
            return;
        }

        // --- Efficient DOM Update ---
        // Use a fragment to minimize reflows when adding multiple stats
        const fragment = document.createDocumentFragment();

        if (robots.length === 0) {
            const waitingDiv = document.createElement('div');
            waitingDiv.textContent = context.gameName ? 'Game ended or no robots active.' : 'Waiting for game to start...';
            fragment.appendChild(waitingDiv);
        } else {
            robots.forEach(robot => {
                // Default values and checks for robustness
                const damageValue = (typeof robot.damage === 'number') ? robot.damage : 100;
                const isAlive = robot.isAlive !== undefined ? robot.isAlive : (damageValue < 100);

                const status = isAlive ? 'Active' : 'Destroyed';
                const statusColor = isAlive ? '#2ecc71' : '#e74c3c';

                let robotIdDisplay = '????';
                if (robot.id && typeof robot.id === 'string') {
                    robotIdDisplay = robot.id.substring(0, 4);
                }
                const robotName = robot.name || `ID: ${robotIdDisplay}...`;

                const damageDisplay = (typeof robot.damage === 'number') ? robot.damage.toFixed(0) : 'N/A';

                // Create elements for this robot's stats
                const statDiv = document.createElement('div');
                statDiv.className = 'robot-stat'; // Add class for potential CSS styling
                statDiv.style.borderLeft = `3px solid ${robot.color || '#888'}`;
                statDiv.style.marginBottom = '10px';
                statDiv.style.padding = '5px';
                // Ensure consistent font for stats
                statDiv.style.fontFamily = "'VT323', monospace";
                statDiv.style.fontSize = '16px'; // Adjust as needed

                const nameDiv = document.createElement('div');
                const nameStrong = document.createElement('strong');
                nameStrong.textContent = robotName;
                nameDiv.appendChild(nameStrong);

                const damageDiv = document.createElement('div');
                damageDiv.textContent = `Damage: ${damageDisplay}%`;

                const statusDiv = document.createElement('div');
                const statusSpan = document.createElement('span');
                statusSpan.style.color = statusColor;
                statusSpan.textContent = status;
                statusDiv.appendChild(document.createTextNode('Status: '));
                statusDiv.appendChild(statusSpan);

                statDiv.appendChild(nameDiv);
                statDiv.appendChild(damageDiv);
                statDiv.appendChild(statusDiv);

                fragment.appendChild(statDiv);
            });
        }

        // Append the fragment containing new stats to the dedicated container
        this.statsContainer.appendChild(fragment);
    }
}

// Initialize dashboard when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the dashboard object is created and attached to window for global access
    window.dashboard = new Dashboard();
    // Clear stats initially or show a waiting message
    if(window.dashboard) {
         window.dashboard.updateStats([], {}); // Pass empty array and context
    }
});
```

## client/js/ui/history.js

```code
// client/js/ui/history.js

/**
 * Updates the game history log display on the page.
 * @param {Array<object>} historyArray - An array of completed game objects from the server,
 *                                      expected format: [{name, winnerName, players, endTime}, ...]
 *                                      (Assumed to be sorted newest first by the server)
 */
function updateGameHistory(historyArray) {
    const historyListElement = document.getElementById('game-history-list');

    if (!historyListElement) {
        console.warn("Game history list element '#game-history-list' not found.");
        return;
    }

    // Clear previous history entries
    historyListElement.innerHTML = '';

    if (!Array.isArray(historyArray) || historyArray.length === 0) {
        const noHistoryDiv = document.createElement('div');
        noHistoryDiv.textContent = 'No games finished yet.';
        historyListElement.appendChild(noHistoryDiv);
        return;
    }

    // Use a document fragment for potentially better performance
    const fragment = document.createDocumentFragment();

    historyArray.forEach(gameResult => {
        const entryDiv = document.createElement('div');
        // Format the output string
        const winnerText = gameResult.winnerName ? gameResult.winnerName : 'None';
        entryDiv.textContent = `Game '${gameResult.name || 'Unknown'}' finished. Winner: ${winnerText}`;
        // You could add more details here, like players involved, using gameResult.players

        fragment.appendChild(entryDiv);
    });

    // Append the populated fragment to the list element
    historyListElement.appendChild(fragment);
}

// Make the function globally accessible
window.updateGameHistory = updateGameHistory;

console.log("History UI functions initialized (history.js).");

// Initial clear or placeholder (optional, CSS handles initial state)
// document.addEventListener('DOMContentLoaded', () => {
//     updateGameHistory([]); // Clear on load
// });
```

## client/js/ui/editor.js

```code
// client/js/ui/editor.js

let editor;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize CodeMirror editor
    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'javascript',
        theme: 'monokai',
        lineNumbers: true,
        indentUnit: 4,
        autoCloseBrackets: true,
        matchBrackets: true
    });

    // Set default code using the correct pattern for temporary variables
    editor.setValue(`// Your Robot AI Code using the 'state' object
// This object persists between game ticks.

// Initialize persistent state variables ONCE
if (typeof state.myDirection === 'undefined') {
    state.myDirection = 0;
    state.lastDamage = 0; // Track damage from previous tick
    console.log('Robot state initialized.');
}

// --- Logic using state variables ---

// Change direction slightly each time damage increases
if (robot.damage() > state.lastDamage) {
    console.log('Ouch! Changing direction.');
    state.myDirection = (state.myDirection + 90) % 360;
}
// Update last known damage *after* checking
state.lastDamage = robot.damage();

// Drive in the current direction
robot.drive(state.myDirection, 3);

// Scan for enemies - Use 'let' for variable recalculated each tick
let scanResult = robot.scan(state.myDirection, 30);

// If enemy detected, fire
if (scanResult) {
    console.log("Enemy detected at distance: " + scanResult.distance);
    robot.fire(scanResult.direction, 2);
}
`);

    // Load sample code listener
    document.getElementById('sample-code').addEventListener('change', function() {
        const sample = this.value;
        if (sample) {
            loadSampleCode(sample);
        }
    });
});

function loadSampleCode(sampleName) {
    let code = '';

    switch (sampleName) {
        case 'simple-tank':
            // This one was likely okay, but let's ensure 'scanResult' uses 'let'
            code = `// Simple Tank Bot (using state object)
// Moves in a straight line until hit, then changes direction

// Initialize state ONCE
if (typeof state.currentDirection === 'undefined') {
    state.currentDirection = 0;
    state.lastDamage = 0; // Track damage from previous tick
    console.log('Simple Tank Initialized');
}

// Check if damage increased since last tick
if (robot.damage() > state.lastDamage) {
    console.log('Tank hit! Changing direction.');
    state.currentDirection = (state.currentDirection + 90 + Math.random() * 90) % 360;
}
state.lastDamage = robot.damage(); // Update damage tracking

// Move forward
robot.drive(state.currentDirection, 3);

// Scan for enemies - use 'let' for temporary variable
let scanResult = robot.scan(state.currentDirection, 45);

// Fire if enemy detected
if (scanResult) {
    robot.fire(scanResult.direction, 2);
}`; // Removed extra closing brace that wasn't needed
            break;

        case 'scanner-bot':
            // This was the one causing the error in the screenshot
            code = `// Scanner Bot (using state object)
// Constantly rotates scanner and moves/fires if enemy found

// Initialize state ONCE
if (typeof state.scanAngle === 'undefined') {
    state.scanAngle = 0;
    console.log('Scanner Bot Initialized');
}

// Rotate scan angle
state.scanAngle = (state.scanAngle + 5) % 360;

// Scan for enemies - Use 'let' because it's recalculated each tick
let scanResult = robot.scan(state.scanAngle, 20);

// If enemy detected, move toward it and fire
if (scanResult) {
    robot.drive(scanResult.direction, 3);
    robot.fire(scanResult.direction, 3);
} else {
    // If no enemy, keep rotating but move slowly forward
    robot.drive(state.scanAngle, 1);
}`;
            break;

        case 'aggressive-bot':
             // This one correctly declared scanResult inside 'if' blocks, so it was okay.
             // No changes needed here, but adding it for completeness.
             code = `// Aggressive Bot (using state object)
// Seeks out enemies and fires continuously

// Initialize state ONCE
if (typeof state.targetDirection === 'undefined') {
    state.targetDirection = null;
    state.searchDirection = 0;
    state.searchMode = true;
    state.timeSinceScan = 0;
    console.log('Aggressive Bot Initialized');
}

state.timeSinceScan++;

// If we have a target, track and fire
if (!state.searchMode && state.targetDirection !== null) {
    if (state.timeSinceScan > 5) {
        // scanResult is correctly scoped here with 'const'
        const scanResult = robot.scan(state.targetDirection, 15);
        state.timeSinceScan = 0;

        if (scanResult) {
            state.targetDirection = scanResult.direction;
        } else {
            console.log('Aggro Bot lost target, returning to search.');
            state.searchMode = true;
            state.targetDirection = null;
        }
    }
    if (state.targetDirection !== null) {
        robot.drive(state.targetDirection, 4);
        robot.fire(state.targetDirection, 3);
    }

} else { // In search mode
    if (state.timeSinceScan > 2) {
        state.searchDirection = (state.searchDirection + 15) % 360;
        // scanResult is correctly scoped here with 'const'
        const scanResult = robot.scan(state.searchDirection, 30);
        state.timeSinceScan = 0;

        if (scanResult) {
            console.log('Aggro Bot found target!');
            state.targetDirection = scanResult.direction;
            state.searchMode = false;
            robot.drive(state.targetDirection, 4);
            robot.fire(state.targetDirection, 3);
        } else {
            robot.drive(state.searchDirection, 1);
        }
    } else {
         robot.drive(state.searchDirection, 1);
    }
}`;
            break;
    }

    if (code) {
        editor.setValue(code);
    }
}
```

## client/js/ui/lobby.js

```code
// client/js/ui/lobby.js

const MAX_LOG_MESSAGES = 50; // Keep the log from getting too long

/**
 * Updates the text content of the lobby status display.
 * @param {string} statusText - The text to display.
 */
function updateLobbyStatus(statusText) {
    const statusElement = document.getElementById('lobby-status');
    if (statusElement) {
        statusElement.textContent = statusText;
    } else {
        console.warn("Lobby status element '#lobby-status' not found.");
    }
}

/**
 * Adds a message to the event log display. Handles scrolling.
 * @param {string} message - The message text to add.
 * @param {string} [type='info'] - The type of message ('info', 'chat', 'event', 'error'). Used for potential styling.
 */
function addEventLogMessage(message, type = 'info') {
    const logElement = document.getElementById('event-log');
    if (!logElement) {
        console.warn("Event log element '#event-log' not found.");
        return;
    }

    const wasScrolledToBottom = logElement.scrollHeight - logElement.clientHeight <= logElement.scrollTop + 1;

    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;

    // Add styling based on type (optional)
    messageDiv.style.marginBottom = '3px';
    messageDiv.style.wordWrap = 'break-word'; // Prevent long messages overflowing
    switch (type) {
        case 'chat':
            messageDiv.style.color = '#FFF'; // White for chat
            break;
        case 'event':
            messageDiv.style.color = '#87CEEB'; // Sky blue for events
            break;
        case 'error':
            messageDiv.style.color = '#FF6347'; // Tomato red for errors
            break;
        case 'info':
        default:
            messageDiv.style.color = '#90EE90'; // Light green for general info
            break;
    }

    logElement.appendChild(messageDiv);

    // Remove old messages if log is too long
    while (logElement.childNodes.length > MAX_LOG_MESSAGES) {
        logElement.removeChild(logElement.firstChild);
    }

    // Auto-scroll to bottom if already scrolled to bottom
    if (wasScrolledToBottom) {
        logElement.scrollTop = logElement.scrollHeight;
    }
}

/**
 * Clears all messages from the event log.
 */
function clearEventLog() {
     const logElement = document.getElementById('event-log');
     if (logElement) {
         logElement.innerHTML = ''; // Clear content
         addEventLogMessage("Log cleared.", "info");
     }
}


// --- Make functions globally accessible (simple approach) ---
// This allows network.js to call them easily without complex imports/exports yet
window.updateLobbyStatus = updateLobbyStatus;
window.addEventLogMessage = addEventLogMessage;
window.clearEventLog = clearEventLog; // Optional clear function


// --- Initialize Chat Input/Button Listeners ---
// (We'll put chat logic here too for simplicity)
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-chat');

    if (!chatInput || !sendButton) {
        console.warn("Chat input or send button not found.");
        return;
    }

    // Send on button click
    sendButton.addEventListener('click', sendChatMessageFromInput);

    // Send on Enter key press in input field
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission (if any)
            sendChatMessageFromInput();
        }
    });

    function sendChatMessageFromInput() {
        const messageText = chatInput.value;
        if (messageText.trim() && typeof network !== 'undefined' && network.sendChatMessage) {
            network.sendChatMessage(messageText); // Assumes global 'network' object exists
            chatInput.value = ''; // Clear input field after sending
        }
         chatInput.focus(); // Keep focus on input
    }

    // Clear placeholder text on initial load
    const logElement = document.getElementById('event-log');
    if(logElement && logElement.textContent === 'Event Log Loading...') {
         logElement.textContent = ''; // Clear loading text
         addEventLogMessage("Welcome! Connect to chat and wait for players...", "info");
    }
});

console.log("Lobby UI functions initialized (lobby.js).");
```

## client/js/main.js

```code
// client/js/main.js

/**
 * Main entry point for the Robot Wars client application.
 * Initializes all necessary components after the DOM is loaded.
 */

// Declare variables in the global scope for potential debugging access,
// but initialization happens within DOMContentLoaded.
let game;
let controls;
let network;
// Note: The Dashboard object is initialized within dashboard.js and
// typically accessed via the global `window.dashboard`.

// Wait for the HTML document structure to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded, initializing game components...');

    try {
        // 1. Initialize the Game engine object
        //    (Handles rendering and holds client-side state representation)
        game = new Game('arena'); // 'arena' is the ID of the canvas element

        // 2. Initialize the Network handler
        //    (Manages WebSocket connection and communication with the server)
        network = new Network(game); // Pass the game instance to the network handler

        // 3. Establish connection to the server
        network.connect(); // Initiates the Socket.IO connection

        // 4. Initialize the Controls handler
        //    (Manages button interactions and sends user actions via the network)
        controls = new Controls(game, network); // Pass both game and network instances

        // 5. Perform initial drawing
        //    Draw the static elements like the grid. The actual game elements (robots)
        //    will be drawn once the game starts and state is received from the server.
        if (game && game.arena) {
            game.arena.drawGrid();
        } else {
            console.error("Failed to draw initial grid: Game or Arena object not found.");
        }

        // 6. Initialization Complete
        console.log('Game, Network, and Controls initialized successfully.');
        console.log('Waiting for server connection and game start signal...');

        // Note: The Dashboard (window.dashboard) should have been initialized
        // by its own script (js/ui/dashboard.js) also listening for DOMContentLoaded.
        if (!window.dashboard) {
            console.warn('Dashboard object (window.dashboard) not found. Stats panel might not update.');
        }

    } catch (error) {
        console.error("An error occurred during initialization:", error);
        alert("Failed to initialize the game client. Check the console for details.");
    }
});

// No other code should be outside the DOMContentLoaded listener
// unless it's helper functions or class definitions intended for global scope (which is rare).
```

## client/js/network.js

```code
// client/js/network.js

/**
 * Handles client-side network communication with the server using Socket.IO.
 * Connects to the server, sends player data (including name), readiness signals,
 * receives game state updates, handles spectating, processes lobby/chat events,
 * and receives game history updates. // <-- Updated description
 */
class Network {
    /**
     * Creates a Network instance.
     * @param {Game} game - Reference to the main client-side game object.
     */
    constructor(game) {
        this.socket = null; // Will hold the Socket.IO socket instance
        this.playerId = null; // This client's unique ID assigned by the server
        this.game = game; // Reference to the main game object to pass updates
        // --- Spectator State ---
        this.isSpectating = false;
        this.spectatingGameId = null;
        this.spectatingGameName = null; // Store name for display
        // --- End Spectator State ---
        if (!this.game) {
            console.error("Network handler initialized without a valid game reference!");
        }
    }

    /**
     * Establishes the WebSocket connection to the server and sets up event listeners.
     */
    connect() {
        try {
            // Connect to the Socket.io server. Assumes server is on the same host/port.
            // Added reconnection options for robustness
            this.socket = io({
                 reconnectionAttempts: 5, // Try to reconnect 5 times
                 reconnectionDelay: 1000, // Start with 1 second delay
                 reconnectionDelayMax: 5000 // Max delay 5 seconds
            });

            // --- Socket.IO Event Listeners ---

            // On successful connection/reconnection
            this.socket.on('connect', () => {
                console.log('Successfully connected/reconnected to server with Socket ID:', this.socket.id);
                // Reset spectator state on fresh connect (server will tell us if we should spectate)
                this.isSpectating = false;
                this.spectatingGameId = null;
                this.spectatingGameName = null;

                // Reset Controls UI to lobby state upon successful connection
                if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
                    controls.setState('lobby');
                } else {
                    console.warn("Controls object or setState not found on connect, UI might be incorrect.");
                }

                // Notify UI about connection status - Lobby/Spectate status will be updated by subsequent events
                 if (typeof window.updateLobbyStatus === 'function') {
                     window.updateLobbyStatus('Connected. Waiting for server info...');
                 }
                 if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage("--> Connected to server.", "event");
                 }
            });

            // On disconnection from the server
            this.socket.on('disconnect', (reason) => {
                console.warn('Disconnected from server:', reason);
                 // Stop rendering if game or spectating was active
                if (this.game) {
                    this.game.stop();
                }
                // Reset spectator state
                this.isSpectating = false;
                this.spectatingGameId = null;
                this.spectatingGameName = null;

                // Attempt to reset controls UI state (though it might be disabled on reconnect anyway)
                 if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
                     controls.setState('lobby'); // Attempt reset to lobby visually
                 }

                // Update UI
                 if (typeof window.updateLobbyStatus === 'function') {
                     window.updateLobbyStatus(`Disconnected: ${reason}. Reconnecting...`);
                 }
                 if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`Disconnected: ${reason}. Attempting to reconnect...`, "error");
                 }
            });

            // Server assigns a unique ID to this client
            this.socket.on('assignId', (id) => {
                console.log('Server assigned Player ID:', id);
                this.playerId = id;
                if (this.game && typeof this.game.setPlayerId === 'function') {
                    this.game.setPlayerId(id);
                }
                 // After getting ID, if not spectating, prompt for Ready Up
                 if (!this.isSpectating && typeof window.updateLobbyStatus === 'function') {
                      // Check if UI is currently in the lobby state
                      if (typeof controls !== 'undefined' && controls.uiState === 'lobby') {
                         window.updateLobbyStatus('Enter name & code, then Ready Up!');
                      }
                 }
            });

             // --- START Spectator Event Handlers ---
            this.socket.on('spectateStart', (data) => {
                console.log('Received spectateStart:', data);
                if (this.game && typeof this.game.handleSpectateStart === 'function') {
                    this.isSpectating = true; // Set state BEFORE calling handler
                    this.spectatingGameId = data.gameId;
                    this.spectatingGameName = data.gameName || data.gameId; // Store name
                    this.game.handleSpectateStart(data); // Pass game info to game handler
                    if (typeof window.addEventLogMessage === 'function') {
                        window.addEventLogMessage(`Started spectating game: ${this.spectatingGameName}`, 'event');
                    }
                } else {
                    console.error("Game object or handleSpectateStart method not available!");
                }
            });

            this.socket.on('spectateGameOver', (data) => {
                console.log('Received spectateGameOver:', data);
                 // Check if we are actually spectating the game that ended
                if (this.isSpectating && this.spectatingGameId === data.gameId) {
                     if (this.game && typeof this.game.handleSpectateEnd === 'function') {
                         this.game.handleSpectateEnd(data); // Pass winner info etc.
                         if (typeof window.addEventLogMessage === 'function') {
                             const endedGameName = this.spectatingGameName || data.gameId; // Use stored name
                             window.addEventLogMessage(`Spectated game '${endedGameName}' over! Winner: ${data.winnerName || 'None'}`, 'event');
                         }
                     } else {
                         console.error("Game object or handleSpectateEnd method not available!");
                     }
                     // Reset spectator state AFTER calling handler
                     this.isSpectating = false;
                     this.spectatingGameId = null;
                     this.spectatingGameName = null;
                 } else {
                    console.log(`Received spectateGameOver for irrelevant game ${data.gameId}. Current spectate: ${this.spectatingGameId}. Ignoring.`);
                 }
            });
            // --- END Spectator Event Handlers ---

            // Receives game state updates from the server during the match OR while spectating
            this.socket.on('gameStateUpdate', (gameState) => {
                // Update game state whether playing or spectating
                if (this.game && typeof this.game.updateFromServer === 'function') {
                     // Determine the relevant game ID based on current state
                     const relevantGameId = this.isSpectating ? this.spectatingGameId : this.game.gameId;
                     if (relevantGameId && relevantGameId === gameState.gameId) {
                        this.game.updateFromServer(gameState);
                     } else {
                         // This can happen briefly during transitions, usually safe to ignore.
                         // console.log(`Received gameStateUpdate for irrelevant game ${gameState.gameId}`);
                     }
                }
            });

            // Server signals that the game is starting (for players)
            this.socket.on('gameStart', (data) => {
                 // Ignore if spectating
                 if (this.isSpectating) {
                     console.log("Received gameStart while spectating, ignoring.");
                     return;
                 }
                 if (this.game && typeof this.game.handleGameStart === 'function') {
                     // State check inside handler is safer if events race
                     this.game.handleGameStart(data); // This will update gameId and gameName
                 }
                 // Update lobby status - Game class handleGameStart should update button text now
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus(`Playing Game: ${data.gameName || data.gameId}`);
                 if (typeof window.addEventLogMessage === 'function') {
                     window.addEventLogMessage(`Your game '${data.gameName || data.gameId}' is starting!`, 'event');
                 }
             });

            // Server signals that the game has ended (for players)
             this.socket.on('gameOver', (data) => {
                 // Ignore if spectating
                 if (this.isSpectating) {
                     console.log("Received gameOver while spectating, ignoring (expecting spectateGameOver).");
                     return;
                 }

                 // Check if this gameOver matches the game we *think* we are playing
                 if (this.game && this.game.gameId === data.gameId) {
                     if (typeof this.game.handleGameOver === 'function') {
                         this.game.handleGameOver(data); // This should reset controls UI state
                     }
                     // Update lobby status after game over
                     if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Game Over. Ready Up for another match!');
                      if (typeof window.addEventLogMessage === 'function') {
                         const endedGameName = this.game.gameName || data.gameId;
                         window.addEventLogMessage(`Your game '${endedGameName}' finished! Winner: ${data.winnerName || 'None'}`, 'event');
                     }
                 } else {
                      console.warn(`Received gameOver for game ${data.gameId}, but current game is ${this.game ? this.game.gameId : 'None'}. Ignoring.`);
                 }
             });

            // Server reports an error in the robot's code (compilation or runtime)
            this.socket.on('codeError', (data) => {
                console.error(`Received Code Error for Robot ${data.robotId}:`, data.message);
                if (typeof window.addEventLogMessage === 'function') {
                    const robotIdentifier = (data.robotId === this.playerId) ? "Your Robot" : `Robot ${data.robotId.substring(0,4)}...`;
                    window.addEventLogMessage(`Code Error (${robotIdentifier}): ${data.message}`, 'error');
                }
                // Display error and reset UI only if it's our robot AND we are not spectating
                if (data.robotId === this.playerId && !this.isSpectating) {
                     alert(`Your Robot Code Error:\n${data.message}\n\nYou might need to reset and fix your code.`);
                     // Reset Controls UI to lobby state
                     if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
                         controls.setState('lobby');
                     }
                     if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Code error detected. Please fix and Ready Up again.');
                 }
            });

             // Server reports a critical game error (e.g., during tick)
             this.socket.on('gameError', (data) => {
                 console.error("Received critical game error from server:", data);
                 alert(`A critical error occurred in the game: ${data.message}\nThe game may have ended.`);
                 if (typeof window.addEventLogMessage === 'function') {
                     window.addEventLogMessage(`SERVER GAME ERROR: ${data.message}`, 'error');
                 }
                  // Assume game is over, reset UI state if playing (spectators handle via spectateGameOver implicitly)
                 if (!this.isSpectating && typeof controls !== 'undefined' && typeof controls.setState === 'function') {
                     controls.setState('lobby'); // Reset to lobby state
                 }
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Game Error Occurred. Ready Up again.');
                  if (this.game) this.game.stop(); // Stop rendering
             });


            // Handle connection errors (e.g., server is down initially)
            this.socket.on('connect_error', (err) => {
                console.error("Connection Error:", err.message, err);
                 if (typeof window.updateLobbyStatus === 'function') {
                     window.updateLobbyStatus(`Connection Failed: ${err.message}`);
                 }
                 if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`Connection Error: ${err.message}. Retrying...`, 'error');
                 }
                // Reset UI elements if connection fails initially
                 if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
                     controls.setState('lobby');
                 }
            });

            // Handle failed reconnection attempts
             this.socket.on('reconnect_failed', () => {
                 console.error('Reconnection failed after multiple attempts.');
                 if (typeof window.updateLobbyStatus === 'function') {
                     window.updateLobbyStatus('Connection Failed Permanently. Please refresh.');
                 }
                 if (typeof window.addEventLogMessage === 'function') {
                     window.addEventLogMessage('Could not reconnect to the server. Please refresh the page.', 'error');
                 }
                 alert('Failed to reconnect to the server. Please refresh the page.');
             });


            // --- Lobby/Chat/History Event Listeners ---
            this.socket.on('lobbyEvent', (data) => {
                if (data && data.message && typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(data.message, data.type || 'event');
                }
            });

            this.socket.on('lobbyStatusUpdate', (data) => {
                // Do not update lobby status text if playing or spectating (those modes have different status texts)
                 // Check controls state instead of game.running directly
                 const isIdle = typeof controls !== 'undefined' && (controls.uiState === 'lobby' || controls.uiState === 'waiting');

                if (isIdle && data && typeof window.updateLobbyStatus === 'function') {
                    let statusText = `Waiting: ${data.waiting !== undefined ? data.waiting : 'N/A'}`;
                    if (data.ready !== undefined) {
                        statusText += ` / Ready: ${data.ready}/2`;
                    }
                     window.updateLobbyStatus(statusText);
                }
            });

            this.socket.on('chatUpdate', (data) => {
                if (data && data.sender && data.text && typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`${data.sender}: ${data.text}`, 'chat');
                }
            });

            // --- Game History Listener ---
            this.socket.on('gameHistoryUpdate', (historyData) => {
                // console.log('Received game history update:', historyData); // Debug log
                if (typeof window.updateGameHistory === 'function') {
                    window.updateGameHistory(historyData);
                } else {
                    console.warn("updateGameHistory function not found!");
                }
            });
            // --- End Game History Listener ---

            // --- End Lobby/Chat/History Listeners ---

        } catch (error) {
             console.error("Error initializing Socket.IO connection:", error);
             if (typeof window.updateLobbyStatus === 'function') {
                 window.updateLobbyStatus('Network Initialization Error');
             }
             alert("Failed to initialize network connection. Check console for details.");
        }
    } // End connect()

    /**
     * Sends the player's robot code, chosen appearance, and name to the server.
     * Called by the Controls class when the 'Ready Up' button is clicked.
     * @param {string} code - The robot AI code written by the player.
     * @param {string} appearance - The identifier for the chosen robot appearance.
     * @param {string} name - The player's chosen name.
     */
    sendCodeAndAppearance(code, appearance, name) {
        // This check relies on the controls state machine now
        // Allow if state is 'lobby'
        const canSend = typeof controls !== 'undefined' && controls.uiState === 'lobby';

        if (!canSend) {
             console.warn("Attempted to send player data while not in 'lobby' state. Ignoring.");
             if(typeof window.addEventLogMessage === 'function') {
                 window.addEventLogMessage("Cannot ready up now.", "error");
             }
             return;
        }

        // Ensure the socket exists and is connected
        if (!this.socket || !this.socket.connected) {
             console.error("Socket not available or not connected. Cannot send player data.");
             alert("Not connected to server. Please check connection and try again.");
             // Controls state should revert via disconnect/connect_error handlers if needed
             return;
        }

        console.log(`Sending player data to server: { name: '${name}', appearance: '${appearance}', code: ... }`);
        this.socket.emit('submitPlayerData', {
             code: code,
             appearance: appearance,
             name: name
        });
    }

    /**
     * Sends a signal to the server indicating the player is no longer ready.
     * Called by the Controls class when the 'Unready' button is clicked.
     */
    sendUnreadySignal() {
         // This check relies on the controls state machine now
         // Allow if state is 'waiting'
         const canSend = typeof controls !== 'undefined' && controls.uiState === 'waiting';

         if (!canSend) {
             console.warn("Attempted to send unready signal while not in 'waiting' state. Ignoring.");
              if(typeof window.addEventLogMessage === 'function') {
                 window.addEventLogMessage("Cannot unready now.", "error");
             }
             return;
         }

        if (!this.socket || !this.socket.connected) {
            console.error("Socket not connected. Cannot send unready signal.");
            if(typeof window.addEventLogMessage === 'function') {
                window.addEventLogMessage("Cannot unready: Not connected.", "error");
            }
            // Controls state should revert via disconnect/connect_error handlers if needed
            return;
        }
        console.log("Sending 'playerUnready' signal to server.");
        this.socket.emit('playerUnready');
    }


    /**
     * Sends a chat message to the server.
     * Called by the chat UI logic in lobby.js.
     * @param {string} text - The chat message text.
     */
    sendChatMessage(text) {
        if (!this.socket || !this.socket.connected) {
            console.error("Socket not connected. Cannot send chat message.");
            if(typeof window.addEventLogMessage === 'function') {
                window.addEventLogMessage("Cannot send chat: Not connected.", "error");
            }
            return;
        }
        const trimmedText = text.trim();
        if (trimmedText) { // Only send non-empty messages
            this.socket.emit('chatMessage', { text: trimmedText });
        }
    }

} // End Network Class
```

## client/index.html

```code
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robot Wars</title>

    <!-- Google Fonts Link (Press Start 2P & VT323) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
    <!-- End Google Fonts -->

    <link rel="stylesheet" href="css/main.css">
    <!-- Code Mirror for the editor -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/theme/monokai.min.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Robot Wars</h1>
            <nav>
                <!-- Player Name Input Field -->
                <input type="text" id="playerName" placeholder="Enter Name" style="padding: 8px; border-radius: 4px; border: 1px solid #555; background: #333; color: #e0e0e0; margin-right: 5px;" maxlength="24"> <!-- Added maxlength -->
                <!-- End Player Name Input -->

                <select id="robot-appearance-select" title="Choose Robot Appearance">
                    <option value="default">Default Bot</option>
                    <option value="tank">Tank Bot</option>
                    <option value="spike">Spike Bot</option>
                    <option value="tri">Tri Bot</option>
                </select>
                <button id="btn-ready">Ready Up</button> <!-- State managed by controls.js -->
                <button id="btn-reset">Reset</button>
                <select id="sample-code">
                    <option value="">Load Sample Code...</option>
                    <option value="simple-tank">Simple Tank</option>
                    <option value="scanner-bot">Scanner Bot</option>
                    <option value="aggressive-bot">Aggressive Bot</option>
                </select>
            </nav>
        </header>

        <main>
            <div class="game-container">
                <!-- Canvas with fixed dimensions -->
                <canvas id="arena" width="600" height="600"></canvas>
                <div class="stats-panel">
                    <h3>Robot Stats</h3>
                    <!-- Dashboard elements (title, list) are created/managed by dashboard.js -->
                    <div id="robot-stats">
                        <!-- Initial placeholder content might be added by dashboard.js -->
                    </div>
                </div>
            </div>

            <div class="editor-container">
                <h3>Robot Code Editor</h3>
                <textarea id="code-editor"></textarea>
                <div class="api-help">
                    <h4>API Reference</h4>
                    <ul>
                        <li><code>drive(direction, speed)</code> - Move your robot</li>
                        <li><code>scan(angle, resolution)</code> - Scan for enemies</li>
                        <li><code>fire(direction, power)</code> - Fire a missile</li>
                        <li><code>damage()</code> - Get current damage level (0-100)</li>
                        <li><code>getX()</code> - Get current X coordinate</li>
                        <li><code>getY()</code> - Get current Y coordinate</li>
                        <li><code>getDirection()</code> - Get current direction (degrees)</li>
                    </ul>
                </div>
            </div>
        </main>

        <!-- Lobby Area - Using CSS Grid -->
        <div id="lobby-area"> <!-- style is now in main.css -->
             <div> <!-- Column 1: Status, Log, Chat -->
                 <h3 style="font-family: 'VT323', monospace; font-size: 18px; color: #4CAF50; margin-bottom: 10px;">Lobby Status</h3>
                 <div id="lobby-status" style="margin-bottom: 10px;">Connecting...</div>
                 <div id="event-log" style="height: 150px; overflow-y: scroll; border: 1px solid #555; margin-bottom: 10px; padding: 5px; background: #222; font-size: 14px; font-family: 'VT323', monospace;">Event Log Loading...</div>
                 <div id="chat-area" style="display: flex; gap: 5px;">
                     <input type="text" id="chat-input" placeholder="Enter chat message..." style="flex-grow: 1; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #2a2a2a; color: #e0e0e0; font-family: 'VT323', monospace; font-size: 14px;" maxlength="100"> <!-- Added maxlength -->
                     <button id="send-chat" style="background-color: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: 'VT323', monospace; font-size: 15px;">Send</button>
                 </div>
             </div>

             <div> <!-- Column 2: Game History -->
                 <div id="game-history-log"> <!-- Outer container for styling/header -->
                     <h4 style="font-family: 'VT323', monospace; font-size: 18px; color: #4CAF50; margin-bottom: 10px;">Recent Game Results</h4>
                     <!-- The actual list element that history.js targets -->
                     <div id="game-history-list" style="/* Styles are in main.css */">
                         <!-- History will appear here -->
                         <div>No games finished yet.</div>
                     </div>
                 </div>
             </div>
        </div>
        <!-- End Lobby Area -->

    </div> <!-- End .container -->

    <!-- Socket.IO Client Library -->
    <script src="/socket.io/socket.io.js"></script>
    <!-- CodeMirror Library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/javascript/javascript.min.js"></script>

    <!-- Game Engine Scripts -->
    <script src="js/engine/arena.js"></script>
    <script src="js/engine/game.js"></script>

    <!-- UI Component Scripts -->
    <script src="js/ui/editor.js"></script>
    <script src="js/ui/dashboard.js"></script>
    <script src="js/ui/controls.js"></script>
    <script src="js/ui/lobby.js"></script>
    <script src="js/ui/history.js"></script> <!-- History script added -->

    <!-- Network Handler Script -->
    <script src="js/network.js"></script>

    <!-- Main Application Entry Point -->
    <script src="js/main.js"></script> <!-- This should always be the last script -->
</body>
</html>
```

## server/game-instance.js

```code
// server/game-instance.js
const ServerRobot = require('./server-robot');
const ServerRobotInterpreter = require('./server-interpreter');
const ServerCollisionSystem = require('./server-collision'); // Handles collisions

// --- Game Simulation Constants ---
const TICK_RATE = 30; // Updates per second
const ARENA_WIDTH = 600; // Match canvas size
const ARENA_HEIGHT = 600; // Match canvas size

/**
 * Represents a single active game match on the server.
 * Manages the game state, robots, interpreter, collisions, game loop,
 * broadcasts state to players and spectators, // <-- Added spectator mention
 * and notifies the GameManager upon game completion via a callback.
 */
class GameInstance {
    /**
     * Creates a new game instance.
     * @param {string} gameId - A unique identifier for this game.
     * @param {SocketIO.Server} io - The main Socket.IO server instance.
     * @param {Array<{socket: SocketIO.Socket, code: string, appearance: string, name: string, isReady: boolean}>} playersData - Array of player data.
     * @param {Function} gameOverCallback - Function provided by GameManager to call when the game ends. Expects (gameId, winnerData) object.
     * @param {string} gameName - Thematic name for the game (Added for Phase 3)
     */
    constructor(gameId, io, playersData, gameOverCallback, gameName = '') { // Added gameName
        this.gameId = gameId;
        this.io = io; // Socket.IO server instance for broadcasting
        this.players = new Map(); // Map: socket.id -> { socket, robot, code, appearance, name }
        this.robots = []; // Array of ServerRobot instances in this game
        this.playerNames = new Map(); // Map: socket.id -> name (for easier lookup during logs/events)
        this.interpreter = new ServerRobotInterpreter(); // Handles robot code execution
        this.collisionSystem = new ServerCollisionSystem(this); // Handles collisions
        this.gameLoopInterval = null; // Stores the setInterval ID for the game loop
        this.lastTickTime = 0; // Timestamp of the last tick
        // Stores explosion data generated this tick to send to clients
        this.explosionsToBroadcast = [];
        // Store the callback function provided by GameManager
        this.gameOverCallback = gameOverCallback;
        // Store game name (added for Phase 3)
        this.gameName = gameName || `Game ${gameId}`; // Use provided name or generate default
        // Define the spectator room name for this instance
        this.spectatorRoom = `spectator-${this.gameId}`;


        console.log(`[${this.gameId} - '${this.gameName}'] Initializing Game Instance...`); // Added name to log

        // Initialize players and their robots based on received data
        playersData.forEach((playerData, index) => {
            // Assign starting positions (simple alternating sides)
            const startX = index % 2 === 0 ? 100 : ARENA_WIDTH - 100;
            const startY = 100 + Math.floor(index / 2) * (ARENA_HEIGHT - 200);
            const startDir = index % 2 === 0 ? 0 : 180;

            // Create the ServerRobot instance, passing appearance
            const robot = new ServerRobot(
                playerData.socket.id,
                startX, startY, startDir,
                playerData.appearance // Pass the appearance identifier
            );
            // Assign the name directly to the robot instance
            robot.name = playerData.name;
            this.robots.push(robot);

            // Store player data associated with the robot
            this.players.set(playerData.socket.id, {
                socket: playerData.socket,
                robot: robot,
                code: playerData.code,
                appearance: playerData.appearance,
                name: playerData.name // Store name here as well
            });
            // Store name in the separate map for quick lookups
            this.playerNames.set(playerData.socket.id, playerData.name);

            console.log(`[${this.gameId} - '${this.gameName}'] Added player ${playerData.name} (${playerData.socket.id}) (Appearance: ${playerData.appearance}) with Robot ${robot.id}`);

            // Add the player's socket to the dedicated Socket.IO room for this game
            playerData.socket.join(this.gameId);
            console.log(`[${this.gameId} - '${this.gameName}'] Player ${playerData.name} joined Socket.IO room.`);
        });

        // Initialize the interpreter AFTER all robots and player data are set up
        // Pass the players map which now includes the name for potential use in error messages etc.
        this.interpreter.initialize(this.robots, this.players);

        console.log(`[${this.gameId} - '${this.gameName}'] Game Instance Initialization complete.`);
    }

    /**
     * Starts the main game loop interval.
     */
    startGameLoop() {
        console.log(`[${this.gameId} - '${this.gameName}'] Starting game loop (Tick Rate: ${TICK_RATE}/s).`);
        this.lastTickTime = Date.now();

        if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);

        this.gameLoopInterval = setInterval(() => {
            const now = Date.now();
            // Calculate delta time in seconds for physics/movement calculations
            const deltaTime = (now - this.lastTickTime) / 1000.0;
            this.lastTickTime = now;
            // Execute one tick of the game simulation
            this.tick(deltaTime);
        }, 1000 / TICK_RATE);
    }

    /**
     * Stops the main game loop interval and performs cleanup.
     */
    stopGameLoop() {
        console.log(`[${this.gameId} - '${this.gameName}'] Stopping game loop.`);
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
        this.interpreter.stop(); // Clean up interpreter state
        // Note: Spectator room cleanup will happen in GameManager when the instance is removed
    }

    /**
     * Executes a single tick of the game simulation: AI, movement, collisions, game over check, state broadcast.
     * @param {number} deltaTime - The time elapsed since the last tick, in seconds.
     */
    tick(deltaTime) {
        try {
            // --- Start of Tick ---
            this.explosionsToBroadcast = []; // Clear transient data from the previous tick

            // 1. Execute Robot AI Code
            this.interpreter.executeTick(this.robots, this);

            // 2. Update Robot and Missile Physics/Movement
            this.robots.forEach(robot => {
                // Pass arena dimensions to robot update
                robot.update(deltaTime, ARENA_WIDTH, ARENA_HEIGHT);
            });

            // 3. Check for and Resolve Collisions
            this.collisionSystem.checkAllCollisions(); // Needs access to ARENA dimensions if boundary checks move there

            // 4. Check for Game Over Condition
            if (this.checkGameOver()) {
                // checkGameOver calls stopGameLoop and notifies clients/GameManager if true
                return; // Exit tick processing early as the game has ended
            }

            // --- State Broadcasting ---
            // 5. Gather the current state of all entities for clients.
            const gameState = this.getGameState();

            // 6. Broadcast the state to ALL clients in this game's room AND the spectator room.
            this.io.to(this.gameId).to(this.spectatorRoom).emit('gameStateUpdate', gameState);

        } catch (error) {
             console.error(`[${this.gameId} - '${this.gameName}'] CRITICAL ERROR during tick:`, error);
             // Consider stopping the game or notifying players
             this.stopGameLoop(); // Stop loop on critical error
             // Notify players and spectators of the error
             this.io.to(this.gameId).to(this.spectatorRoom).emit('gameError', { message: `Critical server error during game tick for '${this.gameName}'. Game aborted.` });
             // Manually trigger game over callback with no winner due to error
             if (typeof this.gameOverCallback === 'function') {
                 this.gameOverCallback(this.gameId, { winnerId: null, winnerName: 'None', reason: 'Server Error' });
             }
        }
    }

    /**
     * Checks if the game has reached an end condition (e.g., only one robot left alive).
     * If the game is over, it stops the loop, notifies clients (players AND spectators),
     * and calls the GameManager's game over callback.
     * @returns {boolean} True if the game is over, false otherwise.
     */
    checkGameOver() {
        // Count how many robots are still marked as alive
        const aliveRobots = this.robots.filter(r => r.isAlive);

        // Game ends if 1 or 0 robots are left alive (and we started with at least 2 robots).
        if (aliveRobots.length <= 1 && this.robots.length >= 2) {
            const winnerRobot = aliveRobots[0]; // Could be undefined if 0 left (draw/mutual destruction)

            // Prepare winner data object
            const winnerData = {
                gameId: this.gameId, // Add gameId for context on client/server
                winnerId: winnerRobot ? winnerRobot.id : null,
                winnerName: winnerRobot ? winnerRobot.name : 'None', // Get name from robot instance
                reason: winnerRobot ? "Last robot standing!" : "Mutual Destruction!"
            };

            console.log(`[${this.gameId} - '${this.gameName}'] Game Over detected. Reason: ${winnerData.reason}. Winner: ${winnerData.winnerName} (${winnerData.winnerId || 'N/A'})`);

            // Notify players *in the game room* about the game end
            this.io.to(this.gameId).emit('gameOver', winnerData);

            // Notify spectators *in the spectator room* about the game end
            this.io.to(this.spectatorRoom).emit('spectateGameOver', winnerData);
            console.log(`[${this.gameId} - '${this.gameName}'] Notified spectator room ${this.spectatorRoom} of game over.`);

            // Stop the simulation loop for this game instance.
            this.stopGameLoop();

            // Call the GameManager callback to handle lobby events etc.
            // Pass gameId along with winnerData for context in GameManager
            if (typeof this.gameOverCallback === 'function') {
                this.gameOverCallback(this.gameId, winnerData); // Pass gameId now
            } else {
                console.warn(`[${this.gameId}] gameOverCallback is not a function!`);
            }

            return true; // Game is over
        }
        return false; // Game continues
    }

    /**
     * Creates data for a visual explosion effect to be sent to clients.
     * Called by collision system or other logic.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} size - Size multiplier.
     */
    createExplosion(x, y, size) {
        const explosionData = {
            id: `e-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            x: x,
            y: y,
            size: size,
        };
        this.explosionsToBroadcast.push(explosionData);
        // Send explosion data immediately? Or bundle with gameStateUpdate?
        // Bundling is generally more efficient. Already handled in getGameState.
    }

    /**
     * Gathers the current state of the game (robots, missiles, effects)
     * into a serializable object suitable for broadcasting to clients via Socket.IO.
     * Includes the gameName. // <-- Added gameName
     * @returns {object} The current game state snapshot.
     */
    getGameState() {
        // Collect all active missiles from all robots' lists
        const activeMissiles = [];
        this.robots.forEach(robot => {
            // Keep collecting missiles even if robot just died, until they hit/expire
            activeMissiles.push(...robot.missiles);
        });

        // Construct the state object
        const state = {
            gameId: this.gameId,
            gameName: this.gameName, // Include game name in state updates
            // Map robot instances to plain data objects, including name
            robots: this.robots.map(robot => ({
                id: robot.id,
                x: robot.x,
                y: robot.y,
                direction: robot.direction,
                damage: robot.damage,
                color: robot.color, // Color is generated in ServerRobot constructor
                isAlive: robot.isAlive,
                appearance: robot.appearance,
                name: robot.name // Include the name stored on the robot instance
            })),
            // Map missile instances to plain data objects
            missiles: activeMissiles.map(missile => ({
                id: missile.id,
                x: missile.x,
                y: missile.y,
                radius: missile.radius,
                ownerId: missile.ownerId // Include owner ID
            })),
            // Include any explosions triggered during this tick
            explosions: this.explosionsToBroadcast,
            timestamp: Date.now() // Include a server timestamp
        };

        // Clearing explosionsToBroadcast moved to start of tick()

        return state;
    }

    /**
     * Performs a scan operation for a given robot, finding the nearest opponent within an arc.
     * Called by the interpreter's safeScan method.
     * @param {ServerRobot} scanningRobot - The robot performing the scan.
     * @param {number} direction - The center direction of the scan arc (degrees, 0=East, 90=North).
     * @param {number} resolution - The width of the scan arc (degrees).
     * @returns {object | null} An object with { distance, direction, id, name } of the closest detected robot, or null if none found.
     */
    performScan(scanningRobot, direction, resolution) {
        // Normalize inputs
        const scanDirection = ((Number(direction) % 360) + 360) % 360;
        const halfResolution = Math.max(1, Number(resolution) / 2); // Ensure minimum 1 degree arc
        const scanRange = 800; // Maximum scan distance

        // Define scan arc boundaries in degrees [0, 360)
        let startAngleDeg = (scanDirection - halfResolution + 360) % 360;
        let endAngleDeg = (scanDirection + halfResolution + 360) % 360;
        const wrapsAround = startAngleDeg > endAngleDeg; // Check if arc crosses the 0/360 degree line

        let closestTargetInfo = null; // Stores { distance, direction, id, name }
        let closestDistanceSq = scanRange * scanRange; // Use squared distance for comparison efficiency

        this.robots.forEach(targetRobot => {
            // Skip self and dead robots
            if (scanningRobot.id === targetRobot.id || !targetRobot.isAlive) {
                return;
            }

            const dx = targetRobot.x - scanningRobot.x;
            const dy = targetRobot.y - scanningRobot.y; // Use server coordinates
            const distanceSq = dx * dx + dy * dy;

            // Early exit if target is further than current closest or out of max range
            if (distanceSq >= closestDistanceSq || distanceSq > scanRange * scanRange) {
                return;
            }

            // Calculate angle to target: atan2(-dy, dx) for 0=East, 90=North convention
            let angleToTargetDeg = Math.atan2(-dy, dx) * 180 / Math.PI;
            angleToTargetDeg = (angleToTargetDeg + 360) % 360; // Normalize angle to [0, 360)

            // Check if the calculated angle falls within the scan arc
            let inArc = false;
            if (wrapsAround) { // Arc crosses 0/360 (e.g., 350 to 10)
                inArc = (angleToTargetDeg >= startAngleDeg || angleToTargetDeg <= endAngleDeg);
            } else { // Arc does not wrap (e.g., 80 to 100)
                inArc = (angleToTargetDeg >= startAngleDeg && angleToTargetDeg <= endAngleDeg);
            }

            if (inArc) {
                // Found a new closest robot within the arc
                closestDistanceSq = distanceSq;
                closestTargetInfo = {
                    distance: Math.sqrt(distanceSq), // Calculate actual distance only for the final result
                    direction: angleToTargetDeg, // Report angle using the 0=East convention
                    id: targetRobot.id, // Include the ID of the detected robot
                    name: targetRobot.name // Include the Name of the detected robot
                };
            }
        });

        return closestTargetInfo; // Return data for the closest robot, or null if none found
    }

    /**
     * Removes a player and marks their robot as inactive upon disconnection.
     * Called by the GameManager.
     * @param {string} socketId - The ID of the disconnecting player's socket.
     */
    removePlayer(socketId) {
        // Use the playerNames map for logging
        const playerName = this.playerNames.get(socketId) || socketId.substring(0,4)+'...';
        console.log(`[${this.gameId} - '${this.gameName}'] Handling removal of player ${playerName} (${socketId}).`);

        const playerData = this.players.get(socketId);
        if (playerData) {
            // Mark the robot as inactive
            if (playerData.robot) {
                 playerData.robot.isAlive = false;
                 playerData.robot.speed = 0; // Stop movement
                 playerData.robot.targetSpeed = 0;
                 console.log(`[${this.gameId} - '${this.gameName}'] Marked robot for ${playerName} as inactive.`);
            }

            // Have the socket leave the Socket.IO room for this game
            // This happens automatically on disconnect, but leave() is useful if removing manually
            // if (playerData.socket) {
            //      playerData.socket.leave(this.gameId);
            // }
            // Remove player data from the active players map for this game
            this.players.delete(socketId);
            // Remove from name map
            this.playerNames.delete(socketId);

            // Check if removing this player triggers the game over condition
            // (e.g., if only one player remains)
            this.checkGameOver();
        } else {
             console.warn(`[${this.gameId} - '${this.gameName}'] Tried to remove player ${socketId}, but they were not found in the player map.`);
        }
    }

    /**
     * Checks if the game instance has no active players left in its map.
     * Used by GameManager to determine if the instance can be cleaned up.
     * @returns {boolean} True if the player map is empty, false otherwise.
     */
    isEmpty() {
        return this.players.size === 0;
    }

    // Placeholder for queueAction - remains unchanged
    queueAction(socketId, action) {
        const playerName = this.playerNames.get(socketId) || socketId;
        console.warn(`[${this.gameId}] queueAction called but not implemented for player ${playerName}. Action:`, action);
    }

    // --- New method for cleanup ---
    /**
     * Cleans up resources associated with this game instance, specifically the spectator room.
     * Called by GameManager before deleting the instance.
     */
    cleanup() {
        console.log(`[${this.gameId} - '${this.gameName}'] Cleaning up instance. Making sockets leave spectator room: ${this.spectatorRoom}`);
        // Force any remaining sockets out of the spectator room
        // This helps ensure spectators disconnected uncleanly are removed from the room state
        this.io.socketsLeave(this.spectatorRoom);
    }

}

module.exports = GameInstance;
```

## server/game-manager.js

```code
// server/game-manager.js
const GameInstance = require('./game-instance'); // Manages a single game match

/**
 * Manages the overall flow of players joining, waiting, and starting games.
 * Handles storing player data (including names, readiness), matchmaking,
 * game naming, tracking active/finished games, cleaning up old instances,
 * transitioning lobby players to spectators, moving participants back to lobby, // <-- Added participant move
 * broadcasting game history, // <-- Added history broadcast
 * and broadcasting lobby events and status updates.
 */
class GameManager {
    /**
     * Creates a GameManager instance.
     * @param {SocketIO.Server} io - The main Socket.IO server instance for communication.
     */
    constructor(io) {
        this.io = io; // Socket.IO server instance

        // Stores players waiting to join a game.
        // Key: socket.id
        // Value: { socket: SocketIO.Socket, code: string | null, appearance: string, name: string, isReady: boolean }
        this.pendingPlayers = new Map();

        // Stores active game instances.
        // Key: gameId (string)
        // Value: GameInstance object
        this.activeGames = new Map();

        // Maps a player's socket ID to the game ID they are currently in.
        // Key: socket.id
        // Value: gameId (string)
        this.playerGameMap = new Map();

        // Simple counter to generate unique game IDs.
        this.gameIdCounter = 0;

        // --- Added for Game Tracking (Phase 3, P2) ---
        // Optional: Stores recently completed games (volatile)
        // Key: gameId, Value: {name, winnerName, players: [{id, name}], endTime}
        this.recentlyCompletedGames = new Map();
        this.maxCompletedGames = 10; // Limit history size
        // --- End Game Tracking ---

        console.log("[GameManager] Initialized.");
    }

    /**
     * Adds a newly connected player to the waiting list with default values.
     * Called by socket-handler upon connection *if no games are active*,
     * OR when moving spectators/participants back to lobby state. // <-- Added context
     * @param {SocketIO.Socket} socket - The socket object for the connected player.
     */
    addPlayer(socket) {
        // Avoid adding if already pending (e.g., multiple moves during cleanup)
        if (this.pendingPlayers.has(socket.id)) {
            // console.log(`[GameManager] Player ${socket.id} is already pending. Skipping add.`); // Optional Log
            return;
        }
        // Try to retain existing name if available (e.g. from Controls state or previous game)
        // Keep simple for now: assign default or last known name if easy.
        const initialName = `Player_${socket.id.substring(0, 4)}`; // Default for now
        console.log(`[GameManager] Adding player ${socket.id} (${initialName}) back to pending list.`);
        // Add player to the pending list with default name and not ready status.
        this.pendingPlayers.set(socket.id, {
            socket: socket,
            code: null, // Code needs resubmission
            appearance: 'default', // Appearance might need reset client-side or resubmission
            name: initialName, // Use default - client should retain and resubmit on ready
            isReady: false // Player is NOT ready initially when returning to lobby
        });
    }

    /**
     * Generates a unique, thematic name for a new game.
     * @returns {string} A generated game name (e.g., "Dimension C-137").
     */
    generateGameName() {
        // Simple sequential naming, can be expanded later
        const baseId = 137 + this.gameIdCounter; // R&M style starting point
        return `Sector Z-${baseId}`;
        // Alternative: `Quadrant ${String.fromCharCode(65 + (this.gameIdCounter % 26))}-${Math.floor(this.gameIdCounter / 26) + 1}`
    }


    /**
     * Retrieves the name of a player based on their socket ID.
     * Checks both pending players and players in active games.
     * @param {string} socketId - The ID of the player's socket.
     * @returns {string | null} The player's name, or null if not found.
     */
    getPlayerName(socketId) {
        // Check pending players first
        const pendingData = this.pendingPlayers.get(socketId);
        if (pendingData && pendingData.name) {
            return pendingData.name;
        }

        // Check active games by looking up the game ID, then the game instance, then the player data within it
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            // Access the name stored within the GameInstance's players map value
            const activePlayerData = game?.players?.get(socketId);
            if (activePlayerData && activePlayerData.name) {
                return activePlayerData.name;
            }
            // Fallback: Check GameInstance's separate name map if implementation uses it
            if (game?.playerNames?.get(socketId)) {
                return game.playerNames.get(socketId);
            }
        }

        return null; // Player not found or name missing
    }


    /**
     * Handles receiving code, appearance, and name data from a player upon "Ready Up".
     * Updates the player's status to ready and attempts matchmaking.
     * Called by socket-handler when 'submitPlayerData' is received.
     * @param {string} socketId - The ID of the player submitting data.
     * @param {string} code - The robot AI code submitted by the player.
     * @param {string} appearance - The appearance identifier chosen by the player.
     * @param {string} name - The sanitized name provided by the player.
     */
    handlePlayerCode(socketId, code, appearance, name) {
        const playerData = this.pendingPlayers.get(socketId);

        if (!playerData) {
            // This check now correctly prevents submission if player is in playerGameMap OR not in pendingPlayers
            console.log(`[GameManager] Received data from non-pending player: ${socketId}. Ignoring.`);
            // Server should have sent error message via socket-handler check
            return;
        }

        // Update player data *before* emitting events using the potentially new name
        playerData.code = code;
        playerData.appearance = (typeof appearance === 'string' && appearance.trim()) ? appearance : 'default';
        playerData.name = name; // Store the sanitized name
        playerData.isReady = true; // Mark player as ready upon code submission

        console.log(`[GameManager] Player ${playerData.name} (${socketId}) submitted code and is Ready.`);

        // Emit Lobby Event: Player is Ready
        this.io.emit('lobbyEvent', { message: `Player ${playerData.name} is ready!` });

        // Attempt to start match immediately after player readies up
        this._tryStartMatch();

        // Broadcast lobby status after attempting match start
        // (Moved from socket-handler to ensure it happens after _tryStartMatch completes)
        this.broadcastLobbyStatus();
    }

    /**
     * Sets the ready status for a player in the pending list.
     * Called by socket-handler when 'playerUnready' is received.
     * @param {string} socketId - The player's socket ID.
     * @param {boolean} isReady - The desired ready state (typically false for unready).
     */
    setPlayerReadyStatus(socketId, isReady) {
        const playerData = this.pendingPlayers.get(socketId);
        if (playerData) {
            // Only update and broadcast if the state actually changes
            if (playerData.isReady !== isReady) {
                playerData.isReady = isReady;
                console.log(`[GameManager] Player ${playerData.name} (${socketId}) status set to ${isReady ? 'Ready' : 'Not Ready'}.`);

                // Emit lobby event about the change
                this.io.emit('lobbyEvent', { message: `Player ${playerData.name} is ${isReady ? 'now ready' : 'no longer ready'}.` });

                // If player becomes ready, try to start match
                if (isReady) {
                    this._tryStartMatch();
                }
                 // Broadcast updated lobby status regardless of state change direction
                 this.broadcastLobbyStatus();
            }
        } else {
            // This might happen if player unreadies exactly as game starts/ends, ignore.
            console.warn(`[GameManager] Tried to set ready status for unknown pending player ${socketId}. Ignoring.`);
        }
    }


    /**
     * Internal method to check if enough ready players exist in the pending list and start a game if possible.
     * Called after a player readies up, becomes unready, or disconnects while pending.
     */
    _tryStartMatch() {
        // Find all players in the pending list currently marked as ready.
        const readyPlayers = Array.from(this.pendingPlayers.values())
                                .filter(p => p.isReady === true);

        const requiredPlayers = 2; // Configurable: Number of players needed for a match
        if (readyPlayers.length >= requiredPlayers) {
            console.log(`[GameManager] ${readyPlayers.length}/${requiredPlayers} players ready. Starting new game...`);

            // Select the players for the new game
            const playersForGame = readyPlayers.slice(0, requiredPlayers);

            // Remove these selected players from the pending list *before* creating the game instance
            playersForGame.forEach(p => this.pendingPlayers.delete(p.socket.id));

            // Create and start the new game instance (handles moving others to spectate)
            this.createGame(playersForGame);

            // Broadcast the new lobby status (pending list should now be smaller or empty)
            // (Moved broadcast call to end of createGame and handlePlayerCode to ensure it runs after state changes)
        } else {
            // Not enough players ready, just log status
            // console.log(`[GameManager] Waiting for more players. ${readyPlayers.length}/${requiredPlayers} ready.`); // Optional log
        }
    }

    /**
     * Creates a new GameInstance, adds it to the active games list,
     * maps players to the game, starts the game loop, transitions remaining lobby players
     * to spectators, emits lobby events, and broadcasts lobby status.
     * @param {Array<{socket: SocketIO.Socket, code: string, appearance: string, name: string, isReady: boolean}>} playersData - Array of player data objects for the new game.
     */
    createGame(playersData) {
        const gameId = `game-${this.gameIdCounter++}`;
        const gameName = this.generateGameName();
        const playerInfo = playersData.map(p => `${p.name}(${p.socket.id.substring(0,4)})`).join(', ');
        console.log(`[GameManager] Creating game ${gameId} ('${gameName}') for players: ${playerInfo}`);

        const playerNames = playersData.map(p => p.name).join(' vs ');
        this.io.emit('lobbyEvent', { message: `Game '${gameName}' starting: ${playerNames}!` });

        let gameInstance;

        try {
            // Create the GameInstance
            gameInstance = new GameInstance(
                gameId, this.io, playersData,
                (endedGameId, winnerData) => { this.handleGameOverEvent(endedGameId, winnerData); },
                gameName
            );

            // Store the active game instance
            this.activeGames.set(gameId, gameInstance);

            // Map participants to the game and notify them
            playersData.forEach(player => {
                this.playerGameMap.set(player.socket.id, gameId);
                 if (player.socket.connected) { // Check connection before emitting
                     player.socket.emit('gameStart', {
                         gameId: gameId, gameName: gameName,
                         players: playersData.map(p => ({ id: p.socket.id, name: p.name, appearance: p.appearance }))
                     });
                     console.log(`[GameManager] Notified player ${player.name} that game ${gameId} ('${gameName}') is starting.`);
                 } else {
                     console.warn(`[GameManager] Player ${player.name} disconnected before gameStart emit.`);
                 }
            });

            // --- START: Transition remaining lobby players to spectators ---
            const spectatorRoom = `spectator-${gameId}`;
            // IMPORTANT: Create a *copy* of the values before iterating and modifying the map
            const remainingPendingPlayers = Array.from(this.pendingPlayers.values());

            if (remainingPendingPlayers.length > 0) {
                console.log(`[GameManager] Moving ${remainingPendingPlayers.length} remaining pending players to spectate game ${gameId} ('${gameName}').`);
                remainingPendingPlayers.forEach(pendingPlayer => {
                    const spectatorSocket = pendingPlayer.socket;
                    const spectatorId = spectatorSocket.id;
                    const spectatorName = pendingPlayer.name;

                    // Double-check if the player still exists in pendingPlayers before modifying
                    if (this.pendingPlayers.has(spectatorId)) {
                        if (spectatorSocket.connected) {
                             spectatorSocket.join(spectatorRoom);
                             spectatorSocket.emit('spectateStart', { gameId: gameId, gameName: gameName });
                             this.pendingPlayers.delete(spectatorId); // Remove AFTER emitting/joining
                             console.log(`[GameManager] Moved pending player ${spectatorName} (${spectatorId}) to spectate.`);
                        } else {
                             console.log(`[GameManager] Pending player ${spectatorName} (${spectatorId}) disconnected before spectate move. Removing.`);
                             this.pendingPlayers.delete(spectatorId);
                        }
                    } else {
                         console.log(`[GameManager] Player ${spectatorName} (${spectatorId}) no longer pending. Skipping spectate move.`);
                    }
                });
            }
            // --- END: Transition remaining lobby players ---

            // Start the simulation loop for the new game instance
            gameInstance.startGameLoop();

            // Broadcast lobby status AFTER game is created and players/spectators moved
            this.broadcastLobbyStatus();

        } catch (error) {
            console.error(`[GameManager] Error creating game ${gameId} ('${gameName}'):`, error);
            this.io.emit('lobbyEvent', { message: `Failed to start game '${gameName}' for ${playerInfo}. Please try again.`, type: 'error' });
            // Put original players back in pending if game creation failed
            playersData.forEach(player => {
                 player.isReady = false; // Mark as not ready
                 this.addPlayer(player.socket); // Add back to pending list safely
                 if(player.socket.connected) {
                    player.socket.emit('gameError', { message: `Failed to create game instance '${gameName}'. Please Ready Up again.` });
                 }
            });
            // Clean up partially created game if needed
            if (this.activeGames.has(gameId)) { this.activeGames.delete(gameId); }
            playersData.forEach(player => { this.playerGameMap.delete(player.socket.id); });
            // Broadcast lobby status after failure handling
            this.broadcastLobbyStatus();
        }
    } // End createGame

    /**
     * Handles the game over event triggered by a GameInstance callback.
     * Emits lobby events, moves spectators AND participants back to the lobby,
     * cleans up player mapping, removes the game instance, logs the result,
     * and broadcasts the updated game history. // <-- Added history broadcast
     * @param {string} gameId - The ID of the game that just ended.
     * @param {object} winnerData - Object containing winner details { winnerId, winnerName, reason }.
     */
    async handleGameOverEvent(gameId, winnerData) {
        const gameInstance = this.activeGames.get(gameId);
        const gameName = gameInstance ? gameInstance.gameName : `Game ${gameId}`;

        const winnerName = winnerData.winnerName || 'No one';
        const reason = winnerData.reason || 'Match ended.';
        console.log(`[GameManager] Received game over event for ${gameId} ('${gameName}'). Winner: ${winnerName}`);

        this.io.emit('lobbyEvent', { message: `Game '${gameName}' over! Winner: ${winnerName}. (${reason})` });

        if (!gameInstance) {
            console.warn(`[GameManager] handleGameOverEvent called for ${gameId}, but instance not found. Skipping cleanup.`);
            this.broadcastLobbyStatus();
            return;
        }

        // --- Move Spectators Back to Lobby ---
        const spectatorRoom = `spectator-${gameId}`;
        try {
            const spectatorSockets = await this.io.in(spectatorRoom).fetchSockets();
            console.log(`[GameManager] Found ${spectatorSockets.length} spectators for game ${gameId}. Moving to lobby.`);
            spectatorSockets.forEach(spectatorSocket => {
                if (spectatorSocket.connected) {
                    console.log(`[GameManager] Moving spectator ${spectatorSocket.id} from room ${spectatorRoom} back to lobby.`);
                    spectatorSocket.leave(spectatorRoom); // Leave room first
                    this.addPlayer(spectatorSocket);    // Then add to pending safely
                } else {
                    console.log(`[GameManager] Spectator ${spectatorSocket.id} disconnected before move.`);
                }
            });
        } catch (err) {
             console.error(`[GameManager] Error fetching/moving spectators for ${gameId}:`, err);
        }
        // --- End Spectator Move ---

        // --- Clean up Player Mappings AND Move Participants to Lobby ---
        const playerIds = Array.from(gameInstance.players.keys());
        console.log(`[GameManager] Cleaning up mappings and moving participants to lobby for game ${gameId}:`, playerIds);
        playerIds.forEach(playerId => {
            this.playerGameMap.delete(playerId); // Remove from active game map first
            console.log(`[GameManager] Removed player ${playerId} from playerGameMap.`);

            // Get the socket object for the participant
            const playerData = gameInstance.players.get(playerId);
            const playerSocket = playerData ? playerData.socket : null;

            // Add participant back to the pending list if still connected
            if (playerSocket && playerSocket.connected) {
                 console.log(`[GameManager] Adding participant ${playerId} back to pendingPlayers.`);
                 this.addPlayer(playerSocket); // Add them back to the lobby list safely
            } else {
                 console.log(`[GameManager] Participant ${playerId} not found or disconnected. Cannot add back to lobby.`);
            }
        });
        // --- End Participant Cleanup/Move ---

        // --- Optional: Log completed game ---
        // Ensure gameInstance and playerNames exist before trying to access them
        if (gameInstance && gameInstance.playerNames) {
            const completedGameData = {
                name: gameName,
                winnerName: winnerName,
                players: Array.from(gameInstance.playerNames.entries()).map(([id, name]) => ({ id, name })),
                endTime: Date.now()
            };
            this.recentlyCompletedGames.set(gameId, completedGameData);
            while (this.recentlyCompletedGames.size > this.maxCompletedGames) {
                const oldestGameId = this.recentlyCompletedGames.keys().next().value;
                this.recentlyCompletedGames.delete(oldestGameId);
                console.log(`[GameManager] Pruned oldest completed game log: ${oldestGameId}`);
            }
            console.log(`[GameManager] Logged completed game: ${gameId} ('${gameName}')`);
        } else {
            console.warn(`[GameManager] Could not log completed game ${gameId}, instance or playerNames missing.`);
        }
        // --- End Game Logging ---

        // --- Clean up Game Instance Resources & Remove ---
        try {
            if (gameInstance) gameInstance.cleanup(); // Check if instance exists before cleanup
        } catch(err) {
            console.error(`[GameManager] Error during gameInstance.cleanup() for ${gameId}:`, err);
        }
        this.activeGames.delete(gameId); // Remove from active games map AFTER cleanup
        console.log(`[GameManager] Game instance ${gameId} ('${gameName}') fully removed.`);
        // --- End Instance Cleanup ---

        // Broadcast status now that spectators AND participants are back in pending
        this.broadcastLobbyStatus();

        // --- Broadcast Updated Game History ---
        this.broadcastGameHistory(); // Call helper function
        // --- End History Broadcast ---
    }

     /** Helper function to broadcast the current game history */
     broadcastGameHistory() {
         // Convert map values to an array, sort by endTime descending (newest first)
         const historyArray = Array.from(this.recentlyCompletedGames.values())
                                 .sort((a, b) => b.endTime - a.endTime); // Sort newest first
         // console.log(`[GameManager] Broadcasting game history (${historyArray.length} entries).`); // Optional Log
         this.io.emit('gameHistoryUpdate', historyArray);
     }

    /**
     * Removes a disconnected or leaving player from the system.
     * Handles removing them from pending lists or active games, updates matchmaking state,
     * and cleans up game instances if they become empty due to disconnection *during* the game.
     * Called by socket-handler upon 'disconnect'.
     * @param {string} socketId - The ID of the player's socket.
     */
    removePlayer(socketId) {
        const playerName = this.getPlayerName(socketId); // Get name before removing data
        const playerWasPending = this.pendingPlayers.has(socketId);

        // Remove from pending list if they were waiting. Returns true if deleted.
        const wasPending = this.pendingPlayers.delete(socketId);

        // Check if the player was in an active game and remove them.
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            if (game) {
                console.log(`[GameManager] Removing player ${playerName || socketId} from active game ${gameId} ('${game.gameName}') due to disconnect/leave.`);
                game.removePlayer(socketId); // Tell the GameInstance to handle internal cleanup

                // If the game becomes empty *DURING PLAY* after removal, clean up the game instance itself.
                if (game.isEmpty()) {
                    console.log(`[GameManager] Active game ${gameId} ('${game.gameName}') has no players left after disconnect. Triggering cleanup.`);
                    try { if (game.cleanup) game.cleanup(); } catch(e){ console.error("Error cleaning up empty game", e); }
                    this.activeGames.delete(gameId);
                    console.log(`[GameManager] Game instance ${gameId} removed from active games.`);
                }
            } else {
                 console.warn(`[GameManager] Player ${playerName || socketId} mapped to non-existent game ${gameId}. Cleaning up map.`);
            }
            // Remove the player from the game map regardless.
            this.playerGameMap.delete(socketId);
        }

        // Log removal type and potentially re-evaluate matchmaking if they were pending
        if (wasPending) {
            console.log(`[GameManager] Player ${playerName || socketId} removed from pending list.`);
             this._tryStartMatch();
        } else if (gameId) {
             // Logged above
        } else {
             // Player was neither pending nor in the active game map (e.g., spectator disconnect)
             console.log(`[GameManager] Removed player ${playerName || socketId} (was not pending or in active game map).`);
        }

        // Lobby status will be broadcast by the calling disconnect handler
    }

    /**
     * Calculates the current lobby status (waiting/ready counts) and broadcasts it to all connected clients.
     */
    broadcastLobbyStatus() {
        const totalPending = this.pendingPlayers.size;
        // Count only players in the pending list who are marked as ready
        const readyCount = Array.from(this.pendingPlayers.values()).filter(p => p.isReady).length;

        const statusData = {
            waiting: totalPending, // Total players not in an active game
            ready: readyCount      // Players in pending list marked as ready
        };

        // console.log("[GameManager] Broadcasting Lobby Status:", statusData); // Optional debug log
        this.io.emit('lobbyStatusUpdate', statusData);
    }


    /**
     * Routes an action received from a player (during a game) to the correct game instance.
     * Placeholder - Not used in the current server-side interpreter model.
     * @param {string} socketId - The ID of the player sending the action.
     * @param {object} action - The action object sent by the client.
     */
    handlePlayerAction(socketId, action) {
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            if (game && typeof game.queueAction === 'function') {
                game.queueAction(socketId, action); // Delegate to GameInstance
            }
        } else {
             const playerName = this.getPlayerName(socketId) || socketId;
             console.warn(`[GameManager] Received action from player ${playerName} not currently in a game.`);
        }
    }

} // End GameManager Class

module.exports = GameManager;
```

## server/index.js

```code
// server/index.js
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const initializeSocketHandler = require('./socket-handler'); // We'll create this next

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the 'client' directory
const clientPath = path.join(__dirname, '..', 'client');
console.log(`Serving static files from: ${clientPath}`);
app.use(express.static(clientPath));

// Basic route for the root path (optional, as static middleware handles index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Initialize Socket.IO handling
initializeSocketHandler(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the game at: http://localhost:${PORT}`);
});
```

## server/server-collision.js

```code
// server/server-collision.js

/**
 * Server-side collision detection system for Robot Wars.
 * Handles interactions between robots, missiles, and arena boundaries.
 * Modifies the game state directly (e.g., applies damage).
 */
class ServerCollisionSystem {
    constructor(gameInstance) {
        this.game = gameInstance; // Reference to the GameInstance
        this.arenaWidth = 600; // TODO: Get these from GameInstance or config
        this.arenaHeight = 600;
    }

    /**
     * Checks all relevant collisions for the current game tick.
     */
    checkAllCollisions() {
        // Order matters: Check missile hits before robot-robot overlaps maybe?
        this.checkMissileRobotCollisions();
        this.checkRobotRobotCollisions();
         // Missile boundary checks are handled within robot.update now, but could be moved here.
         // this.checkMissileBoundaryCollisions();
    }

    /**
     * Checks for collisions between missiles and robots.
     * Applies damage and removes missiles upon collision.
     */
    checkMissileRobotCollisions() {
        const robots = this.game.robots; // Array of ServerRobot
        // No, we need the central list from game instance
        // const allMissiles = this.game.allMissiles; // Array of ServerMissile

        // Iterate through each robot as a potential target
        robots.forEach(targetRobot => {
            // Skip already dead robots
            if (!targetRobot.isAlive) return;

            // Iterate through all *other* robots to check *their* missiles
            robots.forEach(firingRobot => {
                 // Don't check a robot's missiles against itself
                 if (targetRobot.id === firingRobot.id) return;

                // Check missiles fired by the 'firingRobot'
                for (let i = firingRobot.missiles.length - 1; i >= 0; i--) {
                    const missile = firingRobot.missiles[i];

                    // Simple circle collision check
                    const dx = targetRobot.x - missile.x;
                    const dy = targetRobot.y - missile.y;
                    const distanceSquared = dx * dx + dy * dy; // Use squared distance to avoid sqrt
                    const radiiSum = targetRobot.radius + missile.radius;
                    const radiiSumSquared = radiiSum * radiiSum;

                    if (distanceSquared < radiiSumSquared) {
                        // --- COLLISION DETECTED ---

                        // Apply damage to the target robot
                        const damageAmount = missile.power * 10; // Example damage calculation
                        const wasDestroyed = targetRobot.takeDamage(damageAmount);
                        console.log(`[Collision] Missile from ${firingRobot.id} hit ${targetRobot.id}. Damage: ${damageAmount}. Destroyed: ${wasDestroyed}`);

                        // Remove the missile from the firing robot's list
                        firingRobot.missiles.splice(i, 1);

                        // TODO: Trigger explosion effect?
                        // The GameInstance could have an 'explosions' array or emit an event.
                        // this.game.createExplosion(missile.x, missile.y, missile.power);

                        // If the target was destroyed, maybe credit the firing robot? (Future feature)
                        // if (wasDestroyed) { ... }

                        // Since the missile is gone, continue to the next missile
                    }
                } // End loop through firingRobot's missiles
             }); // End loop through potential firing robots
        }); // End loop through potential target robots
    }

    /**
     * Checks for collisions between robots to prevent overlap.
     * Applies minor damage and pushes robots apart.
     */
     checkRobotRobotCollisions() {
        const robots = this.game.robots;
        const numRobots = robots.length;

        for (let i = 0; i < numRobots; i++) {
            const robotA = robots[i];
            if (!robotA.isAlive) continue; // Skip dead robots

            for (let j = i + 1; j < numRobots; j++) {
                const robotB = robots[j];
                if (!robotB.isAlive) continue; // Skip dead robots

                const dx = robotB.x - robotA.x;
                const dy = robotB.y - robotA.y;
                const distanceSquared = dx * dx + dy * dy;
                const minDistance = robotA.radius + robotB.radius;
                const minDistanceSquared = minDistance * minDistance;

                if (distanceSquared < minDistanceSquared && distanceSquared > 0.001) { // Avoid division by zero if perfectly overlapped
                    // --- OVERLAP DETECTED ---
                     // console.log(`[Collision] Robot ${robotA.id} and ${robotB.id} collided.`); // Original log (optional)

                    const distance = Math.sqrt(distanceSquared);
                    const overlap = minDistance - distance;

                    // Calculate separation vector (normalized dx, dy)
                    const separationX = dx / distance;
                    const separationY = dy / distance;

                    // --- START COLLISION DEBUG LOGGING ---
                    console.log(`[DEBUG COLL ${robotA.id}/${robotB.id}] Pre-Push: A=(${robotA.x.toFixed(2)}, ${robotA.y.toFixed(2)}), B=(${robotB.x.toFixed(2)}, ${robotB.y.toFixed(2)})`);
                    // --- END COLLISION DEBUG LOGGING ---

                    // Move robots apart by half the overlap distance each
                    const moveDist = overlap / 2;
                    robotA.x -= separationX * moveDist;
                    robotA.y -= separationY * moveDist;
                    robotB.x += separationX * moveDist;
                    robotB.y += separationY * moveDist;

                    // --- START COLLISION DEBUG LOGGING ---
                    console.log(`[DEBUG COLL ${robotA.id}/${robotB.id}] Post-Push: A=(${robotA.x.toFixed(2)}, ${robotA.y.toFixed(2)}), B=(${robotB.x.toFixed(2)}, ${robotB.y.toFixed(2)})`);
                    // --- END COLLISION DEBUG LOGGING ---


                    // Apply small collision damage
                    robotA.takeDamage(0.5); // Very minor damage for bumps
                    robotB.takeDamage(0.5);

                    // Optional: Apply a small impulse/change in velocity if physics are more complex later

                    // Re-check boundaries after push-apart (simple clamp)
                    // Store pre-clamp values for comparison logging
                    const preClampAx = robotA.x; const preClampAy = robotA.y;
                    const preClampBx = robotB.x; const preClampBy = robotB.y;

                    robotA.x = Math.max(robotA.radius, Math.min(this.arenaWidth - robotA.radius, robotA.x));
                    robotA.y = Math.max(robotA.radius, Math.min(this.arenaHeight - robotA.radius, robotA.y));
                    robotB.x = Math.max(robotB.radius, Math.min(this.arenaWidth - robotB.radius, robotB.x));
                    robotB.y = Math.max(robotB.radius, Math.min(this.arenaHeight - robotB.radius, robotB.y));

                    // --- START COLLISION DEBUG LOGGING ---
                    // Log ONLY if clamping actually changed the value
                    if (robotA.x !== preClampAx || robotA.y !== preClampAy) {
                         console.log(`[DEBUG COLL ${robotA.id}] Clamped A after push from (${preClampAx.toFixed(2)}, ${preClampAy.toFixed(2)}) to (${robotA.x.toFixed(2)}, ${robotA.y.toFixed(2)})`);
                    }
                    if (robotB.x !== preClampBx || robotB.y !== preClampBy) {
                         console.log(`[DEBUG COLL ${robotB.id}] Clamped B after push from (${preClampBx.toFixed(2)}, ${preClampBy.toFixed(2)}) to (${robotB.x.toFixed(2)}, ${robotB.y.toFixed(2)})`);
                    }
                    // --- END COLLISION DEBUG LOGGING ---

                } // End if (overlap detected)
            } // End inner loop (robotB)
        } // End outer loop (robotA)
    } // End checkRobotRobotCollisions method

    // Optional: Move missile boundary check here if not handled in robot.update
    // checkMissileBoundaryCollisions() { ... }
}

module.exports = ServerCollisionSystem;
```

## server/server-interpreter.js

```code
// server/server-interpreter.js
const vm = require('vm'); // Use Node.js VM module for better sandboxing

// Maximum execution time allowed for the initial compilation/run *if* enforced per call later
const EXECUTION_TIMEOUT = 50; // Milliseconds. NOTE: Timeout currently only applies during initialization.

/**
 * Executes robot AI code safely within a sandboxed environment on the server.
 * Manages the execution context and provides a controlled API for robots.
 * This version compiles the code into a function during initialization for better scoping.
 */
class ServerRobotInterpreter {
    constructor() {
        // Stores the unique sandboxed context for each robot (persists between ticks)
        this.robotContexts = {};
        // Stores the actual executable function compiled from the robot's code
        this.robotTickFunctions = {};
        // Temporarily holds the ID of the robot currently executing code
        this.currentRobotId = null;
        // Temporarily holds a reference to the GameInstance for context during execution
        this.currentGameInstance = null;
    }

    /**
     * Initializes the interpreter for a set of robots.
     * Compiles the code for each robot into a function and creates its sandboxed execution context.
     * @param {ServerRobot[]} robots - An array of ServerRobot instances.
     * @param {Map<string, {socket: Socket, robot: ServerRobot, code: string}>} playersDataMap - Map from robot ID (socket.id) to player data.
     */
    initialize(robots, playersDataMap) {
        console.log("[Interpreter] Initializing robot interpreters (Function Mode)...");

        robots.forEach(robot => {
            const playerData = playersDataMap.get(robot.id);

            // Ensure we have player data and valid code for this robot
            if (!playerData || typeof playerData.code !== 'string' || playerData.code.trim() === '') {
                console.error(`[Interpreter] No player data or valid code found for robot ${robot.id}. Robot will be disabled.`);
                this.robotTickFunctions[robot.id] = null; // Mark as disabled
                this.robotContexts[robot.id] = null;
                return;
            }

            // --- Create the Sandboxed Environment (Context) ---
            // Defines everything the robot's code can access.
            const sandbox = {
                // Persistent state object (accessible as 'state' or 'this.state' inside function)
                state: {},

                // Safe API object (accessible as 'robot' or 'this.robot')
                robot: {
                    drive: (direction, speed) => this.safeDrive(robot.id, direction, speed),
                    scan: (direction, resolution) => this.safeScan(robot.id, direction, resolution),
                    fire: (direction, power) => this.safeFire(robot.id, direction, power),
                    damage: () => this.safeDamage(robot.id),
                    getX: () => this.safeGetX(robot.id),
                    getY: () => this.safeGetY(robot.id),
                    getDirection: () => this.safeGetDirection(robot.id),
                },

                // Safe console (accessible as 'console' or 'this.console')
                console: {
                    log: (...args) => {
                        console.log(`[Robot ${robot.id} Log]`, ...args);
                    }
                },

                // Standard Math library (accessible as 'Math' or 'this.Math')
                Math: Math,

                // Explicitly disable potentially harmful globals within the sandbox
                // setTimeout: null, setInterval: null, require: null, process: null, global: null,
            };

            // Create the persistent VM context using the sandbox
            this.robotContexts[robot.id] = vm.createContext(sandbox);

            // --- Compile Code into a Reusable Function ---
            try {
                // 1. Wrap the user's code inside an anonymous function string.
                // Using "use strict" is generally good practice.
                const wrappedCode = `
                    (function() {
                        "use strict";
                        // User code goes here. It can access 'state', 'robot', 'console', 'Math'
                        // either directly or via 'this' (e.g., this.state.myVar = 1)
                        ${playerData.code}
                    }); // Semicolon here is important for safety
                `;

                // 2. Compile the wrapper function string into a vm.Script object.
                const script = new vm.Script(wrappedCode, {
                    filename: `robot_${robot.id}_function.js`, // For stack traces
                    displayErrors: true
                });

                // 3. Run the compiled script *once* within the context.
                // The result of running the script `(function(){...});` IS the function.
                // Store this executable function.
                this.robotTickFunctions[robot.id] = script.runInContext(this.robotContexts[robot.id], {
                     // Timeout for this initial run/compilation step
                     timeout: 500 // Allow half a second for potentially complex initial setup
                });

                // 4. Type check: Ensure we actually got a function back.
                if (typeof this.robotTickFunctions[robot.id] !== 'function') {
                     throw new Error("Compilation did not produce an executable function.");
                }

                console.log(`[Interpreter] Successfully compiled code into function for robot ${robot.id}`);

            } catch (error) {
                // Handle errors during compilation or the initial run
                console.error(`[Interpreter] Error compiling/initializing function for robot ${robot.id}:`, error.message);
                if (playerData.socket) {
                    playerData.socket.emit('codeError', {
                        robotId: robot.id,
                        message: `Compilation/Initialization Error: ${error.message}`
                    });
                }
                // Disable the robot if compilation/initialization fails
                this.robotTickFunctions[robot.id] = null;
                this.robotContexts[robot.id] = null;
            }
        });
        console.log("[Interpreter] Initialization complete.");
    }

    /**
     * Executes one tick of AI code for all active robots by calling their compiled function.
     * Called by the GameInstance's main game loop (`tick` method).
     * @param {ServerRobot[]} robots - Array of all robot instances in the game.
     * @param {GameInstance} gameInstance - Reference to the current game instance for context.
     */
    executeTick(robots, gameInstance) {
        // Store game instance context for use by safe API methods during this tick
        this.currentGameInstance = gameInstance;

        robots.forEach(robot => {
            // Check if robot is alive and has a valid *function* and context
            if (robot.isAlive && this.robotTickFunctions[robot.id] && this.robotContexts[robot.id]) {

                // Set the ID of the currently executing robot for validation in safe methods
                this.currentRobotId = robot.id;
                const tickFunction = this.robotTickFunctions[robot.id];
                const context = this.robotContexts[robot.id]; // The sandbox object

                // Optional Debug Log (shows context exists, useful for verifying 'state')
                // console.log(`[Interpreter Debug] Executing function for ${robot.id}. Context keys:`, Object.keys(context));

                try {
                    // *** Execute the stored function for this tick ***
                    // We use .call() to explicitly set 'this' inside the function
                    // to be the sandbox context itself. This ensures that if the user
                    // writes `this.state.x = 1` it works as expected.
                    // Direct access `state.x = 1` also works because `state` is a global in the context.
                    tickFunction.call(context /*, arguments if any */);

                    // Note on Timeouts: The 'timeout' option in vm.Script applies to runInContext.
                    // When calling the function directly (.call), there's no built-in per-call timeout
                    // enforcement from the VM module itself in this simple setup.
                    // True per-tick timeout enforcement would require a more complex solution
                    // (like worker threads or interrupting VMs), which adds significant overhead.
                    // For now, we rely on the initial compile timeout and assume non-malicious code.

                } catch (error) {
                    // Handle runtime errors *inside* the robot's code during the call
                    console.error(`[Interpreter] Runtime error during function execution for robot ${robot.id}:`, error.message);
                    // Notify the client about the runtime error
                    const playerData = gameInstance.players.get(robot.id);
                    if (playerData && playerData.socket) {
                        playerData.socket.emit('codeError', {
                            robotId: robot.id,
                            message: `Runtime Error: ${error.message}`
                        });
                    }
                    // Optional: Consider disabling the robot after repeated errors?
                    // this.robotTickFunctions[robot.id] = null; // Example: disable after first error
                } finally {
                     // Important: Clear the current robot ID after its execution attempt
                     this.currentRobotId = null;
                }
            } // End if (robot should execute)
        }); // End robots.forEach

        // Clear the game instance context after all robots have executed for this tick
        this.currentGameInstance = null;
    } // End executeTick()

    // --- Safe API Methods ---
    // These remain unchanged. They bridge the sandbox call to the actual game logic.

    /** Safely retrieves the ServerRobot instance for the currently executing robot. @private */
    getCurrentRobot() {
        if (!this.currentRobotId || !this.currentGameInstance) return null;
        const data = this.currentGameInstance.players.get(this.currentRobotId);
        return data ? data.robot : null;
    }

    /** Safely delegates drive command. */
    safeDrive(robotId, direction, speed) {
        if (robotId !== this.currentRobotId) return;
        const robot = this.getCurrentRobot();
        if (robot && typeof direction === 'number' && typeof speed === 'number') {
            robot.drive(direction, speed);
        } else if (robot) {
            console.warn(`[Interpreter] Invalid drive(${direction}, ${speed}) call for robot ${robotId}`);
        }
    }

    /** Safely delegates scan command and returns result. */
    safeScan(robotId, direction, resolution) {
        if (robotId !== this.currentRobotId || !this.currentGameInstance) return null;
        const robot = this.getCurrentRobot();
        if (robot && typeof direction === 'number' && typeof resolution === 'number') {
            return this.currentGameInstance.performScan(robot, direction, resolution);
        } else if (robot) {
            console.warn(`[Interpreter] Invalid scan(${direction}, ${resolution}) call for robot ${robotId}`);
        }
        return null;
    }

    /** Safely delegates fire command and returns success/failure. */
    safeFire(robotId, direction, power) {
        if (robotId !== this.currentRobotId) return false;
        const robot = this.getCurrentRobot();
        if (robot && typeof direction === 'number') {
            return robot.fire(direction, power);
        } else if (robot) {
            console.warn(`[Interpreter] Invalid fire(${direction}, ${power}) call for robot ${robotId}`);
        }
        return false;
    }

    /** Safely retrieves robot damage. */
    safeDamage(robotId) {
        if (robotId !== this.currentRobotId) return 100;
        const robot = this.getCurrentRobot();
        return robot ? robot.damage : 100;
    }

    /** Safely retrieves robot X coordinate. */
    safeGetX(robotId) {
        if (robotId !== this.currentRobotId) return null;
        const robot = this.getCurrentRobot();
        return robot ? robot.x : null;
    }

    /** Safely retrieves robot Y coordinate. */
    safeGetY(robotId) {
        if (robotId !== this.currentRobotId) return null;
        const robot = this.getCurrentRobot();
        return robot ? robot.y : null;
    }

    /** Safely retrieves robot direction. */
    safeGetDirection(robotId) {
        if (robotId !== this.currentRobotId) return null;
        const robot = this.getCurrentRobot();
        return robot ? robot.direction : null;
    }

    /**
     * Cleans up interpreter state, called when the game ends.
     */
    stop() {
        console.log("[Interpreter] Stopping and cleaning up contexts/functions.");
        // Clear stored contexts and functions to release memory
        this.robotContexts = {};
        this.robotTickFunctions = {}; // Clear the stored functions
        this.currentRobotId = null;
        this.currentGameInstance = null;
    }
}

module.exports = ServerRobotInterpreter;
```

## server/server-robot.js

```code
// server/server-robot.js

/**
 * Represents a missile's state on the server.
 */
class ServerMissile {
    constructor(x, y, direction, speed, power, ownerId) {
        this.id = `m-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`; // Simple unique ID
        this.x = x;
        this.y = y;
        this.direction = direction; // degrees (0=East, 90=North)
        this.speed = speed; // units per second (needs scaling by deltaTime)
        this.power = power;
        this.ownerId = ownerId; // ID of the robot that fired it
        this.radius = 3 + power; // Size based on power
    }

    /**
     * Updates the missile's position based on its speed and direction.
     * @param {number} deltaTime - Time elapsed since the last tick in seconds.
     */
    update(deltaTime) {
        // Note: Increased multiplier for more noticeable movement per tick
        const moveSpeed = this.speed * deltaTime * 60; // Scale speed by time and a factor (adjust 60 if needed)
        const radians = this.direction * Math.PI / 180;
        this.x += Math.cos(radians) * moveSpeed;
        // Assuming server Y matches canvas (up is negative delta) for consistency:
        this.y -= Math.sin(radians) * moveSpeed;
    }
}


/**
 * Represents a Robot's state and behavior on the server side.
 * Managed by the GameInstance and manipulated by the ServerRobotInterpreter.
 * Includes properties for position, damage, appearance, etc.
 */
class ServerRobot {
    /**
     * Creates a new ServerRobot instance.
     * @param {string} id - Unique identifier (usually player's socket.id).
     * @param {number} x - Initial X coordinate.
     * @param {number} y - Initial Y coordinate.
     * @param {number} direction - Initial direction in degrees (0=East, 90=North).
     * @param {string} [appearance='default'] - Identifier for the robot's visual style.
     */
    constructor(id, x, y, direction, appearance = 'default') {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = direction; // Current direction (degrees)
        this.speed = 0; // Current actual speed
        this.targetSpeed = 0; // Speed requested by drive()
        this.targetDirection = direction; // Direction requested by drive()
        this._damage = 0; // Internal damage value (0-100)
        this.radius = 15; // Collision radius (can potentially vary by appearance later)
        this.color = this.generateColor(); // Assign a unique color based on ID
        this.cooldown = 0; // Weapon cooldown in ticks
        this.missiles = []; // Array of ServerMissile objects fired by this robot
        this.isAlive = true; // Flag indicating if the robot is active
        // Store the appearance identifier chosen by the player
        this.appearance = appearance;
    }

    /**
     * Public getter for the robot's current damage level.
     * @returns {number} The current damage (0-100).
     */
    get damage() {
        return this._damage;
    }

    /**
     * Generates a consistent color based on the robot's ID using HSL.
     * @returns {string} An HSL color string (e.g., "hsl(120, 70%, 50%)").
     */
    generateColor() {
        let hash = 0;
        for (let i = 0; i < this.id.length; i++) {
            hash = this.id.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash; // Convert to 32bit integer
        }
        const hue = Math.abs(hash % 360); // Ensure hue is positive
        // Use saturation=70%, lightness=50% for vibrant but not overly bright colors
        return `hsl(${hue}, 70%, 50%)`;
    }

    /**
     * Updates the robot's state for a single game tick.
     * Handles cooldown reduction, movement based on speed/direction,
     * arena boundary checks, and updating owned missiles.
     * @param {number} deltaTime - Time elapsed since the last tick in seconds.
     * @param {number} arenaWidth - The width of the game arena.
     * @param {number} arenaHeight - The height of the game arena.
     */
    update(deltaTime, arenaWidth, arenaHeight) {
        // Only update if the robot is alive
        if (!this.isAlive) return;

        // Update weapon cooldown (decrease by 1 each tick)
        if (this.cooldown > 0) {
            this.cooldown = Math.max(0, this.cooldown - 1);
        }

        // Apply target speed and direction set by drive() command instantly
        this.speed = this.targetSpeed;
        this.direction = this.targetDirection;

        // Update position if the robot is moving
        if (this.speed !== 0) {
            // Note: Increased multiplier for more noticeable movement per tick
            const moveSpeed = this.speed * deltaTime * 60; // Scale speed by time and factor (adjust 60 if needed)
            const radians = this.direction * Math.PI / 180;
            const dx = Math.cos(radians) * moveSpeed;
            const dy = Math.sin(radians) * moveSpeed; // Y direction depends on coordinate system

            let newX = this.x + dx;
            // Assuming server Y matches canvas (up is negative delta):
            let newY = this.y - dy;

            // --- START DEBUG LOGGING ---
            console.log(`[DEBUG ${this.id}] Pre-clamp: newX=${newX.toFixed(2)}, newY=${newY.toFixed(2)}, arenaW=${arenaWidth}, arenaH=${arenaHeight}, radius=${this.radius}`);
            // --- END DEBUG LOGGING ---

            // Clamp position to stay within arena boundaries, considering radius
            newX = Math.max(this.radius, Math.min(arenaWidth - this.radius, newX));
            newY = Math.max(this.radius, Math.min(arenaHeight - this.radius, newY));

            // Assign the clamped values
            this.x = newX;
            this.y = newY;

            // --- START DEBUG LOGGING ---
            console.log(`[DEBUG ${this.id}] Post-clamp: this.x=${this.x.toFixed(2)}, this.y=${this.y.toFixed(2)}`);
            // --- END DEBUG LOGGING ---

        } // End of if (this.speed !== 0)

        // Update all missiles fired by this robot
        for (let i = this.missiles.length - 1; i >= 0; i--) {
            const missile = this.missiles[i];
            missile.update(deltaTime);
            // Remove missile if it goes out of the arena boundaries
            // Check against 0 and arena dimensions for missile center
            if (missile.x < 0 || missile.x > arenaWidth || missile.y < 0 || missile.y > arenaHeight) {
                // console.log(`[${this.id}] Missile ${missile.id} went out of bounds.`); // Optional: Keep this log if needed
                this.missiles.splice(i, 1);
            }
        }
    } // End of update method

    // --- API Methods (Called via ServerRobotInterpreter's safe methods) ---

    /**
     * Sets the robot's target direction and speed.
     * @param {number} direction - Target direction in degrees (0=East, 90=North).
     * @param {number} speed - Target speed (-5 to 5).
     */
    drive(direction, speed) {
        if (!this.isAlive) return; // Dead robots don't drive

        // Normalize direction to be within [0, 360)
        this.targetDirection = ((Number(direction) % 360) + 360) % 360;
        // Clamp speed to defined limits
        this.targetSpeed = Math.max(-5, Math.min(5, Number(speed)));
    }

    /**
     * Fires a missile from the robot if cooldown allows.
     * @param {number} direction - Direction to fire in degrees (0=East, 90=North).
     * @param {number} [power=1] - Power of the missile (1-3), affecting speed, size, and cooldown.
     * @returns {boolean} True if the missile was successfully fired, false otherwise.
     */
    fire(direction, power = 1) {
        if (!this.isAlive || this.cooldown > 0) {
            return false; // Cannot fire if dead or cooling down
        }

        // Clamp power and calculate cooldown duration in ticks
        const clampedPower = Math.max(1, Math.min(3, Number(power)));
        this.cooldown = clampedPower * 10 + 10; // Example: Power 1=20 ticks, Power 3=40 ticks

        // Normalize firing direction
        const fireDirection = ((Number(direction) % 360) + 360) % 360;
        const radians = fireDirection * Math.PI / 180;
        const missileSpeed = 7 + clampedPower; // Base speed plus bonus from power
        const startOffset = this.radius + 5; // Start missile just outside the robot's radius

        // Calculate missile's starting position based on robot's center and direction
        const missileStartX = this.x + Math.cos(radians) * startOffset;
        const missileStartY = this.y - Math.sin(radians) * startOffset; // Assumes canvas-style Y

        // Create the new missile instance
        const missile = new ServerMissile(
            missileStartX,
            missileStartY,
            fireDirection,
            missileSpeed,
            clampedPower,
            this.id // Pass this robot's ID as the owner
        );

        // Add the missile to this robot's list (GameInstance will collect these for state/collisions)
        this.missiles.push(missile);
        // console.log(`[${this.id}] Fired missile towards ${fireDirection.toFixed(1)}`); // Debug log
        return true; // Missile fired successfully
    }

    /**
     * Applies damage to the robot. If damage reaches 100, marks the robot as dead.
     * @param {number} amount - The amount of damage to apply (non-negative).
     * @returns {boolean} True if this damage caused the robot to be destroyed, false otherwise.
     */
    takeDamage(amount) {
        if (!this.isAlive) return true; // Already dead, count as destroyed

        // Ensure damage amount is non-negative
        const damageAmount = Math.max(0, Number(amount));

        // Apply damage, capping at 100
        this._damage = Math.min(100, this._damage + damageAmount);

        // Check if the robot was destroyed by this damage
        if (this._damage >= 100) {
            this.isAlive = false; // Mark as destroyed
            this.speed = 0; // Stop all movement
            this.targetSpeed = 0;
            this.missiles = []; // Destroy any active missiles (optional, depends on game rules)
            console.log(`[${this.id}] Robot destroyed by ${damageAmount} damage!`);
            return true; // Was destroyed
        }
        return false; // Damaged but survived
    }
}

// Export the ServerRobot class for use in GameInstance and potentially elsewhere
module.exports = ServerRobot;
```

## server/socket-handler.js

```code
// server/socket-handler.js
const GameManager = require('./game-manager');

/**
 * Initializes Socket.IO event handlers for the application.
 * Manages player connections, disconnections, data submission, readiness signals, chat,
 * routes players to spectate if games are in progress, and sends initial game history. // <-- Added history mention
 * Delegates game logic to the GameManager.
 * @param {SocketIO.Server} io - The Socket.IO server instance.
 */
function initializeSocketHandler(io) {
    // Create a single instance of the GameManager to manage the application state
    const gameManager = new GameManager(io);

    // Handle new client connections
    io.on('connection', (socket) => {
        console.log(`New client connecting: ${socket.id}`);

        // Assign ID immediately (needed for client state & potential spectator join)
        socket.emit('assignId', socket.id);

        // --- SPECTATOR CHECK ---
        let wasSpectator = false; // Flag if routed to spectate initially
        if (gameManager.activeGames.size > 0) {
            // Simple logic: pick the first active game found
            try {
                const [gameId, gameInstance] = gameManager.activeGames.entries().next().value;
                const gameName = gameInstance.gameName || `Game ${gameId}`;
                const spectatorRoom = `spectator-${gameId}`;

                spectateTarget = { gameId, gameName };
                console.log(`[Socket ${socket.id}] Active game found ('${gameName}' - ${gameId}). Routing to spectate.`);

                // 1. Join the specific spectator room for this game
                socket.join(spectatorRoom);
                console.log(`[Socket ${socket.id}] Joined spectator room: ${spectatorRoom}`);

                // 2. Emit 'spectateStart' event to the connecting client ONLY
                socket.emit('spectateStart', { gameId: gameId, gameName: gameName });

                // 3. Notify lobby about spectator joining (optional)
                io.emit('lobbyEvent', { message: `Player ${socket.id.substring(0, 4)}... started spectating game '${gameName}'.` });

                // 4. DO NOT add to gameManager.pendingPlayers yet.
                wasSpectator = true; // Mark as routed to spectate

            } catch (error) {
                 console.error(`[Socket ${socket.id}] Error finding active game to spectate: ${error}. Adding to lobby instead.`);
                 // Fallback to normal lobby logic
                 gameManager.addPlayer(socket);
                 io.emit('lobbyEvent', { message: `Player ${socket.id.substring(0, 4)}... connected.` });
                 gameManager.broadcastLobbyStatus(); // Broadcast status after adding to lobby
            }

        } else {
            // --- NO ACTIVE GAMES - Proceed with Normal Lobby Logic ---
            console.log(`[Socket ${socket.id}] No active games. Adding to lobby.`);
            gameManager.addPlayer(socket);
            io.emit('lobbyEvent', { message: `Player ${socket.id.substring(0, 4)}... connected.` });
            gameManager.broadcastLobbyStatus(); // Broadcast status after adding to lobby
        }
        // --- END SPECTATOR CHECK ---


        // --- Send Initial Game History ---
        // Send *after* potential spectator routing or lobby add
        // Convert map values to an array, sort by endTime descending (newest first)
        const currentHistory = Array.from(gameManager.recentlyCompletedGames.values())
                                  .sort((a, b) => b.endTime - a.endTime);
        if (currentHistory.length > 0) {
            console.log(`[Socket ${socket.id}] Sending initial game history (${currentHistory.length} entries).`);
            socket.emit('gameHistoryUpdate', currentHistory); // Send only to new client
        }
        // --- End Initial History Send ---


        // Handle client disconnections
        socket.on('disconnect', () => {
            // Try to get player name *before* removing them from GameManager
            const playerName = gameManager.getPlayerName(socket.id) || socket.id.substring(0, 4)+'...';
            console.log(`Client disconnected: ${playerName} (${socket.id})`);

            // Remove the player from GameManager (handles pending, active games, playerGameMap)
            gameManager.removePlayer(socket.id);

            // Notify remaining clients about the disconnection using the retrieved name
            io.emit('lobbyEvent', { message: `Player ${playerName} disconnected.` });

            // Update lobby status counts for all remaining clients
            gameManager.broadcastLobbyStatus();
        });

        // Handle player submitting their code, appearance, and name (implicitly marks them as Ready)
        socket.on('submitPlayerData', (data) => {
            // --- Check if player is allowed to submit (must be in pendingPlayers) ---
            if (!gameManager.pendingPlayers.has(socket.id)) {
                const state = gameManager.playerGameMap.has(socket.id) ? 'in game' : 'spectating or unknown';
                console.warn(`[Socket ${socket.id}] Attempted to submit data while ${state}. Ignoring.`);
                socket.emit('lobbyEvent', { message: `Cannot submit data while ${state}.`, type: "error" });
                return;
            }
            // --- End check ---

            // Validate received data structure
            if (data && typeof data.code === 'string' && typeof data.appearance === 'string' && typeof data.name === 'string') {

                // Sanitize/validate name server-side
                const name = data.name.trim();
                const sanitizedName = name.substring(0, 24) || `Anon_${socket.id.substring(0,4)}`;
                const finalName = sanitizedName.replace(/<[^>]*>/g, ""); // Strip HTML tags

                console.log(`[Socket ${socket.id}] Received Player Data: Name='${finalName}', Appearance='${data.appearance}'`);

                // Pass validated data to GameManager to update player state and try matchmaking
                // GameManager will broadcast lobby status after trying to start a match.
                gameManager.handlePlayerCode(socket.id, data.code, data.appearance, finalName);

            } else {
                console.warn(`[Socket ${socket.id}] Received invalid playerData format:`, data);
                socket.emit('submissionError', { message: 'Invalid data format received by server.' });
            }
        });

        // Handle player explicitly marking themselves as "Not Ready"
        socket.on('playerUnready', () => {
            // --- Check if player is allowed to unready (must be in pendingPlayers) ---
             if (!gameManager.pendingPlayers.has(socket.id)) {
                 const state = gameManager.playerGameMap.has(socket.id) ? 'in game' : 'spectating or unknown';
                 console.warn(`[Socket ${socket.id}] Attempted to unready while ${state}. Ignoring.`);
                 socket.emit('lobbyEvent', { message: `Cannot unready while ${state}.`, type: "error" });
                 return;
             }
            // --- End check ---

            console.log(`[Socket ${socket.id}] Received 'playerUnready' signal.`);
            // Update player status in GameManager (will also broadcast status update)
            gameManager.setPlayerReadyStatus(socket.id, false);
        });

        // Handle incoming chat messages from a client
        socket.on('chatMessage', (data) => {
            if (data && typeof data.text === 'string') {
                // Get sender's current name from GameManager OR identify as spectator
                 let senderName = gameManager.getPlayerName(socket.id);
                 let isSpectator = false; // Flag to check if sender is likely a spectator

                 if (!senderName) {
                     // Check if they might be spectating by checking rooms they are in
                     const rooms = Array.from(socket.rooms);
                     if (rooms.length > 1) {
                         const spectatingRoom = rooms.find(room => room.startsWith('spectator-'));
                         if (spectatingRoom) {
                            senderName = `Spectator_${socket.id.substring(0,4)}`;
                            isSpectator = true;
                         }
                     }
                     if (!senderName) { senderName = `Player_${socket.id.substring(0,4)}`; } // Fallback
                 }

                // Trim and limit message length
                const messageText = data.text.trim().substring(0, 100);

                if (messageText) { // Ensure message isn't empty after trimming
                    // Basic sanitization
                    const sanitizedText = messageText.replace(/</g, "<").replace(/>/g, ">"); // Use HTML entities

                    console.log(`[Chat] ${senderName}: ${sanitizedText}`);

                    // Broadcast the sanitized chat message to ALL connected clients
                    io.emit('chatUpdate', {
                        sender: senderName,
                        text: sanitizedText,
                        isSpectator: isSpectator
                    });
                }
            } else {
                 console.warn(`[Socket ${socket.id}] Received invalid chat message format:`, data);
            }
        });

        // Listener for player actions during a game (currently unused placeholder)
        // socket.on('robotAction', (action) => {
        //     gameManager.handlePlayerAction(socket.id, action);
        // });

    }); // End io.on('connection')

    console.log("[Socket Handler] Initialized and listening for connections.");
}

module.exports = initializeSocketHandler;
```

