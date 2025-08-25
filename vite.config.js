import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [
    react(),
    // rulează compresia DOAR în producție
    isProd && viteCompression({ algorithm: "brotliCompress" }),
  ].filter(Boolean),

  publicDir: "public",
  build: {
    outDir: "dist",
    minify: true,
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      plugins: [],
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("swiper")) return "vendor_swiper";
            if (id.includes("firebase")) return "vendor_firebase";
            if (id.includes("lucide-react")) return "vendor_icons";
            if (id.includes("react")) return "vendor_react";
            return "vendor";
          }
        },
      },
    },
  },
});
