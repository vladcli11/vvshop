import { Link } from "react-router-dom";
import appleLogo from "../assets/apple.webp";
import samsungLogo from "../assets/samsung.webp";
import huaweiLogo from "../assets/huawei.webp";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Separator from "../components/Separator";

export default function Home() {
  return (
    <div className="min-h-screen bg-white px-6 pb-6 ">
      <Header />

      <main className="pb-10 flex flex-col items-center">
        <Separator text="Branduri disponibile" />

        {/* 🔹 Grilă branduri */}
        <div className="pt-4 grid grid-cols-1 gap-3 w-full max-w-md px-6 justify-items-center">
          <Link
            to="/apple"
            className="group relative bg-white backdrop-blur-md border border-gray-300 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col items-center p-6 w-[300px] sm:w-[320px] md:w-[400px]"
          >
            {/* Efect HALO în spatele imaginii */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-36 h-36 sm:w-40 sm:h-40  rounded-full bg-gradient-to-br from-white/60 to-gray-200/50 blur-xl opacity-60 group-hover:scale-105 transition-transform duration-300" />

              {/* Container imagine */}
              <div className="relative w-28 h-20 sm:w-32 sm:h-28 rounded-full flex items-center justify-center bg-white/80 shadow-inner ring-1 ring-white/50 overflow-hidden">
                <img
                  src={appleLogo}
                  alt="Apple"
                  className="w-[92%] h-[92%] object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Textul */}
            <span className="mt-4 text-xl sm:text-xl md:text-2xl font-semibold text-gray-800 group-hover:text-black transition-colors text-center">
              Apple
            </span>
          </Link>

          <Link
            to="/samsung"
            className="group relative bg-white backdrop-blur-md border border-gray-300 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col items-center p-6 w-[300px] sm:w-[320px] md:w-[400px]"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-white/60 to-gray-200/50 blur-xl opacity-60 group-hover:scale-105 transition-transform duration-300" />

              <div className="relative w-28 h-20 sm:w-40 sm:h-28 rounded-full flex items-center justify-center bg-white/80 shadow-inner ring-1 ring-white/50 overflow-hidden">
                <img
                  src={samsungLogo}
                  alt="Samsung"
                  className="w-[92%] h-[92%] object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            <span className="mt-4 text-xl sm:text-xl md:text-2xl font-semibold text-gray-800 group-hover:text-black transition-colors text-center">
              Samsung
            </span>
          </Link>

          <Link
            to="/huawei"
            className="group relative bg-white backdrop-blur-md border border-gray-300 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col items-center p-6 w-[300px] sm:w-[320px] md:w-[400px]"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-white/60 to-gray-200/50 blur-xl opacity-60 group-hover:scale-105 transition-transform duration-300" />

              <div className="relative w-28 h-20 sm:w-32 sm:h-28 rounded-full flex items-center justify-center bg-white/80 shadow-inner ring-1 ring-white/50 overflow-hidden">
                <img
                  src={huaweiLogo}
                  alt="Huawei"
                  className="w-[92%] h-[92%] object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            <span className="mt-4 text-xl sm:text-xl md:text-2xl font-semibold text-gray-800 group-hover:text-black transition-colors text-center">
              Huawei
            </span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
