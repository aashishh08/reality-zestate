import express from 'express';
import { DEVELOPERS } from '../../../config/enums.js';
import geographyService from '../../location/service/geographyService.js';

const router = express.Router();

/**
 * GET /api/enums
 * Returns cities and localities from the database, plus developers from config.
 *
 * Optional query param:
 *   ?city=gurgaon   → returns only localities for that city (cascading selects)
 */
router.get('/', async (req, res, next) => {
  try {
    const { city } = req.query;
    const { cities, localities } = await geographyService.getEnumData(
      typeof city === 'string' ? city : null,
    );

    res.json({
      success: true,
      data: {
        cities,
        localities,
        developers: DEVELOPERS,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
