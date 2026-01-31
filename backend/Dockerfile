FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src/ ./src/
COPY .env.example .env

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => { if (r.statusCode !== 200) throw new Error(r.statusCode) })"

CMD ["npm", "start"]
