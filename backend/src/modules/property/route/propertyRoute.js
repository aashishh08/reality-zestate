import express from 'express';
import { validateRequest } from '../../../middleware/validationMiddleware.js';
import { createPropertySchema, updatePropertySchema } from '../../../utils/validators.js';
import authMiddleware from '../../../middleware/authMiddleware.js';
import propertyController from '../controller/propertyController.js';

const router = express.Router();

// ── Named/specific routes MUST come before /:slug wildcard ─────────────────

// Admin listing (with section counts)
router.get('/admin', authMiddleware, async (req, res, next) => {
  try {
    await propertyController.listAllProperties(req, res);
  } catch (error) {
    next(error);
  }
});

// Full property creation (core + sections + tags + categories in one shot)
router.post('/full', authMiddleware, async (req, res, next) => {
  try {
    await propertyController.createPropertyFull(req, res);
  } catch (error) {
    next(error);
  }
});

// Full property update (core + sections + tags + categories in one shot)
router.put('/full/:id', authMiddleware, async (req, res, next) => {
  try {
    await propertyController.updatePropertyFull(req, res);
  } catch (error) {
    next(error);
  }
});

// Get a single property by ID for admin editing (includes all sections, tags, categories)
router.get('/admin/:id', authMiddleware, async (req, res, next) => {
  try {
    await propertyController.getPropertyFullById(req, res);
  } catch (error) {
    next(error);
  }
});

// Public routes
router.get('/', async (req, res, next) => {
  try {
    await propertyController.listProperties(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    await propertyController.getPropertyBySlug(req, res);
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
