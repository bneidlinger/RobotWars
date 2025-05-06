-- List all user preferences with usernames
-- Shows username, preference key, value, and when it was last updated

SELECT 
    u.username,
    p.preference_key,
    p.preference_value,
    p.created_at,
    p.updated_at
FROM 
    user_preferences p
JOIN 
    users u ON p.user_id = u.id
ORDER BY 
    u.username, p.preference_key;