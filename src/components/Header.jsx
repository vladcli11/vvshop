import { Link } from "react-router-dom";
import { ShoppingCart, Home, User } from "lucide-react";
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

  // Daca nu esti logat, arata modalul de login/register
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    // Poti sa inchizi dropdown-ul daca dai click in afara lui
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative h-[64px] mb-2 w-full max-w-6xl mx-auto">
      {/* Bara de navigare */}
      <Link
        to="/"
        className="absolute top-1 sm:top-2 w-20 md:top-2 left-4 h-20 sm:h- md:h-[88px] z-10"
      >
        <img src={logo} alt="VVShop" className="h-full object-contain" />
      </Link>

      <Link
        to="/cos"
        className="absolute top-4 right-20 bg-white text-gray-700 p-4 rounded-full shadow-lg border border-gray-300 hover:bg-gray-100 transition z-10"
        aria-label="Coș de cumpărături"
      >
        <ShoppingCart className="w-6 h-6" />

        {cartItems.length > 0 && (
          <span className="absolute -top-0 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartItems.length}
          </span>
        )}
      </Link>
      <button
        onClick={() => {
          if (currentUser) {
            setShowDropdown((prev) => !prev);
          } else {
            setShowModal(true);
          }
        }}
        className={`absolute top-4 right-1 ${
          currentUser ? "bg-green-200" : "bg-white"
        } text-gray-700 p-4 rounded-full shadow-lg border border-gray-300 hover:bg-gray-100 transition z-10`}
        aria-label="Autentificare / Cont"
      >
        <User className="w-6 h-6" />
      </button>

      {/* Modal de login/register */}
      {!currentUser && (
        <AuthModal isOpen={ShowModal} onClose={() => setShowModal(false)} />
      )}

      {/* Dropdown logout */}
      {currentUser && showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-16 right-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-20 text-sm w-32 flex flex-col"
        >
          <Link
            to="/contul-meu"
            className="px-3 py-2 hover:bg-gray-100 rounded text-left"
            onClick={() => setShowDropdown(false)}
          >
            Contul meu
          </Link>
          <button
            onClick={() => {
              signOut(auth);
              setShowDropdown(false);
            }}
            className="px-3 py-2 hover:bg-gray-100 rounded text-left"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
