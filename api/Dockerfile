FROM node:16

WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .

ENV PORT=8080
ENV ELASTIC_URL=http://elasticsearch:9200
ENV BCRYPT_SALT=10
EXPOSE 8080
EXPOSE 9200