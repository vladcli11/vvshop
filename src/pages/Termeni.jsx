export default function Termeni() {
  return (
    <div className="min-h-screen bg-white px-6 pb-6">
      <div className="max-w-3xl mx-auto mt-10 text-gray-800 space-y-6 text-sm leading-relaxed">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Termeni și condiții VVShop.ro
        </h1>
        <p>
          Prin accesarea și utilizarea site-ului <b>VVShop.ro</b>, sunteți de
          acord cu termenii și condițiile prezentate mai jos. Vă recomandăm să
          citiți cu atenție această pagină înainte de a plasa o comandă.
        </p>

        <h2 className="font-semibold text-black mt-6">
          1. Informații generale
        </h2>
        <p>
          VVShop.ro este administrat de <b>SC VV SHOP SRL</b>, cu sediul în
          România. Datele complete ale firmei vor fi actualizate după
          înregistrare. Ne rezervăm dreptul de a modifica acești termeni fără
          notificare prealabilă.
        </p>

        <h2 className="font-semibold text-black mt-6">2. Produse și comenzi</h2>
        <p>
          Toate produsele afișate pe site sunt disponibile în limita stocului.
          Ne rezervăm dreptul de a refuza sau anula comenzi în cazul unor erori
          de preț, stoc sau date incomplete/incorecte furnizate de client.
        </p>

        <h2 className="font-semibold text-black mt-6">3. Prețuri și plăți</h2>
        <p>
          Prețurile sunt exprimate în RON și includ toate taxele aplicabile.
          Plata se poate face ramburs la livrare sau online cu cardul, prin
          procesatorul de plăți Stripe. VVShop nu stochează datele cardului
          dumneavoastră.
        </p>

        <h2 className="font-semibold text-black mt-6">
          4. Livrare și retururi
        </h2>
        <p>
          Livrarea se face prin curier rapid, de obicei în 1-3 zile lucrătoare.
          Pentru retururi, vă rugăm să ne contactați în maximum 14 zile de la
          primirea produsului. Produsele returnate trebuie să fie în stare nouă,
          cu ambalajul original.
        </p>

        <h2 className="font-semibold text-black mt-6">5. Garanție</h2>
        <p>
          Toate produsele comercializate beneficiază de garanție conform
          legislației în vigoare. Pentru detalii despre garanție sau sesizări,
          vă rugăm să ne contactați.
        </p>

        <h2 className="font-semibold text-black mt-6">6. Drepturi de autor</h2>
        <p>
          Conținutul site-ului (texte, imagini, logo-uri, elemente grafice) sunt
          proprietatea VVShop și nu pot fi copiat, distribuit sau reutilizat
          fără acordul scris al administratorului.
        </p>

        <h2 className="font-semibold text-black mt-6">7. Protecția datelor</h2>
        <p>
          VVShop respectă confidențialitatea datelor personale. Informațiile
          furnizate de clienți sunt folosite doar pentru procesarea comenzilor
          și comunicare. Pentru detalii, consultați Politica de
          Confidențialitate.
        </p>

        <h2 className="font-semibold text-black mt-6">8. Contact</h2>
        <p>
          Pentru orice întrebări, sesizări sau solicitări legate de termeni și
          condiții, ne puteți contacta la{" "}
          <a
            href="mailto:contact@vvshop.ro"
            className="underline text-blue-600"
          >
            contact@vvshop.ro
          </a>{" "}
          sau la <b>0730 860 813</b>.
        </p>
      </div>
    </div>
  );
}
