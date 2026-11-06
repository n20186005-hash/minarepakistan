// Retire only this site's legacy offline cache; no fetch interception.
self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('mep-'))await caches.delete(k);await self.registration.unregister();await self.clients.claim();})()));
