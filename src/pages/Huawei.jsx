import { Link } from "react-router-dom";
//import P70Ultra from "../assets/P70-ultra.webp";
//import P70Pro from "../assets/P70-pro.webp";
//import P70 from "../assets/P70.webp";
import P60Pro from "../assets/huaweip60pro.webp";
import P50ProPocket from "../assets/huaweip50pocketedition.webp";
import P40Pro from "../assets/huaweip40pro.webp";
import P40 from "../assets/huaweip40.webp";
import P30Pro from "../assets/huaweip30pro.webp";
import P30 from "../assets/huaweip30.webp";
import Footer from "../components/Footer";

const modele = [
  //{ nume: "Huawei P70 Ultra", modelSlug: "huawei-p70-ultra", imagine: P70Ultra },
  //{ nume: "Huawei P70 Pro", modelSlug: "huawei-p70-pro", imagine: P70Pro },
  //{ nume: "Huawei P70", modelSlug: "huawei-p70", imagine: P70 },
  { nume: "Huawei P60 Pro", modelSlug: "huawei-p60-pro", imagine: P60Pro },
  {
    nume: "Huawei P50 Pro Pocket",
    modelSlug: "huawei-p50-pro-pocket",
    imagine: P50ProPocket,
  },
  { nume: "Huawei P40 Pro", modelSlug: "huawei-p40-pro", imagine: P40Pro },
  { nume: "Huawei P40", modelSlug: "huawei-p40", imagine: P40 },
  { nume: "Huawei P30 Pro", modelSlug: "huawei-p30-pro", imagine: P30Pro },
  { nume: "Huawei P30", modelSlug: "huawei-p30", imagine: P30 },
];

export default function Huawei() {
  return (
    <div className="min-h-screen px-2 sm:px-6 pb-8 bg-gradient-to-br from-rose-100 via-white to-blue-100 relative overflow-x-hidden">
      {/* Efecte bokeh pentru profunzime */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse-slow" />
      </div>
      <div className="relative z-10">
        <div className="grid w-full max-w-6xl grid-cols-2 gap-5 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mt-4">
          {modele.map((model) => (
            <Link
              key={model.modelSlug}
              to={`/huawei/${model.modelSlug}`}
              className="group relative flex flex-col items-center w-full max-w-xs p-4 sm:p-5 bg-white border border-rose-100 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 backdrop-blur-xl
                hover:scale-[1.03] hover:border-rose-300 hover:bg-white/90
                before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-rose-200/30 before:to-blue-200/20 before:opacity-0 group-hover:before:opacity-100 before:transition-all before:duration-300"
              style={{ perspective: 800 }}
            >
              {/* Imagine cu efect 3D */}
              <div className="relative w-full pt-[100%] rounded-2xl overflow-hidden bg-white transition-all duration-300">
                <img
                  src={model.imagine}
                  alt={model.nume}
                  sizes="(max-width: 640px) 90vw, 300px"
                  loading="eager"
                  fetchPriority="high"
                  width="300"
                  height="300"
                  className="absolute inset-0 w-full h-full object-contain"
                  draggable={false}
                />
              </div>
              {/* Titlu */}
              <span className="mt-3 text-base sm:text-lg font-bold text-center text-black">
                {model.nume}
              </span>
              {/* Glow la hover */}
              <div className="absolute -inset-1 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 z-0 bg-gradient-to-br from-rose-300/30 via-white/0 to-blue-300/30 blur-lg" />
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
