import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useCart from "../context/useCart";
import { ShoppingCart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Separator from "../components/Separator";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const q = query(collection(db, "products"), where("slug", "==", slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const doc = snap.docs[0];
        setProduct({ id: doc.id, ...doc.data() });
      } else {
        console.warn("❌ Niciun produs găsit cu slug:", slug);
      }
    };

    fetchProduct();
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-[300px] text-gray-500 text-sm">
          Se încarcă produsul...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pb-6 bg-white">
      <Separator text={product.nume} />

      <div className="flex flex-col max-w-6xl gap-10 mx-auto mt-6 lg:flex-row">
        {/* Galerie Swiper */}
        <div className="w-full lg:w-1/2">
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation
            lazy={{ loadPrevNext: true }}
            spaceBetween={20}
            slidesPerView={1}
            className="rounded-lg"
          >
            {product.imagine?.map((url, index) => (
              <SwiperSlide key={index}>
                <LazyLoadImage
                  src={url}
                  alt={`${product.nume} imagine ${index + 1}`}
                  effect="blur"
                  className="w-full h-[380px] object-contain border rounded-lg p-4 bg-gray-50"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Detalii produs */}
        <div className="flex flex-col justify-between w-full lg:w-1/2">
          <div>
            <p className="mb-1 text-2xl font-bold text-green-600">
              {product.pret.toFixed(2)} lei
            </p>
            <p className="mb-4 text-sm text-gray-500">TVA inclus</p>

            {Array.isArray(product.models) && product.models.length > 0 && (
              <div className="mb-4">
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Compatibilitate:
                </p>
                <ul className="flex flex-wrap gap-2 text-sm text-gray-600">
                  {product.models.map((model, idx) => (
                    <li
                      key={idx}
                      className="px-2 py-1 text-xs bg-gray-100 rounded"
                    >
                      {model}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="flex items-center justify-center gap-2 py-3 mt-6 text-sm font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
          >
            <ShoppingCart className="w-5 h-5" />
            Adaugă în coș
          </button>
        </div>
      </div>

      {/* Descriere lungă */}
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="mb-2 text-lg font-semibold text-black">
          Descriere produs
        </h2>
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
          {product.descriere ||
            "Acest produs oferă protecție completă și un aspect elegant. Fabricat din materiale de calitate, compatibil perfect cu modelele listate mai sus."}
        </p>
      </div>

      <Footer />
    </div>
  );
}
