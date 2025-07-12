const admin = require("firebase-admin");
const serviceAccount = require("./import/serviceAccountKey.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function actualizeazaTipProdus() {
  console.log("🚀 Încep verificarea produselor...");

  const snapshot = await db.collection("products").get();
  let updated = 0;
  let skipped = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();

    const nume = data.nume?.toLowerCase() || "";
    let tipProdusNou = "";

    if (/\b(husa|carcasa)\b/.test(nume)) {
      tipProdusNou = "husa";
    } else if (/\b(folie|sticla|glass|protectie)\b/.test(nume)) {
      tipProdusNou = "folie";
    } else {
      tipProdusNou = "alt";
    }

    const tipProdusActual = data.tipProdus;

    if (!tipProdusActual || tipProdusActual !== tipProdusNou) {
      await doc.ref.update({ tipProdus: tipProdusNou });
      console.log(`✅ ${doc.id}: set tipProdus → ${tipProdusNou}`);
      updated++;
    } else {
      skipped++;
    }
  }

  console.log("🎉 Script finalizat.");
  console.log(`   • Produse actualizate: ${updated}`);
  console.log(`   • Produse fără modificare: ${skipped}`);
}

actualizeazaTipProdus().catch((err) =>
  console.error("❌ Eroare la actualizare:", err)
);
