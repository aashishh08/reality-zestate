import express from 'express';
import { validateRequest } from '../../../middleware/validationMiddleware.js';
import { registerSchema, loginSchema } from '../../../utils/validators.js';
import authController from '../controller/authController.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), async (req, res, next) => {
  try {
    await authController.register(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/login', validateRequest(loginSchema), async (req, res, next) => {
  try {
    await authController.login(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
