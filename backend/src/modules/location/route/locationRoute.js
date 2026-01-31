import express from 'express';
import locationController from '../controller/locationController.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    await locationController.listLocations(req, res);
  } catch (error) {
    next(error);
  }
});

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
