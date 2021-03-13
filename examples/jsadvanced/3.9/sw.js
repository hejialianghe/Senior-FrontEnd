self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('cache').then((cache) => {
        return cache.add('./index.html')
      })
    )
  })
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('./index.html')
      })
    )
  })
  