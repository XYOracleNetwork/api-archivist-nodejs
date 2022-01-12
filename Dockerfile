# syntax=docker/dockerfile:1
FROM node:16-alpine
EXPOSE 80
WORKDIR /app
ENV NODE_ENV=production
COPY . .
RUN yarn install
RUN yarn compile
CMD ["yarn", "launch"]