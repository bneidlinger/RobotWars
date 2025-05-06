-- Get a specific preference for a specific user
-- Usage: Replace 'johndoe' with the target username
--        Replace 'last_config_name' with the preference key you're looking for

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
WHERE 
    u.username = 'johndoe'         -- Replace with target username
    AND p.preference_key = 'last_config_name'  -- Replace with target preference key
;