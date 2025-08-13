import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

export default function Toast({
  show,
  onClose,
  title = "Adăugat în coș",
  message,
  duration = 2000,
}) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 z-[9999] transition-all duration-200
        ${
          show
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-900/85 text-white shadow-xl backdrop-blur-md border border-white/10">
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        <div className="text-sm leading-tight">
          <div className="font-semibold">{title}</div>
          {message ? <div className="text-white/80">{message}</div> : null}
        </div>
        <button
          onClick={onClose}
          aria-label="Închide"
          className="ml-1 text-white/60 hover:text-white transition"
        >
          ×
        </button>
      </div>
    </div>
  );
}
