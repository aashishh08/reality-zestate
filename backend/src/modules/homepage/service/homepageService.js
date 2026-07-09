import { Op } from 'sequelize';
import propertyService from '../../property/service/propertyService.js';
import locationService from '../../location/service/locationService.js';
import developerService from '../../developer/service/developerService.js';
import categoryService from '../../category/service/categoryService.js';
import { FEATURED_CORRIDOR_SLUGS } from '../../../config/featuredCorridors.js';
import { Location, Property, sequelize } from '../../../models/index.js';
import { withMemoryCache } from '../../../utils/memoryCache.js';

const CACHE_KEY = 'homepage:public:v1';
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

async function buildFeaturedCorridors() {
  const localities = await Location.findAll({
    where: { slug: { [Op.in]: FEATURED_CORRIDOR_SLUGS }, type: 'locality' },
    include: [{ model: Location, as: 'parent', attributes: ['id', 'name', 'slug', 'type'] }],
    order: [['name', 'ASC']],
  });

  if (!localities.length) return [];

  const countRows = await Property.findAll({
    attributes: [
      'localitySlug',
      'citySlug',
      [sequelize.fn('COUNT', sequelize.col('Property.id')), 'activeProjects'],
    ],
    where: {
      isPublished: true,
      localitySlug: { [Op.in]: FEATURED_CORRIDOR_SLUGS },
    },
    group: ['localitySlug', 'citySlug'],
    raw: true,
  });

  const countByLocality = new Map(
    countRows.map((row) => [row.localitySlug, parseInt(row.activeProjects, 10) || 0]),
  );

  const order = new Map(FEATURED_CORRIDOR_SLUGS.map((slug, index) => [slug, index]));

  return localities
    .filter((loc) => loc.parent?.slug)
    .map((loc) => ({
      locationSlug: loc.slug,
      citySlug: loc.parent.slug,
      localitySlug: loc.slug,
      name: loc.name,
      activeProjects: countByLocality.get(loc.slug) ?? 0,
    }))
    .sort(
      (a, b) => (order.get(a.localitySlug) ?? 0) - (order.get(b.localitySlug) ?? 0),
    );
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
        propertiesForTag(SECTION_TAGS.trending, 8),
        propertiesForTag(SECTION_TAGS.upcoming, 8),
        propertiesForTag(SECTION_TAGS.boutique, 8),
        locationService.listLocations(),
        developerService.listDevelopers(12, 0),
        categoryService.listCategories(),
        buildFeaturedCorridors(),
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
        developers: developersResult.developers,
        categories,
        featuredCorridors,
      };
    });
  }
}

export default new HomepageService();
