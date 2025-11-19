importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBQlA3DcPBt_7XZqrrlHSdopOIOSh0-tzs",
  authDomain: "adanbackend.firebaseapp.com",
  projectId: "adanbackend",
  storageBucket: "adanbackend.firebasestorage.app",
  messagingSenderId: "1006787845290",
  appId: "1:1006787845290:web:200ff9b1b401c58f7104d3",
  measurementId: "G-4110629DKC"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  // Puedes mostrar una notificación aquí si lo deseas
});