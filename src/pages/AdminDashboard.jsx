import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import useUserRole from "../context/useUserRole";

export default function AdminDashboard() {
  const { role, loading } = useUserRole();
  const [orders, setOrders] = useState([]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { doc, updateDoc, getFirestore } = await import(
        "firebase/firestore"
      );
      const db = getFirestore();
      const orderRef = doc(db, "comenzi", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Eroare la actualizarea statusului:", err);
      alert("Eroare la modificarea statusului comenzii.");
    }
  };

  const genereazaAwb = async (order) => {
    try {
      const { httpsCallable, getFunctions } = await import(
        "firebase/functions"
      );
      const functions = getFunctions();
      const genereazaAwb = httpsCallable(functions, "generateAwb");
      const service = order.metodaLivrare === "easybox" ? 15 : 7;

      const payload = {
        nume: order.nume,
        telefon: order.telefon,
        email: order.email,
        judet: order.judet,
        localitate: order.localitate,
        strada: order.adresa,
        codAmount: order.totalFinal,
        greutate: 1.2,
        service,
        awbPayment: "recipient",
        packageType: "standard",
        personType: "person",
        oohLastMile:
          service === 15 && order.locker
            ? {
                lockerId: order.locker.lockerId || order.locker.oohId,
                name: order.locker.name,
                address: order.locker.address,
                city: order.locker.city,
                county: order.locker.county,
                postalCode: order.locker.postalCode,
              }
            : undefined,
      };

      console.log("Payload AWB (Admin):", payload);

      const awbResponse = await genereazaAwb(payload);
      if (awbResponse.data.success) {
        const { doc, updateDoc, getFirestore } = await import(
          "firebase/firestore"
        );
        const db = getFirestore();
        await updateDoc(doc(db, "comenzi", order.id), {
          awb: awbResponse.data.awbNumber,
        });
        alert("AWB generat cu succes!");
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id ? { ...o, awb: awbResponse.data.awbNumber } : o
          )
        );
      } else {
        const eroare = awbResponse.data.error;
        console.warn("Eroare la generare AWB:", eroare.message);
        console.warn("Detalii campuri:", eroare.errors);
        alert("Eroare la generarea AWB: " + eroare.message);
      }
    } catch (err) {
      console.error("Exceptie la generarea AWB:", err);
      alert("Eroare internă la generarea AWB. Vezi consola.");
    }
  };

  const descarcaEticheta = async (awb) => {
    try {
      const { httpsCallable, getFunctions } = await import(
        "firebase/functions"
      );
      const functions = getFunctions();
      const saveAwbLabel = httpsCallable(functions, "saveAwbLabel");
      const result = await saveAwbLabel({ awbNumber: awb });
      if (result.data.success) {
        window.open(result.data.url, "_blank");
      } else {
        alert("Eticheta nu a putut fi generată.");
      }
    } catch (err) {
      console.error("Eroare la descarcarea etichetei:", err);
      alert("Eroare la descarcarea AWB-ului.");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const { collection, getDocs, orderBy, query, getFirestore } =
        await import("firebase/firestore");
      const db = getFirestore();
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

                {!order.awb && (
                  <button
                    className="text-sm text-blue-600 underline mt-1"
                    onClick={() => genereazaAwb(order)}
                  >
                    Generează AWB
                  </button>
                )}

                {order.awb && (
                  <>
                    <button
                      className="text-sm text-blue-600 underline mt-1"
                      onClick={() => descarcaEticheta(order.awb)}
                    >
                      📄 Descarcă eticheta AWB
                    </button>
                    <p className="text-sm text-gray-700 mt-1">
                      🧾 AWB: <span className="font-semibold">{order.awb}</span>
                    </p>
                  </>
                )}

                <div className="text-sm mt-2">
                  <strong>Status:</strong>
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
