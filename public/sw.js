/* হজ গাইড — সার্ভিস ওয়ার্কার
   ------------------------------------------------------------------
   কেন: মিনা, আরাফাত ও মুজদালিফায় নেটওয়ার্ক প্রায়ই থাকে না, আর রোমিং
   ডেটা ব্যয়বহুল। একবার খোলা পৃষ্ঠা যেন ইন্টারনেট ছাড়াই পড়া যায়।

   কৌশল:
   - পেজ (navigate)      → আগে নেটওয়ার্ক, না পেলে ক্যাশ, তাও না পেলে /offline
   - নিজের css/js/ডেটা   → আগে ক্যাশ, পাশাপাশি চুপচাপ হালনাগাদ
   - ফন্ট ও Leaflet (CDN) → আগে ক্যাশ
   - GA, ম্যাপ টাইল      → কখনো ক্যাশ নয় (অগণিত ও অর্থহীন)
   ------------------------------------------------------------------ */

const CACHE = 'hajj-guide-v19';   /* bump-version.sh এটি হালনাগাদ করে */
/* Firebase-এ cleanUrls চালু — /offline.html রিডাইরেক্ট হয়; দুটোই রাখা হয়,
   কারণ লোকাল সার্ভারে clean URL কাজ করে না */
const OFFLINE = '/offline';
const OFFLINE_ALT = '/offline.html';

/* প্রথমবারেই যা জমা হবে — হজের আগে ওয়াই-ফাইতে একবার খুললেই যথেষ্ট */
const CORE = [
  '/', '/steps', '/umrah', '/rules', '/dua', '/salat',
  '/map', '/madinah', '/timeline', '/faq', '/terms',
  '/tips', '/checklist', '/qiran', '/ifrad', '/sources', '/inspire',
  OFFLINE, OFFLINE_ALT,
  '/css/style.css?v=19',
  '/js/shell.js?v=19', '/js/store.js?v=19', '/js/analytics.js?v=19', '/js/firebase-config.js?v=19',
  '/js/data-steps.js?v=19', '/js/data-dua.js?v=19', '/js/data-salat.js?v=19',
  '/js/data-checklist.js?v=19', '/js/data-umrah.js?v=19', '/js/data-faq.js?v=19',
  '/js/data-terms.js?v=19', '/js/data-ziyarat.js?v=19', '/js/data-hajj-types.js?v=19',
  '/js/data-timeline.js?v=19', '/js/data-quran-hadith.js?v=19',
  '/js/data-inspiration.js?v=19', '/js/data-janazah.js?v=19', '/js/dua-modal.js?v=19',
  '/img/icon-192.png', '/img/icon-512.png'
];

/* যে হোস্টগুলো ক্যাশ করা যাবে না */
const NEVER = [
  'google-analytics.com', 'googletagmanager.com',
  'tile.openstreetmap.org', 'server.arcgisonline.com',
  'firebaseapp.com', 'googleapis.com/identitytoolkit', 'firestore.googleapis.com'
];

/* যে CDN গুলো ক্যাশ করা যায় */
const CDN_OK = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    /* একটি ফাইল ব্যর্থ হলেও যেন পুরো ইনস্টল ভেস্তে না যায় */
    await Promise.allSettled(CORE.map(u => c.add(new Request(u, { cache: 'reload' }))));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => {
  if (e.data === 'skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (NEVER.some(h => url.hostname.includes(h) || url.href.includes(h))) return;

  const sameOrigin = url.origin === self.location.origin;
  const isCDN = CDN_OK.some(h => url.hostname.endsWith(h));
  if (!sameOrigin && !isCDN) return;

  /* পেজ — আগে নেটওয়ার্ক, তাতে সবসময় সর্বশেষ কনটেন্ট মেলে */
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const net = await fetch(req);
        const c = await caches.open(CACHE);
        c.put(req, net.clone());
        return net;
      } catch {
        return (await caches.match(req)) ||
               (await caches.match(url.pathname)) ||
               (await caches.match(OFFLINE)) ||
               (await caches.match(OFFLINE_ALT)) ||
               new Response('অফলাইন', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
    })());
    return;
  }

  /* বাকি সব — আগে ক্যাশ, পেছনে চুপচাপ হালনাগাদ */
  e.respondWith((async () => {
    /* ignoreSearch ব্যবহার করা হয় না — করলে ?v=17-এর অনুরোধ পুরোনো ?v=16
       ক্যাশ থেকে মিটে যেত এবং সংস্করণ বদলের সময় বাসি ফাইল পরিবেশিত হতো।
       হুবহু URL না মিললে নেটওয়ার্কে যাক, সেটাই ঠিক। */
    const cached = await caches.match(req);
    const network = fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) {
        caches.open(CACHE).then(c => c.put(req, res.clone())).catch(() => {});
      }
      return res;
    }).catch(() => null);
    return cached || (await network) ||
           new Response('', { status: 504 });
  })());
});
