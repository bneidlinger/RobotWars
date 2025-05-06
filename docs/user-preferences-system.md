# User Preferences System

This document describes the User Preferences system implemented in Robot Wars, which allows for persistent user-specific preferences across sessions.

## Architecture

The preferences system consists of:

1. **Database Layer**: Uses a `user_preferences` table in PostgreSQL that stores key-value pairs per user
2. **Server API**: RESTful endpoints for CRUD operations on preferences
3. **Client Utility**: A client-side `PreferenceManager` class that interacts with the API

## Database Structure

The `user_preferences` table has the following schema:

```sql
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    preference_key VARCHAR(50) NOT NULL,
    preference_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key to users table
    CONSTRAINT fk_user_preferences_user_id
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
        
    -- Unique constraint to ensure one key per user
    CONSTRAINT unique_user_preference
        UNIQUE (user_id, preference_key)
);
```

## API Endpoints

All preference endpoints are protected with authentication middleware to ensure users can only access their own preferences.

- `GET /api/preferences` - Get all preferences for the logged-in user
- `GET /api/preferences/:key` - Get a specific preference value
- `PUT /api/preferences/:key` - Set a specific preference value
- `DELETE /api/preferences/:key` - Delete a specific preference

## Client-Side Usage

### PreferenceManager Class

The `PreferenceManager` class (`client/js/utils/preferences.js`) provides a simple interface for working with preferences:

```javascript
// Get a preference value
const value = await window.preferenceManager.getPreference('my_key');

// Set a preference value
await window.preferenceManager.setPreference('my_key', 'my_value');

// Delete a preference
await window.preferenceManager.deletePreference('my_key');
```

### Predefined Preference Keys

The preferences system defines standard keys for common preferences:

- `last_config_name` - The name of the last used loadout configuration
- `quick_start_enabled` - Whether to use the Quick Start option

These can be accessed via constants:

```javascript
// Constants for commonly used preference keys
const LAST_CONFIG = window.preferenceManager.KEYS.LAST_CONFIG;
const QUICK_START = window.preferenceManager.KEYS.QUICK_START;
```

### Helper Methods

The `PreferenceManager` also provides type-safe helper methods for common operations:

```javascript
// Set the last used config name
await window.preferenceManager.setLastConfigName('My Tank Build');

// Get the last used config name
const lastConfig = await window.preferenceManager.getLastConfigName();

// Enable/disable quick start
await window.preferenceManager.setQuickStartEnabled(true);

// Check if quick start is enabled
const isQuickStartEnabled = await window.preferenceManager.getQuickStartEnabled();
```

## Integration Points

The preferences system is integrated with the following components:

1. **LoadoutBuilder**:
   - Fetches the last used config on initialization
   - Saves the selected config name when entering the lobby
   - Sets the quick_start preference when using Quick Start

2. **Server Loadout Deletion**:
   - When a loadout is deleted, checks if it's the user's last used config
   - If it is, clears the preference to avoid errors

## Adding New Preferences

To add a new preference:

1. Define a new key constant in `PreferenceManager.KEYS`
2. Add helper methods in `PreferenceManager` if needed
3. Use the preference in your component

Example:

```javascript
// 1. Add to KEYS
this.KEYS = {
    LAST_CONFIG: 'last_config_name',
    QUICK_START: 'quick_start_enabled',
    MY_NEW_PREF: 'my_new_preference'
};

// 2. Add helper methods
async setMyNewPreference(value) {
    return await this.setPreference(this.KEYS.MY_NEW_PREF, value);
}

async getMyNewPreference() {
    return await this.getPreference(this.KEYS.MY_NEW_PREF);
}

// 3. Use in component
await window.preferenceManager.setMyNewPreference('value');
const value = await window.preferenceManager.getMyNewPreference();
```