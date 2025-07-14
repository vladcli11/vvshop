// 💰 Script pentru actualizarea doar a prețurilor produselor existente

const https = require("https");
const csv = require("csv-parser");
const admin = require("firebase-admin");

const serviceAccount = require("./import/serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const feedUrl = "https://www.gsmnet.ro/csv/feedPriceCustomersDiamond.csv";

// 🔧 Funcție slugify identică cu importV2.cjs
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\+/g, "-plus")
    .replace(/[^a-z0-9\s\-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// 🧹 Curăță cheile din CSV
function cleanRowKeys(row) {
  const cleaned = {};
  Object.entries(row).forEach(([key, value]) => {
    cleaned[key.trim()] = value?.trim();
  });
  return cleaned;
}

console.log("💰 Pornire actualizare prețuri...");

https.get(feedUrl, (res) => {
  let updatedCount = 0;

  res
    .pipe(csv({ separator: ";" }))
    .on("data", async (rawRow) => {
      try {
        const row = cleanRowKeys(rawRow);
        const nume = row["NUME"];
        const codUnic = row["COD_UNIC"];

        if (!nume || !codUnic) return;

        // Calculează preț (formula din importV2.cjs)
        let pretBaza = parseFloat(
          row["Pret Diamond cu TVA"]?.replace(",", ".") || "0"
        );
        if (isNaN(pretBaza) || pretBaza <= 0) return;

        const pretCalculat = Math.round((pretBaza + 19.3) * 1.015 * 100) / 100;

        const pretIntreg = Math.floor(pretCalculat);
        const pretFinal = pretIntreg + 0.99;

        // Găsește produsul în baza de date
        const slug = slugify(nume);
        const docRef = db.collection("products").doc(slug);
        const snapshot = await docRef.get();

        if (snapshot.exists) {
          await docRef.update({
            pret: pretFinal,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          console.log(`✅ ${slug} → ${pretFinal} LEI`);
          updatedCount++;
        }
      } catch (error) {
        console.error(`❌ Eroare:`, error.message);
      }
    })
    .on("end", () => {
      console.log(`🎉 Actualizate: ${updatedCount} produse`);
    });
});
