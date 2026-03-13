import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Get current build time once
const buildTime = new Date().toISOString();
const buildId = process.env.NODE_ENV === 'production' ? Date.now() : 'DEV';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    __BUILD_TIME__: JSON.stringify(buildTime),
    __BUILD_ID__: JSON.stringify(mode === 'production' ? buildId : 'DEV'),
  },
  plugins: [
    react(),
    {
      name: 'generate-version-json',
      // Run on closeBundle to overwrite any stale public version in dist
      closeBundle() {
        if (mode !== 'production') return;

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
    }
  ],
  build: {
    cssCodeSplit: false, // Force single CSS file
    assetsInlineLimit: 4096, // Inline small assets
  }
}))
