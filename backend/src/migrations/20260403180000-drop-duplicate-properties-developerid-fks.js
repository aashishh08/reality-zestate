/**
 * Remove redundant duplicate FOREIGN KEY constraints on properties.developerId
 * (legacy from pre-baseline migrations). Keeps a single FK to developers(id).
 * Does not modify blogs or any blog-related tables.
 */

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function up(queryInterface) {
  const q = queryInterface.sequelize;
  await q.query('ALTER TABLE "properties" DROP CONSTRAINT IF EXISTS "properties_developerId_fkey1"');
  await q.query('ALTER TABLE "properties" DROP CONSTRAINT IF EXISTS "properties_developerId_fkey2"');
  await q.query('ALTER TABLE "properties" DROP CONSTRAINT IF EXISTS "properties_developerId_fkey3"');
}

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function down() {
  // Intentionally empty: re-adding duplicate FKs would not improve the schema.
}
