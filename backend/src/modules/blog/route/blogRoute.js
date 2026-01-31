import express from 'express';
import { validateRequest } from '../../../middleware/validationMiddleware.js';
import { createBlogSchema, updateBlogSchema } from '../../../utils/validators.js';
import authMiddleware from '../../../middleware/authMiddleware.js';
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

router.get('/:slug', async (req, res, next) => {
  try {
    await blogController.getBlogBySlug(req, res);
  } catch (error) {
    next(error);
  }
});

// Protected routes (super-admin only)
router.post('/', authMiddleware, validateRequest(createBlogSchema), async (req, res, next) => {
  try {
    await blogController.createBlog(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, validateRequest(updateBlogSchema), async (req, res, next) => {
  try {
    await blogController.updateBlog(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await blogController.deleteBlog(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
