/**
 * Delhi localities — idempotent upsert into `locations` (parent city: new-delhi).
 * Also mirrored in config/enums.js LOCALITIES for admin dropdowns and API validation.
 */

import { randomUUID } from 'crypto';

const DELHI_CITY_SLUG = 'new-delhi';

const DELHI_LOCALITIES = [
  { slug: 'kamla-nagar', label: 'Kamla Nagar' },
  { slug: 'new-friends-colony', label: 'New Friends Colony' },
  { slug: 'south-delhi', label: 'South Delhi' },
  { slug: 'dwarka', label: 'Dwarka' },
  { slug: 'kirti-nagar', label: 'Kirti Nagar' },
  { slug: 'moti-nagar', label: 'Moti Nagar' },
  { slug: 'patel-road', label: 'Patel Road' },
  { slug: 'connaught-place', label: 'Connaught Place' },
];

async function insertLocation(queryInterface, { name, slug, type, parentId }) {
  const newId = randomUUID();
  const rows = await queryInterface.sequelize.query(
    `INSERT INTO "locations" ("id", "name", "slug", "type", "parentId", "createdAt", "updatedAt")
     VALUES (:id, :name, :slug, :type, :parentId, NOW(), NOW())
     ON CONFLICT ("slug") DO UPDATE SET
       "name" = EXCLUDED."name",
       "type" = EXCLUDED."type",
       "parentId" = EXCLUDED."parentId",
       "updatedAt" = NOW()
     RETURNING "id"`,
    {
      replacements: { id: newId, name, slug, type, parentId: parentId ?? null },
      type: queryInterface.sequelize.QueryTypes.SELECT,
    },
  );
  return rows[0].id;
}

export async function up(queryInterface) {
  const [cityRows] = await queryInterface.sequelize.query(
    `SELECT "id" FROM "locations" WHERE "slug" = :slug AND "type" = 'city' LIMIT 1`,
    {
      replacements: { slug: DELHI_CITY_SLUG },
      type: queryInterface.sequelize.QueryTypes.SELECT,
    },
  );

  const parentId = cityRows?.id;
  if (!parentId) {
    throw new Error(
      `Seeder: city "${DELHI_CITY_SLUG}" not found — run reference seeder first (yarn db:seed)`,
    );
  }

  for (const { slug, label } of DELHI_LOCALITIES) {
    await insertLocation(queryInterface, {
      name: label,
      slug,
      type: 'locality',
      parentId,
    });
  }
}

export async function down(queryInterface) {
  const slugs = DELHI_LOCALITIES.map((l) => l.slug);
  await queryInterface.sequelize.query(
    `DELETE FROM "locations" WHERE "slug" IN (:slugs) AND "type" = 'locality'`,
    { replacements: { slugs } },
  );
}
