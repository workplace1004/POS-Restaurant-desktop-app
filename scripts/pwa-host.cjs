#!/usr/bin/env node
/**
 * Minimal static server for PWA dist output.
 * Intended for Windows service usage (NSSM) in local kiosk deployments.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.env.PWA_DIST_DIR || path.join(__dirname, '..', 'dist'));
const host = process.env.PWA_HOST || '127.0.0.1';
const port = Number(process.env.PWA_PORT || 4173);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function safeJoin(base, reqPath) {
  const decoded = decodeURIComponent(reqPath.split('?')[0] || '/');
  const cleaned = decoded.replace(/\\/g, '/');
  const rel = cleaned === '/' ? '/index.html' : cleaned;
  const full = path.normalize(path.join(base, rel));
  if (!full.startsWith(path.normalize(base))) return null;
  return full;
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';
  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  });
  res.writeHead(200, {
    'Content-Type': contentType,
    // Keep service worker / manifest fresh while allowing app assets to be cached.
    'Cache-Control':
      filePath.endsWith('sw.js') || filePath.endsWith('manifest.webmanifest')
        ? 'no-cache'
        : 'public, max-age=31536000, immutable'
  });
  stream.pipe(res);
}

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error('[pwa-host] dist/index.html not found:', root);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const rawPath = req.url || '/';
  const candidate = safeJoin(root, rawPath);
  if (!candidate) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(candidate, (err, st) => {
    if (!err && st.isFile()) {
      sendFile(res, candidate);
      return;
    }

    // SPA fallback
    const fallback = path.join(root, 'index.html');
    fs.stat(fallback, (err2) => {
      if (err2) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
        return;
      }
      sendFile(res, fallback);
    });
  });
});

server.on('error', (err) => {
  console.error('[pwa-host] server error:', err && err.message ? err.message : err);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`[pwa-host] serving ${root} at http://${host}:${port}`);
});
