import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// 🔐 Configurația ta Firebase (copiată din Firebase Console)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 🧱 Inițializează aplicația Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Activează doar autentificarea (nu avem nevoie de analytics acum)
export const auth = getAuth(app);

const ai = getAI(app, { backend: new GoogleAIBackend() });

// Exportă modelul generativ (ex: Gemini 2.0 Flash)
export const geminiModel = getGenerativeModel(ai, {
  model: "gemini-2.0-flash",
});
