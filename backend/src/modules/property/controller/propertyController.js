import propertyService from '../service/propertyService.js';

class PropertyController {
  async createProperty(req, res) {
    const { slug, title, propertyType, developerId, locationId, status, priceMin, priceMax, isPublished } = req.body;

    if (!slug || !title || !propertyType || !developerId || !locationId) {
      throw { status: 400, message: 'Missing required fields: slug, title, propertyType, developerId, locationId' };
    }

    const property = await propertyService.createProperty({
      slug, title, propertyType, developerId, locationId, status, priceMin, priceMax, isPublished,
    });

    res.status(201).json({ success: true, data: property, message: 'Property created successfully' });
  }

  async updateProperty(req, res) {
    const { id } = req.params;
    const { slug, title, propertyType, developerId, locationId, status, priceMin, priceMax, isPublished } = req.body;

    const property = await propertyService.updateProperty(id, {
      slug, title, propertyType, developerId, locationId, status, priceMin, priceMax, isPublished,
    });

    res.json({ success: true, data: property, message: 'Property updated successfully' });
  }

  async deleteProperty(req, res) {
    await propertyService.deleteProperty(req.params.id);
    res.json({ success: true, message: 'Property deleted successfully' });
  }

  async getPropertyBySlug(req, res) {
    const property = await propertyService.getPropertyBySlug(req.params.slug);
    res.json({ success: true, data: property });
  }

  async listProperties(req, res) {
    const {
      propertyType, locationId, developerId, categoryIds,
      tags,      // comma-separated slugs OR repeated: ?tags=upcoming&tags=featured
      priceMin, priceMax, isPublished,
      sort = 'newest',
      limit = 10, offset = 0,
    } = req.query;

    // Normalise tags: accept both "upcoming,trending" and ["upcoming","trending"]
    const tagSlugs = tags
      ? (Array.isArray(tags) ? tags : tags.split(',').map(s => s.trim())).filter(Boolean)
      : undefined;

    const filters = {
      propertyType,
      locationId,
      developerId,
      categoryIds: categoryIds
        ? (Array.isArray(categoryIds) ? categoryIds : [categoryIds])
        : undefined,
      tagSlugs,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
      isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
      sort,
      limit,
      offset,
    };

    const result = await propertyService.listProperties(filters);

    res.json({
      success: true,
      data: result.properties,
      pagination: {
        total: result.total,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  }

  async createPropertySections(req, res) {
    const { sections } = req.body;
    if (!sections) throw { status: 400, message: 'Sections array is required' };

    const created = await propertyService.createPropertySections(req.params.id, sections);
    res.status(201).json({ success: true, data: created, message: 'Property sections created successfully' });
  }

  async updatePropertySections(req, res) {
    const { sections } = req.body;
    if (!sections) throw { status: 400, message: 'Sections array is required' };

    const updated = await propertyService.updatePropertySections(req.params.id, sections);
    res.json({ success: true, data: updated, message: 'Property sections updated successfully' });
  }

  // ── Full property creation (core + sections + tags + categories) ──────────────
  async createPropertyFull(req, res) {
    const result = await propertyService.createPropertyFull(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: `Property "${result.property.title}" created successfully with ${result.sectionsCreated} section(s).`,
    });
  }

  // ── Get full property by ID for admin editing ────────────────────────────────
  async getPropertyFullById(req, res) {
    const property = await propertyService.getPropertyFullById(req.params.id);
    res.json({ success: true, data: property });
  }

  // ── Full property update (core + sections + tags + categories) ────────────────
  async updatePropertyFull(req, res) {
    const result = await propertyService.updatePropertyFull(req.params.id, req.body);
    res.json({
      success: true,
      data: result,
      message: `Property "${result.property.title}" updated successfully with ${result.sectionsUpdated} section(s).`,
    });
  }

  // ── Admin listing: all properties with section info ─────────────────────
  async listAllProperties(req, res) {
    const { isPublished, propertyType, limit = 100, offset = 0 } = req.query;
    const result = await propertyService.listAllProperties({
      isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
      propertyType,
      limit,
      offset,
    });
    res.json({
      success: true,
      data: result.properties,
      pagination: { total: result.total, limit: parseInt(limit, 10), offset: parseInt(offset, 10) },
    });
  }
}

export default new PropertyController();
