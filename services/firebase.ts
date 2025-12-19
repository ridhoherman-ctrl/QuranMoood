
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// KONFIGURASI FIREBASE
// Pastikan Anda mengganti ini dengan konfigurasi dari Firebase Console Anda
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

export type UserStatus = 'pending' | 'approved' | 'blocked';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  status: UserStatus;
  requestedAt: number;
}

// Fungsi Registrasi Baru
export const registerWithEmail = async (name: string, email: string, pass: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const user = result.user;

    // Update profil di Firebase Auth (untuk displayName)
    await updateProfile(user, { displayName: name });

    // Simpan ke Firestore dengan status PENDING
    const newUser: UserProfile = {
      uid: user.uid,
      email: email,
      displayName: name,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      status: 'pending',
      requestedAt: Date.now()
    };
    
    await setDoc(doc(db, "users", user.uid), newUser);
    return user;
  } catch (error: any) {
    console.error("Registration Error:", error);
    throw error;
  }
};

// Fungsi Login
export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error: any) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);
