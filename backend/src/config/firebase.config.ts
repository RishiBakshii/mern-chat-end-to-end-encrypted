import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';


const app = initializeApp({
    credential:applicationDefault(),
    projectId:"baatchit-ee221"
});

export const messaging = getMessaging(app)