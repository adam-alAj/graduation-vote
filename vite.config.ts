import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves this app from /graduation-vote/, so the build output
// must use that base path. VITE_BASE_PATH still allows local override when needed.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/graduation-vote/",
  plugins: [react()],
});
