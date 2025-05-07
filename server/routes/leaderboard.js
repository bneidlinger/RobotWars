// server/routes/leaderboard.js
const express = require('express');
const router = express.Router();

/**
 * GET /api/leaderboard
 * Retrieves all leaderboard data for PvP, Bot challenges, and Code efficiency
 */
router.get('/', async (req, res) => {
    try {
        const db = req.app.get('db');

        // Get PvP leaderboard data (top 10)
        const pvpQuery = `
            SELECT 
                username, 
                wins, 
                losses, 
                kills, 
                deaths, 
                total_games,
                CASE WHEN deaths = 0 THEN kills ELSE kills::FLOAT / deaths END as kd_ratio
            FROM 
                player_pvp_stats
            ORDER BY 
                (CASE WHEN deaths = 0 THEN kills ELSE kills::FLOAT / deaths END) DESC, 
                wins DESC
            LIMIT 10
        `;
        
        // Get Bot challenge leaderboard data (top 10)
        const botQuery = `
            SELECT 
                username, 
                bot_wins, 
                bot_losses, 
                preferred_bot,
                aggressive_wins, 
                defensive_wins, 
                sniper_wins, 
                erratic_wins, 
                standard_wins, 
                stationary_wins
            FROM 
                player_bot_stats
            ORDER BY 
                bot_wins DESC
            LIMIT 10
        `;
        
        // Get Code Efficiency leaderboard data (top 5 for each category)
        const fewestLinesQuery = `
            SELECT 
                username, 
                code_lines, 
                wins
            FROM 
                player_code_stats
            WHERE 
                wins > 0 AND code_lines > 0
            ORDER BY 
                code_lines ASC, wins DESC
            LIMIT 5
        `;
        
        const mostWinsQuery = `
            SELECT 
                username, 
                code_lines, 
                wins
            FROM 
                player_code_stats
            WHERE 
                code_lines > 0
            ORDER BY 
                wins DESC, code_lines ASC
            LIMIT 5
        `;

        // Execute all queries in parallel
        const [pvpStats, botStats, fewestLinesStats, mostWinsStats] = await Promise.all([
            db.query(pvpQuery).then(result => result.rows),
            db.query(botQuery).then(result => result.rows),
            db.query(fewestLinesQuery).then(result => result.rows),
            db.query(mostWinsQuery).then(result => result.rows)
        ]);

        // Combine the code stats into one array
        const codeStats = [
            ...fewestLinesStats.map(stat => ({ ...stat, type: 'fewest_lines' })),
            ...mostWinsStats.map(stat => ({ ...stat, type: 'most_wins' }))
        ].sort((a, b) => {
            if (a.type === 'fewest_lines' && b.type !== 'fewest_lines') return -1;
            if (a.type !== 'fewest_lines' && b.type === 'fewest_lines') return 1;
            return 0;
        });

        res.json({
            pvpStats,
            botStats,
            codeStats
        });
    } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        res.status(500).json({ message: 'Internal server error fetching leaderboard data' });
    }
});

module.exports = router;