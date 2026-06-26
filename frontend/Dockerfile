FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID}

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://api.superluxere.com/api/v1

RUN yarn build

EXPOSE 3002

CMD ["yarn", "start", "-p", "3002", "-H", "0.0.0.0"]


