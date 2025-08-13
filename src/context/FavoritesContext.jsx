import { createContext } from "react";

const FavoritesContext = createContext({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: () => {},
  clearFavorites: () => {},
});

export default FavoritesContext;
