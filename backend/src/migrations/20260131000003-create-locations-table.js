export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('locations', {
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
    type: {
      type: Sequelize.ENUM('country', 'state', 'city', 'locality', 'sector'),
      allowNull: false,
    },
    parentId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'locations',
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

  await queryInterface.addIndex('locations', ['slug']);
  await queryInterface.addIndex('locations', ['parentId']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('locations');
}
