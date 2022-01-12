# syntax=docker/dockerfile:1
FROM node:16 AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn compile

FROM node:16-alpine
EXPOSE 80
WORKDIR /app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/dist/node-esm ./dist/node-esm
RUN yarn install --production --frozen-lockfile
CMD ["yarn", "launch"]
