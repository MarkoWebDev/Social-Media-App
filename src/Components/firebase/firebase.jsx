import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCw-OOkR7wruJik6wgQVFdgpQEqhIy6O0c",
  authDomain: "social-media-app-f9911.firebaseapp.com",
  projectId: "social-media-app-f9911",
  storageBucket: "social-media-app-f9911.appspot.com",
  messagingSenderId: "817710885780",
  appId: "1:817710885780:web:7f9275bbcadb854268bd81",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, onAuthStateChanged };
