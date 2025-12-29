# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies separately for better caching
COPY package*.json ./
RUN npm install --frozen-lockfile || npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Copy necessary files only
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["npm", "start"]
