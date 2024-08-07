// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhjgUb5MokqNzfrPCnBELBJHNwu9QdYsU",
  authDomain: "inventory-management-96061.firebaseapp.com",
  projectId: "inventory-management-96061",
  storageBucket: "inventory-management-96061.appspot.com",
  messagingSenderId: "514629920780",
  appId: "1:514629920780:web:9835e7dfd407fed0d52629",
  measurementId: "G-MQT255TXDL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

export {firestore}