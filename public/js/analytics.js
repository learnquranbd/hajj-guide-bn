/* Google Analytics (GA4) — নিরাপদ মোড়ক
   ------------------------------------------------------------------
   কেন Firebase Analytics SDK ব্যবহার করা হচ্ছে না:
   ওই SDK রানটাইমে Firebase-এর webConfig এন্ডপয়েন্ট থেকে measurementId
   আনে এবং লোকাল মানের চেয়ে সেটিকেই প্রাধান্য দেয়। GA যুক্ত করার পর ওই
   এন্ডপয়েন্টে আইডিটি পৌঁছাতে অনেক সময় লাগে; ততক্ষণ SDK `id=undefined`
   নিয়ে চালু হয় এবং একটি ইভেন্টও যায় না।
   তাই measurementId দিয়ে সরাসরি gtag.js চালু করা হয় — ডেটা ঠিক একই
   GA4 প্রপার্টিতেই যায়, Firebase Console-এর Analytics ট্যাবেও দেখা যায়।

   নীতি:
   ১) measurementId না থাকলে সবকিছু নিঃশব্দে নিষ্ক্রিয় — কোনো পেজ ভাঙে না।
   ২) স্ক্রিপ্ট আসার আগের কলগুলোও হারায় না — gtag নিজেই dataLayer-এ জমা রাখে।
   ৩) কোনো ব্যক্তিগত তথ্য পাঠানো হয় না — নাম, নম্বর, পাসপোর্ট কিছুই নয়;
      শুধু "কী ঘটল" সেটুকু।
   ------------------------------------------------------------------ */
import { firebaseConfig } from './firebase-config.js?v=9';

const ID = firebaseConfig.measurementId || '';
let on = false;

/** Analytics চালু করে। store.js থেকে একবারই ডাকা হয়। */
export function initAnalytics() {
  if (on) return;
  if (!ID) {
    console.info('[hajj] Analytics নিষ্ক্রিয় — firebase-config.js-এ measurementId বসানো হয়নি।');
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  /* gtag.js আসার আগেই কলগুলো dataLayer-এ জমা থাকে, স্ক্রিপ্ট এলে একসাথে প্রক্রিয়া হয় */
  gtag('js', new Date());
  gtag('config', ID, { anonymize_ip: true });
  on = true;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ID)}`;
  s.onerror = () => console.warn('[hajj] gtag.js লোড হয়নি — অ্যাড-ব্লকার থাকতে পারে।');
  document.head.appendChild(s);
}

/**
 * একটি ইভেন্ট পাঠায়।
 * @param {string} name   ইভেন্টের নাম — snake_case, ৪০ অক্ষরের মধ্যে
 * @param {object} params অতিরিক্ত তথ্য — শুধু গণনাযোগ্য মান, ব্যক্তিগত কিছু নয়
 */
export function track(name, params = {}) {
  if (!on) return;
  try { window.gtag('event', name, params); }
  catch (e) { console.warn('[hajj] ইভেন্ট পাঠানো যায়নি:', name, e.message); }
}
