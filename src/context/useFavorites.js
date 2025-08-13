import { useContext } from "react";
import FavoritesContext from "../context/FavoritesContext";

export default function useFavorites() {
  return useContext(FavoritesContext);
}
// This hook provides access to the FavoritesContext, allowing components to easily access and manipulate favorite items.
