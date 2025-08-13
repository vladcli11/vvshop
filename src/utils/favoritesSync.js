export async function syncFavoritesToUser(favorites, currentUser) {
  if (!currentUser) return;
  try {
    const { getFirestore, doc, setDoc } = await import("firebase/firestore");
    const db = getFirestore();
    await setDoc(
      doc(db, "userFavorites", currentUser.uid),
      { items: favorites, updatedAt: Date.now() },
      { merge: true }
    );
  } catch (e) {
    console.warn("Favorite sync skipped:", e?.message);
  }
}
