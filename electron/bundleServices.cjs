/**
 * Starts POS backend + device agent next to the app (dev: repo folders; packaged: resources/embedded).
 * Packaged build: run `node scripts/prepare-embedded.cjs` before electron-builder (see package.json).
 */
const { spawn, execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const spawned = [];

function projectRoot() {
  return path.join(__dirname, '..');
}

function embeddedRoot(app) {
  if (app?.isPackaged && process.resourcesPath) {
    return path.join(process.resourcesPath, 'embedded');
  }
  return null;
}

function resolveDeviceDir(app) {
  const emb = embeddedRoot(app);
  if (emb) {
    const p = path.join(emb, 'device');
    if (fs.existsSync(path.join(p, 'server.mjs'))) return p;
  }
  const root = projectRoot();
  const embedded = path.join(root, 'device', 'server.mjs');
  if (fs.existsSync(embedded)) return path.join(root, 'device');
  const sibling = path.join(root, '..', 'device-agent', 'server.mjs');
  if (fs.existsSync(sibling)) return path.join(root, '..', 'device-agent');
  return null;
}

function resolveBackendDir(app) {
  const emb = embeddedRoot(app);
  if (emb) {
    const p = path.join(emb, 'backend');
    if (fs.existsSync(path.join(p, 'server.js'))) return p;
  }
  const root = projectRoot();
  const dir = path.join(root, 'backend');
  if (fs.existsSync(path.join(dir, 'server.js'))) return dir;
  return null;
}

/** Node to run backend/device: bundled win node.exe, or system `node`, or POS_NODE_PATH. */
function resolveNodeExecutable(app) {
  if (process.env.POS_NODE_PATH && fs.existsSync(process.env.POS_NODE_PATH)) {
    return process.env.POS_NODE_PATH;
  }
  const emb = embeddedRoot(app);
  if (emb) {
    const winNode = path.join(emb, 'node-runtime', 'node.exe');
    if (process.platform === 'win32' && fs.existsSync(winNode)) return winNode;
  }
  return 'node';
}

/** Per-user SQLite for packaged app (same paths as backendDataEnv). */
function packagedBackendPaths(app) {
  const dataDir = path.join(app.getPath('userData'), 'pos-backend-data');
  fs.mkdirSync(dataDir, { recursive: true });
  const dbFile = path.join(dataDir, 'dev.db');
  const databaseUrl = `file:${dbFile.replace(/\\/g, '/')}`;
  return { dataDir, dbFile, databaseUrl };
}

function backendDataEnv(app) {
  if (!app?.isPackaged) return {};
  return { DATABASE_URL: packagedBackendPaths(app).databaseUrl };
}

function runPrismaDbPush(nodeExe, backendDir, extraEnv) {
  const cli = path.join(backendDir, 'node_modules', 'prisma', 'build', 'index.js');
  if (!fs.existsSync(cli)) return;
  try {
    execFileSync(nodeExe, [cli, 'db', 'push', '--skip-generate'], {
      cwd: backendDir,
      env: { ...process.env, ...extraEnv },
      stdio: 'ignore',
      windowsHide: true
    });
  } catch {
    /* schema may already match */
  }
}

/** Same as `npm run seed` in backend — only for packaged first-time DB (seed wipes then recreates defaults). */
function runPackagedSeed(nodeExe, backendDir, extraEnv, app) {
  const seedScript = path.join(backendDir, 'prisma', 'seed.js');
  if (!fs.existsSync(seedScript)) {
    console.warn('[electron] prisma/seed.js not found — skipping seed.');
    return;
  }
  const logServices = process.env.ELECTRON_SERVICE_LOG === '1';
  try {
    execFileSync(nodeExe, [seedScript], {
      cwd: backendDir,
      env: buildChildEnv(app, extraEnv),
      stdio: logServices ? 'inherit' : 'ignore',
      windowsHide: true
    });
    console.log('[electron] Database seeded (new local DB, same as npm run seed).');
  } catch (e) {
    console.error('[electron] prisma seed failed:', e instanceof Error ? e.message : e);
  }
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
  return true;
}

/** Windows: prepend bundled node-runtime to PATH so native addons (e.g. serialport) resolve MSVC/CRT DLLs. */
function buildChildEnv(app, extraEnv = {}) {
  const env = { ...process.env, ...extraEnv };
  if (app?.isPackaged && process.platform === 'win32') {
    const emb = embeddedRoot(app);
    if (emb) {
      const nodeDir = path.join(emb, 'node-runtime');
      const nodeExePath = path.join(nodeDir, 'node.exe');
      if (fs.existsSync(nodeExePath)) {
        const prev = env.PATH || env.Path || '';
        const prefix = `${nodeDir}${path.delimiter}`;
        env.PATH = `${prefix}${prev}`;
        env.Path = env.PATH;
      }
    }
  }
  return env;
}

function spawnService(name, nodeExe, cwd, args, app, extraEnv = {}) {
  const logServices = process.env.ELECTRON_SERVICE_LOG === '1';
  const child = spawn(nodeExe, args, {
    cwd,
    env: buildChildEnv(app, extraEnv),
    stdio: logServices ? 'inherit' : 'ignore',
    windowsHide: true
  });
  child.on('error', (err) => {
    console.error(`[electron] ${name} failed to spawn (${nodeExe}):`, err.message);
  });
  child.on('exit', (code, signal) => {
    if (code !== null && code !== 0) {
      console.error(`[electron] ${name} exited with code ${code}${signal ? ` signal ${signal}` : ''}`);
    }
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

  const backendDir = resolveBackendDir(app);
  const deviceDir = resolveDeviceDir(app);
  if (!backendDir || !deviceDir) {
    const emb = embeddedRoot(app);
    console.warn('[electron] Embedded servers skipped: backend or device folder not found.', {
      resourcesPath: process.resourcesPath,
      embeddedRoot: emb,
      backendDir,
      deviceDir
    });
    return { started: false, ready: false };
  }

  const nodeExe = resolveNodeExecutable(app);
  const backendEnv = backendDataEnv(app);

  if (app.isPackaged) {
    console.log('[electron] Starting embedded services', {
      nodeExe,
      backendDir,
      deviceDir,
      backendOrigin: backendOrigin(),
      deviceOrigin: deviceOrigin()
    });
  }

  if (app.isPackaged && Object.keys(backendEnv).length) {
    const { dbFile } = packagedBackendPaths(app);
    const hadDbBefore = fs.existsSync(dbFile);
    runPrismaDbPush(nodeExe, backendDir, backendEnv);
    if (!hadDbBefore) {
      runPackagedSeed(nodeExe, backendDir, backendEnv, app);
    }
  }

  if (nodeExe !== 'node' && !fs.existsSync(nodeExe)) {
    console.error('[electron] Bundled Node not found at', nodeExe, '- install Node.js or rebuild with embedded node-runtime.');
  }

  spawnService('backend', nodeExe, backendDir, ['server.js'], app, backendEnv);
  spawnService('device-agent', nodeExe, deviceDir, ['server.mjs'], app, {});

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
