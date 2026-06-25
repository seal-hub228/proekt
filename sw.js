const CACHE_NAME = 'g812-cache-v1';
const ASSETS = [
    'index.html',
    'catalog.html',
    'about.html',
    'contacts.html',
    'style.css',
    'catalog.css',
    'about.css',
    'contacts.css',
    'script.js',
    'manifest.json'
];

// Установка SW и кеширование основных файлов
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW: Кеширование файлов');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Активация и очистка старых кешей
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Стратегия: Stale-While-Revalidate
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Возвращаем кеш, если есть
                if (cachedResponse) {
                    // В фоне обновляем кеш
                    fetch(event.request)
                        .then(networkResponse => {
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, networkResponse);
                                });
                        })
                        .catch(() => {});
                    return cachedResponse;
                }
                // Если нет в кеше — идем в сеть
                return fetch(event.request)
                    .then(networkResponse => {
                        // Кешируем ответ
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseClone);
                            });
                        return networkResponse;
                    })
                    .catch(() => {
                        // Если все плохо — fallback
                        return new Response('Ой, что-то пошло не так', {
                            status: 404,
                            statusText: 'Not Found'
                        });
                    });
            })
    );
});