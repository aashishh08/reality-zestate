# Production Deployment Guide

## Pre-Deployment Checklist

- [ ] Environment variables configured correctly
- [ ] Database migrations tested and working
- [ ] All tests passing
- [ ] Code linting and formatting complete
- [ ] Security review completed
- [ ] Error logging configured
- [ ] CORS properly configured
- [ ] API documentation updated

## Environment Variables for Production

Create `.env.production`:

```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database (Use strong, unique credentials)
DB_HOST=your-db-host.com
DB_PORT=5432
DB_USER=prod_user
DB_PASSWORD=generate_strong_password_here
DB_NAME=reality_estate_prod
DB_SSL=true

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com
CORS_CREDENTIALS=true

# Additional production settings
API_RATE_LIMIT=100
SESSION_SECRET=your_session_secret
```

## Database Setup for Production

### 1. Create Production Database

```bash
# Connect to PostgreSQL as admin
psql -U postgres

# Create database
CREATE DATABASE reality_estate_prod;

# Create dedicated user with strong password
CREATE USER prod_user WITH PASSWORD 'strong_password_here';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE reality_estate_prod TO prod_user;

# Exit
\q
```

### 2. Run Migrations

```bash
NODE_ENV=production npm run db:migrate
```

### 3. Optional: Seed Initial Data

```bash
NODE_ENV=production npm run db:seed
```

## Deployment Strategies

### Option 1: Traditional VPS (AWS EC2, DigitalOcean, Linode)

#### Installation

```bash
# SSH into server
ssh user@your-server.com

# Clone repository
git clone your-repo.git
cd your-repo/backend

# Install dependencies
npm ci  # Use ci instead of install for production

# Setup environment
cp .env.example .env
# Edit .env with production values
nano .env

# Run migrations
NODE_ENV=production npm run db:migrate

# Build (if needed)
npm run build
```

#### Using PM2 for Process Management

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'reality-estate-api',
      script: './src/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      log_file: 'logs/combined.log',
      time_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Enable startup on reboot
pm2 startup
pm2 save
```

#### Nginx Reverse Proxy

```nginx
upstream reality_estate_backend {
  server 127.0.0.1:3000;
  keepalive 64;
}

server {
  listen 80;
  server_name api.yourdomain.com;

  # Redirect HTTP to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name api.yourdomain.com;

  ssl_certificate /etc/ssl/certs/your-cert.pem;
  ssl_certificate_key /etc/ssl/private/your-key.pem;

  client_max_body_size 10M;

  location / {
    proxy_pass http://reality_estate_backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
  }

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
}
```

### Option 2: Docker Deployment

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY src/ ./src/
COPY .env.production .env

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Run
CMD ["npm", "start"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:
```

### Option 3: Heroku Deployment

#### 1. Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

#### 2. Create Heroku App

```bash
heroku create your-app-name
```

#### 3. Add PostgreSQL Addon

```bash
heroku addons:create heroku-postgresql:standard-0
```

#### 4. Configure Environment

```bash
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=your-frontend-url
```

#### 5. Deploy

```bash
git push heroku main
```

#### 6. Run Migrations

```bash
heroku run npm run db:migrate
```

## Monitoring & Maintenance

### Monitoring Tools

- **PM2 Monitoring**: `pm2 monit`
- **Node Application Metrics**: New Relic, DataDog, Sentry
- **Database Monitoring**: Use managed services or pgAdmin

### Backup Strategy

```bash
# Backup PostgreSQL database
pg_dump -U prod_user reality_estate_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql -U prod_user reality_estate_prod < backup_20240131_120000.sql
```

### Log Management

Configure log rotation:
```bash
# Using logrotate
cat > /etc/logrotate.d/reality-estate-api << 'EOF'
/home/user/app/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 user user
    sharedscripts
}
EOF
```

### Database Optimization

```sql
-- Analyze tables
ANALYZE;

-- Vacuum to reclaim space
VACUUM ANALYZE;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## Security Considerations

1. **Database Security**:
   - Use strong passwords (min 16 characters, mixed case, numbers, symbols)
   - Limit database user permissions to necessary databases only
   - Enable SSL connections to database
   - Regular backups and test restores

2. **API Security**:
   - Use HTTPS only
   - Implement rate limiting
   - Validate and sanitize all inputs
   - Use security headers (Helmet.js already configured)
   - Keep dependencies updated

3. **Server Security**:
   - Use firewall to restrict ports
   - Keep OS and packages updated
   - Use SSH keys instead of passwords
   - Disable root login
   - Configure fail2ban for brute force protection

4. **Monitoring**:
   - Set up error logging and alerting
   - Monitor disk space and memory usage
   - Track API response times
   - Alert on unusual activity

## Scaling Strategies

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database queries

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Deploy multiple app instances
- Use connection pooling

### Database Optimization
- Add indexes for frequently queried columns
- Use read replicas for read-heavy workloads
- Implement caching (Redis)
- Archive old data

## Rollback Procedure

```bash
# Tag releases
git tag v1.0.0
git push origin v1.0.0

# View releases
git tag -l

# Rollback to previous release
git checkout v1.0.0
npm ci
NODE_ENV=production npm run db:migrate
npm start
```

## Continuous Integration/Deployment

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check
      - name: Deploy to server
        run: |
          # SSH and deploy commands
```

## Support & Troubleshooting

- Check logs: `pm2 logs`
- Database connection issues: Verify credentials and network access
- Performance issues: Check database query performance and add indexes
- Memory leaks: Use Node profiling tools
