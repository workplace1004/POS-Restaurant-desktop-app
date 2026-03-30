/**
 * Resolve paths like `/delete.svg` (Vite `public/`) for both `http` dev and `file://` (Electron).
 * Absolute `/…` under file:// would otherwise become `file:///delete.svg` and fail.
 */
export function publicAssetUrl(absPath) {
  const raw = String(absPath ?? '').trim();
  if (!raw) return '';
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  const pathOnly = raw.startsWith('/') ? raw.slice(1) : raw;
  if (!pathOnly) return '';
  try {
    return new URL(pathOnly, window.location.href).href;
  } catch {
    return raw.startsWith('/') ? raw : `/${pathOnly}`;
  }
}
