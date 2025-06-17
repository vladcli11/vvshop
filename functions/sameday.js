const functions = require("firebase-functions");
const axios = require("axios");
const cityMap = require("./sameday_city_ids.json");
const countyMap = require("./sameday_county_ids.json");

const SAMEDAY_USERNAME = functions.config().sameday.username;
const SAMEDAY_PASSWORD = functions.config().sameday.password;
const BASE_URL = "https://sameday-api.demo.zitec.com";

let cachedToken = null;
let tokenTimestamp = 0;

async function authenticate() {
  const now = Date.now();
  if (cachedToken && now - tokenTimestamp < 23 * 60 * 60 * 1000) {
    return cachedToken;
  }

  const res = await axios.post(`${BASE_URL}/api/authenticate`, null, {
    headers: {
      "X-AUTH-USERNAME": SAMEDAY_USERNAME,
      "X-AUTH-PASSWORD": SAMEDAY_PASSWORD,
      Accept: "application/json",
    },
  });

  cachedToken = res.data.token;
  tokenTimestamp = now;
  return cachedToken;
}

exports.generateAwb = functions
  .region("europe-west1")
  .https.onCall(async (data) => {
    try {
      const token = await authenticate();

      // Normalizează și construiește cheia pentru mapare
      const normalize = (str) =>
        str
          ?.trim()
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase());

      const judet = normalize(data.oohLastMile?.county || data.judet);
      const localitate = normalize(data.oohLastMile?.city || data.localitate);
      const cityKey = `${localitate}, ${judet}`;
      const cityId = cityMap[cityKey];
      const countyId = countyMap[judet];

      if (!cityId || !countyId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          `Oraș sau județ invalid: ${cityKey}`
        );
      }

      const awbBody = {
        pickupPoint: 11150,
        contactPerson: 14476,
        service: data.service,
        awbPayment: 1,
        thirdPartyPickup: 0,
        packageType: 0,
        packageWeight: data.greutate || 1.2,
        packageNumber: 1,
        insuredValue: 0,
        cashOnDelivery: data.codAmount || 0,
        clientInternalReference: `vvshop-${Date.now()}`,
        parcels: [
          {
            weight: data.greutate || 1.2,
            width: 20,
            length: 30,
            height: 10,
          },
        ],
        awbRecipient: {
          name: data.nume,
          phoneNumber: data.telefon,
          personType: data.personType === "company" ? 1 : 0,
          postalCode:
            data.oohLastMile?.postalCode || data.codPostal || "000000",
          address:
            data.oohLastMile?.address || data.strada || "Adresă necunoscută",
          county: countyId,
          city: cityId,
        },
      };

      if (data.oohLastMile) {
        awbBody.oohLastMile = {
          lockerId: data.oohLastMile.lockerId || data.oohLastMile.oohId,
          name: data.oohLastMile.name,
          address: data.oohLastMile.address,
          city: data.oohLastMile.city,
          county: data.oohLastMile.county,
          postalCode: data.oohLastMile.postalCode,
        };
      }

      console.log("📦 Trimit AWB cu:", JSON.stringify(awbBody, null, 2));

      const response = await axios.post(`${BASE_URL}/api/awb`, awbBody, {
        headers: {
          "X-AUTH-TOKEN": token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      return {
        success: true,
        awbNumber: response.data.parcels?.[0]?.awbNumber,
        data: response.data,
      };
    } catch (err) {
      const errorData =
        err.response?.data || err.message || "Eroare necunoscută";

      console.error(
        "❌ Eroare la generare AWB:",
        JSON.stringify(errorData, null, 2)
      );

      return {
        success: false,
        error: {
          code: err.response?.status || 500,
          message: err.message || "Eroare necunoscută",
          errors: errorData.errors || {},
        },
      };
    }
  });
