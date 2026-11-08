import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // API_TARGET can be set in the shell or in .env.local, e.g. API_TARGET=https://specialklasen.org
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.API_TARGET || 'http://localhost:8090';

  return {
    plugins: [react()],
    server: {
      host: true, // Allow external connections (needed for Docker)
      port: 5173,

      // pocketbase proxy
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
        '/_': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
