const admin = require("firebase-admin");
const csv = require("csv-parser");
const fetch = require("node-fetch"); // v2.x pe CommonJS
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");

const FEED_URL = "https://www.gsmnet.ro/csv/feedPriceCustomersDiamond.csv";
const allowedCategories = [
  "Accesorii Telefoane si Tablete | Huse",
  "Accesorii Telefoane si Tablete | Folii Protectie",
];

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const thresholdArg = args.find((a) => a.startsWith("--threshold="));
const CHANGE_THRESHOLD = thresholdArg
  ? parseFloat(thresholdArg.split("=")[1])
  : 0;

const serviceAccountPath = path.resolve(
  __dirname,
  "./import/serviceAccountKey.json"
);
if (!fs.existsSync(serviceAccountPath)) {
  console.error(
    "❌ Lipsă serviceAccountKey.json lângă script:",
    serviceAccountPath
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});
const db = admin.firestore();

function cleanRowKeys(row) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    out[String(k).trim()] = typeof v === "string" ? v.trim() : v;
  }
  return out;
}
function parsePrice(s) {
  const n = parseFloat(String(s || "0").replace(",", "."));
  return isNaN(n) ? 0 : n;
}
function calcPretFinal(pretDiamondCuTVA) {
  const brut = (pretDiamondCuTVA + 12.8) * 1.025;
  return Math.round(brut * 100) / 100;
}
async function updateDocPriceIfNeeded(docRef, newPrice, disponibilitate) {
  const snap = await docRef.get();
  if (!snap.exists) return { updated: false, reason: "doc_missing" };
  const data = snap.data() || {};
  const old = typeof data.pret === "number" ? data.pret : null;
  const diff = old == null ? Infinity : Math.abs(newPrice - old);
  if (old != null && diff < CHANGE_THRESHOLD)
    return { updated: false, reason: "below_threshold", old, newPrice };
  if (DRY) {
    console.log(
      `(dry) ${docRef.id}: ${old} -> ${newPrice} | disp="${disponibilitate}"`
    );
    return { updated: false, reason: "dry", old, newPrice };
  }
  await docRef.set(
    {
      pret: newPrice,
      disponibilitate: disponibilitate || data.disponibilitate || "",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  return { updated: true, old, newPrice };
}

async function fetchCSVWithRetry(url, tries = 3, timeoutMs = 15000) {
  let lastErr;
  for (let i = 1; i <= tries; i++) {
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), timeoutMs);
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36",
          Accept: "text/csv, */*;q=0.8",
          "Accept-Language": "ro,en;q=0.9",
          Referer: "https://www.gsmnet.ro/",
        },
      });
      clearTimeout(to);
      console.log(
        `HTTP ${res.status} | ${res.headers.get("content-type") || "-"}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.buffer();
      // protecție: unele CDN trimit HTML mic când resping accesul
      if (buf.length < 1024 && String(buf).trim().startsWith("<")) {
        throw new Error("Primim HTML în loc de CSV (probabil anti-hotlink)");
      }
      return buf;
    } catch (e) {
      lastErr = e;
      console.warn(`Tentativa ${i}/${tries} a eșuat: ${e.message}`);
      if (i < tries) await new Promise((r) => setTimeout(r, 1000 * i));
    }
  }
  throw lastErr;
}

(async () => {
  console.log("▶️ Pornesc update DOAR pentru prețuri…");
  console.log("   Feed:", FEED_URL);
  console.log(
    "   DRY_RUN:",
    DRY,
    "| THRESHOLD:",
    CHANGE_THRESHOLD.toFixed(2),
    "lei"
  );
  console.log("   CWD:", process.cwd());
  console.log("   SA path:", serviceAccountPath);

  const t0 = Date.now();
  let processed = 0,
    matched = 0,
    updated = 0,
    skipped = 0,
    notFound = 0;
  let sawAnyRow = false;

  try {
    const csvBuf = await fetchCSVWithRetry(FEED_URL, 3, 20000);
    const ro = Readable.from(csvBuf.toString("utf8"));
    const watchdog = setTimeout(() => {
      if (!sawAnyRow)
        console.warn(
          "⚠️  Nu a venit niciun rând din CSV în 10 secunde — posibil format/headers blocate."
        );
    }, 10000);

    await new Promise((resolve, reject) => {
      ro.pipe(csv({ separator: ";" }))
        .on("data", async (raw) => {
          ro.pause(); // backpressure manual pt. async
          try {
            sawAnyRow = true;
            const row = cleanRowKeys(raw);
            processed++;

            const categorie = row["CATEGORIE"];
            const nume = row["NUME"];
            const codUnic = String(row["COD_UNIC"] || "").trim();
            const ean = String(row["EAN"] || "").trim();
            const disponibilitate = row["Disponibilitate"] || "";

            if (!allowedCategories.includes(categorie)) {
              skipped++;
              ro.resume();
              return;
            }
            if (!disponibilitate.toLowerCase().includes("stoc")) {
              skipped++;
              ro.resume();
              return;
            }
            if (!nume || !codUnic) {
              skipped++;
              ro.resume();
              return;
            }

            const pretBaza = parsePrice(row["Pret Diamond cu TVA"]);
            if (pretBaza <= 0) {
              skipped++;
              ro.resume();
              return;
            }
            const pretFinal = calcPretFinal(pretBaza);

            // caută după codUnic, apoi EAN
            let snap = await db
              .collection("products")
              .where("codUnic", "==", codUnic)
              .limit(1)
              .get();
            if (snap.empty && ean) {
              snap = await db
                .collection("products")
                .where("ean", "==", ean)
                .limit(1)
                .get();
            }
            if (snap.empty) {
              notFound++;
              ro.resume();
              return;
            }

            matched++;
            const docRef = snap.docs[0].ref;
            const res = await updateDocPriceIfNeeded(
              docRef,
              pretFinal,
              disponibilitate
            );
            if (res.updated) {
              updated++;
              console.log(`✅ ${docRef.id}: ${res.old} -> ${res.newPrice}`);
            } else {
              skipped++;
            }

            if (processed % 200 === 0) {
              console.log(
                `…progres: proc=${processed}, match=${matched}, upd=${updated}, skip=${skipped}, nf=${notFound}`
              );
            }
          } catch (e) {
            console.error("Eroare la procesarea rândului:", e.message);
            skipped++;
          } finally {
            ro.resume();
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    clearTimeout(watchdog);
    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    console.log("🟢 Gată. Timp:", dt, "sec");
    console.log("Statistici:", {
      processed,
      matched,
      updated,
      skipped,
      notFound,
    });
  } catch (err) {
    console.error("❌ Eșec general:", err.message);
    process.exit(1);
  }
})();
