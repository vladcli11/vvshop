// importV2.cjs
// --- VVSHOP robust GSMnet importer -----------------------------------------
// Ce face în plus față de varianta ta:
// 1) Autodetectează separatorul CSV (',' vs ';').
// 2) Procesează cu backpressure (pause/resume) ca să nu inunzi IO/Firestore.
// 3) Filtre tolerante la variații de categorie/stock (nu doar egal strict).
// 4) Regex extinse pentru modele (inclusiv Huawei Pura, Mate X, Lite E/5G).
// 5) Setează tip/ tipProdus ("folie" / "husa") pentru sortare/filtrare în UI.
// 6) Retry + anti-hotlink guard pe imagini (fallback la erori).
// 7) IMG_SIZE configurabil prin ENV (default 500px pătrat, WebP).
// 8) Sumar „skip reasons” la final pentru vizibilitate.
//
// Notă: Păstrăm whitelist-ul (allowedModelSlugs). Asigură-te că ai inclus
// în allowedModelSlugs.json noile modele (ex: huawei-pura-70-pro, etc.)

const https = require("https");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const sharp = require("sharp");
const admin = require("firebase-admin");
const { Readable } = require("stream");

const fetchCompat = global.fetch
  ? global.fetch.bind(global) // Node 18+ are fetch built-in
  : (...args) => import("node-fetch").then(({ default: f }) => f(...args)); // v3 ESM

// ====== CONFIG ===============================================================
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const allowedModelSlugs = new Set(require("./allowedModelSlugs.json"));

// Feed-ul GSMnet
const FEED_URL =
  process.env.FEED_URL ||
  "https://www.gsmnet.ro/csv/feedPriceCustomersDiamond.csv";

// Unde salvez WebP-urile local (schimbă dacă ai alt path)
const PUBLIC_IMG_DIR =
  process.env.PUBLIC_IMG_DIR || "E:/DropshippingV2/vv_shop_clean/public/img";

// De unde vor fi servite imaginile în site
const BASE_IMAGE_URL = process.env.BASE_IMAGE_URL || "https://vv-shop.ro/img";

// Dimensiunea imaginii convertite (pătrat)
const IMG_SIZE = Number(process.env.IMG_SIZE || 500); // 500 e un compromis bun

// ====== UTILS ================================================================
function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\+/g, "-plus")
    .replace(/[^a-z0-9\s\-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Normalizez cheile (în caz că vin cu spații)
function cleanRowKeys(row) {
  const cleaned = {};
  for (const [k, v] of Object.entries(row)) {
    cleaned[String(k).trim()] = typeof v === "string" ? v.trim() : v;
  }
  return cleaned;
}

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Fetch imagine cu retry + antispam headers + anti-hotlink guard
async function fetchImageWithRetry(imageUrl, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetchCompat(imageUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/*;q=0.8,*/*;q=0.5",
          Referer: "https://www.gsmnet.ro/",
          "Accept-Language": "ro,en;q=0.9",
        },
        redirect: "follow",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const buffer =
        typeof res.buffer === "function"
          ? await res.buffer()
          : Buffer.from(await res.arrayBuffer());
      const ct = res.headers.get("content-type") || "";

      // anti-hotlink: răspuns mic + nu e image/*
      const likelyHtml =
        buffer.length < 4096 &&
        !ct.startsWith("image/") &&
        buffer.slice(0, 64).toString("utf8").trim().startsWith("<");
      if (likelyHtml) throw new Error("Anti-hotlink/HTML instead of image");

      return buffer;
    } catch (e) {
      lastErr = e;
      await sleep(500 * (i + 1));
    }
  }
  throw lastErr;
}

async function downloadAndConvertImage(imageUrl, outputFilePath) {
  try {
    const buffer = await fetchImageWithRetry(imageUrl, 3);

    await sharp(buffer)
      .resize(IMG_SIZE, IMG_SIZE, { fit: "cover" })
      .toFormat("webp")
      .toFile(outputFilePath);

    const { size } = fs.statSync(outputFilePath);
    if (size < 512) throw new Error(`Fișier WebP invalid (${size} B)`);
    return true;
  } catch (err) {
    console.error(`Eroare conversie imagine ${imageUrl}:`, err.message);
    return false;
  }
}

// ====== MODEL EXTRACTOR ======================================================
// Returnează modelSlug pe baza denumirii produsului + whitelist
function extractModelSlug(productName) {
  const original = String(productName || "");
  // Curăță prefixe generice gen "Husa ... pentru ..." / "Folie ..."
  let cleanName = original
    .replace(
      /^(Husa|Folie|Protectie|Carcasa|Set|Sticla|Tempered|Glass).*?pentru\s*/i,
      ""
    )
    .replace(/,.*$/, "")
    .trim();

  // Pattern-uri cu prioritate (de la cele mai specifice la generice)
  const patterns = [
    // ==== Apple iPhone ====
    {
      regex: /iPhone\s*(1[0-9])\s*(Pro\s*Max|Pro|Plus|Mini)/i,
      transform: (m) =>
        `iphone-${m[1]}-${m[2].toLowerCase().replace(/\s+/g, "-")}`,
    },
    { regex: /iPhone\s*(1[0-9])/i, transform: (m) => `iphone-${m[1]}` },

    // ==== Samsung Galaxy S ====
    {
      regex: /Samsung\s*Galaxy\s*S\s*(\d+)\s*(Pro\s*Max|Plus|\+|Ultra|FE)/i,
      transform: (m) =>
        `samsung-galaxy-s${m[1]}-${m[2]
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace("+", "plus")}`,
    },
    {
      regex: /Samsung\s*Galaxy\s*S\s*(\d+)/i,
      transform: (m) => `samsung-galaxy-s${m[1]}`,
    },

    // ==== Samsung Galaxy Z ====
    {
      regex: /Samsung\s*Galaxy\s*Z\s*(Flip|Fold)\s*(\d+)/i,
      transform: (m) => `samsung-galaxy-z-${m[1].toLowerCase()}${m[2]}`,
    },
    {
      regex: /Samsung\s*Galaxy\s*Z\s*(Flip|Fold)/i,
      transform: (m) => `samsung-galaxy-z-${m[1].toLowerCase()}`,
    },

    // ==== Samsung Galaxy A ====
    {
      regex: /Samsung\s*Galaxy\s*A\s*(\d+)/i,
      transform: (m) => `samsung-galaxy-a${m[1].padStart(2, "0")}`,
    },

    // ==== Huawei Pura (noua serie P) ====
    {
      regex: /Huawei\s*Pura\s*(\d+)\s*(Pro|Ultra)?/i,
      transform: (m) =>
        `huawei-pura-${m[1]}${m[2] ? "-" + m[2].toLowerCase() : ""}`,
    },

    // ==== Huawei P: Pro/Pro+, Ultra, Lite (E/5G), Pocket etc. ====
    {
      regex:
        /Huawei\s*P\s*(\d+)\s*(Pro\+|Pro\s*Max|Pro|Ultra|Lite\s*(?:E|5G)?|Lite|Pocket)/i,
      transform: (m) =>
        `huawei-p${m[1]}-${m[2].toLowerCase().replace(/\s+/g, "-")}`,
    },
    { regex: /Huawei\s*P\s*(\d+)/i, transform: (m) => `huawei-p${m[1]}` },

    // ==== Huawei Mate: Pro/Ultra/Lite ====
    {
      regex: /Huawei\s*Mate\s*(\d+)\s*(Pro|Ultra|Lite)/i,
      transform: (m) => `huawei-mate${m[1]}-${m[2].toLowerCase()}`,
    },
    { regex: /Huawei\s*Mate\s*(\d+)/i, transform: (m) => `huawei-mate${m[1]}` },

    // ==== Huawei Mate X (pliabile) ====
    {
      regex: /Huawei\s*Mate\s*X\s*(\d+)/i,
      transform: (m) => `huawei-mate-x${m[1]}`,
    },
  ];

  for (const p of patterns) {
    const match = cleanName.match(p.regex);
    if (match) {
      const candidate = p.transform(match);
      // Validează cu whitelist
      if (allowedModelSlugs.has(candidate)) return candidate;
    }
  }
  return null; // nu avem match valid
}

// ====== IMPORT ===============================================================
console.log("A pornit importul");

https.get(FEED_URL, (res) => {
  const chunks = [];
  res.on("data", (c) => chunks.push(c));
  res.on("error", (e) => console.error("Eroare rețea:", e));
  res.on("end", () => {
    const buf = Buffer.concat(chunks);
    const firstLine = buf.toString("utf8").split(/\r?\n/, 1)[0] || "";
    const sep =
      firstLine.split(";").length > firstLine.split(",").length ? ";" : ",";
    console.log("Delimitator detectat:", JSON.stringify(sep));

    const processed = { total: 0, saved: 0, skipped: 0 };
    const skipReasons = Object.create(null);
    const incReason = (r) => (skipReasons[r] = (skipReasons[r] || 0) + 1);

    const r = Readable.from(buf);
    const parser = csv({
      separator: sep,
      mapHeaders: ({ header }) => String(header || "").trim(),
    });

    r.pipe(parser);

    const processRow = async (raw) => {
      const row = cleanRowKeys(raw);
      processed.total++;

      const categorieRaw = row["CATEGORIE"] || "";
      const nume = row["NUME"];
      const codUnic = row["COD_UNIC"];
      const imagineUrl = row["LINK POZA"] || "";
      const dispRaw = row["Disponibilitate"] || "";

      if (!nume || !codUnic) {
        incReason("MISSING_NUME_OR_COD");
        processed.skipped++;
        return;
      }

      // Categorie – toleranță
      const cat = categorieRaw.toLowerCase();
      const okCategory =
        cat.includes("accesorii") &&
        (cat.includes("huse") || cat.includes("folii"));
      if (!okCategory) {
        incReason("CATEGORY");
        processed.skipped++;
        return;
      }

      // Disponibilitate – toleranță
      const disp = dispRaw.toLowerCase();
      const okStock = /(in\s*stoc|stoc.*furnizor|stoc\s*limitat|stoc)/i.test(
        disp
      );
      if (!okStock) {
        incReason("STOCK");
        processed.skipped++;
        return;
      }

      // Brand presence – includem și "pura"
      if (!/(iphone|apple|samsung|galaxy|huawei|pura)/i.test(nume)) {
        incReason("BRAND_FILTER");
        processed.skipped++;
        return;
      }

      // ModelSlug
      const modelSlug = extractModelSlug(nume);
      if (!modelSlug) {
        incReason("MODEL_SLUG");
        processed.skipped++;
        return;
      }

      // tip/ tipProdus pentru UI
      const nameLower = nume.toLowerCase();
      const isFolie =
        /(^|\s)(folie|sticla\s*securizata|tempered)/i.test(nume) ||
        cat.includes("folii");
      const tip = isFolie ? "folie" : "husa";

      // Cameră spate – dezactivăm
      const isCameraSpate =
        /folie de protectie camera spate|camera spate/i.test(nume);

      // Pricing
      let pretBaza = parseFloat(
        String(row["Pret Diamond cu TVA"] || "0").replace(",", ".")
      );
      if (!(pretBaza > 0)) {
        incReason("PRICE");
        processed.skipped++;
        return;
      }
      const pretFinal = Math.round((pretBaza + 7.8) * 1.025 * 100) / 100;

      // Slug document
      const slug = slugify(nume);
      const docRef = db.collection("products").doc(slug);
      const snapshot = await docRef.get();

      // Imagine
      ensureDirExists(PUBLIC_IMG_DIR);
      const imageFileName = `${slug}.webp`;
      const imagePath = path.join(PUBLIC_IMG_DIR, imageFileName);
      const finalImageUrl = `${BASE_IMAGE_URL}/${imageFileName}`;

      if (!snapshot.exists) {
        if (!imagineUrl) {
          incReason("NO_IMAGE_URL");
          processed.skipped++;
          return;
        }
        const ok = await downloadAndConvertImage(imagineUrl, imagePath);
        if (!ok) {
          incReason("IMAGE_CONVERT");
          processed.skipped++;
          return;
        }

        const newData = {
          codUnic: String(codUnic),
          cod: row["COD"] || "",
          ean: String(row["EAN"] || ""),
          nume,
          slug,
          marca: "",
          categorie: categorieRaw,
          garantie: parseInt(row["Garantie in luni"], 10) || 0,
          disponibilitate: row["Disponibilitate"] || "",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          activ: isCameraSpate ? false : true,
          necesitaImagine: false,
          imagine: [finalImageUrl],
          modelSlug,
          pret: pretFinal,
          tip,
          tipProdus: tip,
        };

        await docRef.set(newData, { merge: true });
        processed.saved++;
      } else {
        // update scurt
        await docRef.set(
          {
            disponibilitate: row["Disponibilitate"] || "",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            activ: isCameraSpate ? false : true,
            pret: pretFinal,
            tip,
            tipProdus: tip,
          },
          { merge: true }
        );
        processed.saved++;
      }

      if (processed.total % 100 === 0) {
        console.log(
          `Progres: ${processed.total} procesate, ${processed.saved} salvate, ${processed.skipped} ignorate`
        );
      }
    };

    parser.on("data", async (rawRow) => {
      parser.pause();
      try {
        await processRow(rawRow);
      } catch (e) {
        console.error("Eroare la procesarea rândului:", e.message);
        incReason("EXCEPTION");
      } finally {
        parser.resume();
      }
    });

    parser.on("end", () => {
      console.log("Import finalizat!");
      console.log(
        ` Total procesate: ${processed.total}\n Salvate cu succes: ${processed.saved}\n Ignorate: ${processed.skipped}`
      );
      // raport skip reasons
      if (Object.keys(skipReasons).length) {
        console.log("Skip reasons:");
        Object.entries(skipReasons)
          .sort((a, b) => b[1] - a[1])
          .forEach(([r, c]) => console.log(` - ${r}: ${c}`));
      }
    });

    parser.on("error", (err) => console.error("Eroare CSV:", err));
  });
});
