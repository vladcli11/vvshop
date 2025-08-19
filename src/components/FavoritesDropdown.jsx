// src/components/FavoritesDropdown.jsx
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import useFavorites from "../context/useFavorites";
import useCart from "../context/useCart";
import { ShoppingCart, Trash2, X, HeartOff } from "lucide-react";

export default function FavoritesDropdown({ onClose }) {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = async (prod) => {
    // adaugă în coș
    addToCart(prod);
    // elimină din favorite (cu fallback dacă nu e async)
    try {
      await toggleFavorite({ id: prod.id });
    } catch {
      toggleFavorite({ id: prod.id });
    }
  };

  // curăță denumiri generice din titlu
  const prettifyName = (name = "") => {
    let n = name
      // elimină prefixe comune
      .replace(
        /^(\s*)(Hus[ăa]|Carcas[ăa]|Folie(?: de)? protec(?:ție|tie)|Geam(?: de)? protec(?:ție|tie))\s*[-:]?\s*/i,
        ""
      )
      // spații multiple
      .replace(/\s{2,}/g, " ")
      .trim();
    // dacă devine prea scurt, revino la original
    return n.length >= 8 ? n : name;
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl w-11/12 max-w-sm lg:max-w-lg p-5 sm:p-6 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/70 border border-gray-200 text-gray-600 hover:bg-white hover:text-gray-900 shadow-sm transition"
          aria-label="Închide"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Favorite</h3>
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
                    className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 border rounded-sm bg-white overflow-hidden"
                    onClick={onClose}
                  >
                    <img
                      src={p.imagine}
                      alt={p.nume}
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
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {prettifyName(p.nume)}
                      </span>
                    </Link>
                    <div className="text-green-700 font-bold text-sm">
                      {p.pret.toFixed(2)} lei
                    </div>
                  </div>
                </div>
                {/* Rând 2: butoane sub titlu/poză */}
                <div className="mt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAddToCart(p)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-green-600 text-white text-[13px] sm:text-sm font-semibold shadow-sm hover:bg-green-700 active:scale-95 transition"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Adaugă în coș
                  </button>
                  <button
                    onClick={() => toggleFavorite({ id: p.id })}
                    className="inline-flex items-center gap-1 text-lg sm:text-sm text-red-600 hover:text-red-700 transition"
                    title="Șterge din favorite"
                  >
                    <Trash2 className="w-5 h-5" />
                    Elimină
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
              className="px-3.5 py-2.5 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold text-sm shadow-sm hover:from-orange-500 hover:to-orange-600 active:scale-95 transition"
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
