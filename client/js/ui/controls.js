// client/js/ui/controls.js

/**
 * Controls handler for Robot Wars.
 * Manages button interactions (Run, Reset), code loading, and appearance selection,
 * sending relevant data to the server via the network handler.
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
        if (!this.game || !this.network) {
             console.error("Controls initialized without valid game or network reference!");
        }
        this.setupEventListeners();
        console.log('Controls initialized with game and network references');
    }

    /**
     * Sets up event listeners for UI elements like buttons and selects.
     */
    setupEventListeners() {
        // Get references to the DOM elements
        const runButton = document.getElementById('btn-run');
        const resetButton = document.getElementById('btn-reset');
        const sampleCodeSelect = document.getElementById('sample-code');
        const appearanceSelect = document.getElementById('robot-appearance-select'); // Get the new dropdown

        // Check if elements exist to prevent errors
        if (!runButton || !resetButton || !sampleCodeSelect || !appearanceSelect) {
            console.error("One or more control elements (buttons, selects) not found in the DOM!");
            return; // Stop setup if elements are missing
        }

        // --- Run Button Listener ---
        runButton.addEventListener('click', () => {
            console.log('Run button clicked');

            // Get code from the CodeMirror editor (global variable 'editor')
            const playerCode = (typeof editor !== 'undefined') ? editor.getValue() : '';
            if (!playerCode) {
                alert("Code editor is empty!");
                return;
            }

            // Get the selected appearance value from the dropdown
            const chosenAppearance = appearanceSelect.value || 'default'; // Use 'default' as fallback

            // Check network connection and call the appropriate network method
            if (this.network && this.network.socket && this.network.socket.connected) {
                console.log(`Submitting Data - Appearance: ${chosenAppearance}`);

                // Send both code and appearance data to the server
                this.network.sendCodeAndAppearance(playerCode, chosenAppearance);

                // Provide user feedback
                runButton.disabled = true;
                runButton.textContent = "Waiting for Match...";
                appearanceSelect.disabled = true; // Disable appearance change while waiting/playing
                // Optionally disable code editor too
                // if (typeof editor !== 'undefined') editor.setOption("readOnly", true);

            } else {
                // Handle cases where network is not available
                console.error("Network handler not available or not connected in Controls.");
                alert("Cannot connect to the server. Please check connection and refresh.");
                // Reset button state if submission failed
                runButton.disabled = false;
                runButton.textContent = "Run Simulation";
                appearanceSelect.disabled = false;
            }
        });

        // --- Reset Button Listener ---
        resetButton.addEventListener('click', () => {
            console.log('Reset button clicked');

            // Stop client-side rendering loop if running
            this.game.stop();

            // Clear the local canvas presentation
            if (this.game.arena) {
                this.game.arena.clear(); // Clears and draws background
                this.game.arena.drawGrid(); // Redraw the empty grid
            }

            // Reset robot stats display locally
            if (window.dashboard) {
                 window.dashboard.updateStats([]); // Clear stats panel
            }

            // Re-enable UI elements for a new submission
            runButton.disabled = false;
            runButton.textContent = "Run Simulation";
            appearanceSelect.disabled = false; // Allow changing appearance again
            // if (typeof editor !== 'undefined') editor.setOption("readOnly", false);

            // Optional: Send a message to the server indicating the player wants to leave/reset
            // if (this.network && this.network.socket && this.network.socket.connected) {
            //     this.network.socket.emit('playerResetRequest');
            // }
        });

        // --- Sample Code Loader Listener ---
        sampleCodeSelect.addEventListener('change', function() {
            const sample = this.value;
            // Check if the loadSampleCode function exists (defined in editor.js)
            if (sample && typeof loadSampleCode === 'function') {
                loadSampleCode(sample);
                // Reset the run button state if a new sample is loaded, potentially enabling it
                // No need to change appearanceSelect state here
                if (runButton.disabled) { // Only reset if it was disabled
                     runButton.disabled = false;
                     runButton.textContent = "Run Simulation";
                     // if (typeof editor !== 'undefined') editor.setOption("readOnly", false);
                }
            }
        });

        // --- Appearance Select Listener (Optional) ---
        // You might add a listener here if changing appearance should
        // immediately update something visually, but likely not needed for now.
        // appearanceSelect.addEventListener('change', () => {
        //     console.log(`Appearance selection changed to: ${appearanceSelect.value}`);
        // });
    }
}

// The DOMContentLoaded listener for initialization is in main.js