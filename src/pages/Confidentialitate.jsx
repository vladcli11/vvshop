import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Confidentialitate() {
  return (
    <div className="min-h-screen bg-white px-6 pb-6">
      <div className="max-w-3xl mx-auto mt-10 text-gray-800 space-y-6 text-sm leading-relaxed">
        <p>
          VVShop respectă confidențialitatea datelor tale și se angajează să
          protejeze informațiile personale pe care ni le oferi.
        </p>

        <h2 className="font-semibold text-black">1. Ce date colectăm?</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Nume și prenume</li>
          <li>Adresă de email</li>
          <li>Telefon</li>
          <li>Adresă de livrare</li>
          <li>Detalii despre comenzi</li>
        </ul>

        <h2 className="font-semibold text-black">2. Cum folosim datele?</h2>
        <p>
          Datele sunt folosite exclusiv pentru a procesa comenzile, a livra
          produsele și a te contacta în legătură cu statusul comenzilor.
        </p>

        <h2 className="font-semibold text-black">3. Securitate</h2>
        <p>
          Datele sunt stocate în Firebase și sunt protejate conform celor mai
          înalte standarde de securitate.
        </p>

        <h2 className="font-semibold text-black">4. Drepturile tale</h2>
        <p>
          Poți solicita oricând acces la datele tale, modificarea sau ștergerea
          lor, trimițând un email la{" "}
          <a
            href="mailto:contact@vvshop.ro"
            className="underline text-blue-600"
          >
            contact@vvshop.ro
          </a>
          .
        </p>
      </div>
      <Footer />
    </div>
  );
}
