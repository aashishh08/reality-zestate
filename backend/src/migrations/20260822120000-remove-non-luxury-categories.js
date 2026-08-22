/**
 * Remove Affordable, Mid Segment, and Co-working categories (and property links).
 */

const REMOVED_CATEGORY_SLUGS = ['affordable', 'mid-segment', 'co-working'];

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function up(queryInterface) {
  await queryInterface.sequelize.query(
    `DELETE FROM "property_categories"
     WHERE "categoryId" IN (
       SELECT id FROM "categories" WHERE slug IN (:slugs)
     )`,
    { replacements: { slugs: REMOVED_CATEGORY_SLUGS } },
  );

  await queryInterface.sequelize.query(
    `DELETE FROM "categories" WHERE slug IN (:slugs)`,
    { replacements: { slugs: REMOVED_CATEGORY_SLUGS } },
  );
}

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function down(queryInterface) {
  // Intentionally no-op — these categories are not part of the luxury catalogue.
  await queryInterface.sequelize.query('SELECT 1');
}
