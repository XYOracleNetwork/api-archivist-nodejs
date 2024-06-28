# syntax=docker/dockerfile:1


# Define build-time arguments
ARG NODE_VERSION=22

# Build here and pull down all the devDependencies
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY . .
RUN corepack enable
RUN corepack prepare
RUN yarn install
RUN yarn xy build

# Just install the production dependencies here
FROM node:${NODE_VERSION} AS dependencies
WORKDIR /app
COPY . .
RUN corepack enable
RUN corepack prepare
RUN yarn workspaces focus --production

# Copy over the compiled output and production dependencies
# into a slimmer container
# FROM node:${NODE_VERSION}-alpine
FROM node:${NODE_VERSION}
EXPOSE 80
WORKDIR /app
CMD ["yarn", "launch"]

# Install required packages
# RUN apk add --no-cache file imagemagick ffmpeg
RUN apt-get update && apt-get install -y file imagemagick ffmpeg

COPY --from=dependencies /app/package.json ./package.json
RUN corepack enable
RUN corepack prepare
COPY --from=dependencies /app/.yarn ./.yarn
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/yarn.lock ./yarn.lock
COPY --from=dependencies /root/.yarn /root/.yarn
COPY --from=builder /app/dist/node ./dist/node

