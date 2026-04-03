#!/usr/bin/env node
/**
 * Removes SequelizeMeta rows for migrations that were squashed into
 * 20260403120000-baseline-schema.js. Safe to run once after deploying the squash.
 * Does not change application data.
 */

import 'dotenv/config.js';
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import config from '../config/env.js';

const SUPERSEDED = [
  '20260131000001-create-users-table.js',
  '20260131000002-create-developers-table.js',
  '20260131000003-create-locations-table.js',
  '20260131000004-create-categories-table.js',
  '20260131000005-create-properties-table.js',
  '20260131000006-create-property-categories-table.js',
  '20260131000007-create-property-sections-table.js',
  '20260131000008-create-blogs-table.js',
  '20260131000009-create-leads-table.js',
  '20260224000001-create-tags-tables.js',
  '20260315000001-migrate-keytakeaways-structured.js',
  '20260315000002-sanitize-blog-content.js',
  '20260319000001-add-seo-fields-to-properties.js',
  '20260401000001-add-enum-slugs-to-properties.js',
  '20260402130000-canonical-developers-only.js',
];

async function main() {
  const sequelize = new Sequelize({
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    const placeholders = SUPERSEDED.map((_, i) => `$${i + 1}`).join(', ');
    const [rows] = await sequelize.query(
      `DELETE FROM "SequelizeMeta" WHERE "name" IN (${placeholders}) RETURNING "name"`,
      { bind: SUPERSEDED },
    );
    console.log(`Removed ${rows.length} superseded migration meta row(s).`);
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
