#!/bin/bash

# =========================================
# SChat System - Shutdown Script
# =========================================
# This script stops all components of the SChat system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$PROJECT_DIR/logs"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    SChat System Shutdown Script       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# =========================================
# Stop Frontend
# =========================================
echo -e "${YELLOW}[1/3]${NC} Stopping Next.js frontend..."

if [ -f "$LOG_DIR/frontend.pid" ]; then
    FRONTEND_PID=$(cat "$LOG_DIR/frontend.pid")
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        rm "$LOG_DIR/frontend.pid"
        echo -e "${GREEN}  ✓ Frontend stopped (PID: $FRONTEND_PID)${NC}"
    else
        echo -e "${YELLOW}  → Frontend process not running${NC}"
        rm -f "$LOG_DIR/frontend.pid"
    fi
else
    # Fallback: kill by name
    pkill -f "next dev" 2>/dev/null && echo -e "${GREEN}  ✓ Frontend stopped${NC}" || echo -e "${YELLOW}  → No frontend process found${NC}"
fi

echo ""

# =========================================
# Stop Backend
# =========================================
echo -e "${YELLOW}[2/3]${NC} Stopping Spring Boot backend..."

if [ -f "$LOG_DIR/backend.pid" ]; then
    BACKEND_PID=$(cat "$LOG_DIR/backend.pid")
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        # Wait a bit for graceful shutdown
        sleep 3
        # Force kill if still running
        kill -9 $BACKEND_PID 2>/dev/null || true
        rm "$LOG_DIR/backend.pid"
        echo -e "${GREEN}  ✓ Backend stopped (PID: $BACKEND_PID)${NC}"
    else
        echo -e "${YELLOW}  → Backend process not running${NC}"
        rm -f "$LOG_DIR/backend.pid"
    fi
else
    # Fallback: kill by name
    pkill -f "schatapi" 2>/dev/null && echo -e "${GREEN}  ✓ Backend stopped${NC}" || echo -e "${YELLOW}  → No backend process found${NC}"
fi

echo ""

# =========================================
# PostgreSQL (Optional)
# =========================================
echo -e "${YELLOW}[3/3]${NC} PostgreSQL status..."
echo -e "${BLUE}  → PostgreSQL is left running (system service)${NC}"
echo -e "${BLUE}  → To stop manually: sudo systemctl stop postgresql${NC}"

echo ""

# =========================================
# Summary
# =========================================
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✓ Services Stopped Successfully     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}To start again, run:${NC} ./start-all.sh"
echo ""
