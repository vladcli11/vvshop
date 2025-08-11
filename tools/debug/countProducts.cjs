const admin = require("firebase-admin");
const serviceAccount = require("../import/serviceAccountKey.json"); // urcă din debug în tools, apoi intră în import

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function countProducts() {
  const snapshot = await db.collection("products").get();
  console.log(`📦 Total produse în Firestore: ${snapshot.size}`);
}

countProducts()
  .then(() => process.exit())
  .catch((err) => {
    console.error("❌ Eroare la citire:", err);
    process.exit(1);
  });
