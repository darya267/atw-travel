const CACHE_NAME = 'atw-cache-v2';
const OFFLINE_URL = '/offline.html';

// Список ресурсов для кэширования при установке
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
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

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэширование ресурсов');
        return cache.addAll(urlsToCache);
      })
  );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват сетевых запросов
self.addEventListener('fetch', event => {
  // Пропускаем POST-запросы и другие не-GET запросы
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем кэшированный ресурс, если он есть
        if (response) {
          return response;
        }

        // Для навигационных запросов используем специальную логику
        if (event.request.mode === 'navigate') {
          return fetch(event.request)
            .catch(() => caches.match(OFFLINE_URL));
        }

        // Для остальных запросов: пробуем сеть, потом кэш
        return fetch(event.request)
          .then(networkResponse => {
            // Клонируем ответ для кэширования
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // Если ресурс есть в кэше - возвращаем его
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// Обновление контента в фоне
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
