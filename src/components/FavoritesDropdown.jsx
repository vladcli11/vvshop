// src/components/FavoritesDropdown.jsx
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import useFavorites from "../context/useFavorites";
import useCart from "../context/useCart";
import { ShoppingCart, Trash2, X, HeartOff } from "lucide-react";

export default function FavoritesDropdown({ onClose }) {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl w-11/12 max-w-sm p-5 sm:p-6 animate-fade-in-up"
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
              <li key={p.id} className="py-3 flex items-center gap-3">
                <Link
                  to={`/produs/${p.slug}`}
                  className="w-16 h-16 flex-shrink-0 border rounded-lg bg-gray-50 overflow-hidden"
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
                    className="block font-semibold text-gray-900 hover:underline truncate"
                    title={p.nume}
                  >
                    {p.nume}
                  </Link>
                  <div className="text-green-700 font-bold text-sm">
                    {p.pret.toFixed(2)} lei
                  </div>
                </div>

                <div className="flex flex-col gap-1 items-end">
                  <button
                    onClick={() => addToCart(p)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-[13px] sm:text-sm font-semibold shadow-sm hover:bg-green-700 active:scale-95 transition"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Adaugă în coș
                  </button>
                  <button
                    onClick={() => toggleFavorite({ id: p.id })}
                    className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 transition"
                    title="Șterge din favorite"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
