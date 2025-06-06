import { Link } from "react-router-dom";
import P70Ultra from "../assets/P70-Ultra.webp";
import P70Pro from "../assets/P70-Pro.webp";
import P70 from "../assets/P70.webp";
import P60Pro from "../assets/Huawei-P60-Pro.webp";
import P50ProPocket from "../assets/Huawei-P50-Pocketavif.webp";
import P40Pro from "../assets/Huawei-P40-Pro.webp";
import P40 from "../assets/Huawei-P40.webp";
import P30Pro from "../assets/Huawei-P30-Pro.webp";
import P30 from "../assets/Huawei-P30.webp";
import Header from "../components/Header";
import Footer from "../components/Footer";

const modele = [
  {
    nume: "Huawei P70 Ultra",
    slug: "huawei-p70-ultra",
    imagine: P70Ultra,
  },
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
    <div className="min-h-screen bg-white px-6 pb-6">
      <Header />
      {/* 🔸 Separator vizual */}
      <div className="flex items-center my-4 -mx-6">
        <div className="flex-grow h-[2px] bg-gradient-to-r from-green-400 to-green-600" />
        <span className="px-2 text-gray-600 text-base uppercase tracking-wider whitespace-nowrap">
          Alege modelul
        </span>
        <div className="flex-grow h-[2px] bg-gradient-to-r from-blue-600 to-blue-400" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full max-w-6xl mx-auto justify-items-center">
        {modele.map((model) => (
          <Link
            key={model.slug}
            to={`/huawei/${model.slug}`}
            className="border p-4 rounded-xl flex flex-col items-center hover:shadow-xl transition-transform duration-300 md: w-40 h-54"
          >
            <img
              src={model.imagine}
              alt={model.nume}
              className="w-32 h-32 object-contain"
            />
            <span className="mt-2 font-semibold text-black text-center">
              {model.nume}
            </span>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
}
