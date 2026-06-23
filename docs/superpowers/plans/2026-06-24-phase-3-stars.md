# Phase 3 — Stars on All Pages + Scroll-Reactive Starfield Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (or inline executing-plans). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the signature starfield visible on every route (not just home) and give it solartoscale.com-style scroll reactivity (calm dots at rest, depth + motion on scroll).

**Architecture:** The starfield is already globally mounted — `frontend/src/app/layout.tsx:193` renders `<GlobalUniverse renderBackground />` inside a `fixed inset-0 z-[-2]` wrapper on all routes, which returns only the `GalaxyBackground` canvas. Two problems: (1) several page/layout wrappers set an opaque `bg-background`, painting over the `z-[-2]` field so stars vanish on those routes; (2) the canvas only does mild vertical parallax (`yPos = (s.y + sp*1000*s.parallax) % height`), so scrolling barely registers. Fix = make page wrappers transparent (the html `bg-background` at `layout.tsx:122` stays as the dark backdrop), then amplify the draw loop with scroll-velocity streaking + deeper parallax.

**Tech Stack:** Next.js 16 App Router, React 19, framer-motion `useScroll`, HTML5 canvas 2D, Tailwind, Playwright (viewport-only, NO backend).

## Global Constraints

- Theme forced dark; stars white at low opacity (0.08–0.4 ceiling) — readability behind Persian copy is non-negotiable. The amplification must stay calm/legible AT REST.
- Respect `prefers-reduced-motion`: the existing reduced-motion branch (static single frame, no rAF) must remain — no scroll streaking under reduced motion.
- Do NOT restart the rAF loop on scroll. `scrollRef` pattern (line 175-176) exists precisely so scroll updates never tear down the loop. Keep reading scroll from the ref inside `draw`.
- Do NOT touch the html `bg-background` (`layout.tsx:122`) — it is the backdrop the stars sit against. Do NOT add stars to `admin/*` (opaque by design).
- The fixed background wrapper must stay `pointer-events-none` and behind content (`z-[-2]`). Never raise stars above page content.
- RTL preserved. Frontend `strict:false` / `no-explicit-any` off — match loose typing.

---

### Task 1: Stars visible on all routes (transparent page wrappers + regression test)

**Files:**
- Modify: `frontend/src/app/projects/page.tsx:15` — `min-h-screen bg-background` → `min-h-screen` (drop opaque bg)
- Modify: `frontend/src/app/projects/[slug]/page.tsx:89` — `min-h-screen bg-background text-foreground` → `min-h-screen text-foreground`
- Modify: `frontend/src/app/careers/page.tsx:15` — `min-h-screen bg-background` → `min-h-screen`
- Modify: `frontend/src/app/blog/page.tsx:25` — drop `bg-background` (keep `text-foreground relative overflow-hidden flex flex-col`)
- Modify: `frontend/src/app/blog/[slug]/page.tsx:100` — drop `bg-background` (keep the rest)
- Modify: `frontend/src/app/about/layout.tsx:19` — `min-h-screen bg-background flex flex-col` → `min-h-screen flex flex-col`
- Modify: `frontend/src/app/tools/layout.tsx:11` — `min-h-screen bg-background flex flex-col` → `min-h-screen flex flex-col`
- Test: `frontend/tests/stars-all-pages.spec.ts` (new, viewport-only)

**Interfaces:**
- Consumes: the global `<GlobalUniverse renderBackground />` canvas already in `layout.tsx:193` (a single `<canvas>` element, `pointer-events-none`, fixed `z-[-2]`).
- Produces: nothing for later tasks — purely a visibility fix. Task 2 amplifies the same canvas independently.

**Do NOT touch (intentionally opaque):** `layout.tsx:122` (html backdrop), all `admin/*`, form inputs (`bg-background` on `<input>`), and translucent overlays (`bg-background/40`, `/70`, `/95`, `bg-card/20`, `bg-card/40`) — those are content surfaces, not the page backdrop.

- [ ] **Step 1: Write the failing test**

```ts
// frontend/tests/stars-all-pages.spec.ts
import { test, expect } from '@playwright/test';

// The starfield is globally mounted at z-[-2]; these routes previously hid it
// behind an opaque `bg-background` page wrapper. Guard that (a) the global
// canvas is present and (b) the top-level wrapper is no longer opaque.
const ROUTES = ['/', '/projects', '/blog', '/careers', '/about', '/tools'];

for (const route of ROUTES) {
  test(`starfield canvas is present and unoccluded on ${route}`, async ({ page }) => {
    await page.goto(route);
    // The fixed background wrapper holds the GalaxyBackground canvas.
    const bgCanvas = page.locator('div.fixed.inset-0.\\[\\&\\]\\:z-\\[-2\\], div.fixed.inset-0 canvas').first();
    await expect(bgCanvas).toBeAttached();
    // No top-level <main>/<div> should reintroduce the opaque page backdrop.
    const opaqueWrapper = page.locator('main.bg-background, body > div > div.min-h-screen.bg-background');
    await expect(opaqueWrapper).toHaveCount(0);
  });
}
```

- [ ] **Step 2: Run test to verify it fails (RED)**

Run: `cd frontend && npx playwright test tests/stars-all-pages.spec.ts --project=chromium`
Expected: FAIL on `/projects`, `/blog`, `/careers`, `/about`, `/tools` (opaque wrapper count > 0). Requires only the frontend dev server (NO `E2E_BACKEND`).

- [ ] **Step 3: Make wrappers transparent**

Apply the 7 edits listed in **Files** — remove the `bg-background` token from each top-level page/layout wrapper, leaving every other class intact. The dark backdrop now comes from the html element; the `z-[-2]` starfield shows through.

- [ ] **Step 4: Run test to verify it passes (GREEN)**

Run: `cd frontend && npx playwright test tests/stars-all-pages.spec.ts --project=chromium`
Expected: PASS for all 6 routes.

- [ ] **Step 5: Browser visual check (manual, controller)**

Dev server + Chrome DevTools MCP: navigate `/projects`, `/blog`, `/careers`; confirm stars are faintly visible behind content and text is still readable (no noise). If any page reads too busy, dim via the existing opacity ceiling in Task 2 — do not re-add an opaque wrapper.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/app frontend/tests/stars-all-pages.spec.ts
git commit -m "feat(ui): show global starfield on all routes (transparent page wrappers)"
```

---

### Task 2: Scroll-reactive starfield (velocity streaking + deeper parallax)

**Files:**
- Modify: `frontend/src/components/effects/GlobalUniverse.tsx:168-304` — the `GalaxyBackground` component's `draw` loop and star model.

**Interfaces:**
- Consumes: `scrollProgress` prop (0→1, already wired from `useScroll().scrollYProgress` via `layout.tsx` mount) read through `scrollRef.current` (line 175-176). The per-star fields `{ x, y, size, opacity, parallax, twinkle }` (line 184-193).
- Produces: no external API change — same `<canvas>`, same props. Purely internal render upgrade.

**Design (solartoscale feel — motion on scroll, calm at rest):**
1. **Scroll velocity** — track previous scroll value in a ref; per frame compute smoothed `vel = lerp(vel, current - prev, 0.15)`. At rest `vel→0`.
2. **Velocity streaks** — when `|vel|` is non-trivial, draw each star as a short vertical trail (line) whose length ∝ `|vel| * s.parallax`; at rest fall back to the current dot (`arc`). Clamp trail length so fast flings don't smear the whole screen.
3. **Deeper parallax** — widen the parallax drift so layering reads as real depth (multiplier `1000` → `1600`); keep modulo wrap.
4. **Velocity brightness** — nudge opacity up slightly with `|vel|` (capped) so the field "wakes up" on scroll, settling back when idle.
- Reduced motion: the existing `prefersReducedMotion` branch already returns a single static frame with no rAF — leave it; streaks/velocity only run in the animated path.
- Performance: still one path op per star, no loop restart, no per-frame canvas resize. `vel` lives in a ref.

- [ ] **Step 1: Add velocity tracking refs (above the `useEffect`, near line 176)**

```tsx
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;
  // Smoothed scroll velocity (per-frame delta of scrollProgress). Lives in a
  // ref so it never restarts the rAF loop. Drives streak length + brightness.
  const velRef = useRef(0);
  const prevScrollRef = useRef(scrollProgress);
```

- [ ] **Step 2: Rewrite the `draw` loop (replace lines 224-244)**

```tsx
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = resolvedTheme === 'dark';
      const starColor = isDark ? '255, 255, 255' : '0, 0, 0';
      // Black stars on a white page read as noise, so dim them heavily in light mode.
      const themeOpacityFactor = isDark ? 1 : 0.3;
      const sp = scrollRef.current;
      const now = Date.now();

      // Smooth the scroll velocity toward the latest per-frame delta. At rest
      // this decays to ~0 (calm dots); during a scroll it spikes (streaks).
      const rawVel = sp - prevScrollRef.current;
      prevScrollRef.current = sp;
      velRef.current = velRef.current + (rawVel - velRef.current) * 0.15;
      const speed = Math.min(Math.abs(velRef.current) * 60, 1); // 0..1 normalised
      const dir = velRef.current >= 0 ? 1 : -1;

      starsRef.current?.forEach(s => {
        const xPos = s.x % width;
        // Deeper parallax travel for a stronger sense of depth on scroll.
        const yPos = (s.y + sp * 1600 * s.parallax) % height;
        const twinkle = prefersReducedMotion
          ? 1
          : 0.7 + Math.sin((now * 0.002 * s.twinkle) + s.x) * 0.3;
        // Scroll "wakes" the field: a capped brightness lift while moving.
        const alpha = Math.min(
          s.opacity * twinkle * themeOpacityFactor * (1 + speed * 0.6),
          0.55
        );

        // Trail length scales with scroll speed and the star's parallax depth.
        const streak = speed * s.parallax * 260;
        if (streak > 1.2) {
          ctx.strokeStyle = `rgba(${starColor}, ${alpha})`;
          ctx.lineWidth = s.size;
          ctx.beginPath();
          ctx.moveTo(xPos, yPos);
          ctx.lineTo(xPos, yPos - dir * streak);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${starColor}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(xPos, yPos, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };
```

- [ ] **Step 3: Build check**

Run: `cd frontend && npm run build`
Expected: build succeeds (standalone output). Fix any type/lint error before proceeding.

- [ ] **Step 4: Browser visual tuning (controller, Chrome DevTools MCP)**

Dev server up; on `/` scroll slowly then fling. Confirm: at rest = calm dots (unchanged readability); on scroll = short upward/downward streaks + subtle brightening that decay to dots when scrolling stops. Tune the three magic numbers (`1600` parallax, `260` streak, `0.6` brightness lift / `0.55` cap) live until it reads like solartoscale depth without smearing behind text. Verify the same on a content page (`/blog`) for readability.

- [ ] **Step 5: Reduced-motion sanity check**

In DevTools MCP, emulate `prefers-reduced-motion: reduce`, reload `/`: starfield must be a single static frame — no streaks, no twinkle, no scroll response.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/effects/GlobalUniverse.tsx
git commit -m "feat(ui): scroll-reactive starfield — velocity streaks + depth parallax"
```

---

## Self-Review

- **Spec coverage:** #2 (stars on all pages) = Task 1; #1 (solartoscale scroll reactivity) = Task 2. Both covered.
- **No placeholders:** all edits name exact files/lines; full draw-loop code given.
- **Type consistency:** `velRef`/`prevScrollRef` are `useRef<number>`; star fields unchanged; props unchanged.
- **Risk:** Task 1 readability (stars behind text on content pages) — mitigated by the existing low opacity ceiling and verified in-browser; Task 2 is visual-subjective — gated on browser tuning, not a unit assertion.
