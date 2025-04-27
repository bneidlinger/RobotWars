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
    "bcrypt": "^5.1.1",
    "connect-pg-simple": "^10.0.0",
    "dotenv": "^16.5.0",
    "express": "^4.21.2",
    "express-session": "^1.18.1",
    "pg": "^8.15.1",
    "socket.io": "^4.8.1"
  },
  "author": "",
  "license": "ISC"
}
```

## client/css/main.css

```code
/* client/css/main.css - Refined 3-Column Layout + Loadout Builder + Auth Modals */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'VT323', monospace;
    /* Base font size reduction */
    font-size: 18px;
    background-color: #1e1e1e;
    color: #e0e0e0;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow-x: hidden; /* Prevent horizontal scroll on body */
}

.container {
    width: 100%;
    padding: 15px; /* Padding around the main content */
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* Allow container to fill vertical space */
    min-height: 0; /* Important for flex context */
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #444;
    flex-wrap: wrap; /* Allow wrapping */
    flex-shrink: 0; /* Prevent shrinking */
}

header img.header-logo {
    max-height: 35px;
    width: auto;
    vertical-align: middle;
    margin-right: 10px;
}

header h1 {
    font-family: 'Press Start 2P', cursive;
    font-size: 1.6rem;
    color: #4CAF50;
    margin: 0 10px 0 0;
    display: inline-block;
    vertical-align: middle;
    flex-shrink: 0;
}

/* --- Header Player Info Area Styles --- */
.player-info-area {
    display: flex;
    align-items: center;
    gap: 10px; /* Space between name, icon, buttons */
    background-color: rgba(255, 255, 255, 0.05); /* Subtle background */
    padding: 5px 10px;
    border-radius: 5px;
    border: 1px solid #444;
    margin-left: auto; /* Push towards the right before nav */
    margin-right: 15px; /* Space before nav */
}

#player-name-display {
    font-weight: bold;
    color: #4CAF50; /* Match header color */
    font-size: 1.1rem;
    margin: 0; /* Reset default margins if any */
}

#player-icon-display {
    width: 24px; /* Adjust size as needed */
    height: 24px;
    border: 1px solid #666;
    background-color: #333; /* Placeholder background */
    /* Style using background-image or canvas later */
    display: inline-block; /* Or flex */
    vertical-align: middle;
    border-radius: 3px;
    flex-shrink: 0;
}

#btn-edit-loadout {
    background-color: #ff9800; /* Orange */
    color: black;
    padding: 4px 8px; /* Smaller button */
    font-size: 0.8rem;
    border-radius: 3px;
    cursor: pointer;
    border: none;
    font-family: 'VT323', monospace;
    transition: background-color 0.2s; /* Added transition */
}
#btn-edit-loadout:hover:not(:disabled) { background-color: #fb8c00; }
#btn-edit-loadout:disabled { background-color: #555; color: #aaa; cursor: not-allowed; }
#btn-edit-loadout:disabled:hover { background-color: #555; } /* Prevent hover effect when disabled */

/* === Bot Manual Button Style === */
#btn-bot-manual {
    display: inline-block; /* Make it behave like a button */
    background-color: #8D6E63; /* Muted Brown - like old paper/leather */
    color: #FFFDE7; /* Creamy white text */
    padding: 4px 8px; /* Match edit button padding */
    font-size: 0.8rem; /* Match edit button font size */
    border-radius: 3px; /* Match edit button radius */
    text-decoration: none; /* Remove link underline */
    font-family: 'VT323', monospace; /* Ensure correct font */
    border: 1px solid #5D4037; /* Darker brown border */
    line-height: 1; /* Ensure text aligns vertically */
    transition: background-color 0.2s, border-color 0.2s; /* Smooth hover */
    white-space: nowrap; /* Prevent wrapping */
}

#btn-bot-manual:hover,
#btn-bot-manual:focus { /* Add focus style for accessibility */
    background-color: #A1887F; /* Slightly lighter brown on hover */
    border-color: #795548;
    color: #ffffff; /* Brighter text on hover */
    outline: none; /* Remove default focus outline if desired */
}
/* === END: Bot Manual Button Style === */


nav {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
}

/* --- Button, Select, Input Styles (Consistent) --- */

/* --- General Button Style --- */
/* Apply this to most standard buttons */
button {
    background-color: #4CAF50; /* Default Green */
    color: white;
    border: none;
    padding: 7px 14px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-family: 'VT323', monospace;
    font-size: inherit; /* Inherit body font size */
}
button:hover:not(:disabled) { background-color: #45a049; } /* Darker Green Hover */
button:disabled { background-color: #555; color: #aaa; cursor: not-allowed; }
button:disabled:hover { background-color: #555; } /* Prevent hover effect when disabled */

/* --- Specific Button Overrides --- */

/* Test Code Button */
#btn-test-code { background-color: #2196F3; } /* Blue */
#btn-test-code:hover:not(:disabled) { background-color: #1e88e5; }

/* Self Destruct Button */
#btn-self-destruct { background-color: #e74c3c; padding: 5px 10px; font-size: 0.9em; } /* Red */
#btn-self-destruct:hover:not(:disabled) { background-color: #c0392b; }

/* Edit Loadout Button (Header) */
#btn-edit-loadout {
    background-color: #ff9800; /* Orange */
    color: black;
    padding: 4px 8px;
    font-size: 0.8rem;
    border-radius: 3px;
}
#btn-edit-loadout:hover:not(:disabled) { background-color: #fb8c00; }

/* Bot Manual Button (Header) */
#btn-bot-manual {
    display: inline-block;
    background-color: #8D6E63; /* Brown */
    color: #FFFDE7;
    padding: 4px 8px;
    font-size: 0.8rem;
    border-radius: 3px;
    text-decoration: none;
    border: 1px solid #5D4037;
    line-height: 1;
    white-space: nowrap;
}
#btn-bot-manual:hover,
#btn-bot-manual:focus {
    background-color: #A1887F;
    border-color: #795548;
    color: #ffffff;
    outline: none;
}

/* Logout Button (Header) */
#btn-logout {
    background-color: #e74c3c; /* Red */
    color: white;
    padding: 4px 8px;
    font-size: 0.8rem;
    border-radius: 3px;
    margin-left: 10px; /* Add some space */
}
#btn-logout:hover:not(:disabled) { background-color: #c0392b; }

/* Delete Loadout/Snippet Button (Small Red 'X') */
#btn-delete-loadout, #builder-delete-loadout {
    background-color: #c0392b; /* Darker Red */
    padding: 3px 6px;
    font-size: 0.8em;
    line-height: 1; /* Adjust line height for small button */
    min-width: auto; /* Allow shrinking */
}
#btn-delete-loadout:hover:not(:disabled),
#builder-delete-loadout:hover:not(:disabled) { background-color: #a93226; }


/* Base select style */
select {
    background-color: #333;
    color: white;
    border: 1px solid #555;
    padding: 7px 14px;
    border-radius: 4px;
    font-family: 'VT323', monospace;
    font-size: inherit;
    cursor: pointer;
    transition: background-color 0.2s;
}
select:hover:not(:disabled) { background-color: #444; }
select:disabled { background-color: #555; color: #aaa; cursor: not-allowed; }

/* Style for input in Loadout Builder */
input#loadout-name-input, input#builder-player-name {
    font-family: 'VT323', monospace; font-size: 0.95rem; background-color: #333;
    color: #e0e0e0; border: 1px solid #555; padding: 6px; border-radius: 4px; flex-grow: 1;
}


/* === Main Content Grid (3 Columns) === */
.main-content-grid {
    display: grid;
    /* Explicit 3 Columns with flex units and min widths */
    grid-template-columns: minmax(450px, 3.5fr) minmax(300px, 1.8fr) minmax(300px, 1.5fr);
    grid-template-rows: 1fr; /* Single row that grows */
    /* Reduced grid gap */
    gap: 12px;
    flex-grow: 1; /* Grid takes available space */
    min-height: 0; /* Prevent grid overflowing container */
    width: 100%;
    overflow: hidden; /* Hide overflow from the grid itself */
}


/* === Column Styling === */
.arena-column,
.devtools-column,
.info-lobby-column {
    display: flex;
    flex-direction: column;
    gap: 10px; /* Default gap */
    min-width: 0;
    min-height: 0;
    overflow: hidden;
}
/* Use slightly larger gap for non-arena columns */
.devtools-column, .info-lobby-column { gap: 12px; }


/* --- Arena Column Content Styling --- */
/* API Help */
.api-help {
    background-color: #333;
    padding: 8px 12px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    max-height: 140px;
    overflow-y: auto;
    border: 1px solid #444;
}
.api-help h4 {
    font-family: 'VT323', monospace;
    font-size: 1.0rem;
    margin-bottom: 5px;
    color: #aaa;
    padding-bottom: 3px;
    border-bottom: 1px solid #555;
}
.api-help ul { list-style-position: inside; padding-left: 5px; margin:0; }
.api-help li { margin-bottom: 4px; font-size: 0.9rem; }
.api-help code {
    font-family: 'VT323', monospace;
    background-color: #444; padding: 2px 4px; border-radius: 3px;
    color: #f0f0f0; font-size: 0.85rem;
}


#arena {
    background-color: #2c2c2c;
    border: 2px solid #444;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: block;
    max-width: 100%;
    aspect-ratio: 1 / 1;
    flex-grow: 1; /* Allow arena canvas to grow vertically */
    min-height: 200px;
    align-self: center;
    width: auto;
}

/* Row containing the two consoles at the bottom of Arena Column */
.consoles-row {
    display: flex;
    gap: 10px;
    width: 100%;
    flex-shrink: 0;
    /* Explicitly limit the row's height */
    max-height: 270px; /* Example: panel max-height + padding */
    min-height: 100px;
}

/* Shared styles for console panels within the consoles-row */
.consoles-row .console-panel {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    /* Panel height inherits limit from parent row */
    max-height: 100%;
    background-color: #333;
    padding: 8px 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid #444;
    overflow: hidden; /* Panel itself should not scroll */
}

.consoles-row .console-panel h3 {
    font-family: 'VT323', monospace;
    font-size: 1.0rem;
    margin-bottom: 5px;
    flex-shrink: 0;
    padding-bottom: 3px;
    border-bottom: 1px solid #555;
    text-align: center;
}

/* Make the log-box inside consoles fill space and scroll */
.consoles-row .console-panel .log-box {
     overflow-y: auto; /* Enable vertical scroll *only* for the log box */
     flex-grow: 1;
     min-height: 50px;
     /* Let the parent (.console-panel) limit height */
     font-family: 'VT323', monospace;
     word-wrap: break-word;
     padding: 5px;
     font-size: 0.9rem;
     scrollbar-width: thin;
     scrollbar-color: #666 #2a2a2a;
}
.consoles-row .console-panel .log-box::-webkit-scrollbar { width: 8px; }
.consoles-row .console-panel .log-box::-webkit-scrollbar-track { background: #2a2a2a; border-radius: 4px; }
.consoles-row .console-panel .log-box::-webkit-scrollbar-thumb { background-color: #666; border-radius: 4px; border: 2px solid #2a2a2a; }


/* === DevTools Column (Editor Only) === */
.editor-section {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 0;
    overflow: hidden;
    background-color: #2a2a2a;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid #444;
}
.editor-section h3 {
    font-family: 'VT323', monospace;
    font-size: 1.0rem;
    margin-bottom: 5px;
    color: #aaa;
    flex-shrink: 0;
    padding-bottom: 3px;
    border-bottom: 1px solid #555;
}

.code-editor-wrapper {
    flex-grow: 1;
    min-height: 200px;
    position: relative;
    display: flex;
    border: 1px solid #444;
    border-radius: 4px;
    margin-bottom: 10px;
    overflow: hidden;
}

.CodeMirror {
    flex-grow: 1;
    height: 100% !important;
    font-family: 'VT323', monospace;
    font-size: 17px; /* Slightly larger editor font */
}
.CodeMirror-readonly .CodeMirror-cursor { display: none !important; }
.CodeMirror-readonly { background-color: #222 !important; }

.editor-controls {
     display: flex;
     gap: 10px;
     align-items: center;
     flex-shrink: 0;
     padding: 5px 0 0 0;
     flex-wrap: wrap; /* Allow wrapping on small screens */
}
/* Adjust delete button size slightly */
#btn-delete-loadout { padding: 3px 6px; font-size: 0.8em; background-color: #c0392b; }
#btn-delete-loadout:hover:not(:disabled) { background-color: #a93226; }
#btn-delete-loadout:disabled { background-color: #555; color: #aaa; }
/* Adjust status font size */
#loadout-status { font-size: 0.8rem; min-height: 1.2em; color: #aaa; flex-shrink: 0; margin-left: 5px; }


/* === Info/Lobby Column === */
/* Shared panel styles within Info Column */
.stats-panel,
#lobby-area,
#game-history-log {
    background-color: #333;
    /* Reduced panel padding */
    padding: 8px 12px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid #444;
    flex-shrink: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* Reduced panel title font size */
.stats-panel h3, #lobby-area h3, #game-history-log h4 {
     font-family: 'VT323', monospace;
     font-size: 1.1rem;
     margin-bottom: 8px;
     color: #4CAF50;
     flex-shrink: 0;
     padding-bottom: 5px;
     border-bottom: 1px solid #555;
}

/* Specific panel sizing and content */
/* Reduced max-height for stats panel */
.stats-panel { max-height: 180px; }

/* Reduce font size inside stats panel */
#robot-stats { overflow-y: auto; flex-grow: 1; padding: 5px 0; font-size: 0.9rem; }
#dashboard-game-title { font-weight: bold; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #555; color: #4CAF50; font-family: "'VT323', monospace"; font-size: 1.0rem; display: none; }
.robot-stat { border-left: 3px solid #888; margin-bottom: 6px; padding: 4px 4px 4px 8px; font-family: "'VT323', monospace"; font-size: inherit; }
.robot-stat div { margin-bottom: 2px; }
.robot-stat strong { color: #eee; }

#lobby-area { flex-grow: 1; max-height: none; } /* Lobby takes remaining space */
/* Reduce lobby status font size */
#lobby-status { margin-bottom: 8px; font-weight: bold; color: #e0e0e0; flex-shrink: 0; font-size: 1.0rem; }
#event-log {
    flex-grow: 1;
    flex-shrink: 1;
    min-height: 80px;
    max-height: 180px;
    background: #222;
    /* Reduce event log font size */
    font-size: 0.85rem;
    border: 1px solid #555;
    overflow-y: auto; margin-bottom: 10px; padding: 5px 8px;
    scrollbar-width: thin; scrollbar-color: #666 #222;
}
#event-log::-webkit-scrollbar { width: 8px; }
#event-log::-webkit-scrollbar-track { background: #222; border-radius: 4px; }
#event-log::-webkit-scrollbar-thumb { background-color: #666; border-radius: 4px; border: 2px solid #222; }

#chat-area { display: flex; gap: 5px; flex-shrink: 0; margin-top: auto; padding-top: 10px; }
/* Reduce chat input/button font size */
#chat-input { flex-grow: 1; padding: 6px; border-radius: 4px; border: 1px solid #555; background: #2a2a2a; color: #e0e0e0; font-family: 'VT323', monospace; font-size: 0.9rem; }
#send-chat { padding: 6px 12px; font-size: 0.9rem; }

/* Reduced max-height for history panel */
#game-history-log { max-height: 200px; }
#game-history-list {
    overflow-y: auto; flex-grow: 1;
    /* Reduce history list font size */
    font-size: 0.85rem;
    padding-right: 5px;
    scrollbar-width: thin; scrollbar-color: #666 #333;
}
#game-history-list::-webkit-scrollbar { width: 8px; }
#game-history-list::-webkit-scrollbar-track { background: #333; border-radius: 4px; }
#game-history-list::-webkit-scrollbar-thumb { background-color: #666; border-radius: 4px; border: 2px solid #333; }
#game-history-list > div { margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px dashed #444; color: #cccccc; }
#game-history-list > div:last-child { border-bottom: none; margin-bottom: 0; }


/* === Console Log Specific Themes === */
/* Robot Console */
#robot-console-log { border-color: #0f400f; background-color: #1a1a1a; }
#robot-console-log h3 { color: #00dd00; text-shadow: 0 0 4px #00dd00; border-bottom: none; }
#robot-log-messages { background-color: #000000; color: #00FF41; font-size: 1.0rem; border: 1px solid #004d00; text-shadow: 0 0 5px rgba(0, 255, 65, 0.5); position: relative; }
#robot-log-messages::after { /* Scanline */ content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: rgba(0, 255, 0, 0.15); box-shadow: 0 0 4px 1px rgba(0, 255, 0, 0.15); z-index: 3; pointer-events: none; animation: scanline-log 6s linear infinite; }
/* Opponent Console */
#opponent-console-log { border-color: #4d0000; background-color: #1a1010; }
#opponent-console-log h3 { color: #ff4136; text-shadow: 0 0 4px #ff4136; border-bottom: none; }
#opponent-log-messages { background-color: #000000; color: #FF4136; font-size: 1.0rem; border: 1px solid #4d0000; text-shadow: 0 0 5px rgba(255, 65, 54, 0.5); position: relative; }
#opponent-log-messages::after { /* Scanline */ content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: rgba(255, 65, 54, 0.15); box-shadow: 0 0 4px 1px rgba(255, 65, 54, 0.15); z-index: 3; pointer-events: none; animation: scanline-log 6s linear infinite; }
/* Shared Scanline Animation */
@keyframes scanline-log { 0% { transform: translateY(0%); opacity: 0.1; } 50% { opacity: 0.3; } 100% { transform: translateY(calc(100% - 2px)); opacity: 0.1; } }


/* ============================================== */
/* === START: Loadout Builder Overlay Styles === */
/* ============================================== */
#loadout-builder-overlay {
    position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.85);
    z-index: 1000; display: flex; justify-content: center; align-items: center;
    padding: 20px; display: none; /* Initially Hidden */
}
#loadout-builder-content {
    max-width: 900px; width: 100%; max-height: 90vh; padding: 25px 30px;
    background-color: #0a0a0a; border: 3px solid #2196F3;
    box-shadow: 0 0 15px rgba(33, 150, 243, 0.5), 0 0 30px rgba(33, 150, 243, 0.3);
    border-radius: 10px; overflow: hidden; display: flex; flex-direction: column;
    font-family: 'VT323', monospace; color: #e0e0e0;
    font-size: 17px; /* Adjusted builder base font slightly */
}
#loadout-builder-content h2 {
    font-family: 'Press Start 2P', cursive; font-size: 1.5rem; color: #2196F3; /* Adjusted */
    text-align: center; margin-bottom: 25px; flex-shrink: 0;
    text-shadow: 0 0 4px rgba(33, 150, 243, 0.6);
}
.loadout-builder-main {
    display: grid; grid-template-columns: 1fr 250px; gap: 20px; /* Reduced gap */
    overflow-y: auto; padding: 10px 5px; margin-bottom: 15px; flex-grow: 1; /* Adjusted padding/margin */
}
.loadout-section {
    border: 1px solid #333; border-radius: 5px; padding: 12px; /* Adjusted */
    background-color: rgba(33, 33, 33, 0.5);
}
.loadout-section h3 {
    font-family: 'VT323', monospace; font-size: 1.1rem; color: #4CAF50; /* Adjusted */
    margin-bottom: 12px; border-bottom: 1px dashed #444; padding-bottom: 4px; /* Adjusted */
}
.loadout-options { display: flex; flex-direction: column; gap: 15px; } /* Adjusted */
.loadout-controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; } /* Adjusted */
.loadout-controls label, .visual-controls label { margin-right: 5px; color: #aaa; min-width: 80px; text-align: right; font-size: 0.95rem;} /* Adjusted */
.loadout-builder-main button, .loadout-builder-main select { padding: 5px 10px; font-size: 0.9rem; } /* Adjusted */
.visual-controls { display: grid; grid-template-columns: auto 1fr auto; gap: 8px 12px; align-items: center; } /* Adjusted */
.visual-controls select { width: 100%; }
.visual-controls input[type="color"] { appearance: none; -webkit-appearance: none; width: 30px; height: 30px; border: 1px solid #555; border-radius: 4px; padding: 0; cursor: pointer; background-color: transparent; } /* Adjusted */
.visual-controls input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
.visual-controls input[type="color"]::-webkit-color-swatch { border: none; border-radius: 3px; }
.code-controls { display: flex; gap: 8px; align-items: center; } /* Adjusted */
.code-controls select { flex-grow: 1; }
.loadout-preview-area { display: flex; flex-direction: column; align-items: center; gap: 12px; border: 1px solid #333; border-radius: 5px; padding: 12px; background-color: rgba(33, 33, 33, 0.5); } /* Adjusted */
#loadout-preview { width: 150px; height: 150px; border: 1px solid #555; background-color: #1a1a1a; border-radius: 4px; }
.loadout-preview-area span { font-size: 0.8rem; color: #aaa; } /* Adjusted */
.loadout-builder-actions { display: flex; justify-content: space-between; padding-top: 15px; border-top: 1px solid #444; flex-shrink: 0; } /* Adjusted */
#btn-enter-lobby { background-color: #4CAF50; font-size: 1.0rem; padding: 8px 16px; } /* Adjusted */
#btn-enter-lobby:hover { background-color: #45a049; }
#btn-quick-start { background-color: #555; font-size: 1.0rem; padding: 8px 16px; } /* Adjusted */
#btn-quick-start:hover { background-color: #666; }

/* Style for the new Preset Select dropdown */
#builder-preset-select {
    font-family: 'VT323', monospace; font-size: 0.9rem; background-color: #333;
    color: #e0e0e0; border: 1px solid #555; padding: 5px 10px; border-radius: 4px;
    cursor: pointer; transition: background-color 0.2s;
}
#builder-preset-select:hover { background-color: #444; }

/* ============================================ */
/* === END: Loadout Builder Overlay Styles === */
/* ============================================ */


/* --- START: Authentication Modal Styles --- */
.auth-modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1500; /* Sit on top of everything */
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto; /* Enable scroll if needed */
    background-color: rgba(0, 0, 0, 0.6); /* Black w/ opacity */
    backdrop-filter: blur(3px); /* Optional blur effect */
    /* Use flexbox to center content vertically and horizontally */
    display: flex;
    align-items: center;
    justify-content: center;
}

.auth-modal-content {
    background-color: #1a1a1a; /* Dark background */
    /* margin: auto; Removed, flex handles centering */
    padding: 30px 40px;
    border: 2px solid #4CAF50; /* Accent border */
    width: 90%;
    max-width: 450px; /* Limit width */
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
    position: relative;
    color: #e0e0e0;
    font-family: 'VT323', monospace;
}

.auth-modal-content h2 {
    text-align: center;
    color: #4CAF50;
    font-family: 'Press Start 2P', cursive;
    font-size: 1.4rem;
    margin-bottom: 25px;
}

.auth-close-btn {
    color: #aaa;
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 28px;
    font-weight: bold;
    transition: color 0.2s;
}

.auth-close-btn:hover,
.auth-close-btn:focus {
    color: #fff;
    text-decoration: none;
    cursor: pointer;
}

.auth-modal .form-group {
    margin-bottom: 15px;
}

.auth-modal label {
    display: block;
    margin-bottom: 5px;
    color: #ccc;
    font-size: 1.1rem;
}

.auth-modal input[type="text"],
.auth-modal input[type="password"] {
    width: 100%;
    padding: 10px;
    background-color: #333;
    border: 1px solid #555;
    border-radius: 4px;
    color: #e0e0e0;
    font-family: 'VT323', monospace;
    font-size: 1.1rem;
}
.auth-modal input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

.auth-modal button[type="submit"] {
    width: 100%;
    padding: 12px;
    margin-top: 10px;
    font-size: 1.2rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.auth-modal button[type="submit"]:hover {
    background-color: #45a049;
}

.auth-modal .error-message {
    color: #e74c3c; /* Red for errors */
    text-align: center;
    margin-top: 15px;
    min-height: 1.2em; /* Prevent layout shifts */
    font-size: 1rem;
}

.auth-modal .switch-modal-link {
    text-align: center;
    margin-top: 20px;
    font-size: 0.9rem;
    color: #aaa;
}
.auth-modal .switch-modal-link a {
    color: #4CAF50;
    text-decoration: none;
    font-weight: bold;
}
.auth-modal .switch-modal-link a:hover {
    text-decoration: underline;
}
/* --- END: Authentication Modal Styles --- */


/* --- Responsive Adjustments --- */
@media (max-width: 1200px) {
    .main-content-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        overflow-y: auto;
        overflow-x: hidden;
        gap: 15px;
    }
    .arena-column, .devtools-column, .info-lobby-column {
        min-height: auto;
        overflow: visible;
        gap: 12px;
    }
    #arena {
        max-height: 60vh;
        width: auto;
        max-width: 90%;
        margin: 0 auto;
        flex-grow: 0;
    }
    .consoles-row {
        flex-direction: column;
        max-height: 40vh;
        min-height: 150px;
        gap: 10px;
    }
     .consoles-row .console-panel {
         max-height: 100%;
         flex-grow: 1;
     }
    .stats-panel, #lobby-area, #game-history-log, .editor-section, .api-help {
        max-height: 40vh;
        overflow: hidden;
    }
    .editor-section {
        min-height: 300px;
        max-height: 50vh;
    }
    #lobby-area { flex-grow: 0; max-height: 300px; }
    .api-help { max-height: 180px; }
    .loadout-builder-main { grid-template-columns: 1fr; }
    .loadout-preview-area { margin-top: 20px; }
    #loadout-builder-content h2 { font-size: 1.3rem; }
}

@media (max-width: 768px) {
    body { font-size: 16px; }
    .container { padding: 10px; }
    header { flex-direction: column; align-items: stretch; gap: 10px; }
    /* Center player info area */
    .player-info-area { justify-self: center; align-self: center; margin-right: 0; /* Remove margin when stacked */ }
    header img.header-logo { max-height: 30px; align-self: center; }
    header h1 { font-size: 1.4rem; text-align: center; }
    nav { justify-content: center; gap: 5px; width: 100%; flex-direction: column; }
    nav > button { padding: 5px 8px;} /* Adjust nav button padding */
    #btn-delete-loadout, #builder-delete-loadout { font-size: 0.8em; padding: 2px 4px;}

    .main-content-grid { gap: 10px; }
    .devtools-column, .info-lobby-column, .arena-column { gap: 10px; }

    #arena { max-height: 50vh; }

    .consoles-row { max-height: 35vh; }
    .consoles-row .console-panel { padding: 6px 8px; }
    .consoles-row .console-panel h3 { font-size: 0.9rem; }
    .consoles-row .console-panel .log-box { font-size: 0.8rem; }

    .stats-panel, #lobby-area, #game-history-log, .editor-section, .api-help {
        max-height: 35vh;
        padding: 6px 8px;
    }
    .stats-panel h3, #lobby-area h3, #game-history-log h4 { font-size: 1.0rem;}
     #lobby-status { font-size: 0.9rem; }
     #robot-stats { font-size: 0.8rem; }
     #event-log { font-size: 0.8rem; }
     #chat-input, #send-chat { font-size: 0.85rem; }
     #game-history-list { font-size: 0.8rem; }
    .api-help { max-height: 150px; }
    .api-help h4 { font-size: 0.9rem; }
    .api-help li { font-size: 0.8rem; }
    .api-help code { font-size: 0.75rem; }
    .editor-section { min-height: 250px; max-height: 45vh;}
    .CodeMirror { font-size: 15px; }
    #lobby-area { max-height: 250px; }

    #loadout-builder-content { padding: 15px; font-size: 15px;}
     #loadout-builder-content h2 { font-size: 1.2rem; }
     .loadout-builder-main { gap: 15px; }
     .loadout-section h3 { font-size: 1.0rem; }
     .loadout-builder-main button, .loadout-builder-main select, #loadout-name-input, #builder-player-name { font-size: 0.9rem; padding: 4px 8px; }
     .visual-controls { grid-template-columns: auto 1fr; }
     .visual-controls input[type="color"] { grid-column: 1 / 3; justify-self: center; margin-top: 5px; width: 25px; height: 25px; }
     .loadout-builder-actions { flex-direction: column; gap: 10px; align-items: stretch; }
     #btn-enter-lobby, #btn-quick-start { font-size: 0.9rem; padding: 6px 12px; }

     .auth-modal-content { padding: 20px; max-width: 95%; }
     .auth-modal-content h2 { font-size: 1.2rem; }
}

@media (max-width: 480px) {
    body { font-size: 14px; }
    header h1 { font-size: 1.2rem; }
    .player-info-area { gap: 8px; padding: 4px 8px;} /* Adjust spacing/padding */
    #player-name-display { font-size: 1.0rem; }
    #btn-edit-loadout, #btn-bot-manual, #btn-logout { font-size: 0.75rem; padding: 3px 6px; }
    nav { gap: 5px; }
    nav > button { padding: 4px 6px;}
    #btn-delete-loadout, #builder-delete-loadout { font-size: 0.7em; padding: 1px 3px;}
    .CodeMirror { font-size: 14px; }
    .log-box, #game-history-list, #event-log, .robot-stat, .api-help li, .api-help code { font-size: 0.85rem; }
    .api-help h4 { font-size: 0.9rem; }
    .consoles-row .console-panel h3 { font-size: 0.9rem; }
    .stats-panel h3, #lobby-area h3, #game-history-log h4 { font-size: 0.95rem;}
    #lobby-status { font-size: 0.85rem; }
    #chat-input, #send-chat { font-size: 0.8rem; }

    #loadout-builder-content { font-size: 14px; padding: 10px; }
    #loadout-builder-content h2 { font-size: 1.0rem; margin-bottom: 15px; }
    .loadout-section h3 { font-size: 0.95rem; }
    .loadout-builder-main button, .loadout-builder-main select, #loadout-name-input, #builder-player-name { font-size: 0.85rem; padding: 3px 6px;}
    .loadout-preview-area span { font-size: 0.7rem;}
    #btn-enter-lobby, #btn-quick-start { font-size: 0.85rem; padding: 5px 10px; }

     .auth-modal-content { padding: 15px 20px; }
     .auth-modal-content h2 { font-size: 1.1rem; }
     .auth-modal label, .auth-modal input, .auth-modal button { font-size: 1rem; }
     .auth-modal .switch-modal-link { font-size: 0.8rem; }
}
```

## client/js/engine/arena.js

```code
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
 * handles code snippet saving/loading/deleting via API calls,
 * handles test game requests, self-destruct requests, updates the static player header display (basic),
 * handles showing the loadout builder via the Edit button, and sends relevant data/signals
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
        this.network = network;
        this.uiState = 'lobby'; // Initial state might be incorrect if not logged in
        this.isClientReady = false;
        this.testGameActive = false;
        this.statusTimeoutId = null; // Initialize timeout ID

        if (!this.game || !this.network) {
             console.error("Controls initialized without valid game or network reference!");
        }

        // --- Element References ---
        this.saveSnippetButton = document.getElementById('btn-save-code');
        this.loadSnippetSelect = document.getElementById('loadout-select');
        this.deleteSnippetButton = document.getElementById('btn-delete-loadout');
        this.editLoadoutButton = document.getElementById('btn-edit-loadout');
        this.readyButton = document.getElementById('btn-ready');
        this.resetButton = document.getElementById('btn-reset');
        this.selfDestructButton = document.getElementById('btn-self-destruct');
        this.testButton = document.getElementById('btn-test-code');
        this.loadoutStatus = document.getElementById('loadout-status');
        // --- End Element References ---

        this.setupEventListeners(); // Setup listeners after properties are initialized

        // Populate the CODE SNIPPET dropdown via API on load (will skip if not logged in)
        this.populateCodeSnippetSelect();

        console.log('Controls initialized (API Mode).');
    }


    /** Sets the internal state and updates the UI accordingly */
    setState(newState) {
        const validStates = ['lobby', 'waiting', 'playing', 'spectating'];
        if (!validStates.includes(newState)) {
            console.error(`[Controls.setState] Attempted to set invalid UI state: ${newState}`);
            return;
        }
        // Log current and target state *before* any checks
        // console.log(`[Controls.setState] >> Received request to change state from '${this.uiState}' to '${newState}'.`); // Verbose

        if (this.uiState === newState) {
             // console.log(`[Controls.setState] -- State is already '${newState}'. Returning early.`); // Verbose
             return;
        }

        console.log(`[Controls.setState] ++ State changing from '${this.uiState}' to '${newState}'. Proceeding to update UI...`);
        this.uiState = newState;
        if (newState !== 'waiting') this.isClientReady = false;
        this.updateUIForState(); // Update button states etc.
    }

    /** Updates all relevant UI elements based on the current this.uiState */
    updateUIForState() {
        const editorIsAvailable = typeof editor !== 'undefined';
        let readyButtonText = "Loading...";
        let readyButtonColor = '#777';
        let readyButtonDisabled = true;
        let editorReadOnly = true;
        let selfDestructVisible = false;
        let testButtonDisabled = true;
        let codeSnippetControlsDisabled = true;
        let editLoadoutDisabled = true;

        const loggedIn = window.authHandler?.isLoggedIn ?? false;
        // Log the state being evaluated by this specific call
        // console.log(`[Controls.updateUIForState] --> Evaluating UI based on State: '${this.uiState}', LoggedIn: ${loggedIn}`); // Verbose

        if (loggedIn) {
             switch (this.uiState) {
                 case 'lobby':
                     // console.log('[Controls.updateUIForState] --> Applying ENABLED state for lobby.'); // Verbose
                     readyButtonText = "Ready Up"; readyButtonColor = '#4CAF50'; readyButtonDisabled = false;
                     editorReadOnly = false; selfDestructVisible = false; testButtonDisabled = false;
                     codeSnippetControlsDisabled = false; editLoadoutDisabled = false;
                     break;
                 case 'waiting':
                     // console.log('[Controls.updateUIForState] --> Applying WAITING state.'); // Verbose
                     readyButtonText = "Waiting... (Click to Unready)"; readyButtonColor = '#FFA500'; readyButtonDisabled = false;
                     editorReadOnly = true; selfDestructVisible = false; testButtonDisabled = true;
                     codeSnippetControlsDisabled = true; editLoadoutDisabled = true;
                     break;
                 case 'playing': case 'spectating':
                     // console.log(`[Controls.updateUIForState] --> Applying ${this.uiState.toUpperCase()} state.`); // Verbose
                     readyButtonText = this.uiState === 'playing' ? "Game in Progress..." : "Spectating...";
                     readyButtonColor = this.uiState === 'playing' ? '#777' : '#4682B4'; readyButtonDisabled = true;
                     editorReadOnly = true; selfDestructVisible = (this.uiState === 'playing'); testButtonDisabled = true;
                     codeSnippetControlsDisabled = true; editLoadoutDisabled = true;
                     break;
                 default:
                     console.warn(`[Controls.updateUIForState] --> Applying DISABLED state (default/unknown UI state: ${this.uiState}).`);
                     break;
             }
        } else {
             // console.log('[Controls.updateUIForState] --> Applying DISABLED state (loggedIn check failed).'); // Verbose
             readyButtonText = "Please Log In"; readyButtonDisabled = true; editorReadOnly = true;
             selfDestructVisible = false; testButtonDisabled = true; codeSnippetControlsDisabled = true;
             editLoadoutDisabled = true;
        }

        // Apply UI changes
        if (this.readyButton) { this.readyButton.textContent = readyButtonText; this.readyButton.style.backgroundColor = readyButtonColor; this.readyButton.disabled = readyButtonDisabled; }
        if (this.resetButton) { this.resetButton.disabled = (this.uiState !== 'lobby' || !loggedIn); }
        if (this.selfDestructButton) { this.selfDestructButton.style.display = selfDestructVisible ? 'inline-block' : 'none'; this.selfDestructButton.disabled = !selfDestructVisible; }
        if (this.testButton) { this.testButton.disabled = testButtonDisabled; }
        if (this.saveSnippetButton) { this.saveSnippetButton.disabled = codeSnippetControlsDisabled; }
        if (this.loadSnippetSelect) { this.loadSnippetSelect.disabled = codeSnippetControlsDisabled; }
        if (this.deleteSnippetButton) { this.deleteSnippetButton.disabled = codeSnippetControlsDisabled || (this.loadSnippetSelect && !this.loadSnippetSelect.value); }
        if (this.editLoadoutButton) { this.editLoadoutButton.disabled = editLoadoutDisabled; }
        try { if (editorIsAvailable && editor.setOption) editor.setOption("readOnly", editorReadOnly); }
        catch (e) { console.error("Error setting CodeMirror readOnly option:", e); }

        // console.log(`[Controls.updateUIForState] << UI Update Applied. ReadyBtn Disabled: ${readyButtonDisabled}, TestBtn Disabled: ${testButtonDisabled}, Editor Controls Disabled: ${codeSnippetControlsDisabled}, EditLoadout Disabled: ${editLoadoutDisabled}`); // Verbose
    }


    /** Sets up event listeners for UI elements */
    setupEventListeners() {
        // Add listeners only if elements exist
        if (this.editLoadoutButton) {
            this.editLoadoutButton.addEventListener('click', () => {
                 if (!window.authHandler?.isLoggedIn) return;
                 if (this.uiState !== 'lobby') return;
                 if (typeof window.loadoutBuilderInstance?.show === 'function') {
                     console.log("[Controls] Edit Loadout button clicked, showing builder.");
                     window.loadoutBuilderInstance.show();
                 } else { console.error("LoadoutBuilder instance not found!"); alert("Error: Cannot open the loadout builder."); }
             });
        } else { console.warn("Edit Loadout Button not found for listener."); }

        if (this.readyButton) {
             this.readyButton.addEventListener('click', async () => { // Make async
                if (!this.network?.socket?.connected) { alert("Not connected to server."); return; }
                if (!window.authHandler?.isLoggedIn) { alert("Please log in first."); return; }

                if (this.uiState === 'lobby') {
                    console.log('Ready Up button clicked (State: lobby)');
                    this.updateLoadoutStatus("Preparing loadout...");

                    // --- START: Prepare Loadout ---
                    const { loadoutData, error } = await this._prepareLoadoutData("Ready Up");
                    if (error) {
                         alert(error);
                         this.updateLoadoutStatus(`Ready Up failed: ${error}`, true);
                         return;
                    }
                    if (!loadoutData) {
                         alert("Internal Error: Failed to prepare loadout data.");
                         this.updateLoadoutStatus("Ready Up failed: Could not prepare data.", true);
                         return;
                    }
                    // --- END: Prepare Loadout ---

                    // --- START: Send Data & Update State ---
                    this.network.sendLoadoutData(loadoutData); // Use new name/structure
                    this.isClientReady = true;
                    this.setState('waiting');
                    this.updatePlayerHeaderDisplay(); // Update header icon
                    this.updateLoadoutStatus("Waiting for opponent...");
                    // --- END: Send Data & Update State ---

                } else if (this.uiState === 'waiting') {
                    console.log('Unready button clicked (State: waiting)');
                    this.network.sendUnreadySignal();
                    this.isClientReady = false;
                    this.setState('lobby');
                } else { console.warn(`Ready button clicked in unexpected state: ${this.uiState}. Ignoring.`); }
            });
        } else { console.warn("Ready Button not found for listener."); }


        if (this.resetButton) {
             this.resetButton.addEventListener('click', () => {
                if (this.uiState !== 'lobby' || !window.authHandler?.isLoggedIn) return;
                console.log('Reset button clicked');
                if (this.game?.renderer?.redrawArenaBackground) this.game.renderer.redrawArenaBackground();
                if (window.dashboard?.updateStats) window.dashboard.updateStats([], {});
                if (window.addEventLogMessage) window.addEventLogMessage('UI reset.', 'info');
            });
        } else { console.warn("Reset Button not found for listener."); }

        // --- Snippet Controls ---
         if (this.saveSnippetButton) {
            this.saveSnippetButton.addEventListener('click', () => {
                 if (this.uiState !== 'lobby' || typeof editor === 'undefined') return;
                 const currentCode = editor.getValue();
                 if (!currentCode.trim()) { alert("Code editor is empty."); this.updateLoadoutStatus("Save snippet failed: Editor empty.", true); return; }
                 const snippetName = prompt("Enter a name for this code snippet:", "");
                 if (snippetName === null) return; // User cancelled
                 const trimmedName = snippetName.trim();
                 if (!trimmedName || trimmedName.length > 50) { alert("Snippet name must be 1-50 characters."); this.updateLoadoutStatus("Save snippet failed: Invalid name.", true); return; }
                 this.saveCodeSnippet(trimmedName, currentCode); // Uses API now
             });
         } else { console.warn("Save Snippet Button not found for listener."); }

         if (this.loadSnippetSelect) {
             this.loadSnippetSelect.addEventListener('change', () => {
                 if (this.uiState !== 'lobby' || typeof editor === 'undefined') return;
                 const selectedName = this.loadSnippetSelect.value;
                 if (selectedName) {
                     this.loadCodeSnippet(selectedName); // Uses API now
                 }
                 if (this.deleteSnippetButton) {
                     this.deleteSnippetButton.disabled = !selectedName || this.uiState !== 'lobby';
                 }
             });
         } else { console.warn("Load Snippet Select not found for listener."); }

         if (this.deleteSnippetButton) {
             this.deleteSnippetButton.addEventListener('click', () => {
                 if (this.uiState !== 'lobby') return;
                 const selectedName = this.loadSnippetSelect ? this.loadSnippetSelect.value : null;
                 if (!selectedName) return;
                 if (confirm(`Are you sure you want to delete the code snippet "${selectedName}"?\n\nThis cannot be undone and might break Loadout Configurations using it.`)) {
                     this.deleteCodeSnippet(selectedName); // Uses API now
                 }
             });
         } else { console.warn("Delete Snippet Button not found for listener."); }
        // --- End Snippet Controls ---


         if (this.testButton) {
             this.testButton.addEventListener('click', async () => { // Make async
                if (this.uiState !== 'lobby') return;
                if (!this.network?.socket?.connected) { alert("Not connected to server."); return; }
                if (!window.authHandler?.isLoggedIn) { alert("Please log in first."); return; }

                this.updateLoadoutStatus("Preparing test game...");

                // --- START: Prepare Loadout ---
                 const { loadoutData, error } = await this._prepareLoadoutData("Test Code");
                 if (error) {
                      alert(error);
                      this.updateLoadoutStatus(`Test failed: ${error}`, true);
                      return;
                 }
                 if (!loadoutData) {
                      alert("Internal Error: Failed to prepare loadout data for test.");
                      this.updateLoadoutStatus("Test failed: Could not prepare data.", true);
                      return;
                 }
                 // --- END: Prepare Loadout ---

                 // --- START: Send Request ---
                 this.network.requestTestGame(loadoutData); // Use new name/structure
                 if (window.updateLobbyStatus) window.updateLobbyStatus('Requesting Test Game...');
                 this.updatePlayerHeaderDisplay(); // Reflect potentially changed name/visuals?
                 this.updateLoadoutStatus("Test game requested...");
                 // Note: State change to 'playing' happens via 'gameStart' event from server
                 // --- END: Send Request ---
            });
        } else { console.warn("Test Code Button not found for listener."); }

        if (this.selfDestructButton) {
             this.selfDestructButton.addEventListener('click', () => {
                if (this.uiState !== 'playing' || !this.network?.socket?.connected) return;
                if (confirm("Are you sure you want to self-destruct?")) {
                    console.log("Sending self-destruct signal...");
                    this.network.sendSelfDestructSignal();
                }
            });
        } else { console.warn("Self Destruct Button not found for listener."); }

    } // End setupEventListeners


    /**
     * Helper function to prepare loadout data for Ready Up or Test Code.
     * Fetches the code for the currently selected snippet via API.
     * Uses the robot name and visuals currently set in the LoadoutBuilder instance.
     * @private
     * @async
     * @param {string} context - 'Ready Up' or 'Test Code' for logging/errors.
     * @returns {Promise<{loadoutData: object|null, error: string|null}>}
     */
    async _prepareLoadoutData(context) {
        console.log(`[Controls._prepareLoadoutData] Preparing for context: ${context}`);

        // Get current selections from LoadoutBuilder instance
        const builderState = window.loadoutBuilderInstance?.currentLoadout;
        if (!builderState) {
             console.error(`[Controls._prepareLoadoutData] LoadoutBuilder instance or currentLoadout not found!`);
             return { loadoutData: null, error: `(${context}) Internal Error: Loadout builder state unavailable.` };
        }

        const { robotName, visuals, codeLoadoutName } = builderState;

        // --- Validation ---
        if (!robotName || typeof robotName !== 'string' || robotName.trim().length === 0) {
             return { loadoutData: null, error: `(${context}) Please set a Robot Name in the Loadout Builder.` };
        }
        if (!visuals || typeof visuals !== 'object') { // Add basic visuals check
            return { loadoutData: null, error: `(${context}) Visual configuration is missing. Open the builder.` };
        }
        if (!codeLoadoutName || typeof codeLoadoutName !== 'string' || codeLoadoutName.trim().length === 0) {
             return { loadoutData: null, error: `(${context}) Please select a Code Snippet in the Loadout Builder.` };
        }
        // --- End Validation ---

        this.updateLoadoutStatus(`(${context}) Fetching code for "${codeLoadoutName}"...`);
        try {
             // --- Fetch the selected snippet's code ---
             const encodedName = encodeURIComponent(codeLoadoutName);
             const snippet = await apiCall(`/api/snippets/${encodedName}`, 'GET');

             if (!snippet || typeof snippet.code !== 'string') {
                  throw new Error(`API did not return valid code for snippet "${codeLoadoutName}".`);
             }

             // --- Construct the final loadout data object ---
             const loadoutData = {
                 name: robotName.trim(), // Use the robot name from builder
                 visuals: visuals,       // Use the visuals object from builder
                 code: snippet.code      // Use the fetched code
             };

             console.log(`[Controls._prepareLoadoutData] Successfully prepared data for ${context}:`, { name: loadoutData.name, visuals: '...', code: '...' });
             this.updateLoadoutStatus(`(${context}) Loadout ready.`);
             return { loadoutData: loadoutData, error: null };

        } catch (error) {
             console.error(`[Controls._prepareLoadoutData] Error preparing loadout data for ${context}:`, error);
             let userMessage = error.message || 'Unknown error.';
             if (error.status === 404) {
                 userMessage = `Selected code snippet "${codeLoadoutName}" not found. It might have been deleted. Check Loadout Builder.`;
             } else if (error.status === 401) {
                  userMessage = `Authentication error fetching code. Please log in again.`;
             } else {
                 userMessage = `Failed to fetch code for "${codeLoadoutName}": ${userMessage}`;
             }
             return { loadoutData: null, error: `(${context}) ${userMessage}` };
        }
    }


    // --- Code SNIPPET Management Methods (Using API) ---
    // ... (No changes to saveCodeSnippet, loadCodeSnippet, deleteCodeSnippet, populateCodeSnippetSelect) ...
    /** Saves or updates a code snippet via API */
    async saveCodeSnippet(name, code) {
        this.updateLoadoutStatus(`Saving snippet "${name}"...`);
        try {
            const result = await apiCall('/api/snippets', 'POST', { name, code });
            this.updateLoadoutStatus(result.message || `Snippet "${name}" saved.`);
            this.populateCodeSnippetSelect(name); // Refresh dropdown and select the saved one
            window.dispatchEvent(new CustomEvent('snippetListUpdated'));
            console.log("[Controls] Dispatched 'snippetListUpdated' event after saving snippet via API.");
        } catch (error) {
            console.error(`[Controls] API Error saving snippet "${name}":`, error);
            this.updateLoadoutStatus(`Error saving snippet: ${error.message}`, true);
            alert(`Failed to save snippet "${name}":\n${error.message}`);
        }
    }

    /** Loads code for a specific snippet via API into the editor */
    async loadCodeSnippet(name) {
         if (!name || typeof editor === 'undefined') return;
         this.updateLoadoutStatus(`Loading snippet "${name}"...`);
         try {
             const encodedName = encodeURIComponent(name);
             const snippet = await apiCall(`/api/snippets/${encodedName}`, 'GET');

             if (typeof editor?.setValue === 'function') {
                 editor.setValue(snippet.code || '');
                 this.updateLoadoutStatus(`Loaded snippet: ${name}`);
                 if(this.loadSnippetSelect) this.loadSnippetSelect.value = name;
                 if(this.deleteSnippetButton) this.deleteSnippetButton.disabled = (this.uiState !== 'lobby');
             } else {
                  console.error("[Controls] CodeMirror editor (setValue) not available.");
                  this.updateLoadoutStatus("Editor not ready.", true);
             }
         } catch (error) {
             console.error(`[Controls] API Error loading snippet "${name}":`, error);
             this.updateLoadoutStatus(`Error loading snippet: ${error.message}`, true);
             if (error.status === 404) {
                  alert(`Snippet "${name}" was not found on the server. It might have been deleted.`);
                  this.populateCodeSnippetSelect(); // Refresh dropdown if snippet is gone
             } else {
                  alert(`Failed to load snippet "${name}":\n${error.message}`);
             }
         }
    }

    /** Deletes a code snippet via API */
    async deleteCodeSnippet(name) {
         if (!name) return;
         this.updateLoadoutStatus(`Deleting snippet "${name}"...`);
         try {
             const encodedName = encodeURIComponent(name);
             const result = await apiCall(`/api/snippets/${encodedName}`, 'DELETE');
             this.updateLoadoutStatus(result.message || `Snippet "${name}" deleted.`);
             this.populateCodeSnippetSelect(); // Refresh dropdown
             window.dispatchEvent(new CustomEvent('snippetListUpdated'));
             console.log("[Controls] Dispatched 'snippetListUpdated' event after deleting snippet via API.");
         } catch (error) {
             console.error(`[Controls] API Error deleting snippet "${name}":`, error);
             this.updateLoadoutStatus(`Error deleting snippet: ${error.message}`, true);
             if (error.status === 409) {
                 alert(`Cannot delete snippet "${name}":\n${error.message}`);
             } else {
                 alert(`Failed to delete snippet "${name}":\n${error.message}`);
             }
         }
    }

    /** Populates the snippet dropdown from the API */
    async populateCodeSnippetSelect(selectName = null) {
         if (!this.loadSnippetSelect) { console.error("Snippet select element not found."); return; }

         const loggedIn = window.authHandler?.isLoggedIn ?? false;
         if (!loggedIn) {
             while (this.loadSnippetSelect.options.length > 1) { this.loadSnippetSelect.remove(1); }
             this.loadSnippetSelect.value = "";
             this.loadSnippetSelect.disabled = true;
             if (this.deleteSnippetButton) this.deleteSnippetButton.disabled = true;
             return;
         }

         const originallyDisabled = {
             select: this.loadSnippetSelect.disabled,
             deleteBtn: this.deleteSnippetButton ? this.deleteSnippetButton.disabled : true
         };
         this.loadSnippetSelect.disabled = true;
         if (this.deleteSnippetButton) this.deleteSnippetButton.disabled = true;

         while (this.loadSnippetSelect.options.length > 1) { this.loadSnippetSelect.remove(1); }

         try {
             const snippets = await apiCall('/api/snippets', 'GET');

             if (Array.isArray(snippets)) {
                 snippets.sort((a, b) => a.name.localeCompare(b.name));
                 snippets.forEach(snippet => {
                     const option = document.createElement('option');
                     option.value = snippet.name;
                     option.textContent = snippet.name;
                     this.loadSnippetSelect.appendChild(option);
                 });

                 if (selectName && snippets.some(s => s.name === selectName)) {
                     this.loadSnippetSelect.value = selectName;
                 } else {
                     this.loadSnippetSelect.value = "";
                 }
             } else {
                  console.error("[Controls] API response for snippets was not an array:", snippets);
                  this.updateLoadoutStatus("Failed to parse snippet list.", true);
             }

         } catch (error) {
              if (error.status === 401) {
                 console.warn("[Controls] API Error populating snippet select: 401 Unauthorized.");
              } else {
                 console.error("[Controls] API Error populating snippet select:", error);
                 this.updateLoadoutStatus(`Error fetching snippets: ${error.message}`, true);
              }
         } finally {
              const isLoggedInNow = window.authHandler?.isLoggedIn ?? false;
              const codeSnippetControlsDisabled = !(isLoggedInNow && this.uiState === 'lobby');
              this.loadSnippetSelect.disabled = codeSnippetControlsDisabled;
               if (this.deleteSnippetButton) {
                  this.deleteSnippetButton.disabled = codeSnippetControlsDisabled || !this.loadSnippetSelect.value;
               }
         }
    }
    // --- End Code SNIPPET Management Methods ---


    /**
     * Updates ONLY the player icon in the header.
     * The player name is handled by auth.js using the account username.
     * TODO: Needs to fetch the *active* loadout's visuals.
     */
    updatePlayerHeaderDisplay() {
        const iconDisplay = document.getElementById('player-icon-display');
        if (!iconDisplay) { console.warn("Player header icon display element not found."); return; }

        const loggedIn = window.authHandler?.isLoggedIn ?? false;
        let displayColor = '#888';
        let tooltipText = 'Loadout Config: Unknown (API TODO)';

        // --- TODO: Fetch user's active config visuals via API ---
        // This should eventually:
        // 1. GET /api/users/me/active-config (or similar)
        // 2. Based on result, GET /api/loadouts/:configName
        // 3. Use loadout.visuals.chassis.color (or similar) for the icon background
        // -----------------------------------------------------

        if (!loggedIn) {
             displayColor = '#555'; tooltipText = 'Loadout Config: N/A';
        } else {
             // TEMPORARY: Use LoadoutBuilder's current visuals if available
             const builderVisuals = window.loadoutBuilderInstance?.currentLoadout?.visuals;
             if (builderVisuals?.chassis?.color) {
                 displayColor = builderVisuals.chassis.color;
                 tooltipText = `Active Loadout (using builder state): ${window.loadoutBuilderInstance.currentLoadout.configName || 'Unsaved'}`;
             } else {
                 // Fallback if builder state unavailable or incomplete
                 displayColor = '#4CAF50'; // Generic logged-in color
                 tooltipText = 'Account Logged In (Loadout visuals unavailable)';
             }
        }

        iconDisplay.style.backgroundColor = displayColor;
        iconDisplay.title = tooltipText;
    }


    /** Updates the small status text below the editor controls */
    updateLoadoutStatus(message, isError = false) {
        if (this.loadoutStatus) {
            this.loadoutStatus.textContent = message;
            this.loadoutStatus.style.color = isError ? '#e74c3c' : '#4CAF50';
             if (this.statusTimeoutId) clearTimeout(this.statusTimeoutId);
             this.statusTimeoutId = setTimeout(() => {
                  if (this.loadoutStatus && this.loadoutStatus.textContent === message) {
                       this.loadoutStatus.textContent = '';
                  }
                  this.statusTimeoutId = null;
             }, 4000);
        }
    }

} // End Controls Class
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

## client/js/ui/loadoutBuilder.js

```code
// client/js/ui/loadoutBuilder.js

/**
 * Manages the Loadout Builder overlay UI.
 * Handles selection of visual components, colors, code snippets, presets, robot name, config name,
 * saving/loading complete loadouts via API calls, and interacting with temporary storage
 * via the LocalStorageManager for snippets/lastConfig. Listens for snippet updates.
 */
class LoadoutBuilder {
    constructor() {
        // --- REMOVED LocalStorageManager ---

        // --- DOM Element References ---
        this.overlayElement = document.getElementById('loadout-builder-overlay');
        this.contentElement = document.getElementById('loadout-builder-content');
        this.robotNameInput = document.getElementById('builder-robot-name');
        this.configNameInput = document.getElementById('config-name-input');
        this.builderLoadoutSelect = document.getElementById('builder-loadout-select'); // Selects Config Name
        this.builderDeleteButton = document.getElementById('builder-delete-loadout'); // Deletes Config Name
        this.builderSaveButton = document.getElementById('builder-save-loadout'); // Saves Config Name
        this.builderStatusSpan = document.getElementById('builder-loadout-status');
        this.presetSelect = document.getElementById('builder-preset-select');
        this.turretTypeSelect = document.getElementById('turret-type-select');
        this.turretColorInput = document.getElementById('turret-color-input');
        this.chassisTypeSelect = document.getElementById('chassis-type-select');
        this.chassisColorInput = document.getElementById('chassis-color-input');
        this.mobilityTypeSelect = document.getElementById('mobility-type-select');
        this.builderCodeSelect = document.getElementById('builder-code-select'); // Selects Code Snippet Name
        this.previewCanvas = document.getElementById('loadout-preview');
        this.enterLobbyButton = document.getElementById('btn-enter-lobby');
        this.quickStartButton = document.getElementById('btn-quick-start');

        // Basic check for critical elements
        if (!this.overlayElement || !this.contentElement || !this.robotNameInput || !this.configNameInput ||
            !this.builderLoadoutSelect || !this.builderDeleteButton || !this.builderSaveButton ||
            !this.builderCodeSelect || !this.previewCanvas || !this.enterLobbyButton || !this.quickStartButton ||
            !this.presetSelect ) {
            console.error("Loadout Builder failed to find one or more critical overlay elements!");
            throw new Error("Loadout Builder UI elements missing."); // Throw error to stop main.js
        }

        // --- Internal State ---
        this.currentLoadout = this._getDefaultLoadoutState(); // Use helper for default state
        this.cachedLoadouts = []; // Store loadouts fetched from API: [{id, config_name, robot_name, visuals, code_snippet_id, code_snippet_name}, ...]
        this.cachedSnippets = []; // Store snippets fetched from API: [{id, name, code}, ...]
        this.isVisible = false;
        this.statusTimeoutId = null;

        // --- Preview Canvas Context ---
        this.previewCtx = this.previewCanvas.getContext('2d');
        if (!this.previewCtx) {
            console.error("Failed to get 2D context for loadout preview canvas.");
        }

        // --- Initial Setup ---
        this._setupEventListeners();
        console.log("LoadoutBuilder initialized (API Mode).");
    }

    /** Returns a default structure for the internal loadout state */
    _getDefaultLoadoutState() {
         // Try to use current user's name for default robot name
         const defaultRobotName = window.currentUser?.username ? `${window.currentUser.username}'s Bot` : `Default Bot`;
         return {
             configName: '',
             robotName: defaultRobotName,
             visuals: {
                 turret: { type: 'standard', color: '#D3D3D3' },
                 chassis: { type: 'medium', color: '#808080' },
                 mobility: { type: 'wheels' }
             },
             codeLoadoutName: '' // Name of the code snippet
         };
    }

    // --- Public Methods ---

    /** Shows the loadout builder overlay and populates data AFTER verifying auth, with retries */
    async show() { // Keep async
        if (!this.overlayElement) {
            console.error("Cannot show builder: Overlay element missing.");
            return;
        }
        console.log("[Builder Show] Showing overlay.");
        this.overlayElement.style.display = 'flex';
        this.isVisible = true;
        this.updateStatus("Verifying session..."); // Initial status

        // --- START: Verify Session with Retries ---
        const MAX_AUTH_RETRIES = 3;
        const RETRY_DELAY_MS = 300; // Delay between retries

        for (let attempt = 1; attempt <= MAX_AUTH_RETRIES; attempt++) {
            try {
                console.log(`[Builder Show] Checking auth status via /api/auth/me (Attempt ${attempt}/${MAX_AUTH_RETRIES})...`);
                const authStatus = await apiCall('/api/auth/me'); // Call the 'me' endpoint

                if (authStatus?.isLoggedIn) {
                    console.log("[Builder Show] Auth check successful. Proceeding with data population.");
                    this.updateStatus("Loading data..."); // Update status

                    // --- Fetch last used config (TODO remains) ---
                    let initialConfigToLoad = null;

                    // Populate dropdowns via API now that session is confirmed
                    await Promise.all([
                        this.populateLoadoutSelect(),
                        this.populateCodeSelect()
                    ]);
                    this.updateStatus("Data loaded.");

                    // --- Decide which config to load initially (logic remains the same) ---
                    if (!initialConfigToLoad && this.cachedLoadouts.length > 0) {
                         initialConfigToLoad = this.cachedLoadouts[0]; // Load the first available config data object
                         console.log(`[Builder Show] No last config preference found, loading first available: '${initialConfigToLoad.config_name}'`);
                    } else if (initialConfigToLoad) {
                         console.log(`[Builder Show] TODO: Handle loading specific last config preference: '${initialConfigToLoad}'`);
                         const foundConfig = this.cachedLoadouts.find(cfg => cfg.config_name === initialConfigToLoad || cfg.id === initialConfigToLoad);
                         initialConfigToLoad = foundConfig || null; // Use the found object or null
                    }
                    this.loadConfiguration(initialConfigToLoad); // Load the selected config data (or null for defaults)
                    console.log("[Builder Show] Initial configuration loaded/set.");
                    return; // <<< EXIT show() successfully after population
                } else {
                    // Auth check returned isLoggedIn: false
                    console.warn(`[Builder Show] Auth check attempt ${attempt} failed (isLoggedIn: false).`);
                    if (attempt === MAX_AUTH_RETRIES) {
                         console.error("[Builder Show] Auth check failed after multiple attempts! User logged out unexpectedly?");
                         this.updateStatus("Session error. Please try logging in again.", true);
                         this.loadConfiguration(null); // Load defaults
                         return; // Exit after max retries
                    }
                    // Wait before retrying
                    this.updateStatus(`Verifying session... (Attempt ${attempt + 1})`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                }

            } catch (error) {
                // Handle errors from the /api/auth/me call itself
                console.error(`[Builder Show] Error during auth check attempt ${attempt}:`, error);
                if (error.status === 401) {
                    this.updateStatus(`Session validation failed: ${error.message}`, true);
                } else {
                    this.updateStatus(`Error verifying session: ${error.message}`, true);
                }

                if (attempt === MAX_AUTH_RETRIES) {
                     this.loadConfiguration(null); // Load defaults on final error
                     return; // Exit after max retries
                }
                 // Wait before retrying after an error
                this.updateStatus(`Retrying session verification... (Attempt ${attempt + 1})`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            }
        } // End retry loop
        // --- END: Verify Session with Retries ---
    }


    /** Hides the loadout builder overlay */
    hide() {
        if (!this.overlayElement) return;
        this.overlayElement.style.display = 'none';
        this.isVisible = false;
        console.log("Loadout Builder hidden.");
    }

    /**
     * Loads a specific configuration object into the builder UI.
     * If loadoutData is null, resets to defaults.
     * @param {object | null} loadoutData - The full loadout config object fetched from API,
     *                                     or null to load defaults.
     *                                     Expected: {config_name, robot_name, visuals, code_snippet_name}
     */
    loadConfiguration(loadoutData) {
        console.log(`[Load Config] Attempting to load data:`, loadoutData);

        if (loadoutData && typeof loadoutData === 'object') {
            // --- Load from provided data object ---
            this.currentLoadout = {
                configName: loadoutData.config_name || '', // Use names from object
                robotName: loadoutData.robot_name || 'Unnamed Robot',
                visuals: loadoutData.visuals || this._getDefaultLoadoutState().visuals, // Fallback visuals
                codeLoadoutName: loadoutData.code_snippet_name || '' // Use snippet name from object
            };
            console.log(`[Load Config] Loaded data for '${this.currentLoadout.configName}'. Internal state updated.`);
            this.updateStatus(`Loaded configuration: ${this.currentLoadout.configName}`);
        } else {
            // --- Reset to Defaults ---
            console.log(`[Load Config] Applying default configuration.`);
            this.currentLoadout = this._getDefaultLoadoutState();
            this.updateStatus('Defaults loaded. Customize or Enter Lobby.');
        }

        // --- Update UI Elements from this.currentLoadout ---
        this._syncUIToInternalState(this.currentLoadout.configName);

        this._redrawPreview();
        console.log("[Load Config] UI Sync complete.");
    }

    // --- Private Helper Methods ---

    /** Syncs the builder's input/select values TO the current internalLoadout state */
    _syncInternalStateToUI() {
        if (!this.currentLoadout) return;
        this.currentLoadout.robotName = this.robotNameInput.value.trim();
        this.currentLoadout.configName = this.configNameInput.value.trim();
        if (!this.currentLoadout.visuals) this.currentLoadout.visuals = {};
        if (!this.currentLoadout.visuals.turret) this.currentLoadout.visuals.turret = {};
        if (!this.currentLoadout.visuals.chassis) this.currentLoadout.visuals.chassis = {};
        if (!this.currentLoadout.visuals.mobility) this.currentLoadout.visuals.mobility = {};
        this.currentLoadout.visuals.turret.type = this.turretTypeSelect.value;
        this.currentLoadout.visuals.turret.color = this.turretColorInput.value;
        this.currentLoadout.visuals.chassis.type = this.chassisTypeSelect.value;
        this.currentLoadout.visuals.chassis.color = this.chassisColorInput.value;
        this.currentLoadout.visuals.mobility.type = this.mobilityTypeSelect.value;
        this.currentLoadout.codeLoadoutName = this.builderCodeSelect.value; // Store the NAME selected
    }

    /** Syncs the internalLoadout state TO the builder's input/select values */
    _syncUIToInternalState(selectConfigName = null) {
        console.log("[Sync UI] Syncing UI elements FROM internal state:", JSON.parse(JSON.stringify(this.currentLoadout)));

        this.robotNameInput.value = this.currentLoadout.robotName || '';
        this.configNameInput.value = this.currentLoadout.configName || '';
        this.turretTypeSelect.value = this.currentLoadout.visuals?.turret?.type || 'standard';
        this.turretColorInput.value = this.currentLoadout.visuals?.turret?.color || '#ff0000';
        this.chassisTypeSelect.value = this.currentLoadout.visuals?.chassis?.type || 'medium';
        this.chassisColorInput.value = this.currentLoadout.visuals?.chassis?.color || '#cccccc';
        this.mobilityTypeSelect.value = this.currentLoadout.visuals?.mobility?.type || 'wheels';

        // --- Sync Dropdowns ---
        // Sync Config Name dropdown
        // Check if the name to select exists in the dropdown options
        const configExistsInDropdown = Array.from(this.builderLoadoutSelect.options).some(opt => opt.value === selectConfigName);
        if (selectConfigName && configExistsInDropdown) {
            this.builderLoadoutSelect.value = selectConfigName;
        } else {
             this.builderLoadoutSelect.value = ""; // Fallback if loaded config name isn't in list
             if (selectConfigName) console.warn(`[Sync UI] Config name '${selectConfigName}' not found in dropdown.`);
        }
        console.log(`[Sync UI] Set Config Select dropdown to: '${this.builderLoadoutSelect.value}'`);


        // Sync Code Snippet dropdown
        const codeNameExistsInDropdown = Array.from(this.builderCodeSelect.options).some(opt => opt.value === this.currentLoadout.codeLoadoutName);
        if (this.currentLoadout.codeLoadoutName && codeNameExistsInDropdown) {
            this.builderCodeSelect.value = this.currentLoadout.codeLoadoutName;
        } else {
            this.builderCodeSelect.value = ""; // Fallback to default empty option
             if (this.currentLoadout.codeLoadoutName) {
                 console.warn(`[Sync UI] Code snippet '${this.currentLoadout.codeLoadoutName}' not found in dropdown. Resetting selection.`);
                 // Don't clear internal state here, let user re-select if snippet was deleted
             }
        }
         console.log(`[Sync UI] Set Code Select dropdown to: '${this.builderCodeSelect.value}'`);

        this.builderDeleteButton.disabled = !this.builderLoadoutSelect.value;
        this.presetSelect.value = ""; // Reset preset dropdown on any load
    }


    _setupEventListeners() {
        // Config Management
        this.builderLoadoutSelect.addEventListener('change', this._handleLoadoutSelectChange.bind(this));
        this.builderSaveButton.addEventListener('click', this._handleSaveLoadoutClick.bind(this));
        this.builderDeleteButton.addEventListener('click', this._handleDeleteLoadoutClick.bind(this));
        this.configNameInput.addEventListener('input', (e) => {
             // Just update internal state directly, no need to re-sync whole UI
            if (this.currentLoadout) this.currentLoadout.configName = e.target.value.trim();
        });

        // Robot Name
        this.robotNameInput.addEventListener('input', (e) => {
            if (this.currentLoadout) this.currentLoadout.robotName = e.target.value.trim();
        });

        // Visuals
        this.presetSelect.addEventListener('change', this._handlePresetSelectChange.bind(this));
        this.turretTypeSelect.addEventListener('change', this._handleVisualSelectionChange.bind(this));
        this.turretColorInput.addEventListener('input', this._handleVisualSelectionChange.bind(this));
        this.chassisTypeSelect.addEventListener('change', this._handleVisualSelectionChange.bind(this));
        this.chassisColorInput.addEventListener('input', this._handleVisualSelectionChange.bind(this));
        this.mobilityTypeSelect.addEventListener('change', this._handleVisualSelectionChange.bind(this));

        // Code
        this.builderCodeSelect.addEventListener('change', this._handleCodeSelectionChange.bind(this));

        // Actions
        this.enterLobbyButton.addEventListener('click', this._handleEnterLobbyClick.bind(this));
        this.quickStartButton.addEventListener('click', this._handleQuickStartClick.bind(this));

        // Global Snippet Update Listener (from Controls potentially)
        window.addEventListener('snippetListUpdated', this._handleSnippetListUpdate.bind(this));
    }

    /** Fetches loadouts via API and populates the 'Load Existing Config' dropdown. */
    async populateLoadoutSelect() {
         console.log("[Populate Configs] Fetching loadout configurations from API...");
         this.builderLoadoutSelect.disabled = true; // Disable during fetch

         // Clear existing options (except placeholder)
         while (this.builderLoadoutSelect.options.length > 1) { this.builderLoadoutSelect.remove(1); }
         this.cachedLoadouts = []; // Clear cache

         try {
             const loadouts = await apiCall('/api/loadouts', 'GET'); // Use global apiCall
             if (Array.isArray(loadouts)) {
                 this.cachedLoadouts = loadouts; // Store fetched data
                 console.log(`[Populate Configs] Found ${loadouts.length} configurations.`);
                 // Sort by name before adding
                 loadouts.sort((a, b) => a.config_name.localeCompare(b.config_name));
                 loadouts.forEach(cfg => {
                     const option = document.createElement('option');
                     option.value = cfg.config_name; // Use name as value
                     option.textContent = cfg.config_name;
                     this.builderLoadoutSelect.appendChild(option);
                 });
             } else {
                  console.error("[Populate Configs] API response was not an array:", loadouts);
                  this.updateStatus("Failed to parse loadout list.", true);
             }
         } catch (error) {
             console.error("[Populate Configs] API Error:", error);
             this.updateStatus(`Error fetching loadouts: ${error.message}`, true);
         } finally {
              this.builderLoadoutSelect.disabled = false; // Re-enable
              // Update delete button state based on current selection
              this.builderDeleteButton.disabled = !this.builderLoadoutSelect.value;
         }
    }

    /** Fetches code snippets via API and populates the 'Use Code' dropdown. */
    async populateCodeSelect() {
          console.log("[Populate Code] Fetching code snippets from API...");
          this.builderCodeSelect.disabled = true; // Disable during fetch

          // Clear existing options (except placeholder)
          while (this.builderCodeSelect.options.length > 1) { this.builderCodeSelect.remove(1); }
          this.cachedSnippets = []; // Clear cache

          try {
              const snippets = await apiCall('/api/snippets', 'GET'); // Use global apiCall
              if (Array.isArray(snippets)) {
                  this.cachedSnippets = snippets; // Store fetched data
                  console.log(`[Populate Code] Found ${snippets.length} code snippets.`);
                  // Sort by name
                  snippets.sort((a, b) => a.name.localeCompare(b.name));
                  snippets.forEach(snippet => {
                      const option = document.createElement('option');
                      option.value = snippet.name; // Use name as value
                      option.textContent = snippet.name;
                      this.builderCodeSelect.appendChild(option);
                  });
              } else {
                   console.error("[Populate Code] API response was not an array:", snippets);
                   this.updateStatus("Failed to parse snippet list.", true);
              }
          } catch (error) {
              console.error("[Populate Code] API Error:", error);
              this.updateStatus(`Error fetching snippets: ${error.message}`, true);
          } finally {
               this.builderCodeSelect.disabled = false; // Re-enable
               // Try to restore previous selection if possible
               const currentSelection = this.currentLoadout?.codeLoadoutName || "";
               if (this.cachedSnippets.some(s => s.name === currentSelection)) {
                    this.builderCodeSelect.value = currentSelection;
               } else {
                    this.builderCodeSelect.value = "";
               }
          }
    }

    /** Handles changing the selected configuration dropdown */
    _handleLoadoutSelectChange() {
        const selectedConfigName = this.builderLoadoutSelect.value;
        if (!selectedConfigName) {
            // User selected the placeholder ("Load Existing Config...") -> Load defaults
            console.log("[Config Select Change] Placeholder selected. Loading defaults.");
            this.loadConfiguration(null);
        } else {
            // Find the full data object from the cache based on the selected name
            const selectedConfigData = this.cachedLoadouts.find(cfg => cfg.config_name === selectedConfigName);
            if (selectedConfigData) {
                 console.log(`[Config Select Change] User selected: '${selectedConfigName}'. Loading cached configuration data.`);
                 this.loadConfiguration(selectedConfigData); // Load the found data object
            } else {
                 console.error(`[Config Select Change] Selected config '${selectedConfigName}' not found in cache!`);
                 this.updateStatus(`Error: Could not find data for '${selectedConfigName}'. Loading defaults.`, true);
                 this.loadConfiguration(null); // Load defaults as a fallback
            }
        }
    }

    /** Handles clicking the Save button -> POST /api/loadouts */
    async _handleSaveLoadoutClick() {
        console.log("[Save Config] Clicked.");
        this._syncInternalStateToUI(); // Ensure internal state matches UI

        const configToSave = this.currentLoadout;
        const { configName, robotName, visuals, codeLoadoutName } = configToSave;

        console.log(`[Save Config] Validating Config Name: '${configName}', Robot Name: '${robotName}', Snippet: '${codeLoadoutName}'`);

        // Validation
        if (!robotName) { alert("Please enter a Robot Name."); this.updateStatus("Save failed: Robot Name required.", true); return; }
        if (!configName) { alert("Please enter a Configuration Name."); this.updateStatus("Save failed: Config Name required.", true); return; }
        if (!codeLoadoutName) { alert("Please select a Code Snippet."); this.updateStatus("Save failed: Code Snippet required.", true); return; }

        // Check if selected snippet actually exists in our cache
        if (!this.cachedSnippets.some(s => s.name === codeLoadoutName)) {
             alert(`Selected code snippet "${codeLoadoutName}" is not available. Please refresh or select another.`);
             this.updateStatus("Save failed: Selected snippet invalid.", true);
             await this.populateCodeSelect(); // Refresh snippet list
             return;
        }

        this.updateStatus(`Saving configuration "${configName}"...`);
        try {
            const result = await apiCall('/api/loadouts', 'POST', {
                 configName: configName,
                 robotName: robotName,
                 visuals: visuals,
                 codeLoadoutName: codeLoadoutName // Send the NAME of the snippet
            });

            this.updateStatus(result.message || `Configuration "${configName}" saved.`);
            // Refresh loadout list and select the saved one
            await this.populateLoadoutSelect();
            this.builderLoadoutSelect.value = configName;
            this.builderDeleteButton.disabled = false;

        } catch (error) {
            console.error(`[Save Config] API Error saving config "${configName}":`, error);
            this.updateStatus(`Error saving config: ${error.message}`, true);
            alert(`Failed to save configuration "${configName}":\n${error.message}`);
        }
    } // End _handleSaveLoadoutClick

    /** Handles clicking Delete button -> DELETE /api/loadouts/:configName */
    async _handleDeleteLoadoutClick() {
        const selectedName = this.builderLoadoutSelect.value;
        if (!selectedName) return;

        if (confirm(`Are you sure you want to delete the configuration "${selectedName}"? This cannot be undone.`)) {
            this.updateStatus(`Deleting configuration "${selectedName}"...`);
            try {
                 const encodedName = encodeURIComponent(selectedName);
                 const result = await apiCall(`/api/loadouts/${encodedName}`, 'DELETE');
                 this.updateStatus(result.message || `Configuration "${selectedName}" deleted.`);
                 // Refresh loadout list and reset selection/UI
                 await this.populateLoadoutSelect();
                 this.loadConfiguration(null); // Load defaults after deleting
            } catch (error) {
                 console.error(`[Delete Config] API Error deleting config "${selectedName}":`, error);
                 this.updateStatus(`Error deleting config: ${error.message}`, true);
                 alert(`Failed to delete configuration "${selectedName}":\n${error.message}`);
            }
        }
    } // End _handleDeleteLoadoutClick

    /** Handles changing the Appearance Preset dropdown */
    _handlePresetSelectChange() {
        const presetValue = this.presetSelect.value;
        if (!presetValue) return;
        console.log(`[Loadout Builder] Preset selected: ${presetValue}`);
        let visualsToApply;
        switch (presetValue) {
             case 'tank': visualsToApply = { turret: { type: 'cannon', color: '#A9A9A9' }, chassis: { type: 'heavy', color: '#696969' }, mobility: { type: 'treads' } }; break;
             case 'spike': visualsToApply = { turret: { type: 'laser', color: '#FFD700' }, chassis: { type: 'light', color: '#B22222' }, mobility: { type: 'hover' } }; break;
             case 'tri': visualsToApply = { turret: { type: 'standard', color: '#4682B4' }, chassis: { type: 'medium', color: '#ADD8E6' }, mobility: { type: 'wheels' } }; break;
             default: visualsToApply = { turret: { type: 'standard', color: '#D3D3D3' }, chassis: { type: 'medium', color: '#808080' }, mobility: { type: 'wheels' } }; break;
        }
        this.currentLoadout.visuals = visualsToApply;
        // Sync only visual parts of the UI
        this.turretTypeSelect.value = visualsToApply.turret.type;
        this.turretColorInput.value = visualsToApply.turret.color;
        this.chassisTypeSelect.value = visualsToApply.chassis.type;
        this.chassisColorInput.value = visualsToApply.chassis.color;
        this.mobilityTypeSelect.value = visualsToApply.mobility.type;
        // --- End Sync ---
        this._redrawPreview();
        this.updateStatus(`Loaded appearance preset: ${presetValue}`);
        this.presetSelect.value = ""; // Reset dropdown
    }

    /** Handles changes to individual visual selects/inputs */
    _handleVisualSelectionChange() {
        // Just update internal state, no need to read all again if structure exists
        if (!this.currentLoadout.visuals) this.currentLoadout.visuals = {};
        if (!this.currentLoadout.visuals.turret) this.currentLoadout.visuals.turret = {};
        if (!this.currentLoadout.visuals.chassis) this.currentLoadout.visuals.chassis = {};
        if (!this.currentLoadout.visuals.mobility) this.currentLoadout.visuals.mobility = {};
        this.currentLoadout.visuals.turret.type = this.turretTypeSelect.value;
        this.currentLoadout.visuals.turret.color = this.turretColorInput.value;
        this.currentLoadout.visuals.chassis.type = this.chassisTypeSelect.value;
        this.currentLoadout.visuals.chassis.color = this.chassisColorInput.value;
        this.currentLoadout.visuals.mobility.type = this.mobilityTypeSelect.value;
        this._redrawPreview();
    }

    /** Handles changing the selected code snippet dropdown */
    _handleCodeSelectionChange() {
        this.currentLoadout.codeLoadoutName = this.builderCodeSelect.value;
        console.log(`[Loadout Builder] Code snippet selection changed to: '${this.currentLoadout.codeLoadoutName || 'None'}'`);
    }

    /** Redraws the robot preview canvas based on current selections */
    _redrawPreview() {
        if (!this.previewCtx || !this.currentLoadout?.visuals) return;
        const ctx = this.previewCtx;
        const W = this.previewCanvas.width;
        const H = this.previewCanvas.height;
        const visuals = this.currentLoadout.visuals;

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#1a1a1a'; // Background matching builder area
        ctx.fillRect(0, 0, W, H);

        // Simplified drawing centered in the preview canvas
        const centerX = W / 2;
        const centerY = H / 2;
        const scale = 3.5; // Scale factor for preview size
        const baseRadius = 15 * scale; // Use a consistent base size reference

        ctx.save();
        ctx.translate(centerX, centerY);
        // No rotation for static preview

        // --- Draw Robot Components (Layered, matching Arena.js logic) ---
        ctx.lineWidth = 1 * scale;
        ctx.strokeStyle = '#111';

        // 1. Mobility
        ctx.fillStyle = '#555'; // Default mobility color
        let treadWidth = baseRadius * 2.0; let treadHeight = baseRadius * 0.6;
        let wheelRadius = baseRadius * 0.5;
        let hoverRadiusX = baseRadius * 1.2; let hoverRadiusY = baseRadius * 0.8;
        switch (visuals.mobility?.type) {
            case 'treads':
                ctx.fillRect(-treadWidth / 2, -treadHeight * 1.5, treadWidth, treadHeight);
                ctx.fillRect(-treadWidth / 2, treadHeight * 0.5, treadWidth, treadHeight);
                ctx.strokeRect(-treadWidth / 2, -treadHeight * 1.5, treadWidth, treadHeight);
                ctx.strokeRect(-treadWidth / 2, treadHeight * 0.5, treadWidth, treadHeight);
                break;
            case 'hover':
                 ctx.save(); ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
                 ctx.beginPath(); ctx.ellipse(0, 0, hoverRadiusX * 1.2, hoverRadiusY * 1.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
                 ctx.beginPath(); ctx.ellipse(0, 0, hoverRadiusX, hoverRadiusY, 0, 0, Math.PI * 2);
                 ctx.fillStyle = '#444'; ctx.fill(); ctx.strokeStyle = '#88aaff'; ctx.lineWidth = 1 * scale; ctx.stroke();
                break;
            case 'wheels': default:
                ctx.beginPath(); ctx.arc(-baseRadius * 0.8, 0, wheelRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(baseRadius * 0.8, 0, wheelRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                break;
        }

        // 2. Chassis
        ctx.fillStyle = visuals.chassis?.color || '#aaaaaa';
        let chassisWidth, chassisHeight;
        switch (visuals.chassis?.type) {
            case 'heavy': chassisWidth = baseRadius * 2.4; chassisHeight = baseRadius * 1.6; break;
            case 'light': chassisWidth = baseRadius * 1.7; chassisHeight = baseRadius * 1.2; break;
            case 'medium': default: chassisWidth = baseRadius * 2.0; chassisHeight = baseRadius * 1.4; break;
        }
        const borderRadius = 3 * scale;
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
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // 3. Turret (Facing right)
        ctx.fillStyle = visuals.turret?.color || '#ffffff';
        ctx.strokeStyle = '#111'; // Reset stroke for turret
        let turretBaseRadius, barrelLength, barrelWidth;
        switch (visuals.turret?.type) {
            case 'cannon':
                turretBaseRadius = baseRadius * 0.7; barrelLength = baseRadius * 1.5; barrelWidth = baseRadius * 0.4;
                ctx.beginPath(); ctx.rect(-turretBaseRadius * 0.5, -turretBaseRadius * 0.8, turretBaseRadius, turretBaseRadius * 1.6); ctx.fill(); ctx.stroke();
                ctx.fillRect(turretBaseRadius * 0.5, -barrelWidth / 2, barrelLength, barrelWidth); ctx.strokeRect(turretBaseRadius * 0.5, -barrelWidth / 2, barrelLength, barrelWidth);
                break;
            case 'laser':
                turretBaseRadius = baseRadius * 0.5; barrelLength = baseRadius * 1.7; barrelWidth = baseRadius * 0.2;
                ctx.beginPath(); ctx.arc(0, 0, turretBaseRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.fillRect(turretBaseRadius*0.8, -barrelWidth / 2, barrelLength, barrelWidth); ctx.strokeRect(turretBaseRadius*0.8, -barrelWidth / 2, barrelLength, barrelWidth);
                break;
            case 'standard': default:
                turretBaseRadius = baseRadius * 0.6; barrelLength = baseRadius * 1.3; barrelWidth = baseRadius * 0.3;
                ctx.beginPath(); ctx.arc(0, 0, turretBaseRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.fillRect(turretBaseRadius*0.8, -barrelWidth / 2, barrelLength, barrelWidth); ctx.strokeRect(turretBaseRadius*0.8, -barrelWidth / 2, barrelLength, barrelWidth);
                break;
        }
        // --- End Draw Robot Components ---

        ctx.restore(); // Restore translation
    }

    /** Handles the Enter Lobby button click */
    async _handleEnterLobbyClick() {
        console.log("[Enter Lobby] Clicked.");
        this._syncInternalStateToUI(); // Sync before validating/saving

        const finalConfig = this.currentLoadout;
        const { configName, robotName, codeLoadoutName } = finalConfig;

        console.log(`[Enter Lobby] Validating Config: '${configName}', Robot: '${robotName}', Code: '${codeLoadoutName}'`);

        // Validation
        if (!robotName) { alert("Please enter a Robot Name."); return; }
        if (!configName) { alert("Please enter a Configuration Name."); return; }
        if (!codeLoadoutName) { alert("Please select code."); return; }
        if (!this.cachedSnippets.some(s => s.name === codeLoadoutName)) {
             alert(`Selected snippet "${codeLoadoutName}" is not available. Please refresh or select another.`);
             await this.populateCodeSelect(); // Refresh snippet list
             return;
        }

        // --- Save the final configuration via API ---
        let savedSuccessfully = false;
        this.updateStatus(`Saving final configuration "${configName}"...`);
        try {
             // Use the same POST endpoint which handles create/update
             await apiCall('/api/loadouts', 'POST', {
                 configName: configName,
                 robotName: robotName,
                 visuals: finalConfig.visuals,
                 codeLoadoutName: codeLoadoutName
             });
             savedSuccessfully = true;
             console.log(`[Enter Lobby] Configuration "${configName}" saved/updated via API.`);
             this.updateStatus(`Configuration "${configName}" saved.`);
             // TODO: Add API call to set this as the 'last used' config
             // Example: await apiCall('/api/users/me/last-config', 'PUT', { configName: configName });
             console.log(`[Enter Lobby] TODO: Implement setting last config preference ('${configName}') via API.`);

        } catch (error) {
            console.error(`[Enter Lobby] API Error saving final config "${configName}":`, error);
            this.updateStatus(`Error saving final config: ${error.message}`, true);
            alert(`Failed to save configuration "${configName}" before entering lobby:\n${error.message}`);
            return; // Don't proceed if save failed
        }
        // --- End Save ---

        this.hide();

        // Update header icon (using global controls instance)
        if (typeof controls !== 'undefined' && controls?.updatePlayerHeaderDisplay) {
             controls.updatePlayerHeaderDisplay();
        }

        // Connect network (using global network instance)
        // Note: Connection is likely already handled by onLoginSuccess now,
        // but this ensures controls state is updated correctly.
        if (typeof network !== 'undefined') {
             if (network.socket?.connected) {
                  console.log(`[Enter Lobby] Network connected. Setting Controls state.`);
                   if(typeof controls !== 'undefined') controls.setState('lobby'); // Ensure UI is in lobby state
             } else {
                  console.log(`[Enter Lobby] Network not connected, attempting connect (might be redundant).`);
                  network.connect(); // Should be safe to call again if needed
             }
        } else {
             console.error("Network object not found!");
             alert("Internal error: Cannot connect to network.");
        }
    } // End _handleEnterLobbyClick


    /** Handles the Quick Start button click */
    _handleQuickStartClick() {
        console.log("[Quick Start] Button clicked. Loading Quick Start defaults...");
        this.loadConfiguration(null); // Reset UI to defaults

        // TODO: Implement setting 'quick_start' preference via API
        // Example: await apiCall('/api/users/me/last-config', 'PUT', { configName: "quick_start" });
        console.log("[Quick Start] TODO: Implement setting 'quick_start' preference via API.");
        this.updateStatus("Quick Start selected (Preference not saved yet).");

         this.hide(); // Hide builder

         // Update header icon
         if (typeof controls !== 'undefined' && controls?.updatePlayerHeaderDisplay) {
              controls.updatePlayerHeaderDisplay();
         }

         // Connect network / Update state (Similar logic as Enter Lobby)
         if (typeof network !== 'undefined') {
             if (network.socket?.connected) {
                 console.log(`[Quick Start] Network connected. Setting Controls state.`);
                  if(typeof controls !== 'undefined') controls.setState('lobby');
             } else {
                 console.log(`[Quick Start] Network not connected, attempting connect.`);
                 network.connect();
             }
         } else {
              console.error("Network object not found!");
              alert("Internal error: Cannot connect to network.");
         }
    } // End _handleQuickStartClick

    /** Refreshes the code snippet dropdown when notified by Controls */
    async _handleSnippetListUpdate() {
        if (!this.isVisible) return; // Only refresh if builder is open
        console.log("[Loadout Builder] Received 'snippetListUpdated' event. Repopulating code select.");
        // Store current selection before refresh
        const currentValue = this.builderCodeSelect.value;
        await this.populateCodeSelect(); // Repopulate via API

        // Try to restore selection - check cachedSnippets AFTER populateCodeSelect finishes
        if (this.cachedSnippets.some(s => s.name === currentValue)) {
            this.builderCodeSelect.value = currentValue;
        } else {
             this.builderCodeSelect.value = ""; // Reset if deleted
             // Update internal state ONLY if the active selection was removed
             if (this.currentLoadout.codeLoadoutName === currentValue) {
                 this.currentLoadout.codeLoadoutName = "";
                 this.updateStatus(`Warning: Previously selected snippet '${currentValue}' may have been deleted.`, true);
             }
        }
    }

    /** Updates the status message within the builder */
    updateStatus(message, isError = false) {
         if (!this.builderStatusSpan) return;
         this.builderStatusSpan.textContent = message;
         this.builderStatusSpan.style.color = isError ? '#e74c3c' : '#4CAF50';
         if (this.statusTimeoutId) clearTimeout(this.statusTimeoutId);
         this.statusTimeoutId = setTimeout(() => {
              if (this.builderStatusSpan && this.builderStatusSpan.textContent === message) {
                   this.builderStatusSpan.textContent = '';
              }
              this.statusTimeoutId = null;
         }, 4000);
    }

} // End LoadoutBuilder Class

// Instantiate the builder globally and assign to window scope in main.js
// Ensure this runs after the class definition
// (No instantiation code here anymore)
```

## client/js/ui/editor.js

```code
// client/js/ui/editor.js

let editor;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize CodeMirror editor
    try {
        editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
            mode: 'javascript',
            theme: 'monokai',
            lineNumbers: true,
            indentUnit: 4,
            autoCloseBrackets: true,
            matchBrackets: true
        });

        // --- START: Improved Default Code Loading ---
        const defaultSnippetName = 'Simple Tank';
        let defaultCode = `// Default code if snippet/storage fails\nconsole.log("Default Code Active");\nrobot.drive(0,0);`; // Basic Fallback

        // Attempt to load the default snippet directly from LocalStorageManager defaults
        if (typeof LocalStorageManager !== 'undefined') {
            try {
                 const storageManager = new LocalStorageManager(); // Instance to access defaults
                 // Access the defaultSnippets property directly
                 if (storageManager.defaultSnippets && storageManager.defaultSnippets[defaultSnippetName]) {
                     defaultCode = storageManager.defaultSnippets[defaultSnippetName];
                     console.log(`Editor initialized with default snippet: ${defaultSnippetName}`);
                 } else {
                     // This case means the default wasn't defined in storage.js, which is a code issue
                     console.error(`Default snippet "${defaultSnippetName}" NOT DEFINED in LocalStorageManager. Using basic default.`);
                 }
            } catch (storageError) {
                 console.error("Error creating storage manager for default code:", storageError);
            }
        } else {
            console.warn("LocalStorageManager not available for default code loading.");
        }

        editor.setValue(defaultCode);
        // --- END: Improved Default Code Loading ---

    } catch(editorError) {
        console.error("FATAL: Failed to initialize CodeMirror editor:", editorError);
        alert("Error initializing the code editor. Please check the console.");
        const editorControls = document.querySelector('.editor-controls');
        if (editorControls) {
            Array.from(editorControls.children).forEach(el => el.disabled = true);
        }
    }

    // Removed event listener for #sample-code

}); // End DOMContentLoaded


// Function remains, uses storageManager defaults if available
function loadSampleCode(sampleName) {
    if (!editor) {
        console.error("Cannot load sample code: Editor not initialized.");
        return;
    }
    let code = '';
    let snippetsToUse = {};

    if (typeof LocalStorageManager !== 'undefined') {
        try {
            const storageManager = new LocalStorageManager();
            // Use the defined defaults property
            snippetsToUse = storageManager.defaultSnippets || {};
        } catch(e) {
            console.error("Error getting default snippets from storage manager", e);
        }
    } else {
         console.warn("LocalStorageManager not available to load sample code definitions.");
    }

    if (snippetsToUse[sampleName]) {
        code = snippetsToUse[sampleName];
    } else {
        console.warn(`Sample code definition for '${sampleName}' not found.`);
        code = `// Sample code '${sampleName}' not found.\nrobot.drive(0,0);`; // Provide fallback
    }

    if (code) {
        editor.setValue(code);
        if (window.addEventLogMessage) window.addEventLogMessage(`Loaded sample code: ${sampleName}`, 'info');
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

## client/js/utils/storage.js

```code
// client/js/utils/storage.js

/**
 * Manages interactions with browser localStorage for RobotWars configurations.
 * Provides a centralized and safe way to get/set loadouts, code snippets,
 * player names, and the last used configuration preference.
 * Seeds default code snippets if none exist. // <-- Updated description
 */
class LocalStorageManager {
    constructor() {
        // Define localStorage keys in one place
        this.keys = {
            completeLoadouts: 'robotWarsCompleteLoadouts', // Stores { name: { name, visuals: {...}, codeLoadoutName: "..." } }
            codeSnippets: 'robotWarsLoadouts',             // Stores { name: "code string..." }
            lastConfig: 'robotWarsLastConfig',             // Stores name of last used complete loadout OR "quick_start"
            playerName: 'robotWarsPlayerName'              // Stores the last entered player name
        };

        // --- Default Code Snippets Data ---
        this.defaultSnippets = {
            'Simple Tank': `// Simple Tank Bot (using state object)
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
}`,
            'Scanner Bot': `// Scanner Bot (using state object)
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
}`,
            'Aggressive Bot': `// Aggressive Bot (using state object)
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
}`
        };
        // --- End Default Snippets ---


        // Check if localStorage is available and usable
        this.isLocalStorageAvailable = this._checkLocalStorage();
        if (!this.isLocalStorageAvailable) {
            console.error("LocalStorageManager: localStorage is not available or disabled. Loadout persistence will not work.");
        } else {
            // --- Seed Default Snippets IF storage is available AND snippets don't exist ---
            this._seedDefaultSnippets();
            // ---------------------------------------------------------------------------
        }
    }

    /**
     * Checks if localStorage is supported and writable.
     * @private
     */
    _checkLocalStorage() {
        // ... (no changes to this method) ...
        let storage;
        try {
            storage = window.localStorage;
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    }

    /** Safely gets an item from localStorage */
    _getItem(key) {
        // ... (no changes to this method) ...
        if (!this.isLocalStorageAvailable) return null;
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error(`LocalStorageManager: Error reading item '${key}':`, error);
            return null;
        }
    }

    /** Safely sets an item in localStorage */
    _setItem(key, value) {
        // ... (no changes to this method) ...
        if (!this.isLocalStorageAvailable) return false;
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.error(`LocalStorageManager: Error setting item '${key}':`, error);
            if (error.name === 'QuotaExceededError') {
                alert("Could not save data: Browser storage quota exceeded. Try deleting old loadouts or code snippets.");
            } else {
                alert("An error occurred while trying to save data to browser storage.");
            }
            return false;
        }
    }

    /** Safely removes an item from localStorage */
    _removeItem(key) {
        // ... (no changes to this method) ...
        if (!this.isLocalStorageAvailable) return false;
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`LocalStorageManager: Error removing item '${key}':`, error);
            return false;
        }
    }

    // --- START: Seeding Logic ---
    /**
     * Checks if code snippets exist in localStorage and seeds defaults if not.
     * Only runs if localStorage is available.
     * @private
     */
    _seedDefaultSnippets() {
        // Check if the snippets key already exists
        const existingSnippets = this._getItem(this.keys.codeSnippets);

        // Only seed if the key is null or undefined (doesn't exist yet)
        if (existingSnippets === null) {
            console.log("LocalStorageManager: No existing code snippets found. Seeding defaults...");
            try {
                const stringifiedDefaults = JSON.stringify(this.defaultSnippets);
                if (this._setItem(this.keys.codeSnippets, stringifiedDefaults)) {
                    console.log("LocalStorageManager: Default code snippets seeded successfully.");
                } else {
                    // _setItem already logs the error and alerts the user
                    console.error("LocalStorageManager: Failed to save default snippets.");
                }
            } catch (error) {
                // Error during stringify (should be unlikely with predefined data)
                console.error("LocalStorageManager: Error stringifying default snippets:", error);
            }
        } else {
            // console.log("LocalStorageManager: Existing code snippets found. Skipping seeding.");
        }
    }
    // --- END: Seeding Logic ---


    // --- Complete Loadout Methods ---
    // ... (no changes to these methods) ...
    /** Retrieves all saved complete loadouts. */
    getCompleteLoadouts() {
        const storedData = this._getItem(this.keys.completeLoadouts);
        try {
            return storedData ? JSON.parse(storedData) : {};
        } catch (error) {
            console.error("LocalStorageManager: Error parsing complete loadouts:", error);
            return {}; // Return empty object on parse error
        }
    }
    /** Saves a single complete loadout configuration. Overwrites if name exists. */
    saveCompleteLoadout(name, loadoutData) {
        if (!name || !loadoutData) return false;
        const allLoadouts = this.getCompleteLoadouts();
        allLoadouts[name] = loadoutData; // Add or overwrite
        try {
            const stringifiedData = JSON.stringify(allLoadouts);
            return this._setItem(this.keys.completeLoadouts, stringifiedData);
        } catch (error) {
            console.error(`LocalStorageManager: Error stringifying complete loadouts for saving '${name}':`, error);
            return false;
        }
    }
    /** Deletes a single complete loadout configuration by name. */
    deleteCompleteLoadout(name) {
        if (!name) return false;
        const allLoadouts = this.getCompleteLoadouts();
        if (allLoadouts.hasOwnProperty(name)) {
            delete allLoadouts[name];
            try {
                const stringifiedData = JSON.stringify(allLoadouts);
                return this._setItem(this.keys.completeLoadouts, stringifiedData);
            } catch (error) {
                console.error(`LocalStorageManager: Error stringifying complete loadouts after deleting '${name}':`, error);
                return false;
            }
        }
        return true; // Return true if it didn't exist anyway
    }


    // --- Code Snippet Methods ---
    // ... (no changes to these methods) ...
     /** Retrieves all saved code snippets. */
    getCodeSnippets() {
        const storedData = this._getItem(this.keys.codeSnippets);
        try {
            return storedData ? JSON.parse(storedData) : {};
        } catch (error) {
            console.error("LocalStorageManager: Error parsing code snippets:", error);
            // If parsing fails, it might be corrupted. Should we return defaults?
            // For now, returning empty avoids overwriting potentially recoverable data.
            return {};
        }
    }
    /** Saves a single code snippet. Overwrites if name exists. */
    saveCodeSnippet(name, code) {
        if (!name || typeof code !== 'string') return false;
        const allSnippets = this.getCodeSnippets();
        allSnippets[name] = code; // Add or overwrite
        try {
            const stringifiedData = JSON.stringify(allSnippets);
            return this._setItem(this.keys.codeSnippets, stringifiedData);
        } catch (error) {
            console.error(`LocalStorageManager: Error stringifying code snippets for saving '${name}':`, error);
            return false;
        }
    }
    /** Deletes a single code snippet by name. */
    deleteCodeSnippet(name) {
        if (!name) return false;
        const allSnippets = this.getCodeSnippets();
        if (allSnippets.hasOwnProperty(name)) {
            delete allSnippets[name];
            try {
                const stringifiedData = JSON.stringify(allSnippets);
                return this._setItem(this.keys.codeSnippets, stringifiedData);
            } catch (error) {
                console.error(`LocalStorageManager: Error stringifying code snippets after deleting '${name}':`, error);
                return false;
            }
        }
        return true; // Return true if it didn't exist anyway
    }


    // --- Last Config Preference Methods ---
    // ... (no changes to these methods) ...
    /** Gets the last used configuration flag/name ("quick_start" or a loadout name). */
    getLastConfig() {
        return this._getItem(this.keys.lastConfig);
    }
    /** Sets the last used configuration flag/name. */
    setLastConfig(configName) {
        if (typeof configName === 'string') {
            return this._setItem(this.keys.lastConfig, configName);
        } else if (configName === null || configName === undefined) {
             return this._removeItem(this.keys.lastConfig);
        }
        console.warn("LocalStorageManager: Attempted to set last config with non-string value:", configName);
        return false;
    }


    // --- Player Name Methods ---
    // ... (no changes to these methods) ...
    /** Gets the saved player name. */
    getPlayerName() {
        return this._getItem(this.keys.playerName) || ''; // Return empty string if null
    }
    /** Saves the player name. Stores empty string if name is null/undefined/empty. */
    savePlayerName(name) {
        const nameToSave = (name || '').trim(); // Ensure it's a string and trim
        return this._setItem(this.keys.playerName, nameToSave);
    }


} // End LocalStorageManager Class
```

## client/js/main.js

```code
// Declare globals for potential access by other modules or console
window.loadoutBuilderInstance = null;
window.audioManager = null;
window.game = null;
window.network = null;
window.controls = null;
window.authHandler = null; // Reference to the auth handler instance

document.addEventListener('DOMContentLoaded', async () => { // Make async
    console.log('[Main.js] Document loaded, initializing game components...');

    try {
        // 1. Instantiate LoadoutBuilder (Assigns to window)
        window.loadoutBuilderInstance = new LoadoutBuilder();
        console.log('[Main.js] LoadoutBuilder instance created.');
        // Basic check if the builder seems okay (e.g., found its overlay)
        if (!window.loadoutBuilderInstance.overlayElement) {
            throw new Error("LoadoutBuilder instantiation failed basic check (missing overlayElement).");
        }

        // 2. Initialize AudioManager (Assigns to window)
        window.audioManager = new AudioManager();
        console.log('[Main.js] AudioManager initialized.');

        // 3. Initialize Game (Assigns to window)
        window.game = new Game('arena');
        console.log('[Main.js] Game instance created.');

        // 4. Initialize Network (Assigns to window)
        window.network = new Network(window.game);
        console.log('[Main.js] Network handler created.');

        // 5. Initialize Controls (Assigns to window)
        // Controls now needs the globally available game and network instances
        window.controls = new Controls(window.game, window.network);
        console.log('[Main.js] Controls handler created.');

        // 6. Initialize AuthHandler (Assigns to window)
        // Assuming AuthHandler class is defined in auth.js
        window.authHandler = new AuthHandler();
        console.log('[Main.js] Auth handler created.');

        // 7. Initialize Auth Flow (critical step AFTER other instances exist)
        // This checks login, sets up UI, and calls _onLoginSuccess or shows modal
        console.log('[Main.js] Initializing auth flow...');
        await window.authHandler.initialize(); // Call the async init method
        console.log('[Main.js] Auth flow initialization complete.');

        // 8. Initial Draw (background is always useful)
        if (window.game && window.game.renderer) {
            window.game.renderer.redrawArenaBackground();
            console.log('[Main.js] Initial arena background drawn.');
        }

        // 9. Initialization Complete
        console.log('[Main.js] Core components initialization complete.');
        console.log('[Main.js] Application ready.');

    } catch (error) {
        console.error("[Main.js] CRITICAL ERROR during initialization:", error);
        // Display a user-friendly error message covering the whole page
        document.body.innerHTML = `<div style="padding: 20px; background-color: #330000; border: 2px solid red; color: white; font-family: monospace; text-align: center;">
            <h2>Critical Error During Initialization</h2>
            <p>The application could not start correctly.</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <p>Please check the browser console (F12) for more details or try refreshing the page.</p>
        </div>`;
        // alert("Failed to initialize the game client. Check the console for details."); // Alert might be annoying
    }
});
```

## client/js/auth.js

```code
// client/js/auth.js

// --- Global State (Kept for compatibility for now, but prefer authHandler.isLoggedIn) ---
let isLoggedIn = false;
window.currentUser = null; // { id, username }

// --- API Call Helper (Global Scope) ---
/**
 * Helper function to make API calls to the backend.
 * Includes credentials to handle session cookies.
 * @param {string} endpoint - The API endpoint path (e.g., '/api/auth/login').
 * @param {string} [method='GET'] - The HTTP method.
 * @param {object|null} [body=null] - The request body for POST/PUT requests.
 * @returns {Promise<object>} - A promise that resolves with the JSON response data.
 * @throws {Error} - Throws an error if the fetch fails or the response is not ok,
 *                   potentially including status and server message.
 */
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {},
        credentials: 'include' // Send cookies automatically
    };
    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    try {
        // console.log(`[API Call] Sending ${method} request to ${endpoint}`); // Optional: Less verbose logging
        const response = await fetch(endpoint, options);
        let data;
        try {
             const contentType = response.headers.get("content-type");
             if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
             } else {
                 const textResponse = await response.text();
                 if (response.ok && !textResponse) {
                     data = { message: 'Success (No Content)' };
                 } else if (!response.ok) {
                     console.error(`[API Call] Non-JSON Error Response (Status ${response.status}) for ${method} ${endpoint}:`, textResponse);
                     throw new Error(textResponse || `Server returned status ${response.status}`);
                 } else {
                     console.warn(`[API Call] Received non-JSON success response (Status ${response.status}) for ${method} ${endpoint}:`, textResponse);
                     data = { message: textResponse || 'Success (Non-JSON)' };
                 }
             }
        } catch (jsonError) {
             console.error(`[API Call] Error processing response for ${method} ${endpoint}:`, jsonError, "Response Status:", response.status);
             if (!response.ok) {
                 throw new Error(`Server returned status ${response.status}`);
             }
             throw jsonError;
        }

        if (!response.ok) {
            const errorMessage = data?.message || `HTTP error! status: ${response.status} ${response.statusText}`;
            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = data;
            console.warn(`[API Call] Request failed for ${method} ${endpoint} (Status ${response.status}): ${errorMessage}`);
            throw error;
        }

        // console.log(`[API Call] Success for ${method} ${endpoint}`, data); // Optional: Less verbose logging
        return data;
    } catch (error) {
         if (!error.status) {
             console.error(`[API Call] Network or fetch error for ${method} ${endpoint}:`, error);
             error.message = `Network error: Could not reach server. (${error.message})`;
         }
        throw error;
    }
}
// --- End API Call Helper ---


/**
 * Manages the entire authentication flow, including UI modals,
 * API interactions, state updates, and triggering post-login/logout actions.
 * Should be instantiated and initialized by main.js after other core components.
 */
class AuthHandler {
    constructor() {
        // --- DOM Element References ---
        this.loginModal = document.getElementById('login-modal');
        this.registerModal = document.getElementById('register-modal');
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        this.loginError = document.getElementById('login-error');
        this.registerError = document.getElementById('register-error');
        this.logoutButton = document.getElementById('btn-logout');
        this.playerNameDisplay = document.getElementById('player-name-display'); // Header account name
        this.iconDisplay = document.getElementById('player-icon-display'); // Header icon (reset color on auth change)
        this.mainContainer = document.querySelector('.container'); // Main game area container

        // --- Robust Element Check ---
        const requiredElements = {
            loginModal: this.loginModal, registerModal: this.registerModal,
            loginForm: this.loginForm, registerForm: this.registerForm,
            logoutButton: this.logoutButton, mainContainer: this.mainContainer,
            playerNameDisplay: this.playerNameDisplay
        };
        let missingElement = null;
        for (const key in requiredElements) { if (!requiredElements[key]) { missingElement = key; break; } }

        if (missingElement) {
            console.error(`[AuthHandler Constructor] FATAL: Required UI element not found: '${missingElement}'.`);
            throw new Error(`AuthHandler could not find required element: ${missingElement}`);
        }

        // --- Internal State ---
        this._loggedIn = false; // Add internal state flag

        console.log("AuthHandler constructor: Required elements found.");
    }

    // --- Add isLoggedIn getter ---
    get isLoggedIn() {
        return this._loggedIn;
    }

    // --- Modal Control ---
    _showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const errorElement = modal.querySelector('.error-message');
            if (errorElement) errorElement.textContent = '';
            modal.style.display = 'flex';
        } else {
            console.error(`[AuthHandler] Modal with ID '${modalId}' not found.`);
        }
    }

    _closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        } else {
            console.error(`[AuthHandler] Modal with ID '${modalId}' not found.`);
        }
    }

    // --- Authentication Logic Handlers (Private) ---

    async _handleLogin(event) {
        event.preventDefault();
        if (!this.loginForm || !this.loginError) {
             console.error("[AuthHandler] Login form or error element missing in _handleLogin.");
             return;
        }
        this.loginError.textContent = '';
        const username = this.loginForm.username.value;
        const password = this.loginForm.password.value;

        try {
            const data = await apiCall('/api/auth/login', 'POST', { username, password });
            console.log('[AuthHandler] Login successful:', data);
            this._updateAuthState(true, data.user); // Update internal and global state
            this._closeModal('login-modal');
            this._onLoginSuccess();
        } catch (error) {
            console.error('[AuthHandler] Login failed:', error);
            this.loginError.textContent = error.message || 'Login failed. Please try again.';
        }
    }

    async _handleRegister(event) {
        event.preventDefault();
        if (!this.registerForm || !this.registerError) {
             console.error("[AuthHandler] Register form or error element missing in _handleRegister.");
            return;
        }
        this.registerError.textContent = '';
        const username = this.registerForm.username.value;
        const password = this.registerForm.password.value;
        const confirmPassword = this.registerForm.confirmPassword.value;

        // Client-side validation
        if (password !== confirmPassword) { this.registerError.textContent = 'Passwords do not match.'; return; }
        if (password.length < 4 || password.length > 10) { this.registerError.textContent = 'Password must be 4-10 chars.'; return; }
        if (!/^[a-zA-Z0-9]+$/.test(password)) { this.registerError.textContent = 'Password must be alphanumeric.'; return; }
        if (username.length < 3 || username.length > 20) { this.registerError.textContent = 'Username must be 3-20 chars.'; return; }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) { this.registerError.textContent = 'Username: alphanumeric or underscore.'; return; }

        try {
            const data = await apiCall('/api/auth/register', 'POST', { username, password });
            console.log('[AuthHandler] Registration successful:', data);
            this._updateAuthState(true, data.user); // Update internal and global state
            this._closeModal('register-modal');
            this._onLoginSuccess();
        } catch (error) {
            console.error('[AuthHandler] Registration failed:', error);
            this.registerError.textContent = error.message || 'Registration failed. Please try again.';
        }
    }

    async _handleLogout() {
        if (this.logoutButton) this.logoutButton.disabled = true;
        if (this.loginError) this.loginError.textContent = '';
        if (this.registerError) this.registerError.textContent = '';

        try {
            await apiCall('/api/auth/logout', 'POST');
            console.log('[AuthHandler] Logout successful');
            this._updateAuthState(false, null); // Update internal and global state
            this._onLogoutSuccess();
        } catch (error) {
            console.error('[AuthHandler] Logout failed:', error);
            alert('Logout failed. Please try again.');
            if (this.logoutButton) this.logoutButton.disabled = false;
        }
    }

    /** Updates the global auth state and relevant UI elements */
    _updateAuthState(loggedIn, user) {
        this._loggedIn = loggedIn; // Update internal state HERE

        // Update global state variables (keep for compatibility for now)
        window.isLoggedIn = loggedIn;
        window.currentUser = user;
        // Log internal state too for clarity during debugging
        console.log('[AuthHandler] State Updated:', { isLoggedIn: this._loggedIn, user: window.currentUser });

        // Update UI elements based on the new state
        if (this.logoutButton) {
            this.logoutButton.style.display = this._loggedIn ? 'inline-block' : 'none';
            this.logoutButton.disabled = !this._loggedIn; // Re-enable button if logged in, disable if not
        }

        if (this.playerNameDisplay) {
            const nameToShow = this._loggedIn ? (window.currentUser?.username || 'Logged In') : 'Not Logged In';
            this.playerNameDisplay.textContent = nameToShow;
            this.playerNameDisplay.title = this._loggedIn ? `Account: ${window.currentUser?.username}` : 'Not Logged In';
        }

        // Reset header icon color on auth state change
        if (this.iconDisplay) {
            this.iconDisplay.style.backgroundColor = this._loggedIn ? '#888' : '#555';
        }

        // Show/Hide the main game container
        if (this.mainContainer) {
            this.mainContainer.style.display = this._loggedIn ? 'flex' : 'none';
            console.log(`[AuthHandler] Main container display set to: ${this.mainContainer.style.display}`);
        } else {
             console.error("[AuthHandler] Main container element (.container) not found during state update!");
        }
    }

    /** Actions to perform after successful login/registration */
    _onLoginSuccess() {
        console.log("[AuthHandler] _onLoginSuccess Actions Triggered");

        // Minimal delay to allow browser cookie processing to START
        setTimeout(() => {
            console.log("[AuthHandler] Minimal delay complete, proceeding with post-login UI setup...");

            // Show Loadout Builder - It will now handle its own auth check before fetching data
            console.log("[AuthHandler] Attempting to show Loadout Builder (will self-verify auth)...");
            if (typeof window.loadoutBuilderInstance !== 'undefined' && window.loadoutBuilderInstance?.show) {
                window.loadoutBuilderInstance.show(); // Call show, it does the rest
            } else {
                console.error("[AuthHandler] LoadoutBuilder instance (window.loadoutBuilderInstance) not available!");
                alert("Critical Error: Failed to load Robot Builder UI.");
                 if(this.mainContainer) this.mainContainer.style.display = 'flex';
            }

            // Update header ICON via Controls (Can stay here, doesn't rely on session cookie immediately)
            if (typeof controls !== 'undefined' && controls?.updatePlayerHeaderDisplay) {
                controls.updatePlayerHeaderDisplay();
            } else {
                 console.warn("[AuthHandler] Controls object or updatePlayerHeaderDisplay method not available yet for icon update.");
            }

            // Connect WebSocket (Can stay here)
            if (typeof network !== 'undefined' && network.connect) {
                 if (!network.socket || !network.socket.connected) {
                    network.connect();
                 } else {
                    console.log("[AuthHandler] WebSocket already connected.");
                     if(typeof controls !== 'undefined') controls.setState('lobby');
                 }
            } else {
                 console.warn("[AuthHandler] Network object not available to connect.");
            }

        }, 100); // Reduced delay (e.g., 100ms)
    }


    /** Actions to perform after logout */
    _onLogoutSuccess() {
        console.log("[AuthHandler] _onLogoutSuccess Actions Triggered");

        // Disconnect WebSocket
        if (typeof network !== 'undefined' && network.socket?.connected) {
            console.log("[AuthHandler] Disconnecting WebSocket on logout...");
            network.socket.disconnect();
        }
        // Stop game engine if running
        if (typeof game !== 'undefined' && game.isRunning) {
            console.log("[AuthHandler] Stopping game engine on logout...");
            game.stop();
        }

        // Clear UI data
        if (typeof window.dashboard !== 'undefined' && window.dashboard?.updateStats) window.dashboard.updateStats([], {});
        if (typeof window.updateGameHistory === 'function') window.updateGameHistory([]);
        if (typeof window.clearEventLog === 'function') window.clearEventLog();
        if (typeof window.clearRobotLog === 'function') window.clearRobotLog();
        if (typeof window.clearOpponentLog === 'function') window.clearOpponentLog();
        if (typeof editor !== 'undefined' && editor?.setValue) editor.setValue('// Logged out. Please log in.');

        // Hide main container AND builder overlay
        if (this.mainContainer) this.mainContainer.style.display = 'none';
        if (typeof window.loadoutBuilderInstance !== 'undefined' && window.loadoutBuilderInstance?.hide) {
             window.loadoutBuilderInstance.hide();
        }

        // Reset Controls UI state (disables buttons, etc.)
        if (typeof controls !== 'undefined') {
             controls.setState('lobby'); // This will trigger updateUIForState with loggedIn=false
        }

        // Show the login modal
        this._showModal('login-modal');
    }

    // --- Public Initialization Method ---
    /**
     * Sets up event listeners and performs the initial authentication check.
     * Called by main.js after all other components are instantiated.
     */
    async initialize() {
        console.log("[AuthHandler] Initializing...");

        // 1. Setup Event Listeners for forms, buttons, modals
        if (this.loginForm) this.loginForm.addEventListener('submit', this._handleLogin.bind(this));
        if (this.registerForm) this.registerForm.addEventListener('submit', this._handleRegister.bind(this));
        if (this.logoutButton) this.logoutButton.addEventListener('click', this._handleLogout.bind(this));

        const loginCloseBtn = this.loginModal?.querySelector('.auth-close-btn');
        const registerCloseBtn = this.registerModal?.querySelector('.auth-close-btn');
        if(loginCloseBtn) loginCloseBtn.onclick = () => this._closeModal('login-modal');
        if(registerCloseBtn) registerCloseBtn.onclick = () => this._closeModal('register-modal');

        const registerLink = this.loginModal?.querySelector('.switch-modal-link a');
        const loginLink = this.registerModal?.querySelector('.switch-modal-link a');
        if (registerLink) registerLink.onclick = () => { this._showModal('register-modal'); this._closeModal('login-modal'); return false; };
        if (loginLink) loginLink.onclick = () => { this._showModal('login-modal'); this._closeModal('register-modal'); return false; };


        window.addEventListener('click', (event) => {
            const currentLoginModal = document.getElementById('login-modal');
            const currentRegisterModal = document.getElementById('register-modal');
            if (currentLoginModal && event.target == currentLoginModal) this._closeModal('login-modal');
            if (currentRegisterModal && event.target == currentRegisterModal) this._closeModal('register-modal');
        });
        console.log("[AuthHandler] Event listeners attached.");

        // 2. Check Initial Auth Status via API
        try {
            console.log("[AuthHandler] Checking initial auth status via /api/auth/me...");
            const data = await apiCall('/api/auth/me');
            this._updateAuthState(data.isLoggedIn, data.user); // Update state first

            if (this._loggedIn) { // Use internal state check
                console.log("[AuthHandler] User is already logged in. Triggering post-login actions.");
                this._onLoginSuccess();
            } else {
                console.log("[AuthHandler] User is not logged in. Showing login modal.");
                this._showModal('login-modal');
            }
        } catch (error) {
             console.error("[AuthHandler] Error checking initial auth status:", error);
             if (error.message.includes('Network error')) {
                 alert("Could not connect to the server to check login status. Please ensure the server is running and refresh the page.");
                 document.body.innerHTML = `<h2 style='color: orange; text-align: center; margin-top: 50px;'>Error connecting to server. Please try again later.</h2>`;
             } else {
                 alert(`An error occurred checking login status: ${error.message}`);
                 this._updateAuthState(false, null);
                 this._showModal('login-modal');
             }
        }
    } // End initialize()

} // End AuthHandler Class

// No instantiation or DOMContentLoaded listener here.
// main.js handles creating the instance and calling initialize().
console.log("AuthHandler class defined (auth.js). Global apiCall function available.");
```

## client/js/network.js

```code
// client/js/network.js

/**
 * Handles client-side network communication with the server using Socket.IO.
 * Connects to the server, sends player loadout data (visuals, name, code), readiness signals,
 * requests test games, sends self-destruct signals, receives game state updates,
 * handles spectating, processes lobby/chat events, handles robot destruction events,
 * receives game history updates, and handles robot log messages (for both player and opponent).
 */
class Network {
    /**
     * Creates a Network instance.
     * @param {Game} game - Reference to the main client-side game object.
     */
    constructor(game) {
        this.socket = null;
        this.playerId = null; // This will be set by the 'assignId' event
        this.game = game;
        this.isSpectating = false;
        this.spectatingGameId = null;
        this.spectatingGameName = null;
        if (!this.game) {
            console.error("Network handler initialized without a valid game reference!");
        }
    }

    /**
     * Establishes the WebSocket connection to the server and sets up event listeners.
     */
    connect() {
        try {
            // Prevent multiple connections if already connecting or connected
            if (this.socket && (this.socket.connecting || this.socket.connected)) {
                console.log("Network: Already connected or connecting. Ignoring connect() call.");
                return;
            }

            console.log("Network: Attempting to connect...");
            this.socket = io({
                 reconnectionAttempts: 5,
                 reconnectionDelay: 1000,
                 reconnectionDelayMax: 5000,
                 // Optional: Add transports if experiencing connection issues on some platforms
                 // transports: ['websocket', 'polling']
            });

            // --- Socket.IO Event Listeners ---

            this.socket.on('connect', () => {
                console.log('Successfully connected/reconnected to server with Socket ID:', this.socket.id);
                this.isSpectating = false;
                this.spectatingGameId = null;
                this.spectatingGameName = null;
                // Reset playerId on new connection until assigned
                this.playerId = null;
                if (typeof controls?.setState === 'function') controls.setState('lobby');
                if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Connected. Waiting for server info...');
                if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage("--> Connected to server.", "event");
                if (typeof window.clearRobotLog === 'function') window.clearRobotLog();
                if (typeof window.clearOpponentLog === 'function') window.clearOpponentLog();
            });

            this.socket.on('disconnect', (reason) => {
                console.warn('Disconnected from server:', reason);
                if (this.game) this.game.stop();
                this.isSpectating = false;
                this.spectatingGameId = null;
                this.spectatingGameName = null;
                this.playerId = null; // Clear player ID on disconnect
                if (typeof controls?.setState === 'function') controls.setState('lobby');
                if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus(`Disconnected: ${reason}. Reconnecting...`);
                if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`Disconnected: ${reason}. Attempting to reconnect...`, "error");
            });

            this.socket.on('assignId', (id) => {
                console.log('Server assigned Player ID:', id);
                this.playerId = id; // Set the player ID for this client session
                if (this.game?.setPlayerId) this.game.setPlayerId(id);
                // Update status only if we are in lobby state after getting ID
                if (!this.isSpectating && controls?.uiState === 'lobby' && typeof window.updateLobbyStatus === 'function') {
                    window.updateLobbyStatus('Enter name & code, then Ready Up or Test Code!');
                }
            });

            // --- START: Robot Log Handler ---
            this.socket.on('robotLog', (data) => {
                 // Validate incoming data
                 if (data && typeof data.message === 'string' && typeof data.robotId === 'string') {
                     // Check if this client has been assigned an ID yet
                     if (!this.playerId) {
                         console.warn("Received robotLog before playerId was assigned. Log may be misdirected.");
                         // Optionally, buffer logs until playerId is known, or just log to general event log?
                         // For now, maybe log to player console as a fallback if it's the only one available
                         if (typeof window.addRobotLogMessage === 'function') {
                            window.addRobotLogMessage(`(Early Log from ${data.robotId.substring(0,4)}...): ${data.message}`);
                         }
                         return;
                     }

                     // Route the log based on comparison with the client's own ID
                     if (data.robotId === this.playerId) {
                         // It's a message from the player's own robot
                         if (typeof window.addRobotLogMessage === 'function') {
                            window.addRobotLogMessage(data.message);
                         } else {
                            console.warn("addRobotLogMessage function not found!");
                         }
                     } else {
                         // It's a message from the opponent's robot
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
            // --- END: Robot Log Handler ---


            // ... other event handlers remain the same ...

            this.socket.on('spectateStart', (data) => {
                console.log('Received spectateStart:', data);
                if (this.game?.handleSpectateStart) {
                    this.isSpectating = true;
                    this.spectatingGameId = data.gameId;
                    this.spectatingGameName = data.gameName || data.gameId;
                    this.game.handleSpectateStart(data);
                    if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`Started spectating game: ${this.spectatingGameName}`, 'event');
                    if (typeof window.clearRobotLog === 'function') window.clearRobotLog();
                    if (typeof window.clearOpponentLog === 'function') window.clearOpponentLog();
                } else { console.error("Game object or handleSpectateStart method not available!"); }
            });

            this.socket.on('spectateGameOver', (data) => {
                console.log('Received spectateGameOver:', data);
                if (this.isSpectating && this.spectatingGameId === data.gameId) {
                     if (this.game?.handleSpectateEnd) {
                         this.game.handleSpectateEnd(data);
                         if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`Spectated game '${this.spectatingGameName || data.gameId}' over! Winner: ${data.winnerName || 'None'}`, 'event');
                     } else { console.error("Game object or handleSpectateEnd method not available!"); }
                     this.isSpectating = false;
                     this.spectatingGameId = null;
                     this.spectatingGameName = null;
                 }
            });

            this.socket.on('gameStateUpdate', (gameState) => {
                if (this.game?.updateFromServer) {
                     const relevantGameId = this.isSpectating ? this.spectatingGameId : this.game.gameId;
                     // Ensure gameState and gameId exist before comparing
                     if (relevantGameId && gameState && relevantGameId === gameState.gameId) {
                        this.game.updateFromServer(gameState);
                     }
                }
            });

             this.socket.on('gameStart', (data) => {
                 if (this.isSpectating) { console.log("Received gameStart while spectating, ignoring."); return; }
                 // Ensure data is valid before proceeding
                 if (!data || !data.gameId) { console.warn("Received invalid gameStart data:", data); return; }
                 if (this.game?.handleGameStart) this.game.handleGameStart(data);
                 const statusPrefix = data.isTestGame ? 'Testing Code vs AI:' : 'Playing Game:';
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus(`${statusPrefix} ${data.gameName || data.gameId}`);
                 if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`Your game '${data.gameName || data.gameId}' is starting!`, 'event');
                 if (typeof window.clearRobotLog === 'function') window.clearRobotLog();
                 if (typeof window.clearOpponentLog === 'function') window.clearOpponentLog();
             });

             this.socket.on('gameOver', (data) => {
                 if (this.isSpectating) { console.log("Received gameOver while spectating, ignoring."); return; }
                 // Ensure data is valid and matches current game
                 if (!data || !data.gameId) { console.warn("Received invalid gameOver data:", data); return; }
                 if (this.game && this.game.gameId === data.gameId) {
                     if (typeof this.game.handleGameOver === 'function') this.game.handleGameOver(data);
                     const prompt = data.wasTestGame ? 'Test Complete. Ready Up or Test Again!' : 'Game Over. Ready Up for another match!';
                     if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus(prompt);
                     if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`Your game '${this.game.gameName || data.gameId}' finished! Winner: ${data.winnerName || 'None'}`, 'event');
                 } else { console.warn(`Received gameOver for game ${data.gameId}, but current game is ${this.game ? this.game.gameId : 'None'}. Ignoring.`); }
             });

            this.socket.on('robotDestroyed', (data) => {
                 if (!data || !data.robotId) { console.warn("Received invalid robotDestroyed data:", data); return; }
                if (this.game?.handleRobotDestroyed) this.game.handleRobotDestroyed(data);
                else console.warn("Received robotDestroyed event, but game object or handler missing.");
            });

            this.socket.on('codeError', (data) => {
                if (!data || !data.robotId || typeof data.message !== 'string') { console.warn("Received invalid codeError data:", data); return; }
                console.error(`Received Code Error for Robot ${data.robotId}:`, data.message);
                // Use playerId for comparison
                const robotIdentifier = (this.playerId && data.robotId === this.playerId) ? "Your Robot" : `Opponent (${data.robotId.substring(0,4)}...)`;
                if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`Code Error (${robotIdentifier}): ${data.message}`, 'error');
                const logMessage = `--- CODE ERROR ---\n${data.message}\n------------------`;
                // Use playerId for comparison
                if (this.playerId && data.robotId === this.playerId) {
                    if (typeof window.addRobotLogMessage === 'function') window.addRobotLogMessage(logMessage);
                } else {
                    if (typeof window.addOpponentLogMessage === 'function') window.addOpponentLogMessage(logMessage);
                }
                // Use playerId for comparison - Alert only if it's the player's own error
                if (this.playerId && data.robotId === this.playerId && !this.isSpectating) {
                     alert(`Your Robot Code Error:\n${data.message}\n\nYou might need to reset and fix your code.`);
                     if (typeof controls?.setState === 'function') controls.setState('lobby');
                     if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Code error detected. Please fix and Ready Up or Test again.');
                 }
            });

             this.socket.on('gameError', (data) => {
                 console.error("Received critical game error from server:", data);
                 alert(`A critical error occurred in the game: ${data.message || 'Unknown error.'}\nThe game may have ended.`);
                 if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`SERVER GAME ERROR: ${data.message || 'Unknown error.'}`, 'error');
                 if (!this.isSpectating && typeof controls?.setState === 'function') controls.setState('lobby');
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Game Error Occurred. Ready Up or Test again.');
                 if (this.game) this.game.stop();
             });

            this.socket.on('connect_error', (err) => {
                console.error("Connection Error:", err.message, err);
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus(`Connection Failed: ${err.message}`);
                 if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`Connection Error: ${err.message}. Retrying...`, 'error');
                 if (typeof controls?.setState === 'function') controls.setState('lobby');
            });

            this.socket.on('reconnect_failed', () => {
                 console.error('Reconnection failed after multiple attempts.');
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Connection Failed Permanently. Please refresh.');
                 if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage('Could not reconnect to the server. Please refresh the page.', 'error');
                 alert('Failed to reconnect to the server. Please refresh the page.');
             });

            this.socket.on('lobbyEvent', (data) => {
                if (data?.message && typeof window.addEventLogMessage === 'function') window.addEventLogMessage(data.message, data.type || 'event');
            });

            this.socket.on('lobbyStatusUpdate', (data) => {
                 const isIdle = typeof controls !== 'undefined' && (controls.uiState === 'lobby' || controls.uiState === 'waiting');
                if (isIdle && data && typeof window.updateLobbyStatus === 'function') {
                    let statusText = `Waiting: ${data.waiting !== undefined ? data.waiting : 'N/A'}`;
                    if (data.ready !== undefined) statusText += ` / Ready: ${data.ready}/2`;
                     window.updateLobbyStatus(statusText);
                }
            });

            this.socket.on('chatUpdate', (data) => {
                if (data?.sender && data.text && typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`${data.sender}: ${data.text}`, 'chat');
            });

            this.socket.on('gameHistoryUpdate', (historyData) => {
                if (typeof window.updateGameHistory === 'function') window.updateGameHistory(historyData);
                else console.warn("updateGameHistory function not found!");
            });


        } catch (error) {
             console.error("Error initializing Socket.IO connection:", error);
             if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Network Initialization Error');
             alert("Failed to initialize network connection. Check console for details.");
        }
    } // End connect()


    /**
     * Sends the player's complete loadout data (visuals, name, code) to the server.
     * Called by the Controls class when the 'Ready Up' button is clicked.
     * @param {object} loadoutData - The prepared loadout data object.
     *                               Expected: { name: string, visuals: object, code: string }
     */
    sendLoadoutData(loadoutData) { // Renamed and updated parameter
        const canSend = typeof controls !== 'undefined' && controls.uiState === 'lobby';
        if (!canSend) {
             console.warn("Network: Attempted to send player data while not in 'lobby' state. Ignoring.");
             if(typeof window.addEventLogMessage === 'function') window.addEventLogMessage("Cannot ready up now.", "error");
             return;
        }
        if (!this.socket || !this.socket.connected) {
             console.error("Socket not available or not connected. Cannot send player data.");
             alert("Not connected to server. Please check connection and try again.");
             return;
        }

        // Validate the structure minimally before sending
        if (!loadoutData || !loadoutData.name || !loadoutData.visuals || typeof loadoutData.code !== 'string') {
             console.error("Network: Invalid loadoutData structure provided to sendLoadoutData:", loadoutData);
             alert("Internal Error: Invalid loadout data prepared.");
             return;
        }

        console.log(`Sending player loadout data to server: Name='${loadoutData.name}', Visuals=... Code=...`);
        // Emit the 'submitPlayerData' event with the new structure
        this.socket.emit('submitPlayerData', loadoutData); // Send the whole object
    }

    /**
     * Sends a signal to the server indicating the player is no longer ready.
     * Called by the Controls class when the 'Unready' button is clicked.
     */
    sendUnreadySignal() {
         const canSend = typeof controls !== 'undefined' && controls.uiState === 'waiting';
         if (!canSend) {
             console.warn("Network: Attempted to send unready signal while not in 'waiting' state. Ignoring.");
             if(typeof window.addEventLogMessage === 'function') window.addEventLogMessage("Cannot unready now.", "error");
             return;
         }
        if (!this.socket || !this.socket.connected) {
            console.error("Socket not connected. Cannot send unready signal.");
            if(typeof window.addEventLogMessage === 'function') window.addEventLogMessage("Cannot unready: Not connected.", "error");
            return;
        }
        console.log("Sending 'playerUnready' signal to server.");
        this.socket.emit('playerUnready');
    }

    /**
     * Sends a chat message to the server.
     * @param {string} text - The chat message text.
     */
    sendChatMessage(text) {
        if (!this.socket || !this.socket.connected) {
            console.error("Socket not connected. Cannot send chat message.");
            if(typeof window.addEventLogMessage === 'function') window.addEventLogMessage("Cannot send chat: Not connected.", "error");
            return;
        }
        const trimmedText = text.trim();
        if (trimmedText) {
            this.socket.emit('chatMessage', { text: trimmedText });
        }
    }

    /**
     * Sends a request to the server to start a single-player test game using the provided loadout.
     * Called by the Controls class when the 'Test Code' button is clicked.
     * @param {object} loadoutData - The prepared loadout data object for testing.
     *                               Expected: { name: string, visuals: object, code: string }
     */
    requestTestGame(loadoutData) { // Updated parameter
        if (!this.socket || !this.socket.connected) {
             console.error("Socket not available or not connected. Cannot request test game.");
             alert("Not connected to server. Please check connection and try again.");
             return;
        }
         if (typeof controls === 'undefined' || controls.uiState !== 'lobby') {
             console.warn("Network: Attempted to request test game while not in lobby state. Ignored.");
             return;
         }

         // Validate the structure minimally before sending
        if (!loadoutData || !loadoutData.name || !loadoutData.visuals || typeof loadoutData.code !== 'string') {
             console.error("Network: Invalid loadoutData structure provided to requestTestGame:", loadoutData);
             alert("Internal Error: Invalid loadout data prepared for test game.");
             return;
        }

        console.log(`Sending test game request to server: Name='${loadoutData.name}', Visuals=..., Code=...`);
        // Emit the 'requestTestGame' event with the new structure
        this.socket.emit('requestTestGame', loadoutData); // Send the whole object
    }

    /**
     * Sends a signal to the server for the player's robot to self-destruct.
     */
    sendSelfDestructSignal() {
        if (!this.socket || !this.socket.connected) {
             console.error("Socket not available or not connected. Cannot send self-destruct signal.");
             alert("Not connected to server.");
             return;
        }
        console.log("Client sending selfDestruct event.");
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

    <!-- ============================================== -->
    <!-- === START: Authentication Modals Markup === -->
    <!-- ============================================== -->

    <!-- Login Modal -->
    <div id="login-modal" class="auth-modal" style="display: none;">
        <div class="auth-modal-content">
            <span class="auth-close-btn" onclick="closeModal('login-modal')">×</span>
            <h2>Login</h2>
            <form id="login-form">
                <div class="form-group">
                    <label for="login-username">Username:</label>
                    <input type="text" id="login-username" name="username" required minlength="3" maxlength="20" pattern="[a-zA-Z0-9_]+">
                </div>
                <div class="form-group">
                    <label for="login-password">Password:</label>
                    <input type="password" id="login-password" name="password" required minlength="4" maxlength="10" pattern="[a-zA-Z0-9]+">
                </div>
                <button type="submit">Login</button>
                <p id="login-error" class="error-message"></p>
                <p class="switch-modal-link">Don't have an account? <a href="#" onclick="showModal('register-modal'); closeModal('login-modal'); return false;">Register here</a></p>
            </form>
        </div>
    </div>

    <!-- Registration Modal -->
    <div id="register-modal" class="auth-modal" style="display: none;">
        <div class="auth-modal-content">
            <span class="auth-close-btn" onclick="closeModal('register-modal')">×</span>
            <h2>Register</h2>
            <form id="register-form">
                <div class="form-group">
                    <label for="register-username">Username:</label>
                    <input type="text" id="register-username" name="username" required minlength="3" maxlength="20" pattern="[a-zA-Z0-9_]+" title="3-20 characters, alphanumeric or underscore">
                </div>
                <div class="form-group">
                    <label for="register-password">Password:</label>
                    <input type="password" id="register-password" name="password" required minlength="4" maxlength="10" pattern="[a-zA-Z0-9]+" title="4-10 alphanumeric characters">
                </div>
                <div class="form-group">
                    <label for="register-confirm-password">Confirm Password:</label>
                    <input type="password" id="register-confirm-password" name="confirmPassword" required>
                </div>
                <button type="submit">Register</button>
                <p id="register-error" class="error-message"></p>
                 <p class="switch-modal-link">Already have an account? <a href="#" onclick="showModal('login-modal'); closeModal('register-modal'); return false;">Login here</a></p>
            </form>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- === END: Authentication Modals Markup === -->
    <!-- ============================================ -->


    <!-- ============================================== -->
    <!-- === START: Loadout Builder Overlay Markup === -->
    <!-- ============================================== -->
    <div id="loadout-builder-overlay" style="display: none;"> <!-- Start hidden -->
        <div id="loadout-builder-content">
            <h2>Robot Loadout Builder</h2>

            <div class="loadout-builder-main">
                <!-- Left Column: Options -->
                <div class="loadout-options">

                    <!-- Loadout Management Section -->
                    <div class="loadout-section">
                        <h3>Loadout Management</h3>
                        <!-- Robot Name Input -->
                        <div class="loadout-controls">
                            <label for="builder-robot-name">Robot Name:</label>
                            <input type="text" id="builder-robot-name" placeholder="Enter Robot Name..." maxlength="24" style="flex-grow: 1;">
                        </div>
                        <!-- Config Name Input -->
                        <div class="loadout-controls" style="margin-top: 10px;">
                            <label for="config-name-input">Config Name:</label>
                            <input type="text" id="config-name-input" placeholder="Save Config As..." maxlength="30" style="flex-grow: 1;">
                        </div>
                        <!-- Load Config Dropdown -->
                        <div class="loadout-controls" style="margin-top: 10px;">
                            <label for="builder-loadout-select">Load Config:</label>
                            <select id="builder-loadout-select" style="flex-grow: 1;">
                                <option value="" selected>Load Existing Config...</option>
                                <!-- Options populated by JS -->
                            </select>
                            <button id="builder-delete-loadout" disabled title="Delete selected configuration">✖</button>
                        </div>
                        <!-- Save Button & Status -->
                        <div class="loadout-controls" style="margin-top: 15px;">
                            <button id="builder-save-loadout">Save Current Configuration</button>
                             <span id="builder-loadout-status" style="font-size: 0.9rem; color: #aaa; margin-left: 10px;"></span>
                        </div>
                    </div>

                    <!-- Appearance Presets Section -->
                     <div class="loadout-section">
                         <h3>Appearance Presets</h3>
                         <div class="loadout-controls">
                             <label for="builder-preset-select">Load Preset:</label>
                             <select id="builder-preset-select" style="flex-grow: 1;">
                                 <option value="" selected>-- Select a Preset --</option>
                                 <option value="default">Default Bot</option>
                                 <option value="tank">Tank Bot</option>
                                 <option value="spike">Spike Bot</option>
                                 <option value="tri">Tri Bot</option>
                             </select>
                         </div>
                     </div>

                    <!-- Visual Customization Section -->
                    <div class="loadout-section">
                        <h3>Visual Customization</h3>
                        <div class="visual-controls">
                            <label for="turret-type-select">Turret:</label>
                            <select id="turret-type-select">
                                <option value="standard">Standard</option>
                                <option value="cannon">Cannon</option>
                                <option value="laser">Laser</option>
                            </select>
                            <input type="color" id="turret-color-input" value="#ff0000">

                            <label for="chassis-type-select">Chassis:</label>
                            <select id="chassis-type-select">
                                <option value="light">Light</option>
                                <option value="medium">Medium</option>
                                <option value="heavy">Heavy</option>
                            </select>
                            <input type="color" id="chassis-color-input" value="#cccccc">

                            <label for="mobility-type-select">Mobility:</label>
                            <select id="mobility-type-select">
                                <option value="wheels">Wheels</option>
                                <option value="treads">Treads</option>
                                <option value="hover">Hover</option>
                            </select>
                            <span><!-- Placeholder for color if needed --></span>
                        </div>
                    </div>

                    <!-- Code Selection Section -->
                    <div class="loadout-section">
                        <h3>Combat Code</h3>
                        <div class="code-controls">
                            <label for="builder-code-select">Use Code:</label>
                            <select id="builder-code-select">
                                <option value="" selected>Select Saved Code...</option>
                                <!-- Options populated by JS from Code Snippets -->
                            </select>
                        </div>
                    </div>

                </div><!-- End Left Column -->

                <!-- Right Column: Preview -->
                <div class="loadout-preview-area">
                    <h3>Preview</h3>
                    <canvas id="loadout-preview"></canvas>
                    <span>(Static Preview)</span>
                </div><!-- End Right Column -->

            </div><!-- End Main Grid -->

            <div class="loadout-builder-actions">
                <button id="btn-quick-start">Quick Start (Defaults)</button>
                <button id="btn-enter-lobby">Save & Enter Lobby</button>
            </div>
        </div><!-- End Content -->
    </div><!-- End Overlay -->
    <!-- ============================================ -->
    <!-- === END: Loadout Builder Overlay Markup === -->
    <!-- ============================================ -->


    <!-- Existing Main Application Container -->
    <!-- Initially hidden by auth.js until logged in -->
    <div class="container" style="display: none;">
        <header>
            <h1>
                <img src="/assets/images/RobotwarsLogo.png" alt="Robot Wars Logo" class="header-logo">
                Robot Wars
            </h1>

            <!-- Player Info Area -->
            <div class="player-info-area">
                <span id="player-name-display">Loading...</span> <!-- Displays ACCOUNT name -->
                <div id="player-icon-display" title="Your Robot Appearance"></div>
                <button id="btn-edit-loadout" title="Edit Loadout Configuration">Edit</button>
                <a href="https://bneidlinger.github.io/RobotWars/BotProgrammingGuide.html"
                   target="_blank"
                   rel="noopener noreferrer"
                   id="btn-bot-manual"
                   class="header-button"
                   title="Open Bot Programming Guide">
                    [Manual]
                </a>
                 <!-- Logout Button -->
                 <button id="btn-logout" style="display: none;">Logout</button>
            </div>

            <nav>
                <!-- Functional buttons -->
                <button id="btn-ready">Ready Up</button>
                <button id="btn-test-code">Test Code</button>
                <button id="btn-self-destruct" style="display: none;">Self-Destruct</button>
                <button id="btn-reset">Reset</button>
            </nav>

        </header>

        <!-- Main content grid structure -->
        <main class="main-content-grid">

            <!-- Column 1: Arena Area -->
            <section class="arena-column">
                 <div class="api-help">
                     <h4>API Reference</h4>
                     <ul>
                         <li><code>drive(direction, speed)</code> - Move</li>
                         <li><code>scan(angle, resolution)</code> - Scan</li>
                         <li><code>fire(direction, power)</code> - Fire</li>
                         <li><code>damage()</code> - Get Damage %</li>
                         <li><code>getX() / getY()</code> - Get Coords</li>
                         <li><code>getDirection()</code> - Get Heading</li>
                         <li><code>console.log(...)</code> - Log to console</li>
                     </ul>
                 </div>
                <canvas id="arena" width="900" height="900"></canvas>
                <div class="consoles-row">
                    <div id="robot-console-log" class="console-panel">
                        <h3>Your Robot Log</h3>
                        <div id="robot-log-messages" class="log-box">
                            <div>ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL</div>
                            <div>> R.O.S. V1.3 INITIALIZING...</div>
                        </div>
                    </div>
                    <div id="opponent-console-log" class="console-panel">
                        <h3>Opponent Log</h3>
                        <div id="opponent-log-messages" class="log-box">
                             <div>SCANNING FOR HOSTILE TRANSMISSIONS...</div>
                             <div>> STANDING BY</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Column 2: DevTools Area -->
            <section class="devtools-column">
                <div class="editor-section">
                     <h3>Robot Code Editor</h3>
                     <div class="code-editor-wrapper">
                        <textarea id="code-editor"></textarea>
                     </div>
                     <div class="editor-controls">
                         <button id="btn-save-code">Save Code Snippet</button>
                         <select id="loadout-select"> <!-- For loading snippets into editor -->
                             <option value="" selected>Load Code Snippet...</option>
                             <!-- Options populated by JS -->
                         </select>
                         <button id="btn-delete-loadout" disabled title="Delete selected snippet">✖</button>
                         <span id="loadout-status"></span>
                     </div>
                </div>
            </section>

            <!-- Column 3: Info & Lobby Area -->
            <section class="info-lobby-column">
                <div class="stats-panel">
                    <h3>Robot Stats</h3>
                    <div id="robot-stats">
                        <!-- Dashboard elements populated by JS -->
                    </div>
                </div>
                <div id="lobby-area">
                     <h3>Lobby</h3>
                     <div id="lobby-status" style="margin-bottom: 10px;">Connecting...</div>
                     <div id="event-log" class="log-box" style="height: 150px; margin-bottom: 10px;">Event Log Loading...</div>
                     <div id="chat-area" style="display: flex; gap: 5px;">
                         <input type="text" id="chat-input" placeholder="Enter chat message..." style="flex-grow: 1; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #2a2a2a; color: #e0e0e0; font-family: 'VT323', monospace; font-size: 14px;" maxlength="100">
                         <button id="send-chat" style="background-color: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: 'VT323', monospace; font-size: 15px;">Send</button>
                     </div>
                </div>
                 <div id="game-history-log">
                     <h4>Recent Game Results</h4>
                     <div id="game-history-list" class="log-box" style="height: 195px;">
                         <div>No games finished yet.</div>
                     </div>
                 </div>
            </section>

        </main> <!-- End Main Grid -->

    </div> <!-- End .container -->

    <!-- Scripts (Corrected Order) -->
    <script src="/socket.io/socket.io.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/javascript/javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/edit/matchbrackets.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/addon/edit/closebrackets.min.js"></script>
    <script src="js/engine/arena.js"></script>
    <script src="js/engine/game.js"></script>
    <script src="js/engine/audio.js"></script>
    <script src="js/utils/storage.js"></script> <!-- Still needed temporarily for snippets -->
    <script src="js/ui/editor.js"></script>
    <script src="js/ui/dashboard.js"></script>
    <script src="js/ui/loadoutBuilder.js"></script> <!-- Builder needs to define global instance -->
    <script src="js/ui/lobby.js"></script>
    <script src="js/ui/history.js"></script>
    <script src="js/network.js"></script>
    <!-- Load Controls BEFORE Auth -->
    <script src="js/ui/controls.js"></script> <!-- Defines global 'controls' -->
    <script src="js/auth.js"></script> <!-- Defines global 'currentUser', uses 'controls' -->
    <!-- Load Main LAST -->
    <script src="js/main.js"></script> <!-- Uses globals -->
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
 * Manages game state, robots (with visual loadouts), interpreter, collisions, // <-- Updated description
 * game loop, delayed game over logic, sound event collection & broadcasting,
 * and notifies GameManager upon completion.
 */
class GameInstance {
    /**
     * Creates a GameInstance.
     * @param {string} gameId - Unique ID for the game.
     * @param {SocketIO.Server} io - Socket.IO server instance.
     * @param {Array<object>} playersData - Array of player data objects.
     *        Expected structure: { socket, loadout: { name, visuals, code }, isReady }
     * @param {function} gameOverCallback - Callback function for GameManager.
     * @param {string} [gameName=''] - Display name for the game.
     * @param {boolean} [isTestGame=false] - Flag indicating if this is a test game.
     */
    constructor(gameId, io, playersData, gameOverCallback, gameName = '', isTestGame = false) {
        this.gameId = gameId;
        this.io = io;
        // Players map stores the full original data structure from GameManager
        // Key: robotId (socketId or dummyId), Value: { socket, loadout: { name, visuals, code }, robot: ServerRobot }
        this.players = new Map();
        this.robots = []; // Array of ServerRobot instances
        // this.playerNames = new Map(); // Potentially redundant if name is in players map
        this.interpreter = new ServerRobotInterpreter();
        this.collisionSystem = new ServerCollisionSystem(this);
        this.gameLoopInterval = null;
        this.lastTickTime = 0;
        this.explosionsToBroadcast = [];
        this.fireEventsToBroadcast = [];
        this.hitEventsToBroadcast = [];
        this.gameOverCallback = gameOverCallback;
        this.gameName = gameName || `Game ${gameId}`;
        this.spectatorRoom = `spectator-${this.gameId}`;
        this.gameEnded = false;
        this.isTestGame = isTestGame; // Store the flag passed from GameManager

        console.log(`[${this.gameId} - '${this.gameName}'] Initializing Game Instance (Test: ${this.isTestGame})...`);
        this._initializePlayers(playersData); // Pass the structured data
        // Interpreter initialization needs the code from the loadout
        this.interpreter.initialize(this.robots, this.players); // Pass players map which contains loadout.code
        console.log(`[${this.gameId}] Game Instance Initialization complete.`);
    }

    /**
     * Helper to initialize players and robots using the structured loadout data.
     * @param {Array<object>} playersData - Array of player data { socket, loadout, isReady }
     */
    _initializePlayers(playersData) {
        playersData.forEach((playerData, index) => {
            // Ensure loadout exists and has minimum required fields
            if (!playerData.loadout || !playerData.loadout.name || !playerData.loadout.visuals || typeof playerData.loadout.code !== 'string') {
                 console.error(`[${this.gameId}] Invalid or missing loadout data for participant at index ${index}. Skipping.`);
                 // Potentially abort game creation? For now, just skip this player.
                 return;
            }

            const { socket, loadout } = playerData;
            const { name, visuals, code } = loadout; // Destructure loadout

            const startX = index % 2 === 0 ? 150 : ARENA_WIDTH - 150;
            const startY = 100 + Math.floor(index / 2) * (ARENA_HEIGHT - 200);
            const startDir = index % 2 === 0 ? 0 : 180;
            const robotId = socket ? socket.id : `dummy-bot-${this.gameId}`; // Use socket ID or generate dummy ID

            // --- Create ServerRobot instance, passing visuals and name ---
            const robot = new ServerRobot(
                robotId,
                startX, startY, startDir,
                visuals, // Pass the visuals object
                name     // Pass the name
            );
            // robot.name = name; // Name is now set in constructor

            this.robots.push(robot);

            // --- Store the full playerData (including loadout) and the robot instance ---
            this.players.set(robotId, {
                socket: socket,
                loadout: loadout, // Store the original loadout data
                robot: robot      // Store the created robot instance
            });
            // this.playerNames.set(robot.id, name); // Can likely remove this map

            console.log(`[${this.gameId}] Added participant ${name} (${robot.id}), Socket: ${socket ? 'Yes' : 'No'}`);
            if (socket) {
                socket.join(this.gameId);
            }
        });
    }

    // --- startGameLoop, stopGameLoop (No changes needed) ---
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
        if (this.gameLoopInterval) { clearInterval(this.gameLoopInterval); this.gameLoopInterval = null; }
    }

    // --- tick (No changes needed in the core tick logic) ---
    tick(deltaTime) {
        try {
            if (this.gameEnded) return;

            this.explosionsToBroadcast = [];
            this.fireEventsToBroadcast = [];
            this.hitEventsToBroadcast = [];

            // 1. Execute Robot AI Code
            const executionResults = this.interpreter.executeTick(this.robots, this);
            // No change needed here, interpreter uses the players map which has code

            // 2. Update Robot Physics/Movement
            this.robots.forEach(robot => robot.update(deltaTime, ARENA_WIDTH, ARENA_HEIGHT));

            // 3. Check Collisions
            this.collisionSystem.checkAllCollisions();

            // 4. Emit 'robotDestroyed' event
            this.robots.forEach(robot => {
                if (robot.state === 'destroyed' && !robot.destructionNotified) {
                    const destructionData = { robotId: robot.id, x: robot.x, y: robot.y, cause: robot.lastDamageCause || 'unknown' };
                    this.io.to(this.gameId).to(this.spectatorRoom).emit('robotDestroyed', destructionData);
                    robot.destructionNotified = true;
                }
            });

            // 5. Check for Game Over
            if (this.checkGameOver()) { return; }

            // 6. Broadcast State
            const gameState = this.getGameState(); // Updated to include visuals
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

    // --- addFireEvent, addHitEvent (No changes needed) ---
    addFireEvent(eventData) { if (eventData?.type === 'fire') this.fireEventsToBroadcast.push(eventData); }
    addHitEvent(x, y, targetId) { this.hitEventsToBroadcast.push({ type: 'hit', x, y, targetId }); }

    // --- checkGameOver (No changes needed, uses players map correctly) ---
    checkGameOver() {
        if (this.gameEnded || !this.gameLoopInterval) return true;
        let potentialLoser = null;
        let destructionPending = false;
        const now = Date.now();
        for (const robot of this.robots) {
            if (robot.state === 'destroyed') {
                if (now >= (robot.destructionTime + DESTRUCTION_VISUAL_DELAY_MS)) { potentialLoser = robot; break; }
                else { destructionPending = true; }
            }
        }
        if (destructionPending && !potentialLoser) return false; // Wait

        const activeRobots = this.robots.filter(r => r.state === 'active');
        let isGameOver = false;
        let winner = null;
        let loser = null;
        let reason = 'elimination';

        if (potentialLoser) {
             isGameOver = true;
             loser = this.players.get(potentialLoser.id); // Get full player data
             winner = Array.from(this.players.values()).find(p => p.robot && p.robot.id !== potentialLoser.id);
             reason = `${loser?.loadout?.name || 'A robot'} was destroyed!`; // Use loadout name
        } else if (!destructionPending && activeRobots.length <= 1 && this.robots.length >= 2) {
             isGameOver = true;
             if (activeRobots.length === 1) {
                 winner = this.players.get(activeRobots[0].id);
                 loser = Array.from(this.players.values()).find(p => p.robot && p.robot.id !== activeRobots[0].id);
                 reason = "Last robot standing!";
             } else { reason = "Mutual Destruction!"; }
        }

        if (isGameOver) {
            this.gameEnded = true;
            this.stopGameLoop();

            // Adjust for Test Games (Use loadout name)
            if (this.isTestGame) {
                const realPlayerEntry = Array.from(this.players.values()).find(p => p.socket !== null);
                const botEntry = Array.from(this.players.values()).find(p => p.socket === null);
                if(realPlayerEntry && botEntry){
                    const realPlayer = realPlayerEntry; const botPlayer = botEntry;
                    if (potentialLoser?.id === realPlayer.robot.id || (activeRobots.length===1 && activeRobots[0].id === botPlayer.robot.id)) { winner = botPlayer; loser = realPlayer; }
                    else if (potentialLoser?.id === botPlayer.robot.id || (activeRobots.length===1 && activeRobots[0].id === realPlayer.robot.id)) { winner = realPlayer; loser = botPlayer; }
                    else { winner = null; loser = null; }
                    // Update reason based on winner/loser using loadout names
                    if (winner && loser) reason = `${winner.loadout.name} defeated ${loser.loadout.name}!`;
                    else if (winner) reason = `${winner.loadout.name} is the last one standing!`;
                    else reason = "Mutual Destruction in test game!";
                } else { reason = "Test game ended unexpectedly"; winner=null; loser=null; }
            }

            const finalWinnerData = {
                gameId: this.gameId,
                winnerId: winner ? winner.robot.id : null,
                winnerName: winner ? winner.loadout.name : 'None', // Use name from loadout
                reason: reason,
                wasTestGame: this.isTestGame
            };

            console.log(`[${this.gameId}] Final Game Over. Winner: ${finalWinnerData.winnerName}.`);
            this.io.to(this.gameId).emit('gameOver', finalWinnerData);
            this.io.to(this.spectatorRoom).emit('spectateGameOver', finalWinnerData);
            if (typeof this.gameOverCallback === 'function') this.gameOverCallback(this.gameId, finalWinnerData);
            return true;
        }
        return false;
    }

    // --- createExplosion (No changes needed) ---
    createExplosion(x, y, size) { this.explosionsToBroadcast.push({ id: `e-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`, x, y, size }); }

    /** Gathers the current game state including robot visuals */
    getGameState() {
        const activeMissiles = [];
        this.robots.forEach(robot => activeMissiles.push(...robot.missiles));

        return {
            gameId: this.gameId,
            gameName: this.gameName,
            robots: this.robots.map(r => ({
                id: r.id,
                x: r.x, y: r.y,
                direction: r.direction,
                damage: r.damage,
                // color: r.color, // Color might now come from visuals? Keep base for now.
                isAlive: r.isAlive,
                name: r.name,
                visuals: r.visuals, // <<< ADDED visuals object
                // appearance: r.appearance, // <<< REMOVED old appearance string
            })),
            missiles: activeMissiles.map(m => ({
                id: m.id, x: m.x, y: m.y, radius: m.radius, ownerId: m.ownerId
            })),
            explosions: this.explosionsToBroadcast,
            fireEvents: this.fireEventsToBroadcast,
            hitEvents: this.hitEventsToBroadcast,
            timestamp: Date.now()
        };
    }

    // --- performScan (No changes needed) ---
    performScan(scanningRobot, direction, resolution) {
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
                closestTargetInfo = { distance: Math.sqrt(distanceSq), direction: angleToTargetDeg, id: targetRobot.id, name: targetRobot.name };
            }
        });
        return closestTargetInfo;
    }

    // --- triggerSelfDestruct (No changes needed) ---
    triggerSelfDestruct(robotId) {
         const playerData = this.players.get(robotId);
         if (playerData?.robot?.state === 'active') {
             const robot = playerData.robot;
             console.log(`[${this.gameId}] Triggering self-destruct for ${robot.name} (${robot.id}).`);
             const result = robot.takeDamage(1000, 'selfDestruct');
             this.createExplosion(robot.x, robot.y, 5);
             console.log(`[${this.gameId}] Self-destruct applied. Destroyed: ${result.destroyed}`);
         } else { console.warn(`[${this.gameId}] Self-destruct failed for ${robotId}: Not found or not active.`); }
    }

    // --- removePlayer (No changes needed) ---
    removePlayer(robotId) {
        const playerData = this.players.get(robotId);
        const playerName = playerData?.loadout?.name || robotId.substring(0,8)+'...'; // Use name from loadout
        console.log(`[${this.gameId}] Handling removal of participant ${playerName} (${robotId}).`);
        if (playerData?.robot) {
             playerData.robot.state = 'destroyed';
             if (!playerData.robot.destructionTime) playerData.robot.destructionTime = Date.now();
             playerData.robot.damage = 100;
             playerData.robot.speed = 0; playerData.robot.targetSpeed = 0;
             console.log(`[${this.gameId}] Marked robot for ${playerName} as destroyed.`);
        }
        this.players.delete(robotId);
        // this.playerNames.delete(robotId); // No longer needed?
    }

    // --- isEmpty (No changes needed) ---
    isEmpty() { return Array.from(this.players.values()).every(p => p.socket === null); }

    // --- cleanup (No changes needed) ---
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
const GameInstance = require('./game-instance');
const fs = require('fs');
const path = require('path');

/**
 * Manages the overall flow of players joining, waiting, and starting games.
 * Handles storing player data (including loadout visuals, name, code, readiness), // <-- Updated description
 * matchmaking, game naming, tracking active/finished games, cleaning up old instances,
 * starting single-player test games, handling self-destruct requests,
 * transitioning lobby players to spectators, moving participants back to lobby,
 * broadcasting game history, and broadcasting lobby events and status updates.
 */
class GameManager {
    constructor(io) {
        this.io = io;
        // Stores players waiting to join a game.
        // Key: socket.id
        // Value: { socket: SocketIO.Socket, loadout: { visuals: object, code: string, name: string }, isReady: boolean } // <-- Updated value structure
        this.pendingPlayers = new Map();
        this.activeGames = new Map();
        this.playerGameMap = new Map();
        this.gameIdCounter = 0;
        this.recentlyCompletedGames = new Map();
        this.maxCompletedGames = 10;
        try {
             this.dummyBotCode = fs.readFileSync(path.join(__dirname, 'dummy-bot-ai.js'), 'utf8');
             console.log("[GameManager] Dummy bot AI loaded successfully.");
        } catch (err) {
             console.error("[GameManager] FAILED TO LOAD dummy-bot-ai.js:", err);
             this.dummyBotCode = "// Dummy Bot AI Load Failed\nconsole.log('AI Load Error!'); robot.drive(0,0);";
        }
        console.log("[GameManager] Initialized.");
    }

    /** Adds player to pending list with default/empty loadout */
    addPlayer(socket) {
        if (this.pendingPlayers.has(socket.id)) return;
        const initialName = `Player_${socket.id.substring(0, 4)}`;
        console.log(`[GameManager] Adding player ${socket.id} (${initialName}) back to pending list.`);
        this.pendingPlayers.set(socket.id, {
            socket: socket,
            // Initialize with an empty/default loadout structure
            loadout: {
                name: initialName, // Client should provide real name on ready
                visuals: null,     // Will be set on ready
                code: null         // Will be set on ready
            },
            isReady: false
        });
        // Broadcast status after adding
        this.broadcastLobbyStatus();
    }

    /** Generates unique game name */
    generateGameName() {
        const baseId = 137 + this.gameIdCounter;
        return `Sector Z-${baseId}`;
    }

    /** Retrieves player name (checks pending and active) */
    getPlayerName(socketId) {
        const pendingData = this.pendingPlayers.get(socketId);
        // Access name within the nested loadout object
        if (pendingData?.loadout?.name) return pendingData.loadout.name;

        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            const activePlayerData = game?.players?.get(socketId);
             // Access name within the nested loadout object stored in GameInstance
            if (activePlayerData?.loadout?.name) return activePlayerData.loadout.name;
            // Fallback check on gameInstance.playerNames (if still used)
            if (game?.playerNames?.get(socketId)) return game.playerNames.get(socketId);
        }
        return null;
    }

    /**
     * Handles receiving loadout data from a player upon "Ready Up".
     * Updates the player's status and loadout, then attempts matchmaking.
     * Called by socket-handler when 'submitPlayerData' is received.
     * @param {string} socketId - The ID of the player submitting data.
     * @param {object} loadoutData - The complete loadout object { name, visuals, code }.
     */
    handlePlayerCode(socketId, loadoutData) { // Renamed param for clarity
        const playerData = this.pendingPlayers.get(socketId);
        if (!playerData) {
            console.log(`[GameManager] Received data from non-pending player: ${socketId}. Ignoring.`);
            return;
        }

        // --- Update player data with the received loadout ---
        // Replace the entire loadout object, ensuring validation happened in socket-handler
        playerData.loadout = loadoutData;
        playerData.isReady = true; // Mark player as ready

        console.log(`[GameManager] Player ${playerData.loadout.name} (${socketId}) submitted loadout and is Ready.`);
        this.io.emit('lobbyEvent', { message: `Player ${playerData.loadout.name} is ready!` });
        this._tryStartMatch();
        this.broadcastLobbyStatus();
    }

    /** Sets player ready status */
    setPlayerReadyStatus(socketId, isReady) {
        const playerData = this.pendingPlayers.get(socketId);
        if (playerData && playerData.isReady !== isReady) {
            playerData.isReady = isReady;
            const playerName = playerData.loadout?.name || socketId.substring(0,4)+'...'; // Use loadout name if available
            console.log(`[GameManager] Player ${playerName} (${socketId}) status set to ${isReady ? 'Ready' : 'Not Ready'}.`);
            this.io.emit('lobbyEvent', { message: `Player ${playerName} is ${isReady ? 'now ready' : 'no longer ready'}.` });
            if (isReady) this._tryStartMatch();
            this.broadcastLobbyStatus();
        }
    }

    /** Internal method to try starting a match */
    _tryStartMatch() {
        const readyPlayers = Array.from(this.pendingPlayers.values()).filter(p => p.isReady);
        const requiredPlayers = 2;
        if (readyPlayers.length >= requiredPlayers) {
            console.log(`[GameManager] ${readyPlayers.length}/${requiredPlayers} players ready. Starting new game...`);
            const playersForGame = readyPlayers.slice(0, requiredPlayers);
            playersForGame.forEach(p => this.pendingPlayers.delete(p.socket.id));
            this.createGame(playersForGame); // createGame now expects the new playerData structure
        }
    }

    /**
     * Creates a new GameInstance using the provided player data (including loadouts).
     * @param {Array<{socket: SocketIO.Socket, loadout: object, isReady: boolean}>} playersData - Array of player data objects for the new game.
     */
    createGame(playersData) {
        const gameId = `game-${this.gameIdCounter++}`;
        const gameName = this.generateGameName();
        // Use loadout name for player info string
        const playerInfo = playersData.map(p => `${p.loadout.name}(${p.socket.id.substring(0,4)})`).join(', ');
        console.log(`[GameManager] Creating game ${gameId} ('${gameName}') for players: ${playerInfo}`);
        const playerNames = playersData.map(p => p.loadout.name).join(' vs ');
        this.io.emit('lobbyEvent', { message: `Game '${gameName}' starting: ${playerNames}!` });

        let gameInstance;
        try {
            // --- Pass the whole playerData array (containing loadouts) to GameInstance ---
            gameInstance = new GameInstance(
                gameId, this.io, playersData, // Pass the full player data array
                (endedGameId, winnerData) => { this.handleGameOverEvent(endedGameId, winnerData); },
                gameName
            );
            this.activeGames.set(gameId, gameInstance);

            // Map participants and notify them (include loadout info?)
            playersData.forEach(player => {
                this.playerGameMap.set(player.socket.id, gameId);
                 if (player.socket.connected) {
                     player.socket.emit('gameStart', {
                         gameId: gameId, gameName: gameName,
                         // Send relevant player info, maybe including visuals for initial display?
                         players: playersData.map(p => ({
                            id: p.socket.id,
                            name: p.loadout.name,
                            visuals: p.loadout.visuals // Send initial visuals
                         }))
                     });
                     console.log(`[GameManager] Notified player ${player.loadout.name} game ${gameId} starting.`);
                 } else { console.warn(`[GameManager] Player ${player.loadout.name} disconnected before gameStart emit.`); }
            });

            // Transition remaining lobby players to spectators (No change needed here)
            const spectatorRoom = `spectator-${gameId}`;
            const remainingPendingPlayers = Array.from(this.pendingPlayers.values());
            if (remainingPendingPlayers.length > 0) {
                console.log(`[GameManager] Moving ${remainingPendingPlayers.length} remaining pending players to spectate game ${gameId}.`);
                remainingPendingPlayers.forEach(pendingPlayer => {
                    const spectatorSocket = pendingPlayer.socket;
                    const spectatorId = spectatorSocket.id;
                    const spectatorName = pendingPlayer.loadout?.name || spectatorId.substring(0,4)+'...'; // Use name
                    if (this.pendingPlayers.has(spectatorId)) {
                        if (spectatorSocket.connected) {
                             spectatorSocket.join(spectatorRoom);
                             spectatorSocket.emit('spectateStart', { gameId: gameId, gameName: gameName });
                             this.pendingPlayers.delete(spectatorId);
                             console.log(`[GameManager] Moved pending player ${spectatorName} (${spectatorId}) to spectate.`);
                        } else {
                             console.log(`[GameManager] Pending player ${spectatorName} (${spectatorId}) disconnected before spectate move. Removing.`);
                             this.pendingPlayers.delete(spectatorId);
                        }
                    }
                });
            }

            gameInstance.startGameLoop();
            this.broadcastLobbyStatus();

        } catch (error) {
            console.error(`[GameManager] Error creating game ${gameId} ('${gameName}'):`, error);
            this.io.emit('lobbyEvent', { message: `Failed to start game '${gameName}' for ${playerInfo}. Please try again.`, type: 'error' });
            // Put players back in pending if creation failed
            playersData.forEach(player => {
                 if (player.socket) {
                     player.isReady = false;
                     // Add back with the loadout data they submitted? Or reset? Reset is safer.
                     this.addPlayer(player.socket); // addPlayer resets loadout/ready state
                     if(player.socket.connected) {
                        player.socket.emit('gameError', { message: `Failed to create game instance '${gameName}'. Please Ready Up again.` });
                     }
                 }
            });
            if (this.activeGames.has(gameId)) { this.activeGames.delete(gameId); }
            playersData.forEach(player => { if (player.socket) this.playerGameMap.delete(player.socket.id); });
            this.broadcastLobbyStatus();
        }
    } // End createGame

    /**
     * Starts a single-player test game using the player's submitted loadout.
     * Called by socket-handler when 'requestTestGame' is received.
     * @param {SocketIO.Socket} playerSocket - The socket of the player requesting the test.
     * @param {object} playerLoadout - The complete loadout object { name, visuals, code }.
     */
    startTestGameForPlayer(playerSocket, playerLoadout) { // Updated parameter
        const playerId = playerSocket.id;
        console.log(`[GameManager] Starting test game for player ${playerLoadout.name} (${playerId})`);

        if (!this.pendingPlayers.delete(playerId)) {
             console.warn(`[GameManager] Player ${playerLoadout.name} (${playerId}) requested test game but wasn't pending. Aborting.`);
             playerSocket.emit('lobbyEvent', { message: "Cannot start test game - state conflict.", type: "error" });
             return;
        }

        const gameId = `test-${this.gameIdCounter++}`;
        const gameName = `Test Arena ${gameId.split('-')[1]}`;

        // 1. Prepare Player Data for GameInstance (using the provided loadout)
        const playerGameData = {
            socket: playerSocket,
            loadout: playerLoadout, // Pass the whole submitted loadout
            isReady: true
        };

        // 2. Prepare Dummy Bot Data
        const dummyBotId = `dummy-bot-${gameId}`;
        const dummyBotGameData = {
            socket: null,
            // Define the dummy bot's loadout structure
            loadout: {
                name: "Test Bot Alpha",
                visuals: { // Define default visuals for the bot
                     turret: { type: 'standard', color: '#888888' },
                     chassis: { type: 'medium', color: '#555555' },
                     mobility: { type: 'treads' }
                },
                code: this.dummyBotCode
            },
            isReady: true
        };

        // 3. Create the GameInstance
        console.log(`[GameManager] Creating test game ${gameId} ('${gameName}')`);
        this.io.emit('lobbyEvent', { message: `Test game '${gameName}' starting for ${playerLoadout.name}!` });
        try {
             const gameInstance = new GameInstance(
                 gameId, this.io,
                 [playerGameData, dummyBotGameData], // Pass data for both participants
                 (endedGameId, winnerData) => {
                      winnerData.wasTestGame = true; // Ensure flag is set
                      this.handleGameOverEvent(endedGameId, winnerData);
                 },
                 gameName,
                 true // Explicitly set isTestGame flag for GameInstance constructor
             );

            this.activeGames.set(gameId, gameInstance);
            this.playerGameMap.set(playerId, gameId);

            // Send 'gameStart' only to the player
            playerSocket.emit('gameStart', {
                gameId: gameId, gameName: gameName, isTestGame: true,
                players: [ // Send info including visuals
                     { id: playerId, name: playerLoadout.name, visuals: playerLoadout.visuals },
                     { id: dummyBotId, name: dummyBotGameData.loadout.name, visuals: dummyBotGameData.loadout.visuals }
                ]
            });

            gameInstance.startGameLoop();
            this.broadcastLobbyStatus();

        } catch (error) {
             console.error(`[GameManager] Error creating test game ${gameId} ('${gameName}'):`, error);
             this.io.emit('lobbyEvent', { message: `Failed to start test game '${gameName}' for ${playerLoadout.name}. Please try again.`, type: 'error' });
             // Put player back in pending (using addPlayer resets their state)
             this.addPlayer(playerSocket);
             if(playerSocket.connected) {
                playerSocket.emit('gameError', { message: `Failed to create test game instance '${gameName}'. Please Ready Up or Test again.` });
             }
             if (this.activeGames.has(gameId)) { this.activeGames.delete(gameId); }
             this.playerGameMap.delete(playerId);
             this.broadcastLobbyStatus();
        }
    } // End startTestGameForPlayer


    /** Handles game over: moves players/spectators, cleans up, logs history */
    async handleGameOverEvent(gameId, winnerData) {
        const gameInstance = this.activeGames.get(gameId);
        const gameName = gameInstance ? gameInstance.gameName : `Game ${gameId}`;
        const isTestGame = winnerData.wasTestGame || false;
        const winnerName = winnerData.winnerName || 'No one';
        const reason = winnerData.reason || 'Match ended.';
        console.log(`[GameManager] Received game over event for ${gameId} ('${gameName}'). Winner: ${winnerName}. TestGame: ${isTestGame}`);

        const lobbyMsg = isTestGame ? `Test game '${gameName}' over! Winner: ${winnerName}. (${reason})` : `Game '${gameName}' over! Winner: ${winnerName}. (${reason})`;
        this.io.emit('lobbyEvent', { message: lobbyMsg });

        if (!gameInstance) {
            console.warn(`[GameManager] handleGameOverEvent called for ${gameId}, but instance not found. Skipping cleanup.`);
            this.broadcastLobbyStatus();
            return;
        }

        // Move Spectators Back
        const spectatorRoom = `spectator-${gameId}`;
        try {
            const spectatorSockets = await this.io.in(spectatorRoom).fetchSockets();
            console.log(`[GameManager] Found ${spectatorSockets.length} spectators for game ${gameId}. Moving to lobby.`);
            spectatorSockets.forEach(s => {
                if (s.connected) { s.leave(spectatorRoom); this.addPlayer(s); }
            });
        } catch (err) { console.error(`[GameManager] Error fetching/moving spectators for ${gameId}:`, err); }

        // Clean up Player Mappings & Move REAL Participants to Lobby
        const playerIds = Array.from(gameInstance.players.keys());
        console.log(`[GameManager] Cleaning up mappings/moving participants for game ${gameId}:`, playerIds);
        playerIds.forEach(playerId => {
            this.playerGameMap.delete(playerId);
            const playerData = gameInstance.players.get(playerId);
            const playerSocket = playerData ? playerData.socket : null;
            // Add back only if they have a socket and are connected (skips dummy bot)
            if (playerSocket && playerSocket.connected) {
                 console.log(`[GameManager] Adding participant ${playerId} back to pendingPlayers.`);
                 this.addPlayer(playerSocket); // addPlayer resets their state
            } else {
                 console.log(`[GameManager] Participant ${playerId} (socket: ${playerSocket ? 'exists' : 'no'}, connected: ${playerSocket?.connected}) not added back to lobby.`);
            }
        });

        // Log completed game (if not test game)
        if (!isTestGame && gameInstance?.players) {
            const completedGameData = {
                name: gameName, winnerName: winnerName,
                // Get player names from the loadout object within the gameInstance.players map
                players: Array.from(gameInstance.players.values()).map(p => ({ id: p.robot.id, name: p.loadout.name })),
                endTime: Date.now()
            };
            this.recentlyCompletedGames.set(gameId, completedGameData);
            while (this.recentlyCompletedGames.size > this.maxCompletedGames) {
                const oldestGameId = this.recentlyCompletedGames.keys().next().value;
                this.recentlyCompletedGames.delete(oldestGameId);
            }
            console.log(`[GameManager] Logged completed game: ${gameId} ('${gameName}')`);
            this.broadcastGameHistory(); // Broadcast if non-test game ended
        } else if (isTestGame) {
             console.log(`[GameManager] Test game ${gameId} ('${gameName}') ended. Not adding to public history.`);
        }

        // Clean up Game Instance
        try { if (gameInstance) gameInstance.cleanup(); }
        catch(err) { console.error(`[GameManager] Error during gameInstance.cleanup() for ${gameId}:`, err); }
        this.activeGames.delete(gameId);
        console.log(`[GameManager] Game instance ${gameId} ('${gameName}') fully removed.`);

        this.broadcastLobbyStatus(); // Broadcast after cleanup
    }

     /** Broadcasts game history */
     broadcastGameHistory() {
         const historyArray = Array.from(this.recentlyCompletedGames.values())
                                 .sort((a, b) => b.endTime - a.endTime);
         this.io.emit('gameHistoryUpdate', historyArray);
     }

    /** Removes disconnected player */
    removePlayer(socketId) {
        const playerName = this.getPlayerName(socketId);
        const wasPending = this.pendingPlayers.delete(socketId);
        const gameId = this.playerGameMap.get(socketId);

        if (gameId) {
            const game = this.activeGames.get(gameId);
            if (game) {
                console.log(`[GameManager] Removing player ${playerName || socketId} from active game ${gameId} ('${game.gameName}')`);
                game.removePlayer(socketId);
                if (game.isEmpty()) {
                    console.log(`[GameManager] Active game ${gameId} became empty. Triggering cleanup.`);
                    this.handleGameOverEvent(gameId, { winnerId: null, winnerName: 'None', reason: 'Player Disconnected', wasTestGame: game.isTestGame });
                }
            }
            this.playerGameMap.delete(socketId);
        }

        if (wasPending) {
            console.log(`[GameManager] Player ${playerName || socketId} removed from pending list.`);
             this._tryStartMatch(); // Re-evaluate matchmaking
        } else if (!gameId) {
             console.log(`[GameManager] Removed player ${playerName || socketId} (was not pending or in active game map).`);
        }
        // Calling handler broadcasts lobby status
    }

    /** Broadcasts lobby status */
    broadcastLobbyStatus() {
        const totalPending = this.pendingPlayers.size;
        const readyCount = Array.from(this.pendingPlayers.values()).filter(p => p.isReady).length;
        const statusData = { waiting: totalPending, ready: readyCount };
        this.io.emit('lobbyStatusUpdate', statusData);
    }

    /** Handles player actions (placeholder) */
    handlePlayerAction(socketId, action) {
        // Not currently used
    }

    /** Handles self-destruct request */
    handleSelfDestruct(socketId) {
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            if (game?.triggerSelfDestruct) {
                console.log(`[GameManager] Relaying self-destruct for ${socketId} to game ${gameId}`);
                game.triggerSelfDestruct(socketId);
            } else { console.warn(`[GameManager] Game instance ${gameId} missing triggerSelfDestruct for ${socketId}.`); }
        }
    }

} // End GameManager Class

module.exports = GameManager;
```

## server/index.js

```code
// server/index.js

// --- Load Environment Variables (MUST be first) ---
require('dotenv').config();
// ---------------------------------------------------

const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session); // Pass session to the function
const db = require('./db'); // Import the db module (needs pool)
const initializeSocketHandler = require('./socket-handler');
const authRoutes = require('./routes/auth');
const snippetRoutes = require('./routes/snippets');
const loadoutRoutes = require('./routes/loadouts');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// --- Session Configuration ---
// Ensure DATABASE_URL and SESSION_SECRET are loaded from .env or environment
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    console.error("FATAL: SESSION_SECRET environment variable not set.");
    if (process.env.NODE_ENV === 'production') {
        process.exit(1); // Exit in production if secret is missing
    } else {
        console.warn("WARNING: Using insecure default session secret for development.");
    }
}

const sessionMiddleware = session({
    store: new pgSession({
        pool: db.pool,                // Use the exported pool from db.js
        tableName: 'session',         // Match the table name created earlier
        // pruneSessionInterval: 60    // Optional: Check for expired sessions every 60 seconds
    }),
    secret: sessionSecret || 'default_insecure_secret_for_dev', // Use loaded secret or fallback
    resave: false,                     // Don't save session if unmodified
    saveUninitialized: false,          // Don't create session until something stored
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week validity for the session cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
        httpOnly: true,                  // Prevents client-side JS from reading the cookie
        sameSite: 'lax'                  // Basic CSRF protection
    }
});

// --- Express Middleware ---
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware for URL-encoded request bodies
app.use(sessionMiddleware); // Use session middleware for all Express routes AFTER body parsing

// --- Socket.IO Session Sharing ---
// Make express-session data accessible to Socket.IO connection handlers
io.engine.use(sessionMiddleware);
// --- End Socket.IO Session Sharing ---

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/snippets', snippetRoutes); // Placeholder, requires authMiddleware inside
app.use('/api/loadouts', loadoutRoutes); // Placeholder, requires authMiddleware inside
// --- End API Routes ---

// --- Static Files ---
// Serve static files from the 'client' directory AFTER API routes
const clientPath = path.join(__dirname, '..', 'client');
console.log(`Serving static files from: ${clientPath}`);
app.use(express.static(clientPath));
// --- End Static Files ---

// --- Catch-all for SPA (Single Page Application) routing ---
// If no API route or static file matched, send index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});
// --- End Catch-all ---

// Initialize Socket.IO handling logic (Pass io instance and db pool if needed)
initializeSocketHandler(io, db); // Pass db if GameManager or other parts need it

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the game at: http://localhost:${PORT}`);
  if (!process.env.SESSION_SECRET && process.env.NODE_ENV !== 'development') {
      console.warn("Reminder: SESSION_SECRET environment variable not set.");
  }
  if (process.env.NODE_ENV !== 'production' && sessionMiddleware.cookie?.secure) {
       console.warn("Warning: Secure cookies enabled but NODE_ENV is not 'production'. Cookies may not work over HTTP.");
  }
});
```

## server/middleware/auth.js

```code
// server/middleware/auth.js
// Middleware to check if the user is authenticated

module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is authenticated, proceed to the next middleware or route handler
        return next();
    } else {
        // User is not authenticated
        console.warn('[Auth Middleware] Access denied: No active session.');
        return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }
};
```

## server/routes/auth.js

```code
// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db'); // Import db module

const router = express.Router();
const saltRounds = 10; // Cost factor for bcrypt hashing

// --- DEFINE DEFAULT SNIPPETS ---
// (Code content copied from client/js/utils/storage.js)
const defaultSnippets = [
    {
        name: 'Simple Tank',
        code: `// Simple Tank Bot (using state object)\n// Moves in a straight line until hit, then changes direction\n\n// Initialize state ONCE\nif (typeof state.currentDirection === 'undefined') {\n    state.currentDirection = 0;\n    state.lastDamage = 0; // Track damage from previous tick\n    console.log('Simple Tank Initialized');\n}\n\n// Check if damage increased since last tick\nif (robot.damage() > state.lastDamage) {\n    console.log('Tank hit! Changing direction.');\n    state.currentDirection = (state.currentDirection + 90 + Math.random() * 90) % 360;\n}\nstate.lastDamage = robot.damage(); // Update damage tracking\n\n// Move forward\nrobot.drive(state.currentDirection, 3);\n\n// Scan for enemies - use 'let' for temporary variable\nlet scanResult = robot.scan(state.currentDirection, 45);\n\n// Fire if enemy detected\nif (scanResult) {\n    robot.fire(scanResult.direction, 2);\n}`
    },
    {
        name: 'Scanner Bot',
        code: `// Scanner Bot (using state object)\n// Constantly rotates scanner and moves/fires if enemy found\n\n// Initialize state ONCE\nif (typeof state.scanAngle === 'undefined') {\n    state.scanAngle = 0;\n    console.log('Scanner Bot Initialized');\n}\n\n// Rotate scan angle\nstate.scanAngle = (state.scanAngle + 5) % 360;\n\n// Scan for enemies - Use 'let' because it's recalculated each tick\nlet scanResult = robot.scan(state.scanAngle, 20);\n\n// If enemy detected, move toward it and fire\nif (scanResult) {\n    robot.drive(scanResult.direction, 3);\n    robot.fire(scanResult.direction, 3);\n} else {\n    // If no enemy, keep rotating but move slowly forward\n    robot.drive(state.scanAngle, 1);\n}`
    },
    {
        name: 'Aggressive Bot',
        code: `// Aggressive Bot (using state object)\n// Seeks out enemies and fires continuously\n\n// Initialize state ONCE\nif (typeof state.targetDirection === 'undefined') {\n    state.targetDirection = null;\n    state.searchDirection = 0;\n    state.searchMode = true;\n    state.timeSinceScan = 0;\n    console.log('Aggressive Bot Initialized');\n}\n\nstate.timeSinceScan++;\n\n// If we have a target, track and fire\nif (!state.searchMode && state.targetDirection !== null) {\n    if (state.timeSinceScan > 5) {\n        // scanResult is correctly scoped here with 'const'\n        const scanResult = robot.scan(state.targetDirection, 15);\n        state.timeSinceScan = 0;\n\n        if (scanResult) {\n            state.targetDirection = scanResult.direction;\n        } else {\n            console.log('Aggro Bot lost target, returning to search.');\n            state.searchMode = true;\n            state.targetDirection = null;\n        }\n    }\n    if (state.targetDirection !== null) {\n        robot.drive(state.targetDirection, 4);\n        robot.fire(state.targetDirection, 3);\n    }\n\n} else { // In search mode\n    if (state.timeSinceScan > 2) {\n        state.searchDirection = (state.searchDirection + 15) % 360;\n        // scanResult is correctly scoped here with 'const'\n        const scanResult = robot.scan(state.searchDirection, 30);\n        state.timeSinceScan = 0;\n\n        if (scanResult) {\n            console.log('Aggro Bot found target!');\n            state.targetDirection = scanResult.direction;\n            state.searchMode = false;\n            robot.drive(state.targetDirection, 4);\n            robot.fire(state.targetDirection, 3);\n        } else {\n            robot.drive(state.searchDirection, 1);\n        }\n    } else {\n         robot.drive(state.searchDirection, 1);\n    }\n}`
    }
    // Add more default snippets here if needed
];
// --- END DEFAULT SNIPPETS ---


// --- Registration ---
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // --- Basic Server-Side Validation ---
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    if (password.length < 4 || password.length > 10) {
        return res.status(400).json({ message: 'Password must be between 4 and 10 characters.' });
    }
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
         return res.status(400).json({ message: 'Password must be alphanumeric.' });
    }
    if (username.length < 3 || username.length > 20) {
         return res.status(400).json({ message: 'Username must be between 3 and 20 characters.' });
    }
     if (!/^[a-zA-Z0-9_]+$/.test(username)) { // Allow underscore in username
          return res.status(400).json({ message: 'Username must be alphanumeric or underscore.' });
     }
    // --- End Validation ---

    // --- Use Database Transaction ---
    let client = null; // Define client variable outside try
    try {
        // 1. Connect a client from the pool
        client = await db.pool.connect();
        console.log(`[Auth Register] DB client acquired for ${username}`);

        // 2. Start Transaction
        await client.query('BEGIN');
        console.log(`[Auth Register] Transaction BEGIN for ${username}`);

        // 3. Check if username already exists WITHIN transaction for safety
        // (Unique constraint will catch race conditions, but this check provides
        // a slightly cleaner exit path if the user was created between the
        // pre-check (if we had one) and BEGIN)
        const existingUser = await client.query('SELECT id FROM users WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            await client.query('ROLLBACK'); // Abort transaction
            // DO NOT release client here, finally block handles it.
            console.log(`[Auth Register] Registration failed: Username '${username}' already taken. Transaction ROLLBACK.`);
            return res.status(409).json({ message: 'Username already taken.' });
        }

        // 4. Hash the password
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 5. Insert the new user (Use the client)
        const newUserResult = await client.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
            [username, passwordHash]
        );
        const newUserId = newUserResult.rows[0].id;
        const newUsername = newUserResult.rows[0].username;
        console.log(`[Auth Register] User inserted for ${username} (ID: ${newUserId}).`);

        // 6. Insert Default Snippets (Use the client)
        console.log(`[Auth Register] Inserting ${defaultSnippets.length} default snippets for user ID ${newUserId}...`);
        const snippetInsertPromises = defaultSnippets.map(snippet => {
            return client.query(
                'INSERT INTO code_snippets (user_id, name, code) VALUES ($1, $2, $3)',
                [newUserId, snippet.name, snippet.code]
            );
        });
        // Wait for all snippet inserts to complete
        await Promise.all(snippetInsertPromises);
        console.log(`[Auth Register] Default snippets inserted for user ID ${newUserId}.`);

        // 7. Commit Transaction
        await client.query('COMMIT');
        console.log(`[Auth Register] Transaction COMMIT for ${username}.`);

        // --- Transaction successful, now handle session and response ---
        console.log(`[Auth Register] User registered successfully: ${newUsername} (ID: ${newUserId})`);
        req.session.regenerate((err) => {
            if (err) {
                console.error(`[Auth Register] Session regeneration error after registration for ${username}:`, err);
                // Still return success, but log the session error
                return res.status(201).json({
                    message: 'Registration successful, but session creation failed.',
                    user: { id: newUserId, username: newUsername }
                });
            }
            req.session.userId = newUserId;
            req.session.username = newUsername;
            console.log(`[Auth Register] Session created for ${username}.`);
            res.status(201).json({ // 201 Created
                message: 'Registration successful!',
                user: { id: newUserId, username: newUsername }
            });
        });

    } catch (error) {
        // --- Error Handling ---
        console.error(`[Auth Register] Error during registration transaction for ${username}:`, error);
        if (client) {
            try {
                // Attempt to rollback only if transaction was potentially started
                await client.query('ROLLBACK');
                console.log(`[Auth Register] Transaction ROLLBACK executed due to error for ${username}.`);
            } catch (rollbackError) {
                console.error(`[Auth Register] Error during ROLLBACK for ${username}:`, rollbackError);
            }
        }

        // --- Specific error handling for duplicate key ---
        // Check PostgreSQL error code '23505' for unique constraint violation
        if (error.code === '23505' && error.constraint && error.constraint.includes('users_username_key')) {
             console.warn(`[Auth Register] Caught duplicate username constraint violation for ${username}.`);
             // Return 409 Conflict instead of 500
             res.status(409).json({ message: 'Username already taken.' });
        } else {
             // Return generic 500 for other errors
            res.status(500).json({ message: 'Internal server error during registration.' });
        }
        // --- End Specific error handling ---

    } finally {
        // --- IMPORTANT: Release Client (ONLY HERE) ---
        // This block executes regardless of whether the try block succeeded or failed.
        if (client) {
            client.release(); // Release the client back to the pool
            console.log(`[Auth Register] DB client released for ${username}.`);
        }
    }
}); // <-- End of router.post('/register', ...) block


// --- Login ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // --- Validation for LOGIN: Only check if fields are present ---
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    // --- NO OTHER PASSWORD/USERNAME VALIDATION HERE ---

    try {
        // 1. Find the user by username
        const result = await db.query('SELECT id, username, password_hash FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            console.log(`[Auth] Login failed: User '${username}' not found.`);
            return res.status(401).json({ message: 'Invalid credentials.' }); // Use generic message
        }

        // 2. Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            console.log(`[Auth] Login failed: Incorrect password for user '${username}'.`);
            return res.status(401).json({ message: 'Invalid credentials.' }); // Use generic message
        }

        // 3. Passwords match - Regenerate session to prevent fixation attacks
        req.session.regenerate((err) => {
            if (err) {
                console.error('[Auth] Session regeneration error:', err);
                return res.status(500).json({ message: 'Internal server error during login.' });
            }

            // Store user information in session
            req.session.userId = user.id;
            req.session.username = user.username;

            console.log(`[Auth] User logged in successfully: ${user.username} (ID: ${user.id})`);
            res.status(200).json({
                message: 'Login successful!',
                user: { id: user.id, username: user.username }
            });
        });

    } catch (error) {
        console.error('[Auth] Login error:', error);
        res.status(500).json({ message: 'Internal server error during login.' });
    }
});


// --- Logout ---
router.post('/logout', (req, res) => {
    const currentUsername = req.session?.username; // Get username before destroying
    req.session.destroy((err) => {
        if (err) {
            console.error('[Auth] Logout error:', err);
            return res.status(500).json({ message: 'Could not log out, please try again.' });
        }
        // Ensure the cookie is cleared even if session store removal has latency
        res.clearCookie('connect.sid', { path: '/' }); // Specify path if needed
        console.log(`[Auth] User '${currentUsername || 'Unknown'}' logged out successfully.`);
        res.status(200).json({ message: 'Logout successful.' });
    });
});


// --- Check Session Status ---
router.get('/me', (req, res) => {
    // Check the session object attached to the request
    if (req.session && req.session.userId && req.session.username) {
        // User is logged in according to the session
        res.status(200).json({
            isLoggedIn: true,
            user: {
                id: req.session.userId,
                username: req.session.username
            }
        });
    } else {
        // No valid session found
        res.status(200).json({ isLoggedIn: false });
    }
});


module.exports = router;
```

## server/routes/loadouts.js

```code
// server/routes/loadouts.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Ensure you have this middleware
const db = require('../db'); // Your database connection module

// Apply auth middleware to all loadout routes
// This ensures only logged-in users can access these endpoints
router.use(authMiddleware);

// GET /api/loadouts - Fetch all loadouts for the logged-in user
router.get('/', async (req, res) => {
    const userId = req.session.userId; // Get user ID from session (set during login)
    try {
        // Join with snippets table to get the snippet name along with the loadout data
        const query = `
            SELECT
                lc.id,                  -- Loadout config ID
                lc.config_name,         -- Name of the configuration (e.g., "My Tank Build")
                lc.robot_name,          -- Display name of the robot in game (e.g., "Destroyer")
                lc.visuals,             -- JSONB object with visual settings
                lc.code_snippet_id,     -- Foreign key to the code snippet
                cs.name AS code_snippet_name -- Get the actual name of the linked snippet
            FROM loadout_configs lc
            LEFT JOIN code_snippets cs ON lc.code_snippet_id = cs.id AND cs.user_id = lc.user_id -- Ensure snippet belongs to user too
            WHERE lc.user_id = $1       -- Filter by the logged-in user
            ORDER BY lc.config_name ASC; -- Sort alphabetically by config name
        `;
        const { rows } = await db.query(query, [userId]);
        // console.log(`[API Loadouts GET /] Found ${rows.length} loadouts for user ${userId}`);
        res.status(200).json(rows); // Send array of loadout objects
    } catch (error) {
        console.error('[API Loadouts GET /] Database error:', error);
        res.status(500).json({ message: 'Failed to fetch loadout configurations.' });
    }
});

// GET /api/loadouts/:configName - Fetch a specific loadout by name
router.get('/:configName', async (req, res) => {
    const userId = req.session.userId;
    const configName = req.params.configName; // Get name from URL parameter

    if (!configName) {
        return res.status(400).json({ message: 'Configuration name parameter is required.' });
    }

    try {
        // Decode the name in case it contains URL-encoded characters (e.g., spaces %20)
        const decodedConfigName = decodeURIComponent(configName);
        console.log(`[API Loadouts GET /:name] Request for config '${decodedConfigName}' user ${userId}`);

        // Query similar to the main GET, but filtered by user_id AND config_name
        const query = `
            SELECT
                lc.id, lc.config_name, lc.robot_name, lc.visuals, lc.code_snippet_id,
                cs.name AS code_snippet_name
            FROM loadout_configs lc
            LEFT JOIN code_snippets cs ON lc.code_snippet_id = cs.id AND cs.user_id = lc.user_id
            WHERE lc.user_id = $1 AND lc.config_name = $2; -- Filter by user and config name
        `;
        const { rows } = await db.query(query, [userId, decodedConfigName]);

        if (rows.length === 0) {
            console.log(`[API Loadouts GET /:name] Config '${decodedConfigName}' not found for user ${userId}`);
            return res.status(404).json({ message: 'Loadout configuration not found.' });
        }

        console.log(`[API Loadouts GET /:name] Fetched config '${decodedConfigName}' for user ${userId}`);
        res.status(200).json(rows[0]); // Send the single loadout object

    } catch (error) {
        console.error(`[API Loadouts GET /:name] Database error fetching '${configName}':`, error);
        res.status(500).json({ message: 'Failed to fetch loadout configuration.' });
    }
});


// POST /api/loadouts - Create or Update a loadout config for the logged-in user
router.post('/', async (req, res) => {
    const userId = req.session.userId;
    // Destructure expected fields from the client request body
    const { configName, robotName, visuals, codeLoadoutName } = req.body;

    // --- Server-Side Validation ---
    if (!configName || typeof configName !== 'string' || configName.trim().length === 0 || configName.length > 50) {
        return res.status(400).json({ message: 'Valid configuration name (1-50 chars) is required.' });
    }
    if (!robotName || typeof robotName !== 'string' || robotName.trim().length === 0 || robotName.length > 50) {
        return res.status(400).json({ message: 'Valid robot name (1-50 chars) is required.' });
    }
    if (!visuals || typeof visuals !== 'object') {
        return res.status(400).json({ message: 'Visuals data is missing or invalid.' });
    }
    // Basic visual structure check (can be more thorough if needed)
    if (!visuals.turret?.type || !visuals.turret?.color ||
        !visuals.chassis?.type || !visuals.chassis?.color ||
        !visuals.mobility?.type) {
        return res.status(400).json({ message: 'Visuals data structure is incomplete.' });
    }
    if (!codeLoadoutName || typeof codeLoadoutName !== 'string') {
        // Client should ensure a snippet is selected, but double-check here
        return res.status(400).json({ message: 'A valid code snippet name must be selected.' });
    }
    // --- End Validation ---

    const trimmedConfigName = configName.trim();
    const trimmedRobotName = robotName.trim();

    let client = null; // For database transaction
    try {
        client = await db.pool.connect(); // Get client from pool for transaction
        await client.query('BEGIN'); // Start the transaction

        // 1. Find the ID of the selected code snippet belonging to the user
        // Ensure the specified snippet actually exists and belongs to this user
        const snippetRes = await client.query(
            'SELECT id FROM code_snippets WHERE user_id = $1 AND name = $2',
            [userId, codeLoadoutName]
        );

        if (snippetRes.rows.length === 0) {
            // If snippet not found, rollback and return error
            await client.query('ROLLBACK');
            client.release(); // Release client before returning
            console.log(`[API Loadouts POST] Snippet '${codeLoadoutName}' not found for user ${userId}.`);
            return res.status(400).json({ message: `Selected code snippet '${codeLoadoutName}' not found.` });
        }
        const codeSnippetId = snippetRes.rows[0].id; // Get the foreign key ID

        // 2. Use INSERT ... ON CONFLICT to create or update the loadout config
        // This relies on a unique constraint on (user_id, config_name) in the DB table
        const upsertQuery = `
            INSERT INTO loadout_configs (user_id, config_name, robot_name, visuals, code_snippet_id)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id, config_name) -- Specify the columns for conflict detection
            DO UPDATE SET                     -- Define what to update if conflict occurs
                robot_name = EXCLUDED.robot_name,
                visuals = EXCLUDED.visuals,
                code_snippet_id = EXCLUDED.code_snippet_id
            RETURNING id, config_name, robot_name, visuals, code_snippet_id; -- Return the saved/updated row
        `;
        // Note: PostgreSQL handles JSON/JSONB parameters directly when using node-postgres
        const { rows } = await client.query(upsertQuery, [userId, trimmedConfigName, trimmedRobotName, visuals, codeSnippetId]);

        await client.query('COMMIT'); // Commit the transaction if all queries succeeded

        if (rows.length > 0) {
            console.log(`[API Loadouts POST] Loadout config '${trimmedConfigName}' saved/updated for user ${userId}`);
            // Return the saved data, including the snippet name for client-side consistency
            const savedLoadout = { ...rows[0], code_snippet_name: codeLoadoutName };
            res.status(200).json({ message: `Configuration '${trimmedConfigName}' saved.`, loadout: savedLoadout });
        } else {
            // This case should ideally not happen with RETURNING if upsert worked, but handle defensively
            console.error(`[API Loadouts POST] Failed to save/update loadout '${trimmedConfigName}' for user ${userId} (no rows returned after commit).`);
            res.status(500).json({ message: 'Failed to save configuration (post-commit error).' });
        }

    } catch (error) {
        if (client) {
            // Rollback the transaction in case of any error during the process
            await client.query('ROLLBACK');
        }
        console.error(`[API Loadouts POST] Database error saving loadout '${trimmedConfigName}':`, error);
        res.status(500).json({ message: 'Failed to save configuration due to server error.' });
    } finally {
        // IMPORTANT: Release the client back to the pool in all cases (success or error)
        if (client) {
            client.release();
        }
    }
});

// DELETE /api/loadouts/:configName - Delete loadout config by name for the user
router.delete('/:configName', async (req, res) => {
    const userId = req.session.userId;
    const configName = req.params.configName; // Get name from URL parameter

    if (!configName) {
        return res.status(400).json({ message: 'Configuration name parameter is required.' });
    }

    try {
        const decodedConfigName = decodeURIComponent(configName);
        console.log(`[API Loadouts DELETE] Attempting to delete config '${decodedConfigName}' for user ${userId}`);

        // TODO Optional: Check if this is the user's 'last_loadout_config_id' in the 'users' table
        // If it is, you might want to clear that field or set it to null before/after deleting.
        // Example: await db.query('UPDATE users SET last_loadout_config_id = NULL WHERE id = $1 AND last_loadout_config_id = (SELECT id FROM loadout_configs WHERE user_id = $1 AND config_name = $2)', [userId, decodedConfigName]);

        // Execute the delete operation
        const { rowCount } = await db.query(
            'DELETE FROM loadout_configs WHERE user_id = $1 AND config_name = $2',
            [userId, decodedConfigName]
        );

        if (rowCount > 0) {
            // Delete was successful
            console.log(`[API Loadouts DELETE] Config '${decodedConfigName}' deleted successfully for user ${userId}`);
            res.status(200).json({ message: `Configuration '${decodedConfigName}' deleted.` });
        } else {
            // No rows affected - config either didn't exist or didn't belong to the user
            console.log(`[API Loadouts DELETE] Config '${decodedConfigName}' not found for user ${userId} or delete failed.`);
            res.status(404).json({ message: 'Configuration not found.' });
        }
    } catch (error) {
        console.error(`[API Loadouts DELETE] Database error deleting config '${configName}':`, error);
        res.status(500).json({ message: 'Failed to delete configuration.' });
    }
});

module.exports = router; // Export the router for use in server/index.js
```

## server/routes/snippets.js

```code
// server/routes/snippets.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../db');

// Apply auth middleware to all snippet routes
router.use(authMiddleware);

// GET /api/snippets - Fetch all snippets for the logged-in user
router.get('/', async (req, res) => {
    const userId = req.session.userId;
    try {
        const { rows } = await db.query(
            'SELECT id, name, code FROM code_snippets WHERE user_id = $1 ORDER BY name ASC',
            [userId]
        );
        // console.log(`[API Snippets GET /] Found ${rows.length} snippets for user ${userId}`);
        res.status(200).json(rows); // Send array of {id, name, code}
    } catch (error) {
        console.error('[API Snippets GET /] Database error:', error);
        res.status(500).json({ message: 'Failed to fetch snippets.' });
    }
});

// GET /api/snippets/:snippetName - Fetch a specific snippet by name for the logged-in user
router.get('/:snippetName', async (req, res) => {
    const userId = req.session.userId;
    const snippetName = req.params.snippetName; // Name comes from URL parameter

    if (!snippetName) {
        return res.status(400).json({ message: 'Snippet name parameter is required.' });
    }

    try {
        const decodedSnippetName = decodeURIComponent(snippetName);
        const { rows } = await db.query(
            'SELECT id, name, code FROM code_snippets WHERE user_id = $1 AND name = $2',
            [userId, decodedSnippetName]
        );

        if (rows.length === 0) {
            console.log(`[API Snippets GET /:name] Snippet '${decodedSnippetName}' not found for user ${userId}`);
            return res.status(404).json({ message: 'Snippet not found.' });
        }

        console.log(`[API Snippets GET /:name] Fetched snippet '${decodedSnippetName}' for user ${userId}`);
        res.status(200).json(rows[0]); // Send the single snippet object {id, name, code}
    } catch (error) {
        console.error(`[API Snippets GET /:name] Database error fetching '${snippetName}':`, error);
        res.status(500).json({ message: 'Failed to fetch snippet.' });
    }
});


// POST /api/snippets - Create or Update a snippet for the logged-in user
router.post('/', async (req, res) => {
    const userId = req.session.userId;
    const { name, code } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 50) {
        return res.status(400).json({ message: 'Valid snippet name (1-50 chars) is required.' });
    }
    if (typeof code !== 'string') { // Allow empty code? For now, yes.
        return res.status(400).json({ message: 'Snippet code must be a string.' });
    }

    const trimmedName = name.trim();

    try {
        // Use INSERT ... ON CONFLICT to handle create/update in one query
        // We need a unique constraint on (user_id, name) in the DB schema for this.
        // Assuming that constraint exists:
        const query = `
            INSERT INTO code_snippets (user_id, name, code)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, name)
            DO UPDATE SET code = EXCLUDED.code
            RETURNING id, name, code;
        `;
        const { rows } = await db.query(query, [userId, trimmedName, code]);

        if (rows.length > 0) {
            console.log(`[API Snippets POST] Snippet '${trimmedName}' saved/updated for user ${userId}`);
            res.status(200).json({ message: `Snippet '${trimmedName}' saved successfully.`, snippet: rows[0] });
        } else {
            // This case should ideally not happen with RETURNING clause if insert/update works
             console.error(`[API Snippets POST] Failed to save/update snippet '${trimmedName}' for user ${userId} (no rows returned).`);
            res.status(500).json({ message: 'Failed to save snippet.' });
        }

    } catch (error) {
        console.error(`[API Snippets POST] Database error saving snippet '${trimmedName}':`, error);
        // Specific check for unique constraint violation if not using ON CONFLICT
        // if (error.code === '23505') { // PostgreSQL unique violation code
        //     return res.status(409).json({ message: `Snippet name '${trimmedName}' already exists.` });
        // }
        res.status(500).json({ message: 'Failed to save snippet due to server error.' });
    }
});

// DELETE /api/snippets/:snippetName - Delete a snippet by name for the user
router.delete('/:snippetName', async (req, res) => {
    const userId = req.session.userId;
    const snippetName = req.params.snippetName; // Name from URL parameter

    if (!snippetName) {
        return res.status(400).json({ message: 'Snippet name parameter is required.' });
    }

    try {
        const decodedSnippetName = decodeURIComponent(snippetName); // Decode name from URL
        console.log(`[API Snippets DELETE] Attempting to delete snippet '${decodedSnippetName}' for user ${userId}`);

        // Check if any loadouts are using this snippet before deleting
        const loadoutCheck = await db.query(
            `SELECT lc.id FROM loadout_configs lc
             JOIN code_snippets cs ON lc.code_snippet_id = cs.id
             WHERE cs.user_id = $1 AND cs.name = $2`,
            [userId, decodedSnippetName]
        );

        if (loadoutCheck.rows.length > 0) {
            console.warn(`[API Snippets DELETE] Cannot delete snippet '${decodedSnippetName}' for user ${userId}: Still used by ${loadoutCheck.rows.length} loadout(s).`);
            return res.status(409).json({ message: `Cannot delete snippet: It is currently used by ${loadoutCheck.rows.length} loadout configuration(s). Please update those loadouts first.` });
        }

        // Proceed with deletion
        const { rowCount } = await db.query(
            'DELETE FROM code_snippets WHERE user_id = $1 AND name = $2',
            [userId, decodedSnippetName]
        );

        if (rowCount > 0) {
            console.log(`[API Snippets DELETE] Snippet '${decodedSnippetName}' deleted successfully for user ${userId}`);
            res.status(200).json({ message: `Snippet '${decodedSnippetName}' deleted successfully.` });
        } else {
            console.log(`[API Snippets DELETE] Snippet '${decodedSnippetName}' not found for user ${userId} or delete failed.`);
            res.status(404).json({ message: 'Snippet not found or could not be deleted.' });
        }
    } catch (error) {
        console.error(`[API Snippets DELETE] Database error deleting snippet '${snippetName}':`, error);
        res.status(500).json({ message: 'Failed to delete snippet.' });
    }
});


module.exports = router;
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
 * events (like robotLog, fire) on the GameInstance via safe API methods.
 */
class ServerRobotInterpreter {
    constructor() {
        this.robotContexts = {}; // Stores the unique sandboxed context for each robot
        this.robotTickFunctions = {}; // Stores the executable function compiled from robot code
        this.currentRobotId = null; // Temporarily holds the ID of the robot currently executing
        this.currentGameInstance = null; // Temporarily holds a reference to the GameInstance
    }

    /**
     * Initializes the interpreter contexts and compiles functions for each robot.
     * @param {ServerRobot[]} robots - Array of robot instances.
     * @param {Map<string, object>} playersDataMap - Map where key is robotId and value is
     *        { socket, loadout: { name, visuals, code }, robot: ServerRobot }.
     */
    initialize(robots, playersDataMap) { // Added clarification to JSDoc
        console.log("[Interpreter] Initializing robot interpreters...");
        robots.forEach(robot => {
            const playerData = playersDataMap.get(robot.id);
            const playerSocket = playerData ? playerData.socket : null; // Needed for init error reporting

            // === START OF CHANGE: Access code via playerData.loadout.code ===
            const robotCode = playerData?.loadout?.code; // Safely access nested code

            if (!playerData || typeof robotCode !== 'string' || robotCode.trim() === '') {
                const reason = !playerData ? 'No player data found' : (!robotCode ? 'Code missing in loadout' : 'Code is empty');
                console.error(`[Interpreter] No valid code for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'}). Reason: ${reason}. Disabling.`);
                this.robotTickFunctions[robot.id] = null;
                this.robotContexts[robot.id] = null;
                // Optional: Notify player if applicable
                 if (playerSocket?.connected) {
                     playerSocket.emit('codeError', { robotId: robot.id, message: `Initialization Error: Robot code is missing or empty.` });
                 }
                return; // Skip this robot
            }
            // === END OF CHANGE ===


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
                        const messageString = args.map(arg => {
                            try {
                                return (typeof arg === 'object' && arg !== null) ? JSON.stringify(arg) : String(arg);
                            } catch (e) { return '[Unloggable Object]'; }
                        }).join(' ');

                        if (this.currentGameInstance && this.currentGameInstance.io && this.currentGameInstance.gameId) {
                            this.currentGameInstance.io.to(this.currentGameInstance.gameId).emit('robotLog', {
                                robotId: robot.id,
                                message: messageString
                            });
                        } else {
                             if (playerSocket?.connected) {
                                playerSocket.emit('robotLog', {
                                    robotId: robot.id,
                                    message: `(Context Issue) ${messageString}`
                                });
                             }
                        }
                    }
                },
                Math: {
                    abs: Math.abs, acos: Math.acos, asin: Math.asin, atan: Math.atan, atan2: Math.atan2,
                    ceil: Math.ceil, cos: Math.cos, floor: Math.floor, max: Math.max, min: Math.min,
                    pow: Math.pow, random: Math.random, round: Math.round, sin: Math.sin, sqrt: Math.sqrt,
                    tan: Math.tan, PI: Math.PI
                },
                Number: {
                    isFinite: Number.isFinite, isNaN: Number.isNaN, parseFloat: Number.parseFloat, parseInt: Number.parseInt
                },
                setTimeout: undefined, setInterval: undefined, setImmediate: undefined,
                clearTimeout: undefined, clearInterval: undefined, clearImmediate: undefined,
                require: undefined, process: undefined, global: undefined, globalThis: undefined,
                Buffer: undefined,
            };

            this.robotContexts[robot.id] = vm.createContext(sandbox);

            try {
                // === START OF CHANGE: Use robotCode variable ===
                const wrappedCode = `(function() { "use strict";\n${robotCode}\n});`;
                // === END OF CHANGE ===
                const script = new vm.Script(wrappedCode, {
                    filename: `robot_${robot.id}.js`,
                    displayErrors: true
                });

                this.robotTickFunctions[robot.id] = script.runInContext(this.robotContexts[robot.id], { timeout: 500 });

                if (typeof this.robotTickFunctions[robot.id] !== 'function') {
                     throw new Error("Compiled code did not produce a function. Ensure your code is wrapped correctly or is just statements.");
                }
                console.log(`[Interpreter] Compiled function for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'})`);

            } catch (error) {
                console.error(`[Interpreter] Error initializing/compiling function for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'}):`, error.message);
                if (playerSocket?.connected) {
                    playerSocket.emit('codeError', { robotId: robot.id, message: `Initialization Error: ${error.message}` });
                }
                this.robotTickFunctions[robot.id] = null;
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
                    tickFunction.call(context.robot); // Pass the 'robot' API object as 'this' inside the function

                } catch (error) {
                    console.error(`[Interpreter] Runtime error for robot ${robot.id} (${playerData?.loadout?.name || 'Unknown'}):`, error.message, error.stack);
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
        if (!this.currentRobotId || !this.currentGameInstance) return null;
        return this.currentGameInstance.robots.find(r => r.id === this.currentRobotId);
    }

    /** Safely delegates drive command to the correct robot instance. */
    safeDrive(robotId, direction, speed) {
        if (robotId !== this.currentRobotId) return;
        const robot = this.getCurrentRobot();
        if (robot?.state === 'active' && typeof direction === 'number' && typeof speed === 'number') {
            robot.drive(direction, speed);
        }
    }

    /** Safely delegates scan command to the GameInstance. */
    safeScan(robotId, direction, resolution) {
        if (robotId !== this.currentRobotId || !this.currentGameInstance) return null;
        const robot = this.getCurrentRobot();
        if (robot?.state === 'active' && typeof direction === 'number') {
            const res = (typeof resolution === 'number' && resolution > 0) ? resolution : 10;
            return this.currentGameInstance.performScan(robot, direction, res);
        }
        return null;
    }

    /** Safely delegates fire command AND triggers fire event on GameInstance. */
    safeFire(robotId, direction, power) {
        if (robotId !== this.currentRobotId) return false;
        const robot = this.getCurrentRobot();

        if (robot?.state === 'active' && this.currentGameInstance && typeof direction === 'number') {
            const fireResult = robot.fire(direction, power);

            if (fireResult.success && fireResult.eventData && typeof this.currentGameInstance.addFireEvent === 'function') {
                this.currentGameInstance.addFireEvent(fireResult.eventData);
            }
            return fireResult.success;
        }
        return false;
    }


    /** Safely retrieves the current damage of the robot. */
    safeDamage(robotId) {
        if (robotId !== this.currentRobotId) return 100;
        const robot = this.getCurrentRobot();
        return robot ? robot.damage : 100;
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
        this.id = `m-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.power = power;
        this.ownerId = ownerId;
        this.radius = 3 + power;
    }
    update(deltaTime) {
        const moveSpeed = this.speed * deltaTime * 60;
        const radians = this.direction * Math.PI / 180;
        this.x += Math.cos(radians) * moveSpeed;
        this.y -= Math.sin(radians) * moveSpeed;
    }
}


/**
 * Represents a Robot's state and behavior on the server side.
 * Stores visual configuration and name provided during initialization. // <-- Updated description
 */
class ServerRobot {
    /**
     * Creates a ServerRobot instance.
     * @param {string} id - Unique identifier for the robot.
     * @param {number} x - Initial X coordinate.
     * @param {number} y - Initial Y coordinate.
     * @param {number} direction - Initial direction in degrees.
     * @param {object} visuals - Visual configuration object { turret: {type, color}, chassis: {type, color}, mobility: {type} }.
     * @param {string} name - The display name for the robot.
     */
    constructor(id, x, y, direction, visuals, name) { // Updated constructor signature
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = 0;
        this.targetSpeed = 0;
        this.targetDirection = direction;
        this._damage = 0;
        this.radius = 15; // Base radius, could potentially be modified by chassis type later
        // this.color = this.generateColor(); // Removed old color generation
        this.cooldown = 0;
        this.missiles = [];
        this.state = 'active';
        this.destructionTime = null;
        this.destructionNotified = false;
        this.lastDamageCause = null;

        // --- Store Visuals and Name ---
        this.visuals = visuals || { // Provide default visuals if none passed
            turret: { type: 'standard', color: '#ffffff' },
            chassis: { type: 'medium', color: '#aaaaaa' },
            mobility: { type: 'wheels' }
        };
        this.name = name || `Robot_${id.substring(0, 4)}`; // Use provided name or generate default
        // --- End Store ---

        // Removed this.appearance property
    }

    get damage() {
        return this._damage;
    }

    get isAlive() {
        return this.state === 'active';
    }

    // Removed generateColor() method

    // --- update (No changes needed) ---
    update(deltaTime, arenaWidth, arenaHeight) {
        for (let i = this.missiles.length - 1; i >= 0; i--) {
            const missile = this.missiles[i];
            missile.update(deltaTime);
            if (missile.x < 0 || missile.x > arenaWidth || missile.y < 0 || missile.y > arenaHeight) {
                this.missiles.splice(i, 1);
            }
        }
        if (this.state !== 'active') return;
        if (this.cooldown > 0) this.cooldown = Math.max(0, this.cooldown - 1);
        this.speed = this.targetSpeed;
        this.direction = this.targetDirection;
        if (this.speed !== 0) {
            const moveSpeed = this.speed * deltaTime * 60;
            const radians = this.direction * Math.PI / 180;
            const dx = Math.cos(radians) * moveSpeed;
            const dy = Math.sin(radians) * moveSpeed;
            let newX = this.x + dx;
            let newY = this.y - dy;
            newX = Math.max(this.radius, Math.min(arenaWidth - this.radius, newX));
            newY = Math.max(this.radius, Math.min(arenaHeight - this.radius, newY));
            this.x = newX;
            this.y = newY;
        }
    }

    // --- drive (No changes needed) ---
    drive(direction, speed) {
        if (this.state !== 'active') return;
        this.targetDirection = ((Number(direction) % 360) + 360) % 360;
        this.targetSpeed = Math.max(-5, Math.min(5, Number(speed)));
    }

    // --- fire (No changes needed) ---
    fire(direction, power = 1) {
        if (this.state !== 'active' || this.cooldown > 0) return { success: false };
        const clampedPower = Math.max(1, Math.min(3, Number(power)));
        this.cooldown = clampedPower * 10 + 10;
        const fireDirection = ((Number(direction) % 360) + 360) % 360;
        const radians = fireDirection * Math.PI / 180;
        const missileSpeed = 7 + clampedPower;
        const startOffset = this.radius + 5;
        const missileStartX = this.x + Math.cos(radians) * startOffset;
        const missileStartY = this.y - Math.sin(radians) * startOffset;
        const missile = new ServerMissile(missileStartX, missileStartY, fireDirection, missileSpeed, clampedPower, this.id);
        this.missiles.push(missile);
        const fireEventData = { type: 'fire', x: missileStartX, y: missileStartY, ownerId: this.id };
        return { success: true, eventData: fireEventData };
    }

    // --- takeDamage (No changes needed) ---
    takeDamage(amount, cause = 'missile') {
        if (this.state !== 'active') return { destroyed: false, hit: false };
        const damageAmount = Math.max(0, Number(amount));
        if (damageAmount <= 0) return { destroyed: false, hit: false };
        this.lastDamageCause = cause;
        this._damage = Math.min(100, this._damage + damageAmount);
        if (this._damage >= 100) {
            this._damage = 100;
            this.state = 'destroyed';
            this.destructionTime = Date.now();
            this.speed = 0; this.targetSpeed = 0;
            console.log(`[${this.id}] Robot destroyed by ${damageAmount} damage via ${cause}!`);
            return { destroyed: true, hit: true, x: this.x, y: this.y, cause: cause };
        } else {
            console.log(`[${this.id}] Took ${damageAmount} damage via ${cause}. Current health: ${100 - this._damage}`);
            return { destroyed: false, hit: true, x: this.x, y: this.y };
        }
    }
}

module.exports = ServerRobot;
```

## server/socket-handler.js

```code
// server/socket-handler.js
const GameManager = require('./game-manager'); // Assuming GameManager is updated

/**
 * Initializes Socket.IO event handlers.
 * Now uses session data for user identification.
 */
function initializeSocketHandler(io, db) { // db might be needed by GameManager now
    const gameManager = new GameManager(io, db); // Pass db if needed

    io.on('connection', (socket) => {
        // Access session data associated with this socket
        const session = socket.request.session;
        let userId = session?.userId;
        let username = session?.username;

        // Only proceed if the user is logged in via session
        if (!userId || !username) {
            console.log(`[Socket ${socket.id}] Connection attempt rejected: No active session.`);
            socket.emit('authError', { message: 'Please log in to play.' });
            socket.disconnect(true);
            return;
        }

        console.log(`[Socket ${socket.id}] Client connected: User '${username}' (ID: ${userId})`);
        socket.emit('assignId', socket.id); // Still useful for client-side logic

        // --- START: Adapted Player Adding ---
        // Add player to GameManager using their user info.
        // GameManager should handle preventing duplicates or managing state if already connected.
        gameManager.addPlayer(socket); // Pass socket, GM can get user info if needed or addPlayer is adapted
        // --- END: Adapted Player Adding ---

        // --- Send Initial Game History to just this user ---
        gameManager.broadcastGameHistory(socket);


        socket.on('disconnect', () => {
            console.log(`[Socket ${socket.id}] Client disconnected: User '${username}' (ID: ${userId})`);
            // Ensure GameManager uses socket.id to remove, but might need userId too for cross-referencing
            gameManager.removePlayer(socket.id); // Pass socket.id for removal
        });

        // === Event Listeners - Use userId/username from session ===

        // Handles 'Ready Up' signal with full loadout data
        socket.on('submitPlayerData', (loadoutData) => {
             if (!userId || !username) return socket.emit('authError', { message: 'Session expired. Please log in.' });

             // Validate received loadoutData structure
             if (!loadoutData || typeof loadoutData.name !== 'string' || !loadoutData.visuals || typeof loadoutData.code !== 'string') {
                 console.error(`[Socket ${socket.id}] Received invalid loadoutData structure from user ${username}:`, loadoutData);
                 socket.emit('lobbyEvent', { message: 'Invalid loadout data received. Please try again.', type: 'error' });
                 return;
             }
             // Note: Server uses the validated loadoutData.name (robot name) directly.
             // The username from session identifies the *account*.
             console.log(`[Socket ${socket.id}] User ${username} submitted player data (Robot: ${loadoutData.name})`);
             // Pass the full loadoutData received from client to GameManager
             gameManager.handlePlayerCode(socket.id, loadoutData); // handlePlayerCode expects the full {name, visuals, code}
        });

        // Handles 'Unready' signal
        socket.on('playerUnready', () => {
             if (!userId || !username) return socket.emit('authError', { message: 'Session expired. Please log in.' });
             console.log(`[Socket ${socket.id}] User ${username} unreadied.`);
             // Pass socket.id only, GameManager uses this to find the player
             gameManager.setPlayerReadyStatus(socket.id, false);
        });

        // Handles 'Test Code' request with full loadout data
        socket.on('requestTestGame', (loadoutData) => {
            if (!userId || !username) return socket.emit('authError', { message: 'Session expired. Please log in.' });

            // Validate received loadoutData structure
            if (!loadoutData || typeof loadoutData.name !== 'string' || !loadoutData.visuals || typeof loadoutData.code !== 'string') {
                 console.error(`[Socket ${socket.id}] Received invalid loadoutData structure for test game from user ${username}:`, loadoutData);
                 socket.emit('lobbyEvent', { message: 'Invalid loadout data received for test game. Please try again.', type: 'error' });
                 return;
            }

            console.log(`[Socket ${socket.id}] User ${username} requested test game (Robot: ${loadoutData.name})`);
            // --- START: Corrected Call ---
            // Pass the socket object and the full loadoutData object received from the client
            gameManager.startTestGameForPlayer(socket, loadoutData);
            // --- END: Corrected Call ---
        });

        // Handles Chat Messages
        socket.on('chatMessage', (data) => {
             if (!userId || !username) return socket.emit('authError', { message: 'Session expired. Please log in.' });
             const senderName = username; // Use session username
             const messageText = data?.text || '';

             // Basic validation/sanitization (consider a library for robustness)
             if (typeof messageText !== 'string' || messageText.trim().length === 0 || messageText.length > 100) {
                 console.warn(`[Socket ${socket.id}] User ${username} sent invalid chat message.`);
                 return; // Ignore empty or too long messages
             }
             const sanitizedText = messageText.trim(); // Basic trim

             console.log(`[Socket ${socket.id}] Chat from ${senderName}: ${sanitizedText}`);
             io.emit('chatUpdate', { sender: senderName, text: sanitizedText });
        });

        // Handles Self-Destruct request
        socket.on('selfDestruct', () => {
             if (!userId || !username) return socket.emit('authError', { message: 'Session expired. Please log in.' });
             console.log(`[Socket ${socket.id}] User ${username} requested self-destruct.`);
             // Pass socket.id only, GameManager uses this to find the player/game
             gameManager.handleSelfDestruct(socket.id);
        });

    });

    console.log("[Socket Handler] Initialized with session support.");
}

module.exports = initializeSocketHandler;
```

## server/db.js

```code
// server/db.js
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'YOUR_RENDER_POSTGRES_URL'; // Use env var or fallback

if (!connectionString || connectionString === 'YOUR_RENDER_POSTGRES_URL') {
    console.error("FATAL: Database connection string not found. Set DATABASE_URL environment variable or update server/db.js");
    // process.exit(1); // Optionally exit if DB is critical
}

const pool = new Pool({
    connectionString: connectionString,
    // Render recommends SSL for external connections
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

pool.on('connect', () => {
    console.log('[DB] Client connected to the database pool');
});

pool.on('error', (err, client) => {
    console.error('[DB] Unexpected error on idle client', err);
    // process.exit(-1); // Decide if errors are fatal
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool // Export pool if needed for session store
};
```

## server/dummy-bot-ai.js

```code
// server/dummy-bot-ai.js
// Simple AI for the test bot

// Initialize state if it doesn't exist
if (typeof state.dir === 'undefined') {
    state.dir = Math.random() * 360; // Start in a random direction
    state.moveTimer = 0;
    state.scanTimer = 0;
    console.log("Dummy Bot Initialized.");
}

// --- Movement ---
state.moveTimer++;
// Drive straight most of the time
robot.drive(state.dir, 2);
// Turn ~ every 3 seconds (assuming 30 ticks/sec)
if (state.moveTimer > 90) {
    state.dir = (state.dir + (Math.random() * 90 - 45)) % 360; // Turn randomly +/- 45 deg
    state.moveTimer = 0;
    // console.log("Dummy Bot changing direction to: " + state.dir.toFixed(0));
}

// --- Scanning & Firing ---
state.scanTimer++;
// Scan less frequently than moving, ~ every 1 second
if (state.scanTimer > 30) {
    let scanResult = robot.scan(state.dir, 45); // Scan ahead in a 45 deg arc
    if (scanResult) {
        // console.log("Dummy Bot sees something at direction: " + scanResult.direction.toFixed(0));
        // Aim and fire!
        robot.fire(scanResult.direction, 1); // Fire low power shots
    }
    state.scanTimer = 0;
}

// Avoid firing constantly - cooldown is handled by robot.fire automatically
```

