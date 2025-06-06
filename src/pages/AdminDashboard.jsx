// pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import useUserRole from "../context/useUserRole";
import { updateDoc, doc } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatusBadge from "../components/StatusBadge";

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

  if (loading) return <p className="text-center mt-10">Se încarcă...</p>;

  if (role !== "owner") {
    return (
      <div className="text-center text-red-600 mt-10 text-lg">
        ❌ Acces interzis. Această pagină este doar pentru administrator.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 pb-6">
      <Header />
      <h1 className="text-2xl font-bold text-center my-6">
        📦 Comenzi înregistrate
      </h1>

      <div className="grid gap-4 max-w-4xl mx-auto">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">Nicio comandă deocamdată.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded shadow-sm bg-gray-50 space-y-2"
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
                <div className="text-sm">
                  <strong>Status:</strong>{" "}
                  <select
                    value={order.status || "necunoscut"}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
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
              <p className="font-bold text-green-700 mt-2">
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
