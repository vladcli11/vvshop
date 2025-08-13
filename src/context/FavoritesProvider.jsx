import { useEffect, useState } from "react";
import FavoritesContext from "./FavoritesContext";
import useAuth from "../context/useAuth";
import { loadFavorites, saveFavorites } from "../utils/favoritesStorage";
import { syncFavoritesToUser } from "../utils/favoritesSync";

export default function FavoritesProvider({ children }) {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState(() => loadFavorites());

  // persistă local
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  // sync best-effort la user logat
  useEffect(() => {
    syncFavoritesToUser(favorites, currentUser);
  }, [favorites, currentUser]);

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === product.id);
      if (exists) return prev.filter((f) => f.id !== product.id);
      return [
        {
          id: product.id,
          slug: product.slug,
          nume: product.nume,
          pret: product.pret,
          imagine: Array.isArray(product.imagine)
            ? product.imagine[0]
            : product.imagine,
        },
        ...prev,
      ];
    });
  };

  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
