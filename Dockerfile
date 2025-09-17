# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files và lockfile
COPY package*.json ./

# Cài pnpm và dependencies, bỏ qua kiểm tra script
RUN npm install -g pnpm
RUN pnpm install --no-strict-peer-dependencies --ignore-scripts

# Copy mã nguồn và file .env
COPY . .
COPY .env .env



# Generate Prisma client
RUN npx prisma generate

# Build NestJS
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# Copy package.json + pnpm-lock.yaml
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install --production

# Copy build, Prisma client, và .env
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/.env .env

# Expose port
EXPOSE 8000

# Start app
CMD ["node", "dist/main.js"]