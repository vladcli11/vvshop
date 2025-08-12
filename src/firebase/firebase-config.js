import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

// Lazy services (importă pachetele doar când ai nevoie)
export async function getAuthAsync() {
  const { getAuth } = await import("firebase/auth");
  return getAuth(getFirebaseApp());
}

export async function getDbAsync() {
  const { getFirestore } = await import("firebase/firestore");
  return getFirestore(getFirebaseApp());
}

export async function getStorageAsync() {
  const { getStorage } = await import("firebase/storage");
  return getStorage(getFirebaseApp());
}

export async function getFunctionsAsync() {
  const { getFunctions } = await import("firebase/functions");
  return getFunctions(getFirebaseApp(), "europe-west1");
}
