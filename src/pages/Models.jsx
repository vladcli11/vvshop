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
import useCart from "../context/useCart";
import { fetchAccessoriesByModel } from "../utils/fetchAccessoriesByModel";

export default function Models() {
  const [accesorii, setAccesorii] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [tipProdus, setTipProdus] = useState("");
  const { addToCart } = useCart();
  const [setShowNotif] = useState(false);
  const notifTimeout = useRef(null);
  const sentinelRef = useRef(null); // 🆕 pentru IntersectionObserver
  const { slug } = useParams();

  useEffect(() => {
    fetchAccessoriesByModel(slug).then((items) => {
      setAccesorii(items);
    });
  }, [slug]);

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
  const ITEMS_PER_PAGE = window.innerWidth < 640 ? 10 : 20;
  const currentItems = sortedAccesorii.slice(0, page * ITEMS_PER_PAGE);
  const LCP_INDEX = 1; // al doilea card este LCP

  // (opțional) Preload doar pentru candidatul LCP
  useEffect(() => {
    const candidate = currentItems[LCP_INDEX];
    if (!candidate?.imagine?.[0]) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = candidate.imagine[0];
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [currentItems]);

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
      <div className="relative z-10">
        <main className="relative z-10 pb-36">
          {accesorii.length > 0 && (
            <div className="w-full max-w-6xl mx-auto px-4 pt-2 sm:pt-4">
              <div className="flex gap-1 items-center justify-between">
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setTipProdus(tipProdus === "folie" ? "" : "folie")
                    }
                    className={`flex flex-col items-center px-2 py-1 rounded-xl font-semibold border text-xs ${
                      tipProdus === "folie"
                        ? "bg-orange-500 text-white border-blue-orange shadow scale-105"
                        : "bg-white/80 text-black"
                    }`}
                    style={{ minWidth: 56 }}
                  >
                    <Shield
                      className={`w-6 h-6 mb-0.5 ${
                        tipProdus === "folie" ? "text-white" : "text-black"
                      }`}
                    />
                    <span className="leading-tight">Folii</span>
                  </button>
                  <button
                    onClick={() =>
                      setTipProdus(tipProdus === "husa" ? "" : "husa")
                    }
                    className={`flex flex-col items-center px-2 py-1 rounded-xl font-semibold border text-xs ${
                      tipProdus === "husa"
                        ? "bg-orange-500 text-white border-orange-600"
                        : "bg-white/80 text-black"
                    }`}
                    style={{ minWidth: 56 }}
                  >
                    <Smartphone
                      className={`w-6 h-6 mb-0.5 ${
                        tipProdus === "husa" ? "text-white" : "text-black"
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
                  className="group flex flex-col items-center justify-between w-full h-full p-4 bg-white rounded-sm relative overflow-hidden"
                >
                  <div
                    className="relative w-full pt-[100%] overflow-hidden bg-white transition-all duration-300 cursor-pointer z-10"
                    onClick={() =>
                      (window.location.href = `/produs/${item.slug}`)
                    }
                  >
                    <img
                      src={`${item.imagine[0]}`}
                      sizes="(max-width: 640px) 90vw, 300px"
                      alt={item.nume}
                      loading={idx === LCP_INDEX ? "eager" : "lazy"}
                      fetchPriority={idx === LCP_INDEX ? "high" : "auto"}
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
    </div>
  );
}
