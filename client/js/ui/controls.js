// client/js/ui/controls.js

/**
 * Controls handler for Robot Wars.
 * Manages button interactions (Run/Ready Up, Reset), code loading, appearance selection,
 * and player name input, sending relevant data to the server via the network handler.
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
        this.loadPlayerName(); // Load saved name on init
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
        const appearanceSelect = document.getElementById('robot-appearance-select');
        const playerNameInput = document.getElementById('playerName'); // Get the name input

        // Check if elements exist to prevent errors
        if (!runButton || !resetButton || !sampleCodeSelect || !appearanceSelect || !playerNameInput) {
            console.error("One or more control elements (button, select, player name input) not found in the DOM!");
            return; // Stop setup if elements are missing
        }

        // --- Run Button Listener ---
        // TODO: Update button text to "Ready Up" later when implementing explicit ready system
        runButton.addEventListener('click', () => {
            console.log('Run/Ready button clicked');

            // Get code from the CodeMirror editor (global variable 'editor')
            const playerCode = (typeof editor !== 'undefined') ? editor.getValue() : '';
            if (!playerCode) {
                alert("Code editor is empty!");
                return;
            }

            // Get the selected appearance value from the dropdown
            const chosenAppearance = appearanceSelect.value || 'default'; // Use 'default' as fallback

            // --- Get Player Name ---
            const nameValue = playerNameInput.value.trim();
            // Use entered name, or generate a default if empty
            const finalPlayerName = nameValue || `Anon_${Math.random().toString(16).slice(2, 6)}`;
            // Update input field in case we generated a default (optional)
            // playerNameInput.value = finalPlayerName;
            // --- End Get Player Name ---

            // Save name to localStorage
            this.savePlayerName(finalPlayerName);

            // Check network connection and call the appropriate network method
            if (this.network && this.network.socket && this.network.socket.connected) {
                console.log(`Submitting Data - Name: ${finalPlayerName}, Appearance: ${chosenAppearance}`);

                // Send code, appearance, AND name data to the server
                this.network.sendCodeAndAppearance(playerCode, chosenAppearance, finalPlayerName);

                // Provide user feedback & disable controls
                runButton.disabled = true;
                runButton.textContent = "Waiting for Match...";
                appearanceSelect.disabled = true; // Disable appearance change while waiting/playing
                playerNameInput.disabled = true; // Disable name input while waiting/playing

                // Optionally disable code editor too
                // if (typeof editor !== 'undefined') editor.setOption("readOnly", true);

            } else {
                // Handle cases where network is not available
                console.error("Network handler not available or not connected in Controls.");
                alert("Cannot connect to the server. Please check connection and refresh.");
                // Reset button state if submission failed (controls remain enabled)
                // No need to explicitly re-enable here as they weren't disabled
            }
        });

        // --- Reset Button Listener ---
        resetButton.addEventListener('click', () => {
            console.log('Reset button clicked');

            // Stop client-side rendering loop if running (might be overkill if game stop handles it)
            // this.game.stop(); // Consider if this is needed or if handleGameOver covers it

            // Clear the local canvas presentation
            if (this.game.arena) {
                this.game.arena.clear(); // Clears and draws background/grid
            }

            // Reset robot stats display locally
            if (window.dashboard) {
                 window.dashboard.updateStats([]); // Clear stats panel
            }

            // Re-enable UI elements for a new submission/ready up
            runButton.disabled = false;
            runButton.textContent = "Run Simulation"; // Or "Ready Up"
            appearanceSelect.disabled = false; // Allow changing appearance again
            playerNameInput.disabled = false; // Allow changing name again

            // if (typeof editor !== 'undefined') editor.setOption("readOnly", false);

            // TODO: Optionally send a message to the server indicating the player wants to leave/reset
            //       Especially important if they were 'Ready' in a lobby system.
            // if (this.network && this.network.socket && this.network.socket.connected) {
            //     this.network.socket.emit('playerResetRequest'); // Or 'playerUnready'
            // }
        });

        // --- Sample Code Loader Listener ---
        sampleCodeSelect.addEventListener('change', function() { // Using function for 'this' context
            const sample = this.value;
            // Check if the loadSampleCode function exists (defined in editor.js)
            if (sample && typeof loadSampleCode === 'function') {
                loadSampleCode(sample);
                // Reset the run button state if a new sample is loaded, potentially enabling it
                // Does NOT affect name input or appearance select state
                if (runButton.disabled && !this.game.running) { // Only reset if disabled AND game not running
                     runButton.disabled = false;
                     runButton.textContent = "Run Simulation"; // Or "Ready Up"
                     // Also re-enable other inputs if they were disabled pre-game
                     appearanceSelect.disabled = false;
                     playerNameInput.disabled = false;
                     // if (typeof editor !== 'undefined') editor.setOption("readOnly", false);
                }
            }
        });

        // --- Player Name Persistence Listener (Optional but recommended) ---
        // Save name when the input loses focus (blur event)
        playerNameInput.addEventListener('blur', () => {
            this.savePlayerName(playerNameInput.value.trim());
        });

    } // End setupEventListeners

    /**
     * Saves the player name to localStorage.
     * @param {string} name - The name to save.
     */
    savePlayerName(name) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('robotWarsPlayerName', name);
            // console.log('Player name saved:', name); // Debug log
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