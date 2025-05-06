-- Delete a specific preference for a specific user
-- Usage: Replace 'johndoe' with the target username
--        Replace 'last_config_name' with the preference key to delete

DELETE FROM user_preferences
WHERE user_id = (SELECT id FROM users WHERE username = 'johndoe')  -- Replace with target username
  AND preference_key = 'last_config_name';  -- Replace with preference key to delete