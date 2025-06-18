import { ShoppingCart } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import useCart from "../context/useCart";
import { fetchAccessoriesByModel } from "../utils/fetchAccessoriesByModel";
import Separator from "../components/Separator";

export default function Models() {
  const { slug } = useParams();
  const [accesorii, setAccesorii] = useState([]);
  const { addToCart } = useCart();
  const [showNotif, setShowNotif] = useState(false);
  const notifTimeout = useRef(null);

  const handleAddToCart = (item) => {
    addToCart(item);
    setShowNotif(true);
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => {
      setShowNotif(false);
    }, 2200);
  };

  useEffect(() => {
    fetchAccessoriesByModel(slug).then((items) => {
      items.forEach((item) => {
        const img = new Image();
        img.src = Array.isArray(item.imagine) ? item.imagine[0] : item.imagine;
      });
      setAccesorii(items);
    });
  }, [slug]);
  return (
    <div className="min-h-screen px-6 pb-6 bg-white">
      <Header />

      {showNotif && (
        <div
          className="
      fixed bottom-6 left-1/2 z-50
      -translate-x-1/2
      bg-white/80
      backdrop-blur-lg
      border border-green-200
      shadow-2xl
      rounded-2xl
      flex items-center gap-3
      px-6 py-3
      max-w-[90vw] sm:max-w-md
      text-green-700
      font-semibold
      text-base sm:text-lg
      transition-all duration-300
    "
          role="alert"
        >
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
      <Separator text="Accesorii disponibile" />

      {/* 🔹 Conținut principal - EDITAT DESTUL DE MULT, AR TREBUI FOLOSIT SI PENTRU RESTUL PAGINILOR */}
      {accesorii.length === 0 ? (
        <p className="text-center text-gray-500">
          Momentan nu există accesorii disponibile.
        </p>
      ) : (
        <div className="grid max-w-6xl grid-cols-2 gap-4 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {accesorii.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center justify-between w-full h-full p-2 transition-transform duration-200 border rounded-xl hover:shadow-xl hover:-translate-y-1 group"
            >
              {/* Zona clickabilă: imagine + titlu */}
              <div
                className="flex flex-col items-center w-full cursor-pointer"
                onClick={() => (window.location.href = `/produs/${item.slug}`)}
              >
                <Swiper
                  modules={[Pagination]}
                  spaceBetween={10}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  style={{ width: "130px", maxWidth: "100%" }}
                  className="max-w-full pb-6"
                >
                  {item.imagine.map((url, index) => (
                    <SwiperSlide key={index}>
                      <div className="overflow-hidden rounded-lg aspect-square w-full">
                        <LazyLoadImage
                          src={url}
                          alt={`${item.nume} imagine ${index + 1}`}
                          effect="blur"
                          className="object-contain w-full h-32 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <h2 className="mt-1 text-sm font-semibold text-center text-black group-hover:underline sm:text-base">
                  {item.nume}
                </h2>
              </div>

              {/* Prețul */}
              <p className="mt-1 text-sm font-bold text-green-600">
                {item.pret.toFixed(2)} lei
              </p>

              {/* Butonul - nu face parte din zona clickabilă */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevenim propagarea clickului în container
                  handleAddToCart(item);
                }}
                className="flex items-center justify-center w-full gap-3 px-2 py-2 mt-2 text-sm text-white transition bg-green-500 rounded-lg hover:bg-green-600"
              >
                <ShoppingCart className="w-5 h-7" />
                Adaugă în coș
              </button>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}
