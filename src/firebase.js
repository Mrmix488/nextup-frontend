
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyC2gPz-2l2TPPbEAPovBvnjs8tcdiiYN7U",
  authDomain: "ffs-project-e51ae.firebaseapp.com",
  projectId: "ffs-project-e51ae",
  storageBucket: "ffs-project-e51ae.firebasestorage.app",
  messagingSenderId: "999697549524",
  appId: "1:999697549524:web:700ad6168d9b8bc8c09341",
  measurementId: "G-YZDN0207YE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 

export { db, auth }; 