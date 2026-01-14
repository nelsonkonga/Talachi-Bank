#!/bin/bash
# robust-restart-backend.sh

PORT=8080

echo "🔍 Checking port $PORT..."

# Find PID occupying the port
PID=$(lsof -t -i:$PORT)

if [ -n "$PID" ]; then
  echo "⚠️  Port $PORT is in use by PID $PID. Killing it..."
  kill -9 $PID
  
  # Wait loop to ensure it's gone
  while lsof -t -i:$PORT >/dev/null; do
    echo "   Thinking..."
    sleep 1
  done
  echo "✅ Port $PORT is now free."
else
  echo "✅ Port $PORT is already free."
fi

echo "🚀 Starting Spring Boot Backend..."
mvn -pl schatapi spring-boot:run -DskipTests
