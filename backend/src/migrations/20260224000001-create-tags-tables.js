/**
 * Migration: Create tags + property_tags tables
 *
 * Design decisions:
 *  - Tags are a flat, open-ended labelling system (no hierarchy, no propertyType constraint).
 *    They answer "what is this property known for / how should it be discovered?".
 *    Examples: upcoming, trending, featured, new-launch, ready-to-move, luxury-homes …
 *
 *  - categories (existing) answer "what segment does this property belong to?".
 *    They are intentionally kept separate.
 *
 *  - property_tags is a simple many-to-many join with a unique constraint so a tag
 *    can only be applied to a property once.
 */

export async function up(queryInterface, Sequelize) {
    // ─── tags ──────────────────────────────────────────────────────────────────
    await queryInterface.createTable('tags', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        slug: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        // Optional: UI hint for rendering tag badges / filter chips
        color: {
            type: Sequelize.STRING(20),
            allowNull: true,
            comment: 'Hex colour for badge, e.g. #F59E0B',
        },
        icon: {
            type: Sequelize.STRING(50),
            allowNull: true,
            comment: 'Icon key consumed by the frontend icon library',
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

    await queryInterface.addIndex('tags', ['slug'], { unique: true, name: 'tags_slug_unique' });

    // ─── property_tags (join) ───────────────────────────────────────────────────
    await queryInterface.createTable('property_tags', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        propertyId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: { model: 'properties', key: 'id' },
            onDelete: 'CASCADE',
        },
        tagId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: { model: 'tags', key: 'id' },
            onDelete: 'CASCADE',
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

    // Composite unique: a tag can only be applied once per property
    await queryInterface.addIndex('property_tags', ['propertyId', 'tagId'], {
        unique: true,
        name: 'unique_property_tag',
    });
    await queryInterface.addIndex('property_tags', ['propertyId'], { name: 'property_tags_propertyId' });
    await queryInterface.addIndex('property_tags', ['tagId'], { name: 'property_tags_tagId' });
}

export async function down(queryInterface) {
    await queryInterface.dropTable('property_tags');
    await queryInterface.dropTable('tags');
}
