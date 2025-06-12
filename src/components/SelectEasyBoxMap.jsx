import { useEffect } from "react";

export default function SelectEasyboxMap({
  clientId,
  judet = "",
  localitate = "",
  onSelect,
}) {
  useEffect(() => {
    // Încarcă SDK-ul dacă nu e deja încărcat
    if (!window.SamedayLocker) {
      const script = document.createElement("script");
      script.src = "https://cdn.sameday.ro/locker-plugin/main.js";
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!window.SamedayLocker || !clientId) return;

      window.SamedayLocker.init({
        clientId,
        language: "ro",
        country: "RO",
        mapContainerId: "locker-map",
        defaultCounty: judet || "Bucuresti",
        defaultCity: localitate || "Sector 1",
        onSelectLocker: (locker) => {
          onSelect({
            oohId: locker.oohId,
            name: locker.name,
            address: locker.address,
            city: locker.city,
            county: locker.county,
            postalCode: locker.postalCode,
          });
        },
      });
    }
  }, [clientId, judet, localitate, onSelect]);

  return (
    <div className="mt-4">
      <p className="mb-2 font-semibold text-black">
        Selectează locker Easybox:
      </p>
      <div id="locker-map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
}
