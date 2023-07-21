FROM node:18.16-bullseye-slim as base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base as development
CMD ["npm", "run", "start:dev"]

FROM base as production
CMD sh ./process.sh