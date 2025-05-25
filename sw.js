const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/pwa-prototips/',
  '/pwa-prototips/index.html',
  '/pwa-prototips/style.css',
  '/pwa-prototips/app.js',
  '/pwa-prototips/db.js',
  '/pwa-prototips/manifest.json'
];

// Instalēšanas notikums
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return Promise.all(
          urlsToCache.map((url) => {
            return fetch(url).then((response) => {
              if (!response.ok) {
                throw new Error(`Request for ${url} failed with status ${response.status}`);
              }
              return cache.put(url, response);
            });
          })
        );
      })
      .catch((error) => {
        console.error('Cache add error:', error);
      })
  );
});

// Pieprasījumu apstrāde
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
