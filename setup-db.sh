#!/bin/bash
# setup-db.sh - Helper script to setup TalachiBank database

echo "--- TalachiBank Database Setup ---"

# Check if sudo is available
if ! command -v sudo &> /dev/null; then
    echo "Error: sudo is not installed. Please run this as root or with a user that has sudo privileges."
    exit 1
fi

echo "Creating database and user..."
sudo -u postgres psql -c "CREATE DATABASE talachibankdb;" 2>/dev/null || echo "Info: Database might already exist."
sudo -u postgres psql -c "CREATE USER talachibankuser WITH PASSWORD 'Ngousso00';" 2>/dev/null || echo "Info: User might already exist (attempting to update password)."
sudo -u postgres psql -c "ALTER USER talachibankuser WITH PASSWORD 'Ngousso00';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE talachibankdb TO talachibankuser;"

echo ""
echo "Verifying setup..."
if export PGPASSWORD=Ngousso00 && psql -h localhost -U talachibankuser -d talachibankdb -c "SELECT 1" &>/dev/null; then
    echo "✅ SUCCESS: Database and user are correctly configured!"
    echo "You can now start the system with ./start-all.sh"
else
    echo "❌ FAILURE: Setup failed. Please check your PostgreSQL service and pg_hba.conf."
fi
