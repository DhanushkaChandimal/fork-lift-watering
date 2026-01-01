import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwW-Mz5x3X19nvKFnaBaY0PHp9XWLKbwU",
  authDomain: "forklift-water-management.firebaseapp.com",
  projectId: "forklift-water-management",
  storageBucket: "forklift-water-management.firebasestorage.app",
  messagingSenderId: "876168814882",
  appId: "1:876168814882:web:3d8edc107e003185b5057b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Secondary app for creating users without affecting current session
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

export { auth, db, secondaryAuth };