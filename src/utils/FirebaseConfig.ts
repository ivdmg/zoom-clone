// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJ31DWdjBToX_HypJa5ZQLYagWla_F8_A",
  authDomain: "zoom-clone-dfa0e.firebaseapp.com",
  projectId: "zoom-clone-dfa0e",
  storageBucket: "zoom-clone-dfa0e.firebasestorage.app",
  messagingSenderId: "821983976599",
  appId: "1:821983976599:web:db1a1950dc121ece40ddd2",
  measurementId: "G-V8Y69K1BDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app); 
export const firebaseDB = getFirestore(app); 

export const userRef = collection(firebaseDB, "users")
