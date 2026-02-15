#!/usr/bin/env node
/**
 * Seed Script for ES Module Support
 * Handles database seeding with Sequelize in an ES Module environment
 */

import 'dotenv/config.js';
import { Sequelize } from 'sequelize';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import config from '../config/env.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

class SeedRunner {
  constructor() {
    console.log('🌱 Initializing Sequelize connection for seeding...');
    
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

  async getSeedFiles() {
    const seedersPath = join(__dirname, '../seeders');
    const files = await readdir(seedersPath);
    return files
      .filter(f => f.endsWith('.js') && f.startsWith('20260210'))
      .sort();
  }

  async runSeeds() {
    try {
      console.log('Testing database connection...');
      await this.sequelize.authenticate();
      console.log('✅ Database connection established');

      const seedFiles = await this.getSeedFiles();

      if (seedFiles.length === 0) {
        console.log('✅ No seed files found');
        return;
      }

      console.log(`\nRunning ${seedFiles.length} seed file(s)...\n`);

      for (const seed of seedFiles) {
        console.log(`== ${seed}: seeding =======`);
        try {
          const { up } = await import(`../seeders/${seed}`);
          const queryInterface = this.sequelize.getQueryInterface();
          await up(queryInterface, this.sequelize.constructor);

          console.log(`✅ ${seed}: seeded\n`);
        } catch (error) {
          console.error(`❌ ${seed}: failed`);
          console.error(error.message);
          console.error(error.stack);
          process.exit(1);
        }
      }

      console.log('✅ All seeds completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Seeding failed:', error.message);
      console.error(error.stack);
      process.exit(1);
    } finally {
      await this.sequelize.close();
    }
  }
}

const runner = new SeedRunner();
runner.runSeeds();
