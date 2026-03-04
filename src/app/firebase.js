// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_soIfP7wS1ryZOViuff21j7a7J47JAFs",
  authDomain: "todo-41d9b.firebaseapp.com",
  projectId: "todo-41d9b",
  storageBucket: "todo-41d9b.firebasestorage.app",
  messagingSenderId: "706341846764",
  appId: "1:706341846764:web:c71e45ecefbc928d60efc9"
};


// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
