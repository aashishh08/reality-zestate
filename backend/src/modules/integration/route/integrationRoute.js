import express from 'express';
import apiKeyMiddleware from '../../../middleware/apiKeyMiddleware.js';
import integrationController from '../controller/integrationController.js';

const router = express.Router();

// All integration endpoints require CRM API key
router.use(apiKeyMiddleware);

router.post('/properties', async (req, res, next) => {
  try {
    await integrationController.createPropertyFromCRM(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/properties/:id', async (req, res, next) => {
  try {
    await integrationController.updatePropertyFromCRM(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/properties/:propertyId/sections', async (req, res, next) => {
  try {
    await integrationController.pushPropertySections(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
