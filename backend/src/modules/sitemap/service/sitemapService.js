import { Blog, Category, Developer, Location, Property } from '../../../models/index.js';
import tagService from '../../tag/service/tagService.js';
import { withMemoryCache } from '../../../utils/memoryCache.js';

const CACHE_KEY = 'sitemap:public:v1';
const CACHE_TTL_MS = 60 * 60 * 1000;

class SitemapService {
  async getSitemapData() {
    return withMemoryCache(CACHE_KEY, CACHE_TTL_MS, async () => {
      const [blogs, properties, locations, developers, categories, tagSlugs] = await Promise.all([
        Blog.findAll({
          attributes: ['slug', 'updatedAt', 'createdAt'],
          where: { isPublished: true },
          order: [['updatedAt', 'DESC']],
          raw: true,
        }),
        Property.findAll({
          attributes: ['slug', 'updatedAt'],
          where: { isPublished: true },
          order: [['updatedAt', 'DESC']],
          raw: true,
        }),
        Location.findAll({
          attributes: ['slug', 'updatedAt'],
          order: [['name', 'ASC']],
          raw: true,
        }),
        Developer.findAll({
          attributes: ['slug', 'updatedAt'],
          order: [['name', 'ASC']],
          raw: true,
        }),
        Category.findAll({
          attributes: ['slug', 'updatedAt'],
          order: [['name', 'ASC']],
          raw: true,
        }),
        this.listPublishedTagSlugs(),
      ]);

      return { blogs, properties, locations, developers, categories, tagSlugs };
    });
  }

  listPublishedTagSlugs() {
    return tagService.listPublishedTagSlugs();
  }
}

export default new SitemapService();
