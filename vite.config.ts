import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The site is a single page with no client-side routes, so a relative base ("./")
// works on GitHub Pages under ANY repository name (https://user.github.io/<repo>/).
// If you ever need an absolute base, set VITE_BASE_PATH (e.g. "/my-repo/") at build time.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "./",
  plugins: [react()],
});
