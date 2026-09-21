/* Firebase Analytics — নিরাপদ মোড়ক
   ------------------------------------------------------------------
   নীতি:
   ১) measurementId না থাকলে সবকিছু নিঃশব্দে নিষ্ক্রিয় — কোনো পেজ ভাঙে না।
   ২) Analytics প্রস্তুত হওয়ার আগে ঘটা ইভেন্টগুলো সারিতে জমা থাকে, পরে একসাথে যায়।
   ৩) কোনো ব্যক্তিগত তথ্য পাঠানো হয় না — নাম, নম্বর, পাসপোর্ট কিছুই নয়;
      শুধু "কী ঘটল" সেটুকু।
   ------------------------------------------------------------------ */
import { firebaseConfig } from './firebase-config.js?v=8';

const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js';
const QUEUE_MAX = 40;

let analytics = null;   // getAnalytics()-এর ফল
let logEvent = null;    // SDK-র logEvent ফাংশন
let settled = false;    // চেষ্টা শেষ হয়েছে কিনা (সফল হোক বা না হোক)
const queue = [];

/** Analytics চালু করে। store.js থেকে একবারই ডাকা হয়। */
export async function initAnalytics(app) {
  if (!firebaseConfig.measurementId) {
    console.info('[hajj] Analytics নিষ্ক্রিয় — firebase-config.js-এ measurementId বসানো হয়নি।');
    return stop();
  }
  try {
    const m = await import(SDK);
    if (!(await m.isSupported())) {
      console.info('[hajj] এই ব্রাউজারে Analytics সমর্থিত নয়।');
      return stop();
    }
    analytics = m.getAnalytics(app);
    logEvent = m.logEvent;
    settled = true;
    queue.splice(0).forEach(([name, params]) => send(name, params));
  } catch (e) {
    /* গিলে ফেলা নয় — কারণটা কনসোলে থাকুক, নইলে আবার নিঃশব্দে বন্ধ থাকবে */
    console.warn('[hajj] Analytics চালু হয়নি:', e.message);
    stop();
  }
}

function stop() {
  settled = true;
  queue.length = 0;
}

function send(name, params) {
  try { logEvent(analytics, name, params); }
  catch (e) { console.warn('[hajj] ইভেন্ট পাঠানো যায়নি:', name, e.message); }
}

/**
 * একটি ইভেন্ট পাঠায়।
 * @param {string} name   ইভেন্টের নাম — snake_case, ৪০ অক্ষরের মধ্যে
 * @param {object} params অতিরিক্ত তথ্য — শুধু গণনাযোগ্য মান, ব্যক্তিগত কিছু নয়
 */
export function track(name, params = {}) {
  if (analytics && logEvent) return send(name, params);
  if (!settled && queue.length < QUEUE_MAX) queue.push([name, params]);
}
