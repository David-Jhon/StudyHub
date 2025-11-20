import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBCNzl0c_0IPttAC5XiHn5TyvGJxfJVJL4",
    authDomain: "class-materials-gallery.firebaseapp.com",
    projectId: "class-materials-gallery",
    storageBucket: "class-materials-gallery.firebasestorage.app",
    messagingSenderId: "859362558919",
    appId: "1:859362558919:web:0800a890b70cd5a69e8fe2",
    measurementId: "G-GPVE41YKJ4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
