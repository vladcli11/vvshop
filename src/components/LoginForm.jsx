import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-config";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Poți seta redirect sau închide modalul aici
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Acest email nu este înregistrat.");
      } else if (err.code === "auth/wrong-password") {
        setError("Parolă incorectă.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email invalid.");
      } else {
        setError("Eroare la autentificare. Încearcă din nou.");
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
        placeholder="Email"
        className="border border-gray-300 text-black px-3 py-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
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
