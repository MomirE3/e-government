FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

RUN npm install

COPY . .

RUN npx prisma generate --schema=apps/zavod-za-statistiku-service/prisma/schema.prisma
RUN npx nest build zavod-za-statistiku-service

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy --schema=apps/zavod-za-statistiku-service/prisma/schema.prisma && npm run start:prod:zavod"]

