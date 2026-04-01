const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bundleServices = require('./bundleServices.cjs');
const licenseFileDecrypt = require('./licenseFileDecrypt.cjs');

// Chrome/Edge can attach to the renderer via chrome://inspect → Discover network targets (before app.ready).
const _rdp = String(process.env.ELECTRON_REMOTE_DEBUG_PORT ?? '').trim();
if (_rdp && /^\d+$/.test(_rdp)) {
  app.commandLine.appendSwitch('remote-debugging-port', _rdp);
}

try {
  // Unpackaged dev: frontend/.env next to the repo root (not inside asar).
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch {
  /* dotenv optional */
}

// Packaged installer: license keys are copied to resources/license.env at build time (see scripts/stage-license-env.cjs).
if (app.isPackaged) {
  try {
    const packagedEnv = path.join(process.resourcesPath, 'license.env');
    if (fs.existsSync(packagedEnv)) {
      require('dotenv').config({ path: packagedEnv, override: true });
    }
  } catch {
    /* ignore */
  }
}

// Match installer branding: userData → %APPDATA%\RES POS (license, DB, caches). Must run before getPath('userData').
app.setName('RES POS');

// Windows: Chromium often logs "Unable to move the cache: Access is denied" / GPU cache failures when
// the default cache dir is locked (AV, second instance, or rename races). Use a dedicated path and
// skip on-disk GPU shader cache (minor perf tradeoff).
if (process.platform === 'win32') {
  try {
    const userData = app.getPath('userData');
    const sessionData = path.join(userData, 'chromium-session');
    const diskCache = path.join(sessionData, 'disk-cache');
    app.setPath('sessionData', sessionData);
    fs.mkdirSync(sessionData, { recursive: true });
    fs.mkdirSync(diskCache, { recursive: true });
    app.commandLine.appendSwitch('disk-cache-dir', diskCache);
  } catch {
    /* ignore */
  }
  app.commandLine.appendSwitch('disable-http-cache');
  app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
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

function normalizeDeviceFp(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase();
}

/** License may store v2 (primary) or legacy v1 fingerprint — accept either. */
function deviceFingerprintMatches(licenseFp, primary, legacy) {
  const lic = normalizeDeviceFp(licenseFp);
  if (!lic) return false;
  if (lic === normalizeDeviceFp(primary)) return true;
  if (legacy != null && String(legacy).trim() !== '' && lic === normalizeDeviceFp(legacy)) return true;
  return false;
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
  const legacy =
    j.legacyDeviceFingerprint != null && String(j.legacyDeviceFingerprint).trim() !== ''
      ? String(j.legacyDeviceFingerprint).toLowerCase()
      : null;
  return {
    ok: true,
    deviceFingerprint: normalizeDeviceFp(j.deviceFingerprint),
    legacyDeviceFingerprint: legacy,
    motherboardUuid
  };
}

async function fetchDeviceFingerprint() {
  const r = await getDeviceFingerprintResult();
  if (!r.ok) throw new Error(r.error);
  /** Primary (v2) — sent to activation API and shown as Device ID. */
  return r.deviceFingerprint;
}

function extractBundleFromDecryptedPayload(obj) {
  if (!obj || typeof obj !== 'object') return null;
  const { licenseKey, license, signature } = obj;
  if (!licenseKey || !license || typeof license !== 'object' || typeof signature !== 'string' || !String(signature).trim()) {
    return null;
  }
  return { licenseKey, license, signature: String(signature).trim() };
}

/**
 * @param {object} payload - `{ base64 }` from encrypted/binary or JSON file, or legacy `{ licenseKey, license, signature }`
 */
function parseImportBundlePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('invalid_bundle');
  }
  if (payload.base64 && typeof payload.base64 === 'string') {
    let buf;
    try {
      buf = Buffer.from(payload.base64, 'base64');
    } catch {
      throw new Error('invalid_bundle');
    }
    if (licenseFileDecrypt.isEncryptedLicenseFile(buf)) {
      let decrypted;
      try {
        decrypted = licenseFileDecrypt.decryptLicenseFileBuffer(buf);
      } catch (e) {
        const code = e instanceof Error ? e.message : '';
        if (code === 'no_decryption_key') throw e;
        throw new Error('decryption_failed');
      }
      const bundle = extractBundleFromDecryptedPayload(decrypted);
      if (!bundle) throw new Error('invalid_bundle');
      return bundle;
    }
    const utf8 = buf.toString('utf8').trim();
    if (utf8.startsWith('{')) {
      let o;
      try {
        o = JSON.parse(utf8);
      } catch {
        throw new Error('invalid_bundle');
      }
      const bundle = extractBundleFromDecryptedPayload(o);
      if (!bundle) throw new Error('invalid_bundle');
      return bundle;
    }
    throw new Error('invalid_bundle');
  }
  const bundle = extractBundleFromDecryptedPayload(payload);
  if (!bundle) throw new Error('invalid_bundle');
  return bundle;
}

function verifyBundle(primaryFingerprint, legacyFingerprint, license, signatureB64, pem) {
  if (!license || !signatureB64 || !pem.includes('BEGIN')) return false;
  if (!deviceFingerprintMatches(license.deviceFingerprint, primaryFingerprint, legacyFingerprint)) return false;
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
    let fp;
    try {
      fp = await getDeviceFingerprintResult();
      if (!fp.ok) throw new Error(fp.error);
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
    const ok = verifyBundle(fp.deviceFingerprint, fp.legacyDeviceFingerprint, bundle.license, bundle.signature, pem);
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
    let fpForVerify;
    try {
      fpForVerify = await getDeviceFingerprintResult();
      if (!fpForVerify.ok) throw new Error(fpForVerify.error);
    } catch (e) {
      const code = e instanceof Error ? e.message : 'device_id_failed';
      return { ok: false, error: code, message: code };
    }
    const pem = pemFromEnv();
    if (
      pem.includes('BEGIN') &&
      !verifyBundle(fpForVerify.deviceFingerprint, fpForVerify.legacyDeviceFingerprint, bundle.license, bundle.signature, pem)
    ) {
      return { ok: false, error: 'bad_signature', message: 'License signature verification failed' };
    }
    await writeStoredBundle(bundle);
    broadcastToAll('pos-license:updated', {});
    return { ok: true };
  });

  /** Windows uses the first filter as the initial dropdown selection — All Files must be first. */
  ipcMain.handle('pos-license:pick-license-file', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    const parent = win && !win.isDestroyed() ? win : BrowserWindow.getFocusedWindow();
    const dialogOpts = {
      title: 'Open',
      properties: ['openFile'],
      filters: [
        { name: 'All Files', extensions: ['*'] },
      ]
    };
    const { canceled, filePaths } = parent
      ? await dialog.showOpenDialog(parent, dialogOpts)
      : await dialog.showOpenDialog(dialogOpts);
    if (canceled || !filePaths?.[0]) {
      return { canceled: true };
    }
    try {
      const buf = await fs.promises.readFile(filePaths[0]);
      return { canceled: false, base64: buf.toString('base64') };
    } catch (e) {
      return {
        canceled: false,
        error: 'read_failed',
        message: e instanceof Error ? e.message : 'Could not read file'
      };
    }
  });

  ipcMain.handle('pos-license:import-bundle', async (_evt, payload) => {
    let bundle;
    try {
      bundle = parseImportBundlePayload(payload);
    } catch (e) {
      const code = e instanceof Error ? e.message : 'invalid_bundle';
      if (code === 'no_decryption_key') {
        return {
          ok: false,
          error: 'no_decryption_key',
          message: 'LICENSE_FILE_ENCRYPTION_KEY / VITE_LICENSE_FILE_ENCRYPTION_KEY missing or invalid (must match license-server).'
        };
      }
      if (code === 'decryption_failed') {
        return {
          ok: false,
          error: 'decryption_failed',
          message: 'Could not decrypt license file (wrong key or corrupted file).'
        };
      }
      return { ok: false, error: 'invalid_bundle', message: 'Invalid license file' };
    }
    const { licenseKey: rawKey, license, signature } = bundle;
    const key = normalizeLicenseKey(rawKey);
    if (!key) {
      return { ok: false, error: 'invalid_bundle', message: 'Invalid license key in file' };
    }
    let fp;
    try {
      fp = await getDeviceFingerprintResult();
      if (!fp.ok) throw new Error(fp.error);
    } catch (e) {
      const code = e instanceof Error ? e.message : 'device_id_failed';
      return { ok: false, error: code, message: code };
    }
    const pem = pemFromEnv();
    if (!pem.includes('BEGIN')) {
      return { ok: false, error: 'no_public_key', message: 'License public key missing in app' };
    }
    const packed = { licenseKey: key, license, signature };
    if (!deviceFingerprintMatches(license.deviceFingerprint, fp.deviceFingerprint, fp.legacyDeviceFingerprint)) {
      return { ok: false, error: 'device_mismatch', message: 'This license file is for another device' };
    }
    if (!verifyBundle(fp.deviceFingerprint, fp.legacyDeviceFingerprint, license, signature, pem)) {
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
    title: 'RES POS',
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
  const svc = await bundleServices.maybeStartAndWait(app);
  if (app.isPackaged && !svc.started) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'RES POS',
      message: 'Built-in server files are missing.',
      detail:
        'Expected folder: resources\\embedded (backend, device, node-runtime). Rebuild the installer on Windows with:\n' +
        'npm run electron:build\n' +
        'so scripts/prepare-embedded.cjs can bundle Node and servers.'
    });
  } else if (app.isPackaged && svc.started && !svc.ready) {
    await dialog.showMessageBox({
      type: 'warning',
      title: 'RES POS',
      message: 'Local services did not start in time.',
      detail:
        'The app needs the built-in database (port 5000) and device agent (port 39471).\n\n' +
        '• Stop other apps or dev servers using those ports.\n' +
        '• Allow RES POS through Windows Firewall / antivirus.\n' +
        '• From Command Prompt run: set ELECTRON_SERVICE_LOG=1 then start RES POS to see errors.\n\n' +
        'Then restart RES POS.'
    });
  }
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
