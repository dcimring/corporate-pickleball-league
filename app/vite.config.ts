import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.wasm?module'],
  optimizeDeps: {
    entries: ['src/main.tsx'], // Explicitly scan only from the frontend entry point
    exclude: ['@vercel/og']
  },
  ssr: {
    external: ['@vercel/og'] // Explicitly exclude from SSR processing if applicable
  },
  build: {
    cssCodeSplit: false, // Force single CSS file
    assetsInlineLimit: 4096, // Inline small assets
    rollupOptions: {
      external: ['@vercel/og'] // Ensure @vercel/og isn't bundled for the client
    }
  }
})
