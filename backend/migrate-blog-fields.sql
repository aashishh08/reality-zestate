-- Migration: Add rich content fields to blogs table
-- Run once: psql -U <user> -d <database> -f migrate-blog-fields.sql

ALTER TABLE blogs
  ADD COLUMN IF NOT EXISTS excerpt         TEXT,
  ADD COLUMN IF NOT EXISTS "authorName"    VARCHAR(255) DEFAULT 'Team Opulnz Abode',
  ADD COLUMN IF NOT EXISTS "featuredImage" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "metaTitle"     VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "metaDescription" TEXT,
  ADD COLUMN IF NOT EXISTS tags            TEXT[] DEFAULT '{}';

-- Backfill authorName for existing rows
UPDATE blogs SET "authorName" = 'Team Opulnz Abode' WHERE "authorName" IS NULL;

SELECT 'Migration complete: blog rich-content fields added.' AS result;
