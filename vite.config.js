import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/saferoute/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
  }
})
