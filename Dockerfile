# syntax=docker/dockerfile:1
# Build here and pull down all the devDependencies
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn xy build

# Just install the production dependencies here
FROM node:18 AS dependencies
WORKDIR /app
COPY . .
RUN yarn workspaces focus --production

# Copy over the compiled output and production dependencies
# into a slimmer container
FROM node:18-alpine
EXPOSE 80
WORKDIR /app
CMD ["yarn", "launch"]

# Install required packages
RUN apk add --no-cache file imagemagick ffmpeg

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/dist/node ./dist/node
