import { useState, useEffect, lazy, Suspense } from "react";
import useCart from "../context/useCart";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

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
  const SelectEasyBoxMap = lazy(() => import("../components/SelectEasyBoxMap"));

  // Preiau datele utilizatorului curent daca este autentificat
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

    // ✅ Validări rapide (rămân la fel)
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

    //  Totalurile
    const totalProduse = cartItems.reduce(
      (s, i) => s + i.pret * (i.quantity || 1),
      0
    );
    const costTransport = totalProduse >= 50 ? 0 : 15;
    const discountValue = (totalProduse * discount) / 100;
    const totalFinal = totalProduse - discountValue + costTransport;

    const { getFirestore, collection, addDoc, serverTimestamp } = await import(
      "firebase/firestore"
    );
    const db = getFirestore();

    // ─────────────────────────────────────────────────────────────────────────────
    //                PLATA CU CARDUL — FĂRĂ @stripe/stripe-js
    // ─────────────────────────────────────────────────────────────────────────────
    if (form.plata === "card") {
      const lineItems = cartItems.map((item) => ({
        nume: item.nume,
        pret: item.pret,
        quantity: item.quantity || 1,
      }));

      try {
        // 🔁 Creezi sesiunea la Cloud Function care întoarce { url, id }
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
        if (!data?.url || !data?.id) {
          throw new Error("Sesiunea Stripe nu a întors URL-ul de Checkout.");
        }

        // 🟢 Salvezi comanda ca „așteptare plată” (ca la tine)
        await addDoc(collection(db, "comenzi"), {
          ...form,
          produse: cartItems,
          discount,
          totalFinal,
          status: "asteptare_plata",
          stripeSessionId: data.id, // vei folosi sesiunea în webhook
          data: serverTimestamp(),
          uid: currentUser?.uid || null,
          accountEmail: currentUser?.email || null,
        });

        // 🚀 Redirecționare directă către pagina Stripe (fără stripe.js)
        window.location.assign(data.url);
        return; // IMPORTANT: ieșim din funcție, ca să nu intre în else-ul de mai jos
      } catch (err) {
        console.error("❌ Eroare Stripe:", err);
        alert("Eroare la inițierea plății. Încearcă din nou.");
        return;
      }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    //                ALTFEL (RAMBURS) — EXACT CA ÎNAINTE
    // ─────────────────────────────────────────────────────────────────────────────
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

      console.log("🟢 Comanda salvată fără AWB automat");
      setShowThankYou(true);
      clearCart();
    } catch (err) {
      console.error("❌ Eroare la salvarea comenzii:", err);
      alert("A apărut o eroare la trimiterea comenzii. Încearcă din nou.");
    }
  };

  const totalProduse = cartItems.reduce(
    (s, i) => s + i.pret * (i.quantity || 1),
    0
  );
  const costTransport = totalProduse >= 50 ? 0 : 15;
  const discountValue = (totalProduse * discount) / 100;
  const totalFinal = totalProduse - discountValue + costTransport;

  return (
    <div className="px-2 sm:px-6 pb-6 bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-lg gap-4 mx-auto mt-10 bg-white border border-gray-200 rounded-2xl shadow-lg p-4 sm:p-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="nume"
            placeholder="Nume"
            value={form.nume}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 outline-none"
          />
          <input
            type="text"
            name="prenume"
            placeholder="Prenume"
            value={form.prenume}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 outline-none"
          />
          <input
            type="text"
            name="adresa"
            placeholder="Adresă"
            value={form.adresa}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 outline-none col-span-1 sm:col-span-2"
          />
          <input
            type="text"
            name="judet"
            placeholder="Județ"
            value={form.judet}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 outline-none"
          />
          <input
            type="text"
            name="localitate"
            placeholder="Localitate"
            value={form.localitate}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 outline-none"
          />
          <input
            type="tel"
            name="telefon"
            placeholder="Telefon"
            value={form.telefon}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            name="codPromo"
            placeholder="Cod promoțional"
            value={form.codPromo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 outline-none"
          />
          <button
            type="button"
            onClick={async () => {
              setPromoStatus("loading");
              console.log("Verific cod promo:", form.codPromo);
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
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Verifică
          </button>
        </div>
        {promoStatus === "success" && (
          <p className="mt-1 text-sm text-green-600">
            ✅ Cod aplicat: {discount}% reducere
          </p>
        )}
        {promoStatus === "error" && (
          <p className="mt-1 text-sm text-red-600">Cod invalid sau expirat</p>
        )}

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
          <Suspense
            fallback={
              <div className="mt-2 text-sm text-gray-600">
                Se încarcă harta Easybox...
              </div>
            }
          >
            <div
              className="easybox-scope mt-2"
              onClick={(e) => {
                const btn = e.target.closest("button");
                if (!btn) return;
                const t = (btn.getAttribute("type") || "").toLowerCase();
                if (!t || t === "submit") e.preventDefault(); // oprește submit-ul formularului
              }}
            >
              <SelectEasyBoxMap
                clientId={import.meta.env.VITE_SAMEDAY_CLIENT_ID}
                judet={form.judet}
                localitate={form.localitate}
                locker={form.locker}
                setLocker={(locker) => setForm((prev) => ({ ...prev, locker }))}
              />
            </div>
          </Suspense>
        )}
        {form.locker && (
          <p className="mt-2 text-sm text-gray-700">
            🧾 Locker selectat: <strong>{form.locker.name}</strong>,{" "}
            {form.locker.address}, {form.locker.city}
          </p>
        )}

        <div className="p-4 mt-4 space-y-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl bg-gray-50">
          <p> Produse: {totalProduse.toFixed(2)} lei</p>
          <p>
            Transport:{" "}
            {costTransport > 0 ? (
              <span className="text-blue-600">
                {costTransport.toFixed(2)} lei
              </span>
            ) : (
              <span className="text-green-600 font-semibold">Gratuit</span>
            )}
          </p>
          {discount > 0 && (
            <p className="text-green-700">Reducere: {discount}%</p>
          )}
          <p className="font-bold text-green-800 text-lg">
            Total de plată: {totalFinal.toFixed(2)} lei
          </p>
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
            Plata cu ramburs la livrare
          </label>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="radio"
              name="plata"
              value="card"
              checked={form.plata === "card"}
              onChange={handleChange}
            />{" "}
            Plată online cu cardul
          </label>
        </div>

        <button
          type="submit"
          className="py-3 text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-sm font-bold text-lg"
        >
          Trimite comanda
        </button>
      </form>
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
