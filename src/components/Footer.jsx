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
    </footer>
  );
}
