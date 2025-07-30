const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

const stripe = new Stripe(functions.config().stripe.secret);
const db = admin.firestore();

exports.generateReferralCode = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  const email = context.auth?.token?.email;

  if (!uid || !email) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Trebuie să fii autentificat."
    );
  }

  const rand = Math.random().toString(36).slice(-3).toUpperCase();
  const code = `VV-${uid.slice(0, 6).toUpperCase()}${rand}`;

  try {
    // verifică dacă există deja
    const refDoc = await db.collection("referralCodes").doc(uid).get();
    if (refDoc.exists) {
      const existingCode = refDoc.data().referralCode;
      return { code: existingCode };
    }

    // Creează cupon în Stripe
    const coupon = await stripe.coupons.create({
      name: `Referral ${email}`,
      percent_off: 10,
      duration: "once",
      metadata: { uid, email, referralCode: code },
    });

    // Creează Promotion Code în Stripe
    const promoCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: code, // același cod ca referralCode
      max_redemptions: 1, // sau cât vrei tu
      active: true,
    });

    // Salvează în Firestore
    await db.collection("referralCodes").doc(uid).set({
      uid,
      email,
      referralCode: code,
      stripeCouponId: coupon.id,
      stripePromotionCodeId: promoCode.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { code };
  } catch (err) {
    console.error("❌ Eroare la generare cod referral:", err.message);
    throw new functions.https.HttpsError(
      "internal",
      "Eroare la generarea codului."
    );
  }
});
