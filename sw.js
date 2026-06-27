const VERSION='bbddae15';
const CACHE='doragon-'+VERSION;
const CORE=['./','./index.html','./giorni.js','./manifest.json','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./icon-180.png','./favicon-32.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==CACHE+'-ext').map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const url=new URL(req.url);
 if(url.origin===location.origin){e.respondWith(caches.open(CACHE).then(async c=>{const cached=await c.match(req);const net=fetch(req).then(r=>{if(r&&r.status===200)c.put(req,r.clone());return r;}).catch(()=>cached);return cached||net;}));return;}
 e.respondWith(caches.open(CACHE+'-ext').then(async c=>{const cached=await c.match(req);if(cached)return cached;try{const r=await fetch(req);if(r&&(r.status===200||r.type==='opaque'))c.put(req,r.clone());return r;}catch(_){return cached||Response.error();}}));});
