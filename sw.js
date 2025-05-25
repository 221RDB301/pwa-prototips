const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  'index.html',
  'style.css',
  'app.js',
  'db.js',
  'manifest.json'
];

// Instalēšana
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        urlsToCache.map((url) => {
          return fetch(url).then((response) => {
            if (!response.ok) {
              throw new Error(`Request for ${url} failed with status ${response.status}`);
            }
            return cache.put(url, response.clone());
          });
        })
      );
    })
  );
});

// Pieprasījumu apstrāde
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((res) => res || fetch(event.request))
  );
});
