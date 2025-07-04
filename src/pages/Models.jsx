import { ShoppingCart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import "swiper/css";
import "swiper/css/pagination";
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

  const handleAddToCart = (item) => {
    addToCart(item);
    setShowNotif(true);
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => {
      setShowNotif(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen px-0 pb-0 bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-x-hidden">
      {/* Efecte bokeh și lumină */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Notificare adăugare în coș */}
      {showNotif && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-white/90 backdrop-blur-lg border border-green-200 shadow-2xl rounded-2xl flex items-center gap-3 px-6 py-3 max-w-[90vw] sm:max-w-md text-green-700 font-semibold text-base sm:text-lg animate-fade-in-up">
          <svg
            className="w-6 h-6 text-green-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Produsul a fost adăugat în coș!</span>
        </div>
      )}

      <div className="relative z-10">
        {/* Efect decorativ de lumină */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-40 bg-gradient-to-b from-green-200/30 via-white/0 to-transparent blur-2xl opacity-70 z-0" />

        <main className="relative z-10 pb-36">
          <div className="grid max-w-6xl grid-cols-2 gap-5 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mt-4 min-h-[700px]">
            {accesorii.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 mt-10 text-lg font-medium animate-fade-in">
                Momentan nu există accesorii disponibile.
              </p>
            ) : (
              accesorii.map((item, idx) => (
                <div
                  key={item.id}
                  className="group flex flex-col items-center justify-between w-full h-full p-4 
            bg-white border border-green-100 rounded-3xl shadow-xl 
            hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 
            relative overflow-hidden animate-fade-in-up
            hover:scale-[1.03] hover:border-green-300"
                >
                  {/* Accent decorativ */}
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-green-200/40 to-blue-200/10 rounded-full blur-2xl opacity-60 z-0" />

                  {/* Zona clickabilă: imagine + titlu */}
                  <div
                    className="flex flex-col items-center w-full cursor-pointer z-10"
                    onClick={() =>
                      (window.location.href = `/produs/${item.slug}`)
                    }
                  >
                    <div className="relative w-full pt-[100%] rounded-2xl overflow-hidden bg-white shadow-inner transition-all duration-300">
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

                    <h2 className="mt-1 text-xs sm:text-sm font-extrabold text-center text-black tracking-tight drop-shadow transition-all duration-200">
                      {item.nume}
                    </h2>
                  </div>

                  {/* Prețul */}
                  <p className="mt-1 text-sm font-semibold text-green-600 border border-green-200 rounded-full px-3 py-1 shadow-sm">
                    {item.pret.toFixed(2)} lei
                  </p>

                  {/* Butonul */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    className="flex items-center justify-center w-full gap-2 px-3 py-2 mt-2
              text-sm sm:text-base font-semibold text-white
              bg-gradient-to-r from-orange-400 to-orange-500
              rounded-xl shadow-md
              hover:from-orange-500 hover:to-orange-600
              hover:scale-105 transition-all"
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
