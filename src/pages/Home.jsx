import { Link } from "react-router-dom";
import appleLogo from "../assets/apple.webp";
import samsungLogo from "../assets/samsung.webp";
import huaweiLogo from "../assets/huawei.webp";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 px-4 sm:px-6 pb-10">
      <main className="flex flex-col items-center pt-6">
        {/* Grilă branduri */}
        <div className="grid grid-cols-1 w-full max-w-md px-0 sm:grid-cols-1 sm:max-w-3xl sm:px-0 md:grid-cols-1 md:max-w-4xl lg:grid-cols-1">
          {[
            { to: "/apple", name: "Apple", logo: appleLogo },
            { to: "/samsung", name: "Samsung", logo: samsungLogo },
            { to: "/huawei", name: "Huawei", logo: huaweiLogo },
          ].map(({ to, name, logo }, idx, arr) => (
            <Link
              key={name}
              to={to}
              className={`group relative bg-white backdrop-blur-md border border-gray-200 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col items-center justify-center w-full h-40 sm:h-48 md:h-56 lg:h-64 sm:w-[400px] md:w-[500px] mx-auto p-6
        ${idx !== arr.length - 1 ? "mb-1" : "mb-2"}`}
            >
              {/* HALO */}
              <div className="relative flex items-center justify-center h-full">
                <div className="absolute w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-white/60 to-gray-200/50 blur-xl opacity-60 group-hover:scale-105 transition-transform duration-300" />
                <div className="relative w-20 h-16 sm:w-28 sm:h-24 md:w-36 md:h-28 rounded-full flex items-center justify-center bg-white/80 shadow-inner ring-1 ring-white/50 overflow-hidden">
                  <img
                    src={logo}
                    alt={name}
                    className="w-[90%] h-[90%] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
              <span className="mt-4 text-lg sm:text-2xl md:text-3xl font-semibold text-gray-800 text-center">
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
