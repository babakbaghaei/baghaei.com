# Phase 2 — Responsive & Mobile Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop the UI inflating on large screens (16" MacBook fullscreen) so card text no longer overflows, and make mobile typography + tap targets readable and touch-friendly.

**Architecture:** Flatten the viewport-driven root `font-size` clamp so `rem`-based sizing stays near-constant across screen widths; convert fixed-pixel card *heights* to min-heights so content can grow; enforce a 44px touch-target floor and a 12px readable-text floor on user-facing/interactive elements. Wide screens are filled with more grid columns + container caps, not larger type.

**Tech Stack:** Next.js 16 (App Router, RTL, `--webpack`), React 19, Tailwind CSS, Playwright (frontend e2e).

## Global Constraints

- Frontend is `strict: false` and `no-explicit-any` is off — match existing loose typing; do not introduce strict types unprompted.
- Frontend has NO unit-test runner. Verify via `cd frontend && npm run build` + Playwright. **The Playwright viewport tests in this plan need ONLY the frontend dev server — do NOT set `E2E_BACKEND` (no backend required).**
- Keep RTL (`dir="rtl"`) and Persian copy intact. Use Tailwind logical properties (`ps-`/`pe-`/`ms-`/`me-`/`start`/`end`) — never introduce hard `left`/`right` that breaks RTL.
- Theme is forced dark; colors are HSL CSS variables in `globals.css`. Do not hardcode colors.
- Interactive 3D cards must keep building on `Card.tsx` physics — do not break the tilt/perspective behavior.
- **Touch-target floor = 44px. Use absolute `min-h-[44px]` (NOT `min-h-11`).** Rationale: after Task 1 the root font floors at 15px, so the rem-based `min-h-11` (2.75rem) computes to only ~41px on mobile — below 44px. Absolute px is required to guarantee the target.
- **Readable-text floor = 12px** for user-facing/interactive text. `text-xs` (0.75rem) is acceptable as the minimum; do not go below it for visible labels.
- **New root font clamp value, EXACTLY:** `clamp(15px, 0.2vw + 14px, 16.5px)`.
- **SCOPE BOUNDARY — Phase 4 owns `ProjectCard.tsx` visual/layout redesign + project images.** In Phase 2, touch `ProjectCard.tsx` ONLY for className-level text-size bumps (sub-12px → `text-xs`). Do NOT restructure its markup, images, or layout here.

---

### Task 1: Flatten the root font-size clamp

**Root cause:** `globals.css:122` sets `html { font-size: clamp(14px, 1.1vw, 18px); }`. The `1.1vw` term hits the 18px ceiling at ~1636px viewport width, so on a 1728px 16" MacBook fullscreen the root is maxed at 18px — every `rem` is ~12.5% larger than designed, inflating the whole UI and overflowing fixed-size cards. On narrow screens the same rule floors at 14px (smaller than the 16px default), shrinking mobile text.

**Files:**
- Modify: `frontend/src/app/globals.css` (the `html { font-size: clamp(...) }` declaration, ~line 122)
- Test: `frontend/tests/responsive-root-font.spec.ts`

**Interfaces:**
- Produces: a root `font-size` that is `15px` on narrow screens, scales gently, and caps at `16.5px` on wide screens.

- [ ] **Step 1: Write the failing Playwright test**

Create `frontend/tests/responsive-root-font.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

// Root font must not inflate on a 16" MacBook fullscreen (~1728px) and must
// stay readable on mobile. These bounds match the clamp(15px, 0.2vw + 14px, 16.5px).
test('root font-size is capped on very wide screens', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 1080 });
  await page.goto('/');
  const fs = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.documentElement).fontSize),
  );
  expect(fs).toBeLessThanOrEqual(16.5);
});

test('root font-size stays readable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const fs = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.documentElement).fontSize),
  );
  expect(fs).toBeGreaterThanOrEqual(15);
});
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `cd frontend && npx playwright test tests/responsive-root-font.spec.ts`
Expected: the wide-screen test FAILS (current root is 18px > 16.5px). (The mobile test may already pass at 14px? No — 14 < 15, so it also FAILS.) Both fail against the current clamp.

- [ ] **Step 3: Replace the clamp**

In `frontend/src/app/globals.css`, locate the declaration containing `clamp(14px, 1.1vw, 18px)` (inside the `html { … }` rule) and replace ONLY that declaration:
```css
  font-size: clamp(15px, 0.2vw + 14px, 16.5px);
```
Leave every other property in the `html` rule unchanged.

- [ ] **Step 4: Run the test to confirm it passes**

Run: `cd frontend && npx playwright test tests/responsive-root-font.spec.ts`
Expected: PASS (2/2). Wide root ≤ 16.5px, mobile root ≥ 15px.

- [ ] **Step 5: Build**

Run: `cd frontend && npm run build`
Expected: compiles, no errors.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/app/globals.css frontend/tests/responsive-root-font.spec.ts
git commit -m "fix(responsive): flatten root font clamp (no 16in bloat, readable mobile floor)"
```

---

### Task 2: Fluid card containers (fix overflow)

**Root cause:** card shells lock a fixed pixel *height* while their text can grow, so on large screens (and with longer Persian copy) the text overflows / collides with `line-clamp`. `Projects.tsx:202` (home slider card) and `:217` (tool column) use `h-[360px] md:h-[380px]`; `ProjectsGrid.tsx:96` uses `max-w-[320px] h-[360px] md:h-[380px]`.

**Files:**
- Modify: `frontend/src/components/home/Projects.tsx` (~lines 202, 217)
- Modify: `frontend/src/components/projects/ProjectsGrid.tsx` (~line 96, and the grid-columns container)

**Interfaces:**
- Consumes: the flattened root font from Task 1 (less inflation to absorb).
- Produces: cards whose height grows with content (`min-h-*` instead of `h-*`), and a projects grid that uses a 4th column at `2xl`.

- [ ] **Step 1: Slider — convert fixed heights to min-heights**

In `frontend/src/components/home/Projects.tsx`, find the project slider card wrapper (~line 202) with `h-[360px] md:h-[380px]` and the tool-column wrapper (~line 217) with the same. Change BOTH occurrences of the height classes from fixed to min-height, preserving the widths and everything else:
- `h-[360px] md:h-[380px]` → `min-h-[360px] md:min-h-[380px]`

(There are two occurrences — update both. Locate by the surrounding `w-[280px] md:w-[320px]` / `w-[210px] md:w-[240px]` widths shown in context. Do NOT change the widths — the horizontal slider relies on them.)

- [ ] **Step 2: Grid card — allow growth + responsive width**

In `frontend/src/components/projects/ProjectsGrid.tsx` (~line 96), find the card wrapper `max-w-[320px] h-[360px] md:h-[380px]` and replace the sizing with growth-friendly classes:
- `max-w-[320px] h-[360px] md:h-[380px]` → `w-full max-w-[360px] min-h-[360px] md:min-h-[380px]`

- [ ] **Step 3: Grid — add a 4th column on very wide screens**

In the same file, locate the grid container that holds the cards (the element with `grid` + `grid-cols-…` classes, e.g. `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`). Append a `2xl:grid-cols-4` to that class list so the extra width on a 16" display is filled with columns rather than oversized cards. (Read the current class to extend it exactly; if it already has a `2xl:` column, leave it.)

- [ ] **Step 4: Build**

Run: `cd frontend && npm run build`
Expected: compiles, no errors.

- [ ] **Step 5: Visual check (dark mode forced)**

Open `/` (home slider) and `/projects` (grid) via `npm run dev`. Confirm: card text (title + description) is fully visible — no clipped/overflowing text — at a wide window AND at mobile width; cards grow taller for longer copy instead of clipping; the glassmorphism/tilt still works. If you cannot open a browser here, rely on the build + the class changes and note the visual check as "not run (no browser)".

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/home/Projects.tsx frontend/src/components/projects/ProjectsGrid.tsx
git commit -m "fix(responsive): fluid card heights + 2xl grid column (no text overflow)"
```

---

### Task 3: 44px touch targets

**Root cause:** several interactive controls are below the 44px WCAG touch target — worst on mobile where the root font is small. Offenders: `Button.tsx` `sm` (`px-4 py-2 text-xs` ≈ 32px) and `default` (`px-8 py-3 text-sm` ≈ 40px) variants; `Navbar.tsx` search button (`h-9` = 36px); `ProjectsGrid.tsx:59` filter chips (`px-4 py-1.5 text-xs` ≈ 30px); `MobileMenu.tsx` close button (no explicit min size).

**Files:**
- Modify: `frontend/src/components/ui/Button.tsx` (`sm` + `default` size variants)
- Modify: `frontend/src/components/layout/Navbar.tsx` (search button)
- Modify: `frontend/src/components/projects/ProjectsGrid.tsx` (filter chips, ~line 59)
- Modify: `frontend/src/components/ui/MobileMenu.tsx` (close button, ~line 108)
- Test: `frontend/tests/touch-targets.spec.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: interactive controls with a guaranteed ≥44px tap height via absolute `min-h-[44px]`.

- [ ] **Step 1: Write the failing Playwright test**

Create `frontend/tests/touch-targets.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

// WCAG 2.5.5: interactive controls should be at least 44x44 CSS px.
// Checked at a phone viewport where the root font (and thus rem sizing) is smallest.
test('projects filter chips meet the 44px touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/projects');
  const chips = page.locator('[data-test="project-filter"]');
  const n = await chips.count();
  expect(n).toBeGreaterThan(0);
  for (let i = 0; i < n; i++) {
    const box = await chips.nth(i).boundingBox();
    expect(box, `chip ${i} has a box`).not.toBeNull();
    expect(box!.height, `chip ${i} height`).toBeGreaterThanOrEqual(44);
  }
});
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `cd frontend && npx playwright test tests/touch-targets.spec.ts`
Expected: FAIL — either the `[data-test="project-filter"]` selector matches nothing yet (add it in Step 4) or the chip height is < 44px. (If it fails on the missing selector, that is expected; Step 4 adds it.)

- [ ] **Step 3: Button component — floor both common variants at 44px**

In `frontend/src/components/ui/Button.tsx`, add `min-h-[44px]` (and keep existing classes) to the `sm` and `default` size variants. For example if the size map reads:
```ts
  sm: 'px-4 py-2 text-xs',
  default: 'px-8 py-3 text-sm',
```
change to:
```ts
  sm: 'px-4 py-2 text-xs min-h-[44px]',
  default: 'px-8 py-3 text-sm min-h-[44px]',
```
(Leave `lg` as-is — already ≥44px. Match the exact variable/object name used in the file.)

- [ ] **Step 4: Navbar search button + filter chips data hook**

In `frontend/src/components/layout/Navbar.tsx`, find the search button (`h-9 px-2.5`, ~line 148) and replace `h-9` with `min-h-[44px]` (keep the rest; if it relies on `h-9` for width too, add `min-w-[44px]`).

In `frontend/src/components/projects/ProjectsGrid.tsx` (~line 59), the filter chip `<button>`: add `min-h-[44px]` to its className AND add a test hook attribute `data-test="project-filter"` so the e2e can target it.

- [ ] **Step 5: MobileMenu close button**

In `frontend/src/components/ui/MobileMenu.tsx` (~line 108), the close/back `<button>`: add `min-h-[44px] min-w-[44px] inline-flex items-center justify-center` to guarantee a full-size tap target (keep existing positioning classes).

- [ ] **Step 6: Run the test to confirm it passes**

Run: `cd frontend && npx playwright test tests/touch-targets.spec.ts`
Expected: PASS — every project filter chip is ≥44px tall at the 390px viewport.

- [ ] **Step 7: Build**

Run: `cd frontend && npm run build`
Expected: compiles, no errors.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/components/ui/Button.tsx frontend/src/components/layout/Navbar.tsx frontend/src/components/projects/ProjectsGrid.tsx frontend/src/components/ui/MobileMenu.tsx frontend/tests/touch-targets.spec.ts
git commit -m "fix(a11y): 44px touch targets on buttons, search, filter chips, mobile close"
```

---

### Task 4: Minimum readable text (≥12px)

**Root cause:** decorative-but-visible micro-text uses fixed sub-12px sizes — unreadable on mobile. Confirmed offenders: `ProjectCard.tsx:139` tech-stack tags `text-[9px]` and `:113` role badge `text-[10px]`. Others of the form `text-[9px]`/`text-[10px]` may exist elsewhere.

**Files:**
- Modify: `frontend/src/components/ui/ProjectCard.tsx` (~lines 113, 139 — className text-size ONLY; no structural change, per the Phase 4 scope boundary)
- Modify: any other files surfaced by the grep in Step 1 that render user-facing sub-12px text

- [ ] **Step 1: Enumerate sub-12px user-facing text**

Run: `cd frontend && grep -rnE "text-\[(9|10|11)px\]" src` 
This lists every fixed sub-12px text class. Treat each hit as in-scope UNLESS it is on `sr-only`/visually-hidden or purely-icon content. Record the list for your report.

- [ ] **Step 2: Bump the known ProjectCard offenders**

In `frontend/src/components/ui/ProjectCard.tsx`:
- the role badge (~line 113): `text-[10px]` → `text-xs`
- the tech-stack tags (~line 139): `text-[9px]` → `text-xs`

Change ONLY the text-size token (leave padding/structure/colors as-is).

- [ ] **Step 3: Bump remaining user-facing offenders**

For each remaining hit from Step 1 that renders visible text (not `sr-only`/icon-only), replace its `text-[9px]` / `text-[10px]` / `text-[11px]` token with `text-xs`. Do not alter layout or copy. (If a hit is genuinely decorative and intentionally tiny — e.g. a chart axis tick — and bumping it breaks layout, leave it and note why in your report.)

- [ ] **Step 4: Build**

Run: `cd frontend && npm run build`
Expected: compiles, no errors.

- [ ] **Step 5: Verify no user-facing sub-12px text remains**

Run: `cd frontend && grep -rnE "text-\[(9|10|11)px\]" src`
Expected: remaining hits are only `sr-only`/icon/decorative cases you justified in your report (ideally none).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "fix(responsive): lift sub-12px UI text to readable minimum"
```

---

## Self-Review

**Spec coverage (Phase 2 items):**
- #4 16" fullscreen bloat + card text overflow → Task 1 (flatten root clamp) + Task 2 (min-height cards, 2xl column). ✓
- #5 mobile font / button / touch not user-friendly → Task 3 (44px targets) + Task 4 (≥12px text) + Task 1 (mobile root floor lifted 14→15px). ✓
- Acceptance "no interactive control below 44px" → Task 3 + its Playwright assertion. ✓
- Acceptance "no body/label text below 12px" → Task 4 + its grep gate (ProjectCard internals are className-only per the Phase 4 boundary). ✓
- Acceptance "card text fully visible at fullscreen on 16" display" → Task 1 (less inflation) + Task 2 (min-height). ✓

**Placeholder scan:** none — every code step shows complete content; verification commands have expected output. The two "grep then bump" steps (Task 4) give the exact pattern + the known concrete edits + an explicit rule for the remainder, and a grep gate to confirm.

**Type consistency:** `min-h-[44px]` (absolute) is used consistently for every touch target (Task 3) — deliberately NOT `min-h-11`, per Global Constraints (rem floors at ~41px after Task 1). `text-xs` is the single readable-text floor token (Task 4). The new clamp value `clamp(15px, 0.2vw + 14px, 16.5px)` matches the Task 1 test bounds (≤16.5 wide, ≥15 mobile). The `data-test="project-filter"` hook is added in Task 3 Step 4 and consumed by the Task 3 Step 1 test — consistent.

**Note for executor:** Tasks 1 and 3 ship Playwright viewport tests that need ONLY the frontend dev server (no backend, no `E2E_BACKEND`). Tasks 2 and 4 are verified by build + grep gate + visual reasoning. ProjectCard internal redesign is Phase 4 — keep Phase 2 edits to it className-only.
