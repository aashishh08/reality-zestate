import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const PropertyTag = sequelize.define('PropertyTag', {
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
        tagId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'tags',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    }, {
        tableName: 'property_tags',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['propertyId', 'tagId'],
            },
        ],
    });

    return PropertyTag;
};
