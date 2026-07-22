// server/db-scripts/utils/apply-script.js
// Dev utility: applies one or more .sql files from db-scripts to the configured database.
// Run: node server/db-scripts/utils/apply-script.js <file.sql> [more.sql ...]
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../../db');

(async () => {
    const files = process.argv.slice(2);
    if (files.length === 0) {
        console.error('Usage: node apply-script.js <file.sql> [more.sql ...]');
        process.exit(1);
    }
    for (const f of files) {
        const full = path.resolve(path.join(__dirname, '..'), f);
        const sql = fs.readFileSync(full, 'utf8');
        console.log(`Applying ${path.basename(full)}...`);
        await db.query(sql);
        console.log(`  OK`);
    }
    process.exit(0);
})().catch(err => { console.error('FAILED:', err.message); process.exit(1); });
