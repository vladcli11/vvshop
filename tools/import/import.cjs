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
const allowedBrands = ["Apple", "Samsung", "Huawei"];
const publicImgPath = "E:/DropshippingV2/vv_shop_clean/public/img"; // 📍 Calea absolută pentru imagini locale
const BASE_IMAGE_URL = "https://vv-shop.ro/img"; // 🔗 Link absolut către imaginile publice

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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
      const marca = row["MARCA"];
      if (!allowedBrands.includes(marca)) return;
      const isInStock = row["Disponibilitate"]?.toLowerCase() === "in stoc";
      const codUnic = row["COD_UNIC"];
      const nume = row["NUME"];
      const imagineUrl = row["LINK POZA"];

      if (!codUnic || !nume) return;

      const slug = slugify(nume);
      const docRef = db.collection("products").doc(slug); // 🔁 Slug devine ID
      const snapshot = await docRef.get();

      const imageFileName = `${slug}.webp`;
      const imagePath = path.join(publicImgPath, imageFileName);
      const imageFirestoreUrl = `${BASE_IMAGE_URL}/${imageFileName}`;

      const updateData = {
        disponibilitate: row["Disponibilitate"] || "",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        activ: isInStock,
      };

      // Produs nou
      if (!snapshot.exists) {
        ensureDirExists(publicImgPath);

        let hasWebp = false;
        let finalImageUrl = "";

        if (isInStock && imagineUrl) {
          hasWebp = await downloadAndConvertImage(imagineUrl, imagePath);
          finalImageUrl = hasWebp ? imageFirestoreUrl : imagineUrl;

          if (hasWebp && fs.existsSync(imagePath)) {
            console.log(`✅ Imagine salvată corect în: ${imagePath}`);
          } else if (hasWebp) {
            console.error(
              `⚠️  Conversie reușită dar fișierul nu apare fizic în: ${imagePath}`
            );
          }
        } else {
          console.log(`⚠️  Nu există link imagine pentru produs: ${nume}`);
        }

        const newData = {
          codUnic: String(codUnic),
          cod: row["COD"] || "",
          ean: String(row["EAN"] || ""),
          nume,
          slug,
          marca,
          categorie: row["CATEGORIE"] || "",
          garantie: parseInt(row["Garantie in luni"], 10) || 0,
          disponibilitate: updateData.disponibilitate,
          updatedAt: updateData.updatedAt,
          activ: isInStock,
          necesitaImagine: !hasWebp,
          imagine: finalImageUrl ? [finalImageUrl] : [],
        };

        await docRef.set(newData, { merge: true });
        console.log(`✅ Creat produs nou: ${slug}`);
      } else {
        // Actualizare produs existent
        await docRef.set(updateData, { merge: true });
        console.log(`🔄 Actualizat produs: ${slug}`);
      }
    })
    .on("end", () => {
      console.log("🎉 Importul a fost finalizat cu succes.");
    });
});
