
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "reyy-s-room.firebaseapp.com",
  projectId: "reyy-s-room",
  storageBucket: "reyy-s-room.appspot.com",
  messagingSenderId: "430647701381",
  appId: "1:430647701381:web:a6f783a15ef274e7f8deec",
  measurementId: "G-FXTN5PRDT0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

