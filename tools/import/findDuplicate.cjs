const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const OUTPUT_PATH = path.join(__dirname, "duplicatesToImport.json");

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[ăâîșț]/g, (c) => ({ ă: "a", â: "a", î: "i", ș: "s", ț: "t" }[c]))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s\-\+]/g, "") // 🔥 păstrăm `+`
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractModelSlug(modelName) {
  let slug = slugify(modelName);

  slug = slug.replace(/^apple-iphone-/, "iphone-");
  slug = slug.replace(/^apple-/, "iphone-");
  slug = slug.replace(/^samsung-galaxy-/, "samsung-galaxy-");
  slug = slug.replace(/^huawei-/, "huawei-");

  // elimină coduri comerciale
  slug = slug.replace(/-[a-z]?\d{3,4}/g, ""); // ex: -a245, -s911, etc.
  slug = slug.replace(/-(4g|5g)/g, "");
  slug = slug.replace(/-duos|-ds|-dual-sim/g, "");

  // elimină descrieri comerciale
  slug = slug.replace(/-sticla-securizata.*$/, "");
  slug = slug.replace(/-full-glue.*$/, "");
  slug = slug.replace(/-set-[0-9]+-bucati.*$/, "");
  slug = slug.replace(/-negru.*$/, "");
  slug = slug.replace(/-agl[0-9]{4,}/g, "");
  slug = slug.replace(/-rosu.*$/, "");
  slug = slug.replace(/-albastru.*$/, "");

  slug = slug.split("-cu-")[0];
  slug = slug.split("-set-")[0];
  slug = slug.split("-negru")[0];
  slug = slug.split("-agl")[0];
  slug = slug.split("-albastru")[0];
  slug = slug.split("-rosu")[0];
  slug = slug.split("-transparent")[0];
  slug = slug.replace(/-$/, "").replace(/--+/g, "-");

  return slug;
}

function extractModels(nume) {
  const matchPrefix = nume.match(/(iPhone|Apple|Samsung Galaxy|Huawei)/i);
  if (!matchPrefix) return [];

  const prefix = matchPrefix[0];
  const part = nume.split("pentru")[1] || "";
  const clean = part.split(",")[0]; // eliminăm descrieri

  const models = clean
    .split("/")
    .map((m) => m.trim())
    .filter((m) => m.length > 0);

  const normalizedPrefix = prefix.toLowerCase().includes("samsung")
    ? "Samsung Galaxy "
    : prefix.toLowerCase().includes("huawei")
    ? "Huawei "
    : prefix.toLowerCase().includes("apple")
    ? "Apple iPhone "
    : "iPhone ";

  return models.map((m) =>
    m.toLowerCase().includes("iphone") ||
    m.toLowerCase().includes("samsung") ||
    m.toLowerCase().includes("huawei")
      ? m
      : normalizedPrefix + m
  );
}

async function generateDuplicates() {
  const snapshot = await db.collection("products").get();
  const duplicates = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    const models = extractModels(data.nume || "");
    if (models.length < 2) return;

    const secondModel = models[1];
    const newSlug = slugify(`${data.nume} ${secondModel}`);
    const duplicate = {
      ...data,
      slug: newSlug,
      modelSlug: extractModelSlug(secondModel),
      duplicat: true,
    };

    duplicates.push(duplicate);
    console.log(`🟢 Detectat duplicat: ${newSlug}`);
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(duplicates, null, 2), "utf8");
  console.log(
    `\n✅ ${duplicates.length} produse duplicate salvate în ${OUTPUT_PATH}`
  );
}

generateDuplicates().catch((err) => {
  console.error("❌ Eroare:", err);
});
