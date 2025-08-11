const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

const stripe = new Stripe(
  process.env.STRIPE_SECRET || functions.config().stripe.secret,
  { apiVersion: "2024-06-20" }
);

const db = admin.firestore();

exports.generateReferralCode = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    const uid = context.auth?.uid;
    const email = context.auth?.token?.email;
    if (!uid || !email) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Trebuie să fii autentificat."
      );
    }

    // blocăm re-generarea: dacă există, îl returnăm
    const existing = await db.collection("referralCodes").doc(uid).get();
    if (existing.exists) {
      return { code: existing.data().referralCode };
    }

    const rawPart = (data?.customPart || "").toString().trim().toUpperCase();
    if (
      !rawPart ||
      rawPart.length < 4 ||
      rawPart.length > 6 ||
      !/^[A-Z0-9]+$/.test(rawPart)
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Fragmentul trebuie 4–6 caractere A–Z/0–9."
      );
    }

    const randomChunk = (n = 6) => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      return Array.from(
        { length: n },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join("");
    };

    let tries = 0;
    while (tries < 3) {
      const suffix = randomChunk(6);
      const code = `VV-${rawPart}${suffix}`;

      try {
        const coupon = await stripe.coupons.create({
          name: `Referral ${email}`,
          percent_off: 10,
          duration: "once",
          metadata: { uid, email, referralCode: code },
        });

        const promo = await stripe.promotionCodes.create({
          coupon: coupon.id,
          code,
          max_redemptions: 1,
          active: true,
        });

        await db.collection("referralCodes").doc(uid).set({
          uid,
          email,
          referralCode: code,
          stripeCouponId: coupon.id,
          stripePromotionCodeId: promo.id,
          usageCount: 0,
          totalOrdersValue: 0,
          commissionEarned: 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return { code };
      } catch (err) {
        if (err?.code === "resource_already_exists") {
          tries++;
          continue;
        }
        console.error("generateReferralCode error:", err);
        throw new functions.https.HttpsError(
          "internal",
          "Eroare la generarea codului."
        );
      }
    }

    throw new functions.https.HttpsError(
      "already-exists",
      "Fragment ocupat. Încearcă altul."
    );
  });
