import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAccessoriesByModel } from "../utils/fetchAccessoriesByModel";
// 🔸 Importuri pentru iconițe
import { ShoppingCart } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function Models() {
  const { slug } = useParams();
  const [accesorii, setAccesorii] = useState([]);

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
      <div className="flex items-center my-5">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="px-4 text-gray-600 text-sm uppercase tracking-wider">
          Accesorii {slug.replace(/-/g, " ")}
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* 🔹 Conținut principal - EDITAT DESTUL DE MULT, AR TREBUI FOLOSIT SI PENTRU RESTUL PAGINILOR */}
      {accesorii.length === 0 ? (
        <p className="text-center text-gray-500">
          Momentan nu există accesorii disponibile.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-fit max-w-6xl mx-auto justify-items-center">
          {accesorii.map((item) => (
            <div
              key={item.id}
              className="border p-2 rounded-xl flex flex-col items-center hover:shadow-xl transition-transform duration-200 w-full"
            >
              <LazyLoadImage
                src={item.imagine}
                alt={item.nume}
                effect="blur" // 🔄 activează fade-in cu blur
                width={128}
                height={128}
                className="w-32 h-32 object-contain mb-1"
              />
              <h2 className="font-bold text-center text-black text-xl">
                {item.nume}
              </h2>
              <p className="text-green-600 mt-1 font-bold text-base">
                {item.pret.toFixed(2)} lei
              </p>
              {/* 🔹 DE FOLOSIT IN TOATE PAGINILE BUTONUL ASTA!! */}
              <button className="mt-2 bg-green-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-3 w-full">
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
