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

/* --- START: Header Image Styling (Added from previous attempt, assuming it was desired) --- */
/* If you didn't add an image, you can remove this block */
header img#header-logo {
    max-height: 40px; /* Small height */
    width: auto;
    vertical-align: middle;
    margin-right: 15px;
}
/* --- END: Header Image Styling --- */


header h1 {
    /* --- 80s Retro Font --- */
    font-family: 'Press Start 2P', cursive;
    font-size: 1.8rem; /* Adjust if needed */
    /* --- End Retro Font --- */
    color: #4CAF50;
    margin: 0 10px 0 0; /* Add some right margin */
    /* Added from previous attempt for image alignment */
    display: inline-block;
    vertical-align: middle;
    flex-shrink: 0;
}

nav {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap; /* Allow nav items to wrap on smaller screens */
    /* flex-grow: 1; Removed - let header space-between handle it */
    /* justify-content: flex-end; Removed */
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


/* Grid for main content (Arena/Editor) - Original Ratio */
main {
    display: grid;
    grid-template-columns: 1.6fr 1fr; /* Original space for game area */
    gap: 20px;
    flex-grow: 1; /* Allow main grid to grow vertically */
    min-height: 0; /* Important for flex context */
    width: 100%; /* Take full width of container */
}

/* Original structure for columns */
.game-container {
    display: flex;
    flex-direction: column;
    gap: 20px; /* Original gap */
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


/* Constrain Stats Panel Height MORE - Original values */
.stats-panel {
    /* Apply console-panel base styles */
    background-color: #333;
    padding: 15px; /* Keep original padding */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    /* Original Max height */
    max-height: 180px;
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

/* Original Editor Container structure */
.editor-container {
    display: flex;
    flex-direction: column;
    gap: 15px; /* Original gap */
    min-height: 0; /* Prevent flex items from overflowing grid cell */
}

/* CodeMirror Styling - Original Min-Height */
.CodeMirror {
    flex-grow: 1; /* Allow editor to grow vertically */
    /* Original Minimum height */
    min-height: 500px;
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

/* Constrain API Help Height MORE - Original values */
.api-help {
    /* Apply console-panel base styles */
    background-color: #333;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    /* Original Max height */
    max-height: 150px;
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
     flex-shrink: 0; /* ADDED: Prevent shrinking */
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
    flex-shrink: 0; /* ADDED: Prevent shrinking */
}
/* END: Styling for Editor Controls */


/* --- START: Robot Console Log Specific Styles (FALLOUT TERMINAL - GREEN) --- */
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
    height: 200px; /* Original height */
    background-color: #000000; /* True black background */
    color: #00FF41; /* Classic terminal green text */
    font-size: 16px; /* Original size */
    border: 2px solid #004d00; /* Original border */
    padding: 10px;
    text-shadow: 0 0 5px rgba(0, 255, 65, 0.5); /* Text glow */
    word-wrap: break-word;
    overflow-y: scroll; /* Keep scroll */
    font-family: 'VT323', monospace; /* Explicitly set font here too */
    position: relative; /* Keep for scanline */
    overflow: hidden; /* Keep for scanline */
}

#robot-log-messages::after { /* Scanline */
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: rgba(0, 255, 0, 0.15); box-shadow: 0 0 4px 1px rgba(0, 255, 0, 0.15);
    z-index: 3; pointer-events: none; animation: scanline-log 6s linear infinite;
}
/* --- END: Robot Console Log Specific Styles --- */


/* === START: ADDED Opponent Console Log Styles === */
#opponent-console-log {
    /* margin-top is handled inline in HTML */
    background-color: #1a1010; /* Darker REDDISH bg */
    border: 2px solid #4d0000; /* Darker RED border */
    padding: 8px;
    /* Inherits .console-panel shadow, radius, flex-shrink */
    flex-shrink: 0; /* Explicitly ensure it doesn't shrink */
}

#opponent-console-log h3 {
    color: #ff4136; /* Bright RED title */
    text-align: center;
    margin-bottom: 8px;
    text-shadow: 0 0 4px #ff4136; /* RED glow */
}

#opponent-log-messages {
    height: 200px; /* Match original player log height */
    background-color: #000000; /* True black background */
    color: #FF4136; /* Classic terminal RED text */
    font-size: 16px; /* Match original player log font size */
    border: 2px solid #4d0000; /* Solid, slightly thicker RED border */
    padding: 10px;
    text-shadow: 0 0 5px rgba(255, 65, 54, 0.5); /* RED Text glow */
    word-wrap: break-word;
    overflow-y: scroll; /* Keep scroll */
    font-family: 'VT323', monospace; /* Explicitly set font here too */
    position: relative; /* Keep for scanline */
    overflow: hidden; /* Keep for scanline */
}

#opponent-log-messages::after { /* Scanline */
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: rgba(255, 65, 54, 0.15); /* RED scanline */
    box-shadow: 0 0 4px 1px rgba(255, 65, 54, 0.15); /* RED glow */
    z-index: 3; pointer-events: none;
    /* Use the SAME animation name as the player log */
    animation: scanline-log 6s linear infinite;
}
/* === END: ADDED Opponent Console Log Styles === */


/* Scanline Animation Keyframes (Defined once, used by both logs) */
@keyframes scanline-log {
    0% { transform: translateY(0%); opacity: 0.1; }
    50% { opacity: 0.3; }
    100% { transform: translateY(calc(100% - 2px)); opacity: 0.1; }
}


/* Lobby Area - Original */
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
         max-height: 150px; /* Original stacked stats height */
     }
    #robot-console-log, #opponent-console-log { /* <<< Apply to both */
        /* Keep reasonable height when stacked */
        margin-top: 10px; /* Ensure spacing */
    }
    #robot-log-messages, #opponent-log-messages { /* <<< Apply to both */
        height: 150px; /* Original stacked height */
    }
    /* Optional: Slow down or disable scanline/flicker on mobile? */
    /* #robot-log-messages::after, #opponent-log-messages::after { animation: none; } */
}

@media (max-width: 768px) {
    header {
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    /* Added centering for header image/title */
    header > img#header-logo, header > h1 {
        display: block; margin: 0 auto 5px auto; text-align: center;
    }
     header h1 { font-size: 1.4rem; } /* Even smaller title */

    nav {
        justify-content: center;
        gap: 8px;
        width: 100%; /* Allow nav to take full width */
    }
     #lobby-area {
        grid-template-columns: 1fr;
    }
    #game-history-log {
         margin-top: 20px;
    }
     .CodeMirror {
        min-height: 350px; /* Original stacked editor height */
    }
    .stats-panel, .api-help {
        max-height: 130px; /* Original smaller mobile height */
    }
     #robot-console-log, #opponent-console-log { /* <<< Apply to both */
         /* Use same max-height as stats/api on mobile */
         max-height: 130px; /* Original smaller mobile height */
     }
     #robot-log-messages, #opponent-log-messages { /* <<< Apply to both */
        height: 100px; /* Original smaller mobile height */
        font-size: 14px; /* Original smaller mobile font */
    }
}
```

## client/js/engine/arena.js

```code
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
const MAX_ROBOT_LOG_MESSAGES = 100; // Allow more player robot messages
const MAX_OPPONENT_LOG_MESSAGES = 100; // Separate limit for opponent log

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


// --- START: Player Robot Console Log ---
/**
 * Adds a message to the player's console log display. Handles scrolling.
 * @param {string} message - The message text from the player's robot console.log.
 */
function addRobotLogMessage(message) {
    const logElement = document.getElementById('robot-log-messages'); // Target player element
    if (!logElement) {
        console.warn("Robot log messages element '#robot-log-messages' not found.");
        return;
    }
    // Scroll check
    const wasScrolledToBottom = logElement.scrollHeight - logElement.clientHeight <= logElement.scrollTop + 1;

    // Create and style message div
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.marginBottom = '2px'; // Tighter spacing

    logElement.appendChild(messageDiv);

    // Remove old messages
    while (logElement.childNodes.length > MAX_ROBOT_LOG_MESSAGES) {
        logElement.removeChild(logElement.firstChild);
    }
    // Auto-scroll
    if (wasScrolledToBottom) {
        logElement.scrollTop = logElement.scrollHeight;
    }
}

/** Clears the player's robot console log */
function clearRobotLog() {
     const logElement = document.getElementById('robot-log-messages');
     if (logElement) {
         logElement.innerHTML = '';
         // Add thematic cleared message
         addRobotLogMessage("--- R.O.S. V1.3 REINITIALIZED ---");
     }
}
// --- END: Player Robot Console Log ---


// --- START: Opponent Robot Console Log ---
/**
 * Adds a message to the opponent's console log display. Handles scrolling.
 * @param {string} message - The message text from the opponent's robot console.log.
 */
function addOpponentLogMessage(message) {
    const logElement = document.getElementById('opponent-log-messages'); // Target opponent element
    if (!logElement) {
        console.warn("Opponent log messages element '#opponent-log-messages' not found.");
        return;
    }
    // Scroll check
    const wasScrolledToBottom = logElement.scrollHeight - logElement.clientHeight <= logElement.scrollTop + 1;

    // Create and style message div
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.marginBottom = '2px'; // Match player log spacing

    logElement.appendChild(messageDiv);

    // Remove old messages
    while (logElement.childNodes.length > MAX_OPPONENT_LOG_MESSAGES) { // Use separate limit
        logElement.removeChild(logElement.firstChild);
    }
    // Auto-scroll
    if (wasScrolledToBottom) {
        logElement.scrollTop = logElement.scrollHeight;
    }
}

/** Clears the opponent's robot console log */
function clearOpponentLog() {
     const logElement = document.getElementById('opponent-log-messages');
     if (logElement) {
         logElement.innerHTML = '';
         // Add thematic cleared message
         addOpponentLogMessage("--- OPPONENT SIGNAL LOST ---");
     }
}
// --- END: Opponent Robot Console Log ---


// --- Make functions globally accessible ---
window.updateLobbyStatus = updateLobbyStatus;
window.addEventLogMessage = addEventLogMessage;
window.clearEventLog = clearEventLog;
window.addRobotLogMessage = addRobotLogMessage; // Player log
window.clearRobotLog = clearRobotLog;           // Player log clear
window.addOpponentLogMessage = addOpponentLogMessage; // Opponent log ADDED
window.clearOpponentLog = clearOpponentLog;           // Opponent log clear ADDED


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


    // --- Clear placeholder text on initial load for ALL logs ---
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

    // ADDED: Clear opponent log placeholder
    const opponentLogElement = document.getElementById('opponent-log-messages');
    if (opponentLogElement && opponentLogElement.textContent.trim() === 'Waiting for opponent messages...') {
        opponentLogElement.innerHTML = ''; // Clear placeholder
        addOpponentLogMessage("SCANNING FOR HOSTILE TRANSMISSIONS...");
        addOpponentLogMessage("...");
        addOpponentLogMessage("...");
        addOpponentLogMessage("> STANDING BY");
    }
    // --- End Placeholder Clearing ---
});

console.log("Lobby UI functions initialized (lobby.js). Includes Player AND Opponent Log handlers.");
```

## client/js/main.js

```code
// client/js/main.js

/**
 * Main entry point for the Robot Wars client application.
 * Initializes all necessary components after the DOM is loaded.
 */

// Declare variables in the global scope
let game;
let controls;
let network;
let audioManager; // Added AudioManager variable

document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded, initializing game components...');

    try {
        // START CHANGE: Initialize AudioManager first
        // 1. Initialize the Audio Manager
        audioManager = new AudioManager();
        window.audioManager = audioManager; // Make globally accessible if needed by Game.js etc.
        console.log('AudioManager initialized.');
        // END CHANGE


        // 2. Initialize the Game engine object
        game = new Game('arena');

        // 3. Initialize the Network handler
        network = new Network(game);

        // 4. Establish connection to the server
        network.connect();

        // 5. Initialize the Controls handler
        controls = new Controls(game, network);

        // 6. Perform initial drawing
        if (game && game.renderer) { // Use game.renderer now
            game.renderer.redrawArenaBackground(); // Use redraw instead of just grid
        } else {
            console.error("Failed to draw initial background: Game or Renderer object not found.");
        }

        // 7. Initialization Complete
        console.log('Game, Network, Controls, and AudioManager initialized successfully.');
        console.log('Waiting for server connection and game start signal...');

        if (!window.dashboard) {
            console.warn('Dashboard object (window.dashboard) not found.');
        }
         if (!window.audioManager) { // Should exist now, but check
            console.warn('AudioManager object (window.audioManager) not found.');
        }

    } catch (error) {
        console.error("An error occurred during initialization:", error);
        alert("Failed to initialize the game client. Check the console for details.");
    }
});
```

## client/js/network.js

```code
// client/js/network.js

/**
 * Handles client-side network communication with the server using Socket.IO.
 * Connects to the server, sends player data (including name), readiness signals,
 * requests test games, sends self-destruct signals, receives game state updates,
 * handles spectating, processes lobby/chat events, handles robot destruction events,
 * receives game history updates, and handles robot log messages (for both player and opponent). // <-- Updated description
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
                 // Clear BOTH robot logs on new connection
                 if (typeof window.clearRobotLog === 'function') {
                     window.clearRobotLog();
                 }
                 if (typeof window.clearOpponentLog === 'function') { // ADDED
                     window.clearOpponentLog();
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
                this.playerId = id; // Store our own ID
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
                    // Clear BOTH robot logs when starting spectate
                    if (typeof window.clearRobotLog === 'function') {
                         window.clearRobotLog();
                    }
                    if (typeof window.clearOpponentLog === 'function') { // ADDED
                         window.clearOpponentLog();
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
                    // console.log(`Received spectateGameOver for irrelevant game ${data.gameId}. Current spectate: ${this.spectatingGameId}. Ignoring.`); // Optional log
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
                     } // else: ignore updates for irrelevant games
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
                 // Clear BOTH robot logs at game start
                 if (typeof window.clearRobotLog === 'function') {
                      window.clearRobotLog();
                 }
                  if (typeof window.clearOpponentLog === 'function') { // ADDED
                      window.clearOpponentLog();
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
                         // IMPORTANT: The actual UI transition happens here AFTER the delay/explosion has played out client-side
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

            // --- START: Listen for Robot Destruction Event ---
            this.socket.on('robotDestroyed', (data) => {
                // Only process if the game object exists and has the handler
                if (this.game && typeof this.game.handleRobotDestroyed === 'function') {
                    // Check if the event is for the current game we are playing or spectating
                    const relevantGameId = this.isSpectating ? this.spectatingGameId : this.game.gameId;
                    // Note: Server currently sends this to everyone in the game room/spectator room,
                    // so we don't strictly need to check gameId here, but it's safer.
                    // Let game handler decide what to do based on robot ID.
                    this.game.handleRobotDestroyed(data);
                } else {
                     console.warn("Received robotDestroyed event, but game object or handler missing.");
                }
            });
            // --- END: Listen for Robot Destruction Event ---


            // Server reports an error in the robot's code (compilation or runtime)
            this.socket.on('codeError', (data) => {
                // Ensure data includes robotId and message
                if (!data || !data.robotId || typeof data.message !== 'string') {
                     console.warn("Received invalid codeError data:", data);
                     return;
                }

                console.error(`Received Code Error for Robot ${data.robotId}:`, data.message);
                const robotIdentifier = (this.playerId && data.robotId === this.playerId) ? "Your Robot" : `Opponent (${data.robotId.substring(0,4)}...)`;

                // Log to general event log
                if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`Code Error (${robotIdentifier}): ${data.message}`, 'error');
                }

                // Log to the appropriate console (player's or opponent's)
                const logMessage = `--- CODE ERROR ---\n${data.message}\n------------------`;
                if (this.playerId && data.robotId === this.playerId) {
                    if (typeof window.addRobotLogMessage === 'function') {
                        window.addRobotLogMessage(logMessage);
                    }
                } else {
                    if (typeof window.addOpponentLogMessage === 'function') {
                        window.addOpponentLogMessage(logMessage);
                    }
                }

                // Display alert and reset UI only if it's our robot AND we are not spectating
                if (this.playerId && data.robotId === this.playerId && !this.isSpectating) {
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

            // --- Robot Log Listener (Handles Both Player and Opponent) ---
             this.socket.on('robotLog', (data) => {
                 // Validate incoming data structure
                 if (data && typeof data.message === 'string' && typeof data.robotId === 'string') {
                     // Check if the log is from the player's own robot
                     if (this.playerId && data.robotId === this.playerId) {
                         // Call the UI update function for the player's log
                         if (typeof window.addRobotLogMessage === 'function') {
                             window.addRobotLogMessage(data.message);
                         } else {
                             console.warn("addRobotLogMessage function not found!");
                         }
                     } else {
                         // Log is from the opponent (or received before playerId is set, or during spectate)
                         // Call the UI update function for the opponent's log
                         if (typeof window.addOpponentLogMessage === 'function') {
                             window.addOpponentLogMessage(data.message);
                         } else {
                             console.warn("addOpponentLogMessage function not found!");
                         }
                     }
                 } else {
                      console.warn("Received invalid robotLog data format:", data);
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

    <!-- Favicon Link -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">

</head>
<body>
    <div class="container">
        <header>
            <!-- ****** MODIFIED H1 TO INCLUDE LOGO ****** -->
            <h1>
                <img src="/assets/images/RobotwarsLogo.png" alt="Robot Wars Logo" class="header-logo"> <!-- Added logo image -->
                Robot Wars
            </h1>
            <!-- *************************************** -->
            <nav>
                <!-- Player Name Input Field -->
                <input type="text" id="playerName" placeholder="Enter Name" style="padding: 8px; border-radius: 4px; border: 1px solid #555; background: #333; color: #e0e0e0; margin-right: 5px;" maxlength="24">
                <!-- End Player Name Input -->

                <select id="robot-appearance-select" title="Choose Robot Appearance">
                    <option value="default">Default Bot</option>
                    <option value="tank">Tank Bot</option>
                    <option value="spike">Spike Bot</option>
                    <option value="tri">Tri Bot</option>
                </select>
                <button id="btn-ready">Ready Up</button>
                <button id="btn-test-code">Test Code</button>
                <button id="btn-self-destruct" style="display: none;">Self-Destruct</button>
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
                <!-- Canvas -->
                <canvas id="arena" width="900" height="900"></canvas>

                <div class="stats-panel">
                    <h3>Robot Stats</h3>
                    <div id="robot-stats">
                        <!-- Dashboard elements -->
                    </div>
                </div>

                <!-- Robot Console Log -->
                <div id="robot-console-log" class="console-panel">
                    <h3>Robot Console Output</h3>
                    <div id="robot-log-messages" class="log-box">
                        <div>Waiting for robot messages...</div>
                    </div>
                </div>
            </div>

            <div id="opponent-console-log" class="console-panel" style="margin-top: 15px;"> <!-- Added margin top for spacing -->
                <h3>Opponent Console Output</h3>
                <div id="opponent-log-messages" class="log-box">
                    <!-- Opponent console messages will appear here -->
                    <div>Waiting for opponent messages...</div>
                </div>
            </div>

            <div class="editor-container">
                <h3>Robot Code Editor</h3>
                <!-- API Help -->
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

                <!-- Editor Controls -->
                <div class="editor-controls" style="margin-top: 10px; display: flex; gap: 10px; align-items: center;">
                    <button id="btn-save-code">Save Code</button>
                    <select id="loadout-select">
                        <option value="" selected>Load Code...</option>
                    </select>
                    <button id="btn-delete-loadout" disabled title="Delete selected loadout">✖</button>
                </div>
                <div id="loadout-status" style="font-size: 14px; margin-top: 5px; min-height: 1.2em; color: #aaa;"></div>
            </div>
        </main>

        <!-- Lobby Area -->
        <div id="lobby-area">
             <div> <!-- Column 1 -->
                 <h3 style="font-family: 'VT323', monospace; font-size: 18px; color: #4CAF50; margin-bottom: 10px;">Lobby Status</h3>
                 <div id="lobby-status" style="margin-bottom: 10px;">Connecting...</div>
                 <div id="event-log" class="log-box" style="height: 150px; margin-bottom: 10px;">Event Log Loading...</div>
                 <div id="chat-area" style="display: flex; gap: 5px;">
                     <input type="text" id="chat-input" placeholder="Enter chat message..." style="flex-grow: 1; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #2a2a2a; color: #e0e0e0; font-family: 'VT323', monospace; font-size: 14px;" maxlength="100">
                     <button id="send-chat" style="background-color: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: 'VT323', monospace; font-size: 15px;">Send</button>
                 </div>
             </div>
             <div> <!-- Column 2 -->
                 <div id="game-history-log">
                     <h4 style="font-family: 'VT323', monospace; font-size: 18px; color: #4CAF50; margin-bottom: 10px;">Recent Game Results</h4>
                     <div id="game-history-list" class="log-box" style="height: 195px;">
                         <div>No games finished yet.</div>
                     </div>
                 </div>
             </div>
        </div> <!-- End Lobby Area -->

        <!-- No footer logo div -->

    </div> <!-- End .container -->

    <!-- Scripts -->
    <script src="/socket.io/socket.io.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/javascript/javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/edit/matchbrackets.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/edit/closebrackets.min.js"></script>
    <script src="js/engine/arena.js"></script>
    <script src="js/engine/game.js"></script>
    <script src="js/engine/audio.js"></script>
    <script src="js/ui/editor.js"></script>
    <script src="js/ui/dashboard.js"></script>
    <script src="js/ui/controls.js"></script>
    <script src="js/ui/lobby.js"></script>
    <script src="js/ui/history.js"></script>
    <script src="js/network.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

## server/game-instance.js

```code
// server/game-instance.js
const ServerRobot = require('./server-robot');
const ServerRobotInterpreter = require('./server-interpreter');
const ServerCollisionSystem = require('./server-collision');

// --- Game Simulation Constants ---
const TICK_RATE = 30;
const ARENA_WIDTH = 900;
const ARENA_HEIGHT = 900;
const DESTRUCTION_VISUAL_DELAY_MS = 1500; // 1.5 seconds

/**
 * Represents a single active game match on the server.
 * Manages game state, robots, interpreter, collisions, game loop,
 * delayed game over logic, sound event collection & broadcasting, // <-- Updated description
 * and notifies GameManager upon completion.
 */
class GameInstance {
    constructor(gameId, io, playersData, gameOverCallback, gameName = '', isTestGame = false) {
        this.gameId = gameId;
        this.io = io;
        this.players = new Map();
        this.robots = [];
        this.playerNames = new Map();
        this.interpreter = new ServerRobotInterpreter();
        this.collisionSystem = new ServerCollisionSystem(this);
        this.gameLoopInterval = null;
        this.lastTickTime = 0;
        this.explosionsToBroadcast = []; // Visual explosion effects
        // START CHANGE: Add arrays for sound events
        this.fireEventsToBroadcast = [];   // { type: 'fire', x, y, ownerId }
        this.hitEventsToBroadcast = [];    // { type: 'hit', x, y, targetId }
        // END CHANGE
        this.gameOverCallback = gameOverCallback;
        this.gameName = gameName || `Game ${gameId}`;
        this.spectatorRoom = `spectator-${this.gameId}`;
        this.gameEnded = false;
        this.isTestGame = isTestGame;

        console.log(`[${this.gameId} - '${this.gameName}'] Initializing Game Instance (Test: ${this.isTestGame})...`);
        this._initializePlayers(playersData);
        this.interpreter.initialize(this.robots, this.players);
        console.log(`[${this.gameId}] Game Instance Initialization complete.`);
    }

    /** Helper to initialize players and robots */
    _initializePlayers(playersData) {
        playersData.forEach((playerData, index) => {
            const startX = index % 2 === 0 ? 150 : ARENA_WIDTH - 150;
            const startY = 100 + Math.floor(index / 2) * (ARENA_HEIGHT - 200);
            const startDir = index % 2 === 0 ? 0 : 180;
            const robotId = playerData.socket ? playerData.socket.id : `dummy-bot-${this.gameId}`;

            const robot = new ServerRobot(robotId, startX, startY, startDir, playerData.appearance);
            robot.name = playerData.name;
            this.robots.push(robot);

            this.players.set(robotId, { socket: playerData.socket, robot, ...playerData });
            this.playerNames.set(robot.id, playerData.name);

            console.log(`[${this.gameId}] Added participant ${playerData.name} (${robot.id}), Socket: ${playerData.socket ? 'Yes' : 'No'}`);
            if (playerData.socket) {
                playerData.socket.join(this.gameId);
            }
        });
    }

    startGameLoop() {
        console.log(`[${this.gameId}] Starting game loop.`);
        this.lastTickTime = Date.now();
        this.gameEnded = false;
        if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = setInterval(() => {
            if (this.gameEnded) { this.stopGameLoop(); return; }
            const now = Date.now();
            const deltaTime = (now - this.lastTickTime) / 1000.0;
            this.lastTickTime = now;
            this.tick(deltaTime);
        }, 1000 / TICK_RATE);
    }

    stopGameLoop() {
        console.log(`[${this.gameId}] Stopping game loop.`);
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
    }

    tick(deltaTime) {
        try {
            if (this.gameEnded) return;

            // START CHANGE: Clear transient event lists
            this.explosionsToBroadcast = [];
            this.fireEventsToBroadcast = [];
            this.hitEventsToBroadcast = [];
            // END CHANGE

            // 1. Execute Robot AI Code - This now returns results including potential fire events
            const executionResults = this.interpreter.executeTick(this.robots, this);
            // START CHANGE: Collect fire events from interpreter results
            executionResults.forEach(result => {
                if (result && result.fireEventData) {
                    this.addFireEvent(result.fireEventData);
                }
            });
            // END CHANGE

            // 2. Update Robot and Missile Physics/Movement
            this.robots.forEach(robot => {
                robot.update(deltaTime, ARENA_WIDTH, ARENA_HEIGHT);
            });

            // 3. Check for and Resolve Collisions
            // Collision system calls takeDamage, which returns hit results
            // It now also calls this.addHitEvent internally
            this.collisionSystem.checkAllCollisions();

            // 4. Emit robotDestroyed event for newly destroyed robots
            this.robots.forEach(robot => {
                if (robot.state === 'destroyed' && !robot.destructionNotified) {
                    const destructionData = {
                        robotId: robot.id,
                        x: robot.x, y: robot.y,
                        cause: robot.lastDamageCause || 'unknown'
                    };
                    this.io.to(this.gameId).to(this.spectatorRoom).emit('robotDestroyed', destructionData);
                    robot.destructionNotified = true;
                }
            });

            // 5. Check for Game Over Condition (handles delay)
            if (this.checkGameOver()) { return; }

            // 6. Gather and Broadcast State (including new sound events)
            const gameState = this.getGameState();
            this.io.to(this.gameId).to(this.spectatorRoom).emit('gameStateUpdate', gameState);

        } catch (error) {
             console.error(`[${this.gameId}] CRITICAL ERROR during tick:`, error);
             this.gameEnded = true;
             this.stopGameLoop();
             this.io.to(this.gameId).to(this.spectatorRoom).emit('gameError', { message: `Critical server error in '${this.gameName}'. Game aborted.` });
             if (typeof this.gameOverCallback === 'function') {
                 this.gameOverCallback(this.gameId, { winnerId: null, winnerName: 'None', reason: 'Server Error', wasTestGame: this.isTestGame });
             }
        }
    }

    // START CHANGE: Methods to add sound events
    /** Adds a fire event to the list for broadcasting. */
    addFireEvent(eventData) {
        if (eventData && eventData.type === 'fire') {
            this.fireEventsToBroadcast.push(eventData);
            // console.log(`[${this.gameId}] Added fire event from ${eventData.ownerId}`); // Optional Log
        } else {
             console.warn(`[${this.gameId}] Attempted to add invalid fire event:`, eventData);
        }
    }

    /** Adds a hit event to the list for broadcasting. Called by CollisionSystem. */
    addHitEvent(x, y, targetId) {
        this.hitEventsToBroadcast.push({ type: 'hit', x, y, targetId });
        // console.log(`[${this.gameId}] Added hit event for ${targetId} at (${x.toFixed(0)}, ${y.toFixed(0)})`); // Optional Log
    }
    // END CHANGE

    checkGameOver() {
        if (this.gameEnded || !this.gameLoopInterval) return true;

        let potentialLoser = null;
        let destructionPending = false;
        const now = Date.now();

        for (const robot of this.robots) {
            if (robot.state === 'destroyed') {
                if (now >= (robot.destructionTime + DESTRUCTION_VISUAL_DELAY_MS)) {
                    potentialLoser = robot; break;
                } else {
                    destructionPending = true;
                }
            }
        }

        if (destructionPending && !potentialLoser) return false; // Wait for delay

        const activeRobots = this.robots.filter(r => r.state === 'active');
        let isGameOver = false;
        let winner = null;
        let loser = null;
        let reason = 'elimination';

        if (potentialLoser) {
             isGameOver = true;
             loser = this.players.get(potentialLoser.id);
             winner = Array.from(this.players.values()).find(p => p.robot && p.robot.id !== potentialLoser.id);
             reason = `${loser?.name || 'A robot'} was destroyed!`;
        } else if (!destructionPending && activeRobots.length <= 1 && this.robots.length >= 2) {
             isGameOver = true;
             if (activeRobots.length === 1) {
                 winner = this.players.get(activeRobots[0].id);
                 loser = Array.from(this.players.values()).find(p => p.robot && p.robot.id !== activeRobots[0].id);
                 reason = "Last robot standing!";
             } else {
                 reason = "Mutual Destruction!";
             }
        }

        if (isGameOver) {
            this.gameEnded = true;
            this.stopGameLoop();

            // Adjust for Test Games
            if (this.isTestGame) {
                const realPlayerEntry = Array.from(this.players.entries()).find(([id, data]) => data.socket !== null);
                const botEntry = Array.from(this.players.entries()).find(([id, data]) => data.socket === null);
                if(realPlayerEntry && botEntry){
                    const realPlayer = realPlayerEntry[1]; const botPlayer = botEntry[1];
                    // Simplified test game win/loss logic based on final state
                    if (potentialLoser?.id === realPlayer.robot.id || (activeRobots.length===1 && activeRobots[0].id === botPlayer.robot.id)) {
                        winner = botPlayer; loser = realPlayer; // Player Lost or Bot Won
                    } else if (potentialLoser?.id === botPlayer.robot.id || (activeRobots.length===1 && activeRobots[0].id === realPlayer.robot.id)) {
                        winner = realPlayer; loser = botPlayer; // Player Won or Bot Lost
                    } else { // Draw
                        winner = null; loser = null;
                    }
                    if(winner) winner.name = winner.socket ? winner.name : botPlayer.name;
                    if(loser) loser.name = loser.socket ? loser.name : botPlayer.name;
                    // Update reason based on winner/loser
                    if (winner && loser) reason = `${winner.name} defeated ${loser.name}!`;
                    else if (winner) reason = `${winner.name} is the last one standing!`;
                    else reason = "Mutual Destruction in test game!";

                } else { reason = "Test game ended unexpectedly"; winner=null; loser=null; }
            }

            const finalWinnerData = {
                gameId: this.gameId,
                winnerId: winner ? winner.robot.id : null,
                winnerName: winner ? winner.name : 'None',
                reason: reason,
                wasTestGame: this.isTestGame
            };

            console.log(`[${this.gameId}] Final Game Over. Winner: ${finalWinnerData.winnerName}.`);
            this.io.to(this.gameId).emit('gameOver', finalWinnerData);
            this.io.to(this.spectatorRoom).emit('spectateGameOver', finalWinnerData);

            if (typeof this.gameOverCallback === 'function') {
                this.gameOverCallback(this.gameId, finalWinnerData);
            }
            return true;
        }
        return false;
    }

    createExplosion(x, y, size) {
        const explosionData = { id: `e-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`, x, y, size };
        this.explosionsToBroadcast.push(explosionData);
    }

    getGameState() {
        const activeMissiles = [];
        this.robots.forEach(robot => activeMissiles.push(...robot.missiles));

        return {
            gameId: this.gameId,
            gameName: this.gameName,
            robots: this.robots.map(r => ({
                id: r.id, x: r.x, y: r.y, direction: r.direction,
                damage: r.damage, color: r.color, isAlive: r.isAlive,
                appearance: r.appearance, name: r.name
            })),
            missiles: activeMissiles.map(m => ({
                id: m.id, x: m.x, y: m.y, radius: m.radius, ownerId: m.ownerId
            })),
            explosions: this.explosionsToBroadcast, // Visual effects
            // START CHANGE: Include sound event arrays
            fireEvents: this.fireEventsToBroadcast,
            hitEvents: this.hitEventsToBroadcast,
            // END CHANGE
            timestamp: Date.now()
        };
    }

    performScan(scanningRobot, direction, resolution) {
        // (Scan logic remains the same as before)
        if (scanningRobot.state !== 'active') return null;

        const scanDirection = ((Number(direction) % 360) + 360) % 360;
        const halfResolution = Math.max(1, Number(resolution) / 2);
        const scanRange = 800;
        let startAngleDeg = (scanDirection - halfResolution + 360) % 360;
        let endAngleDeg = (scanDirection + halfResolution + 360) % 360;
        const wrapsAround = startAngleDeg > endAngleDeg;

        let closestTargetInfo = null;
        let closestDistanceSq = scanRange * scanRange;

        this.robots.forEach(targetRobot => {
            if (scanningRobot.id === targetRobot.id || targetRobot.state !== 'active') return;

            const dx = targetRobot.x - scanningRobot.x;
            const dy = targetRobot.y - scanningRobot.y;
            const distanceSq = dx * dx + dy * dy;

            if (distanceSq >= closestDistanceSq) return;

            let angleToTargetDeg = Math.atan2(-dy, dx) * 180 / Math.PI;
            angleToTargetDeg = (angleToTargetDeg + 360) % 360;

            let inArc = wrapsAround ? (angleToTargetDeg >= startAngleDeg || angleToTargetDeg <= endAngleDeg)
                                    : (angleToTargetDeg >= startAngleDeg && angleToTargetDeg <= endAngleDeg);

            if (inArc) {
                closestDistanceSq = distanceSq;
                closestTargetInfo = {
                    distance: Math.sqrt(distanceSq), direction: angleToTargetDeg,
                    id: targetRobot.id, name: targetRobot.name
                };
            }
        });
        return closestTargetInfo;
    }

    triggerSelfDestruct(robotId) {
         const playerData = this.players.get(robotId);
         if (playerData?.robot?.state === 'active') {
             const robot = playerData.robot;
             console.log(`[${this.gameId}] Triggering self-destruct for ${robot.name} (${robot.id}).`);
             const result = robot.takeDamage(1000, 'selfDestruct');
             // Tick loop handles event emission and delayed game over
             this.createExplosion(robot.x, robot.y, 5); // Immediate visual effect
             console.log(`[${this.gameId}] Self-destruct applied. Destroyed: ${result.destroyed}`);
         } else {
             console.warn(`[${this.gameId}] Self-destruct failed for ${robotId}: Not found or not active.`);
         }
    }

    removePlayer(robotId) {
        const playerName = this.playerNames.get(robotId) || robotId.substring(0,8)+'...';
        console.log(`[${this.gameId}] Handling removal of participant ${playerName} (${robotId}).`);
        const playerData = this.players.get(robotId);
        if (playerData?.robot) {
             playerData.robot.state = 'destroyed';
             if (!playerData.robot.destructionTime) playerData.robot.destructionTime = Date.now();
             playerData.robot.damage = 100;
             playerData.robot.speed = 0; playerData.robot.targetSpeed = 0;
             console.log(`[${this.gameId}] Marked robot for ${playerName} as destroyed.`);
        }
        this.players.delete(robotId);
        this.playerNames.delete(robotId);
    }

    isEmpty() {
        if (this.players.size === 0) return true;
        return Array.from(this.players.values()).every(p => p.socket === null);
    }

    cleanup() {
        console.log(`[${this.gameId}] Cleaning up instance.`);
        this.io.socketsLeave(this.spectatorRoom);
        this.io.socketsLeave(this.gameId);
        if(this.interpreter) this.interpreter.stop();
    }

} // End GameInstance

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
 * Modifies the game state directly (e.g., applies damage) and
 * notifies the GameInstance about hit events for sound triggers. // <-- Updated description
 */
class ServerCollisionSystem {
    constructor(gameInstance) {
        this.game = gameInstance; // Reference to the GameInstance
        this.arenaWidth = 900; // TODO: Get from config/GameInstance
        this.arenaHeight = 900;
    }

    /**
     * Checks all relevant collisions for the current game tick.
     */
    checkAllCollisions() {
        this.checkMissileRobotCollisions();
        this.checkRobotRobotCollisions();
    }

    /**
     * Checks for collisions between missiles and robots.
     * Applies damage, removes missiles, and generates hit/explosion events.
     */
    checkMissileRobotCollisions() {
        const robots = this.game.robots;

        robots.forEach(targetRobot => {
            // Skip robots that are not active (already destroyed)
            if (targetRobot.state !== 'active') return; // Use state check

            robots.forEach(firingRobot => {
                if (targetRobot.id === firingRobot.id) return;

                for (let i = firingRobot.missiles.length - 1; i >= 0; i--) {
                    const missile = firingRobot.missiles[i];

                    const dx = targetRobot.x - missile.x;
                    const dy = targetRobot.y - missile.y;
                    const distanceSquared = dx * dx + dy * dy;
                    const radiiSum = targetRobot.radius + missile.radius;
                    const radiiSumSquared = radiiSum * radiiSum;

                    if (distanceSquared < radiiSumSquared) {
                        // --- COLLISION DETECTED ---
                        const damageAmount = missile.power * 10;

                        // START CHANGE: Capture result from takeDamage
                        const result = targetRobot.takeDamage(damageAmount, 'missile'); // Pass cause
                        // END CHANGE

                        console.log(`[Collision] Missile from ${firingRobot.id} hit ${targetRobot.id}. Damage: ${damageAmount}. Destroyed: ${result.destroyed}. Hit: ${result.hit}`);

                        // START CHANGE: Generate hit event if damage was applied
                        if (result.hit && typeof this.game.addHitEvent === 'function') {
                            // Use the location from the result object (where the robot was when hit)
                            this.game.addHitEvent(result.x, result.y, targetRobot.id);
                        }
                        // END CHANGE

                        // Trigger visual explosion effect via GameInstance
                        if (typeof this.game.createExplosion === 'function') {
                            this.game.createExplosion(missile.x, missile.y, missile.power);
                        }

                        // Remove the missile
                        firingRobot.missiles.splice(i, 1);

                        // Game over check happens later in the game loop after all collisions/updates
                    }
                }
            });
        });
    }

    /**
     * Checks for collisions between robots to prevent overlap.
     * Applies minor damage, pushes robots apart, and generates hit events.
     */
     checkRobotRobotCollisions() {
        const robots = this.game.robots;
        const numRobots = robots.length;

        for (let i = 0; i < numRobots; i++) {
            const robotA = robots[i];
            // Skip non-active robots
            if (robotA.state !== 'active') continue;

            for (let j = i + 1; j < numRobots; j++) {
                const robotB = robots[j];
                // Skip non-active robots
                if (robotB.state !== 'active') continue;

                const dx = robotB.x - robotA.x;
                const dy = robotB.y - robotA.y;
                const distanceSquared = dx * dx + dy * dy;
                const minDistance = robotA.radius + robotB.radius;
                const minDistanceSquared = minDistance * minDistance;

                if (distanceSquared < minDistanceSquared && distanceSquared > 0.001) {
                    // --- OVERLAP DETECTED ---
                    const distance = Math.sqrt(distanceSquared);
                    const overlap = minDistance - distance;
                    const separationX = dx / distance;
                    const separationY = dy / distance;
                    const moveDist = overlap / 2;

                    // Move robots apart
                    robotA.x -= separationX * moveDist;
                    robotA.y -= separationY * moveDist;
                    robotB.x += separationX * moveDist;
                    robotB.y += separationY * moveDist;

                    // Apply small collision damage & Generate Hit Events
                    // START CHANGE: Generate hit events for robot-robot collision
                    const collisionDamage = 0.5;
                    const resultA = robotA.takeDamage(collisionDamage, 'collision');
                    const resultB = robotB.takeDamage(collisionDamage, 'collision');

                    if (resultA.hit && typeof this.game.addHitEvent === 'function') {
                         this.game.addHitEvent(resultA.x, resultA.y, robotA.id);
                    }
                    if (resultB.hit && typeof this.game.addHitEvent === 'function') {
                         this.game.addHitEvent(resultB.x, resultB.y, robotB.id);
                    }
                    // END CHANGE

                    // Clamp positions after push
                    robotA.x = Math.max(robotA.radius, Math.min(this.arenaWidth - robotA.radius, robotA.x));
                    robotA.y = Math.max(robotA.radius, Math.min(this.arenaHeight - robotA.radius, robotA.y));
                    robotB.x = Math.max(robotB.radius, Math.min(this.arenaWidth - robotB.radius, robotB.x));
                    robotB.y = Math.max(robotB.radius, Math.min(this.arenaHeight - robotB.radius, robotB.y));

                } // End if overlap
            } // End inner loop
        } // End outer loop
    } // End checkRobotRobotCollisions
}

module.exports = ServerCollisionSystem;
```

## server/server-interpreter.js

```code
// server/server-interpreter.js
const vm = require('vm');

// EXECUTION_TIMEOUT is not currently used per-tick, only during init.
// const EXECUTION_TIMEOUT = 50;

/**
 * Executes robot AI code safely within a sandboxed environment on the server.
 * Manages the execution context, provides a controlled API, and directly triggers
 * events (like robotLog, fire) on the GameInstance via safe API methods. // <-- Updated description
 */
class ServerRobotInterpreter {
    constructor() {
        this.robotContexts = {}; // Stores the unique sandboxed context for each robot
        this.robotTickFunctions = {}; // Stores the executable function compiled from robot code
        this.currentRobotId = null; // Temporarily holds the ID of the robot currently executing
        this.currentGameInstance = null; // Temporarily holds a reference to the GameInstance
    }

    initialize(robots, playersDataMap) {
        console.log("[Interpreter] Initializing robot interpreters...");
        robots.forEach(robot => {
            const playerData = playersDataMap.get(robot.id);
            const playerSocket = playerData ? playerData.socket : null; // Needed for init error reporting

            if (!playerData || typeof playerData.code !== 'string' || playerData.code.trim() === '') {
                console.error(`[Interpreter] No valid code for robot ${robot.id}. Disabling.`);
                this.robotTickFunctions[robot.id] = null;
                this.robotContexts[robot.id] = null;
                return;
            }

            const sandbox = {
                state: {},
                robot: { // API available to the robot code
                    drive: (direction, speed) => this.safeDrive(robot.id, direction, speed),
                    scan: (direction, resolution) => this.safeScan(robot.id, direction, resolution),
                    fire: (direction, power) => this.safeFire(robot.id, direction, power),
                    damage: () => this.safeDamage(robot.id),
                    getX: () => this.safeGetX(robot.id),
                    getY: () => this.safeGetY(robot.id),
                    getDirection: () => this.safeGetDirection(robot.id),
                },
                console: {
                    log: (...args) => {
                        // Log server-side (optional)
                        // console.log(`[Robot ${robot.id} Log]`, ...args);
                        const messageString = args.map(arg => {
                            try {
                                // Basic string conversion, handle objects with JSON
                                return (typeof arg === 'object' && arg !== null) ? JSON.stringify(arg) : String(arg);
                            } catch (e) { return '[Unloggable Object]'; } // Handle circular refs etc.
                        }).join(' ');

                        // --- START OF CHANGE: Emit to game room including robotId ---
                        // Ensure game instance context is available (should be during execution)
                        // Note: this.currentGameInstance is set during executeTick
                        if (this.currentGameInstance && this.currentGameInstance.io && this.currentGameInstance.gameId) {
                            this.currentGameInstance.io.to(this.currentGameInstance.gameId).emit('robotLog', {
                                robotId: robot.id, // Include the ID of the robot that logged
                                message: messageString
                            });
                        } else {
                            // Fallback or error if game instance isn't set (shouldn't normally happen during tick)
                            // console.warn(`[Interpreter] Cannot emit robotLog for ${robot.id}: No currentGameInstance context during console.log.`);
                            // If there's a socket, maybe still send to owner as fallback?
                            if (playerSocket?.connected) {
                                playerSocket.emit('robotLog', {
                                    robotId: robot.id,
                                    message: `(Context Issue) ${messageString}`
                                });
                             }
                        }
                        // --- END OF CHANGE ---
                    }
                },
                // Limited Math object (can be expanded if needed)
                Math: {
                    abs: Math.abs, acos: Math.acos, asin: Math.asin, atan: Math.atan, atan2: Math.atan2,
                    ceil: Math.ceil, cos: Math.cos, floor: Math.floor, max: Math.max, min: Math.min,
                    pow: Math.pow, random: Math.random, round: Math.round, sin: Math.sin, sqrt: Math.sqrt,
                    tan: Math.tan, PI: Math.PI
                },
                // Explicitly allow certain safe Number properties/methods if needed
                Number: {
                    isFinite: Number.isFinite, isNaN: Number.isNaN, parseFloat: Number.parseFloat, parseInt: Number.parseInt
                },
                // Disable potentially harmful globals explicitly
                setTimeout: undefined, setInterval: undefined, setImmediate: undefined,
                clearTimeout: undefined, clearInterval: undefined, clearImmediate: undefined,
                require: undefined, process: undefined, global: undefined, globalThis: undefined,
                Buffer: undefined, // etc.
            };

            // Create the context using the sandboxed environment
            this.robotContexts[robot.id] = vm.createContext(sandbox);

            try {
                // Wrap user code in a function for better isolation and execution control
                const wrappedCode = `(function() { "use strict";\n${playerData.code}\n});`;
                // Compile the script
                const script = new vm.Script(wrappedCode, {
                    filename: `robot_${robot.id}.js`, // Useful for error reporting
                    displayErrors: true
                });

                // Run the script once to get the function it returns
                // Timeout during initialization prevents infinite loops in top-level code
                this.robotTickFunctions[robot.id] = script.runInContext(this.robotContexts[robot.id], { timeout: 500 }); // 500ms timeout for init

                // Check if the result is actually a function
                if (typeof this.robotTickFunctions[robot.id] !== 'function') {
                     throw new Error("Compiled code did not produce a function. Ensure your code is wrapped correctly or is just statements.");
                }
                console.log(`[Interpreter] Compiled function for robot ${robot.id}`);

            } catch (error) {
                console.error(`[Interpreter] Error initializing/compiling function for robot ${robot.id}:`, error.message);
                // Report initialization error back to the specific player
                if (playerSocket?.connected) {
                    playerSocket.emit('codeError', { robotId: robot.id, message: `Initialization Error: ${error.message}` });
                }
                this.robotTickFunctions[robot.id] = null; // Disable this robot
                this.robotContexts[robot.id] = null;
            }
        });
        console.log("[Interpreter] Initialization complete.");
    }

    /**
     * Executes one tick of AI code for all active robots.
     * Safe API methods called within the robot code might trigger events on the GameInstance.
     * @param {ServerRobot[]} robots - Array of all robot instances in the game.
     * @param {GameInstance} gameInstance - Reference to the current game instance.
     * @returns {Array} An empty array (events are now triggered via side effects in safe API calls).
     */
    executeTick(robots, gameInstance) {
        this.currentGameInstance = gameInstance; // Provide context for safe methods
        const results = []; // Keep array structure, though not used for sound events currently

        robots.forEach(robot => {
            // Only execute if robot is active and has a valid compiled function/context
            if (robot.state === 'active' && this.robotTickFunctions[robot.id] && this.robotContexts[robot.id]) {
                this.currentRobotId = robot.id; // Set context for safe API calls
                const tickFunction = this.robotTickFunctions[robot.id];
                const context = this.robotContexts[robot.id];
                const playerData = gameInstance.players.get(robot.id); // Find player data (including socket)
                const playerSocket = playerData ? playerData.socket : null;

                try {
                    // Execute the robot's compiled code function for this tick
                    // No per-tick timeout applied here to avoid complexity, relies on server stability
                    // A more robust solution might involve worker threads or limits on computation steps.
                    tickFunction.call(context.robot); // Pass the 'robot' API object as 'this' inside the function

                    // Event generation (like 'fire' or 'log') happens *inside* the safe API calls triggered by tickFunction

                } catch (error) {
                    console.error(`[Interpreter] Runtime error for robot ${robot.id}:`, error.message, error.stack);
                    // Report runtime error back to the specific player
                    if (playerSocket?.connected) {
                        playerSocket.emit('codeError', { robotId: robot.id, message: `Runtime Error: ${error.message}` });
                    }
                    // Optional: Disable robot on repeated/critical errors?
                    // this.robotTickFunctions[robot.id] = null; // Consider disabling the robot
                } finally {
                    this.currentRobotId = null; // Clear context after execution attempt
                }
            }
        });

        this.currentGameInstance = null; // Clear game context after all robots run
        return results; // Return empty array
    }

    // --- Safe API Methods ---
    // These methods are called *from* the sandboxed robot code via the 'robot' object.
    // They ensure the action is performed by the correct robot and interact with the GameInstance.

    /** Safely retrieves the ServerRobot instance for the currently executing robot. @private */
    getCurrentRobot() {
        // Uses the temporary context variables set during executeTick
        if (!this.currentRobotId || !this.currentGameInstance) return null;
        // Find the robot object within the game instance's list
        return this.currentGameInstance.robots.find(r => r.id === this.currentRobotId);
    }

    /** Safely delegates drive command to the correct robot instance. */
    safeDrive(robotId, direction, speed) {
        // Ensure the call is from the currently executing robot
        if (robotId !== this.currentRobotId) return;
        const robot = this.getCurrentRobot();
        // Ensure robot exists, is active, and parameters are valid numbers
        if (robot?.state === 'active' && typeof direction === 'number' && typeof speed === 'number') {
            robot.drive(direction, speed);
        }
    }

    /** Safely delegates scan command to the GameInstance. */
    safeScan(robotId, direction, resolution) {
        if (robotId !== this.currentRobotId || !this.currentGameInstance) return null;
        const robot = this.getCurrentRobot();
        // Ensure robot exists, is active, and parameters are valid numbers
        if (robot?.state === 'active' && typeof direction === 'number') {
            // Use default resolution if not provided or invalid
            const res = (typeof resolution === 'number' && resolution > 0) ? resolution : 10;
            // Delegate scan logic to the GameInstance
            return this.currentGameInstance.performScan(robot, direction, res);
        }
        return null; // Return null if scan cannot be performed
    }

    /** Safely delegates fire command AND triggers fire event on GameInstance. */
    safeFire(robotId, direction, power) {
        // Check execution context
        if (robotId !== this.currentRobotId) return false;
        const robot = this.getCurrentRobot();

        // Also check robot state, game instance availability, and direction validity
        if (robot?.state === 'active' && this.currentGameInstance && typeof direction === 'number') {
            // Delegate the actual firing logic (cooldown check, missile creation) to the robot instance
            const fireResult = robot.fire(direction, power); // Returns { success: boolean, eventData?: object }

            // If the robot's fire method was successful (e.g., cooldown allowed),
            // trigger the corresponding event on the GameInstance using the provided eventData.
            if (fireResult.success && fireResult.eventData && typeof this.currentGameInstance.addFireEvent === 'function') {
                this.currentGameInstance.addFireEvent(fireResult.eventData);
            }

            // Return the success status back to the robot's code
            return fireResult.success;
        }
        return false; // Cannot fire (e.g., robot destroyed, invalid params)
    }


    /** Safely retrieves the current damage of the robot. */
    safeDamage(robotId) {
        if (robotId !== this.currentRobotId) return 100; // Return max damage if called incorrectly
        const robot = this.getCurrentRobot();
        return robot ? robot.damage : 100; // Return current damage or max if robot not found
    }

    /** Safely retrieves the robot's X coordinate. */
    safeGetX(robotId) {
        if (robotId !== this.currentRobotId) return null;
        const robot = this.getCurrentRobot();
        return robot ? robot.x : null;
    }

    /** Safely retrieves the robot's Y coordinate. */
    safeGetY(robotId) {
        if (robotId !== this.currentRobotId) return null;
        const robot = this.getCurrentRobot();
        return robot ? robot.y : null;
    }

    /** Safely retrieves the robot's current direction (degrees). */
    safeGetDirection(robotId) {
        if (robotId !== this.currentRobotId) return null;
        const robot = this.getCurrentRobot();
        return robot ? robot.direction : null;
    }

    /** Cleans up interpreter state (contexts, functions) when the game ends. */
    stop() {
        console.log("[Interpreter] Stopping and cleaning up contexts/functions.");
        this.robotContexts = {};
        this.robotTickFunctions = {};
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
        const moveSpeed = this.speed * deltaTime * 60; // Scale speed by time and a factor
        const radians = this.direction * Math.PI / 180;
        this.x += Math.cos(radians) * moveSpeed;
        this.y -= Math.sin(radians) * moveSpeed; // Assuming server Y matches canvas (up is negative delta)
    }
}


/**
 * Represents a Robot's state and behavior on the server side.
 */
class ServerRobot {
    constructor(id, x, y, direction, appearance = 'default') {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = 0;
        this.targetSpeed = 0;
        this.targetDirection = direction;
        this._damage = 0;
        this.radius = 15;
        this.color = this.generateColor();
        this.cooldown = 0;
        this.missiles = [];
        this.state = 'active'; // 'active' | 'destroyed'
        this.destructionTime = null;
        this.destructionNotified = false; // Flag if 'robotDestroyed' event was sent
        this.appearance = appearance;
        // START CHANGE: Track cause of last damage for destruction event
        this.lastDamageCause = null;
        // END CHANGE
    }

    get damage() {
        return this._damage;
    }

    get isAlive() {
        return this.state === 'active';
    }

    generateColor() {
        let hash = 0;
        for (let i = 0; i < this.id.length; i++) {
            hash = this.id.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 50%)`;
    }

    update(deltaTime, arenaWidth, arenaHeight) {
        // Missile updates happen regardless of owner's state
        for (let i = this.missiles.length - 1; i >= 0; i--) {
            const missile = this.missiles[i];
            missile.update(deltaTime);
            if (missile.x < 0 || missile.x > arenaWidth || missile.y < 0 || missile.y > arenaHeight) {
                this.missiles.splice(i, 1);
            }
        }

        // Only update movement/cooldown if active
        if (this.state !== 'active') {
            return;
        }

        if (this.cooldown > 0) {
            this.cooldown = Math.max(0, this.cooldown - 1);
        }

        this.speed = this.targetSpeed;
        this.direction = this.targetDirection;

        if (this.speed !== 0) {
            const moveSpeed = this.speed * deltaTime * 60;
            const radians = this.direction * Math.PI / 180;
            const dx = Math.cos(radians) * moveSpeed;
            const dy = Math.sin(radians) * moveSpeed;

            let newX = this.x + dx;
            let newY = this.y - dy; // Canvas-style Y

            // Clamp position
            newX = Math.max(this.radius, Math.min(arenaWidth - this.radius, newX));
            newY = Math.max(this.radius, Math.min(arenaHeight - this.radius, newY));

            this.x = newX;
            this.y = newY;
        }
    }

    drive(direction, speed) {
        if (this.state !== 'active') return;
        this.targetDirection = ((Number(direction) % 360) + 360) % 360;
        this.targetSpeed = Math.max(-5, Math.min(5, Number(speed)));
    }

    /**
     * Fires a missile from the robot if cooldown allows.
     * @param {number} direction - Direction to fire in degrees (0=East, 90=North).
     * @param {number} [power=1] - Power of the missile (1-3).
     * @returns {object} Result object: { success: boolean, eventData?: { type: 'fire', x, y, ownerId } }
     */
    fire(direction, power = 1) {
        if (this.state !== 'active' || this.cooldown > 0) {
            return { success: false }; // Cannot fire
        }

        const clampedPower = Math.max(1, Math.min(3, Number(power)));
        this.cooldown = clampedPower * 10 + 10; // Example cooldown

        const fireDirection = ((Number(direction) % 360) + 360) % 360;
        const radians = fireDirection * Math.PI / 180;
        const missileSpeed = 7 + clampedPower;
        const startOffset = this.radius + 5;

        const missileStartX = this.x + Math.cos(radians) * startOffset;
        const missileStartY = this.y - Math.sin(radians) * startOffset;

        const missile = new ServerMissile(
            missileStartX, missileStartY, fireDirection,
            missileSpeed, clampedPower, this.id
        );
        this.missiles.push(missile);

        // START CHANGE: Return success and event data
        const fireEventData = {
            type: 'fire', // Identify event type
            x: missileStartX, // Location of the fire event
            y: missileStartY,
            ownerId: this.id // Who fired it
        };
        return { success: true, eventData: fireEventData };
        // END CHANGE
    }

    /**
     * Applies damage to the robot. If damage reaches 100, marks the robot as destroyed.
     * @param {number} amount - The amount of damage to apply (non-negative).
     * @param {string} [cause='missile'] - The cause of damage (e.g., 'missile', 'collision', 'selfDestruct').
     * @returns {object} Result: { destroyed: boolean, hit: boolean, x?: number, y?: number, cause?: string }
     */
    takeDamage(amount, cause = 'missile') {
        if (this.state !== 'active') {
            // Still return 'hit: false' to distinguish from a successful hit on an active robot
            return { destroyed: false, hit: false };
        }

        const damageAmount = Math.max(0, Number(amount));
        if (damageAmount <= 0) {
             return { destroyed: false, hit: false }; // No damage applied
        }

        // START CHANGE: Store cause before applying damage
        this.lastDamageCause = cause;
        // END CHANGE

        this._damage = Math.min(100, this._damage + damageAmount);

        if (this._damage >= 100) {
            this._damage = 100;
            this.state = 'destroyed';
            this.destructionTime = Date.now();
            this.speed = 0;
            this.targetSpeed = 0;
            console.log(`[${this.id}] Robot destroyed by ${damageAmount} damage via ${cause}!`);
            // Destruction returns specific data including cause
            return { destroyed: true, hit: true, x: this.x, y: this.y, cause: cause }; // Destroyed counts as a hit
        } else {
            // START CHANGE: Return hit confirmation and location if damaged but not destroyed
            console.log(`[${this.id}] Took ${damageAmount} damage via ${cause}. Current health: ${100 - this._damage}`);
            return { destroyed: false, hit: true, x: this.x, y: this.y }; // Damaged but survived
            // END CHANGE
        }
    }
}

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

