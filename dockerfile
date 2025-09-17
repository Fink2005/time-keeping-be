# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
# Copy package.json & lock file

COPY package*.json ./

# Cài dependencies
RUN pnpm install

# Copy toàn bộ source code
COPY . .

# Build NestJS
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
# Copy package.json + pnpm-lock.yaml
COPY package*.json ./


RUN pnpm install --production

# Copy dist từ builder
COPY --from=builder ./dist ./dist

# Expose port
EXPOSE 3000

# CMD
CMD ["node", "dist/main.js"]
