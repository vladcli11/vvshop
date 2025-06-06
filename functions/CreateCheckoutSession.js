const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.secret);
const admin = require("firebase-admin");

// 🎯 FUNCȚIE 1 — CHECKOUT
exports.createCheckoutSession = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).send("");

  try {
    const { items, promoCodeText } = req.body;

    let discounts = [];

    if (promoCodeText) {
      const promoCodes = await stripe.promotionCodes.list({
        code: promoCodeText,
        active: true,
      });

      if (promoCodes.data.length > 0) {
        discounts = [{ promotion_code: promoCodes.data[0].id }];
      } else {
        return res
          .status(400)
          .json({ error: "Cod promoțional invalid sau expirat." });
      }
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Coșul este gol sau invalid." });
    }

    const line_items = items.map((item, i) => {
      if (!item.nume || !item.pret) {
        throw new Error(`Item lipsă sau invalid la index ${i}`);
      }

      return {
        price_data: {
          currency: "ron",
          unit_amount: Math.round(item.pret * 100),
          product_data: {
            name: item.nume,
          },
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      discounts,
      locale: "auto",
      success_url: "http://192.168.13.66:5173/succes",
      cancel_url: "http://192.168.13.66:5173/anulare",
    });

    console.log("🟢 Sesiune Stripe creată:", session.id);
    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("❌ Stripe error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// 🎯 FUNCȚIE 2 — VALIDARE COD
exports.validatePromoCode = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).send("");

  try {
    const { code } = req.body;

    if (!code) return res.status(400).json({ error: "Cod lipsă." });

    const promoCodes = await stripe.promotionCodes.list({
      code,
      active: true,
    });

    if (promoCodes.data.length === 0) {
      return res.status(400).json({ error: "Cod invalid sau expirat." });
    }

    const couponId = promoCodes.data[0].coupon.id;
    const coupon = await stripe.coupons.retrieve(couponId);

    return res.status(200).json({
      discount: coupon.percent_off || 0,
    });
  } catch (err) {
    console.error("❌ Eroare validare cupon:", err);
    res.status(500).json({ error: "Eroare server." });
  }
};
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = functions.config().stripe.webhook;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Eroare semnătură Stripe:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sessionId = session.id;

    try {
      const snapshot = await db
        .collection("comenzi")
        .where("stripeSessionId", "==", sessionId)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        await docRef.update({ status: "platita" });
        console.log("🟢 Comandă actualizată ca platită:", docRef.id);
      } else {
        console.warn("⚠️ Nicio comandă găsită cu acest sessionId:", sessionId);
      }

      return res.status(200).send("OK");
    } catch (error) {
      console.error("❌ Eroare Firestore:", error.message);
      return res.status(500).send("Eroare server");
    }
  }

  res.status(200).send("Event ignorat");
});
