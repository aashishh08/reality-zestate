import express from 'express';
import { cacheControl } from '../../../middleware/cacheControlMiddleware.js';
import sitemapController from '../controller/sitemapController.js';

const router = express.Router();

router.get(
  '/',
  cacheControl(3600, 86400),
  async (req, res, next) => {
    try {
      await sitemapController.getSitemapData(req, res);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
