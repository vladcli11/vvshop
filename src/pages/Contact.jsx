// src/pages/Contact.jsx
import { useState } from "react";
import Footer from "../components/Footer";
import useAuth from "../context/useAuth";

export default function Contact() {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    nume: "",
    email: "",
    mesaj: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.nume.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
      !form.mesaj.trim()
    ) {
      setStatus("invalid");
      return;
    }

    try {
      // Importă Firestore doar la submit
      const { getFirestore, collection, addDoc, serverTimestamp } =
        await import("firebase/firestore");
      const db = getFirestore();

      await addDoc(collection(db, "mesaje_contact"), {
        ...form,
        uid: currentUser?.uid || null,
        data: serverTimestamp(),
      });
      setStatus("success");
      setForm({ nume: "", email: "", mesaj: "" });
    } catch (err) {
      console.error("❌ Eroare Firestore:", err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 pb-6">
      <h1 className="text-3xl font-bold text-center my-6">
        Descrie problema întâmpinată
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto flex flex-col gap-4"
      >
        <input
          type="text"
          name="nume"
          placeholder="Numele tău"
          value={form.nume}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Adresa ta de email"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <textarea
          name="mesaj"
          placeholder="Mesajul tău"
          value={form.mesaj}
          onChange={handleChange}
          rows={5}
          className="border border-gray-300 px-4 py-2 rounded resize-none"
        ></textarea>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Trimite mesaj
        </button>

        {status === "success" && (
          <p className="text-green-600">✅ Mesaj trimis cu succes!</p>
        )}
        {status === "error" && (
          <p className="text-red-600">
            ❌ Eroare la trimitere. Încearcă din nou.
          </p>
        )}
        {status === "invalid" && (
          <p className="text-yellow-600">
            ⚠️ Te rugăm să completezi toate câmpurile corect.
          </p>
        )}
      </form>

      <Footer />
    </div>
  );
}
