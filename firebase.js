import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQlA3DcPBt_7XZqrrlHSdopOIOSh0-tzs",
  authDomain: "adanbackend.firebaseapp.com",
  projectId: "adanbackend",
  storageBucket: "adanbackend.firebasestorage.app",
  messagingSenderId: "1006787845290",
  appId: "1:1006787845290:web:200ff9b1b401c58f7104d3",
  measurementId: "G-4110629DKC"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken };