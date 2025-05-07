// server/stats-manager.js

/**
 * Manages player statistics for leaderboards
 */
class StatsManager {
    constructor(db) {
        this.db = db;
        console.log("[StatsManager] Initialized.");
    }

    /**
     * Updates player vs player stats when a PvP game ends
     * @param {object} gameData - Data about the completed game
     * @param {object} winnerData - Data about the winner
     */
    async updatePvPStats(gameData, winnerData) {
        try {
            if (!gameData || !gameData.players || gameData.players.length < 2) {
                console.warn("[StatsManager] Not enough players in gameData to update PvP stats");
                return;
            }

            // Get player IDs and data from the game
            const playerStats = gameData.players.map(player => {
                // Extract player info
                const userId = player.userId;
                const username = player.name || `Player_${userId?.substring(0, 4)}`;
                const isWinner = player.id === winnerData.winnerId;
                const deaths = player.died ? 1 : 0;
                const kills = player.kills || 0;

                return { userId, username, isWinner, deaths, kills };
            });

            // Only update if we have valid user IDs
            const validPlayers = playerStats.filter(p => p.userId);
            if (validPlayers.length < 2) {
                console.warn("[StatsManager] Not enough players with valid userIds to update PvP stats");
                return;
            }

            // Update stats for each player in the game
            for (const player of validPlayers) {
                await this.updatePlayerPvPStats(
                    player.userId,
                    player.username,
                    player.isWinner,
                    player.kills,
                    player.deaths
                );
            }

            console.log(`[StatsManager] Updated PvP stats for ${validPlayers.length} players`);
        } catch (error) {
            console.error("[StatsManager] Error updating PvP stats:", error);
        }
    }

    /**
     * Updates a single player's PvP stats
     */
    async updatePlayerPvPStats(userId, username, isWinner, kills, deaths) {
        try {
            const query = `
                INSERT INTO player_pvp_stats (
                    user_id, username, wins, losses, kills, deaths, total_games, last_game_date
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, 1, CURRENT_TIMESTAMP
                )
                ON CONFLICT (user_id) DO UPDATE SET
                    username = $2,
                    wins = player_pvp_stats.wins + $3,
                    losses = player_pvp_stats.losses + $4,
                    kills = player_pvp_stats.kills + $5,
                    deaths = player_pvp_stats.deaths + $6,
                    total_games = player_pvp_stats.total_games + 1,
                    last_game_date = CURRENT_TIMESTAMP
            `;

            const values = [
                userId, 
                username, 
                isWinner ? 1 : 0, 
                isWinner ? 0 : 1, 
                kills, 
                deaths
            ];

            await this.db.query(query, values);
        } catch (error) {
            console.error(`[StatsManager] Error updating PvP stats for user ${userId}:`, error);
        }
    }

    /**
     * Updates player vs bot stats when a test game ends
     * @param {object} gameData - Data about the completed game
     * @param {object} winnerData - Data about the winner
     */
    async updateBotStats(gameData, winnerData) {
        try {
            if (!gameData || !gameData.players || gameData.players.length < 2) {
                console.warn("[StatsManager] Not enough players in gameData to update bot stats");
                return;
            }

            // Extract player and bot information
            const player = gameData.players.find(p => p.userId); // Find real player
            const bot = gameData.players.find(p => !p.userId);   // Find bot
            
            if (!player || !bot) {
                console.warn("[StatsManager] Could not identify player and bot in gameData");
                return;
            }

            const userId = player.userId;
            const username = player.name || `Player_${userId?.substring(0, 4)}`;
            
            // Determine if player won against bot
            const playerWon = player.id === winnerData.winnerId;
            
            // Determine bot type from name
            let botType = 'standard';
            if (bot.name) {
                const botName = bot.name.toLowerCase();
                if (botName.includes('aggressive')) botType = 'aggressive';
                else if (botName.includes('defensive')) botType = 'defensive';
                else if (botName.includes('sniper')) botType = 'sniper';
                else if (botName.includes('erratic')) botType = 'erratic';
                else if (botName.includes('stationary')) botType = 'stationary';
            }

            await this.updatePlayerBotStats(userId, username, playerWon, botType);
            console.log(`[StatsManager] Updated bot stats for player ${username} against ${botType} bot`);
        } catch (error) {
            console.error("[StatsManager] Error updating bot stats:", error);
        }
    }

    /**
     * Updates a single player's bot stats
     */
    async updatePlayerBotStats(userId, username, playerWon, botType) {
        try {
            // Create a dynamic field name for the specific bot type win counter
            const botTypeWinField = `${botType}_wins`;
            
            const query = `
                INSERT INTO player_bot_stats (
                    user_id, username, bot_wins, bot_losses, ${botTypeWinField}, last_game_date
                ) VALUES (
                    $1, $2, $3, $4, $5, CURRENT_TIMESTAMP
                )
                ON CONFLICT (user_id) DO UPDATE SET
                    username = $2,
                    bot_wins = player_bot_stats.bot_wins + $3,
                    bot_losses = player_bot_stats.bot_losses + $4,
                    ${botTypeWinField} = player_bot_stats.${botTypeWinField} + $5,
                    preferred_bot = CASE
                        WHEN player_bot_stats.${botTypeWinField} + $5 > 
                             GREATEST(
                                player_bot_stats.aggressive_wins, 
                                player_bot_stats.defensive_wins,
                                player_bot_stats.sniper_wins,
                                player_bot_stats.erratic_wins,
                                player_bot_stats.standard_wins,
                                player_bot_stats.stationary_wins
                             )
                        THEN $6
                        ELSE player_bot_stats.preferred_bot
                    END,
                    last_game_date = CURRENT_TIMESTAMP
            `;

            const values = [
                userId,
                username,
                playerWon ? 1 : 0,
                playerWon ? 0 : 1,
                playerWon ? 1 : 0,
                botType
            ];

            await this.db.query(query, values);
        } catch (error) {
            console.error(`[StatsManager] Error updating bot stats for user ${userId}:`, error);
        }
    }

    /**
     * Updates player code efficiency stats
     * @param {object} gameData - Data about the completed game
     * @param {object} winnerData - Data about the winner
     */
    async updateCodeStats(gameData, winnerData) {
        try {
            if (!gameData || !gameData.players) {
                console.warn("[StatsManager] No players in gameData to update code stats");
                return;
            }

            // Only update for the winner if they're a real player
            const winner = gameData.players.find(p => p.id === winnerData.winnerId && p.userId);
            if (!winner) {
                console.log("[StatsManager] No valid winner to update code stats for");
                return;
            }

            const userId = winner.userId;
            const username = winner.name || `Player_${userId?.substring(0, 4)}`;
            
            // Calculate code lines (approximately)
            let codeLines = 0;
            if (winner.code) {
                // Count non-empty lines
                codeLines = winner.code
                    .split('\n')
                    .filter(line => line.trim().length > 0 && !line.trim().startsWith('//'))
                    .length;
            }

            // Calculate game duration in seconds
            const gameStartTime = gameData.startTime || Date.now() - 60000; // Default to 1 minute ago
            const gameEndTime = gameData.endTime || Date.now();
            const gameDuration = (gameEndTime - gameStartTime) / 1000; // in seconds

            await this.updatePlayerCodeStats(userId, username, codeLines, gameDuration);
            console.log(`[StatsManager] Updated code stats for winner ${username}: ${codeLines} lines`);
        } catch (error) {
            console.error("[StatsManager] Error updating code stats:", error);
        }
    }

    /**
     * Updates a single player's code stats
     */
    async updatePlayerCodeStats(userId, username, codeLines, gameDuration) {
        try {
            // Only update if we have a valid code line count
            if (!codeLines || codeLines <= 0) {
                console.log(`[StatsManager] Skipping code stats update for ${username}: invalid line count`);
                return;
            }

            const query = `
                INSERT INTO player_code_stats (
                    user_id, username, code_lines, wins, avg_time_to_win, last_updated
                ) VALUES (
                    $1, $2, $3, 1, $4, CURRENT_TIMESTAMP
                )
                ON CONFLICT (user_id) DO UPDATE SET
                    username = $2,
                    code_lines = CASE
                        WHEN $3 < player_code_stats.code_lines OR player_code_stats.code_lines IS NULL
                        THEN $3
                        ELSE player_code_stats.code_lines
                    END,
                    wins = player_code_stats.wins + 1,
                    avg_time_to_win = CASE
                        WHEN player_code_stats.avg_time_to_win IS NULL
                        THEN $4
                        ELSE (player_code_stats.avg_time_to_win * player_code_stats.wins + $4) / (player_code_stats.wins + 1)
                    END,
                    last_updated = CURRENT_TIMESTAMP
            `;

            const values = [userId, username, codeLines, gameDuration];
            await this.db.query(query, values);
        } catch (error) {
            console.error(`[StatsManager] Error updating code stats for user ${userId}:`, error);
        }
    }
}

module.exports = StatsManager;