import propertyService from '../service/propertyService.js';

class PropertyController {
  async createProperty(req, res) {
    const { slug, title, propertyType, status, priceMin, priceMax, isPublished } = req.body;

    if (!slug || !title || !propertyType) {
      throw { status: 400, message: 'Missing required fields: slug, title, propertyType' };
    }

    const property = await propertyService.createProperty({
      slug, title, propertyType, status, priceMin, priceMax, isPublished,
    });

    res.status(201).json({ success: true, data: property, message: 'Property created successfully' });
  }

  async updateProperty(req, res) {
    const { id } = req.params;
    const { slug, title, propertyType, status, priceMin, priceMax, isPublished } = req.body;

    const property = await propertyService.updateProperty(id, {
      slug, title, propertyType, status, priceMin, priceMax, isPublished,
    });

    res.json({ success: true, data: property, message: 'Property updated successfully' });
  }

  async deleteProperty(req, res) {
    await propertyService.deleteProperty(req.params.id);
    res.json({ success: true, message: 'Property deleted successfully' });
  }

  async getPropertyBySlug(req, res) {
    const isAdmin = Boolean(req.user);
    const property = await propertyService.getPropertyBySlug(req.params.slug);

    // Unpublished properties are only visible to authenticated users — anonymous
    // (including bot/crawler) requests get the same 404 as a non-existent slug.
    if (!isAdmin && !property.isPublished) {
      throw { status: 404, message: 'Property not found' };
    }

    res.json({ success: true, data: property });
  }

  async listProperties(req, res) {
    const {
      propertyType, categoryIds,
      citySlug, localitySlug, developerSlug,
      tags,      // comma-separated slugs OR repeated: ?tags=upcoming&tags=featured
      priceMin, priceMax, isPublished,
      sort = 'newest',
      limit = 10, offset = 0,
    } = req.query;

    // Normalise tags: accept both "upcoming,trending" and ["upcoming","trending"]
    const tagSlugs = tags
      ? (Array.isArray(tags) ? tags : tags.split(',').map(s => s.trim())).filter(Boolean)
      : undefined;

    const isAdmin = Boolean(req.user);
    // Anonymous callers can never see unpublished listings, regardless of the
    // isPublished query param — only authenticated admins may request drafts.
    const resolvedIsPublished = isAdmin
      ? (isPublished !== undefined ? isPublished === 'true' : undefined)
      : true;

    const filters = {
      propertyType,
      citySlug,
      localitySlug,
      developerSlug,
      categoryIds: categoryIds
        ? (Array.isArray(categoryIds) ? categoryIds : [categoryIds])
        : undefined,
      tagSlugs,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
      isPublished: resolvedIsPublished,
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
    const { isPublished, propertyType, citySlug, localitySlug, developerSlug, limit = 100, offset = 0 } = req.query;
    const result = await propertyService.listAllProperties({
      isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
      propertyType,
      citySlug,
      localitySlug,
      developerSlug,
      limit,
      offset,
    });
    res.json({
      success: true,
      data: result.properties,
      pagination: { total: result.total, limit: parseInt(limit, 10), offset: parseInt(offset, 10) },
    });
  }

  /** JSON-LD ItemList feed for agents and crawlers (published only). */
  async getPropertiesFeed(req, res) {
    const {
      propertyType, categoryIds,
      citySlug, localitySlug, developerSlug,
      tags,
      priceMin, priceMax,
      sort = 'newest',
      limit = 50, offset = 0,
      format,
    } = req.query;

    const tagSlugs = tags
      ? (Array.isArray(tags) ? tags : tags.split(',').map(s => s.trim())).filter(Boolean)
      : undefined;

    const result = await propertyService.getPropertiesFeed({
      propertyType,
      citySlug,
      localitySlug,
      developerSlug,
      categoryIds: categoryIds
        ? (Array.isArray(categoryIds) ? categoryIds : [categoryIds])
        : undefined,
      tagSlugs,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
      sort,
      limit,
      offset,
    });

    const wantsLdJson =
      format === 'ld+json' ||
      (req.accepts(['application/ld+json', 'application/json']) === 'application/ld+json');

    res.set('X-Total-Count', String(result.total));
    res.set('X-Limit', String(result.limit));
    res.set('X-Offset', String(result.offset));

    if (wantsLdJson) {
      res.type('application/ld+json');
      return res.json(result.jsonLd);
    }

    res.json({
      success: true,
      data: result.jsonLd,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
      },
    });
  }
}

export default new PropertyController();
