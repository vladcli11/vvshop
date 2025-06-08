import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export async function fetchAccessoriesByModel(slug) {
  if (slug === "all") {
    const snapshot = await getDocs(collection(db, "products"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return sortByTipAndName(items);
  }

  const qArray = query(
    collection(db, "products"),
    where("models", "array-contains", slug)
  );

  const qString = query(
    collection(db, "products"),
    where("models", "==", slug)
  );

  const [snapArray, snapString] = await Promise.all([
    getDocs(qArray),
    getDocs(qString),
  ]);

  const seen = new Set();
  const merged = [...snapArray.docs, ...snapString.docs].filter((doc) => {
    if (seen.has(doc.id)) return false;
    seen.add(doc.id);
    return true;
  });

  const items = merged.map((doc) => ({ id: doc.id, ...doc.data() }));
  return sortByTipAndName(items);
}

// 🔁 Funcție separată, reutilizabilă și clară
function sortByTipAndName(items) {
  return items.sort((a, b) => {
    const isFolieA = a.tip === "folie";
    const isFolieB = b.tip === "folie";

    if (isFolieA && !isFolieB) return -1;
    if (!isFolieA && isFolieB) return 1;

    return (a.nume || "").localeCompare(b.nume || "");
  });
}
