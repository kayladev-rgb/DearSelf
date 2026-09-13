const CACHE_NAME="dearself-v38-runtime";
const SHELL=["./","./index.html","./manifest.json","./version.json"];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin) return;
  const shell=u.pathname.endsWith("/")||u.pathname.endsWith("/index.html")||
              u.pathname.endsWith("/manifest.json")||u.pathname.endsWith("/version.json");
  if(shell){
    e.respondWith(fetch(e.request,{cache:"no-store"})
      .then(r=>{const cp=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,cp));return r;})
      .catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
  }else{
    e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{
      const cp=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,cp));return r;
    })));
  }
});
