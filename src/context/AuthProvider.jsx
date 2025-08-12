import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { getAuthAsync } from "../firebase/firebase-config"; // ajustează calea

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub;
    let cancelled = false;

    (async () => {
      const auth = await getAuthAsync();
      const { onAuthStateChanged } = await import("firebase/auth");
      if (cancelled) return;

      unsub = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user ?? null);
        setLoading(false);
      });
    })();

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
