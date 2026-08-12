import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Location = sequelize.define('Location', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      index: true,
    },
    type: {
      type: DataTypes.ENUM('country', 'state', 'city', 'locality', 'sector'),
      allowNull: false,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'locations',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Show on homepage featured corridors (localities only)',
    },
    featuredOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Sort order on homepage featured corridors (lower first)',
    },
    seoTitle: {
      type: DataTypes.STRING(90),
      allowNull: true,
      comment: 'Optional override for page title and OG title',
    },
    metaDescription: {
      type: DataTypes.STRING(320),
      allowNull: true,
    },
    heroImageUrl: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      comment: 'Hero and Open Graph image URL',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'locations',
    timestamps: true,
  });

  return Location;
};
