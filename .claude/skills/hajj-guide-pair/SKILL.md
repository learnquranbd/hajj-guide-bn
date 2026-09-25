---
name: hajj-guide-pair
description: Use whenever editing the Hajj Guide site in /var/www/html/learnquranbd/hajj (Bangla) or /var/www/html/learnquranbd/hajj-en (English). These two repos are a mirrored pair — any content, data or layout change to one MUST be ported to the other in the same session. Also covers deploying either edition.
---

# Hajj Guide — the Bangla and English repos are a mirrored pair

There are two editions of this site. They are the **same site in two languages**,
not two independent projects.

| | Bangla | English |
|---|---|---|
| working copy | `/var/www/html/learnquranbd/hajj` | `/var/www/html/learnquranbd/hajj-en` |
| GitHub | `learnquranbd/hajj-guide-bn` | `learnquranbd/hajj-guide` |
| Firebase project | `hajj-guide-bn` | `hajj-guide-en` |
| Hosting site | `hajj-guide-bn` | `hajj-guide` |
| live URL | https://hajj-guide-bn.web.app | https://hajj-guide.web.app |
| localStorage key | `hajj-guide-bn:v1` | `hajj-guide-en:v1` |
| SW cache | `hajj-guide-v<N>` | `hajj-guide-v<N>` |
| UI font | Hind Siliguri | Inter |
| digits | Bengali (০১২৩) | Western (0123) |
| GA4 | tag in every page `<head>` | none yet — see `public/js/firebase-config.js` |

## The rule

**A change to one edition is not finished until the same change is in the other.**

That covers: content and rulings, new or edited `data-*.js` entries, page layout,
CSS, `shell.js` navigation, new pages, `sitemap.xml`, and bug fixes. If you fix a
typo in a Bangla dua's `when:` field, the English `when:` for the same `id` needs
the same correction.

If you genuinely cannot port a change in the same session, say so explicitly in
your final message and in the commit body — do not let the pair drift silently.

## Why porting is mechanical

The two repos are structurally identical by design:

- Same file names, same directory layout.
- Same object keys, same `id:` values, same array order, same array lengths.
- **The field named `bn:` kept its name in the English repo**, where it holds the
  *English* meaning. It was deliberately not renamed to `en:` so the two editions
  stay diffable line for line.
- Arabic (`ar:`, and the first element of every `w:` pair) is byte-identical
  across both repos.
- `kind:` badge values are `'Fard' | 'Wajib' | 'Sunnah'` in English and the
  Bangla equivalents in Bangla; the lookup tables in `qiran/ifrad/umrah/salat.html`
  and `KIND_CLASS` in `data-steps.js` are keyed on those display strings, so the
  two must move together.

So the usual workflow is: make the change in one repo, then open the same file at
the same entry in the other and mirror it.

## Checking the pair has not drifted

```bash
cd /var/www/html/learnquranbd
# same file set
diff <(cd hajj && git ls-files) <(cd hajj-en && git ls-files)

# same exports, array lengths and id sets, per data file
node - <<'NODE'
const fs=require('fs');
const A='/var/www/html/learnquranbd/hajj/public/js',B='/var/www/html/learnquranbd/hajj-en/public/js';
(async()=>{for(const f of fs.readdirSync(A).filter(f=>f.endsWith('.js')).sort()){
  if(!fs.existsSync(`${B}/${f}`)){console.log('MISSING in English:',f);continue;}
  let a,b;try{a=await import(`file://${A}/${f}`);b=await import(`file://${B}/${f}`);}catch{continue;}
  const ka=Object.keys(a).sort().join(),kb=Object.keys(b).sort().join();
  if(ka!==kb){console.log(`${f}: exports differ`,ka,'vs',kb);continue;}
  for(const k of Object.keys(a)) if(Array.isArray(a[k])){
    if(a[k].length!==b[k].length) console.log(`${f}.${k}: ${a[k].length} vs ${b[k].length}`);
    const ids=v=>v.filter(o=>o&&typeof o==='object'&&'id'in o).map(o=>o.id).join('|');
    if(ids(a[k])!==ids(b[k])) console.log(`${f}.${k}: id sets differ`);
  }}})();
NODE
```

The English repo must also contain no Bengali characters:

```bash
grep -rnP '[\x{0980}-\x{09FF}]' hajj-en/public --exclude-dir=img | head
```

## The "More" menu links the two together

`shell.js` in each repo ends its `MORE` array with an entry pointing at the sister
site (`🇬🇧 English version` / `🇧🇩 Bangla edition`). `extAttr()` gives any `http`
href `target="_blank"`. If you add nav entries, keep the sister entry last.

## Deploying

Each repo deploys to its own Firebase site. Bump the asset version first when any
CSS or JS changed, or browsers keep the stale file:

```bash
cd /var/www/html/learnquranbd/hajj-en     # or .../hajj
./bump-version.sh <N>                     # rewrites ?v= refs and the sw.js cache name
firebase deploy --only hosting
```

`hajj-en/firebase.json` pins `"site": "hajj-guide"`, so its deploy lands on
hajj-guide.web.app rather than the project default.

The Bangla site is live and has real users — do not deploy it without the user
explicitly asking for that deploy.

## Word-by-word rule (both editions)

Every Arabic quotation must carry a word-by-word gloss: `w: [['<arabic>','<gloss>'], …]`,
Arabic words in the sentence's right-to-left order. Joining the Arabic side must
reproduce the `ar:` field. Honorifics in English: the Prophet ﷺ, `(ra)`, `(as)`.
