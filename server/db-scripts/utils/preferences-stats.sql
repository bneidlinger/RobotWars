-- Get statistics about user preferences

-- Total count per preference key
SELECT 
    preference_key,
    COUNT(*) as count,
    MIN(updated_at) as oldest_update,
    MAX(updated_at) as newest_update
FROM 
    user_preferences
GROUP BY 
    preference_key
ORDER BY 
    count DESC;

-- Users with most preferences
SELECT 
    u.username,
    COUNT(*) as preference_count
FROM 
    user_preferences p
JOIN 
    users u ON p.user_id = u.id
GROUP BY 
    u.username
ORDER BY 
    preference_count DESC
LIMIT 10;

-- Most common last_config_name values
SELECT 
    preference_value as config_name,
    COUNT(*) as count
FROM 
    user_preferences
WHERE 
    preference_key = 'last_config_name'
GROUP BY 
    preference_value
ORDER BY 
    count DESC
LIMIT 10;

-- Quick count of all preferences
SELECT COUNT(*) as total_preferences FROM user_preferences;