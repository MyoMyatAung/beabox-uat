import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  
  return {
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
      isProd && {
        name: 'strip-console',
        transform(code: string, id: string) {
          if (id.includes('node_modules')) return null;
          
          return {
            code: code.replace(/console\.(log|debug|info|warn|error|trace)\(([^)]*)\);?/g, ''),
            map: null
          };
        }
      }
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: '/',
    define: {
      global: {},
    },
  };
});
