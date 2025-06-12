const CACHE = 'portfolio-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/icon-192.png',
  '/icon-512.png',
  '/og-image.png'
];

self.addEventListener('install', e =>
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))
);

self.addEventListener('activate', e =>
  e.waitUntil(caches.keys().then(keys=>
    Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
  ).then(()=>self.clients.claim()))
);

self.addEventListener('fetch', e =>
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))
);
=======
const CACHE_NAME = 'portfolio-v1';
const ASSETS = [
  '/', 
  '/index.html',
  '/manifest.json',
  '/sw.js',
  // tutti gli altri file statici che servi: CSS inline, icon-192.png, icon-512.png, og-image.png
];

// On install: cache static assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// On activate: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// On fetch: respond from cache first, then network
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        // opzionale: cache dinamico
        return caches.open(CACHE_NAME).then(cache => {
          // cache.put(e.request, res.clone());
          return res;
        });
      });
    })
  );
});