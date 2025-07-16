import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

export default function RegisterForm({ onClose, redirectTo = "/home" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const { getAuth, createUserWithEmailAndPassword } = await import(
        "firebase/auth"
      );
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Importă Firestore dinamic
      const { getFirestore, doc, setDoc } = await import("firebase/firestore");
      const db = getFirestore();

      // Creează documentul userului în Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user", // sau orice altceva vrei să salvezi
      });

      setSuccess("Cont creat cu succes! Te poți autentifica.");
      if (redirectTo) {
        navigate(redirectTo);
      }
      if (typeof onClose === "function") {
        onClose();
      }
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
      className="flex flex-col gap-5 max-w-sm mx-auto mt-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 p-6 animate-fade-in-up"
    >
      <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-orange-200 focus-within:ring-2 focus-within:ring-orange-400 transition">
        <Mail className="w-5 h-5 text-orange-500 mr-2" />
        <input
          type="email"
          placeholder="Email"
          className="bg-transparent outline-none flex-1 text-black placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-orange-200 focus-within:ring-2 focus-within:ring-orange-400 transition">
        <Lock className="w-5 h-5 text-orange-500 mr-2" />
        <input
          type="password"
          placeholder="Parolă"
          className="bg-transparent outline-none flex-1 text-black placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2 px-3 animate-fade-in">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 text-sm text-center bg-green-50 rounded-lg py-2 px-3 animate-fade-in">
          {success}
        </p>
      )}
      <button
        type="submit"
        className="bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-xl font-semibold text-lg shadow hover:from-orange-500 hover:to-orange-600 transition-all tracking-wide mt-2"
      >
        Creează cont
      </button>
    </form>
  );
}
