import { useParams } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useCart from "../context/useCart";
import {
  ShoppingCart,
  Star,
  Shield,
  Truck,
  ArrowLeft,
  Hash,
} from "lucide-react";
const Swiper = lazy(() =>
  import("swiper/react").then((m) => ({ default: m.Swiper }))
);
const SwiperSlide = lazy(() =>
  import("swiper/react").then((m) => ({ default: m.SwiperSlide }))
);
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const { getFirestore, collection, query, where, getDocs } = await import(
        "firebase/firestore"
      );
      const db = getFirestore();
      const q = query(collection(db, "products"), where("slug", "==", slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const doc = snap.docs[0];
        setProduct({ id: doc.id, ...doc.data() });
      } else {
        console.warn("Niciun produs găsit cu slug:", slug);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (!product) {
    return (
      <div className=" bg-gray-100">
        <div className="flex items-center justify-center h-[300px] sm:h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <p className="text-base sm:text-lg text-gray-600 font-medium flex items-center">
              Se încarcă produsul...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-100 relative overflow-x-hidden">
      <div className="px-2 sm:px-6 pb-6 relative z-10">
        {/* Buton înapoi */}
        <div className="max-w-3xl mx-auto pt-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="w-5 h-5" />
            Înapoi
          </button>
        </div>

        <div className="flex flex-col max-w-3xl gap-6 mx-auto lg:flex-row lg:max-w-6xl">
          {/* Galerie Swiper */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-md p-3 sm:p-6 border border-green-100">
              <Suspense
                fallback={
                  <div className="h-[220px] sm:h-[400px] flex items-center justify-center text-gray-500">
                    Se încarcă galeria...
                  </div>
                }
              >
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
                  spaceBetween={12}
                  slidesPerView={1}
                  className="rounded-xl overflow-hidden"
                >
                  {product.imagine?.map((url, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative bg-white rounded-sm overflow-hidden">
                        <LazyLoadImage
                          key={url}
                          src={`${url}?v=${product.id}`}
                          alt={`${product.nume} imagine ${index + 1}`}
                          loading={index === 0 ? "eager" : "lazy"}
                          fetchPriority={index === 0 ? "high" : "auto"}
                          width="400"
                          effect="blur"
                          className="w-full h-[220px] sm:h-[320px] md:h-[400px] object-contain p-3 sm:p-6"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Suspense>
            </div>
          </div>

          {/* Detalii produs */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8 border border-green-100 h-full">
              <div className="flex flex-col h-full">
                {/* Titlu produs */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-4 leading-tight">
                  {product.nume}
                </h1>

                {/* Preț */}
                <div className="mb-4 sm:mb-6">
                  <p className="text-2xl sm:text-4xl font-bold text-green-600 mb-1 sm:mb-2">
                    {product.pret.toFixed(2)} lei
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    TVA inclus
                  </p>
                </div>

                {/* Compatibilitate */}
                {Array.isArray(product.models) && product.models.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
                      Compatibilitate:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.models.map((model, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-full border border-green-300 font-medium"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Avantaje */}
                <div className="mb-6 sm:mb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-xl border border-green-100">
                      <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                      <span className="text-xs sm:text-sm text-green-700 font-medium">
                        Livrare gratuită la comenzile de peste 50 de lei
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <span className="text-xs sm:text-sm text-blue-700 font-medium">
                        Garanție 2 ani
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cod produs */}
                {product.cod && (
                  <div className="flex items-center gap-2 mb-4 sm:mb-6 p-2 sm:p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <div>
                      <span className="text-xs sm:text-sm text-blue-600 font-medium">
                        Cod :
                      </span>
                      <span className="font-mono font-bold text-blue-800">
                        {product.cod}
                      </span>
                    </div>
                  </div>
                )}

                {/* Buton adaugă în coș */}
                <div className="mt-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="flex items-center justify-center w-full gap-2 px-3 py-2 mt-1 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-orange-400 to-orange-500 rounded-md shadow-md hover:from-orange-500 hover:to-orange-600 transition-all"
                  >
                    <ShoppingCart className="w-5 h-7" />
                    Adaugă în coș
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descriere lungă */}
        <div className="max-w-3xl mx-auto mt-6 sm:mt-10">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-4 sm:p-8 border border-green-100">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">
                  i
                </span>
              </div>
              Descriere produs
            </h2>
            <div className="prose prose-sm sm:prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                {product.descriere ||
                  "Acest produs oferă protecție completă și un aspect elegant. Fabricat din materiale de calitate superioară, compatibil perfect cu modelele listate mai sus. Designul său modern și funcțional îl face perfect pentru utilizarea zilnică."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
