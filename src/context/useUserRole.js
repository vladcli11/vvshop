// context/useUserRole.js
import { useEffect, useState } from "react";
import useAuth from "./useAuth";

export default function useUserRole() {
  const { currentUser } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
      }
      try {
        const { getFirestore, doc, getDoc } = await import(
          "firebase/firestore"
        );
        const db = getFirestore();
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRole(snap.data().role || "user");
        } else {
          setRole("user");
        }
      } catch (err) {
        console.error("Eroare la citirea rolului:", err);
        setRole("user");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [currentUser]);

  return { role, loading };
}
