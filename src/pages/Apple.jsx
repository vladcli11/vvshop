import { Link } from "react-router-dom";
import iphone16promax from "../assets/iphone16promax.webp";
import iphone16pro from "../assets/iphone16pro.webp";
import iphone16 from "../assets/iphone16.webp";
import iphone15promax from "../assets/iphone15promax.webp";
import iphone15pro from "../assets/iphone15pro.webp";
import iphone15 from "../assets/iphone15.webp";
import iphone14promax from "../assets/iphone14promax.webp";
import iphone14pro from "../assets/iphone14pro.webp";
import iphone13promax from "../assets/iphone13promax.webp";
import iphone13pro from "../assets/iphone13pro.webp";
import iphone13 from "../assets/iphone13.webp";
import iphone14 from "../assets/iphone14.webp";
import iphone12promax from "../assets/iphone12promax.webp";
import iphone12pro from "../assets/iphone12pro.webp";
import iphone12 from "../assets/iphone12.webp";
import Footer from "../components/Footer";

const modele = [
  {
    nume: "iPhone 16 Pro Max",
    modelSlug: "iphone-16-pro-max",
    imagine: iphone16promax,
  },
  { nume: "iPhone 16 Pro", modelSlug: "iphone-16-pro", imagine: iphone16pro },
  { nume: "iPhone 16", modelSlug: "iphone-16", imagine: iphone16 },
  {
    nume: "iPhone 15 Pro Max",
    modelSlug: "iphone-15-pro-max",
    imagine: iphone15promax,
  },
  { nume: "iPhone 15 Pro", modelSlug: "iphone-15-pro", imagine: iphone15pro },
  { nume: "iPhone 15", modelSlug: "iphone-15", imagine: iphone15 },
  {
    nume: "iPhone 14 Pro Max",
    modelSlug: "iphone-14-pro-max",
    imagine: iphone14promax,
  },
  { nume: "iPhone 14 Pro", modelSlug: "iphone-14-pro", imagine: iphone14pro },
  { nume: "iPhone 14", modelSlug: "iphone-14", imagine: iphone14 },
  {
    nume: "iPhone 13 Pro Max",
    modelSlug: "iphone-13-pro-max",
    imagine: iphone13promax,
  },
  { nume: "iPhone 13 Pro", modelSlug: "iphone-13-pro", imagine: iphone13pro },
  { nume: "iPhone 13", modelSlug: "iphone-13", imagine: iphone13 },
  {
    nume: "iPhone 12 Pro Max",
    modelSlug: "iphone-12-pro-max",
    imagine: iphone12promax,
  },
  { nume: "Iphone 12 Pro", modelSlug: "iphone-12-pro", imagine: iphone12pro },
  { nume: "iPhone 12", modelSlug: "iphone-12", imagine: iphone12 },
];

export default function Apple() {
  return (
    <div className="min-h-screen px-2 sm:px-6 pb-8 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 relative overflow-x-hidden">
      <div className="relative z-10">
        <div className="grid w-full max-w-5xl grid-cols-2 gap-3 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mt-4">
          {modele.map((model) => (
            <Link
              key={model.modelSlug}
              to={`/apple/${model.modelSlug}`}
              className="group relative flex flex-col items-center w-full max-w-xs p-4 sm:p-5 bg-white border border-gray-100 rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300"
              style={{ perspective: 800 }}
            >
              {/* Imagine */}
              <div className="relative w-full pt-[100%] overflow-hidden bg-white transition-all duration-300">
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
              <h3 className="mt-3 pt-3 border-t border-gray-200 text-sm sm:text-base font-medium text-center text-gray-700 w-full">
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
