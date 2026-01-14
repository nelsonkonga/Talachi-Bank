#!/bin/bash

# =========================================
# SChat System - Unified Startup Script
# =========================================
# This script starts all components of the SChat system:
# 1. PostgreSQL database
# 2. Spring Boot backend (schatapi)
# 3. Next.js frontend (schatclient)
#
# Usage: ./start-all.sh
# Stop:  Press Ctrl+C to stop all services gracefully

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$PROJECT_DIR/logs"

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# PIDs for background processes
BACKEND_PID=""
FRONTEND_PID=""

# =========================================
# Cleanup Function
# =========================================
cleanup_ports() {
    echo -e "${YELLOW}→ Cleaning up ports...${NC}"
    
    # Kill processes on port 8080 (Backend)
    if lsof -ti:8080 >/dev/null 2>&1; then
        echo -e "${YELLOW}  • Killing process on port 8080${NC}"
        lsof -ti:8080 | xargs kill -9 2>/dev/null || true
        
        # Wait until port is actually free
        echo -n "    Waiting for port 8080 to clear..."
        while lsof -ti:8080 >/dev/null 2>&1; do
            sleep 1
            echo -n "."
        done
        echo ""
    fi
    
    # Kill processes on port 3000 (Frontend)
    if lsof -ti:3000 >/dev/null 2>&1; then
        echo -e "${YELLOW}  • Killing process on port 3000${NC}"
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        
        # Wait until port is actually free
        echo -n "    Waiting for port 3000 to clear..."
        while lsof -ti:3000 >/dev/null 2>&1; do
            sleep 1
            echo -n "."
        done
        echo ""
    fi
    
    # Clean up any leftover schatapi or next dev processes
    pkill -f "schatapi" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    
    echo -e "${GREEN}✓ Ports cleaned and ready${NC}"
}

# =========================================
# Shutdown Function (for Ctrl+C)
# =========================================
shutdown() {
    echo ""
    echo -e "${YELLOW}╔════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║   🛑 Shutting down all services...    ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════╝${NC}"
    
    # Kill frontend
    if [ ! -z "$FRONTEND_PID" ] && kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${YELLOW}→ Stopping Frontend (PID: $FRONTEND_PID)...${NC}"
        kill -TERM $FRONTEND_PID 2>/dev/null || true
        wait $FRONTEND_PID 2>/dev/null || true
        echo -e "${GREEN}✓ Frontend stopped${NC}"
    fi
    
    # Kill backend
    if [ ! -z "$BACKEND_PID" ] && kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${YELLOW}→ Stopping Backend (PID: $BACKEND_PID)...${NC}"
        kill -TERM $BACKEND_PID 2>/dev/null || true
        wait $BACKEND_PID 2>/dev/null || true
        echo -e "${GREEN}✓ Backend stopped${NC}"
    fi
    
    # Final cleanup
    cleanup_ports
    
    # Remove PID files if they exist
    rm -f "$LOG_DIR/backend.pid" "$LOG_DIR/frontend.pid"
    
    echo ""
    echo -e "${GREEN}✓ All services stopped successfully!${NC}"
    echo ""
    exit 0
}

# Set up trap handlers for graceful shutdown
trap shutdown SIGINT SIGTERM

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    SChat System Startup Script        ║${NC}"
echo -e "${BLUE}║    Press Ctrl+C to stop all services  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# =========================================
# Step 0: Clean up existing processes
# =========================================
cleanup_ports
echo ""

# =========================================
# Step 1: Check PostgreSQL
# =========================================
echo -e "${YELLOW}[1/4]${NC} Checking PostgreSQL..."

if ! systemctl is-active --quiet postgresql 2>/dev/null; then
    echo -e "${YELLOW}  → PostgreSQL is not running. Attempting to start...${NC}"
    if sudo systemctl start postgresql 2>/dev/null; then
        echo -e "${GREEN}  ✓ PostgreSQL started successfully${NC}"
    else
        echo -e "${RED}  ✗ Failed to start PostgreSQL. Please start it manually:${NC}"
        echo -e "${RED}    sudo systemctl start postgresql${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}  ✓ PostgreSQL is already running${NC}"
fi

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}  → Waiting for PostgreSQL to be ready...${NC}"
sleep 2

# Check if database exists
# Check if database is accessible
export PGPASSWORD=Ngousso00
if psql -h localhost -U schatapiuser -d schatdb -c "SELECT 1" >/dev/null 2>&1; then
    echo -e "${GREEN}  ✓ Database 'schatdb' is accessible${NC}"
else
    echo -e "${YELLOW}  ⚠ Database 'schatdb' check failed (might just need password or hasn't proved accessible yet). Proceeding...${NC}"
fi
unset PGPASSWORD

echo ""

# =========================================
# Step 2: Build Backend (if needed)
# =========================================
echo -e "${YELLOW}[2/4]${NC} Building Spring Boot backend..."

cd "$PROJECT_DIR"
if [ ! -d "schatapi/target" ]; then
    echo -e "${YELLOW}  → Compiling backend...${NC}"
    mvn clean package -DskipTests > "$LOG_DIR/backend-build.log" 2>&1
    echo -e "${GREEN}  ✓ Backend compiled successfully${NC}"
else
    echo -e "${GREEN}  ✓ Backend already compiled (use 'mvn clean' to rebuild)${NC}"
fi

echo ""

# =========================================
# Step 3: Start Backend
# =========================================
echo -e "${YELLOW}[3/4]${NC} Starting Spring Boot backend..."

cd "$PROJECT_DIR"
mvn spring-boot:run -pl schatapi > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$LOG_DIR/backend.pid"

echo -e "${GREEN}  ✓ Backend starting (PID: $BACKEND_PID)${NC}"
echo -e "${BLUE}  → Logs: $LOG_DIR/backend.log${NC}"

# Wait for backend to be ready
echo -e "${YELLOW}  → Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8080/api/test/all > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ Backend is ready!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}  ✗ Backend failed to start. Check logs: $LOG_DIR/backend.log${NC}"
        shutdown
    fi
    sleep 2
    echo -n "."
done

echo ""

# =========================================
# Step 4: Start Frontend
# =========================================
echo -e "${YELLOW}[4/4]${NC} Starting Next.js frontend..."

cd "$PROJECT_DIR/schatclient"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}  → Installing npm dependencies...${NC}"
    npm install > "$LOG_DIR/frontend-install.log" 2>&1
    echo -e "${GREEN}  ✓ Dependencies installed${NC}"
fi

# Start frontend in background
npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$LOG_DIR/frontend.pid"

echo -e "${GREEN}  ✓ Frontend starting (PID: $FRONTEND_PID)${NC}"
echo -e "${BLUE}  → Logs: $LOG_DIR/frontend.log${NC}"

# Wait for frontend to be ready
echo -e "${YELLOW}  → Waiting for frontend to be ready...${NC}"
for i in {1..20}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ Frontend is ready!${NC}"
        break
    fi
    if [ $i -eq 20 ]; then
        echo -e "${YELLOW}  ⚠ Frontend might still be starting. Check logs if needed.${NC}"
    fi
    sleep 2
    echo -n "."
done

echo ""

# =========================================
# Summary
# =========================================
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   🎉 All Services Started Successfully!║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Services running:${NC}"
echo -e "  ${GREEN}✓${NC} PostgreSQL:  postgresql://localhost:5432"
echo -e "  ${GREEN}✓${NC} Backend API: http://localhost:8080"
echo -e "  ${GREEN}✓${NC} Frontend:    http://localhost:3000"
echo ""
echo -e "${BLUE}Process IDs:${NC}"
echo -e "  Backend:  $BACKEND_PID"
echo -e "  Frontend: $FRONTEND_PID"
echo ""
echo -e "${BLUE}Logs directory:${NC} $LOG_DIR"
echo ""
echo -e "${MAGENTA}╔════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║  Press Ctrl+C to stop all services    ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════╝${NC}"
echo ""

# Wait for processes to finish (or Ctrl+C)
wait
