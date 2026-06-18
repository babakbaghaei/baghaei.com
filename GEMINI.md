# GEMINI.md - Baghaei Tech Group Context

## Project Overview
This is a high-end enterprise technology platform and corporate website for **Baghaei Tech Group**. It is built as a modular monorepo designed for maximum scalability, security, and visual performance.

### Core Stack
- **Frontend:** Next.js 16 (App Router) + React 19 + Tailwind CSS v4.
- **Backend:** NestJS 11 + Prisma ORM + PostgreSQL.
- **Infrastructure:** Docker, Redis (Caching), BullMQ (Task Queues), OpenTelemetry (Observability).
- **Design System:** Custom premium UI with heavy use of Glassmorphism, 3D Tilt effects (Framer Motion), and dynamic lighting.

## Building and Running

### Development Commands
The project uses a `Makefile` for high-level management:
- `make up`: Starts the development environment using Docker Compose.
- `make down`: Stops all containers.
- `make build`: Rebuilds Docker images.
- `make logs`: Tails logs from all services.

### Local (No Docker)
**Backend:**
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### CI/CD & Deployment
- **Deployment:** Automated via `deploy.sh` to server `46.249.99.158`. It uses SSH to pull changes and restart Docker containers with zero-downtime intentions.
- **Workflows:** GitHub Actions (`production.yml`) handles linting, testing, and automated deployment on every push to `main`.

## Development Conventions

### Coding Style
- **Clean Architecture:** Modular NestJS structure. Business logic is strictly separated from controllers.
- **Type Safety:** 100% TypeScript. Prisma ensures database-level type safety.
- **UI Logic:**
  - Strict adherence to Light/Dark mode using Tailwind semantic colors.
  - Interactive components (Cards) must use the `Card.tsx` base component to maintain unified glassmorphism/3D physics.
  - Inverted border lighting on hover is a project-specific signature.

### Security Standards
- All user inputs must be processed through `SecurityService` in the backend.
- Use `xss-clean` and `express-mongo-sanitize` logic for all API endpoints.
- No hardcoded secrets; use `.env` files (see `.env.example`).

### Testing
- **Backend:** Unit tests using `jest` (`npm test`).
- **Frontend:** E2E tests using `playwright` (`npx playwright test`).

---
*This context is updated as of December 2025.*
