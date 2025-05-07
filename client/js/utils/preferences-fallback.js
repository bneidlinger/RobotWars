// client/js/utils/preferences-fallback.js

/**
 * Fallback preferences manager that uses localStorage instead of the API.
 * To be used when the server-side preferences system is not available.
 */
class PreferenceManagerFallback {
    constructor() {
        this.KEYS = {
            LAST_CONFIG: 'last_config_name',
            QUICK_START: 'quick_start_enabled'
        };
        
        // Add a prefix to localStorage keys to avoid collisions
        this.PREFIX = 'robotwars_pref_';
        
        console.log("[Preferences] Using localStorage fallback instead of API");
    }

    /**
     * Gets the value of a specific preference from localStorage
     * @param {string} key - The preference key
     * @returns {Promise<any>} - The preference value or null if not found
     */
    async getPreference(key) {
        // Make it async to match the API version
        return new Promise((resolve) => {
            try {
                const value = localStorage.getItem(this.PREFIX + key);
                resolve(value !== null ? JSON.parse(value) : null);
            } catch (e) {
                console.warn(`[Preferences Fallback] Error reading preference '${key}':`, e);
                resolve(null);
            }
        });
    }

    /**
     * Gets all preferences for the current user from localStorage
     * @returns {Promise<Object>} - Object containing all preferences
     */
    async getAllPreferences() {
        return new Promise((resolve) => {
            try {
                const preferences = {};
                // Scan localStorage for keys with our prefix
                for (let i = 0; i < localStorage.length; i++) {
                    const storageKey = localStorage.key(i);
                    if (storageKey.startsWith(this.PREFIX)) {
                        const prefKey = storageKey.substring(this.PREFIX.length);
                        preferences[prefKey] = JSON.parse(localStorage.getItem(storageKey));
                    }
                }
                resolve(preferences);
            } catch (e) {
                console.warn('[Preferences Fallback] Error getting all preferences:', e);
                resolve({});
            }
        });
    }

    /**
     * Sets a preference value in localStorage
     * @param {string} key - The preference key
     * @param {any} value - The preference value
     * @returns {Promise<boolean>} - True if successful
     */
    async setPreference(key, value) {
        return new Promise((resolve) => {
            try {
                localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
                resolve(true);
            } catch (e) {
                console.warn(`[Preferences Fallback] Error setting preference '${key}':`, e);
                resolve(false);
            }
        });
    }

    /**
     * Deletes a preference from localStorage
     * @param {string} key - The preference key
     * @returns {Promise<boolean>} - True if successful
     */
    async deletePreference(key) {
        return new Promise((resolve) => {
            try {
                localStorage.removeItem(this.PREFIX + key);
                resolve(true);
            } catch (e) {
                console.warn(`[Preferences Fallback] Error deleting preference '${key}':`, e);
                resolve(false);
            }
        });
    }

    /**
     * Sets the last used config name preference
     * @param {string} configName - The config name
     * @returns {Promise<boolean>} - True if successful
     */
    async setLastConfigName(configName) {
        return this.setPreference(this.KEYS.LAST_CONFIG, configName);
    }

    /**
     * Gets the last used config name preference
     * @returns {Promise<string|null>} - The config name or null if not found
     */
    async getLastConfigName() {
        return this.getPreference(this.KEYS.LAST_CONFIG);
    }

    /**
     * Sets the quick start enabled preference
     * @param {boolean} enabled - Whether quick start is enabled
     * @returns {Promise<boolean>} - True if successful
     */
    async setQuickStartEnabled(enabled) {
        return this.setPreference(this.KEYS.QUICK_START, enabled);
    }

    /**
     * Gets the quick start enabled preference
     * @returns {Promise<boolean>} - True if quick start is enabled, false otherwise
     */
    async getQuickStartEnabled() {
        const value = await this.getPreference(this.KEYS.QUICK_START);
        return value === true; // Convert to boolean
    }
}

// Create global instance that will be used as a fallback
window.preferenceManagerFallback = new PreferenceManagerFallback();

// Expose the fallback class to the window
window.PreferenceManagerFallback = PreferenceManagerFallback;

console.log("[preferences-fallback.js] Fallback preference manager initialized");