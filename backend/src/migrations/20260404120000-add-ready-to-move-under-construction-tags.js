/**
 * Adds status tags used by listing filters + PropertyCard badges.
 * Idempotent: ON CONFLICT (slug) updates name/color.
 */

import { randomUUID } from 'crypto';

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function up(queryInterface) {
  const rows = [
    { name: 'Under Construction', slug: 'under-construction', color: '#F97316' },
    { name: 'Ready to Move', slug: 'ready-to-move', color: '#06B6D4' },
  ];
  for (const tag of rows) {
    await queryInterface.sequelize.query(
      `INSERT INTO "tags" ("id", "name", "slug", "color", "createdAt", "updatedAt")
       VALUES (:id, :name, :slug, :color, NOW(), NOW())
       ON CONFLICT ("slug") DO UPDATE SET
         "name" = EXCLUDED."name",
         "color" = EXCLUDED."color",
         "updatedAt" = NOW()`,
      {
        replacements: { id: randomUUID(), name: tag.name, slug: tag.slug, color: tag.color },
      },
    );
  }
}

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function down(queryInterface) {
  await queryInterface.sequelize.query(
    `DELETE FROM "tags" WHERE "slug" IN ('under-construction', 'ready-to-move')`,
  );
}
