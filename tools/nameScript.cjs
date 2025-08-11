const admin = require("firebase-admin");
const serviceAccount = require("./import/serviceAccountKey.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function curataNumeProduse() {
  console.log("Încep verificarea produselor");
  const snapshot = await db.collection("products").get();
  let updated = 0;
  let skipped = 0;

  // Expresie pentru termenii de eliminat
  const regex = /\b(OEM|Tint|Tech-Protect|Clin|Nillkin|Pentru\s*Apple)\b/gi;

  for (const doc of snapshot.docs) {
    const data = doc.data();

    if (data.modelSlug && data.modelSlug.toLowerCase().includes("iphone")) {
      const numeNou = data.nume
        .replace(regex, "")
        .replace(/(\s*,\s*){2,}/g, ", ") // curăță „virgulă în virgulă” indiferent de spații
        .replace(/(^,)|(,$)/g, "") // elimină virgulă la început/sfârșit
        .replace(/\s{2,}/g, " ") // spații multiple → un singur spațiu
        .replace(/,\s+/g, ", ") // spațiu corect după virgulă
        .trim();

      if (numeNou !== data.nume) {
        await doc.ref.update({ nume: numeNou });
        console.log(`${doc.id}: ${data.nume} -> ${numeNou}`);
        updated++;
      } else {
        skipped++;
      }
    } else {
      skipped++;
    }
  }

  console.log("Script finalizat.");
  console.log(`• Produse actualizate: ${updated}`);
  console.log(`• Produse fără modificare: ${skipped}`);
}

curataNumeProduse().catch(console.error);
