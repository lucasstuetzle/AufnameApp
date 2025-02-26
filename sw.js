self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-cache').then(cache => {
      return cache.addAll([
        '/',                         // Startseite, z.B. index.html
        'index.html',                // Index-Seite (oder Homepage)
        'css/style.css',             // CSS-Datei
        'js/app.js',                 // JavaScript-Datei
        'manifest.json',             // Manifest-Datei
        'Icons/icon-192x192.png',    // 192px Icon (mit korrektem Großbuchstaben "Icons")
        'Icons/icon-512x512.png'     // 512px Icon (mit korrektem Großbuchstaben "Icons")
      ]);
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

