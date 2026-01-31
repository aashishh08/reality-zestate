import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Property = sequelize.define('Property', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      index: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    propertyType: {
      type: DataTypes.ENUM('residential', 'commercial'),
      allowNull: false,
    },
    developerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'developers',
        key: 'id',
      },
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'locations',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'draft',
    },
    priceMin: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    priceMax: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: 'properties',
    timestamps: true,
  });

  return Property;
};
