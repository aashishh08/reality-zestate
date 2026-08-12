import { Op } from 'sequelize';
import { Blog, Property, PropertySection, sequelize } from '../../../models/index.js';
import tagService from '../../tag/service/tagService.js';
import { withMemoryCache } from '../../../utils/memoryCache.js';

const CACHE_KEY = 'sitemap:public:v2';
const CACHE_TTL_MS = 60 * 60 * 1000;

/** Slugs that must never appear in public sitemaps (staging / QA). */
const EXCLUDED_SLUG_PATTERN = 'test%';

class SitemapService {
  async getSitemapData() {
    return withMemoryCache(CACHE_KEY, CACHE_TTL_MS, async () => {
      const [blogs, properties, locations, developers, categories, tags] = await Promise.all([
        Blog.findAll({
          attributes: ['slug', 'updatedAt', 'createdAt'],
          where: { isPublished: true },
          order: [['updatedAt', 'DESC']],
          raw: true,
        }),
        this.listPublishedPropertiesForSitemap(),
        this.listPublishedLocationsForSitemap(),
        this.listPublishedDevelopersForSitemap(),
        this.listPublishedCategoriesForSitemap(),
        tagService.listPublishedTagsForSitemap(),
      ]);

      return { blogs, properties, locations, developers, categories, tags };
    });
  }

  async listPublishedPropertiesForSitemap() {
    const rows = await Property.findAll({
      attributes: ['id', 'slug', 'updatedAt'],
      where: { isPublished: true },
      order: [['updatedAt', 'DESC']],
    });

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

    const thumbnailUrlByPropertyId = new Map();
    for (const section of sections) {
      if (thumbnailUrlByPropertyId.has(section.propertyId)) continue;
      const raw = section.data;
      const image =
        raw && typeof raw.image === 'string' && raw.image.trim().length > 0
          ? raw.image.trim()
          : null;
      if (image) thumbnailUrlByPropertyId.set(section.propertyId, image);
    }

    return rows.map((row) => {
      const plain = row.get({ plain: true });
      const thumbnailUrl = thumbnailUrlByPropertyId.get(row.id) ?? null;
      return thumbnailUrl ? { ...plain, thumbnailUrl } : plain;
    });
  }

  listPublishedLocationsForSitemap() {
    return sequelize.query(
      `SELECT l.slug, MAX(p."updatedAt") AS "updatedAt"
       FROM locations l
       INNER JOIN properties p ON p."isPublished" = true
         AND (p."citySlug" = l.slug OR p."localitySlug" = l.slug)
       WHERE l.slug NOT LIKE :excludedPattern
       GROUP BY l.slug
       ORDER BY l.slug ASC`,
      {
        replacements: { excludedPattern: EXCLUDED_SLUG_PATTERN },
        type: sequelize.QueryTypes.SELECT,
      },
    );
  }

  listPublishedDevelopersForSitemap() {
    return sequelize.query(
      `SELECT d.slug, MAX(p."updatedAt") AS "updatedAt"
       FROM developers d
       INNER JOIN properties p ON p."isPublished" = true
         AND p."developerSlug" = d.slug
       WHERE d.slug NOT LIKE :excludedPattern
       GROUP BY d.slug
       ORDER BY d.slug ASC`,
      {
        replacements: { excludedPattern: EXCLUDED_SLUG_PATTERN },
        type: sequelize.QueryTypes.SELECT,
      },
    );
  }

  listPublishedCategoriesForSitemap() {
    return sequelize.query(
      `SELECT c.slug, MAX(p."updatedAt") AS "updatedAt"
       FROM categories c
       INNER JOIN property_categories pc ON pc."categoryId" = c.id
       INNER JOIN properties p ON p.id = pc."propertyId" AND p."isPublished" = true
       WHERE c.slug NOT LIKE :excludedPattern
       GROUP BY c.slug
       ORDER BY c.slug ASC`,
      {
        replacements: { excludedPattern: EXCLUDED_SLUG_PATTERN },
        type: sequelize.QueryTypes.SELECT,
      },
    );
  }
}

export default new SitemapService();
