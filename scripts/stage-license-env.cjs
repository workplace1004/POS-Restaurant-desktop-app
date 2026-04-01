/**
 * Writes embedded-staging/license.env for electron-builder extraResources.
 * Run after electron:prepare-embedded (that script clears embedded-staging).
 * Copies license-related keys from frontend/.env so the packaged .exe has decryption + RSA PEM at runtime.
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const root = path.join(__dirname, '..');
const staging = path.join(root, 'embedded-staging');
const outFile = path.join(staging, 'license.env');
const srcEnv = path.join(root, '.env');

fs.mkdirSync(staging, { recursive: true });

/** One .env line; quote/escape if needed (PEM newlines, #, etc.). */
function encodeLine(key, value) {
  const v = String(value);
  const needsQuotes =
    /[\r\n#]/.test(v) || /^\s/.test(v) || v.includes('"') || v.includes("'") || v.includes('=');
  if (!needsQuotes) return `${key}=${v}`;
  const escaped = v
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\n');
  return `${key}="${escaped}"`;
}

const header = [
  '# Bundled with RES POS installer — generated at build time by scripts/stage-license-env.cjs',
  '# from frontend/.env (VITE_LICENSE_* and LICENSE_FILE_ENCRYPTION_KEY only).',
  ''
];

if (!fs.existsSync(srcEnv)) {
  console.warn(
    '[stage-license-env] No .env in project root — wrote empty license.env. Packaged app will not decrypt license files until you rebuild with .env present.'
  );
  fs.writeFileSync(
    outFile,
    `${header.join('\n')}\n# Add .env with VITE_LICENSE_FILE_ENCRYPTION_KEY and VITE_LICENSE_RSA_PUBLIC_KEY_PEM, then run electron:build again.\n`,
    'utf8'
  );
  process.exit(0);
}

const parsed = dotenv.parse(fs.readFileSync(srcEnv, 'utf8'));
const keysOut = [];
for (const [k, v] of Object.entries(parsed)) {
  if (v == null || String(v).trim() === '') continue;
  if (k.startsWith('VITE_LICENSE_') || k === 'LICENSE_FILE_ENCRYPTION_KEY') {
    keysOut.push([k, v]);
  }
}

if (keysOut.length === 0) {
  console.warn(
    '[stage-license-env] .env has no VITE_LICENSE_* or LICENSE_FILE_ENCRYPTION_KEY — packaged app cannot verify/decrypt licenses.'
  );
}

const lines = [...header];
for (const [k, v] of keysOut) {
  lines.push(encodeLine(k, v));
}

fs.writeFileSync(outFile, `${lines.join('\n')}\n`, 'utf8');
console.log('[stage-license-env] Wrote', outFile, `(${keysOut.length} key(s))`);
