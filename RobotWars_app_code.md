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
    /* Use VT323 for the primary body text, adjust size carefully */
    font-family: 'VT323', monospace;
    font-size: 20px; /* STARTING POINT for VT323 - Tweak this! */
    /* --- End Retro Font --- */

    /* Keep modern dark theme */
    background-color: #1e1e1e;
    color: #e0e0e0;
    line-height: 1.6; /* Keep line-height for readability */
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
    /* Use Press Start 2P for the main title, significantly smaller size needed */
    font-family: 'Press Start 2P', cursive;
    font-size: 1.8rem; /* STARTING POINT for Press Start 2P - Tweak this! (Maybe 28px-32px?) */
    /* --- End Retro Font --- */

    /* Keep modern color */
    color: #4CAF50;
    /* Remove default H1 margin if the font adds too much space */
    margin: 0;
}

nav {
    display: flex;
    gap: 10px;
    align-items: center; /* Align items vertically */
}

/* Keep modern button and select styling */
button, select {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 16px; /* Keep original padding */
    border-radius: 4px; /* Keep rounded corners */
    cursor: pointer;
    transition: background-color 0.2s; /* Keep transition */

    /* --- 80s Retro Font --- */
    /* Apply VT323 font to buttons/selects */
    font-family: 'VT323', monospace;
    font-size: 15px; /* STARTING POINT - Slightly smaller than body maybe? Tweak this! */
    /* --- End Retro Font --- */
}

button:hover, select:hover {
    background-color: #45a049;
}

/* Keep modern select specific styling */
select {
    background-color: #333;
}

/* Style the new player name input similarly to the select */
input#playerName {
     /* --- 80s Retro Font --- */
    font-family: 'VT323', monospace;
    font-size: 15px; /* Match button/select size - Tweak this! */
     /* --- End Retro Font --- */

    background-color: #333;
    color: #e0e0e0;
    border: 1px solid #555; /* Subtle border */
    padding: 8px; /* Match button vertical padding */
    border-radius: 4px;
    margin-right: 5px; /* Keep spacing */
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
    /* align-items: center; */ /* Removed centering for now unless needed */
}

#arena {
    /* Keep modern arena styling */
    background-color: #2c2c2c;
    border: 2px solid #444;
    border-radius: 8px; /* Keep rounded corners */
    /* width: 100%; */ /* REMOVED - Let HTML attributes define the size (FIXED EARLIER) */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Keep subtle shadow */
    max-width: 100%; /* Keep responsiveness */
    /* Ensure canvas aligns well if container has padding/alignment */
    display: block; /* Helps prevent extra space below */
}

/* Keep modern stats panel styling */
.stats-panel {
    background-color: #333;
    padding: 15px;
    border-radius: 8px; /* Keep rounded corners */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Keep subtle shadow */
}

/* Apply retro font to panel titles */
.stats-panel h3, .editor-container h3, .api-help h4 {
     /* --- 80s Retro Font --- */
    font-family: 'VT323', monospace; /* Use VT323 */
    font-size: 18px; /* Slightly larger than body - Tweak this! */
     /* --- End Retro Font --- */
     margin-bottom: 10px; /* Add some space below titles */
     color: #4CAF50; /* Match header color accent */
}

.editor-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.CodeMirror {
    height: 400px;
    border-radius: 8px; /* Keep rounded corners */

    /* --- 80s Retro Font --- */
    font-family: 'VT323', monospace; /* Use VT323 for code */
    font-size: 16px; /* STARTING POINT for code - Readability is key, tweak this! */
    /* --- End Retro Font --- */

    /* Ensure the theme provides background/text color */
    /* Assuming theme: 'monokai' handles the rest */
}

/* Keep modern API help styling */
.api-help {
    background-color: #333;
    padding: 15px;
    border-radius: 8px; /* Keep rounded corners */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Keep subtle shadow */
}

.api-help ul {
    list-style-position: inside; /* Keep bullets neat */
    padding-left: 5px;
}

.api-help li {
    margin-bottom: 5px; /* Space out API items */
}

/* Style code snippets within API help */
.api-help code {
    /* --- 80s Retro Font --- */
    /* Use VT323 here too for consistency */
    font-family: 'VT323', monospace;
    /* font-size: 15px; */ /* Inherit size or slightly smaller */
    /* --- End Retro Font --- */

    background-color: #444; /* Keep modern snippet style */
    padding: 2px 4px;
    border-radius: 3px; /* Keep subtle rounding */
    color: #f0f0f0; /* Lighter color for code */
}

/* Keep modern responsive design */
@media (max-width: 900px) {
    main {
        grid-template-columns: 1fr;
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
 * and renders the game arena based on server information.
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
        this.gameId = null; // ID of the current server game instance
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

        this.lastServerState = gameState;
        this.gameId = gameState.gameId;

        // --- Update Robots ---
        if (gameState.robots) {
            // Map server robot data to simple objects for rendering, including appearance and name
            this.robots = gameState.robots.map(serverRobotData => ({
                id: serverRobotData.id,
                x: serverRobotData.x,
                y: serverRobotData.y,
                direction: serverRobotData.direction,
                damage: serverRobotData.damage,
                color: serverRobotData.color,
                isAlive: serverRobotData.isAlive,
                radius: 15, // Assuming fixed radius for client rendering logic
                appearance: serverRobotData.appearance || 'default', // Store appearance
                // --- Corrected: Copy the name property from server data ---
                name: serverRobotData.name || 'Unknown' // Copy name, fallback if missing
                // --- End Correction ---
            }));
            // Update the Arena's list so it can draw them using the correct appearance and name
            // Check if arena exists before trying to update it
            if (this.arena) {
                this.arena.robots = this.robots;
            }
        } else {
            // If no robot data, clear local list and arena's list
            this.robots = [];
            if (this.arena) {
                 this.arena.robots = [];
            }
        }

        // --- Update Missiles ---
        // Store the missile data locally; Arena's draw() method will render them
        if (gameState.missiles) {
            this.missiles = gameState.missiles.map(serverMissileData => ({
                id: serverMissileData.id,
                x: serverMissileData.x,
                y: serverMissileData.y,
                radius: serverMissileData.radius,
                // Note: Color is applied by Arena.drawMissiles
            }));
        } else {
            // If no missile data, clear local list
            this.missiles = [];
        }

        // --- Trigger Client-Side Explosions ---
        // Check if the server sent any explosion events this tick
        if (this.arena && gameState.explosions && gameState.explosions.length > 0) {
            gameState.explosions.forEach(expData => {
                // Tell the Arena instance to create the visual effect
                if (typeof this.arena.createExplosion === 'function') {
                    // console.log(`Client creating visual explosion for event ${expData.id}`); // Debug log
                    this.arena.createExplosion(expData.x, expData.y, expData.size);
                }
            });
        }

        // --- Update UI Elements (Dashboard) ---
        if (window.dashboard && typeof window.dashboard.updateStats === 'function') {
            // Pass the current robot data (which includes name, damage, status) to the dashboard
            window.dashboard.updateStats(this.robots);
        }
    }

    /**
     * The main client-side rendering loop. Runs via requestAnimationFrame.
     * Delegates the actual drawing work to the Arena's draw() method.
     */
    clientRenderLoop() {
        // Stop the loop if the game is no longer marked as running
        if (!this.running) return;

        // Ensure arena exists before attempting to draw
        if (this.arena) {
            // 1. Ask the Arena to draw everything based on the current state
            this.arena.draw();
        } else {
             // If arena doesn't exist, stop the loop to prevent errors
             console.error("Render loop cannot run because Arena object is missing.");
             this.stop();
             return;
        }

        // 2. Request the next frame to continue the animation loop
        this.animationFrame = requestAnimationFrame(this.clientRenderLoop.bind(this));
    }

    /**
     * Starts the client-side rendering loop.
     * Typically called when the 'gameStart' event is received from the server.
     */
    startRenderLoop() {
        if (this.running) return; // Prevent starting multiple loops
        // Prevent starting if arena failed to initialize
        if (!this.arena) {
             console.error("Cannot start render loop because Arena is not initialized.");
             return;
        }
        console.log("Starting client render loop...");
        this.running = true;
        this.clientRenderLoop(); // Initiate the animation loop
    }

    /**
     * Stops the client-side rendering loop.
     * Typically called on disconnection or when 'gameOver' is received from the server.
     */
    stop() {
        if (!this.running) return;
        console.log("Stopping client render loop.");
        this.running = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame); // Stop requesting new frames
            this.animationFrame = null;
        }
    }

    // --- Game Lifecycle Handlers (Called by network.js based on server events) ---

    /**
     * Handles the 'gameStart' event from the server. Prepares the client for the match.
     * @param {object} data - Data associated with the game start (e.g., game ID, player list with names/appearances).
     */
    handleGameStart(data) {
        console.log("Game Start signal received:", data);
        this.gameId = data.gameId;

        // Reset local state from any previous game only if arena exists
        if (this.arena) {
            this.arena.explosions = []; // Clear visual effects in arena
        }
        this.missiles = []; // Clear missile list in game state
        this.robots = []; // Clear robot list
        if (this.arena) {
            this.arena.robots = []; // Clear arena's robot list
        }
        this.lastServerState = null; // Clear last known state

        // Log players in the game
        if (data.players) {
            console.log("Players in this game:", data.players.map(p => `${p.name} (${p.appearance})`).join(', '));
        }

        // Start rendering the game now that it's begun
        this.startRenderLoop();

        // Update UI elements to reflect the "in-game" state
        // Note: controls.js setReadyState(true) might have already done this,
        // but this ensures consistency if game starts unexpectedly.
        const readyButton = document.getElementById('btn-ready');
        const appearanceSelect = document.getElementById('robot-appearance-select');
        const playerNameInput = document.getElementById('playerName');
        if (readyButton) {
            readyButton.textContent = "Game in Progress...";
            readyButton.disabled = true; // Disable ready/unready during game
             // Optional: change color to indicate locked state
             // readyButton.style.backgroundColor = '#555';
        }
        if (appearanceSelect) {
            appearanceSelect.disabled = true;
        }
         if (playerNameInput) {
             playerNameInput.disabled = true;
         }
        // Consider making editor read-only during game
        // if (typeof editor !== 'undefined') editor.setOption("readOnly", true);
    }

    /**
     * Handles the 'gameOver' event from the server. Cleans up the client state and UI.
     * @param {object} data - Data associated with the game end (e.g., reason, winnerId, winnerName).
     */
    handleGameOver(data) {
        console.log("Game Over signal received:", data);
        this.stop(); // Stop the rendering loop

        // --- Updated Winner Display ---
        // Use winnerName if provided by the server, otherwise fallback to ID or 'None'.
        let winnerDisplayName = 'None'; // Default
        if (data.winnerName) {
            winnerDisplayName = data.winnerName; // Use the name if available
        } else if (data.winnerId) {
            // Fallback to partial ID if name is missing but ID is present
            winnerDisplayName = `ID: ${data.winnerId.substring(0, 6)}...`;
        }
        const message = `Game Over! ${data.reason || 'Match ended.'} Winner: ${winnerDisplayName}`;
        alert(message); // Display name (or fallback) in alert
        // --- End Updated Winner Display ---

        // --- Reset UI Elements using Controls helper ---
        // Ensure the global 'controls' object exists and reset its state
        if (typeof controls !== 'undefined' && typeof controls.setReadyState === 'function') {
            controls.setReadyState(false); // Reset button text/state and enable inputs
        } else {
            // Fallback if 'controls' object isn't available (shouldn't happen)
            console.warn("Controls object not found, attempting manual UI reset for game over.");
            const readyButton = document.getElementById('btn-ready');
            const appearanceSelect = document.getElementById('robot-appearance-select');
            const playerNameInput = document.getElementById('playerName');
            const sampleCodeSelect = document.getElementById('sample-code');
            const editorIsAvailable = typeof editor !== 'undefined';

            if (readyButton) { readyButton.textContent = "Ready Up"; readyButton.disabled = false; readyButton.style.backgroundColor = '#4CAF50'; }
            if (appearanceSelect) { appearanceSelect.disabled = false; }
            if (playerNameInput) { playerNameInput.disabled = false; }
            if (sampleCodeSelect) { sampleCodeSelect.disabled = false; }
            if (editorIsAvailable) editor.setOption("readOnly", false);
        }
        // --- End Reset UI Elements ---

        // Update lobby status (Network listener also does this, potentially redundant but safe)
        if (typeof updateLobbyStatus === 'function') {
             updateLobbyStatus('Game Over. Ready Up for another match!');
        }

        // Optional: Clear the display after a short delay if desired
        // setTimeout(() => {
        //      if(this.arena) this.arena.clear(); // Clear canvas if arena exists
        //      if(window.dashboard) window.dashboard.updateStats([]); // Clear dashboard
        // }, 2000);
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
 * Manages button interactions (Ready Up/Unready, Reset), code loading, appearance selection,
 * and player name input, sending relevant data/signals to the server via the network handler.
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
        // Client-side flag to track if the user *thinks* they are ready
        this.isClientReady = false;
        if (!this.game || !this.network) {
             console.error("Controls initialized without valid game or network reference!");
        }
        this.setupEventListeners();
        this.loadPlayerName(); // Load saved name on init
        console.log('Controls initialized with game and network references');
    }

    /**
     * Sets up event listeners for UI elements like buttons and selects.
     */
    setupEventListeners() {
        // Get references to the DOM elements, using the new ID for the ready button
        const readyButton = document.getElementById('btn-ready'); // Changed ID from btn-run
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
                alert("Cannot connect to the server. Please check connection and refresh.");
                return;
            }

            // Toggle ready state
            if (!this.isClientReady) {
                // --- Action: Ready Up ---
                console.log('Ready Up button clicked');

                // Validate inputs before sending
                const playerCode = (typeof editor !== 'undefined') ? editor.getValue() : '';
                if (!playerCode) { alert("Code editor is empty!"); return; }

                const nameValue = playerNameInput.value.trim();
                if (!nameValue) { alert("Please enter a player name."); return; }

                const finalPlayerName = nameValue; // Already trimmed
                const chosenAppearance = appearanceSelect.value || 'default';

                // Save name locally
                this.savePlayerName(finalPlayerName);

                // Send data to server (server will mark player as ready)
                this.network.sendCodeAndAppearance(playerCode, chosenAppearance, finalPlayerName);

                // Update UI immediately to waiting state
                this.setReadyState(true); // Use helper to update UI

            } else {
                // --- Action: Unready ---
                console.log('Unready button clicked');

                // Send signal to server to mark as unready
                this.network.sendUnreadySignal(); // Call network function

                // Update UI immediately back to unready state
                this.setReadyState(false); // Use helper to update UI
            }
        });

        // --- Reset Button Listener ---
        resetButton.addEventListener('click', () => {
            console.log('Reset button clicked');

            // If client was ready, send unready signal to server
            if (this.isClientReady) {
                 if (this.network && this.network.socket && this.network.socket.connected) {
                    this.network.sendUnreadySignal();
                 }
            }

            // Force UI and client state back to unready/editable
            this.setReadyState(false);

            // Clear the local canvas presentation
            if (this.game.arena) {
                this.game.arena.clear(); // Clears and draws background/grid
            }

            // Reset robot stats display locally
            if (window.dashboard) {
                 window.dashboard.updateStats([]); // Clear stats panel
            }

             // Notify user in log
             if (typeof window.addEventLogMessage === 'function') {
                 window.addEventLogMessage('UI and ready status reset.', 'info');
             }
             // Optionally clear code editor?
             // if (typeof editor !== 'undefined') editor.setValue('');
        });

        // --- Sample Code Loader Listener ---
        sampleCodeSelect.addEventListener('change', function() { // Using function for 'this' context
            const sample = this.value;
            // Check if the loadSampleCode function exists (defined in editor.js)
            if (sample && typeof loadSampleCode === 'function') {
                loadSampleCode(sample);

                // If client was ready, loading new code should make them unready
                if (this.isClientReady) {
                     // Send unready signal to server since code changed
                     if (this.network && this.network.socket && this.network.socket.connected) {
                        this.network.sendUnreadySignal();
                     }
                     // Update UI locally
                     this.setReadyState(false);
                     if (typeof window.addEventLogMessage === 'function') {
                         window.addEventLogMessage('Loaded sample code. Status set to Not Ready.', 'info');
                     }
                }
            }
        }.bind(this)); // Bind 'this' to access Controls instance state

        // --- Player Name Persistence Listener ---
        // Save name when the input loses focus
        playerNameInput.addEventListener('blur', () => {
            this.savePlayerName(playerNameInput.value.trim());
        });

    } // End setupEventListeners


    /**
     * Helper function to manage UI element states based on readiness.
     * @param {boolean} isReady - The desired ready state.
     */
    setReadyState(isReady) {
        this.isClientReady = isReady; // Update the internal flag

        // Get elements
        const readyButton = document.getElementById('btn-ready');
        const appearanceSelect = document.getElementById('robot-appearance-select');
        const playerNameInput = document.getElementById('playerName');
        const sampleCodeSelect = document.getElementById('sample-code');
        const editorIsAvailable = typeof editor !== 'undefined';

        // Update UI based on the state
        if (isReady) {
            // Set UI to "Waiting / Unready" state
            if (readyButton) {
                readyButton.textContent = "Waiting... (Click to Unready)";
                readyButton.style.backgroundColor = '#FFA500'; // Orange indicator
                readyButton.disabled = false; // Keep button enabled to allow unreadying
            }
            // Disable other inputs
            if (appearanceSelect) appearanceSelect.disabled = true;
            if (playerNameInput) playerNameInput.disabled = true;
            if (sampleCodeSelect) sampleCodeSelect.disabled = true;
            if (editorIsAvailable) editor.setOption("readOnly", true); // Make editor read-only
        } else {
            // Set UI to "Not Ready / Ready Up" state
            if (readyButton) {
                readyButton.textContent = "Ready Up";
                readyButton.style.backgroundColor = '#4CAF50'; // Green indicator
                readyButton.disabled = false; // Button is always enabled unless game in progress
            }
            // Enable other inputs
            if (appearanceSelect) appearanceSelect.disabled = false;
            if (playerNameInput) playerNameInput.disabled = false;
            if (sampleCodeSelect) sampleCodeSelect.disabled = false;
            if (editorIsAvailable) editor.setOption("readOnly", false); // Make editor editable
        }
    }


    /**
     * Saves the player name to localStorage.
     * @param {string} name - The name to save.
     */
    savePlayerName(name) {
        if (typeof localStorage !== 'undefined') {
            // Avoid saving empty string or just whitespace
            if (name && name.trim()) {
                localStorage.setItem('robotWarsPlayerName', name.trim());
            } else {
                // Optionally clear if name is empty
                // localStorage.removeItem('robotWarsPlayerName');
            }
        }
    }

    /**
     * Loads the player name from localStorage and populates the input field.
     */
    loadPlayerName() {
        const playerNameInput = document.getElementById('playerName');
        if (playerNameInput && typeof localStorage !== 'undefined') {
            const savedName = localStorage.getItem('robotWarsPlayerName');
            if (savedName) {
                playerNameInput.value = savedName;
                console.log('Player name loaded:', savedName);
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
        if (!this.statsPanel) {
            console.error("Dashboard stats panel element '#robot-stats' not found!");
        } else {
            console.log('Dashboard initialized');
        }
    }

    /**
     * Update robot stats display based on the provided robot data.
     * @param {Array<object>} robots - Array of robot data objects received from the server state.
     *                                  Each object should have id, name, damage, color, isAlive.
     */
    updateStats(robots) {
        // Guard against missing panel or invalid input
        if (!this.statsPanel || !Array.isArray(robots)) {
            // Optionally clear the panel if robots array is invalid/empty
            if (this.statsPanel) this.statsPanel.innerHTML = '<div>No robot data available.</div>';
            return;
        }

        let statsHTML = '';

        if (robots.length === 0) {
            statsHTML = '<div>Waiting for game to start...</div>';
        } else {
            robots.forEach(robot => {
                // Default values and checks for robustness
                const damageValue = (typeof robot.damage === 'number') ? robot.damage : 100; // Assume max damage if invalid
                const isAlive = robot.isAlive !== undefined ? robot.isAlive : (damageValue < 100); // Derive if needed

                const status = isAlive ? 'Active' : 'Destroyed';
                const statusColor = isAlive ? '#2ecc71' : '#e74c3c'; // Green for active, Red for destroyed

                // Safely get Robot Name or fallback to ID
                let robotIdDisplay = '????'; // Default if ID is missing/invalid
                if (robot.id && typeof robot.id === 'string') {
                    robotIdDisplay = robot.id.substring(0, 4); // Get first 4 chars of ID
                }
                const robotName = robot.name || `ID: ${robotIdDisplay}...`; // Use name or fallback ID display

                // Safely format damage percentage
                const damageDisplay = (typeof robot.damage === 'number') ? robot.damage.toFixed(0) : 'N/A';

                // Construct HTML for this robot's stats
                statsHTML += `
                    <div class="robot-stat" style="border-left: 3px solid ${robot.color || '#888'}; margin-bottom: 10px; padding: 5px;">
                        <div><strong>${robotName}</strong></div>
                        <div>Damage: ${damageDisplay}%</div>
                        <div>Status: <span style="color: ${statusColor}">${status}</span></div>
                    </div>
                `;
            });
        }

        // Update the panel content
        this.statsPanel.innerHTML = statsHTML;
    }
}

// Initialize dashboard when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the dashboard object is created and attached to window for global access
    window.dashboard = new Dashboard();
    // Clear stats initially or show a waiting message
    if(window.dashboard) {
         window.dashboard.updateStats([]); // Pass empty array to show initial message
    }
});
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
 * receives game state updates, and handles lobby/chat events.
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
            this.socket = io(); // Connects to the server that served the page by default

            // --- Socket.IO Event Listeners ---

            // On successful connection
            this.socket.on('connect', () => {
                console.log('Successfully connected to server with Socket ID:', this.socket.id);
                // Notify UI about connection status
                if (typeof window.updateLobbyStatus === 'function') {
                    window.updateLobbyStatus('Connected. Enter name & code, then Ready Up!');
                }
                 // Clear log on connect and add welcome message
                 if (typeof window.clearEventLog === 'function') window.clearEventLog();
                 if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage("Welcome! Connect to chat and wait for players...", "info");
                 }
            });

            // On disconnection from the server
            this.socket.on('disconnect', (reason) => {
                console.warn('Disconnected from server:', reason);
                if (this.game) {
                    this.game.stop(); // Stop rendering if disconnected
                    // Also reset client ready state if disconnected unexpectedly
                    if (typeof controls !== 'undefined' && typeof controls.setReadyState === 'function') {
                         controls.setReadyState(false);
                    }
                }
                // Update UI
                 if (typeof window.updateLobbyStatus === 'function') {
                     window.updateLobbyStatus(`Disconnected: ${reason}`);
                 }
                 if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`Disconnected from server: ${reason}`, 'error');
                 }
                alert("Disconnected from server: " + reason);
                // Attempt to reset UI state (redundant if setReadyState(false) worked)
                // const runButton = document.getElementById('btn-ready'); // Use correct ID
                // const appearanceSelect = document.getElementById('robot-appearance-select');
                // const playerNameInput = document.getElementById('playerName');
                // if (runButton) { runButton.textContent = "Ready Up"; runButton.disabled = false; runButton.style.backgroundColor = '#4CAF50'; }
                // if (appearanceSelect) { appearanceSelect.disabled = false; }
                // if (playerNameInput) { playerNameInput.disabled = false; }
            });

            // Server assigns a unique ID to this client
            this.socket.on('assignId', (id) => {
                console.log('Server assigned Player ID:', id);
                this.playerId = id;
                if (this.game && typeof this.game.setPlayerId === 'function') {
                    this.game.setPlayerId(id);
                }
            });

            // Receives game state updates from the server during the match
            this.socket.on('gameStateUpdate', (gameState) => {
                if (this.game && typeof this.game.updateFromServer === 'function') {
                     this.game.updateFromServer(gameState);
                }
            });

            // Server signals that the game is starting
            this.socket.on('gameStart', (data) => {
                 if (this.game && typeof this.game.handleGameStart === 'function') {
                     this.game.handleGameStart(data);
                 }
                 // Update lobby status - Game class handleGameStart should update button text now
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Game in progress...');
                 // The game object should ideally handle UI state changes related to game start
                 // if (typeof controls !== 'undefined' && typeof controls.setReadyState === 'function') {
                 //    controls.setReadyState(true); // Visually lock controls? Or let game.js handle?
                 // }
             });

            // Server signals that the game has ended
             this.socket.on('gameOver', (data) => {
                 // Game class handleGameOver should reset UI state, including ready state
                 if (this.game && typeof this.game.handleGameOver === 'function') {
                     this.game.handleGameOver(data);
                 }
                 // Update lobby status after game over
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Game Over. Ready Up for another match!');
             });

            // Server reports an error in the robot's code (compilation or runtime)
            this.socket.on('codeError', (data) => {
                console.error(`Received Code Error for Robot ${data.robotId}:`, data.message);
                // Add error to event log
                if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`Code Error (Robot ${data.robotId.substring(0,4)}...): ${data.message}`, 'error');
                }
                // Display error to the user if it's their robot
                if (data.robotId === this.playerId) {
                     alert(`Your Robot Code Error:\n${data.message}\n\nYou might need to reset and fix your code.`);
                     // Re-enable controls after a code error so they can fix and resubmit
                     // Use the controls helper function if possible
                     if (typeof controls !== 'undefined' && typeof controls.setReadyState === 'function') {
                         controls.setReadyState(false);
                     } else { // Fallback
                         const readyButton = document.getElementById('btn-ready');
                         const appearanceSelect = document.getElementById('robot-appearance-select');
                         const playerNameInput = document.getElementById('playerName');
                         if (readyButton) { readyButton.textContent = "Ready Up"; readyButton.disabled = false; readyButton.style.backgroundColor = '#4CAF50';}
                         if (appearanceSelect) { appearanceSelect.disabled = false; }
                         if (playerNameInput) { playerNameInput.disabled = false; }
                     }
                     if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Code error detected. Please fix and Ready Up again.');
                 }
            });

            // Handle connection errors (e.g., server is down)
            this.socket.on('connect_error', (err) => {
                console.error("Connection Error:", err.message, err);
                 if (typeof window.updateLobbyStatus === 'function') {
                     window.updateLobbyStatus(`Connection Failed: ${err.message}`);
                 }
                 if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`Connection Error: ${err.message}`, 'error');
                 }
                alert("Failed to connect to the game server. Please ensure it's running and refresh the page.");
                // Reset UI elements if connection fails initially
                if (typeof controls !== 'undefined' && typeof controls.setReadyState === 'function') {
                     controls.setReadyState(false);
                 }
            });


            // --- Lobby/Chat Event Listeners ---
            this.socket.on('lobbyEvent', (data) => {
                // Check if the global function exists before calling
                if (data && data.message && typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(data.message, data.type || 'event'); // Use type if provided by server
                }
            });

            this.socket.on('lobbyStatusUpdate', (data) => {
                // Check if the global function exists before calling
                if (data && typeof window.updateLobbyStatus === 'function') {
                    let statusText = `Waiting: ${data.waiting !== undefined ? data.waiting : 'N/A'}`;
                    if (data.ready !== undefined) {
                        // Display ready count relative to required players (assuming 2)
                        statusText += ` / Ready: ${data.ready}/2`;
                    }
                     window.updateLobbyStatus(statusText); // Update the status display
                }
            });

            this.socket.on('chatUpdate', (data) => {
                // Check if the global function exists before calling
                if (data && data.sender && data.text && typeof window.addEventLogMessage === 'function') {
                    // Format chat message differently in the log
                    window.addEventLogMessage(`${data.sender}: ${data.text}`, 'chat'); // Use 'chat' type styling
                }
            });
            // --- End Lobby/Chat Listeners ---


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
     * The server handles setting the player's ready state upon receiving this.
     * @param {string} code - The robot AI code written by the player.
     * @param {string} appearance - The identifier for the chosen robot appearance.
     * @param {string} name - The player's chosen name.
     */
    sendCodeAndAppearance(code, appearance, name) {
        // Ensure the socket exists and is connected before attempting to send
        if (!this.socket || !this.socket.connected) {
             console.error("Socket not available or not connected. Cannot send player data.");
             alert("Not connected to server. Please check connection and try again.");
             // Reset button state locally if send fails
             if (typeof controls !== 'undefined' && typeof controls.setReadyState === 'function') {
                controls.setReadyState(false);
             }
             return;
        }

        console.log(`Sending player data to server: { name: '${name}', appearance: '${appearance}', code: ... }`);
        // Emit a 'submitPlayerData' event with an object containing all data
        this.socket.emit('submitPlayerData', {
             code: code,
             appearance: appearance,
             name: name // Include the name field
        });
    }

    /**
     * Sends a signal to the server indicating the player is no longer ready.
     * Called by the Controls class when the 'Unready' button is clicked or state changes.
     */
    sendUnreadySignal() {
        if (!this.socket || !this.socket.connected) {
            console.error("Socket not connected. Cannot send unready signal.");
            // Optionally add message to event log
            if(typeof window.addEventLogMessage === 'function') {
                window.addEventLogMessage("Cannot unready: Not connected.", "error");
            }
            return;
        }
        console.log("Sending 'playerUnready' signal to server.");
        this.socket.emit('playerUnready'); // Emit the specific event
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
                <input type="text" id="playerName" placeholder="Enter Name" style="padding: 8px; border-radius: 4px; border: 1px solid #555; background: #333; color: #e0e0e0; margin-right: 5px;">
                <!-- End Player Name Input -->

                <select id="robot-appearance-select" title="Choose Robot Appearance">
                    <option value="default">Default Bot</option>
                    <option value="tank">Tank Bot</option>
                    <option value="spike">Spike Bot</option>
                    <option value="tri">Tri Bot</option>
                    <!-- Add more options later -->
                </select>
                <button id="btn-ready">Ready Up</button>
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
                    <div id="robot-stats">
                        <!-- Stats will be populated by dashboard.js -->
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
                        <li><code>damage()</code> - Get current damage level</li>
                        <!-- Add new API methods if any -->
                        <li><code>getX()</code> - Get current X coordinate</li>
                        <li><code>getY()</code> - Get current Y coordinate</li>
                        <li><code>getDirection()</code> - Get current direction</li>
                    </ul>
                </div>
            </div>
        </main>

        <!-- Placeholder for Lobby/Chat elements - Add these next -->
        <div id="lobby-area" style="margin-top: 20px; background: #333; padding: 15px; border-radius: 8px;">
             <h3 style="font-family: 'VT323', monospace; font-size: 18px; color: #4CAF50; margin-bottom: 10px;">Lobby Status</h3>
             <div id="lobby-status" style="margin-bottom: 10px;">Connecting...</div>
             <div id="event-log" style="height: 150px; overflow-y: scroll; border: 1px solid #555; margin-bottom: 10px; padding: 5px; background: #222; font-size: 14px; font-family: 'VT323', monospace;">Event Log Loading...</div>
             <div id="chat-area" style="display: flex; gap: 5px;">
                 <input type="text" id="chat-input" placeholder="Enter chat message..." style="flex-grow: 1; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #2a2a2a; color: #e0e0e0; font-family: 'VT323', monospace; font-size: 14px;">
                 <button id="send-chat" style="background-color: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: 'VT323', monospace; font-size: 15px;">Send</button>
             </div>
        </div>
        <!-- End Lobby/Chat elements -->

    </div> <!-- End .container -->

    <!-- Socket.IO -->
    <script src="/socket.io/socket.io.js"></script>
    <!-- Other Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/javascript/javascript.min.js"></script>

    <!-- Game Engine -->
    <script src="js/engine/arena.js"></script>
    <!-- Note: engine/robot.js, interpreter.js, collision.js are likely unused on client now -->
    <!-- <script src="js/engine/robot.js"></script> -->
    <!-- <script src="js/engine/interpreter.js"></script> -->
    <!-- <script src="js/engine/collision.js"></script> -->
    <script src="js/engine/game.js"></script>

    <!-- UI Components -->
    <script src="js/ui/editor.js"></script>
    <script src="js/ui/dashboard.js"></script>
    <script src="js/ui/controls.js"></script>
    <script src="js/ui/lobby.js"></script>

    <!-- Network Handler -->
    <script src="js/network.js"></script>

    <!-- Main Application -->
    <script src="js/main.js"></script> <!-- This should be last -->
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
 * and notifies the GameManager upon game completion via a callback.
 */
class GameInstance {
    /**
     * Creates a new game instance.
     * @param {string} gameId - A unique identifier for this game.
     * @param {SocketIO.Server} io - The main Socket.IO server instance.
     * @param {Array<{socket: SocketIO.Socket, code: string, appearance: string, name: string, isReady: boolean}>} playersData - Array of player data.
     * @param {Function} gameOverCallback - Function provided by GameManager to call when the game ends. Expects winnerData object.
     */
    constructor(gameId, io, playersData, gameOverCallback) { // Added gameOverCallback parameter
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

        console.log(`[${gameId}] Initializing Game Instance...`);

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

            console.log(`[${gameId}] Added player ${playerData.name} (${playerData.socket.id}) (Appearance: ${playerData.appearance}) with Robot ${robot.id}`);

            // Add the player's socket to the dedicated Socket.IO room for this game
            playerData.socket.join(this.gameId);
            console.log(`[${gameId}] Player ${playerData.name} joined Socket.IO room.`);
        });

        // Initialize the interpreter AFTER all robots and player data are set up
        // Pass the players map which now includes the name for potential use in error messages etc.
        this.interpreter.initialize(this.robots, this.players);

        console.log(`[${gameId}] Game Instance Initialization complete.`);
    }

    /**
     * Starts the main game loop interval.
     */
    startGameLoop() {
        console.log(`[${this.gameId}] Starting game loop (Tick Rate: ${TICK_RATE}/s).`);
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
        console.log(`[${this.gameId}] Stopping game loop.`);
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
        this.interpreter.stop(); // Clean up interpreter state
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
                robot.update(deltaTime, ARENA_WIDTH, ARENA_HEIGHT);
            });

            // 3. Check for and Resolve Collisions
            this.collisionSystem.checkAllCollisions();

            // 4. Check for Game Over Condition
            if (this.checkGameOver()) {
                // checkGameOver calls stopGameLoop and notifies clients/GameManager if true
                return; // Exit tick processing early as the game has ended
            }

            // --- State Broadcasting ---
            // 5. Gather the current state of all entities for clients.
            const gameState = this.getGameState();
            // 6. Broadcast the state to all clients in this game's room.
            this.io.to(this.gameId).emit('gameStateUpdate', gameState);

        } catch (error) {
             console.error(`[${this.gameId}] CRITICAL ERROR during tick:`, error);
             // Consider stopping the game or notifying players
             // this.stopGameLoop();
             // this.io.to(this.gameId).emit('gameError', { message: 'Critical server error during game tick.' });
        }
    }

    /**
     * Checks if the game has reached an end condition (e.g., only one robot left alive).
     * If the game is over, it stops the loop, notifies clients in the game room,
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
                winnerId: winnerRobot ? winnerRobot.id : null,
                winnerName: winnerRobot ? winnerRobot.name : 'None', // Get name from robot instance
                reason: winnerRobot ? "Last robot standing!" : "Mutual Destruction!"
            };

            console.log(`[${this.gameId}] Game Over detected. Reason: ${winnerData.reason}. Winner: ${winnerData.winnerName} (${winnerData.winnerId || 'N/A'})`);

            // Notify clients *in this game room* directly about the game end
            this.io.to(this.gameId).emit('gameOver', winnerData);

            // Call the GameManager callback to handle lobby events etc.
            if (typeof this.gameOverCallback === 'function') {
                this.gameOverCallback(winnerData); // Notify GameManager
            } else {
                console.warn(`[${this.gameId}] gameOverCallback is not a function!`);
            }

            // Stop the simulation loop for this game instance.
            this.stopGameLoop();
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
    }

    /**
     * Gathers the current state of the game (robots, missiles, effects)
     * into a serializable object suitable for broadcasting to clients via Socket.IO.
     * @returns {object} The current game state snapshot.
     */
    getGameState() {
        // Collect all active missiles from all robots' lists
        const activeMissiles = [];
        this.robots.forEach(robot => {
            // Only include missiles if the robot itself is considered active/part of state
            // Or maybe always include them until they naturally expire/hit? Depends on rules.
            // if (robot.isAlive) { // Optional: only include missiles from alive robots?
                activeMissiles.push(...robot.missiles);
            // }
        });

        // Construct the state object
        const state = {
            gameId: this.gameId,
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
                radius: missile.radius
                // ownerId: missile.ownerId // Optional: include owner if needed client-side
            })),
            // Include any explosions triggered during this tick
            explosions: this.explosionsToBroadcast,
            timestamp: Date.now() // Include a server timestamp
        };

        // Note: Clearing explosionsToBroadcast moved to start of tick()

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
        console.log(`[${this.gameId}] Handling removal of player ${playerName} (${socketId}).`);

        const playerData = this.players.get(socketId);
        if (playerData) {
            // Mark the robot as inactive
            if (playerData.robot) {
                 playerData.robot.isAlive = false;
                 playerData.robot.speed = 0; // Stop movement
                 playerData.robot.targetSpeed = 0;
                 console.log(`[${this.gameId}] Marked robot for ${playerName} as inactive.`);
            }

            // Have the socket leave the Socket.IO room for this game
            if (playerData.socket) {
                 playerData.socket.leave(this.gameId);
            }
            // Remove player data from the active players map for this game
            this.players.delete(socketId);
            // Remove from name map
            this.playerNames.delete(socketId);

            // Check if removing this player triggers the game over condition
            // (e.g., if only one player remains)
            this.checkGameOver();
        } else {
             console.warn(`[${this.gameId}] Tried to remove player ${socketId}, but they were not found in the player map.`);
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

    /**
     * Placeholder for queueing actions received directly from clients.
     * Not used in the current server-side interpreter model.
     * @param {string} socketId - The ID of the player sending the action.
     * @param {object} action - The action object sent by the client.
     */
    queueAction(socketId, action) {
        const playerName = this.playerNames.get(socketId) || socketId;
        console.warn(`[${this.gameId}] queueAction called but not implemented for player ${playerName}. Action:`, action);
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

        console.log("[GameManager] Initialized.");
    }

    /**
     * Adds a newly connected player to the waiting list with default values.
     * Called by socket-handler upon connection.
     * @param {SocketIO.Socket} socket - The socket object for the connected player.
     */
    addPlayer(socket) {
        const initialName = `Player_${socket.id.substring(0, 4)}`;
        console.log(`[GameManager] Player ${socket.id} (${initialName}) connected and is waiting.`);
        // Add player to the pending list with default name and not ready status.
        this.pendingPlayers.set(socket.id, {
            socket: socket,
            code: null,
            appearance: 'default',
            name: initialName, // Assign initial default name
            isReady: false // Player is not ready initially
        });
        // Note: lobbyEvent ('Player connected') and broadcastLobbyStatus() are called from socket-handler immediately after addPlayer
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

        // Player not found or name missing
        // console.warn(`[GameManager] Failed to find name for socket ID: ${socketId}`); // Optional: Reduce noise
        return null;
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
            console.log(`[GameManager] Received data from unknown or already in-game player: ${socketId}`);
            return; // Ignore if player isn't in the pending list
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

        // Note: broadcastLobbyStatus() is called from socket-handler after this method completes
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

                // If player becomes ready (e.g., future "ready" button without code submit), try to start match
                if (isReady) {
                    this._tryStartMatch();
                }

                 // Broadcast updated lobby status regardless of state change direction
                 this.broadcastLobbyStatus();
            }
        } else {
            console.warn(`[GameManager] Tried to set ready status for unknown pending player ${socketId}`);
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

            // Select the players for the new game (e.g., take the first N ready players found)
            const playersForGame = readyPlayers.slice(0, requiredPlayers);

            // Remove these selected players from the pending list *before* creating the game instance
            playersForGame.forEach(p => this.pendingPlayers.delete(p.socket.id));

            // Create and start the new game instance
            this.createGame(playersForGame); // Pass the array of player data objects
        } else {
            // Not enough players ready, just log status
            console.log(`[GameManager] Waiting for more players. ${readyPlayers.length}/${requiredPlayers} ready.`);
            // Status will be updated via broadcastLobbyStatus called from socket-handler or setPlayerReadyStatus
        }
    }

    /**
     * Creates a new GameInstance, adds it to the active games list,
     * maps players to the game, starts the game loop, and emits lobby event.
     * @param {Array<{socket: SocketIO.Socket, code: string, appearance: string, name: string, isReady: boolean}>} playersData - Array of player data objects for the new game.
     */
    createGame(playersData) {
        const gameId = `game-${this.gameIdCounter++}`;
        const playerInfo = playersData.map(p => `${p.name}(${p.socket.id.substring(0,4)})`).join(', ');
        console.log(`[GameManager] Creating game ${gameId} for players: ${playerInfo}`);

        // Emit Lobby Event: Game Starting
        const playerNames = playersData.map(p => p.name).join(' vs ');
        this.io.emit('lobbyEvent', { message: `Game starting: ${playerNames}!` });

        try {
            // Create the GameInstance, passing the necessary data and the gameOver callback method reference
            const gameInstance = new GameInstance(gameId, this.io, playersData, (winnerData) => {
                this.handleGameOverEvent(winnerData);
            });

            // Store the active game instance
            this.activeGames.set(gameId, gameInstance);

            // Map each player's socket ID to this game ID and notify them individually
            playersData.forEach(player => {
                this.playerGameMap.set(player.socket.id, gameId);

                // Notify the client that their specific game is starting
                player.socket.emit('gameStart', {
                    gameId: gameId,
                    players: playersData.map(p => ({ // Send info about all players in this match
                        id: p.socket.id,
                        name: p.name,
                        appearance: p.appearance
                     }))
                });
                console.log(`[GameManager] Notified player ${player.name} that game ${gameId} is starting.`);
            });

            // Start the simulation loop for the new game instance
            gameInstance.startGameLoop();

        } catch (error) {
            console.error(`[GameManager] Error creating game ${gameId}:`, error);
            // Emit Lobby Event: Game Creation Failed
            this.io.emit('lobbyEvent', { message: `Failed to start game for ${playerInfo}. Please try again.`, type: 'error' }); // Add type for styling
            // Handle game creation error: Put players back in pending, mark as not ready
            playersData.forEach(player => {
                 player.isReady = false; // Ensure they aren't immediately picked again if error was transient
                 this.pendingPlayers.set(player.socket.id, player); // Put back in the queue
                 // Notify player individually about the error
                 player.socket.emit('gameError', { message: "Failed to create game instance. Please Ready Up again." });
            });
             // Broadcast updated lobby status after failed game creation and putting players back
             this.broadcastLobbyStatus();
        }
    }

    /**
     * Handles the game over event triggered by a GameInstance callback.
     * Emits a lobby event announcing the winner.
     * @param {object} winnerData - Object containing winner details { winnerId, winnerName, reason }.
     */
    handleGameOverEvent(winnerData) {
        const winnerName = winnerData.winnerName || 'No one';
        const reason = winnerData.reason || 'Match ended.';
        console.log(`[GameManager] Received game over event. Winner: ${winnerName}`);
        // Broadcast game over message to everyone in the lobby
        this.io.emit('lobbyEvent', { message: `Game over! Winner: ${winnerName}. (${reason})` });
        // Lobby status automatically updates as players disconnect or re-ready for the next game
    }

    /**
     * Removes a disconnected or leaving player from the system.
     * Handles removing them from pending lists or active games, and updates matchmaking state.
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
                console.log(`[GameManager] Removing player ${playerName || socketId} from active game ${gameId}.`);
                game.removePlayer(socketId); // Tell the GameInstance to handle internal cleanup

                // If the game becomes empty after removal, clean up the game instance itself.
                if (game.isEmpty()) {
                    console.log(`[GameManager] Game ${gameId} is now empty. Destroying game instance.`);
                    game.stopGameLoop(); // Ensure loop is stopped before deleting reference
                    this.activeGames.delete(gameId);
                }
            } else {
                 // Should not happen if map is consistent, but good to log.
                 console.warn(`[GameManager] Player ${playerName || socketId} mapped to non-existent game ${gameId}. Cleaning up map.`);
            }
            // Remove the player from the game map regardless.
            this.playerGameMap.delete(socketId);
        }

        // Log removal type and potentially re-evaluate matchmaking
        if (wasPending) {
            console.log(`[GameManager] Player ${playerName || socketId} removed from pending list.`);
             // If a waiting/ready player leaves, check if a different game can now start
             this._tryStartMatch();
        } else if (gameId) {
             console.log(`[GameManager] Player ${playerName || socketId} removed from active game ${gameId}.`);
        } else {
             // Player was neither pending nor in the active game map (e.g., connected but never readied up?)
             console.log(`[GameManager] Removed player ${playerName || socketId} (was not pending or in active game map).`);
        }

        // Note: broadcastLobbyStatus is called from socket-handler *after* removePlayer completes
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
 * Manages player connections, disconnections, data submission, readiness signals, and chat.
 * Delegates game logic to the GameManager.
 * @param {SocketIO.Server} io - The Socket.IO server instance.
 */
function initializeSocketHandler(io) {
    // Create a single instance of the GameManager to manage the application state
    const gameManager = new GameManager(io);

    // Handle new client connections
    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        // Add player to the GameManager's pending list
        gameManager.addPlayer(socket);

        // Assign a unique ID to the newly connected client
        socket.emit('assignId', socket.id);

        // Notify all clients (including sender) about the new connection
        // Note: Name is not known yet, use partial ID.
        io.emit('lobbyEvent', { message: `Player ${socket.id.substring(0, 4)}... connected.` });

        // Send the current lobby status (counts) to the new client and everyone else
        gameManager.broadcastLobbyStatus();

        // Handle client disconnections
        socket.on('disconnect', () => {
            // Try to get player name *before* removing them from GameManager
            const playerName = gameManager.getPlayerName(socket.id) || socket.id.substring(0, 4)+'...';
            console.log(`Client disconnected: ${playerName} (${socket.id})`);

            // Remove the player from GameManager (handles pending list and active games)
            gameManager.removePlayer(socket.id);

            // Notify remaining clients about the disconnection using the retrieved name
            io.emit('lobbyEvent', { message: `Player ${playerName} disconnected.` });

            // Update lobby status counts for all remaining clients
            gameManager.broadcastLobbyStatus();
        });

        // Handle player submitting their code, appearance, and name (implicitly marks them as Ready)
        socket.on('submitPlayerData', (data) => {
            // Validate received data structure
            if (data && typeof data.code === 'string' && typeof data.appearance === 'string' && typeof data.name === 'string') {

                // Sanitize/validate name server-side (trim, length, default, basic HTML prevention)
                const name = data.name.trim();
                const sanitizedName = name.substring(0, 16) || `Anon_${socket.id.substring(0,4)}`;
                const finalName = sanitizedName.replace(/</g, "<").replace(/>/g, ">");

                console.log(`[Socket ${socket.id}] Received Player Data: Name='${finalName}', Appearance='${data.appearance}'`);

                // Pass validated data to GameManager to update player state and try matchmaking
                gameManager.handlePlayerCode(socket.id, data.code, data.appearance, finalName);

                // Broadcast updated lobby status (GameManager emits "Player X is ready!" event)
                gameManager.broadcastLobbyStatus();

            } else {
                console.warn(`[Socket ${socket.id}] Received invalid playerData format:`, data);
                // Optionally send an error back to the specific client
                socket.emit('submissionError', { message: 'Invalid data format received by server.' });
            }
        });

        // Handle player explicitly marking themselves as "Not Ready"
        socket.on('playerUnready', () => {
            console.log(`[Socket ${socket.id}] Received 'playerUnready' signal.`);
            // Update player status in GameManager (will also broadcast status update)
            gameManager.setPlayerReadyStatus(socket.id, false);
        });

        // Handle incoming chat messages from a client
        socket.on('chatMessage', (data) => {
            if (data && typeof data.text === 'string') {
                // Get sender's current name from GameManager
                const senderName = gameManager.getPlayerName(socket.id) || `Anon_${socket.id.substring(0,4)}`;
                // Trim and limit message length
                const messageText = data.text.trim().substring(0, 100);

                if (messageText) { // Ensure message isn't empty after trimming
                    // Basic sanitization (prevent simple HTML/script injection)
                    const sanitizedText = messageText.replace(/</g, "<").replace(/>/g, ">");

                    console.log(`[Chat] ${senderName}: ${sanitizedText}`);

                    // Broadcast the sanitized chat message to ALL connected clients
                    io.emit('chatUpdate', {
                        sender: senderName,
                        text: sanitizedText
                    });
                }
            } else {
                 console.warn(`[Socket ${socket.id}] Received invalid chat message format:`, data);
            }
        });


        // Listener for player actions during a game (currently unused but kept for potential future)
        // socket.on('robotAction', (action) => {
        //     gameManager.handlePlayerAction(socket.id, action);
        // });

        // Optional: Listener for explicit reset request (might be used with ready system later)
        // socket.on('playerResetRequest', () => {
        //     // Could call setPlayerReadyStatus(socket.id, false) or a dedicated reset method
        //     gameManager.handlePlayerReset(socket.id);
        // });

    }); // End io.on('connection')

    console.log("[Socket Handler] Initialized and listening for connections.");
}

module.exports = initializeSocketHandler;
```

