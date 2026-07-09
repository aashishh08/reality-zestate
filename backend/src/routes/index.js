import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoute from '../modules/auth/route/authRoute.js';
import propertyRoute from '../modules/property/route/propertyRoute.js';
import locationRoute from '../modules/location/route/locationRoute.js';
import categoryRoute from '../modules/category/route/categoryRoute.js';
import developerRoute from '../modules/developer/route/developerRoute.js';
import tagRoute from '../modules/tag/route/tagRoute.js';
import blogRoute from '../modules/blog/route/blogRoute.js';
import leadRoute from '../modules/lead/route/leadRoute.js';
import integrationRoute from '../modules/integration/route/integrationRoute.js';
import healthRoute from '../modules/health/route/healthRoute.js';
import enumsRoute from '../modules/enums/route/enumsRoute.js';
import homepageRoute from '../modules/homepage/route/homepageRoute.js';
import sitemapRoute from '../modules/sitemap/route/sitemapRoute.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OPENAPI_PATH = join(__dirname, '../../docs/openapi.yaml');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/properties', propertyRoute);
router.use('/locations', locationRoute);
router.use('/categories', categoryRoute);
router.use('/developers', developerRoute);
router.use('/tags', tagRoute);
router.use('/blogs', blogRoute);
router.use('/leads', leadRoute);
router.use('/crm', integrationRoute);
router.use('/health', healthRoute);
router.use('/enums', enumsRoute);
router.use('/homepage', homepageRoute);
router.use('/sitemap-data', sitemapRoute);

router.get('/openapi.yaml', (_req, res) => {
  const yaml = readFileSync(OPENAPI_PATH, 'utf8');
  res.type('text/yaml').send(yaml);
});

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Reality Estate API',
    version: 'v1',
    endpoints: {
      auth: '/auth/login, /auth/register',
      properties: '/properties?tags=upcoming,trending&citySlug=gurgaon&localitySlug=golf-course-road&developerSlug=dlf',
      propertiesFeed: '/properties/feed?limit=50&offset=0 (JSON-LD ItemList)',
      openapi: '/openapi.yaml',
      locations: '/locations',
      categories: '/categories',
      developers: '/developers',
      tags: '/tags (GET list) | /tags/:slug/properties (GET by tag)',
      blogs: '/blogs',
      leads: '/leads',
      crm: '/crm (requires x-api-key)',
      health: '/health',
      enums: '/enums (GET cities, localities, developers) | /enums?city=gurgaon',
      homepage: '/homepage (GET consolidated homepage payload — 1 call replaces 6+)',
      sitemapData: '/sitemap-data (GET all sitemap slugs in one response)',
    },
  });
});

export default router;
