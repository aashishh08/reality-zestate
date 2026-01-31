export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('categories', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    propertyType: {
      type: Sequelize.ENUM('residential', 'commercial'),
      allowNull: false,
    },
    parentId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
      onDelete: 'SET NULL',
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

  await queryInterface.addIndex('categories', ['slug']);
  await queryInterface.addIndex('categories', ['parentId']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('categories');
}
