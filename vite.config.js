import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const isPwaMode = mode === 'pwa';
  return {
    base: '/',
    plugins: [
      react(),
      VitePWA({
        disable: !isPwaMode,
        registerType: 'autoUpdate',
        includeAssets: ['icon.png', 'favicon.ico'],
        manifest: {
          name: 'RES POS',
          short_name: 'RES POS',
          description: 'Restaurant POS system',
          start_url: '/',
          display: 'standalone',
          background_color: '#2c3e50',
          theme_color: '#2c3e50',
          icons: [
            { src: '/icon.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' }
          ]
        }
      })
    ],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': 'http://localhost:5000',
        '/device-agent': {
          target: 'http://127.0.0.1:39471',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/device-agent/, '')
        },
        '/license': {
          target: 'http://127.0.0.1:5050',
          changeOrigin: true
        },
        '/socket.io': {
          target: 'http://localhost:5000',
          ws: true
        }
      }
    }
  };
});
