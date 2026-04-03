#!/usr/bin/env node
/**
 * Wipes property graph + reference data so you can re-seed from a clean slate.
 * Preserves: users, blogs (and SequelizeMeta).
 * Clears SequelizeData so `npm run db:seed` will run the reference seeder again.
 *
 * Usage: node src/scripts/truncate-non-blog-data.js
 */

import 'dotenv/config.js';
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import config from '../config/env.js';

async function main() {
  const sequelize = new Sequelize({
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: console.log,
  });

  try {
    await sequelize.authenticate();
    await sequelize.query(`
      TRUNCATE TABLE
        "property_tags",
        "property_sections",
        "property_categories",
        "leads",
        "properties",
        "tags",
        "categories",
        "locations",
        "developers"
      RESTART IDENTITY CASCADE;
    `);
    await sequelize.query('DELETE FROM "SequelizeData"');
    console.log('✅ Truncated property + reference tables; blogs and users unchanged. SequelizeData cleared.');
  } finally {
    await sequelize.close();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export default main;
