// src/components/FavoritesDropdown.jsx
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useFavorites from "../context/useFavorites";
import useCart from "../context/useCart";
import { ShoppingCart, Trash2, X, HeartOff } from "lucide-react";

// Hook-uri sigure (fallback dacă providerul lipsește)
function useFavoritesSafe() {
  try {
    return useFavorites();
  } catch {
    return {
      favorites: [],
      toggleFavorite: () => {},
      clearFavorites: () => {},
    };
  }
}
function useCartSafe() {
  try {
    return useCart();
  } catch {
    return { addToCart: () => {} };
  }
}

export default function FavoritesDropdown({ onClose }) {
  const favCtx = useFavoritesSafe();
  const favorites = Array.isArray(favCtx.favorites) ? favCtx.favorites : [];
  const toggleFavorite = favCtx.toggleFavorite ?? (() => {});
  const clearFavorites = favCtx.clearFavorites ?? (() => {});
  const { addToCart } = useCartSafe();

  const [processingId, setProcessingId] = useState(null);
  const dialogRef = useRef(null);
  const prevActiveRef = useRef(null);

  // Body scroll lock + focus management + Escape
  useEffect(() => {
    prevActiveRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus pe dialog
    dialogRef.current?.focus?.();

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      // restaurează focusul anterior
      if (prevActiveRef.current && prevActiveRef.current.focus) {
        prevActiveRef.current.focus();
      }
    };
  }, [onClose]);

  const handleAddToCart = async (prod) => {
    try {
      setProcessingId(prod.id);
      addToCart(prod);
      await Promise.resolve(toggleFavorite({ id: prod.id }));
    } finally {
      setProcessingId(null);
    }
  };

  // curăță denumiri generice din titlu
  const prettifyName = (name = "") => {
    let n = name
      .replace(
        /^(\s*)(Hus[ăa]|Carcas[ăa]|Folie(?: de)? protec(?:ție|tie)|Geam(?: de)? protec(?:ție|tie))\s*[-:]?\s*/i,
        ""
      )
      .replace(/\s{2,}/g, " ")
      .trim();
    return n.length >= 8 ? n : name;
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Favorite"
        className="relative bg-white border border-gray-200 rounded-3xl shadow-2xl w-11/12 max-w-sm lg:max-w-lg p-5 sm:p-6 animate-fade-in-up outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/70 border border-gray-200 text-gray-600 hover:bg-white hover:text-gray-900 shadow-sm transition"
          aria-label="Închide"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">Favorite</h2>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 py-10">
            <HeartOff className="w-8 h-8 mb-2 text-gray-400" />
            <p>Nu ai produse la favorite încă.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 max-h-[50vh] overflow-y-auto pr-1">
            {favorites.map((p) => (
              <li key={p.id} className="py-3">
                {/* Rând 1: imagine + titlu + preț */}
                <div className="flex items-center gap-4">
                  <Link
                    to={`/produs/${p.slug}`}
                    className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-sm bg-white overflow-hidden"
                    onClick={onClose}
                  >
                    <img
                      src={p.imagine}
                      alt={p.nume}
                      width={128}
                      height={128}
                      decoding="async"
                      className="w-full h-full object-contain p-1"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/produs/${p.slug}`}
                      onClick={onClose}
                      className="block font-semibold text-gray-900 hover:underline"
                      title={p.nume}
                    >
                      <span
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {prettifyName(p.nume)}
                      </span>
                    </Link>
                    <div className="text-emerald-600 font-bold text-base">
                      {p.pret.toFixed(2)} lei
                    </div>
                  </div>
                </div>
                {/* Rând 2: butoane sub titlu/poză */}
                <div className="mt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAddToCart(p)}
                    disabled={processingId === p.id}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-white text-[13px] sm:text-sm font-semibold shadow-sm active:scale-95 transition
                      ${
                        processingId === p.id
                          ? "bg-gradient-to-r from-orange-400/70 to-orange-500/70 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
                      }`}
                    aria-disabled={processingId === p.id}
                    aria-label={`Adaugă ${p.nume} în coș`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Adaugă în coș
                  </button>
                  <button
                    onClick={() => toggleFavorite({ id: p.id })}
                    className="inline-flex items-center gap-1 text-sm sm:text-sm text-gray-700 "
                    title="Șterge din favorite"
                    aria-label={`Elimină ${p.nume} din favorite`}
                  >
                    <Trash2 className="w-7 h-7" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {favorites.length > 0 && (
          <div className="flex justify-between items-center pt-3 mt-3 border-t">
            <button
              onClick={clearFavorites}
              className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-4"
            >
              Golește favoritele
            </button>
            <Link
              to="/cos"
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-sm"
            >
              Mergi la coș
            </Link>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
