import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,ico,png,svg,webp,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Bolão 2026',
        short_name: 'Bolão 2026',
        description: 'Bolão Copa do Mundo 2026',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/bolao',
        icons: [
          {
            src: '/bolao-touch-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'iagofreire.dev'
    ]
  }
})
