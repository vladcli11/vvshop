import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function BrandModels({ brandSlug, models }) {
  return (
    <div className="min-h-screen bg-white px-6 pb-6">
      <Header />
      <div className="flex items-center my-4 -mx-6">
        <div className="flex-grow h-[2px] bg-gradient-to-r from-green-400 to-green-600" />
        <span className="px-2 text-gray-600 text-base uppercase tracking-wider whitespace-nowrap">
          Alege modelul
        </span>
        <div className="flex-grow h-[2px] bg-gradient-to-r from-blue-600 to-blue-400" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full max-w-6xl mx-auto justify-items-center">
        {models.map((model) => (
          <Link
            key={model.slug}
            to={`/${brandSlug}/${model.slug}`}
            className="border p-4 rounded-xl flex flex-col items-center hover:shadow-xl transition-transform duration-300 md: w-40 h-54"
          >
            <img src={model.imagine} alt={model.nume} className="w-32 h-32 object-contain" />
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
