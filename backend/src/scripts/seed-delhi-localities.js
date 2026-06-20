/**
 * Standalone runner for Delhi localities (idempotent — safe to re-run).
 * Use when the timestamped seeder was already marked in SequelizeData.
 *
 * Run: node src/scripts/seed-delhi-localities.js
 *   or: yarn db:seed:delhi-localities
 */

import 'dotenv/config.js';
import { Sequelize } from 'sequelize';
import config from '../config/env.js';
import { up } from '../seeders/20260615150000-seed-delhi-localities.js';

const sequelize = new Sequelize({
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  host: config.database.host,
  port: config.database.port,
  dialect: 'postgres',
  logging: (msg) => console.log(`[seed-delhi] ${msg}`),
});

try {
  await sequelize.authenticate();
  console.log('✅ Database connected\n');

  const queryInterface = sequelize.getQueryInterface();
  await up(queryInterface);

  console.log('\n✅ Delhi localities seeded (8 localities under new-delhi).');
} catch (err) {
  console.error('❌ Failed:', err.message);
  process.exit(1);
} finally {
  await sequelize.close();
}
