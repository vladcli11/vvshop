import { useRef } from "react";

export default function SelectEasyBoxMap({
  clientId,
  judet,
  localitate,
  locker,
  setLocker,
}) {
  const openedRef = useRef(false);

  const handleOpenLockerMap = () => {
    if (!window.LockerPlugin || !clientId) return;

    const normalize = (val) =>
      val
        ? val
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase())
        : "";

    const city = normalize(localitate) || "Sector 1";
    const county = normalize(judet) || "Bucuresti";

    window.LockerPlugin.init({
      clientId,
      apiUsername: import.meta.env.VITE_SAMEDAY_USERNAME,
      countryCode: "RO",
      langCode: "ro",
      city,
      county,
      theme: "light",
      filters: [{ showLockers: true }],
      initialMapCenter: "City",
    });

    const plugin = window.LockerPlugin.getInstance();

    plugin.subscribe((msg) => {
      setLocker({
        oohId: msg.lockerId,
        name: msg.name,
        address: msg.address,
        city: msg.city,
        county: msg.county,
        postalCode: msg.postalCode,
      });
      plugin.close();
    });

    plugin.open();
    openedRef.current = true;
  };

  const handleReset = () => {
    setLocker(null);
    openedRef.current = false;
  };

  return (
    <div className="mt-4 space-y-3">
      <button
        type="button"
        onClick={handleOpenLockerMap}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        {locker ? "📍 Schimbă locker" : "📦 Alege locker Easybox"}
      </button>

      {locker && (
        <div className="text-sm text-gray-800 border border-gray-300 p-3 rounded-md bg-gray-50">
          <p className="font-semibold text-green-700">Locker selectat:</p>
          <p>{locker.name}</p>
          <p>
            {locker.address}, {locker.city}, {locker.county}
          </p>
          <p>Cod poștal: {locker.postalCode}</p>
          <button
            onClick={handleReset}
            className="mt-2 text-red-600 text-xs underline hover:text-red-800"
          >
            ✖ Renunță la locker
          </button>
        </div>
      )}
    </div>
  );
}
