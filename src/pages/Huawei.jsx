import { Link } from "react-router-dom";
import Pura70Ultra from "../assets/huawei-pura-70-ultra.webp";
import Pura70Pro from "../assets/huawei-pura-70-pro.webp";
import Pura70 from "../assets/huawei-pura-70.webp";
import MateX6 from "../assets/huawei-mate-x6.webp";
import Mate50Pro from "../assets/huawei-mate-50-pro.webp";
import P60Pro from "../assets/huawei-p60-pro.webp";
import P50Pocket from "../assets/huawei-p50-pocket.webp";
import P40Pro from "../assets/huawei-p40-pro.webp";
import P40 from "../assets/huawei-p40.webp";
import P30Pro from "../assets/huawei-p30-pro.webp";
import P30 from "../assets/huawei-p30.webp";
import P30Lite from "../assets/huawei-p30-lite.webp";
import Breadcrumbs from "../components/BreadCrumbs";

const modele = [
  {
    nume: "Huawei Pura 70 Ultra",
    modelSlug: "huawei-pura-70-ultra",
    imagine: Pura70Ultra,
  },
  {
    nume: "Huawei Pura 70 Pro",
    modelSlug: "huawei-pura-70-pro",
    imagine: Pura70Pro,
  },
  {
    nume: "Huawei Pura 70",
    modelSlug: "huawei-pura-70",
    imagine: Pura70,
  },
  {
    nume: "Huawei Mate X6",
    modelSlug: "huawei-mate-x6",
    imagine: MateX6,
  },
  {
    nume: "Huawei Mate 50 Pro",
    modelSlug: "huawei-mate-50-pro",
    imagine: Mate50Pro,
  },
  { nume: "Huawei P60 Pro", modelSlug: "huawei-p60-pro", imagine: P60Pro },
  {
    nume: "Huawei P50 Pocket",
    modelSlug: "huawei-p50-pocket",
    imagine: P50Pocket,
  },
  { nume: "Huawei P40 Pro", modelSlug: "huawei-p40-pro", imagine: P40Pro },
  { nume: "Huawei P40", modelSlug: "huawei-p40", imagine: P40 },
  { nume: "Huawei P30 Pro", modelSlug: "huawei-p30-pro", imagine: P30Pro },
  { nume: "Huawei P30", modelSlug: "huawei-p30", imagine: P30 },
  { nume: "Huawei P30 Lite", modelSlug: "huawei-p30-lite", imagine: P30Lite },
];

export default function Huawei() {
  return (
    <div className="px-2 sm:px-6 pb-8 bg-gradient-to-b from-bg-gray-50 to bg-gray-100 relative overflow-x-hidden">
      <div className="relative z-10">
        <Breadcrumbs />
        <div className="grid w-full max-w-6xl grid-cols-2 gap-3 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {modele.map((model, idx) => (
            <Link
              key={model.modelSlug}
              to={`/huawei/${model.modelSlug}`}
              className="group relative flex flex-col items-center w-full max-w-xs p-4 sm:p-5 bg-white border border-gray-100 rounded-sm"
              style={{ perspective: 800 }}
            >
              {/* Imagine cu efect 3D */}
              <div className="relative w-full pt-[100%] rounded-2xl overflow-hidden bg-white">
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
    </div>
  );
}
