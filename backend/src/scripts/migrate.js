#!/usr/bin/env node
/**
 * Migration Script for ES Module Support
 * Handles database migrations with Sequelize in an ES Module environment.
 * Can be run directly (node src/scripts/migrate.js) or called programmatically.
 */

import 'dotenv/config.js';
import { Sequelize } from 'sequelize';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import config from '../config/env.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export class MigrationRunner {
  constructor() {
    this.sequelize = new Sequelize({
      username: config.database.user,
      password: config.database.password,
      database: config.database.name,
      host: config.database.host,
      port: config.database.port,
      dialect: 'postgres',
      logging: (msg) => console.log(`[migrate] ${msg}`),
    });
  }

  async ensureMetaTable() {
    await this.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
        "name" VARCHAR(255) NOT NULL UNIQUE,
        PRIMARY KEY ("name")
      );
    `);
  }

  async getExecutedMigrations() {
    const [migrations] = await this.sequelize.query(
      'SELECT "name" FROM "SequelizeMeta" ORDER BY "name" ASC'
    );
    return migrations.map(m => m.name);
  }

  async getMigrationFiles() {
    const migrationsPath = join(__dirname, '../migrations');
    const files = await readdir(migrationsPath);
    return files
      .filter(f => f.endsWith('.js') && f.match(/^\d+/))
      .sort();
  }

  async runMigrations() {
    console.log('🔧 Starting database migrations...');
    console.log('DB Config:', {
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
    });

    try {
      await this.sequelize.authenticate();
      console.log('✅ Database connection established');

      await this.ensureMetaTable();
      console.log('✅ SequelizeMeta table ready');

      const executedMigrations = await this.getExecutedMigrations();
      const allMigrations = await this.getMigrationFiles();
      const pendingMigrations = allMigrations.filter(
        m => !executedMigrations.includes(m)
      );

      if (pendingMigrations.length === 0) {
        console.log('✅ No pending migrations — database is up to date');
        return;
      }

      console.log(`\nRunning ${pendingMigrations.length} pending migration(s)...\n`);

      for (const migration of pendingMigrations) {
        console.log(`== ${migration}: migrating =======`);
        try {
          const { up } = await import(`../migrations/${migration}`);
          const queryInterface = this.sequelize.getQueryInterface();
          await up(queryInterface, this.sequelize.constructor);

          // PostgreSQL uses $1 positional parameters, NOT ? placeholders
          await this.sequelize.query(
            'INSERT INTO "SequelizeMeta" ("name") VALUES ($1)',
            { bind: [migration] }
          );

          console.log(`✅ ${migration}: migrated\n`);
        } catch (error) {
          console.error(`❌ ${migration}: FAILED`);
          console.error(error.message);
          console.error(error.stack);
          throw error;
        }
      }

      console.log('✅ All migrations completed successfully!');
    } finally {
      await this.sequelize.close();
    }
  }
}

// Allow running directly: node src/scripts/migrate.js
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const runner = new MigrationRunner();
  runner.runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Migration failed:', err.message);
      process.exit(1);
    });
}
