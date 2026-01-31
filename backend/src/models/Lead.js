import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Lead = sequelize.define('Lead', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'new',
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'properties',
        key: 'id',
      },
      onDelete: 'SET NULL',
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
    tableName: 'leads',
    timestamps: true,
    indexes: [
      {
        fields: ['email'],
      },
      {
        fields: ['propertyId'],
      },
    ],
  });

  return Lead;
};
