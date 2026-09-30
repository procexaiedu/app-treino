import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// base é sobrescrito no build do GitHub Pages via VITE_BASE
const base = process.env.VITE_BASE ?? '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg', 'media/*.svg'],
      manifest: {
        name: 'Treino 12 Semanas',
        short_name: 'Treino',
        description: 'Plano de treino e alimentação de 12 semanas, adaptado ao desfiladeiro torácico.',
        lang: 'pt-BR',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0b0f14',
        theme_color: '#0b0f14',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: `${base}index.html`,
        runtimeCaching: [
          {
            // vídeos e imagens de demonstração: cache sob demanda, offline depois do 1º acesso
            urlPattern: ({ url }) =>
              /\.(mp4|webm|gif|jpg|jpeg|png|svg)$/i.test(url.pathname) &&
              !url.pathname.startsWith(base + 'assets/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'demo-media',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] },
              rangeRequests: true,
            },
          },
          {
            urlPattern: ({ url }) => url.hostname.endsWith('ytimg.com'),
            handler: 'CacheFirst',
            options: { cacheName: 'yt-thumbs', expiration: { maxEntries: 80 }, cacheableResponse: { statuses: [0, 200] } },
          },
        ],
      },
    }),
  ],
})
