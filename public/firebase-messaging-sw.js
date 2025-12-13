importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDZL1LABaV-qLmZlloijXKCAFARJlnijHs",
  authDomain: "adan-df538.firebaseapp.com",
  projectId: "adan-df538",
  storageBucket: "adan-df538.firebasestorage.app",
  messagingSenderId: "1001227591136",
  appId: "1:1001227591136:web:1dc18ea264a25bb6a11f85",
  measurementId: "G-LEBJFB7B31"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  // Puedes mostrar una notificación aquí si lo deseas
});