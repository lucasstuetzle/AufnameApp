const CACHE_NAME = 'my-cache'; // Name des Caches

// Installieren und Ressourcen in den Cache hinzufügen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Cache wird hinzugefügt');
      return cache.addAll([
        'https://lucasstuetzle.github.io/AufnameApp/index.html',              // Index-Seite
        'https://lucasstuetzle.github.io/AufnameApp/css/style.css',           // CSS-Datei
        'https://lucasstuetzle.github.io/AufnameApp/js/Berechnung-kWh.js',    // JavaScript-Datei
        'https://lucasstuetzle.github.io/AufnameApp/js/speicher.js',          // JavaScript-Datei
        'https://lucasstuetzle.github.io/AufnameApp/manifest.json',           // Manifest-Datei
        'https://lucasstuetzle.github.io/AufnameApp/Icons/icon-192x192.png',  // 192px Icon
        'https://lucasstuetzle.github.io/AufnameApp/Icons/icon-512x512.png'   // 512px Icon
      ]);
    })
  );
});

// Aktivieren des Service Workers und Entfernen alter Caches (Optional)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) { // Löscht alte Caches
            console.log(`Service Worker: Lösche alten Cache ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Netzwerk bevorzugen, Cache nur als Fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request) // Immer zuerst aus dem Internet laden
      .then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone()); // Datei im Cache speichern
          return response; // Rückgabe der aktuellen Datei aus dem Internet
        });
      })
      .catch(() => caches.match(event.request)) // Falls kein Internet, nutze Cache als Fallback
  );
});
