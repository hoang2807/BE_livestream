FROM node:18.16-bullseye-slim as base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate

FROM base as development
CMD ["npm", "run", "start:dev"]

FROM base as production
RUN npm run build
CMD ["npm", "run", "start:prod"]