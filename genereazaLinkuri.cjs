const fs = require("fs");
const path = require("path");

const BASE_URL = "https://vv-shop.web.app/img";
const ROOT = path.join(__dirname, "public", "img");

const result = {};

fs.readdirSync(ROOT).forEach((folder) => {
  const folderPath = path.join(ROOT, folder);
  if (fs.statSync(folderPath).isDirectory()) {
    const files = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".webp"));

    result[folder] = files.map(
      (filename) => `${BASE_URL}/${folder}/${filename}`
    );
  }
});

// ✅ Afișăm sau salvăm în fișier
console.log(JSON.stringify(result, null, 2));

// (opțional) salvare în .json
fs.writeFileSync("linkuri_imagini.json", JSON.stringify(result, null, 2));
console.log("✅ Linkurile au fost salvate în linkuri_imagini.json");
