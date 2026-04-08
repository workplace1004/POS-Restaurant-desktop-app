import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const STAFF_PIN = '1258';
const PIN_LEN = 4;

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'del'];

export function KioskStaffPinModal({ open, onClose, onSuccess }) {
  const { t } = useLanguage();
  const [digits, setDigits] = useState('');
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    if (open) {
      setDigits('');
      setWrong(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || digits.length !== PIN_LEN) return;
    if (digits === STAFF_PIN) {
      onSuccess?.();
      return;
    }
    setWrong(true);
    setDigits('');
  }, [open, digits, onSuccess]);

  const handleKey = useCallback((key) => {
    if (key === 'del') {
      setDigits((s) => s.slice(0, -1));
      setWrong(false);
      return;
    }
    if (key === 'C') {
      setDigits('');
      setWrong(false);
      return;
    }
    if (key === '') return;
    setWrong(false);
    setDigits((prev) => (prev.length >= PIN_LEN ? prev : prev + key));
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/65 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kiosk-staff-pin-title"
    >
      <div className="w-full max-w-lg rounded-2xl border-2 border-black bg-white p-8 shadow-2xl">
        <h2 id="kiosk-staff-pin-title" className="text-center text-4xl font-semibold text-black">
          {t('kiosk.staffPinTitle')}
        </h2>
        <p className="mt-2 text-center text-xl text-black/70">{t('kiosk.staffPinSubtitle')}</p>

        <div className="mt-8 flex justify-center gap-4" aria-live="polite">
          {Array.from({ length: PIN_LEN }, (_, i) => (
            <span
              key={i}
              className={`flex h-16 w-14 items-center justify-center rounded-lg border-2 text-4xl font-bold ${
                i < digits.length ? 'border-rose-500 bg-rose-50 text-black' : 'border-black/30 bg-white text-black/30'
              }`}
            >
              {i < digits.length ? '•' : '—'}
            </span>
          ))}
        </div>

        {wrong ? (
          <p className="mt-4 text-center text-2xl font-medium text-rose-600">{t('kiosk.staffPinWrong')}</p>
        ) : null}

        <div className="mt-8 grid grid-cols-3 gap-3">
          {KEYS.map((key, idx) => {
            if (key === '') {
              return <div key={`empty-${idx}`} className="h-16" aria-hidden />;
            }
            if (key === 'del') {
              return (
                <button
                  key="del"
                  type="button"
                  onClick={() => handleKey('del')}
                  className="h-16 rounded-xl border-2 border-black bg-white text-2xl font-semibold text-black active:bg-rose-500 active:text-white"
                >
                  {t('kiosk.staffPinDelete')}
                </button>
              );
            }
            if (key === 'C') {
              return (
                <button
                  key="clear"
                  type="button"
                  onClick={() => handleKey('C')}
                  className="h-16 rounded-xl border-2 border-black bg-white text-3xl font-semibold text-black active:bg-rose-500 active:text-white"
                  aria-label={t('kiosk.staffPinClear')}
                >
                  C
                </button>
              );
            }
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleKey(key)}
                className="h-16 rounded-xl border-2 border-black bg-white text-3xl font-semibold text-black active:bg-rose-500 active:text-white"
              >
                {key}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full rounded-xl border-2 border-black bg-white py-4 text-2xl font-semibold text-black active:bg-black/10"
        >
          {t('kiosk.staffPinCancel')}
        </button>
      </div>
    </div>
  );
}
