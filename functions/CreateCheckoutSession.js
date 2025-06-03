const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.secret);

exports.createCheckoutSession = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).send("");

  try {
    const items = req.body.items;

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
          unit_amount: Math.round(item.pret * 100), // Ex: 34.99 lei → 3499 bani
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
      locale: "auto",
      success_url: "https://vvshop.ro/succes",
      cancel_url: "https://vvshop.ro/anulare",
    });

    console.log("🟢 Sesiune Stripe creată:", session.id);
    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("❌ Stripe error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
