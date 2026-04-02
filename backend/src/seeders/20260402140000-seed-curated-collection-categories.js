/**
 * Idempotent: homepage “Curated Collections” category rows.
 * Safe if 20260210000001 already ran with the same slugs (ON CONFLICT updates).
 */

import { randomUUID } from 'crypto';

const CURATED = [
  { name: 'Golf Residences', slug: 'golf-residences', propertyType: 'residential' },
  { name: 'Branded Residences', slug: 'branded-residences', propertyType: 'residential' },
  { name: 'Himalayan Living', slug: 'himalayan-living', propertyType: 'residential' },
  { name: 'Senior Living', slug: 'senior-living', propertyType: 'residential' },
  { name: 'Ultra Villas', slug: 'ultra-villas', propertyType: 'residential' },
  { name: 'Off-Market', slug: 'off-market', propertyType: 'residential' },
];

export async function up(queryInterface) {
  for (const cat of CURATED) {
    await queryInterface.sequelize.query(
      `INSERT INTO "categories" ("id", "name", "slug", "propertyType", "parentId", "createdAt", "updatedAt")
       VALUES (:id, :name, :slug, :propertyType, NULL, NOW(), NOW())
       ON CONFLICT ("slug") DO UPDATE SET
         "name" = EXCLUDED."name",
         "propertyType" = EXCLUDED."propertyType",
         "updatedAt" = NOW()`,
      {
        replacements: {
          id: randomUUID(),
          name: cat.name,
          slug: cat.slug,
          propertyType: cat.propertyType,
        },
      },
    );
  }
}

export async function down() {
  // leave rows in place — shared with product data
}
