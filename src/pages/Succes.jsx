import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Succes() {
  return (
    <div className="min-h-screen bg-white px-6 pb-6">
      <Header />
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold text-green-600">
          🎉 Comanda ta a fost plasată cu succes!
        </h1>
        <p className="text-gray-700 mt-4">
          Îți mulțumim pentru achiziție. Vei primi un email cu detalii.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Înapoi la magazin
        </Link>
      </div>
      <Footer />
    </div>
  );
}
