import express from 'express';
import { validateRequest } from '../../../middleware/validationMiddleware.js';
import { createLeadSchema, updateLeadStatusSchema } from '../../../utils/validators.js';
import authMiddleware from '../../../middleware/authMiddleware.js';
import leadController from '../controller/leadController.js';

const router = express.Router();

// Public route
router.post('/', validateRequest(createLeadSchema), async (req, res, next) => {
  try {
    await leadController.createLead(req, res);
  } catch (error) {
    next(error);
  }
});

// Protected routes (admin)
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    await leadController.listLeads(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    await leadController.getLeadById(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', authMiddleware, validateRequest(updateLeadStatusSchema), async (req, res, next) => {
  try {
    await leadController.updateLeadStatus(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
