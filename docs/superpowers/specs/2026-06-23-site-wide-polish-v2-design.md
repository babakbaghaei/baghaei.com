# Site-wide Polish v2 — Design Spec

**Date:** 2026-06-23
**Branch:** `ui-polish-all-pages`
**Status:** Approved (design); ready for implementation planning

## Overview

Second site-wide UI/UX + infrastructure pass on the Baghaei Tech Group site
(`baghaei.com`, Persian/RTL, Next.js 16 frontend + NestJS backend). Addresses 17
user-reported items grouped into 8 cohesive phases. This is one phased spec;
`writing-plans` will produce an implementable plan per phase so each ships/PRs
independently.

### Locked decisions

1. **Build/deploy:** Build Docker images in GitHub Actions (CI), push to GHCR; VPS
   only `docker compose pull`. Deploy drops from ~1 hour to ~2–3 min. Add a real
   deploy-progress page.
2. **Project images:** Auto-export artboards from `/BlueTech/*.sketch` via
   `sketchtool` (verified working), curate best 3–6 per project, optimize for web.
   Present curated list for approval before wiring in.
3. **Testimonials:** I draft natural Persian testimonials tied to real projects,
   generic role-based attribution (no fabricated names); user approves before ship.
4. **Chat "online":** Tehran business hours (09:00–21:00) → green "آنلاین"; otherwise
   "معمولاً سریع پاسخ می‌دهیم". Pulsing dot.
5. **(A) Résumé handling:** Jobs form takes a **CV/portfolio link** field, not a raw
   file upload (no object storage on 1GB VPS).
6. **(B) Projects subdomain:** `projects.` (plural) canonical; `project.` (singular)
   301-redirected.
7. **(C) Unmapped Sketch files** (`Johar, Loremi, iKish, Kish Stock Exchange, Raha
   EDR, Samab, Moomi`): **ignored** — out of scope.

### Build order

`1 → 2 → (3 and 6 in parallel) → 4 → 5 → 7 → 8`

Rationale: Phase 1 unblocks conversions immediately; Phase 2 is the responsive
foundation everything else sits on; 3 and 6 are independent scroll/visual work; 4
depends on 2's fluid sizing; 5 depends on 1's filter fix and 2's mobile work; 7 and
8 are infrastructure, independent of UI.

---

## Phase 1 — Conversion-blocking bugs

**Goal:** Forms submit and persist; filters and command UI render correctly.

### 1a. Forms error / don't save
**Root cause (confirmed):** root `.env` sets `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`.
`frontend/src/lib/api.ts:14` appends `/api/v1` again, and `frontend/src/app/actions.ts`
builds `${backendUrl}/api/v1/contact` — so requests hit `…/api/v1/api/v1/contact`
(404). Additionally `localhost:8000` is unreachable from the production frontend
container / browser.

**Approach:**
- Normalize the URL builder: strip a trailing `/api/v1` (and trailing slashes) from
  the env value, then append `/api/v1` exactly once. Bug-proof regardless of env.
- Split transport by context: browser/client → the current public backend origin
  (whatever resolves today, e.g. the VPS backend host; becomes `api.baghaei.com`
  once Phase 7 lands — Phase 1 must not depend on that subdomain existing yet);
  server actions (run in the frontend container) → internal `http://backend:8000`
  via a server-only `API_INTERNAL_URL`.
- Fix root `.env` + `docker-compose.yml` build args/env to the correct public URL.
- Verify backend CORS allowlist (`backend/src/security/security.service.ts`) covers
  every origin that submits (apex + `www` + relevant subdomains).

**Files:** `frontend/src/lib/api.ts`, `frontend/src/app/actions.ts`, root `.env` +
`.env.example`, `docker-compose.yml`, `backend/src/security/security.service.ts`.

**Acceptance:** Contact form submits successfully against a live backend and a row
lands in `ContactMessage`; no double-`/api/v1` in any request URL; CORS passes for
the live origin.

### 1b. Careers/jobs form
**Root cause (confirmed):** `CareerModal.tsx` submit is a no-op
(`onSubmit={(e)=>e.preventDefault()}`); no backend endpoint exists.

**Approach:**
- Backend: new `careers` module (controller + service + DTO), `JobApplication`
  Prisma model (name, email, phone, position, portfolioUrl, message, createdAt) +
  migration. Sanitize all inputs via `SecurityService`. Optional Telegram alert via
  existing notifications processor.
- Frontend: wire `CareerModal` to submit through `api.ts`. Replace raw file input
  with a **CV/portfolio link** field (decision A).

**Files:** `backend/src/careers/*` (new), `backend/prisma/schema.prisma` (+migration),
`frontend/src/components/ui/CareerModal.tsx`.

**Acceptance:** Submitting the jobs form persists a `JobApplication` row; validation
errors surface to the user; honeypot/sanitization applied.

### 1c. "همه" filter white-on-white in dark mode
**Root cause (confirmed):** dark `--primary: 0 0% 98%` (near-white) + hardcoded
`text-white` on the active "همه" button (`ToolsClient.tsx:108`).

**Approach:** Use `text-primary-foreground` for the primary-bg case; keep `text-white`
only for saturated category-color backgrounds.

**Files:** `frontend/src/app/tools/ToolsClient.tsx`.

**Acceptance:** Active "همه" button text is legible in dark mode.

### 1d. Remove ⌘K text
**Current:** `Navbar.tsx:151` renders `<kbd>⌘K</kbd>`.

**Approach:** Remove the kbd label; keep the search button and the Cmd/Ctrl+K shortcut
functional.

**Files:** `frontend/src/components/layout/Navbar.tsx`.

**Acceptance:** No "⌘K" text visible; command menu still opens via click and shortcut.

---

## Phase 2 — Responsive & mobile foundation

**Goal:** Sane scaling on large screens; readable, touch-friendly mobile.

### 2a. Large-screen bloat
**Root cause (confirmed):** `globals.css:122` `html { font-size: clamp(14px, 1.1vw, 18px) }`.
Above ~1636px viewport the root hits the 18px cap → every rem is ~+12.5%, inflating
the whole UI on a 16" MacBook fullscreen.

**Approach:** Replace with a near-flat clamp (≈`clamp(15px, 0.2vw + 14px, 16.5px)`) so
wide screens stop inflating type. Fill wide screens via container max-widths and more
grid columns, not larger text.

**Files:** `frontend/src/app/globals.css`, `frontend/tailwind.config.ts` (optional
`2xl`/container caps).

### 2b. Card text overflow
**Root cause (confirmed):** `ProjectsGrid.tsx:96` hard-locks
`max-w-[320px] h-[360px]` + `line-clamp` → clipped text on large screens.

**Approach:** Fluid card sizing (min-height instead of fixed height, responsive
max-width, 4 columns at `2xl`); allow text to breathe.

**Files:** `frontend/src/components/projects/ProjectsGrid.tsx`,
`frontend/src/components/ui/ProjectCard.tsx` (coordinated with Phase 4).

### 2c. Mobile typography & touch targets
**Root cause (confirmed):** widespread `text-[9px]`/`text-[10px]` and `h-8`/tiny
targets (ProjectCard tech tags, tool category tags, type-jangi controls, admin login,
shell hints, etc.).

**Approach:** Enforce ≥12px readable text in user-facing/interactive contexts and
≥44px tap targets across nav, filter chips, tool cards, tool calculators, forms.

**Files:** offenders enumerated during exploration across
`frontend/src/components/**`, `frontend/src/app/tools/**`, `frontend/src/app/admin/**`.

**Acceptance:** No interactive control below 44px; no body/label text below 12px;
project/tool card text fully visible at fullscreen on a 16" display.

---

## Phase 3 — Stars on every page, solartoscale-style scroll

**Goal:** Consistent scroll-reactive starfield site-wide.

**Current state:** `GlobalUniverse renderBackground` (canvas starfield) is mounted in
the root layout (`layout.tsx:193-197`) at `z-[-2]`, so it technically renders on all
pages — but inner pages likely paint opaque section backgrounds over it, so it reads
as home-only. Scroll parallax exists but is subtle.

**Approach:**
- Make inner-page section backgrounds translucent so the global starfield shows
  through everywhere.
- Upgrade `GalaxyBackground` scroll behavior toward solartoscale feel: multi-layer
  depth parallax (near layers faster, far slower) + subtle "forward travel" (stars
  drift outward from center as you scroll). Keep canvas perf (IntersectionObserver
  pause) and the reduced-motion static frame.

**Files:** `frontend/src/components/effects/GlobalUniverse.tsx`, page/section
background styles where opaque.

**Acceptance:** Starfield visible and scroll-reactive on home, projects, tools, blog,
careers; reduced-motion shows a static frame; no jank/regression in scroll FPS.

---

## Phase 4 — Project cards redesign + real Sketch images

**Goal:** Professional imagery and a redesigned opened card matching new data.

### 4a. Image pipeline
**Approach:** Script `sketchtool export artboards` (verified) at 2× from each mapped
`/BlueTech/*.sketch`; curate best 3–6 artboards per project (full screens/key flows,
skip icon/empty artboards); optimize (≤1600px wide, webp, target <200KB). Write into
`frontend/public/assets/projects/<slug>/`; update `frontend/src/lib/data/projects.ts`
`images[]` and add per-image aspect-ratio metadata for varied layout.

**Sketch → slug mapping (in scope):** Kish Airport→`kish-airport-fids`,
Backgomman Game→`online-backgammon`, Darsoo→`darso-platform`, Koolek→`koolak-platform`,
Kayvani→`kevany-tuning`, Pushio→`pushio`, Royal Aqdasieh Gym→`royal-aghdasieh-club`.
Unmapped files ignored (decision C).

**Gate:** Present curated per-project selection list for user approval before wiring.

### 4b. Opened card (modal + `/projects/[slug]`)
**Approach:** Editorial layout with varied screenshot sizes (natural aspect ratios,
not uniform 16:9); prominent "مشاهدهٔ زنده / visit live" button when `href` exists;
glassmorphism kept and enhanced.

**Files:** `frontend/src/components/home/ProjectModal.tsx`,
`frontend/src/app/projects/[slug]/page.tsx`.

### 4c. Closed card
**Approach:** Keep the glass + 3D tilt signature (`Card.tsx`); refine spacing, fluid
sizing (from Phase 2), logo/image treatment; 4-col at `2xl`.

**Files:** `frontend/src/components/ui/ProjectCard.tsx`,
`frontend/src/components/ui/Card.tsx` (only if enhancement needed).

**Acceptance:** All in-scope projects show high-quality imagery; opened card varies
screenshot sizes and exposes a live link when available; closed cards keep glass +
tilt and no longer clip text.

---

## Phase 5 — Tools section + dropdowns + content

**Goal:** Best-in-class mobile experience for the primary ad surface; consistent
navigation content; human testimonials; believable chat presence.

### 5a. Tools mobile-max
**Approach:** Large tap targets, readable type (no `text-[10px]`), horizontally
scrollable category chips with correct dark-mode contrast (also resolves 1c context),
prominent featured tools, snappy search. Keep individual calculator pages light on
mobile.

**Files:** `frontend/src/app/tools/ToolsClient.tsx`,
`frontend/src/components/ui/ToolCard.tsx`, `frontend/src/components/tools/shell.tsx`.

### 5b. Navbar dropdown consistency
**Root cause (confirmed):** tools mega-menu `slice(0,4)` hides the 5th tool per
category; products dropdown shows 5 hardcoded projects.

**Approach:** Make both dropdowns fully data-driven from `tools.ts` / `projects.ts`;
unify styling.

**Files:** `frontend/src/components/layout/Navbar.tsx`, `frontend/src/lib/nav.ts`.

### 5c. Testimonials
**Approach:** Replace placeholder testimonials with natural Persian quotes tied to
real projects, generic role-based attribution. Present for approval.

**Files:** `frontend/src/components/home/Testimonials.tsx`.

### 5d. Chat presence
**Approach:** Compute Tehran local hour client-side; 09:00–21:00 → green "آنلاین",
else "معمولاً سریع پاسخ می‌دهیم"; pulsing green dot on the launcher.

**Files:** `frontend/src/components/layout/ChatWidget.tsx`.

**Acceptance:** Tools section is comfortably usable one-handed on mobile; dropdowns
list all current tools/products; testimonials read as authentic and are approved;
chat shows time-correct presence.

---

## Phase 6 — Horizontal-scroll stutter

**Goal:** Smooth horizontal→vertical handoff in the projects slider.

**Root cause (confirmed):** `Projects.tsx:129-145` hijacks the wheel and manually
drives `scrollLeft` until an edge, then releases to Lenis — the handoff jerks/locks
(amplified by Lenis lerp). Container also uses `data-lenis-prevent`.

**Approach:** Replace the wheel-hijack with a **sticky-pinned** section driven by
scroll progress (`useScroll`/Lenis): the section pins, vertical scroll translates
content horizontally via progress, then unpins and continues vertical — no mode switch,
no wheel hijack. Native horizontal swipe retained on mobile; reduced-motion falls back
to normal vertical stacking.

**Files:** `frontend/src/components/home/Projects.tsx`.

**Acceptance:** No stutter/lock at the horizontal→vertical transition on trackpad,
mouse wheel, and touch; reduced-motion path works.

---

## Phase 7 — Subdomains

**Goal:** Section subdomains backed by Host-based rewrites; correct SEO and CORS.

**Approach:** Host-based rewrites in `frontend/src/proxy.ts` (Next 16 middleware):

| Subdomain | Routes to | Notes |
|---|---|---|
| `baghaei.com` | full site | apex |
| `www.baghaei.com` | → 301 apex | |
| `tools.baghaei.com` | `/tools` | |
| `blog.baghaei.com` | `/blog` | |
| `projects.baghaei.com` | `/projects`, `/projects/<slug>` | `projects.baghaei.com/ravro` |
| `jobs.baghaei.com` | `/careers` | |
| `login.baghaei.com` | `/admin` | |
| `api.baghaei.com` | backend `/api/v1` | also fixes Phase 1 host |
| `status.baghaei.com` | deploy progress page | from Phase 8 |

- `project.baghaei.com` (singular) → 301 to `projects.` (decision B).
- Update canonical URLs, `next-sitemap` config, and OG URLs per subdomain.
- Extend backend CORS allowlist to all submitting origins.
- Ensure nginx passes the original `Host` through to the frontend so `proxy.ts` sees
  the subdomain.
- Deliverable: exact Cloudflare DNS record list for the user to create.

**Files:** `frontend/src/proxy.ts`, `frontend/next-sitemap.config.*`, nginx config,
`backend/src/security/security.service.ts`.

**Acceptance:** Each subdomain serves its section; `projects.baghaei.com/ravro`
resolves to the project page; singular redirects; CORS passes; sitemap/canonical
correct.

---

## Phase 8 — Build: CI prebuild + VPS pull + progress page

**Goal:** Cut deploy from ~1 hour to minutes; give a real progress indicator.

**Root cause (confirmed):** frontend `next build` runs on the 1GB VPS with
`NODE_OPTIONS=--max-old-space-size=2048` → heavy swap → ~1 hour; webpack (not
turbopack); heavy deps.

**Approach:**
- **CI** (`.github/workflows/production.yml`): build frontend + backend images in
  GitHub Actions (ample RAM), push to GHCR with layer cache. Re-enable a build+push
  job (deploy job currently `if: false`).
- **VPS** (`deploy/auto-deploy.sh`): switch to `docker compose pull && docker compose
  up -d` (no `--build`) + `prisma migrate deploy`. `docker-compose.yml` services
  reference `image: ghcr.io/<owner>/baghaei-{frontend,backend}` with build as fallback;
  add `mem_limit` to stay within 1GB.
- **Progress page:** deploy script writes `deploy-status.json` (stage, percent, ETA,
  commit, started_at) at each step (fetch → pull → migrate → up → done), served by
  nginx. `status.baghaei.com` (and/or an enhanced maintenance page) polls it and
  renders a real progress bar + stage + ETA.

**Files:** `.github/workflows/production.yml`, `deploy/auto-deploy.sh`,
`docker-compose.yml`, nginx config, new status page under `frontend/src/app/`.

**Acceptance:** Push to `main` builds+pushes images in CI; VPS deploy completes in
minutes via pull; status page shows live stage/percent during a deploy.

---

## Out of scope
- Unmapped Sketch files (decision C).
- Raw résumé file upload / object storage (decision A — using link field).
- Backend-driven project data (projects remain frontend-defined in `projects.ts`).

## Cross-cutting conventions
- Reuse `Card.tsx` for any interactive/3D card (project convention).
- Route all user input through `SecurityService` (backend convention).
- `npx prisma generate` + migration after any `schema.prisma` change.
- Respect `prefers-reduced-motion` via the local `usePrefersReducedMotion` hook for
  hard render gates.
