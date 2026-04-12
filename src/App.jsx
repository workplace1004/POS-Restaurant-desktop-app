import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useLanguage } from './contexts/LanguageContext';
import { TablesView } from './components/TablesView';
import { ControlView } from './components/ControlView';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LicenseActivationScreen } from './components/LicenseActivationScreen';
import { KioskView } from './components/KioskView';
import { KioskLanguagePicker } from './components/KioskLanguagePicker';
import { KioskStaffPinModal } from './components/KioskStaffPinModal';
import { usePos } from './hooks/usePos';
import { POS_API_PREFIX as API, POS_SOCKET_ORIGIN } from './lib/apiOrigin.js';
import { isLicenseEnforcementEnabled, runStartupLicenseCheck } from './lib/posWebLicense.js';

const USER_STORAGE_KEY = 'pos-user';
const VIEW_STORAGE_KEY = 'pos-view';
const KIOSK_LANG_SESSION_KEY = 'pos-kiosk-lang-ok';
const VALID_VIEWS = ['pos', 'control', 'tables', 'kiosk'];

/** Kiosk client runs without staff login; identity for APIs that require a user. */
const KIOSK_GUEST_USER = {
  id: 'kiosk-guest',
  label: 'Kiosk',
  name: 'Kiosk',
  role: 'kiosk',
};

/** This build has no POS order screen; treat `pos` as kiosk. */
function normalizeKioskAppView(v) {
  if (!VALID_VIEWS.includes(v)) return 'kiosk';
  if (v === 'pos') return 'kiosk';
  return v;
}

/** True after Eat here / Take away this session; refresh on kiosk menu stays on menu. */
function loadKioskMenuEnteredFromSession() {
  try {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') !== 'kiosk') return false;
    return window.sessionStorage.getItem(KIOSK_LANG_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function loadInitialView() {
  try {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (VALID_VIEWS.includes(v)) return normalizeKioskAppView(v);
  } catch {
    /* ignore */
  }
  try {
    const v = localStorage.getItem(VIEW_STORAGE_KEY);
    if (VALID_VIEWS.includes(v)) {
      const n = normalizeKioskAppView(v);
      /** Do not reopen Control from storage after refresh; staff uses PIN or `?view=control`. */
      if (n === 'control') return 'kiosk';
      return n;
    }
  } catch {
    /* ignore */
  }
  return 'kiosk';
}

function requestDocumentFullscreen() {
  try {
    const el = document.documentElement;
    el.requestFullscreen?.().catch(() => {});
  } catch {
    /* ignore */
  }
}

function exitDocumentFullscreen() {
  try {
    const el = document.documentElement;
    if (document.fullscreenElement === el) {
      document.exitFullscreen?.().catch(() => {});
    }
  } catch {
    /* ignore */
  }
}

const socket = io(POS_SOCKET_ORIGIN, { path: '/socket.io' });

export default function App() {
  const { t } = useLanguage();
  const [licenseUi, setLicenseUi] = useState(() => (isLicenseEnforcementEnabled() ? 'checking' : 'ready'));
  const [licenseBlockReason, setLicenseBlockReason] = useState(null);
  const [user, setUser] = useState(() => KIOSK_GUEST_USER);
  const [view, setView] = useState(loadInitialView);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isPosBootstrapReady, setIsPosBootstrapReady] = useState(false);
  const [kioskMenuEntered, setKioskMenuEntered] = useState(loadKioskMenuEnteredFromSession);
  const [showStaffPinModal, setShowStaffPinModal] = useState(false);
  const UA_TIMEZONE = 'Europe/Kyiv';
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-GB', { timeZone: UA_TIMEZONE, hour: '2-digit', minute: '2-digit', hour12: false }),
  );

  const fetchRoomCount = useCallback(async () => {
    try {
      const res = await fetch(`${API}/rooms`);
      const data = await res.json().catch(() => []);
      return Array.isArray(data) ? data.length : 0;
    } catch {
      return null;
    }
  }, []);

  const setViewAndPersist = useCallback((nextView) => {
    const v = normalizeKioskAppView(nextView);
    setView(v);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, v);
    } catch {
      /* ignore */
    }
    try {
      const u = new URL(window.location.href);
      if (u.searchParams.get('view') !== v) {
        u.searchParams.set('view', v);
        window.history.replaceState({}, '', u.toString());
      }
    } catch {
      /* ignore */
    }
  }, []);

  const {
    categories,
    products,
    selectedCategoryId,
    setSelectedCategoryId,
    orders,
    tables,
    fetchCategories,
    fetchProducts,
    loadPosFullCatalog,
    fetchOrders,
    fetchTables,
    fetchSubproductsForProduct,
    fetchSavedFunctionButtonsLayout,
    tableLayouts,
    fetchTableLayouts,
  } = usePos(API, socket, selectedTable ?? null, null);

  useEffect(() => {
    const tick = setInterval(
      () =>
        setTime(
          new Date().toLocaleTimeString('en-GB', {
            timeZone: UA_TIMEZONE,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
        ),
      1000,
    );
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (!isLicenseEnforcementEnabled()) return;
    let cancelled = false;
    (async () => {
      const r = await runStartupLicenseCheck();
      if (cancelled) return;
      if (r.ok || r.skipped) setLicenseUi('ready');
      else {
        setLicenseBlockReason(r.errorKey || 'license.err.generic');
        setLicenseUi('blocked');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user?.id || user.role != null) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/users/${user.id}`);
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (cancelled || data?.role == null) return;
        setUser((prev) => {
          if (!prev || prev.id !== user.id) return prev;
          const next = { ...prev, role: data.role };
          try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next));
          } catch {
            /* ignore */
          }
          return next;
        });
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.role]);

  useEffect(() => {
    if (!user) {
      setIsPosBootstrapReady(false);
      return;
    }
    if (view === 'kiosk') {
      let cancelled = false;
      (async () => {
        setIsPosBootstrapReady(false);
        try {
          await loadPosFullCatalog();
        } finally {
          if (!cancelled) setIsPosBootstrapReady(true);
        }
      })();
      return () => {
        cancelled = true;
      };
    }
    setIsPosBootstrapReady(true);
    return undefined;
  }, [user, view, loadPosFullCatalog]);

  useEffect(() => {
    if (selectedCategoryId) fetchProducts(selectedCategoryId);
  }, [selectedCategoryId, fetchProducts]);

  useEffect(() => {
    if (view === 'control') {
      fetchSavedFunctionButtonsLayout();
    }
  }, [view, fetchSavedFunctionButtonsLayout]);

  const prevViewRef = useRef(view);
  useEffect(() => {
    if (prevViewRef.current === 'control' && view === 'kiosk') {
      fetchCategories();
      if (selectedCategoryId) fetchProducts(selectedCategoryId);
    }
    prevViewRef.current = view;
  }, [view, fetchCategories, fetchProducts, selectedCategoryId]);

  useEffect(() => {
    if (view !== 'kiosk' || !isPosBootstrapReady) return undefined;
    requestDocumentFullscreen();
    return () => {
      exitDocumentFullscreen();
    };
  }, [view, isPosBootstrapReady]);

  useEffect(() => {
    if (view !== 'tables') return;
    void Promise.all([fetchTables(), fetchTableLayouts(), fetchRoomCount()]);
  }, [view, fetchTables, fetchTableLayouts, fetchRoomCount]);

  const handleLogout = () => {
    setUser(KIOSK_GUEST_USER);
    setIsPosBootstrapReady(false);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setViewAndPersist('kiosk');
  };

  const handleSelectTable = useCallback(
    (table) => {
      setSelectedTable(table);
      setViewAndPersist('kiosk');
    },
    [setViewAndPersist],
  );

  const handleStaffPinSuccess = useCallback(() => {
    setShowStaffPinModal(false);
    exitDocumentFullscreen();
    setViewAndPersist('control');
  }, [setViewAndPersist]);

  if (licenseUi === 'checking') {
    return (
      <div className="flex h-full min-h-[100dvh] w-full items-center justify-center bg-white">
        <LoadingSpinner label={t('license.checking')} />
      </div>
    );
  }

  if (licenseUi === 'blocked') {
    return (
      <LicenseActivationScreen
        time={time}
        variant="kiosk"
        initialErrorKey={licenseBlockReason}
        onLicensed={() => setLicenseUi('ready')}
      />
    );
  }

  if (view === 'tables') {
    return (
      <TablesView
        tables={tables}
        orders={orders}
        tableLayouts={tableLayouts}
        fetchTableLayouts={fetchTableLayouts}
        selectedTableId={selectedTable?.id ?? null}
        onSelectTable={handleSelectTable}
        onBack={() => setViewAndPersist('kiosk')}
        time={time}
        api={API}
      />
    );
  }

  if (view === 'control') {
    return (
      <ControlView
        currentUser={user}
        onLogout={handleLogout}
        onBack={() => setViewAndPersist('kiosk')}
        fetchTableLayouts={fetchTableLayouts}
        fetchTables={fetchTables}
        onFunctionButtonsSaved={fetchSavedFunctionButtonsLayout}
      />
    );
  }

  if (view === 'kiosk') {
    if (!isPosBootstrapReady) {
      return (
        <div className="flex h-full min-h-[100dvh] w-full items-center justify-center bg-white">
          <LoadingSpinner label={t('loadingPos')} />
        </div>
      );
    }
    const kioskOnClose = () => {
      try {
        if (window.opener && !window.opener.closed) {
          window.close();
          return;
        }
      } catch {
        /* ignore */
      }
      try {
        window.sessionStorage.removeItem(KIOSK_LANG_SESSION_KEY);
      } catch {
        /* ignore */
      }
      setKioskMenuEntered(false);
      exitDocumentFullscreen();
      try {
        const u = new URL(window.location.href);
        if (u.searchParams.get('view') !== 'kiosk') {
          u.searchParams.set('view', 'kiosk');
          window.history.replaceState({}, '', u.toString());
        }
      } catch {
        /* ignore */
      }
    };

    /** PIN exit from language screen: user is already on picker — `kioskOnClose` would be a no-op; actually leave the window/tab. */
    const kioskExitFromLanguagePicker = () => {
      try {
        window.sessionStorage.removeItem(KIOSK_LANG_SESSION_KEY);
      } catch {
        /* ignore */
      }
      setKioskMenuEntered(false);
      exitDocumentFullscreen();
      try {
        if (window.opener && !window.opener.closed) {
          window.close();
          return;
        }
      } catch {
        /* ignore */
      }
      try {
        window.close();
      } catch {
        /* ignore */
      }
      try {
        window.location.replace('about:blank');
      } catch {
        /* ignore */
      }
    };
    const staffPinModal = (
      <KioskStaffPinModal
        open={showStaffPinModal}
        onClose={() => setShowStaffPinModal(false)}
        onSuccess={handleStaffPinSuccess}
      />
    );

    if (!kioskMenuEntered) {
      return (
        <>
          <KioskLanguagePicker
            onEnterKiosk={() => {
              setKioskMenuEntered(true);
              try {
                window.sessionStorage.setItem(KIOSK_LANG_SESSION_KEY, '1');
              } catch {
                /* ignore */
              }
            }}
            onOpenConfiguration={() => setShowStaffPinModal(true)}
            onExitKiosk={kioskExitFromLanguagePicker}
          />
          {staffPinModal}
        </>
      );
    }
    return (
      <>
        <KioskView
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          products={products}
          fetchSubproductsForProduct={fetchSubproductsForProduct}
          onClose={kioskOnClose}
          onOpenConfiguration={() => setShowStaffPinModal(true)}
          onBackToLanguage={() => {
            try {
              window.sessionStorage.removeItem(KIOSK_LANG_SESSION_KEY);
            } catch {
              /* ignore */
            }
            setKioskMenuEntered(false);
          }}
        />
        {staffPinModal}
      </>
    );
  }

  return (
    <div className="flex h-full min-h-[100dvh] w-full items-center justify-center bg-white text-black">
      <LoadingSpinner label={t('loadingPos')} />
    </div>
  );
}
