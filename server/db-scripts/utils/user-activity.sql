-- User Activity Report
-- Shows user registration dates and their preference activity

SELECT 
    u.id,
    u.username,
    u.created_at as registration_date,
    COUNT(p.id) as preference_count,
    MAX(p.updated_at) as last_preference_update,
    CASE 
        WHEN COUNT(p.id) > 0 THEN
            MAX(p.updated_at) - u.created_at
        ELSE
            NULL
    END as account_activity_duration
FROM 
    users u
LEFT JOIN 
    user_preferences p ON u.id = p.user_id
GROUP BY 
    u.id, u.username, u.created_at
ORDER BY 
    registration_date DESC;