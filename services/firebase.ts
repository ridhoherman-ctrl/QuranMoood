
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// KONFIGURASI FIREBASE
// Dapatkan config ini dari Firebase Console (Project Settings > General > Your Apps)
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export type UserStatus = 'pending' | 'approved' | 'blocked';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  status: UserStatus;
  requestedAt: number;
}

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Cek apakah user sudah ada di database
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      // Jika user baru, simpan dengan status pending
      const newUser: UserProfile = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "User",
        photoURL: user.photoURL || "",
        status: 'pending',
        requestedAt: Date.now()
      };
      await setDoc(doc(db, "users", user.uid), newUser);
    }
    return user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);
