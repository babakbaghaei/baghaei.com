# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Monorepo for **Baghaei Tech Group** (`baghaei.com`) — a Persian (RTL) corporate website + platform. Two main apps:
- `frontend/` — Next.js 16 (App Router) + React 19 marketing/portfolio site with heavy animation/3D UI
- `backend/` — NestJS 11 API with Prisma/PostgreSQL, Redis, BullMQ, OpenTelemetry

Supporting infra lives at the root: Docker Compose, nginx, Kong, Terraform, deploy scripts.

## Commands

All commands assume you are in the relevant subdirectory unless prefixed otherwise. Root-level orchestration scripts also exist in the root `package.json`.

### Root (monorepo orchestration)
```bash
npm run install:all       # install root + backend (--legacy-peer-deps) + frontend
npm run build:all         # build backend then frontend
npm run lint:all          # lint backend then frontend
npm run test:all          # backend unit + e2e tests
make up / make down       # start/stop dev stack via docker-compose
make logs                 # tail docker-compose logs
make ent-up / make ent-down  # start/stop the enterprise stack (docker-compose.enterprise.yml)
make clean                # docker down -v + remove backend/dist & frontend/.next
```

### Backend (`backend/`)
```bash
npm run start:dev         # watch-mode dev server (port 8000)
npm run build             # nest build -> dist/
npm run start:prod        # node dist/src/main
npm run lint              # eslint (use lint:fix to autofix)
npm test                  # jest unit tests (*.spec.ts under src/)
npm run test:e2e          # jest e2e (*.e2e-spec.ts under test/, supertest)
npx jest path/to/file.spec.ts   # run a single unit test file
npx prisma migrate dev    # create+apply migration (dev)
npx prisma generate       # regenerate Prisma Client (required after schema changes)
npx prisma db seed        # seed admin user, services, sample projects
```

### Frontend (`frontend/`)
```bash
npm run dev               # next dev --webpack (port 3000)
npm run build             # next build --webpack (standalone output) + sitemap
npm run lint              # eslint
npm test                  # playwright e2e (tests/ dir, baseURL http://localhost:3000)
npx playwright test path/to/test.spec.ts   # run a single e2e test
```
Note: build and dev both explicitly use `--webpack` (NOT Turbopack). Set `E2E_BACKEND=1` to also boot the backend during Playwright runs.

## Architecture

### Backend (NestJS, prefix `/api/v1`, default port 8000)
- **Bootstrap** (`src/main.ts`): global `AllExceptionsFilter`, global `ValidationPipe` (whitelist + transform + forbidNonWhitelisted), then `SecurityService.applySecurityMiddleware(app)`, then `/api/v1` prefix. Swagger at `/api/docs` only when `NODE_ENV !== production`.
- **Feature modules** (`src/`): `auth`, `projects`, `contact`, `services`, `dashboard`, `health`, plus cross-cutting `security`, `notifications`, `observability`, `common`.
- **PrismaModule is `@Global`** — `PrismaService` is injectable everywhere without re-importing. It uses `@prisma/adapter-pg` with a `pg` Pool (Neon-compatible pooling); connects on module init, disconnects on destroy.
- **Auth/Authorization**: JWT (60m access, 7d refresh) + Passport JWT strategy + bcrypt (10 rounds). RBAC via `@Roles(Role.ADMIN)` decorator + `RolesGuard` (`src/common/`). Roles are `USER` / `ADMIN`.
- **Security is centralized** in `SecurityService` (`src/security/`): Helmet/CSP, HPP, CORS allowlist (baghaei.com subdomains + localhost:3000), and `sanitizeInput()`. All user input (Contact, Auth, Projects) should be sanitized through this service — this is a project convention.
- **Async/observability infra** wired globally in `AppModule`: Redis-backed CacheModule (5min TTL), BullMQ (`notifications.processor.ts` handles Telegram alerts on contact submissions), ThrottlerModule (100 req/60s via Redis), Pino logging (pretty in dev, file in prod), Prometheus metrics, OpenTelemetry → Jaeger.
- **Database** (`prisma/schema.prisma`): PostgreSQL. Models: `User`, `Project`, `ContactMessage`, `Service`, enum `Role`. Migrations in `prisma/migrations/`. `prisma/seed.ts` is idempotent (upserts admin@baghaei.com, 6 services, 3 projects).

### Frontend (Next.js 16 App Router, port 3000)
- **App Router** with root `src/app/layout.tsx` set to `dir="rtl"` (Persian). Routes: `admin`, `api`, `blog`, `projects`, `careers`, `tools`, etc. Error boundaries via `error.tsx` / `global-error.tsx` / `not-found.tsx`.
- **Theme is forced dark** (`next-themes` with `forcedTheme="dark"`). Colors are HSL CSS variables in `globals.css`. Fonts are local: `--font-iransans` (body) and `--font-yekanbakh` (display).
- **Design system signature**: glassmorphism + 3D tilt. All interactive cards must build on `src/components/ui/Card.tsx` (mouse-tracked perspective tilt, radial lighting, sheen) to keep unified physics. `ProjectCard.tsx` extends it with `preserve-3d` transforms. Inverted border lighting on hover is a deliberate project signature.
- **Signature effects** (`src/components/effects/`): `GlobalUniverse` (scroll-driven scientific solar-system background with eclipses/rings/moon), `Preloader` (Persian word sequence + SVG wave exit), `BackgroundGrid` (cursor spotlight), `CustomCursor` (desktop-only, blend-difference), `PageTransition`, `ProgressBar` (NProgress). Smooth scrolling via Lenis.
- **Backend communication** (`src/lib/api.ts`): base URL = `NEXT_PUBLIC_API_URL` (default `http://127.0.0.1:8000`) + `/api/v1`. Admin auth is a Bearer token in `localStorage` as `admin_token`, auto-attached via `getAuthHeader()` (client-only).
- **TypeScript note**: `strict: false`, ESLint `no-explicit-any` is off — match existing loose typing patterns rather than introducing strict types unprompted.

## Deployment

- **CI/CD**: `.github/workflows/production.yml` runs lint/test/deploy on push to `main`.
- **Deploy**: `deploy.sh` SSHes to the production server, `git pull origin main`, `docker-compose down && up -d --build`, then `docker-compose exec -T backend npx prisma migrate deploy`. Backend Docker entrypoint also runs `prisma migrate deploy` before starting.
- **Docker**: both apps use multi-stage Node 22 Alpine builds, run as non-root `node`. Frontend uses Next standalone output (`node server.js`). `docker-compose.enterprise.yml` is the fuller stack.

## Environment

Backend `.env` (see `backend/.env.example`): `DATABASE_URL`, `PORT` (8000), `JWT_SECRET`, `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID`, `REDIS_HOST`/`REDIS_PORT`, OpenTelemetry vars (`SERVICE_NAME`, `JAEGER_HOST`).
Frontend `.env` (see `frontend/.env.example`): `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`.

## Conventions

- Keep business logic out of NestJS controllers (services hold logic).
- Run all user input through `SecurityService` before processing.
- Reuse `Card.tsx` for any new interactive/3D card UI to preserve the unified glassmorphism + tilt behavior.
- After any `schema.prisma` change, run `npx prisma generate` (and a migration for schema changes).
