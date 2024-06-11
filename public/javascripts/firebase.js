// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDN4GrVkBdBy5G0vZb4u6sMoedcVH4UzZk",
  authDomain: "shopify-9dcbf.firebaseapp.com",
  projectId: "shopify-9dcbf",
  storageBucket: "shopify-9dcbf.appspot.com",
  messagingSenderId: "524961760425",
  appId: "1:524961760425:web:0dbb010142ff1924f655b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();


const googleLogin = document.getElementById("google-login-btn");
googleLogin.addEventListener("click",function(){
    alert(5)
})