import { Op } from 'sequelize';
import { Tag, PropertyTag, Property, Developer, Location, Category, sequelize } from '../../../models/index.js';

class TagService {
    // ── CRUD ────────────────────────────────────────────────────────────────────

    async createTag({ name, slug, description, color, icon }) {
        const existing = await Tag.findOne({ where: { slug } });
        if (existing) {
            throw { status: 409, message: `Tag with slug "${slug}" already exists.` };
        }
        return Tag.create({ name, slug, description, color, icon });
    }

    async listTags() {
        return Tag.findAll({ order: [['name', 'ASC']] });
    }

    async getTagBySlug(slug) {
        const tag = await Tag.findOne({ where: { slug } });
        if (!tag) throw { status: 404, message: `Tag "${slug}" not found.` };
        return tag;
    }

    async getTagById(id) {
        const tag = await Tag.findByPk(id);
        if (!tag) throw { status: 404, message: 'Tag not found.' };
        return tag;
    }

    async updateTag(id, data) {
        const tag = await this.getTagById(id);
        await tag.update(data);
        return tag;
    }

    async deleteTag(id) {
        const tag = await this.getTagById(id);
        // PropertyTag rows will CASCADE delete automatically
        await tag.destroy();
        return true;
    }

    // ── Property ↔ Tag helpers ──────────────────────────────────────────────────

    /**
     * Resolve an array of tag slugs to Tag instances.
     * Throws if any slug is not found so callers get a clear error.
     */
    async resolveTagSlugs(slugs = []) {
        if (!slugs.length) return [];
        const tags = await Tag.findAll({ where: { slug: { [Op.in]: slugs } } });

        const found = new Set(tags.map(t => t.slug));
        const missing = slugs.filter(s => !found.has(s));
        if (missing.length) {
            throw { status: 400, message: `Unknown tag slugs: ${missing.join(', ')}. Create them first via POST /api/v1/tags.` };
        }
        return tags;
    }

    /**
     * Replace all tags on a property with the given slugs.
     * Designed to be called inside an existing transaction.
     */
    async replaceTagsForProperty(propertyId, tagSlugs = [], transaction) {
        await PropertyTag.destroy({ where: { propertyId }, transaction });

        if (!tagSlugs.length) return [];

        const tags = await this.resolveTagSlugs(tagSlugs);
        const rows = tags.map(tag => ({ propertyId, tagId: tag.id }));
        return PropertyTag.bulkCreate(rows, { transaction, ignoreDuplicates: true });
    }

    // ── Listing properties filtered by tags ────────────────────────────────────

    /**
     * Returns all properties that have ALL of the given tag slugs.
     * Supports pagination and basic filters (locationId, developerId, …).
     */
    async getPropertiesByTagSlug(tagSlug, filters = {}) {
        const tag = await this.getTagBySlug(tagSlug);

        const { limit = 12, offset = 0, locationId, developerId, propertyType, isPublished } = filters;

        const where = {};
        if (locationId) where.locationId = locationId;
        if (developerId) where.developerId = developerId;
        if (propertyType) where.propertyType = propertyType;
        if (isPublished !== undefined) where.isPublished = isPublished;

        const { count, rows } = await Property.findAndCountAll({
            where,
            include: [
                { model: Developer },
                { model: Location },
                { model: Category, through: { attributes: [] } },
                {
                    model: Tag,
                    as: 'Tags',
                    where: { id: tag.id },
                    through: { attributes: [] },
                    required: true,
                },
            ],
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            order: [['createdAt', 'DESC']],
            distinct: true,
        });

        return { tag, total: count, properties: rows };
    }

    // ── findOrCreate helper for seeding and import ─────────────────────────────

    async findOrCreate({ name, slug, description = '', color = null, icon = null }) {
        const [tag] = await Tag.findOrCreate({
            where: { slug },
            defaults: { name, slug, description, color, icon },
        });
        return tag;
    }
}

export default new TagService();
