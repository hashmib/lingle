FROM node:16.14.0-alpine3.14 AS node_modules
WORKDIR /app

COPY package-lock.json package.json ./
RUN npm install
COPY . .

EXPOSE 3000
