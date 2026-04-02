#!/usr/bin/env node
/**
 * Double-click launcher: starts `npm run preview` in RESPOS_ROOT (default C:\RESPOS), then opens
 * the PWA via the Desktop "RES POS.lnk" shortcut (so --app-id stays correct after PWA reinstall).
 * Fallback: chrome.exe + preview URL. Build: npm run build:respos-exe → release/RESPOS.exe
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const APP_ROOT = process.env.RESPOS_ROOT || 'C:\\RESPOS';
const PREVIEW_MS = Number(process.env.RESPOS_PREVIEW_WAIT_MS || 5000);
const PREVIEW_URL =
  process.env.RESPOS_PREVIEW_URL || 'http://127.0.0.1:4173/';
const CHROME_DIR =
  process.env.RESPOS_CHROME_DIR || 'C:\\Program Files\\Google\\Chrome\\Application';
const CHROME_EXE = path.join(CHROME_DIR, 'chrome.exe');
const SHORTCUT_NAME = process.env.RESPOS_PWA_SHORTCUT || 'RES POS.lnk';

function pwaShortcutCandidates() {
  const user = process.env.USERPROFILE || '';
  const pub = process.env.PUBLIC || 'C:\\Users\\Public';
  return [
    path.join(user, 'Desktop', SHORTCUT_NAME),
    path.join(user, 'OneDrive', 'Desktop', SHORTCUT_NAME),
    path.join(pub, 'Desktop', SHORTCUT_NAME)
  ];
}

function openViaShortcut() {
  for (const p of pwaShortcutCandidates()) {
    if (fs.existsSync(p)) {
      spawn('cmd.exe', ['/c', 'start', '', p], {
        detached: true,
        stdio: 'ignore',
        windowsHide: false
      }).unref();
      return true;
    }
  }
  return false;
}

const preview = spawn('cmd.exe', ['/c', 'npm run preview'], {
  cwd: APP_ROOT,
  detached: true,
  stdio: 'ignore',
  windowsHide: true
});
preview.unref();

setTimeout(() => {
  if (openViaShortcut()) return;
  if (!fs.existsSync(CHROME_EXE)) {
    console.error(
      `[RESPOS] No "${SHORTCUT_NAME}" on Desktop/Public Desktop and Chrome missing:\n  ${CHROME_EXE}`
    );
    process.exitCode = 1;
    return;
  }
  spawn(CHROME_EXE, [PREVIEW_URL], {
    detached: true,
    stdio: 'ignore',
    cwd: CHROME_DIR,
    windowsHide: false
  }).unref();
}, PREVIEW_MS);
