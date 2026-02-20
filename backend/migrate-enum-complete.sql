-- Migration: Update users table role enum
-- This script handles both old and new database setups

-- OPTION 1: If the enum already has SUPER_ADMIN only (current state)
-- Run this to add the new roles:

ALTER TYPE enum_users_role ADD VALUE 'ADMIN' AFTER 'SUPER_ADMIN';
ALTER TYPE enum_users_role ADD VALUE 'EDITOR' AFTER 'ADMIN';
ALTER TYPE enum_users_role ADD VALUE 'VIEWER' AFTER 'EDITOR';

-- OPTION 2: If the above doesn't work, create a new type and migrate:
-- (Uncomment if needed)

/*
-- Create backup of existing data
CREATE TABLE users_backup AS SELECT * FROM users;

-- Drop the column with the old enum
ALTER TABLE users DROP COLUMN role;

-- Drop the old enum type
DROP TYPE enum_users_role;

-- Create the new enum type with all values
CREATE TYPE enum_users_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER');

-- Add the column back with the new enum
ALTER TABLE users ADD COLUMN role enum_users_role DEFAULT 'VIEWER' NOT NULL;

-- Restore data (users were backed up, role will be VIEWER as default)
-- If you need to restore specific roles, update as needed:
-- UPDATE users SET role = 'SUPER_ADMIN' WHERE ... 

-- Drop the backup table
-- DROP TABLE users_backup;
*/

-- OPTION 3: Complete replacement (safest for development)
-- This recreates everything from scratch:

/*
-- Create a temporary users table with the new enum
CREATE TEMP TABLE users_temp AS SELECT * FROM users;

-- Drop all constraints
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;

-- Drop the old enum
DROP TYPE IF EXISTS enum_users_role CASCADE;

-- Create new enum with all roles
CREATE TYPE enum_users_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER');

-- Drop and recreate the users table
DROP TABLE users;

CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role enum_users_role NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Restore data
INSERT INTO users SELECT * FROM users_temp;
*/

-- Verify the enum has all values
SELECT enumlabel FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_users_role')
ORDER BY enumsortorder;

-- Should return:
-- SUPER_ADMIN
-- ADMIN
-- EDITOR
-- VIEWER
