#!/bin/bash
# Script to view TALACHIBANK database content

echo "=== TALACHIBANK Database Viewer ==="
echo "Connecting to database..."

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "Error: psql command not found. Please install postgresql-client."
    exit 1
fi

# List Users
echo ""
echo "--- Registered Users ---"
psql -h localhost -U talachibankuser -d talachibankdb -c "SELECT id, username, email FROM users ORDER BY id;"

# List Refresh Tokens
echo ""
echo "--- Active Refresh Tokens ---"
psql -h localhost -U talachibankuser -d talachibankdb -c "SELECT id, user_id, expiry_date, token FROM refresh_tokens;"

echo ""
echo "Done."
