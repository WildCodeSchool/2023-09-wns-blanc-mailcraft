FROM node:lts-alpine

WORKDIR /app

COPY package.json package.json

RUN npm i --legacy-peer-deps

COPY src src
#COPY tsconfig.json tsconfig.json

CMD npm start