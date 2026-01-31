import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PropertyCategory = sequelize.define('PropertyCategory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    tableName: 'property_categories',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['propertyId', 'categoryId'],
      },
    ],
  });

  return PropertyCategory;
};
