
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"


const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "chatapp-b13e9.firebaseapp.com",
  projectId: "chatapp-b13e9",
  storageBucket: "chatapp-b13e9.appspot.com",
  messagingSenderId: "1063530025936",
  appId: "1:1063530025936:web:4657425b010f4f9af4dfd5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

