import express from 'express';
import { validateRequest } from '../../../middleware/validationMiddleware.js';
import { updateDeveloperSchema } from '../../../utils/validators.js';
import authMiddleware from '../../../middleware/authMiddleware.js';
import { requireRole } from '../../../middleware/roleMiddleware.js';
import developerController from '../controller/developerController.js';

const router = express.Router();
const adminRoles = ['SUPER_ADMIN', 'ADMIN'];

router.get('/admin/all', authMiddleware, requireRole(...adminRoles), async (req, res, next) => {
  try {
    await developerController.listAdminDevelopers(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    await developerController.listDevelopers(req, res);
  } catch (error) {
    next(error);
  }
});

router.put(
  '/:id',
  authMiddleware,
  requireRole(...adminRoles),
  validateRequest(updateDeveloperSchema),
  async (req, res, next) => {
    try {
      await developerController.updateDeveloper(req, res);
    } catch (error) {
      next(error);
    }
  },
);

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
