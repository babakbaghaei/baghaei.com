# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma
# prisma.config.ts holds the datasource URL for the CLI (migrate/seed). Without
# it in the runner image, `prisma migrate deploy` can't find the connection URL.
COPY --from=builder --chown=node:node /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=node:node /app/entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

# Pino writes ./logs/app.log in production; create it writable for the non-root
# user so logging doesn't crash the process with EACCES.
RUN mkdir -p /app/logs && chown -R node:node /app/logs

USER node

EXPOSE 8000

CMD ["./entrypoint.sh"]
