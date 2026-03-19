export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('properties', 'seoTitle', {
    type: Sequelize.STRING(90),
    allowNull: true,
  });
  await queryInterface.addColumn('properties', 'h1Heading', {
    type: Sequelize.STRING(120),
    allowNull: true,
  });
  await queryInterface.addColumn('properties', 'metaDescription', {
    type: Sequelize.STRING(158),
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('properties', 'seoTitle');
  await queryInterface.removeColumn('properties', 'h1Heading');
  await queryInterface.removeColumn('properties', 'metaDescription');
}
