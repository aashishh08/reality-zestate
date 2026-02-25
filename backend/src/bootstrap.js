#!/usr/bin/env node
/**
 * Production Entrypoint
 * 1. Runs all pending database migrations
 * 2. Runs all pending seeders
 * 3. Starts the Express server
 *
 * This is the script used by Docker / production (CMD in Dockerfile).
 */

import 'dotenv/config.js';
import { MigrationRunner } from './scripts/migrate.js';
import { SeedRunner } from './scripts/seed.js';

async function bootstrap() {
    // ── Step 1: Run Migrations ──────────────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  STEP 1: Database Migrations');
    console.log('═══════════════════════════════════════════════════════\n');

    const migrationRunner = new MigrationRunner();
    await migrationRunner.runMigrations();

    // ── Step 2: Run Seeders ─────────────────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  STEP 2: Database Seeding');
    console.log('═══════════════════════════════════════════════════════\n');

    const seedRunner = new SeedRunner();
    await seedRunner.runSeeds();

    // ── Step 3: Start the Express Server ────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  STEP 3: Starting API Server');
    console.log('═══════════════════════════════════════════════════════\n');

    // Dynamically import the app so it only boots AFTER migrations are done
    await import('./index.js');
}

bootstrap().catch((err) => {
    console.error('\n❌ Bootstrap failed — server will NOT start:', err.message);
    console.error(err.stack);
    process.exit(1);
});
