import { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function LicenseActivationPage({ onActivated }) {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const copyFeedbackTimerRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = useState(null);
  const [deviceLoading, setDeviceLoading] = useState(true);
  const [deviceError, setDeviceError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const api = window.posLicense;
    if (!api?.getDeviceFingerprint) {
      setDeviceLoading(false);
      setDeviceError('no_agent');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const r = await api.getDeviceFingerprint();
        if (cancelled) return;
        if (r?.ok && r.deviceFingerprint) {
          setDeviceFingerprint(String(r.deviceFingerprint).toLowerCase());
        } else {
          setDeviceError(r?.error || 'device_id_failed');
        }
      } catch {
        if (!cancelled) setDeviceError('device_id_failed');
      } finally {
        if (!cancelled) setDeviceLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (copyFeedbackTimerRef.current) clearTimeout(copyFeedbackTimerRef.current);
    };
  }, []);

  const copyDeviceId = useCallback(async () => {
    if (!deviceFingerprint || deviceLoading || deviceError) return;
    try {
      await navigator.clipboard.writeText(deviceFingerprint);
      setCopied(true);
      if (copyFeedbackTimerRef.current) clearTimeout(copyFeedbackTimerRef.current);
      copyFeedbackTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = deviceFingerprint;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopied(true);
        if (copyFeedbackTimerRef.current) clearTimeout(copyFeedbackTimerRef.current);
        copyFeedbackTimerRef.current = setTimeout(() => setCopied(false), 2000);
      } catch {
        /* ignore */
      }
    }
  }, [deviceFingerprint, deviceLoading, deviceError]);

  const onPickFile = useCallback(() => {
    setError(null);
    fileInputRef.current?.click();
  }, []);

  const onFileChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      setError(null);
      const api = window.posLicense;
      if (!api?.importLicenseBundle) {
        setError(t('license.err.generic'));
        return;
      }
      setBusy(true);
      try {
        const text = await file.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          setError(t('license.err.invalid_bundle'));
          return;
        }
        const result = await api.importLicenseBundle(data);
        if (result?.ok) {
          setSuccess(true);
          onActivated?.();
          return;
        }
        const code = result?.error;
        const msg = result?.message;
        const keyTr = code ? `license.err.${code}` : null;
        const translated = keyTr && t(keyTr) !== keyTr ? t(keyTr) : null;
        setError(msg || translated || t('license.err.generic'));
      } catch {
        setError(t('license.err.generic'));
      } finally {
        setBusy(false);
      }
    },
    [onActivated, t]
  );

  const deviceIdDisplay = deviceLoading
    ? t('license.uuidLoading')
    : deviceError
      ? t('license.err.fingerprint_error')
      : deviceFingerprint || '—';

  const canCopyDeviceId = !!(deviceFingerprint && !deviceLoading && !deviceError);

  return (
    <div className="flex min-h-screen min-h-[100dvh] w-full flex-col items-center justify-center bg-pos-bg px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl border border-pos-border bg-pos-panel p-8 shadow-lg">
        <h1 className="text-center text-xl font-semibold text-pos-text">{t('license.title')}</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-pos-muted">{t('license.lead')}</p>

        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium text-pos-text">{t('license.deviceId')}</p>
          <p className="text-xs text-pos-muted leading-relaxed">{t('license.deviceIdHint')}</p>
          <p className="text-xs text-pos-muted/90">{t('license.deviceIdClickHint')}</p>
          <button
            type="button"
            disabled={!canCopyDeviceId}
            onClick={copyDeviceId}
            className={`w-full rounded-lg border bg-pos-bg px-3 py-2.5 text-left font-mono text-xs sm:text-sm break-all text-pos-text transition-colors ${
              canCopyDeviceId
                ? 'cursor-pointer border-pos-border hover:border-pos-accent hover:bg-pos-panel/50 active:bg-pos-panel'
                : 'cursor-not-allowed border-pos-border opacity-70'
            }`}
            aria-label={t('license.deviceIdCopyAria')}
          >
            {deviceIdDisplay}
          </button>
          {copied ? (
            <p className="text-sm text-emerald-500" role="status">
              {t('license.deviceIdCopied')}
            </p>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="sr-only"
          tabIndex={-1}
          onChange={onFileChange}
        />

        <div className="mt-6 space-y-4">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{t('license.success')}</p> : null}
          <button
            type="button"
            disabled={busy || success}
            onClick={onPickFile}
            aria-label={t('license.uploadLicense')}
            className="w-full rounded-lg bg-pos-accent py-3 text-base font-semibold text-white disabled:opacity-50"
          >
            {busy ? t('license.importing') : t('license.uploadLicense')}
          </button>
        </div>
      </div>
    </div>
  );
}
