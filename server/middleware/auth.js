// server/middleware/auth.js
// Middleware to check if the user is authenticated

module.exports = (req, res, next) => {
    // --- START: Added Logging ---
    console.log(`[AuthMiddleware] Triggered for path: ${req.path}`);
    console.log(`[AuthMiddleware] Session ID from Cookie (via express-session): ${req.sessionID}`);
    console.log(`[AuthMiddleware] req.session object:`, JSON.stringify(req.session)); // Log the session object content
    // console.log('[AuthMiddleware] Cookie Header Raw:', req.headers['cookie']); // Optionally log raw header if needed
    // --- END: Added Logging ---

    // Original check
    if (req.session && req.session.userId) {
        // User is authenticated, proceed to the next middleware or route handler
        console.log(`[AuthMiddleware] Authorized. User ID: ${req.session.userId}, Username: ${req.session.username}`);
        // Optionally attach userId to req for easier access in routes (though req.session.userId is standard)
        // req.userId = req.session.userId;
        return next();
    } else {
        // User is not authenticated
        console.warn('[AuthMiddleware] Access DENIED: No active session or userId found in session.');
        return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }
};