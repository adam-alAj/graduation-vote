import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Use a relative base so the app works from GitHub Pages regardless of the
// repository name. VITE_BASE_PATH still allows an override when needed.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "./",
  plugins: [react()],
});
