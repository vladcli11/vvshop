import { useParams } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useCart from "../context/useCart";
import { ShoppingCart, Shield, Truck, ArrowLeft, Hash } from "lucide-react";
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
            className="flex items-center gap-2 text-gray-700 font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="w-5 h-5" />
            Înapoi
          </button>
        </div>

        <div className="flex flex-col max-w-3xl gap-4 mx-auto lg:flex-row lg:max-w-6xl">
          {/* Galerie Swiper */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-sm shadow-sm p-3 sm:p-6">
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
                    bulletClass: "swiper-pagination-bullet !bg-orange-400",
                    bulletActiveClass:
                      "swiper-pagination-bullet-active !bg-orange-600",
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
                      <div className="relative bg-white rounded-sm overflow-hidden h-[300px] sm:h-[360px] md:h-[420px]">
                        <LazyLoadImage
                          key={url}
                          src={`${url}?v=${product.id}`}
                          alt={`${product.nume} imagine ${index + 1}`}
                          loading={index === 0 ? "eager" : "lazy"}
                          fetchPriority={index === 0 ? "high" : "auto"}
                          sizes="(min-width: 1024px) 50vw, (min-width: 640px) 80vw, 90vw"
                          effect={index === 0 ? undefined : "blur"}
                          wrapperClassName="absolute inset-0 grid place-items-center"
                          className="w-full h-full object-contain object-center select-none pointer-events-none"
                          draggable={false}
                          decoding={index === 0 ? "sync" : "async"}
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
            <div className="bg-white rounded-sm shadow-md p-4 sm:p-8 h-full">
              <div className="flex flex-col h-full">
                {/* Titlu produs */}
                <h1 className="text-lg sm:text-xl md:text-xl font-bold text-gray-800 mb-1 sm:mb-2 leading-tight">
                  {product.nume}
                </h1>

                {/* Preț */}
                <div className="mb-4 sm:mb-6">
                  <p className="text-2xl sm:text-4xl font-bold text-emerald-600 mb-1 sm:mb-2">
                    {product.pret.toFixed(2)} lei
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    TVA inclus
                  </p>
                </div>

                {/* Avantaje */}
                <div className="mb-6 sm:mb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Livrare */}
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-orange-200/70 bg-gradient-to-br from-orange-50 to-white shadow-sm">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-orange-600 text-white flex items-center justify-center shadow">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] sm:text-sm font-semibold text-gray-900">
                          Livrare rapidă
                        </p>
                        <p className="text-xs sm:text-sm text-gray-900">
                          Gratuită la comenzi peste 50 de lei
                        </p>
                      </div>
                    </div>
                    {/* Garanție */}
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-900/10 bg-gray-900 text-white shadow-sm">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] sm:text-sm font-semibold">
                          Garanție 2 ani
                        </p>
                        <p className="text-xs sm:text-sm text-white/80">
                          Calitate verificată
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cod produs */}
                {product.cod && (
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border border-orange-200 bg-orange-50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-orange-600 text-white flex items-center justify-center">
                      <Hash className="w-4 h-4" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono font-bold text-orange-800 tracking-wide">
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
          <div className="bg-white rounded-sm shadow-md p-4 sm:p-8">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
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
