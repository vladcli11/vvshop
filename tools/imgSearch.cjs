const admin = require("firebase-admin");
const serviceAccount = require("./import/serviceAccountKey.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function setInactiveIfNoImage() {
  const snapshot = await db.collection("products").get();
  let updatedCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    // Verifică dacă imaginea nu există sau e goală
    if (
      !data.imagine ||
      !Array.isArray(data.imagine) ||
      data.imagine.length === 0 ||
      !data.imagine[0]
    ) {
      await doc.ref.update({ activ: false });
      console.log(`Setat activ:false pentru: ${doc.id}`);
      updatedCount++;
    }
  }
  console.log(`\n✅ ${updatedCount} produse fără imagine au fost dezactivate!`);
}

setInactiveIfNoImage().catch((err) => {
  console.error("Eroare:", err);
});
