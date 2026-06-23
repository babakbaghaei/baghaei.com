import { test, expect } from '@playwright/test';

// Phase 7 + 8 — Host-based subdomain rewrites in proxy.ts and the /status
// deploy-progress page. NO backend needed.
//
// NOTE: Chromium forbids overriding the `Host` header for page navigations
// (net::ERR_INVALID_ARGUMENT), so subdomain rewrites are exercised through the
// APIRequestContext (request.*), which CAN set Host. The /status page itself is
// checked with a normal navigation.

// Section subdomains rewrite to their apex prefix while keeping the URL/host.
const REWRITES: { host: string; path: string; needle: string }[] = [
 { host: 'tools.baghaei.com', path: '/', needle: 'ابزار' },
 { host: 'blog.baghaei.com', path: '/', needle: 'blog' },
 { host: 'jobs.baghaei.com', path: '/', needle: 'careers' },
 { host: 'status.baghaei.com', path: '/', needle: 'وضعیت استقرار' },
];

for (const { host, path, needle } of REWRITES) {
 test(`${host} rewrites to its section`, async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}${path}`, { headers: { host }, maxRedirects: 0 });
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain(needle);
 });
}

test('projects. subdomain serves a project deep link (200, not 404)', async ({ request, baseURL }) => {
 const res = await request.get(`${baseURL}/ravro-platform`, {
  headers: { host: 'projects.baghaei.com' },
  maxRedirects: 0,
 });
 expect(res.status()).toBe(200);
});

test('www. redirects 301 to the apex host', async ({ request, baseURL }) => {
 const res = await request.get(`${baseURL}/about`, {
  headers: { host: 'www.baghaei.com' },
  maxRedirects: 0,
 });
 expect(res.status()).toBe(301);
 expect(res.headers()['location']).toBe('https://baghaei.com/about');
});

test('project. (singular) redirects 301 to projects. (plural)', async ({ request, baseURL }) => {
 const res = await request.get(`${baseURL}/ravro-platform`, {
  headers: { host: 'project.baghaei.com' },
  maxRedirects: 0,
 });
 expect(res.status()).toBe(301);
 expect(res.headers()['location']).toBe('https://projects.baghaei.com/ravro-platform');
});

test('/status renders the deploy progress page', async ({ page }) => {
 await page.goto('/status');
 await expect(page.locator('h1')).toContainText('وضعیت استقرار');
 await expect(page.locator('[role="progressbar"]')).toBeAttached();
});
