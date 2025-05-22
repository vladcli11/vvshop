import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-config";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Cont creat cu succes! Te poți autentifica.");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Adresa de email este deja folosită.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email invalid.");
      } else if (err.code === "auth/weak-password") {
        setError("Parola trebuie să aibă cel puțin 6 caractere.");
      } else {
        setError("Eroare necunoscută. Încearcă din nou.");
      }
    }
  };

  return (
    <form
      onSubmit={handleRegister}
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
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <button
        type="submit"
        className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Creează cont
      </button>
    </form>
  );
}
