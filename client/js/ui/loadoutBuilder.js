// client/js/ui/loadoutBuilder.js

/**
 * Manages the Loadout Builder overlay UI.
 * Handles selection of visual components, colors, code snippets, presets, robot name, config name,
 * saving/loading complete loadouts via API calls. Listens for snippet updates.
 * Initiates background music playback on main action button clicks.
 */
class LoadoutBuilder {
    constructor() {
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
        this.beaconTypeSelect = document.getElementById('beacon-type-select');
        this.beaconColorInput = document.getElementById('beacon-color-input');
        this.beaconStrobeCheckbox = document.getElementById('beacon-strobe-checkbox');
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
                 mobility: { type: 'wheels' },
                 beacon: { type: 'none', color: '#FF0000', strobe: false }
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

                    // --- Fetch last used config from preferences ---
                    let initialConfigToLoad = null;
                    
                    // Try to get the last config preference if preferenceManager is available
                    if (window && window.preferenceManager) {
                        try {
                            const lastConfigName = await window.preferenceManager.getLastConfigName();
                            if (lastConfigName) {
                                console.log(`[Builder Show] Found last config preference: '${lastConfigName}'`);
                                initialConfigToLoad = lastConfigName;
                            } else {
                                console.log('[Builder Show] No last config preference found.');
                            }
                        } catch (prefError) {
                            console.warn('[Builder Show] Error fetching last config preference:', prefError);
                            // Continue without preference data
                        }
                    } else {
                        console.warn('[Builder Show] PreferenceManager not available. Skipping last config preference.');
                    }

                    // Populate dropdowns via API now that session is confirmed
                    await Promise.all([
                        this.populateLoadoutSelect(),
                        this.populateCodeSelect()
                    ]);
                    this.updateStatus("Data loaded.");

                    // --- Decide which config to load initially (logic remains the same) ---
                    if (!initialConfigToLoad && this.cachedLoadouts.length > 0) {
                         initialConfigToLoad = this.cachedLoadouts[0]; // Load the first available config data object
                         console.log(`[Builder Show] Using first available config: '${initialConfigToLoad.config_name}'`);
                    } else if (initialConfigToLoad) {
                         console.log(`[Builder Show] Attempting to load specified config preference: '${initialConfigToLoad}'`);
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
        if (!this.currentLoadout.visuals.beacon) this.currentLoadout.visuals.beacon = {};
        this.currentLoadout.visuals.turret.type = this.turretTypeSelect.value;
        this.currentLoadout.visuals.turret.color = this.turretColorInput.value;
        this.currentLoadout.visuals.chassis.type = this.chassisTypeSelect.value;
        this.currentLoadout.visuals.chassis.color = this.chassisColorInput.value;
        this.currentLoadout.visuals.mobility.type = this.mobilityTypeSelect.value;
        this.currentLoadout.visuals.beacon.type = this.beaconTypeSelect.value;
        this.currentLoadout.visuals.beacon.color = this.beaconColorInput.value;
        this.currentLoadout.visuals.beacon.strobe = this.beaconStrobeCheckbox.checked;
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
        this.beaconTypeSelect.value = this.currentLoadout.visuals?.beacon?.type || 'none';
        this.beaconColorInput.value = this.currentLoadout.visuals?.beacon?.color || '#ff0000';
        this.beaconStrobeCheckbox.checked = this.currentLoadout.visuals?.beacon?.strobe || false;

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
        this.beaconTypeSelect.addEventListener('change', this._handleVisualSelectionChange.bind(this));
        this.beaconColorInput.addEventListener('input', this._handleVisualSelectionChange.bind(this));
        this.beaconStrobeCheckbox.addEventListener('change', this._handleVisualSelectionChange.bind(this));

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
        if (!this.currentLoadout.visuals.beacon) this.currentLoadout.visuals.beacon = {};
        this.currentLoadout.visuals.turret.type = this.turretTypeSelect.value;
        this.currentLoadout.visuals.turret.color = this.turretColorInput.value;
        this.currentLoadout.visuals.chassis.type = this.chassisTypeSelect.value;
        this.currentLoadout.visuals.chassis.color = this.chassisColorInput.value;
        this.currentLoadout.visuals.mobility.type = this.mobilityTypeSelect.value;
        this.currentLoadout.visuals.beacon.type = this.beaconTypeSelect.value;
        this.currentLoadout.visuals.beacon.color = this.beaconColorInput.value;
        this.currentLoadout.visuals.beacon.strobe = this.beaconStrobeCheckbox.checked;
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

        // --- Draw Robot Components (Enhanced versions matching Arena.js) ---
        ctx.lineWidth = 1 * scale;
        ctx.strokeStyle = '#111';

        // Draw the bot using similar helper methods as in Arena.js
        this._drawMobility(ctx, visuals.mobility?.type || 'wheels', baseRadius, visuals.chassis?.color || '#aaaaaa', scale);
        this._drawChassis(ctx, visuals.chassis?.type || 'medium', visuals.chassis?.color || '#aaaaaa', baseRadius, scale);
        this._drawTurret(ctx, visuals.turret?.type || 'standard', visuals.turret?.color || '#ffffff', baseRadius, scale);
        
        // Draw beacon if enabled
        if (visuals.beacon?.type && visuals.beacon.type !== 'none') {
            this._drawBeacon(ctx, visuals.beacon.type, visuals.beacon.color || '#ffffff', visuals.beacon.strobe || false, baseRadius, scale);
        }

        ctx.restore(); // Restore translation
    }

    /**
     * Draws the mobility component of a robot for the preview
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {string} mobilityType - Type of mobility component
     * @param {number} baseRadius - Base radius for scaling
     * @param {string} chassisColor - Color of chassis for coordinate mobility elements
     * @param {number} scale - Scale factor for preview
     */
    _drawMobility(ctx, mobilityType, baseRadius, chassisColor, scale) {
        ctx.fillStyle = '#555'; // Default mobility color
        const darkAccent = this._darkenColor(chassisColor, 0.7);
        
        let treadWidth = baseRadius * 2.0;
        let treadHeight = baseRadius * 0.6;
        let wheelRadius = baseRadius * 0.5;
        let hoverRadiusX = baseRadius * 1.2;
        let hoverRadiusY = baseRadius * 0.8;
        
        switch (mobilityType) {
            case 'treads':
                // Main treads
                ctx.fillStyle = darkAccent;
                ctx.fillRect(-treadWidth / 2, -treadHeight * 1.5, treadWidth, treadHeight); // Top tread
                ctx.fillRect(-treadWidth / 2, treadHeight * 0.5, treadWidth, treadHeight);  // Bottom tread
                ctx.strokeRect(-treadWidth / 2, -treadHeight * 1.5, treadWidth, treadHeight);
                ctx.strokeRect(-treadWidth / 2, treadHeight * 0.5, treadWidth, treadHeight);
                
                // Tread details - small rectangles to simulate treads
                ctx.fillStyle = '#333';
                const segmentWidth = 5 * scale;
                const segmentGap = 4 * scale;
                for (let x = -treadWidth/2 + 2*scale; x < treadWidth/2 - 2*scale; x += segmentGap) {
                    // Top tread details
                    ctx.fillRect(x, -treadHeight * 1.5 + 2*scale, segmentWidth, treadHeight - 4*scale);
                    // Bottom tread details
                    ctx.fillRect(x, treadHeight * 0.5 + 2*scale, segmentWidth, treadHeight - 4*scale);
                }
                break;
                
            case 'hover':
                // Hover effect glow
                ctx.save();
                ctx.fillStyle = 'rgba(100, 150, 255, 0.3)'; // Semi-transparent blue glow
                ctx.beginPath();
                ctx.ellipse(0, 0, hoverRadiusX * 1.2, hoverRadiusY * 1.2, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Inner glow
                ctx.fillStyle = 'rgba(160, 190, 255, 0.2)';
                ctx.beginPath();
                ctx.ellipse(0, 0, hoverRadiusX * 0.9, hoverRadiusY * 0.9, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                
                // Base hover pad
                ctx.beginPath();
                ctx.ellipse(0, 0, hoverRadiusX, hoverRadiusY, 0, 0, Math.PI * 2);
                ctx.fillStyle = darkAccent;
                ctx.fill();
                ctx.strokeStyle = '#88aaff';
                ctx.lineWidth = 1 * scale;
                ctx.stroke();
                
                // Hover vents
                ctx.fillStyle = '#222';
                ctx.beginPath();
                ctx.ellipse(-hoverRadiusX * 0.4, 0, hoverRadiusX * 0.2, hoverRadiusY * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(hoverRadiusX * 0.4, 0, hoverRadiusX * 0.2, hoverRadiusY * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'quad':
                // Four wheels at corners
                ctx.fillStyle = darkAccent;
                const offsetX = baseRadius * 0.9;
                const offsetY = baseRadius * 0.6;
                
                // Draw four wheels
                ctx.beginPath(); ctx.arc(-offsetX, -offsetY, wheelRadius * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(offsetX, -offsetY, wheelRadius * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(-offsetX, offsetY, wheelRadius * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(offsetX, offsetY, wheelRadius * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                
                // Wheel details
                ctx.fillStyle = '#222';
                ctx.beginPath(); ctx.arc(-offsetX, -offsetY, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(offsetX, -offsetY, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(-offsetX, offsetY, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(offsetX, offsetY, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                break;
                
            case 'legs':
                // Spider-like leg arrangement
                ctx.fillStyle = darkAccent;
                const legLength = baseRadius * 0.7;
                const legWidth = baseRadius * 0.2;
                
                // Four legs with joints
                // Front-right leg
                ctx.save();
                ctx.rotate(Math.PI/6);
                ctx.fillRect(0, -legWidth/2, legLength, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength, legWidth);
                ctx.translate(legLength, 0);
                ctx.rotate(Math.PI/4);
                ctx.fillRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.restore();
                
                // Back-right leg
                ctx.save();
                ctx.rotate(-Math.PI/6);
                ctx.fillRect(0, -legWidth/2, legLength, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength, legWidth);
                ctx.translate(legLength, 0);
                ctx.rotate(-Math.PI/4);
                ctx.fillRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.restore();
                
                // Front-left leg
                ctx.save();
                ctx.rotate(Math.PI*5/6);
                ctx.fillRect(0, -legWidth/2, legLength, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength, legWidth);
                ctx.translate(legLength, 0);
                ctx.rotate(-Math.PI/4);
                ctx.fillRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.restore();
                
                // Back-left leg
                ctx.save();
                ctx.rotate(-Math.PI*5/6);
                ctx.fillRect(0, -legWidth/2, legLength, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength, legWidth);
                ctx.translate(legLength, 0);
                ctx.rotate(Math.PI/4);
                ctx.fillRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.strokeRect(0, -legWidth/2, legLength*0.7, legWidth);
                ctx.restore();
                break;

            case 'wheels': default:
                // Standard two wheels
                ctx.fillStyle = darkAccent;
                
                // Main wheels
                ctx.beginPath(); ctx.arc(-baseRadius * 0.8, 0, wheelRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); // Left wheel
                ctx.beginPath(); ctx.arc(baseRadius * 0.8, 0, wheelRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();  // Right wheel
                
                // Wheel hubs
                ctx.fillStyle = '#222';
                ctx.beginPath(); ctx.arc(-baseRadius * 0.8, 0, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(baseRadius * 0.8, 0, wheelRadius * 0.4, 0, Math.PI * 2); ctx.fill();
                break;
        }
    }

    /**
     * Draws the chassis component of a robot for the preview
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {string} chassisType - Type of chassis
     * @param {string} chassisColor - Color of the chassis
     * @param {number} baseRadius - Base radius for scaling
     * @param {number} scale - Scale factor for preview
     */
    _drawChassis(ctx, chassisType, chassisColor, baseRadius, scale) {
        ctx.fillStyle = chassisColor;
        
        switch (chassisType) {
            case 'heavy':
                // Heavy armored chassis - more square, thicker
                const heavyWidth = baseRadius * 2.4;
                const heavyHeight = baseRadius * 1.6;
                const heavyBorderRadius = 4 * scale;
                
                // Draw chassis body (rounded rectangle)
                this._drawRoundedRect(ctx, -heavyWidth/2, -heavyHeight/2, heavyWidth, heavyHeight, heavyBorderRadius);
                
                // Draw armor plates/details
                ctx.fillStyle = this._darkenColor(chassisColor, 0.8);
                
                // Top armor strip
                this._drawRoundedRect(ctx, -heavyWidth/2 + 4*scale, -heavyHeight/2 + 3*scale, heavyWidth - 8*scale, heavyHeight/4, 2*scale);
                
                // Bottom armor strip
                this._drawRoundedRect(ctx, -heavyWidth/2 + 4*scale, heavyHeight/2 - heavyHeight/4 - 3*scale, heavyWidth - 8*scale, heavyHeight/4, 2*scale);
                
                // Center detail
                ctx.fillStyle = this._darkenColor(chassisColor, 0.6);
                ctx.beginPath();
                ctx.arc(0, 0, heavyHeight/4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;
                
            case 'light':
                // Light agile chassis - streamlined, angular
                const lightWidth = baseRadius * 1.7;
                const lightHeight = baseRadius * 1.2;
                
                // Main chassis - pointy front
                ctx.beginPath();
                ctx.moveTo(lightWidth/2, 0); // Front point
                ctx.lineTo(lightWidth/4, -lightHeight/2); // Top-right corner
                ctx.lineTo(-lightWidth/2, -lightHeight/2); // Top-left corner
                ctx.lineTo(-lightWidth/2, lightHeight/2); // Bottom-left corner
                ctx.lineTo(lightWidth/4, lightHeight/2); // Bottom-right corner
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Detail lines
                ctx.strokeStyle = this._darkenColor(chassisColor, 0.7);
                ctx.beginPath();
                ctx.moveTo(-lightWidth/3, -lightHeight/2);
                ctx.lineTo(0, 0);
                ctx.lineTo(-lightWidth/3, lightHeight/2);
                ctx.stroke();
                break;
                
            case 'hexagonal':
                // Hex-shaped chassis
                const hexWidth = baseRadius * 2.2;
                const hexHeight = baseRadius * 1.5;
                const hexSide = hexHeight / 2;
                
                // Draw hexagon
                ctx.beginPath();
                ctx.moveTo(hexWidth/2, 0); // Right point
                ctx.lineTo(hexWidth/4, -hexSide); // Top-right
                ctx.lineTo(-hexWidth/4, -hexSide); // Top-left
                ctx.lineTo(-hexWidth/2, 0); // Left point
                ctx.lineTo(-hexWidth/4, hexSide); // Bottom-left
                ctx.lineTo(hexWidth/4, hexSide); // Bottom-right
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Hex detail
                ctx.fillStyle = this._darkenColor(chassisColor, 0.85);
                ctx.beginPath();
                ctx.arc(0, 0, hexHeight/4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;
                
            case 'triangular':
                // Triangle-shaped chassis
                const triWidth = baseRadius * 2.2;
                const triHeight = baseRadius * 1.8;
                
                // Draw Triangle
                ctx.beginPath();
                ctx.moveTo(triWidth/2, 0); // Point facing forward
                ctx.lineTo(-triWidth/2, -triHeight/2); // Top-left
                ctx.lineTo(-triWidth/2, triHeight/2); // Bottom-left
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Triangle details - smaller inner triangle
                ctx.fillStyle = this._darkenColor(chassisColor, 0.8);
                ctx.beginPath();
                ctx.moveTo(triWidth/4, 0);
                ctx.lineTo(-triWidth/3, -triHeight/3);
                ctx.lineTo(-triWidth/3, triHeight/3);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;

            case 'medium': default:
                // Standard rounded chassis
                const mediumWidth = baseRadius * 2.0;
                const mediumHeight = baseRadius * 1.4;
                const mediumBorderRadius = 3 * scale;
                
                // Draw chassis body
                this._drawRoundedRect(ctx, -mediumWidth/2, -mediumHeight/2, mediumWidth, mediumHeight, mediumBorderRadius);
                
                // Add detail lines
                ctx.strokeStyle = this._darkenColor(chassisColor, 0.7);
                ctx.beginPath();
                ctx.moveTo(-mediumWidth/3, -mediumHeight/2);
                ctx.lineTo(-mediumWidth/3, mediumHeight/2);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(mediumWidth/6, -mediumHeight/2);
                ctx.lineTo(mediumWidth/6, mediumHeight/2);
                ctx.stroke();
                
                // Reset stroke style
                ctx.strokeStyle = '#111';
                break;
        }
    }

    /**
     * Draws the turret component of a robot for the preview
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {string} turretType - Type of turret
     * @param {string} turretColor - Color of the turret
     * @param {number} baseRadius - Base radius for scaling
     * @param {number} scale - Scale factor for preview
     */
    _drawTurret(ctx, turretType, turretColor, baseRadius, scale) {
        ctx.fillStyle = turretColor;
        ctx.strokeStyle = '#111'; // Reset stroke for turret
        
        switch (turretType) {
            case 'cannon':
                // Heavy cannon turret
                const cannonBaseRadius = baseRadius * 0.7; 
                const cannonLength = baseRadius * 1.5; 
                const cannonWidth = baseRadius * 0.4;
                
                // Rectangular turret base
                ctx.beginPath(); 
                ctx.rect(-cannonBaseRadius * 0.5, -cannonBaseRadius * 0.8, cannonBaseRadius, cannonBaseRadius * 1.6); 
                ctx.fill(); 
                ctx.stroke();
                
                // Cannon barrel
                ctx.fillRect(cannonBaseRadius * 0.5, -cannonWidth / 2, cannonLength, cannonWidth); 
                ctx.strokeRect(cannonBaseRadius * 0.5, -cannonWidth / 2, cannonLength, cannonWidth);
                
                // Barrel reinforcement
                ctx.fillStyle = this._darkenColor(turretColor, 0.8);
                ctx.fillRect(cannonBaseRadius * 0.5, -cannonWidth / 2, cannonWidth/2, cannonWidth);
                ctx.strokeRect(cannonBaseRadius * 0.5, -cannonWidth / 2, cannonWidth/2, cannonWidth);
                
                // Muzzle brake
                ctx.fillStyle = this._darkenColor(turretColor, 0.6);
                ctx.fillRect(cannonBaseRadius * 0.5 + cannonLength - cannonWidth/2, -cannonWidth/2 - cannonWidth/4, cannonWidth/2, cannonWidth * 1.5);
                ctx.strokeRect(cannonBaseRadius * 0.5 + cannonLength - cannonWidth/2, -cannonWidth/2 - cannonWidth/4, cannonWidth/2, cannonWidth * 1.5);
                break;
                
            case 'laser':
                // High-tech laser turret
                const laserBaseRadius = baseRadius * 0.5; 
                const laserLength = baseRadius * 1.7; 
                const laserWidth = baseRadius * 0.2;
                
                // Round turret base
                ctx.beginPath(); 
                ctx.arc(0, 0, laserBaseRadius, 0, Math.PI * 2); 
                ctx.fill(); 
                ctx.stroke();
                
                // Thin laser barrel
                ctx.fillRect(laserBaseRadius*0.8, -laserWidth / 2, laserLength, laserWidth); 
                ctx.strokeRect(laserBaseRadius*0.8, -laserWidth / 2, laserLength, laserWidth);
                
                // Energy coils around barrel
                const coilCount = 3;
                const coilSpacing = laserLength / (coilCount + 1);
                const coilHeight = laserWidth * 2;
                
                ctx.fillStyle = this._lightenColor(turretColor, 1.3);
                for (let i = 1; i <= coilCount; i++) {
                    const coilX = laserBaseRadius*0.8 + i * coilSpacing;
                    ctx.beginPath();
                    ctx.rect(coilX - laserWidth/2, -coilHeight/2, laserWidth, coilHeight);
                    ctx.fill();
                    ctx.stroke();
                }
                
                // Emitter tip
                ctx.fillStyle = '#88CCFF';
                ctx.beginPath();
                ctx.arc(laserBaseRadius*0.8 + laserLength, 0, laserWidth, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;
                
            case 'dual':
                // Dual barrel turret
                const dualBaseRadius = baseRadius * 0.6;
                const dualLength = baseRadius * 1.2;
                const dualWidth = baseRadius * 0.25;
                const dualGap = dualWidth * 0.8;
                
                // Round base with detail
                ctx.beginPath();
                ctx.arc(0, 0, dualBaseRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                // Detail circle in center
                ctx.fillStyle = this._darkenColor(turretColor, 0.8);
                ctx.beginPath();
                ctx.arc(0, 0, dualBaseRadius * 0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                // Reset fill color
                ctx.fillStyle = turretColor;
                
                // Upper barrel
                ctx.fillRect(dualBaseRadius*0.8, -dualGap/2 - dualWidth, dualLength, dualWidth);
                ctx.strokeRect(dualBaseRadius*0.8, -dualGap/2 - dualWidth, dualLength, dualWidth);
                
                // Lower barrel
                ctx.fillRect(dualBaseRadius*0.8, dualGap/2, dualLength, dualWidth);
                ctx.strokeRect(dualBaseRadius*0.8, dualGap/2, dualLength, dualWidth);
                break;
                
            case 'missile':
                // Missile launcher turret
                const missileBaseRadius = baseRadius * 0.7;
                const missileLength = baseRadius * 1.1;
                const missileWidth = baseRadius * 1.0;
                const missileCount = 3; // Visible missile tubes
                
                // Rectangular base
                this._drawRoundedRect(ctx, -missileBaseRadius*0.7, -missileBaseRadius*0.7, missileBaseRadius*1.4, missileBaseRadius*1.4, 2*scale);
                
                // Launcher box
                ctx.fillStyle = this._darkenColor(turretColor, 0.8);
                this._drawRoundedRect(ctx, missileBaseRadius*0.6, -missileWidth/2, missileLength, missileWidth, 2*scale);
                
                // Missile tubes
                const tubeHeight = missileWidth / (missileCount + 1);
                ctx.fillStyle = '#333';
                
                for (let i = 1; i <= missileCount; i++) {
                    const tubeY = -missileWidth/2 + i * tubeHeight;
                    this._drawRoundedRect(ctx, missileBaseRadius*0.7, tubeY - tubeHeight*0.4, missileLength*0.8, tubeHeight*0.8, 2*scale);
                }
                break;

            case 'standard': default:
                // Standard turret with medium barrel
                const stdBaseRadius = baseRadius * 0.6; 
                const stdLength = baseRadius * 1.3; 
                const stdWidth = baseRadius * 0.3;
                
                // Round turret base
                ctx.beginPath(); 
                ctx.arc(0, 0, stdBaseRadius, 0, Math.PI * 2); 
                ctx.fill(); 
                ctx.stroke();
                
                // Center detail
                ctx.fillStyle = this._darkenColor(turretColor, 0.8);
                ctx.beginPath();
                ctx.arc(0, 0, stdBaseRadius * 0.4, 0, Math.PI * 2);
                ctx.fill();
                
                // Reset fill color for barrel
                ctx.fillStyle = turretColor;
                
                // Standard barrel
                ctx.fillRect(stdBaseRadius*0.8, -stdWidth / 2, stdLength, stdWidth); 
                ctx.strokeRect(stdBaseRadius*0.8, -stdWidth / 2, stdLength, stdWidth);
                
                // Barrel detail
                ctx.fillStyle = this._darkenColor(turretColor, 0.7);
                ctx.fillRect(stdBaseRadius*0.8 + stdLength - stdWidth, -stdWidth / 2, stdWidth, stdWidth);
                ctx.strokeRect(stdBaseRadius*0.8 + stdLength - stdWidth, -stdWidth / 2, stdWidth, stdWidth);
                break;
        }
    }

    /**
     * Helper method to draw a rounded rectangle
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {number} x - X coordinate of top-left corner
     * @param {number} y - Y coordinate of top-left corner
     * @param {number} width - Width of rectangle
     * @param {number} height - Height of rectangle
     * @param {number} radius - Corner radius
     */
    _drawRoundedRect(ctx, x, y, width, height, radius) {
        // Ensure radius is not too large for the rectangle
        radius = Math.min(radius, Math.min(width / 2, height / 2));
        
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Helper method to darken a color
     * @param {string} color - Hex color string
     * @param {number} factor - Factor to darken by (0-1, where lower is darker)
     * @returns {string} Darkened hex color
     */
    _darkenColor(color, factor) {
        // Convert hex to RGB
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);
        
        // Apply darkening factor
        r = Math.max(0, Math.floor(r * factor));
        g = Math.max(0, Math.floor(g * factor));
        b = Math.max(0, Math.floor(b * factor));
        
        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /**
     * Helper method to lighten a color
     * @param {string} color - Hex color string
     * @param {number} factor - Factor to lighten by (>1 for lighter)
     * @returns {string} Lightened hex color
     */
    _lightenColor(color, factor) {
        // Convert hex to RGB
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);
        
        // Apply lightening factor
        r = Math.min(255, Math.floor(r * factor));
        g = Math.min(255, Math.floor(g * factor));
        b = Math.min(255, Math.floor(b * factor));
        
        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /** Handles the Enter Lobby button click */
    async _handleEnterLobbyClick() {
        console.log("[Enter Lobby] Clicked.");

        // --- START: Attempt Music Start ---
        // Use global audioManager instance
        if (typeof audioManager !== 'undefined' && audioManager.requestMusicStart) {
            console.log("[Loadout Builder] Requesting music start on Enter Lobby click.");
            audioManager.requestMusicStart(); // Call this BEFORE potential async ops or hiding
        }
        // --- END: Attempt Music Start ---

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
             // Save this as the 'last used' config in preferences
             if (window && window.preferenceManager) {
                 try {
                     await window.preferenceManager.setLastConfigName(configName);
                     console.log(`[Enter Lobby] Saved last config preference: '${configName}'`);
                 } catch (prefError) {
                     console.warn(`[Enter Lobby] Error saving last config preference:`, prefError);
                     // Continue without saving preference
                 }
             } else {
                console.warn('[Enter Lobby] PreferenceManager not available. Skipping save of last config preference.');
             }

        } catch (error) {
            console.error(`[Enter Lobby] API Error saving final config "${configName}":`, error);
            this.updateStatus(`Error saving final config: ${error.message}`, true);
            alert(`Failed to save configuration "${configName}" before entering lobby:\n${error.message}`);
            return; // Don't proceed if save failed
        }
        // --- End Save ---

        this.hide(); // Hide builder AFTER attempting music start and save

        const selectedSnippetName = finalConfig.codeLoadoutName;
        // Use global controls instance
        if (selectedSnippetName && typeof controls !== 'undefined' && controls.loadCodeSnippet) {
            console.log(`[Enter Lobby] Loading snippet '${selectedSnippetName}' into main editor.`);
            // Use the Controls method which handles API call and editor update
            controls.loadCodeSnippet(selectedSnippetName);
        } else {
            console.warn(`[Enter Lobby] Could not update main editor. Snippet: ${selectedSnippetName}, Controls: ${typeof controls}`);
        }

        // Update header icon (using global controls instance)
        if (typeof controls !== 'undefined' && controls?.updatePlayerHeaderDisplay) {
             controls.updatePlayerHeaderDisplay();
        }

        // Connect network (using global network instance)
        // Note: Connection is likely already handled by onLoginSuccess now,
        // but this ensures controls state is updated correctly.
        // Use global network instance
        if (typeof network !== 'undefined') {
             if (network.socket?.connected) {
                  console.log(`[Enter Lobby] Network connected. Setting Controls state.`);
                   // Use global controls instance
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

        // --- START: Attempt Music Start ---
        // Use global audioManager instance
        if (typeof audioManager !== 'undefined' && audioManager.requestMusicStart) {
            console.log("[Loadout Builder] Requesting music start on Quick Start click.");
            audioManager.requestMusicStart(); // Call this BEFORE potential async ops or hiding
        }
        // --- END: Attempt Music Start ---

        this.loadConfiguration(null); // Reset UI to defaults

        // Save quick_start preference
        if (window && window.preferenceManager) {
            try {
                // We set quick_start_enabled to true and also clear the last_config_name
                // so that next time the user logs in, they'll get the Quick Start experience
                await Promise.all([
                    window.preferenceManager.setQuickStartEnabled(true),
                    window.preferenceManager.deletePreference(window.preferenceManager.KEYS.LAST_CONFIG)
                ]);
                console.log("[Quick Start] Saved quick_start preference and cleared last config.");
                this.updateStatus("Quick Start selected.");
            } catch (prefError) {
                console.warn("[Quick Start] Error saving quick_start preference:", prefError);
                this.updateStatus("Quick Start selected (Preference not saved).");
            }
        } else {
            console.warn("[Quick Start] PreferenceManager not available. Skipping preference save.");
            this.updateStatus("Quick Start selected.");
        }

         this.hide(); // Hide builder AFTER attempting music start

         // Update header icon (using global controls instance)
         if (typeof controls !== 'undefined' && controls?.updatePlayerHeaderDisplay) {
              controls.updatePlayerHeaderDisplay();
         }

         // Connect network / Update state (Similar logic as Enter Lobby)
         // Use global network instance
         if (typeof network !== 'undefined') {
             if (network.socket?.connected) {
                 console.log(`[Quick Start] Network connected. Setting Controls state.`);
                  // Use global controls instance
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
    
    /**
     * Draws a beacon/light on top of a robot in the preview
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {string} beaconType - Type of beacon (led, robot, antenna)
     * @param {string} beaconColor - Color of the beacon light
     * @param {boolean} strobe - Whether the beacon should strobe/flash (for preview we always show it on)
     * @param {number} baseRadius - Base radius for scaling
     * @param {number} scale - Scale factor for preview
     */
    _drawBeacon(ctx, beaconType, beaconColor, strobe, baseRadius, scale) {
        // Skip if type is none or not specified
        if (!beaconType || beaconType === 'none') return;
        
        // For preview, we always show the light on (no strobing in preview)
        const shouldFlash = true; // Always on for preview
        
        // Base beacon properties
        const beaconSize = baseRadius * 0.3;
        const beaconHeight = baseRadius * 0.6;
        const yOffset = -baseRadius * 0.5; // Raise above the turret
        
        // Save context for glow effects
        ctx.save();
        
        // Draw different beacon types
        switch (beaconType) {
            case 'led':
                // Simple LED bulb with glow
                // Base
                ctx.fillStyle = '#333333';
                ctx.beginPath();
                ctx.arc(0, yOffset - beaconSize * 0.5, beaconSize * 1.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#222222';
                ctx.lineWidth = 1 * scale;
                ctx.stroke();
                
                // Light dome
                if (shouldFlash) {
                    // Light is on
                    // Add glow effect
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.shadowColor = beaconColor;
                    ctx.shadowBlur = beaconSize * 4;
                    
                    // Outer glow
                    ctx.fillStyle = this._lightenColor(beaconColor, 0.7);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconSize, beaconSize * 1.5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Bright center
                    ctx.fillStyle = this._lightenColor(beaconColor, 1.2);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconSize, beaconSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case 'robot':
                // Robot-style light with tech details
                // Base mounting plate
                ctx.fillStyle = '#333333';
                this._drawRoundedRect(ctx, -beaconSize * 1.5, yOffset - beaconSize * 0.5, beaconSize * 3, beaconSize, beaconSize * 0.3);
                
                // Tech details on base
                ctx.fillStyle = '#222222';
                this._drawRoundedRect(ctx, -beaconSize * 1.2, yOffset - beaconSize * 0.3, beaconSize * 0.7, beaconSize * 0.6, beaconSize * 0.2);
                this._drawRoundedRect(ctx, beaconSize * 0.5, yOffset - beaconSize * 0.3, beaconSize * 0.7, beaconSize * 0.6, beaconSize * 0.2);
                
                // Light housing
                ctx.fillStyle = '#444444';
                ctx.beginPath();
                ctx.arc(0, yOffset - beaconSize * 0.7, beaconSize * 0.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#222222';
                ctx.lineWidth = 1 * scale;
                ctx.stroke();
                
                if (shouldFlash) {
                    // Light is on
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.shadowColor = beaconColor;
                    ctx.shadowBlur = beaconSize * 4;
                    
                    // Outer glow
                    ctx.fillStyle = this._lightenColor(beaconColor, 0.8);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconSize * 0.7, beaconSize, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Bright center
                    ctx.fillStyle = this._lightenColor(beaconColor, 1.3);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconSize * 0.7, beaconSize * 0.6, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case 'antenna':
                // Antenna with light on top
                // Antenna base
                ctx.fillStyle = '#333333';
                ctx.beginPath();
                ctx.arc(0, yOffset, beaconSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#222222';
                ctx.lineWidth = 1 * scale;
                ctx.stroke();
                
                // Antenna pole
                ctx.fillStyle = '#666666';
                ctx.fillRect(-beaconSize * 0.2, yOffset - beaconHeight, beaconSize * 0.4, beaconHeight);
                ctx.strokeStyle = '#444444';
                ctx.strokeRect(-beaconSize * 0.2, yOffset - beaconHeight, beaconSize * 0.4, beaconHeight);
                
                // Optional antenna details
                ctx.fillStyle = '#888888';
                ctx.fillRect(-beaconSize * 0.3, yOffset - beaconHeight * 0.7, beaconSize * 0.6, beaconSize * 0.3);
                ctx.strokeStyle = '#444444';
                ctx.strokeRect(-beaconSize * 0.3, yOffset - beaconHeight * 0.7, beaconSize * 0.6, beaconSize * 0.3);
                
                if (shouldFlash) {
                    // Light is on
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.shadowColor = beaconColor;
                    ctx.shadowBlur = beaconSize * 4;
                    
                    // Outer glow
                    ctx.fillStyle = this._lightenColor(beaconColor, 0.8);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconHeight - beaconSize * 0.5, beaconSize * 1.2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Bright center
                    ctx.fillStyle = this._lightenColor(beaconColor, 1.3);
                    ctx.beginPath();
                    ctx.arc(0, yOffset - beaconHeight - beaconSize * 0.5, beaconSize * 0.8, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            default:
                // Simple beacon as fallback
                if (shouldFlash) {
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.shadowColor = beaconColor;
                    ctx.shadowBlur = beaconSize * 3;
                    
                    ctx.fillStyle = beaconColor;
                    ctx.beginPath();
                    ctx.arc(0, yOffset, beaconSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
        }
        
        // Restore context
        ctx.restore();
    }

} // End LoadoutBuilder Class