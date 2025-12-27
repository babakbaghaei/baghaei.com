#!/bin/bash

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_CONTAINER="baghaei-db"
DB_USER="postgres"
DB_NAME="baghaei_db"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Perform Backup
echo "📦 Starting database backup for $DB_NAME..."
docker exec -t $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

if [ $? -eq 0 ]; then
    echo "✅ Backup successful: $BACKUP_DIR/db_backup_$TIMESTAMP.sql"
    
    # Compress the backup
    gzip "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
    echo "🗜️ Compressed to: $BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"
    
    # Cleanup old backups (keep last 7 days)
    find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +7 -delete
    echo "🧹 Cleaned up old backups."
else
    echo "❌ Backup failed!"
    exit 1
fi
