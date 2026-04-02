/**
 * Canonical developers only — upsert the enum list, remap legacy slugs on properties,
 * clear invalid FKs, delete all other developer rows. Also allow nullable developerId
 * so properties can remain valid when a developer is removed.
 */

import { randomUUID } from 'crypto';

const DEVELOPERS = [
  { name: 'Max Estates', slug: 'max-estates' },
  { name: 'DLF', slug: 'dlf' },
  { name: 'Sobha', slug: 'sobha' },
  { name: 'Elevate', slug: 'elevate' },
  { name: 'Conscient Hines Elevate', slug: 'conscient-hines-elevate' },
  { name: 'Eldeco', slug: 'eldeco' },
  { name: 'Experion Developers', slug: 'experion-developers' },
  { name: 'Godrej Properties', slug: 'godrej-properties' },
  { name: 'Oberoi Realty', slug: 'oberoi-realty' },
  { name: 'Kreeva', slug: 'kreeva' },
  { name: 'Terra Grande', slug: 'terra-grande' },
  { name: 'Central Park', slug: 'central-park' },
  { name: 'Trac', slug: 'trac' },
  { name: 'trump tower', slug: 'trump-tower' },
  { name: 'm3m, smartworld', slug: 'm3m-smartworld' },
  { name: 'ats', slug: 'ats' },
  { name: 'Silver glades', slug: 'silver-glades' },
  { name: 'Adani Realty', slug: 'adani-realty' },
  { name: 'prestige group', slug: 'prestige-group' },
  { name: 'AIPL', slug: 'aipl' },
  { name: 'Max Antara', slug: 'max-antara' },
];

const ALLOWED_SLUGS_SQL = DEVELOPERS.map((d) => `'${d.slug.replace(/'/g, "''")}'`).join(', ');

export async function up(queryInterface) {
  // Sequelize changeColumn often fails to relax NOT NULL when an FK exists; raw SQL is reliable.
  await queryInterface.sequelize.query(
    'ALTER TABLE "properties" ALTER COLUMN "developerId" DROP NOT NULL'
  );

  for (const dev of DEVELOPERS) {
    await queryInterface.sequelize.query(
      `INSERT INTO "developers" ("id", "name", "slug", "logo", "createdAt", "updatedAt")
       VALUES (:id, :name, :slug, NULL, NOW(), NOW())
       ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "updatedAt" = NOW()`,
      { replacements: { id: randomUUID(), name: dev.name, slug: dev.slug } }
    );
  }

  await queryInterface.sequelize.query(`
    UPDATE "properties"
    SET "developerSlug" = CASE "developerSlug"
      WHEN 'godrej' THEN 'godrej-properties'
      WHEN 'm3m-india' THEN 'm3m-smartworld'
      WHEN 'm3m' THEN 'm3m-smartworld'
      WHEN 'smartworld-developers' THEN 'm3m-smartworld'
      WHEN 'experion' THEN 'experion-developers'
      WHEN 'conscient' THEN 'conscient-hines-elevate'
      WHEN 'shapoorji-pallonji' THEN 'central-park'
      WHEN 'eldeco-terra-grande' THEN 'terra-grande'
      WHEN 'prestige' THEN 'prestige-group'
      ELSE "developerSlug"
    END
    WHERE "developerSlug" IS NOT NULL
  `);

  await queryInterface.sequelize.query(`
    UPDATE "properties" p
    SET "developerSlug" = d.slug
    FROM "developers" d
    WHERE p."developerId" = d.id AND (p."developerSlug" IS NULL OR p."developerSlug" = '')
  `);

  await queryInterface.sequelize.query(`
    UPDATE "properties" p
    SET "developerId" = d.id
    FROM "developers" d
    WHERE p."developerSlug" = d.slug
  `);

  await queryInterface.sequelize.query(`
    UPDATE "properties"
    SET "developerId" = NULL, "developerSlug" = NULL
    WHERE "developerId" IN (
      SELECT id FROM "developers" WHERE slug NOT IN (${ALLOWED_SLUGS_SQL})
    )
  `);

  await queryInterface.sequelize.query(`
    UPDATE "properties"
    SET "developerId" = NULL, "developerSlug" = NULL
    WHERE "developerSlug" IS NOT NULL
      AND "developerSlug" NOT IN (${ALLOWED_SLUGS_SQL})
  `);

  await queryInterface.sequelize.query(`
    DELETE FROM "developers" WHERE slug NOT IN (${ALLOWED_SLUGS_SQL})
  `);
}

export async function down() {
  // Irreversible: legacy developer rows are not restored.
}
