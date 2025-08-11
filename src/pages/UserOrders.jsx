import { useEffect, useState } from "react";
import useAuth from "../context/useAuth";
import StatusBadge from "../components/StatusBadge";
import {
  Package,
  CalendarDays,
  CreditCard,
  Banknote,
  Image as ImageIcon,
} from "lucide-react";

export default function UserOrders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralCode, setReferralCode] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [stats, setStats] = useState({
    usageCount: 0,
    totalOrdersValue: 0,
    commissionEarned: 0,
  });

  // adăugat:
  const [customPart, setCustomPart] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;

      try {
        const { collection, query, where, orderBy, getDocs, updateDoc, doc } =
          await import("firebase/firestore");
        const { getFirestore } = await import("firebase/firestore");
        const db = getFirestore();

        const q = query(
          collection(db, "comenzi"),
          where("uid", "==", currentUser.uid),
          orderBy("data", "desc")
        );
        const snapshot = await getDocs(q);

        const result = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            if (!data.orderNumber) {
              const newOrderNumber = Math.floor(
                100000 + Math.random() * 900000
              );
              await updateDoc(doc(db, "comenzi", docSnap.id), {
                orderNumber: newOrderNumber,
              });
              data.orderNumber = newOrderNumber;
            }
            return { id: docSnap.id, ...data };
          })
        );

        setOrders(result);
      } catch (err) {
        console.error("Eroare la preluarea comenzilor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  useEffect(() => {
    if (!showReferralModal || !currentUser?.uid) return;

    const fetchReferralStats = async () => {
      try {
        const { getFirestore, doc, getDoc } = await import(
          "firebase/firestore"
        );
        const db = getFirestore();
        const docRef = doc(db, "referralCodes", currentUser.uid);
        const snap = await getDoc(docRef);
        let data;
        if (!snap.exists()) {
          // nu mai generăm automat; lăsăm userul să-și aleagă fragmentul
          setReferralCode(null);
          data = { usageCount: 0, totalOrdersValue: 0, commissionEarned: 0 };
        } else {
          data = snap.data();
          setReferralCode(data.referralCode);
        }
        setStats({
          usageCount: data.usageCount || 0,
          totalOrdersValue: data.totalOrdersValue || 0,
          commissionEarned: data.commissionEarned || 0,
        });
      } catch (err) {
        console.error("Eroare la citirea codului:", err.message);
      }
    };

    fetchReferralStats();
  }, [showReferralModal, currentUser]);

  // adăugat:
  const generateReferral = async () => {
    const cleaned = customPart.trim().toUpperCase();
    if (
      !cleaned ||
      cleaned.length < 4 ||
      cleaned.length > 6 ||
      !/^[A-Z0-9]+$/.test(cleaned)
    ) {
      setGenError("Folosește 4–6 caractere, doar A–Z și 0–9.");
      return;
    }
    setGenError("");
    setGenLoading(true);
    try {
      const { getFunctions, httpsCallable } = await import(
        "firebase/functions"
      );
      const functions = getFunctions(undefined, "europe-west1"); // FIX: setează regiunea
      const fn = httpsCallable(functions, "generateReferralCode");
      const res = await fn({ customPart: cleaned });
      setReferralCode(res.data.code);
    } catch (e) {
      const msg = e?.message || "";
      if (msg.includes("already-exists"))
        setGenError("Fragment ocupat. Încearcă altul.");
      else if (msg.includes("invalid-argument"))
        setGenError("Fragment invalid. Folosește 4–6 caractere A–Z/0–9.");
      else setGenError("Eroare la generare. Încearcă din nou.");
    } finally {
      setGenLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(referralCode).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1500);
      });
    } else {
      // fallback pentru browsere vechi sau context nesecurizat
      const textArea = document.createElement("textarea");
      textArea.value = referralCode;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1500);
      } catch {
        console.error("Eroare la copiere.");
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className=" bg-white px-6 pb-10 pt-6">
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex flex-col items-center gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff9800] to-[#ff5e62] rounded-xl flex items-center justify-center shadow">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
              Comenzile mele
            </h1>
          </div>
          <button
            onClick={() => setShowReferralModal(true)}
            className="bg-gradient-to-r from-[#ff9800] to-[#ff5e62] hover:brightness-110 text-white px-4 py-2 rounded text-sm sm:text-base shadow-sm active:scale-95 transition"
          >
            Codul meu referral
          </button>

          {showReferralModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div
                className="relative w-full max-w-xs sm:max-w-sm mx-2 rounded-2xl shadow-2xl p-6 flex flex-col items-center"
                style={{
                  background:
                    "linear-gradient(135deg, #ff9800 0%, #ff5e62 100%)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                }}
              >
                <button
                  onClick={() => setShowReferralModal(false)}
                  className="absolute top-3 right-4 text-2xl text-white/70 hover:text-white transition"
                  aria-label="Închide"
                >
                  ×
                </button>

                <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-4 text-center drop-shadow">
                  Codul tău referral
                </h2>

                {referralCode ? (
                  <div className="flex flex-col items-center w-full">
                    <div className="bg-white/80 border border-white/40 text-gray-800 px-6 py-3 rounded-xl font-mono text-lg sm:text-xl mb-4 shadow-inner text-center select-all">
                      {referralCode}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-base sm:text-lg font-bold text-white bg-gradient-to-r from-black via-gray-800 to-gray-900 shadow-md hover:from-gray-900 hover:to-black active:scale-95 transition-all duration-150"
                      disabled={!referralCode}
                      style={{
                        opacity: referralCode ? 1 : 0.5,
                        pointerEvents: referralCode ? "auto" : "none",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.2}
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          fill="none"
                          stroke="currentColor"
                        />
                        <rect
                          x="3"
                          y="3"
                          width="13"
                          height="13"
                          rx="2"
                          fill="none"
                          stroke="currentColor"
                        />
                      </svg>
                      {copySuccess ? "Copiat!" : "Copiază codul"}
                    </button>

                    <div className="w-full mt-2 text-sm sm:text-base text-white/90 space-y-2 text-center">
                      <p>
                        Folosit de <strong>{stats.usageCount}</strong> ori
                      </p>
                      <p>
                        Valoare generată:{" "}
                        <strong>{stats.totalOrdersValue.toFixed(2)} lei</strong>
                      </p>
                      <p>
                        Comision:{" "}
                        <strong>{stats.commissionEarned.toFixed(2)} lei</strong>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <p className="text-white/90 text-sm mb-2 text-center">
                      Alege 4–6 caractere (A–Z, 0–9).
                    </p>
                    <input
                      value={customPart}
                      onChange={(e) =>
                        setCustomPart(
                          e.target.value
                            .replace(/[^a-zA-Z0-9]/g, "")
                            .toUpperCase()
                        )
                      }
                      maxLength={6}
                      placeholder="EX: VLAD12"
                      className="w-full px-4 py-2 rounded-lg text-gray-900 bg-white/90 border border-white/40 outline-none"
                    />
                    {genError && (
                      <p className="mt-2 text-sm text-red-100 text-center">
                        {genError}
                      </p>
                    )}
                    <button
                      onClick={generateReferral}
                      disabled={genLoading}
                      className="mt-3 w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-black via-gray-800 to-gray-900 hover:from-gray-900 hover:to-black active:scale-95 transition-all disabled:opacity-60"
                    >
                      {genLoading ? "Se generează..." : "Generează codul"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500">
          Ai {orders.length} comandă{orders.length === 1 ? "" : "ri"}{" "}
          înregistrat{orders.length === 1 ? "ă" : "e"}
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Se încarcă comenzile...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">
          Nu ai nicio comandă înregistrată.
        </p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-300 shadow bg-gradient-to-tr from-white via-gray-50 to-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === index ? null : index)}
                className="w-full flex justify-between items-center text-left px-5 py-4 bg-gradient-to-r from-[#ff9800] to-[#ff5e62] hover:brightness-110 text-white font-semibold text-sm sm:text-base tracking-wide transition-all"
              >
                <span>Comanda #{order.orderNumber}</span>
                <div className="flex items-center gap-3">
                  <span>{order.totalFinal?.toFixed(2)} lei</span>
                </div>
              </button>

              {expanded === index && (
                <div className="px-5 py-5 bg-white text-sm text-gray-700 space-y-4 animate-fade-in-up">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      Plasată pe:{" "}
                      {order.data?.toDate().toLocaleDateString("ro-RO")}
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <ul className="divide-y divide-gray-200 border-t pt-3">
                    {order.produse?.map((item, idx) => (
                      <li key={idx} className="flex gap-4 items-center py-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border">
                          {item.imagine ? (
                            <img
                              src={
                                Array.isArray(item.imagine)
                                  ? item.imagine[0]
                                  : item.imagine
                              }
                              alt={item.nume}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">
                            {item.nume}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {item.pret.toFixed(2)} lei × {item.quantity || 1}
                          </p>
                        </div>
                        <div className="text-right font-semibold text-green-700">
                          {(item.pret * (item.quantity || 1)).toFixed(2)} lei
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-between items-center border-t pt-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      {(order.plata || "ramburs").toLowerCase() ===
                      "ramburs" ? (
                        <Banknote className="w-5 h-5" />
                      ) : (
                        <CreditCard className="w-5 h-5" />
                      )}
                      <span className="capitalize">
                        Plată: {order.plata || "ramburs"}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-green-700">
                      Total: {order.totalFinal?.toFixed(2)} lei
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
