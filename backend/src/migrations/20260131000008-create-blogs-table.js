export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('blogs', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    excerpt: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    authorName: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'Team Superluxere',
    },
    featuredImage: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    metaTitle: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    metaDescription: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    tags: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      defaultValue: [],
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

  await queryInterface.addIndex('blogs', ['slug']);
  await queryInterface.addIndex('blogs', ['isPublished']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('blogs');
}
