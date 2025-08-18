import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop({ threshold = 600 }) {
  const [visible, setVisible] = useState(false);
  const [hint, setHint] = useState(false);
  const timerRef = useRef(null);
  const prevVisible = useRef(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  // One-time subtle ping when it becomes visible
  useEffect(() => {
    if (visible && !prevVisible.current) {
      setHint(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setHint(false), 1000);
    }
    prevVisible.current = visible;
    return () => clearTimeout(timerRef.current);
  }, [visible]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Mergi sus"
      title="Mergi sus"
      className={`fixed z-[9999] h-12 w-12 rounded-full
                  bottom-5 right-5
                  flex items-center justify-center
                  bg-white/95 border-2 border-orange-500 shadow-xl
                  backdrop-blur-md
                  transition-all duration-200 ease-out
                  hover:bg-orange-500 hover:border-orange-600
                  group
                  ${
                    visible
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
      style={{
        bottom: `max(20px, env(safe-area-inset-bottom))`,
        boxShadow: "0 8px 28px rgba(255, 122, 0, 0.18)",
      }}
    >
      {hint && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-orange-400/25 animate-ping"
        />
      )}
      <ArrowUp
        className="w-6 h-7 text-orange-500 transition-colors duration-200 group-hover:text-white"
        strokeWidth={2.5}
      />
    </button>
  );
}
