import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  
  // Create empty console functions for production
  const prodConsole = {
    log: '(() => {})',
    warn: '(() => {})',
    error: '(() => {})',
    info: '(() => {})',
    debug: '(() => {})',
    trace: '(() => {})',
  };
  
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
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: '/',
    define: {
      global: {},
      // Replace console methods in production
      ...(isProd && {
        'console.log': prodConsole.log,
        'console.warn': prodConsole.warn,
        'console.error': prodConsole.error,
        'console.info': prodConsole.info,
        'console.debug': prodConsole.debug,
        'console.trace': prodConsole.trace,
      }),
    },
  };
});
