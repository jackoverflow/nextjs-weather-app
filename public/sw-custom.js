// Custom Service Worker for Weather App with Notification Support

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event.notification);
  event.notification.close();
  
  // Handle notification click - open the app
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else {
    event.waitUntil(
      clients.openWindow('/weather')
    );
  }
});

// Push event handler for future push notifications
self.addEventListener('push', function(event) {
  console.log('Push received:', event);
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Weather update available',
      icon: '/icon/icon-192x192.png',
      badge: '/icon/icon-192x192.png',
      tag: 'weather-notification',
      data: {
        url: '/weather'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Weather Alert', options)
    );
  }
});

// Background sync for weather updates (optional)
self.addEventListener('sync', function(event) {
  if (event.tag === 'weather-sync') {
    console.log('Background sync for weather updates');
    // Could implement background weather fetching here
  }
}); 