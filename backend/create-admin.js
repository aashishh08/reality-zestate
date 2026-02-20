#!/usr/bin/env node

/**
 * Admin Account Creator Script
 * Creates a hashed admin account for blog posting
 * 
 * Usage: node create-admin.js
 */

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function createAdminAccount() {
  const email = 'admin@blog.com';
  const password = 'AdminBlog@2024';
  const role = 'ADMIN';

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate UUID for admin
  const adminId = uuidv4();
  const now = new Date().toISOString();

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║         ADMIN ACCOUNT CREATED SUCCESSFULLY              ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log('📧 Email:    ', email);
  console.log('🔐 Password: ', password);
  console.log('👤 Role:     ', role);
  console.log('🆔 ID:       ', adminId);
  console.log('\n');

  console.log('SQL INSERT STATEMENT:');
  console.log('─'.repeat(60));
  console.log(`INSERT INTO users (id, email, password, role, "createdAt", "updatedAt")
VALUES (
  '${adminId}',
  '${email}',
  '${hashedPassword}',
  '${role}',
  '${now}',
  '${now}'
);\n`);

  console.log('JSON for Testing (Postman/cURL):');
  console.log('─'.repeat(60));
  console.log(`{
  "email": "${email}",
  "password": "${password}"
}\n`);

  console.log('LOGIN URL: http://localhost:3000/admin/login\n');

  console.log('✅ Account Details:');
  console.log('─'.repeat(60));
  console.log('1. Copy the SQL INSERT statement above');
  console.log('2. Run it in your PostgreSQL database');
  console.log('3. Go to http://localhost:3000/admin/login');
  console.log('4. Enter the email and password');
  console.log('5. Click "Sign In"');
  console.log('6. You\'ll be logged in as ADMIN');
  console.log('\n');
}

createAdminAccount().catch(console.error);
