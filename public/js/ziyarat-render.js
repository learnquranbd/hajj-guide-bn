/* যিয়ারতের স্থানের কার্ড — /map ও /madinah দুই জায়গায় একই রেন্ডারার
   ------------------------------------------------------------------
   কেন আলাদা ফাইল: মক্কা ও মদিনার তালিকা আলাদা, কিন্তু কার্ডের গঠন এক।
   দুই পেজে দুইবার লিখলে একটিতে ফজিলত দেখাত, অন্যটিতে দেখাত না — সেই
   অসামঞ্জস্য এড়াতে একটিই উৎস।

   প্রতিটি হাদীস/আয়াতের আরবি সবসময় শব্দে শব্দে অর্থসহ দেখানো হয় —
   সাইটের নিয়ম: আরবি থাকলে শব্দে শব্দে অর্থও থাকবে।
   ------------------------------------------------------------------ */

export const esc = s => String(s).replace(/[&<>]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[c]));

/** এক টুকরো হাদীস বা আয়াত — আরবি, উচ্চারণ, অর্থ, শব্দে শব্দে ও সূত্র */
export function fadlBlock(f) {
  const words = (f.w || []).map(([a, m]) =>
    `<span class="w"><span class="wa">${a}</span><span class="wb">${esc(m)}</span></span>`).join('');
  return `<div class="ph fadl">
    <p class="ph-ar">${f.ar}</p>
    <div><span class="ph-tr">${esc(f.tr)}</span></div>
    <p class="ph-bn" style="margin:10px 0 0">${esc(f.bn)}</p>
    ${words ? `<div class="wbw-head">শব্দে শব্দে অর্থ</div><div class="wbw">${words}</div>` : ''}
    <p class="ph-src">📖 ${esc(f.src)}</p>
  </div>`;
}

/** স্থানটির ছবি ও উইকিমিডিয়া কমন্সের কৃতজ্ঞতা স্বীকার।
    প্রতিটি ছবি CC0 / পাবলিক ডোমেইন / CC BY / CC BY-SA লাইসেন্সের — তাই নিচের
    কৃতিত্বের লাইনটি লাইসেন্সের শর্ত, সাজসজ্জা নয়; মুছে ফেলা যাবে না। */
export function placePhoto(p) {
  if (!p.img) return '';
  const small = p.img.replace(/\.webp$/, '-450.webp');
  return `<figure class="place-photo">
    <img src="/img/places/${p.img}"
         srcset="/img/places/${small} 450w, /img/places/${p.img} 900w"
         sizes="(max-width:700px) 100vw, 620px"
         width="${p.imgW}" height="${p.imgH}" loading="lazy" decoding="async"
         alt="${esc(p.imgAlt || p.name)}">
    <figcaption>ছবি: <a href="${p.imgSrc}" target="_blank" rel="noopener noreferrer">${esc(p.imgBy)}</a>,
      ${esc(p.imgLic)}, উইকিমিডিয়া কমন্স</figcaption>
  </figure>`;
}

/* ---------- প্রতিটি কার্ডের ছোট স্যাটেলাইট ম্যাপ ----------
   Leaflet ভারী, আর বেশির ভাগ পাঠক প্রতিটি কার্ডের নিচ পর্যন্ত যান না — তাই
   প্রথম ম্যাপটি চোখের সামনে এলে তবেই একবার লোড করা হয়। */
let leafletReady = null;
function loadLeaflet() {
  if (leafletReady) return leafletReady;
  leafletReady = new Promise((resolve, reject) => {
    if (window.L) return resolve(window.L);
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    css.integrity = 'sha512-h9FcoyWjHcOcmEVkxOfTLnmZFWIH0iZhZT1H2TbOq55xssQGEJHEaIm+PgoUaZbRvQTNTluNOEfb1ZRy6D3BOw==';
    css.crossOrigin = 'anonymous'; css.referrerPolicy = 'no-referrer';
    document.head.appendChild(css);
    const js = document.createElement('script');
    js.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    js.integrity = 'sha512-puJW3E/qXDqYp9IfhAI54BJEaWIfloJ7JWs7OeD5i6ruC9JZL1gERT1wjtwXFlh7CjE7ZJ+/vcRZRkIYIb6p4g==';
    js.crossOrigin = 'anonymous'; js.referrerPolicy = 'no-referrer';
    js.onload = () => resolve(window.L);
    js.onerror = () => reject(new Error('Leaflet লোড হয়নি'));
    document.head.appendChild(js);
  });
  return leafletReady;
}

function drawMap(el) {
  const lat = +el.dataset.lat, lng = +el.dataset.lng, z = +el.dataset.z || 15;
  loadLeaflet().then(L => {
    const map = L.map(el, {
      center: [lat, lng], zoom: z,
      scrollWheelZoom: false, zoomControl: true, attributionControl: true
    });
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19, attribution: 'Imagery © Esri, Maxar, Earthstar Geographics' }).addTo(map);
    L.marker([lat, lng]).addTo(map).bindPopup(`<b>${esc(el.dataset.label)}</b>`);
    map.attributionControl.setPrefix('');
    /* ম্যাপ পেজের স্ক্রল খেয়ে ফেললে ফোনে খুব বিরক্তিকর হয় — পাঠক ম্যাপে
       ক্লিক করলে তবেই টেনে সরানো ও জুম চালু হয়। */
    map.dragging.disable();
    el.addEventListener('click', () => { map.dragging.enable(); map.scrollWheelZoom.enable(); }, { once: true });
  }).catch(() => {
    el.innerHTML = '<p class="muted" style="padding:14px;margin:0">ম্যাপটি লোড করা যায়নি। '
      + 'উপরের “ম্যাপে দেখুন” লিংকটি ব্যবহার করুন।</p>';
  });
}

/** কার্ডগুলো DOM-এ বসার পর একবার ডাকুন। ম্যাপহীন পেজেও ডাকা নিরাপদ। */
export function initPlaceMaps(root = document) {
  const els = [...root.querySelectorAll('.place-map:not([data-ready])')];
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(el => { el.dataset.ready = '1'; drawMap(el); }); return; }
  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) if (e.isIntersecting) {
      obs.unobserve(e.target); e.target.dataset.ready = '1'; drawMap(e.target);
    }
  }, { rootMargin: '300px' });
  els.forEach(el => io.observe(el));
}

/**
 * একটি স্থানের পূর্ণ কার্ড।
 * @param {object} p       স্থানের তথ্য
 * @param {object} [opt]
 * @param {(id:string)=>string} [opt.duaTitle] দোয়ার id থেকে শিরোনাম
 */
export function placeCard(p, opt = {}) {
  const duaTitle = opt.duaTitle || (id => id);
  const meta = [p.tag && `🏷️ ${p.tag}`, p.dist && `📍 ${p.dist}`]
    .filter(Boolean).map(t => `<span>${esc(t)}</span>`).join('');

  const fadl = (p.fadl || []).length
    ? `<div class="fadl-wrap"><div class="wbw-head">ফজিলত ও দলিল</div>${p.fadl.map(fadlBlock).join('')}</div>`
    : '';

  /* দোয়ার চিপ — /dua#id রাখা হয় যাতে জাভাস্ক্রিপ্ট না চললেও লিংক কাজ করে;
     dua-modal.js ক্লিক ধরে মডালে খুলে দেয় (সদয় অবনতি) */
  const chips = (p.dua || []).map(id =>
    `<a class="dua-chip" href="/dua#${id}">🤲 ${esc(duaTitle(id))}</a>`).join('');

  const q = (p.lat !== null && p.lat !== undefined) ? `${p.lat},${p.lng}` : null;

  return `<article class="card" id="z-${p.id}">
    <div class="tile-ico">${p.icon}</div>
    <h3>${esc(p.name)}</h3>
    ${meta ? `<div class="place-meta">${meta}</div>` : ''}
    ${placePhoto(p)}
    <p>${p.d}</p>
    ${fadl}
    ${p.visit ? `<p class="muted" style="margin-top:10px">🧭 ${p.visit}</p>` : ''}
    ${p.warn ? `<div class="note warn"><p>${p.warn}</p></div>` : ''}
    ${p.flag ? `<p class="ziy-flag">ℹ️ <strong>যা নিশ্চিত নই:</strong> ${p.flag}</p>` : ''}
    ${chips ? `<div class="dua-chips">${chips}</div>` : ''}
    ${q ? `<p style="margin:14px 0 0"><a class="chip" target="_blank" rel="noopener noreferrer"
       href="https://www.google.com/maps/search/?api=1&query=${q}" data-ziy="${p.id}">↗ ম্যাপে দেখুন</a></p>
    <div class="place-map" data-lat="${p.lat}" data-lng="${p.lng}" data-z="${p.z || 15}"
         data-label="${esc(p.name)}" role="img"
         aria-label="${esc(p.name)} কোথায়, তা দেখানো স্যাটেলাইট ম্যাপ"></div>` : ''}
  </article>`;
}

/** আদবের তালিকা — মক্কা ও মদিনা দুটোরই গঠন এক */
export function adabBlock(a) {
  return `<p><strong>${esc(a.title)}</strong></p>` +
    `<ul class="ul-check ul-cross" style="margin-top:8px">` +
    a.body.map(t => `<li>${t}</li>`).join('') + `</ul>` +
    (a.note ? `<p style="margin-top:10px">${a.note}</p>` : '');
}
