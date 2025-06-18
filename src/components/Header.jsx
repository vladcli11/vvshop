import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import logo from "../assets/logo.png";
import { useState, useRef, useEffect } from "react";
import AuthModal from "./AuthModal";
import useCart from "../context/useCart";
import useAuth from "../context/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase-config";

export default function Header() {
  const [ShowModal, setShowModal] = useState(false);
  const { currentUser } = useAuth();
  const { cartItems } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl shadow-md border-b border-green-100">
      <nav className="relative flex items-center justify-between max-w-5xl mx-auto px-3 sm:px-8 h-20 sm:h-22">
        {/* Logo mare */}
        <Link to="/" className="flex items-center group" aria-label="Acasă">
          <img
            src={logo}
            alt="VVShop"
            className="h-16 sm:h-24 w-auto object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
            fetchpriority="high"
            width={180}
            height={96}
            style={{ filter: "drop-shadow(0 4px 12px #22c55e22)" }}
          />
        </Link>

        {/* Butoane dreapta */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Coș */}
          <Link
            to="/cos"
            className="relative bg-white/80 text-gray-700 p-3 sm:p-4 rounded-full shadow-lg border border-green-200 hover:bg-green-50 hover:scale-105 transition-all duration-200"
            aria-label="Coș de cumpărături"
          >
            <ShoppingCart className="w-7 h-7" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-tr from-green-400 to-green-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Cont */}
          <button
            onClick={() => {
              if (currentUser) {
                setShowDropdown((prev) => !prev);
              } else {
                setShowModal(true);
              }
            }}
            className={`relative bg-white/80 p-3 sm:p-4 rounded-full shadow-lg border transition-all duration-200 hover:bg-green-50 hover:scale-105 ${
              currentUser ? "border-green-400" : "border-gray-200"
            }`}
            aria-label="Autentificare / Cont"
          >
            <User
              className={`w-7 h-7 ${
                currentUser ? "text-green-600" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* Modal de login/register */}
        {!currentUser && (
          <AuthModal isOpen={ShowModal} onClose={() => setShowModal(false)} />
        )}

        {/* Dropdown logout */}
        {currentUser && showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-24 sm:top-28 bg-white/90 border border-green-200 rounded-2xl shadow-2xl z-40 text-base w-48 flex flex-col animate-fade-in"
          >
            <Link
              to="/contul-meu"
              className="px-5 py-4 hover:bg-green-50 rounded-t-2xl text-left font-semibold text-green-700 transition"
              onClick={() => setShowDropdown(false)}
            >
              Contul meu
            </Link>
            <button
              onClick={() => {
                signOut(auth);
                setShowDropdown(false);
              }}
              className="px-5 py-4 hover:bg-green-50 rounded-b-2xl text-left text-red-600 font-semibold transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
