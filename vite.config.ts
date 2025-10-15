import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/tmdb': {
        target: 'https://api.themoviedb.org/3',
        changeOrigin: true,
        rewrite: (path) => {
          const newPath = path.replace(/^\/api\/tmdb/, '');
          const apiKey = process.env.VITE_TMDB_API_KEY;
          const separator = newPath.includes('?') ? '&' : '?';
          return `${newPath}${separator}api_key=${apiKey}`;
        },
      },
    },
  },
});
