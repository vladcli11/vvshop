import { useEffect, useState } from "react";

function ScrollToTop({ threshold = 600 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || document.documentElement.scrollTop || 0;
          setVisible(y > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollTop = () => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Mergi sus"
      title="Mergi sus"
      className={`fixed bottom-4 right-4 z-[9999] h-12 w-12 rounded-full 
                  flex items-center justify-center
                  bg-gray-500/10 border border-black/10 backdrop-blur-sm
                  text-gray-700 shadow-lg hover:bg-gray-500/20 hover:shadow-xl
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400
                  transition-opacity duration-200 active:scale-95
                  ${
                    visible
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}

export default ScrollToTop;
