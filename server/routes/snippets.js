// server/routes/snippets.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../db');

// Apply auth middleware to all snippet routes
router.use(authMiddleware);

// GET /api/snippets - Fetch all snippets for the logged-in user
router.get('/', async (req, res) => {
    const userId = req.session.userId;
    try {
        const { rows } = await db.query(
            'SELECT id, name, code FROM code_snippets WHERE user_id = $1 ORDER BY name ASC',
            [userId]
        );
        // console.log(`[API Snippets GET /] Found ${rows.length} snippets for user ${userId}`);
        res.status(200).json(rows); // Send array of {id, name, code}
    } catch (error) {
        console.error('[API Snippets GET /] Database error:', error);
        res.status(500).json({ message: 'Failed to fetch snippets.' });
    }
});

// GET /api/snippets/:snippetName - Fetch a specific snippet by name for the logged-in user
router.get('/:snippetName', async (req, res) => {
    const userId = req.session.userId;
    const snippetName = req.params.snippetName; // Name comes from URL parameter

    if (!snippetName) {
        return res.status(400).json({ message: 'Snippet name parameter is required.' });
    }

    try {
        const decodedSnippetName = decodeURIComponent(snippetName);
        const { rows } = await db.query(
            'SELECT id, name, code FROM code_snippets WHERE user_id = $1 AND name = $2',
            [userId, decodedSnippetName]
        );

        if (rows.length === 0) {
            console.log(`[API Snippets GET /:name] Snippet '${decodedSnippetName}' not found for user ${userId}`);
            return res.status(404).json({ message: 'Snippet not found.' });
        }

        console.log(`[API Snippets GET /:name] Fetched snippet '${decodedSnippetName}' for user ${userId}`);
        res.status(200).json(rows[0]); // Send the single snippet object {id, name, code}
    } catch (error) {
        console.error(`[API Snippets GET /:name] Database error fetching '${snippetName}':`, error);
        res.status(500).json({ message: 'Failed to fetch snippet.' });
    }
});


// POST /api/snippets - Create or Update a snippet for the logged-in user
router.post('/', async (req, res) => {
    const userId = req.session.userId;
    const { name, code } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 50) {
        return res.status(400).json({ message: 'Valid snippet name (1-50 chars) is required.' });
    }
    if (typeof code !== 'string') { // Allow empty code? For now, yes.
        return res.status(400).json({ message: 'Snippet code must be a string.' });
    }

    const trimmedName = name.trim();

    try {
        // Use INSERT ... ON CONFLICT to handle create/update in one query
        // We need a unique constraint on (user_id, name) in the DB schema for this.
        // Assuming that constraint exists:
        const query = `
            INSERT INTO code_snippets (user_id, name, code)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, name)
            DO UPDATE SET code = EXCLUDED.code
            RETURNING id, name, code;
        `;
        const { rows } = await db.query(query, [userId, trimmedName, code]);

        if (rows.length > 0) {
            console.log(`[API Snippets POST] Snippet '${trimmedName}' saved/updated for user ${userId}`);
            res.status(200).json({ message: `Snippet '${trimmedName}' saved successfully.`, snippet: rows[0] });
        } else {
            // This case should ideally not happen with RETURNING clause if insert/update works
             console.error(`[API Snippets POST] Failed to save/update snippet '${trimmedName}' for user ${userId} (no rows returned).`);
            res.status(500).json({ message: 'Failed to save snippet.' });
        }

    } catch (error) {
        console.error(`[API Snippets POST] Database error saving snippet '${trimmedName}':`, error);
        // Specific check for unique constraint violation if not using ON CONFLICT
        // if (error.code === '23505') { // PostgreSQL unique violation code
        //     return res.status(409).json({ message: `Snippet name '${trimmedName}' already exists.` });
        // }
        res.status(500).json({ message: 'Failed to save snippet due to server error.' });
    }
});

// DELETE /api/snippets/:snippetName - Delete a snippet by name for the user
router.delete('/:snippetName', async (req, res) => {
    const userId = req.session.userId;
    const snippetName = req.params.snippetName; // Name from URL parameter

    if (!snippetName) {
        return res.status(400).json({ message: 'Snippet name parameter is required.' });
    }

    try {
        const decodedSnippetName = decodeURIComponent(snippetName); // Decode name from URL
        console.log(`[API Snippets DELETE] Attempting to delete snippet '${decodedSnippetName}' for user ${userId}`);

        // Check if any loadouts are using this snippet before deleting
        const loadoutCheck = await db.query(
            `SELECT lc.id FROM loadout_configs lc
             JOIN code_snippets cs ON lc.code_snippet_id = cs.id
             WHERE cs.user_id = $1 AND cs.name = $2`,
            [userId, decodedSnippetName]
        );

        if (loadoutCheck.rows.length > 0) {
            console.warn(`[API Snippets DELETE] Cannot delete snippet '${decodedSnippetName}' for user ${userId}: Still used by ${loadoutCheck.rows.length} loadout(s).`);
            return res.status(409).json({ message: `Cannot delete snippet: It is currently used by ${loadoutCheck.rows.length} loadout configuration(s). Please update those loadouts first.` });
        }

        // Proceed with deletion
        const { rowCount } = await db.query(
            'DELETE FROM code_snippets WHERE user_id = $1 AND name = $2',
            [userId, decodedSnippetName]
        );

        if (rowCount > 0) {
            console.log(`[API Snippets DELETE] Snippet '${decodedSnippetName}' deleted successfully for user ${userId}`);
            res.status(200).json({ message: `Snippet '${decodedSnippetName}' deleted successfully.` });
        } else {
            console.log(`[API Snippets DELETE] Snippet '${decodedSnippetName}' not found for user ${userId} or delete failed.`);
            res.status(404).json({ message: 'Snippet not found or could not be deleted.' });
        }
    } catch (error) {
        console.error(`[API Snippets DELETE] Database error deleting snippet '${snippetName}':`, error);
        res.status(500).json({ message: 'Failed to delete snippet.' });
    }
});


module.exports = router;