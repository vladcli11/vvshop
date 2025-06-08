import useCart from "../context/useCart";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Checkout() {
  const { cartItems, updateQuantity } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleContinue = () => {
    if (!currentUser) {
      setShowAuthModal(true);
    } else {
      navigate("/cos/livrare");
    }
  };

  useEffect(() => {
    if (currentUser && showAuthModal) {
      setShowAuthModal(false);
    }
  }, [currentUser, showAuthModal]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.pret * (item.quantity || 1),
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white px-6">
        <Header />

        <div className=" relative w-full my-6">
          <div className="absolute inset-0 -mx-6 flex items-center">
            <div className="flex-grow h-[2px] bg-gradient-to-r from-green-400 to-green-600" />
            <span className="px-2 text-gray-600 text-base uppercase tracking-wider whitespace-nowrap">
              Coșul este gol 🛒
            </span>
            <div className="flex-grow h-[2px] bg-gradient-to-r from-blue-600 to-blue-400" />
          </div>
        </div>
        <div className="text-center text-gray-500 mt-20">
          <p className="mt-8 text-xl text-gray-700">
            Adaugă produse în coș pentru a continua cumpărăturile.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 pb-6">
      <div className="max-w-6xl mx-auto">
        <Header />
      </div>

      {/* Separator */}
      <div className="flex items-center my-6 -mx-6">
        <div className="flex-grow h-[2px] bg-gradient-to-r from-green-400 to-green-600" />
        <span className="px-2 text-gray-600 text-base uppercase tracking-wider whitespace-nowrap">
          Produse in coș
        </span>
        <div className="flex-grow h-[2px] bg-gradient-to-r from-blue-600 to-blue-400" />
      </div>

      <ul className="space-y-4 flex flex-col items-center">
        {cartItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between border rounded p-4 w-full max-w-md md:max-w-2xl"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.imagine}
                alt={item.nume}
                className="w-28 h-28 object-contain"
              />
              <div>
                <p className="font-bold text-base">{item.nume}</p>
                <p className="text-green-600">{item.pret.toFixed(2)} lei</p>

                <div className="mt-2 flex items-center gap-3">
                  <span className="text-sm">Cantitate:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-xl hover:bg-gray-100"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.max(1, (item.quantity || 1) - 1)
                        )
                      }
                    >
                      −
                    </button>
                    <span className="w-8 text-center">
                      {item.quantity || 1}
                    </span>
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-xl hover:bg-gray-100"
                      onClick={() =>
                        updateQuantity(item.id, (item.quantity || 1) + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center">
        <div className="text-xl font-bold mt-6 w-full max-w-md md:max-w-2xl text-center">
          Subtotal: {total.toFixed(2)} lei
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          className="mt-6 bg-green-500 text-white px-6 py-3 rounded hover:bg-green-700 transition w-full max-w-md md:max-w-2xl"
        >
          Continuă
        </button>
      </div>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="register"
          redirectTo={null}
        />
      )}

      <Footer />
    </div>
  );
}
