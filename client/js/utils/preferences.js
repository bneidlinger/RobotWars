// client/js/utils/preferences.js

/**
 * Handles client-side interactions with the Preferences API.
 * Provides methods to get, set, and delete user preferences.
 */
class PreferenceManager {
    constructor() {
        // Constants for commonly used preference keys
        this.KEYS = {
            LAST_CONFIG: 'last_config_name',
            QUICK_START: 'quick_start_enabled'
        };
        
        console.log("PreferenceManager initialized");
    }

    /**
     * Gets the value of a specific preference.
     * @param {string} key - The preference key
     * @returns {Promise<any>} - The preference value or null if not found
     */
    async getPreference(key) {
        try {
            const response = await apiCall(`/api/preferences/${encodeURIComponent(key)}`, 'GET');
            if (response && response.exists) {
                return response.preferenceValue;
            }
            return null;
        } catch (error) {
            if (error.status === 404) {
                // Preference not found, return null
                return null;
            }
            // Re-throw other errors
            console.error(`[PreferenceManager] Error getting preference '${key}':`, error);
            throw error;
        }
    }

    /**
     * Gets all preferences for the current user.
     * @returns {Promise<Object>} - Object containing all preferences
     */
    async getAllPreferences() {
        try {
            return await apiCall('/api/preferences', 'GET');
        } catch (error) {
            console.error('[PreferenceManager] Error getting all preferences:', error);
            throw error;
        }
    }

    /**
     * Sets a preference value.
     * @param {string} key - The preference key
     * @param {any} value - The preference value
     * @returns {Promise<boolean>} - True if successful
     */
    async setPreference(key, value) {
        try {
            await apiCall(`/api/preferences/${encodeURIComponent(key)}`, 'PUT', { value });
            return true;
        } catch (error) {
            console.error(`[PreferenceManager] Error setting preference '${key}':`, error);
            throw error;
        }
    }

    /**
     * Deletes a preference.
     * @param {string} key - The preference key
     * @returns {Promise<boolean>} - True if successful
     */
    async deletePreference(key) {
        try {
            await apiCall(`/api/preferences/${encodeURIComponent(key)}`, 'DELETE');
            return true;
        } catch (error) {
            // Ignore 404 errors (preference not found)
            if (error.status === 404) {
                console.warn(`[PreferenceManager] Preference '${key}' not found for deletion`);
                return true;
            }
            console.error(`[PreferenceManager] Error deleting preference '${key}':`, error);
            throw error;
        }
    }

    /**
     * Sets the last used config name preference.
     * @param {string} configName - The config name
     * @returns {Promise<boolean>} - True if successful
     */
    async setLastConfigName(configName) {
        if (!configName || typeof configName !== 'string') {
            console.error('[PreferenceManager] Invalid config name for setLastConfigName:', configName);
            return false;
        }
        return await this.setPreference(this.KEYS.LAST_CONFIG, configName);
    }

    /**
     * Gets the last used config name preference.
     * @returns {Promise<string|null>} - The config name or null if not found
     */
    async getLastConfigName() {
        return await this.getPreference(this.KEYS.LAST_CONFIG);
    }

    /**
     * Sets the quick start enabled preference.
     * @param {boolean} enabled - Whether quick start is enabled
     * @returns {Promise<boolean>} - True if successful
     */
    async setQuickStartEnabled(enabled) {
        const value = String(Boolean(enabled)); // Convert to string "true" or "false"
        return await this.setPreference(this.KEYS.QUICK_START, value);
    }

    /**
     * Gets the quick start enabled preference.
     * @returns {Promise<boolean>} - True if quick start is enabled, false otherwise
     */
    async getQuickStartEnabled() {
        const value = await this.getPreference(this.KEYS.QUICK_START);
        return value === 'true'; // Convert string "true" to boolean true
    }
}

// Register that this script has loaded (if script loader is available)
if (window.scriptLoader) {
    window.scriptLoader.scriptLoaded('preferences.js');
}

// Create global instance
if (typeof window !== 'undefined') {
    window.preferenceManager = new PreferenceManager();
    // Also expose the class constructor globally
    window.PreferenceManager = PreferenceManager;
    console.log('[preferences.js] PreferenceManager instantiated and class exposed globally');
    
    // Add fallback support in case the API calls fail
    // Use a flag to track preference API availability
    window.preferenceApiAvailable = true;
    
    // Helper function for API calls
    const apiCall = async (url, method = 'GET', data = null) => {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin'
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }
        
        // Only try to parse JSON if there's content
        if (response.status !== 204) {
            return response.json();
        }
        return null;
    };
    
    // Test if the preferences API is available by making a test request
    apiCall('/api/preferences', 'GET')
        .then(() => {
            console.log('[preferences.js] API-based preferences are available');
            window.preferenceApiAvailable = true;
        })
        .catch((err) => {
            console.warn('[preferences.js] API-based preferences are NOT available:', err.message);
            console.log('[preferences.js] Switching to localStorage-based preference fallback');
            window.preferenceApiAvailable = false;
            
            // Replace the API-based preference manager with the fallback
            if (window.preferenceManagerFallback) {
                console.log('[preferences.js] Replacing API preferences with fallback');
                window.preferenceManager = window.preferenceManagerFallback;
            }
        });
}