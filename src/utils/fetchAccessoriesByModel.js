import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export async function fetchAccessoriesByModel(slug) {
  console.log("📦 slug primit:", slug);
  let q;

  if (slug === "all") {
    q = collection(db, "products"); // fără filtrare
  } else {
    q = query(
      collection(db, "products"),
      where("models", "array-contains", slug)
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
