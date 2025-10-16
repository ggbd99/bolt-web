// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path" // <--- 1. IMPORT path

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        // ... your proxy configuration
        '/api/tmdb': {
          target: 'https://api.themoviedb.org/3',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => {
            const newPath = path.replace(/^\/api\/tmdb/, '');
            const apiKey = env.VITE_TMDB_API_KEY;
            const separator = newPath.includes('?') ? '&' : '?';
            return `${newPath}${separator}api_key=${apiKey}`;
          },
        },
      },
    },
    // --- 2. ADD THE RESOLVE.ALIAS CONFIGURATION HERE ---
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
}