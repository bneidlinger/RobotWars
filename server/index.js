// server/index.js

// --- Load Environment Variables (MUST be first) ---
require('dotenv').config();
// ---------------------------------------------------

const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session); // Pass session to the function
const db = require('./db'); // Import the db module (needs pool)
const initializeSocketHandler = require('./socket-handler');
const authRoutes = require('./routes/auth');
const snippetRoutes = require('./routes/snippets');
const loadoutRoutes = require('./routes/loadouts');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// --- Session Configuration ---
// Ensure DATABASE_URL and SESSION_SECRET are loaded from .env or environment
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    console.error("FATAL: SESSION_SECRET environment variable not set.");
    if (process.env.NODE_ENV === 'production') {
        process.exit(1); // Exit in production if secret is missing
    } else {
        console.warn("WARNING: Using insecure default session secret for development.");
    }
}

const sessionMiddleware = session({
    store: new pgSession({
        pool: db.pool,                // Use the exported pool from db.js
        tableName: 'session',         // Match the table name created earlier
        // pruneSessionInterval: 60    // Optional: Check for expired sessions every 60 seconds
    }),
    secret: sessionSecret || 'default_insecure_secret_for_dev', // Use loaded secret or fallback
    resave: false,                     // Don't save session if unmodified
    saveUninitialized: false,          // Don't create session until something stored
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week validity for the session cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
        httpOnly: true,                  // Prevents client-side JS from reading the cookie
        sameSite: 'lax'                  // Basic CSRF protection
    }
});

// --- Express Middleware ---
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware for URL-encoded request bodies
app.use(sessionMiddleware); // Use session middleware for all Express routes AFTER body parsing

// --- Socket.IO Session Sharing ---
// Make express-session data accessible to Socket.IO connection handlers
io.engine.use(sessionMiddleware);
// --- End Socket.IO Session Sharing ---

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/snippets', snippetRoutes); // Placeholder, requires authMiddleware inside
app.use('/api/loadouts', loadoutRoutes); // Placeholder, requires authMiddleware inside
// --- End API Routes ---

// --- Static Files ---
// Serve static files from the 'client' directory AFTER API routes
const clientPath = path.join(__dirname, '..', 'client');
console.log(`Serving static files from: ${clientPath}`);
app.use(express.static(clientPath));
// --- End Static Files ---

// --- Catch-all for SPA (Single Page Application) routing ---
// If no API route or static file matched, send index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});
// --- End Catch-all ---

// Initialize Socket.IO handling logic (Pass io instance and db pool if needed)
initializeSocketHandler(io, db); // Pass db if GameManager or other parts need it

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the game at: http://localhost:${PORT}`);
  if (!process.env.SESSION_SECRET && process.env.NODE_ENV !== 'development') {
      console.warn("Reminder: SESSION_SECRET environment variable not set.");
  }
  if (process.env.NODE_ENV !== 'production' && sessionMiddleware.cookie?.secure) {
       console.warn("Warning: Secure cookies enabled but NODE_ENV is not 'production'. Cookies may not work over HTTP.");
  }
});