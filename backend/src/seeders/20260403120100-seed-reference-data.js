/**
 * Reference data: admin user, locations (CITIES + LOCALITIES) and developers (DEVELOPERS)
 * from config/enums.js, plus categories and tags. Idempotent (ON CONFLICT).
 * Does not touch blogs or properties.
 */

import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { CITIES, LOCALITIES, DEVELOPERS } from '../config/enums.js';

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
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await queryInterface.sequelize.query(
    `INSERT INTO "users" ("id", "email", "password", "role", "createdAt", "updatedAt")
     VALUES (:id, :email, :password, :role, NOW(), NOW())
     ON CONFLICT ("email") DO UPDATE SET "password" = EXCLUDED."password", "role" = EXCLUDED."role", "updatedAt" = NOW()`,
    {
      replacements: {
        id: randomUUID(),
        email: 'admin@superluxere.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    },
  );

  const cityIdsBySlug = {};
  for (const { slug, label } of CITIES) {
    cityIdsBySlug[slug] = await insertLocation(queryInterface, {
      name: label,
      slug,
      type: 'city',
      parentId: null,
    });
  }

  for (const { slug, label, city } of LOCALITIES) {
    const parentId = cityIdsBySlug[city];
    if (!parentId) {
      throw new Error(
        `Seeder: locality "${slug}" references unknown city slug "${city}" — fix LOCALITIES in enums.js`,
      );
    }
    await insertLocation(queryInterface, {
      name: label,
      slug,
      type: 'locality',
      parentId,
    });
  }

  for (const { slug, label } of DEVELOPERS) {
    await queryInterface.sequelize.query(
      `INSERT INTO "developers" ("id", "name", "slug", "logo", "createdAt", "updatedAt")
       VALUES (:id, :name, :slug, NULL, NOW(), NOW())
       ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "updatedAt" = NOW()`,
      { replacements: { id: randomUUID(), name: label, slug } },
    );
  }

  for (const cat of [
    { name: 'Golf Residences', slug: 'golf-residences', propertyType: 'residential' },
    { name: 'Branded Residences', slug: 'branded-residences', propertyType: 'residential' },
    { name: 'Himalayan Living', slug: 'himalayan-living', propertyType: 'residential' },
    { name: 'Senior Living', slug: 'senior-living', propertyType: 'residential' },
    { name: 'Ultra Villas', slug: 'ultra-villas', propertyType: 'residential' },
    { name: 'Off-Market', slug: 'off-market', propertyType: 'residential' },
    { name: 'Luxury', slug: 'luxury', propertyType: 'residential' },
    { name: 'Ultra Luxury', slug: 'ultra-luxury', propertyType: 'residential' },
    { name: 'Affordable', slug: 'affordable', propertyType: 'residential' },
    { name: 'Mid Segment', slug: 'mid-segment', propertyType: 'residential' },
    { name: 'Plotted', slug: 'plotted', propertyType: 'residential' },
    { name: 'Villa', slug: 'villa', propertyType: 'residential' },
    { name: 'Commercial', slug: 'commercial', propertyType: 'commercial' },
    { name: 'Office Space', slug: 'office-space', propertyType: 'commercial' },
    { name: 'Retail', slug: 'retail', propertyType: 'commercial' },
    { name: 'Co-working', slug: 'co-working', propertyType: 'commercial' },
    { name: 'Industrial', slug: 'industrial', propertyType: 'commercial' },
  ]) {
    await queryInterface.sequelize.query(
      `INSERT INTO "categories" ("id", "name", "slug", "propertyType", "parentId", "createdAt", "updatedAt")
       VALUES (:id, :name, :slug, :propertyType, NULL, NOW(), NOW())
       ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "propertyType" = EXCLUDED."propertyType", "updatedAt" = NOW()`,
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

  const tags = [
    { name: 'Trending', slug: 'trending', color: '#B87C5B' },
    { name: 'Upcoming', slug: 'upcoming', color: '#10B981' },
    { name: 'Featured', slug: 'featured', color: '#3B82F6' },
    { name: 'Best Seller', slug: 'best-seller', color: '#F97316' },
    { name: 'New Launch', slug: 'new-launch', color: '#8B5CF6' },
    { name: 'Hot Property', slug: 'hot-property', color: '#EF4444' },
    { name: 'Investment Pick', slug: 'investment-pick', color: '#10B981' },
    { name: 'Vastu Compliant', slug: 'vastu-compliant', color: '#F59E0B' },
  ];
  for (const tag of tags) {
    await queryInterface.sequelize.query(
      `INSERT INTO "tags" ("id", "name", "slug", "color", "createdAt", "updatedAt")
       VALUES (:id, :name, :slug, :color, NOW(), NOW())
       ON CONFLICT ("slug") DO UPDATE
       SET "name" = EXCLUDED."name", "color" = EXCLUDED."color", "updatedAt" = NOW()`,
      {
        replacements: {
          id: randomUUID(),
          name: tag.name,
          slug: tag.slug,
          color: tag.color,
        },
      },
    );
  }

}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('tags', {}, {});
  await queryInterface.bulkDelete('categories', {}, {});
  await queryInterface.bulkDelete('developers', {}, {});
  await queryInterface.bulkDelete('locations', {}, {});
}
