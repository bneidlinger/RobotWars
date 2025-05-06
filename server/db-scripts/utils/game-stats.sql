-- Game Statistics
-- Note: Update this query based on your actual game history/results table structure
-- This is a template assuming a game_results table exists

-- Matches played over time (adjust table/column names as needed)
SELECT 
    DATE_TRUNC('day', created_at) as match_date,
    COUNT(*) as matches_played
FROM 
    game_results
GROUP BY 
    DATE_TRUNC('day', created_at)
ORDER BY 
    match_date DESC;

-- Win rates by player (adjust table/column names as needed)
SELECT 
    u.username,
    COUNT(*) as total_matches,
    SUM(CASE WHEN gr.winner_id = u.id THEN 1 ELSE 0 END) as wins,
    ROUND(SUM(CASE WHEN gr.winner_id = u.id THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric * 100, 1) as win_percentage
FROM 
    game_results gr
JOIN 
    users u ON gr.player1_id = u.id OR gr.player2_id = u.id
GROUP BY 
    u.username
HAVING 
    COUNT(*) >= 5
ORDER BY 
    win_percentage DESC;

-- Match duration statistics (adjust table/column names as needed)
SELECT 
    MIN(duration_seconds) as shortest_match,
    AVG(duration_seconds)::numeric(10,2) as average_match,
    MAX(duration_seconds) as longest_match,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_seconds) as median_duration
FROM 
    game_results;