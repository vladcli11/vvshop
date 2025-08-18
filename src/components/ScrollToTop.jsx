import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop({ threshold = 500 }) {
  const [visible, setVisible] = useState(false);
  const [hint, setHint] = useState(false);
  const timerRef = useRef(null);
  const prevVisible = useRef(false);

  useEffect(() => {
    const onScroll = () => setVisible((window.scrollY || 0) > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  useEffect(() => {
    if (visible && !prevVisible.current) {
      setHint(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setHint(false), 1000);
    }
    prevVisible.current = visible;
    return () => clearTimeout(timerRef.current);
  }, [visible]);

  const smoothScrollTop = () => {
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    const behavior = prefersReduced ? "auto" : "smooth";
    const docEl = document.scrollingElement || document.documentElement;
    const targets = [window, docEl, document.body];
    document
      .querySelectorAll(
        "[data-scroll-container], .overflow-y-auto, .overflow-auto, main"
      )
      .forEach((el) => {
        if (el && el.scrollHeight > el.clientHeight) targets.push(el);
      });
    const seen = new Set();
    targets.forEach((t) => {
      const key = t === window ? "win" : t;
      if (seen.has(key)) return;
      seen.add(key);
      try {
        if (t === window) window.scrollTo({ top: 0, behavior });
        else if (typeof t.scrollTo === "function")
          t.scrollTo({ top: 0, behavior });
        else t.scrollTop = 0;
      } catch (e) {
        console.error("Scroll to top failed:", e);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={smoothScrollTop}
      onPointerUp={smoothScrollTop}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") smoothScrollTop();
      }}
      aria-label="Mergi sus"
      title="Mergi sus"
      className={`fixed z-[9999] h-14 w-14 rounded-full
                  bottom-5 right-5
                  flex items-center justify-center
                  bg-white/95 border-2 border-orange-500
                  backdrop-blur-md overflow-hidden
                  transition-all duration-200 ease-out
                  hover:bg-orange-500 active:scale-95
                  group
                  ${
                    visible
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
      style={{
        bottom: `max(20px, env(safe-area-inset-bottom))`,
        boxShadow: "0 8px 28px rgba(255, 122, 0, 0.18)",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {hint && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-orange-500 animate-ping pointer-events-none"
        />
      )}
      <ArrowUp
        className="w-7 h-7 text-orange-500 transition-colors duration-200 group-hover:text-white"
        strokeWidth={2.5}
      />
    </button>
  );
}
