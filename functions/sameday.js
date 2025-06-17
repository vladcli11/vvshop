const functions = require("firebase-functions");
const axios = require("axios");
const { Storage } = require("@google-cloud/storage");
const os = require("os");
const fs = require("fs");
const path = require("path");

const cityMap = require("./sameday_city_ids.json");
const countyMap = require("./sameday_county_ids.json");

const SAMEDAY_USERNAME = functions.config().sameday.username;
const SAMEDAY_PASSWORD = functions.config().sameday.password;
const BASE_URL = "https://sameday-api.demo.zitec.com";

const storage = new Storage();
const bucket = storage.bucket("vv_shop_clean.appspot.com"); // modifică dacă ai alt bucket

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

      const normalize = (str) =>
        str
          ?.trim()
          .replace(/\s+/g, " ")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // elimină diacritice
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
        service: data.service, // ex: 7 = curier, 15 = easybox, 48 = pudo
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
        expires: Date.now() + 3600 * 1000,
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
