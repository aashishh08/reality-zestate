import { QueryTypes } from 'sequelize';
import sequelize from '../../../database/connection.js';

const CHECK_TIMEOUT_MS = 3000;

const CONTAINER_NAMES = {
  backend: process.env.BACKEND_CONTAINER_NAME || 'reality_estate_api',
  frontend: process.env.FRONTEND_CONTAINER_NAME || 'reality_estate_web',
  database: process.env.DB_CONTAINER_NAME || 'reality_estate_db',
};

function formatUptime(seconds) {
  if (seconds == null || Number.isNaN(seconds)) return null;

  const total = Math.floor(seconds);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  return {
    seconds: total,
    human: days > 0
      ? `${days}d ${hours}h ${minutes}m`
      : hours > 0
        ? `${hours}h ${minutes}m ${secs}s`
        : minutes > 0
          ? `${minutes}m ${secs}s`
          : `${secs}s`,
  };
}

async function withTimeout(promise, timeoutMs = CHECK_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await promise(controller.signal);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function checkBackend() {
  const startedAt = Date.now();
  const uptimeSeconds = Math.floor(process.uptime());

  return {
    status: 'up',
    container: CONTAINER_NAMES.backend,
    host: 'self',
    responseTimeMs: Date.now() - startedAt,
    uptime: formatUptime(uptimeSeconds),
  };
}

async function checkDatabase() {
  const startedAt = Date.now();

  try {
    await sequelize.authenticate();

    const [row] = await sequelize.query(
      `SELECT EXTRACT(EPOCH FROM (now() - pg_postmaster_start_time()))::int AS uptime_seconds`,
      { type: QueryTypes.SELECT }
    );

    return {
      status: 'up',
      container: CONTAINER_NAMES.database,
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || null,
      responseTimeMs: Date.now() - startedAt,
      uptime: formatUptime(row?.uptime_seconds),
    };
  } catch (error) {
    return {
      status: 'down',
      container: CONTAINER_NAMES.database,
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || null,
      responseTimeMs: Date.now() - startedAt,
      uptime: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function checkFrontend() {
  const startedAt = Date.now();
  const url =
    process.env.FRONTEND_HEALTH_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'http://frontend:3002/api/health'
      : 'http://localhost:3002/api/health');

  try {
    const payload = await withTimeout(async (signal) => {
      const response = await fetch(url, {
        method: 'GET',
        signal,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    });

    return {
      status: 'up',
      container: CONTAINER_NAMES.frontend,
      url,
      responseTimeMs: Date.now() - startedAt,
      uptime: formatUptime(payload?.uptimeSeconds),
    };
  } catch (error) {
    return {
      status: 'down',
      container: CONTAINER_NAMES.frontend,
      url,
      responseTimeMs: Date.now() - startedAt,
      uptime: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function resolveOverallStatus(services) {
  if (services.backend.status !== 'up' || services.database.status !== 'up') {
    return 'unhealthy';
  }

  if (services.frontend.status !== 'up') {
    return 'degraded';
  }

  return 'healthy';
}

export async function getSystemHealth() {
  const [backend, database, frontend] = await Promise.all([
    checkBackend(),
    checkDatabase(),
    checkFrontend(),
  ]);

  const services = { backend, database, frontend };
  const status = resolveOverallStatus(services);

  return {
    success: status !== 'unhealthy',
    status,
    message:
      status === 'healthy'
        ? 'All services are healthy'
        : status === 'degraded'
          ? 'API and database are up; frontend is unreachable'
          : 'One or more critical services are down',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services,
  };
}
