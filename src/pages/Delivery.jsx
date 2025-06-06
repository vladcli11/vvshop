import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useCart from "../context/useCart";
import { db } from "../firebase/firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import useAuth from "../context/useAuth";

const stripePromise = loadStripe(
  "pk_test_51RUNogHJkUS6tZsDVmMisYsq1JYSmbGzoHVXtUwBJhn82ED1qAHQxqAJ2pj40OGzcIfzz5dqtDST7AezHfHmpdRI00eoo4Am7T"
);

export default function Delivery() {
  const [form, setForm] = useState({
    nume: "",
    prenume: "",
    adresa: "",
    judet: "",
    localitate: "",
    telefon: "",
    email: "",
    plata: "ramburs",
    codPromo: "",
  });
  const [showThankYou, setShowThankYou] = useState(false);
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [discount, setDiscount] = useState(0);
  const [promoStatus, setPromoStatus] = useState("");
  const { currentUser } = useAuth();
  // 🟢 Preluam datele utilizatorului curent daca este autentificat
  useEffect(() => {
    if (currentUser?.email && form.email === "") {
      setForm((prev) => ({
        ...prev,
        email: currentUser.email,
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nume, prenume, adresa, judet, localitate, telefon, email } = form;

    if (
      ![nume, prenume, adresa, judet, localitate, telefon, email].every(
        (val) => val.trim() !== ""
      )
    ) {
      alert("Te rugăm să completezi toate câmpurile.");
      return;
    }

    if (!/^[0-9]{10}$/.test(telefon)) {
      alert("Numărul de telefon trebuie să conțină exact 10 cifre.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Email-ul nu este valid.");
      return;
    }

    const totalFinal =
      cartItems.reduce((s, i) => s + i.pret, 0) * (1 - discount / 100);

    if (form.plata === "card") {
      const stripe = await stripePromise;
      const lineItems = cartItems.map((item) => ({
        nume: item.nume,
        pret: item.pret,
        quantity: 1,
      }));

      try {
        const response = await fetch(
          "https://us-central1-vvshop-srl.cloudfunctions.net/createCheckoutSession",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: lineItems,
              promoCodeText: form.codPromo,
            }),
          }
        );

        const data = await response.json();

        if (!data.id) throw new Error("Stripe nu a returnat un sessionId.");

        // 🟢 Salvăm comanda în Firestore cu status de așteptare
        await addDoc(collection(db, "comenzi"), {
          ...form,
          produse: cartItems,
          discount,
          totalFinal,
          status: "asteptare_plata",
          stripeSessionId: data.id,
          data: serverTimestamp(),
          uid: currentUser?.uid || null,
          accountEmail: currentUser?.email || null,
        });

        // 🟣 Trimite către Stripe
        await stripe.redirectToCheckout({ sessionId: data.id });
      } catch (err) {
        console.error("❌ Eroare Stripe:", err);
        alert("Eroare la inițierea plății. Încearcă din nou.");
      }
    } else {
      try {
        await addDoc(collection(db, "comenzi"), {
          ...form,
          produse: cartItems,
          discount,
          totalFinal,
          data: serverTimestamp(),
          uid: currentUser?.uid || null,
          accountEmail: currentUser?.email || null,
        });
        setShowThankYou(true);
        clearCart();
      } catch (err) {
        console.error("❌ Eroare la salvarea comenzii:", err);
        alert("A apărut o eroare la trimiterea comenzii. Încearcă din nou.");
      }
    }
  };

  const subtotal = cartItems.reduce((s, i) => s + i.pret, 0);

  return (
    <div className="min-h-screen bg-white px-6 pb-6">
      <Header />

      <div className="relative w-full my-5 pb-6">
        <div className="absolute inset-0 -mx-6 flex items-center">
          <div className="flex-grow h-[2px] bg-gradient-to-r from-green-400 to-green-600" />
          <span className="px-2 text-gray-600 text-base uppercase tracking-wider whitespace-nowrap">
            Date de livrare
          </span>
          <div className="flex-grow h-[2px] bg-gradient-to-r from-blue-600 to-blue-400" />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-6 flex flex-col gap-4"
      >
        <input
          type="text"
          name="nume"
          placeholder="Nume"
          value={form.nume}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="text"
          name="prenume"
          placeholder="Prenume"
          value={form.prenume}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="text"
          name="adresa"
          placeholder="Adresă"
          value={form.adresa}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="text"
          name="judet"
          placeholder="Județ"
          value={form.judet}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="text"
          name="localitate"
          placeholder="Localitate"
          value={form.localitate}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="tel"
          name="telefon"
          placeholder="Telefon"
          value={form.telefon}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded"
        />

        <div className="flex gap-2 items-center">
          <input
            type="text"
            name="codPromo"
            placeholder="Cod promoțional"
            value={form.codPromo}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded w-full"
          />
          <button
            type="button"
            onClick={async () => {
              setPromoStatus("loading");
              const res = await fetch(
                "https://us-central1-vvshop-srl.cloudfunctions.net/validatePromoCode",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ code: form.codPromo }),
                }
              );
              const data = await res.json();
              if (res.ok && data.discount) {
                setDiscount(data.discount);
                setPromoStatus("success");
              } else {
                setDiscount(0);
                setPromoStatus("error");
              }
            }}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          >
            Verifică
          </button>
        </div>

        {promoStatus === "success" && (
          <p className="text-green-600 text-sm mt-1">
            ✅ Cod aplicat: {discount}% reducere
          </p>
        )}
        {promoStatus === "error" && (
          <p className="text-red-600 text-sm mt-1">
            ❌ Cod invalid sau expirat
          </p>
        )}

        <div className="bg-gray-50 border border-gray-300 p-4 rounded mt-4 text-sm text-gray-700 font-medium space-y-1">
          {discount > 0 && (
            <>
              <p className="text-green-700">
                🎁 Reducere aplicată: {discount}%
              </p>
              <p className="text-green-800 font-bold">
                💰 Total cu reducere:{" "}
                {(subtotal * (1 - discount / 100)).toFixed(2)} lei
              </p>
            </>
          )}
          {discount === 0 && (
            <p className="font-bold">
              💳 Total de plată: {subtotal.toFixed(2)} lei
            </p>
          )}
        </div>

        <div>
          <p className="font-semibold text-black">Metodă de plată:</p>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="radio"
              name="plata"
              value="ramburs"
              checked={form.plata === "ramburs"}
              onChange={handleChange}
            />{" "}
            Plata la livrare (ramburs)
          </label>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="radio"
              name="plata"
              value="card"
              checked={form.plata === "card"}
              onChange={handleChange}
            />{" "}
            Plată cu cardul (Stripe)
          </label>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Trimite comanda
        </button>
      </form>

      <Footer />

      {showThankYou && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center relative w-full max-w-sm">
            <button
              onClick={() => {
                setShowThankYou(false);
                navigate("/");
              }}
              className="absolute top-2 right-3 text-xl"
            >
              ✖
            </button>
            <h2 className="text-lg font-bold mb-4">🎉 Comandă finalizată!</h2>
            <p className="text-gray-600 mb-4">Îți mulțumim pentru comandă!</p>
            <button
              onClick={() => {
                setShowThankYou(false);
                navigate("/");
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Mergi la pagina principală
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
