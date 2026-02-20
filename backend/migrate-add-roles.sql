-- Migration: Add ADMIN, EDITOR, VIEWER roles to users table
-- This script updates the enum_users_role type to include new roles

-- Step 1: Add new enum values
-- In PostgreSQL, you can add values to an enum using ALTER TYPE
-- Note: Cannot remove existing values, only add new ones

-- Add the new enum values
ALTER TYPE enum_users_role ADD VALUE 'ADMIN' AFTER 'SUPER_ADMIN';
ALTER TYPE enum_users_role ADD VALUE 'EDITOR' AFTER 'ADMIN';
ALTER TYPE enum_users_role ADD VALUE 'VIEWER' AFTER 'EDITOR';

-- Step 2: Verify the enum now has all values
SELECT enumlabel FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_users_role');

-- If you encounter "ADMIN already exists" error, that means it's already added
-- In that case, just run the admin account INSERT statement
