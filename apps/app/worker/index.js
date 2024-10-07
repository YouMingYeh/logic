self.addEventListener('push', async event => {
  const { message, body, icon } = JSON.parse(event.data.text());

  const promiseChain = self.registration.showNotification(message, {
    body,
    icon,
  });

  event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', event => {
  const { message, body, icon } = JSON.parse(event.data.text());
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then(clientList => {
        // for (const client of clientList) {
        //   if (client.url === '/app' && 'focus' in client) return client.focus();
        // }
        if (clients.openWindow) return clients.openWindow('/app');
      }),
  );
});
