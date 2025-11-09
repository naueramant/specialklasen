import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external connections (needed for Docker)
    port: 5173,

    // pocketbase proxy
    proxy: {
      "/api": {
        target: "http://localhost:8090",
        changeOrigin: true,
      },
      "/_": {
        target: "http://localhost:8090",
        changeOrigin: true,
      },
    },
  },
});
