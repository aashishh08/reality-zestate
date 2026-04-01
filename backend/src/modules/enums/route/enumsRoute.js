import express from 'express';
import { CITIES, LOCALITIES, DEVELOPERS, getLocalitiesForCity } from '../../../config/enums.js';

const router = express.Router();

/**
 * GET /api/enums
 * Returns all valid enumeration values for cities, localities, and developers.
 * The frontend uses this to populate dropdowns — no hard-coding needed.
 *
 * Optional query param:
 *   ?city=gurgaon   → returns only localities for that city (useful for cascading selects)
 */
router.get('/', (req, res) => {
  const { city } = req.query;

  const localities = city ? getLocalitiesForCity(city) : LOCALITIES;

  res.json({
    success: true,
    data: {
      cities: CITIES,
      localities,
      developers: DEVELOPERS,
    },
  });
});

export default router;
