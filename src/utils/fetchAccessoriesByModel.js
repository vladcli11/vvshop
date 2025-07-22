/**
 * Returnează accesoriile corespunzătoare unui model de telefon (ex: iPhone 14 Pro Max).
 * Se bazează pe câmpul `modelSlug` generat în timpul importului în Firestore.
 */
export async function fetchAccessoriesByModel(slug) {
  const { getFirestore, collection, getDocs, query, where } = await import(
    "firebase/firestore"
  );
  const db = getFirestore();

  if (slug === "all") {
    const snapshot = await getDocs(collection(db, "products"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return sortByTipAndName(items);
  }

  const q = query(
    collection(db, "products"),
    where("modelSlug", "==", slug),
    where("activ", "==", true)
  );

  const snapshot = await getDocs(q);
  const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return sortByTipAndName(items);
}

/**
 * Sortează accesoriile astfel:
 * 1. Produsele cu `tip === "folie"` vin primele
 * 2. Restul sunt ordonate alfabetic după `nume`
 */
function sortByTipAndName(items) {
  return items.sort((a, b) => {
    const isFolieA = a.tip === "folie";
    const isFolieB = b.tip === "folie";

    if (isFolieA && !isFolieB) return -1;
    if (!isFolieA && isFolieB) return 1;

    return (a.nume || "").localeCompare(b.nume || "");
  });
}
