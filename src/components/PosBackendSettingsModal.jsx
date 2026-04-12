import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  readPosBackendSettings,
  savePosBackendSettings,
  parsePosBackendSettings,
  isPosBackendIpLoopback,
  getSuggestedBackendIp,
} from '../lib/apiOrigin.js';

/**
 * Shared backend IP/port dialog (health check, localStorage, reload on success).
 * @param {(key: string, fallback: string) => string} tr
 */
export function PosBackendSettingsModal({
  open,
  onClose,
  tr,
  cancelLabel,
  overlayClassName = 'fixed inset-0 z-[220] flex items-center justify-center bg-black/50 p-4',
  toastZClass = 'z-[300]',
}) {
  const [backendIp, setBackendIp] = useState('');
  const [backendPort, setBackendPort] = useState('');
  const [backendSettingsError, setBackendSettingsError] = useState('');
  const [connectingBackend, setConnectingBackend] = useState(false);
  const [errorToast, setErrorToast] = useState(null);
  const connectAbortRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    connectAbortRef.current?.abort();
    connectAbortRef.current = null;
    setConnectingBackend(false);
    const current = readPosBackendSettings();
    setBackendIp(current.ip);
    setBackendPort(current.port);
    setBackendSettingsError('');
    setErrorToast(null);
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!errorToast) return undefined;
    const id = window.setTimeout(() => setErrorToast(null), 4000);
    return () => clearTimeout(id);
  }, [errorToast]);

  useEffect(() => {
    return () => {
      connectAbortRef.current?.abort();
    };
  }, []);

  const handleClose = useCallback(() => {
    connectAbortRef.current?.abort();
    connectAbortRef.current = null;
    setConnectingBackend(false);
    setBackendSettingsError('');
    setErrorToast(null);
    onClose();
  }, [onClose]);

  const handleConnect = useCallback(async () => {
    setBackendSettingsError('');
    const parsed = parsePosBackendSettings({ ip: backendIp, port: backendPort });
    if (!parsed) {
      if (isPosBackendIpLoopback(backendIp)) {
        setBackendSettingsError(
          tr(
            'kiosk.backendIpLanOnly',
            'Use this PC’s LAN IPv4 address (shown when you open the kiosk from that IP), not 127.0.0.1 or localhost.'
          )
        );
      } else {
        setBackendSettingsError(
          tr('kiosk.backendSettingsInvalid', 'Enter a valid backend IPv4 and port (1–65535).')
        );
      }
      return;
    }
    connectAbortRef.current?.abort();
    const ac = new AbortController();
    connectAbortRef.current = ac;
    setConnectingBackend(true);
    const healthUrl = `http://${parsed.ip}:${parsed.port}/api/health`;
    const timeoutMs = 12000;
    const timeoutId = window.setTimeout(() => ac.abort(), timeoutMs);
    try {
      const res = await fetch(healthUrl, { method: 'GET', signal: ac.signal, mode: 'cors' });
      clearTimeout(timeoutId);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json().catch(() => ({}));
      if (!data || data.ok !== true) {
        throw new Error(tr('kiosk.backendConnectFailed', 'Could not reach the server. Check IP, port, and network.'));
      }
      const saved = savePosBackendSettings(parsed);
      if (!saved) {
        throw new Error(tr('kiosk.backendConnectFailed', 'Could not reach the server. Check IP, port, and network.'));
      }
      window.location.reload();
    } catch (e) {
      clearTimeout(timeoutId);
      const fallback = tr('kiosk.backendConnectFailed', 'Could not reach the server. Check IP, port, and network.');
      const raw = String(e?.message || '');
      let msg = fallback;
      if (e?.name === 'AbortError') {
        msg = fallback;
      } else if (raw.startsWith('HTTP ')) {
        msg = `${fallback} (${raw})`;
      }
      setErrorToast(msg);
    } finally {
      if (connectAbortRef.current === ac) connectAbortRef.current = null;
      setConnectingBackend(false);
    }
  }, [backendIp, backendPort, tr]);

  if (!open) return null;

  const ipPlaceholder = getSuggestedBackendIp() || tr('kiosk.backendIpPlaceholder', '192.168.x.x');

  return (
    <>
      {errorToast ? (
        <div
          className={`fixed top-8 left-1/2 ${toastZClass} -translate-x-1/2 max-w-[min(92vw,520px)] rounded-xl border border-rose-400/80 bg-rose-600 px-6 py-4 text-center text-xl font-medium text-white shadow-2xl`}
          role="alert"
        >
          {errorToast}
        </div>
      ) : null}
      <div className={overlayClassName}>
        <div
          className="w-full max-w-[560px] rounded-xl bg-white p-6 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pos-backend-settings-title"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 id="pos-backend-settings-title" className="text-3xl font-semibold text-black mb-4">
            {tr('kiosk.backendSettingsTitle', 'Backend settings')}
          </h3>
          <div className="space-y-4">
            <label className="flex flex-col gap-2">
              <span className="text-black text-xl">{tr('kiosk.backendIpLabel', 'Backend IP')}</span>
              <input
                type="text"
                value={backendIp}
                onChange={(e) => setBackendIp(e.target.value)}
                disabled={connectingBackend}
                className="h-[52px] rounded-lg border border-pos-border px-4 text-2xl text-black disabled:opacity-50"
                placeholder={ipPlaceholder}
                autoComplete="off"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-black text-xl">{tr('kiosk.backendPortLabel', 'Backend port')}</span>
              <input
                type="number"
                min={1}
                max={65535}
                value={backendPort}
                onChange={(e) => setBackendPort(e.target.value)}
                disabled={connectingBackend}
                className="h-[52px] rounded-lg border border-pos-border px-4 text-2xl text-black disabled:opacity-50"
                placeholder="5000"
              />
            </label>
            {backendSettingsError ? <p className="text-rose-600 text-lg">{backendSettingsError}</p> : null}
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={connectingBackend}
              className="px-[50px] py-3 rounded-lg border border-pos-border text-black active:bg-rose-500 active:text-white disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleClose}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              disabled={connectingBackend}
              className="px-[50px] py-3 rounded-lg bg-rose-600 text-white active:bg-rose-500 disabled:opacity-60 disabled:pointer-events-none min-w-[200px]"
              onClick={() => void handleConnect()}
            >
              {connectingBackend
                ? tr('kiosk.backendConnecting', 'Connecting…')
                : tr('kiosk.backendConnect', 'Connect')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
