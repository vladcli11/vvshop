import Header from "../components/Header";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

// S series
import S20 from "../assets/S20.png";
import S20FE from "../assets/S20 FE.png";
import S20PLUS from "../assets/S20 PLUS.png";
import S20ULTRA from "../assets/S20 ULTRA.png";
import S21 from "../assets/S21.png";
import S21FE from "../assets/S21 FE.png";
import S21PLUS from "../assets/S21 PLUS.png";
import S21ULTRA from "../assets/S21 ULTRA.png";
import S22 from "../assets/S22.png";
import S22PLUS from "../assets/S22 PLUS.png";
import S22ULTRA from "../assets/S22 ULTRA.png";
import S23 from "../assets/S23.png";
import S23PLUS from "../assets/S23 PLUS.png";
import S23ULTRA from "../assets/S23 ULTRA.png";
import S24 from "../assets/S24.png";
import S24PLUS from "../assets/S24 PLUS.png";
import S24ULTRA from "../assets/S24 ULTRA.png";
import S25 from "../assets/S25.png";
import S25DUALSIM from "../assets/S25 DUAL SIM.png";
import S25ULTRA from "../assets/S25 ULTRA.png";

// Flip series
import ZFLIP from "../assets/ZFLIP.png";
import ZFLIP3 from "../assets/ZFLIP3.png";
import ZFLIP4 from "../assets/ZFLIP4.png";
import ZFLIP5 from "../assets/ZFLIP5.png";
import ZFLIP6 from "../assets/ZFLIP6.png";

// Fold series
import ZFOLD2 from "../assets/ZFOLD2.png";
import ZFOLD3 from "../assets/ZFOLD3.png";
import ZFOLD4 from "../assets/ZFOLD4.png";
import ZFOLD5 from "../assets/ZFOLD5.png";
import ZFOLD6 from "../assets/ZFOLD6.png";

// A series
import A01 from "../assets/A01.webp";
import A02 from "../assets/A02.webp";
import A03 from "../assets/A03.webp";
import A04 from "../assets/A04.webp";
import A05 from "../assets/A05.webp";
import A11 from "../assets/A11.webp";
import A12 from "../assets/A12.webp";
import A13 from "../assets/A13.webp";
import A14 from "../assets/A14.webp";
import A15 from "../assets/A15.png";
import A21 from "../assets/A21.png";
import A22 from "../assets/A22.png";
import A23 from "../assets/A23.png";
import A24 from "../assets/A24.png";
import A25 from "../assets/A25.png";
import A31 from "../assets/A31.png";
import A32 from "../assets/A32.png";
import A33 from "../assets/A33.png";
import A34 from "../assets/A34.png";
import A35 from "../assets/A35.png";
import A41 from "../assets/A41.png";
import A42 from "../assets/A42.png";
import A51 from "../assets/A51.png";
import A52 from "../assets/A52.png";
import A53 from "../assets/A53.png";
import A54 from "../assets/A54.png";
import A55 from "../assets/A55.png";
import A71 from "../assets/A71.png";
import A72 from "../assets/A72.png";
import A73 from "../assets/A73.png";

// Adaugă badge-uri pentru generație/serie
const modele = [
  { nume: "Samsung Galaxy S20", modelSlug: "samsung-galaxy-s20", imagine: S20 },
  {
    nume: "Samsung Galaxy S20 FE",
    modelSlug: "samsung-galaxy-s20-fe",
    imagine: S20FE,
  },
  {
    nume: "Samsung Galaxy S20 PLUS",
    modelSlug: "samsung-galaxy-s20-plus",
    imagine: S20PLUS,
  },
  {
    nume: "Samsung Galaxy S20 ULTRA",
    modelSlug: "samsung-galaxy-s20-ultra",
    imagine: S20ULTRA,
  },
  { nume: "Samsung Galaxy S21", modelSlug: "samsung-galaxy-s21", imagine: S21 },
  {
    nume: "Samsung Galaxy S21 FE",
    modelSlug: "samsung-galaxy-s21-fe",
    imagine: S21FE,
  },
  {
    nume: "Samsung Galaxy S21 PLUS",
    modelSlug: "samsung-galaxy-s21-plus",
    imagine: S21PLUS,
  },
  {
    nume: "Samsung Galaxy S21 ULTRA",
    modelSlug: "samsung-galaxy-s21-ultra",
    imagine: S21ULTRA,
  },
  { nume: "Samsung Galaxy S22", modelSlug: "samsung-galaxy-s22", imagine: S22 },
  {
    nume: "Samsung Galaxy S22 PLUS",
    modelSlug: "samsung-galaxy-s22-plus",
    imagine: S22PLUS,
  },
  {
    nume: "Samsung Galaxy S22 ULTRA",
    modelSlug: "samsung-galaxy-s22-ultra",
    imagine: S22ULTRA,
  },
  { nume: "Samsung Galaxy S23", modelSlug: "samsung-galaxy-s23", imagine: S23 },
  {
    nume: "Samsung Galaxy S23 PLUS",
    modelSlug: "samsung-galaxy-s23-plus",
    imagine: S23PLUS,
  },
  {
    nume: "Samsung Galaxy S23 ULTRA",
    modelSlug: "samsung-galaxy-s23-ultra",
    imagine: S23ULTRA,
  },
  { nume: "Samsung Galaxy S24", modelSlug: "samsung-galaxy-s24", imagine: S24 },
  {
    nume: "Samsung Galaxy S24 PLUS",
    modelSlug: "samsung-galaxy-s24-plus",
    imagine: S24PLUS,
  },
  {
    nume: "Samsung Galaxy S24 ULTRA",
    modelSlug: "samsung-galaxy-s24-ultra",
    imagine: S24ULTRA,
  },
  { nume: "Samsung Galaxy S25", modelSlug: "samsung-galaxy-s25", imagine: S25 },
  {
    nume: "Samsung Galaxy S25 DUAL SIM",
    modelSlug: "samsung-galaxy-s25-dual-sim",
    imagine: S25DUALSIM,
  },
  {
    nume: "Samsung Galaxy S25 ULTRA",
    modelSlug: "samsung-galaxy-s25-ultra",
    imagine: S25ULTRA,
  },
  {
    nume: "Samsung Galaxy Z Flip",
    modelSlug: "samsung-galaxy-z-flip",
    imagine: ZFLIP,
  },
  {
    nume: "Samsung Galaxy Z Flip3",
    modelSlug: "samsung-galaxy-z-flip3",
    imagine: ZFLIP3,
  },
  {
    nume: "Samsung Galaxy Z Flip4",
    modelSlug: "samsung-galaxy-z-flip4",
    imagine: ZFLIP4,
  },
  {
    nume: "Samsung Galaxy Z Flip5",
    modelSlug: "samsung-galaxy-z-flip5",
    imagine: ZFLIP5,
  },
  {
    nume: "Samsung Galaxy Z Flip6",
    modelSlug: "samsung-galaxy-z-flip6",
    imagine: ZFLIP6,
  },
  {
    nume: "Samsung Galaxy Z Fold2",
    modelSlug: "samsung-galaxy-z-fold2",
    imagine: ZFOLD2,
  },
  {
    nume: "Samsung Galaxy Z Fold3",
    modelSlug: "samsung-galaxy-z-fold3",
    imagine: ZFOLD3,
  },
  {
    nume: "Samsung Galaxy Z Fold4",
    modelSlug: "samsung-galaxy-z-fold4",
    imagine: ZFOLD4,
  },
  {
    nume: "Samsung Galaxy Z Fold5",
    modelSlug: "samsung-galaxy-z-fold5",
    imagine: ZFOLD5,
  },
  {
    nume: "Samsung Galaxy Z Fold6",
    modelSlug: "samsung-galaxy-z-fold6",
    imagine: ZFOLD6,
  },
  { nume: "Samsung Galaxy A01", modelSlug: "samsung-galaxy-a01", imagine: A01 },
  { nume: "Samsung Galaxy A02", modelSlug: "samsung-galaxy-a02", imagine: A02 },
  { nume: "Samsung Galaxy A03", modelSlug: "samsung-galaxy-a03", imagine: A03 },
  { nume: "Samsung Galaxy A04", modelSlug: "samsung-galaxy-a04", imagine: A04 },
  { nume: "Samsung Galaxy A05", modelSlug: "samsung-galaxy-a05", imagine: A05 },
  { nume: "Samsung Galaxy A11", modelSlug: "samsung-galaxy-a11", imagine: A11 },
  { nume: "Samsung Galaxy A12", modelSlug: "samsung-galaxy-a12", imagine: A12 },
  { nume: "Samsung Galaxy A13", modelSlug: "samsung-galaxy-a13", imagine: A13 },
  { nume: "Samsung Galaxy A14", modelSlug: "samsung-galaxy-a14", imagine: A14 },
  { nume: "Samsung Galaxy A15", modelSlug: "samsung-galaxy-a15", imagine: A15 },
  { nume: "Samsung Galaxy A21", modelSlug: "samsung-galaxy-a21", imagine: A21 },
  { nume: "Samsung Galaxy A22", modelSlug: "samsung-galaxy-a22", imagine: A22 },
  { nume: "Samsung Galaxy A23", modelSlug: "samsung-galaxy-a23", imagine: A23 },
  { nume: "Samsung Galaxy A24", modelSlug: "samsung-galaxy-a24", imagine: A24 },
  { nume: "Samsung Galaxy A25", modelSlug: "samsung-galaxy-a25", imagine: A25 },
  { nume: "Samsung Galaxy A31", modelSlug: "samsung-galaxy-a31", imagine: A31 },
  { nume: "Samsung Galaxy A32", modelSlug: "samsung-galaxy-a32", imagine: A32 },
  { nume: "Samsung Galaxy A33", modelSlug: "samsung-galaxy-a33", imagine: A33 },
  { nume: "Samsung Galaxy A34", modelSlug: "samsung-galaxy-a34", imagine: A34 },
  { nume: "Samsung Galaxy A35", modelSlug: "samsung-galaxy-a35", imagine: A35 },
  { nume: "Samsung Galaxy A41", modelSlug: "samsung-galaxy-a41", imagine: A41 },
  { nume: "Samsung Galaxy A42", modelSlug: "samsung-galaxy-a42", imagine: A42 },
  { nume: "Samsung Galaxy A51", modelSlug: "samsung-galaxy-a51", imagine: A51 },
  { nume: "Samsung Galaxy A52", modelSlug: "samsung-galaxy-a52", imagine: A52 },
  { nume: "Samsung Galaxy A53", modelSlug: "samsung-galaxy-a53", imagine: A53 },
  { nume: "Samsung Galaxy A54", modelSlug: "samsung-galaxy-a54", imagine: A54 },
  { nume: "Samsung Galaxy A55", modelSlug: "samsung-galaxy-a55", imagine: A55 },
  { nume: "Samsung Galaxy A71", modelSlug: "samsung-galaxy-a71", imagine: A71 },
  { nume: "Samsung Galaxy A72", modelSlug: "samsung-galaxy-a72", imagine: A72 },
  { nume: "Samsung Galaxy A73", modelSlug: "samsung-galaxy-a73", imagine: A73 },
];

export default function Samsung() {
  return (
    <div className="min-h-screen px-2 sm:px-6 pb-8 bg-gradient-to-br from-blue-100 via-white to-green-100 relative overflow-x-hidden">
      {/* Efecte bokeh pentru profunzime */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-200/30 rounded-full blur-3xl animate-pulse-slow" />
      </div>
      <div className="relative z-10">
        <div className="grid w-full max-w-6xl grid-cols-2 gap-5 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mt-4">
          {modele.map((model) => (
            <Link
              key={model.modelSlug}
              to={`/samsung/${model.modelSlug}`}
              className="group relative flex flex-col items-center w-full max-w-xs p-4 sm:p-5 bg-white/80 border border-blue-100 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 backdrop-blur-xl
                hover:scale-[1.03] hover:border-blue-300 hover:bg-white/90
                before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-blue-200/30 before:to-green-200/20 before:opacity-0 group-hover:before:opacity-100 before:transition-all before:duration-300"
              style={{ perspective: 800 }}
            >
              {/* Badge generație/serie */}
              {model.gen && (
                <span
                  className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold shadow-md
                  ${
                    model.gen === "Nou"
                      ? "bg-gradient-to-r from-blue-400 to-green-400 text-white"
                      : model.gen === "Flip"
                      ? "bg-gradient-to-r from-pink-400 to-blue-400 text-white"
                      : model.gen === "Fold"
                      ? "bg-gradient-to-r from-yellow-400 to-green-400 text-white"
                      : model.gen === "A Series"
                      ? "bg-gradient-to-r from-green-400 to-blue-400 text-white"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }
                `}
                >
                  {model.gen}
                </span>
              )}
              {/* Imagine cu efect 3D */}
              <div className="overflow-hidden rounded-2xl aspect-square w-full bg-gradient-to-br from-blue-50 via-white to-green-50 border border-blue-100 flex items-center justify-center p-5 shadow-inner group-hover:rotate-[-3deg] group-hover:scale-105 transition-all duration-300">
                <img
                  src={model.imagine}
                  alt={model.nume}
                  className="object-contain w-28 h-28 sm:w-32 sm:h-32 drop-shadow-xl transition-transform duration-300 group-hover:scale-110"
                  draggable={false}
                />
              </div>
              {/* Titlu */}
              <span className="mt-3 text-base sm:text-lg font-bold text-center text-black group-hover:text-blue-700 group-hover:underline tracking-wide drop-shadow transition-all duration-200 line-clamp-2 w-full">
                {model.nume}
              </span>
              {/* Glow la hover */}
              <div className="absolute -inset-1 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 z-0 bg-gradient-to-br from-blue-300/30 via-white/0 to-green-300/30 blur-lg" />
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
