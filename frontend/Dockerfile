FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://backend:4002/api/v1

RUN yarn build

EXPOSE 3002

CMD ["yarn", "start", "-p", "3002", "-H", "0.0.0.0"]


