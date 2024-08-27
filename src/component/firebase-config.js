// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCyU5HaRvqcaQFAIS8rIc5OcHixQskWCNk",
    authDomain: "kikuyu-catholic-sheets.firebaseapp.com",
    databaseURL: "https://kikuyu-catholic-sheets-default-rtdb.firebaseio.com",
    projectId: "kikuyu-catholic-sheets",
    storageBucket: "kikuyu-catholic-sheets.appspot.com",
    messagingSenderId: "799243973483",
    appId: "1:799243973483:web:418e61f6f199f8f0c4922e",
    measurementId: "G-Q3EF1P55LS"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
