import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import useAuth from "../context/useAuth";

import Footer from "../components/Footer";
import StatusBadge from "../components/StatusBadge";

export default function UserOrders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, "comenzi"),
          where("uid", "==", currentUser.uid),
          orderBy("data", "desc")
        );
        const snapshot = await getDocs(q);
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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
    <div className="min-h-screen bg-white px-6 pb-6">
      <h1 className="text-2xl font-bold text-center my-6 text-black">
        Comenzile mele
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Se încarcă comenzile...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">
          Nu ai nicio comandă înregistrată.
        </p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded p-4 shadow-sm bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">
                  {order.data?.toDate().toLocaleDateString("ro-RO")}
                </span>
                <StatusBadge status={order.status} />
              </div>

              <ul className="text-sm space-y-1">
                {order.produse?.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{item.nume}</span>
                    <span>
                      {item.pret.toFixed(2)} lei × {item.quantity || 1}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="text-right font-bold mt-2">
                Total: {order.totalFinal?.toFixed(2)} lei
              </div>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}
