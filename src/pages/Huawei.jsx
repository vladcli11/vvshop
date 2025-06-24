import { Link } from "react-router-dom";
import P70Ultra from "../assets/P70-ultra.webp";
import P70Pro from "../assets/P70-pro.webp";
import P70 from "../assets/P70.webp";
import P60Pro from "../assets/Huawei-P60-Pro.webp";
import P50ProPocket from "../assets/Huawei-P50-Pocketavif.webp";
import P40Pro from "../assets/Huawei-P40-Pro.webp";
import P40 from "../assets/Huawei-P40.webp";
import P30Pro from "../assets/Huawei-P30-Pro.webp";
import P30 from "../assets/Huawei-P30.webp";
import Footer from "../components/Footer";

const modele = [
  { nume: "Huawei P70 Ultra", slug: "huawei-p70-ultra", imagine: P70Ultra },
  { nume: "Huawei P70 Pro", slug: "huawei-p70-pro", imagine: P70Pro },
  { nume: "Huawei P70", slug: "huawei-p70", imagine: P70 },
  { nume: "Huawei P60 Pro", slug: "huawei-p60-pro", imagine: P60Pro },
  {
    nume: "Huawei P50 Pro Pocket",
    slug: "huawei-p50-pro-pocket",
    imagine: P50ProPocket,
  },
  { nume: "Huawei P40 Pro", slug: "huawei-p40-pro", imagine: P40Pro },
  { nume: "Huawei P40", slug: "huawei-p40", imagine: P40 },
  { nume: "Huawei P30 Pro", slug: "huawei-p30-pro", imagine: P30Pro },
  { nume: "Huawei P30", slug: "huawei-p30", imagine: P30 },
];

export default function Huawei() {
  return (
    <div className="min-h-screen px-2 sm:px-6 pb-8 bg-gradient-to-br from-rose-100 via-white to-blue-100 relative overflow-x-hidden">
      {/* Efecte bokeh pentru profunzime */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse-slow" />
      </div>
      <div className="relative z-10">
        <div className="grid w-full max-w-6xl grid-cols-2 gap-5 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mt-4">
          {modele.map((model) => (
            <Link
              key={model.slug}
              to={`/huawei/${model.slug}`}
              className="group relative flex flex-col items-center w-full max-w-xs p-4 sm:p-5 bg-white/80 border border-rose-100 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 backdrop-blur-xl
                hover:scale-[1.03] hover:border-rose-300 hover:bg-white/90
                before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-rose-200/30 before:to-blue-200/20 before:opacity-0 group-hover:before:opacity-100 before:transition-all before:duration-300"
              style={{ perspective: 800 }}
            >
              {/* Imagine cu efect 3D */}
              <div className="overflow-hidden rounded-2xl aspect-square w-full bg-gradient-to-br from-rose-50 via-white to-blue-50 border border-rose-100 flex items-center justify-center p-5 shadow-inner group-hover:rotate-[-3deg] group-hover:scale-105 transition-all duration-300">
                <img
                  src={model.imagine}
                  alt={model.nume}
                  className="object-contain w-28 h-28 sm:w-32 sm:h-32 drop-shadow-xl transition-transform duration-300 group-hover:scale-110"
                  draggable={false}
                />
              </div>
              {/* Titlu */}
              <span className="mt-3 text-base sm:text-lg font-bold text-center text-black group-hover:text-rose-700 group-hover:underline tracking-wide drop-shadow transition-all duration-200 line-clamp-2 w-full">
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
