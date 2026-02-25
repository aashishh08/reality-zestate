import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Tag = sequelize.define('Tag', {
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
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        color: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        icon: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
    }, {
        tableName: 'tags',
        timestamps: true,
    });

    return Tag;
};
