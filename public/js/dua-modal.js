/* দোয়া মডাল — ধাপ ছেড়ে না গিয়েই দোয়া দেখা
   ------------------------------------------------------------------
   কেন: /steps, /umrah, /qiran, /ifrad-এ দোয়ার চিপে ক্লিক করলে আগে
   ব্যবহারকারী /dua পৃষ্ঠায় চলে যেতেন এবং ধাপের ক্রম হারিয়ে ফেলতেন।
   এখন দোয়াটি একটি মডালে খোলে — শব্দে শব্দে অর্থ, ফজিলত ও সূত্রসহ।

   সদয় অবনতি (graceful degradation):
   চিপগুলো আসল <a href="/dua#id"> থেকেই যায়। জাভাস্ক্রিপ্ট না চললে,
   ctrl/cmd-ক্লিক করলে, বা দোয়াটি খুঁজে না পেলে — ব্রাউজার আগের মতোই
   /dua পৃষ্ঠায় নিয়ে যাবে। কিছুই ভাঙে না।
   ------------------------------------------------------------------ */
import { DUAS } from './data-dua.js?v=24';

const esc = s => String(s).replace(/[&<>]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[c]));

let box = null, panel = null, lastFocus = null;

/* /dua-এর বাইরের দোয়া (নামাজ, জানাজা) — পেজ নিজে রেজিস্টার করে নেয়।
   base হলো "সব দোয়া দেখুন" লিংকের ভিত্তি, যেমন '/salat#'। */
const EXTRA = [];
export function registerDuas(list, base = '#') {
  EXTRA.push({ list, base });
}
function findDua(id) {
  const core = DUAS.find(x => x.id === id);
  if (core) return { d: core, base: '/dua#' };
  for (const g of EXTRA) {
    const hit = g.list.find(x => x.id === id);
    if (hit) return { d: hit, base: g.base };
  }
  return null;
}

function build() {
  if (box) return;
  box = document.createElement('div');
  box.className = 'dm-scrim';
  box.hidden = true;
  box.innerHTML = `
    <div class="dm" role="dialog" aria-modal="true" aria-labelledby="dmTitle" tabindex="-1">
      <div class="dm-head">
        <h3 id="dmTitle"></h3>
        <button class="icon-btn dm-x" type="button" aria-label="বন্ধ করুন">✕</button>
      </div>
      <div class="dm-body" id="dmBody"></div>
      <div class="dm-foot">
        <a class="btn btn-ghost dm-full" href="/dua">সব দোয়া দেখুন →</a>
        <button class="btn btn-primary dm-ok" type="button">বুঝেছি</button>
      </div>
    </div>`;
  document.body.appendChild(box);
  panel = box.querySelector('.dm');

  box.addEventListener('click', e => { if (e.target === box) close(); });
  box.querySelector('.dm-x').addEventListener('click', close);
  box.querySelector('.dm-ok').addEventListener('click', close);
  addEventListener('keydown', e => {
    if (box.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') trap(e);
  });
}

/* মডালের ভেতরেই ফোকাস আটকে রাখা */
function trap(e) {
  const f = [...panel.querySelectorAll('a[href],button,[tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.disabled && el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function render(d) {
  const words = (d.w || []).map(([a, m]) =>
    `<span class="w"><span class="wa">${a}</span><span class="wb">${esc(m)}</span></span>`).join('');
  return `
    ${d.when ? `<p class="when">${esc(d.when)}</p>` : ''}
    ${d.ar && d.ar !== '—' ? `<div class="ar-box"><p class="ar">${d.ar}</p></div>` : ''}
    <div class="row-tr"><b>বাংলা উচ্চারণ</b><p class="translit" style="margin:0">${esc(d.tr)}</p></div>
    <div class="row-tr"><b>অর্থ</b><p class="meaning" style="margin:0">${esc(d.bn)}</p></div>
    ${words ? `<div class="wbw-head">শব্দে শব্দে অর্থ</div><div class="wbw">${words}</div>` : ''}
    ${d.virtue ? `<div class="note tip"><p><strong>ফজিলত ও সূত্র:</strong> ${d.virtue}</p></div>` : ''}
    ${d.note ? `<div class="note"><p>${d.note}</p></div>` : ''}
    <p class="src">📖 সূত্র: ${esc(d.src)}</p>`;
}

export function openDua(id) {
  const found = findDua(id);
  if (!found) return false;
  const { d, base } = found;
  build();
  lastFocus = document.activeElement;
  box.querySelector('#dmTitle').textContent = (d.star ? '★ ' : '') + d.title;
  box.querySelector('#dmBody').innerHTML = render(d);
  box.querySelector('.dm-full').href = base + d.id;
  box.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => { box.classList.add('open'); panel.focus(); });
  return true;
}

export function close() {
  if (!box || box.hidden) return;
  box.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { box.hidden = true; }, 180);
  lastFocus?.focus?.();
}

/**
 * পেজে দোয়ার চিপগুলো মডালে খোলার ব্যবস্থা করে।
 * @param {(id:string)=>void} [onOpen] — অ্যানালিটিক্সের জন্য ঐচ্ছিক কলব্যাক
 */
export function initDuaModal(onOpen) {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="/dua#"]');
    if (!a) return;
    /* নতুন ট্যাবে খোলার চেষ্টা হলে ব্রাউজারকেই করতে দিন */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const id = (a.getAttribute('href').split('#')[1] || '').trim();
    if (!id) return;
    if (openDua(id)) {
      e.preventDefault();
      onOpen?.(id);
    }
    /* দোয়া না পেলে preventDefault হয় না — লিংক আগের মতোই কাজ করে */
  });
}
