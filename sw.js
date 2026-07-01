// Nora — push service worker for the Energieberatung app
self.addEventListener('push', function (e) {
  let d = {};
  try { d = e.data ? e.data.json() : {}; }
  catch (_) { try { d = { body: e.data.text() }; } catch (__) {} }
  const title = d.title || 'Nora';
  const opts = {
    body: d.body || '',
    data: { url: d.url || '/' },
    tag: 'nora-nudge',
    renotify: true
  };
  e.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(function (cl) {
      for (const c of cl) { if ('focus' in c) return c.focus(); }
      return clients.openWindow(url);
    })
  );
});
