#!/bin/bash

# Quick System Check Script
# Vérifie que tous les services sont prêts

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Vérification rapide du système SChat..."
echo ""

# Check PostgreSQL
echo -n "PostgreSQL (port 5432)... "
if systemctl is-active --quiet postgresql 2>/dev/null; then
    echo -e "${GREEN}✓ Actif${NC}"
else
    echo -e "${RED}✗ Inactif${NC}"
fi

# Check Backend
echo -n "Backend API (port 8080)... "
if curl -s http://localhost:8080/api/test/all > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Actif${NC}"
else
    echo -e "${RED}✗ Inactif${NC}"
fi

# Check Frontend
echo -n "Frontend (port 3000)... "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Actif${NC}"
else
    echo -e "${RED}✗ Inactif${NC}"
fi

echo ""
echo "Pour voir les logs : tail -f logs/backend.log"
