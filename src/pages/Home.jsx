import { Link } from "react-router-dom";
import appleLogo from "../assets/apple.webp";
import samsungLogo from "../assets/samsung.webp";
import huaweiLogo from "../assets/huawei.webp";
import Footer from "../components/Footer";

function TruckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="31"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-truck-icon lucide-truck"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 pb-10">
      <main className="flex flex-col items-center">
        <div className="w-full px-3 sm:px-6 mb-4">
          <div className="max-w-full mx-2 sm:mx-80 flex items-center justify-center gap-4 rounded-sm border border-gray-400 bg-gray-100 px-4 py-1 sm:py-3 shadow-sm sm:shadow-md">
            <p className="text-base sm:text-xl text-gray-900 font-medium text-center">
              Livrare gratuită la comenzile de peste{" "}
              <span className="text-orange-600 font-bold text-xl sm:text-2xl inline-flex gap-3">
                50 LEI
                <TruckIcon className="w-6 h-6" />
              </span>
            </p>
          </div>
        </div>
        {/* Grilă branduri */}
        <div className="grid grid-cols-1 gap-2 w-full max-w-md px-4 justify-items-center">
          {[
            { to: "/apple", name: "Apple", logo: appleLogo },
            { to: "/samsung", name: "Samsung", logo: samsungLogo },
            { to: "/huawei", name: "Huawei", logo: huaweiLogo },
          ].map(({ to, name, logo }) => (
            <Link
              key={name}
              to={to}
              className="group relative bg-white backdrop-blur-md border border-gray-200 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col items-center p-6 w-[360px] sm:w-[400px] md:w-[460px]"
            >
              {/* HALO */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-white/60 to-gray-200/50 blur-xl opacity-60 group-hover:scale-105 transition-transform duration-300" />
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center bg-white/80 shadow-inner ring-1 ring-white/50 overflow-hidden">
                  <img
                    src={logo}
                    alt={name}
                    width={90}
                    height={90}
                    loading={name === "Samsung" ? "eager" : "lazy"}
                    fetchPriority={name === "Samsung" ? "high" : "auto"}
                    className="w-[90%] h-[90%] max-h-32 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
              <span className="mt-2 text-2xl sm:text-2xl font-semibold text-gray-800 text-center">
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
