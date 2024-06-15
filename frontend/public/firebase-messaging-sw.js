importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

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
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click Received.', event.notification.data);
  event.notification.close();

  // Handle click action based on the data payload
  const clickAction = event.notification.data.click_action;
  if (clickAction === 'OPEN_URL') {
    event.waitUntil(clients.openWindow('/'));
  } else {
    // Default action, focus on existing window if open or open new window
    event.waitUntil(clients.openWindow('/'));
  }
});
