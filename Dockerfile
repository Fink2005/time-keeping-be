# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client trước khi build
RUN npx prisma generate

RUN npm run build

# Stage 2: Production
FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copy build + Prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 8888
CMD ["node", "dist/main.js"]
