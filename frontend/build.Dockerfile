FROM node:lts-alpine as builder

RUN apk --no-cache add curl

WORKDIR /app

COPY next.config.js next.config.js

COPY tailwind.config.ts tailwind.config.ts
COPY postcss.config.js postcss.config.js
COPY next.config.mjs next.config.mjs
COPY next-env.d.ts next-env.d.ts
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY jest.config.ts jest.config.ts
COPY jest.setup.ts jest.setup.ts

COPY src src

# Génère le dossier node_modules
RUN npm i

# Génère le dossier .next
RUN npm run build 

FROM node:lts-alpine

WORKDIR /app

# Copier les dossiers à partir de l'image précédente
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/public /app/public
COPY --from=builder /app/.next /app/.next

RUN npm i --production

CMD npm start