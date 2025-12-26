import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isVercel = Boolean(process.env.VERCEL);
const isProduction = process.env.NODE_ENV === 'production';
const basePath = process.env.VITE_BASE_PATH
  ?? (isProduction && !isVercel ? '/semantisk-brygga-for-skolans-information/' : '/');

export default defineConfig({
  // GitHub Pages uses a project base path, Vercel should stay at root.
  base: basePath,
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});
