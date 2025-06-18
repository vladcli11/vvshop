import Header from "../components/Header";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Separator from "../components/Separator";
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

const modele = [
  { nume: "Samsung Galaxy S20", slug: "samsung-galaxy-s20", imagine: S20 },
  {
    nume: "Samsung Galaxy S20 FE",
    slug: "samsung-galaxy-s20-fe",
    imagine: S20FE,
  },
  {
    nume: "Samsung Galaxy S20 PLUS",
    slug: "samsung-galaxy-s20-plus",
    imagine: S20PLUS,
  },
  {
    nume: "Samsung Galaxy S20 ULTRA",
    slug: "samsung-galaxy-s20-ultra",
    imagine: S20ULTRA,
  },

  { nume: "Samsung Galaxy S21", slug: "samsung-galaxy-s21", imagine: S21 },
  {
    nume: "Samsung Galaxy S21 FE",
    slug: "samsung-galaxy-s21-fe",
    imagine: S21FE,
  },
  {
    nume: "Samsung Galaxy S21 PLUS",
    slug: "samsung-galaxy-s21-plus",
    imagine: S21PLUS,
  },
  {
    nume: "Samsung Galaxy S21 ULTRA",
    slug: "samsung-galaxy-s21-ultra",
    imagine: S21ULTRA,
  },

  { nume: "Samsung Galaxy S22", slug: "samsung-galaxy-s22", imagine: S22 },
  {
    nume: "Samsung Galaxy S22 PLUS",
    slug: "samsung-galaxy-s22-plus",
    imagine: S22PLUS,
  },
  {
    nume: "Samsung Galaxy S22 ULTRA",
    slug: "samsung-galaxy-s22-ultra",
    imagine: S22ULTRA,
  },

  { nume: "Samsung Galaxy S23", slug: "samsung-galaxy-s23", imagine: S23 },
  {
    nume: "Samsung Galaxy S23 PLUS",
    slug: "samsung-galaxy-s23-plus",
    imagine: S23PLUS,
  },
  {
    nume: "Samsung Galaxy S23 ULTRA",
    slug: "samsung-galaxy-s23-ultra",
    imagine: S23ULTRA,
  },

  { nume: "Samsung Galaxy S24", slug: "samsung-galaxy-s24", imagine: S24 },
  {
    nume: "Samsung Galaxy S24 PLUS",
    slug: "samsung-galaxy-s24-plus",
    imagine: S24PLUS,
  },
  {
    nume: "Samsung Galaxy S24 ULTRA",
    slug: "samsung-galaxy-s24-ultra",
    imagine: S24ULTRA,
  },

  { nume: "Samsung Galaxy S25", slug: "samsung-galaxy-s25", imagine: S25 },
  {
    nume: "Samsung Galaxy S25 DUAL SIM",
    slug: "samsung-galaxy-s25-dual-sim",
    imagine: S25DUALSIM,
  },
  {
    nume: "Samsung Galaxy S25 ULTRA",
    slug: "samsung-galaxy-s25-ultra",
    imagine: S25ULTRA,
  },
  {
    nume: "Samsung Galaxy Z Flip",
    slug: "samsung-galaxy-z-flip",
    imagine: ZFLIP,
  },
  {
    nume: "Samsung Galaxy Z Flip3",
    slug: "samsung-galaxy-z-flip3",
    imagine: ZFLIP3,
  },
  {
    nume: "Samsung Galaxy Z Flip4",
    slug: "samsung-galaxy-z-flip4",
    imagine: ZFLIP4,
  },
  {
    nume: "Samsung Galaxy Z Flip5",
    slug: "samsung-galaxy-z-flip5",
    imagine: ZFLIP5,
  },
  {
    nume: "Samsung Galaxy Z Flip6",
    slug: "samsung-galaxy-z-flip6",
    imagine: ZFLIP6,
  },
  {
    nume: "Samsung Galaxy Z Fold2",
    slug: "samsung-galaxy-z-fold2",
    imagine: ZFOLD2,
  },
  {
    nume: "Samsung Galaxy Z Fold3",
    slug: "samsung-galaxy-z-fold3",
    imagine: ZFOLD3,
  },
  {
    nume: "Samsung Galaxy Z Fold4",
    slug: "samsung-galaxy-z-fold4",
    imagine: ZFOLD4,
  },
  {
    nume: "Samsung Galaxy Z Fold5",
    slug: "samsung-galaxy-z-fold5",
    imagine: ZFOLD5,
  },
  {
    nume: "Samsung Galaxy Z Fold6",
    slug: "samsung-galaxy-z-fold6",
    imagine: ZFOLD6,
  },
  { nume: "Samsung Galaxy A01", slug: "samsung-galaxy-a01", imagine: A01 },
  { nume: "Samsung Galaxy A02", slug: "samsung-galaxy-a02", imagine: A02 },
  { nume: "Samsung Galaxy A03", slug: "samsung-galaxy-a03", imagine: A03 },
  { nume: "Samsung Galaxy A04", slug: "samsung-galaxy-a04", imagine: A04 },
  { nume: "Samsung Galaxy A05", slug: "samsung-galaxy-a05", imagine: A05 },
  { nume: "Samsung Galaxy A11", slug: "samsung-galaxy-a11", imagine: A11 },
  { nume: "Samsung Galaxy A12", slug: "samsung-galaxy-a12", imagine: A12 },
  { nume: "Samsung Galaxy A13", slug: "samsung-galaxy-a13", imagine: A13 },
  { nume: "Samsung Galaxy A14", slug: "samsung-galaxy-a14", imagine: A14 },
  { nume: "Samsung Galaxy A15", slug: "samsung-galaxy-a15", imagine: A15 },
  { nume: "Samsung Galaxy A21", slug: "samsung-galaxy-a21", imagine: A21 },
  { nume: "Samsung Galaxy A22", slug: "samsung-galaxy-a22", imagine: A22 },
  { nume: "Samsung Galaxy A23", slug: "samsung-galaxy-a23", imagine: A23 },
  { nume: "Samsung Galaxy A24", slug: "samsung-galaxy-a24", imagine: A24 },
  { nume: "Samsung Galaxy A25", slug: "samsung-galaxy-a25", imagine: A25 },
  { nume: "Samsung Galaxy A31", slug: "samsung-galaxy-a31", imagine: A31 },
  { nume: "Samsung Galaxy A32", slug: "samsung-galaxy-a32", imagine: A32 },
  { nume: "Samsung Galaxy A33", slug: "samsung-galaxy-a33", imagine: A33 },
  { nume: "Samsung Galaxy A34", slug: "samsung-galaxy-a34", imagine: A34 },
  { nume: "Samsung Galaxy A35", slug: "samsung-galaxy-a35", imagine: A35 },
  { nume: "Samsung Galaxy A41", slug: "samsung-galaxy-a41", imagine: A41 },
  { nume: "Samsung Galaxy A42", slug: "samsung-galaxy-a42", imagine: A42 },
  { nume: "Samsung Galaxy A51", slug: "samsung-galaxy-a51", imagine: A51 },
  { nume: "Samsung Galaxy A52", slug: "samsung-galaxy-a52", imagine: A52 },
  { nume: "Samsung Galaxy A53", slug: "samsung-galaxy-a53", imagine: A53 },
  { nume: "Samsung Galaxy A54", slug: "samsung-galaxy-a54", imagine: A54 },
  { nume: "Samsung Galaxy A55", slug: "samsung-galaxy-a55", imagine: A55 },
  { nume: "Samsung Galaxy A71", slug: "samsung-galaxy-a71", imagine: A71 },
  { nume: "Samsung Galaxy A72", slug: "samsung-galaxy-a72", imagine: A72 },
  { nume: "Samsung Galaxy A73", slug: "samsung-galaxy-a73", imagine: A73 },
];

export default function Samsung() {
  return (
    <div className="min-h-screen bg-white px-6 pb-6">
      <Header />

      <Separator text="Modele disponibile" />
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full max-w-6xl mx-auto justify-items-center">
        {modele.map((model) => (
          <Link
            key={model.slug}
            to={`/samsung/${model.slug}`}
            className="border p-4 rounded-xl flex flex-col items-center hover:shadow-xl transition-transform duration-300 md: w-40 h-54"
          >
            <img
              src={model.imagine}
              alt={model.nume}
              className="w-32 h-32 object-contain"
            />
            <span className="mt-2 font-semibold text-black text-center line-clamp-2 w-full">
              {model.nume}
            </span>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
}
