self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-cache-v2').then(cache => {  // Hier 'my-cache-v2' als Versionierung verwenden
      return cache.addAll([
        'https://lucasstuetzle.github.io/AufnameApp/index.html',                // Index-Seite (oder Homepage)
        'https://lucasstuetzle.github.io/AufnameApp/css/style.css',             // CSS-Datei
        'https://lucasstuetzle.github.io/AufnameApp/js/Berechnung-kWh.js',      // JavaScript-Datei
        'https://lucasstuetzle.github.io/AufnameApp/js/speicher.js',            // JavaScript-Datei
        'https://lucasstuetzle.github.io/AufnameApp/manifest.json',             // Manifest-Datei
        'https://lucasstuetzle.github.io/AufnameApp/Icons/icon-192x192.png',    // 192px Icon (mit korrektem Großbuchstaben "Icons")
        'https://lucasstuetzle.github.io/AufnameApp/Icons/icon-512x512.png'     // 512px Icon (mit korrektem Großbuchstaben "Icons")
      ]);
    }).catch(error => {
      console.log('Fehler beim Caching:', error);
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

// Fetch Event: Wenn der User eine Seite aufruft, wird versucht, sie aus dem Cache zu laden, falls vorhanden
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);  // Wenn nicht im Cache, dann über das Netzwerk anfordern
    })
  );
});

