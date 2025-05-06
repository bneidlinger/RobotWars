-- ⚠️ WARNING: This will delete ALL preferences for ALL users ⚠️
-- Use with extreme caution, typically only for test environments

-- Uncomment the TRUNCATE line to execute
-- TRUNCATE TABLE user_preferences;

-- A safer approach to delete all preferences for a specific user:
-- DELETE FROM user_preferences WHERE user_id = (SELECT id FROM users WHERE username = 'johndoe');