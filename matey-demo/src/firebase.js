import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYkLa3BG6n8ZmjjtQJ1FI-PRXjiy8r7XU",
  authDomain: "matey-8c8fc.firebaseapp.com",
  projectId: "matey-8c8fc",
  storageBucket: "matey-8c8fc.firebasestorage.app",
  messagingSenderId: "144514232685",
  appId: "1:144514232685:web:c32b80b84d3f6914faaa64",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);