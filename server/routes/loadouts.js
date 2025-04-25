// server/routes/loadouts.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Ensure you have this middleware
const db = require('../db'); // Your database connection module

// Apply auth middleware to all loadout routes
// This ensures only logged-in users can access these endpoints
router.use(authMiddleware);

// GET /api/loadouts - Fetch all loadouts for the logged-in user
router.get('/', async (req, res) => {
    const userId = req.session.userId; // Get user ID from session (set during login)
    try {
        // Join with snippets table to get the snippet name along with the loadout data
        const query = `
            SELECT
                lc.id,                  -- Loadout config ID
                lc.config_name,         -- Name of the configuration (e.g., "My Tank Build")
                lc.robot_name,          -- Display name of the robot in game (e.g., "Destroyer")
                lc.visuals,             -- JSONB object with visual settings
                lc.code_snippet_id,     -- Foreign key to the code snippet
                cs.name AS code_snippet_name -- Get the actual name of the linked snippet
            FROM loadout_configs lc
            LEFT JOIN code_snippets cs ON lc.code_snippet_id = cs.id AND cs.user_id = lc.user_id -- Ensure snippet belongs to user too
            WHERE lc.user_id = $1       -- Filter by the logged-in user
            ORDER BY lc.config_name ASC; -- Sort alphabetically by config name
        `;
        const { rows } = await db.query(query, [userId]);
        // console.log(`[API Loadouts GET /] Found ${rows.length} loadouts for user ${userId}`);
        res.status(200).json(rows); // Send array of loadout objects
    } catch (error) {
        console.error('[API Loadouts GET /] Database error:', error);
        res.status(500).json({ message: 'Failed to fetch loadout configurations.' });
    }
});

// GET /api/loadouts/:configName - Fetch a specific loadout by name
router.get('/:configName', async (req, res) => {
    const userId = req.session.userId;
    const configName = req.params.configName; // Get name from URL parameter

    if (!configName) {
        return res.status(400).json({ message: 'Configuration name parameter is required.' });
    }

    try {
        // Decode the name in case it contains URL-encoded characters (e.g., spaces %20)
        const decodedConfigName = decodeURIComponent(configName);
        console.log(`[API Loadouts GET /:name] Request for config '${decodedConfigName}' user ${userId}`);

        // Query similar to the main GET, but filtered by user_id AND config_name
        const query = `
            SELECT
                lc.id, lc.config_name, lc.robot_name, lc.visuals, lc.code_snippet_id,
                cs.name AS code_snippet_name
            FROM loadout_configs lc
            LEFT JOIN code_snippets cs ON lc.code_snippet_id = cs.id AND cs.user_id = lc.user_id
            WHERE lc.user_id = $1 AND lc.config_name = $2; -- Filter by user and config name
        `;
        const { rows } = await db.query(query, [userId, decodedConfigName]);

        if (rows.length === 0) {
            console.log(`[API Loadouts GET /:name] Config '${decodedConfigName}' not found for user ${userId}`);
            return res.status(404).json({ message: 'Loadout configuration not found.' });
        }

        console.log(`[API Loadouts GET /:name] Fetched config '${decodedConfigName}' for user ${userId}`);
        res.status(200).json(rows[0]); // Send the single loadout object

    } catch (error) {
        console.error(`[API Loadouts GET /:name] Database error fetching '${configName}':`, error);
        res.status(500).json({ message: 'Failed to fetch loadout configuration.' });
    }
});


// POST /api/loadouts - Create or Update a loadout config for the logged-in user
router.post('/', async (req, res) => {
    const userId = req.session.userId;
    // Destructure expected fields from the client request body
    const { configName, robotName, visuals, codeLoadoutName } = req.body;

    // --- Server-Side Validation ---
    if (!configName || typeof configName !== 'string' || configName.trim().length === 0 || configName.length > 50) {
        return res.status(400).json({ message: 'Valid configuration name (1-50 chars) is required.' });
    }
    if (!robotName || typeof robotName !== 'string' || robotName.trim().length === 0 || robotName.length > 50) {
        return res.status(400).json({ message: 'Valid robot name (1-50 chars) is required.' });
    }
    if (!visuals || typeof visuals !== 'object') {
        return res.status(400).json({ message: 'Visuals data is missing or invalid.' });
    }
    // Basic visual structure check (can be more thorough if needed)
    if (!visuals.turret?.type || !visuals.turret?.color ||
        !visuals.chassis?.type || !visuals.chassis?.color ||
        !visuals.mobility?.type) {
        return res.status(400).json({ message: 'Visuals data structure is incomplete.' });
    }
    if (!codeLoadoutName || typeof codeLoadoutName !== 'string') {
        // Client should ensure a snippet is selected, but double-check here
        return res.status(400).json({ message: 'A valid code snippet name must be selected.' });
    }
    // --- End Validation ---

    const trimmedConfigName = configName.trim();
    const trimmedRobotName = robotName.trim();

    let client = null; // For database transaction
    try {
        client = await db.pool.connect(); // Get client from pool for transaction
        await client.query('BEGIN'); // Start the transaction

        // 1. Find the ID of the selected code snippet belonging to the user
        // Ensure the specified snippet actually exists and belongs to this user
        const snippetRes = await client.query(
            'SELECT id FROM code_snippets WHERE user_id = $1 AND name = $2',
            [userId, codeLoadoutName]
        );

        if (snippetRes.rows.length === 0) {
            // If snippet not found, rollback and return error
            await client.query('ROLLBACK');
            client.release(); // Release client before returning
            console.log(`[API Loadouts POST] Snippet '${codeLoadoutName}' not found for user ${userId}.`);
            return res.status(400).json({ message: `Selected code snippet '${codeLoadoutName}' not found.` });
        }
        const codeSnippetId = snippetRes.rows[0].id; // Get the foreign key ID

        // 2. Use INSERT ... ON CONFLICT to create or update the loadout config
        // This relies on a unique constraint on (user_id, config_name) in the DB table
        const upsertQuery = `
            INSERT INTO loadout_configs (user_id, config_name, robot_name, visuals, code_snippet_id)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id, config_name) -- Specify the columns for conflict detection
            DO UPDATE SET                     -- Define what to update if conflict occurs
                robot_name = EXCLUDED.robot_name,
                visuals = EXCLUDED.visuals,
                code_snippet_id = EXCLUDED.code_snippet_id
            RETURNING id, config_name, robot_name, visuals, code_snippet_id; -- Return the saved/updated row
        `;
        // Note: PostgreSQL handles JSON/JSONB parameters directly when using node-postgres
        const { rows } = await client.query(upsertQuery, [userId, trimmedConfigName, trimmedRobotName, visuals, codeSnippetId]);

        await client.query('COMMIT'); // Commit the transaction if all queries succeeded

        if (rows.length > 0) {
            console.log(`[API Loadouts POST] Loadout config '${trimmedConfigName}' saved/updated for user ${userId}`);
            // Return the saved data, including the snippet name for client-side consistency
            const savedLoadout = { ...rows[0], code_snippet_name: codeLoadoutName };
            res.status(200).json({ message: `Configuration '${trimmedConfigName}' saved.`, loadout: savedLoadout });
        } else {
            // This case should ideally not happen with RETURNING if upsert worked, but handle defensively
            console.error(`[API Loadouts POST] Failed to save/update loadout '${trimmedConfigName}' for user ${userId} (no rows returned after commit).`);
            res.status(500).json({ message: 'Failed to save configuration (post-commit error).' });
        }

    } catch (error) {
        if (client) {
            // Rollback the transaction in case of any error during the process
            await client.query('ROLLBACK');
        }
        console.error(`[API Loadouts POST] Database error saving loadout '${trimmedConfigName}':`, error);
        res.status(500).json({ message: 'Failed to save configuration due to server error.' });
    } finally {
        // IMPORTANT: Release the client back to the pool in all cases (success or error)
        if (client) {
            client.release();
        }
    }
});

// DELETE /api/loadouts/:configName - Delete loadout config by name for the user
router.delete('/:configName', async (req, res) => {
    const userId = req.session.userId;
    const configName = req.params.configName; // Get name from URL parameter

    if (!configName) {
        return res.status(400).json({ message: 'Configuration name parameter is required.' });
    }

    try {
        const decodedConfigName = decodeURIComponent(configName);
        console.log(`[API Loadouts DELETE] Attempting to delete config '${decodedConfigName}' for user ${userId}`);

        // TODO Optional: Check if this is the user's 'last_loadout_config_id' in the 'users' table
        // If it is, you might want to clear that field or set it to null before/after deleting.
        // Example: await db.query('UPDATE users SET last_loadout_config_id = NULL WHERE id = $1 AND last_loadout_config_id = (SELECT id FROM loadout_configs WHERE user_id = $1 AND config_name = $2)', [userId, decodedConfigName]);

        // Execute the delete operation
        const { rowCount } = await db.query(
            'DELETE FROM loadout_configs WHERE user_id = $1 AND config_name = $2',
            [userId, decodedConfigName]
        );

        if (rowCount > 0) {
            // Delete was successful
            console.log(`[API Loadouts DELETE] Config '${decodedConfigName}' deleted successfully for user ${userId}`);
            res.status(200).json({ message: `Configuration '${decodedConfigName}' deleted.` });
        } else {
            // No rows affected - config either didn't exist or didn't belong to the user
            console.log(`[API Loadouts DELETE] Config '${decodedConfigName}' not found for user ${userId} or delete failed.`);
            res.status(404).json({ message: 'Configuration not found.' });
        }
    } catch (error) {
        console.error(`[API Loadouts DELETE] Database error deleting config '${configName}':`, error);
        res.status(500).json({ message: 'Failed to delete configuration.' });
    }
});

module.exports = router; // Export the router for use in server/index.js