// In a real app, this file would be generated and configured by the Firebase SDK.
// This is a placeholder to demonstrate service worker functionality.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.');
  if (!event.data) {
    console.log('[Service Worker] Push event but no data');
    return;
  }
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  try {
    const pushData = event.data.json();
    const title = pushData.notification?.title || 'Firebase Notifier';
    const options = {
      body: pushData.notification?.body || 'You have a new notification.',
      icon: pushData.notification?.icon || 'https://placehold.co/192x192.png',
      badge: 'https://placehold.co/96x96.png',
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error('Error parsing push data', error);
    const title = 'Firebase Notifier';
    const options = {
      body: event.data.text(),
      icon: 'https://placehold.co/192x192.png',
      badge: 'https://placehold.co/96x96.png',
    };
    event.waitUntil(self.registration.showNotification(title, options));
  }
});

self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
