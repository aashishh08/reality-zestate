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
        },
        tagId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    }, {
        tableName: 'property_tags',
        timestamps: true,
    });

    return PropertyTag;
};
