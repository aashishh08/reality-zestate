FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_ENV=development
ENV NEXT_PUBLIC_API_URL=http://backend:4002/api/v1

EXPOSE 3002

CMD ["yarn", "dev", "--", "-p", "3002", "-H", "0.0.0.0"]


