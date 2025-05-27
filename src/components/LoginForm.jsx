import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // șterge eroarea anterioară

    console.log("➡️ Trimit login:", email, password);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Logare reușită");
      navigate("/home"); // redirecționează utilizatorul după logare
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
    </form>
  );
}
