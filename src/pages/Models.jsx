import { ShoppingCart, BadgeDollarSign } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import useCart from "../context/useCart";
import { fetchAccessoriesByModel } from "../utils/fetchAccessoriesByModel";

export default function Models() {
  const [accesorii, setAccesorii] = useState([]);
  const { addToCart } = useCart();
  const [showNotif, setShowNotif] = useState(false);
  const notifTimeout = useRef(null);
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
      link.setAttribute("fetchpriority", "high");
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [accesorii]);

  const handleAddToCart = (item) => {
    addToCart(item);
    setShowNotif(true);
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => {
      setShowNotif(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-x-hidden">
      {/* Efecte bokeh și lumină */}

      {/* Notificare adăugare în coș */}
      {showNotif && (
        <div
          className="fixed bottom-4 left-4 right-4 sm:bottom-4 sm:right-4 sm:left-auto sm:w-80 z-50 
    bg-gradient-to-r from-emerald-500 to-blue-600 
    text-white rounded-xl shadow-2xl 
    transform transition-all duration-500 ease-out
    animate-slide-up-bounce"
        >
          <div className="flex items-center gap-3 p-4">
            {/* Icon animat */}
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

            {/* Conținut */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base sm:text-lg">Succes! 🎉</p>
              <p className="text-sm text-white/90 truncate">
                Produsul a fost adăugat în coș
              </p>
            </div>

            {/* Progress bar animat */}
            <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-2xl overflow-hidden">
              <div className="h-full bg-white/60 rounded-b-2xl animate-progress-bar w-full"></div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Efect decorativ de lumină */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-40 bg-gradient-to-b from-green-200/30 via-white/0 to-transparent blur-2xl opacity-70 z-0" />

        <main className="relative z-10 pb-36">
          <div className="grid max-w-6xl grid-cols-2 gap-3 mx-auto px-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center pt-4 min-h-[700px]">
            {accesorii.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 mt-10 text-lg font-medium animate-fade-in">
                Momentan nu există accesorii disponibile.
              </p>
            ) : (
              accesorii.map((item, idx) => (
                <div
                  key={item.id}
                  className="group flex flex-col items-center justify-between w-full h-full p-4 
    bg-white rounded-sm shadow-lg
    hover:shadow-2xl transition-all duration-300 
    relative overflow-hidden animate-fade-in-up"
                >
                  {/* Accent decorativ */}
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-green-300/40 to-blue-200/10 rounded-full blur-2xl opacity-60 z-0" />

                  {/* Imagine clickabilă */}
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

                  {/* Titlu NON-clickabil */}
                  <h2 className="mb-1 text-xs sm:text-sm font-bold text-center text-black h-24 flex items-center justify-center z-10">
                    {item.nume}
                  </h2>

                  <div className="bg-gray-900 text-white px-3 py-2 rounded-sm font-bold text-sm shadow-lg flex items-center justify-center gap-1 w-full">
                    <BadgeDollarSign className="w-4 h-4 text-yellow-400" />
                    {item.pret.toFixed(2)} LEI
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    className="flex items-center justify-center w-full gap-2 px-3 py-2 mt-1
      text-sm sm:text-base font-semibold text-white
      bg-gradient-to-r from-orange-400 to-orange-500
      rounded-md shadow-md
      hover:from-orange-500 hover:to-orange-600
      transition-all"
                  >
                    <ShoppingCart className="w-5 h-7" />
                    Adaugă în coș
                  </button>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
