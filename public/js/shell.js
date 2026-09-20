/* সাইট-শেল: হেডার, নেভিগেশন, ফুটার, থিম টগল */
import { initFirebase } from './store.js';

const PAGES = [
  ['/',           'হোম'],
  ['/steps',      'ধাপে ধাপে'],
  ['/rules',      'বিধি-বিধান'],
  ['/dua',        'দোয়া'],
  ['/map',        'মানচিত্র'],
  ['/tips',       'টিপস'],
  ['/checklist',  'চেকলিস্ট']
];

const here = location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/') || '/';

function theme(next) {
  const cur = document.documentElement.getAttribute('data-theme')
    || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  const val = next || (cur === 'dark' ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', val);
  try { localStorage.setItem('hajj-theme', val); } catch {}
  const b = document.getElementById('themeBtn');
  if (b) b.textContent = val === 'dark' ? '☀' : '☾';
}

function header() {
  const links = PAGES.map(([href, label]) =>
    `<a href="${href}"${href === here ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<header class="topbar"><div class="wrap">
    <a class="brand" href="/"><span class="brand-mark">🕋</span> হজ গাইড</a>
    <button class="icon-btn nav-toggle" id="navBtn" aria-label="মেনু" aria-expanded="false">☰</button>
    <button class="icon-btn" id="themeBtn" aria-label="থিম পরিবর্তন">☾</button>
    <nav class="nav" id="nav">${links}</nav>
  </div></header>`;
}

function footer() {
  const col = (t, items) => `<div><h4>${t}</h4>${items}</div>`;
  const links = a => a.map(([h, l]) => `<a href="${h}">${l}</a>`).join('');
  return `<footer class="foot"><div class="wrap"><div class="foot-grid">
    <div>
      <h4>🕋 হজ গাইড — বাংলা</h4>
      <p style="margin:0">হজ্জে তামাত্তুর পূর্ণাঙ্গ বাংলা নির্দেশিকা — ধাপে ধাপে করণীয়, ফরজ-ওয়াজিব,
      শব্দে শব্দে দোয়ার অর্থ এবং মিনা-আরাফাত-মুজদালিফার মানচিত্র।</p>
    </div>
    ${col('পৃষ্ঠাসমূহ', links(PAGES.slice(0, 4)))}
    ${col('আরও', links(PAGES.slice(4)))}
  </div>
  <hr class="divider">
  <p class="muted" style="margin:0">
    এই সাইটের তথ্য কুরআন, সহীহ হাদীস ও প্রচলিত ফিকহি গ্রন্থের ভিত্তিতে সংকলিত।
    মাসআলা-সংক্রান্ত চূড়ান্ত সিদ্ধান্তের জন্য আপনার নির্ভরযোগ্য আলেম বা হজ গাইডের পরামর্শ নিন।
    · শিক্ষামূলক উদ্দেশ্যে তৈরি · Firebase-এ হোস্টেড
  </p>
  </div></footer>`;
}

export function mount() {
  try {
    const saved = localStorage.getItem('hajj-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  } catch {}

  document.body.insertAdjacentHTML('afterbegin', header());
  document.body.insertAdjacentHTML('beforeend', footer());

  const cur = document.documentElement.getAttribute('data-theme')
    || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  const tb = document.getElementById('themeBtn');
  tb.textContent = cur === 'dark' ? '☀' : '☾';
  tb.addEventListener('click', () => theme());

  const nb = document.getElementById('navBtn'), nav = document.getElementById('nav');
  nb.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    nb.setAttribute('aria-expanded', String(open));
  });

  initFirebase();
}

/* ট্যাব হেল্পার — .tabs > .tab[data-panel] এবং .panel[id] */
export function tabs(root = document) {
  root.querySelectorAll('.tabs').forEach(bar => {
    const btns = [...bar.querySelectorAll('.tab')];
    const show = id => btns.forEach(b => {
      const on = b.dataset.panel === id;
      b.setAttribute('aria-selected', String(on));
      const p = document.getElementById(b.dataset.panel);
      if (p) p.hidden = !on;
    });
    btns.forEach(b => b.addEventListener('click', () => show(b.dataset.panel)));
    show(btns[0]?.dataset.panel);
  });
}
