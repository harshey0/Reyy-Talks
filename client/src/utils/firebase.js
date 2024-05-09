
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "reyy-talks.firebaseapp.com",
  projectId: "reyy-talks",
  storageBucket: "reyy-talks.appspot.com",
  messagingSenderId: "266441216250",
  appId: "1:266441216250:web:402eecd5d91059acecf943",
  measurementId: "G-W95DYGJWN8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

