import { Link } from "react-router-dom";
import appleLogo from "../assets/apple.png";
import samsungLogo from "../assets/samsung.png";
import huaweiLogo from "../assets/huawei.png";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 🔝 Header fix */}
      <Header />
      {/* 🔽 Conținut principal */}
      <main className="flex-grow px-3 pb-10 flex flex-col items-center">
        {/* 🔸 Separator */}

        <div className="flex items-center my-2 w-full max-w-6xl">
          <div className="flex-grow border-t border-gray-400" />
          <span className="px-4 pb-3 text-gray-600 text-sm uppercase tracking-wider">
            Alege Brandul
          </span>
          <div className="flex-grow border-t border-gray-400" />
        </div>

        {/* 🔹 Grilă branduri */}
        <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
          <Link
            to="/apple"
            className="border p-4 rounded-xl flex flex-col items-center hover:shadow-xl transition-transform duration-300"
          >
            <img
              src={appleLogo}
              alt="Apple"
              className="w-24 h-24 object-contain"
            />
            <span className="mt-2 font-semibold text-black text-xl">Apple</span>
          </Link>
          <Link
            to="/samsung"
            className="border p-4 rounded-xl flex flex-col items-center hover:shadow-xl transition-transform duration-300"
          >
            <img
              src={samsungLogo}
              alt="Samsung"
              className="w-24 h-24 object-contain"
            />
            <span className="mt-2 font-semibold text-black text-xl">
              Samsung
            </span>
          </Link>

          <Link
            to="/huawei"
            className="border p-4 rounded-xl flex flex-col items-center hover:shadow-xl transition-transform duration-300"
          >
            <img
              src={huaweiLogo}
              alt="Huawei"
              className="w-24 h-24 object-contain"
            />
            <span className="mt-2 font-semibold text-black text-xl">
              Huawei
            </span>
          </Link>
        </div>
      </main>

      {/* 🔻 Footer */}
      <Footer />
    </div>
  );
}
