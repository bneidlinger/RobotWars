-- Step 2: Add index only
-- Let's skip the trigger for now since we're encountering issues

-- Create index
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Comment to guide future development
COMMENT ON TABLE user_preferences IS 'Stores user preferences as key-value pairs (e.g., last used loadout config)';

-- Note: We've opted to use application logic to update the timestamps
-- rather than a trigger due to compatibility issues.