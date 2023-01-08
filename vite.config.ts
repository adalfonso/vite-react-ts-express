import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  root: "./client",
  build: { outDir: "../dist/client" },
  plugins: [react()],
});
