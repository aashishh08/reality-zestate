/**
 * Example seeder template
 * Copy this file to add new seeders with the pattern: YYYYMMDDHHMMSS_seeder-name.js
 */

export async function up(queryInterface) {
  await queryInterface.bulkInsert('examples', [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Example 1',
      description: 'This is an example record',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('examples', null, {});
}
