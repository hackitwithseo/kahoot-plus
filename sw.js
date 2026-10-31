const C = 'khp2';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(r => { caches.open(C).then(c => c.put(req, r.clone())); return r; })
        .catch(() => caches.match(req).then(r => r || caches.match('./')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit =>
      hit || fetch(req).then(r => { caches.open(C).then(c => c.put(req, r.clone())); return r; })
    )
  );
});