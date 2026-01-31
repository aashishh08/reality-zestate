export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('properties', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    propertyType: {
      type: Sequelize.ENUM('residential', 'commercial'),
      allowNull: false,
    },
    developerId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'developers',
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    locationId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'locations',
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'draft',
    },
    priceMin: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    },
    priceMax: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    },
    isPublished: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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

  await queryInterface.addIndex('properties', ['slug']);
  await queryInterface.addIndex('properties', ['developerId']);
  await queryInterface.addIndex('properties', ['locationId']);
  await queryInterface.addIndex('properties', ['propertyType']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('properties');
}
