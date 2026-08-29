/**
 * Add Elan Group, Shapoorji Pallonji, Galaxy Sawasdee Group, and Conscient Infrastructure.
 */

import { randomUUID } from 'crypto';

const NEW_DEVELOPERS = [
  { name: 'Elan Group', slug: 'elan-group' },
  { name: 'Shapoorji Pallonji', slug: 'shapoorji-pallonji' },
  { name: 'Galaxy Sawasdee Group', slug: 'galaxy-sawasdee-group' },
  { name: 'Conscient Infrastructure', slug: 'conscient-infrastructure' },
];

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function up(queryInterface) {
  for (const dev of NEW_DEVELOPERS) {
    await queryInterface.sequelize.query(
      `INSERT INTO "developers" ("id", "name", "slug", "logo", "createdAt", "updatedAt")
       VALUES (:id, :name, :slug, NULL, NOW(), NOW())
       ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "updatedAt" = NOW()`,
      { replacements: { id: randomUUID(), name: dev.name, slug: dev.slug } },
    );
  }
}

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function down(queryInterface) {
  await queryInterface.sequelize.query(
    `DELETE FROM "developers" WHERE slug IN (:slugs)`,
    { replacements: { slugs: NEW_DEVELOPERS.map((d) => d.slug) } },
  );
}
