import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

export default function LoginForm({ onClose, redirectTo = "/home" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      const { GoogleAuthProvider, signInWithPopup, getAuth } = await import(
        "firebase/auth"
      );
      const { doc, getDoc, setDoc, getFirestore } = await import(
        "firebase/firestore"
      );
      const auth = getAuth();
      const db = getFirestore();

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔍 Verifică dacă există document Firestore pentru user
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
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
    setError("");

    try {
      const { getAuth, signInWithEmailAndPassword } = await import(
        "firebase/auth"
      );
      const auth = getAuth();
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
      className="flex flex-col gap-5 max-w-sm mx-auto mt-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 p-6 animate-fade-in-up"
    >
      <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-orange-200 focus-within:ring-2 focus-within:ring-orange-400 transition">
        <Mail className="w-5 h-5 text-orange-500 mr-2" />
        <input
          type="email"
          id="email"
          name="email"
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
          id="password"
          name="password"
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
      <button
        type="submit"
        className="bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-xl font-semibold text-lg shadow hover:from-orange-500 hover:to-orange-600 transition-all tracking-wide mt-2"
      >
        Conectează-te
      </button>
      <div className="mt-2 text-sm text-center text-gray-500">sau</div>
      <button
        type="button"
        onClick={loginWithGoogle}
        className="flex items-center justify-center w-full gap-3 px-4 py-3 mt-1 rounded-xl font-semibold text-base shadow bg-gray-900 text-white hover:bg-gray-800 transition-all"
      >
        <img
          src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
          alt="Google logo"
          className="w-6 h-6 bg-white rounded-full p-0.5"
        />
        <span className="font-medium">Autentificare cu Google</span>
      </button>
    </form>
  );
}
