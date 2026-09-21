/* অগ্রগতি সংরক্ষণ — localStorage সর্বদা, Firestore ঐচ্ছিকভাবে।
   CLOUD_SYNC বন্ধ বা ব্যর্থ হলে অ্যাপ নিঃশব্দে localStorage-এ চলতে থাকে। */
import { firebaseConfig, CLOUD_SYNC } from './firebase-config.js?v=10';

const KEY = 'hajj-guide-bn:v1';
let cloud = null;            // { db, uid }
const listeners = new Set();

function readLocal() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
  catch { return {}; }
}
function writeLocal(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ব্যক্তিগত উইন্ডো */ }
}

let state = readLocal();

export function get(id) { return !!state[id]; }
export function all() { return { ...state }; }

export function set(id, value) {
  if (value) state[id] = true; else delete state[id];
  writeLocal(state);
  listeners.forEach(fn => fn(state));
  if (cloud) push();
}

export function onChange(fn) { listeners.add(fn); fn(state); return () => listeners.delete(fn); }

async function push() {
  try {
    const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await setDoc(doc(cloud.db, 'pilgrims', cloud.uid), { progress: state, updatedAt: Date.now() }, { merge: true });
  } catch (e) { console.warn('[hajj] ক্লাউডে সংরক্ষণ করা যায়নি, লোকাল কপি অক্ষত:', e.message); }
}

/* Analytics + (ঐচ্ছিক) Firestore — ব্যর্থ হলে পুরো অ্যাপ চালু থাকে */
export async function initFirebase() {
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    const app = initializeApp(firebaseConfig);

    if (!CLOUD_SYNC) return;

    const [{ getAuth, signInAnonymously, onAuthStateChanged },
           { getFirestore, doc, getDoc }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
    ]);
    const auth = getAuth(app);
    const db = getFirestore(app);
    await signInAnonymously(auth);
    onAuthStateChanged(auth, async user => {
      if (!user) return;
      cloud = { db, uid: user.uid };
      const snap = await getDoc(doc(db, 'pilgrims', user.uid));
      const remote = snap.exists() ? (snap.data().progress || {}) : {};
      state = { ...remote, ...state };       // লোকাল পরিবর্তন অগ্রাধিকার পায়
      writeLocal(state);
      listeners.forEach(fn => fn(state));
      push();
    });
  } catch (e) {
    console.warn('[hajj] Firebase চালু হয়নি — অফলাইন মোডে চলছে:', e.message);
  }
}
