# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies separately for better caching.
# Use `npm install` (not `npm ci`) so platform-specific transitive deps (e.g.
# @swc/helpers for linux) resolve correctly even when the committed lock was
# generated on a different OS.
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copy source and build.
# Raise V8's heap ceiling so `next build` succeeds on small-RAM hosts (it would
# otherwise hit "Reached heap limit"); excess spills to swap.
COPY . .
RUN NODE_OPTIONS=--max-old-space-size=2048 npm run build

# Stage 2: Production (standalone output)
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]
