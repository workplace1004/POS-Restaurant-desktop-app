/**
 * HTTP origin for the POS backend (Express + Socket.IO). Empty in the browser means same origin.
 * Electron loads the UI from file:// — set VITE_API_ORIGIN (e.g. http://127.0.0.1:5000) or rely on
 * the file:// fallback below when the backend runs on the default port.
 */
function defaultOriginForFileProtocol() {
  if (typeof window === 'undefined') return '';
  try {
    if (window.location.protocol === 'file:') return 'http://127.0.0.1:5000';
  } catch {
    /* ignore */
  }
  return '';
}

const fromEnv = String(import.meta.env.VITE_API_ORIGIN ?? '')
  .trim()
  .replace(/\/$/, '');

/** @returns {string} Origin without trailing slash, or '' for same-origin. */
export function getPosBackendOrigin() {
  if (fromEnv) return fromEnv;
  return defaultOriginForFileProtocol();
}

/** `/api` or `http://host:port/api` for standalone / Electron. */
export const POS_API_PREFIX = getPosBackendOrigin() ? `${getPosBackendOrigin()}/api` : '/api';

/** Origin URL for socket.io-client (no path). */
export function getSocketIoUrl() {
  const o = getPosBackendOrigin();
  if (o) return o;
  if (typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('file')) {
    return window.location.origin;
  }
  return defaultOriginForFileProtocol() || (typeof window !== 'undefined' ? window.location.origin : '');
}
