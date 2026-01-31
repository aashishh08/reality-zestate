import express from 'express';
import developerController from '../controller/developerController.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    await developerController.listDevelopers(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await developerController.getDeveloperById(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/properties', async (req, res, next) => {
  try {
    await developerController.getPropertiesByDeveloper(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
