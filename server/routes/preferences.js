// server/routes/preferences.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Import auth middleware
const db = require('../db'); // Import db module

// Apply auth middleware to all preferences routes
// This ensures only logged-in users can access these endpoints
router.use(authMiddleware);

/**
 * API Endpoints for User Preferences
 * 
 * Preferences are stored as key-value pairs per user.
 * Common uses:
 * - last_config_name: The name of the last used loadout configuration
 * - quick_start_enabled: Whether quick start should be used (Boolean)
 */

// GET /api/preferences - Get all preferences for the logged-in user
router.get('/', async (req, res) => {
    const userId = req.session.userId;
    try {
        const query = 'SELECT preference_key, preference_value FROM user_preferences WHERE user_id = $1';
        const { rows } = await db.query(query, [userId]);
        
        // Convert rows to a more convenient object format
        const preferences = {};
        rows.forEach(row => {
            preferences[row.preference_key] = row.preference_value;
        });
        
        res.status(200).json(preferences);
    } catch (error) {
        console.error('[API Preferences GET /] Database error:', error);
        res.status(500).json({ message: 'Failed to fetch user preferences.' });
    }
});

// GET /api/preferences/:key - Get a specific preference by key
router.get('/:key', async (req, res) => {
    const userId = req.session.userId;
    const key = req.params.key;
    
    if (!key) {
        return res.status(400).json({ message: 'Preference key is required.' });
    }
    
    try {
        const query = 'SELECT preference_value FROM user_preferences WHERE user_id = $1 AND preference_key = $2';
        const { rows } = await db.query(query, [userId, key]);
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                message: `Preference '${key}' not found.`,
                preferenceKey: key,
                exists: false
            });
        }
        
        res.status(200).json({
            preferenceKey: key,
            preferenceValue: rows[0].preference_value,
            exists: true
        });
        
    } catch (error) {
        console.error(`[API Preferences GET /:key] Database error for key '${key}':`, error);
        res.status(500).json({ message: 'Failed to fetch preference.' });
    }
});

// PUT /api/preferences/:key - Set a specific preference
router.put('/:key', async (req, res) => {
    const userId = req.session.userId;
    const key = req.params.key;
    const { value } = req.body;
    
    if (!key) {
        return res.status(400).json({ message: 'Preference key is required.' });
    }
    
    if (value === undefined || value === null) {
        return res.status(400).json({ message: 'Preference value is required.' });
    }
    
    let client = null;
    try {
        client = await db.pool.connect(); // Get client for transaction
        await client.query('BEGIN'); // Start transaction
        
        // Use upsert (INSERT ... ON CONFLICT ... DO UPDATE) to handle both creation and update
        // Manually handle updated_at timestamp since we don't have a trigger
        const query = `
            INSERT INTO user_preferences (user_id, preference_key, preference_value, updated_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id, preference_key)
            DO UPDATE SET 
                preference_value = $3,
                updated_at = CURRENT_TIMESTAMP
            RETURNING preference_key, preference_value
        `;
        
        const { rows } = await client.query(query, [userId, key, value]);
        await client.query('COMMIT');
        
        res.status(200).json({
            message: `Preference '${key}' set successfully.`,
            preference: {
                key: rows[0].preference_key,
                value: rows[0].preference_value
            }
        });
        
    } catch (error) {
        if (client) {
            await client.query('ROLLBACK');
        }
        console.error(`[API Preferences PUT /:key] Database error setting '${key}':`, error);
        res.status(500).json({ message: 'Failed to set preference.' });
    } finally {
        if (client) {
            client.release();
        }
    }
});

// DELETE /api/preferences/:key - Delete a specific preference
router.delete('/:key', async (req, res) => {
    const userId = req.session.userId;
    const key = req.params.key;
    
    if (!key) {
        return res.status(400).json({ message: 'Preference key is required.' });
    }
    
    try {
        const query = 'DELETE FROM user_preferences WHERE user_id = $1 AND preference_key = $2';
        const { rowCount } = await db.query(query, [userId, key]);
        
        if (rowCount === 0) {
            return res.status(404).json({ message: `Preference '${key}' not found.` });
        }
        
        res.status(200).json({ message: `Preference '${key}' deleted successfully.` });
        
    } catch (error) {
        console.error(`[API Preferences DELETE /:key] Database error deleting '${key}':`, error);
        res.status(500).json({ message: 'Failed to delete preference.' });
    }
});

module.exports = router;