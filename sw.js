self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-cache').then(cache => {
      return cache.addAll([
        'https://lucasstuetzle.github.io/AufnameApp/',  // Stelle sicher, dass die root URL mit gecached wird
        '/index.html',
        '/Übersicht.html',
        '/css/style.css',
        '/js/app.js',
        '/manifest.json',
        '/Icons/icon-192x192.png',
        '/Icons/icon-512x512.png'
      ]);
    }).catch(error => {
      console.error('Cache konnte nicht erstellt werden:', error);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(error => {
      console.error('Fehler beim Abrufen der Datei:', error);
      return new Response('Offline, aber Fehler beim Abrufen.');
    })
  );
});
