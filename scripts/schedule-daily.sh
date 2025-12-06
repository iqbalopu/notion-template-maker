#!/bin/bash

# Shell script to schedule daily template generation on Linux/Mac
# This adds a cron job to run the daily generator at 9 AM every day

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DAILY_SCRIPT="$SCRIPT_DIR/daily-generate.js"

echo "🚀 Setting up daily template generation cron job..."
echo ""

# Make sure the script is executable
chmod +x "$DAILY_SCRIPT"

# Create cron job entry (runs daily at 9 AM)
CRON_JOB="0 9 * * * cd $PROJECT_DIR && node $DAILY_SCRIPT >> $PROJECT_DIR/logs/daily-generate.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "daily-generate.js"; then
    echo "⚠️  Cron job already exists. Updating..."
    # Remove existing entry
    crontab -l 2>/dev/null | grep -v "daily-generate.js" | crontab -
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Cron job added successfully!"
echo ""
echo "Schedule: Daily at 9:00 AM"
echo "Logs will be saved to: $PROJECT_DIR/logs/daily-generate.log"
echo ""
echo "To view your cron jobs:"
echo "  crontab -l"
echo ""
echo "To remove this cron job:"
echo "  crontab -l | grep -v 'daily-generate.js' | crontab -"
echo ""
echo "To test the script manually:"
echo "  node $DAILY_SCRIPT"

