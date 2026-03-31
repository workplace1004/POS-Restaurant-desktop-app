import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative base so Electron `loadFile(dist/index.html)` resolves JS/CSS and `./foo.svg` from `public/`.
  base: './',
  plugins: [react()],
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
});
