import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState, useRef } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useCart from "../context/useCart";
import { ShoppingCart, Star, Shield, Truck, ArrowLeft } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const notifTimeout = useRef(null);

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

  const handleAddToCart = (product) => {
    addToCart(product);
    setShowNotif(true);
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => {
      setShowNotif(false);
    }, 2200);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <p className="text-lg text-gray-600 font-medium">
              Se încarcă produsul...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-x-hidden">
      {/* Efecte de fundal */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-green-400/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Notificare */}
      {showNotif && (
        <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-lg border border-green-200 shadow-2xl rounded-2xl flex items-center gap-3 px-6 py-3 max-w-[90vw] sm:max-w-md text-green-700 font-semibold text-base sm:text-lg animate-fade-in-up">
          <svg
            className="w-6 h-6 text-green-600 flex-shrink-0"
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

      <div className="px-4 sm:px-6 pb-6 relative z-10">
        {/* Buton înapoi */}
        <div className="max-w-6xl mx-auto pt-6 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Înapoi
          </button>
        </div>

        <div className="flex flex-col max-w-6xl gap-10 mx-auto lg:flex-row">
          {/* Galerie Swiper */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-green-100">
              <Swiper
                modules={[Pagination, Navigation]}
                pagination={{
                  clickable: true,
                  bulletClass: "swiper-pagination-bullet !bg-green-400",
                  bulletActiveClass:
                    "swiper-pagination-bullet-active !bg-green-600",
                }}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                lazy={{ loadPrevNext: true }}
                spaceBetween={20}
                slidesPerView={1}
                className="rounded-2xl overflow-hidden"
              >
                {product.imagine?.map((url, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden">
                      <LazyLoadImage
                        key={url}
                        src={`${url}?v=${product.id}`}
                        alt={`${product.nume} imagine ${index + 1}`}
                        effect="blur"
                        className="w-full h-[400px] object-contain p-6"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Detalii produs */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100 h-full">
              <div className="flex flex-col h-full">
                {/* Titlu produs */}
                <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
                  {product.nume}
                </h1>

                {/* Preț */}
                <div className="mb-6">
                  <p className="text-4xl font-bold text-green-600 mb-2">
                    {product.pret.toFixed(2)} lei
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    TVA inclus
                  </p>
                </div>

                {/* Rating (fake pentru demo) */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    (4.9) • 127 recenzii
                  </span>
                </div>

                {/* Compatibilitate */}
                {Array.isArray(product.models) && product.models.length > 0 && (
                  <div className="mb-6">
                    <p className="text-lg font-semibold text-gray-700 mb-3">
                      Compatibilitate:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.models.map((model, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-2 text-sm bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-full border border-green-300 font-medium"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Avantaje */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                      <Truck className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">
                        Livrare gratuită
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-700 font-medium">
                        Garanție 2 ani
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buton adaugă în coș */}
                <div className="mt-auto">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full flex items-center justify-center gap-3 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg hover:from-green-600 hover:to-green-700 hover:scale-105 transition-all duration-200"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Adaugă în coș
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descriere lungă */}
        <div className="max-w-6xl mx-auto mt-10">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">i</span>
              </div>
              Descriere produs
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {product.descriere ||
                  "Acest produs oferă protecție completă și un aspect elegant. Fabricat din materiale de calitate superioară, compatibil perfect cu modelele listate mai sus. Designul său modern și funcțional îl face perfect pentru utilizarea zilnică."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
