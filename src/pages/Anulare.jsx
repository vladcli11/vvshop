import { Link } from "react-router-dom";

export default function Anulare() {
  return (
    <div className="bg-white px-6 pb-6">
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold text-red-600">
          Plata a fost anulată
        </h1>
        <p className="text-gray-700 mt-4">
          Comanda nu a fost finalizată. Poți încerca din nou oricând.
        </p>
        <Link
          to="/cos"
          className="mt-6 inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Înapoi la coș
        </Link>
      </div>
    </div>
  );
}
