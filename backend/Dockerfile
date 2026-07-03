FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY .sequelizerc ./
COPY src/ ./src/
COPY docs/ ./docs/
COPY .env.example .env

EXPOSE 4002

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD node -e "require('http').get('http://localhost:4002/api/v1/health', (r) => { if (r.statusCode !== 200) throw new Error(r.statusCode) })"

# bootstrap.js: runs migrations → seeders → starts the server
CMD ["node", "src/bootstrap.js"]
