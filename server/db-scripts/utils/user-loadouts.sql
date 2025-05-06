-- User Loadout Analysis
-- Shows loadout counts and details per user

-- Count of loadouts per user
SELECT 
    u.username,
    COUNT(lc.id) as loadout_count,
    MIN(lc.created_at) as first_loadout_created,
    MAX(lc.created_at) as last_loadout_created
FROM 
    users u
LEFT JOIN 
    loadout_configs lc ON u.id = lc.user_id
GROUP BY 
    u.username
ORDER BY 
    loadout_count DESC;

-- Get all loadouts for a specific user (replace 'johndoe' with target username)
SELECT 
    lc.config_name,
    lc.robot_name,
    lc.visuals,
    cs.name as code_snippet_name,
    lc.created_at,
    lc.updated_at
FROM 
    loadout_configs lc
JOIN 
    users u ON lc.user_id = u.id
LEFT JOIN 
    code_snippets cs ON lc.code_snippet_id = cs.id
WHERE 
    u.username = 'johndoe'
ORDER BY 
    lc.updated_at DESC;