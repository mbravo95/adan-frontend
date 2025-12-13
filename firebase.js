import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZL1LABaV-qLmZlloijXKCAFARJlnijHs",
  authDomain: "adan-df538.firebaseapp.com",
  projectId: "adan-df538",
  storageBucket: "adan-df538.firebasestorage.app",
  messagingSenderId: "1001227591136",
  appId: "1:1001227591136:web:1dc18ea264a25bb6a11f85",
  measurementId: "G-LEBJFB7B31"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken };