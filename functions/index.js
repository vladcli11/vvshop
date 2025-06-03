const functions = require("firebase-functions");
const { createCheckoutSession } = require("./CreateCheckoutSession");

// exportul funcției ca endpoint Firebase
exports.createCheckoutSession = functions.https.onRequest(
  createCheckoutSession
);
