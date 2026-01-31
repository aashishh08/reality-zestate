export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('property_categories', {
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
    categoryId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
      onDelete: 'CASCADE',
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

  await queryInterface.addIndex('property_categories', ['propertyId']);
  await queryInterface.addIndex('property_categories', ['categoryId']);
  await queryInterface.addIndex('property_categories', ['propertyId', 'categoryId'], {
    unique: true,
    name: 'unique_property_category',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('property_categories');
}
