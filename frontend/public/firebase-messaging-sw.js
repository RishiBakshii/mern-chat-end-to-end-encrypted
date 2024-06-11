importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");


// VITE_FIREBASE_API_KEY= AIzaSyC-envyTagD0ZH_-tR0S75RauPLnDPbfHc
// VITE_FIREBASE_AUTH_DOMAIN= baatchit-ee221.firebaseapp.com
// VITE_FIREBASE_PROJECT_ID= baatchit-ee221
// VITE_FIREBASE_STORAGE_BUCKET= baatchit-ee221.appspot.com
// VITE_FIREBASE_MESSAGING_SENDER_ID= 477617343716
// VITE_FIREBASE_APP_ID= 1:477617343716:web:882725090b2342d67630f1
// VITE_FIREBASE_MEASUREMENT_ID= G-NQ38JN1KB3
// VITE_FIREBASE_VAPID_KEY = BFoWTr1nBENne1Zf7j_pBvVp4jsg4Rwl2hRnzNzgLj7kWixWUvgNNX0stdiLv15U2OLP4YGP1JthG_XKb8-k1ko

const firebaseConfig = {
  apiKey: "AIzaSyC-envyTagD0ZH_-tR0S75RauPLnDPbfHc",
  authDomain: "baatchit-ee221.firebaseapp.com",
  projectId: "baatchit-ee221",
  storageBucket: "baatchit-ee221.appspot.com",
  messagingSenderId: "477617343716",
  appId: "1:477617343716:web:882725090b2342d67630f1",
  measurementId: "G-NQ38JN1KB3"
};
  
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.show(notificationTitle, notificationOptions);
});

// self.addEventListener('notificationclick', function(event) {
//   console.log('Notification click Received.', event.notification.data);
//   event.notification.close();
  
//   // This will focus on the existing window if it's open or open a new window
//   event.waitUntil(
//     clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
//       for (let i = 0; i < clientList.length; i++) {
//         const client = clientList[i];
//         if (client.url === '/' && 'focus' in client) {
//           return client.focus();
//         }
//       }
//       if (clients.openWindow) {
//         return clients.openWindow('/');
//       }
//     })
//   );
// });