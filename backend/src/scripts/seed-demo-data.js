/**
 * Seed script — creates the 5 developers and 4 cities needed by the bulk demo import.
 * Run: node src/scripts/seed-demo-data.js
 *
 * Safe to run multiple times — uses findOrCreate so no duplicates are inserted.
 */

import { Developer, Location, sequelize } from '../models/index.js';

const DEVELOPERS = [
    { name: 'DLF Limited', slug: 'dlf-limited', logo: '/images/developers/dlf.png' },
    { name: 'Godrej Properties', slug: 'godrej-properties', logo: '/images/developers/godrej.png' },
    { name: 'Prestige Group', slug: 'prestige-group', logo: '/images/developers/prestige.png' },
    { name: 'Sobha Limited', slug: 'sobha-limited', logo: '/images/developers/sobha.png' },
    { name: 'Lodha Group', slug: 'lodha-group', logo: '/images/developers/lodha.png' },

    // Also ensure Mahindra (used by the single-property template example)
    { name: 'Mahindra Lifespaces', slug: 'mahindra-lifespaces', logo: '/images/developers/mahindra.png' },
];

const LOCATIONS = [
    { name: 'Gurgaon', slug: 'gurgaon', type: 'city' },
    { name: 'Mumbai', slug: 'mumbai', type: 'city' },
    { name: 'Bangalore', slug: 'bangalore', type: 'city' },
    { name: 'Pune', slug: 'pune', type: 'city' },
    { name: 'Delhi', slug: 'delhi', type: 'city' },
    { name: 'Hyderabad', slug: 'hyderabad', type: 'city' },
    { name: 'Chennai', slug: 'chennai', type: 'city' },
    { name: 'Noida', slug: 'noida', type: 'city' },
    { name: 'Thane', slug: 'thane', type: 'city' },
];

async function seed() {
    await sequelize.authenticate();
    console.log('✅ DB connected\n');

    console.log('── Developers ─────────────────────────────────────────');
    for (const d of DEVELOPERS) {
        const [record, created] = await Developer.findOrCreate({
            where: { slug: d.slug },
            defaults: d,
        });
        console.log(`  ${created ? '🆕 Created' : '✔  Exists '} → ${record.name} (${record.id})`);
    }

    console.log('\n── Locations ──────────────────────────────────────────');
    for (const l of LOCATIONS) {
        const [record, created] = await Location.findOrCreate({
            where: { slug: l.slug },
            defaults: l,
        });
        console.log(`  ${created ? '🆕 Created' : '✔  Exists '} → ${record.name} (${record.id})`);
    }

    console.log('\n✅ Seed complete! You can now import the bulk demo Excel.\n');
    await sequelize.close();
}

seed().catch(err => {
    console.error('❌ Seed failed:', err.message || err);
    process.exit(1);
});
