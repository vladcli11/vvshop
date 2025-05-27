import { Link } from "react-router-dom";
import { ShoppingCart, Home, User } from "lucide-react";
import logo from "../assets/logo.png";
import { useState } from "react";
import AuthModal from "./Auth_Modal";

export default function Header() {
  const [ShowModal, setShowModal] = useState(false);

  return (
    <div className="relative h-[64px] mb-4 w-full max-w-6xl mx-auto">
      {/* Buton Acasă doar dacă nu suntem pe homepage */}

      <Link
        to="/"
        className="absolute top-1 sm:top-2 md:top-2 left-4 h-20 sm:h- md:h-[88px] z-10"
      >
        <img src={logo} alt="VVShop" className="h-full object-contain" />
      </Link>

      {/* Buton Coș */}
      <Link
        to="/cos"
        className="absolute top-3 right-20 bg-white text-gray-700 p-4 rounded-full shadow-lg border border-gray-300 hover:bg-gray-100 transition z-10"
        aria-label="Coș de cumpărături"
      >
        <ShoppingCart className="w-6 h-6" />
      </Link>
      <button
        onClick={() => setShowModal(true)}
        className="absolute top-3 right-1 bg-white text-gray-700 p-4 rounded-full shadow-lg border border-gray-300 hover:bg-gray-100 transition z-10"
        aria-label="Autentificare / Cont"
      >
        <User className="w-6 h-6" />
      </button>
      <AuthModal isOpen={ShowModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
