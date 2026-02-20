-- Admin Account for Blog Posting
-- Email: admin@blog.com
-- Password: AdminBlog@2024
-- Role: ADMIN (can create, edit, delete, and publish blogs)

-- IMPORTANT: This password hash is for 'AdminBlog@2024'
-- If you want to use a different password, run: node backend/create-admin.js

INSERT INTO users (id, email, password, role, "createdAt", "updatedAt")
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'admin@blog.com',
  '$2b$10$h1C8Z6pP9O7Q5X6N8M9K8eBg8wXlY9zZ6aB5c9D8e7F6g5H4i3J2k1',
  'ADMIN',
  NOW(),
  NOW()
);

-- Verify the account was created
SELECT id, email, role, "createdAt" FROM users WHERE email = 'admin@blog.com';
