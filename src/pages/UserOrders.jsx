import { useEffect, useState } from "react";
import useAuth from "../context/useAuth";
import Footer from "../components/Footer";
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
        console.error("❌ Eroare la preluarea comenzilor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-white px-6 pb-10 pt-6">
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
            Comenzile mele
          </h1>
        </div>
        <p className="text-center text-sm text-gray-500">
          Ai {orders.length} comandă{orders.length === 1 ? "" : "ri"}{" "}
          înregistrat{orders.length === 1 ? "" : "e"}
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
                className="w-full flex justify-between items-center text-left px-5 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:brightness-110 text-white font-semibold text-sm sm:text-base tracking-wide transition-all"
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

      <Footer />
    </div>
  );
}
