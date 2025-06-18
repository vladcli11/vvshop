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
import iphone14 from "../assets/iphone14.webp";
import iphone12 from "../assets/iphone12.png";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Separator from "../components/Separator";

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
    nume: "iPhone 14",
    slug: "iphone-14",
    imagine: iphone14,
  },
  {
    nume: "iPhone 13 Pro Max",
    slug: "iphone-13-pro-max",
    imagine: iphone13promax,
  },
  { nume: "iPhone 13 Pro", slug: "iphone-13-pro", imagine: iphone13pro },
  { nume: "iPhone 13", slug: "iphone-13", imagine: iphone13 },
  { nume: "iPhone 12 Pro Max", slug: "iphone-12-pro-max", imagine: iphone12 },
];
export default function Apple() {
  return (
    <div className="min-h-screen px-6 pb-6 bg-white ">
      <Header />
      <Separator text="Modele disponibile" />
      <div className="grid w-full max-w-4xl grid-cols-2 gap-3 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
        {modele.map((model) => (
          <Link
            key={model.slug}
            to={`/apple/${model.slug}`}
            className="flex flex-col items-center w-40 p-4 transition-transform duration-300 border rounded-xl hover:shadow-xl md: h-54"
          >
            <img
              src={model.imagine}
              alt={model.nume}
              className="object-contain w-32 h-32"
            />
            <span className="mt-2 font-semibold text-center text-black">
              {model.nume}
            </span>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
}
