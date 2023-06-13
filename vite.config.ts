import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port:3001
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'static',
    minify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    chunkSizeWarningLimit: 500,
    emptyOutDir: true,
  }
})
