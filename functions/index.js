const functions = require("firebase-functions");
const {
  createCheckoutSession,
  validatePromoCode,
  stripeWebhook,
} = require("./CreateCheckoutSession");
const { generateAwb, saveAwbLabel } = require("./sameday");
const { generateReferralCode } = require("./generateReferralCode");
const { onOrderCreated } = require("./onOrderCreated");
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
exports.generateReferralCode = generateReferralCode;
exports.generateAwb = generateAwb;
exports.saveAwbLabel = saveAwbLabel;
exports.onOrderCreated = onOrderCreated;
