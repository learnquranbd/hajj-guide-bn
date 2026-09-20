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
  appId: "1:351232948145:web:aa3fd6e92542d1836f6f90"
};

/* ক্লাউড সিঙ্ক চালু করতে হলে:
   ১) Firebase Console → Build → Firestore Database → Create database
   ২) Build → Authentication → Sign-in method → Anonymous → Enable
   ৩) নিচের ফ্ল্যাগটি true করুন, তারপর: firebase deploy
   বন্ধ থাকলে অ্যাপ শুধু ব্রাউজারের localStorage-এ অগ্রগতি সংরক্ষণ করবে। */
export const CLOUD_SYNC = false;
