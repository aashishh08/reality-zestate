/**
 * Seed: Additional Tags
 * Create a few more tags for property highlighting.
 */

import { randomUUID } from 'crypto';

export async function up(queryInterface) {
    const tags = [
        { name: 'Trending', slug: 'trending', color: '#B87C5B' },
        { name: 'Upcoming', slug: 'upcoming', color: '#10B981' },
        { name: 'Featured', slug: 'featured', color: '#3B82F6' },
        { name: 'Best Seller', slug: 'best-seller', color: '#F97316' },
        { name: 'New Launch', slug: 'new-launch', color: '#8B5CF6' },
        { name: 'Hot Property', slug: 'hot-property', color: '#EF4444' },
        { name: 'Investment Pick', slug: 'investment-pick', color: '#10B981' },
        { name: 'Vastu Compliant', slug: 'vastu-compliant', color: '#F59E0B' }
    ];

    for (const tag of tags) {
        await queryInterface.sequelize.query(
            `INSERT INTO "tags" ("id", "name", "slug", "color", "createdAt", "updatedAt")
       VALUES (:id, :name, :slug, :color, NOW(), NOW())
       ON CONFLICT ("slug") DO UPDATE 
       SET "name" = EXCLUDED."name", 
           "color" = EXCLUDED."color", 
           "updatedAt" = NOW()`,
            {
                replacements: {
                    id: randomUUID(),
                    name: tag.name,
                    slug: tag.slug,
                    color: tag.color
                }
            }
        );
    }
}

export async function down(queryInterface) {
    // Not removing existing tags to avoid data loss
}
