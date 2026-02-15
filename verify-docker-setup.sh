#!/bin/bash

# Docker Setup Testing Script
# This script validates the Docker configuration and helps diagnose issues

set -e

echo "🐳 Reality Estate - Docker Setup Verification"
echo "=============================================="
echo ""

# Check Docker installation
echo "1️⃣  Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi
echo "✅ Docker is installed: $(docker --version)"
echo ""

# Check Docker Compose installation
echo "2️⃣  Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi
echo "✅ Docker Compose is installed: $(docker-compose --version)"
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found in current directory"
    echo "Please run this script from the project root directory"
    exit 1
fi
echo "✅ Found docker-compose.yml"
echo ""

# Check required files
echo "3️⃣  Checking required files..."
required_files=(
    "docker-compose.yml"
    "backend/Dockerfile"
    "backend/.env"
    "frontend/Dockerfile"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
        exit 1
    fi
done
echo ""

# Check port availability
echo "4️⃣  Checking port availability..."
check_port() {
    local port=$1
    local name=$2
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo "⚠️  Port $port ($name) may be in use"
    else
        echo "✅ Port $port ($name) is available"
    fi
}

check_port 3002 "Frontend"
check_port 4002 "Backend"
check_port 5433 "PostgreSQL"
echo ""

# Summary
echo "5️⃣  Configuration Summary"
echo "========================"
echo "Frontend:   http://localhost:3002"
echo "Backend:    http://localhost:4002"
echo "Database:   localhost:5433"
echo ""

# Next steps
echo "6️⃣  Next Steps"
echo "=============="
echo ""
echo "To start the application:"
echo ""
echo "  docker-compose up -d --build"
echo ""
echo "To run migrations:"
echo ""
echo "  docker-compose exec backend npm run db:migrate"
echo ""
echo "To view logs:"
echo ""
echo "  docker-compose logs -f"
echo ""
echo "✅ All checks passed! You're ready to go!"
