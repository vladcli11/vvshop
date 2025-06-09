import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function LoginForm({ onClose, redirectTo = "/home" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔍 Verifică dacă există document Firestore pentru user
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        // Creează documentul cu rol implicit
        await setDoc(userRef, {
          email: user.email,
          role: user.email === "scvvshopsrl@gmail.com" ? "owner" : "user",
        });
      }

      if (typeof onClose === "function") {
        onClose();
      }
    } catch (err) {
      console.error("❌ Eroare la autentificare Google:", err);
      setError("Autentificarea cu Google a eșuat. Încearcă din nou.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // șterge eroarea anterioară

    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (redirectTo) {
        navigate(redirectTo);
      }

      if (typeof onClose === "function") {
        onClose();
      }
    } catch (err) {
      console.error("❌ Firebase error:", err.code, err.message);

      if (err.code === "auth/user-not-found") {
        setError("Acest email nu este înregistrat.");
      } else if (err.code === "auth/wrong-password") {
        setError("Parolă incorectă.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email invalid.");
      } else {
        setError("Eroare la autentificare: " + err.message);
      }
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col max-w-sm gap-4 mx-auto mt-8"
    >
      <input
        type="email"
        id="email"
        name="email"
        placeholder="Email"
        className="px-3 py-2 text-black border border-gray-300 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Parolă"
        className="px-3 py-2 text-black border border-gray-300 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        className="py-2 text-white transition bg-green-600 rounded hover:bg-green-700"
      >
        Conectează-te
      </button>
      <div className="mt-2 text-sm text-center text-gray-500">sau</div>

      <button
        type="button"
        onClick={loginWithGoogle}
        className="flex items-center justify-center w-full gap-3 px-4 py-2 mt-3 text-white bg-red-700 rounded hover:bg-red-800"
      >
        <img
          src="	https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
          alt="Google logo"
          className="w-5 h-5"
        />
        <span className="text-sm font-medium">Intra in cont cu Google</span>
      </button>
    </form>
  );
}
