import { Op } from 'sequelize';
import { Property, Developer, Location, Category, PropertySection, Tag, PropertyCategory, PropertyTag, sequelize } from '../../../models/index.js';
import tagService from '../../tag/service/tagService.js';
import { isValidCity, isValidLocality, isValidDeveloper } from '../../../config/enums.js';

/**
 * Validate enum slug fields and throw a descriptive 400 if any are invalid.
 * All three params are optional — only validates what is supplied.
 */
function validateEnumSlugs({ citySlug, localitySlug, developerSlug } = {}) {
  if (citySlug !== undefined && citySlug !== null) {
    if (!isValidCity(citySlug)) {
      throw { status: 400, message: `Unknown city slug: "${citySlug}". See GET /api/enums for valid values.` };
    }
  }
  if (localitySlug !== undefined && localitySlug !== null) {
    // If a city is also supplied, verify that the locality belongs to it
    if (!isValidLocality(localitySlug, citySlug || null)) {
      const detail = citySlug
        ? `"${localitySlug}" is not a known locality in city "${citySlug}"`
        : `Unknown locality slug: "${localitySlug}"`;
      throw { status: 400, message: `${detail}. See GET /api/enums for valid values.` };
    }
  }
  if (developerSlug !== undefined && developerSlug !== null) {
    if (!isValidDeveloper(developerSlug)) {
      throw { status: 400, message: `Unknown developer slug: "${developerSlug}". See GET /api/enums for valid values.` };
    }
  }
}

/**
 * Resolve `locations.id` from enum slugs (same rule as seeders: locality row if set, else city row).
 */
async function resolveLocationIdFromSlugs(localitySlug, citySlug, transaction) {
  const slug = localitySlug || citySlug || null;
  if (!slug) return null;
  const loc = await Location.findOne({ where: { slug }, transaction });
  return loc ? loc.id : null;
}

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

  async getPropertyFullById(id) {
    const property = await Property.findByPk(id, {
      include: [
        { model: Developer },
        { model: Location },
        { model: PropertySection, order: [['order', 'ASC']] },
        { model: Category, as: 'Categories', through: { attributes: [] } },
        { model: Tag, as: 'Tags', through: { attributes: [] } },
      ],
    });
    if (!property) throw { status: 404, message: 'Property not found' };
    return property;
  }

  async updatePropertyFull(id, data) {
    const {
      slug, title, propertyType,
      citySlug, localitySlug, sublocality, developerSlug,
      status, priceMin, priceMax, isPublished,
      seoTitle, h1Heading, metaDescription,
      tagSlugs = [], categorySlugs = [],
      sections = [],
    } = data;

    // Validate enum slugs before touching the DB
    validateEnumSlugs({ citySlug, localitySlug, developerSlug });

    const property = await Property.findByPk(id);
    if (!property) throw { status: 404, message: 'Property not found' };

    const transaction = await sequelize.transaction();
    try {
      // Update core fields
      const updateData = {};
      if (slug !== undefined) updateData.slug = slug;
      if (title !== undefined) updateData.title = title;
      if (propertyType !== undefined) updateData.propertyType = propertyType;
      if (citySlug !== undefined) updateData.citySlug = citySlug || null;
      if (localitySlug !== undefined) updateData.localitySlug = localitySlug || null;
      if (developerSlug !== undefined) {
        updateData.developerSlug = developerSlug || null;
        if (developerSlug) {
          const dev = await Developer.findOne({
            where: { slug: developerSlug },
            transaction,
          });
          updateData.developerId = dev ? dev.id : null;
        } else {
          updateData.developerId = null;
        }
      }
      if (status !== undefined) updateData.status = status;
      if (priceMin !== undefined) updateData.priceMin = priceMin ? parseFloat(priceMin) : null;
      if (priceMax !== undefined) updateData.priceMax = priceMax ? parseFloat(priceMax) : null;
      if (isPublished !== undefined) updateData.isPublished = isPublished;
      if (seoTitle !== undefined) {
        updateData.seoTitle = seoTitle?.trim?.() ? seoTitle.trim().slice(0, 90) : null;
      }
      if (h1Heading !== undefined) {
        updateData.h1Heading = h1Heading?.trim?.() ? h1Heading.trim().slice(0, 120) : null;
      }
      if (metaDescription !== undefined) {
        updateData.metaDescription = metaDescription?.trim?.()
          ? metaDescription.trim().slice(0, 158)
          : null;
      }
      if (sublocality !== undefined) {
        updateData.sublocality =
          typeof sublocality === 'string' && sublocality.trim()
            ? sublocality.trim().slice(0, 255)
            : null;
      }

      if (citySlug !== undefined || localitySlug !== undefined) {
        const nextCity = citySlug !== undefined ? (citySlug || null) : property.citySlug;
        const nextLocality = localitySlug !== undefined ? (localitySlug || null) : property.localitySlug;
        updateData.locationId = await resolveLocationIdFromSlugs(nextLocality, nextCity, transaction);
      }

      await property.update(updateData, { transaction });

      // Replace all sections
      await PropertySection.destroy({ where: { propertyId: id }, transaction });
      if (sections.length > 0) {
        await PropertySection.bulkCreate(
          sections.map((s, i) => ({
            propertyId: id,
            type: s.type,
            title: s.title,
            order: s.order ?? i,
            isVisible: s.isVisible ?? true,
            data: s.data,
          })),
          { transaction },
        );
      }

      // Replace tags
      await tagService.replaceTagsForProperty(id, tagSlugs, transaction);

      // Replace categories
      await PropertyCategory.destroy({ where: { propertyId: id }, transaction });
      if (categorySlugs.length) {
        const cats = await Category.findAll({ where: { slug: categorySlugs } });
        const found = new Set(cats.map(c => c.slug));
        const missing = categorySlugs.filter(s => !found.has(s));
        if (missing.length) throw { status: 400, message: `Unknown category slugs: ${missing.join(', ')}` };
        await PropertyCategory.bulkCreate(
          cats.map(cat => ({ propertyId: id, categoryId: cat.id })),
          { transaction, ignoreDuplicates: true },
        );
      }

      await transaction.commit();

      return {
        property: { id: property.id, slug: property.slug, title: property.title, isPublished: property.isPublished },
        sectionsUpdated: sections.length,
        sectionTypes: sections.map(s => s.type),
        tagsApplied: tagSlugs,
        categoriesApplied: categorySlugs,
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
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
        { model: Category, as: 'Categories', through: { attributes: [] } },
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
      citySlug,      // enum slug, e.g. "gurgaon"
      localitySlug,  // enum slug, e.g. "golf-course-road"
      developerSlug, // enum slug, e.g. "dlf"
      categoryIds,   // array of UUIDs
      tagSlugs,      // array of tag slug strings
      priceMin,
      priceMax,
      isPublished,
      sort = 'newest',
      limit = 10,
      offset = 0,
    } = filters;

    const where = {};
    // Must match Property.belongsToMany(Category) default alias — required for correct JOIN + filter.
    const categoryInclude = {
      model: Category,
      as: 'Categories',
      through: { attributes: [] },
    };
    const include = [
      { model: Developer },
      { model: Location },
      categoryInclude,
    ];

    if (propertyType) where.propertyType = propertyType;

    // ── Enum slug filters ──────────────────────────────────────────────────────
    if (citySlug) {
      if (!isValidCity(citySlug)) throw { status: 400, message: `Unknown city slug: "${citySlug}"` };
      where.citySlug = citySlug;
    }
    if (localitySlug) {
      if (!isValidLocality(localitySlug, citySlug || null))
        throw { status: 400, message: `Unknown/mismatched locality slug: "${localitySlug}"` };
      where.localitySlug = localitySlug;
    }
    if (developerSlug) {
      if (!isValidDeveloper(developerSlug)) throw { status: 400, message: `Unknown developer slug: "${developerSlug}"` };
      where.developerSlug = developerSlug;
    }
    // ──────────────────────────────────────────────────────────────────────────

    if (priceMin) where.priceMin = { [Op.gte]: parseFloat(priceMin) };
    if (priceMax) where.priceMax = { ...(where.priceMax || {}), [Op.lte]: parseFloat(priceMax) };

    if (isPublished !== undefined) where.isPublished = isPublished;

    // ── Category filter ────────────────────────────────────────────────────────
    if (categoryIds?.length) {
      categoryInclude.where = { id: { [Op.in]: categoryIds } };
      categoryInclude.required = true;
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
        // Simple case — one tag: use a required join with WHERE
        include.push({
          model: Tag,
          as: 'Tags',
          where: { id: tags[0].id },
          through: { attributes: [] },
          required: true,
        });
      } else {
        // AND across multiple tags: set-intersect propertyIds per tag so
        // pagination counts are correct (avoids JS post-filter off-by-N bug).
        let matchingIds = null;
        for (const tag of tags) {
          const rows = await PropertyTag.findAll({
            where: { tagId: tag.id },
            attributes: ['propertyId'],
            raw: true,
          });
          const ids = new Set(rows.map(r => r.propertyId));
          matchingIds = matchingIds === null
            ? ids
            : new Set([...matchingIds].filter(id => ids.has(id)));
        }
        if (!matchingIds || matchingIds.size === 0) {
          return { total: 0, properties: [] };
        }
        where.id = { [Op.in]: [...matchingIds] };
        include.push({ model: Tag, as: 'Tags', through: { attributes: [] } });
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

    const properties = await this.enrichListingRowsWithThumbnailUrls(rows);
    return { total: count, properties };
  }

  /**
   * Attach `thumbnailUrl` from the first visible `heroImage` section (for cards / listing UIs).
   */
  async enrichListingRowsWithThumbnailUrls(rows) {
    if (!rows.length) return [];
    const ids = rows.map((r) => r.id);
    const sections = await PropertySection.findAll({
      where: {
        propertyId: { [Op.in]: ids },
        type: 'heroImage',
        [Op.or]: [{ isVisible: true }, { isVisible: null }],
      },
      attributes: ['propertyId', 'data', 'order'],
      order: [
        ['propertyId', 'ASC'],
        ['order', 'ASC'],
      ],
      raw: true,
    });
    const urlByPropertyId = new Map();
    for (const s of sections) {
      if (urlByPropertyId.has(s.propertyId)) continue;
      const raw = s.data;
      const image =
        raw && typeof raw.image === 'string' && raw.image.trim().length > 0
          ? raw.image.trim()
          : null;
      if (image) urlByPropertyId.set(s.propertyId, image);
    }
    return rows.map((row) => {
      const plain = row.get({ plain: true });
      // Many-to-many Tags must survive listing serialization (homepage filters on Tags; cards show pills).
      const tags = row.Tags ?? plain.Tags;
      const categories = row.Categories ?? plain.Categories;
      return {
        ...plain,
        Tags: tags,
        Categories: categories,
        thumbnailUrl: urlByPropertyId.get(row.id) ?? null,
      };
    });
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
      slug, title, propertyType,
      citySlug, localitySlug, sublocality, developerSlug,
      status = 'draft', priceMin, priceMax, isPublished = false,
      seoTitle, h1Heading, metaDescription,
      tagSlugs = [], categorySlugs = [],
      sections = [],
    } = data;

    if (!slug || !title || !propertyType) {
      throw { status: 400, message: 'Missing required fields: slug, title, propertyType' };
    }

    // Validate enum slugs before touching the DB
    validateEnumSlugs({ citySlug, localitySlug, developerSlug });

    const existing = await Property.findOne({ where: { slug } });
    if (existing) throw { status: 409, message: `A property with slug "${slug}" already exists.` };

    const transaction = await sequelize.transaction();
    try {
      const locationId = await resolveLocationIdFromSlugs(
        localitySlug || null,
        citySlug || null,
        transaction,
      );

      let developerId = null;
      if (developerSlug) {
        const dev = await Developer.findOne({
          where: { slug: developerSlug },
          transaction,
        });
        developerId = dev ? dev.id : null;
      }

      const subTrim = typeof sublocality === 'string' && sublocality.trim()
        ? sublocality.trim().slice(0, 255)
        : null;

      const property = await Property.create({
        slug, title, propertyType,
        citySlug: citySlug || null,
        localitySlug: localitySlug || null,
        sublocality: subTrim,
        developerSlug: developerSlug || null,
        developerId,
        locationId,
        status,
        priceMin: priceMin ? parseFloat(priceMin) : null,
        priceMax: priceMax ? parseFloat(priceMax) : null,
        isPublished,
        seoTitle: seoTitle?.trim?.() ? seoTitle.trim().slice(0, 90) : null,
        h1Heading: h1Heading?.trim?.() ? h1Heading.trim().slice(0, 120) : null,
        metaDescription: metaDescription?.trim?.()
          ? metaDescription.trim().slice(0, 158)
          : null,
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
    const { isPublished, propertyType, citySlug, localitySlug, developerSlug, limit = 100, offset = 0 } = filters;
    const where = {};
    if (isPublished !== undefined) where.isPublished = isPublished;
    if (propertyType) where.propertyType = propertyType;
    if (citySlug) where.citySlug = citySlug;
    if (localitySlug) where.localitySlug = localitySlug;
    if (developerSlug) where.developerSlug = developerSlug;

    const { count, rows } = await Property.findAndCountAll({
      where,
      include: [
        { model: Developer },
        { model: Location },
        { model: PropertySection, attributes: ['id', 'type'] },
        { model: Category, as: 'Categories', through: { attributes: [] } },
        { model: Tag, as: 'Tags', through: { attributes: [] } },
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
