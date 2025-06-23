const functions = require("firebase-functions");
const {
  createCheckoutSession,
  validatePromoCode,
  stripeWebhook,
} = require("./CreateCheckoutSession");
const { saveAwbLabel } = require("./sameday");

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

exports.saveAwbLabel = functions
  .region("europe-west1")
  .https.onCall(saveAwbLabel);

exports.generateAwb = functions
  .region("europe-west1")
  .https.onCall(require("./sameday").generateAwb);
