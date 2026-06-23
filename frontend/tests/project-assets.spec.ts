import { test, expect } from '@playwright/test';
import { readFileSync, statSync, existsSync } from 'fs';
import { join } from 'path';

// Phase 4: project cards + real Sketch screenshots. Every image referenced in the
// project catalog (`src/lib/data/projects.ts`) must (a) exist on disk, (b) be a
// non-empty file, and (c) actually be served by the app — the prior bug was the
// catalog pointing at `/assets/projects/<slug>/01.jpg` paths that 404'd. The
// screenshots were exported from the source `.sketch` files via sketchtool.
// Viewport-only: needs the frontend dev server, NO backend.

const PUBLIC_DIR = join(__dirname, '..', 'public');
const DATA_FILE = join(__dirname, '..', 'src', 'lib', 'data', 'projects.ts');

// Pull every '/assets/projects/...' literal straight out of the catalog source.
function referencedAssetPaths(): string[] {
  const src = readFileSync(DATA_FILE, 'utf8');
  const re = /'(\/assets\/projects\/[^']+)'/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    if (!out.includes(m[1])) out.push(m[1]);
  }
  return out;
}

const ASSETS = referencedAssetPaths();

test('catalog references at least one screenshot per visible project', () => {
  // Sanity: the regex actually found the catalog (guards a silent empty pass).
  expect(ASSETS.length).toBeGreaterThan(20);
});

test('every referenced project asset exists on disk and is non-empty', () => {
  const broken: string[] = [];
  for (const p of ASSETS) {
    const fp = join(PUBLIC_DIR, p);
    if (!existsSync(fp) || statSync(fp).size === 0) broken.push(p);
  }
  expect(broken, `missing/empty assets:\n${broken.join('\n')}`).toEqual([]);
});

test('every referenced project asset is served (no 404) with an image mime', async ({ request }) => {
  const bad: string[] = [];
  for (const p of ASSETS) {
    const res = await request.get(p);
    const ct = res.headers()['content-type'] || '';
    if (!res.ok() || !ct.startsWith('image/')) bad.push(`${p} -> ${res.status()} ${ct}`);
  }
  expect(bad, `not served as image:\n${bad.join('\n')}`).toEqual([]);
});

test('a visible project hero screenshot decodes in the browser (landscape)', async ({ page }) => {
  // Navigate first so a relative img.src resolves against the dev-server origin.
  await page.goto('/');
  // ravro-platform is visible + unlocked; its first hero must be a real, wide image.
  const dims = await page.evaluate(
    (src) =>
      new Promise<{ w: number; h: number }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = () => reject(new Error('decode failed'));
        img.src = src;
      }),
    '/assets/projects/ravro-platform/01.jpg'
  );
  expect(dims.w).toBeGreaterThan(0);
  expect(dims.w).toBeGreaterThanOrEqual(dims.h); // landscape, fills the 16/9 gallery cleanly
});
