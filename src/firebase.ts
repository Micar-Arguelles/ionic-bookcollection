import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA16xQA67vAJqg6hsU05vtt49n83FWhb1E",
  authDomain: "ionic-crud-2341f.firebaseapp.com",
  databaseURL: "https://ionic-crud-2341f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ionic-crud-2341f",
  storageBucket: "ionic-crud-2341f.firebasestorage.app",
  messagingSenderId: "403159915754",
  appId: "1:403159915754:web:7d103f8b0b8046dc170b93",
  measurementId: "G-DHQ5N766XZ"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);