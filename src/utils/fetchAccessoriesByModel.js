import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export async function fetchAccessoriesByModel(slug) {
  if (slug === "all") {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Două query-uri: unul pentru array, unul pentru string
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

  // Combinare + eliminare duplicate (dacă există)
  const seen = new Set();
  const merged = [...snapArray.docs, ...snapString.docs].filter((doc) => {
    if (seen.has(doc.id)) return false;
    seen.add(doc.id);
    return true;
  });

  return merged.map((doc) => ({ id: doc.id, ...doc.data() }));
}
