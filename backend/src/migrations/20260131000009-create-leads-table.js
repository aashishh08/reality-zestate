export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('leads', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'new',
    },
    source: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    propertyId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'properties',
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

  await queryInterface.addIndex('leads', ['email']);
  await queryInterface.addIndex('leads', ['propertyId']);
  await queryInterface.addIndex('leads', ['status']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('leads');
}
