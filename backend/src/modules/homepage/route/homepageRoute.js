import express from 'express';
import { cacheControl } from '../../../middleware/cacheControlMiddleware.js';
import homepageController from '../controller/homepageController.js';

const router = express.Router();

router.get(
  '/',
  cacheControl(300, 3600),
  async (req, res, next) => {
    try {
      await homepageController.getPublicHomepage(req, res);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
