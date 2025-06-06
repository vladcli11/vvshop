import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAccessoriesByModel } from "../utils/fetchAccessoriesByModel";
import { ShoppingCart } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import useCart from "../context/useCart";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Models() {
  const { slug } = useParams();
  const [accesorii, setAccesorii] = useState([]);
  const { addToCart } = useCart();
  useEffect(() => {
    fetchAccessoriesByModel(slug).then((items) => {
      items.forEach((item) => {
        const img = new Image();
        img.src = item.imagine;
      });
      setAccesorii(items);
    });
  }, [slug]);
  return (
    <div className="min-h-screen bg-white px-6 pb-6">
      <Header />
      {/* 🔸 Separator vizual */}
      <div className="flex items-center my-4 -mx-6">
        <div className="flex-grow h-[2px] bg-gradient-to-r from-green-400 to-green-600" />
        <span className="px-2 text-gray-600 text-base uppercase tracking-wider whitespace-nowrap">
          Accesorii {slug.replace(/-/g, " ")}
        </span>
        <div className="flex-grow h-[2px] bg-gradient-to-r from-blue-600 to-blue-400" />
      </div>

      {/* 🔹 Conținut principal - EDITAT DESTUL DE MULT, AR TREBUI FOLOSIT SI PENTRU RESTUL PAGINILOR */}
      {accesorii.length === 0 ? (
        <p className="text-center text-gray-500">
          Momentan nu există accesorii disponibile.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto justify-items-center">
          {accesorii.map((item) => (
            <div
              key={item.id}
              className="border p-2 rounded-xl flex flex-col justify-between items-center hover:shadow-xl transition-transform duration-200 w-full h-full"
            >
              <div className="w-full flex justify-center mb-2">
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  style={{ width: "130px", maxWidth: "100%" }}
                >
                  {item.imagine?.map((url, index) => (
                    <SwiperSlide key={index}>
                      <LazyLoadImage
                        src={url}
                        alt={`${item.nume} imagine ${index + 1}`}
                        effect="blur"
                        className="w-full h-32 object-contain"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <h2 className="font-bold text-center text-black text-xl">
                {item.nume}
              </h2>
              <p className="text-green-600 mt-1 font-bold text-base">
                {item.pret.toFixed(2)} lei
              </p>
              {/* 🔹 DE FOLOSIT IN TOATE PAGINILE BUTONUL ASTA!! */}
              <button
                onClick={() => addToCart(item)}
                className="mt-2 bg-green-500 text-white text-sm px-2 py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-3 w-full"
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
