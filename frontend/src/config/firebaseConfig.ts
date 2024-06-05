
import { FirebaseApp, initializeApp } from "firebase/app";
import { Messaging, getMessaging } from "firebase/messaging";
import { env } from "./envConfig";

let app:FirebaseApp
let messaging:Messaging

if(env){

    const firebaseConfig = {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID,
      measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
    };
    
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app)
}

export {
  app,
  messaging
};

