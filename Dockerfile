FROM node:23-alpine AS builder

WORKDIR /usr/src/app

COPY yarn.lock package.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:23-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/yarn.lock ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]
