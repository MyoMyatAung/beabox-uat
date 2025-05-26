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
        navigateFallback: "/index.html",
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MB
      },
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifestFilename: 'manifest.webmanifest',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      base: '/',
      injectManifest: {
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MB
      }
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // produciton
  base: 'https://viu34fdq.rrgsih.cn/',
  // development
  // base: '/',
  define: {
    global: {},
  },
});
