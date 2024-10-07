import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/productos': 'http://localhost:3000',
      '/usuarios': 'http://localhost:3000',
      '/ventas': 'http://localhost:3000'
    }
  }
})
