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
      // Run on closeBundle to overwrite any stale public version in dist
      closeBundle() {
        const distPath = path.resolve(__dirname, 'dist');
        const publicPath = path.resolve(__dirname, 'public');
        const distFile = path.resolve(distPath, 'version.json');
        const publicFile = path.resolve(publicPath, 'version.json');
        
        console.log('!!! VITE PLUGIN: Generating version.json !!!');
        
        const content = JSON.stringify({ 
          version: buildId,
          builtAt: buildTime,
          debug: true
        }, null, 2);

        try {
          // 1. Write to dist (Production)
          if (fs.existsSync(distPath)) {
            fs.writeFileSync(distFile, content);
            console.log(`!!! SUCCESS: Generated version.json at ${distFile} !!!`);
          }
          
          // 2. Also write to public (for next dev run or as a fallback)
          if (fs.existsSync(publicPath)) {
            fs.writeFileSync(publicFile, content);
            console.log(`!!! SUCCESS: Updated version.json at ${publicFile} !!!`);
          }
        } catch (err) {
          console.error('!!! ERROR generating version.json:', err);
        }
      }
    },
    VitePWA({
      registerType: 'autoUpdate',
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,json}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname === '/' || url.pathname === '/index.html',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'index-cache',
              expiration: {
                maxEntries: 1,
              },
            },
          },
        ],
        // Root Cause Fix: Prevent SW from ever returning index.html for these paths
        navigateFallbackDenylist: [
          /^\/version\.json/,
          /\.json$/,
          /\.png$/,
          /\.jpg$/,
          /\.svg$/,
          /^\/api\//
        ],
      }
    })
  ],
  build: {
    cssCodeSplit: false, // Force single CSS file
    assetsInlineLimit: 4096, // Inline small assets
  }
})
