import express from 'express';
import categoryController from '../controller/categoryController.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    await categoryController.listCategories(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await categoryController.getCategoryById(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/properties', async (req, res, next) => {
  try {
    await categoryController.getPropertiesByCategory(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
