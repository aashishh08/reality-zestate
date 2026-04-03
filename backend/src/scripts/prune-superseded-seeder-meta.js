#!/usr/bin/env node
/**
 * Removes SequelizeData rows for seeders merged into 20260403120100-seed-reference-data.js.
 * Optional hygiene after deploy; does not change application data.
 */

import 'dotenv/config.js';
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import config from '../config/env.js';

const SUPERSEDED = [
  '20260210000001-seed-initial-data.js',
  '20260228000000-seed-additional-tags.js',
  '20260303000001-seed-goa-location-developer.js',
  '20260402140000-seed-curated-collection-categories.js',
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
      `DELETE FROM "SequelizeData" WHERE "name" IN (${placeholders}) RETURNING "name"`,
      { bind: SUPERSEDED },
    );
    console.log(`Removed ${rows.length} superseded seeder meta row(s).`);
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
