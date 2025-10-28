// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkvOrIVmtECH2kNiUzxoxT2TVGmeVpAOE",
  authDomain: "codeblocking-e23a8.firebaseapp.com",
  projectId: "codeblocking-e23a8",
  storageBucket: "codeblocking-e23a8.firebasestorage.app",
  messagingSenderId: "616499680669",
  appId: "1:616499680669:web:89b05b2c5a78e4d6428b74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
