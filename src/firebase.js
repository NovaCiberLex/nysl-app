import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getDatabase, ref, onValue, push, serverTimestamp } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnAo4n5M1NtevgFHaRSXrI6II3rz1Kauc",
  authDomain: "nysl-app-8c3dc.firebaseapp.com",
  databaseURL: "https://nysl-app-8c3dc-default-rtdb.firebaseio.com",
  projectId: "nysl-app-8c3dc",
  storageBucket: "nysl-app-8c3dc.firebasestorage.app",
  messagingSenderId: "417341191888",
  appId: "1:417341191888:web:8ea6361f79ed2779edd0d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const database = getDatabase(app);

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

// Returns the messages of one game, oldest first, and keeps them up to date
export const useMessages = (gameId, user) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only signed-in users can read messages
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const messagesRef = ref(database, `messages/${gameId}`);

    // onValue runs now and again every time the messages change
    const stopListening = onValue(
      messagesRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        const list = Object.entries(data)
          .map(([key, message]) => ({ key, ...message }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setMessages(list);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return stopListening;
  }, [gameId, user]);

  return [messages, loading];
};

// Adds a new message to a game's board
export const postMessage = (gameId, user, text) =>
  push(ref(database, `messages/${gameId}`), {
    author: user.displayName || user.email,
    email: user.email,
    text,
    timestamp: serverTimestamp()
  });
