// server/db.js
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'YOUR_RENDER_POSTGRES_URL'; // Use env var or fallback

if (!connectionString || connectionString === 'YOUR_RENDER_POSTGRES_URL') {
    console.error("FATAL: Database connection string not found. Set DATABASE_URL environment variable or update server/db.js");
    // process.exit(1); // Optionally exit if DB is critical
}

const pool = new Pool({
    connectionString: connectionString,
    // Render recommends SSL for external connections
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

pool.on('connect', (client) => {
    console.log('[DB] Client connected to the database pool', {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
    });
});

pool.on('error', (err, client) => {
    console.error('[DB] Unexpected error on idle client', err);
    // process.exit(-1); // Decide if errors are fatal
});

// Add acquire and remove event handlers to track connection lifecycle
pool.on('acquire', (client) => {
    console.log('[DB] Client acquired from pool', {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
    });
});

pool.on('remove', (client) => {
    console.log('[DB] Client removed from pool', {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
    });
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool // Export pool if needed for session store
};