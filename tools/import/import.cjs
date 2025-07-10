// 📦 Script complet Node.js pentru importare produse din CSV și generare automată imagini WebP 700x700 în public/img,
// cu slug ca ID și fallback la link original dacă conversia eșuează

const https = require("https");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const sharp = require("sharp");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const allowedModelSlugs = new Set(require("./allowedModelSlugs.json"));

const feedUrl = "https://www.gsmnet.ro/csv/feedPriceCustomersDiamond.csv";
const allowedCategories = [
  "Accesorii Telefoane si Tablete | Huse",
  "Accesorii Telefoane si Tablete | Folii Protectie",
];
const publicImgPath = "D:/DropshippingV2/vv_shop_clean/public/img";
const BASE_IMAGE_URL = "https://vv-shop.ro/img";

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s\-\+]/g, "") // ✅ păstrăm și +
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractModelSlug(modelName) {
  let slug = slugify(modelName);

  slug = slug
    .replace(/^apple-iphone-/, "iphone-")
    .replace(/^apple-/, "iphone-")
    .replace(/^samsung-galaxy-/, "samsung-galaxy-")
    .replace(/^huawei-/, "huawei-");

  // elimină coduri comerciale și descrieri irelevante
  slug = slug.replace(/-[a-z]?\d{3,4}(?=[^\+]|$)/g, "");
  slug = slug.replace(/-(4g|5g)/g, "");
  slug = slug.replace(/-dual-sim|-ds|-duos/g, "");

  slug = slug.replace(/-sticla-securizata.*$/, "");
  slug = slug.replace(/-full-glue.*$/, "");
  slug = slug.replace(/-set-[0-9]+-bucati.*$/, "");
  slug = slug.replace(/-negru.*$/, "");
  slug = slug.replace(/-agl[0-9]{4,}/g, "");
  slug = slug.replace(/-rosu.*$/, "");
  slug = slug.replace(/-albastru.*$/, "");
  slug = slug.replace(/-transparent.*$/, "");

  slug = slug.replace(/--+/g, "-").replace(/-$/, "");

  return slug;
}

function cleanRowKeys(row) {
  const cleaned = {};
  Object.entries(row).forEach(([key, value]) => {
    cleaned[key.trim()] = value?.trim();
  });
  return cleaned;
}

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function downloadAndConvertImage(imageUrl, outputFilePath) {
  try {
    console.log(`⬇️  Download imagine: ${imageUrl}`);
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.buffer();

    await sharp(buffer)
      .resize(300, 300, { fit: "cover" })
      .toFormat("webp")
      .toFile(outputFilePath);

    console.log(`🖼️  Salvata imagine: ${outputFilePath}`);
    return true;
  } catch (err) {
    console.error(`❌ Eroare conversie imagine ${imageUrl}:`, err.message);
    return false;
  }
}

https.get(feedUrl, (res) => {
  res
    .pipe(csv({ separator: ";" }))
    .on("data", async (rawRow) => {
      const row = cleanRowKeys(rawRow);
      const categorie = row["CATEGORIE"];
      const nume = row["NUME"];

      if (!allowedCategories.includes(categorie)) return;

      // 🛑 FILTRARE PE STOC - elimină produsele care nu sunt "in stoc"
      const isInStock = row["Disponibilitate"]?.toLowerCase() === "in stoc";
      if (!isInStock) return;

      // 🔎 Filtrare pe baza denumirii
      if (!/iphone|apple|samsung|galaxy|huawei/i.test(nume)) return;

      const codUnic = row["COD_UNIC"];
      const imagineUrl = row["LINK POZA"];
      if (!codUnic || !nume) return;

      const slug = slugify(nume);
      const docRef = db.collection("products").doc(slug);
      const snapshot = await docRef.get();

      const imageFileName = `${slug}.webp`;
      const imagePath = path.join(publicImgPath, imageFileName);
      const imageFirestoreUrl = `${BASE_IMAGE_URL}/${imageFileName}`;

      const updateData = {
        disponibilitate: row["Disponibilitate"] || "",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        activ: true,
      };

      // 🎯 Extragem modelSlug
      let modelSlug = "";
      const cleanName = nume
        .replace(/^(Husa|Folie).*?pentru\s*/i, "")
        .replace(/,\s?.*$/, "")
        .trim();

      const modelRegex =
        /\b(iPhone\s(?:[0-9]{1,2}(?:\s?(Pro Max|Pro|Plus|Mini|Ultra))?)|Samsung Galaxy\s(?:S|A|Z Fold|Z Flip)?\s?[0-9]{1,2}(?:\s?(Ultra|Plus|FE|Lite))?|Huawei\s(?:P|Mate)?\s?[0-9]{1,2}(?:\s?(Pro|Lite|Pocket|Ultra))?)\b/i;

      const match = cleanName.match(modelRegex);
      if (match && match[0]) {
        const candidate = extractModelSlug(match[0]);
        if (!/^[a-z]{2,}-[a-z]*[0-9]{3,}/.test(candidate)) {
          modelSlug = candidate;
        } else {
          console.warn(
            `🚫 Match invalid sau cod produs mascat: ${match[0]} (${candidate})`
          );
        }
      } else {
        console.warn(`❓ Nu am putut extrage modelSlug din nume: ${nume}`);
      }

      if (!allowedModelSlugs.has(modelSlug)) {
        console.log(`⏭️ Ignorat: ${nume} — model necunoscut (${modelSlug})`);
        return;
      }

      if (!snapshot.exists) {
        ensureDirExists(publicImgPath);

        let hasWebp = false;
        let finalImageUrl = "";

        if (imagineUrl) {
          hasWebp = await downloadAndConvertImage(imagineUrl, imagePath);
          finalImageUrl = hasWebp ? imageFirestoreUrl : imagineUrl;
        } else {
          console.log(`⚠️  Nu există link imagine pentru produs: ${nume}`);
        }
        // 🔢 Calcul preț final: Diamond + 7.8 + 2.5%
        let pretBaza = parseFloat(
          row["Pret Diamond cu TVA"]?.replace(",", ".") || "0"
        );

        if (isNaN(pretBaza) || pretBaza <= 0) {
          console.warn(`⚠️ Preț invalid pentru produs: ${nume}`);
          return;
        }

        const pretFinal = Math.round((pretBaza + 7.8) * 1.025 * 100) / 100;

        const newData = {
          codUnic: String(codUnic),
          cod: row["COD"] || "",
          ean: String(row["EAN"] || ""),
          nume,
          slug,
          marca: "",
          categorie: categorie || "",
          garantie: parseInt(row["Garantie in luni"], 10) || 0,
          disponibilitate: updateData.disponibilitate,
          updatedAt: updateData.updatedAt,
          activ: true,
          necesitaImagine: !hasWebp,
          imagine: finalImageUrl ? [finalImageUrl] : [],
          modelSlug,
          pret: pretFinal,
        };

        await docRef.set(newData, { merge: true });
        console.log(`✅ Creat produs nou: ${slug}`);
      } else {
        await docRef.set(updateData, { merge: true });
        console.log(`🔄 Actualizat produs: ${slug}`);
      }
    })
    .on("end", () => {
      console.log("🎉 Importul a fost finalizat cu succes.");
    });
});
