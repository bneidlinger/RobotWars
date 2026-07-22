// server/db-scripts/utils/check-schema.js
// Dev utility: lists tables present in the configured database and flags
// any expected tables that are missing. Run: node server/db-scripts/utils/check-schema.js
require('dotenv').config();
const db = require('../../db');

const EXPECTED = ['users', 'session', 'loadout_configs', 'code_snippets', 'user_preferences',
    'player_pvp_stats', 'player_bot_stats', 'player_code_stats'];

(async () => {
    const { rows } = await db.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
    );
    const present = rows.map(r => r.table_name);
    console.log('Tables present:', present.join(', ') || '(none)');
    const missing = EXPECTED.filter(t => !present.includes(t));
    console.log('Missing expected tables:', missing.join(', ') || '(none)');
    process.exit(0);
})().catch(err => { console.error(err.message); process.exit(1); });
