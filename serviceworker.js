const CACHE_NAME = 'atw-offline-v1';
const OFFLINE_URL = '/offline.html';

// Все URL должны быть абсолютными
const urlsToCache = [
  '/atw-travel/', // Главная страница
  '/atw-travel/index.html',
  '/atw-travel/offline.html',
  '/atw-travel/22.css',
  '/atw-travel/eks1.html',
  '/atw-travel/act1.html',
  '/atw-travel/pl1.html',
  '/atw-travel/feedback1.html',
  '/atw-travel/icon-192.png',
  '/atw-travel/icon-512.png',
  // Добавьте все изображения с правильными путями
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  // Активируем SW сразу после установки
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Удаляем старые кэши
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Берем управление клиентами сразу
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // Для навигационных запросов
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_URL))
    );
  } 
  // Для остальных запросов
  else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
