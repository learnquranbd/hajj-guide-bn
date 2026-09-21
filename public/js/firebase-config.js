/* Firebase Web App — Hajj Guide BN
   প্রজেক্ট: hajj-guide-bn  |  কনসোল: https://console.firebase.google.com/project/hajj-guide-bn
   নোট: apiKey গোপন কিছু নয় — এটি ক্লায়েন্ট-সাইড আইডেন্টিফায়ার মাত্র।
   প্রকৃত নিরাপত্তা আসে firestore.rules ফাইল থেকে। */
export const firebaseConfig = {
  apiKey: "AIzaSyDDlbWRnMe2-yZi87BuQQxyyae__nnUUJU",
  authDomain: "hajj-guide-bn.firebaseapp.com",
  projectId: "hajj-guide-bn",
  storageBucket: "hajj-guide-bn.firebasestorage.app",
  messagingSenderId: "351232948145",
  appId: "1:351232948145:web:aa3fd6e92542d1836f6f90",

  /* Google Analytics — চালু আছে।
     কনসোল: https://console.firebase.google.com/project/hajj-guide-bn/analytics
     মনে রাখুন: প্রকৃত ট্যাগটি প্রতিটি HTML পেজের <head>-এ বসানো আছে।
     আইডি বদলালে দুই জায়গাতেই বদলাতে হবে:
       grep -rl G-Z5Q68K019R public/ */
  measurementId: "G-Z5Q68K019R"
};

/* ক্লাউড সিঙ্ক চালু করতে হলে:
   ১) Firebase Console → Build → Firestore Database → Create database
   ২) Build → Authentication → Sign-in method → Anonymous → Enable
   ৩) নিচের ফ্ল্যাগটি true করুন, তারপর: firebase deploy
   বন্ধ থাকলে অ্যাপ শুধু ব্রাউজারের localStorage-এ অগ্রগতি সংরক্ষণ করবে। */
export const CLOUD_SYNC = false;

/* অফলাইনে পড়ার ব্যবস্থা (সার্ভিস ওয়ার্কার) — মিনা-আরাফাতে নেটওয়ার্ক থাকে না বলে
   public/sw.js লেখা হয়েছে, কিন্তু এখনো আসল ব্রাউজারে পরীক্ষা করা যায়নি।
   সার্ভিস ওয়ার্কার একবার ভুলভাবে বসে গেলে ব্যবহারকারীর ব্রাউজারে আটকে থাকে ও
   সরানো কঠিন — তাই পরীক্ষা না করে চালু করা হয়নি।

   চালু করতে: নিচের মানটি true করুন, তারপর একটি ফোনে খুলে
   (১) পেজ কয়েকটি ঘুরে দেখুন, (২) ফ্লাইট মোড চালু করুন,
   (৩) পেজগুলো এখনো খোলে কিনা দেখুন। ঠিক থাকলেই deploy করুন। */
export const OFFLINE_MODE = false;
