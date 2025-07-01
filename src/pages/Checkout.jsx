import useCart from "../context/useCart";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";
import { useState, useEffect } from "react";
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
      <div className="min-h-screen bg-white px-4 sm:px-6">
        <div className="relative w-full my-6">
          <div className="absolute inset-0 -mx-4 flex items-center">
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
    <div className="mt-5 min-h-screen bg-white px-2 sm:px-6 pb-6">
      <div className="flex justify-center">
        <div className="w-full max-w-full sm:max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-sm p-3 sm:p-4">
          <ul className="divide-y divide-gray-100">
            {cartItems.map((item, index) => (
              <li key={index} className="flex items-center gap-3 sm:gap-6 py-3">
                <img
                  src={
                    Array.isArray(item.imagine) ? item.imagine[0] : item.imagine
                  }
                  alt={item.nume}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg bg-gray-50 border"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                    {item.nume}
                  </p>
                  <p className="text-green-600 font-bold text-sm sm:text-base mt-1">
                    {item.pret.toFixed(2)} lei
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-gray-500">
                      Cantitate:
                    </span>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-xl font-bold bg-white hover:bg-gray-100 active:scale-95 transition"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(0, (item.quantity || 1) - 1)
                          )
                        }
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-base font-medium">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-xl font-bold bg-white hover:bg-gray-100 active:scale-95 transition"
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity || 1) + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="text-xl font-bold mt-8 w-full max-w-full sm:max-w-2xl text-center bg-gray-50 rounded-xl py-4 shadow-sm border border-gray-200">
          Subtotal:{" "}
          <span className="text-green-600">{total.toFixed(2)} lei</span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          className="mt-8 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-green-600 hover:to-green-700 transition w-full max-w-full sm:max-w-2xl text-lg font-semibold tracking-wide"
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
