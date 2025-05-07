-- Insert sample PvP stats
INSERT INTO player_pvp_stats 
    (user_id, username, wins, losses, kills, deaths, total_games)
VALUES
    (1, 'MasterBlaster', 12, 3, 35, 14, 15),
    (2, 'CyberNinja', 9, 5, 28, 20, 14),
    (3, 'IronTitan', 7, 6, 24, 18, 13),
    (4, 'QuantumRaider', 6, 5, 21, 23, 11),
    (5, 'StealthBot', 5, 7, 18, 21, 12),
    (6, 'MechWarrior', 3, 4, 14, 16, 7),
    (7, 'CodeSlayer', 2, 5, 12, 20, 7);

-- Insert sample bot stats
INSERT INTO player_bot_stats 
    (user_id, username, bot_wins, bot_losses, preferred_bot, 
    aggressive_wins, defensive_wins, sniper_wins, erratic_wins, standard_wins, stationary_wins)
VALUES
    (1, 'MasterBlaster', 22, 3, 'aggressive', 11, 4, 3, 2, 1, 1),
    (2, 'CyberNinja', 18, 5, 'sniper', 3, 2, 9, 2, 1, 1),
    (3, 'IronTitan', 15, 7, 'defensive', 2, 8, 1, 1, 2, 1),
    (4, 'QuantumRaider', 12, 8, 'erratic', 3, 2, 1, 5, 0, 1),
    (5, 'StealthBot', 10, 12, 'standard', 1, 2, 2, 1, 3, 1),
    (6, 'MechWarrior', 7, 9, 'stationary', 1, 1, 1, 1, 0, 3),
    (7, 'CodeSlayer', 5, 11, 'aggressive', 3, 0, 1, 0, 1, 0);

-- Insert sample code stats
INSERT INTO player_code_stats 
    (user_id, username, code_lines, wins, avg_time_to_win)
VALUES
    (1, 'MasterBlaster', 25, 34, 42.5),
    (2, 'CyberNinja', 18, 27, 51.2),
    (3, 'IronTitan', 32, 22, 38.7),
    (4, 'QuantumRaider', 15, 18, 60.1),
    (5, 'StealthBot', 40, 15, 55.3),
    (6, 'MechWarrior', 22, 10, 65.8),
    (7, 'CodeSlayer', 12, 7, 72.5);