# syntax=docker/dockerfile:1
FROM node:16-alpine
EXPOSE 80
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn compile
CMD ["yarn", "launch"]