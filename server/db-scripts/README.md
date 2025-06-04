# Database Scripts for Robot Wars

This directory contains SQL scripts for setting up and maintaining the PostgreSQL database for the Robot Wars application.

## Setup Scripts

- `create-user-preferences.sql` - Creates the user_preferences table
- `add-user-preferences-trigger.sql` - Adds index and comments to the user_preferences table

## Utility Scripts

The `utils/` directory contains helpful scripts for common database operations:

### User Management

- `user-activity.sql` - Shows user registration dates and preference activity
- `registration-analysis.sql` - Analyzes user registration patterns and growth

### Preferences Management

- `list-user-preferences.sql` - Lists all preferences for all users
- `get-user-preference.sql` - Gets a specific preference for a specific user
- `set-user-preference.sql` - Sets a preference for a specific user
- `delete-user-preference.sql` - Deletes a specific preference for a user
- `clear-all-preferences.sql` - ⚠️ WARNING: Removes all preferences (for testing only)
- `preferences-stats.sql` - Shows statistics about user preferences

### Game Analysis

- `user-loadouts.sql` - Analyzes loadout configurations by user
- `code-snippets-analysis.sql` - Analyzes code snippets and their characteristics
- `game-stats.sql` - Shows statistics about game matches and performance
- `robot-visuals-analysis.sql` - Analyzes robot visual component choices

### Database Administration

- `database-structure.sql` - Shows table details, relationships and structure
- `index-performance.sql` - Identifies unused or underused indexes
- `session-cleanup.sql` - Helps maintain and clean up expired sessions
- `maintenance-tasks.sql` - Collection of database maintenance operations

## Usage Instructions

1. Connect to your PostgreSQL database using psql or another client:
   ```
   psql -U your_username -d your_database
   ```

2. Run a script file using the `\i` command:
   ```
   \i /path/to/script.sql
   ```

3. For utility scripts that require parameters, edit the file to replace placeholder values before running:
   ```
   -- Example: Edit get-user-preference.sql to replace 'johndoe' with the actual username
   ```

## Notes

- The utility scripts are meant to be modified before running to specify usernames, preference keys, etc.
- Always back up your database before running scripts that modify data
- The creation scripts include checks to avoid errors if objects already exist
- Some analysis scripts may need to be modified based on your actual database schema.
