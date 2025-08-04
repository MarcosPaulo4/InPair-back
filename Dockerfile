# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# Imagem final
FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./ 
COPY --from=builder /usr/src/app/yarn.lock ./

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main"]
