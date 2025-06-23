// pages/AdminDashboard.jsx
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import useUserRole from "../context/useUserRole";
import { db } from "../firebase/firebase-config";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/firebase-config";

export default function AdminDashboard() {
  const { role, loading } = useUserRole();
  const [orders, setOrders] = useState([]);
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "comenzi", orderId);
      await updateDoc(orderRef, { status: newStatus });

      // Update local fără să refaci tot fetch-ul
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("❌ Eroare la actualizarea statusului:", err);
      alert("Eroare la modificarea statusului comenzii.");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(collection(db, "comenzi"), orderBy("data", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(list);
    };

    if (role === "owner") fetchOrders();
  }, [role]);

  if (loading) return <p className="mt-10 text-center">Se încarcă...</p>;

  if (role !== "owner") {
    return (
      <div className="mt-10 text-lg text-center text-red-600">
        ❌ Acces interzis. Această pagină este doar pentru administrator.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pb-6 bg-white">
      <h1 className="my-6 text-2xl font-bold text-center">
        📦 Comenzi înregistrate
      </h1>

      <div className="grid max-w-4xl gap-4 mx-auto">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">Nicio comandă deocamdată.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="p-4 space-y-2 border rounded shadow-sm bg-gray-50"
            >
              <div className="flex justify-between text-sm text-gray-600">
                <span>ID: {order.id}</span>
                <span>{order.data?.toDate().toLocaleString()}</span>
              </div>
              <div>
                <p className="font-semibold">
                  {order.nume} {order.prenume} — {order.email}
                </p>
                <p>
                  {order.adresa}, {order.localitate}, {order.judet}
                </p>
                <p>Telefon: {order.telefon}</p>
                <p>
                  Plată: {order.plata} | Discount: {order.discount || 0}%
                </p>
                {order.awb && (
                  <button
                    className="text-sm text-blue-600 underline mt-1"
                    onClick={async () => {
                      try {
                        const saveAwbLabel = httpsCallable(
                          functions,
                          "saveAwbLabel"
                        );
                        const result = await saveAwbLabel({
                          awbNumber: order.awb,
                        });

                        if (result.data.success) {
                          window.open(result.data.url, "_blank");
                        } else {
                          alert("Eticheta nu a putut fi generată.");
                        }
                      } catch (err) {
                        console.error("❌ Eroare la descărcare etichetă:", err);
                        alert("A apărut o eroare la descărcarea AWB-ului.");
                      }
                    }}
                  >
                    📄 Descarcă eticheta AWB
                  </button>
                )}
                <div className="text-sm">
                  <strong>Status:</strong>{" "}
                  <select
                    value={order.status || "necunoscut"}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="px-2 py-1 ml-2 text-sm border border-gray-300 rounded"
                  >
                    <option value="plasata">plasata</option>
                    <option value="asteptare_plata">asteptare_plata</option>
                    <option value="platita">platita</option>
                    <option value="livrata">livrata</option>
                    <option value="anulata">anulata</option>
                  </select>
                </div>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {order.produse?.map((prod, i) => (
                  <li key={i}>
                    - {prod.nume} ({prod.pret} lei) x {prod.quantity || 1}
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-bold text-green-700">
                Total: {order.totalFinal?.toFixed(2)} lei
              </p>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}
