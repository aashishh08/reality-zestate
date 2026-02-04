import express from 'express';
import { validateRequest } from '../../../middleware/validationMiddleware.js';
import { createPropertySchema, updatePropertySchema } from '../../../utils/validators.js';
import authMiddleware from '../../../middleware/authMiddleware.js';
import propertyController from '../controller/propertyController.js';

const router = express.Router();

// Public routes
router.get('/:slug', async (req, res, next) => {
  try {
    await propertyController.getPropertyBySlug(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    await propertyController.listProperties(req, res);
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.post('/', authMiddleware, validateRequest(createPropertySchema), async (req, res, next) => {
  try {
    await propertyController.createProperty(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, validateRequest(updatePropertySchema), async (req, res, next) => {
  try {
    await propertyController.updateProperty(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await propertyController.deleteProperty(req, res);
  } catch (error) {
    next(error);
  }
});

// Property Sections routes
router.post('/:id/sections', authMiddleware, async (req, res, next) => {
  try {
    await propertyController.createPropertySections(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/sections', authMiddleware, async (req, res, next) => {
  try {
    await propertyController.updatePropertySections(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
