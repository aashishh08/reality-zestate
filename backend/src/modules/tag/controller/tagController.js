import tagService from '../service/tagService.js';

class TagController {
    // GET /tags
    async listTags(req, res) {
        const tags = await tagService.listTags();
        res.json({ success: true, data: tags });
    }

    // GET /tags/:slug
    async getTagBySlug(req, res) {
        const tag = await tagService.getTagBySlug(req.params.slug);
        res.json({ success: true, data: tag });
    }

    // GET /tags/:slug/properties
    async getPropertiesByTag(req, res) {
        const { slug } = req.params;
        const { limit, offset, locationId, developerId, propertyType, isPublished } = req.query;

        const result = await tagService.getPropertiesByTagSlug(slug, {
            limit: limit ? parseInt(limit, 10) : 12,
            offset: offset ? parseInt(offset, 10) : 0,
            locationId,
            developerId,
            propertyType,
            isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
        });

        res.json({
            success: true,
            data: result.properties,
            tag: result.tag,
            pagination: {
                total: result.total,
                limit: parseInt(limit || 12, 10),
                offset: parseInt(offset || 0, 10),
            },
        });
    }

    // POST /tags  (admin only)
    async createTag(req, res) {
        const { name, slug, description, color, icon } = req.body;
        if (!name || !slug) {
            throw { status: 400, message: 'Fields required: name, slug' };
        }
        const tag = await tagService.createTag({ name, slug, description, color, icon });
        res.status(201).json({ success: true, data: tag, message: 'Tag created successfully.' });
    }

    // PUT /tags/:id  (admin only)
    async updateTag(req, res) {
        const { name, slug, description, color, icon } = req.body;
        const tag = await tagService.updateTag(req.params.id, { name, slug, description, color, icon });
        res.json({ success: true, data: tag, message: 'Tag updated successfully.' });
    }

    // DELETE /tags/:id  (admin only)
    async deleteTag(req, res) {
        await tagService.deleteTag(req.params.id);
        res.json({ success: true, message: 'Tag deleted successfully.' });
    }
}

export default new TagController();
