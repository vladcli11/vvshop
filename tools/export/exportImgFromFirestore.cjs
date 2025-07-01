// 📤 Script Node.js pentru exportul imaginilor necesare în dist/img
// Citește produsele reale din Firestore și copiază imaginile relevante

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const serviceAccount = require("../import/serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const allowedModelSlugs = new Set(require("../import/allowedModelSlugs.json"));

const SOURCE_DIR = path.join(__dirname, "../../public/img");
const DEST_DIR = path.join(__dirname, "../../dist/img");
(async () => {
  const snapshot = await db
    .collection("products")
    .where("activ", "==", true)
    .get();

  let copied = 0;
  let skipped = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const imageUrl = data.imagine?.[0];
    const modelSlug = data.modelSlug;

    if (!imageUrl || !allowedModelSlugs.has(modelSlug)) {
      skipped++;
      continue;
    }

    const fileName = imageUrl.split("/").pop();
    const sourcePath = path.join(SOURCE_DIR, fileName);
    const destPath = path.join(DEST_DIR, fileName);

    if (fs.existsSync(sourcePath)) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copiat: ${fileName}`);
      copied++;
    } else {
      console.warn(`⚠️ Lipsă imagine: ${fileName}`);
    }
  }

  console.log(`\n🎉 Export complet. Copiate: ${copied}, Sărite: ${skipped}`);
})();
