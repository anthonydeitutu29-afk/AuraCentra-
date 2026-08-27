import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const fallbackConfig = {
  apiKey: "AIzaSyDummyKeyForVercelBuild",
  authDomain: "auracentra-ghana.firebaseapp.com",
  projectId: "auracentra-ghana",
  storageBucket: "auracentra-ghana.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:000000000000"
};

const app = !getApps().length ? initializeApp(fallbackConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;


