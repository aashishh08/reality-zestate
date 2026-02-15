# Docker Setup Guide

## Overview

The Reality Estate application is now fully containerized with Docker. The setup includes:

- **Frontend (Next.js)**: Running on port 3002
- **Backend (Node.js/Express)**: Running on port 4002
- **Database (PostgreSQL)**: Running on port 5433
- **All services**: Connected via Docker network

## Quick Start

### Prerequisites

- Docker
- Docker Compose

### 1. Build and Start All Services

```bash
# From the project root directory
docker-compose up -d --build
```

This will:
- Build the frontend image
- Build the backend image
- Create and start PostgreSQL database
- Set up networking between all services

### 2. Run Database Migrations

```bash
# Run migrations inside the backend container
docker-compose exec backend npm run db:migrate
```

### 3. Access the Application

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:4002/api/v1
- **Database**: localhost:5433

## Port Configuration

| Service | Port | Container Name |
|---------|------|-----------------|
| Frontend (Next.js) | 3002 | reality_estate_web |
| Backend (Node.js) | 4002 | reality_estate_api |
| PostgreSQL | 5433 | reality_estate_db |

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=4002
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=reality_estate_dev
CORS_ORIGIN=http://localhost:3002
```

### Frontend (Dockerfile)
```
NEXT_PUBLIC_API_URL=http://backend:4002/api/v1
NODE_ENV=development
```

## Common Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Access Container Shell
```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# Database
docker-compose exec postgres psql -U postgres -d reality_estate_dev
```

### Run Migrations
```bash
docker-compose exec backend npm run db:migrate
```

### Seed Database
```bash
docker-compose exec backend npm run db:seed
```

### Rebuild Services
```bash
docker-compose up -d --build
```

### Clean Rebuild (remove volumes)
```bash
docker-compose down -v
docker-compose up -d --build
```

## Troubleshooting

### Frontend can't connect to backend
- Ensure both services are running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Verify API URL in frontend container: `docker-compose exec frontend env | grep API`

### Database connection errors
- Check if postgres is healthy: `docker-compose ps`
- Verify postgres is ready: `docker-compose logs postgres`
- Try restarting: `docker-compose restart postgres`

### Migrations fail
- Ensure postgres is healthy: `docker-compose exec postgres pg_isready`
- Check backend logs: `docker-compose logs backend`
- Run manually: `docker-compose exec backend npm run db:migrate`

### Port already in use
If ports 3002, 4002, or 5433 are already in use:
1. Stop the conflicting service
2. Or modify docker-compose.yml port mappings
3. Or change which port docker forwards to

### Container won't start
- Check logs: `docker-compose logs [service-name]`
- Rebuild: `docker-compose down -v && docker-compose up -d --build`

## Network Communication

All containers communicate via the `app_network` bridge network:
- Frontend → Backend: `http://backend:4002/api/v1`
- Backend → Database: `postgres:5432`

External access (from host machine):
- Frontend: `http://localhost:3002`
- Backend: `http://localhost:4002`
- Database: `localhost:5433`

## Development

For active development:
- Frontend code changes: Hot reload is enabled
- Backend code changes: Hot reload is enabled (nodemon)
- Database changes: Manual migration required

Mount volumes are already configured for live code changes.

## Production Considerations

To prepare for production:
1. Update environment variables (JWT_SECRET, DB_PASSWORD, etc.)
2. Set NODE_ENV to production
3. Build frontend with production optimizations
4. Set up proper CORS_ORIGIN
5. Use managed database instead of Docker postgres
6. Implement proper error logging and monitoring
