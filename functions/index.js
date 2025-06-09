const functions = require("firebase-functions");
const {
  createCheckoutSession,
  validatePromoCode,
  stripeWebhook,
} = require("./CreateCheckoutSession");

// Mutăm funcțiile în europa-west4
exports.createCheckoutSession = functions
  .region("europe-west1")
  .https.onRequest(createCheckoutSession);

exports.validatePromoCode = functions
  .region("europe-west1")
  .https.onRequest(validatePromoCode);

exports.stripeWebhook = functions
  .region("europe-west1")
  .https.onRequest(stripeWebhook);
