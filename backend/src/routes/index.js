import express from 'express';
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

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Reality Estate API',
    version: 'v1',
    endpoints: {
      auth: '/auth/login, /auth/register',
      properties: '/properties?tags=upcoming,trending&locationId=&developerId=&propertyType=',
      locations: '/locations',
      categories: '/categories',
      developers: '/developers',
      tags: '/tags (GET list) | /tags/:slug/properties (GET by tag)',
      blogs: '/blogs',
      leads: '/leads',
      crm: '/crm (requires x-api-key)',
      health: '/health',
    },
  });
});

export default router;
