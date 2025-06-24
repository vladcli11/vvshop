import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-white border-t border-green-200 mt-10 pb-6 pt-4 px-3 text-center text-gray-600 text-sm">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Info firmă */}
        <div className="space-y-1 text-center leading-tight">
          <p className="text-gray-800 font-semibold text-base">
            VV Shop SRL &copy; {new Date().getFullYear()}
          </p>
          <p className="text-[13px] text-gray-500">
            CUI: <span className="text-gray-700 font-medium">RO12345678</span> ·
            J01/123/2024
          </p>
          <p className="text-[13px] text-gray-500">
            Sediu:{" "}
            <span className="text-gray-700 font-medium">
              Constanța, România
            </span>
          </p>
        </div>

        {/* Contact */}
        <div className="text-[13px] space-y-1 sm:space-y-0 sm:flex sm:justify-center sm:gap-6">
          <p>
            📧{" "}
            <a
              href="mailto:scvvshopsrl@gmail.com"
              className="underline hover:text-green-600"
            >
              scvvshopsrl@gmail.com
            </a>
          </p>
          <p>
            📞{" "}
            <a
              href="tel:+40730860813"
              className="underline hover:text-green-600"
            >
              0730 860 813
            </a>{" "}
            /{" "}
            <a
              href="tel:+40729600889"
              className="underline hover:text-green-600"
            >
              0729 600 889
            </a>
          </p>
        </div>

        {/* Linkuri legale */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 text-[13px]">
          <a
            href="/termeni"
            className="underline underline-offset-4 hover:text-green-700"
          >
            Termeni
          </a>
          <a
            href="/confidentialitate"
            className="underline underline-offset-4 hover:text-green-700"
          >
            Confidențialitate
          </a>
          <a
            href="/livrare-retur"
            className="underline underline-offset-4 hover:text-green-700"
          >
            Livrare & Retur
          </a>
        </div>

        {/* Contact rapid */}
        <div className="mt-3">
          <Link
            to="/contact"
            className="inline-block text-white text-xs px-4 py-2 bg-green-500 hover:bg-green-600 rounded-full font-medium shadow-sm transition"
          >
            Ai o problemă? Contactează-ne!
          </Link>
        </div>
      </div>
    </footer>
  );
}
