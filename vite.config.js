import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.js',
  },
  build: {
    manifest: true,
  },
  root: './src',
  base: process.env.NODE_ENV === 'production'? '/static/' : '/',
})
