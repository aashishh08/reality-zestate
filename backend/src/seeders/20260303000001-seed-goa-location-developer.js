/**
 * Seed: Goa State, Cities, Localities & Developer
 * Adds Goa to the location hierarchy and seeds a Goa-based luxury developer.
 * Idempotent — uses ON CONFLICT DO UPDATE so it is safe to re-run.
 */

import { randomUUID } from 'crypto';

async function insertLocation(queryInterface, { name, slug, type, parentId }) {
    const newId = randomUUID();
    const rows = await queryInterface.sequelize.query(
        `INSERT INTO "locations" ("id", "name", "slug", "type", "parentId", "createdAt", "updatedAt")
     VALUES (:id, :name, :slug, :type, :parentId, NOW(), NOW())
     ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "updatedAt" = NOW()
     RETURNING "id"`,
        {
            replacements: { id: newId, name, slug, type, parentId: parentId || null },
            type: queryInterface.sequelize.QueryTypes.SELECT,
        }
    );
    return rows[0].id;
}

export async function up(queryInterface) {
    // ── 1. Find India (country) ──────────────────────────────────────────────────
    const [indiaRows] = await queryInterface.sequelize.query(
        `SELECT "id" FROM "locations" WHERE "slug" = 'india' LIMIT 1`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const indiaId = indiaRows?.id;
    if (!indiaId) throw new Error('India location not found. Run the initial seed first.');

    // ── 2. Goa State ────────────────────────────────────────────────────────────
    const goaId = await insertLocation(queryInterface, {
        name: 'Goa', slug: 'goa', type: 'state', parentId: indiaId,
    });

    // ── 3. Cities ────────────────────────────────────────────────────────────────
    const panjiId = await insertLocation(queryInterface, {
        name: 'Panaji', slug: 'panaji', type: 'city', parentId: goaId,
    });
    const northGoaId = await insertLocation(queryInterface, {
        name: 'North Goa', slug: 'north-goa', type: 'city', parentId: goaId,
    });
    const southGoaId = await insertLocation(queryInterface, {
        name: 'South Goa', slug: 'south-goa', type: 'city', parentId: goaId,
    });

    // ── 4. North Goa Localities ──────────────────────────────────────────────────
    for (const locality of [
        { name: 'Anjuna', slug: 'anjuna' },
        { name: 'Assagao', slug: 'assagao' },
        { name: 'Vagator', slug: 'vagator' },
        { name: 'Siolim', slug: 'siolim' },
        { name: 'Candolim', slug: 'candolim' },
        { name: 'Calangute', slug: 'calangute' },
        { name: 'Baga', slug: 'baga' },
        { name: 'Arpora', slug: 'arpora' },
        { name: 'Porvorim', slug: 'porvorim' },
        { name: 'Mapusa', slug: 'mapusa' },
        { name: 'Morjim', slug: 'morjim' },
        { name: 'Mandrem', slug: 'mandrem' },
    ]) {
        await insertLocation(queryInterface, {
            ...locality, type: 'locality', parentId: northGoaId,
        });
    }

    // ── 5. South Goa Localities ──────────────────────────────────────────────────
    for (const locality of [
        { name: 'Colva', slug: 'colva' },
        { name: 'Benaulim', slug: 'benaulim' },
        { name: 'Palolem', slug: 'palolem' },
        { name: 'Cavelossim', slug: 'cavelossim' },
        { name: 'Majorda', slug: 'majorda' },
    ]) {
        await insertLocation(queryInterface, {
            ...locality, type: 'locality', parentId: southGoaId,
        });
    }

    // ── 6. Panaji Localities ─────────────────────────────────────────────────────
    for (const locality of [
        { name: 'Dona Paula', slug: 'dona-paula' },
        { name: 'Miramar', slug: 'miramar' },
        { name: 'Caranzalem', slug: 'caranzalem' },
    ]) {
        await insertLocation(queryInterface, {
            ...locality, type: 'locality', parentId: panjiId,
        });
    }

    // ── 7. Developers ────────────────────────────────────────────────────────────
    const developers = [
        { name: 'Mahindra Lifespaces', slug: 'mahindra-lifespaces' },
        { name: 'Sterling & Wilson', slug: 'sterling-wilson' },
        { name: 'Rohan Builders', slug: 'rohan-builders' },
        { name: 'Casa Goa Developers', slug: 'casa-goa-developers' },
        { name: 'Brigade Group', slug: 'brigade-group' },
    ];

    for (const dev of developers) {
        await queryInterface.sequelize.query(
            `INSERT INTO "developers" ("id", "name", "slug", "logo", "createdAt", "updatedAt")
       VALUES (:id, :name, :slug, NULL, NOW(), NOW())
       ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "updatedAt" = NOW()`,
            { replacements: { id: randomUUID(), name: dev.name, slug: dev.slug } }
        );
    }
}

export async function down(queryInterface) {
    // Remove only Goa-specific data (safe — does not touch other states)
    await queryInterface.sequelize.query(
        `DELETE FROM "locations" WHERE "slug" IN (
      'anjuna','assagao','vagator','siolim','candolim','calangute','baga','arpora',
      'porvorim','mapusa','morjim','mandrem','colva','benaulim','palolem','cavelossim',
      'majorda','dona-paula','miramar','caranzalem','panaji','north-goa','south-goa','goa'
    )`
    );
    await queryInterface.sequelize.query(
        `DELETE FROM "developers" WHERE "slug" IN (
      'mahindra-lifespaces','sterling-wilson','rohan-builders',
      'casa-goa-developers','brigade-group'
    )`
    );
}
