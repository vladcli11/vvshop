import { useRef, useState } from "react";

// --- 1) Candidate list: env first, then known fallbacks
const getCandidates = () => {
  const fromEnv = import.meta.env.VITE_SAMEDAY_LOCKER_SRC?.trim();
  const isJs = (u) => /\.js(\?|#|$)/i.test(u || "");
  const list = [];

  if (fromEnv) {
    if (isJs(fromEnv)) {
      list.push(fromEnv);
    } else {
      console.warn(
        "VITE_SAMEDAY_LOCKER_SRC trebuie să indice un fișier .js (ex: https://cdn.sameday.ro/locker-plugin/lockerpluginsdk.js). Ignor: ",
        fromEnv
      );
    }
  }

  list.push(
    "https://cdn.sameday.ro/locker-plugin/lockerpluginsdk.js",
    "https://cdn.sameday.ro/locker-plugin/lockerplugin.js"
  );
  return [...new Set(list)];
};

// --- 2) Wait for a window global with timeout
function waitForGlobal(prop, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    (function tick() {
      if (window[prop]) return resolve(window[prop]);
      if (performance.now() - start > timeoutMs) {
        return reject(new Error(`${prop} not found after script load`));
      }
      requestAnimationFrame(tick);
    })();
  });
}

// --- 3) Singleton loader (memoized promise across calls)
let lockerLoaderPromise = null;

async function loadLockerPlugin() {
  if (window.LockerPlugin) return window.LockerPlugin;
  if (lockerLoaderPromise) return lockerLoaderPromise;

  const candidates = getCandidates();

  lockerLoaderPromise = (async () => {
    let lastErr = null;

    for (const url of candidates) {
      // dacă deja este injectat același src, așteaptă doar globalul
      const existing = document.querySelector(
        `script[data-sameday-locker][src="${url}"]`
      );
      if (!existing) {
        // injectează scriptul
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = url;
          s.async = true;
          s.defer = true;
          s.dataset.samedayLocker = "true";
          s.onload = resolve;
          s.onerror = () => reject(new Error(`Script load error: ${url}`));
          document.head.appendChild(s);
        }).catch((err) => {
          lastErr = err;
        });
      }

      try {
        const plugin = await waitForGlobal("LockerPlugin", 4000);
        return plugin;
      } catch (e) {
        lastErr = e;
        // curăță tag-ul ca să poți încerca următorul candidat
        const tag = document.querySelector(
          `script[data-sameday-locker][src="${url}"]`
        );
        tag?.remove();
      }
    }

    throw lastErr || new Error("No working Sameday Locker script found");
  })();

  return lockerLoaderPromise.finally(() => {
    // dacă a eșuat complet, nu păstrăm promisiunea stricată
    if (!window.LockerPlugin) lockerLoaderPromise = null;
  });
}

export default function SelectEasyBoxMap({
  clientId,
  judet,
  localitate,
  locker,
  setLocker,
}) {
  const openedRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const handleOpenLockerMap = async () => {
    try {
      if (!clientId) throw new Error("VITE_SAMEDAY_CLIENT_ID lipsă/goală");

      setLoading(true);
      const LockerPlugin = await loadLockerPlugin();

      const normalize = (val) =>
        val
          ? val
              .trim()
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase())
          : "";

      const isSector = (v) => /^sector\s*\d+$/i.test((v || "").trim());
      let city = normalize(localitate);
      let county = normalize(judet);
      // fallback-uri sigure
      if (!county) county = "Bucuresti";
      if (!city || isSector(city)) {
        // pentru Bucuresti, centrează pe County dacă localitatea e Sector X
        city = county === "Bucuresti" ? "Bucuresti" : county;
      }
      const initialCenter =
        !localitate || isSector(localitate) ? "County" : "City";

      LockerPlugin.init({
        clientId,
        apiUsername: import.meta.env.VITE_SAMEDAY_USERNAME,
        countryCode: "RO",
        langCode: "ro",
        city,
        county,
        theme: "light",
        filters: [{ showLockers: true }],
        initialMapCenter: initialCenter,
      });

      const plugin = LockerPlugin.getInstance?.() || LockerPlugin;
      if (!plugin?.open) throw new Error("LockerPlugin.open indisponibil");
      plugin.subscribe((msg) => {
        setLocker({
          oohId: msg.lockerId,
          name: msg.name,
          address: msg.address,
          city: msg.city,
          county: msg.county,
          postalCode: msg.postalCode,
        });
        plugin.close?.();
      });

      plugin.open();
      openedRef.current = true;
    } catch (err) {
      console.error("Locker open error:", err);
      alert(
        "Nu pot deschide harta Easybox.\nVerifică VITE_SAMEDAY_LOCKER_SRC (trebuie JS de pe cdn.sameday.ro) și clientId."
      );
    } finally {
      setLoading(false);
    }
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
        disabled={loading}
        className="w-full px-4 py-3 rounded-xl bg-green-600 text-white font-semibold shadow-sm hover:bg-green-700 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-60"
      >
        {loading
          ? "Se încarcă..."
          : locker
          ? "Schimbă locker"
          : "Alege locker Easybox"}
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
            type="button"
            onClick={handleReset}
            className="mt-2 text-red-600 text-xs underline hover:text-red-800"
          >
            Renunță la locker
          </button>
        </div>
      )}
    </div>
  );
}
