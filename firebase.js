import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBACH21P1sr8ote5xwX50LPsYTRul8PapQ",
  authDomain: "instagramclone-e6ffb.firebaseapp.com",
  projectId: "instagramclone-e6ffb",
  storageBucket: "instagramclone-e6ffb.appspot.com",
  messagingSenderId: "196235756887",
  appId: "1:196235756887:web:abf553439cfd7d0113aa12"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);