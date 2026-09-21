/* সাইট-শেল: হেডার, নেভিগেশন ড্রয়ার, শেয়ার রেল, ফুটার, থিম টগল */
import { initFirebase } from './store.js?v=13';
import { initAnalytics, track } from './analytics.js?v=13';

/* ডেস্কটপ নেভে সরাসরি দেখায় */
const PAGES = [
  ['/',          'হোম',        '🏠'],
  ['/steps',     'ধাপে ধাপে',  '🧭'],
  ['/umrah',     'উমরাহ',      '🕋'],
  ['/rules',     'বিধি-বিধান', '⚖️'],
  ['/dua',       'দোয়া',       '🤲'],
  ['/salat',     'নামাজ',      '🧎'],
  ['/map',       'মানচিত্র',   '🗺️']
];
/* "আরও" ড্রপডাউনে — নইলে ১২টি আইটেম নেভবারে আঁটে না */
const MORE = [
  ['/timeline',  'সময়সূচি',     '🕐'],
  ['/qiran',     'কিরান হজ',    '🔗'],
  ['/ifrad',     'ইফরাদ হজ',    '1️⃣'],
  ['/madinah',   'মদিনা',       '🕌'],
  ['/faq',       'প্রশ্নোত্তর', '❓'],
  ['/terms',     'পরিভাষা',     '📖'],
  ['/tips',      'টিপস',        '💡'],
  ['/checklist', 'চেকলিস্ট',    '✅']
];
const ALL_PAGES = [...PAGES, ...MORE];

const here = location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/') || '/';

/* ---------- আইকন ---------- */
const ICON = {
  facebook: '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/>',
  whatsapp: '<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.1.1.6-.1 1.2z"/>',
  telegram: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 6.9-1.6 7.5c-.1.5-.4.7-.9.4l-2.4-1.8-1.2 1.1c-.1.1-.2.2-.5.2l.2-2.5 4.5-4c.2-.2 0-.3-.3-.1l-5.5 3.5-2.4-.7c-.5-.2-.5-.5.1-.8l9.4-3.6c.4-.2.8.1.6.8z"/>',
  x: '<path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.1L4.7 21H1.5l7.5-8.6L1.1 3h6.6l4.5 5.6L17.5 3zm-1.1 16.1h1.8L7.7 4.8H5.8l10.6 14.3z"/>',
  link: '<path d="M10.6 13.4a1 1 0 0 1 0-1.4l3-3a1 1 0 0 1 1.4 1.4l-3 3a1 1 0 0 1-1.4 0zM8 16a4 4 0 0 1 0-5.7l2-2a1 1 0 1 1 1.4 1.4l-2 2A2 2 0 0 0 12.3 14l2-2a1 1 0 0 1 1.4 1.4l-2 2A4 4 0 0 1 8 16zm8-8a4 4 0 0 1 0 5.7l-.6.6a1 1 0 0 1-1.4-1.4l.6-.6A2 2 0 0 0 11.7 10l-.6.6A1 1 0 0 1 9.7 9.2l.6-.6A4 4 0 0 1 16 8z"/>',
  share: '<path d="M18 16.1c-.8 0-1.5.3-2 .8l-7.1-4.2c0-.2.1-.4.1-.7s0-.5-.1-.7L16 7.2c.5.5 1.2.8 2 .8a3 3 0 1 0-3-3c0 .3 0 .5.1.7L8.1 9.9a3 3 0 1 0 0 4.2l7.1 4.2c0 .2-.1.4-.1.6a2.9 2.9 0 1 0 2.9-2.8z"/>'
};
const svg = (d, s = 18) =>
  `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor" aria-hidden="true">${d}</svg>`;


/* ---------- সহায়তা: অ্যাপ, জরুরি নম্বর ও হজ মিশন ----------
   বাংলাদেশের নম্বরগুলো hajj.gov.bd/contact থেকে নেওয়া। */
const HELP = [
  { h: 'অ্যাপ ও পোর্টাল', items: [
    ['🕋','Nusuk — সৌদি সরকারি অ্যাপ','https://www.nusuk.sa','পারমিট'],
    ['📱','Labbaik — বাংলাদেশ হজ অ্যাপ','https://hajj.gov.bd/hajj-initiatives/labbayk-app',''],
    ['🏛️','hajj.gov.bd — হজ পোর্টাল','https://hajj.gov.bd',''],
    ['📲','ই-হজ বিডি অ্যাপস','https://hajj.gov.bd/ehaj-apps',''],
    ['🛡️','Tawakkalna — সৌদি সেবা অ্যাপ','https://ta.sdaia.gov.sa','']
  ]},
  { h: 'জরুরি নম্বর — সৌদি আরব', items: [
    ['🚨','সমন্বিত জরুরি সেবা','tel:911','৯১১'],
    ['🚑','অ্যাম্বুলেন্স — রেড ক্রিসেন্ট','tel:997','৯৯৭'],
    ['🏥','স্বাস্থ্য মন্ত্রণালয়','tel:937','৯৩৭'],
    ['🔥','সিভিল ডিফেন্স','tel:998','৯৯৮']
  ]},
  { h: 'বাংলাদেশ হজ মিশন', items: [
    ['🕋','হজ মিশন — মক্কা','tel:+966544255633','মক্কা'],
    ['🕌','হজ মিশন — মদিনা','tel:+966537209810','মদিনা'],
    ['✈️','হজ মিশন — জেদ্দা','tel:+966503570580','জেদ্দা'],
    ['💻','আইটি হেল্প ডেস্ক — মক্কা','tel:+966564270251','']
  ]},
  { h: 'বাংলাদেশ থেকে', items: [
    ['☎️','হজ কল সেন্টার','tel:16136','১৬১৩৬'],
    ['🌍','বিদেশ থেকে কল','tel:+8809602666707',''],
    ['🏢','হজ অফিস, ঢাকা','tel:+880248958462',''],
    ['🩺','স্বাস্থ্য বিভাগ, হজ অফিস','tel:+88027912132','']
  ]}
];

function helpMenu() {
  const grp = g => `<div class="help-grp"><h5>${g.h}</h5>` +
    g.items.map(([i, t, href, tag]) => {
      const ext = href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${ext}><span class="ico">${i}</span>${t}` +
             (tag ? `<small>${tag}</small>` : '') + `</a>`;
    }).join('') + `</div>`;
  return `<div class="help-panel" id="helpPanel" hidden role="menu" aria-label="সহায়তা">
    ${HELP.map(grp).join('')}
    <p class="help-note">জরুরি অবস্থায় আগে <strong>৯১১</strong>-এ কল করুন, তারপর মুয়াল্লিম ও হজ মিশনকে জানান।
    নম্বরগুলো hajj.gov.bd অনুযায়ী; যাত্রার আগে একবার মিলিয়ে নিন।</p>
  </div>`;
}

/* ---------- থিম ---------- */
function applyTheme(val) {
  document.documentElement.setAttribute('data-theme', val);
  try { localStorage.setItem('hajj-theme', val); } catch {}
  const b = document.getElementById('themeBtn');
  if (b) { b.textContent = val === 'dark' ? '☀' : '☾'; b.setAttribute('aria-label', val === 'dark' ? 'লাইট থিম' : 'ডার্ক থিম'); }
}
/* ডিফল্ট থিম কিসওয়া (কালো) — ব্যবহারকারী চাইলে পার্চমেন্ট (হালকা) বেছে নিতে পারেন */
function currentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

/* ---------- হেডার ---------- */
function header() {
  const link = ([href, label, ico], mobile) =>
    `<a href="${href}"${href === here ? ' aria-current="page"' : ''}>` +
    (mobile ? `<span class="nav-ico">${ico}</span>` : '') + label + `</a>`;
  return `<header class="topbar"><div class="wrap">
    <a class="brand" href="/"><span class="brand-mark">🕋</span>
      <span class="brand-txt">হজ গাইড<small>হজ্জে তামাত্তু · বাংলা</small></span></a>
    <nav class="nav-desk">${PAGES.map(p => link(p, false)).join('')}
      <div class="more-wrap">
        <button class="more-btn" id="moreBtn" aria-expanded="false" aria-haspopup="true"
                ${MORE.some(([h]) => h === here) ? 'data-here="true"' : ''}>আরও<span class="caret">▼</span></button>
        <div class="more-panel" id="morePanel" hidden role="menu" aria-label="আরও পৃষ্ঠা">
          ${MORE.map(([h, l, i]) =>
            `<a href="${h}"${h === here ? ' aria-current="page"' : ''}><span class="ico">${i}</span>${l}</a>`).join('')}
        </div>
      </div>
    </nav>
    <div class="help-wrap">
      <button class="icon-btn" id="helpBtn" aria-label="সহায়তা ও জরুরি নম্বর"
              aria-expanded="false" aria-haspopup="true" title="সহায়তা ও জরুরি নম্বর">🆘</button>
      ${helpMenu()}
    </div>
    <button class="icon-btn" id="themeBtn" aria-label="থিম পরিবর্তন">☾</button>
    <button class="icon-btn nav-toggle" id="navBtn" aria-label="মেনু খুলুন" aria-expanded="false" aria-controls="navDrawer">
      <span class="bars"><i></i><i></i><i></i></span>
    </button>
  </div></header>
  <div class="nav-scrim" id="navScrim" hidden></div>
  <aside class="nav-drawer" id="navDrawer" hidden aria-label="মূল মেনু">
    <div class="drawer-head"><span class="brand-mark">🕋</span><b>হজ গাইড</b>
      <button class="icon-btn" id="navClose" aria-label="মেনু বন্ধ করুন">✕</button></div>
    <nav class="nav-mob">
      ${PAGES.map(p => link(p, true)).join('')}
      <p class="grp-lbl">আরও</p>
      ${MORE.map(p => link(p, true)).join('')}
    </nav>
    <p class="drawer-foot">লাব্বাইক আল্লাহুম্মা লাব্বাইক</p>
  </aside>`;
}

/* ---------- শেয়ার ---------- */
function shareRail() {
  const btn = (cls, label, href, icon) =>
    `<a class="sh ${cls}" href="${href}" target="_blank" rel="noopener" aria-label="${label}" title="${label}">${icon}</a>`;
  return `<div class="share-rail" id="shareRail">
    <span class="share-lbl">শেয়ার</span>
    ${btn('fb','ফেসবুকে শেয়ার','#',svg(ICON.facebook))}
    ${btn('wa','হোয়াটসঅ্যাপে শেয়ার','#',svg(ICON.whatsapp))}
    ${btn('tg','টেলিগ্রামে শেয়ার','#',svg(ICON.telegram))}
    ${btn('xx','X-এ শেয়ার','#',svg(ICON.x))}
    <button class="sh cp" id="copyLink" aria-label="লিংক কপি করুন" title="লিংক কপি করুন">${svg(ICON.link)}</button>
  </div>
  <button class="share-fab" id="shareFab" aria-label="শেয়ার করুন">${svg(ICON.share, 20)}</button>`;
}

function wireShare() {
  const url = location.href.split('#')[0];
  const title = document.title;
  const u = encodeURIComponent(url), t = encodeURIComponent(title);
  const set = (sel, href) => { const a = document.querySelector(sel); if (a) a.href = href; };
  set('.share-rail .fb', `https://www.facebook.com/sharer/sharer.php?u=${u}`);
  set('.share-rail .wa', `https://wa.me/?text=${t}%20${u}`);
  set('.share-rail .tg', `https://t.me/share/url?url=${u}&text=${t}`);
  set('.share-rail .xx', `https://twitter.com/intent/tweet?url=${u}&text=${t}`);

  document.getElementById('shareRail')?.addEventListener('click', e => {
    const a = e.target.closest('.sh');
    if (a) track('share_click', { method: a.classList[1] || 'unknown' });
  });

  const copy = document.getElementById('copyLink');
  copy?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(url); toast('লিংক কপি হয়েছে ✓'); }
    catch { toast('কপি করা যায়নি'); }
  });

  const fab = document.getElementById('shareFab');
  fab?.addEventListener('click', async () => {
    if (navigator.share) {
      try { await navigator.share({ title, url }); return; } catch { /* বাতিল করেছেন */ }
    }
    document.getElementById('shareRail')?.classList.toggle('open');
  });
}

function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast'; el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ---------- ফুটার ---------- */
function footer() {
  const links = a => a.map(([h, l, i]) => `<a href="${h}">${i} ${l}</a>`).join('');
  return `<footer class="foot"><div class="wrap">
  <div class="foot-grid">
    <div>
      <h4>🕋 হজ গাইড — বাংলা</h4>
      <p style="margin:0">হজ্জে তামাত্তুর পূর্ণাঙ্গ বাংলা নির্দেশিকা — ধাপে ধাপে করণীয়, ফরজ-ওয়াজিব,
      শব্দে শব্দে দোয়া ও নামাজের অর্থ, মিনা-আরাফাতের মানচিত্র এবং মদিনা যিয়ারত।</p>
      <p class="ar-mark">لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ</p>
    </div>
    <div><h4>পৃষ্ঠাসমূহ</h4>${links(ALL_PAGES.slice(0, 6))}</div>
    <div><h4>আরও</h4>${links(ALL_PAGES.slice(6))}</div>
  </div>
  <hr class="divider">
  <p class="muted" style="margin:0">
    এই সাইটের তথ্য কুরআন, সহীহ হাদীস ও প্রচলিত ফিকহি গ্রন্থের ভিত্তিতে সংকলিত; মাযহাবি বিধান মূলত
    হানাফি মত অনুসারে। মাসআলা-সংক্রান্ত চূড়ান্ত সিদ্ধান্তের জন্য আপনার নির্ভরযোগ্য আলেম বা
    হজ গাইডের পরামর্শ নিন। মানচিত্রগুলো পরিকল্পনামূলক স্কেচ — GPS-নির্ভুল নয়।
  </p>
  </div></footer>`;
}

/* ---------- মাউন্ট ---------- */
export function mount() {
  /* Firebase SDK-র জন্য অপেক্ষা না করে সাথে সাথেই — পেজভিউ যেন না হারায় */
  initAnalytics();

  try {
    const saved = localStorage.getItem('hajj-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  } catch {}

  document.body.insertAdjacentHTML('afterbegin', header());
  document.body.insertAdjacentHTML('beforeend', shareRail() + footer());

  applyTheme(currentTheme());
  document.getElementById('themeBtn').addEventListener('click', () =>
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark'));

  /* ড্রয়ার */
  const btn = document.getElementById('navBtn');
  const drawer = document.getElementById('navDrawer');
  const scrim = document.getElementById('navScrim');
  const open = on => {
    drawer.hidden = !on; scrim.hidden = !on;
    void drawer.offsetHeight;          // রিফ্লো — rAF থ্রটল হলেও ট্রানজিশন নির্ভরযোগ্য থাকে
    drawer.classList.toggle('open', on);
    scrim.classList.toggle('open', on);
    btn.setAttribute('aria-expanded', String(on));
    btn.classList.toggle('is-open', on);
    document.body.style.overflow = on ? 'hidden' : '';
    if (on) drawer.querySelector('a')?.focus();
  };
  btn.addEventListener('click', () => open(drawer.hidden));
  scrim.addEventListener('click', () => open(false));
  document.getElementById('navClose').addEventListener('click', () => open(false));
  drawer.addEventListener('click', e => { if (e.target.closest('a')) open(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) open(false); });

  /* "আরও" ড্রপডাউন */
  const mBtn = document.getElementById('moreBtn');
  const mPan = document.getElementById('morePanel');
  const mOpen = on => {
    mPan.hidden = !on;
    mBtn.setAttribute('aria-expanded', String(on));
    mBtn.classList.toggle('is-open', on);
  };
  mBtn.addEventListener('click', e => { e.stopPropagation(); mOpen(mPan.hidden); });
  document.addEventListener('click', e => {
    if (!mPan.hidden && !e.target.closest('.more-wrap')) mOpen(false);
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !mPan.hidden) mOpen(false); });

  /* সহায়তা মেনু */
  const hBtn = document.getElementById('helpBtn');
  const hPan = document.getElementById('helpPanel');
  const hOpen = on => {
    hPan.hidden = !on;
    hBtn.setAttribute('aria-expanded', String(on));
    hBtn.classList.toggle('is-open', on);
  };
  hBtn.addEventListener('click', e => {
    e.stopPropagation();
    const opening = hPan.hidden;
    hOpen(opening);
    if (opening) track('help_open');
  });
  hPan.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    track('help_link', {
      label: (a.textContent || '').trim().slice(0, 40),
      kind: a.getAttribute('href').startsWith('tel:') ? 'phone' : 'app'
    });
    hOpen(false);
  });
  document.addEventListener('click', e => {
    if (!hPan.hidden && !e.target.closest('.help-wrap')) hOpen(false);
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !hPan.hidden) hOpen(false); });

  wireShare();
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
