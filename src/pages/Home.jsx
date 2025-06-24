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
              <span className="mt-4 text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors text-center">
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
