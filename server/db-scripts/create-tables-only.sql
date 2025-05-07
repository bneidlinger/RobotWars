-- Create Player Stats Tables for Leaderboards - One table at a time

-- PvP Stats Table
CREATE TABLE player_pvp_stats (
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
CREATE TABLE player_bot_stats (
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
CREATE TABLE player_code_stats (
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