const KEY = "vvshop:favorites";

export function loadFavorites() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch (e) {
    if (import.meta.env?.DEV) {
      console.warn("Persist favorites failed:", e);
    }
  }
}
