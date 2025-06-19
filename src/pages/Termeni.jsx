import Header from "../components/Header";
import Footer from "../components/Footer";
import Separator from "../components/Separator";

export default function Termeni() {
  return (
    <div className="min-h-screen bg-white px-6 pb-6">
      <Separator text="Termeni și condiții" />
      <div className="max-w-3xl mx-auto mt-10 text-gray-800 space-y-6 text-sm leading-relaxed">
        <p>
          Prin accesarea și utilizarea site-ului VVShop.ro, sunteți de acord cu
          termenii și condițiile de mai jos. Dacă nu sunteți de acord cu acești
          termeni, vă rugăm să nu utilizați acest site.
        </p>

        <h2 className="font-semibold text-black">1. Informații generale</h2>
        <p>
          VVShop este administrat de SC VV SHOP SRL, o societate legal
          înființată în România. Datele firmei vor fi completate după
          înregistrare.
        </p>

        <h2 className="font-semibold text-black">2. Produse și comenzi</h2>
        <p>
          Produsele afișate sunt disponibile în limita stocului. Ne rezervăm
          dreptul de a refuza comenzile plasate cu date incorecte sau
          incomplete.
        </p>

        <h2 className="font-semibold text-black">3. Prețuri și plăți</h2>
        <p>
          Prețurile sunt afișate în RON și includ toate taxele. Plata poate fi
          făcută ramburs sau online cu cardul (prin Stripe).
        </p>

        <h2 className="font-semibold text-black">4. Drepturi de autor</h2>
        <p>
          Conținutul site-ului este proprietatea VVShop și nu poate fi copiat
          sau reutilizat fără acordul scris.
        </p>

        <h2 className="font-semibold text-black">5. Contact</h2>
        <p>
          Pentru întrebări sau sesizări, ne puteți contacta la{" "}
          <a
            href="mailto:contact@vvshop.ro"
            className="underline text-blue-600"
          >
            contact@vvshop.ro
          </a>{" "}
          sau la 0730 860 813.
        </p>
      </div>
      <Footer />
    </div>
  );
}
