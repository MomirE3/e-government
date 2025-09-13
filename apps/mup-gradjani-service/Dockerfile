FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

RUN npm install

COPY . .

RUN npx prisma generate --schema=apps/mup-gradjani-service/prisma/schema.prisma
RUN npx nest build mup-gradjani-service

EXPOSE 3000

# Додати script који покреће миграције па апликацију
CMD ["sh", "-c", "npx prisma migrate deploy --schema=apps/mup-gradjani-service/prisma/schema.prisma && npm run start:prod:mup"]
