// firebase.js 🔥
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Optional: If you plan to use storage
import { getAnalytics, isSupported } from "firebase/analytics"; // Optional: For web analytics

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeCq5C5MPwuLDeBddTo3madG5mJ-DRcmU",
  authDomain: "college-app-5170e.firebaseapp.com",
  databaseURL: "https://college-app-5170e-default-rtdb.firebaseio.com",
  projectId: "college-app-5170e",
  storageBucket: "college-app-5170e.appspot.com", // 🔧 corrected URL
  messagingSenderId: "588697515216",
  appId: "1:588697515216:web:8c89620bc65245b8b59ad5",
  measurementId: "G-3JVMTBG2HE"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Auth module
export const auth = getAuth(app);

// 🗄️ Firestore DB
export const db = getFirestore(app);

// ☁️ Firebase Storage (optional)
export const storage = getStorage(app);

// 📊 Analytics (optional, only if supported in environment)
export let analytics = null;
isSupported().then((yes) => {
  if (yes) analytics = getAnalytics(app);
});
