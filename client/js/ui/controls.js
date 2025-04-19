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