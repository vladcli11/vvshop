import { Link } from "react-router-dom";
import appleLogo from "../assets/apple.webp";
import samsungLogo from "../assets/samsung.webp";
import huaweiLogo from "../assets/huawei.webp";
import Footer from "../components/Footer";

const TruckIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline lucide lucide-plane-icon lucide-plane"
  >
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 px-4 sm:px-6 pb-10">
      {/* Banner promoțional */}
      <div className="w-full overflow-hidden py-0">
        <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-black rounded-none px-0 py-1">
          <div className="marquee whitespace-nowrap font-bold text-lg sm:text-lg flex items-center justify-center">
            <span className="mx-2">
              {TruckIcon}
              Livrare gratuită la comenzile de peste{" "}
              <span className="font-extrabold">50 LEI</span>!
            </span>
            <span className="mx-2">
              {TruckIcon}
              Livrare gratuită la comenzile de peste{" "}
              <span className="font-extrabold">50 LEI</span>!
            </span>
            <span className="mx-2">
              {TruckIcon}
              Livrare gratuită la comenzile de peste{" "}
              <span className="font-extrabold">50 LEI</span>!
            </span>
            <span className="mx-2">
              {TruckIcon}
              Livrare gratuită la comenzile de peste{" "}
              <span className="font-extrabold">50 LEI</span>!
            </span>
            <span className="mx-2">
              Livrare gratuită la comenzile de peste{" "}
              <span className="font-extrabold">50 LEI</span>!
            </span>
          </div>
        </div>
      </div>
      <main className="flex flex-col items-center pt-6">
        {/* Grilă branduri */}
        <div className="grid grid-cols-1 gap-4 w-full max-w-md px-4 sm:px-0 justify-items-center">
          {[
            { to: "/apple", name: "Apple", logo: appleLogo },
            { to: "/samsung", name: "Samsung", logo: samsungLogo },
            { to: "/huawei", name: "Huawei", logo: huaweiLogo },
          ].map(({ to, name, logo }) => (
            <Link
              key={name}
              to={to}
              className="group relative bg-white backdrop-blur-md border border-gray-200 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col items-center p-6 w-[280px] sm:w-[320px] md:w-[400px]"
            >
              {/* HALO */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-white/60 to-gray-200/50 blur-xl opacity-60 group-hover:scale-105 transition-transform duration-300" />
                <div className="relative w-24 h-20 sm:w-28 sm:h-24 rounded-full flex items-center justify-center bg-white/80 shadow-inner ring-1 ring-white/50 overflow-hidden">
                  <img
                    src={logo}
                    alt={name}
                    className="w-[90%] h-[90%] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
              <span className="mt-4 text-lg sm:text-xl font-semibold text-gray-800 text-center">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
