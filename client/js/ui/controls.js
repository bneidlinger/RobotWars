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