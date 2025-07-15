import { Link } from "react-router-dom";
import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import useCart from "../context/useCart";

// Lazy load AccountDropdown
const AccountDropdown = lazy(() => import("./AccountDropdown"));

export default function Header({ onAuthClick }) {
  const { cartItems } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setIsLoggedIn(!!user);
      if (!user) setShowDropdown(false);
    });
    return () => unsubscribe();
  }, []);

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
    <header className="sticky top-0 z-50 bg-white/70 border-b border-gray-100">
      <nav className="relative flex items-center justify-between max-w-5xl mx-auto px-3 sm:px-8 h-16 sm:h-20">
        {/* Logo */}
        <Link
          to="/"
          className="h-20 sm:h-24 w-[180px] flex items-center justify-center"
          aria-label="Acasă"
        >
          <img
            src="/img/logo.webp"
            alt="VVShop"
            width={180}
            height={96}
            fetchPriority="high"
            loading="eager"
            className="h-full w-auto object-contain"
            style={{ maxHeight: "100%" }}
          />
        </Link>

        {/* Dreapta: Coș + Cont */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Coș */}
          <Link
            to="/cos"
            className="relative bg-white/80 text-gray-700 p-3 sm:p-4 rounded-full shadow-lg border border-gray-200 transition-none"
            aria-label="Coș de cumpărături"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shopping-cart-icon lucide-shopping-cart w-7 h-7"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-tr from-red-400 to-red-500 text-white text-xs w-7 h-7 flex items-center justify-center rounded-full border-2 border-white shadow">
                {cartItems.reduce(
                  (total, item) => total + (item.quantity || 1),
                  0
                )}
              </span>
            )}
          </Link>
          {/* Cont */}
          <button
            onClick={() => {
              if (isLoggedIn) {
                setShowDropdown((prev) => !prev);
              } else {
                onAuthClick?.();
              }
            }}
            className={`relative bg-white/80 p-3 sm:p-4 rounded-full shadow-lg border  transition-none`}
            aria-label="Autentificare / Cont"
          >
            {isLoggedIn ? (
              // ✅ SVG: user logat — user-round-check
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user-round-check-icon text-orange-600 w-7 h-7"
              >
                <path d="M2 21a8 8 0 0 1 13.292-6" />
                <circle cx="10" cy="8" r="5" />
                <path d="m16 19 2 2 4-4" />
              </svg>
            ) : (
              // 👤 SVG: user delogat — user clasic
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user-round-icon lucide-user-round w-7 h-7"
              >
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Dropdown cont logat */}
      {isLoggedIn && showDropdown && (
        <Suspense fallback={<div className="..." />}>
          <AccountDropdown onClose={() => setShowDropdown(false)} />
        </Suspense>
      )}
    </header>
  );
}
