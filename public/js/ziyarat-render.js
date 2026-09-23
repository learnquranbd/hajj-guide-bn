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
    <p>${p.d}</p>
    ${fadl}
    ${p.visit ? `<p class="muted" style="margin-top:10px">🧭 ${p.visit}</p>` : ''}
    ${p.warn ? `<div class="note warn"><p>${p.warn}</p></div>` : ''}
    ${p.flag ? `<p class="ziy-flag">ℹ️ <strong>যা নিশ্চিত নই:</strong> ${p.flag}</p>` : ''}
    ${chips ? `<div class="dua-chips">${chips}</div>` : ''}
    ${q ? `<p style="margin:14px 0 0"><a class="chip" target="_blank" rel="noopener noreferrer"
       href="https://www.google.com/maps/search/?api=1&query=${q}" data-ziy="${p.id}">↗ ম্যাপে দেখুন</a></p>` : ''}
  </article>`;
}

/** আদবের তালিকা — মক্কা ও মদিনা দুটোরই গঠন এক */
export function adabBlock(a) {
  return `<p><strong>${esc(a.title)}</strong></p>` +
    `<ul class="ul-check ul-cross" style="margin-top:8px">` +
    a.body.map(t => `<li>${t}</li>`).join('') + `</ul>` +
    (a.note ? `<p style="margin-top:10px">${a.note}</p>` : '');
}
