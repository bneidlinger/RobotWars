// client/js/utils/storage.js

/**
 * Manages interactions with browser localStorage for RobotWars configurations.
 * Provides a centralized and safe way to get/set loadouts, code snippets,
 * player names, and the last used configuration preference.
 * Seeds default code snippets if none exist. // <-- Updated description
 */
class LocalStorageManager {
    constructor() {
        // Define localStorage keys in one place
        this.keys = {
            completeLoadouts: 'robotWarsCompleteLoadouts', // Stores { name: { name, visuals: {...}, codeLoadoutName: "..." } }
            codeSnippets: 'robotWarsLoadouts',             // Stores { name: "code string..." }
            lastConfig: 'robotWarsLastConfig',             // Stores name of last used complete loadout OR "quick_start"
            playerName: 'robotWarsPlayerName'              // Stores the last entered player name
        };

        // --- Default Code Snippets Data ---
        this.defaultSnippets = {
            'Simple Tank': `// Simple Tank Bot (using state object)
// Moves in a straight line until hit, then changes direction

// Initialize state ONCE
if (typeof state.currentDirection === 'undefined') {
    state.currentDirection = 0;
    state.lastDamage = 0; // Track damage from previous tick
    console.log('Simple Tank Initialized');
}

// Check if damage increased since last tick
if (robot.damage() > state.lastDamage) {
    console.log('Tank hit! Changing direction.');
    state.currentDirection = (state.currentDirection + 90 + Math.random() * 90) % 360;
}
state.lastDamage = robot.damage(); // Update damage tracking

// Move forward
robot.drive(state.currentDirection, 3);

// Scan for enemies - use 'let' for temporary variable
let scanResult = robot.scan(state.currentDirection, 45);

// Fire if enemy detected
if (scanResult) {
    robot.fire(scanResult.direction, 2);
}`,
            'Scanner Bot': `// Scanner Bot (using state object)
// Constantly rotates scanner and moves/fires if enemy found

// Initialize state ONCE
if (typeof state.scanAngle === 'undefined') {
    state.scanAngle = 0;
    console.log('Scanner Bot Initialized');
}

// Rotate scan angle
state.scanAngle = (state.scanAngle + 5) % 360;

// Scan for enemies - Use 'let' because it's recalculated each tick
let scanResult = robot.scan(state.scanAngle, 20);

// If enemy detected, move toward it and fire
if (scanResult) {
    robot.drive(scanResult.direction, 3);
    robot.fire(scanResult.direction, 3);
} else {
    // If no enemy, keep rotating but move slowly forward
    robot.drive(state.scanAngle, 1);
}`,
            'Aggressive Bot': `// Aggressive Bot (using state object)
// Seeks out enemies and fires continuously

// Initialize state ONCE
if (typeof state.targetDirection === 'undefined') {
    state.targetDirection = null;
    state.searchDirection = 0;
    state.searchMode = true;
    state.timeSinceScan = 0;
    console.log('Aggressive Bot Initialized');
}

state.timeSinceScan++;

// If we have a target, track and fire
if (!state.searchMode && state.targetDirection !== null) {
    if (state.timeSinceScan > 5) {
        // scanResult is correctly scoped here with 'const'
        const scanResult = robot.scan(state.targetDirection, 15);
        state.timeSinceScan = 0;

        if (scanResult) {
            state.targetDirection = scanResult.direction;
        } else {
            console.log('Aggro Bot lost target, returning to search.');
            state.searchMode = true;
            state.targetDirection = null;
        }
    }
    if (state.targetDirection !== null) {
        robot.drive(state.targetDirection, 4);
        robot.fire(state.targetDirection, 3);
    }

} else { // In search mode
    if (state.timeSinceScan > 2) {
        state.searchDirection = (state.searchDirection + 15) % 360;
        // scanResult is correctly scoped here with 'const'
        const scanResult = robot.scan(state.searchDirection, 30);
        state.timeSinceScan = 0;

        if (scanResult) {
            console.log('Aggro Bot found target!');
            state.targetDirection = scanResult.direction;
            state.searchMode = false;
            robot.drive(state.targetDirection, 4);
            robot.fire(state.targetDirection, 3);
        } else {
            robot.drive(state.searchDirection, 1);
        }
    } else {
         robot.drive(state.searchDirection, 1);
    }
}`
        };
        // --- End Default Snippets ---


        // Check if localStorage is available and usable
        this.isLocalStorageAvailable = this._checkLocalStorage();
        if (!this.isLocalStorageAvailable) {
            console.error("LocalStorageManager: localStorage is not available or disabled. Loadout persistence will not work.");
        } else {
            // --- Seed Default Snippets IF storage is available AND snippets don't exist ---
            this._seedDefaultSnippets();
            // ---------------------------------------------------------------------------
        }
    }

    /**
     * Checks if localStorage is supported and writable.
     * @private
     */
    _checkLocalStorage() {
        // ... (no changes to this method) ...
        let storage;
        try {
            storage = window.localStorage;
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    }

    /** Safely gets an item from localStorage */
    _getItem(key) {
        // ... (no changes to this method) ...
        if (!this.isLocalStorageAvailable) return null;
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error(`LocalStorageManager: Error reading item '${key}':`, error);
            return null;
        }
    }

    /** Safely sets an item in localStorage */
    _setItem(key, value) {
        // ... (no changes to this method) ...
        if (!this.isLocalStorageAvailable) return false;
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.error(`LocalStorageManager: Error setting item '${key}':`, error);
            if (error.name === 'QuotaExceededError') {
                alert("Could not save data: Browser storage quota exceeded. Try deleting old loadouts or code snippets.");
            } else {
                alert("An error occurred while trying to save data to browser storage.");
            }
            return false;
        }
    }

    /** Safely removes an item from localStorage */
    _removeItem(key) {
        // ... (no changes to this method) ...
        if (!this.isLocalStorageAvailable) return false;
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`LocalStorageManager: Error removing item '${key}':`, error);
            return false;
        }
    }

    // --- START: Seeding Logic ---
    /**
     * Checks if code snippets exist in localStorage and seeds defaults if not.
     * Only runs if localStorage is available.
     * @private
     */
    _seedDefaultSnippets() {
        // Check if the snippets key already exists
        const existingSnippets = this._getItem(this.keys.codeSnippets);

        // Only seed if the key is null or undefined (doesn't exist yet)
        if (existingSnippets === null) {
            console.log("LocalStorageManager: No existing code snippets found. Seeding defaults...");
            try {
                const stringifiedDefaults = JSON.stringify(this.defaultSnippets);
                if (this._setItem(this.keys.codeSnippets, stringifiedDefaults)) {
                    console.log("LocalStorageManager: Default code snippets seeded successfully.");
                } else {
                    // _setItem already logs the error and alerts the user
                    console.error("LocalStorageManager: Failed to save default snippets.");
                }
            } catch (error) {
                // Error during stringify (should be unlikely with predefined data)
                console.error("LocalStorageManager: Error stringifying default snippets:", error);
            }
        } else {
            // console.log("LocalStorageManager: Existing code snippets found. Skipping seeding.");
        }
    }
    // --- END: Seeding Logic ---


    // --- Complete Loadout Methods ---
    // ... (no changes to these methods) ...
    /** Retrieves all saved complete loadouts. */
    getCompleteLoadouts() {
        const storedData = this._getItem(this.keys.completeLoadouts);
        try {
            return storedData ? JSON.parse(storedData) : {};
        } catch (error) {
            console.error("LocalStorageManager: Error parsing complete loadouts:", error);
            return {}; // Return empty object on parse error
        }
    }
    /** Saves a single complete loadout configuration. Overwrites if name exists. */
    saveCompleteLoadout(name, loadoutData) {
        if (!name || !loadoutData) return false;
        const allLoadouts = this.getCompleteLoadouts();
        allLoadouts[name] = loadoutData; // Add or overwrite
        try {
            const stringifiedData = JSON.stringify(allLoadouts);
            return this._setItem(this.keys.completeLoadouts, stringifiedData);
        } catch (error) {
            console.error(`LocalStorageManager: Error stringifying complete loadouts for saving '${name}':`, error);
            return false;
        }
    }
    /** Deletes a single complete loadout configuration by name. */
    deleteCompleteLoadout(name) {
        if (!name) return false;
        const allLoadouts = this.getCompleteLoadouts();
        if (allLoadouts.hasOwnProperty(name)) {
            delete allLoadouts[name];
            try {
                const stringifiedData = JSON.stringify(allLoadouts);
                return this._setItem(this.keys.completeLoadouts, stringifiedData);
            } catch (error) {
                console.error(`LocalStorageManager: Error stringifying complete loadouts after deleting '${name}':`, error);
                return false;
            }
        }
        return true; // Return true if it didn't exist anyway
    }


    // --- Code Snippet Methods ---
    // ... (no changes to these methods) ...
     /** Retrieves all saved code snippets. */
    getCodeSnippets() {
        const storedData = this._getItem(this.keys.codeSnippets);
        try {
            return storedData ? JSON.parse(storedData) : {};
        } catch (error) {
            console.error("LocalStorageManager: Error parsing code snippets:", error);
            // If parsing fails, it might be corrupted. Should we return defaults?
            // For now, returning empty avoids overwriting potentially recoverable data.
            return {};
        }
    }
    /** Saves a single code snippet. Overwrites if name exists. */
    saveCodeSnippet(name, code) {
        if (!name || typeof code !== 'string') return false;
        const allSnippets = this.getCodeSnippets();
        allSnippets[name] = code; // Add or overwrite
        try {
            const stringifiedData = JSON.stringify(allSnippets);
            return this._setItem(this.keys.codeSnippets, stringifiedData);
        } catch (error) {
            console.error(`LocalStorageManager: Error stringifying code snippets for saving '${name}':`, error);
            return false;
        }
    }
    /** Deletes a single code snippet by name. */
    deleteCodeSnippet(name) {
        if (!name) return false;
        const allSnippets = this.getCodeSnippets();
        if (allSnippets.hasOwnProperty(name)) {
            delete allSnippets[name];
            try {
                const stringifiedData = JSON.stringify(allSnippets);
                return this._setItem(this.keys.codeSnippets, stringifiedData);
            } catch (error) {
                console.error(`LocalStorageManager: Error stringifying code snippets after deleting '${name}':`, error);
                return false;
            }
        }
        return true; // Return true if it didn't exist anyway
    }


    // --- Last Config Preference Methods ---
    // ... (no changes to these methods) ...
    /** Gets the last used configuration flag/name ("quick_start" or a loadout name). */
    getLastConfig() {
        return this._getItem(this.keys.lastConfig);
    }
    /** Sets the last used configuration flag/name. */
    setLastConfig(configName) {
        if (typeof configName === 'string') {
            return this._setItem(this.keys.lastConfig, configName);
        } else if (configName === null || configName === undefined) {
             return this._removeItem(this.keys.lastConfig);
        }
        console.warn("LocalStorageManager: Attempted to set last config with non-string value:", configName);
        return false;
    }


    // --- Player Name Methods ---
    // ... (no changes to these methods) ...
    /** Gets the saved player name. */
    getPlayerName() {
        return this._getItem(this.keys.playerName) || ''; // Return empty string if null
    }
    /** Saves the player name. Stores empty string if name is null/undefined/empty. */
    savePlayerName(name) {
        const nameToSave = (name || '').trim(); // Ensure it's a string and trim
        return this._setItem(this.keys.playerName, nameToSave);
    }


} // End LocalStorageManager Class