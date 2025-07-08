import { Link } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";
import { createPortal } from "react-dom";
import { User, LogOut } from "lucide-react";

export default function AccountDropdown({ onClose }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white/90 backdrop-blur-xl border border-green-100 rounded-2xl shadow-2xl w-11/12 max-w-sm p-8 flex flex-col items-center gap-4 animate-fade-in-up"
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
          <div className="bg-gradient-to-tr from-green-400 to-blue-400 p-4 rounded-full shadow-lg mb-2">
            <User className="w-10 h-10 text-white" />
          </div>
          <span className="text-lg font-bold text-green-700 tracking-wide">
            Contul meu
          </span>
        </div>

        <Link
          to="/contul-meu"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition text-base shadow"
        >
          <User className="w-5 h-5" /> Vezi profilul
        </Link>

        <button
          onClick={async () => {
            try {
              await signOut(getAuth());
              onClose();
            } catch (err) {
              console.error("❌ Eroare la logout:", err);
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition text-base shadow"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>,
    document.body
  );
}
