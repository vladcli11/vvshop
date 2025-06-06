import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="text-gray-500 text-xs mt-10 text-center space-y-1 pb-4">
      <p>© {new Date().getFullYear()} VV Shop. Toate drepturile rezervate.</p>
      <p>
        Contact:{" "}
        <a
          href="mailto:contact@vvshop.ro"
          className="underline hover:text-gray-700"
        >
          scvvshopsrl@gmail.com
        </a>
      </p>
      <p>
        Telefon:{" "}
        <a href="tel:+40730860813" className="hover:text-gray-700">
          +40 730 860 813
        </a>{" "}
        /{" "}
        <a href="tel:+40729600889" className="hover:text-gray-700">
          +40 729 600 889
        </a>
      </p>
      <p className="text-xs text-gray-500 space-x-2">
        <a href="/termeni" className="underline hover:text-gray-700">
          Termeni
        </a>{" "}
        |
        <a href="/confidentialitate" className="underline hover:text-gray-700">
          Confidențialitate
        </a>{" "}
        |
        <a href="/livrare-retur" className="underline hover:text-gray-700">
          Livrare & Retur
        </a>
      </p>
      <Link to="/contact" className="underline hover:text-gray-700 text-sm">
        Ai o problema? Contacteaza-ne!
      </Link>
    </footer>
  );
}
