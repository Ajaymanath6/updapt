import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path - use /updapt/ for GitHub Pages, / for local
  base: process.env.NODE_ENV === 'production' ? '/updapt/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure source maps for debugging
    sourcemap: false,
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
})
