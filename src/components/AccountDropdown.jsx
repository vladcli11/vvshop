import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { User, LogOut } from "lucide-react";

export default function AccountDropdown({ onClose }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white/90 backdrop-blur-xl border border-orange-100 rounded-2xl shadow-2xl w-11/12 max-w-sm p-8 flex flex-col items-center gap-4 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-2xl text-gray-400 hover:text-red-500 transition"
          aria-label="Închide"
        >
          ×
        </button>

        <div className="flex flex-col items-center mb-2">
          <div className="bg-gradient-to-tr from-[#ff9800] to-[#ff5e62] p-4 rounded-full shadow-lg mb-2">
            <User className="w-10 h-10 text-white" />
          </div>
        </div>

        <Link
          to="/contul-meu"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-black via-gray-800 to-gray-900"
        >
          <User className="w-5 h-5" /> Vezi profilul
        </Link>

        <button
          onClick={async () => {
            try {
              const { signOut, getAuth } = await import("firebase/auth");
              await signOut(getAuth());
            } catch (err) {
              console.error("Eroare la logout:", err);
            } finally {
              onClose?.();
              // hard redirect: curăță orice state care ține modalul deschis
              window.location.replace("/");
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#ff5e62] to-[#ff9800]"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>,
    document.body
  );
}
