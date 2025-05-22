import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// 🔐 Configurația ta Firebase (copiată din Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBnU_ho4Ak1cre7p8bdOtFzc9RK3ch1RBE",
  authDomain: "vvshop-c1dd3.firebaseapp.com",
  projectId: "vvshop-c1dd3",
  storageBucket: "vvshop-c1dd3.firebasestorage.app",
  messagingSenderId: "230348847074",
  appId: "1:230348847074:web:1ab5e74efdd4671fd06bbb",
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
