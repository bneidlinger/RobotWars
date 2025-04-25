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

    /** Shows the loadout builder overlay and populates data AFTER verifying auth */
    async show() { // Keep async
        if (!this.overlayElement) {
            console.error("Cannot show builder: Overlay element missing.");
            return;
        }
        console.log("[Builder Show] Showing overlay.");
        this.overlayElement.style.display = 'flex';
        this.isVisible = true;
        this.updateStatus("Verifying session..."); // Initial status

        // --- START: Verify Session Before Populating ---
        try {
            console.log("[Builder Show] Checking auth status via /api/auth/me before populating...");
            const authStatus = await apiCall('/api/auth/me'); // Call the 'me' endpoint

            if (!authStatus || !authStatus.isLoggedIn) {
                // This shouldn't happen right after login, but handle it
                console.error("[Builder Show] Auth check failed after login! User logged out unexpectedly?");
                this.updateStatus("Session error. Please try logging in again.", true);
                // Optionally, force logout/show login modal again via authHandler?
                // window.authHandler?._handleLogout(); // Force logout? Be cautious.
                this.loadConfiguration(null); // Load defaults
                return; // Stop further execution in show()
            }

            console.log("[Builder Show] Auth check successful. Proceeding with data population.");
            this.updateStatus("Loading data..."); // Update status

            // --- TODO: Fetch last used configuration name from API ---
            // (Keep this TODO for now)
            let initialConfigToLoad = null;
            // --------------------------------------------------------

            // Populate dropdowns via API now that session is confirmed
            await Promise.all([
                 this.populateLoadoutSelect(), // Fetches and caches loadouts
                 this.populateCodeSelect()     // Fetches and caches snippets
            ]);
            this.updateStatus("Data loaded.");

             // --- Decide which config to load initially (logic remains the same) ---
            if (!initialConfigToLoad && this.cachedLoadouts.length > 0) {
                 initialConfigToLoad = this.cachedLoadouts[0];
                 console.log(`[Builder Show] No last config preference found, loading first available: '${initialConfigToLoad.config_name}'`);
            } else if (initialConfigToLoad) {
                 console.log(`[Builder Show] TODO: Handle loading specific last config preference: '${initialConfigToLoad}'`);
                 const foundConfig = this.cachedLoadouts.find(cfg => cfg.config_name === initialConfigToLoad || cfg.id === initialConfigToLoad);
                 initialConfigToLoad = foundConfig || null;
            }

            // Load the selected config data (or null for defaults)
            this.loadConfiguration(initialConfigToLoad);
            console.log("[Builder Show] Initial configuration loaded/set.");

        } catch (error) {
            // Handle errors from the initial /api/auth/me call OR the populate calls
            console.error("[Builder Show] Error during initial auth check or data fetch:", error);
            // Check if it was the auth call specifically
            if (error.status === 401) {
                 this.updateStatus(`Session validation failed: ${error.message}`, true);
            } else {
                 this.updateStatus(`Error loading initial data: ${error.message}`, true);
            }
            this.loadConfiguration(null); // Load defaults on error
        }
        // --- END: Verify Session Before Populating ---
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