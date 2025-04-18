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