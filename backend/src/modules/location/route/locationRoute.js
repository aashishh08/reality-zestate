import express from 'express';
import { validateRequest } from '../../../middleware/validationMiddleware.js';
import {
  createCitySchema,
  createLocalitySchema,
  updateLocationSchema,
} from '../../../utils/validators.js';
import authMiddleware from '../../../middleware/authMiddleware.js';
import { requireRole } from '../../../middleware/roleMiddleware.js';
import locationController from '../controller/locationController.js';

const router = express.Router();
const adminRoles = ['SUPER_ADMIN', 'ADMIN'];

router.get('/admin/all', authMiddleware, requireRole(...adminRoles), async (req, res, next) => {
  try {
    await locationController.listAdminLocations(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    await locationController.listLocations(req, res);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/cities',
  authMiddleware,
  requireRole(...adminRoles),
  validateRequest(createCitySchema),
  async (req, res, next) => {
    try {
      await locationController.createCity(req, res);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/localities',
  authMiddleware,
  requireRole(...adminRoles),
  validateRequest(createLocalitySchema),
  async (req, res, next) => {
    try {
      await locationController.createLocality(req, res);
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  '/:id',
  authMiddleware,
  requireRole(...adminRoles),
  validateRequest(updateLocationSchema),
  async (req, res, next) => {
    try {
      await locationController.updateLocation(req, res);
    } catch (error) {
      next(error);
    }
  },
);

router.get('/:id', async (req, res, next) => {
  try {
    await locationController.getLocationById(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/properties', async (req, res, next) => {
  try {
    await locationController.getPropertiesByLocation(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
