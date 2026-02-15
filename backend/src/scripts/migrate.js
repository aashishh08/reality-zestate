#!/usr/bin/env node
/**
 * Migration Script for ES Module Support
 * Handles database migrations with Sequelize in an ES Module environment
 */

import 'dotenv/config.js';
import { Sequelize } from 'sequelize';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import config from '../config/env.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

class MigrationRunner {
  constructor() {
    console.log('🔧 Initializing Sequelize connection...');
    console.log('DB Config:', {
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
    });

    this.sequelize = new Sequelize({
      username: config.database.user,
      password: config.database.password,
      database: config.database.name,
      host: config.database.host,
      port: config.database.port,
      dialect: 'postgres',
      logging: console.log,
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
    try {
      console.log('Testing database connection...');
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
        console.log('✅ No pending migrations');
        return;
      }

      console.log(`\nRunning ${pendingMigrations.length} migration(s)...\n`);

      for (const migration of pendingMigrations) {
        console.log(`== ${migration}: migrating =======`);
        try {
          const { up } = await import(`../migrations/${migration}`);
          const queryInterface = this.sequelize.getQueryInterface();
          await up(queryInterface, this.sequelize.constructor);

          await this.sequelize.query(
            'INSERT INTO "SequelizeMeta" ("name") VALUES (?)',
            { replacements: [migration] }
          );

          console.log(`✅ ${migration}: migrated\n`);
        } catch (error) {
          console.error(`❌ ${migration}: failed`);
          console.error(error.message);
          process.exit(1);
        }
      }

      console.log('✅ All migrations completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      console.error(error.stack);
      process.exit(1);
    } finally {
      await this.sequelize.close();
    }
  }
}

const runner = new MigrationRunner();
runner.runMigrations();
