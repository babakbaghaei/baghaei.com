# Live Polish Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a 9-item polish punch-list to the live `baghaei.com` site: grayscale project cards, projects-section spacing, publishing-vs-NDA image locks, two locked tools, unified project categories, expanded tool categories — then manual SSH deploy + live test.

**Architecture:** Pure frontend changes — data files (`projects.ts`, `tools.ts`) plus the presentational components that read them (`ProjectCard`, `ProjectModal`, `ToolCard`, `ToolsClient`, `ProjectsGrid`, `Projects`). No backend, schema, or migration changes. Verification is via `npm run lint` + `npm run build` (the project's real gates for presentational work — there is no unit-test harness for visual/data changes) plus an explicit manual visual checklist. The planet/Moon code is already live; that item is deploy-only.

**Tech Stack:** Next.js 16 (App Router, `--webpack`), React 19, TypeScript (`strict: false`), Tailwind, framer-motion, lucide-react.

## Global Constraints

- Branch: `ui-polish-all-pages` (NOT `main`). All commits land here.
- Site is **live** — keep every change small, local, and reversible; no scope creep beyond the 9 items without asking.
- TypeScript is loose (`strict: false`, `no-explicit-any` off) — match existing style; do not introduce strict types unprompted.
- Persian/RTL: never apply letter-spacing or monospace to connected Persian script.
- Reuse `Card.tsx` for any interactive/3D card (project convention).
- Respect reduced motion via `motion-reduce:` utilities / the local `usePrefersReducedMotion` hook for any new animation.
- Each task ends green on `cd frontend && npm run lint` (0 errors; pre-existing warnings OK).
- Commit after each task. Commit message trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Do NOT run `npm run build` after every task (slow on this repo); run it once in Task 8 as the final gate before deploy.

---

### Task 1: Grayscale project cards before hover

**Files:**
- Modify: `frontend/src/components/ui/ProjectCard.tsx` (the `ProjectContent` surface layer, around lines 120-146)

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing other tasks depend on (purely visual).

**Context:** In `ProjectContent`, the colored surface is a single clipped div:
`<div className="absolute inset-0 overflow-hidden rounded-[2rem]">` (line ~125)
holding the panel background, watermark, sheen, and bottom scrim. The text/title
content lives in a SEPARATE sibling layer further down, so filtering this surface
div desaturates the color without touching the white copy. The card root has
`group/card` (line ~235), so `group-hover/card:` targets hover.

- [ ] **Step 1: Apply hover-scoped grayscale to the surface layer**

In `frontend/src/components/ui/ProjectCard.tsx`, find the surface wrapper inside `ProjectContent`:

```jsx
      {/* Clipped, FLAT surface layer (colour + watermark + sheen + scrims). It
          owns the overflow-hidden so the texture stays inside the rounded card —
          kept on its OWN element, because overflow-hidden forces a flat stacking
          context and would otherwise collapse every translateZ on the content. */}
      <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
```

Change that opening div to add the desktop-only grayscale-until-hover filter:

```jsx
      {/* Clipped, FLAT surface layer (colour + watermark + sheen + scrims). It
          owns the overflow-hidden so the texture stays inside the rounded card —
          kept on its OWN element, because overflow-hidden forces a flat stacking
          context and would otherwise collapse every translateZ on the content.
          Desktop: desaturated until hover, then eases to full colour (touch
          devices have no hover, so they stay full colour — md: gate). The text
          layer is a separate sibling, so this never dims the white copy. */}
      <div className="absolute inset-0 overflow-hidden rounded-[2rem] transition-[filter] duration-500 ease-out motion-reduce:transition-none md:grayscale md:group-hover/card:grayscale-0">
```

- [ ] **Step 2: Lint**

Run: `cd frontend && npm run lint`
Expected: PASS (0 errors).

- [ ] **Step 3: Visual smoke-check (dev server, optional but recommended)**

If a dev server is convenient: `cd frontend && npm run dev`, open `http://localhost:3000`, scroll to «پروژه‌های منتخب». Expected: project cards are gray until hovered, then fade to full color over ~0.5s; the white title stays crisp the whole time. On a touch device / narrow viewport (`<768px`) cards are full color. If no dev server, rely on the Task 8 build + the live deploy test.

- [ ] **Step 4: Commit**

```bash
cd /Users/babakbaghaei/Desktop/Projects/baghaei.com
git add frontend/src/components/ui/ProjectCard.tsx
git commit -m "feat(projects): grayscale project cards until hover (desktop)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Tighten «پروژه‌های منتخب» → cards spacing

**Files:**
- Modify: `frontend/src/components/home/Projects.tsx` (the `PinnedRow` sticky viewport, ~line 173; and/or the `Section`/`Heading` usage ~line 280-285)

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing other tasks depend on (layout only).

**Context:** Reference rhythm = Testimonials: `<Heading subtitle="برترین‌ها">اعتماد</Heading>` immediately followed by its grid; `Heading` has `mb-20`. In `Projects.tsx`, the desktop branch renders `<Heading subtitle="منتخب">پروژه‌های</Heading>` then `<PinnedRow>`. Inside `PinnedRow`, the sticky viewport centers the row vertically:

```jsx
   <div ref={pinViewportRef} className="sticky top-0 h-screen flex items-center overflow-hidden">
```

`items-center` in a full-screen sticky box is what floats the cards far below the heading. Aligning the row toward the top closes the gap.

- [ ] **Step 1: Align the pinned row toward the top of the sticky viewport**

In `frontend/src/components/home/Projects.tsx`, change the sticky viewport line (inside `PinnedRow`):

```jsx
   <div ref={pinViewportRef} className="sticky top-0 h-screen flex items-center overflow-hidden">
```

to align items toward the top with a heading-clearing offset instead of dead-center:

```jsx
   <div ref={pinViewportRef} className="sticky top-0 h-screen flex items-start overflow-hidden pt-[18vh]">
```

(`items-start` + `pt-[18vh]` lifts the card row up under the heading; the value clears the sticky-top heading while keeping cards comfortably in view. Adjust to `pt-[14vh]`–`pt-[22vh]` if the live check shows it too tight/loose.)

- [ ] **Step 2: Lint**

Run: `cd frontend && npm run lint`
Expected: PASS (0 errors).

- [ ] **Step 3: Visual check**

If dev server is up: the gap between the «پروژه‌های منتخب» heading and the first card should read like the «اعتماد» heading→grid gap (not a half-screen void). Horizontal scroll/pin still works; mobile native row and reduced-motion stack are unchanged (this only touched the desktop pin viewport). Note the chosen `pt-[..vh]` for the live re-check.

- [ ] **Step 4: Commit**

```bash
cd /Users/babakbaghaei/Desktop/Projects/baghaei.com
git add frontend/src/components/home/Projects.tsx
git commit -m "fix(projects): tighten heading-to-cards spacing in pinned row

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Add `imagesLockReason` to Project type + data

**Files:**
- Modify: `frontend/src/components/ui/ProjectCard.tsx` (the `Project` interface, ~lines 14-35)
- Modify: `frontend/src/lib/data/projects.ts` (5 project entries)

**Interfaces:**
- Consumes: nothing new.
- Produces: `Project.imagesLockReason?: 'nda' | 'publishing'` — consumed by Task 4 (modal) and Task 5 (card badge). Default semantics: `imagesLocked === true` with no `imagesLockReason` ⇒ treat as `'nda'`.

- [ ] **Step 1: Extend the `Project` interface**

In `frontend/src/components/ui/ProjectCard.tsx`, find:

```ts
  // Heavily blur/lock the project's screenshots in the detail modal (NDA work).
  imagesLocked?: boolean;
```

Replace with:

```ts
  // Heavily blur/lock the project's screenshots in the detail modal.
  imagesLocked?: boolean;
  // Why the images are locked. 'nda' (default when unset) → confidential wording;
  // 'publishing' → softer "being published / coming soon" wording.
  imagesLockReason?: 'nda' | 'publishing';
```

- [ ] **Step 2: Tag the 5 projects in `projects.ts`**

In `frontend/src/lib/data/projects.ts`, set `imagesLocked: true` + `imagesLockReason: 'publishing'` on these five entries. Apply each edit:

**a) `kish-airport-fids` (id 1):** it currently has `isLocked: false,` and no `imagesLocked`. Add the two fields right after `isLocked: false,`:

```ts
   isLocked: false,
   imagesLocked: true,
   imagesLockReason: 'publishing',
```

**b) `kevany-tuning` (id 9):** after its `isLocked: false,` add:

```ts
   isLocked: false,
   imagesLocked: true,
   imagesLockReason: 'publishing',
```

**c) `malata-platform` (id 5):** after its `isLocked: false,` add (note: this project has no `images[]` — the modal's no-image branch will show the publishing placeholder):

```ts
   isLocked: false,
   imagesLocked: true,
   imagesLockReason: 'publishing',
```

**d) `darso-platform` (id 3):** it already has `imagesLocked: true,`. Add the reason right after it:

```ts
   imagesLocked: true,
   imagesLockReason: 'publishing',
```

**e) `royal-aghdasieh-club` (id 7):** after its `isLocked: false,` add:

```ts
   isLocked: false,
   imagesLocked: true,
   imagesLockReason: 'publishing',
```

- [ ] **Step 3: Lint**

Run: `cd frontend && npm run lint`
Expected: PASS (0 errors).

- [ ] **Step 4: Verify the five tags landed**

Run: `cd frontend && grep -n "imagesLockReason" src/lib/data/projects.ts`
Expected: exactly 5 lines, all `imagesLockReason: 'publishing',`.

- [ ] **Step 5: Commit**

```bash
cd /Users/babakbaghaei/Desktop/Projects/baghaei.com
git add frontend/src/components/ui/ProjectCard.tsx frontend/src/lib/data/projects.ts
git commit -m "feat(projects): add imagesLockReason and tag 5 projects as publishing

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Render «در حال انتشار» state in the project modal

**Files:**
- Modify: `frontend/src/components/home/ProjectModal.tsx` (image overlay ~lines 378-383; no-image branch ~lines 387-398)

**Interfaces:**
- Consumes: `Project.imagesLockReason` from Task 3.
- Produces: nothing other tasks depend on.

**Context:** `ProjectModal` already imports `Lock` and `Image as ImageIcon` from lucide-react. It has two relevant branches: the blurred-image overlay (when `imagesLocked` + has images) and the no-image fallback. Add a `Clock` import for the publishing icon and branch both by reason. `display` is the project; `display.imagesLockReason` is available.

- [ ] **Step 1: Import the Clock icon**

In `frontend/src/components/home/ProjectModal.tsx`, find the lucide-react import block (ends ~line 22 with `Image as ImageIcon`). Add `Clock` to it, e.g. change:

```ts
 Lock,
 Image as ImageIcon
} from 'lucide-react';
```

to:

```ts
 Lock,
 Clock,
 Image as ImageIcon
} from 'lucide-react';
```

- [ ] **Step 2: Add a reason helper near the top of the component body**

In `ProjectModal`, just after `const accent = display.borderColor;` (~line 223), add:

```ts
 const isPublishing = display.imagesLockReason === 'publishing';
```

- [ ] **Step 3: Branch the blurred-image overlay by reason**

Find the locked-image overlay (~lines 378-383):

```jsx
            {display.imagesLocked && (
             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 bg-background/40 backdrop-blur-2xl text-muted-foreground" role="img" aria-label="تصاویر محرمانه">
              <Lock className="w-6 h-6" />
              <span className="text-xs font-display font-bold">تصاویر این پروژه محرمانه است</span>
             </div>
            )}
```

Replace with:

```jsx
            {display.imagesLocked && (
             <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 bg-background/40 backdrop-blur-2xl text-muted-foreground"
              role="img"
              aria-label={isPublishing ? 'در حال انتشار' : 'تصاویر محرمانه'}
             >
              {isPublishing ? <Clock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              <span className="text-xs font-display font-bold">
               {isPublishing ? 'تصاویر این پروژه در حال انتشار است' : 'تصاویر این پروژه محرمانه است'}
              </span>
             </div>
            )}
```

- [ ] **Step 4: Branch the no-image fallback (covers malata)**

Find the no-image fallback block (~lines 387-398):

```jsx
        ) : (
         <div className="relative aspect-[16/9] w-full rounded-2xl md:rounded-[1.75rem] overflow-hidden border border-border bg-secondary/20">
          <div
           className="absolute inset-0"
           style={{ background: `radial-gradient(120% 100% at 50% 0%, ${accentSoft}, transparent 70%)` }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground/50">
           <ImageIcon className="w-7 h-7" />
           <span className="text-xs font-sans">پیش‌نمایش پروژه به‌زودی اضافه می‌شود</span>
          </div>
         </div>
        )}
```

Replace the inner icon+text so a publishing project reads "being published":

```jsx
        ) : (
         <div className="relative aspect-[16/9] w-full rounded-2xl md:rounded-[1.75rem] overflow-hidden border border-border bg-secondary/20">
          <div
           className="absolute inset-0"
           style={{ background: `radial-gradient(120% 100% at 50% 0%, ${accentSoft}, transparent 70%)` }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground/50">
           {isPublishing ? <Clock className="w-7 h-7" /> : <ImageIcon className="w-7 h-7" />}
           <span className="text-xs font-sans">
            {isPublishing ? 'تصاویر این پروژه در حال انتشار است' : 'پیش‌نمایش پروژه به‌زودی اضافه می‌شود'}
           </span>
          </div>
         </div>
        )}
```

- [ ] **Step 5: Lint**

Run: `cd frontend && npm run lint`
Expected: PASS (0 errors).

- [ ] **Step 6: Commit**

```bash
cd /Users/babakbaghaei/Desktop/Projects/baghaei.com
git add frontend/src/components/home/ProjectModal.tsx
git commit -m "feat(projects): show 'being published' modal state distinct from NDA

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Reason-aware lock badge on the closed project card

**Files:**
- Modify: `frontend/src/components/ui/ProjectCard.tsx` (the `isLocked` badge block ~lines 169-175, inside `ProjectContent`)

**Interfaces:**
- Consumes: `Project.imagesLockReason` from Task 3.
- Produces: nothing other tasks depend on.

**Context:** The closed card currently shows a bottom-left badge only when `project.isLocked` is true (a bare `Lock` icon). The 5 publishing projects have `isLocked: false` but `imagesLocked: true`, so they currently show NO badge. Add a publishing pill driven by `imagesLockReason === 'publishing'`. `Lock` is already imported in this file; the pill is text-only so no new icon import is required (optionally add `Clock`).

- [ ] **Step 1: Replace the lock-badge block with a reason-aware version**

In `frontend/src/components/ui/ProjectCard.tsx`, find:

```jsx
      {/* NDA lock badge. */}
      {project.isLocked && (
        <div className="absolute left-4 bottom-4 z-10 transition-transform duration-300 ease-out group-hover/card:[transform:translateZ(55px)] motion-reduce:transition-none" style={{ transform: "translateZ(24px)" }}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 ring-1 ring-white/15 backdrop-blur-md">
            <Lock className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      )}
```

Replace with:

```jsx
      {/* Lock / status badge (bottom-leading). NDA → lock icon; publishing →
          a soft "being published" pill so users know images aren't viewable yet. */}
      {project.imagesLockReason === 'publishing' ? (
        <div className="absolute left-4 bottom-4 z-10 transition-transform duration-300 ease-out group-hover/card:[transform:translateZ(55px)] motion-reduce:transition-none" style={{ transform: "translateZ(24px)" }}>
          <span className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-display font-bold text-white/90 ring-1 ring-white/15 backdrop-blur-md">
            در حال انتشار
          </span>
        </div>
      ) : project.isLocked && (
        <div className="absolute left-4 bottom-4 z-10 transition-transform duration-300 ease-out group-hover/card:[transform:translateZ(55px)] motion-reduce:transition-none" style={{ transform: "translateZ(24px)" }}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 ring-1 ring-white/15 backdrop-blur-md">
            <Lock className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      )}
```

- [ ] **Step 2: Lint**

Run: `cd frontend && npm run lint`
Expected: PASS (0 errors).

- [ ] **Step 3: Visual check (optional)**

On the homepage slider and `/projects`, the 5 publishing projects (fids, keyvany, malata, darso, royal) now show a «در حال انتشار» pill bottom-left; opening any of them shows the publishing modal state from Task 4.

- [ ] **Step 4: Commit**

```bash
cd /Users/babakbaghaei/Desktop/Projects/baghaei.com
git add frontend/src/components/ui/ProjectCard.tsx
git commit -m "feat(projects): 'being published' pill on closed cards

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Lock «خسارت تأخیر» and «عیدی و سنوات» tools with notes

**Files:**
- Modify: `frontend/src/lib/data/tools.ts` (the `Tool` interface ~lines 26-39; the two tool entries)
- Modify: `frontend/src/components/ui/ToolCard.tsx` (the `soon` badge ~lines 50-54)

**Interfaces:**
- Consumes: nothing new.
- Produces: `Tool.lockNote?: string` — consumed by `ToolCard`.

**Context:** `Tool.status === 'soon'` already makes a card non-clickable + dimmed (`ToolCard.tsx` lines 76-78) and renders a «به‌زودی» pill. Adding `lockNote` lets a soon-tool show a custom reason instead. The homepage featured strip already excludes soon tools (`FEATURED_TOOLS = TOOLS.filter(t => t.featured && t.status !== 'soon')`), so these two drop off the homepage automatically.

- [ ] **Step 1: Add `lockNote` to the `Tool` interface**

In `frontend/src/lib/data/tools.ts`, find:

```ts
  status?: ToolStatus;
  /** در صفحهٔ اصلی به‌عنوان منتخب نمایش داده شود. */
  featured?: boolean;
}
```

Replace with:

```ts
  status?: ToolStatus;
  /** متن قفل اختصاصی برای ابزارهای «به‌زودی» (مثلاً «در انتظار تأیید بانک مرکزی»). */
  lockNote?: string;
  /** در صفحهٔ اصلی به‌عنوان منتخب نمایش داده شود. */
  featured?: boolean;
}
```

- [ ] **Step 2: Lock `khesarat-takhir`**

In `frontend/src/lib/data/tools.ts`, find the `khesarat-takhir` entry:

```ts
  {
    slug: 'khesarat-takhir',
    title: 'خسارت تأخیر تأدیه',
    desc: 'محاسبهٔ دقیق کاهش ارزش پول بر اساس شاخص رسمی بانک مرکزی و ماده ۵۲۲ آیین دادرسی مدنی.',
    category: 'حقوقی',
    icon: Scale,
    accent: '245, 158, 11',
    status: 'new',
    featured: true,
  },
```

Replace its `status`/`featured` tail so it becomes a locked tool:

```ts
  {
    slug: 'khesarat-takhir',
    title: 'خسارت تأخیر تأدیه',
    desc: 'محاسبهٔ دقیق کاهش ارزش پول بر اساس شاخص رسمی بانک مرکزی و ماده ۵۲۲ آیین دادرسی مدنی.',
    category: 'حقوقی',
    icon: Scale,
    accent: '245, 158, 11',
    status: 'soon',
    lockNote: 'در انتظار تأیید بانک مرکزی',
  },
```

- [ ] **Step 3: Lock `eidi-sanavat`**

Find the `eidi-sanavat` entry:

```ts
  {
    slug: 'eidi-sanavat',
    title: 'عیدی و سنوات',
    desc: 'محاسبهٔ عیدی پایان سال و حق سنوات بر اساس قانون کار و حداقل دستمزد مصوب شورای عالی کار.',
    category: 'مالی',
    icon: Gift,
    accent: '217, 119, 6',
    status: 'new',
    featured: true,
  },
```

Replace with:

```ts
  {
    slug: 'eidi-sanavat',
    title: 'عیدی و سنوات',
    desc: 'محاسبهٔ عیدی پایان سال و حق سنوات بر اساس قانون کار و حداقل دستمزد مصوب شورای عالی کار.',
    category: 'مالی',
    icon: Gift,
    accent: '217, 119, 6',
    status: 'soon',
    lockNote: 'در انتظار اعلام قانون کار',
  },
```

- [ ] **Step 4: Render `lockNote` in `ToolCard`**

In `frontend/src/components/ui/ToolCard.tsx`, find the soon-badge branch:

```jsx
          {isSoon ? (
            <span className="rounded-full bg-muted/60 px-2 py-0.5 text-xs font-bold font-display text-muted-foreground">
              به‌زودی
            </span>
          ) : (
```

Replace with a version that prefers `lockNote` when present (lock icon + note, wraps to fit):

```jsx
          {isSoon ? (
            <span className="inline-flex max-w-[60%] items-center gap-1 rounded-full bg-muted/60 px-2.5 py-1 text-[11px] font-bold font-display leading-tight text-muted-foreground text-right">
              <Lock className="h-3 w-3 shrink-0" aria-hidden />
              {tool.lockNote ?? 'به‌زودی'}
            </span>
          ) : (
```

- [ ] **Step 5: Import the `Lock` icon in `ToolCard`**

In `frontend/src/components/ui/ToolCard.tsx`, find the import:

```ts
import { ArrowUpLeft } from 'lucide-react';
```

Replace with:

```ts
import { ArrowUpLeft, Lock } from 'lucide-react';
```

- [ ] **Step 6: Lint**

Run: `cd frontend && npm run lint`
Expected: PASS (0 errors).

- [ ] **Step 7: Verify the two locks landed**

Run: `cd frontend && grep -n "lockNote" src/lib/data/tools.ts`
Expected: 2 lines — `در انتظار تأیید بانک مرکزی` and `در انتظار اعلام قانون کار`.

- [ ] **Step 8: Commit**

```bash
cd /Users/babakbaghaei/Desktop/Projects/baghaei.com
git add frontend/src/lib/data/tools.ts frontend/src/components/ui/ToolCard.tsx
git commit -m "feat(tools): lock khesarat & eidi-sanavat with pending-approval notes

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Unify project categories + expand tool categories

**Files:**
- Modify: `frontend/src/lib/data/projects.ts` (14 `category` values + new category-meta export)
- Modify: `frontend/src/components/projects/ProjectsGrid.tsx` (colored/iconed filter chips)
- Modify: `frontend/src/lib/data/tools.ts` (move/retag categories + `CATEGORY_META` entries)

**Interfaces:**
- Consumes: nothing new.
- Produces: `PROJECT_CATEGORY_META: Record<string, { color: string; icon: LucideIcon }>` and `getProjectCategoryMeta(category: string): { color: string; icon: LucideIcon }` exported from `projects.ts` — consumed by `ProjectsGrid.tsx`.

**Context:** Tools already have `CATEGORY_META` + `getCategoryMeta` + a colored-chip UI in `ToolsClient.tsx`. Projects have free-form categories and plain chips. We mirror the tools pattern for projects, and split the tools «کمکی» bucket.

#### 7A — Unify the 14 project categories into 8

- [ ] **Step 1: Retag each project's `category` in `projects.ts`**

In `frontend/src/lib/data/projects.ts`, set each project's `category` to its unified value (find each by `slug`):

| slug | new `category` |
|---|---|
| `ravro-platform` | `'امنیت سایبری'` |
| `kish-airport-fids` | `'زیرساخت و SaaS'` |
| `kevany-tuning` | `'برند و طراحی'` |
| `koolak-platform` | `'زیرساخت و SaaS'` |
| `online-backgammon` | `'بازی و سرگرمی'` |
| `spotlight-tourleader` | `'پلتفرم هوشمند'` |
| `owj-life-coach` | `'پلتفرم هوشمند'` |
| `roshd-project` | `'آموزش'` |
| `pixel-ball` | `'بازی و سرگرمی'` |
| `malata-platform` | `'تجارت الکترونیک'` |
| `dardodel-bot` | `'هوش مصنوعی'` |
| `darso-platform` | `'آموزش'` |
| `pushio` | `'زیرساخت و SaaS'` |
| `royal-aghdasieh-club` | `'برند و طراحی'` |

Edit only the `category: '...'` line on each entry; leave `color`/`borderColor`/all other fields untouched.

- [ ] **Step 2: Add category-meta exports to `projects.ts`**

At the top of `frontend/src/lib/data/projects.ts`, the current first line is:

```ts
import { Project } from '@/components/ui/ProjectCard';
```

Replace it with an import that adds the icons + type:

```ts
import { Project } from '@/components/ui/ProjectCard';
import {
  Shield,
  Server,
  ShoppingCart,
  GraduationCap,
  Gamepad2,
  Cpu,
  Palette,
  Sparkles,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
```

Then at the END of the file (after the closing `];` of `PROJECTS_DATA`), append:

```ts

/** متادیتای دستهٔ پروژه‌ها: رنگ «r, g, b» و آیکن نماینده — هم‌سبک با ابزارها. */
export interface ProjectCategoryMeta {
  color: string;
  icon: LucideIcon;
}

export const PROJECT_CATEGORY_META: Record<string, ProjectCategoryMeta> = {
  'امنیت سایبری': { color: '245, 158, 11', icon: Shield },
  'زیرساخت و SaaS': { color: '34, 197, 94', icon: Server },
  'تجارت الکترونیک': { color: '14, 165, 233', icon: ShoppingCart },
  'آموزش': { color: '124, 58, 237', icon: GraduationCap },
  'بازی و سرگرمی': { color: '120, 113, 40', icon: Gamepad2 },
  'هوش مصنوعی': { color: '168, 85, 247', icon: Cpu },
  'برند و طراحی': { color: '225, 29, 72', icon: Palette },
  'پلتفرم هوشمند': { color: '20, 130, 90', icon: Sparkles },
};

const PROJECT_FALLBACK_META: ProjectCategoryMeta = { color: '120, 120, 130', icon: Wrench };

/** متادیتای دستهٔ پروژه را با مقدار پیش‌فرض امن برمی‌گرداند. */
export const getProjectCategoryMeta = (category: string): ProjectCategoryMeta =>
  PROJECT_CATEGORY_META[category] ?? PROJECT_FALLBACK_META;
```

- [ ] **Step 3: Lint**

Run: `cd frontend && npm run lint`
Expected: PASS (0 errors).

- [ ] **Step 4: Verify every project category has meta (no orphans)**

Run:
```bash
cd frontend && node -e "
const src = require('fs').readFileSync('src/lib/data/projects.ts','utf8');
const cats = [...src.matchAll(/category:\s*'([^']+)'/g)].map(m=>m[1]);
const metaBlock = src.split('PROJECT_CATEGORY_META')[1];
const missing = [...new Set(cats)].filter(c => !metaBlock.includes(\"'\"+c+\"'\"));
console.log('categories:', [...new Set(cats)].length, 'missing meta:', missing);
"
```
Expected: `missing meta: []` (8 unique categories, all present).

#### 7B — Colored/iconed filter chips on `/projects`

- [ ] **Step 5: Wire `ProjectsGrid` chips to the new meta**

In `frontend/src/components/projects/ProjectsGrid.tsx`, update the imports near the top:

```ts
import { PROJECTS_DATA } from '@/lib/data/projects';
```

to:

```ts
import { PROJECTS_DATA, getProjectCategoryMeta } from '@/lib/data/projects';
```

Then find the filter-chip button (the `categories.map((cat) => { ... })` block, ~lines 51-69) and replace it so non-«همه» chips carry their category color + dot, mirroring `ToolsClient.tsx`:

```jsx
      {categories.map((cat) => {
       const isActive = cat === activeCategory;
       const color = cat === ALL_FILTER ? null : getProjectCategoryMeta(cat).color;
       return (
        <button
         key={cat}
         type="button"
         onClick={() => setActiveCategory(cat)}
         aria-pressed={isActive}
         data-test="project-filter"
         className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-display transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 min-h-[44px] ${
          isActive
           ? color
             ? 'text-white border-transparent'
             : 'border-primary/50 bg-primary/10 text-primary'
           : 'border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-primary/30'
         }`}
         style={color && isActive ? { backgroundColor: `rgb(${color})` } : undefined}
        >
         {color && (
          <span
           className="h-1.5 w-1.5 rounded-full"
           style={{ backgroundColor: isActive ? '#fff' : `rgb(${color})` }}
           aria-hidden
          />
         )}
         {cat}
        </button>
       );
      })}
```

- [ ] **Step 6: Lint**

Run: `cd frontend && npm run lint`
Expected: PASS (0 errors).

#### 7C — Expand the tool categories (split «کمکی»)

- [ ] **Step 7: Retag the affected tools in `tools.ts`**

In `frontend/src/lib/data/tools.ts`, change these tools' `category` values (find each by `slug`):

| slug | old | new |
|---|---|---|
| `spin-win` | `'کمکی'` | `'سرگرمی'` |
| `mohasebe-darsad` | `'کمکی'` | `'مبدل و محاسبه'` |
| `adad-be-horoof` | `'کمکی'` | `'متن و محتوا'` |
| `shomaresh-kalamat` | `'کمکی'` | `'متن و محتوا'` |
| `tabdil-vahed` | `'کمکی'` | `'مبدل و محاسبه'` |

After this, no tool has `category: 'کمکی'`.

- [ ] **Step 8: Add the two new categories to `CATEGORY_META`**

In `frontend/src/lib/data/tools.ts`, find `CATEGORY_META` (~lines 223-229):

```ts
export const CATEGORY_META: Record<string, CategoryMeta> = {
  حقوقی: { color: '99, 102, 241', icon: Scale }, // indigo
  املاک: { color: '13, 148, 136', icon: Building2 }, // teal
  مالی: { color: '217, 119, 6', icon: Wallet }, // amber
  سرگرمی: { color: '244, 63, 94', icon: Gamepad2 }, // rose
  کمکی: { color: '139, 92, 246', icon: Wrench }, // violet
};
```

Replace the `کمکی` line with the two new categories:

```ts
export const CATEGORY_META: Record<string, CategoryMeta> = {
  حقوقی: { color: '99, 102, 241', icon: Scale }, // indigo
  املاک: { color: '13, 148, 136', icon: Building2 }, // teal
  مالی: { color: '217, 119, 6', icon: Wallet }, // amber
  سرگرمی: { color: '244, 63, 94', icon: Gamepad2 }, // rose
  'متن و محتوا': { color: '139, 92, 246', icon: FileText }, // violet
  'مبدل و محاسبه': { color: '99, 102, 241', icon: ArrowRightLeft }, // indigo-blue
};
```

(`FileText` and `ArrowRightLeft` are already imported at the top of `tools.ts`.)

- [ ] **Step 9: Lint**

Run: `cd frontend && npm run lint`
Expected: PASS (0 errors).

- [ ] **Step 10: Verify no tool is left in «کمکی» and all tool categories have meta**

Run:
```bash
cd frontend && node -e "
const src = require('fs').readFileSync('src/lib/data/tools.ts','utf8');
const block = src.split('export const TOOLS')[1].split('CategoryMeta')[0];
const cats = [...block.matchAll(/category:\s*'([^']+)'/g)].map(m=>m[1]);
const meta = src.split('CATEGORY_META')[2] || src.split('CATEGORY_META')[1];
const uniq = [...new Set(cats)];
console.log('komaki left:', cats.filter(c=>c==='کمکی').length);
console.log('missing meta:', uniq.filter(c=>!meta.includes(\"'\"+c+\"'\") && !meta.includes(c+':')));
"
```
Expected: `komaki left: 0` and `missing meta: []`.

- [ ] **Step 11: Commit**

```bash
cd /Users/babakbaghaei/Desktop/Projects/baghaei.com
git add frontend/src/lib/data/projects.ts frontend/src/components/projects/ProjectsGrid.tsx frontend/src/lib/data/tools.ts
git commit -m "feat(taxonomy): unify project categories + expand tool categories

Projects collapse from 14 free-form labels to 8 colored/iconed categories
with PROJECT_CATEGORY_META + colored filter chips on /projects. Tools split
the catch-all 'کمکی' into 'متن و محتوا' and 'مبدل و محاسبه', moving spin-win
to 'سرگرمی'.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Full build gate + incidental-fix sweep

**Files:**
- Possibly modify: any file from Tasks 1-7 if the build surfaces an error or an obvious local nit.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: a clean production build ready to deploy.

- [ ] **Step 1: Production build**

Run: `cd frontend && npm run build`
Expected: build completes with no errors; `/projects`, `/tools`, and `/` compile. (Webpack build; the project sets `output: standalone`.)

- [ ] **Step 2: If the build fails, fix locally and re-run**

Address only errors introduced by Tasks 1-7 (type mismatch, bad import, missing icon). Re-run `npm run build` until green. If an error reveals a needed change outside the touched files, pause and confirm with the user before expanding scope.

- [ ] **Step 3: Incidental-fix sweep (small + local only)**

Re-read the diff (`git diff main...ui-polish-all-pages -- frontend/`) for obvious local nits in touched files (a stray className, an RTL/spacing slip, a dangling `featured: true` on a now-locked tool). The two locked tools (Task 6) still carry no `featured` (it was dropped) — that's intended. Fix only trivial, local issues; anything larger → ask first.

- [ ] **Step 4: Commit any build/incidental fixes**

Only if Steps 2-3 changed files:

```bash
cd /Users/babakbaghaei/Desktop/Projects/baghaei.com
git add -A frontend/
git commit -m "fix: build gate + incidental polish nits

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 5: Push the branch**

```bash
cd /Users/babakbaghaei/Desktop/Projects/baghaei.com
git push origin ui-polish-all-pages
```

Expected: branch pushed (so the server can fetch it in Task 9).

---

### Task 9: Manual SSH deploy + live test

**Files:** none (operational). Runs against the live VPS.

**Interfaces:**
- Consumes: pushed `ui-polish-all-pages` branch.
- Produces: the live site reflecting all changes.

**Context:** Credentials provided by the user out-of-band — host `ubuntu@2a0f:94c0:201:1::11f`. Memory says production is the VPS `185.204.170.101` with push-to-`main` auto-deploy, 1GB RAM + swap, Prisma 7 quirks. This is a manual BRANCH deploy, so do it explicitly; do not rely on the main poller. The user must run interactive SSH/login steps themselves (suggest `! <command>` in the session for anything needing the password).

- [ ] **Step 1: Confirm host identity**

Connect and verify this host is the known production VPS before touching anything:
```bash
ssh ubuntu@2a0f:94c0:201:1::11f 'hostname; curl -s -4 ifconfig.me; echo; docker compose ls 2>/dev/null || docker ps --format "table {{.Names}}\t{{.Status}}"'
```
Expected: the public IP resolves to `185.204.170.101` (or the running stack/domain clearly matches baghaei.com). If it does NOT match, STOP and confirm with the user.

- [ ] **Step 2: Locate the repo + current branch on the server**

```bash
ssh ubuntu@2a0f:94c0:201:1::11f 'cd <repo path> && git remote -v && git branch --show-current && git status --short'
```
Identify the deploy directory (the one with `docker-compose.yml`). Note the current branch so it can be restored if needed.

- [ ] **Step 3: Fetch + check out the polish branch**

```bash
ssh ubuntu@2a0f:94c0:201:1::11f 'cd <repo path> && git fetch origin && git checkout ui-polish-all-pages && git pull origin ui-polish-all-pages && git log --oneline -1'
```
Expected: HEAD matches the latest local commit from Task 8.

- [ ] **Step 4: Rebuild + restart the frontend (mind 1GB RAM)**

Frontend-only change, so rebuild just the frontend service to limit memory pressure:
```bash
ssh ubuntu@2a0f:94c0:201:1::11f 'cd <repo path> && docker compose up -d --build frontend'
```
If the box uses the prebuilt-image flow (Phase 8) instead of on-VPS build, use the project's normal deploy entrypoint. No migration is expected (frontend-only); skip `prisma migrate deploy` unless the deploy script runs it automatically.

- [ ] **Step 5: Wait for healthy + check logs**

```bash
ssh ubuntu@2a0f:94c0:201:1::11f 'cd <repo path> && docker compose ps && docker compose logs --tail=40 frontend'
```
Expected: frontend container `Up`/healthy, no crash loop, no build error in the tail.

- [ ] **Step 6: Live visual test (against the public site)**

Verify on the live domain (desktop + a mobile-width check):
1. **Planets/Moon** render and positions/phase look correct for today (this is the deploy that makes the live build current).
2. **Project cards** are grayscale until hover on desktop, color on hover; white titles crisp; full color on mobile.
3. **Projects spacing**: heading→first-card gap matches the «اعتماد» rhythm (re-tune `pt-[..vh]` from Task 2 only if clearly off).
4. **5 publishing projects** (fids, keyvany, malata, darso, royal) show «در حال انتشار» pill on the card and the publishing state in the modal (malata = no-image publishing placeholder).
5. **2 locked tools**: «خسارت تأخیر» shows «در انتظار تأیید بانک مرکزی»; «عیدی و سنوات» shows «در انتظار اعلام قانون کار»; both non-clickable + dimmed; neither in homepage featured strip.
6. **/projects** shows ~8 colored/iconed filter chips that filter correctly.
7. **/tools** shows the expanded categories; no «کمکی»; «متن و محتوا» + «مبدل و محاسبه» present; every tool grouped sensibly.
8. No console errors; no broken layout.

- [ ] **Step 7: Report results**

Summarize what passed/failed on the live site. If anything failed, fix locally → re-run Task 8 build → re-push → repeat Steps 3-6. Report the final state plainly (what's verified, what's outstanding).

---

## Notes on verification approach

This plan verifies via `npm run lint` (per task) and one `npm run build` (Task 8) plus an explicit manual visual checklist, rather than automated unit tests. Rationale: every change is presentational or static-data; the repo's only test harnesses are backend Jest and frontend Playwright e2e (which need a running stack and are out of scope for these visual tweaks). Fabricating unit tests for JSX/className changes would be low-value and brittle. The live test in Task 9 is the real acceptance gate, consistent with the spec.
