// 📦 Script complet Node.js pentru importare produse din CSV și generare automată imagini WebP 700x700 în public/img, cu slug ca ID și fallback la link original dacă conversia eșuează

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

const feedUrl = "https://www.gsmnet.ro/csv/feedPriceCustomersDiamond.csv";
const allowedCategories = [
  "Accesorii Telefoane si Tablete | Huse",
  "Accesorii Telefoane si Tablete | Folii Protectie",
];
const publicImgPath = "E:/DropshippingV2/vv_shop_clean/public/img";
const BASE_IMAGE_URL = "https://vv-shop.ro/img";

const modelRegex =
  /(iPhone\s[\w\s\+\-]+|Samsung Galaxy\s[\w\s\+\-]+|Huawei\s[\w\s\+\-]+)/i;

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
      .resize(700, 700, { fit: "cover" })
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

      // Filtrare pe baza denumirii produsului
      if (!/iphone|apple|samsung|galaxy|huawei/i.test(nume)) return;

      const isInStock = row["Disponibilitate"]?.toLowerCase() === "in stoc";
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
        activ: isInStock,
      };

      // 🧠 Extragem modelSlug din nume
      let modelSlug = "";
      const cleanName = nume
        .replace(/^(Husa|Folie).*?pentru\s*/i, "") // scoate "Husa pentru", "Folie pentru", etc.
        .replace(/,\s?.*$/, "") // elimină descrieri extra după virgulă
        .trim();

      // 🎯 Regex dedicat pentru modele de Apple, Samsung, Huawei
      const modelRegex =
        /\b(iPhone\s(?:[0-9]{1,2}(?:\s?(Pro Max|Pro|Plus|Ultra|Mini))?)|Samsung Galaxy\sS[0-9]{1,2}(?:\s?(Ultra|Plus|FE))?|Huawei\sP[0-9]{1,2}(?:\s?(Lite|Pro))?)\b/i;

      const match = cleanName.match(modelRegex);

      // 📤 Slugify doar dacă extragerea pare validă
      if (match && match[0]) {
        const candidate = slugify(match[0]);

        // 🧪 Validare de siguranță: să nu fie doar cod de produs
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
      if (!snapshot.exists) {
        ensureDirExists(publicImgPath);

        let hasWebp = false;
        let finalImageUrl = "";

        if (isInStock && imagineUrl) {
          hasWebp = await downloadAndConvertImage(imagineUrl, imagePath);
          finalImageUrl = hasWebp ? imageFirestoreUrl : imagineUrl;
        } else {
          console.log(`⚠️  Nu există link imagine pentru produs: ${nume}`);
        }

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
          activ: isInStock,
          necesitaImagine: !hasWebp,
          imagine: finalImageUrl ? [finalImageUrl] : [],
          modelSlug,
          pret: 1.0,
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
