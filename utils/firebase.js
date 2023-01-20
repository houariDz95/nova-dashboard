import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBEFNvMD80WgRGb-4pqTZ7k_3UQJziDxHc",
  authDomain: "nova-deshboard.firebaseapp.com",
  projectId: "nova-deshboard",
  storageBucket: "nova-deshboard.appspot.com",
  messagingSenderId: "200869862803",
  appId: "1:200869862803:web:59b492bbf0aa160e7b9c66",
  measurementId: "G-ZNTT5DRLTB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export  {db}