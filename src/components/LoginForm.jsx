import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function LoginForm({ onClose, redirectTo = "/home" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("✅ Google login reușit:", result.user);

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

    console.log("➡️ Trimit login:", email, password);

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
      className="flex flex-col gap-4 max-w-sm mx-auto mt-8"
    >
      <input
        type="email"
        id="email"
        name="email"
        placeholder="Email"
        className="border border-gray-300 text-black px-3 py-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Parolă"
        className="border border-gray-300 text-black px-3 py-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Conectează-te
      </button>
      <div className="text-center mt-2 text-sm text-gray-500">sau</div>

      <button
        type="button"
        onClick={loginWithGoogle}
        className="bg-red-700 hover:bg-red-800 text-white flex items-center justify-center gap-3 w-full px-4 py-2 rounded mt-3"
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
