import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnAo4n5M1NtevgFHaRSXrI6II3rz1Kauc",
  authDomain: "nysl-app-8c3dc.firebaseapp.com",
  projectId: "nysl-app-8c3dc",
  storageBucket: "nysl-app-8c3dc.firebasestorage.app",
  messagingSenderId: "417341191888",
  appId: "1:417341191888:web:8ea6361f79ed2779edd0d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Opens the Google pop-up to sign in
export const signInWithGoogle = () =>
  signInWithPopup(auth, new GoogleAuthProvider());

// Signs the current user out
export const signOut = () => firebaseSignOut(auth);

// Returns the signed-in user (or null if nobody is signed in)
export const useUserState = () => {
  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  return [user];
};