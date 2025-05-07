-- Create Player Stats Tables for Leaderboards

-- PvP Stats Table
CREATE TABLE IF NOT EXISTS player_pvp_stats (
    user_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    wins INT NOT NULL DEFAULT 0,
    losses INT NOT NULL DEFAULT 0,
    kills INT NOT NULL DEFAULT 0,
    deaths INT NOT NULL DEFAULT 0,
    total_games INT NOT NULL DEFAULT 0,
    last_game_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_pvp_stats_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Bot Challenge Stats Table
CREATE TABLE IF NOT EXISTS player_bot_stats (
    user_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    bot_wins INT NOT NULL DEFAULT 0,
    bot_losses INT NOT NULL DEFAULT 0,
    preferred_bot VARCHAR(30),
    aggressive_wins INT NOT NULL DEFAULT 0,
    defensive_wins INT NOT NULL DEFAULT 0,
    sniper_wins INT NOT NULL DEFAULT 0,
    erratic_wins INT NOT NULL DEFAULT 0,
    standard_wins INT NOT NULL DEFAULT 0,
    stationary_wins INT NOT NULL DEFAULT 0,
    last_game_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_bot_stats_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Code Efficiency Stats Table
CREATE TABLE IF NOT EXISTS player_code_stats (
    user_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    code_lines INT,
    wins INT NOT NULL DEFAULT 0,
    avg_time_to_win DECIMAL(10,2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_code_stats_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Create indexes for better performance
-- These are run as separate statements to avoid dependency issues
CREATE INDEX IF NOT EXISTS idx_pvp_stats_wins ON player_pvp_stats(wins DESC);
CREATE INDEX IF NOT EXISTS idx_pvp_stats_kd ON player_pvp_stats((CASE WHEN deaths = 0 THEN kills ELSE kills::FLOAT / deaths END) DESC);
CREATE INDEX IF NOT EXISTS idx_bot_stats_wins ON player_bot_stats(bot_wins DESC);
CREATE INDEX IF NOT EXISTS idx_code_stats_lines ON player_code_stats(code_lines ASC, wins DESC);