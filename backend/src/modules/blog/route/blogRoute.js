import express from 'express';
import { validateRequest } from '../../../middleware/validationMiddleware.js';
import { createBlogSchema, updateBlogSchema } from '../../../utils/validators.js';
import authMiddleware from '../../../middleware/authMiddleware.js';
import optionalAuthMiddleware from '../../../middleware/optionalAuthMiddleware.js';
import { requireRole } from '../../../middleware/roleMiddleware.js';
import blogController from '../controller/blogController.js';

const router = express.Router();

// Public routes
router.get('/', async (req, res, next) => {
  try {
    await blogController.listPublishedBlogs(req, res);
  } catch (error) {
    next(error);
  }
});

// Admin routes MUST be before /:slug otherwise Express matches "admin" as a slug value
router.get('/admin/stats', authMiddleware, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), async (req, res, next) => {
  try {
    await blogController.getAdminStats(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/admin/all', authMiddleware, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), async (req, res, next) => {
  try {
    await blogController.listAllBlogs(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/admin/:id', authMiddleware, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), async (req, res, next) => {
  try {
    await blogController.getBlogById(req, res);
  } catch (error) {
    next(error);
  }
});

// Public slug route comes AFTER /admin/* fixed routes
router.get('/:slug', optionalAuthMiddleware, async (req, res, next) => {
  try {
    await blogController.getBlogBySlug(req, res);
  } catch (error) {
    next(error);
  }
});

// Protected routes - create blog (EDITOR or ADMIN)
router.post('/', authMiddleware, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), validateRequest(createBlogSchema), async (req, res, next) => {
  try {
    await blogController.createBlog(req, res);
  } catch (error) {
    next(error);
  }
});

// Protected routes - update blog
router.put('/:id', authMiddleware, requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), validateRequest(updateBlogSchema), async (req, res, next) => {
  try {
    await blogController.updateBlog(req, res);
  } catch (error) {
    next(error);
  }
});

// Protected routes - delete blog (ADMIN or SUPER_ADMIN only)
router.delete('/:id', authMiddleware, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res, next) => {
  try {
    await blogController.deleteBlog(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
