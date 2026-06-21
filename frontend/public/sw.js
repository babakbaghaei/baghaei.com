// Self-unregistering service worker.
//
// This replaces a stale next-pwa/workbox service worker that precached old build
// chunks and served the cached app-shell for navigations — which made every
// link (footer: blog/careers/projects, etc.) open the stale home page instead
// of the requested route. Once this version activates it clears ALL caches,
// unregisters itself, and reloads open tabs so visitors get the live site.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch {
        /* ignore */
      }
      try {
        await self.registration.unregister();
      } catch {
        /* ignore */
      }
      try {
        const clients = await self.clients.matchAll({ type: 'window' });
        clients.forEach((client) => client.navigate(client.url));
      } catch {
        /* ignore */
      }
    })(),
  );
});
