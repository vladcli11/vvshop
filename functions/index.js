const functions = require("firebase-functions");
const {
  createCheckoutSession,
  validatePromoCode,
  stripeWebhook,
} = require("./CreateCheckoutSession");
// exportul funcției ca endpoint Firebase
exports.createCheckoutSession = functions.https.onRequest(
  createCheckoutSession
);
exports.validatePromoCode = functions.https.onRequest(validatePromoCode);
exports.stripeWebhook = functions.https.onRequest(stripeWebhook);
