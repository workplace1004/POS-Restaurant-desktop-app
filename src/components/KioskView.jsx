import React, { useState, useCallback, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { resolveMediaSrc } from '../lib/publicAssetUrl.js';
import { POS_API_PREFIX as API } from '../lib/apiOrigin.js';
import { buildPaymentBreakdown, formatPaymentAmount, roundCurrency } from '../lib/payDifferentlyUtils.js';
import { loadKioskServiceType } from '../lib/kioskServiceType.js';
import { PayModal } from './PayModal.tsx';
import { PosBackendSettingsModal } from './PosBackendSettingsModal.jsx';
const KIOSK_W = 1080;
const KIOSK_H = 1920;
const PAGE_SIZE = 48;
const KIOSK_BASKET_SAVE_DEBOUNCE_MS = 500;

function parseKioskBasketLinesFromApi(lines) {
  if (!Array.isArray(lines)) return [];
  return lines
    .map((row) => {
      if (!row || typeof row !== 'object') return null;
      const lineId = String(row.lineId || '').trim();
      if (!lineId) return null;
      let qty = Math.floor(Number(row.quantity));
      if (!Number.isFinite(qty) || qty < 1) qty = 1;
      if (qty > 999) qty = 999;
      const ppp = Number(row.parentProductPrice);
      return {
        lineId,
        parentProductName: String(row.parentProductName || '').trim(),
        parentProductId: String(row.parentProductId || '').trim(),
        groupInstanceId: String(row.groupInstanceId || '').trim().slice(0, 128),
        parentProductPrice: Number.isFinite(ppp) ? ppp : 0,
        subproductId: row.subproductId,
        name: String(row.name || '').trim(),
        price: Number.isFinite(Number(row.price)) ? Number(row.price) : 0,
        quantity: qty,
        kioskPicture: String(row.kioskPicture || '').trim(),
        parentKioskPicture: String(row.parentKioskPicture || '').trim(),
      };
    })
    .filter(Boolean);
}

function formatKioskPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '€0,00';
  return `€${n.toFixed(2).replace('.', ',')}`;
}

/** `unlimited` / empty → no cap; `"1"`…`"10"` from product kiosk min/max subs. */
function parseKioskSubsLimit(raw) {
  if (raw == null) return null;
  const s = String(raw).trim().toLowerCase();
  if (s === '' || s === 'unlimited') return null;
  const n = parseInt(s, 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return Math.min(10, n);
}

function normalizeKioskSubPickLimits(product) {
  let min = parseKioskSubsLimit(product?.kioskMinSubs);
  let max = parseKioskSubsLimit(product?.kioskMaxSubs);
  if (min != null && max != null && max < min) max = min;
  return { min, max };
}

/** One line of min/max copy for a single kiosk group config (stepped subproduct UI). */
function kioskGroupPickHintLine(t, gc) {
  if (!gc) return '';
  const minG = parseKioskSubsLimit(gc.minKiosk);
  const maxG = parseKioskSubsLimit(gc.maxKiosk);
  if (minG != null && maxG != null) {
    if (minG === maxG) {
      return t('kiosk.subproductsPickExact', 'Select exactly {{n}} subproducts.').replace(/\{\{n\}\}/g, String(minG));
    }
    return t('kiosk.subproductsPickRange', 'Select between {{min}} and {{max}} subproducts.')
      .replace(/\{\{min\}\}/g, String(minG))
      .replace(/\{\{max\}\}/g, String(maxG));
  }
  if (minG != null) {
    return t('kiosk.subproductsPickMin', 'Select at least {{min}} subproducts.').replace(/\{\{min\}\}/g, String(minG));
  }
  if (maxG != null) {
    return t('kiosk.subproductsPickMax', 'You can select at most {{max}} subproducts.').replace(/\{\{max\}\}/g, String(maxG));
  }
  return '';
}

/** Kiosk product tile / basket: prefer kiosk image from configuration, then cash-register photo. */
function kioskProductPhotoPath(product) {
  if (!product || typeof product !== 'object') return '';
  const kiosk = String(product.kioskPicturePath ?? '').trim();
  const kassa = String(product.kassaPhotoPath ?? '').trim();
  return kiosk || kassa;
}

/** One card per OK press (not merged across the same product). Legacy lines: one card per row. */
function kioskBasketGroupKeyFromRow(row) {
  const gid = String(row.groupInstanceId || '').trim();
  if (gid) return `gi:${gid}`;
  return `line:${row.lineId}`;
}

function isKioskPlainProductGroup(lines) {
  const first = lines[0];
  return (
    lines.length === 1 &&
    first != null &&
    (first.subproductId === undefined ||
      first.subproductId === null ||
      String(first.subproductId).trim() === '')
  );
}

/** Order lines for POST /orders: parent base price once per kiosk group, merged into the first variant line’s unit price. */
function buildKioskOrderItems(lines) {
  const keyToRows = new Map();
  const keyOrder = [];
  for (const row of lines) {
    const key = kioskBasketGroupKeyFromRow(row);
    if (!keyToRows.has(key)) {
      keyToRows.set(key, []);
      keyOrder.push(key);
    }
    keyToRows.get(key).push(row);
  }
  const items = [];
  for (const key of keyOrder) {
    const groupLines = keyToRows.get(key);
    if (isKioskPlainProductGroup(groupLines)) {
      const row = groupLines[0];
      const nameSafe = String(row.name || '').replace(/[,;]/g, '.');
      items.push({
        productId: String(row.parentProductId).trim(),
        quantity: row.quantity ?? 1,
        price: roundCurrency(Number(row.price) || 0),
        notes: nameSafe ? `${nameSafe}::0` : null,
      });
      continue;
    }
    const parent = roundCurrency(Number(groupLines[0]?.parentProductPrice) || 0);
    groupLines.forEach((row, i) => {
      const nameSafe = String(row.name || '').replace(/[,;]/g, '.');
      const q = row.quantity ?? 1;
      const subUnit = roundCurrency(Number(row.price) || 0);
      const unit = i === 0 ? roundCurrency((parent + subUnit * q) / q) : subUnit;
      items.push({
        productId: String(row.parentProductId).trim(),
        quantity: q,
        price: unit,
        notes: nameSafe ? `${nameSafe}::0` : null,
      });
    });
  }
  return items;
}

/** Same contract as OrderPanel `printTicketAutomatically` (validates printer response). */
async function printKioskTicketAutomatically(targetOrderId, paymentBreakdown = null) {
  if (!targetOrderId) throw new Error('No order selected for printing.');
  const body = { orderId: targetOrderId };
  if (paymentBreakdown && typeof paymentBreakdown === 'object') body.paymentBreakdown = paymentBreakdown;
  const printRes = await fetch(`${API}/printers/receipt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const printData = await printRes.json().catch(() => ({}));
  if (!printRes.ok) {
    throw new Error(printData?.error || 'Automatic ticket print failed.');
  }
  if (printData?.success !== true || printData?.data?.printed !== true) {
    throw new Error(printData?.error || 'Printer did not confirm successful print.');
  }
  return printData?.data || {};
}

const FLY_DURATION_MS = 780;

/**
 * Animates a small clone from subproduct rect to basket rect; calls onComplete once.
 */
function flySubproductToBasket({ fromRect, toRect, imageSrc, onComplete }) {
  let finished = false;

  const w = Math.min(Math.max(fromRect.width * 0.45, 72), 120);
  const h = Math.min(Math.max(fromRect.height * 0.45, 72), 120);
  const startLeft = fromRect.left + (fromRect.width - w) / 2;
  const startTop = fromRect.top + (fromRect.height - h) / 2;

  const fromCx = fromRect.left + fromRect.width / 2;
  const fromCy = fromRect.top + fromRect.height / 2;
  const toCx = toRect.left + toRect.width / 2;
  const toCy = toRect.top + toRect.height / 2;
  const dx = toCx - fromCx;
  const dy = toCy - fromCy;
  const scaleEnd = Math.min(42 / w, 0.32);

  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = [
    'position:fixed',
    `left:${startLeft}px`,
    `top:${startTop}px`,
    `width:${w}px`,
    `height:${h}px`,
    'z-index:999999',
    'pointer-events:none',
    'border-radius:14px',
    'overflow:hidden',
    'background:transparent',
    `transition:transform ${FLY_DURATION_MS}ms cubic-bezier(0.25,0.46,0.45,0.94),opacity ${FLY_DURATION_MS}ms ease`,
    'transform:translate(0,0) scale(1)',
    'opacity:1',
  ].join(';');

  if (imageSrc) {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = '';
    img.draggable = false;
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block';
    el.appendChild(img);
  }

  document.body.appendChild(el);

  const finishOnce = () => {
    if (finished) return;
    finished = true;
    el.removeEventListener('transitionend', onEnd);
    el.remove();
    onComplete?.();
  };

  const onEnd = (e) => {
    if (e.propertyName !== 'transform') return;
    finishOnce();
  };
  el.addEventListener('transitionend', onEnd);

  window.setTimeout(() => finishOnce(), FLY_DURATION_MS + 200);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transform = `translate(${dx}px,${dy}px) scale(${scaleEnd})`;
      el.style.opacity = '0.85';
    });
  });
}

function getSubproductExtra() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('pos_subproduct_extra') : null;
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Kiosk subproduct image: path on the subproduct row, then Control `pos_subproduct_extra` by id.
 * (API Subproduct model has no image column; extras are the usual source.)
 */
function resolveSubproductKioskPicture(sp, extraMap) {
  if (!sp || typeof sp !== 'object') return '';
  const fromObj = String(sp.kioskPicture ?? '').trim();
  if (fromObj) return fromObj;
  const sid = sp.id;
  const map = extraMap ?? getSubproductExtra();
  if (sid != null && map && typeof map === 'object') {
    const ex = map[sid];
    if (ex && ex.kioskPicture != null) {
      const p = String(ex.kioskPicture).trim();
      if (p) return p;
    }
  }
  return '';
}

function hydrateSubproducts(list) {
  const extraMap = getSubproductExtra();
  return (Array.isArray(list) ? list : []).map((sp) => ({
    ...sp,
    kioskPicture: resolveSubproductKioskPicture(sp, extraMap),
  }));
}

function IconBasket({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function IconBack({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function IconTrash({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function IconCreditCard({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <path d="M1 10h22" />
    </svg>
  );
}

function IconKioskCheck({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function KioskView({
  categories,
  selectedCategoryId,
  onSelectCategory,
  products,
  fetchSubproductsForProduct,
  onClose,
  onBackToLanguage,
  onBasketClick,
  onBasketPay,
  onOpenConfiguration,
}) {
  const { t } = useLanguage();
  const tr = useMemo(
    () => (key, fallback) => {
      const v = t(key);
      return v === key ? fallback : v;
    },
    [t],
  );
  const [scale, setScale] = useState(1);
  const [page, setPage] = useState(0);
  const [subproductsByProductId, setSubproductsByProductId] = useState(() => new Map());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSubproductModal, setShowSubproductModal] = useState(false);
  const [subproductModalExiting, setSubproductModalExiting] = useState(false);
  const subproductModalExitingRef = useRef(false);
  const pendingAfterSubproductCloseRef = useRef(null);
  const [modalSubproducts, setModalSubproducts] = useState([]);
  const [loadingModalSubproducts, setLoadingModalSubproducts] = useState(false);
  /** Multi-select subproduct ids (string keys) in the kiosk subproduct modal */
  const [selectedSubproductIds, setSelectedSubproductIds] = useState(() => new Set());
  /** Per subproduct-group rules from Control “kiosk configuration” (API). */
  const [kioskGroupConfigByGroupId, setKioskGroupConfigByGroupId] = useState({});
  /** Stepped subproduct modal: one group index at a time. */
  const [subproductGroupStep, setSubproductGroupStep] = useState(0);
  const kioskDefaultsAppliedRef = useRef(false);
  /** Each confirmed subproduct line for the kiosk basket / order list */
  const [basketLines, setBasketLines] = useState([]);
  const basketLinesRef = useRef(basketLines);
  const [kioskBasketHydrated, setKioskBasketHydrated] = useState(false);
  const [showBasketModal, setShowBasketModal] = useState(false);
  const [basketModalExiting, setBasketModalExiting] = useState(false);
  const basketModalExitingRef = useRef(false);
  /** lineId awaiting delete confirmation (cancel order modal) */
  const [basketDeleteLineId, setBasketDeleteLineId] = useState(null);
  const [showClearBasketConfirm, setShowClearBasketConfirm] = useState(false);
  const [clearBasketConfirmLayerVisible, setClearBasketConfirmLayerVisible] = useState(false);
  const [clearBasketConfirmExiting, setClearBasketConfirmExiting] = useState(false);
  const clearBasketConfirmExitingRef = useRef(false);
  /** Same flow as OrderPanel “Pay differently” (shared PayDifferentlyModal). */
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [kioskPayModalTotal, setKioskPayModalTotal] = useState(0);
  const [kioskPaymentError, setKioskPaymentError] = useState('');
  const [kioskPaymentSuccess, setKioskPaymentSuccess] = useState('');
  const [paymentErrorLayerVisible, setPaymentErrorLayerVisible] = useState(false);
  const [paymentErrorExiting, setPaymentErrorExiting] = useState(false);
  const paymentErrorExitingRef = useRef(false);
  const paymentErrorNavigateAfterCloseRef = useRef(false);
  const [paymentSuccessLayerVisible, setPaymentSuccessLayerVisible] = useState(false);
  const [paymentSuccessExiting, setPaymentSuccessExiting] = useState(false);
  const paymentSuccessExitingRef = useRef(false);
  /** After order is paid, if printing fails, dismiss error then return to language picker. */
  const kioskPaidNavigateToLanguageRef = useRef(false);
  /** PayModal calls onClose after exit animation; do not clear success/error overlay until user taps OK. */
  const kioskPaymentResultPendingRef = useRef(false);
  const modalRequestIdRef = useRef(0);
  const categoriesListRef = useRef(null);
  const basketButtonRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [showBackendSettingsModal, setShowBackendSettingsModal] = useState(false);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const pageStart = page * PAGE_SIZE;
  const pageProducts = products.slice(pageStart, pageStart + PAGE_SIZE);

  const productPhotoById = useMemo(() => {
    const m = new Map();
    for (const p of products) {
      if (p?.id == null) continue;
      const path = kioskProductPhotoPath(p);
      if (path) m.set(String(p.id), path);
    }
    return m;
  }, [products]);

  /** Subproduct lines: never use parent photo as stand-in (shows wrong duplicate thumbs). */
  const resolveBasketLineThumbPic = useCallback(
    (row) => {
      const sid =
        row.subproductId !== undefined && row.subproductId !== null ? String(row.subproductId).trim() : '';
      const hasSub = sid !== '';
      const stored = String(row.kioskPicture || '').trim();

      if (hasSub) {
        if (stored) return stored;
        const extraMap = getSubproductExtra();
        const fromExtra = sid && extraMap?.[sid]?.kioskPicture != null ? String(extraMap[sid].kioskPicture).trim() : '';
        if (fromExtra) return fromExtra;
        const parentId = String(row.parentProductId || '').trim();
        let list = subproductsByProductId.get(parentId);
        if (list == null) {
          for (const k of subproductsByProductId.keys()) {
            if (String(k) === parentId) {
              list = subproductsByProductId.get(k);
              break;
            }
          }
        }
        if (Array.isArray(list)) {
          const sp = list.find((s) => s && String(s.id) === sid);
          if (sp) {
            const p = resolveSubproductKioskPicture(sp, extraMap);
            if (p) return p;
          }
        }
        return '';
      }

      if (stored) return stored;
      return (
        String(row.parentKioskPicture || '').trim() ||
        String(productPhotoById.get(String(row.parentProductId || '')) || '').trim()
      );
    },
    [subproductsByProductId, productPhotoById],
  );

  const updateScrollState = useCallback(() => {
    const el = categoriesListRef.current;
    if (!el) {
      setCanScrollUp(false);
      setCanScrollDown(false);
      return;
    }
    const maxScrollTop = el.scrollHeight - el.clientHeight;
    setCanScrollUp(el.scrollTop > 0);
    setCanScrollDown(maxScrollTop - el.scrollTop > 1);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [categories, updateScrollState]);

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

  /** 5 taps in bottom-right within 2s → configuration (staff). */
  const configTapRef = useRef({ count: 0, timerId: null });
  /** 5 taps on menu title within 2s → backend IP/port (same as language screen logo). */
  const backendMenuTitleTapRef = useRef({ count: 0, timerId: null });
  useEffect(() => {
    return () => {
      if (configTapRef.current.timerId != null) clearTimeout(configTapRef.current.timerId);
      if (backendMenuTitleTapRef.current.timerId != null) clearTimeout(backendMenuTitleTapRef.current.timerId);
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

  const handleMenuTitleBackendTap = useCallback(() => {
    const r = backendMenuTitleTapRef.current;
    if (r.timerId != null) clearTimeout(r.timerId);
    r.count += 1;
    if (r.count >= 5) {
      r.count = 0;
      r.timerId = null;
      setShowBackendSettingsModal(true);
      return;
    }
    r.timerId = window.setTimeout(() => {
      r.count = 0;
      r.timerId = null;
    }, 2000);
  }, []);

  const kioskBasketLoadOkRef = useRef(false);
  const kioskBasketLastSyncedJsonRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/settings/kiosk-basket`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        kioskBasketLoadOkRef.current = res.ok;
        const raw = data?.value?.lines;
        const lines = Array.isArray(raw) ? parseKioskBasketLinesFromApi(raw) : [];
        const json = JSON.stringify({ lines });
        kioskBasketLastSyncedJsonRef.current = json;
        setBasketLines(lines);
      } catch {
        kioskBasketLoadOkRef.current = false;
      } finally {
        if (!cancelled) setKioskBasketHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!kioskBasketHydrated) return undefined;
    const json = JSON.stringify({ lines: basketLines });
    if (json === kioskBasketLastSyncedJsonRef.current) return undefined;
    if (!kioskBasketLoadOkRef.current && basketLines.length === 0) return undefined;
    const handle = window.setTimeout(() => {
      fetch(`${API}/settings/kiosk-basket`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: { lines: basketLines } }),
      })
        .then(() => {
          kioskBasketLastSyncedJsonRef.current = json;
        })
        .catch(() => { });
    }, KIOSK_BASKET_SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [basketLines, kioskBasketHydrated]);

  useEffect(() => {
    setPage(0);
    modalRequestIdRef.current += 1;
    pendingAfterSubproductCloseRef.current = null;
    subproductModalExitingRef.current = false;
    setSubproductModalExiting(false);
    setSelectedProduct(null);
    setShowSubproductModal(false);
    setModalSubproducts([]);
    setLoadingModalSubproducts(false);
    setSelectedSubproductIds(new Set());
  }, [selectedCategoryId, products.length]);

  useEffect(() => {
    if (!selectedCategoryId || !products.length || !fetchSubproductsForProduct) {
      setSubproductsByProductId(new Map());
      return;
    }
    let cancelled = false;
    (async () => {
      const next = new Map();
      await Promise.all(
        products.map(async (p) => {
          const id = p?.id;
          if (id == null) return;
          try {
            const list = await fetchSubproductsForProduct(id);
            if (!cancelled) next.set(id, hydrateSubproducts(Array.isArray(list) ? list : []));
          } catch {
            if (!cancelled) next.set(id, []);
          }
        })
      );
      if (!cancelled) {
        setSubproductsByProductId(next);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedCategoryId, products, fetchSubproductsForProduct]);

  const scrollCategories = (direction) => {
    const el = categoriesListRef.current;
    if (!el) return;
    const amount = Math.max(80, Math.round(el.clientHeight * 0.35));
    el.scrollBy({ top: direction * amount, behavior: 'smooth' });
  };

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  const finalizeSubproductModalClose = useCallback(() => {
    if (!subproductModalExitingRef.current) return;
    subproductModalExitingRef.current = false;
    setSubproductModalExiting(false);
    setShowSubproductModal(false);
    setSelectedProduct(null);
    setModalSubproducts([]);
    setLoadingModalSubproducts(false);
    setSelectedSubproductIds(new Set());
    setSubproductGroupStep(0);
    const fn = pendingAfterSubproductCloseRef.current;
    pendingAfterSubproductCloseRef.current = null;
    fn?.();
  }, []);

  const beginSubproductModalExit = useCallback((afterClose) => {
    if (subproductModalExitingRef.current) return;
    subproductModalExitingRef.current = true;
    pendingAfterSubproductCloseRef.current = typeof afterClose === 'function' ? afterClose : null;
    setSubproductModalExiting(true);
  }, []);

  const closeSubproductModal = useCallback(() => {
    beginSubproductModalExit(null);
  }, [beginSubproductModalExit]);

  const handleSubproductPanelAnimationEnd = useCallback(
    (e) => {
      if (e.animationName !== 'kiosk-subproduct-modal-panel-out') return;
      finalizeSubproductModalClose();
    },
    [finalizeSubproductModalClose]
  );

  const toggleSubproductSelection = useCallback(
    (spId) => {
      const id = String(spId);
      const sp = modalSubproducts.find((x) => String(x.id) === id);
      const gid = sp ? String(sp.groupId || sp.group?.id || '') : '';
      const gc = kioskGroupConfigByGroupId[gid];
      const usePerGroup = Object.keys(kioskGroupConfigByGroupId).length > 0;
      const globalMax = normalizeKioskSubPickLimits(selectedProduct).max;

      const countInGroup = (set, g) =>
        modalSubproducts.filter(
          (o) => String(o.groupId || o.group?.id || '') === g && set.has(String(o.id))
        ).length;

      setSelectedSubproductIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          return next;
        }

        if (gc && gc.multiselect === false) {
          for (const o of modalSubproducts) {
            if (String(o.groupId || o.group?.id || '') === gid) next.delete(String(o.id));
          }
        }

        const perGroupMax = gc ? parseKioskSubsLimit(gc.maxKiosk) : null;
        const effectiveMax = usePerGroup ? perGroupMax : globalMax;
        if (effectiveMax != null) {
          const before = countInGroup(next, gid);
          if (before + 1 > effectiveMax) return prev;
        }

        next.add(id);
        return next;
      });
    },
    [selectedProduct, modalSubproducts, kioskGroupConfigByGroupId]
  );

  /** Product with no subproducts: one basket line (same shape as a sub line) + fly from tile image. */
  const addPlainProductToBasket = useCallback((product, tileEl) => {
    if (!product?.id) return;
    const baseTs = Date.now();
    const groupInstanceId = `kgi-${baseTs}-${Math.random().toString(36).slice(2, 11)}`;
    const parentProductPrice = roundCurrency(Number(product.price ?? 0));
    const pic = kioskProductPhotoPath(product);
    const lines = [
      {
        lineId: `k-${baseTs}-0-${Math.random().toString(36).slice(2, 9)}`,
        parentProductName: product.name ?? '',
        parentProductId: String(product.id),
        groupInstanceId,
        parentProductPrice,
        subproductId: undefined,
        name: product.name ?? '',
        price: parentProductPrice,
        kioskPicture: pic,
        parentKioskPicture: pic,
        quantity: 1,
      },
    ];

    const basketEl = basketButtonRef.current;
    const fromRect = tileEl?.getBoundingClientRect?.();
    const toRect = basketEl?.getBoundingClientRect();
    const pushLines = () => setBasketLines((prev) => [...prev, ...lines]);
    const canFly =
      fromRect &&
      toRect &&
      fromRect.width > 0 &&
      fromRect.height > 0 &&
      toRect.width > 0 &&
      toRect.height > 0;

    if (canFly) {
      const imageSrc = pic ? resolveMediaSrc(pic) : null;
      flySubproductToBasket({
        fromRect,
        toRect,
        imageSrc,
        onComplete: pushLines,
      });
    } else {
      pushLines();
    }
  }, []);

  const handleProductPress = useCallback(
    async (product, tileEl) => {
      if (!product?.id || !fetchSubproductsForProduct) return;
      const requestId = modalRequestIdRef.current + 1;
      modalRequestIdRef.current = requestId;
      kioskDefaultsAppliedRef.current = false;
      setSelectedSubproductIds(new Set());

      const cached = subproductsByProductId.get(product.id);
      const cachedList = Array.isArray(cached) ? cached : null;

      if (cachedList !== null) {
        if (cachedList.length === 0) {
          addPlainProductToBasket(product, tileEl);
          return;
        }
        setSelectedProduct(product);
        setModalSubproducts(cachedList);
        subproductModalExitingRef.current = false;
        setSubproductModalExiting(false);
        setShowSubproductModal(true);
        setLoadingModalSubproducts(false);
        return;
      }

      setSelectedProduct(product);
      setModalSubproducts([]);
      setLoadingModalSubproducts(true);
      subproductModalExitingRef.current = false;
      setSubproductModalExiting(false);
      setShowSubproductModal(false);
      try {
        const data = await fetchSubproductsForProduct(product.id);
        if (requestId !== modalRequestIdRef.current) return;
        const list = hydrateSubproducts(Array.isArray(data) ? data : []);
        setSubproductsByProductId((prev) => {
          const next = new Map(prev);
          next.set(product.id, list);
          return next;
        });
        setModalSubproducts(list);
        if (list.length === 0) {
          setSelectedProduct(null);
          addPlainProductToBasket(product, tileEl);
          return;
        }
        subproductModalExitingRef.current = false;
        setSubproductModalExiting(false);
        setShowSubproductModal(true);
      } catch {
        if (requestId !== modalRequestIdRef.current) return;
        setSelectedProduct(null);
        setModalSubproducts([]);
      } finally {
        if (requestId === modalRequestIdRef.current) setLoadingModalSubproducts(false);
      }
    },
    [fetchSubproductsForProduct, subproductsByProductId, addPlainProductToBasket]
  );

  const confirmSubproductModal = useCallback(() => {
    if (loadingModalSubproducts) return;
    const { min: minSel, max: maxSel } = normalizeKioskSubPickLimits(selectedProduct);
    const n = selectedSubproductIds.size;
    const usePerGroup = Object.keys(kioskGroupConfigByGroupId).length > 0;

    if (n === 0) {
      if (usePerGroup) {
        const anyMin = Object.values(kioskGroupConfigByGroupId).some(
          (gc) => gc && parseKioskSubsLimit(gc.minKiosk) != null
        );
        if (!anyMin) closeSubproductModal();
        return;
      }
      if (minSel == null) closeSubproductModal();
      return;
    }

    if (usePerGroup) {
      const seen = new Set();
      for (const sp of modalSubproducts) {
        const gid = String(sp.groupId || sp.group?.id || '');
        if (seen.has(gid)) continue;
        seen.add(gid);
        const gc = kioskGroupConfigByGroupId[gid];
        if (!gc) continue;
        const minG = parseKioskSubsLimit(gc.minKiosk);
        const maxG = parseKioskSubsLimit(gc.maxKiosk);
        const cnt = modalSubproducts.filter(
          (o) => String(o.groupId || o.group?.id || '') === gid && selectedSubproductIds.has(String(o.id))
        ).length;
        if (minG != null && cnt < minG) return;
        if (maxG != null && cnt > maxG) return;
      }
    } else {
      if (minSel != null && n < minSel) return;
      if (maxSel != null && n > maxSel) return;
    }

    const orderedSelected = modalSubproducts.filter((s) => selectedSubproductIds.has(String(s.id)));
    if (orderedSelected.length === 0) {
      closeSubproductModal();
      return;
    }

    const parentName = selectedProduct?.name ?? '';
    const parentProductId = selectedProduct?.id != null ? String(selectedProduct.id) : '';
    const baseTs = Date.now();
    const groupInstanceId = `kgi-${baseTs}-${Math.random().toString(36).slice(2, 11)}`;
    const parentProductPrice = roundCurrency(Number(selectedProduct?.price ?? 0));
    const parentPic = kioskProductPhotoPath(selectedProduct);
    const extraMap = getSubproductExtra();
    const lines = orderedSelected.map((sp, i) => ({
      lineId: `k-${baseTs}-${i}-${Math.random().toString(36).slice(2, 9)}`,
      parentProductName: parentName,
      parentProductId,
      groupInstanceId,
      parentProductPrice,
      subproductId: sp?.id,
      name: sp?.name ?? '',
      price: Number(sp?.price ?? 0),
      kioskPicture: resolveSubproductKioskPicture(sp, extraMap),
      parentKioskPicture: parentPic,
      quantity: 1,
    }));

    const firstSp = orderedSelected[0];
    const sourceEl = document.querySelector('[data-kiosk-selected-subproduct="true"]');
    const basketEl = basketButtonRef.current;
    const fromRect = sourceEl?.getBoundingClientRect();
    const toRect = basketEl?.getBoundingClientRect();

    beginSubproductModalExit(() => {
      const pushLines = () => setBasketLines((prev) => [...prev, ...lines]);
      const canFly =
        fromRect &&
        toRect &&
        fromRect.width > 0 &&
        fromRect.height > 0 &&
        toRect.width > 0 &&
        toRect.height > 0;

      if (canFly) {
        const imageSrc = parentPic
          ? resolveMediaSrc(parentPic)
          : firstSp?.kioskPicture
            ? resolveMediaSrc(String(firstSp.kioskPicture))
            : null;
        flySubproductToBasket({
          fromRect,
          toRect,
          imageSrc,
          onComplete: pushLines,
        });
      } else {
        pushLines();
      }
    });
  }, [
    loadingModalSubproducts,
    selectedSubproductIds,
    modalSubproducts,
    selectedProduct,
    closeSubproductModal,
    beginSubproductModalExit,
    kioskGroupConfigByGroupId
  ]);

  /** Parent product ids that already have at least one line in the basket (red frame on menu tiles). */
  const basketParentProductIds = useMemo(() => {
    const s = new Set();
    for (const row of basketLines) {
      const id = String(row.parentProductId || '').trim();
      if (id) s.add(id);
    }
    return s;
  }, [basketLines]);

  const basketCount = useMemo(
    () => basketLines.reduce((n, row) => n + (row.quantity ?? 1), 0),
    [basketLines]
  );

  /** One ticket card per basket “add” (same groupInstanceId); legacy rows each get their own card. */
  const basketGroups = useMemo(() => {
    const order = [];
    const map = new Map();
    for (const row of basketLines) {
      const key = kioskBasketGroupKeyFromRow(row);
      let g = map.get(key);
      if (!g) {
        const ppp = Number(row.parentProductPrice);
        g = {
          key,
          parentProductName: String(row.parentProductName || '').trim(),
          parentProductId: String(row.parentProductId || '').trim(),
          parentProductPrice: Number.isFinite(ppp) ? ppp : 0,
          lines: [],
        };
        map.set(key, g);
        order.push(g);
      }
      g.lines.push(row);
    }
    return order;
  }, [basketLines]);

  const basketTotal = useMemo(
    () =>
      basketGroups.reduce((sum, group) => {
        const linesSum = group.lines.reduce((s, row) => {
          const q = row.quantity ?? 1;
          const p = Number.isFinite(row.price) ? row.price : 0;
          return s + p * q;
        }, 0);
        if (isKioskPlainProductGroup(group.lines)) {
          return sum + linesSum;
        }
        return sum + group.parentProductPrice + linesSum;
      }, 0),
    [basketGroups]
  );

  const adjustBasketLineQty = useCallback((lineId, delta) => {
    setBasketLines((prev) =>
      prev
        .map((row) => {
          if (row.lineId !== lineId) return row;
          const q = row.quantity ?? 1;
          const next = q + delta;
          if (next < 1) return null;
          return { ...row, quantity: next };
        })
        .filter(Boolean)
    );
  }, []);

  const removeBasketLine = useCallback((lineId) => {
    setBasketLines((prev) => prev.filter((r) => r.lineId !== lineId));
  }, []);

  const closeBasketDeleteConfirm = useCallback(() => setBasketDeleteLineId(null), []);

  const confirmBasketLineDelete = useCallback(() => {
    if (basketDeleteLineId == null) return;
    removeBasketLine(basketDeleteLineId);
    setBasketDeleteLineId(null);
  }, [basketDeleteLineId, removeBasketLine]);

  const pendingDeleteLine = useMemo(
    () => (basketDeleteLineId ? basketLines.find((r) => r.lineId === basketDeleteLineId) : null),
    [basketDeleteLineId, basketLines]
  );

  const subproductsByGroup = useMemo(() => {
    if (!modalSubproducts.length) return [];
    const byGroup = new Map();
    for (const sp of modalSubproducts) {
      const gid = sp?.groupId || sp?.group?.id || '';
      const gname = sp?.group?.name || '';
      if (!byGroup.has(gid)) byGroup.set(gid, { groupName: gname, sortOrder: sp?.group?.sortOrder ?? 0, items: [] });
      byGroup.get(gid).items.push(sp);
    }
    return Array.from(byGroup.entries())
      .sort(
        (a, b) =>
          (a[1].sortOrder ?? 0) - (b[1].sortOrder ?? 0) || (a[1].groupName || '').localeCompare(b[1].groupName || '')
      )
      .map(([gid, data]) => ({ groupId: gid, groupName: data.groupName, items: data.items }));
  }, [modalSubproducts]);

  useEffect(() => {
    if (!showSubproductModal || !selectedProduct?.id) {
      setKioskGroupConfigByGroupId({});
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/products/${selectedProduct.id}/kiosk-group-configuration`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        const m = {};
        for (const s of data.steps || []) {
          if (s.groupId === null || s.groupId === undefined) continue;
          m[String(s.groupId)] = s.config;
        }
        setKioskGroupConfigByGroupId(m);
      } catch {
        if (!cancelled) setKioskGroupConfigByGroupId({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showSubproductModal, selectedProduct?.id]);

  useEffect(() => {
    if (!showSubproductModal || !modalSubproducts.length) return;
    if (!Object.keys(kioskGroupConfigByGroupId).length) return;
    if (kioskDefaultsAppliedRef.current) return;
    kioskDefaultsAppliedRef.current = true;
    const next = new Set();
    for (const s of modalSubproducts) {
      const gid = String(s.groupId || s.group?.id || '');
      const gc = kioskGroupConfigByGroupId[gid];
      const def = gc?.defaultSubproductId ? String(gc.defaultSubproductId).trim() : '';
      if (def && String(s.id) === def) next.add(String(s.id));
    }
    if (next.size) setSelectedSubproductIds(next);
  }, [showSubproductModal, modalSubproducts, kioskGroupConfigByGroupId]);

  const kioskSubPickLimits = useMemo(() => normalizeKioskSubPickLimits(selectedProduct), [selectedProduct]);

  const subproductSelectionHint = useMemo(() => {
    if (Object.keys(kioskGroupConfigByGroupId).length > 0) {
      return t(
        'kiosk.subproductsPerGroupHint',
        'Choose options in each section. Confirm when every section meets the minimum and maximum rules.'
      );
    }
    const { min, max } = kioskSubPickLimits;
    if (min == null && max == null) return '';
    if (min != null && max != null) {
      if (min === max) {
        return t('kiosk.subproductsPickExact', 'Select exactly {{n}} subproducts.').replace(/\{\{n\}\}/g, String(min));
      }
      return t('kiosk.subproductsPickRange', 'Select between {{min}} and {{max}} subproducts.')
        .replace(/\{\{min\}\}/g, String(min))
        .replace(/\{\{max\}\}/g, String(max));
    }
    if (min != null) {
      return t('kiosk.subproductsPickMin', 'Select at least {{min}} subproducts.').replace(/\{\{min\}\}/g, String(min));
    }
    return t('kiosk.subproductsPickMax', 'You can select at most {{max}} subproducts.').replace(/\{\{max\}\}/g, String(max));
  }, [kioskGroupConfigByGroupId, kioskSubPickLimits, t]);

  useEffect(() => {
    if (showSubproductModal) setSubproductGroupStep(0);
  }, [showSubproductModal, selectedProduct?.id]);

  useEffect(() => {
    if (!showSubproductModal || subproductsByGroup.length === 0) return;
    setSubproductGroupStep((s) => Math.min(s, Math.max(0, subproductsByGroup.length - 1)));
  }, [showSubproductModal, subproductsByGroup.length]);

  const subproductStepHint = useMemo(() => {
    const groups = subproductsByGroup;
    if (!groups.length) return '';
    const g = groups[subproductGroupStep];
    if (!g) return '';
    const gidStr = String(g.groupId ?? '');
    const gc = kioskGroupConfigByGroupId[gidStr];
    const usePerGroup = Object.keys(kioskGroupConfigByGroupId).length > 0;
    if (usePerGroup) {
      const line = kioskGroupPickHintLine(t, gc);
      if (line) return line;
      return t('kiosk.subproductsSectionHint', 'Choose the options you want in this section.');
    }
    if (subproductGroupStep === 0) return subproductSelectionHint;
    return '';
  }, [subproductsByGroup, subproductGroupStep, kioskGroupConfigByGroupId, subproductSelectionHint, t]);

  /** OK stays enabled whenever the modal is usable; min/max are enforced inside confirmSubproductModal. */
  const subproductModalOkBusy = loadingModalSubproducts || subproductModalExiting;

  const finalizeClearBasketConfirmClose = useCallback(() => {
    if (!clearBasketConfirmExitingRef.current) return;
    clearBasketConfirmExitingRef.current = false;
    setClearBasketConfirmExiting(false);
    setClearBasketConfirmLayerVisible(false);
  }, []);

  const beginClearBasketConfirmExit = useCallback(() => {
    if (clearBasketConfirmExitingRef.current || !clearBasketConfirmLayerVisible) return;
    clearBasketConfirmExitingRef.current = true;
    setClearBasketConfirmExiting(true);
  }, [clearBasketConfirmLayerVisible]);

  const handleClearBasketConfirmPanelAnimationEnd = useCallback(
    (e) => {
      if (e.target !== e.currentTarget) return;
      if (e.animationName !== 'kiosk-subproduct-modal-panel-out') return;
      finalizeClearBasketConfirmClose();
    },
    [finalizeClearBasketConfirmClose],
  );

  useLayoutEffect(() => {
    if (showClearBasketConfirm) {
      clearBasketConfirmExitingRef.current = false;
      setClearBasketConfirmExiting(false);
      setClearBasketConfirmLayerVisible(true);
    }
  }, [showClearBasketConfirm]);

  useEffect(() => {
    if (!showClearBasketConfirm && clearBasketConfirmLayerVisible && !clearBasketConfirmExitingRef.current) {
      beginClearBasketConfirmExit();
    }
  }, [showClearBasketConfirm, clearBasketConfirmLayerVisible, beginClearBasketConfirmExit]);

  const resetClearBasketConfirmModalImmediate = useCallback(() => {
    clearBasketConfirmExitingRef.current = false;
    setClearBasketConfirmExiting(false);
    setClearBasketConfirmLayerVisible(false);
    setShowClearBasketConfirm(false);
  }, []);

  const resetPaymentResultLayersImmediate = useCallback(() => {
    paymentErrorExitingRef.current = false;
    setPaymentErrorExiting(false);
    setPaymentErrorLayerVisible(false);
    paymentSuccessExitingRef.current = false;
    setPaymentSuccessExiting(false);
    setPaymentSuccessLayerVisible(false);
  }, []);

  const finalizePaymentErrorClose = useCallback(() => {
    if (!paymentErrorExitingRef.current) return;
    paymentErrorExitingRef.current = false;
    setPaymentErrorExiting(false);
    setPaymentErrorLayerVisible(false);
    setKioskPaymentError('');
    kioskPaidNavigateToLanguageRef.current = false;
    const go = paymentErrorNavigateAfterCloseRef.current;
    paymentErrorNavigateAfterCloseRef.current = false;
    if (go) {
      onBackToLanguage?.();
    }
  }, [onBackToLanguage]);

  const beginPaymentErrorExit = useCallback(() => {
    if (paymentErrorExitingRef.current || !paymentErrorLayerVisible) return;
    paymentErrorExitingRef.current = true;
    setPaymentErrorExiting(true);
  }, [paymentErrorLayerVisible]);

  const handlePaymentErrorPanelAnimationEnd = useCallback(
    (e) => {
      if (e.target !== e.currentTarget) return;
      if (e.animationName !== 'kiosk-subproduct-modal-panel-out') return;
      finalizePaymentErrorClose();
    },
    [finalizePaymentErrorClose],
  );

  const finalizePaymentSuccessClose = useCallback(() => {
    if (!paymentSuccessExitingRef.current) return;
    paymentSuccessExitingRef.current = false;
    setPaymentSuccessExiting(false);
    setPaymentSuccessLayerVisible(false);
    setKioskPaymentSuccess('');
    kioskPaymentResultPendingRef.current = false;
    setBasketLines([]);
    setBasketDeleteLineId(null);
    void (async () => {
      try {
        await fetch(`${API}/settings/kiosk-basket`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: { lines: [] } }),
        });
      } catch {
        /* ignore */
      }
      onBackToLanguage?.();
    })();
  }, [onBackToLanguage]);

  const beginPaymentSuccessExit = useCallback(() => {
    if (paymentSuccessExitingRef.current || !paymentSuccessLayerVisible) return;
    paymentSuccessExitingRef.current = true;
    setPaymentSuccessExiting(true);
  }, [paymentSuccessLayerVisible]);

  const handlePaymentSuccessPanelAnimationEnd = useCallback(
    (e) => {
      if (e.target !== e.currentTarget) return;
      if (e.animationName !== 'kiosk-subproduct-modal-panel-out') return;
      finalizePaymentSuccessClose();
    },
    [finalizePaymentSuccessClose],
  );

  useLayoutEffect(() => {
    if (kioskPaymentError) {
      paymentErrorExitingRef.current = false;
      setPaymentErrorExiting(false);
      setPaymentErrorLayerVisible(true);
    }
  }, [kioskPaymentError]);

  useEffect(() => {
    if (!kioskPaymentError && paymentErrorLayerVisible && !paymentErrorExitingRef.current) {
      beginPaymentErrorExit();
    }
  }, [kioskPaymentError, paymentErrorLayerVisible, beginPaymentErrorExit]);

  useLayoutEffect(() => {
    if (kioskPaymentSuccess) {
      paymentSuccessExitingRef.current = false;
      setPaymentSuccessExiting(false);
      setPaymentSuccessLayerVisible(true);
    }
  }, [kioskPaymentSuccess]);

  useEffect(() => {
    if (!kioskPaymentSuccess && paymentSuccessLayerVisible && !paymentSuccessExitingRef.current) {
      beginPaymentSuccessExit();
    }
  }, [kioskPaymentSuccess, paymentSuccessLayerVisible, beginPaymentSuccessExit]);

  const finalizeBasketModalClose = useCallback(() => {
    if (!basketModalExitingRef.current) return;
    basketModalExitingRef.current = false;
    setBasketModalExiting(false);
    setShowBasketModal(false);
    setBasketDeleteLineId(null);
    setShowClearBasketConfirm(false);
    setShowPaymentModal(false);
    setKioskPaymentError('');
    setKioskPaymentSuccess('');
    kioskPaymentResultPendingRef.current = false;
    kioskPaidNavigateToLanguageRef.current = false;
    resetPaymentResultLayersImmediate();
  }, [resetPaymentResultLayersImmediate]);

  const beginBasketModalExit = useCallback(() => {
    if (basketModalExitingRef.current) return;
    setBasketDeleteLineId(null);
    setShowClearBasketConfirm(false);
    setShowPaymentModal(false);
    setKioskPaymentError('');
    setKioskPaymentSuccess('');
    kioskPaymentResultPendingRef.current = false;
    kioskPaidNavigateToLanguageRef.current = false;
    resetPaymentResultLayersImmediate();
    basketModalExitingRef.current = true;
    setBasketModalExiting(true);
  }, [resetPaymentResultLayersImmediate]);

  const handleBasketSheetAnimationEnd = useCallback(
    (e) => {
      if (e.animationName !== 'kiosk-basket-sheet-out') return;
      finalizeBasketModalClose();
    },
    [finalizeBasketModalClose],
  );

  const closeBasketModal = useCallback(() => {
    beginBasketModalExit();
  }, [beginBasketModalExit]);

  const clearBasketLines = useCallback(() => {
    setBasketLines([]);
    setBasketDeleteLineId(null);
    setShowClearBasketConfirm(false);
  }, []);

  const openClearBasketConfirm = useCallback(() => {
    setBasketDeleteLineId(null);
    setShowPaymentModal(false);
    setShowClearBasketConfirm(true);
  }, []);

  const closeClearBasketConfirm = useCallback(() => setShowClearBasketConfirm(false), []);

  const onPaymentErrorOk = useCallback(() => {
    if (paymentErrorExiting) return;
    paymentErrorNavigateAfterCloseRef.current = kioskPaymentResultPendingRef.current;
    kioskPaymentResultPendingRef.current = false;
    beginPaymentErrorExit();
  }, [paymentErrorExiting, beginPaymentErrorExit]);

  const onPaymentSuccessOk = useCallback(() => {
    if (paymentSuccessExiting) return;
    beginPaymentSuccessExit();
  }, [paymentSuccessExiting, beginPaymentSuccessExit]);

  const openPaymentModal = useCallback(() => {
    setBasketDeleteLineId(null);
    setShowClearBasketConfirm(false);
    kioskPaymentResultPendingRef.current = false;
    setKioskPaymentError('');
    setKioskPaymentSuccess('');
    resetPaymentResultLayersImmediate();
    setKioskPayModalTotal(roundCurrency(basketTotal));
    setShowPaymentModal(true);
  }, [basketTotal, resetPaymentResultLayersImmediate]);

  const closePaymentModal = useCallback(() => {
    setShowPaymentModal(false);
    if (kioskPaymentResultPendingRef.current) return;
    kioskPaidNavigateToLanguageRef.current = false;
    setKioskPaymentError('');
    setKioskPaymentSuccess('');
  }, []);

  useEffect(() => {
    basketLinesRef.current = basketLines;
  }, [basketLines]);

  const settleKioskAfterPayment = useCallback(
    async (methods, amounts, modalTargetTotal) => {
      kioskPaidNavigateToLanguageRef.current = false;
      const lines = basketLinesRef.current;
      if (!lines.length) throw new Error(t('kiosk.basketEmpty'));

      for (const row of lines) {
        if (!String(row.parentProductId || '').trim()) {
          throw new Error(t('kiosk.basketPayMissingProduct'));
        }
      }

      const items = buildKioskOrderItems(lines);

      const createRes = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: null,
          kioskServiceType: loadKioskServiceType(),
          items,
        }),
      });
      const createData = await createRes.json().catch(() => ({}));
      if (!createRes.ok || !createData?.id) {
        throw new Error(createData?.error || t('kiosk.basketPayOrderFailed'));
      }

      const orderId = createData.id;
      const paymentBreakdown = buildPaymentBreakdown(methods, amounts);

      const patchRes = await fetch(`${API}/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'paid',
          ...(paymentBreakdown ? { paymentBreakdown } : {}),
        }),
      });
      const patchData = await patchRes.json().catch(() => ({}));
      if (!patchRes.ok) {
        throw new Error(patchData?.error || t('kiosk.basketPayOrderFailed'));
      }

      kioskPaidNavigateToLanguageRef.current = true;

      const modalTotal = roundCurrency(modalTargetTotal);
      const printAmounts = {};
      for (const m of methods) {
        const v = Number(amounts[m.id]) || 0;
        if (v > 0.0001) printAmounts[m.id] = v;
      }

      let printedSuccessfully = true;
      let printResult = null;
      try {
        printResult = await printKioskTicketAutomatically(
          orderId,
          Object.keys(printAmounts).length ? { amounts: printAmounts } : null,
        );
      } catch (printErr) {
        printedSuccessfully = false;
        kioskPaymentResultPendingRef.current = true;
        setKioskPaymentError(printErr?.message || t('kiosk.basketPrintFailed'));
      }

      onBasketPay?.({ lines: [...lines], total: modalTotal, orderId });

      if (printedSuccessfully) {
        kioskPaidNavigateToLanguageRef.current = false;
        kioskPaymentResultPendingRef.current = true;
        const methodLines = methods
          .map((m) => {
            const v = Number(amounts[m.id]) || 0;
            return v > 0.0001 ? `${m.name}: ${formatPaymentAmount(v)}` : null;
          })
          .filter(Boolean);
        setKioskPaymentSuccess(
          [
            `Payment successful (${formatPaymentAmount(modalTotal)}).`,
            methodLines.length ? methodLines.join(' | ') : '',
            `Receipt printed successfully${printResult?.printerName ? ` on ${printResult.printerName}` : ''}.`,
          ]
            .filter(Boolean)
            .join(' '),
        );
      }

      setShowPaymentModal(false);
      setBasketLines([]);
      setBasketDeleteLineId(null);
      resetClearBasketConfirmModalImmediate();
      basketModalExitingRef.current = false;
      setBasketModalExiting(false);
      setShowBasketModal(false);
    },
    [t, onBasketPay, resetClearBasketConfirmModalImmediate],
  );

  const openBasketModal = useCallback(() => {
    basketModalExitingRef.current = false;
    setBasketModalExiting(false);
    setShowBasketModal(true);
    onBasketClick?.();
  }, [onBasketClick]);

  const handleBack = onBackToLanguage ?? onClose;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      <div
        className="relative bg-white text-black shadow-2xl flex flex-col overflow-hidden"
        style={{
          width: KIOSK_W,
          height: KIOSK_H,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* <div className="flex items-center justify-center shrink-0">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-[400px] -mt-10 w-auto object-contain"
            draggable={false}
          />
        </div> */}
        <div className="flex flex-row  flex-1 min-h-0 min-w-0 overflow-hidden">
          <aside className="w-[300px] shrink-0 flex flex-col bg-white pb-3 px-2">
            <div className="flex h-[100px] items-center gap-3 p-2 min-w-0 bg-white">
              <button
                type="button"
                onClick={handleBack}
                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-md border border-black bg-white text-black active:bg-rose-500 active:text-white"
                aria-label={t('backName')}
              >
                <IconBack className="h-10 w-10" />
              </button>
              <h1
                className="min-w-0 flex-1 text-6xl font-semibold text-black truncate cursor-default select-none"
                onClick={handleMenuTitleBackendTap}
              >
                {t('kiosk.menuTitle')}
              </h1>
            </div>
            <div
              ref={categoriesListRef}
              onScroll={updateScrollState}
              className="scrollbar-hide flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-2"
            >
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  className={`px-3 py-3 rounded-lg text-2xl leading-tight min-h-[100px] max-h-[100px] text-center ${selectedCategoryId === cat.id
                    ? 'bg-rose-500 font-semibold text-white border-2 border-rose-500'
                    : 'bg-white text-black border border-transparent'
                    }`}
                  onClick={() => onSelectCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="flex gap-1 pt-2">
              <button
                type="button"
                onClick={() => scrollCategories(-1)}
                disabled={!canScrollUp}
                className={`flex-1 py-2 rounded-md border border-black text-4xl ${canScrollUp ? 'bg-white active:text-white active:border-white active:bg-rose-500' : 'opacity-40 cursor-not-allowed'
                  }`}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => scrollCategories(1)}
                disabled={!canScrollDown}
                className={`flex-1 py-2 rounded-md border border-black text-4xl ${canScrollDown ? 'bg-white active:text-white active:border-white active:bg-rose-500' : 'opacity-40 cursor-not-allowed'
                  }`}
              >
                ↓
              </button>
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            <div className="flex h-[100px] items-center justify-between px-3 py-2 shrink-0">
              <span className="text-6xl font-semibold text-black truncate">
                {categories.find((c) => c.id === selectedCategoryId)?.name ?? ''}
              </span>
              {totalPages > 1 ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={page <= 0}
                    className="px-3 py-1 rounded bg-white text-sm disabled:opacity-40"
                  >
                    ‹
                  </button>
                  <span className="text-sm text-black">
                    {page + 1}/{totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-1 rounded bg-white text-sm disabled:opacity-40"
                  >
                    ›
                  </button>
                </div>
              ) : null}
            </div>

            <div className="kiosk-scrollbar flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 pr-1">
              {!selectedCategoryId ? (
                <div className="flex items-center justify-center text-black text-lg min-h-[200px]">
                  {t('selectCategoryToSeeProducts')}
                </div>
              ) : products.length === 0 ? (
                <div className="flex items-center justify-center text-black text-lg min-h-[200px]">
                  {t('control.products.emptyInCategory')}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 content-start mt-1">
                  {pageProducts.map((product) => {
                    const productPic = kioskProductPhotoPath(product);
                    const pid = String(product.id ?? '').trim();
                    const inBasket = pid && basketParentProductIds.has(pid);
                    return (
                    <button
                      type="button"
                      key={product.id}
                      onClick={(e) => void handleProductPress(product, e.currentTarget)}
                      className={`flex flex-col items-center rounded-xl bg-white shadow-md p-3 text-center min-h-[200px] active:brightness-95 ${
                        inBasket
                          ? 'ring-4 ring-rose-500'
                          : selectedProduct?.id === product.id
                            ? 'ring-2 ring-rose-500'
                            : ''
                      }`}
                    >
                      <div className="flex flex-1 w-full min-h-[140px] max-h-[140px] items-center justify-center">
                        {productPic ? (
                          <img
                            src={resolveMediaSrc(productPic)}
                            alt={product.name}
                            className="max-h-[140px] max-w-full w-auto h-auto object-contain pointer-events-none"
                          />
                        ) : (
                          <div className="h-[140px] w-full rounded-lg bg-white" aria-hidden />
                        )}
                      </div>
                      <span className="mt-2 text-2xl font-semibold uppercase leading-tight text-black line-clamp-3">
                        {product.name}
                      </span>
                      <span className="mt-1 text-3xl font-semibold text-black">{formatKioskPrice(product.price)}</span>
                    </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="h-[300px] shrink-0 flex items-center justify-center  bg-white px-6">
          <button
            ref={basketButtonRef}
            type="button"
            onClick={openBasketModal}
            className="relative flex h-[min(220px,70%)] w-full max-w-xs flex-col items-center justify-center gap-3 rounded-2xl bg-white px-8 text-black shadow-lg active:bg-rose-500/20 active:brightness-95"
            aria-label={t('kiosk.basket')}
          >
            {basketCount > 0 ? (
              <span className="absolute right-6 top-4 flex h-14 min-w-[3.5rem] items-center justify-center rounded-full bg-rose-500 px-3 text-3xl font-bold text-white shadow-md">
                {basketCount > 99 ? '99+' : basketCount}
              </span>
            ) : (
              <span className="absolute right-6 top-4 flex h-14 min-w-[3.5rem] items-center justify-center rounded-full border-2 border-black bg-white px-3 text-3xl font-bold text-black">
                0
              </span>
            )}
            <IconBasket className="h-24 w-24 shrink-0 text-rose-500" />
            <span className="text-4xl font-semibold uppercase tracking-wide text-black">{t('kiosk.basket')}</span>
          </button>
        </footer>
        {onOpenConfiguration ? (
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute bottom-0 right-0 z-[130] h-[160px] w-[160px] border-0 bg-transparent p-0 cursor-default focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleConfigurationTapZone();
            }}
          />
        ) : null}
        <PosBackendSettingsModal
          open={showBackendSettingsModal}
          onClose={() => setShowBackendSettingsModal(false)}
          tr={tr}
          cancelLabel={t('cancel')}
          overlayClassName="absolute inset-0 z-[225] flex items-center justify-center bg-black/50 p-4"
        />
      </div>

      {showSubproductModal && selectedProduct && (
        <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-labelledby="kiosk-subproducts-title">
          <button
            type="button"
            tabIndex={-1}
            className={`kiosk-subproduct-modal-backdrop absolute inset-0 border-0 bg-black/50 p-0 cursor-default${subproductModalExiting ? ' kiosk-subproduct-modal-backdrop--exiting' : ''}`}
            aria-label={t('kiosk.close')}
            onClick={() => {
              if (!loadingModalSubproducts && !subproductModalExiting) closeSubproductModal();
            }}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
            <div
              className={`kiosk-subproduct-modal-panel kiosk-scrollbar relative min-h-[400px] max-h-[1400px] min-w-[95%] max-w-[95%] overflow-auto rounded-xl border border-black bg-white p-6 shadow-2xl${subproductModalExiting ? ' kiosk-subproduct-modal-panel--exiting pointer-events-none' : ' pointer-events-auto'}`}
              onClick={(e) => e.stopPropagation()}
              onAnimationEnd={handleSubproductPanelAnimationEnd}
            >
            <h3 id="kiosk-subproducts-title" className="flex py-10 text-6xl font-semibold w-full justify-center text-black min-w-0 pr-2">
              {selectedProduct.name}
            </h3>
            {subproductStepHint ? (
              <p className="px-4 pb-4 text-center text-3xl font-medium text-black" role="status">
                {subproductStepHint}
              </p>
            ) : null}
            <div className="space-y-6 pb-[200px]">
              {loadingModalSubproducts && modalSubproducts.length === 0 ? (
                <div className="py-8 text-center text-black">{t('processing')}</div>
              ) : null}
              {(() => {
                const entry = subproductsByGroup[subproductGroupStep];
                if (!entry) return null;
                const { groupId, groupName, items } = entry;
                const gidStr = String(groupId ?? '');
                const gc = kioskGroupConfigByGroupId[gidStr];
                const heading =
                  (gc?.title && String(gc.title).trim()) || groupName || t('control.sys.deposit.other');
                const usePerGroup = Object.keys(kioskGroupConfigByGroupId).length > 0;
                const perGroupMax = gc ? parseKioskSubsLimit(gc.maxKiosk) : null;
                const effectiveMax = usePerGroup ? perGroupMax : kioskSubPickLimits.max;
                return (
                  <div key={groupId} className="flex flex-col gap-3">
                    <h4 className="text-4xl font-semibold text-black mb-4">{heading}</h4>
                    <div className="grid grid-cols-3 gap-3 w-full">
                      {items.map((sp) => {
                        const selected = selectedSubproductIds.has(String(sp.id));
                        const countInGroup = items.filter((o) => selectedSubproductIds.has(String(o.id))).length;
                        const atMax =
                          effectiveMax != null && !selected && countInGroup >= effectiveMax;
                        return (
                          <button
                            key={sp.id}
                            type="button"
                            aria-pressed={selected}
                            aria-disabled={atMax || undefined}
                            onClick={() => toggleSubproductSelection(sp.id)}
                            {...(selected ? { 'data-kiosk-selected-subproduct': 'true' } : {})}
                            className={`relative flex flex-col items-center rounded-xl bg-white p-3 text-center min-h-[200px] active:brightness-95 ${selected ? 'ring-2 ring-rose-500' : ''
                              } ${atMax ? 'opacity-45 cursor-not-allowed' : ''}`}
                          >
                            {selected ? (
                              <span
                                className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-rose-500 text-white shadow-md"
                                aria-hidden
                              >
                                <IconKioskCheck className="h-7 w-7 text-white" />
                              </span>
                            ) : null}
                            <div className="flex flex-1 w-full min-h-[140px] max-h-[140px] items-center justify-center">
                              {sp.kioskPicture ? (
                                <img
                                  src={resolveMediaSrc(sp.kioskPicture)}
                                  alt={sp.name}
                                  className="max-h-[140px] max-w-full w-auto h-auto object-contain pointer-events-none"
                                />
                              ) : (
                                <div className="h-[140px] w-full rounded-lg bg-white" aria-hidden />
                              )}
                            </div>
                            <span className="mt-2 text-2xl font-semibold uppercase leading-tight text-black line-clamp-3">
                              {sp.name}
                            </span>
                            <span className="mt-1 text-3xl font-semibold text-black">
                              {formatKioskPrice(sp.price ?? 0)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-center justify-center gap-4 bg-white px-4 py-10">
              <button
                type="button"
                disabled={
                  subproductGroupStep <= 0 || loadingModalSubproducts || subproductModalExiting
                }
                className="h-[70px] min-w-[min(200px,28vw)] flex-1 max-w-[280px] rounded-lg border-2 border-black bg-white px-4 text-3xl font-semibold text-black active:bg-black/5 disabled:opacity-40"
                onClick={() => setSubproductGroupStep((s) => Math.max(0, s - 1))}
              >
                {t('backName')}
              </button>
              <button
                type="button"
                disabled={subproductModalOkBusy}
                className="h-[70px] min-w-[min(200px,28vw)] flex-1 max-w-[300px] rounded-lg bg-rose-500 px-4 text-4xl text-white active:bg-rose-500 disabled:opacity-50"
                onClick={confirmSubproductModal}
              >
                {t('ok')}
              </button>
              <button
                type="button"
                disabled={
                  subproductGroupStep >= subproductsByGroup.length - 1 ||
                  loadingModalSubproducts ||
                  subproductModalExiting ||
                  subproductsByGroup.length === 0
                }
                className="h-[70px] min-w-[min(200px,28vw)] flex-1 max-w-[280px] rounded-lg border-2 border-black bg-white px-4 text-3xl font-semibold text-black active:bg-black/5 disabled:opacity-40"
                onClick={() =>
                  setSubproductGroupStep((s) => Math.min(subproductsByGroup.length - 1, s + 1))
                }
              >
                {t('next')}
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {showBasketModal ? (
        <div
          className="fixed inset-0 z-[210] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kiosk-basket-title"
        >
          <button
            type="button"
            tabIndex={-1}
            className={`kiosk-basket-backdrop absolute inset-0 border-0 bg-black/60 p-0 cursor-default${basketModalExiting ? ' kiosk-basket-backdrop--exiting' : ''}`}
            aria-label={t('kiosk.close')}
            onClick={() => {
              if (!basketModalExiting) closeBasketModal();
            }}
          />
          <div className="pointer-events-none relative flex min-h-0 flex-1 flex-col justify-end">
            <div
              className={`kiosk-basket-sheet relative flex min-h-[700px] max-h-[1700px] min-h-0 w-full flex-col overflow-hidden rounded-t-3xl border-t border-x border-black bg-white shadow-[0_-12px_48px_rgba(0,0,0,0.45)]${basketModalExiting ? ' kiosk-basket-sheet--exiting pointer-events-none' : ' pointer-events-auto'}`}
              onClick={(e) => e.stopPropagation()}
              onAnimationEnd={handleBasketSheetAnimationEnd}
            >
            <div className="flex items-center justify-between gap-4 px-8 py-6 shrink-0">
              <div className="flex items-center gap-4 min-w-0">
                <IconBasket className="h-14 w-14 shrink-0 text-rose-500" />
                <h2 id="kiosk-basket-title" className="text-5xl font-semibold text-black truncate">
                  {t('kiosk.basket')}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeBasketModal}
                disabled={basketModalExiting}
                className="shrink-0 rounded-xl bg-white p-4 text-black active:bg-rose-500 active:text-white disabled:opacity-50"
                aria-label={t('kiosk.close')}
              >
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="kiosk-scrollbar flex min-h-[200px] flex-1 flex-col overflow-y-auto px-6 py-6">
              {basketLines.length === 0 ? (
                <p className="flex flex-1 items-center justify-center text-center text-3xl text-black">{t('kiosk.basketEmpty')}</p>
              ) : (
                <ul className="flex flex-col gap-5">
                  {basketGroups.map((group) => {
                    const title = group.parentProductName || t('kiosk.basketProductUnknown');
                    const firstRow = group.lines[0];
                    const isPlainProductOnly = isKioskPlainProductGroup(group.lines);

                    const renderLineRow = (row) => {
                      const qty = row.quantity ?? 1;
                      const unit = Number.isFinite(row.price) ? row.price : 0;
                      const lineSum = unit * qty;
                      const thumbPic = resolveBasketLineThumbPic(row);
                      return (
                        <li
                          key={row.lineId}
                          className="flex flex-wrap items-center gap-4 bg-white px-4 py-4 sm:gap-5 sm:px-5"
                        >
                          <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                            {thumbPic ? (
                              <img
                                src={resolveMediaSrc(thumbPic)}
                                alt=""
                                className="max-h-full max-w-full object-contain"
                                draggable={false}
                              />
                            ) : (
                              <div className="h-full w-full bg-white" aria-hidden />
                            )}
                          </div>
                          <div className="min-w-0 flex-1 basis-[40%]">
                            <p className="text-3xl font-semibold uppercase leading-tight text-black line-clamp-2">
                              {row.name}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <button
                              type="button"
                              onClick={() => adjustBasketLineQty(row.lineId, -1)}
                              className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-white text-4xl font-bold text-black active:bg-rose-500 active:text-white"
                              aria-label={t('kiosk.qtyDecrease')}
                            >
                              −
                            </button>
                            <span className="min-w-[3rem] text-center text-4xl font-semibold tabular-nums text-black">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => adjustBasketLineQty(row.lineId, 1)}
                              className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-white text-4xl font-bold text-black active:bg-rose-500 active:text-white"
                              aria-label={t('kiosk.qtyIncrease')}
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBasketDeleteLineId(row.lineId);
                              }}
                              className="ml-1 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-white text-black active:bg-rose-500 active:text-white"
                              aria-label={t('delete')}
                            >
                              <IconTrash className="h-8 w-8" />
                            </button>
                          </div>
                          <span className="ml-auto shrink-0 text-3xl font-semibold text-rose-500 sm:ml-0">
                            {formatKioskPrice(lineSum)}
                          </span>
                        </li>
                      );
                    };

                    if (isPlainProductOnly) {
                      const row = { ...firstRow, name: title };
                      return (
                        <li
                          key={group.key}
                          className="overflow-hidden rounded-2xl bg-white shadow-xl"
                        >
                          <ul className="divide-y divide-black">{renderLineRow(row)}</ul>
                        </li>
                      );
                    }

                    const parentHeaderThumb =
                      String(firstRow?.parentKioskPicture || '').trim() ||
                      String(productPhotoById.get(String(firstRow?.parentProductId || '')) || '').trim();

                    return (
                      <li
                        key={group.key}
                        className="overflow-hidden rounded-2xl bg-white shadow-xl"
                      >
                        <div className="flex items-center justify-between gap-4 bg-white px-5 py-4">
                          <div className="flex min-w-0 flex-1 items-center gap-4">
                            <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                              {parentHeaderThumb ? (
                                <img
                                  src={resolveMediaSrc(parentHeaderThumb)}
                                  alt=""
                                  className="max-h-full max-w-full object-contain"
                                  draggable={false}
                                />
                              ) : (
                                <div className="h-full w-full bg-white" aria-hidden />
                              )}
                            </div>
                            <p className="min-w-0 flex-1 text-4xl font-bold uppercase leading-tight text-black line-clamp-2">
                              {title}
                            </p>
                          </div>
                          <span className="shrink-0 text-3xl font-bold tabular-nums text-rose-500">
                            {formatKioskPrice(group.parentProductPrice)}
                          </span>
                        </div>
                        <ul className="divide-y border-l-4 border-rose-500 pl-1">
                          {group.lines.map((row) => renderLineRow(row))}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {basketLines.length > 0 ? (
              <div className="shrink-0 bg-white px-8 py-5">
                <div className="flex items-center justify-around gap-4">
                  <span className="text-5xl font-semibold text-black">{t('total')}</span>
                  <span className="text-6xl font-bold text-rose-500">{formatKioskPrice(basketTotal)}</span>
                </div>
              </div>
            ) : null}
            <div className="shrink-0 px-6 py-6 sm:px-8">
              <div className="mx-auto flex max-w-4xl flex-row justify-center gap-[100px]">
                <button
                  type="button"
                  onClick={openClearBasketConfirm}
                  disabled={basketLines.length === 0 || basketModalExiting}
                  className="min-h-[64px] flex flex-1 items-center justify-center gap-3 rounded-xl border-2 border-black bg-white px-8 py-4 text-3xl font-semibold text-black active:bg-rose-500 active:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[240px] sm:flex-none"
                >
                  <IconTrash className="h-9 w-9 shrink-0" />
                  {t('kiosk.basketClear')}
                </button>
                <button
                  type="button"
                  onClick={openPaymentModal}
                  disabled={basketLines.length === 0 || basketModalExiting}
                  className="min-h-[64px] flex flex-1 items-center justify-center gap-3 rounded-xl bg-rose-500 px-8 py-4 text-3xl font-semibold text-white active:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[240px] sm:flex-none"
                >
                  <IconCreditCard className="h-9 w-9 shrink-0" />
                  {t('kiosk.basketPay')}
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      ) : null}

      {basketDeleteLineId && pendingDeleteLine ? (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kiosk-basket-cancel-order-title"
          onClick={closeBasketDeleteConfirm}
        >
          <div
            className="w-full min-w-[80%] max-w-[80%] rounded-2xl border border-black bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="kiosk-basket-cancel-order-title" className="text-5xl w-full text-center font-semibold text-black">
              {t('kiosk.basketCancelOrderTitle')}
            </h3>
            <p className="mt-4 text-2xl leading-snug text-black w-full text-center">{t('kiosk.basketCancelOrderMessage')}</p>
            {pendingDeleteLine.parentProductName ? (
              <p className="mt-3 text-2xl text-black line-clamp-2 w-full text-center">{pendingDeleteLine.parentProductName}</p>
            ) : null}
            <p className="mt-2 text-3xl font-semibold uppercase text-black line-clamp-3 w-full text-center">{pendingDeleteLine.name}</p>
            <div className="mt-10 flex flex-col gap-[120px] sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={closeBasketDeleteConfirm}
                className="min-h-[64px] rounded-xl min-w-[200px] max-w-[200px] border-2 border-black bg-white px-8 text-2xl font-semibold text-black active:bg-rose-500 active:text-white"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={confirmBasketLineDelete}
                className="min-h-[64px] rounded-xl bg-rose-500 min-w-[200px] max-w-[200px] px-8 text-2xl font-semibold text-white active:brightness-90"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {clearBasketConfirmLayerVisible ? (
        <div
          className="fixed inset-0 z-[225] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kiosk-basket-clear-all-title"
        >
          <button
            type="button"
            tabIndex={-1}
            className={`kiosk-subproduct-modal-backdrop absolute inset-0 border-0 bg-black/50 p-0 cursor-default${clearBasketConfirmExiting ? ' kiosk-subproduct-modal-backdrop--exiting' : ''}`}
            aria-label={t('cancel')}
            onClick={() => {
              if (!clearBasketConfirmExiting) closeClearBasketConfirm();
            }}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
            <div
              className={`kiosk-subproduct-modal-panel w-full min-w-[80%] max-w-[80%] rounded-2xl border border-black bg-white p-8 shadow-2xl${clearBasketConfirmExiting ? ' kiosk-subproduct-modal-panel--exiting pointer-events-none' : ' pointer-events-auto'}`}
              onClick={(e) => e.stopPropagation()}
              onAnimationEnd={handleClearBasketConfirmPanelAnimationEnd}
            >
              <h3 id="kiosk-basket-clear-all-title" className="text-5xl w-full text-center font-semibold text-black">
                {t('kiosk.basketClearAllTitle')}
              </h3>
              <p className="mt-4 text-2xl leading-snug text-black w-full text-center">{t('kiosk.basketClearAllMessage')}</p>
              <div className="mt-10 flex flex-col gap-[120px] sm:flex-row sm:justify-center">
                <button
                  type="button"
                  disabled={clearBasketConfirmExiting}
                  onClick={closeClearBasketConfirm}
                  className="min-h-[64px] rounded-xl min-w-[200px] max-w-[200px] border-2 border-black bg-white px-8 text-2xl font-semibold text-black active:bg-rose-500 active:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  disabled={clearBasketConfirmExiting}
                  onClick={clearBasketLines}
                  className="min-h-[64px] rounded-xl bg-rose-500 min-w-[200px] max-w-[200px] px-8 text-2xl font-semibold text-white active:brightness-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t('kiosk.basketClearConfirm')}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <PayModal
        open={showPaymentModal}
        targetTotal={kioskPayModalTotal}
        onClose={closePaymentModal}
        onProceedAfterTerminals={settleKioskAfterPayment}
        onPaymentError={setKioskPaymentError}
        overlayClassName="z-[240]"
        payworldOverlayClassName="fixed inset-0 z-[245] flex items-center justify-center bg-black/60 p-4"
      />

      {paymentErrorLayerVisible ? (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kiosk-payment-error-title"
        >
          <div
            className={`kiosk-subproduct-modal-backdrop absolute inset-0 bg-black/50${paymentErrorExiting ? ' kiosk-subproduct-modal-backdrop--exiting' : ''}`}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
            <div
              className={`kiosk-subproduct-modal-panel bg-white rounded-lg shadow-xl px-10 py-8 max-w-4xl w-full mx-4 border border-black${paymentErrorExiting ? ' kiosk-subproduct-modal-panel--exiting pointer-events-none' : ' pointer-events-auto'}`}
              onClick={(e) => e.stopPropagation()}
              onAnimationEnd={handlePaymentErrorPanelAnimationEnd}
            >
              <h2 id="kiosk-payment-error-title" className="text-5xl mb-6 font-semibold text-black text-center">
                {t('paymentErrorTitle')}
              </h2>
              <p className="text-3xl text-black text-center mb-8">{kioskPaymentError}</p>
              <div className="flex justify-center">
                <button
                  type="button"
                  disabled={paymentErrorExiting}
                  className="w-[200px] py-4 bg-rose-500 text-white rounded-lg text-3xl active:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={onPaymentErrorOk}
                >
                  {t('ok')}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {paymentSuccessLayerVisible ? (
        <div
          className="fixed inset-0 z-[252] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kiosk-payment-success-title"
        >
          <div
            className={`kiosk-subproduct-modal-backdrop absolute inset-0 bg-black/50${paymentSuccessExiting ? ' kiosk-subproduct-modal-backdrop--exiting' : ''}`}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
            <div
              className={`kiosk-subproduct-modal-panel bg-white rounded-lg shadow-xl px-10 py-8 max-w-3xl w-full mx-4 border border-black${paymentSuccessExiting ? ' kiosk-subproduct-modal-panel--exiting pointer-events-none' : ' pointer-events-auto'}`}
              onClick={(e) => e.stopPropagation()}
              onAnimationEnd={handlePaymentSuccessPanelAnimationEnd}
            >
              <h2 id="kiosk-payment-success-title" className="text-5xl mb-6 font-semibold text-black text-center">
                {t('paymentSuccessfulTitle')}
              </h2>
              <p className="text-3xl text-black text-center mb-8">{kioskPaymentSuccess}</p>
              <div className="flex justify-center">
                <button
                  type="button"
                  disabled={paymentSuccessExiting}
                  className="w-[200px] py-4 bg-white text-black rounded text-3xl active:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={onPaymentSuccessOk}
                >
                  {t('ok')}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
