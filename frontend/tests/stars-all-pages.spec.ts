import { test, expect } from '@playwright/test';

// Phase 3 #2: the signature starfield is mounted once in the root layout inside
// a `fixed inset-0 z-[-2]` wrapper, so it sits behind in-flow content on EVERY
// route. It only shows where the page's own wrappers are transparent — these
// routes previously set an opaque `bg-background` on their top-level wrapper,
// painting over the field. The dark backdrop now comes from <html bg-background>.
// Viewport-only: needs the frontend dev server, NO backend.
const ROUTES = ['/', '/projects', '/blog', '/careers', '/about', '/tools'];

test('global starfield canvas is mounted', async ({ page }) => {
  await page.goto('/');
  // GalaxyBackground is a client-only dynamic import; give hydration room.
  await expect(page.locator('.fixed.inset-0 canvas').first()).toBeAttached({ timeout: 15000 });
});

for (const route of ROUTES) {
  test(`no opaque page backdrop occludes the starfield on ${route}`, async ({ page }) => {
    await page.goto(route);
    // No top-level full-height wrapper may reintroduce the opaque backdrop.
    await expect(
      page.locator('main.min-h-screen.bg-background, div.min-h-screen.bg-background')
    ).toHaveCount(0);
  });
}
