FROM node:22 AS build

WORKDIR /app

RUN npm install -g copyfiles

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=build /app/package.json .

RUN npm install -g pm2
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
