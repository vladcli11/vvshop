const functions = require("firebase-functions");
const axios = require("axios");

// ✅ Acum luăm userul/parola direct din configul Firebase
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

      const awbBody = {
        pickupPoint: 11150,
        contactPerson: 14476,
        service: 7, // Home Delivery 24H (presupunând că îl ai activ)
        awbPayment: 1, // clientul (adică tu) plătește
        thirdPartyPickup: 0,
        packageType: 0, // colet standard
        packageWeight: 1,
        packageNumber: 1,
        insuredValue: 0,
        cashOnDelivery: data.codAmount || 0,
        clientInternalReference: `vvshop-${Date.now()}`,
        parcels: [
          {
            weight: 1,
            width: 20,
            length: 30,
            height: 10,
          },
        ],
        awbRecipient: {
          name: data.nume,
          phoneNumber: data.telefon,
          personType: 0, // 0 = persoană fizică
          postalCode: data.codPostal || "907015",
          address: "Str. Clientului nr. X",
          county: 15,
          city: 9334,
        },
      };
      console.log("📦 Trimit AWB cu date:", JSON.stringify(awbBody, null, 2));
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

      // ✅ Log explicit detaliat
      console.error(
        "❌ Eroare la generare AWB:",
        JSON.stringify(errorData, null, 2)
      );

      // ✅ Returnăm eroarea completă, inclusiv children (dacă există)
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

const { Storage } = require("@google-cloud/storage");
const os = require("os");
const fs = require("fs");
const path = require("path");

const storage = new Storage();
const bucket = storage.bucket("vv_shop_clean.appspot.com"); // înlocuiește cu numele real al bucketului tău

exports.saveAwbLabel = functions
  .region("europe-west1")
  .https.onCall(async (data) => {
    const { awbNumber } = data;

    if (!awbNumber) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "awbNumber lipsă"
      );
    }

    try {
      const token = await authenticate();
      const pdfUrl = `${BASE_URL}/api/awb/${awbNumber}/label`;

      const res = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
        headers: {
          "X-AUTH-TOKEN": token,
          Accept: "application/pdf",
        },
      });

      const filePath = path.join(os.tmpdir(), `${awbNumber}.pdf`);
      fs.writeFileSync(filePath, res.data);

      const destFileName = `awb/${awbNumber}.pdf`;
      await bucket.upload(filePath, {
        destination: destFileName,
        contentType: "application/pdf",
        metadata: {
          cacheControl: "public,max-age=3600",
        },
      });

      const file = bucket.file(destFileName);
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 3600 * 1000, // link valabil 1h
      });

      return { success: true, url };
    } catch (err) {
      console.error(
        "❌ Eroare la salvarea AWB PDF:",
        err.response?.data || err
      );
      throw new functions.https.HttpsError("internal", "Eroare la salvare AWB");
    }
  });
