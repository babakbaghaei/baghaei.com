# Changelog

All notable changes to the **Baghaei Tech Group** platform will be documented in this file.

## [1.0.0] - 2025-12-27

### 🚀 Major Features
- **Next.js 16 Upgrade:** Migrated frontend to Next.js 16 with Turbopack support for ultra-fast development.
- **Dynamic CMS:** Implemented `Services` and `Projects` modules in NestJS with CRUD capabilities.
- **Enterprise Security:**
  - Added global Rate Limiting (Throttler).
  - Implemented strict CSP and Security Headers (Helmet).
  - Added Input Sanitization for all endpoints.
- **Advanced SEO:**
  - Integrated JSON-LD structured data.
  - Created Dynamic Sitemap fetching data from API.
  - Optimized fonts with `next/font/local` (Zero CLS).

### 🛠 Improvements
- **Monorepo Structure:** Unified `package.json` for centralized command management.
- **Docker Infrastructure:** Production-ready `docker-compose` with Nginx reverse proxy and isolated networks.
- **Logging:** Implemented structured JSON logging for production (Pino).
- **Testing:** Added E2E tests with Playwright and comprehensive Backend Unit Tests.
- **CI/CD:** Enhanced GitHub Actions pipeline for full-stack verification.

### 🐛 Bug Fixes
- Fixed Hydration errors by properly separating Client/Server components.
- Resolved all ESLint warnings and errors across the codebase.
- Fixed theme persistence issues in Dark/Light mode.
- Removed vulnerable dependencies (`next-pwa`).

### 🧹 Chore
- Cleaned up root directory (moved docs to `/docs`).
- Added `CONTRIBUTING.md` and `LICENSE`.
- Setup automatic database backup script.
