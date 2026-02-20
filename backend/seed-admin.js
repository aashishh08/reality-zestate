/**
 * seed-admin.js
 * Creates a properly hashed admin user directly in the database.
 * Run: node seed-admin.js
 */

import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'reality_estate_user',
  password: process.env.DB_PASSWORD || 'reality_estate_password',
  database: process.env.DB_NAME || 'reality_estate_db',
});

const EMAIL    = 'admin@opulnz.com';
const PASSWORD = 'Admin@1234';
const ROLE     = 'ADMIN';

async function seedAdmin() {
  const client = await pool.connect();

  try {
    console.log('\n🔐 Hashing password...');
    const hash = await bcrypt.hash(PASSWORD, 10);

    // Delete existing admin with same email so we can re-seed cleanly
    await client.query(`DELETE FROM users WHERE email = $1`, [EMAIL]);

    // Insert fresh admin
    const result = await client.query(
      `INSERT INTO users (id, email, password, role, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
       RETURNING id, email, role`,
      [EMAIL, hash, ROLE]
    );

    const user = result.rows[0];

    console.log('\n✅ Admin user created successfully!\n');
    console.log('┌─────────────────────────────────────────┐');
    console.log(`│  Email    : ${user.email.padEnd(29)}│`);
    console.log(`│  Password : ${PASSWORD.padEnd(29)}│`);
    console.log(`│  Role     : ${user.role.padEnd(29)}│`);
    console.log(`│  ID       : ${user.id.substring(0, 29)}│`);
    console.log('└─────────────────────────────────────────┘');
    console.log('\n🚀 Login at: http://localhost:3000/admin/login\n');

  } catch (err) {
    console.error('\n❌ Error creating admin user:', err.message);
    if (err.message.includes('enum')) {
      console.log('\n💡 Fix: Run this SQL first to add roles to the enum:');
      console.log("   ALTER TYPE enum_users_role ADD VALUE 'ADMIN' AFTER 'SUPER_ADMIN';");
      console.log("   ALTER TYPE enum_users_role ADD VALUE 'EDITOR' AFTER 'ADMIN';");
      console.log("   ALTER TYPE enum_users_role ADD VALUE 'VIEWER' AFTER 'EDITOR';");
    }
  } finally {
    client.release();
    await pool.end();
  }
}

seedAdmin();
