import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// base './' keeps asset URLs relative so the same build works at a domain root
// and under a sub-path (GitHub Pages project sites).
export default defineConfig({
  base: './',
  build: { outDir: 'dist', sourcemap: false },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icons/*.png', 'favicon.svg'],
      workbox: {
        // App shell + course text + trimmed source index are precached. Audio is NOT precached:
        // each mp3 is cached the first time it is played (see runtimeCaching + src/audio.js).
        globPatterns: ['**/*.{js,css,html,svg,png,json,webmanifest,md,srt}'],
        globIgnores: ['**/audio/*.mp3'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /\/audio\/[^/]+\.mp3$/.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'learn-ai-audio',
              rangeRequests: true,
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 60 },
            },
          },
        ],
      },
      manifest: {
        name: 'Learn AI: an ecologist’s path',
        short_name: 'Learn AI',
        description: 'Daily 30-minute modules: AI, agents, harnesses, RAG and evals taught through evolutionary biology and ecology. Works offline.',
        theme_color: '#0d1f17',
        background_color: '#0d1f17',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: './',
        scope: './',
        categories: ['education'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
