FROM node:16

WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .

ENV PORT=9999
ENV ELASTIC_URL=http://elasticsearch:9200
EXPOSE 9999
EXPOSE 9200