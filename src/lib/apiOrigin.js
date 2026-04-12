/**
 * REST API base path (no trailing slash).
 * - Browser + Vite dev: default `/api` (proxied to backend in vite.config.js).
 * - File-like protocol: uses saved backend host or `localhost` in the built origin (see `POS_BACKEND_ORIGIN`).
 * Override with VITE_API_URL (e.g. http://localhost:5000/api).
 */
const trimmed = (v) => String(v ?? '').trim();
const BACKEND_SETTINGS_STORAGE_KEY = 'pos_backend_settings';
const DEFAULT_BACKEND_PORT = '5000';

/** IPv4 dotted-decimal (for matching page hostname to “this PC on LAN”). */
const IPV4_RE = /^(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;

export function isPosBackendIpLoopback(ip) {
  const h = trimmed(ip).toLowerCase();
  return h === '127.0.0.1' || h === 'localhost' || h === '::1';
}

/**
 * When the kiosk is opened as http://<LAN-IPv4>:port/, that host is this machine’s LAN address.
 * Never use 127.0.0.1 / localhost here — those are not valid “backend IP” defaults for your case.
 */
export function getSuggestedBackendIp() {
  if (typeof window === 'undefined') return '';
  const h = trimmed(window.location.hostname);
  if (!h || isPosBackendIpLoopback(h)) return '';
  if (!IPV4_RE.test(h)) return '';
  return h;
}

function normalizeBackendSettings(value) {
  const ip = trimmed(value?.ip);
  const port = trimmed(value?.port);
  const portNumber = Number(port);
  if (!ip) return null;
  if (isPosBackendIpLoopback(ip)) return null;
  if (!/^\d{1,5}$/.test(port)) return null;
  if (!Number.isInteger(portNumber) || portNumber < 1 || portNumber > 65535) return null;
  return { ip, port: String(portNumber) };
}

/** Returns `{ ip, port }` or `null` if invalid (for connect UI before save). */
export function parsePosBackendSettings(value) {
  return normalizeBackendSettings(value);
}

export function readPosBackendSettings() {
  const suggested = typeof window !== 'undefined' ? getSuggestedBackendIp() : '';
  const fallback = { ip: suggested, port: DEFAULT_BACKEND_PORT };
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = window.localStorage.getItem(BACKEND_SETTINGS_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const normalized = normalizeBackendSettings(parsed);
    return normalized || fallback;
  } catch {
    return fallback;
  }
}

export function savePosBackendSettings(value) {
  const normalized = normalizeBackendSettings(value);
  if (!normalized || typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(BACKEND_SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
    return true;
  } catch {
    return false;
  }
}

/** HTTP origin of the POS backend (Socket.IO, file:// fallback). */
export const POS_BACKEND_ORIGIN = (() => {
  const { ip, port } = readPosBackendSettings();
  const host = trimmed(ip) || getSuggestedBackendIp() || 'localhost';
  return `http://${host}:${port}`;
})();

const fromEnv = trimmed(import.meta.env?.VITE_API_URL);

function isFileOrCustomPageProtocol() {
  if (typeof window === 'undefined') return false;
  const p = window.location?.protocol;
  return p === 'file:' || p === 'app:';
}

function isLocalhostWebApp() {
  if (typeof window === 'undefined') return false;
  const h = String(window.location?.hostname || '').toLowerCase();
  return h === 'localhost' || h === '127.0.0.1';
}

export const POS_API_PREFIX = (() => {
  if (fromEnv !== '') return fromEnv.replace(/\/$/, '');
  if (isFileOrCustomPageProtocol()) return `${POS_BACKEND_ORIGIN}/api`;
  // Local PWA host (e.g. 4173) is not Vite dev proxy, so call backend directly.
  if (isLocalhostWebApp() && window.location.port !== '5173') return `${POS_BACKEND_ORIGIN}/api`;
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
  if (isLocalhostWebApp() && window.location.port !== '5173') return POS_BACKEND_ORIGIN;
  return window.location.origin;
})();
