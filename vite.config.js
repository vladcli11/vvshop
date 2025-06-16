import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  publicDir: "public", // ✅ asigură-te că fișierele statice (inclusiv img) sunt servite corect
  build: {
    outDir: "dist",
  },
});
