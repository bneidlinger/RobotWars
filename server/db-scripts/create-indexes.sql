-- Create indexes for better performance (run after tables are created)

-- Indexes for PvP stats
CREATE INDEX idx_pvp_stats_wins ON player_pvp_stats(wins DESC);
CREATE INDEX idx_pvp_stats_kd ON player_pvp_stats((CASE WHEN deaths = 0 THEN kills ELSE kills::FLOAT / deaths END) DESC);

-- Index for bot stats
CREATE INDEX idx_bot_stats_wins ON player_bot_stats(bot_wins DESC);

-- Index for code stats
CREATE INDEX idx_code_stats_lines ON player_code_stats(code_lines ASC, wins DESC);