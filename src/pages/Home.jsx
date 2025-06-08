import { Link } from "react-router-dom";
import appleLogo from "../assets/apple.png";
import samsungLogo from "../assets/samsung.png";
import huaweiLogo from "../assets/huawei.png";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white px-6 pb-6 ">
      <Header />

      <main className="pb-10 flex flex-col items-center">
        {/* 🔸 Separator full-width */}
        <div className="w-screen px-6 my-2">
          <div className="flex items-center">
            <div className="flex-grow h-[2px] bg-gradient-to-r from-green-400 to-green-600" />
            <span className="px-2 text-gray-600 text-base uppercase tracking-wider whitespace-nowrap">
              Alege brandul
            </span>
            <div className="flex-grow h-[2px] bg-gradient-to-r from-blue-600 to-blue-400" />
          </div>
        </div>

        {/* 🔹 Grilă branduri */}
        <div className="pt-4 grid grid-cols-1 gap-3 w-full max-w-sm px-6">
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

      <Footer />
    </div>
  );
}
