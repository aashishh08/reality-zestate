#!/bin/bash

# Database Migration Helper
# Fixes the enum_users_role error by adding missing roles

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}   Database Enum Migration - Add Admin Roles${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if PostgreSQL is running
echo "Checking PostgreSQL connection..."
PGPASSWORD=$DB_PASSWORD psql -h localhost -p 5432 -U reality_estate_user -d reality_estate_db -c "SELECT 1" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Cannot connect to PostgreSQL${NC}"
    echo "Make sure PostgreSQL is running on localhost:5432"
    exit 1
fi

echo -e "${GREEN}✓ Connected to PostgreSQL${NC}"
echo ""

# Run migration
echo "Running migration to add new roles..."
echo "This will add: ADMIN, EDITOR, VIEWER roles to the users table"
echo ""

PGPASSWORD=$DB_PASSWORD psql -h localhost -p 5432 -U reality_estate_user -d reality_estate_db << EOF

-- Add new enum values
ALTER TYPE enum_users_role ADD VALUE 'ADMIN' AFTER 'SUPER_ADMIN';
ALTER TYPE enum_users_role ADD VALUE 'EDITOR' AFTER 'ADMIN';
ALTER TYPE enum_users_role ADD VALUE 'VIEWER' AFTER 'EDITOR';

-- Verify
SELECT enumlabel FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_users_role')
ORDER BY enumsortorder;

EOF

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Migration completed successfully!${NC}"
    echo ""
    echo "New roles added to enum_users_role:"
    echo "  - SUPER_ADMIN"
    echo "  - ADMIN"
    echo "  - EDITOR"
    echo "  - VIEWER"
    echo ""
    echo "You can now run the admin account INSERT:"
    echo "  psql -h localhost -p 5432 -U reality_estate_user -d reality_estate_db < admin-account.sql"
else
    echo -e "${RED}✗ Migration failed${NC}"
    echo ""
    echo "Try manual approach:"
    echo "1. Open pgAdmin"
    echo "2. Right-click database → Query Tool"
    echo "3. Paste SQL from migrate-add-roles.sql"
    echo "4. Click Execute"
    exit 1
fi

echo ""
echo -e "${GREEN}Done! Your database is ready for the admin account.${NC}"
