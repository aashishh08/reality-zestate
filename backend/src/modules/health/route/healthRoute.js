import express from 'express';
import { getSystemHealth } from '../service/healthService.js';

const router = express.Router();

/** Liveness probe — backend process only (used by Docker HEALTHCHECK). */
router.get('/live', (_req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: {
      seconds: Math.floor(process.uptime()),
    },
  });
});

/** Full system status — backend, database, frontend, containers, uptime. */
router.get('/', async (_req, res) => {
  const health = await getSystemHealth();
  const statusCode = health.status === 'unhealthy' ? 503 : 200;
  res.status(statusCode).json(health);
});

export default router;
