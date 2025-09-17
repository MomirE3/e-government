FROM node:20-alpine
WORKDIR /app

# Kopiraj package.json i instaliraj dependencies
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

RUN npm install

# Kopiraj sve fajlove
COPY . .

# Generiši Prisma client-e za sve servise
RUN npx prisma generate --schema=apps/mup-gradjani-service/prisma/schema.prisma
RUN npx prisma generate --schema=apps/zavod-za-statistiku-service/prisma/schema.prisma

# Build aplikaciju
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
