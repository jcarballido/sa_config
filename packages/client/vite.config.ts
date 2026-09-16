import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/,'')
      },"/assets": {
        target: "http://localhost:8787",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/assets/,'')
      }
    },
  },
})
