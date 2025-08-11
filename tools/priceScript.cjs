const admin = require("firebase-admin");
const serviceAccount = require("./import/serviceAccountKey.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

function roundUpTo99(price) {
  const integerPart = Math.floor(price);
  // Dacă are deja .99, nu schimbăm
  if (Math.abs(price - (integerPart + 0.99)) < 0.001) {
    return price;
  }
  // Dacă are parte zecimală > 0, mergem la integer + 0.99
  return integerPart + 0.99;
}

async function updatePrices() {
  const snapshot = await db.collection("products").get();
  let updatedCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (typeof data.pret === "number") {
      const newPrice = roundUpTo99(data.pret);
      if (newPrice !== data.pret) {
        await doc.ref.update({ pret: newPrice });
        console.log(`✅ ${doc.id}: ${data.pret} → ${newPrice}`);
        updatedCount++;
      }
    }
  }

  console.log(`\nFinalizat! ${updatedCount} produse actualizate.`);
}

updatePrices().catch(console.error);
