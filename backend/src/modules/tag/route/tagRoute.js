import express from 'express';
import tagController from '../controller/tagController.js';
import authMiddleware from '../../../middleware/authMiddleware.js';

const router = express.Router();

// Helper — wraps async controller methods and forwards errors
const wrap = (fn) => async (req, res, next) => {
    try { await fn(req, res); } catch (err) { next(err); }
};

// ── Public endpoints (no auth required) ─────────────────────────────────────
router.get('/', wrap((req, res) => tagController.listTags(req, res)));
router.get('/:slug', wrap((req, res) => tagController.getTagBySlug(req, res)));
router.get('/:slug/properties', wrap((req, res) => tagController.getPropertiesByTag(req, res)));

// ── Admin endpoints (JWT required) ───────────────────────────────────────────
router.post('/', authMiddleware, wrap((req, res) => tagController.createTag(req, res)));
router.put('/:id', authMiddleware, wrap((req, res) => tagController.updateTag(req, res)));
router.delete('/:id', authMiddleware, wrap((req, res) => tagController.deleteTag(req, res)));

export default router;
