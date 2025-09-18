# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app



COPY package*.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install --no-strict-peer-dependencies

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
COPY .env .env
RUN pnpm build


# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

COPY package*.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install --no-strict-peer-dependencies

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/.env .env

EXPOSE 8000
CMD ["node", "dist/main.js"]
