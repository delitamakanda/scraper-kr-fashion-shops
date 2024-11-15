import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './__tests__/setup.js',
  },
  build: {
    manifest: true,
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production'? '' : 'http://localhost:8000',
      },
    },
  },
  base: process.env.NODE_ENV === 'production'? '/static/' : '/',
})
