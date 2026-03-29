import { canonicalStringify } from './licenseCanonicalStringify.js';

const STORAGE_KEY = 'pos_web_license_v1';

/** OPFS: fixed path for the encrypted license blob (per-origin, not the license-server DB). */
const OPFS_APP_DIR = 'pos-restaurant';
const OPFS_LICENSE_FILENAME = 'licenseKey';

export const POS_LICENSE_FILE_VERSION = 1;

/** Base URL of the standalone license API (no trailing slash). Empty = same-origin `/license/*` (Vite proxy in dev). */
export function getLicenseApiOrigin() {
  return (import.meta.env.VITE_LICENSE_API_URL || '').trim().replace(/\/$/, '');
}

function licenseApiUrl(path) {
  const origin = getLicenseApiOrigin();
  const p = path.startsWith('/') ? path : `/${path}`;
  if (origin) return `${origin}${p}`;
  return p;
}

function pemToSpkiArrayBuffer(pem) {
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/gi, '')
    .replace(/-----END PUBLIC KEY-----/gi, '')
    .replace(/\s/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function base64ToArrayBuffer(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function normalizeLicenseKey(raw) {
  const alnum = String(raw || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  if (alnum.length !== 12) return '';
  return `${alnum.slice(0, 4)}-${alnum.slice(4, 8)}-${alnum.slice(8, 12)}`;
}

/** Issuer download and POS import use this `format` value. */
export const POS_LICENSE_FILE_FORMAT = 'pos-restaurant-license';

/** Encrypted issuer file magic `PRFL` — keep in sync with `license-server/src/licenseFileCrypto.js`. */
const LICENSE_FILE_CRYPTO_MAGIC = new Uint8Array([0x50, 0x52, 0x46, 0x4c]);
const LICENSE_FILE_CRYPTO_V1 = 1;

function hexKeyToAes256Raw(hex) {
  const s = String(hex ?? '').trim();
  if (!/^[a-fA-F0-9]{64}$/.test(s)) return null;
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i += 1) {
    out[i] = parseInt(s.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function matchesMagicPrefix(bytes) {
  if (bytes.length < LICENSE_FILE_CRYPTO_MAGIC.length) return false;
  for (let i = 0; i < LICENSE_FILE_CRYPTO_MAGIC.length; i += 1) {
    if (bytes[i] !== LICENSE_FILE_CRYPTO_MAGIC[i]) return false;
  }
  return true;
}

/**
 * Decrypt issuer `licenseKey` file (AES-256-GCM). Same key as `LICENSE_FILE_ENCRYPTION_KEY` on license-server.
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Promise<string>} UTF-8 JSON plaintext
 */
export async function decryptLicenseKeyFileToUtf8(arrayBuffer) {
  const u8 = new Uint8Array(arrayBuffer);
  const minLen = 4 + 1 + 12 + 16;
  if (u8.length < minLen + 1) throw new Error('short');
  if (!matchesMagicPrefix(u8)) throw new Error('magic');
  if (u8[4] !== LICENSE_FILE_CRYPTO_V1) throw new Error('version');
  const iv = u8.subarray(5, 17);
  const tag = u8.subarray(-16);
  const ct = u8.subarray(17, -16);
  const combined = new Uint8Array(ct.length + tag.length);
  combined.set(ct, 0);
  combined.set(tag, ct.length);
  const hex = import.meta.env.VITE_LICENSE_FILE_ENCRYPTION_KEY;
  const raw = hexKeyToAes256Raw(hex);
  if (!raw) throw new Error('no_key');
  const key = await crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, combined);
  return new TextDecoder('utf-8').decode(plain);
}

/**
 * Same wire format as license-server encryption (PRFL | v1 | iv | ciphertext+tag).
 * @param {string} plaintextUtf8
 * @returns {Promise<ArrayBuffer>}
 */
export async function encryptLicenseUtf8ToPortableFile(plaintextUtf8) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const raw = hexKeyToAes256Raw(import.meta.env.VITE_LICENSE_FILE_ENCRYPTION_KEY);
  if (!raw) throw new Error('no_key');
  const key = await crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt']);
  const plain = new TextEncoder().encode(plaintextUtf8);
  const combined = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, key, plain)
  );
  const out = new Uint8Array(4 + 1 + 12 + combined.length);
  out.set(LICENSE_FILE_CRYPTO_MAGIC, 0);
  out[4] = LICENSE_FILE_CRYPTO_V1;
  out.set(iv, 5);
  out.set(combined, 17);
  return out.buffer;
}

/**
 * Decrypts issuer file or legacy plaintext JSON; returns key plus optional offline RSA bundle.
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Promise<
 *   | { ok: true, licenseKey: string, license?: object, signature?: string }
 *   | { ok: false, error: 'empty' | 'invalid' }
 * >}
 */
export async function parseLicenseImportFromArrayBuffer(arrayBuffer) {
  const u8 = new Uint8Array(arrayBuffer);
  let text;
  if (matchesMagicPrefix(u8)) {
    try {
      text = await decryptLicenseKeyFileToUtf8(arrayBuffer);
    } catch {
      return { ok: false, error: 'invalid' };
    }
  } else {
    text = new TextDecoder('utf-8', { fatal: false }).decode(u8);
  }
  const raw = String(text)
    .replace(/^\uFEFF/, '')
    .trim();
  if (!raw) return { ok: false, error: 'empty' };
  try {
    const o = JSON.parse(raw);
    if (!o || typeof o !== 'object') return { ok: false, error: 'invalid' };
    if (o.format && o.format !== POS_LICENSE_FILE_FORMAT) return { ok: false, error: 'invalid' };
    const fromJson = o.licenseKey ?? o.key;
    if (fromJson == null || !String(fromJson).trim()) return { ok: false, error: 'invalid' };
    const licenseKey = normalizeLicenseKey(fromJson);
    if (!licenseKey) return { ok: false, error: 'invalid' };
    const license = o.license;
    const signature = o.signature;
    if (license && typeof license === 'object' && signature != null && String(signature).trim()) {
      return { ok: true, licenseKey, license, signature: String(signature) };
    }
    return { ok: true, licenseKey };
  } catch {
    return { ok: false, error: 'invalid' };
  }
}

/**
 * Encrypted binary (issuer) or legacy JSON / plain-text key file.
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Promise<{ ok: true, licenseKey: string } | { ok: false, error: 'empty' | 'invalid' }>}
 */
export async function parseLicenseKeyFromFile(arrayBuffer) {
  const imp = await parseLicenseImportFromArrayBuffer(arrayBuffer);
  if (!imp.ok) return imp;
  return { ok: true, licenseKey: imp.licenseKey };
}

export async function saveWebLicenseFileToOpfs(arrayBuffer) {
  if (typeof navigator === 'undefined' || !navigator.storage?.getDirectory) return false;
  try {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle(OPFS_APP_DIR, { create: true });
    const fh = await dir.getFileHandle(OPFS_LICENSE_FILENAME, { create: true });
    const w = await fh.createWritable();
    await w.write(arrayBuffer);
    await w.close();
    return true;
  } catch {
    return false;
  }
}

/** @returns {Promise<ArrayBuffer | null>} */
export async function loadWebLicenseFileFromOpfs() {
  if (typeof navigator === 'undefined' || !navigator.storage?.getDirectory) return null;
  try {
    const root = await navigator.storage.getDirectory();
    let dir;
    try {
      dir = await root.getDirectoryHandle(OPFS_APP_DIR);
    } catch {
      return null;
    }
    let fh;
    try {
      fh = await dir.getFileHandle(OPFS_LICENSE_FILENAME);
    } catch {
      return null;
    }
    const file = await fh.getFile();
    return await file.arrayBuffer();
  } catch {
    return null;
  }
}

export async function clearWebLicenseFileFromOpfs() {
  if (typeof navigator === 'undefined' || !navigator.storage?.getDirectory) return;
  try {
    const root = await navigator.storage.getDirectory();
    await root.removeEntry(OPFS_APP_DIR, { recursive: true });
  } catch {
    /* ignore */
  }
}

/**
 * Read license key from a file: JSON from the issuer app or plain text containing the key.
 * @returns {{ ok: true, licenseKey: string } | { ok: false, error: 'empty' | 'invalid' }}
 */
export function parseLicenseKeyFromFileText(text) {
  const raw = String(text ?? '')
    .replace(/^\uFEFF/, '')
    .trim();
  if (!raw) return { ok: false, error: 'empty' };

  try {
    const o = JSON.parse(raw);
    if (o && typeof o === 'object') {
      const fromJson = o.licenseKey ?? o.key;
      if (fromJson != null && String(fromJson).trim()) {
        if (!o.format || o.format === POS_LICENSE_FILE_FORMAT) {
          const k = normalizeLicenseKey(fromJson);
          if (k) return { ok: true, licenseKey: k };
        }
      }
    }
  } catch {
    /* try plain-text patterns */
  }

  const firstLine = raw.split(/\r?\n/).find((l) => String(l).trim()) ?? raw;
  const dashed = firstLine.match(/\b([A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4})\b/i);
  if (dashed) {
    const k = normalizeLicenseKey(dashed[1]);
    if (k) return { ok: true, licenseKey: k };
  }

  const alnum = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (alnum.length >= 12) {
    const k = normalizeLicenseKey(alnum.slice(0, 12));
    if (k) return { ok: true, licenseKey: k };
  }

  return { ok: false, error: 'invalid' };
}

export function loadStoredWebLicense() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (!o?.licenseKey || !o?.license || !o?.signature) return null;
    return o;
  } catch {
    return null;
  }
}

export function saveStoredWebLicense(bundle) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
  } catch {
    /* ignore */
  }
}

export function clearStoredWebLicense() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Clears localStorage bundle and OPFS license file. */
export async function clearAllWebLicensePersistence() {
  clearStoredWebLicense();
  await clearWebLicenseFileFromOpfs();
}

async function tryWindowDeviceFingerprintHook() {
  if (typeof window === 'undefined') return null;
  const hook = window.posDeviceFingerprint;
  if (hook == null) return null;
  try {
    const v = typeof hook === 'function' ? await hook() : await Promise.resolve(hook);
    const s = String(v ?? '')
      .trim()
      .toLowerCase();
    if (/^[a-f0-9]{64}$/.test(s)) return s;
  } catch {
    /* ignore */
  }
  return null;
}

function resolveLocalDeviceAgentDeviceIdUrl() {
  const raw = import.meta.env.VITE_DEVICE_AGENT_URL;
  if (raw != null && String(raw).trim()) {
    const base = String(raw).trim().replace(/\/$/, '');
    return `${base}/device-id`;
  }
  return '/device-agent/device-id';
}

/**
 * Fingerprint for the machine where the browser runs: local device agent (motherboard / system DMI)
 * or optional `window.posDeviceFingerprint` (e.g. native shell). Not the remote POS API server.
 */
export async function fetchDeviceFingerprint() {
  const fromNative = await tryWindowDeviceFingerprintHook();
  if (fromNative) return fromNative;

  const url = resolveLocalDeviceAgentDeviceIdUrl();
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error('agent_unreachable');
  }
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.ok || !j.deviceFingerprint) {
    if (j.error === 'no_hardware_identifiers') {
      throw new Error('no_hardware_identifiers');
    }
    throw new Error('device_id_failed');
  }
  return String(j.deviceFingerprint).toLowerCase();
}

/**
 * @param {{ licenseKey: string, license: object, signature: string }} bundle
 * @param {string} deviceFingerprint
 * @param {string} publicKeyPem
 */
export async function verifyWebLicenseBundle(bundle, deviceFingerprint, publicKeyPem) {
  const pem = String(publicKeyPem || '').trim();
  if (!pem.includes('BEGIN')) return false;
  const { license, signature } = bundle;
  if (!license || !signature) return false;
  if (license.deviceFingerprint !== deviceFingerprint) return false;
  if (new Date(license.expiresAt).getTime() < Date.now()) return false;

  try {
    const key = await crypto.subtle.importKey(
      'spki',
      pemToSpkiArrayBuffer(pem),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const payload = new TextEncoder().encode(canonicalStringify(license));
    const sigBuf = base64ToArrayBuffer(signature);
    return crypto.subtle.verify({ name: 'RSASSA-PKCS1-v1_5' }, key, sigBuf, payload);
  } catch {
    return false;
  }
}

export async function activateWebLicense(licenseKey, deviceFingerprint) {
  const key = normalizeLicenseKey(licenseKey);
  if (!key) return { ok: false, error: { error: 'invalid_key' } };
  const res = await fetch(licenseApiUrl('/license/activate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ licenseKey: key, deviceFingerprint })
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.ok) return { ok: false, error: j };
  return { ok: true, license: j.license, signature: j.signature, licenseKey: key };
}
