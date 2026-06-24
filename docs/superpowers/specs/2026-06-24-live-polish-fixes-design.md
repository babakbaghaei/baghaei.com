# Live Polish Fixes — Design Spec

**Date:** 2026-06-24
**Branch:** `ui-polish-all-pages`
**Status:** Approved (design); ready for implementation planning
**Stakes:** Site is **live**. Every change ships to production via manual SSH deploy.

## Overview

A focused punch-list of polish fixes on the live Baghaei Tech Group site
(`baghaei.com`, Persian/RTL, Next.js 16). Nine items: live-planet verification,
grayscale project cards, projects-section spacing, image-lock wording for 5
projects, tool locks for 2 calculators, project category unification, tool
category expansion, incidental fixes, and a manual SSH deploy + live test.

### Locked decisions (from user)

1. **Live planets:** Deploy this branch only. The planet/Moon code is *already*
   live (J2000 ephemeris from real `now`, refreshed every 60s, Moon phase +
   eclipse computed live). The deployed server is stale — no code change needed,
   only a deploy.
2. **Categories:** Unify projects into a colored/iconed taxonomy (like tools);
   expand tools by splitting the vague «کمکی» bucket into finer groups.
3. **Lock wording:** «در حال انتشار» (publishing) is a *separate* state from the
   existing NDA «محرمانه است». The 5 named projects get the publishing state;
   existing NDA projects keep «محرمانه است».
4. **Deploy:** Manual SSH to `ubuntu@2a0f:94c0:201:1::11f`. Confirm it's the same
   VPS as `185.204.170.101` first, then pull/build this branch and live-test.

---

## Item 1 — Live planets & Moon

**Finding:** `GlobalUniverse.tsx` already computes true heliocentric longitudes
from the real current date (`new Date()`, ticked every 60s) and live Moon
longitude/latitude/phase/eclipse. The perceived "not live" is a **stale deployed
build**.

**Action:** None in code beyond the already-uncommitted Moon-orbit-box fix
(`moonOrbit = size * 2.6`). Ship via deploy (Item 9).

**Acceptance:** On the live site, planet angular positions and Moon phase match a
reference ephemeris for today's date.

---

## Item 2 — Grayscale project cards before hover

**Root cause:** `ProjectContent` (`ProjectCard.tsx`) paints the project's assigned
color edge-to-edge at all times. `Card`'s `colorOnHoverOnly` only fades a tint
*layer* and does not desaturate the project panel, so it is not the right lever
here.

**Approach:** Apply a CSS `grayscale` filter to the colored surface layer of
`ProjectContent`, desaturated by default and animating to full color on hover —
**desktop/hover only**. Touch devices (no hover) stay full color.

- Add `md:[filter:grayscale(1)] md:group-hover/card:[filter:grayscale(0)]` (or the
  Tailwind `grayscale`/`group-hover:grayscale-0` utilities) with a
  `transition-[filter] duration-500` and `motion-reduce:transition-none` to the
  surface wrapper.
- The grayscale must NOT wash out the white title/desc/tech copy: scope the filter
  to the colored background/watermark/sheen layer (the `overflow-hidden` surface
  div), not the text content layer.

**Files:** `frontend/src/components/ui/ProjectCard.tsx`.

**Acceptance:** On desktop, project cards render desaturated (grayscale) until
hovered, then smoothly regain full color; title text stays crisp white throughout;
on touch devices cards are full color (no stuck-gray state).

---

## Item 3 — «پروژه‌های منتخب» spacing to card container

**Root cause:** The desktop pinned row (`PinnedRow` in `Projects.tsx`) centers the
card row vertically inside a `h-screen` sticky viewport (`items-center`), so the
cards sit mid-viewport — a large visual gap below the «منتخب» heading. By contrast
the Testimonials section is `Heading mb-20` immediately followed by its grid.

**Approach:** Tighten the gap so it reads like the Testimonials rhythm:
- Reduce this section's top spacing / heading bottom margin for the projects block.
- Align the pinned card row toward the top of its sticky viewport instead of dead
  center (`items-start` with a measured top offset), OR reduce the pin viewport's
  effective top padding, so the first card sits just under the heading.
- Preserve the horizontal-scroll pin mechanism, the mobile native row, and the
  reduced-motion stack — only the vertical placement/spacing changes.

**Files:** `frontend/src/components/home/Projects.tsx` (and `Section`/`Heading`
spacing props if needed, scoped to this section).

**Acceptance:** The vertical gap between the «پروژه‌های منتخب» heading and the
first project card visually matches the «اعتماد» (Testimonials) heading→content
gap; horizontal scroll still works on desktop and mobile; reduced-motion stack
unaffected.

---

## Item 4 — Lock 5 project images with «در حال انتشار» (distinct from NDA)

**Current:** `Project.imagesLocked?: boolean` blurs modal screenshots and shows a
lock + «تصاویر این پروژه محرمانه است» (NDA wording).

**Approach:** Introduce a reason discriminator so NDA and "publishing" read
differently.
- Add `imagesLockReason?: 'nda' | 'publishing'` to the `Project` interface
  (`ProjectCard.tsx`). Default/back-compat: when `imagesLocked` is true and no
  reason is set, treat as `'nda'` (existing behavior).
- Set on the 5 named projects in `projects.ts`: `kish-airport-fids`,
  `kevany-tuning`, `darso-platform`, `royal-aghdasieh-club`, `malata-platform` →
  `imagesLocked: true, imagesLockReason: 'publishing'`.
  - `malata-platform` currently has **no** `images[]`. Give it the "publishing"
    placeholder treatment (the modal's no-image branch shows a «در حال انتشار»
    state) rather than the generic "coming soon preview" text.
- **Modal** (`ProjectModal.tsx`): branch the overlay by reason —
  - `publishing`: an upload/clock-style icon + «در حال انتشار» (softer, "coming
    soon" tone). Apply to both the blurred-images branch and the no-images branch.
  - `nda`: keep the existing lock + «تصاویر این پروژه محرمانه است».
- **Closed card** (`ProjectCard.tsx`): the existing bottom-left lock badge becomes
  reason-aware — for `publishing`, show a small «در حال انتشار» pill (text chip)
  instead of the bare NDA lock icon.

**Files:** `frontend/src/components/ui/ProjectCard.tsx`,
`frontend/src/components/home/ProjectModal.tsx`,
`frontend/src/lib/data/projects.ts`.

**Acceptance:** The 5 named projects show a «در حال انتشار» state (card pill +
modal overlay), visually distinct from the NDA «محرمانه است» state which other
locked projects retain; malata (no images) shows the publishing placeholder, not a
broken/empty media slot.

---

## Item 5 — Lock «خسارت تأخیر» and «عیدی و سنوات» tools with custom notes

**Current:** `Tool.status?: 'new' | 'beta' | 'soon'`. `status:'soon'` renders a
short «به‌زودی» pill and makes the card non-clickable + dimmed (`ToolCard.tsx`).

**Approach:** Add an optional per-tool note shown in the locked state.
- Add `lockNote?: string` to the `Tool` interface (`tools.ts`).
- Set both tools to `status: 'soon'` with a note:
  - `khesarat-takhir` → `lockNote: 'در انتظار تأیید بانک مرکزی'`
  - `eidi-sanavat` → `lockNote: 'در انتظار اعلام قانون کار'`
- `ToolCard`: when `status==='soon'` and `lockNote` is set, render a lock icon +
  the note text (replacing the bare «به‌زودی» pill); keep the card non-clickable
  and dimmed. The note may need to wrap / use a smaller pill so it fits the card.
- Because both are now `soon`, they are automatically dropped from the homepage
  "featured" strip (`FEATURED_TOOLS = TOOLS.filter(t => t.featured && t.status !==
  'soon')`). Their `featured: true` can stay (harmless) or be removed; removing is
  cleaner.

**Files:** `frontend/src/lib/data/tools.ts`,
`frontend/src/components/ui/ToolCard.tsx`.

**Acceptance:** Both tools appear locked (non-clickable, dimmed) with their
specific Persian note visible; neither appears in the homepage featured tools;
other tools unaffected.

---

## Item 6 — Unify project categories (colored + iconed taxonomy)

**Current:** 14 free-form `category` strings across `projects.ts`; the `/projects`
filter chips are plain bordered pills with no color/icon; no category metadata
exists for projects.

**Approach:** Collapse to 8 unified categories, each with a color + icon, mirroring
the tools `CATEGORY_META` pattern.

| Unified category | Projects (slug) |
|---|---|
| امنیت سایبری | ravro-platform |
| زیرساخت و SaaS | kish-airport-fids, koolak-platform, pushio |
| تجارت الکترونیک | malata-platform |
| آموزش | darso-platform, roshd-project |
| بازی و سرگرمی | online-backgammon, pixel-ball |
| هوش مصنوعی | dardodel-bot |
| برند و طراحی | kevany-tuning, royal-aghdasieh-club |
| پلتفرم هوشمند | spotlight-tourleader, owj-life-coach |

- Update each project's `category` in `projects.ts` to its unified value.
- Add `PROJECT_CATEGORY_META: Record<string, { color: string; icon: LucideIcon }>`
  (new, e.g. in `projects.ts` or a small sibling module) + a `getProjectCategoryMeta`
  helper with a safe fallback, same shape as tools' `getCategoryMeta`.
- `/projects` filter chips (`ProjectsGrid.tsx`): adopt the colored/iconed chip
  style (color dot, active = filled category color) like `ToolsClient.tsx` tabs.
- The per-card panel color (`project.color`/`borderColor`) is **unchanged** — only
  the category label/taxonomy and the filter UI change. The closed-card category
  chip keeps showing `project.category` (now the unified value).

**Files:** `frontend/src/lib/data/projects.ts`,
`frontend/src/components/projects/ProjectsGrid.tsx`, and any consumer that displays
`project.category` (verify modal hero + closed-card chip read correctly).

**Acceptance:** `/projects` shows ~8 colored/iconed filter chips; each filters
correctly; every project maps to exactly one unified category; card panel colors
unchanged; no orphan/empty category.

---

## Item 7 — Expand tool categories (split «کمکی»)

**Current:** 5 tool categories: حقوقی، املاک، مالی، سرگرمی، کمکی. «کمکی» is a
catch-all of 5 unlike tools (decision wheel, percent, number-to-words, word
counter, unit converter).

**Approach:** Split «کمکی» into finer, meaningful groups; move the decision wheel
to سرگرمی.

| Category | Tools (slug) | State |
|---|---|---|
| حقوقی | khesarat-takhir, diyeh, taghsim-ers, maliyat-ers, mohlat-ghanuni | unchanged |
| املاک | rahn-ejareh, ajrat-mesl | unchanged |
| مالی | aghsat-vam, sood-sepordeh, eidi-sanavat | unchanged |
| سرگرمی | type-jangi, mohasebe-sen, bmi, **spin-win** (moved) | spin-win moved in |
| متن و محتوا | adad-be-horoof, shomaresh-kalamat | **new** |
| مبدل و محاسبه | mohasebe-darsad, tabdil-vahed | **new** |

- Update each affected tool's `category` in `TOOLS`.
- Add the two new categories to `CATEGORY_META` with distinct color + Lucide icon
  (e.g. متن و محتوا → `FileText`/violet-ish; مبدل و محاسبه → `ArrowRightLeft` or
  `Calculator`/indigo). Keep colors visually distinct from the existing five.
- `TOOL_CATEGORIES` derives automatically from `TOOLS`; the `/tools` grouped view
  and filter chips pick up the new groups with no further change.
- Order: keep حقوقی → املاک → مالی → سرگرمی → متن و محتوا → مبدل و محاسبه (source
  order in `TOOLS` drives chip/group order, so reorder entries if needed).

**Files:** `frontend/src/lib/data/tools.ts` (data + `CATEGORY_META`; possibly icon
imports).

**Acceptance:** `/tools` shows the expanded category set; «کمکی» no longer exists;
every tool sits in a sensible category with its own color/icon; grouped "همه" view
and chips render all groups correctly; no empty group.

---

## Item 8 — Incidental fixes («هر ریزه‌کاری دیگر»)

**Approach:** While implementing, fix small obvious defects encountered in the
touched files (visual glitches, contrast, RTL/spacing nits, console errors). Any
change **larger** than a trivial nit, or outside the touched components, is raised
with the user before doing it (avoid scope creep on a live site).

**Acceptance:** No new regressions; incidental fixes are small, local, and noted in
the commit message.

---

## Item 9 — Manual SSH deploy + live test

**Approach:**
1. Connect: `ssh ubuntu@2a0f:94c0:201:1::11f` (password provided by user
   out-of-band; do not store it in the repo).
2. **Confirm host identity:** verify this is the same VPS as `185.204.170.101`
   (the known production host from memory) before changing anything — check the
   running stack / domain / docker compose project.
3. Get the code: fetch + checkout/pull `ui-polish-all-pages` on the server.
   (Memory notes auto-deploy is push-to-`main`; this is a manual branch deploy, so
   do it explicitly — do not assume the poller will handle a non-main branch.)
4. Rebuild + restart only what's needed (`docker compose up -d --build` for the
   frontend, mindful of the 1GB RAM + swap constraint and Prisma 7 quirks noted in
   memory). Run `prisma migrate deploy` only if a migration exists (none expected —
   this is frontend-only data/UI work).
5. **Live test** on the running site: planets/Moon live & correct for today;
   project cards grayscale→color on hover; projects-section spacing tightened;
   the 5 projects show «در حال انتشار»; the 2 tools show their lock notes and are
   non-clickable; `/projects` and `/tools` show the new category filters and
   filter correctly; spot-check mobile.

**Acceptance:** The live site reflects every item above with no console errors and
no broken layout on desktop or mobile.

---

## Out of scope
- Any backend/schema/migration change (this is frontend data + UI only).
- Changing per-card panel colors or the Card tilt/glass physics.
- Re-architecting the horizontal-scroll mechanism (Item 3 is spacing only).
- New project imagery / Sketch export pipeline (separate Phase 4 work).
- CI prebuild / auto-deploy changes (separate Phase 8 work).

## Cross-cutting conventions
- Reuse `Card.tsx` for any interactive/3D card (project convention).
- Match existing loose TypeScript style (`strict: false`, `any` allowed).
- Respect `prefers-reduced-motion` via the local `usePrefersReducedMotion` hook /
  `motion-reduce:` utilities for any new animation.
- Persian-correct: no letter-spacing/monospace on connected Persian script.
