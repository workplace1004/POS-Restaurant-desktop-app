/**
 * When running Electron from the repo (unpackaged), start POS backend + local device agent
 * unless ELECTRON_NO_EMBEDDED_SERVERS=1. Packaged installers skip this (no server sources).
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const spawned = [];

function projectRoot() {
  return path.join(__dirname, '..');
}

function resolveDeviceDir() {
  const root = projectRoot();
  const embedded = path.join(root, 'device', 'server.mjs');
  if (fs.existsSync(embedded)) return path.join(root, 'device');
  const sibling = path.join(root, '..', 'device-agent', 'server.mjs');
  if (fs.existsSync(sibling)) return path.join(root, '..', 'device-agent');
  return null;
}

function resolveBackendDir() {
  const root = projectRoot();
  const dir = path.join(root, 'backend');
  if (fs.existsSync(path.join(dir, 'server.js'))) return dir;
  return null;
}

function nodeExecutable() {
  return process.env.POS_NODE_PATH || 'node';
}

function backendOrigin() {
  const p = Number(process.env.PORT || 5000);
  return `http://127.0.0.1:${p}`;
}

function deviceOrigin() {
  const p = Number(process.env.DEVICE_AGENT_PORT || 39471);
  return `http://127.0.0.1:${p}`;
}

function shouldAutoStart(app) {
  if (process.env.ELECTRON_NO_EMBEDDED_SERVERS === '1') return false;
  if (app.isPackaged && process.env.ELECTRON_FORCE_EMBEDDED_SERVERS !== '1') return false;
  return true;
}

function spawnService(name, cwd, args) {
  const child = spawn(nodeExecutable(), args, {
    cwd,
    env: { ...process.env },
    stdio: process.env.ELECTRON_SERVICE_LOG === '1' ? 'inherit' : 'ignore',
    windowsHide: true
  });
  child.on('error', (err) => {
    console.error(`[electron] ${name} failed to start:`, err.message);
  });
  spawned.push({ name, child });
  return child;
}

function killSpawnedProcesses() {
  while (spawned.length) {
    const { child } = spawned.pop();
    if (!child?.pid) continue;
    try {
      if (process.platform === 'win32') {
        const { execFileSync } = require('child_process');
        execFileSync('taskkill', ['/pid', String(child.pid), '/f', '/t'], { stdio: 'ignore' });
      } else {
        child.kill('SIGTERM');
      }
    } catch {
      /* ignore */
    }
  }
}

async function backendReady() {
  try {
    const r = await fetch(`${backendOrigin()}/api/health`, { signal: AbortSignal.timeout(2500) });
    const j = await r.json().catch(() => ({}));
    return r.ok && j.ok === true;
  } catch {
    return false;
  }
}

async function deviceReady() {
  try {
    const r = await fetch(`${deviceOrigin()}/device-id`, { signal: AbortSignal.timeout(8000) });
    const j = await r.json().catch(() => ({}));
    return r.ok && j.ok === true && typeof j.deviceFingerprint === 'string';
  } catch {
    return false;
  }
}

async function waitForServices(timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const [b, d] = await Promise.all([backendReady(), deviceReady()]);
    if (b && d) return true;
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

/**
 * @param {import('electron').App} app
 * @returns {Promise<{ started: boolean, ready: boolean }>}
 */
async function maybeStartAndWait(app) {
  if (!shouldAutoStart(app)) {
    return { started: false, ready: false };
  }

  const backendDir = resolveBackendDir();
  const deviceDir = resolveDeviceDir();
  if (!backendDir || !deviceDir) {
    console.warn(
      '[electron] Embedded servers skipped: backend or device folder not found next to the app.'
    );
    return { started: false, ready: false };
  }

  spawnService('backend', backendDir, ['server.js']);
  spawnService('device-agent', deviceDir, ['server.mjs']);

  const timeoutMs = Number(process.env.ELECTRON_SERVICES_WAIT_MS || 120000);
  const ready = await waitForServices(timeoutMs);
  if (!ready) {
    console.error(
      '[electron] Timed out waiting for backend (%s) and device agent (%s).',
      backendOrigin(),
      deviceOrigin()
    );
  }
  return { started: true, ready };
}

module.exports = {
  maybeStartAndWait,
  stopBundledServices: killSpawnedProcesses,
  backendOrigin,
  deviceOrigin
};
