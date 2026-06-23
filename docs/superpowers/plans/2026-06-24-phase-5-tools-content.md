# Phase 5 — Tools section + dropdowns + content

Build order slot: after Phase 4 (done). Spec §222–259.

## 5a Tools mobile-max — `ToolsClient.tsx`
- Category chips → horizontal scroll strip on mobile (`overflow-x-auto scrollbar-hide`,
  edge-bleed `-mx-6 px-6`), wrap on `lg`. Each chip `shrink-0`, keep `min-h-11`.
- No `text-[10px]` in the tools index (verified: none; spin-win's decorative label is
  out of scope). Type already ≥13px.

## 5b Dropdown consistency — `Navbar.tsx`
- Products: drop hardcoded `featuredProjects`; derive from `PROJECTS_DATA`
  (`!hidden`, first 6). Icon = project `logo` (Image) else lucide by `icon` name else Layout.
- Tools: remove `.slice(0,4)` so every non-`soon` tool per category shows.

## 5c Testimonials — `Testimonials.tsx`
- Replace project-description placeholders with natural first-person Persian quotes,
  generic role-based attribution (e.g. «مدیر محصول» + domain). Tied to real projects.
  Draft here, ship, surface to user for sign-off (locked decision #3).

## 5d Chat presence — `ChatWidget.tsx`
- Tehran hour via `Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tehran',hour})`,
  set post-mount (no hydration mismatch). 09:00–20:59 → green «آنلاین»; else
  «معمولاً سریع پاسخ می‌دهیم». Pulsing green dot on launcher when online.

## Tests — `tools-and-presence.spec.ts`
- /tools renders all category chips + tool count = TOOLS length.
- Products dropdown lists data-driven project names (count > 5).
- Tools dropdown shows a known 5th-in-category tool (e.g. `tabdil-vahed`) that
  `slice(0,4)` previously hid.
- ChatWidget presence node reflects injected Tehran hour (online vs offline).
