import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { POS_API_PREFIX } from '../lib/apiOrigin.js';
import { useLanguage } from '../contexts/LanguageContext';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'fr', label: 'Français' },
  { value: 'tr', label: 'Türkçe' }
];

const LABELS = {
  en: {
    title: 'Settings',
    language: 'Language',
    languageHint: 'Applies across POS and KDS.',
    saveLanguage: 'Save language',
    pinSection: 'Kitchen PIN',
    pinHint: 'Change the PIN for this kitchen station.',
    newPin: 'New PIN',
    confirmPin: 'Confirm PIN',
    savePin: 'Update PIN',
    close: 'Close',
    saving: 'Saving…',
    pinMismatch: 'PINs do not match.',
    pinTooShort: 'PIN must be at least 4 characters.',
    languageSaved: 'Language saved.',
    pinSaved: 'PIN updated.',
    error: 'Something went wrong.'
  },
  nl: {
    title: 'Instellingen',
    language: 'Taal',
    languageHint: 'Geldt voor kassa en KDS.',
    saveLanguage: 'Taal opslaan',
    pinSection: 'Keuken-PIN',
    pinHint: 'Wijzig de PIN voor deze keuken.',
    newPin: 'Nieuwe PIN',
    confirmPin: 'Bevestig PIN',
    savePin: 'PIN bijwerken',
    close: 'Sluiten',
    saving: 'Opslaan…',
    pinMismatch: "PIN's komen niet overeen.",
    pinTooShort: 'PIN minimaal 4 tekens.',
    languageSaved: 'Taal opgeslagen.',
    pinSaved: 'PIN bijgewerkt.',
    error: 'Er ging iets mis.'
  },
  fr: {
    title: 'Paramètres',
    language: 'Langue',
    languageHint: "S'applique au POS et au KDS.",
    saveLanguage: 'Enregistrer la langue',
    pinSection: 'PIN cuisine',
    pinHint: 'Modifier le PIN de ce poste cuisine.',
    newPin: 'Nouveau PIN',
    confirmPin: 'Confirmer le PIN',
    savePin: 'Mettre à jour le PIN',
    close: 'Fermer',
    saving: 'Enregistrement…',
    pinMismatch: 'Les PIN ne correspondent pas.',
    pinTooShort: 'Le PIN doit contenir au moins 4 caractères.',
    languageSaved: 'Langue enregistrée.',
    pinSaved: 'PIN mis à jour.',
    error: 'Une erreur est survenue.'
  },
  tr: {
    title: 'Ayarlar',
    language: 'Dil',
    languageHint: 'POS ve KDS için geçerlidir.',
    saveLanguage: 'Dili kaydet',
    pinSection: 'Mutfak PIN',
    pinHint: 'Bu mutfak istasyonunun PINini değiştirin.',
    newPin: 'Yeni PIN',
    confirmPin: 'PIN onayı',
    savePin: 'PINi güncelle',
    close: 'Kapat',
    saving: 'Kaydediliyor…',
    pinMismatch: "PIN'ler eşleşmiyor.",
    pinTooShort: 'PIN en az 4 karakter olmalı.',
    languageSaved: 'Dil kaydedildi.',
    pinSaved: 'PIN güncellendi.',
    error: 'Bir hata oluştu.'
  }
};

function labelsFor(lang) {
  const k = LANGUAGE_OPTIONS.some((o) => o.value === lang) ? lang : 'en';
  return LABELS[k] || LABELS.en;
}

export function KdsSettingsModal({ open, onClose, kitchenId, kitchenName, apiPrefix = POS_API_PREFIX }) {
  const [uiLang, setUiLang] = useState('en');
  const [language, setLanguage] = useState('en');
  const [pinNew, setPinNew] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [savingLang, setSavingLang] = useState(false);
  const [savingPin, setSavingPin] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langPickerRef = useRef(null);
  const { setLang } = useLanguage();

  const L = labelsFor(uiLang);
  const languageUrl = useMemo(() => `${apiPrefix}/settings/language`, [apiPrefix]);

  const loadLanguage = useCallback(async () => {
    try {
      const res = await fetch(languageUrl);
      const data = await res.json().catch(() => ({}));
      const v = data?.value;
      if (v && LANGUAGE_OPTIONS.some((o) => o.value === v)) {
        setLanguage(v);
        setUiLang(v);
      }
    } catch {
      /* ignore */
    }
  }, [languageUrl]);

  useEffect(() => {
    if (!open) return;
    setMessage('');
    setError('');
    setPinNew('');
    setPinConfirm('');
    loadLanguage();
  }, [open, loadLanguage]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (langMenuOpen) {
        setLangMenuOpen(false);
        return;
      }
      onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, langMenuOpen]);

  useEffect(() => {
    if (!langMenuOpen) return;
    const onDoc = (e) => {
      if (!langPickerRef.current?.contains(e.target)) setLangMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [langMenuOpen]);

  useEffect(() => {
    if (!open) setLangMenuOpen(false);
  }, [open]);

  const handleSaveLanguage = async () => {
    setError('');
    setMessage('');
    setSavingLang(true);
    try {
      const res = await fetch(languageUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: language })
      });
      if (!res.ok) throw new Error('fail');
      setLang(language);
      setUiLang(language);
      setMessage(labelsFor(language).languageSaved);
    } catch {
      setError(labelsFor(uiLang).error);
    } finally {
      setSavingLang(false);
    }
  };

  const handleSavePin = async () => {
    setError('');
    setMessage('');
    const Lc = labelsFor(uiLang);
    const a = pinNew.trim();
    const b = pinConfirm.trim();
    if (a.length < 4) {
      setError(Lc.pinTooShort);
      return;
    }
    if (a !== b) {
      setError(Lc.pinMismatch);
      return;
    }
    if (!kitchenId) return;
    setSavingPin(true);
    try {
      const res = await fetch(`${apiPrefix}/kitchens/${kitchenId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: a })
      });
      if (!res.ok) throw new Error('fail');
      setPinNew('');
      setPinConfirm('');
      setMessage(labelsFor(uiLang).pinSaved);
    } catch {
      setError(labelsFor(uiLang).error);
    } finally {
      setSavingPin(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kds-settings-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1e1e1e] p-6 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="kds-settings-title" className="text-xl font-bold">
            {L.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label={L.close}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {kitchenName ? (
          <p className="mt-1 text-sm text-white/50">{kitchenName}</p>
        ) : null}

        <div className="mt-6 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-white/50">{L.language}</label>
          <p className="text-xs text-white/40">{L.languageHint}</p>
          <div ref={langPickerRef} className="relative z-30 mt-2">
            <button
              type="button"
              onClick={() => setLangMenuOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/15 bg-[#2d2d2d] px-4 py-3.5 text-left text-base font-medium text-white outline-none transition-colors hover:border-white/25 hover:bg-[#333] focus-visible:border-[#c0392b] focus-visible:ring-2 focus-visible:ring-[#c0392b]/50"
              aria-expanded={langMenuOpen}
              aria-haspopup="listbox"
              aria-label={L.language}
            >
              <span className="truncate">
                {LANGUAGE_OPTIONS.find((o) => o.value === language)?.label ?? language}
              </span>
              <svg
                className={`h-5 w-5 shrink-0 text-white/60 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langMenuOpen ? (
              <ul
                className="absolute left-0 right-0 z-50 mt-2 max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-[#262626] py-1 shadow-2xl [scrollbar-color:rgba(255,255,255,0.2)_transparent] [scrollbar-width:thin]"
                role="listbox"
              >
                {LANGUAGE_OPTIONS.map((o) => {
                  const active = o.value === language;
                  return (
                    <li key={o.value} role="option" aria-selected={active}>
                      <button
                        type="button"
                        onClick={() => {
                          setLanguage(o.value);
                          setUiLang(o.value);
                          setLangMenuOpen(false);
                        }}
                        className={`flex w-full items-center px-4 py-3 text-left text-base transition-colors ${
                          active
                            ? 'border-l-[3px] border-[#c0392b] bg-[#c0392b]/25 pl-[13px] text-white'
                            : 'border-l-[3px] border-transparent text-white/90 hover:bg-white/[0.08]'
                        }`}
                      >
                        <span className="truncate font-medium">{o.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
          <button
            type="button"
            disabled={savingLang}
            onClick={handleSaveLanguage}
            className="mt-2 w-full rounded-xl border border-white/15 bg-[#2d2d2d] py-3 text-sm font-semibold text-white transition-colors hover:border-white/25 hover:bg-[#333] disabled:opacity-50"
          >
            {savingLang ? L.saving : L.saveLanguage}
          </button>
        </div>

        <div className="my-6 border-t border-white/10" />

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-white/50">{L.pinSection}</label>
          <p className="text-xs text-white/40">{L.pinHint}</p>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            value={pinNew}
            onChange={(e) => setPinNew(e.target.value)}
            placeholder={L.newPin}
            className="w-full rounded-xl border border-white/15 bg-[#2d2d2d] px-4 py-3 text-base text-white placeholder:text-white/35 outline-none focus:border-[#c0392b]"
          />
          <input
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            value={pinConfirm}
            onChange={(e) => setPinConfirm(e.target.value)}
            placeholder={L.confirmPin}
            className="w-full rounded-xl border border-white/15 bg-[#2d2d2d] px-4 py-3 text-base text-white placeholder:text-white/35 outline-none focus:border-[#c0392b]"
          />
          <button
            type="button"
            disabled={savingPin}
            onClick={handleSavePin}
            className="mt-2 w-full rounded-xl bg-[#c0392b] py-3 text-sm font-bold text-white hover:bg-[#a93226] disabled:opacity-50"
          >
            {savingPin ? L.saving : L.savePin}
          </button>
        </div>

        {error ? <p className="mt-4 text-center text-sm font-medium text-red-400">{error}</p> : null}
        {message ? <p className="mt-4 text-center text-sm font-medium text-emerald-400">{message}</p> : null}
      </div>
    </div>
  );
}
