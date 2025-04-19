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
    display: flex; /* Use flexbox for body */
    flex-direction: column; /* Stack content vertically */
    min-height: 100vh; /* Ensure body takes at least full viewport height */
}

.container {
    max-width: 1200px;
    width: 100%; /* Ensure container uses available width up to max */
    margin: 0 auto;
    padding: 20px;
    display: flex; /* Use flexbox for container children */
    flex-direction: column; /* Stack main and lobby */
    flex-grow: 1; /* Allow container to grow */
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #444;
    flex-wrap: wrap; /* Allow header items to wrap */
    flex-shrink: 0; /* Prevent header shrinking */
}

header h1 {
    /* --- 80s Retro Font --- */
    font-family: 'Press Start 2P', cursive;
    font-size: 1.8rem; /* Adjust if needed */
    /* --- End Retro Font --- */
    color: #4CAF50;
    margin: 0 10px 0 0; /* Add some right margin */
}

nav {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap; /* Allow nav items to wrap on smaller screens */
    flex-grow: 1; /* Allow nav to take remaining space */
    justify-content: flex-end; /* Align nav items to the right */
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

/* Specific style for Test Code button */
#btn-test-code {
    background-color: #2196F3; /* Blue color for testing */
}
#btn-test-code:hover {
    background-color: #1e88e5; /* Darker blue on hover */
}

/* Specific style for Self Destruct button */
#btn-self-destruct {
    background-color: #e74c3c; /* Red */
    padding: 6px 12px; /* Slightly smaller padding */
}
#btn-self-destruct:hover {
    background-color: #c0392b; /* Darker Red */
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


/* Grid for main content (Arena/Editor) */
main {
    display: grid;
    grid-template-columns: 1.6fr 1fr; /* Give more space to game area */
    gap: 20px;
    flex-grow: 1; /* Allow main grid to grow vertically */
    min-height: 0; /* Important for flex context */
    width: 100%; /* Take full width of container */
}

.game-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 0; /* Prevent flex items from overflowing grid cell */
}

#arena {
    background-color: #2c2c2c;
    border: 2px solid #444;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 100%; /* Ensure canvas scales down if container is smaller */
    display: block;
    aspect-ratio: 1 / 1; /* Maintain square shape */
}

/* --- START: Shared styles for log panels --- */
.console-panel {
    background-color: #333; /* Default background for panels */
    padding: 10px 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-shrink: 0; /* Prevent panel from shrinking */
}

/* Basic structure for log boxes (overflow, font) */
.log-box {
    overflow-y: scroll;
    font-family: 'VT323', monospace;
    word-wrap: break-word;
    /* Specific background/color/border applied per log type */
}
/* --- END: Shared styles for log panels --- */


/* Constrain Stats Panel Height MORE */
.stats-panel {
    /* Apply console-panel base styles */
    background-color: #333;
    padding: 15px; /* Keep original padding */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    /* REDUCED Max height */
    max-height: 180px; /* ADJUST THIS VALUE */
    overflow-y: auto; /* Add scrollbar if content exceeds max-height */
}

/* Apply retro font to panel/section titles */
.stats-panel h3, .editor-container h3, .api-help h4, #lobby-area h3, #game-history-log h4,
.console-panel h3 { /* Added .console-panel h3 */
     /* --- 80s Retro Font --- */
    font-family: 'VT323', monospace;
    font-size: 18px; /* Adjust if needed */
     /* --- End Retro Font --- */
     margin-bottom: 10px;
     color: #4CAF50; /* Match header color accent */
     flex-shrink: 0; /* Prevent titles from shrinking */
}

.editor-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    min-height: 0; /* Prevent flex items from overflowing grid cell */
}

/* CodeMirror Styling - INCREASED min-height */
.CodeMirror {
    flex-grow: 1; /* Allow editor to grow vertically */
    /* INCREASED Minimum height */
    min-height: 500px; /* ADJUST THIS VALUE - Should be enough for ~25+ lines */
    border-radius: 8px;
    border: 1px solid #444;

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

/* Constrain API Help Height MORE */
.api-help {
    /* Apply console-panel base styles */
    background-color: #333;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    /* REDUCED Max height */
    max-height: 150px; /* ADJUST THIS VALUE */
    overflow-y: auto; /* Add scrollbar if content exceeds max-height */
}

.api-help ul {
    list-style-position: inside;
    padding-left: 5px;
}

.api-help li {
    margin-bottom: 5px;
}

.api-help code {
    font-family: 'VT323', monospace;
    background-color: #444;
    padding: 2px 4px;
    border-radius: 3px;
    color: #f0f0f0;
}

/* START: Styling for Editor Controls (Added in Loadout Feature) */
.editor-controls {
    /* Using inline styles for layout in HTML for now, but could be moved here */
     margin-top: 10px;
     display: flex;
     gap: 10px;
     align-items: center;
}
#btn-delete-loadout {
    padding: 4px 8px; /* Make delete button smaller */
    font-size: 14px;
    background-color: #c0392b; /* Reddish color for delete */
}
#btn-delete-loadout:hover {
    background-color: #a93226; /* Darker red on hover */
}
#btn-delete-loadout:disabled {
    background-color: #555; /* Use standard disabled grey */
    color: #aaa;
}
#loadout-status {
    font-size: 14px;
    margin-top: 5px;
    min-height: 1.2em; /* Prevent layout shift when empty */
    color: #aaa; /* Default color for status */
    /* Color overridden by JS for success/error */
}
/* END: Styling for Editor Controls */


/* --- START: Robot Console Log Specific Styles (FALLOUT TERMINAL) --- */
#robot-console-log {
    margin-top: 15px;
    background-color: #1a1a1a; /* Darker bg for the whole panel */
    border: 2px solid #0f400f; /* Slightly thicker/darker green border for panel */
    padding: 8px;
    /* Inherits .console-panel shadow, radius */
}

#robot-console-log h3 {
    color: #00dd00; /* Bright green title */
    text-align: center;
    margin-bottom: 8px;
    text-shadow: 0 0 4px #00dd00; /* Slightly stronger glow */
}

#robot-log-messages {
    height: 200px; /* Adjust height as needed */
    background-color: #000000; /* True black background */
    color: #00FF41; /* Classic terminal green text */
    font-size: 16px;
    /* border: 1px inset #004d00; /* Old inset border */
    border: 2px solid #004d00; /* New: Solid, slightly thicker border */
    padding: 10px;
    text-shadow: 0 0 5px rgba(0, 255, 65, 0.5); /* Text glow */
    word-wrap: break-word;
    overflow-y: scroll; /* Keep scroll */
    font-family: 'VT323', monospace; /* Explicitly set font here too */

    /* Scanline/Vignette/Noise preparation: Parent MUST have relative positioning */
    position: relative;
    overflow: hidden; /* Crucial: Keep the ::after pseudo-element clipped */

    /* Optional: Vignette effect */
    /* box-shadow: inset 0 0 40px 10px rgba(0,0,0,0.6); */
}

/* Optional: Static/Noise Effect (Commented Out By Default) */
/* #robot-log-messages::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0.05) 1px, rgba(0,0,0,0) 2px);
    opacity: 0.3;
    pointer-events: none;
    z-index: 2;
    animation: flicker 0.15s infinite;
} */

/* Optional: Flicker Animation */
/* @keyframes flicker {
    0% { opacity: 0.25; }
    50% { opacity: 0.35; }
    100% { opacity: 0.25; }
} */


/* --- START: Scanline Effect (Adapted from ealertguide.html) --- */
#robot-log-messages::after {
    content: '';
    position: absolute;
    top: 0; /* Start at the top (animated) */
    left: 0;
    right: 0;
    height: 2px; /* Thickness of the scanline */
    /* Semi-transparent green background */
    background: rgba(0, 255, 0, 0.15); /* Adjust alpha for visibility */
    /* Optional subtle blur/glow effect */
    box-shadow: 0 0 4px 1px rgba(0, 255, 0, 0.15);
    z-index: 3; /* Ensure it's above noise if enabled */
    pointer-events: none; /* Ensure it doesn't interfere with interaction */
    /* Link to the animation */
    animation: scanline-log 6s linear infinite; /* Use unique animation name */
}

/* --- START: Scanline Animation Keyframes (Adapted from ealertguide.html) --- */
/* Use translateY for potentially smoother performance than changing 'top' */
@keyframes scanline-log {
    0% {
        transform: translateY(0%); /* Start at the top */
        opacity: 0.1; /* Start slightly faded */
    }
    50% {
        opacity: 0.3; /* Slightly brighter mid-scan */
    }
    100% {
        transform: translateY(calc(100% - 2px)); /* Move to bottom edge (minus height) */
        opacity: 0.1; /* Fade out towards the bottom */
    }
}
/* --- END: Scanline Effect --- */
/* --- END: Robot Console Log Specific Styles --- */


/* Lobby Area - Pushed down */
#lobby-area {
    margin-top: 20px; /* Add space above lobby */
    background: #333;
    padding: 15px;
    border-radius: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    border-top: 2px solid #444;
    flex-shrink: 0; /* Prevent lobby from shrinking */
    width: 100%; /* Take full width */
}

#lobby-area > div:first-child,
#lobby-area > div:last-child {
    /* Column content styling if needed */
}

#lobby-status {
    margin-bottom: 10px;
    font-weight: bold;
    color: #e0e0e0;
}

/* Styles for Event Log */
#event-log {
    /* Apply .log-box base styles */
    overflow-y: scroll;
    font-family: 'VT323', monospace;
    word-wrap: break-word;
    /* Specifics */
    height: 150px;
    margin-bottom: 10px;
    padding: 5px 8px;
    background: #222; /* Slightly lighter than robot log bg */
    font-size: 14px;
    border: 1px solid #555;
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
    padding: 8px 16px;
    font-size: 15px;
}


#game-history-log {
    font-family: 'VT323', monospace;
}

/* Styles for Game History List */
#game-history-list {
    /* Apply .log-box base styles */
    overflow-y: auto; /* Use auto instead of scroll */
    font-family: 'VT323', monospace;
    word-wrap: break-word;
    /* Specifics */
    height: 195px;
    background: #222;
    border: 1px solid #555;
    padding: 8px;
    font-size: 14px;
}


#game-history-list > div {
    margin-bottom: 4px;
    padding-bottom: 4px;
    border-bottom: 1px dashed #444;
    color: #cccccc; /* Inherited from .log-box */
}

#game-history-list > div:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

/* --- Responsive Adjustments --- */
@media (max-width: 900px) {
    main {
        grid-template-columns: 1fr; /* Stack game and editor */
        min-height: 60vh; /* Give main area a min height when stacked */
    }
    .editor-container {
        min-height: 400px; /* Still useful */
    }
     #arena {
         max-height: 50vh; /* Limit arena height when stacked */
         width: auto; /* Allow width to adjust based on height */
         max-width: 90%; /* Prevent excessive width */
         margin: 0 auto; /* Center arena */
     }
     .stats-panel {
         max-height: 150px; /* Further reduce stats height when stacked */
     }
    #robot-console-log {
        /* Keep reasonable height when stacked */
        margin-top: 10px;
    }
    #robot-log-messages {
        height: 150px; /* Adjust stacked height */
    }
    /* Optional: Slow down or disable scanline/flicker on mobile? */
    /* #robot-log-messages::after { animation: none; } */
    /* #robot-log-messages::before { animation: none; display: none; } */
}

@media (max-width: 768px) {
    header {
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    nav {
        justify-content: center;
        gap: 8px;
    }
     #lobby-area {
        grid-template-columns: 1fr;
    }
    #game-history-log {
         margin-top: 20px;
    }
     .CodeMirror {
        min-height: 350px;
    }
    .stats-panel, .api-help {
        max-height: 130px; /* Even smaller on mobile */
    }
     #robot-console-log {
         /* Use same max-height as stats/api on mobile */
         max-height: 130px;
     }
     #robot-log-messages {
        height: 100px; /* Further reduce height */
        font-size: 14px; /* Maybe smaller font too */
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
 * code loading, appearance selection, player name input, code loadout saving/loading,
 * test game requests, self-destruct requests, and sends relevant data/signals
 * to the server via the network handler. // Updated description
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

        // --- START: Loadout Properties ---
        this.localStorageKey = 'robotWarsLoadouts';
        // --- END: Loadout Properties ---
        this.testGameActive = false; // Track if a test game is running client-side (Might be useful later)

        if (!this.game || !this.network) {
             console.error("Controls initialized without valid game or network reference!");
        }
        this.setupEventListeners();
        this.loadPlayerName();
        this.updateUIForState(); // Set initial UI based on 'lobby' state

        // --- START: Initialize Loadouts ---
        this.populateLoadoutUI(); // Populate dropdown on load
        // --- END: Initialize Loadouts ---
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
        const selfDestructButton = document.getElementById('btn-self-destruct'); // Get self-destruct
        const testButton = document.getElementById('btn-test-code'); // Get test button
        // --- START: Get Loadout Elements ---
        const saveButton = document.getElementById('btn-save-code');
        const loadSelect = document.getElementById('loadout-select');
        const deleteButton = document.getElementById('btn-delete-loadout');
        // --- END: Get Loadout Elements ---
        const editorIsAvailable = typeof editor !== 'undefined';

        // Defaults (most restrictive)
        let readyButtonText = "Loading...";
        let readyButtonColor = '#777';
        let readyButtonDisabled = true;
        let inputsDisabled = true;
        let editorReadOnly = true;
        let selfDestructVisible = false; // Hide self-destruct by default
        let testButtonDisabled = true; // Disable test button by default
        let loadoutControlsDisabled = true; // Disable save/load/delete by default

        switch (this.uiState) {
            case 'lobby': // Can interact, ready button shows "Ready Up"
                readyButtonText = "Ready Up";
                readyButtonColor = '#4CAF50'; // Green
                readyButtonDisabled = false;
                inputsDisabled = false;
                editorReadOnly = false;
                selfDestructVisible = false; // Hide self-destruct
                testButtonDisabled = false; // Enable test button
                loadoutControlsDisabled = false; // Enable loadout controls
                break;

            case 'waiting': // Can only click "Unready"
                readyButtonText = "Waiting... (Click to Unready)";
                readyButtonColor = '#FFA500'; // Orange
                readyButtonDisabled = false; // Must be enabled to unready
                inputsDisabled = true; // Other inputs locked
                editorReadOnly = true;
                selfDestructVisible = false; // Hide self-destruct
                testButtonDisabled = true;
                loadoutControlsDisabled = true;
                break;

            case 'playing': // All interaction disabled (includes test games)
                readyButtonText = "Game in Progress...";
                readyButtonColor = '#777'; // Grey
                readyButtonDisabled = true;
                inputsDisabled = true;
                editorReadOnly = true;
                selfDestructVisible = true; // SHOW self-destruct during play
                testButtonDisabled = true;
                loadoutControlsDisabled = true;
                break;

            case 'spectating': // All interaction disabled
                readyButtonText = "Spectating...";
                readyButtonColor = '#4682B4'; // Steel Blue
                readyButtonDisabled = true;
                inputsDisabled = true;
                editorReadOnly = true;
                selfDestructVisible = false; // Hide self-destruct
                testButtonDisabled = true;
                loadoutControlsDisabled = true;
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

        if (selfDestructButton) { // Show/hide and enable/disable self-destruct
             selfDestructButton.style.display = selfDestructVisible ? 'inline-block' : 'none';
             selfDestructButton.disabled = !selfDestructVisible; // Disable if not visible (i.e., not playing)
        } else { console.warn("Self Destruct button not found during UI update."); }

        if (testButton) { testButton.disabled = testButtonDisabled; } // Update test button state
         else { console.warn("Test Code button not found during UI update."); }


        // --- START: Update Loadout Control State ---
        if (saveButton) { saveButton.disabled = loadoutControlsDisabled; }
         else { console.warn("Save Code button not found during UI update."); }
        if (loadSelect) { loadSelect.disabled = loadoutControlsDisabled; }
         else { console.warn("Load Code select not found during UI update."); }
        // Delete button is also disabled if no loadout is selected (handled in its listener/populate)
        if (deleteButton) { deleteButton.disabled = loadoutControlsDisabled || (loadSelect && !loadSelect.value); }
         else { console.warn("Delete Loadout button not found during UI update."); }
        // --- END: Update Loadout Control State ---

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
        const selfDestructButton = document.getElementById('btn-self-destruct'); // Get self-destruct
        const testButton = document.getElementById('btn-test-code'); // Get test button
        // --- START: Get Loadout Elements ---
        const saveButton = document.getElementById('btn-save-code');
        const loadSelect = document.getElementById('loadout-select');
        const deleteButton = document.getElementById('btn-delete-loadout');
        // --- END: Get Loadout Elements ---


        // Check if elements exist to prevent errors
        if (!readyButton || !resetButton || !sampleCodeSelect || !appearanceSelect || !playerNameInput ||
            // --- START: Check Loadout Elements ---
            !saveButton || !loadSelect || !deleteButton ||
            // --- END: Check Loadout Elements ---
            !testButton || !selfDestructButton) { // Check test and self-destruct buttons
            console.error("One or more control elements (button#btn-ready, test, self-destruct, reset, select, player name input, save/load/delete) not found in the DOM!");
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

        // --- START: Loadout Event Listeners ---

        // Save Button Listener
        saveButton.addEventListener('click', () => {
            if (this.uiState !== 'lobby') return; // Only allow in lobby

            const currentCode = (typeof editor !== 'undefined') ? editor.getValue() : '';
            if (!currentCode.trim()) {
                alert("Code editor is empty. Cannot save.");
                this.updateLoadoutStatus("Save failed: Editor empty.", true);
                return;
            }

            const loadoutName = prompt("Enter a name for this code loadout:", "");
            if (loadoutName === null) return; // User cancelled prompt

            const trimmedName = loadoutName.trim();
            if (!trimmedName) {
                alert("Loadout name cannot be empty.");
                 this.updateLoadoutStatus("Save failed: Invalid name.", true);
                return;
            }

            // Optional: Confirm overwrite? For simplicity, we'll just overwrite now.
            this.saveLoadout(trimmedName, currentCode);
        });

        // Load Dropdown Listener
        loadSelect.addEventListener('change', () => {
            if (this.uiState !== 'lobby') return; // Only allow in lobby

            const selectedName = loadSelect.value;
            if (selectedName) { // Check if it's not the default "" value
                this.loadLoadout(selectedName);
            }
            // Update delete button state based on selection
            deleteButton.disabled = !selectedName || this.uiState !== 'lobby';
        });

        // Delete Button Listener
        deleteButton.addEventListener('click', () => {
            if (this.uiState !== 'lobby') return; // Only allow in lobby

            const selectedName = loadSelect.value;
            if (!selectedName) return; // No loadout selected

            if (confirm(`Are you sure you want to delete the loadout "${selectedName}"?`)) {
                this.deleteLoadout(selectedName);
            }
        });

        // --- END: Loadout Event Listeners ---

        // --- START: Test Code Button Listener ---
        testButton.addEventListener('click', () => {
            if (this.uiState !== 'lobby') {
                console.warn(`Test Code button clicked in non-lobby state: ${this.uiState}. Ignoring.`);
                return;
            }
            if (!this.network || !this.network.socket || !this.network.socket.connected) {
                 console.error("Network handler not available or not connected in Controls for Test Code.");
                 alert("Not connected to server. Please check connection and refresh.");
                 return;
            }

            console.log('Test Code button clicked (State: lobby)');
            const playerCode = (typeof editor !== 'undefined') ? editor.getValue() : '';
            const nameValue = playerNameInput.value.trim();
            const chosenAppearance = appearanceSelect.value || 'default';

            // Validate inputs before sending
            if (!playerCode) { alert("Code editor is empty!"); return; }
            if (!nameValue) { alert("Please enter a player name."); return; }

            // Sanitize name
            const finalPlayerName = nameValue.substring(0, 24).replace(/<[^>]*>/g, "");
            if (!finalPlayerName) { alert("Invalid player name."); return; }
            playerNameInput.value = finalPlayerName; // Update input field with sanitized name

            this.savePlayerName(finalPlayerName); // Save name locally too

            // Emit the request to the server via network handler
            this.network.requestTestGame(playerCode, chosenAppearance, finalPlayerName);
            // Server response ('gameStart') will trigger state change
        });
        // --- END: Test Code Button Listener ---

        // --- START: Self Destruct Button Listener ---
        selfDestructButton.addEventListener('click', () => {
            // Should only be clickable when uiState is 'playing' due to updateUIForState logic,
            // but double-check state and network connection
            if (this.uiState !== 'playing') {
                 console.warn("Self Destruct button clicked when not playing. Ignoring.");
                 return; // Ignore click if not playing
            }
            if (!this.network || !this.network.socket || !this.network.socket.connected) {
                console.error("Network not available for Self Destruct.");
                alert("Not connected to server.");
                return;
            }
            if (confirm("Are you sure you want to self-destruct your robot?")) {
                console.log("Sending self-destruct signal...");
                this.network.sendSelfDestructSignal();
            }
        });
        // --- END: Self Destruct Button Listener ---


    } // End setupEventListeners


    // --- The methods setReadyState, setPlayingState, setSpectatingState ---
    // --- have been REMOVED. Use controls.setState('lobby' | 'waiting' | 'playing' | 'spectating') ---
    // --- from game.js or other relevant places. ---

    // --- START: Loadout Management Methods ---

    /** Safely gets loadouts from localStorage, handling errors. */
    _getLoadouts() {
        try {
            const storedData = localStorage.getItem(this.localStorageKey);
            if (storedData) {
                return JSON.parse(storedData);
            }
        } catch (error) {
            console.error("Error reading or parsing loadouts from localStorage:", error);
            // Optionally clear corrupted data: localStorage.removeItem(this.localStorageKey);
        }
        return {}; // Return empty object if nothing stored or error occurred
    }

    /** Safely saves loadouts to localStorage, handling errors. */
    _setLoadouts(loadouts) {
        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(loadouts));
            return true; // Indicate success
        } catch (error) {
            console.error("Error saving loadouts to localStorage:", error);
            if (error.name === 'QuotaExceededError') {
                alert("Could not save loadout: Browser storage quota exceeded. You may need to delete old loadouts.");
            } else {
                alert("An error occurred while trying to save the loadout.");
            }
            return false; // Indicate failure
        }
    }

    /** Saves a named code loadout to localStorage. */
    saveLoadout(name, code) {
        if (typeof localStorage === 'undefined') {
             alert("localStorage is not available in this browser. Cannot save loadouts.");
             this.updateLoadoutStatus("Save failed: localStorage unavailable.", true);
             return;
        }
        if (!name) {
            console.warn("Attempted to save loadout with empty name.");
             this.updateLoadoutStatus("Save failed: Name cannot be empty.", true);
            return;
        }

        const loadouts = this._getLoadouts();
        loadouts[name] = code;

        if (this._setLoadouts(loadouts)) {
             console.log(`Loadout "${name}" saved.`);
             this.populateLoadoutUI(name); // Repopulate and select the saved item
             this.updateLoadoutStatus(`Loadout "${name}" saved successfully.`);
        } else {
             this.updateLoadoutStatus(`Failed to save loadout "${name}".`, true);
        }
    }

    /** Loads code from a named loadout into the editor. */
    loadLoadout(name) {
        if (!name || typeof editor === 'undefined') return;

        const loadouts = this._getLoadouts();
        if (loadouts.hasOwnProperty(name)) {
            editor.setValue(loadouts[name]);
            console.log(`Loadout "${name}" loaded into editor.`);
            this.updateLoadoutStatus(`Loaded "${name}".`);
        } else {
            console.warn(`Loadout "${name}" not found.`);
             this.updateLoadoutStatus(`Loadout "${name}" not found.`, true);
        }
    }

    /** Deletes a named loadout from localStorage. */
    deleteLoadout(name) {
        if (typeof localStorage === 'undefined' || !name) return;

        const loadouts = this._getLoadouts();
        if (loadouts.hasOwnProperty(name)) {
            delete loadouts[name];
            if (this._setLoadouts(loadouts)) {
                console.log(`Loadout "${name}" deleted.`);
                this.populateLoadoutUI(); // Repopulate, will select default
                 // Optional: Clear editor if the deleted loadout was loaded?
                 // if (editor.getValue() === codeToDelete) { editor.setValue(''); }
                 this.updateLoadoutStatus(`Deleted "${name}".`);
            } else {
                 this.updateLoadoutStatus(`Failed to delete "${name}".`, true);
            }
        } else {
            console.warn(`Attempted to delete non-existent loadout "${name}".`);
             this.updateLoadoutStatus(`Loadout "${name}" not found for deletion.`, true);
        }
    }

    /** Populates the loadout dropdown from localStorage. */
    populateLoadoutUI(selectName = null) {
        const loadSelect = document.getElementById('loadout-select');
        const deleteButton = document.getElementById('btn-delete-loadout');
        if (!loadSelect || !deleteButton) return;

        const loadouts = this._getLoadouts();
        const names = Object.keys(loadouts).sort(); // Sort names alphabetically

        // Clear existing options (keep the first placeholder)
        while (loadSelect.options.length > 1) {
            loadSelect.remove(1);
        }

        // Add options for each saved loadout
        names.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            loadSelect.appendChild(option);
        });

        // Select the specified item if provided (e.g., after saving)
        if (selectName && loadouts.hasOwnProperty(selectName)) {
            loadSelect.value = selectName;
        } else {
            loadSelect.value = ""; // Select the default "Load Code..."
        }

        // Update delete button state
        deleteButton.disabled = !loadSelect.value || this.uiState !== 'lobby';
    }

    // --- END: Loadout Management Methods ---


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

    /** Updates the small status text below the editor controls */
    updateLoadoutStatus(message, isError = false) {
        const statusElement = document.getElementById('loadout-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.style.color = isError ? '#e74c3c' : '#4CAF50'; // Red for error, Green for success
            // Clear the message after a few seconds
            setTimeout(() => {
                 if (statusElement.textContent === message) { // Only clear if message hasn't changed
                     statusElement.textContent = '';
                 }
            }, 4000); // Clear after 4 seconds
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

const MAX_LOG_MESSAGES = 50; // Keep the event log from getting too long
const MAX_ROBOT_LOG_MESSAGES = 100; // Allow more robot messages

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
         addEventLogMessage("Event Log cleared.", "info");
     }
}


// --- START: New function for Robot Console Log ---
/**
 * Adds a message to the robot's console log display. Handles scrolling.
 * @param {string} message - The message text from the robot's console.log.
 */
function addRobotLogMessage(message) {
    const logElement = document.getElementById('robot-log-messages'); // Target new element
    if (!logElement) {
        console.warn("Robot log messages element '#robot-log-messages' not found.");
        return;
    }

    const wasScrolledToBottom = logElement.scrollHeight - logElement.clientHeight <= logElement.scrollTop + 1;

    const messageDiv = document.createElement('div');
    messageDiv.textContent = message; // Use textContent for security
    messageDiv.style.marginBottom = '2px'; // Tighter spacing than event log maybe
    // Style is mostly inherited from .log-box, color set in CSS

    logElement.appendChild(messageDiv);

    // Remove old messages if log is too long
    while (logElement.childNodes.length > MAX_ROBOT_LOG_MESSAGES) {
        logElement.removeChild(logElement.firstChild);
    }

    // Auto-scroll to bottom if already scrolled to bottom
    if (wasScrolledToBottom) {
        logElement.scrollTop = logElement.scrollHeight;
    }
}

/** Clears the robot console log */
function clearRobotLog() {
     const logElement = document.getElementById('robot-log-messages');
     if (logElement) {
         logElement.innerHTML = '';
         // Optionally add a cleared message
         addRobotLogMessage("-- Robot Log Cleared --");
     }
}
// --- END: New function for Robot Console Log ---


// --- Make functions globally accessible ---
window.updateLobbyStatus = updateLobbyStatus;
window.addEventLogMessage = addEventLogMessage;
window.clearEventLog = clearEventLog;
window.addRobotLogMessage = addRobotLogMessage; // Add new function to window
window.clearRobotLog = clearRobotLog; // Optional clear function


// --- Initialize Chat Input/Button Listeners & Clear Placeholders ---
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-chat');

    if (chatInput && sendButton) {
         sendButton.addEventListener('click', sendChatMessageFromInput);
         chatInput.addEventListener('keypress', (event) => {
             if (event.key === 'Enter') {
                 event.preventDefault(); // Prevent default form submission (if any)
                 sendChatMessageFromInput();
             }
         });
    } else {
        console.warn("Chat input or send button not found.");
    }

    function sendChatMessageFromInput() {
        const messageText = chatInput.value;
        // Ensure network object exists and has the method before calling
        if (messageText.trim() && typeof network !== 'undefined' && network.sendChatMessage) {
            network.sendChatMessage(messageText); // Assumes global 'network' object exists
            chatInput.value = ''; // Clear input field after sending
        } else if (typeof network === 'undefined' || !network.sendChatMessage) {
             console.error("Network object or sendChatMessage method not available.");
             // Optionally inform user via event log
             // addEventLogMessage("Error: Cannot send chat message.", "error");
        }
         chatInput.focus(); // Keep focus on input
    }


    // --- Clear placeholder text on initial load for BOTH logs ---
    const eventLogElement = document.getElementById('event-log');
    // Check for the specific placeholder text before clearing
    if(eventLogElement && eventLogElement.textContent.trim() === 'Event Log Loading...') {
         eventLogElement.innerHTML = ''; // Clear content directly
         addEventLogMessage("Welcome! Connect to chat and wait for players...", "info");
    }

    const robotLogElement = document.getElementById('robot-log-messages');
     // Check for the specific placeholder text before clearing
    if (robotLogElement && robotLogElement.textContent.trim() === 'Waiting for robot messages...') {
        robotLogElement.innerHTML = ''; // Clear placeholder
        // --- START: Add Thematic Message ---
        addRobotLogMessage("ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL");
        addRobotLogMessage("ENTER PASSWORD NOW");
        addRobotLogMessage(" "); // Blank line
        addRobotLogMessage("> R.O.S. V1.3 INITIALIZING...");
        // --- END: Add Thematic Message ---
    }
    // --- End Placeholder Clearing ---
});

console.log("Lobby UI functions initialized (lobby.js). Includes Robot Log handler.");
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
 * requests test games, sends self-destruct signals, receives game state updates, // <-- Updated description
 * handles spectating, processes lobby/chat events,
 * receives game history updates, and handles robot log messages.
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
                 // Clear robot log on new connection
                 if (typeof window.clearRobotLog === 'function') {
                     window.clearRobotLog();
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
                         window.updateLobbyStatus('Enter name & code, then Ready Up or Test Code!'); // Updated prompt
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
                    // Clear robot log when starting spectate
                    if (typeof window.clearRobotLog === 'function') {
                         window.clearRobotLog();
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

            // Server signals that the game is starting (for players - includes test games)
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
                 // Add a check for the test game flag
                 const statusPrefix = data.isTestGame ? 'Testing Code vs AI:' : 'Playing Game:';
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus(`${statusPrefix} ${data.gameName || data.gameId}`);
                 if (typeof window.addEventLogMessage === 'function') {
                     window.addEventLogMessage(`Your game '${data.gameName || data.gameId}' is starting!`, 'event');
                 }
                 // Clear robot log at game start
                 if (typeof window.clearRobotLog === 'function') {
                      window.clearRobotLog();
                 }
             });

            // Server signals that the game has ended (for players - includes test games)
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
                     const prompt = data.wasTestGame ? 'Test Complete. Ready Up or Test Again!' : 'Game Over. Ready Up for another match!';
                     if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus(prompt);
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
                const robotIdentifier = (data.robotId === this.playerId) ? "Your Robot" : `Robot ${data.robotId.substring(0,4)}...`;
                // Log to general event log
                if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`Code Error (${robotIdentifier}): ${data.message}`, 'error');
                }
                // Also log to the specific robot's log if it's ours
                if (data.robotId === this.playerId && typeof window.addRobotLogMessage === 'function') {
                     window.addRobotLogMessage(`--- CODE ERROR ---`);
                     window.addRobotLogMessage(data.message);
                     window.addRobotLogMessage(`------------------`);
                }
                // Display alert and reset UI only if it's our robot AND we are not spectating
                if (data.robotId === this.playerId && !this.isSpectating) {
                     alert(`Your Robot Code Error:\n${data.message}\n\nYou might need to reset and fix your code.`);
                     // Reset Controls UI to lobby state
                     if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
                         controls.setState('lobby');
                     }
                     if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Code error detected. Please fix and Ready Up or Test again.');
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
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Game Error Occurred. Ready Up or Test again.');
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

            // --- Add Robot Log Listener ---
            this.socket.on('robotLog', (data) => {
                if (data && typeof data.message === 'string') {
                    // Call the UI update function (defined in lobby.js)
                    if (typeof window.addRobotLogMessage === 'function') {
                        window.addRobotLogMessage(data.message);
                    } else {
                        console.warn("addRobotLogMessage function not found!");
                    }
                }
            });
            // --- End Robot Log Listener ---


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

    /**
     * Sends a request to the server to start a single-player test game.
     * Called by the Controls class when the 'Test Code' button is clicked.
     * @param {string} code - The robot AI code written by the player.
     * @param {string} appearance - The identifier for the chosen robot appearance.
     * @param {string} name - The player's chosen name.
     */
    requestTestGame(code, appearance, name) {
        // Basic check: ensure socket is connected
        if (!this.socket || !this.socket.connected) {
             console.error("Socket not available or not connected. Cannot request test game.");
             alert("Not connected to server. Please check connection and try again.");
             return;
        }
         // Basic check: ensure player is in lobby state (client-side check)
         if (typeof controls === 'undefined' || controls.uiState !== 'lobby') {
             console.warn("Attempted to request test game while not in lobby state. Ignored.");
             return;
         }

        console.log(`Sending test game request to server: { name: '${name}', appearance: '${appearance}', code: ... }`);
        this.socket.emit('requestTestGame', {
             code: code,
             appearance: appearance,
             name: name
        });
        // The server will respond with 'gameStart' if successful, which will transition the client state.
        // Optionally, update lobby status immediately:
        if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Requesting Test Game...');
    }

    /**
     * Sends a signal to the server for the player's robot to self-destruct.
     * Called by the Controls class.
     */
    sendSelfDestructSignal() {
        if (!this.socket || !this.socket.connected) {
             console.error("Socket not available or not connected. Cannot send self-destruct signal.");
             alert("Not connected to server.");
             return;
        }
        console.log("Client sending selfDestruct event."); // Added log
        this.socket.emit('selfDestruct');
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
                <button id="btn-test-code">Test Code</button> <!-- Test Code Button -->
                <button id="btn-self-destruct" style="display: none;">Self-Destruct</button> <!-- Self Destruct Button (Initially hidden) -->
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
                <!-- Canvas with updated dimensions -->
                <canvas id="arena" width="900" height="900"></canvas>

                <div class="stats-panel">
                    <h3>Robot Stats</h3>
                    <div id="robot-stats">
                        <!-- Dashboard elements created/managed by dashboard.js -->
                    </div>
                </div>

                <!-- START: Added Robot Console Log -->
                <div id="robot-console-log" class="console-panel">
                    <h3>Robot Console Output</h3>
                    <div id="robot-log-messages" class="log-box">
                        <!-- Robot console messages will appear here -->
                        <div>Waiting for robot messages...</div>
                    </div>
                </div>
                <!-- END: Added Robot Console Log -->

            </div>

            <div class="editor-container">
                <h3>Robot Code Editor</h3>
                <!-- API Help moved above editor -->
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

                <textarea id="code-editor"></textarea>

                <!-- START: Editor Controls (Save/Load/Delete) -->
                <div class="editor-controls" style="margin-top: 10px; display: flex; gap: 10px; align-items: center;">
                    <button id="btn-save-code">Save Code</button>
                    <select id="loadout-select">
                        <option value="" selected>Load Code...</option>
                        <!-- Loadout options will be populated by JS -->
                    </select>
                    <button id="btn-delete-loadout" disabled title="Delete selected loadout">
                        <!-- Simple 'X' or Trash Icon text for now -->
                        ✖
                    </button>
                </div>
                <div id="loadout-status" style="font-size: 14px; margin-top: 5px; min-height: 1.2em; color: #aaa;">
                    <!-- Status messages like 'Saved.' or 'Loaded MyTank.' -->
                </div>
                <!-- END: Editor Controls -->
            </div>
        </main>

        <!-- Lobby Area - Using CSS Grid -->
        <div id="lobby-area"> <!-- style is now in main.css -->
             <div> <!-- Column 1: Status, Log, Chat -->
                 <h3 style="font-family: 'VT323', monospace; font-size: 18px; color: #4CAF50; margin-bottom: 10px;">Lobby Status</h3>
                 <div id="lobby-status" style="margin-bottom: 10px;">Connecting...</div>
                 <div id="event-log" class="log-box" style="height: 150px; margin-bottom: 10px;">Event Log Loading...</div> <!-- Added log-box class -->
                 <div id="chat-area" style="display: flex; gap: 5px;">
                     <input type="text" id="chat-input" placeholder="Enter chat message..." style="flex-grow: 1; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #2a2a2a; color: #e0e0e0; font-family: 'VT323', monospace; font-size: 14px;" maxlength="100"> <!-- Added maxlength -->
                     <button id="send-chat" style="background-color: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: 'VT323', monospace; font-size: 15px;">Send</button>
                 </div>
             </div>

             <div> <!-- Column 2: Game History -->
                 <div id="game-history-log"> <!-- Outer container for styling/header -->
                     <h4 style="font-family: 'VT323', monospace; font-size: 18px; color: #4CAF50; margin-bottom: 10px;">Recent Game Results</h4>
                     <!-- The actual list element that history.js targets -->
                     <div id="game-history-list" class="log-box" style="height: 195px;"> <!-- Added log-box class -->
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/edit/matchbrackets.min.js"></script> <!-- Added for bracket matching -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/edit/closebrackets.min.js"></script> <!-- Added for auto-close brackets -->


    <!-- Game Engine Scripts -->
    <script src="js/engine/arena.js"></script>
    <script src="js/engine/game.js"></script>

    <!-- UI Component Scripts -->
    <script src="js/ui/editor.js"></script>
    <script src="js/ui/dashboard.js"></script>
    <script src="js/ui/controls.js"></script>
    <script src="js/ui/lobby.js"></script> <!-- Handles both Event Log and Robot Log now -->
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
const ServerRobotInterpreter = require('./server-interpreter'); // Corrected require name
const ServerCollisionSystem = require('./server-collision'); // Handles collisions

// --- Game Simulation Constants ---
const TICK_RATE = 30; // Updates per second
const ARENA_WIDTH = 900; // Match canvas size
const ARENA_HEIGHT = 900; // Match canvas size

/**
 * Represents a single active game match on the server.
 * Manages the game state, robots (including potential AI dummies),
 * interpreter, collisions, game loop,
 * broadcasts state to players and spectators, handles self-destruct requests, // <-- Added self-destruct
 * and notifies the GameManager upon game completion via a callback.
 */
class GameInstance {
    /**
     * Creates a new game instance.
     * @param {string} gameId - A unique identifier for this game.
     * @param {SocketIO.Server} io - The main Socket.IO server instance.
     * @param {Array<{socket: SocketIO.Socket | null, code: string, appearance: string, name: string, isReady: boolean}>} playersData - Array of player data (socket can be null for AI).
     * @param {Function} gameOverCallback - Function provided by GameManager to call when the game ends. Expects (gameId, winnerData) object.
     * @param {string} gameName - Thematic name for the game
     */
    constructor(gameId, io, playersData, gameOverCallback, gameName = '') {
        this.gameId = gameId;
        this.io = io; // Socket.IO server instance for broadcasting
        // Map: socket.id (for real players) or dummy ID -> { socket, robot, code, appearance, name }
        this.players = new Map();
        this.robots = []; // Array of ServerRobot instances in this game
        this.playerNames = new Map(); // Map: robot.id -> name (for easier lookup during logs/events)
        this.interpreter = new ServerRobotInterpreter(); // Handles robot code execution
        this.collisionSystem = new ServerCollisionSystem(this); // Handles collisions
        this.gameLoopInterval = null; // Stores the setInterval ID for the game loop
        this.lastTickTime = 0; // Timestamp of the last tick
        // Stores explosion data generated this tick to send to clients
        this.explosionsToBroadcast = [];
        // Store the callback function provided by GameManager
        this.gameOverCallback = gameOverCallback;
        // Store game name
        this.gameName = gameName || `Game ${gameId}`; // Use provided name or generate default
        // Define the spectator room name for this instance
        this.spectatorRoom = `spectator-${this.gameId}`;


        console.log(`[${this.gameId} - '${this.gameName}'] Initializing Game Instance...`);

        // Initialize players and their robots based on received data
        playersData.forEach((playerData, index) => {
            // Assign starting positions (simple alternating sides)
            const startX = index % 2 === 0 ? 150 : ARENA_WIDTH - 150; // Spread out a bit more
            const startY = 100 + Math.floor(index / 2) * (ARENA_HEIGHT - 200);
            const startDir = index % 2 === 0 ? 0 : 180;

            // Determine the ID: socket ID for real players, dummy ID for AI
            // Use gameId in dummy ID to ensure uniqueness across multiple test games
            const robotId = playerData.socket ? playerData.socket.id : `dummy-bot-${this.gameId}`;

            // Create the ServerRobot instance, passing appearance
            const robot = new ServerRobot(
                robotId, // Use determined ID
                startX, startY, startDir,
                playerData.appearance // Pass the appearance identifier
            );
            // Assign the name directly to the robot instance
            robot.name = playerData.name;
            this.robots.push(robot);

            // Store player data associated with the robot, using the robot's ID as the key
            this.players.set(robotId, {
                socket: playerData.socket, // Can be null
                robot: robot,
                code: playerData.code,
                appearance: playerData.appearance,
                name: playerData.name // Store name here as well
            });
            // Store name in the separate map for quick lookups using robot ID
            this.playerNames.set(robot.id, playerData.name);

            console.log(`[${this.gameId} - '${this.gameName}'] Added participant ${playerData.name} (${robot.id}) (Appearance: ${playerData.appearance}) with Robot ${robot.id}. Socket: ${playerData.socket ? 'Yes' : 'No'}`);

            // Add the player's socket to the dedicated Socket.IO room for this game
            // Only join room if it's a real player with a socket
            if (playerData.socket) {
                playerData.socket.join(this.gameId);
                console.log(`[${this.gameId} - '${this.gameName}'] Player ${playerData.name} joined Socket.IO room.`);
            }
        });

        // Initialize the interpreter AFTER all robots and player data are set up
        // Pass the list of robots and the full players map (which includes null sockets for dummies)
        this.interpreter.initialize(this.robots, this.players); // Pass the map containing potentially null sockets

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

            // 1. Execute Robot AI Code (Interpreter handles both real and dummy AI)
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
            // For test games, gameId room only contains the one real player.
            this.io.to(this.gameId).to(this.spectatorRoom).emit('gameStateUpdate', gameState);

        } catch (error) {
             console.error(`[${this.gameId} - '${this.gameName}'] CRITICAL ERROR during tick:`, error);
             // Consider stopping the game or notifying players
             this.stopGameLoop(); // Stop loop on critical error
             // Notify players and spectators of the error
             this.io.to(this.gameId).to(this.spectatorRoom).emit('gameError', { message: `Critical server error during game tick for '${this.gameName}'. Game aborted.` });
             // Manually trigger game over callback with no winner due to error
             if (typeof this.gameOverCallback === 'function') {
                  // Determine if it was a test game to pass flag back
                  const wasTest = this.gameName.startsWith("Test Arena");
                 this.gameOverCallback(this.gameId, { winnerId: null, winnerName: 'None', reason: 'Server Error', wasTestGame: wasTest });
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
        // Only proceed if the game loop is actually running
        // This prevents multiple gameOver events if checkGameOver is called after stopGameLoop
        if (!this.gameLoopInterval) {
            return true; // Consider game over if loop isn't running
        }

        // Count how many robots are still marked as alive
        const aliveRobots = this.robots.filter(r => r.isAlive);

        // Game ends if 1 or 0 robots are left alive (and we started with at least 2 robots).
        if (aliveRobots.length <= 1 && this.robots.length >= 2) {
            const winnerRobot = aliveRobots[0]; // Could be undefined if 0 left (draw/mutual destruction)

            // Prepare winner data object
            let winnerData = { // Use let so we can add wasTestGame later if needed
                gameId: this.gameId, // Add gameId for context on client/server
                winnerId: winnerRobot ? winnerRobot.id : null,
                winnerName: winnerRobot ? winnerRobot.name : 'None', // Get name from robot instance
                reason: winnerRobot ? "Last robot standing!" : "Mutual Destruction!"
            };

            console.log(`[${this.gameId} - '${this.gameName}'] Game Over detected. Reason: ${winnerData.reason}. Winner: ${winnerData.winnerName} (${winnerData.winnerId || 'N/A'})`);

            // --- STOP GAME LOOP FIRST ---
            // Stop the simulation loop for this game instance BEFORE sending events.
            this.stopGameLoop();
            // --- END STOP GAME LOOP ---


            // Identify the real player socket ID in this game (the one that's not null)
            const realPlayerEntry = Array.from(this.players.entries()).find(([id, data]) => data.socket !== null);
            const realPlayerSocketId = realPlayerEntry ? realPlayerEntry[0] : null;

            // Notify players *in the game room* about the game end
            // If it's a test game, target the specific real player socket ID, otherwise broadcast to room
            const target = realPlayerSocketId || this.gameId;
            console.log(`[${this.gameId} - '${this.gameName}'] Emitting gameOver to target: ${target}`);
            this.io.to(target).emit('gameOver', winnerData); // GameManager callback adds wasTestGame flag before passing to client

            // Notify spectators *in the spectator room* about the game end (if any exist)
            this.io.to(this.spectatorRoom).emit('spectateGameOver', winnerData);
            console.log(`[${this.gameId} - '${this.gameName}'] Notified spectator room ${this.spectatorRoom} of game over.`);


            // Call the GameManager callback to handle lobby events etc.
            // Pass gameId along with winnerData for context in GameManager
            // The callback *must* add the wasTestGame flag if appropriate
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
    }

    /**
     * Gathers the current state of the game (robots, missiles, effects)
     * into a serializable object suitable for broadcasting to clients via Socket.IO.
     * Includes the gameName.
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
     * Triggers the self-destruction sequence for a specific robot.
     * Marks the robot as dead, applies max damage, creates an explosion,
     * and checks for game over.
     * @param {string} robotId - The ID of the robot to self-destruct (should be a real player's socket ID).
     */
    triggerSelfDestruct(robotId) {
         const playerData = this.players.get(robotId);

         if (playerData && playerData.robot && playerData.robot.isAlive) {
             const robot = playerData.robot;
             console.log(`[${this.gameId} - '${this.gameName}'] Triggering self-destruct for robot ${robot.name} (${robot.id}).`);

             // Force death
             robot.takeDamage(100); // This sets isAlive = false and damage = 100

             // Create a big explosion
             this.createExplosion(robot.x, robot.y, 5); // Size 5 explosion

             // Check game over condition immediately after destruction
             // This will stop the loop and trigger the callback if necessary
             this.checkGameOver();
         } else {
             console.warn(`[${this.gameId} - '${this.gameName}'] Could not trigger self-destruct for ${robotId}. Robot not found, already dead, or invalid ID.`);
         }
    }

    /**
     * Removes a player (real or dummy) and marks their robot as inactive upon disconnection or game end.
     * Called by the GameManager.
     * @param {string} robotId - The ID of the robot whose participant is being removed.
     */
    removePlayer(robotId) {
        // Use the playerNames map for logging
        const playerName = this.playerNames.get(robotId) || robotId.substring(0,8)+'...';
        console.log(`[${this.gameId} - '${this.gameName}'] Handling removal of participant ${playerName} (${robotId}).`);

        const playerData = this.players.get(robotId);
        if (playerData) {
            // Mark the robot as inactive
            if (playerData.robot) {
                 playerData.robot.isAlive = false;
                 playerData.robot.damage = 100; // Ensure damage reflects death state
                 playerData.robot.speed = 0; // Stop movement
                 playerData.robot.targetSpeed = 0;
                 console.log(`[${this.gameId} - '${this.gameName}'] Marked robot for ${playerName} as inactive.`);
            }

            // Socket leaving room happens automatically on disconnect for real players
            // Remove player data from the active players map for this game
            this.players.delete(robotId);
            // Remove from name map
            this.playerNames.delete(robotId);

        } else {
             console.warn(`[${this.gameId} - '${this.gameName}'] Tried to remove participant ${robotId}, but they were not found in the player map.`);
        }
    }

    /**
     * Checks if the game instance has no *real* players left in its map.
     * A game with only a dummy bot (null socket) is considered empty for cleanup.
     * Used by GameManager to determine if the instance can be cleaned up.
     * @returns {boolean} True if no real players remain, false otherwise.
     */
    isEmpty() {
        // A test game is considered "empty" for cleanup purposes
        // if the *only* entry left has a null socket (the dummy bot),
        // or if the map is completely empty.
        return this.players.size === 0 || Array.from(this.players.values()).every(p => p.socket === null);
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
        // Also force any remaining real players out of the game room (should be redundant)
        this.io.socketsLeave(this.gameId);
    }

} // End of GameInstance class definition

module.exports = GameInstance;
```

## server/game-manager.js

```code
// server/game-manager.js
const GameInstance = require('./game-instance'); // Manages a single game match
const fs = require('fs'); // Needed to read the dummy bot AI file
const path = require('path'); // Needed to construct the path to the dummy bot AI file

/**
 * Manages the overall flow of players joining, waiting, and starting games.
 * Handles storing player data (including names, readiness), matchmaking,
 * game naming, tracking active/finished games, cleaning up old instances,
 * starting single-player test games, handling self-destruct requests, // <-- Added Self-Destruct
 * transitioning lobby players to spectators, moving participants back to lobby,
 * broadcasting game history,
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

        // --- Added for Test Mode ---
        // Simple hardcoded AI for the dummy bot
        try {
             this.dummyBotCode = fs.readFileSync(path.join(__dirname, 'dummy-bot-ai.js'), 'utf8');
             console.log("[GameManager] Dummy bot AI loaded successfully.");
        } catch (err) {
             console.error("[GameManager] FAILED TO LOAD dummy-bot-ai.js:", err);
             this.dummyBotCode = "// Dummy Bot AI Load Failed\nconsole.log('AI Load Error!'); robot.drive(0,0);"; // Fallback AI
        }
        // --- End Test Mode ---

        console.log("[GameManager] Initialized.");
    }

    /**
     * Adds a newly connected player to the waiting list with default values.
     * Called by socket-handler upon connection *if no games are active*,
     * OR when moving spectators/participants back to lobby state.
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
                 if (player.socket) { // Only add back real players
                     player.isReady = false; // Mark as not ready
                     this.addPlayer(player.socket); // Add back to pending list safely
                     if(player.socket.connected) {
                        player.socket.emit('gameError', { message: `Failed to create game instance '${gameName}'. Please Ready Up again.` });
                     }
                 }
            });
            // Clean up partially created game if needed
            if (this.activeGames.has(gameId)) { this.activeGames.delete(gameId); }
            playersData.forEach(player => {
                 if (player.socket) this.playerGameMap.delete(player.socket.id);
            });
            // Broadcast lobby status after failure handling
            this.broadcastLobbyStatus();
        }
    } // End createGame

    /**
     * Starts a single-player test game against a simple AI bot.
     * Called by socket-handler when 'requestTestGame' is received.
     * @param {SocketIO.Socket} playerSocket - The socket of the player requesting the test.
     * @param {string} playerCode - The AI code submitted by the player.
     * @param {string} playerAppearance - The appearance identifier chosen by the player.
     * @param {string} playerName - The sanitized name provided by the player.
     */
    startTestGameForPlayer(playerSocket, playerCode, playerAppearance, playerName) {
        const playerId = playerSocket.id;
        console.log(`[GameManager] Starting test game for player ${playerName} (${playerId})`);

        // 1. Remove player from the pending list
        if (!this.pendingPlayers.delete(playerId)) {
             console.warn(`[GameManager] Player ${playerName} (${playerId}) requested test game but wasn't pending. Aborting.`);
             playerSocket.emit('lobbyEvent', { message: "Cannot start test game - state conflict.", type: "error" });
             return;
        }

        // 2. Generate Game ID and Name
        const gameId = `test-${this.gameIdCounter++}`;
        // Make the name distinct
        const gameName = `Test Arena ${gameId.split('-')[1]}`; // e.g., Test Arena 0

        // 3. Prepare Player Data for GameInstance
        const playerGameData = {
            socket: playerSocket, // The real player's socket
            code: playerCode,
            appearance: playerAppearance,
            name: playerName,
            isReady: true // Mark as ready for instance logic
        };

        // 4. Prepare Dummy Bot Data
        const dummyBotId = `dummy-bot-${gameId}`;
        const dummyBotGameData = {
            socket: null, // CRUCIAL: Dummy bot has no socket
            code: this.dummyBotCode, // Hardcoded AI script from file
            appearance: 'default', // Or choose a specific one
            name: "Test Bot Alpha", // Fixed name
            isReady: true // Mark as ready
        };

        // 5. Create the GameInstance with BOTH player and dummy bot
        console.log(`[GameManager] Creating test game ${gameId} ('${gameName}')`);
        this.io.emit('lobbyEvent', { message: `Test game '${gameName}' starting for ${playerName}!` });

        try {
             const gameInstance = new GameInstance(
                 gameId,
                 this.io,
                 [playerGameData, dummyBotGameData], // Pass both to the instance
                 (endedGameId, winnerData) => {
                      // Add a flag to the winner data for client-side distinction
                      winnerData.wasTestGame = true;
                      this.handleGameOverEvent(endedGameId, winnerData);
                 },
                 gameName
             );

            this.activeGames.set(gameId, gameInstance);
            // IMPORTANT: Only map the REAL player to the game
            this.playerGameMap.set(playerId, gameId);

            // Send 'gameStart' ONLY to the requesting player's socket
            playerSocket.emit('gameStart', {
                gameId: gameId, gameName: gameName, isTestGame: true, // Add flag
                players: [ // Send info for both player and dummy
                     { id: playerId, name: playerName, appearance: playerAppearance },
                     { id: dummyBotId, name: dummyBotGameData.name, appearance: dummyBotGameData.appearance }
                ]
            });

            gameInstance.startGameLoop();
            this.broadcastLobbyStatus(); // Update lobby counts

        } catch (error) {
             console.error(`[GameManager] Error creating test game ${gameId} ('${gameName}'):`, error);
             this.io.emit('lobbyEvent', { message: `Failed to start test game '${gameName}' for ${playerName}. Please try again.`, type: 'error' });
             // Put the player back into pending if creation failed
             playerGameData.isReady = false; // Mark as not ready
             this.addPlayer(playerSocket); // Add back safely
             if(playerSocket.connected) {
                playerSocket.emit('gameError', { message: `Failed to create test game instance '${gameName}'. Please Ready Up or Test again.` });
             }
             // Clean up maps if needed
             if (this.activeGames.has(gameId)) { this.activeGames.delete(gameId); }
             this.playerGameMap.delete(playerId);
             this.broadcastLobbyStatus(); // Broadcast status after failure
        }
    }


    /**
     * Handles the game over event triggered by a GameInstance callback.
     * Emits lobby events, moves spectators AND participants back to the lobby,
     * cleans up player mapping, removes the game instance, logs the result,
     * and broadcasts the updated game history.
     * @param {string} gameId - The ID of the game that just ended.
     * @param {object} winnerData - Object containing winner details { winnerId, winnerName, reason, wasTestGame? }.
     */
    async handleGameOverEvent(gameId, winnerData) {
        const gameInstance = this.activeGames.get(gameId);
        const gameName = gameInstance ? gameInstance.gameName : `Game ${gameId}`;
        const isTestGame = winnerData.wasTestGame || false; // Check for the test game flag

        const winnerName = winnerData.winnerName || 'No one';
        const reason = winnerData.reason || 'Match ended.';
        console.log(`[GameManager] Received game over event for ${gameId} ('${gameName}'). Winner: ${winnerName}. TestGame: ${isTestGame}`);

        // Adjust lobby message based on game type
        const lobbyMsg = isTestGame ? `Test game '${gameName}' over! Winner: ${winnerName}. (${reason})` : `Game '${gameName}' over! Winner: ${winnerName}. (${reason})`;
        this.io.emit('lobbyEvent', { message: lobbyMsg });

        if (!gameInstance) {
            console.warn(`[GameManager] handleGameOverEvent called for ${gameId}, but instance not found. Skipping cleanup.`);
            this.broadcastLobbyStatus();
            return;
        }

        // --- Move Spectators Back to Lobby ---
        // Test games don't have spectators, but this code handles both cases safely.
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

        // --- Clean up Player Mappings AND Move REAL Participants to Lobby ---
        const playerIds = Array.from(gameInstance.players.keys());
        console.log(`[GameManager] Cleaning up mappings and moving participants to lobby for game ${gameId}:`, playerIds);
        playerIds.forEach(playerId => {
            this.playerGameMap.delete(playerId); // Remove from active game map first
            console.log(`[GameManager] Removed player ${playerId} from playerGameMap.`);

            // Get the socket object for the participant
            const playerData = gameInstance.players.get(playerId);
            const playerSocket = playerData ? playerData.socket : null;

            // Add participant back to the pending list ONLY IF they have a socket AND are connected
            // This prevents trying to add the dummy bot back to the lobby.
            if (playerSocket && playerSocket.connected) {
                 console.log(`[GameManager] Adding participant ${playerId} back to pendingPlayers.`);
                 this.addPlayer(playerSocket); // Add them back to the lobby list safely
            } else if (playerSocket) { // Had a socket but disconnected
                 console.log(`[GameManager] Participant ${playerId} not found or disconnected. Cannot add back to lobby.`);
            } else {
                // This is likely the dummy bot, no socket to add back.
                console.log(`[GameManager] Participant ${playerId} (likely dummy bot) has no socket. Not adding to lobby.`);
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
            // Only log non-test games to history (or add a flag to filter client-side)
            if (!isTestGame) {
                this.recentlyCompletedGames.set(gameId, completedGameData);
                while (this.recentlyCompletedGames.size > this.maxCompletedGames) {
                    const oldestGameId = this.recentlyCompletedGames.keys().next().value;
                    this.recentlyCompletedGames.delete(oldestGameId);
                    console.log(`[GameManager] Pruned oldest completed game log: ${oldestGameId}`);
                }
                console.log(`[GameManager] Logged completed game: ${gameId} ('${gameName}')`);
                 // Broadcast Updated Game History ONLY if a non-test game ended
                this.broadcastGameHistory();
            } else {
                console.log(`[GameManager] Test game ${gameId} ('${gameName}') ended. Not adding to public history.`);
            }
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
    }

     /** Helper function to broadcast the current game history */
     broadcastGameHistory() {
         // Convert map values to an array, sort by endTime descending (newest first)
         const historyArray = Array.from(this.recentlyCompletedGames.values())
                                 // Optional: Filter out test games from history?
                                 // .filter(game => !game.name.startsWith("Test Arena")) // Already filtered during logging

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
                // The GameInstance.isEmpty() method now correctly handles dummy bots.
                if (game.isEmpty()) {
                    console.log(`[GameManager] Active game ${gameId} ('${game.gameName}') has no players left after disconnect. Triggering cleanup.`);
                    // Use the existing gameOver handling which now manages dummy bots correctly
                    this.handleGameOverEvent(gameId, { winnerId: null, winnerName: 'None', reason: 'Player Disconnected', wasTestGame: game.gameName.startsWith("Test Arena") });
                    // Note: handleGameOverEvent deletes the game from activeGames
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
             // Logged above when calling game.removePlayer()
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

    /**
     * Handles a self-destruct request from a player.
     * Finds the game instance and tells it to trigger the destruction.
     * @param {string} socketId - The ID of the player requesting self-destruction.
     */
    handleSelfDestruct(socketId) {
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            if (game && typeof game.triggerSelfDestruct === 'function') {
                console.log(`[GameManager] Relaying self-destruct for ${socketId} to game ${gameId}`);
                game.triggerSelfDestruct(socketId); // Delegate to GameInstance
            } else {
                 console.warn(`[GameManager] Game instance ${gameId} not found or missing triggerSelfDestruct for player ${socketId}.`);
            }
        } // No need for else, socket-handler already warned if not in map
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
        // START CHANGE
        this.arenaWidth = 900; // TODO: Get these from GameInstance or config
        this.arenaHeight = 900;
        // END CHANGE
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

                        // Trigger explosion effect on the GameInstance
                        // It will add this to the list broadcast in the next gameStateUpdate
                        if (typeof this.game.createExplosion === 'function') {
                            this.game.createExplosion(missile.x, missile.y, missile.power);
                        } else {
                             console.warn(`[Collision] GameInstance missing createExplosion method.`);
                        }

                        // Remove the missile from the firing robot's list
                        firingRobot.missiles.splice(i, 1);

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
                    // console.log(`[DEBUG COLL ${robotA.id}/${robotB.id}] Pre-Push: A=(${robotA.x.toFixed(2)}, ${robotA.y.toFixed(2)}), B=(${robotB.x.toFixed(2)}, ${robotB.y.toFixed(2)})`);
                    // --- END COLLISION DEBUG LOGGING ---

                    // Move robots apart by half the overlap distance each
                    const moveDist = overlap / 2;
                    robotA.x -= separationX * moveDist;
                    robotA.y -= separationY * moveDist;
                    robotB.x += separationX * moveDist;
                    robotB.y += separationY * moveDist;

                    // --- START COLLISION DEBUG LOGGING ---
                    // console.log(`[DEBUG COLL ${robotA.id}/${robotB.id}] Post-Push: A=(${robotA.x.toFixed(2)}, ${robotA.y.toFixed(2)}), B=(${robotB.x.toFixed(2)}, ${robotB.y.toFixed(2)})`);
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
                    // if (robotA.x !== preClampAx || robotA.y !== preClampAy) {
                    //      console.log(`[DEBUG COLL ${robotA.id}] Clamped A after push from (${preClampAx.toFixed(2)}, ${preClampAy.toFixed(2)}) to (${robotA.x.toFixed(2)}, ${robotA.y.toFixed(2)})`);
                    // }
                    // if (robotB.x !== preClampBx || robotB.y !== preClampBy) {
                    //      console.log(`[DEBUG COLL ${robotB.id}] Clamped B after push from (${preClampBx.toFixed(2)}, ${preClampBy.toFixed(2)}) to (${robotB.x.toFixed(2)}, ${robotB.y.toFixed(2)})`);
                    // }
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
     * @param {Map<string, {socket: SocketIO.Socket | null, robot: ServerRobot, code: string}>} playersDataMap - Map from robot ID to player data (socket can be null).
     */
    initialize(robots, playersDataMap) {
        console.log("[Interpreter] Initializing robot interpreters (Function Mode)...");

        robots.forEach(robot => {
            const playerData = playersDataMap.get(robot.id);
            const playerSocket = playerData ? playerData.socket : null; // Get socket ref (could be null for dummy)

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
                // NOTE: Dummy bot uses the same API, just no corresponding socket
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

                // --- Console for Robot (Handles Dummy Bot) ---
                console: {
                    log: (...args) => {
                        // 1. Log server-side as before (optional, but useful for server debug)
                        // Use robot.id from outer scope which is reliable
                        console.log(`[Robot ${robot.id} Log]`, ...args);

                        // 2. Format message for client
                        // Simple approach: convert all args to strings and join
                        const messageString = args.map(arg => {
                            try {
                                // Handle different types reasonably
                                if (typeof arg === 'object' && arg !== null) {
                                    // Be careful with circular references in complex objects
                                    // A simple depth limit or specific property selection might be safer
                                    return JSON.stringify(arg, null, 2); // Pretty print object slightly
                                }
                                return String(arg); // Convert others to string
                            } catch (e) {
                                return '[Unloggable Value]';
                            }
                        }).join(' ');

                        // 3. Emit to the specific client's socket if connected
                        // CRUCIAL: Only emit if playerSocket exists (i.e., not the dummy bot)
                        // Use the playerSocket variable captured in the outer scope for THIS robot
                        if (playerSocket && playerSocket.connected) {
                            playerSocket.emit('robotLog', { message: messageString });
                        }
                    }
                },
                // --- END MODIFIED CONSOLE ---

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
                 // CRUCIAL: Only emit if playerSocket exists
                 // Use the playerSocket variable captured in the outer scope
                if (playerSocket && playerSocket.connected) {
                    playerSocket.emit('codeError', {
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
                const context = this.robotContexts[robot.id]; // The sandbox object for THIS robot
                // Need player data to check for socket when handling errors
                const playerData = gameInstance.players.get(robot.id); // Get player data again for socket access in error handling
                const playerSocket = playerData ? playerData.socket : null; // Get socket for error handling

                try {
                    // *** Execute the stored function for this tick ***
                    tickFunction.call(context /*, arguments if any */);

                } catch (error) {
                    // Handle runtime errors *inside* the robot's code during the call
                    console.error(`[Interpreter] Runtime error during function execution for robot ${robot.id}:`, error.message);
                    // Notify the client about the runtime error
                     // CRUCIAL: Only emit if playerSocket exists
                     // Use the playerSocket captured just above
                    if (playerSocket && playerSocket.connected) {
                        playerSocket.emit('codeError', {
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

    /** Safely retrieves the ServerRobot instance for the currently executing robot. @private */
    getCurrentRobot() {
        if (!this.currentRobotId || !this.currentGameInstance) return null;
        // Find the robot directly in the gameInstance's robots array
        // This avoids relying on the players map which might change structure
        return this.currentGameInstance.robots.find(r => r.id === this.currentRobotId);
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
        if (robot && typeof direction === 'number') {
            // Use default resolution if not provided or invalid
            const res = (typeof resolution === 'number' && resolution > 0) ? resolution : 10;
            return this.currentGameInstance.performScan(robot, direction, res);
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
            // Allow power to be optional or undefined, defaulting inside robot.fire
            return robot.fire(direction, power);
        } else if (robot) {
            console.warn(`[Interpreter] Invalid fire(${direction}, ${power}) call for robot ${robotId}`);
        }
        return false;
    }

    /** Safely retrieves robot damage. */
    safeDamage(robotId) {
        if (robotId !== this.currentRobotId) return 100; // Assume max damage if invalid call
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
 * test game requests, self-destruct requests, routes players to spectate if games are in progress, // <-- Added self-destruct
 * and sends initial game history.
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
        let spectateTarget = null; // Store target game if spectating
        if (gameManager.activeGames.size > 0) {
            // Simple logic: pick the first active game found
            try {
                // Use Array.from to safely get an iterator and take the first entry
                const firstGameEntry = Array.from(gameManager.activeGames.entries())[0];
                if (!firstGameEntry) {
                     throw new Error("Active games map was not empty but couldn't get first entry.");
                }
                const [gameId, gameInstance] = firstGameEntry;
                const gameName = gameInstance.gameName || `Game ${gameId}`;
                const spectatorRoom = `spectator-${gameId}`;

                spectateTarget = { gameId, gameName }; // Store the game being spectated
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
                 console.error(`[Socket ${socket.id}] Error finding/processing active game to spectate: ${error}. Adding to lobby instead.`);
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
                const state = gameManager.playerGameMap.has(socket.id) ? 'in game' : (spectateTarget ? `spectating ${spectateTarget.gameName}` : 'unknown state');
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
                 const state = gameManager.playerGameMap.has(socket.id) ? 'in game' : (spectateTarget ? `spectating ${spectateTarget.gameName}` : 'unknown state');
                 console.warn(`[Socket ${socket.id}] Attempted to unready while ${state}. Ignoring.`);
                 socket.emit('lobbyEvent', { message: `Cannot unready while ${state}.`, type: "error" });
                 return;
             }
            // --- End check ---

            console.log(`[Socket ${socket.id}] Received 'playerUnready' signal.`);
            // Update player status in GameManager (will also broadcast status update)
            gameManager.setPlayerReadyStatus(socket.id, false);
        });

        // --- Handle Request for Single-Player Test Game ---
        socket.on('requestTestGame', (data) => {
            // Check if player is allowed to start a test (must be in pendingPlayers)
            if (!gameManager.pendingPlayers.has(socket.id)) {
                const state = gameManager.playerGameMap.has(socket.id) ? 'in game' : (spectateTarget ? `spectating ${spectateTarget.gameName}` : 'unknown state');
                console.warn(`[Socket ${socket.id}] Attempted to start test game while ${state}. Ignoring.`);
                socket.emit('lobbyEvent', { message: `Cannot start test while ${state}.`, type: "error" });
                return;
            }

            // Validate received data structure
            if (data && typeof data.code === 'string' && typeof data.appearance === 'string' && typeof data.name === 'string') {
                // Sanitize/validate name server-side
                const name = data.name.trim();
                const sanitizedName = name.substring(0, 24) || `Anon_${socket.id.substring(0,4)}`;
                const finalName = sanitizedName.replace(/<[^>]*>/g, ""); // Strip HTML tags

                console.log(`[Socket ${socket.id}] Received Test Game Request: Name='${finalName}', Appearance='${data.appearance}'`);

                // Call the new GameManager method
                gameManager.startTestGameForPlayer(socket, data.code, data.appearance, finalName);
            } else {
                console.warn(`[Socket ${socket.id}] Received invalid test game request data:`, data);
                socket.emit('submissionError', { message: 'Invalid data format received by server for test game.' });
            }
        });
        // --- END: Test Game Request Handler ---

        // Handle incoming chat messages from a client
        socket.on('chatMessage', (data) => {
            if (data && typeof data.text === 'string') {
                // Get sender's current name from GameManager OR identify as spectator
                 let senderName = gameManager.getPlayerName(socket.id);
                 let isSpectator = false; // Flag to check if sender is likely a spectator

                 if (!senderName) {
                     // Check if they might be spectating by checking rooms they are in
                     const rooms = Array.from(socket.rooms);
                     if (rooms.length > 1) { // Usually [socket.id, spectateRoom]
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
                    // Basic sanitization (encode basic HTML chars)
                    const sanitizedText = messageText.replace(/</g, "<").replace(/>/g, ">");

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

        // --- Handle Self Destruct Request ---
        socket.on('selfDestruct', () => {
             console.log(`[Socket ${socket.id}] Received selfDestruct signal.`);
             // Validate: Player must be in an active game map
             const gameId = gameManager.playerGameMap.get(socket.id);
             if (!gameId) {
                 console.warn(`[Socket ${socket.id}] Sent selfDestruct but is not in playerGameMap. Ignoring.`);
                 // Optionally send feedback? socket.emit('lobbyEvent', { message: "Cannot self-destruct: Not in game.", type: "error" });
                 return;
             }
             // Delegate to game manager
             gameManager.handleSelfDestruct(socket.id);
        });
        // --- END: Self Destruct Handler ---

        // Listener for player actions during a game (currently unused placeholder)
        // socket.on('robotAction', (action) => {
        //     gameManager.handlePlayerAction(socket.id, action);
        // });

    }); // End io.on('connection')

    console.log("[Socket Handler] Initialized and listening for connections.");
}

module.exports = initializeSocketHandler;
```

