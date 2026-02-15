FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV NODE_ENV=development
ENV NEXT_PUBLIC_API_URL=http://backend:4002/api/v1

EXPOSE 3002

CMD ["npm", "run", "dev", "--", "-p", "3002", "-H", "0.0.0.0"]


