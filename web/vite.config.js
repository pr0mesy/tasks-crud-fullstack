import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import ViteRestart from 'vite-plugin-restart'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    ViteRestart({
      restart: [
        '.env',
        '.env.*',
        'package.json',
        'package-lock.json',
        'vite.config.js',
        'tailwind.config.js',
        'postcss.config.js',
        'components.json',
      ],
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/auth': 'http://localhost:8080',
      '/account': 'http://localhost:8080',
    },
  },
});
