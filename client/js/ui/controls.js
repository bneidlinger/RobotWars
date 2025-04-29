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
                    // Use context 'Ready Up'
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
                 // Use context 'Test Code'
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
     * Fetches code based on context:
     * - 'Ready Up': Fetches code for the snippet linked in the Loadout Builder via API.
     * - 'Test Code': Gets the code directly from the live CodeMirror editor.
     * Uses the robot name and visuals currently set in the LoadoutBuilder instance for both contexts.
     * @private
     * @async
     * @param {string} context - 'Ready Up' or 'Test Code' for logging/errors and determining code source.
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
        console.log(`[Controls._prepareLoadoutData] Builder state for prepare:`, JSON.parse(JSON.stringify(builderState))); // DEBUG: Log builder state

        // --- Validation (Applies to both contexts) ---
        if (!robotName || typeof robotName !== 'string' || robotName.trim().length === 0) {
             return { loadoutData: null, error: `(${context}) Please set a Robot Name in the Loadout Builder.` };
        }
        if (!visuals || typeof visuals !== 'object') { // Add basic visuals check
            return { loadoutData: null, error: `(${context}) Visual configuration is missing. Open the builder.` };
        }
        // --- End Validation ---

        let codeToUse = null;
        let error = null;

        // --- START: Context-based Code Retrieval ---
        if (context === "Test Code") {
            console.log("[Controls._prepareLoadoutData] Context is 'Test Code'. Getting code from editor.");
            try {
                // Ensure editor instance exists and get its value
                if (typeof editor !== 'undefined' && typeof editor.getValue === 'function') {
                     codeToUse = editor.getValue();
                     if (typeof codeToUse !== 'string' || codeToUse.trim() === '') {
                         error = `(${context}) Code editor is empty. Cannot run test.`;
                         console.warn("[Controls._prepareLoadoutData] Editor is empty for Test Code.");
                     } else {
                         console.log("[Controls._prepareLoadoutData] Successfully retrieved code from live editor.");
                         this.updateLoadoutStatus(`(${context}) Using code from editor.`);
                     }
                } else {
                     error = `(${context}) Internal Error: Code editor instance not available.`;
                     console.error("[Controls._prepareLoadoutData] CodeMirror editor instance not found!");
                }
            } catch (e) {
                 error = `(${context}) Internal Error: Failed to get code from editor. ${e.message}`;
                 console.error("[Controls._prepareLoadoutData] Error getting code from editor:", e);
            }

        } else if (context === "Ready Up") {
            console.log("[Controls._prepareLoadoutData] Context is 'Ready Up'. Getting code via API.");
            // Validation specific to 'Ready Up' (needs a selected snippet name)
            if (!codeLoadoutName || typeof codeLoadoutName !== 'string' || codeLoadoutName.trim().length === 0) {
                 return { loadoutData: null, error: `(${context}) Please select a Code Snippet in the Loadout Builder.` };
            }

            this.updateLoadoutStatus(`(${context}) Fetching code for "${codeLoadoutName}"...`);
            try {
                 // --- Fetch the selected snippet's code ---
                 const encodedName = encodeURIComponent(codeLoadoutName);
                 const snippet = await apiCall(`/api/snippets/${encodedName}`, 'GET');

                 if (!snippet || typeof snippet.code !== 'string') {
                      // This is an error condition for Ready Up
                      error = `(${context}) API did not return valid code for snippet "${codeLoadoutName}". It might have been deleted. Check Loadout Builder.`;
                      console.error(`[Controls._prepareLoadoutData] Invalid API response for snippet ${codeLoadoutName}:`, snippet);
                 } else {
                      codeToUse = snippet.code;
                      console.log(`[Controls._prepareLoadoutData] Fetched Code Content for '${codeLoadoutName}'.`);
                      this.updateLoadoutStatus(`(${context}) Fetched code for ${codeLoadoutName}.`);
                 }

            } catch (fetchError) {
                 console.error(`[Controls._prepareLoadoutData] Error preparing loadout data for ${context}:`, fetchError);
                 let userMessage = fetchError.message || 'Unknown error.';
                 if (fetchError.status === 404) {
                     userMessage = `Selected code snippet "${codeLoadoutName}" not found. It might have been deleted. Check Loadout Builder.`;
                 } else if (fetchError.status === 401) {
                      userMessage = `Authentication error fetching code. Please log in again.`;
                 } else {
                     userMessage = `Failed to fetch code for "${codeLoadoutName}": ${userMessage}`;
                 }
                 error = `(${context}) ${userMessage}`; // Assign to the outer error variable
            }
        } else {
             // Unknown context
             error = `(${context}) Internal Error: Unknown context passed to _prepareLoadoutData.`;
             console.error(error);
        }
        // --- END: Context-based Code Retrieval ---


        // --- Final Check and Return ---
        if (error) {
             // An error occurred in either path
             return { loadoutData: null, error: error };
        }
        if (codeToUse === null || typeof codeToUse !== 'string') {
             // Should have been caught by specific error handling above, but as a fallback
             return { loadoutData: null, error: `(${context}) Failed to obtain valid robot code.` };
        }

        // If we reach here, we have name, visuals, and codeToUse
        const loadoutData = {
             name: robotName.trim(),
             visuals: visuals,
             code: codeToUse // Use the code obtained based on the context
        };

        console.log(`[Controls._prepareLoadoutData] Successfully prepared data for ${context}:`, { name: loadoutData.name, visuals: '...', code: '...' });
        this.updateLoadoutStatus(`(${context}) Loadout ready.`);
        return { loadoutData: loadoutData, error: null };

    } // <-- End _prepareLoadoutData


    // --- Code SNIPPET Management Methods (Using API) ---
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
                 // --- START: Added Refresh after loading code ---
                 // Sometimes needed if editor was hidden or dimensions changed
                 setTimeout(() => {
                     if(editor?.refresh) {
                         try { editor.refresh(); } catch(e) { console.error("Error refreshing editor after load:", e); }
                     }
                 }, 10); // Tiny delay
                 // --- END: Added Refresh ---
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

         // Store current value before clearing
         const currentValue = this.loadSnippetSelect.value;
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

                 // Try to re-select the provided name, then the original value, then default
                 if (selectName && snippets.some(s => s.name === selectName)) {
                     this.loadSnippetSelect.value = selectName;
                 } else if (currentValue && snippets.some(s => s.name === currentValue)){
                      this.loadSnippetSelect.value = currentValue;
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