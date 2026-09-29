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

const firebaseConfig = {
  apiKey: "AIzaSyCnAo4n5M1NtevgFHaRSXrI6II3rz1Kauc",
  authDomain: "nysl-app-8c3dc.firebaseapp.com",
  databaseURL: "https://nysl-app-8c3dc-default-rtdb.firebaseio.com",
  projectId: "nysl-app-8c3dc",
  storageBucket: "nysl-app-8c3dc.firebasestorage.app",
  messagingSenderId: "417341191888",
  appId: "1:417341191888:web:8ea6361f79ed2779edd0d5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const database = getDatabase(app);

export const signInWithGoogle = () =>
  signInWithPopup(auth, new GoogleAuthProvider());

export const signOut = () => firebaseSignOut(auth);

export const useUserState = () => {
  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  return [user];
};

const useGameList = (folder, gameId, user) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const listRef = ref(database, `${folder}/${gameId}`);

    const stopListening = onValue(
      listRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        const list = Object.entries(data)
          .map(([key, item]) => ({ key, ...item }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setItems(list);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return stopListening;
  }, [folder, gameId, user]);

  return [items, loading];
};

export const useMessages = (gameId, user) => useGameList('messages', gameId, user);

export const usePictures = (gameId, user) => useGameList('pictures', gameId, user);

export const postMessage = (gameId, user, text) =>
  push(ref(database, `messages/${gameId}`), {
    author: user.displayName || user.email,
    email: user.email,
    text,
    timestamp: serverTimestamp()
  });

export const postPicture = (gameId, user, url, caption) =>
  push(ref(database, `pictures/${gameId}`), {
    author: user.displayName || user.email,
    email: user.email,
    url,
    caption,
    timestamp: serverTimestamp()
  });