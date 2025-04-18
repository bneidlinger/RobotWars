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