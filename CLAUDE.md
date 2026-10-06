# Hajj Guide — project map

Read this instead of re-scanning the tree. It is the same in both repos.
Deploy, the BN↔EN pairing rule, and the word-by-word rule live in the
`hajj-guide-pair` skill — this file is the architecture and module inventory.

## What it is
A static, offline-first PWA guide to Hajj at-Tamattu (plus Umrah, salah, duas,
ziyarat, maps). **No build step, no framework, no bundler.** Plain HTML +
vanilla ES modules + one CSS file. Served by Firebase Hosting. Just edit files
under `public/` and deploy.

## The pair (see hajj-guide-pair skill for the full rule)
- BN: `/var/www/html/learnquranbd/hajj` → hajj-guide-bn.web.app
- EN: `/var/www/html/learnquranbd/hajj-en` → hajj-guide.web.app
- Structurally identical: same files, same `id:`/key sets, same array order &
  length. `bn:` field holds the English text in the EN repo (kept its name so
  the two stay diffable). Arabic is byte-identical across both.
- **Any change to one edition must be ported to the other in the same session.**

## How a page boots
Each `public/<name>.html` is self-contained: `<head>` has SEO/OG meta + fonts +
`/css/style.css`, then one `<script type="module">` that does:
```js
import { mount } from '/js/shell.js?v=N';
import { SOME_DATA } from '/js/data-<name>.js?v=N';
mount(...);            // shell renders header/nav/drawer/footer/theme + this page's body
```
`shell.js` is the site shell (header, nav drawer, help menu, share rail, footer,
theme toggle, analytics init). Data lives in `data-*.js`; pages only render it.

## Directories
- `public/*.html` — one file per page/module (SEO + module bootstrap).
- `public/js/data-*.js` — all content/rulings as exported arrays/objects. **Content edits happen here.**
- `public/js/*.js` — logic: `shell.js`, `store.js`, `analytics.js`, `firebase-config.js`, shared renderers.
- `public/css/style.css` — the only stylesheet (theme tokens, all layout).
- `public/img/`, `public/img/places/` — art + ziyarat photos (`-450` = mobile srcset).
- `public/sw.js` — service worker (offline). `manifest.webmanifest` — PWA.
- root: `firebase.json`, `firestore.rules`, `bump-version.sh`, `README.md`.

## Logic modules (public/js)
| file | role |
|---|---|
| `shell.js` | Header/nav (`PAGES` desktop + `MORE` dropdown, last MORE entry = sister site), help menu (Saudi/BD emergency numbers), share rail, theme toggle, `mount()`. |
| `store.js` | Progress persistence. `get/set/all/onChange`. Always localStorage (`hajj-guide-bn:v1` / `-en:v1`); Firestore only if `CLOUD_SYNC`. |
| `firebase-config.js` | Firebase keys + flags `CLOUD_SYNC` and `OFFLINE_MODE`. |
| `analytics.js` | Thin gtag wrapper `track(name, params)`. No-op if no gtag tag in `<head>`. |
| `dua-modal.js` | Opens a dua in a modal without leaving the step. |
| `ziyarat-render.js` | Shared ziyarat-place card renderer, used by both `/map` and `/madinah`. |

## Content data files (public/js/data-*.js)
| file | exports | covers |
|---|---|---|
| `data-steps.js` | `PHASES`, `KIND_CLASS` | 17 steps of Hajj at-Tamattu; `KIND_CLASS` maps Fard/Wajib/Sunnah badge → css. |
| `data-umrah.js` | `UMRAH_INTRO/STEPS/NOTES` | standalone Umrah. |
| `data-hajj-types.js` | `COMPARE`, `QIRAN`, `IFRAD` | the three Hajj types + comparison (feeds /qiran, /ifrad). |
| `data-dua.js` | `DUAS`, `CATS` | Hajj/Umrah duas (ar + word-by-word + meaning). |
| `data-salat.js` | `POSE`, `SALAT_*`, `SURAHS`, `RAKAT_TABLE`, `HAJJ_SALAT`, `POSE_NAME` | full salah module. |
| `data-janazah.js` | `JANAZAH_INTRO/FLOW/DUAS/NOTES` | funeral prayer. |
| `data-arabic.js` | `IMAM_CALLS`, `PHRASE_CATS`, `PHRASES`, `GREET_LANGS`, `GREETINGS` | spoken Arabic in the Haramain + greetings in Malay/Indonesian/Turkish/Urdu/Persian/Hausa. |
| `data-timeline.js` | `TIMELINE` | hour-by-hour 6-day schedule. |
| `data-ziyarat.js` | `MAKKAH_ZIYARAT`, `ZIYARAT_ADAB` | Makkah-area ziyarat. |
| `data-madinah-ziyarat.js` | `MADINAH_ZIYARAT`, `MADINAH_ADAB` | Madinah ziyarat. |
| `data-quran-hadith.js` | `SOURCE_CATS`, `VERSES`, `HADITHS` | source compilation (/sources). |
| `data-faq.js` | `FAQ_CATS`, `FAQS` | Q&A. |
| `data-terms.js` | `TERM_GROUPS`, `TERMS` | glossary. |
| `data-inspiration.js` | `INSPIRE_CATS`, `INSPIRE` | spiritual prep (/inspire). |
| `data-checklist.js` | `GROUPS` | prep/deeds checklist (uses `store.js`). |
| `data-tools.js` | `TOOL_CATS`, `TOOLS`, `PLACE_CITIES`, `PLACES` | apps & online tools + popular non-ziyarat places (/tools). |

## Pages (nav = shell.js PAGES + MORE)
Desktop nav: `/` `/steps` `/umrah` `/rules` `/dua` `/salat` `/map`.
More menu: `/timeline` `/qiran` `/ifrad` `/arabic` `/inspire` `/sources`
`/madinah` `/faq` `/terms` `/tips` `/tools` `/checklist` + sister-site link (last).
Also: `/404`, `/offline`. `sitemap.xml` lists 19 URLs.

## Conventions
- **Every Arabic quote** carries `w: [['<arabic>','<gloss>'], …]` word-by-word (RTL order; joined Arabic must equal `ar:`). Honorifics EN: the Prophet ﷺ, `(ra)`, `(as)`.
- **Kind badges**: `'Fard'|'Wajib'|'Sunnah'` (EN) / Bangla equivalents (BN); lookup tables in qiran/ifrad/umrah/salat.html and `KIND_CLASS` are keyed on the display strings — move them together.
- **Asset versioning**: every `/css` & `/js` ref carries `?v=N`; `sw.js` `CACHE = 'hajj-guide-vN'`. After any CSS/JS change run `./bump-version.sh <N+1>` (rewrites `?v=` refs + SW cache), else browsers keep stale files.
- **Feature flags** (firebase-config.js): `CLOUD_SYNC=false` (localStorage only), `OFFLINE_MODE=true` (SW on). Same in both repos.
- BN: Hind Siliguri font, Bengali digits ০১২৩. EN: Inter font, Western digits.

## /arabic "Talk with fellow pilgrims" + /tools (added 2026-10-06)
- `GREETINGS` (58) in `data-arabic.js`, filtered by `GREET_CATS`: greet 22 · chat 12 ·
  ibadah 12 · help 12. Each entry: `ar` + `tr` + `w` (word-by-word rule applies) and one
  `[text, pronunciation]` pair per `GREET_LANGS` key — `ms` `idn` `tur` `ur` `fa` `hau`.
  `GREET_LANGS` carries `code` (BCP-47, used for `lang=` and TTS) and `rtl` (Urdu, Persian).
  Pronunciation is Bangla script in BN and English respelling in EN; the phrase text
  itself is byte-identical across both repos.
- Fonts on /arabic only: Noto Nastaliq Urdu (ur), Vazirmatn (fa); Latin languages use a
  system sans (`.gl-t`) for ü ş ı ğ / ɓ ɗ ƙ coverage.
- 🔊 `.say` buttons (greetings: Arabic + all 6 languages; survival phrases: Arabic)
  use the Web Speech API with the device's own voices — no audio files. No matching
  voice → button greyed (`.no-voice`) and a toast explains. Analytics: `speak`,
  `speak_novoice`, `greet_filter`.
- **Not yet reviewed by native speakers** (ms/idn/tur/ur/fa/hau) — Hausa is the
  weakest. Treat corrections from native speakers as high priority; fix the text in
  both repos.
- `/tools` (`data-tools.js`): `TOOLS` (12, by `TOOL_CATS`) — translation, official
  Hajj apps (Nusuk; BN "Labbaik"/hajj.gov.bd, EN "your country's app"), getting
  around, emergency (Asefni) — and `PLACES` (11, by `PLACE_CITIES`) — museums and
  sights beyond the ziyarat, each with a Google Maps search link. App facts drift:
  re-check before each Hajj season. Links only to URLs verified reachable.

## Current BN↔EN sync status (2026-10-06)
Both deployed and pushed: BN v28 (`b5124a3`), EN v5 (`94e702e`). In sync: identical
file set, matching data exports/lengths/id sets, matching feature flags, matching
sw.js strategy, both sister-links present, no Bengali leaked into the EN repo.
**One deliberate gap:** GA4 is installed in all 20 BN pages' `<head>` (tag
`G-Z5Q68K019R`; offline.html excluded) but in 0 EN pages — the EN `analytics.js` is a
silent no-op until a *separate* GA4 property is created for the English site
(documented in `hajj-en/public/js/firebase-config.js`; sharing one property would mix
audiences). This is the only missing feature; everything else mirrors.
