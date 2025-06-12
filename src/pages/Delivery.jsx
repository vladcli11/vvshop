import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useCart from "../context/useCart";
import { db, functions } from "../firebase/firebase-config";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import useAuth from "../context/useAuth";
import { httpsCallable } from "firebase/functions";
import SelectEasyBoxMap from "../components/SelectEasyBoxMap";

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
    metodaLivrare: "domiciliu",
    locker: null,
  });
  const [showThankYou, setShowThankYou] = useState(false);
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [discount, setDiscount] = useState(0);
  const [promoStatus, setPromoStatus] = useState("");
  const { currentUser } = useAuth();
  // 🟢 Preluam datele utilizatorului curent daca este autentificat
  useEffect(() => {
    const userEmail = currentUser?.email;
    if (userEmail && form.email === "") {
      setForm((prev) => ({ ...prev, email: userEmail }));
    }
  }, [currentUser, form.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "metodaLivrare" && value !== "easybox") {
      setForm((prev) => ({ ...prev, [name]: value, locker: null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.metodaLivrare === "easybox" && !form.locker) {
      alert(
        "Te rugăm să selectezi un locker Easybox înainte de a trimite comanda."
      );
      return;
    }

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
      cartItems.reduce((s, i) => s + i.pret * (i.quantity || 1), 0) *
      (1 - discount / 100);

    if (form.plata === "card") {
      const stripe = await stripePromise;
      const lineItems = cartItems.map((item) => ({
        nume: item.nume,
        pret: item.pret,
        quantity: item.quantity || 1,
      }));

      try {
        const response = await fetch(
          "https://europe-west1-vvshop-srl.cloudfunctions.net/createCheckoutSession",
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
        const comandaRef = await addDoc(collection(db, "comenzi"), {
          ...form,
          produse: cartItems,
          discount,
          totalFinal,
          data: serverTimestamp(),
          uid: currentUser?.uid || null,
          accountEmail: currentUser?.email || null,
        });
        console.log("🟢 Test: Intrat în blocul ramburs");
        try {
          const genereazaAwb = httpsCallable(functions, "generateAwb");
          const awbResponse = await genereazaAwb({
            nume: form.nume,
            telefon: form.telefon,
            email: form.email,
            judet: form.judet,
            localitate: form.localitate,
            strada: form.adresa,
            codAmount: totalFinal,
            greutate: 1.2,
          });

          if (awbResponse.data.success) {
            await updateDoc(comandaRef, {
              awb: awbResponse.data.awbNumber,
            });
            console.log(
              "✅ AWB generat și salvat:",
              awbResponse.data.awbNumber
            );
          } else {
            console.warn("⚠️ Generarea AWB a eșuat:", awbResponse.data.error);
          }
        } catch (err) {
          console.error("❌ Eroare la generare AWB:", err);
        }

        setShowThankYou(true);
        clearCart();
      } catch (err) {
        console.error("❌ Eroare la salvarea comenzii:", err);
        alert("A apărut o eroare la trimiterea comenzii. Încearcă din nou.");
      }
    }
  };

  const subtotal = cartItems.reduce(
    (s, i) => s + i.pret * (i.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen px-6 pb-6 bg-white">
      <Header />

      <div className="relative w-full pb-6 my-4">
        <div className="absolute inset-0 flex items-center -mx-6">
          <div className="flex-grow h-[2px] bg-gradient-to-r from-green-400 to-green-600" />
          <span className="px-2 text-base tracking-wider text-gray-600 uppercase whitespace-nowrap">
            Date de livrare
          </span>
          <div className="flex-grow h-[2px] bg-gradient-to-r from-blue-600 to-blue-400" />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-md gap-4 mx-auto mt-6"
      >
        <input
          type="text"
          name="nume"
          placeholder="Nume"
          value={form.nume}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="prenume"
          placeholder="Prenume"
          value={form.prenume}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="adresa"
          placeholder="Adresă"
          value={form.adresa}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="judet"
          placeholder="Județ"
          value={form.judet}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="localitate"
          placeholder="Localitate"
          value={form.localitate}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="tel"
          name="telefon"
          placeholder="Telefon"
          value={form.telefon}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded"
        />

        <div className="flex items-center gap-2">
          <input
            type="text"
            name="codPromo"
            placeholder="Cod promoțional"
            value={form.codPromo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />

          <button
            type="button"
            onClick={async () => {
              setPromoStatus("loading");
              const res = await fetch(
                "https://europe-west1-vvshop-srl.cloudfunctions.net/validatePromoCode",
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
            className="px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Verifică
          </button>
        </div>

        <div className="mt-4">
          <p className="font-semibold text-black">Metodă de livrare:</p>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="radio"
              name="metodaLivrare"
              value="domiciliu"
              checked={form.metodaLivrare === "domiciliu"}
              onChange={handleChange}
            />
            Livrare la domiciliu
          </label>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="radio"
              name="metodaLivrare"
              value="easybox"
              checked={form.metodaLivrare === "easybox"}
              onChange={handleChange}
            />
            Livrare la Easybox
          </label>
        </div>

        {form.metodaLivrare === "easybox" && (
          <SelectEasyBoxMap
            clientId="VVSHOP-CLIENT-ID" // înlocuiește cu cel primit de la Sameday
            judet={form.judet}
            localitate={form.localitate}
            onSelect={(locker) => setForm((prev) => ({ ...prev, locker }))}
          />
        )}
        {form.locker && (
          <p className="mt-2 text-sm text-gray-700">
            🧾 Locker selectat: <strong>{form.locker.name}</strong>,{" "}
            {form.locker.address}, {form.locker.city}
          </p>
        )}

        {promoStatus === "success" && (
          <p className="mt-1 text-sm text-green-600">
            ✅ Cod aplicat: {discount}% reducere
          </p>
        )}
        {promoStatus === "error" && (
          <p className="mt-1 text-sm text-red-600">
            ❌ Cod invalid sau expirat
          </p>
        )}

        <div className="p-4 mt-4 space-y-1 text-sm font-medium text-gray-700 border border-gray-300 rounded bg-gray-50">
          {discount > 0 && (
            <>
              <p className="text-green-700">
                🎁 Reducere aplicată: {discount}%
              </p>
              <p className="font-bold text-green-800">
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
          className="py-2 text-white transition bg-green-600 rounded hover:bg-green-700"
        >
          Trimite comanda
        </button>
      </form>

      <Footer />

      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-sm p-6 text-center bg-white rounded-lg shadow-lg">
            <button
              onClick={() => {
                setShowThankYou(false);
                navigate("/");
              }}
              className="absolute text-xl top-2 right-3"
            >
              ✖
            </button>
            <h2 className="mb-4 text-lg font-bold">🎉 Comandă finalizată!</h2>
            <p className="mb-4 text-gray-600">Îți mulțumim pentru comandă!</p>
            <button
              onClick={() => {
                setShowThankYou(false);
                navigate("/");
              }}
              className="px-4 py-2 text-white transition bg-green-600 rounded hover:bg-green-700"
            >
              Mergi la pagina principală
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
