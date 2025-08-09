// Main script care imi extrage produsele din CSV-ul distribuitorului si le importa in Firestore.
// Foloseste multe filtrari pentru a evita importul de produse irelevante e.g Folie iphone 6s

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

const publicImgPath = "E:/DropshippingV2/vv_shop_clean/public/img";
const BASE_IMAGE_URL = "https://vv-shop.ro/img";

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

// functie pt a extrage modelSlug
function extractModelSlug(productName) {
  console.log(`Analizez: "${productName}"`);

  // Curăță numele pentru a găsi modelul
  let cleanName = productName
    .replace(/^(Husa|Folie|Protectie|Carcasa).*?pentru\s*/i, "")
    .replace(/^(Set|Tempered|Glass|Sticla).*?\s+(iPhone|Samsung|Huawei)/i, "$2")
    .replace(/,.*$/, "")
    .trim();

  console.log(`🔍 Nume curat: "${cleanName}"`);

  // Mapare pentru detectarea modelelor
  const patterns = [
    // iPhone patterns
    {
      regex: /iPhone\s*(1[6543210])\s*(Pro\s*Max|Pro|Plus|Mini)/i,
      transform: (match) =>
        `iphone-${match[1]}-${match[2].toLowerCase().replace(/\s+/g, "-")}`,
    },
    {
      regex: /iPhone\s*(1[6543210])/i,
      transform: (match) => `iphone-${match[1]}`,
    },

    // Samsung Galaxy S cu PLUS/+ (în ordinea priorității!)
    {
      regex: /Samsung\s*Galaxy\s*S\s*(\d+)\s*(Plus|\+)/i,
      transform: (match) => `samsung-galaxy-s${match[1]}-plus`,
    },
    {
      regex: /Samsung\s*Galaxy\s*S\s*(\d+)\s*(Ultra|FE)/i,
      transform: (match) =>
        `samsung-galaxy-s${match[1]}-${match[2].toLowerCase()}`,
    },
    {
      regex: /Samsung\s*Galaxy\s*S\s*(\d+)/i,
      transform: (match) => `samsung-galaxy-s${match[1]}`,
    },

    // Samsung Galaxy Z
    {
      regex: /Samsung\s*Galaxy\s*Z\s*(Flip|Fold)\s*(\d+)/i,
      transform: (match) =>
        `samsung-galaxy-z-${match[1].toLowerCase()}${match[2]}`,
    },
    {
      regex: /Samsung\s*Galaxy\s*Z\s*(Flip|Fold)/i,
      transform: (match) => `samsung-galaxy-z-${match[1].toLowerCase()}`,
    },

    // Samsung Galaxy A
    {
      regex: /Samsung\s*Galaxy\s*A\s*(\d+)/i,
      transform: (match) => `samsung-galaxy-a${match[1].padStart(2, "0")}`,
    },

    // Huawei
    {
      regex: /Huawei\s*P\s*(\d+)\s*(Pro|Ultra|Lite|Pocket)/i,
      transform: (match) => `huawei-p${match[1]}-${match[2].toLowerCase()}`,
    },
    {
      regex: /Huawei\s*P\s*(\d+)/i,
      transform: (match) => `huawei-p${match[1]}`,
    },
    {
      regex: /Huawei\s*Mate\s*(\d+)\s*(Pro|Ultra|Lite)/i,
      transform: (match) => `huawei-mate${match[1]}-${match[2].toLowerCase()}`,
    },
    {
      regex: /Huawei\s*Mate\s*(\d+)/i,
      transform: (match) => `huawei-mate${match[1]}`,
    },
  ];

  // Caut un pattern care sa se potriveasca pe baza regexului
  for (const pattern of patterns) {
    const match = cleanName.match(pattern.regex);
    if (match) {
      const candidate = pattern.transform(match);
      console.log(`🎯 Pattern găsit: "${match[0]}" → "${candidate}"`);

      // Verific daca modelSlug-ul este regasit in allowedModelSlugs
      if (allowedModelSlugs.has(candidate)) {
        console.log(`✅ ModelSlug valid: "${candidate}"`);
        return candidate;
      }

      console.log(`ModelSlug nu este în lista permisă: "${candidate}"`);
    }
  }

  console.log(`Nu s-a găsit pattern pentru: "${cleanName}"`);
  return null;
}

// Elimin spatiile din csv
function cleanRowKeys(row) {
  const cleaned = {};
  Object.entries(row).forEach(([key, value]) => {
    cleaned[key.trim()] = value?.trim();
  });
  return cleaned;
}

// Verificam ca directorul unde salvadm datele public/img exista in caz ca nu exista il creeaza
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Download si conversie imagine, primesc din CSV png iar eu le vreau formatate in webp 300x300 pentru performanta
async function downloadAndConvertImage(imageUrl, outputFilePath) {
  try {
    console.log(`⬇️  Download imagine: ${imageUrl}`);
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*;q=0.8,*/*;q=0.5",
        // multe CDN-uri/hosturi cer referer de pe domeniul lor
        Referer: "https://www.gsmnet.ro/",
        "Accept-Language": "ro,en;q=0.9",
      },
      redirect: "follow",
    });

    const ct = res.headers.get("content-type") || "";
    console.log(`Status: ${res.status}, Content-Type: ${ct}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buffer = await res.buffer();

    // respuns suspect (anti-hotlink): HTML mic în loc de imagine
    const isLikelyHtml =
      buffer.length < 4096 &&
      buffer.slice(0, 64).toString("utf8").trim().startsWith("<");
    if (isLikelyHtml && !ct.startsWith("image/")) {
      throw new Error(
        `Anti-hotlink/HTML în loc de imagine (${buffer.length} B)`
      );
    }

    // chiar dacă Content-Type e greșit, încercăm să decodăm cu sharp
    await sharp(buffer)
      .resize(300, 300, { fit: "cover" })
      .toFormat("webp")
      .toFile(outputFilePath);

    const { size } = fs.statSync(outputFilePath);
    if (size < 512) throw new Error(`Fișier WebP invalid (${size} B)`);

    console.log(`Salvată imagine: ${outputFilePath}`);
    return true;
  } catch (err) {
    console.error(`Eroare conversie imagine ${imageUrl}:`, err.message);
    return false;
  }
}

console.log("A pornit importul");

https.get(feedUrl, (res) => {
  let processedCount = 0;
  let successCount = 0;
  let skipCount = 0;

  res
    .pipe(csv({ separator: ";" }))
    .on("data", async (rawRow) => {
      try {
        const row = cleanRowKeys(rawRow);
        processedCount++;

        // Extragem datele de baza din csv
        const categorie = row["CATEGORIE"];
        const nume = row["NUME"];
        const codUnic = row["COD_UNIC"];
        const imagineUrl = row["LINK POZA"];

        // Filtrarile
        if (!allowedCategories.includes(categorie)) {
          skipCount++;
          return;
        }

        if (!row["Disponibilitate"]?.toLowerCase().includes("stoc")) {
          skipCount++;
          return;
        }

        if (!/iphone|apple|samsung|galaxy|huawei/i.test(nume)) {
          skipCount++;
          return;
        }

        if (!codUnic || !nume) {
          skipCount++;
          return;
        }
        // Extragem modelSlug-ul din nume
        const modelSlug = extractModelSlug(nume);
        if (!modelSlug) {
          console.log(`⏭️ Ignorat (model necunoscut): ${nume}`);
          skipCount++;
          return;
        }

        // Verifică dacă produsul este "folie de protectie camera spate" sau "camera spate"
        let isCameraSpate =
          /folie de protectie camera spate|camera spate/i.test(nume);

        // Calculeaz pretul de vanzare cu adaos si taxe
        let pretBaza = parseFloat(
          row["Pret Diamond cu TVA"]?.replace(",", ".") || "0"
        );
        if (isNaN(pretBaza) || pretBaza <= 0) {
          console.warn(`Preț invalid pentru: ${nume}`);
          skipCount++;
          return;
        }
        const pretFinal = Math.round((pretBaza + 7.8) * 1.025 * 100) / 100;

        const slug = slugify(nume);
        const docRef = db.collection("products").doc(slug);
        const snapshot = await docRef.get();

        // Creez calea pentru imagine
        const imageFileName = `${slug}.webp`;
        const imagePath = path.join(publicImgPath, imageFileName);
        const imageFirestoreUrl = `${BASE_IMAGE_URL}/${imageFileName}`;

        console.log(`Document & File slug: "${slug}"`);
        console.log(`ModelSlug: "${modelSlug}"`);

        if (!snapshot.exists) {
          ensureDirExists(publicImgPath);

          if (!imagineUrl) {
            console.warn(`⏭️ Lipsă URL imagine, sar produsul: ${nume}`);
            skipCount++;
            return;
          }

          const hasWebp = await downloadAndConvertImage(imagineUrl, imagePath);
          if (!hasWebp) {
            console.warn(`⏭️ Conversie eșuată, sar produsul: ${nume}`);
            skipCount++;
            return;
          }

          const finalImageUrl = `${BASE_IMAGE_URL}/${imageFileName}`;

          const newData = {
            codUnic: String(codUnic),
            cod: row["COD"] || "",
            ean: String(row["EAN"] || ""),
            nume,
            slug,
            marca: "",
            categorie,
            garantie: parseInt(row["Garantie in luni"], 10) || 0,
            disponibilitate: row["Disponibilitate"] || "",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            activ: isCameraSpate ? false : true,
            necesitaImagine: false,
            imagine: [finalImageUrl],
            modelSlug,
            pret: pretFinal,
          };

          await docRef.set(newData, { merge: true });
          console.log(`Creat produs nou: ${slug} (${modelSlug})`);
          successCount++;
        } else {
          // Actualizare produs existent (nu folosi URL extern ca fallback)
          const updateData = {
            disponibilitate: row["Disponibilitate"] || "",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            activ: isCameraSpate ? false : true,
            pret: pretFinal,
          };

          await docRef.set(updateData, { merge: true });
          console.log(`Actualizat produs: ${slug}`);
          successCount++;
        }

        // Progress report
        if (processedCount % 100 === 0) {
          console.log(
            `Progres: ${processedCount} procesate, ${successCount} salvate, ${skipCount} ignorate`
          );
        }
      } catch (error) {
        console.error(`Eroare procesare produs:`, error.message);
        skipCount++;
      }
    })
    .on("end", () => {
      console.log(`Import finalizat!`);
      console.log(`Statistici finale:`);
      console.log(` Total procesate: ${processedCount}`);
      console.log(` Salvate cu succes: ${successCount}`);
      console.log(` Ignorate: ${skipCount}`);
    })
    .on("error", (error) => {
      console.error(`Eroare CSV:`, error);
    });
});
