import useCart from "../context/useCart";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

export default function Checkout() {
  const AuthModal = lazy(() => import("../components/AuthModal"));
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
      <div className="bg-gray-100 px-4 sm:px-6">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md mx-auto">
            {/* Iconiță animată */}
            <div className="mb-8 relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">🛒</span>
              </div>
            </div>

            {/* Titlu */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Coșul este gol
            </h2>

            {/* Descriere */}
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Nu ai adăugat încă produse în coșul tău.
              <br className="hidden sm:block" />
              Găsește-ți accesoriul preferat în câteva secunde.
            </p>

            {/* Buton de navigare */}
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-green-600 hover:to-green-700 hover:scale-105 transition-all duration-200 font-semibold text-lg"
            >
              Începe cumpărăturile
            </button>

            {/* Decorațiuni */}
            <div className="mt-12 flex justify-center gap-8 text-gray-300"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 bg-white px-2 sm:px-6 pb-6">
      <div className="flex justify-center">
        <div className="w-full max-w-full sm:max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-sm p-3 sm:p-4">
          <ul className="divide-y divide-gray-100">
            {cartItems.map((item, index) => (
              <li key={index} className="flex items-center gap-2 sm:gap-6 py-3">
                <Link to={`/produs/${item.slug}`} className="flex-shrink-0">
                  <img
                    src={
                      Array.isArray(item.imagine)
                        ? item.imagine[0]
                        : item.imagine
                    }
                    alt={item.nume}
                    className="w-20 h-20 sm:w-28 sm:h-28 object-contain rounded-lg bg-gray-50 border"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-lg text-gray-900 truncate">
                    {item.nume}
                  </p>
                  <p className="text-green-600 font-bold text-base sm:text-base mt-1">
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
        <div className="text-xl font-bold mt-3 w-full max-w-full sm:max-w-2xl text-center bg-gray-50 rounded-xl py-4 shadow-sm border border-gray-200">
          Subtotal:{" "}
          <span className="text-green-600">{total.toFixed(2)} lei</span>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          className="mt-3 bg-[#16A34A] hover:bg-[#15803D] text-white px-8 py-3 rounded-2xl shadow-lg hover:from-green-600 hover:to-green-700 transition w-full max-w-full sm:max-w-2xl text-2xl font-semibold tracking-wide"
        >
          Continuă
        </button>
      </div>
      {showAuthModal && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode="register"
            redirectTo={null}
          />
        </Suspense>
      )}
    </div>
  );
}
