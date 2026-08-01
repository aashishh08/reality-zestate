/**
 * Homepage featured corridor flags on locality rows (admin-controlled).
 */

import { DataTypes } from 'sequelize';

const LEGACY_FEATURED = [
  { slug: 'golf-course-road', featuredOrder: 1 },
  { slug: 'golf-course-road-extension', featuredOrder: 2 },
  { slug: 'noida-expressway', featuredOrder: 3 },
  { slug: 'dwarka-expressway', featuredOrder: 4 },
];

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function up(queryInterface) {
  await queryInterface.addColumn('locations', 'isFeatured', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });

  await queryInterface.addColumn('locations', 'featuredOrder', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  for (const { slug, featuredOrder } of LEGACY_FEATURED) {
    await queryInterface.sequelize.query(
      `UPDATE "locations"
       SET "isFeatured" = true, "featuredOrder" = :featuredOrder, "updatedAt" = NOW()
       WHERE "slug" = :slug AND "type" = 'locality'`,
      { replacements: { slug, featuredOrder } },
    );
  }
}

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function down(queryInterface) {
  await queryInterface.removeColumn('locations', 'featuredOrder');
  await queryInterface.removeColumn('locations', 'isFeatured');
}
