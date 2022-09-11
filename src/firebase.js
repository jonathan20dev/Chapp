import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCak9nYfKf3TQo4LQC_5JDspCdD4NaB5SA",
  authDomain: "chapp-680e4.firebaseapp.com",
  databaseURL: "http://chapp-680e4.firebaseio.com",
  projectId: "chapp-680e4",
  storageBucket: "chapp-680e4.appspot.com",
  messagingSenderId: "633427778119",
  appId: "1:633427778119:web:5319640de21de942f6af62",
  measurementId: "G-F8YE45B95Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };