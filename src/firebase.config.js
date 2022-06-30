
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZGRm2R6-REm4QeVVYlmdZKg6-VUO2bD8",
  authDomain: "appartment-market.firebaseapp.com",
  projectId: "appartment-market",
  storageBucket: "appartment-market.appspot.com",
  messagingSenderId: "569632984363",
  appId: "1:569632984363:web:1aac911f471b449784496e",
};

// Initialize Firebase
 initializeApp(firebaseConfig);
export const db=getFirestore()
