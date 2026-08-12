import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Developer = sequelize.define('Developer', {
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
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
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
      comment: 'Hero and Open Graph image URL (falls back to logo)',
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
    tableName: 'developers',
    timestamps: true,
  });

  return Developer;
};
