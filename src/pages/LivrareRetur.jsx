export default function LivrareRetur() {
  return (
    <div className=" bg-white px-6 pb-6">
      <div className="max-w-3xl mx-auto mt-10 text-gray-800 space-y-6 text-sm leading-relaxed">
        <h2 className="font-semibold text-black">1. Livrare</h2>
        <p>
          Comenzile sunt procesate în 24 de ore și livrate prin curier rapid în
          1–3 zile lucrătoare. Livrarea este gratuită pentru comenzi de peste 40
          lei.
        </p>

        <h2 className="font-semibold text-black">2. Retur</h2>
        <p>
          Poți returna produsele în termen de 14 zile calendaristice de la
          primire, fără a justifica motivul. Costul returului revine clientului.
        </p>

        <h2 className="font-semibold text-black">3. Condiții retur</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Produsele nu trebuie să fie folosite sau deteriorate</li>
          <li>Ambalajul original este recomandat, dar nu obligatoriu</li>
          <li>Include o copie a dovezii de achiziție</li>
        </ul>

        <p>
          Pentru retururi, scrie-ne la{" "}
          <a
            href="mailto:contact@vvshop.ro"
            className="underline text-blue-600"
          >
            contact@vvshop.ro
          </a>{" "}
          cu numărul comenzii și motivul returului (opțional).
        </p>
      </div>
    </div>
  );
}
