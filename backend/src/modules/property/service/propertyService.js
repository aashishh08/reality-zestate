import { Op } from 'sequelize';
import { Property, Developer, Location, Category, PropertySection, Tag, PropertyCategory, sequelize } from '../../../models/index.js';
import tagService from '../../tag/service/tagService.js';

class PropertyService {
  async createProperty(data) {
    return Property.create(data);
  }

  async updateProperty(id, data) {
    const property = await Property.findByPk(id);
    if (!property) throw { status: 404, message: 'Property not found' };
    await property.update(data);
    return property;
  }

  async deleteProperty(id) {
    const property = await Property.findByPk(id);
    if (!property) throw { status: 404, message: 'Property not found' };
    await property.destroy();
    return true;
  }

  async getPropertyBySlug(slug) {
    const property = await Property.findOne({
      where: { slug },
      include: [
        { model: Developer },
        { model: Location },
        { model: PropertySection, order: [['order', 'ASC']] },
        { model: Category, through: { attributes: [] } },
        { model: Tag, as: 'Tags', through: { attributes: [] } },
      ],
    });
    if (!property) throw { status: 404, message: 'Property not found' };
    return property;
  }

  /**
   * List properties with optional filters.
   *
   * Tag filtering uses an AND strategy by default: a property must have
   * ALL of the requested tags. This is intentional — "upcoming AND featured"
   * is more useful than a union. Pass tagSlugs as an array of strings.
   */
  async listProperties(filters = {}) {
    const {
      propertyType,
      locationId,
      developerId,
      categoryIds,   // array of UUIDs
      tagSlugs,      // array of tag slug strings  ← new
      priceMin,
      priceMax,
      isPublished,
      sort = 'newest',
      limit = 10,
      offset = 0,
    } = filters;

    const where = {};
    const include = [
      { model: Developer },
      { model: Location },
      { model: Category, through: { attributes: [] } },
    ];

    if (propertyType) where.propertyType = propertyType;
    if (locationId) where.locationId = locationId;
    if (developerId) where.developerId = developerId;

    if (priceMin) where.priceMin = { [Op.gte]: parseFloat(priceMin) };
    if (priceMax) where.priceMax = { ...(where.priceMax || {}), [Op.lte]: parseFloat(priceMax) };

    if (isPublished !== undefined) where.isPublished = isPublished;

    // ── Category filter ────────────────────────────────────────────────────────
    if (categoryIds?.length) {
      include.find(i => i.model === Category).where = { id: { [Op.in]: categoryIds } };
      include.find(i => i.model === Category).required = true;
    }

    // ── Tag filter (AND — property must have ALL requested tags) ──────────────
    if (tagSlugs?.length) {
      // Resolve slugs to IDs for an indexed join
      const tags = await Tag.findAll({ where: { slug: { [Op.in]: tagSlugs } } });
      if (tags.length !== tagSlugs.length) {
        const found = new Set(tags.map(t => t.slug));
        const missing = tagSlugs.filter(s => !found.has(s));
        throw { status: 400, message: `Unknown tag slugs: ${missing.join(', ')}` };
      }

      if (tags.length === 1) {
        // Simple case — one tag
        include.push({
          model: Tag,
          as: 'Tags',
          where: { id: tags[0].id },
          through: { attributes: [] },
          required: true,
        });
      } else {
        // AND across multiple tags: filter after findAndCountAll via HAVING
        // We join all tags (no WHERE) then post-filter by count
        include.push({
          model: Tag,
          as: 'Tags',
          where: { id: { [Op.in]: tags.map(t => t.id) } },
          through: { attributes: [] },
          required: true,
        });
        // Note: Sequelize's distinct + HAVING for multi-tag AND is complex;
        // We filter in JS for small tag arrays (usually 1–3 slugs).
        // For scale, a raw SQL subquery could be introduced later.
      }
    } else {
      // Always include Tags so callers receive them without a second query
      include.push({ model: Tag, as: 'Tags', through: { attributes: [] } });
    }

    // ── Sort ───────────────────────────────────────────────────────────────────
    const orderMap = {
      newest: [['createdAt', 'DESC']],
      'price-asc': [['priceMin', 'ASC']],
      'price-desc': [['priceMin', 'DESC']],
      'name-asc': [['title', 'ASC']],
    };
    const order = orderMap[sort] || orderMap.newest;

    const { count, rows } = await Property.findAndCountAll({
      where,
      include,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order,
      distinct: true,
    });

    // Post-filter for multi-tag AND (see comment above)
    const properties = tagSlugs?.length > 1
      ? rows.filter(p => tagSlugs.every(s => p.Tags?.some(t => t.slug === s)))
      : rows;

    return { total: count, properties };
  }

  async createPropertySections(propertyId, sections) {
    const property = await Property.findByPk(propertyId);
    if (!property) throw { status: 404, message: 'Property not found' };

    if (!Array.isArray(sections) || !sections.length) {
      throw { status: 400, message: 'Sections must be a non-empty array' };
    }
    for (const s of sections) {
      if (!s.type || !s.title || s.data === undefined) {
        throw { status: 400, message: 'Each section must have type, title, and data' };
      }
    }

    return PropertySection.bulkCreate(
      sections.map((s, i) => ({
        propertyId,
        type: s.type,
        title: s.title,
        order: s.order ?? i,
        isVisible: s.isVisible ?? true,
        data: s.data,
      })),
    );
  }

  async updatePropertySections(propertyId, sections) {
    const property = await Property.findByPk(propertyId);
    if (!property) throw { status: 404, message: 'Property not found' };

    await PropertySection.destroy({ where: { propertyId } });

    return PropertySection.bulkCreate(
      sections.map((s, i) => ({
        propertyId,
        type: s.type,
        title: s.title,
        order: s.order ?? i,
        isVisible: s.isVisible ?? true,
        data: s.data,
      })),
    );
  }

  // ── Create a full property with sections, tags and categories in one go ─────
  async createPropertyFull(data) {
    const {
      slug, title, propertyType, developerId, locationId,
      status = 'draft', priceMin, priceMax, isPublished = false,
      tagSlugs = [], categorySlugs = [],
      sections = [],
    } = data;

    if (!slug || !title || !propertyType || !developerId || !locationId) {
      throw { status: 400, message: 'Missing required fields: slug, title, propertyType, developerId, locationId' };
    }

    const developer = await Developer.findByPk(developerId);
    if (!developer) throw { status: 404, message: 'Developer not found' };

    const location = await Location.findByPk(locationId);
    if (!location) throw { status: 404, message: 'Location not found' };

    const existing = await Property.findOne({ where: { slug } });
    if (existing) throw { status: 409, message: `A property with slug "${slug}" already exists.` };

    const transaction = await sequelize.transaction();
    try {
      const property = await Property.create({
        slug, title, propertyType,
        developerId, locationId,
        status,
        priceMin: priceMin ? parseFloat(priceMin) : null,
        priceMax: priceMax ? parseFloat(priceMax) : null,
        isPublished,
      }, { transaction });

      if (sections.length > 0) {
        await PropertySection.bulkCreate(
          sections.map((s, i) => ({
            propertyId: property.id,
            type: s.type,
            title: s.title,
            order: s.order ?? i,
            isVisible: s.isVisible ?? true,
            data: s.data,
          })),
          { transaction },
        );
      }

      await tagService.replaceTagsForProperty(property.id, tagSlugs, transaction);

      // Categories
      if (categorySlugs.length) {
        const cats = await Category.findAll({ where: { slug: categorySlugs } });
        const found = new Set(cats.map(c => c.slug));
        const missing = categorySlugs.filter(s => !found.has(s));
        if (missing.length) throw { status: 400, message: `Unknown category slugs: ${missing.join(', ')}` };
        await PropertyCategory.bulkCreate(
          cats.map(cat => ({ propertyId: property.id, categoryId: cat.id })),
          { transaction, ignoreDuplicates: true },
        );
      }

      await transaction.commit();

      return {
        property: { id: property.id, slug: property.slug, title: property.title, isPublished },
        sectionsCreated: sections.length,
        sectionTypes: sections.map(s => s.type),
        tagsApplied: tagSlugs,
        categoriesApplied: categorySlugs,
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  // ── List all properties for admin (no pagination limits, includes sections count) ─
  async listAllProperties(filters = {}) {
    const { isPublished, propertyType, limit = 100, offset = 0 } = filters;
    const where = {};
    if (isPublished !== undefined) where.isPublished = isPublished;
    if (propertyType) where.propertyType = propertyType;

    const { count, rows } = await Property.findAndCountAll({
      where,
      include: [
        { model: Developer },
        { model: Location },
        { model: PropertySection, attributes: ['id', 'type'] },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['createdAt', 'DESC']],
      distinct: true,
    });
    return { total: count, properties: rows };
  }
}

export default new PropertyService();
