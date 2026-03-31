/**
 * REST API base path (no trailing slash).
 * - Browser + Vite dev: default `/api` (proxied to backend in vite.config.js).
 * - Electron packaged (file://): `http://127.0.0.1:5000/api` so fetch reaches the local backend.
 * Override with VITE_API_URL (e.g. http://localhost:5000/api).
 */
const trimmed = (v) => String(v ?? '').trim();

/** HTTP origin of the POS backend (Socket.IO, file:// fallback). */
export const POS_BACKEND_ORIGIN = 'http://127.0.0.1:5000';

const fromEnv = trimmed(import.meta.env?.VITE_API_URL);

function isFileOrCustomPageProtocol() {
  if (typeof window === 'undefined') return false;
  const p = window.location?.protocol;
  return p === 'file:' || p === 'app:' || p === 'electron:';
}

export const POS_API_PREFIX = (() => {
  if (fromEnv !== '') return fromEnv.replace(/\/$/, '');
  if (isFileOrCustomPageProtocol()) return `${POS_BACKEND_ORIGIN}/api`;
  return '/api';
})();

/**
 * Origin for socket.io-client. Under Vite, same host proxies /socket.io; file:// must use the backend host.
 */
export const POS_SOCKET_ORIGIN = (() => {
  if (typeof window === 'undefined') return '';
  if (fromEnv !== '') {
    try {
      return new URL(fromEnv.replace(/\/$/, '')).origin;
    } catch {
      return POS_BACKEND_ORIGIN;
    }
  }
  if (isFileOrCustomPageProtocol()) return POS_BACKEND_ORIGIN;
  return window.location.origin;
})();
