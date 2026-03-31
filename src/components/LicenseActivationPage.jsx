import { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function formatKeyTyping(raw) {
  const alnum = String(raw || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 12);
  const a = alnum.slice(0, 4);
  const b = alnum.slice(4, 8);
  const c = alnum.slice(8, 12);
  if (alnum.length <= 4) return a;
  if (alnum.length <= 8) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

export function LicenseActivationPage({ onActivated }) {
  const { t } = useLanguage();
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onChange = useCallback((e) => {
    setError(null);
    setKey(formatKeyTyping(e.target.value));
  }, []);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);
      const api = window.posLicense;
      if (!api?.activateLicense) {
        setError(t('license.err.generic'));
        return;
      }
      const normalized = key.replace(/-/g, '');
      if (normalized.length !== 12) {
        setError(t('license.err.generic'));
        return;
      }
      setBusy(true);
      try {
        const result = await api.activateLicense(key);
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
    [key, onActivated, t]
  );

  return (
    <div className="flex min-h-screen min-h-[100dvh] w-full flex-col items-center justify-center bg-pos-bg px-4">
      <div className="w-full max-w-md rounded-2xl border border-pos-border bg-pos-panel p-8 shadow-lg">
        <h1 className="text-center text-xl font-semibold text-pos-text">{t('license.title')}</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-pos-muted">{t('license.lead')}</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="pos-license-key" className="mb-1 block text-sm font-medium text-pos-text">
              {t('license.keyLabel')}
            </label>
            <input
              id="pos-license-key"
              type="text"
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-lg border border-pos-border bg-pos-bg px-3 py-2.5 font-mono text-lg tracking-wider text-pos-text outline-none focus:border-pos-accent"
              placeholder="XXXX-XXXX-XXXX"
              value={key}
              onChange={onChange}
              disabled={busy || success}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{t('license.success')}</p> : null}
          <button
            type="submit"
            disabled={busy || success}
            className="w-full rounded-lg bg-pos-accent py-3 text-base font-semibold text-white disabled:opacity-50"
          >
            {busy ? t('license.activating') : t('license.activate')}
          </button>
        </form>
      </div>
    </div>
  );
}
