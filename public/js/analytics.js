/* Google Analytics (GA4) — ইভেন্ট পাঠানোর মোড়ক
   ------------------------------------------------------------------
   ট্যাগটি প্রতিটি HTML পেজের <head>-এ স্ট্যাটিকভাবে বসানো আছে
   (googletagmanager.com/gtag/js?id=G-…)। কারণ দুটি:
     ১) তাড়াতাড়ি চালু হয় — মডিউল চেইনের জন্য অপেক্ষা করতে হয় না,
        তাই পেজভিউ হারায় না।
     ২) Google-এর ট্যাগ-ডিটেকশন ও Tag Assistant স্ট্যাটিক HTML পড়ে;
        JS মডিউল থেকে ইনজেক্ট করা ট্যাগ তারা দেখতে পায় না।

   কেন Firebase Analytics SDK নয়:
   ওই SDK রানটাইমে Firebase-এর webConfig এন্ডপয়েন্ট থেকে measurementId
   আনে এবং লোকাল মানের চেয়ে সেটিকেই প্রাধান্য দেয়। GA যুক্ত করার পরেও
   ওই এন্ডপয়েন্ট measurementId ছাড়াই 200 ফেরত দিচ্ছিল — ফলে SDK
   `id=undefined` নিয়ে চালু হতো, একটি ইভেন্টও যেত না। ডেটা একই GA4
   প্রপার্টিতেই যায়, Firebase Console-এর Analytics ট্যাবেও দেখা যাবে।

   নীতি: কোনো ব্যক্তিগত তথ্য পাঠানো হয় না — নাম, নম্বর, পাসপোর্ট কিছুই নয়;
   শুধু "কী ঘটল" সেটুকু।
   ------------------------------------------------------------------ */

/** পেজের ট্যাগ প্রস্তুত কিনা। ট্যাগ না থাকলে সবকিছু নিঃশব্দে নিষ্ক্রিয়। */
function ready() {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/** shell.js থেকে একবার ডাকা হয় — শুধু অবস্থা জানানোর জন্য। */
export function initAnalytics() {
  if (!ready()) {
    console.info('[hajj] Analytics নিষ্ক্রিয় — পেজের <head>-এ gtag ট্যাগ পাওয়া যায়নি।');
  }
}

/**
 * একটি ইভেন্ট পাঠায়।
 * @param {string} name   ইভেন্টের নাম — snake_case, ৪০ অক্ষরের মধ্যে
 * @param {object} params অতিরিক্ত তথ্য — শুধু গণনাযোগ্য মান, ব্যক্তিগত কিছু নয়
 */
export function track(name, params = {}) {
  if (!ready()) return;
  try { window.gtag('event', name, params); }
  catch (e) { console.warn('[hajj] ইভেন্ট পাঠানো যায়নি:', name, e.message); }
}
