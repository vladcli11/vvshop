import { Link } from "react-router-dom";
import iphone16promax from "../assets/iphone16promax.png";
import iphone16pro from "../assets/iphone16pro.png";
import iphone16 from "../assets/iphone16.png";
import iphone15promax from "../assets/iphone15promax.png";
import iphone15pro from "../assets/iphone15pro.png";
import iphone14promax from "../assets/iphone14promax.png";
import iphone14pro from "../assets/iphone14pro.png";
import iphone13promax from "../assets/iphone13promax.png";
import iphone13pro from "../assets/iphone13pro.png";
import iphone13 from "../assets/iphone13.png";
import iphone12 from "../assets/iphone12.png";
import Header from "../components/Header";
import Footer from "../components/Footer";

const modele = [
  {
    nume: "iPhone 16 Pro Max",
    slug: "iphone-16-pro-max",
    imagine: iphone16promax,
  },
  { nume: "iPhone 16 Pro", slug: "iphone-16-pro", imagine: iphone16pro },
  { nume: "iPhone 16", slug: "iphone-16", imagine: iphone16 },
  {
    nume: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    imagine: iphone15promax,
  },
  { nume: "iPhone 15 Pro", slug: "iphone-15-pro", imagine: iphone15pro },
  {
    nume: "iPhone 14 Pro Max",
    slug: "iphone-14-pro-max",
    imagine: iphone14promax,
  },
  { nume: "iPhone 14 Pro", slug: "iphone-14-pro", imagine: iphone14pro },
  {
    nume: "iPhone 13 Pro Max",
    slug: "iphone-13-pro-max",
    imagine: iphone13promax,
  },
  { nume: "iPhone 13 Pro", slug: "iphone-13-pro", imagine: iphone13pro },
  { nume: "iPhone 13", slug: "iphone-13", imagine: iphone13 },
  { nume: "iPhone 12 Pro Max", slug: "iphone-12-pro-max", imagine: iphone12 },
];
console.log("✅ Apple.jsx s-a montat");
export default function Apple() {
  return (
    <div className="min-h-screen bg-white px-6 pb-6">
      <Header />
      {/* 🔸 Separator vizual */}
      <div className="flex items-center my-5">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="px-4 text-gray-600 text-sm uppercase tracking-wider">
          Alege modelul
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full max-w-6xl mx-auto justify-items-center">
        {modele.map((model) => (
          <Link
            key={model.slug}
            to={`/apple/${model.slug}`}
            className="border p-4 rounded-xl flex flex-col items-center hover:shadow-xl transition-transform duration-300"
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
