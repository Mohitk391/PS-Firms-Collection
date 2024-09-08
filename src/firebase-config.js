// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2HdVB2YRvOmTQsWVOpcwSzTSiEHjZ0FY",
  authDomain: "ps-firms-collection-2c107.firebaseapp.com",
  projectId: "ps-firms-collection-2c107",
  storageBucket: "ps-firms-collection-2c107.appspot.com",
  messagingSenderId: "1071101243122",
  appId: "1:1071101243122:web:9ac462b3f5df376d6d6a6b",
  measurementId: "G-PG05BL3P95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);