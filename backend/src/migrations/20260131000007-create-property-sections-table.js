export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('property_sections', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    propertyId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    order: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    isVisible: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    data: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });

  await queryInterface.addIndex('property_sections', ['propertyId']);
  await queryInterface.addIndex('property_sections', ['order']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('property_sections');
}
