
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration.
// This is hardcoded to ensure it's always available and prevent configuration errors.
const firebaseConfig = {
  "projectId": "sirachat",
  "appId": "1:600267541023:web:ca1101b27fc02585efe32a",
  "storageBucket": "sirachat.firebasestorage.app",
  "apiKey": "AIzaSyC3_IgR7xCt32tMAkyRh2CxY4WbgFYQdSg",
  "authDomain": "sirachat.firebaseapp.com",
  "messagingSenderId": "600267541023"
};

// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth, app };
