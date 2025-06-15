const fs = require("fs");
const path = require("path");

const baseURL = "https://vv-shop.web.app/img/";
const root = "D:/DropshippingV2/VV_shop_clean/public/img";

function getEncodedURLPath(filePath) {
  return baseURL + filePath.split(path.sep).map(encodeURIComponent).join("/");
}

function walkDir(dir, parent = "") {
  const result = {};
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach((entry) => {
    const relPath = path.join(parent, entry.name);
    if (entry.isDirectory()) {
      Object.assign(result, walkDir(path.join(dir, entry.name), relPath));
    } else if (entry.name.endsWith(".webp")) {
      const folder = parent.split(path.sep).join("/");
      if (!result[folder]) result[folder] = [];
      result[folder].push(getEncodedURLPath(relPath));
    }
  });

  return result;
}

const all = walkDir(root);

fs.writeFileSync("poze-encoded.json", JSON.stringify(all, null, 2), "utf8");
console.log(
  "✔️  Linkuri generate corect cu encoding și salvate în poze-encoded.json"
);
