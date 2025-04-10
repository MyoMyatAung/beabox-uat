import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        display: "standalone",
        scope: "/",
        start_url: "/",
      },
      workbox: {
        navigateFallback: "/index.html", // Ensures deep links work
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4 MB
      },
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/',
  define: {
    global: {},
  },
});
