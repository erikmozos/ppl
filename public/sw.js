// Service worker de Cockpit Flows: la app funciona sin conexión con lo que ya has abierto o guardado.
// - Páginas: primero la red y, sin conexión, la última versión guardada.
// - Recursos con hash (/assets), fotos, audios e iconos: primero la caché.
// - El vídeo (peticiones por rangos), las herramientas de /tools/ y los servicios externos (Firebase) no se interceptan.
const CACHE = 'cf-v1'
const SHELL = ['/', '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-180.png']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()))
})
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', e => {
  const req = e.request
  const url = new URL(req.url)
  if (req.method !== 'GET' || url.origin !== location.origin || req.headers.has('range') || url.pathname.startsWith('/video/') || url.pathname.startsWith('/tools/')) return
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('/', copy)); return res }).catch(() => caches.match('/')))
    return
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)) }
    return res
  })))
})
