import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: "brotliCompress" }), // sau gzip
  ],
  publicDir: "public",
  build: {
    outDir: "dist",
    minify: "terser",
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      plugins: [
        visualizer({
          filename: "bundle-stats.html",
          open: true,
          gzipSize: true,
          brotliSize: true,
          template: "treemap", // sau "sunburst"
        }),
      ],
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
