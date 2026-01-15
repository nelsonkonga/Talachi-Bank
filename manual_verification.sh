#!/bin/bash
# manual_verification.sh
# Run this to verify system state safely.

echo "🔍 PHASE 1: Checking PostgreSQL Service..."
if systemctl is-active --quiet postgresql; then
    echo "✅ PostgreSQL is running."
else
    echo "❌ PostgreSQL is NOT running. Start it with: sudo systemctl start postgresql"
fi

echo ""
echo "🔍 PHASE 2: Checking Port 8080 (Backend)..."
PID_BACKEND=$(lsof -t -i:8080)
if [ -n "$PID_BACKEND" ]; then
    echo "❌ Port 8080 is IN USE by PID $PID_BACKEND."
    echo "   Recommendation: kill -9 $PID_BACKEND"
else
    echo "✅ Port 8080 is FREE."
fi

echo ""
echo "🔍 PHASE 3: Checking Port 3000 (Frontend)..."
PID_FRONTEND=$(lsof -t -i:3000)
if [ -n "$PID_FRONTEND" ]; then
    echo "❌ Port 3000 is IN USE by PID $PID_FRONTEND."
    echo "   Recommendation: kill -9 $PID_FRONTEND"
else
    echo "✅ Port 3000 is FREE."
fi

echo ""
echo "🔍 PHASE 4: Database Connection Check..."
# Simple connection check using psql if available, assuming default user/pass from properties
export PGPASSWORD=Ngousso00
if psql -h localhost -U talachibank-apiuser -d schatdb -c "\l" >/dev/null 2>&1; then
    echo "✅ Database connection SUCCESSFUL."
else
    echo "❌ Database connection FAILED. Check credentials or if database 'schatdb' exists."
fi
unset PGPASSWORD

echo ""
echo "🏁 Verification Complete."
