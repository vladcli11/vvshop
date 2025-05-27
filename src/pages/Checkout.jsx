import useCart from "../context/useCart";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal"; // sau cum se numește componenta ta modală
import { useState } from "react";

export default function Checkout() {
  const { cartItems } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("register"); // sau "login"

  const handleContinue = () => {
    console.log("currentUser:", currentUser);
    if (!currentUser) {
      setAuthMode("register"); // deschide modalul pe înregistrare
      setShowAuthModal(true);
    } else {
      navigate("/cos/delivery");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.pret, 0);

  if (cartItems.length === 0) {
    return (
      <h2 className="text-center text-gray-500 mt-10">Coșul este gol 🛒</h2>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Produse în coș</h1>

      <ul className="space-y-4">
        {cartItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between border rounded p-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.imagine}
                alt={item.nume}
                className="w-16 h-16 object-contain"
              />
              <div>
                <p className="font-semibold">{item.nume}</p>
                <p className="text-green-600">{item.pret.toFixed(2)} lei</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="text-right mt-6 text-xl font-semibold">
        Total: {total.toFixed(2)} lei
      </div>
      <button
        onClick={handleContinue}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Continuă către plată
      </button>
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          authMode={authMode}
          setAuthMode={setAuthMode}
        />
      )}
    </div>
  );
}
