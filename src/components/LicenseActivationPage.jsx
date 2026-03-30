import { useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  activateWebLicense,
  saveStoredWebLicense,
  parseLicenseKeyFromFile,
  parseLicenseImportFromArrayBuffer,
  verifyWebLicenseBundle,
  saveWebLicenseFileToOpfs,
  encryptLicenseUtf8ToPortableFile,
  POS_LICENSE_FILE_FORMAT,
  POS_LICENSE_FILE_VERSION
} from '../lib/posWebLicense.js';

function translateDeviceIdentityError(deviceError, t) {
  if (!deviceError) return '';
  const keyByCode = {
    agent_unreachable: 'license.err.agent_unreachable',
    no_hardware_identifiers: 'license.err.no_hardware_identifiers',
    device_id_failed: 'license.err.device_id_failed',
    failed: 'license.err.fingerprint_error'
  };
  const trKey = keyByCode[deviceError] || 'license.err.fingerprint_error';
  const msg = t(trKey);
  return msg !== trKey ? msg : t('license.err.fingerprint_error');
}

/**
 * @param {object} props
 * @param {'electron' | 'web'} props.variant
 * @param {() => void} [props.onActivated]
 * @param {string | null} [props.deviceFingerprint]
 * @param {string | null} [props.deviceError]
 */
export function LicenseActivationPage({ variant = 'electron', onActivated, deviceFingerprint, deviceError }) {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [electronDevice, setElectronDevice] = useState({ fp: null, err: null, loading: false });

  useEffect(() => {
    if (variant !== 'electron') return undefined;
    let cancelled = false;
    setElectronDevice({ fp: null, err: null, loading: true });
    (async () => {
      try {
        const api = window.posLicense;
        if (api?.getDeviceFingerprint) {
          const r = await api.getDeviceFingerprint();
          if (cancelled) return;
          if (r?.ok && r.deviceFingerprint) {
            setElectronDevice({ fp: r.deviceFingerprint, err: null, loading: false });
          } else {
            setElectronDevice({ fp: null, err: r?.error || 'device_id_failed', loading: false });
          }
          return;
        }
        const { fetchDeviceFingerprint } = await import('../lib/posWebLicense.js');
        const fp = await fetchDeviceFingerprint();
        if (!cancelled) setElectronDevice({ fp, err: null, loading: false });
      } catch (e) {
        if (cancelled) return;
        const code = e instanceof Error ? e.message : 'failed';
        const err =
          code === 'agent_unreachable' || code === 'no_hardware_identifiers' || code === 'device_id_failed'
            ? code
            : 'failed';
        setElectronDevice({ fp: null, err, loading: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [variant]);

  const displayFingerprint = variant === 'electron' ? electronDevice.fp : deviceFingerprint;
  const displayDeviceError = variant === 'electron' ? electronDevice.err : deviceError;
  const displayDeviceLoading =
    variant === 'electron' ? electronDevice.loading : !deviceFingerprint && !deviceError;

  const copyDeviceId = useCallback(async () => {
    if (!displayFingerprint) return;
    try {
      await navigator.clipboard.writeText(displayFingerprint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t('license.err.copy_failed'));
    }
  }, [displayFingerprint, t]);

  const runActivation = useCallback(
    async (normalized) => {
      setError(null);
      if (!normalized) {
        setError(t('license.err.invalid_key'));
        return;
      }

      if (variant === 'electron') {
        const api = window.posLicense;
        if (!api?.activateLicense) {
          setError(t('license.err.generic'));
          return;
        }
        setBusy(true);
        try {
          const result = await api.activateLicense(normalized);
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
        return;
      }

    },
    [onActivated, t, variant]
  );

  const onPickLicenseFile = useCallback(() => {
    setError(null);
    fileInputRef.current?.click();
  }, []);

  const onLicenseFileChange = useCallback(
    async (e) => {
      const input = e.target;
      const file = input.files?.[0];
      input.value = '';
      if (!file) return;
      setError(null);
      setSuccess(false);
      try {
        const buf = await file.arrayBuffer();
        if (variant === 'electron') {
          const parsed = await parseLicenseKeyFromFile(buf);
          if (!parsed.ok) {
            setError(t('license.err.invalid_license_file'));
            return;
          }
          await runActivation(parsed.licenseKey);
          return;
        }

        if (!deviceFingerprint) {
          setError(t('license.err.fingerprint_error'));
          return;
        }
        const pemRaw = import.meta.env.VITE_LICENSE_RSA_PUBLIC_KEY_PEM;
        const pem =
          pemRaw && String(pemRaw).trim() ? String(pemRaw).replace(/\\n/g, '\n').trim() : '';
        if (!pem.includes('BEGIN')) {
          setError(t('license.err.no_public_key'));
          return;
        }

        const imp = await parseLicenseImportFromArrayBuffer(buf);
        if (!imp.ok) {
          setError(t('license.err.invalid_license_file'));
          return;
        }

        setBusy(true);
        try {
          if (imp.license && imp.signature) {
            const bundle = {
              licenseKey: imp.licenseKey,
              license: imp.license,
              signature: imp.signature
            };
            const ok = await verifyWebLicenseBundle(bundle, deviceFingerprint, pem);
            if (!ok) {
              setError(t('license.err.bad_signature'));
              return;
            }
            await saveWebLicenseFileToOpfs(buf);
            saveStoredWebLicense(bundle);
            setSuccess(true);
            onActivated?.();
            return;
          }

          const result = await activateWebLicense(imp.licenseKey, deviceFingerprint);
          if (!result.ok) {
            const j = result.error || {};
            const code = j.error;
            const msg = j.message;
            const keyTr = code ? `license.err.${code}` : null;
            const translated = keyTr && t(keyTr) !== keyTr ? t(keyTr) : null;
            setError(msg || translated || t('license.err.generic'));
            return;
          }
          const bundle = {
            licenseKey: result.licenseKey,
            license: result.license,
            signature: result.signature
          };
          saveStoredWebLicense(bundle);
          const inner = JSON.stringify({
            format: POS_LICENSE_FILE_FORMAT,
            version: POS_LICENSE_FILE_VERSION,
            licenseKey: result.licenseKey,
            email: result.license.email,
            expiresAt: result.license.expiresAt,
            deviceFingerprint: result.license.deviceFingerprint,
            issuedAt: new Date().toISOString(),
            license: result.license,
            signature: result.signature
          });
          const encryptedBuf = await encryptLicenseUtf8ToPortableFile(inner);
          await saveWebLicenseFileToOpfs(encryptedBuf);
          setSuccess(true);
          onActivated?.();
        } catch {
          setError(t('license.err.network'));
        } finally {
          setBusy(false);
        }
      } catch {
        setError(t('license.err.invalid_license_file'));
      }
    },
    [variant, runActivation, t, deviceFingerprint, onActivated]
  );

  const lead =
    variant === 'web' ? t('license.leadWeb') : t('license.lead');

  const canInteract =
    variant === 'electron' || (deviceFingerprint && !deviceError);

  return (
    <div className="flex min-h-screen min-h-[100dvh] w-full flex-col items-center justify-center bg-pos-bg px-4">
      <div className="w-full max-w-lg rounded-2xl border border-pos-border bg-pos-panel p-8 shadow-lg">
        <h1 className="text-center text-xl font-semibold text-pos-text">{t('license.title')}</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-pos-muted">{lead}</p>

        <div className="mt-6 rounded-xl border border-pos-border bg-pos-bg p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-pos-muted">
            {t('license.deviceIdLabel')}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-pos-text-dim">{t('license.deviceIdHint')}</p>
          {displayDeviceError ? (
            <p className="mt-2 text-sm leading-relaxed text-red-600">
              {translateDeviceIdentityError(displayDeviceError, t)}
            </p>
          ) : displayFingerprint ? (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <code className="block flex-1 break-all rounded-lg border border-pos-inputBorder bg-pos-dark px-3 py-2 font-mono text-xs text-pos-text">
                {displayFingerprint}
              </code>
              <button
                type="button"
                onClick={copyDeviceId}
                className="shrink-0 rounded-lg border border-pos-border bg-pos-panel px-4 py-2 text-sm font-medium text-pos-text hover:bg-rowHover"
              >
                {copied ? t('license.copied') : t('license.copyDeviceId')}
              </button>
            </div>
          ) : displayDeviceLoading ? (
            <p className="mt-2 text-sm text-pos-muted">{t('license.loadingDeviceId')}</p>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          accept="*/*"
          tabIndex={-1}
          onChange={onLicenseFileChange}
        />

        <div className="mt-6 space-y-4">
          <div>
            <p className="mb-2 text-xs text-pos-muted">{t('license.loadFromFileHint')}</p>
            <button
              type="button"
              onClick={onPickLicenseFile}
              disabled={busy || success || !canInteract}
              className="w-full rounded-lg border-2 border-pos-accent bg-pos-bg py-3 text-base font-semibold text-pos-text hover:bg-rowHover disabled:opacity-50"
            >
              {busy ? t('license.activating') : t('license.loadFromFile')}
            </button>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{t('license.success')}</p> : null}
        </div>
      </div>
    </div>
  );
}
