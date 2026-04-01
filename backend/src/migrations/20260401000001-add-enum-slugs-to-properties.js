/**
 * Migration: Add citySlug, localitySlug, developerSlug to properties table.
 *
 * These columns replace the need for runtime lookups through the locations
 * hierarchy and allow enum-style filtering directly on the properties table.
 *
 * - citySlug      : e.g. "gurgaon"
 * - localitySlug  : e.g. "golf-course-road"
 * - developerSlug : e.g. "dlf"
 *
 * NOTE: We use VARCHAR (not PostgreSQL ENUM type) so new values can be added
 * simply by updating src/config/enums.js without any DB migration.
 *
 * The existing locationId and developerId FK columns are kept for backwards
 * compatibility and will be phased out in a future migration.
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('properties', 'citySlug', {
    type: Sequelize.STRING(100),
    allowNull: true, // nullable during transition; set NOT NULL after backfill
  });

  await queryInterface.addColumn('properties', 'localitySlug', {
    type: Sequelize.STRING(100),
    allowNull: true,
  });

  await queryInterface.addColumn('properties', 'developerSlug', {
    type: Sequelize.STRING(100),
    allowNull: true,
  });

  // Add indexes for common filter queries
  await queryInterface.addIndex('properties', ['citySlug'],       { name: 'properties_city_slug_idx' });
  await queryInterface.addIndex('properties', ['localitySlug'],   { name: 'properties_locality_slug_idx' });
  await queryInterface.addIndex('properties', ['developerSlug'],  { name: 'properties_developer_slug_idx' });
  await queryInterface.addIndex('properties', ['citySlug', 'localitySlug'], { name: 'properties_city_locality_idx' });
}

export async function down(queryInterface) {
  await queryInterface.removeIndex('properties', 'properties_city_locality_idx');
  await queryInterface.removeIndex('properties', 'properties_developer_slug_idx');
  await queryInterface.removeIndex('properties', 'properties_locality_slug_idx');
  await queryInterface.removeIndex('properties', 'properties_city_slug_idx');

  await queryInterface.removeColumn('properties', 'developerSlug');
  await queryInterface.removeColumn('properties', 'localitySlug');
  await queryInterface.removeColumn('properties', 'citySlug');
}
