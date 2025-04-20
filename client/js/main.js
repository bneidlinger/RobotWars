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