const { Configuration, OpenAIApi } = require("openai");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const fs = require("fs");

// 1. Încarcă variabilele din .env
dotenv.config();

// 2. Inițializează Firebase Admin
const serviceAccount = JSON.parse(
  fs.readFileSync("../import/serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 3. Configurează OpenAI
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function genereazaDescriere({ tipProdus, model }) {
  const prompt = `
Generează o descriere scurtă (maxim 400 caractere) pentru o ${tipProdus} compatibilă cu ${model}.
Ton profesionist, clar, fără bullet points, fără repetiții.
Accentuează beneficiile legate de protecție, utilizare zilnică și compatibilitate.
`;

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.6,
    messages: [
      {
        role: "system",
        content:
          "Ești un copywriter pentru un magazin online de accesorii de telefon (huse și folii).",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return res.choices[0].message.content.trim().slice(0, 400);
}

// 5. Rulează scriptul
async function ruleaza() {
  const snapshot = await db.collection("products").get();

  for (const doc of snapshot.docs) {
    const data = doc.data();

    // sari dacă există deja descriere
    if (data.descriere) continue;

    const tipProdus = data.tipProdus || "accesoriu";
    const model = data.model || data.models?.[0] || "telefonul tău";

    console.log(`📦 Generăm pentru ${data.nume}...`);

    try {
      const descriere = await genereazaDescriere({ tipProdus, model });

      await doc.ref.update({ descriere });
      await new Promise((res) => setTimeout(res, 100));

      console.log(`✅ Salvat: ${descriere.slice(0, 60)}...`);
    } catch (err) {
      console.error("❌ Eroare:", err.message);
    }
  }

  console.log("🚀 Gata!");
}

ruleaza();
