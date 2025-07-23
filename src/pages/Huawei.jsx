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
    <div className="min-h-screen px-2 sm:px-6 pb-8 bg-gradient-to-b from-bg-gray-50 to bg-gray-100 relative overflow-x-hidden">
      <div className="relative z-10">
        <div className="grid w-full max-w-6xl grid-cols-2 gap-3 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mt-4">
          {modele.map((model, idx) => (
            <Link
              key={model.modelSlug}
              to={`/huawei/${model.modelSlug}`}
              className="group relative flex flex-col items-center w-full max-w-xs p-4 sm:p-5 bg-white border border-gray-100 rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300"
              style={{ perspective: 800 }}
            >
              {/* Imagine cu efect 3D */}
              <div className="relative w-full pt-[100%] rounded-2xl overflow-hidden bg-white transition-all duration-300">
                <img
                  src={model.imagine}
                  alt={model.nume}
                  sizes="(max-width: 640px) 90vw, 300px"
                  loading={idx === 0 ? "eager" : "lazy"}
                  fetchPriority={idx === 0 ? "high" : undefined}
                  width="300"
                  height="300"
                  className="absolute inset-0 w-full h-full object-contain"
                  draggable={false}
                />
              </div>
              {/* Titlu */}
              <h3 className="mt-3 pt-3 border-t border-gray-200 text-sm sm:text-base font-medium text-center text-[#1F2937] w-full">
                {model.nume}
              </h3>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
