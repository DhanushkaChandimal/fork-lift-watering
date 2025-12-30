import { initializeApp } from "firebase/app";
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

export { db };