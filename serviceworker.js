const CACHE_NAME = 'atw-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/22.css',
  '/eks1.html',
  '/act1.html',
  '/pl1.html',
  '/feedback1.html',
  '/icon-192.png',
  '/icon-512.png',
  '/11.jpg',
  '/22(1).jpg',
  '/33.jpeg',
  '/44.jpg',
  '/эк1.jpg',
  '/экс2(1).jpg',
  '/экс3.jpg',
  '/ак1.jpg',
  '/ак2.jpg',
  '/ак3.jpg',
  '/пл(1).jpg',
  '/пл2.jpg',
  '/пл3.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});