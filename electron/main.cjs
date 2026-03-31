const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bundleServices = require('./bundleServices.cjs');

// Chrome/Edge can attach to the renderer via chrome://inspect → Discover network targets (before app.ready).
const _rdp = String(process.env.ELECTRON_REMOTE_DEBUG_PORT ?? '').trim();
if (_rdp && /^\d+$/.test(_rdp)) {
  app.commandLine.appendSwitch('remote-debugging-port', _rdp);
}

try {
  // Optional: reuse frontend/.env for VITE_* in main (license + device agent).
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch {
  /* dotenv optional */
}

const LICENSE_STORE = () => path.join(app.getPath('userData'), 'pos-electron-license.json');

function canonicalStringify(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((v) => canonicalStringify(v)).join(',')}]`;
  }
  const keys = Object.keys(value).sort();
  const parts = keys.map((k) => `${JSON.stringify(k)}:${canonicalStringify(value[k])}`);
  return `{${parts.join(',')}}`;
}

function normalizeLicenseKey(raw) {
  const alnum = String(raw || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  if (alnum.length !== 12) return '';
  return `${alnum.slice(0, 4)}-${alnum.slice(4, 8)}-${alnum.slice(8, 12)}`;
}

function pemFromEnv() {
  const raw = process.env.VITE_LICENSE_RSA_PUBLIC_KEY_PEM;
  if (raw == null || !String(raw).trim()) return '';
  return String(raw).replace(/\\n/g, '\n').trim();
}

function licenseApiOrigin() {
  const o = String(process.env.VITE_LICENSE_API_URL ?? '')
    .trim()
    .replace(/\/$/, '');
  if (o) return o;
  return 'http://127.0.0.1:5050';
}

function deviceAgentBase() {
  const o = String(process.env.VITE_DEVICE_AGENT_URL ?? '')
    .trim()
    .replace(/\/$/, '');
  if (o) return o;
  return 'http://127.0.0.1:39471';
}

async function getDeviceFingerprintResult() {
  let res;
  try {
    res = await fetch(`${deviceAgentBase()}/device-id`);
  } catch {
    return { ok: false, error: 'agent_unreachable' };
  }
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.ok || !j.deviceFingerprint) {
    if (j.error === 'no_hardware_identifiers') return { ok: false, error: 'no_hardware_identifiers' };
    return { ok: false, error: 'device_id_failed' };
  }
  const motherboardUuid =
    j.motherboardUuid != null && String(j.motherboardUuid).trim() !== ''
      ? String(j.motherboardUuid).trim()
      : null;
  return {
    ok: true,
    deviceFingerprint: String(j.deviceFingerprint).toLowerCase(),
    motherboardUuid
  };
}

async function fetchDeviceFingerprint() {
  const r = await getDeviceFingerprintResult();
  if (!r.ok) throw new Error(r.error);
  return r.deviceFingerprint;
}

function verifyBundle(deviceFingerprint, license, signatureB64, pem) {
  if (!license || !signatureB64 || !pem.includes('BEGIN')) return false;
  if (String(license.deviceFingerprint || '').toLowerCase() !== deviceFingerprint) return false;
  if (new Date(license.expiresAt).getTime() < Date.now()) return false;
  try {
    const v = crypto.createVerify('RSA-SHA256');
    v.update(Buffer.from(canonicalStringify(license), 'utf8'));
    v.end();
    return v.verify(pem, signatureB64, 'base64');
  } catch {
    return false;
  }
}

async function readStoredBundle() {
  const p = LICENSE_STORE();
  try {
    const raw = await fs.promises.readFile(p, 'utf8');
    const o = JSON.parse(raw);
    if (o?.licenseKey && o?.license && o?.signature) return o;
  } catch {
    /* ignore */
  }
  return null;
}

async function writeStoredBundle(bundle) {
  await fs.promises.writeFile(LICENSE_STORE(), JSON.stringify(bundle, null, 2), 'utf8');
}

function broadcastToAll(channel, payload) {
  BrowserWindow.getAllWindows().forEach((w) => {
    if (!w.isDestroyed()) w.webContents.send(channel, payload);
  });
}

let licenseIpcRegistered = false;
function registerLicenseIpc() {
  if (licenseIpcRegistered) return;
  licenseIpcRegistered = true;
  ipcMain.handle('pos-license:license-store-path', () => LICENSE_STORE());
  ipcMain.handle('pos-license:device-fingerprint', () => getDeviceFingerprintResult());
  ipcMain.handle('pos-license:status', async () => {
    const pem = pemFromEnv();
    if (!pem.includes('BEGIN')) {
      return { valid: false, reason: 'no_public_key', expiresAt: null, email: null };
    }
    let deviceFingerprint;
    try {
      deviceFingerprint = await fetchDeviceFingerprint();
    } catch (e) {
      return {
        valid: false,
        reason: e instanceof Error ? e.message : 'device_id_failed',
        expiresAt: null,
        email: null
      };
    }
    const bundle = await readStoredBundle();
    if (!bundle) {
      return { valid: false, reason: 'no_license', expiresAt: null, email: null };
    }
    const ok = verifyBundle(deviceFingerprint, bundle.license, bundle.signature, pem);
    if (!ok) {
      return { valid: false, reason: 'invalid_or_expired', expiresAt: null, email: null };
    }
    return {
      valid: true,
      reason: 'ok',
      expiresAt: bundle.license.expiresAt ?? null,
      email: bundle.license.email ?? null
    };
  });

  ipcMain.handle('pos-license:activate', async (_evt, licenseKeyRaw) => {
    const key = normalizeLicenseKey(licenseKeyRaw);
    if (!key) return { ok: false, error: 'invalid_key', message: 'Invalid license key' };
    let deviceFingerprint;
    try {
      deviceFingerprint = await fetchDeviceFingerprint();
    } catch (e) {
      const code = e instanceof Error ? e.message : 'device_id_failed';
      return { ok: false, error: code, message: code };
    }
    const origin = licenseApiOrigin();
    const res = await fetch(`${origin}/license/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey: key, deviceFingerprint })
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok || !j.ok) {
      const err = j.error || j.message || 'activation_failed';
      return {
        ok: false,
        error: typeof err === 'string' ? err : 'activation_failed',
        message: typeof j.message === 'string' ? j.message : undefined
      };
    }
    const bundle = {
      licenseKey: key,
      license: j.license,
      signature: j.signature
    };
    const pem = pemFromEnv();
    if (pem.includes('BEGIN') && !verifyBundle(deviceFingerprint, bundle.license, bundle.signature, pem)) {
      return { ok: false, error: 'bad_signature', message: 'License signature verification failed' };
    }
    await writeStoredBundle(bundle);
    broadcastToAll('pos-license:updated', {});
    return { ok: true };
  });

  ipcMain.handle('pos-license:import-bundle', async (_evt, bundle) => {
    if (!bundle || typeof bundle !== 'object') {
      return { ok: false, error: 'invalid_bundle', message: 'Invalid license file' };
    }
    const { licenseKey: rawKey, license, signature } = bundle;
    if (!license || typeof license !== 'object' || typeof signature !== 'string' || !signature.trim()) {
      return { ok: false, error: 'invalid_bundle', message: 'Invalid license file' };
    }
    const key = normalizeLicenseKey(rawKey);
    if (!key) {
      return { ok: false, error: 'invalid_bundle', message: 'Invalid license key in file' };
    }
    let deviceFingerprint;
    try {
      deviceFingerprint = await fetchDeviceFingerprint();
    } catch (e) {
      const code = e instanceof Error ? e.message : 'device_id_failed';
      return { ok: false, error: code, message: code };
    }
    const pem = pemFromEnv();
    if (!pem.includes('BEGIN')) {
      return { ok: false, error: 'no_public_key', message: 'License public key missing in app' };
    }
    const packed = { licenseKey: key, license, signature };
    if (String(license.deviceFingerprint || '').toLowerCase() !== deviceFingerprint) {
      return { ok: false, error: 'device_mismatch', message: 'This license file is for another device' };
    }
    if (!verifyBundle(deviceFingerprint, license, signature, pem)) {
      return {
        ok: false,
        error: 'bad_signature',
        message: 'License signature verification failed'
      };
    }
    await writeStoredBundle(packed);
    broadcastToAll('pos-license:updated', {});
    return { ok: true };
  });

  ipcMain.handle('pos-license:remove', async () => {
    const p = LICENSE_STORE();
    try {
      await fs.promises.unlink(p);
    } catch (e) {
      if (e && e.code === 'ENOENT') {
        broadcastToAll('pos-license:updated', {});
        return { ok: true };
      }
      return { ok: false, error: 'unlink_failed', message: e instanceof Error ? e.message : 'Failed to remove license file' };
    }
    broadcastToAll('pos-license:updated', {});
    return { ok: true };
  });
}

function shouldOpenDevToolsOnStart() {
  return (
    process.env.ELECTRON_OPEN_DEVTOOLS === '1' || process.env.ELECTRON_USE_DEV_SERVER === '1'
  );
}

/** F12 and Ctrl+Shift+I (Cmd+Alt+I on macOS) toggle Chromium DevTools for the focused window. */
function registerDevToolsShortcuts(win) {
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;
    const key = input.key;
    if (key === 'F12') {
      event.preventDefault();
      win.webContents.toggleDevTools();
      return;
    }
    const isI = key === 'i' || key === 'I';
    if (isI && input.control && input.shift) {
      event.preventDefault();
      win.webContents.toggleDevTools();
      return;
    }
    if (process.platform === 'darwin' && isI && input.meta && input.alt) {
      event.preventDefault();
      win.webContents.toggleDevTools();
    }
  });
}

async function createWindow() {
  // 1024×768 = web *content* (HTML viewport). Title bar / menu are NOT inside this size (total window is larger).
  // Without useContentSize, width/height would be the outer frame and the page would be smaller than 1024×768.
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    useContentSize: true,
    resizable: false,
    maximizable: false,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  registerDevToolsShortcuts(win);

  if (process.env.ELECTRON_USE_DEV_SERVER !== '1') {
    Menu.setApplicationMenu(null);
  }

  if (process.env.ELECTRON_USE_DEV_SERVER === '1') {
    await win.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5173');
  } else {
    await win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  if (shouldOpenDevToolsOnStart()) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(async () => {
  registerLicenseIpc();
  await bundleServices.maybeStartAndWait(app);
  await createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('before-quit', () => {
  bundleServices.stopBundledServices();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
