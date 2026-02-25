#!/usr/bin/env node
/**
 * Seed Script for ES Module Support
 * Handles database seeding with Sequelize in an ES Module environment.
 * Idempotent: tracks which seeders have been run in "SequelizeData" table.
 */

import 'dotenv/config.js';
import { Sequelize } from 'sequelize';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import config from '../config/env.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export class SeedRunner {
  constructor() {
    console.log('🌱 Initializing Sequelize connection for seeding...');

    this.sequelize = new Sequelize({
      username: config.database.user,
      password: config.database.password,
      database: config.database.name,
      host: config.database.host,
      port: config.database.port,
      dialect: 'postgres',
      logging: (msg) => console.log(`[seed] ${msg}`),
    });
  }

  async ensureMetaTable() {
    await this.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "SequelizeData" (
        "name" VARCHAR(255) NOT NULL UNIQUE,
        PRIMARY KEY ("name")
      );
    `);
  }

  async getExecutedSeeders() {
    const [seeders] = await this.sequelize.query(
      'SELECT "name" FROM "SequelizeData" ORDER BY "name" ASC'
    );
    return seeders.map(s => s.name);
  }

  async getSeedFiles() {
    const seedersPath = join(__dirname, '../seeders');
    const files = await readdir(seedersPath);
    // Only pick timestamped seeder files (ignore EXAMPLE_ prefixed files)
    return files
      .filter(f => f.endsWith('.js') && f.match(/^\d+/))
      .sort();
  }

  async runSeeds() {
    try {
      console.log('Testing database connection...');
      await this.sequelize.authenticate();
      console.log('✅ Database connection established');

      await this.ensureMetaTable();
      console.log('✅ SequelizeData table ready');

      const executedSeeders = await this.getExecutedSeeders();
      const seedFiles = await this.getSeedFiles();
      const pendingSeeders = seedFiles.filter(f => !executedSeeders.includes(f));

      if (pendingSeeders.length === 0) {
        console.log('✅ No pending seeders — data is already seeded');
        return;
      }

      console.log(`\nRunning ${pendingSeeders.length} pending seeder(s)...\n`);

      for (const seed of pendingSeeders) {
        console.log(`== ${seed}: seeding =======`);
        try {
          const { up } = await import(`../seeders/${seed}`);
          const queryInterface = this.sequelize.getQueryInterface();
          await up(queryInterface, this.sequelize.constructor);

          // Mark seeder as executed
          await this.sequelize.query(
            'INSERT INTO "SequelizeData" ("name") VALUES ($1)',
            { bind: [seed] }
          );

          console.log(`✅ ${seed}: seeded\n`);
        } catch (error) {
          console.error(`❌ ${seed}: FAILED`);
          console.error(error.message);
          console.error(error.stack);
          throw error;
        }
      }

      console.log('✅ All seeders completed successfully!');
    } finally {
      await this.sequelize.close();
    }
  }
}

// Allow running directly: node src/scripts/seed.js
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const runner = new SeedRunner();
  runner.runSeeds()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err.message);
      process.exit(1);
    });
}
