// server/middleware/auth.js
// Middleware to check if the user is authenticated

module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is authenticated, proceed to the next middleware or route handler
        return next();
    } else {
        // User is not authenticated
        console.warn('[Auth Middleware] Access denied: No active session.');
        return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }
};