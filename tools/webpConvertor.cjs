const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const dir = "./src/assets"; // sau ./dist/assets
const outputDir = "./src/assets1"; // unde vrei să pui imaginile convertite

// Asigură-te că există folderul
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.readdirSync(dir).forEach(async (file) => {
  const ext = path.extname(file).toLowerCase();
  const name = path.basename(file, ext);
  if ([".png", ".jpg", ".jpeg"].includes(ext)) {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(outputDir, `${name}.webp`);

    try {
      await sharp(inputPath)
        .resize(300, 300, { fit: "cover" }) // sau "contain" dacă vrei padding
        .toFormat("webp")
        .toFile(outputPath);
      console.log(`✅ ${file} -> ${name}.webp`);
    } catch (err) {
      console.error(`❌ Eroare ${file}:`, err.message);
    }
  }
});
