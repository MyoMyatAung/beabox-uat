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
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
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
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
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
  // base: 'https://vfurcsj.jfojf.cn/',
  // development
  base: '/',
  define: {
    global: {},
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        pure_funcs: ['console.log', 'console.debug'], // Only remove specific console methods
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
