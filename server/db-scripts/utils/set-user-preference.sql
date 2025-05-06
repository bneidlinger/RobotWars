-- Set a preference for a specific user
-- Usage: Replace 'johndoe' with the target username
--        Replace 'last_config_name' with the preference key
--        Replace 'My Tank Build' with the preference value

-- First, find the user ID
WITH user_id_lookup AS (
    SELECT id FROM users WHERE username = 'johndoe'  -- Replace with target username
)
INSERT INTO user_preferences (user_id, preference_key, preference_value, updated_at)
SELECT 
    id,                            -- User ID from the lookup
    'last_config_name',            -- Replace with preference key
    'My Tank Build',               -- Replace with preference value
    CURRENT_TIMESTAMP              -- Current timestamp
FROM 
    user_id_lookup
ON CONFLICT (user_id, preference_key)
DO UPDATE SET 
    preference_value = EXCLUDED.preference_value,
    updated_at = CURRENT_TIMESTAMP
RETURNING id, preference_key, preference_value, updated_at;