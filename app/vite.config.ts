import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs'
import path from 'node:path'

// Get current build time once
const buildTime = new Date().toISOString();
const buildId = Date.now();

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BUILD_TIME__: JSON.stringify(buildTime),
    __BUILD_ID__: JSON.stringify(buildId),
  },
  plugins: [
    react(),
    {
      name: 'generate-version-json',
      closeBundle() {
        const distPath = path.resolve(__dirname, 'dist');
        const filePath = path.resolve(distPath, 'version.json');
        
        console.log('!!! VITE PLUGIN: Generating version.json !!!');
        
        try {
          if (!fs.existsSync(distPath)) {
            console.log(`Creating dist path: ${distPath}`);
            fs.mkdirSync(distPath, { recursive: true });
          }
          
          fs.writeFileSync(
            filePath,
            JSON.stringify({ 
              version: buildId,
              builtAt: buildTime,
              debug: true
            }, null, 2)
          );
          console.log(`!!! SUCCESS: Generated version.json at ${filePath} with ID: ${buildId} !!!`);
        } catch (err) {
          console.error('!!! ERROR generating version.json:', err);
        }
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
        // Exclude version.json from precache so it always hits the network/Vercel
        globIgnores: ['**/version.json'],
        // Explicitly set what to precache
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
      }
    })
  ],
  build: {
    cssCodeSplit: false, // Force single CSS file
    assetsInlineLimit: 4096, // Inline small assets
  }
})
