import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [react(), compression()],
  publicDir: "public",
  build: {
    outDir: "dist",
    rollupOptions: {
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
