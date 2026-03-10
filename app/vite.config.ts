import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'generate-version-json',
      generateBundle() {
        const buildId = Date.now();
        this.emitFile({
          type: 'asset',
          fileName: 'version.json',
          source: JSON.stringify({ version: buildId })
        });
        console.log(`Vite: Emitting version.json with build ID: ${buildId}`);
      }
    },
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Pickleball Cayman Corporate League',
        short_name: 'Corporate League',
        description: 'Latest standings and results for the Corporate Pickleball League.',
        theme_color: '#005596',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
      }
    })
  ],
  build: {
    cssCodeSplit: false, // Force single CSS file
    assetsInlineLimit: 4096, // Inline small assets
  }
})
