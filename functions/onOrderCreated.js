const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

exports.onOrderCreated = functions.firestore
  .document("comenzi/{id}") // 🔄 corect pentru tine
  .onCreate(async (snap) => {
    const data = snap.data();
    const codPromo = data.codPromo;
    const total = data.totalFinal;

    if (!codPromo || !total) return null;

    const refSnap = await db
      .collection("referralCodes")
      .where("referralCode", "==", codPromo)
      .limit(1)
      .get();

    if (refSnap.empty) return null;

    const refDoc = refSnap.docs[0];

    await refDoc.ref.update({
      usageCount: admin.firestore.FieldValue.increment(1),
      totalOrdersValue: admin.firestore.FieldValue.increment(total),
      commissionEarned: admin.firestore.FieldValue.increment(total * 0.05), // ex: 5%
    });

    console.log(`✅ Cod promo ${codPromo} actualizat cu ${total} lei`);

    return null;
  });
