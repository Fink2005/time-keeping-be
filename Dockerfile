# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Chỉ copy prisma folder, không generate
COPY prisma ./prisma

EXPOSE 8888

# Generate client runtime trước khi start app
CMD ["sh", "-c", "npx prisma generate && node dist/main.js"]
