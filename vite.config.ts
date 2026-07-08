import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// GitHub Pages serves from /repo-name/; local dev uses /
const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
