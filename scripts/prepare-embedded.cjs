/**
 * Stages backend + device + Windows Node runtime for electron-builder extraResources.
 * Run before `electron-builder` (see package.json electron:build).
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFileSync, execSync } = require('child_process');

const root = path.join(__dirname, '..');
const staging = path.join(root, 'embedded-staging');
const NODE_WIN_VERSION = process.env.EMBEDDED_NODE_VERSION || 'v20.18.0';

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function copyTree(src, dest, { skip = [] } = {}) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (skip.includes(name)) continue;
    const from = path.join(src, name);
    const to = path.join(dest, name);
    const st = fs.statSync(from);
    if (st.isDirectory()) copyTree(from, to, { skip });
    else fs.copyFileSync(from, to);
  }
}

function downloadFile(url, destFile) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destFile);
    https
      .get(url, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          file.close();
          try {
            fs.unlinkSync(destFile);
          } catch {
            /* ignore */
          }
          downloadFile(res.headers.location, destFile).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          try {
            fs.unlinkSync(destFile);
          } catch {
            /* ignore */
          }
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve()));
      })
      .on('error', (err) => {
        try {
          fs.unlinkSync(destFile);
        } catch {
          /* ignore */
        }
        reject(err);
      });
  });
}

async function ensureWindowsNodeRuntime(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
  const zipName = `node-${NODE_WIN_VERSION}-win-x64.zip`;
  const url = `https://nodejs.org/dist/${NODE_WIN_VERSION}/${zipName}`;
  const zipPath = path.join(staging, zipName);
  const extractDir = path.join(staging, '_node_extract');
  console.log('[prepare-embedded] Downloading', url);
  await downloadFile(url, zipPath);
  rmrf(extractDir);
  fs.mkdirSync(extractDir, { recursive: true });
  execFileSync(
    'powershell.exe',
    ['-NoProfile', '-Command', `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${extractDir.replace(/'/g, "''")}' -Force`],
    { stdio: 'inherit' }
  );
  const inner = path.join(extractDir, `node-${NODE_WIN_VERSION}-win-x64`);
  const nodeExe = path.join(inner, 'node.exe');
  if (!fs.existsSync(nodeExe)) {
    throw new Error(`node.exe not found after extract: ${nodeExe}`);
  }
  fs.copyFileSync(nodeExe, path.join(targetDir, 'node.exe'));
  rmrf(extractDir);
  fs.unlinkSync(zipPath);
  console.log('[prepare-embedded] node.exe -> embedded-staging/node-runtime/');
}

function npmCiProd(cwd) {
  console.log('[prepare-embedded] npm ci --omit=dev in', cwd);
  execSync('npm ci --omit=dev', { cwd, stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } });
}

async function main() {
  rmrf(staging);
  fs.mkdirSync(staging, { recursive: true });

  const backendSrc = path.join(root, 'backend');
  const deviceSrc = path.join(root, 'device');
  if (!fs.existsSync(path.join(backendSrc, 'server.js'))) {
    throw new Error('backend/server.js missing');
  }
  if (!fs.existsSync(path.join(deviceSrc, 'server.mjs'))) {
    throw new Error('device/server.mjs missing');
  }

  const backendDest = path.join(staging, 'backend');
  const deviceDest = path.join(staging, 'device');

  copyTree(backendSrc, backendDest, { skip: ['node_modules', 'prisma', '.env'] });
  copyTree(path.join(backendSrc, 'prisma'), path.join(backendDest, 'prisma'), {
    skip: ['dev.db', 'dev.db-journal', 'dev.db-wal', 'dev.db-shm']
  });
  copyTree(deviceSrc, deviceDest, { skip: ['node_modules'] });

  npmCiProd(deviceDest);
  npmCiProd(backendDest);

  console.log('[prepare-embedded] prisma generate');
  execSync('npx prisma generate', { cwd: backendDest, stdio: 'inherit' });

  const nodeRt = path.join(staging, 'node-runtime');
  if (process.platform === 'win32') {
    await ensureWindowsNodeRuntime(nodeRt);
  } else {
    fs.mkdirSync(nodeRt, { recursive: true });
    fs.writeFileSync(path.join(nodeRt, '.posix-use-system-node'), '', 'utf8');
  }

  console.log('[prepare-embedded] OK ->', staging);
}

main().catch((e) => {
  console.error('[prepare-embedded] FAILED:', e);
  process.exit(1);
});
