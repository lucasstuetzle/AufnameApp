self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-cache').then(cache => {
      return cache.addAll([

        'https://lucasstuetzle.github.io/AufnameApp/index.html',                // Index-Seite (oder Homepage)
        'https://lucasstuetzle.github.io/AufnameApp/css/style.css',             // CSS-Datei
        'https://lucasstuetzle.github.io/AufnameApp/js/Berechnung-kWh.js                  // JavaScript-Datei
        'https://lucasstuetzle.github.io/AufnameApp/js/speicher.js                // JavaScript-Datei
        'https://lucasstuetzle.github.io/AufnameApp/manifest.json',             // Manifest-Datei
        'https://lucasstuetzle.github.io/AufnameApp/Icons/icon-192x192.png',    // 192px Icon (mit korrektem Großbuchstaben "Icons")
        'https://lucasstuetzle.github.io/AufnameApp/Icons/icon-192x192.png'     // 512px Icon (mit korrektem Großbuchstaben "Icons")
      ]);
    })
  );
});

// Event listener für das "Aktivieren" des Service Workers
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== 'my-cache-v2') {  // Wenn der alte Cache gefunden wird
            return caches.delete(cacheName);  // Lösche den alten Cache
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

