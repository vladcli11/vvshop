import {
  ShoppingCart,
  Tag,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Shield,
  Smartphone,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import useCart from "../context/useCart";
import { fetchAccessoriesByModel } from "../utils/fetchAccessoriesByModel";

export default function Models() {
  const [accesorii, setAccesorii] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [tipProdus, setTipProdus] = useState("");
  const { addToCart } = useCart();
  const [showNotif, setShowNotif] = useState(false);
  const notifTimeout = useRef(null);
  const sentinelRef = useRef(null); // 🆕 pentru IntersectionObserver
  const { slug } = useParams();

  useEffect(() => {
    fetchAccessoriesByModel(slug).then((items) => {
      setAccesorii(items);
    });
  }, [slug]);

  useEffect(() => {
    if (accesorii.length > 0 && accesorii[0].imagine?.[0]) {
      const preloadUrl = `${accesorii[0].imagine[0]}?v=${accesorii[0].id}`;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = preloadUrl;
      link.setAttribute("fetchPriority", "high");
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [accesorii]);

  const accesoriiFiltrate = useMemo(() => {
    return tipProdus
      ? accesorii.filter((item) => item.tipProdus === tipProdus)
      : accesorii;
  }, [accesorii, tipProdus]);

  const sortedAccesorii = useMemo(() => {
    return [...accesoriiFiltrate].sort((a, b) => {
      if (sortOrder === "asc") return a.pret - b.pret;
      if (sortOrder === "desc") return b.pret - a.pret;
      return 0;
    });
  }, [accesoriiFiltrate, sortOrder]);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const currentItems = sortedAccesorii.slice(0, page * ITEMS_PER_PAGE);

  // 📦 Infinite Scroll Logic
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(node);
    return () => {
      observer.unobserve(node); // Cleanup corect pe același nod
    };
  }, [currentItems.length]);

  const handleSort = () => {
    setSortOrder((prev) =>
      prev === "default" ? "asc" : prev === "asc" ? "desc" : "default"
    );
  };

  const getSortIcon = () => {
    if (sortOrder === "asc") return <ArrowUp className="w-4 h-4" />;
    if (sortOrder === "desc") return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4" />;
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setShowNotif(true);
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => {
      setShowNotif(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 relative overflow-x-hidden">
      {showNotif && (
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-4 sm:right-4 sm:left-auto sm:w-80 z-50 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl shadow-2xl animate-slide-up-bounce">
          <div className="flex items-center gap-3 p-4">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base sm:text-lg">Succes! 🎉</p>
              <p className="text-sm text-white/90 truncate">
                Produsul a fost adăugat în coș
              </p>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-2xl overflow-hidden">
              <div className="h-full bg-white/60 rounded-b-2xl animate-progress-bar w-full"></div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-40 bg-gradient-to-b from-green-200/30 via-white/0 to-transparent blur-2xl opacity-70 z-0" />

        <main className="relative z-10 pb-36">
          {accesorii.length > 0 && (
            <div className="w-full max-w-6xl mx-auto px-4 pt-2 sm:pt-4">
              <div className="flex gap-1 items-center justify-between">
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setTipProdus(tipProdus === "folie" ? "" : "folie")
                    }
                    className={`flex flex-col items-center px-2 py-1 rounded-lg font-semibold border text-xs transition-all duration-200 ${
                      tipProdus === "folie"
                        ? "bg-blue-500 text-white border-blue-600 shadow scale-105"
                        : "bg-white/80 text-blue-700 border-blue-200 hover:bg-blue-50"
                    }`}
                    style={{ minWidth: 56 }}
                  >
                    <Shield
                      className={`w-5 h-5 mb-0.5 ${
                        tipProdus === "folie" ? "text-white" : "text-blue-500"
                      }`}
                    />
                    <span className="leading-tight">Folii</span>
                  </button>
                  <button
                    onClick={() =>
                      setTipProdus(tipProdus === "husa" ? "" : "husa")
                    }
                    className={`flex flex-col items-center px-2 py-1 rounded-lg font-semibold border text-xs transition-all duration-200 ${
                      tipProdus === "husa"
                        ? "bg-green-500 text-white border-green-600 shadow scale-105"
                        : "bg-white/80 text-green-700 border-green-200 hover:bg-green-50"
                    }`}
                    style={{ minWidth: 56 }}
                  >
                    <Smartphone
                      className={`w-5 h-5 mb-0.5 ${
                        tipProdus === "husa" ? "text-white" : "text-green-500"
                      }`}
                    />
                    <span className="leading-tight">Huse</span>
                  </button>
                </div>
                <button
                  onClick={handleSort}
                  className={`flex flex-col items-center px-2 py-1 rounded-lg font-semibold border text-xs transition-all duration-200 bg-white/80 text-gray-700 border-gray-200 hover:bg-gray-50 ${
                    sortOrder !== "default" ? "shadow scale-105" : ""
                  }`}
                  style={{ minWidth: 56 }}
                >
                  <span className="flex items-center justify-center mb-0.5">
                    {getSortIcon()}
                  </span>
                  <span className="leading-tight sm:inline hidden">
                    {sortOrder === "asc"
                      ? "Crescător"
                      : sortOrder === "desc"
                      ? "Descrescător"
                      : "Sortează"}
                  </span>
                  <span className="leading-tight sm:hidden block">Sortare</span>
                </button>
              </div>
            </div>
          )}

          <div className="grid max-w-6xl grid-cols-2 gap-3 mx-auto px-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center pt-2 min-h-[700px]">
            {currentItems.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 mt-10 text-lg font-medium animate-fade-in">
                Momentan nu există accesorii disponibile.
              </p>
            ) : (
              currentItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="group flex flex-col items-center justify-between w-full h-full p-4 bg-white rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden animate-fade-in-up"
                >
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-green-300/40 to-blue-200/10 rounded-full blur-2xl opacity-60 z-0" />
                  <div
                    className="relative w-full pt-[100%] overflow-hidden bg-white transition-all duration-300 cursor-pointer z-10"
                    onClick={() =>
                      (window.location.href = `/produs/${item.slug}`)
                    }
                  >
                    <img
                      src={`${item.imagine[0]}?v=${item.id}`}
                      sizes="(max-width: 640px) 90vw, 300px"
                      alt={item.nume}
                      loading={idx === 0 ? "eager" : "lazy"}
                      fetchPriority={idx === 0 ? "high" : "auto"}
                      width="300"
                      height="300"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                  <h2 className="mb-1 text-xs sm:text-sm font-bold text-center text-black h-24 flex items-center justify-center z-10">
                    {item.nume}
                  </h2>
                  <div className="bg-gray-900 text-white px-3 py-2 rounded-sm font-bold text-sm shadow-lg flex items-center justify-center gap-1 w-full">
                    <Tag className="w-4 h-4 text-yellow-400" />
                    {item.pret.toFixed(2)} LEI
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    className="flex items-center justify-center w-full gap-2 px-3 py-2 mt-1 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-orange-400 to-orange-500 rounded-md shadow-md hover:from-orange-500 hover:to-orange-600 transition-all"
                  >
                    <ShoppingCart className="w-5 h-7" />
                    Adaugă în coș
                  </button>
                </div>
              ))
            )}
            {/* Infinite Scroll Trigger 👇 */}
            {currentItems.length < sortedAccesorii.length && (
              <div
                ref={sentinelRef}
                className="col-span-full h-8 flex justify-center items-center"
              >
                <span className="text-xs text-gray-400 animate-pulse">
                  Se încarcă mai multe...
                </span>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
