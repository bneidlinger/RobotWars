-- User Preferences Table Schema
-- This table stores user-specific preferences as key-value pairs
-- Each user can have multiple preferences, and each preference has a unique key

CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite unique constraint to ensure one key per user
    CONSTRAINT user_preference_unique UNIQUE (user_id, preference_key),
    
    -- Foreign key to ensure user exists
    CONSTRAINT fk_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Trigger to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_user_preference_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_preference_timestamp
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION update_user_preference_timestamp();