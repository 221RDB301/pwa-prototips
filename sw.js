const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/pwa-prototips/',
  '/pwa-prototips/index.html',
  '/pwa-prototips/style.css',
  '/pwa-prototips/app.js',
  '/pwa-prototips/db.js',
  '/pwa-prototips/manifest.json',
  '/pwa-prototips/icon-192.png'
];

// Instalēšana
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Pieprasījumu apstrāde
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((res) => res || fetch(event.request))
  );
});
