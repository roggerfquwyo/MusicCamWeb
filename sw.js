const CACHE='musiccam-v5';
const assets=['index.html','manifest.json','icon-192.png','icon-512.png'].map(p=>new URL(p,self.registration.scope).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(assets.map(url=>new Request(url,{cache:'reload'})));await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{await self.clients.claim();for(const key of await caches.keys())if(key.startsWith('musiccam-')&&key!==CACHE)await caches.delete(key);})()));
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||!req.url.startsWith(self.registration.scope))return;
if(req.mode==='navigate'){event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(assets[0])||fetch(req);})());return;}
if(assets.includes(req.url))event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(req)||fetch(req);})());});
