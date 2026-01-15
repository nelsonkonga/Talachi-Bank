#!/bin/bash
# full-restart.sh

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$PROJECT_DIR/logs"

echo "🛑 Stopping all services..."
pkill -f "talachibank-api" || true
pkill -f "next dev" || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

sleep 2

echo "🚀 Starting Backend..."
mvn spring-boot:run -pl talachibank-api > "$LOG_DIR/backend.log" 2>&1 &

echo "🚀 Starting Frontend..."
cd "$PROJECT_DIR/talachibank-client"
npm run dev > "$LOG_DIR/frontend.log" 2>&1 &

echo "✨ System updated and restarting. Please wait 10 seconds before testing."
