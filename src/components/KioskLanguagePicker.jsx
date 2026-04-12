import React, { useState, useLayoutEffect, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { loadKioskServiceType, saveKioskServiceType } from '../lib/kioskServiceType.js';
import { PosBackendSettingsModal } from './PosBackendSettingsModal.jsx';
import { KioskStaffPinModal } from './KioskStaffPinModal.jsx';
import { publicAssetUrl } from '../lib/publicAssetUrl.js';

const KIOSK_W = 1080;
const KIOSK_H = 1920;

/** Flag assets in `public/country/` (served as `/country/*.svg`). */
const LANGUAGES = [
  { code: 'en', nativeLabel: 'English', flagFile: 'gb.svg' },
  { code: 'nl', nativeLabel: 'Nederlands', flagFile: 'nl.svg' },
  { code: 'fr', nativeLabel: 'Français', flagFile: 'fr.svg' },
  { code: 'tr', nativeLabel: 'Türkçe', flagFile: 'tr.svg' },
];

export function KioskLanguagePicker({ onEnterKiosk, onOpenConfiguration, onExitKiosk }) {
  const { t, lang, setLang } = useLanguage();
  const tr = useMemo(
    () => (key, fallback) => {
      const v = t(key);
      return v === key ? fallback : v;
    },
    [t]
  );
  const [scale, setScale] = useState(1);
  const [selectedCode, setSelectedCode] = useState(() =>
    LANGUAGES.some((l) => l.code === lang) ? lang : 'en'
  );

  useEffect(() => {
    if (LANGUAGES.some((l) => l.code === lang)) setSelectedCode(lang);
  }, [lang]);
  const [serviceType, setServiceType] = useState(() => loadKioskServiceType());
  const [showBackendSettingsModal, setShowBackendSettingsModal] = useState(false);
  const [showExitPinModal, setShowExitPinModal] = useState(false);

  useLayoutEffect(() => {
    const update = () => {
      const sw = window.innerWidth;
      const sh = window.innerHeight;
      const s = Math.min(sw / KIOSK_W, sh / KIOSK_H);
      setScale(Number.isFinite(s) && s > 0 ? s : 1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /** 5 taps bottom-right within 2s → configuration (same as kiosk menu). */
  const configTapRef = useRef({ count: 0, timerId: null });
  /** 5 taps bottom-left within 2s → PIN to exit kiosk. */
  const exitTapRef = useRef({ count: 0, timerId: null });
  const logoTapRef = useRef({ count: 0, timerId: null });
  useEffect(() => {
    return () => {
      if (configTapRef.current.timerId != null) clearTimeout(configTapRef.current.timerId);
      if (exitTapRef.current.timerId != null) clearTimeout(exitTapRef.current.timerId);
      if (logoTapRef.current.timerId != null) clearTimeout(logoTapRef.current.timerId);
    };
  }, []);
  const handleConfigurationTapZone = useCallback(() => {
    if (!onOpenConfiguration) return;
    const r = configTapRef.current;
    if (r.timerId != null) clearTimeout(r.timerId);
    r.count += 1;
    if (r.count >= 5) {
      r.count = 0;
      r.timerId = null;
      onOpenConfiguration();
      return;
    }
    r.timerId = window.setTimeout(() => {
      r.count = 0;
      r.timerId = null;
    }, 2000);
  }, [onOpenConfiguration]);

  const handleExitTapZone = useCallback(() => {
    if (!onExitKiosk) return;
    const r = exitTapRef.current;
    if (r.timerId != null) clearTimeout(r.timerId);
    r.count += 1;
    if (r.count >= 5) {
      r.count = 0;
      r.timerId = null;
      setShowExitPinModal(true);
      return;
    }
    r.timerId = window.setTimeout(() => {
      r.count = 0;
      r.timerId = null;
    }, 2000);
  }, [onExitKiosk]);

  const handleExitPinSuccess = useCallback(() => {
    setShowExitPinModal(false);
    onExitKiosk?.();
  }, [onExitKiosk]);

  const openBackendSettingsModal = useCallback(() => {
    setShowBackendSettingsModal(true);
  }, []);

  const handleLogoTap = useCallback(() => {
    const r = logoTapRef.current;
    if (r.timerId != null) clearTimeout(r.timerId);
    r.count += 1;
    if (r.count >= 5) {
      r.count = 0;
      r.timerId = null;
      openBackendSettingsModal();
      return;
    }
    r.timerId = window.setTimeout(() => {
      r.count = 0;
      r.timerId = null;
    }, 2000);
  }, [openBackendSettingsModal]);

  const closeBackendSettingsModal = useCallback(() => {
    setShowBackendSettingsModal(false);
  }, []);

  const goToMenu = (type) => {
    setServiceType(type);
    saveKioskServiceType(type);
    onEnterKiosk?.();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      <div
        className="relative bg-white text-pos-text shadow-2xl flex flex-col overflow-hidden"
        style={{
          width: KIOSK_W,
          height: KIOSK_H,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <div className="flex-1 flex flex-col items-center px-8 py-6 min-h-0 gap-10">
          <div className="flex justify-center w-full">
            <button
              type="button"
              onClick={handleLogoTap}
              className="border-0 bg-transparent p-0"
            >
              <img
                src={publicAssetUrl('/logo.png')}
                alt="Logo"
                className="h-[700px] object-contain"
                draggable={false}
              />
            </button>
          </div>

          <div className="flex flex-row gap-6 w-full max-w-3xl justify-center mt-20">
            <button
              type="button"
              onClick={() => goToMenu('dine_in')}
              className={`flex flex-col items-center justify-center shadow-lg gap-4 flex-1 text-black max-w-[min(50%,24rem)] rounded-xl px-8 py-8 text-4xl font-semibold`}
            >
              <img
                src={publicAssetUrl('/eathere.png')}
                alt=""
                className="max-h-40 w-auto object-contain pointer-events-none"
                draggable={false}
              />
              {t('kiosk.eatHere')}
            </button>
            <button
              type="button"
              onClick={() => goToMenu('takeaway')}
              className={`flex flex-col items-center justify-center gap-4 shadow-lg flex-1 text-black max-w-[min(50%,24rem)] rounded-xl px-8 py-8 text-4xl font-semibold`}
            >
              <img
                src={publicAssetUrl('/takeaway.png')}
                alt=""
                className="max-h-40 w-auto object-contain pointer-events-none"
                draggable={false}
              />
              {t('kiosk.takeAway')}
            </button>
          </div>
          <div className="flex flex-col justify-end h-full mb-[200px] items-center gap-5 w-full max-w-3xl">
            <h2 className="text-4xl font-semibold text-center mb-4 text-black">
              {t('kiosk.chooseYourLanguage')}
            </h2>
            <div className="flex gap-10 w-full justify-center">
            {LANGUAGES.map(({ code, nativeLabel, flagFile }) => {
              const selected = selectedCode === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setSelectedCode(code);
                    setLang(code);
                  }}
                  className={`flex flex-col items-center justify-center w-[110px] h-[110px] rounded-full p-2 transition-colors ${
                    selected ? 'bg-rose-500' : 'bg-transparent'
                  }`}
                >
                  <img
                    src={publicAssetUrl(`/country/${flagFile}`)}
                    alt=""
                    className="h-full w-full min-h-0 min-w-0 rounded-full object-cover pointer-events-none"
                    draggable={false}
                  />
                </button>
              );
            })}
            </div>
          </div>
        </div>
        {onOpenConfiguration ? (
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute bottom-0 right-0 z-[150] h-[180px] w-[180px] border-0 bg-transparent p-0 cursor-default focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleConfigurationTapZone();
            }}
          />
        ) : null}
        {onExitKiosk ? (
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute bottom-0 left-0 z-[150] h-[180px] w-[180px] border-0 bg-transparent p-0 cursor-default focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleExitTapZone();
            }}
          />
        ) : null}
        <PosBackendSettingsModal
          open={showBackendSettingsModal}
          onClose={closeBackendSettingsModal}
          tr={tr}
          cancelLabel={t('cancel')}
          overlayClassName="absolute inset-0 z-[220] flex items-center justify-center bg-black/50 p-4"
        />
      </div>
      <KioskStaffPinModal
        open={showExitPinModal}
        onClose={() => setShowExitPinModal(false)}
        onSuccess={handleExitPinSuccess}
      />
    </div>
  );
}
