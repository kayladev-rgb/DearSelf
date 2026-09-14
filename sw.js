const CACHE = 'dearself-v42-6-beta';
const APP_SHELL = ['./','./index.html','./version.json','./manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if(event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  const url=new URL(event.request.url);

  if(url.pathname.endsWith('/version.json')){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(event.request,c));return r;})
        .catch(()=>caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(event.request,c));return r;})
      .catch(()=>caches.match(event.request))
  );
});
