import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9DNAvs2Ryd-jTweyv2aF7OHegZN0b8JY",
  authDomain: "my-grocery-home.firebaseapp.com",
  projectId: "my-grocery-home",
  storageBucket: "my-grocery-home.appspot.com",
  messagingSenderId: "888361723877",
  appId: "1:888361723877:web:930792430b39fbd20df10c",
  measurementId: "G-QNMK83BJ7K",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export { firebaseApp, auth, firestore };
