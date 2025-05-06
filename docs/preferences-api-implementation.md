# Preferences API Implementation

This document outlines the implementation of the Preferences API for Robot Wars, which enables persistent user preferences to be stored and retrieved between sessions.

## 1. Server-Side Implementation

### 1.1 Database Schema

Created a dedicated table for user preferences in PostgreSQL:

```sql
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite unique constraint to ensure one key per user
    CONSTRAINT user_preference_unique UNIQUE (user_id, preference_key),
    
    -- Foreign key to ensure user exists
    CONSTRAINT fk_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);
```

This schema allows for:
- Storing arbitrary key-value pairs for each user
- Automatic timestamps for creation and updates
- Cascading deletion when a user is deleted
- Enforcing uniqueness of preference keys per user

### 1.2 API Endpoints

Created a new API route file at `/server/routes/preferences.js` with the following endpoints:

1. **GET /api/preferences** - Retrieve all preferences for the current user
   - Returns preferences as a JSON object with preference keys as properties

2. **GET /api/preferences/:key** - Retrieve a specific preference by key
   - Returns a specific preference value or 404 if not found

3. **PUT /api/preferences/:key** - Create or update a specific preference
   - Uses PostgreSQL's upsert pattern (INSERT ... ON CONFLICT ... DO UPDATE)
   - Handles both primitive values and complex JSON objects

4. **DELETE /api/preferences/:key** - Delete a specific preference
   - Removes the preference from the database

All endpoints are protected with the authentication middleware, ensuring only authenticated users can access their own preferences.

### 1.3 Route Registration

Updated the server's main file (`server/index.js`) to register the new preferences routes:

```javascript
const preferencesRoutes = require('./routes/preferences');
app.use('/api/preferences', preferencesRoutes);
```

## 2. Client-Side Implementation

### 2.1 Preferences Manager Utility

Created a client-side utility (`client/js/utils/preferences.js`) that provides:

- A simple interface for getting, setting, and removing preferences
- Automatic caching of preferences to reduce API calls
- Error handling and logging

The utility exposes the following methods:
- `init()` - Loads all preferences from the server
- `get(key, defaultValue)` - Gets a preference value with optional default
- `set(key, value)` - Sets a preference value
- `remove(key)` - Removes a preference

### 2.2 Integration with Existing Code

Updated the Controls class to use the Preferences Manager for:

1. **Storing Last Used Loadout**
   - When a user selects or loads a code snippet, the name is saved as the `lastUsedLoadout` preference
   - This preference is automatically stored on the server

2. **Restoring Last Used Loadout**
   - When the loadout dropdown is populated, the system attempts to:
     1. Use an explicitly provided loadout name
     2. Use the last used loadout from preferences
     3. Fall back to the current value or empty selection

## 3. How to Use Preferences in Other Features

To integrate preferences with other features, use the global `PreferenceManager` instance:

```javascript
// Get a preference with a default value
const value = await window.PreferenceManager.get('preferenceName', defaultValue);

// Set a preference
await window.PreferenceManager.set('preferenceName', value);

// Remove a preference
await window.PreferenceManager.remove('preferenceName');
```

## 4. Example Use Cases

The implementation already includes:
- Remembering the last used code snippet/loadout

Additional potential uses include:
- UI customization settings (colors, layout)
- Game options (sound on/off, effects on/off)
- Code editor preferences (theme, font size)
- Tutorial completion status
- Notification preferences

## 5. Security Considerations

- All preferences API endpoints are protected with authentication middleware
- Each user can only access their own preferences
- Preferences are stored in a separate table to maintain data isolation
- SQL injection is prevented through parameterized queries