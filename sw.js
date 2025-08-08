const CACHE_NAME = 'meal-chooser-v1';
const ASSETS_TO_CACHE = [
  '/meal-chooser/',
  '/meal-chooser/index.html',
  '/meal-chooser/manifest.webmanifest',
  '/meal-chooser/style.css',
  '/meal-chooser/app.js',
  '/meal-chooser/icons/icon-72x72.png',
  '/meal-chooser/icons/icon-96x96.png',
  '/meal-chooser/icons/icon-128x128.png',
  '/meal-chooser/icons/icon-144x144.png',
  '/meal-chooser/icons/icon-152x152.png',
  '/meal-chooser/icons/icon-192x192.png',
  '/meal-chooser/icons/icon-384x384.png',
  '/meal-chooser/icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  if (!navigator.onLine) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  } else {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});