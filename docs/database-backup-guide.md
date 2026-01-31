# Database Backup Guide for RobotWars

This guide provides instructions for backing up and restoring the RobotWars PostgreSQL database hosted on Render.com using DBeaver, a popular database management tool.

## Table of Contents

1. [Installing DBeaver](#installing-dbeaver)
2. [Connecting to Render PostgreSQL Database](#connecting-to-render-postgresql-database)
3. [Full Database Backup Process](#full-database-backup-process)
4. [Table-Specific Backups](#table-specific-backups)
5. [Automated Backup Setup](#automated-backup-setup)
6. [Backup Verification and Best Practices](#backup-verification-and-best-practices)
7. [Security Considerations](#security-considerations)
8. [Troubleshooting Common Issues](#troubleshooting-common-issues)

## Installing DBeaver

1. Download DBeaver from the official website: [https://dbeaver.io/download/](https://dbeaver.io/download/)
2. Select the appropriate version for your operating system (Windows, macOS, or Linux)
3. Follow the installation wizard instructions
4. Launch DBeaver after installation is complete

## Connecting to Render PostgreSQL Database

### Retrieving Connection Details from Render

1. Log in to your Render dashboard: [https://dashboard.render.com/](https://dashboard.render.com/)
2. Navigate to your PostgreSQL database service
3. On the database overview page, locate the "Connections" section
4. Note the following information from the "External Connection" details:
   - Hostname (ends with `.render.com`)
   - Port (typically 5432)
   - Database name (`robotwars_prod`)
   - Username
   - Password
5. The connection string will be in this format: `postgres://username:password@hostname:port/database_name`

### Setting Up Connection in DBeaver

1. Open DBeaver and click on "New Database Connection" (database+ icon in the top-left toolbar)
2. In the connection wizard, select "PostgreSQL" and click "Next"
3. Fill in the connection details:
   - Host: The hostname from your Render connection string (e.g., `dpg-example123.render.com`)
   - Port: 5432 (default PostgreSQL port)
   - Database: `robotwars_prod` (or your specific database name)
   - Username: From your Render connection string
   - Password: From your Render connection string
4. Navigate to the "Driver properties" tab
5. Set the following SSL properties:
   - Set `ssl` to `true`
   - Set `sslmode` to `require`
6. Click "Test Connection" to verify everything is working
7. If the connection is successful, click "Finish" to save the connection

## Full Database Backup Process

### Creating a Complete Database Backup

1. In DBeaver, right-click on your database connection in the "Database Navigator" panel
2. Navigate to "Tools" → "Dump Database"
3. In the dump wizard:
   - **Export objects**: Select all tables if they aren't already selected
   - **Output**: Choose a location to save your backup file
   - **Format**: Select "Native" for the PostgreSQL native format (recommended for full backups)
   - **General options**:
     - Check "Add DROP statements" to ensure clean restores
     - Check "Compress output" to reduce file size
     - Optionally check "Format SQL" for more readable output
   - Click "Next" to proceed through the wizard
4. Review your settings on the final page
5. Click "Start" to begin the backup process
6. Once complete, DBeaver will show a success message and the backup file location

### Restoring a Full Database

1. Right-click on your database connection
2. Navigate to "Tools" → "Restore Database"
3. In the restore wizard:
   - Select your backup file
   - Choose the target schema (usually "public")
   - Set appropriate options (like "Clean first" to remove existing data)
4. Click "Start" to begin the restore process
5. Monitor the restoration progress in the "Database jobs" tab

## Table-Specific Backups

### Exporting Individual Tables

1. In DBeaver, expand your database connection in the "Database Navigator"
2. Expand "Schemas" → "public" → "Tables"
3. Right-click on the table you want to backup
4. Select "Export Data"
5. Choose your preferred format:
   - **SQL**: Best for later restoration within PostgreSQL
   - **CSV**: Good for data analysis or importing to other systems
   - **JSON/XML**: Useful for application integration
6. Configure the export options:
   - SQL format: Select "INSERT" statements for complete data export
   - Set appropriate encoding (UTF-8 recommended)
   - Choose whether to include column headers (for CSV)
7. Click "Next" and select the output location
8. Click "Finish" to start the export

### Critical Tables to Backup

For the RobotWars application, these tables contain the most important user data:

- `users`: Player accounts and authentication information
- `code_snippets`: User-created robot code
- `loadouts`: Robot configurations and customizations
- `session`: Active user sessions
- `leaderboard`: Player statistics and rankings

Consider backing up these tables more frequently than others.

## Automated Backup Setup

### Using pg_dump with Scheduling

For automated backups, you can use the PostgreSQL `pg_dump` utility with a scheduled task:

#### Creating a Backup Script (Linux/macOS)

Create a file named `backup_robotwars.sh`:

```bash
#!/bin/bash

# Define variables
BACKUP_DIR="/path/to/backup/directory"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
FILENAME="robotwars_backup_$DATE.sql"

# Database connection details
DB_HOST="your-database-host.render.com"
DB_PORT="5432"
DB_NAME="robotwars_prod"
DB_USER="your_username"
DB_PASSWORD="your_password"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create the backup
PGPASSWORD=$DB_PASSWORD pg_dump \
  -h $DB_HOST \
  -p $DB_PORT \
  -U $DB_USER \
  -d $DB_NAME \
  -F p \
  -f "$BACKUP_DIR/$FILENAME"

# Compress the backup
gzip "$BACKUP_DIR/$FILENAME"

# Optional: Delete backups older than 30 days
find $BACKUP_DIR -name "robotwars_backup_*.sql.gz" -mtime +30 -delete
```

Make the script executable:

```bash
chmod +x backup_robotwars.sh
```

#### Windows Backup Script (PowerShell)

Create a file named `backup_robotwars.ps1`:

```powershell
# Define variables
$BACKUP_DIR = "C:\path\to\backup\directory"
$DATE = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$FILENAME = "robotwars_backup_$DATE.sql"

# Database connection details
$DB_HOST = "your-database-host.render.com"
$DB_PORT = "5432"
$DB_NAME = "robotwars_prod"
$DB_USER = "your_username"
$DB_PASSWORD = "your_password"

# Create backup directory if it doesn't exist
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR
}

# Set environment variable for password
$env:PGPASSWORD = $DB_PASSWORD

# Create the backup
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F p -f "$BACKUP_DIR\$FILENAME"

# Compress the backup
Compress-Archive -Path "$BACKUP_DIR\$FILENAME" -DestinationPath "$BACKUP_DIR\$FILENAME.zip"
Remove-Item "$BACKUP_DIR\$FILENAME"

# Optional: Delete backups older than 30 days
Get-ChildItem -Path $BACKUP_DIR -Filter "robotwars_backup_*.sql.zip" |
    Where-Object { $_.CreationTime -lt (Get-Date).AddDays(-30) } |
    Remove-Item
```

#### Scheduling Automated Backups

**Linux/macOS (using cron)**:

1. Open the crontab editor:
   ```bash
   crontab -e
   ```

2. Add a line to run the backup script daily at 2 AM:
   ```
   0 2 * * * /path/to/backup_robotwars.sh
   ```

**Windows (using Task Scheduler)**:

1. Open Task Scheduler
2. Click "Create Basic Task"
3. Set a name and description (e.g., "RobotWars Database Backup")
4. Select "Daily" for the trigger
5. Choose the start time (e.g., 2:00 AM)
6. Select "Start a program" for the action
7. Browse to select PowerShell.exe as the program
8. Add the script path as an argument: `-File "C:\path\to\backup_robotwars.ps1"`
9. Complete the wizard

### Cloud Storage Integration

For additional safety, consider uploading backups to cloud storage:

#### Uploading to Google Drive (Linux/macOS)

Use `rclone` to upload to Google Drive:

```bash
# Install rclone and configure it with your Google Drive account
# Then add to your backup script:

# Upload to Google Drive
rclone copy "$BACKUP_DIR/$FILENAME.gz" gdrive:RobotWars_Backups/
```

#### Uploading to AWS S3 (Linux/macOS)

```bash
# Add to your backup script:

# Upload to S3
aws s3 cp "$BACKUP_DIR/$FILENAME.gz" s3://your-bucket-name/robotwars/backups/
```

## Backup Verification and Best Practices

### Testing Your Backups

Regularly test your backups to ensure they can be properly restored:

1. Create a test database on your local machine or development environment
2. Restore a recent backup to this test database
3. Verify that the data is intact and the application works with the restored database
4. Document the verification process and results

### Backup Rotation Strategy

Implement a backup rotation strategy to maintain multiple recovery points:

1. **Daily backups**: Keep for 7-14 days
2. **Weekly backups**: Keep for 4-8 weeks
3. **Monthly backups**: Keep for 6-12 months
4. **Yearly backups**: Keep indefinitely for archival purposes

### Backup Monitoring

Set up monitoring to ensure your backups are completing successfully:

1. Check backup job logs regularly
2. Set up email notifications for backup job success/failure
3. Monitor backup file sizes to detect any unexpected changes

## Security Considerations

### Securing Backup Files

1. **Encryption**: Encrypt your backup files before storing them
   ```bash
   # Example using GPG encryption
   gpg --encrypt --recipient your@email.com "$BACKUP_DIR/$FILENAME.gz"
   ```

2. **Access Control**: Restrict access to backup files and scripts
   ```bash
   # Set restrictive permissions
   chmod 600 "$BACKUP_DIR/$FILENAME.gz"
   ```

3. **Secure Transfer**: Use encrypted connections (SFTP, SCP) when transferring backups

### Protecting Connection Details

1. Store database credentials securely:
   - Use environment variables instead of hardcoding credentials
   - Consider using a password manager or secret management service
   - Restrict script file permissions to the owner only

2. Example using environment variables:
   ```bash
   # In your script
   DB_HOST="${ROBOTWARS_DB_HOST}"
   DB_USER="${ROBOTWARS_DB_USER}"
   DB_PASSWORD="${ROBOTWARS_DB_PASSWORD}"
   ```

## Troubleshooting Common Issues

### Connection Problems

**Issue**: Unable to connect to Render PostgreSQL database
**Solutions**:
- Verify the hostname, port, username, and password
- Check if IP allowlisting is enabled on Render and add your IP address
- Ensure SSL settings are properly configured
- Test connection with the `psql` command-line tool to isolate DBeaver-specific issues

### Backup Failures

**Issue**: Backup process fails or creates empty/corrupted backups
**Solutions**:
- Check for sufficient disk space
- Verify database permissions for the user performing the backup
- Look for specific error messages in the DBeaver logs or console output
- Try using a smaller batch size or running the backup during periods of lower database activity

### Restore Issues

**Issue**: Unable to restore database from backup
**Solutions**:
- Ensure the target database exists and is empty if required
- Verify the user has sufficient privileges to create/modify tables
- Check for version compatibility issues between PostgreSQL versions
- Try restoring specific tables rather than the entire database to isolate problems

---

Remember that Render also provides automatic daily backups retained for 7 days. While these are helpful, maintaining your own backup system provides additional security and flexibility.

For any questions or issues regarding this backup process, contact the RobotWars database administrator.