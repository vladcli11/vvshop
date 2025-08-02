import { Link } from "react-router-dom";
import appleLogo from "../assets/apple.webp";
import samsungLogo from "../assets/samsung.webp";
import huaweiLogo from "../assets/huawei.webp";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-gray-50 to bg-gray-100 pb-10">
      <main className="flex flex-col items-center">
        {/* Grilă branduri */}
        <div className="grid grid-cols-1 gap-2 w-full max-w-md px-4 justify-items-center mt-6">
          {[
            { to: "/apple", name: "Apple", logo: appleLogo },
            { to: "/samsung", name: "Samsung", logo: samsungLogo },
            { to: "/huawei", name: "Huawei", logo: huaweiLogo },
          ].map(({ to, name, logo }) => (
            <Link
              key={name}
              to={to}
              className="relative bg-white border border-gray-200 rounded-sm shadow-md flex flex-col items-center p-6 w-[360px] sm:w-[400px] md:w-[460px]"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center bg-white shadow-sm ring-1 ring-white/50">
                <img
                  src={logo}
                  alt={name}
                  width={90}
                  height={90}
                  loading={name === "Samsung" ? "eager" : "lazy"}
                  fetchPriority={name === "Samsung" ? "high" : "auto"}
                  className="w-[90%] h-[90%] max-h-32 object-contain"
                />
              </div>
              <span className="mt-2 text-2xl sm:text-2xl font-semibold text-[#1F2937] text-center">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
