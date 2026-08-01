import { Op } from 'sequelize';
import propertyService from '../../property/service/propertyService.js';
import locationService from '../../location/service/locationService.js';
import developerService from '../../developer/service/developerService.js';
import categoryService from '../../category/service/categoryService.js';
import { FEATURED_CORRIDOR_SLUGS } from '../../../config/featuredCorridors.js';
import { Location, Property, sequelize } from '../../../models/index.js';
import {
  LOCATION_BASE_ATTRIBUTES,
  LOCATION_PARENT_ATTRIBUTES,
} from '../../../constants/locationAttributes.js';
import { withMemoryCache } from '../../../utils/memoryCache.js';

const CACHE_KEY = 'homepage:public:v3';
const CACHE_TTL_MS = 5 * 60 * 1000;

const SECTION_TAGS = {
  trending: 'trending',
  upcoming: 'upcoming',
  boutique: 'featured',
};

async function propertiesForTag(tagSlug, limit = 8) {
  const { properties } = await propertyService.listProperties({
    tagSlugs: [tagSlug],
    isPublished: true,
    limit,
    offset: 0,
  });
  return properties;
}

/** Run one homepage data fetch; on failure return fallback so other sections still load. */
async function loadHomepagePart(label, fallback, loader) {
  try {
    return await loader();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Homepage] ${label} failed: ${message}`);
    return fallback;
  }
}

async function fetchFeaturedLocalities(parentInclude) {
  try {
    const featured = await Location.findAll({
      where: { isFeatured: true, type: 'locality' },
      include: parentInclude,
      order: [
        ['featuredOrder', 'ASC'],
        ['name', 'ASC'],
      ],
    });
    if (featured.length) return featured;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[Homepage] Featured flag query failed, using slug fallback: ${message}`);
  }

  return Location.findAll({
    where: { slug: { [Op.in]: FEATURED_CORRIDOR_SLUGS }, type: 'locality' },
    attributes: LOCATION_BASE_ATTRIBUTES,
    include: parentInclude,
    order: [['name', 'ASC']],
  });
}

async function buildFeaturedCorridors() {
  const parentInclude = [{
    model: Location,
    as: 'parent',
    attributes: LOCATION_PARENT_ATTRIBUTES,
  }];

  const localities = await fetchFeaturedLocalities(parentInclude);

  if (!localities.length) return [];

  const localitySlugs = localities.map((loc) => loc.slug);

  const countRows = await Property.findAll({
    attributes: [
      'localitySlug',
      'citySlug',
      [sequelize.fn('COUNT', sequelize.col('Property.id')), 'activeProjects'],
    ],
    where: {
      isPublished: true,
      localitySlug: { [Op.in]: localitySlugs },
    },
    group: ['localitySlug', 'citySlug'],
    raw: true,
  });

  const countByLocality = new Map(
    countRows.map((row) => [row.localitySlug, parseInt(row.activeProjects, 10) || 0]),
  );

  const legacySlugOrder = new Map(FEATURED_CORRIDOR_SLUGS.map((slug, index) => [slug, index]));

  return localities
    .filter((loc) => loc.parent?.slug)
    .map((loc) => ({
      locationSlug: loc.slug,
      citySlug: loc.parent.slug,
      cityName: loc.parent.name,
      localitySlug: loc.slug,
      name: loc.name,
      activeProjects: countByLocality.get(loc.slug) ?? 0,
      featuredOrder: loc.featuredOrder,
    }))
    .sort((a, b) => {
      const orderA = a.featuredOrder ?? legacySlugOrder.get(a.localitySlug) ?? 999;
      const orderB = b.featuredOrder ?? legacySlugOrder.get(b.localitySlug) ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
}

class HomepageService {
  async getPublicHomepage() {
    return withMemoryCache(CACHE_KEY, CACHE_TTL_MS, async () => {
      const [
        trending,
        upcoming,
        boutique,
        allLocations,
        developersResult,
        allCategories,
        featuredCorridors,
      ] = await Promise.all([
        loadHomepagePart('trending', [], () => propertiesForTag(SECTION_TAGS.trending, 8)),
        loadHomepagePart('upcoming', [], () => propertiesForTag(SECTION_TAGS.upcoming, 8)),
        loadHomepagePart('boutique', [], () => propertiesForTag(SECTION_TAGS.boutique, 8)),
        loadHomepagePart('locations', [], () => locationService.listLocations()),
        loadHomepagePart('developers', { developers: [] }, () => developerService.listDevelopers(12, 0)),
        loadHomepagePart('categories', [], () => categoryService.listCategories()),
        loadHomepagePart('featuredCorridors', [], () => buildFeaturedCorridors()),
      ]);

      // Prefer cities for CityLocations (needs type=city); keep enough rows for footer/browse.
      const cities = allLocations.filter((loc) => loc.type === 'city');
      const locations =
        cities.length > 0
          ? [...cities, ...allLocations.filter((loc) => loc.type !== 'city')].slice(0, 40)
          : allLocations.slice(0, 40);
      const categories = allCategories.slice(0, 120);

      return {
        trending,
        upcoming,
        boutique,
        locations,
        developers: developersResult?.developers ?? [],
        categories,
        featuredCorridors,
      };
    });
  }
}

export default new HomepageService();
