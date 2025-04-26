// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db'); // Import db module

const router = express.Router();
const saltRounds = 10; // Cost factor for bcrypt hashing

// --- DEFINE DEFAULT SNIPPETS ---
// (Code content copied from client/js/utils/storage.js)
const defaultSnippets = [
    {
        name: 'Simple Tank',
        code: `// Simple Tank Bot (using state object)\n// Moves in a straight line until hit, then changes direction\n\n// Initialize state ONCE\nif (typeof state.currentDirection === 'undefined') {\n    state.currentDirection = 0;\n    state.lastDamage = 0; // Track damage from previous tick\n    console.log('Simple Tank Initialized');\n}\n\n// Check if damage increased since last tick\nif (robot.damage() > state.lastDamage) {\n    console.log('Tank hit! Changing direction.');\n    state.currentDirection = (state.currentDirection + 90 + Math.random() * 90) % 360;\n}\nstate.lastDamage = robot.damage(); // Update damage tracking\n\n// Move forward\nrobot.drive(state.currentDirection, 3);\n\n// Scan for enemies - use 'let' for temporary variable\nlet scanResult = robot.scan(state.currentDirection, 45);\n\n// Fire if enemy detected\nif (scanResult) {\n    robot.fire(scanResult.direction, 2);\n}`
    },
    {
        name: 'Scanner Bot',
        code: `// Scanner Bot (using state object)\n// Constantly rotates scanner and moves/fires if enemy found\n\n// Initialize state ONCE\nif (typeof state.scanAngle === 'undefined') {\n    state.scanAngle = 0;\n    console.log('Scanner Bot Initialized');\n}\n\n// Rotate scan angle\nstate.scanAngle = (state.scanAngle + 5) % 360;\n\n// Scan for enemies - Use 'let' because it's recalculated each tick\nlet scanResult = robot.scan(state.scanAngle, 20);\n\n// If enemy detected, move toward it and fire\nif (scanResult) {\n    robot.drive(scanResult.direction, 3);\n    robot.fire(scanResult.direction, 3);\n} else {\n    // If no enemy, keep rotating but move slowly forward\n    robot.drive(state.scanAngle, 1);\n}`
    },
    {
        name: 'Aggressive Bot',
        code: `// Aggressive Bot (using state object)\n// Seeks out enemies and fires continuously\n\n// Initialize state ONCE\nif (typeof state.targetDirection === 'undefined') {\n    state.targetDirection = null;\n    state.searchDirection = 0;\n    state.searchMode = true;\n    state.timeSinceScan = 0;\n    console.log('Aggressive Bot Initialized');\n}\n\nstate.timeSinceScan++;\n\n// If we have a target, track and fire\nif (!state.searchMode && state.targetDirection !== null) {\n    if (state.timeSinceScan > 5) {\n        // scanResult is correctly scoped here with 'const'\n        const scanResult = robot.scan(state.targetDirection, 15);\n        state.timeSinceScan = 0;\n\n        if (scanResult) {\n            state.targetDirection = scanResult.direction;\n        } else {\n            console.log('Aggro Bot lost target, returning to search.');\n            state.searchMode = true;\n            state.targetDirection = null;\n        }\n    }\n    if (state.targetDirection !== null) {\n        robot.drive(state.targetDirection, 4);\n        robot.fire(state.targetDirection, 3);\n    }\n\n} else { // In search mode\n    if (state.timeSinceScan > 2) {\n        state.searchDirection = (state.searchDirection + 15) % 360;\n        // scanResult is correctly scoped here with 'const'\n        const scanResult = robot.scan(state.searchDirection, 30);\n        state.timeSinceScan = 0;\n\n        if (scanResult) {\n            console.log('Aggro Bot found target!');\n            state.targetDirection = scanResult.direction;\n            state.searchMode = false;\n            robot.drive(state.targetDirection, 4);\n            robot.fire(state.targetDirection, 3);\n        } else {\n            robot.drive(state.searchDirection, 1);\n        }\n    } else {\n         robot.drive(state.searchDirection, 1);\n    }\n}`
    }
    // Add more default snippets here if needed
];
// --- END DEFAULT SNIPPETS ---


// --- Registration ---
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // --- Basic Server-Side Validation ---
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    if (password.length < 4 || password.length > 10) {
        return res.status(400).json({ message: 'Password must be between 4 and 10 characters.' });
    }
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
         return res.status(400).json({ message: 'Password must be alphanumeric.' });
    }
    if (username.length < 3 || username.length > 20) {
         return res.status(400).json({ message: 'Username must be between 3 and 20 characters.' });
    }
     if (!/^[a-zA-Z0-9_]+$/.test(username)) { // Allow underscore in username
          return res.status(400).json({ message: 'Username must be alphanumeric or underscore.' });
     }
    // --- End Validation ---

    // --- Use Database Transaction ---
    let client = null; // Define client variable outside try
    try {
        // 1. Connect a client from the pool
        client = await db.pool.connect();
        console.log(`[Auth Register] DB client acquired for ${username}`);

        // 2. Start Transaction
        await client.query('BEGIN');
        console.log(`[Auth Register] Transaction BEGIN for ${username}`);

        // 3. Check if username already exists WITHIN transaction for safety
        // (Unique constraint will catch race conditions, but this check provides
        // a slightly cleaner exit path if the user was created between the
        // pre-check (if we had one) and BEGIN)
        const existingUser = await client.query('SELECT id FROM users WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            await client.query('ROLLBACK'); // Abort transaction
            // DO NOT release client here, finally block handles it.
            console.log(`[Auth Register] Registration failed: Username '${username}' already taken. Transaction ROLLBACK.`);
            return res.status(409).json({ message: 'Username already taken.' });
        }

        // 4. Hash the password
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 5. Insert the new user (Use the client)
        const newUserResult = await client.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
            [username, passwordHash]
        );
        const newUserId = newUserResult.rows[0].id;
        const newUsername = newUserResult.rows[0].username;
        console.log(`[Auth Register] User inserted for ${username} (ID: ${newUserId}).`);

        // 6. Insert Default Snippets (Use the client)
        console.log(`[Auth Register] Inserting ${defaultSnippets.length} default snippets for user ID ${newUserId}...`);
        const snippetInsertPromises = defaultSnippets.map(snippet => {
            return client.query(
                'INSERT INTO code_snippets (user_id, name, code) VALUES ($1, $2, $3)',
                [newUserId, snippet.name, snippet.code]
            );
        });
        // Wait for all snippet inserts to complete
        await Promise.all(snippetInsertPromises);
        console.log(`[Auth Register] Default snippets inserted for user ID ${newUserId}.`);

        // 7. Commit Transaction
        await client.query('COMMIT');
        console.log(`[Auth Register] Transaction COMMIT for ${username}.`);

        // --- Transaction successful, now handle session and response ---
        console.log(`[Auth Register] User registered successfully: ${newUsername} (ID: ${newUserId})`);
        req.session.regenerate((err) => {
            if (err) {
                console.error(`[Auth Register] Session regeneration error after registration for ${username}:`, err);
                // Still return success, but log the session error
                return res.status(201).json({
                    message: 'Registration successful, but session creation failed.',
                    user: { id: newUserId, username: newUsername }
                });
            }
            req.session.userId = newUserId;
            req.session.username = newUsername;
            console.log(`[Auth Register] Session created for ${username}.`);
            res.status(201).json({ // 201 Created
                message: 'Registration successful!',
                user: { id: newUserId, username: newUsername }
            });
        });

    } catch (error) {
        // --- Error Handling ---
        console.error(`[Auth Register] Error during registration transaction for ${username}:`, error);
        if (client) {
            try {
                // Attempt to rollback only if transaction was potentially started
                await client.query('ROLLBACK');
                console.log(`[Auth Register] Transaction ROLLBACK executed due to error for ${username}.`);
            } catch (rollbackError) {
                console.error(`[Auth Register] Error during ROLLBACK for ${username}:`, rollbackError);
            }
        }

        // --- Specific error handling for duplicate key ---
        // Check PostgreSQL error code '23505' for unique constraint violation
        if (error.code === '23505' && error.constraint && error.constraint.includes('users_username_key')) {
             console.warn(`[Auth Register] Caught duplicate username constraint violation for ${username}.`);
             // Return 409 Conflict instead of 500
             res.status(409).json({ message: 'Username already taken.' });
        } else {
             // Return generic 500 for other errors
            res.status(500).json({ message: 'Internal server error during registration.' });
        }
        // --- End Specific error handling ---

    } finally {
        // --- IMPORTANT: Release Client (ONLY HERE) ---
        // This block executes regardless of whether the try block succeeded or failed.
        if (client) {
            client.release(); // Release the client back to the pool
            console.log(`[Auth Register] DB client released for ${username}.`);
        }
    }
}); // <-- End of router.post('/register', ...) block


// --- Login ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // --- Validation for LOGIN: Only check if fields are present ---
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    // --- NO OTHER PASSWORD/USERNAME VALIDATION HERE ---

    try {
        // 1. Find the user by username
        const result = await db.query('SELECT id, username, password_hash FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            console.log(`[Auth] Login failed: User '${username}' not found.`);
            return res.status(401).json({ message: 'Invalid credentials.' }); // Use generic message
        }

        // 2. Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            console.log(`[Auth] Login failed: Incorrect password for user '${username}'.`);
            return res.status(401).json({ message: 'Invalid credentials.' }); // Use generic message
        }

        // 3. Passwords match - Regenerate session to prevent fixation attacks
        req.session.regenerate((err) => {
            if (err) {
                console.error('[Auth] Session regeneration error:', err);
                return res.status(500).json({ message: 'Internal server error during login.' });
            }

            // Store user information in session
            req.session.userId = user.id;
            req.session.username = user.username;

            console.log(`[Auth] User logged in successfully: ${user.username} (ID: ${user.id})`);
            res.status(200).json({
                message: 'Login successful!',
                user: { id: user.id, username: user.username }
            });
        });

    } catch (error) {
        console.error('[Auth] Login error:', error);
        res.status(500).json({ message: 'Internal server error during login.' });
    }
});


// --- Logout ---
router.post('/logout', (req, res) => {
    const currentUsername = req.session?.username; // Get username before destroying
    req.session.destroy((err) => {
        if (err) {
            console.error('[Auth] Logout error:', err);
            return res.status(500).json({ message: 'Could not log out, please try again.' });
        }
        // Ensure the cookie is cleared even if session store removal has latency
        res.clearCookie('connect.sid', { path: '/' }); // Specify path if needed
        console.log(`[Auth] User '${currentUsername || 'Unknown'}' logged out successfully.`);
        res.status(200).json({ message: 'Logout successful.' });
    });
});


// --- Check Session Status ---
router.get('/me', (req, res) => {
    // Check the session object attached to the request
    if (req.session && req.session.userId && req.session.username) {
        // User is logged in according to the session
        res.status(200).json({
            isLoggedIn: true,
            user: {
                id: req.session.userId,
                username: req.session.username
            }
        });
    } else {
        // No valid session found
        res.status(200).json({ isLoggedIn: false });
    }
});


module.exports = router;