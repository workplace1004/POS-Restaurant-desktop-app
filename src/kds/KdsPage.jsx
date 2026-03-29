import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { KdsHeader } from './KdsHeader';
import { KdsSettingsModal } from './KdsSettingsModal';
import { ConsolidationSidebar } from './ConsolidationSidebar';
import { KdsOrderCard } from './KdsOrderCard';
import {
  aggregateConsolidationByCategory,
  buildSavedTableKitchenStartMap,
  getKitchenTimerStartAt,
  getVisibleItemIndicesForKitchen,
  isKitchenOrder,
  itemRowKey,
  LINE_STATUS
} from './kdsUtils';

const SAVED_POLL_MS = 2000;

const KDS_LINE_STATUS = new Set(['received', 'started', 'finished']);

function normalizeKdsLineStatesClient(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out = {};
  for (const [oid, lines] of Object.entries(raw)) {
    const orderId = String(oid || '').trim();
    if (!orderId || !lines || typeof lines !== 'object' || Array.isArray(lines)) continue;
    const inner = {};
    for (const [lk, st] of Object.entries(lines)) {
      const key = String(lk || '').trim();
      const status = String(st || '').trim();
      if (!key || !KDS_LINE_STATUS.has(status)) continue;
      inner[key] = status;
    }
    if (Object.keys(inner).length) out[orderId] = inner;
  }
  return out;
}

/** Seeded KDS admin login (Configuration); not a physical station — hide from KDS tabs and routing. */
const KDS_ADMIN_CREDENTIAL_KITCHEN_ID = 'kitchen-kds-admin';

function kitchensShownOnKds(list) {
  return (Array.isArray(list) ? list : []).filter((k) => k?.id && k.id !== KDS_ADMIN_CREDENTIAL_KITCHEN_ID);
}

const DISMISS_KEY = 'pos.kds.dismissedOrderIds';

/** Global dismiss (ALL tab) + per-kitchen `kitchenId::orderId` so stations stay independent. */
function loadDismissed() {
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const global = new Set();
    const byKitchen = new Set();
    for (const e of Array.isArray(arr) ? arr : []) {
      if (typeof e !== 'string' || !e) continue;
      if (e.includes('::')) byKitchen.add(e);
      else global.add(e);
    }
    return { global, byKitchen };
  } catch {
    return { global: new Set(), byKitchen: new Set() };
  }
}

function saveDismissed(global, byKitchen) {
  try {
    sessionStorage.setItem(DISMISS_KEY, JSON.stringify([...global, ...byKitchen]));
  } catch { /* ignore */ }
}

function isDismissedOnCurrentView(dismissed, orderId, activeTab) {
  if (!orderId || !dismissed) return false;
  if (dismissed.global.has(orderId)) return true;
  if (activeTab !== 'ALL' && dismissed.byKitchen.has(`${activeTab}::${orderId}`)) return true;
  return false;
}

/** Kitchen ids that have at least one routed line on this order (for ALL-tab dismiss sync). */
function kitchenIdsWithLinesForOrder(order, kitchens) {
  if (!order || !Array.isArray(kitchens)) return [];
  const ids = [];
  for (const k of kitchens) {
    if (k?.id && getVisibleItemIndicesForKitchen(order, k).length > 0) ids.push(k.id);
  }
  return ids;
}

/** Hide on ALL when globally dismissed, or every kitchen that owns a line has tapped Bon klaar. */
function isOrderHiddenOnAllOverview(dismissed, order, kitchens) {
  if (!order?.id || !dismissed) return false;
  if (dismissed.global.has(order.id)) return true;
  const kids = kitchenIdsWithLinesForOrder(order, kitchens);
  if (kids.length === 0) return false;
  return kids.every((kid) => dismissed.byKitchen.has(`${kid}::${order.id}`));
}

const DISMISS_BROADCAST = 'pos-kds-dismissed';

function broadcastDismissed(globalSet, byKitchenSet) {
  try {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(DISMISS_BROADCAST);
    ch.postMessage({
      global: [...globalSet],
      byKitchen: [...byKitchenSet]
    });
    ch.close();
  } catch {
    /* ignore */
  }
}

export function KdsPage({
  orders = [],
  fetchOrders,
  onBack,
  socket,
  currentUser,
  /** `/api` or full prefix e.g. `http://host:5000/api` (standalone KDS remote backend). */
  apiPrefix = '/api',
  standalone = false,
  /** When set (standalone login), this station only sees its kitchen — no ALL / other tabs. */
  stationKitchenId = null,
  stationKitchenName = null,
  /** Standalone app: logged in as admin kitchen — ALL + tabs + Sign out (not single-station lock). */
  standaloneAdminSession = false,
  onStationLogout,
  /** Standalone KDS: kitchen id for settings PIN (same as login). */
  loggedInKitchenId = null,
  loggedInKitchenName = null
}) {
  const { t } = useLanguage();
  const tableDisplayName = useCallback(
    (order) => {
      const tbl = order?.table;
      if (tbl?.name) return t('kds.tableWithName').replace('{name}', String(tbl.name));
      if (order?.tableId) return t('kds.table');
      return t('kds.pickupNoTable');
    },
    [t]
  );

  const [activeTab, setActiveTab] = useState(() => stationKitchenId || 'ALL');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [kitchens, setKitchens] = useState([]);
  const [dismissed, setDismissed] = useState(loadDismissed);
  /** orderId → lineKey → LINE_STATUS (synced with KdsOrderCard; red = finished) */
  const [lineStatesByOrder, setLineStatesByOrder] = useState(() => ({}));

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(DISMISS_BROADCAST);
    ch.onmessage = (ev) => {
      const g = ev.data?.global;
      const b = ev.data?.byKitchen;
      if (!Array.isArray(g) || !Array.isArray(b)) return;
      const nextGlobal = new Set(g);
      const nextByKitchen = new Set(b);
      saveDismissed(nextGlobal, nextByKitchen);
      setDismissed({ global: nextGlobal, byKitchen: nextByKitchen });
    };
    return () => ch.close();
  }, []);
  const [savedKitchenStartByOrderId, setSavedKitchenStartByOrderId] = useState(() => new Map());
  const [online, setOnline] = useState(() => !!socket?.connected);

  const canOpenKdsSettings =
    standalone && Boolean(loggedInKitchenId) && Boolean(onStationLogout);

  const api = useMemo(
    () => ({
      tableSavedOrders: `${apiPrefix}/settings/table-saved-orders`,
      kdsLineStates: `${apiPrefix}/settings/kds-line-states`,
      kdsDismissed: `${apiPrefix}/settings/kds-dismissed`,
      kitchens: `${apiPrefix}/kitchens`
    }),
    [apiPrefix]
  );

  const fetchTableSavedOrders = useCallback(async () => {
    try {
      const res = await fetch(api.tableSavedOrders);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return;
      setSavedKitchenStartByOrderId(buildSavedTableKitchenStartMap(data?.value));
    } catch {
      /* ignore */
    }
  }, [api.tableSavedOrders]);

  const fetchKdsLineStates = useCallback(async () => {
    try {
      const res = await fetch(api.kdsLineStates);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return;
      const v = data?.value && typeof data.value === 'object' ? data.value : {};
      setLineStatesByOrder(normalizeKdsLineStatesClient(v));
    } catch {
      /* ignore */
    }
  }, [api.kdsLineStates]);

  const fetchKdsDismissed = useCallback(async () => {
    try {
      const res = await fetch(api.kdsDismissed);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return;
      const v = data?.value && typeof data.value === 'object' ? data.value : {};
      const serverG = Array.isArray(v.global) ? v.global.map(String).filter(Boolean) : [];
      const serverB = Array.isArray(v.byKitchen) ? v.byKitchen.map(String).filter(Boolean) : [];
      setDismissed((prev) => {
        const g = new Set([...prev.global, ...serverG]);
        const b = new Set([...prev.byKitchen, ...serverB]);
        const next = { global: g, byKitchen: b };
        saveDismissed(g, b);
        const serverGset = new Set(serverG);
        const serverBset = new Set(serverB);
        const needPush =
          [...prev.global].some((x) => !serverGset.has(x)) ||
          [...prev.byKitchen].some((x) => !serverBset.has(x));
        if (needPush) {
          const payload = { global: [...g], byKitchen: [...b] };
          queueMicrotask(() => {
            fetch(api.kdsDismissed, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ value: payload })
            }).catch(() => {});
          });
        }
        return next;
      });
    } catch {
      /* ignore */
    }
  }, [api.kdsDismissed]);

  const patchKdsDismissedRemote = useCallback(async (tab, orderId) => {
    if (!orderId) return;
    try {
      const body =
        tab === 'ALL'
          ? { addGlobal: [String(orderId)] }
          : { addByKitchen: [`${tab}::${orderId}`] };
      await fetch(api.kdsDismissed, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch {
      /* ignore */
    }
  }, [api.kdsDismissed]);

  const fetchKitchens = useCallback(async () => {
    try {
      const res = await fetch(api.kitchens);
      const data = await res.json().catch(() => []);
      if (!res.ok) return;
      setKitchens(kitchensShownOnKds(data));
    } catch {
      setKitchens([]);
    }
  }, [api.kitchens]);

  useEffect(() => {
    fetchOrders?.();
  }, [fetchOrders]);

  useEffect(() => {
    fetchKitchens();
  }, [fetchKitchens]);

  useEffect(() => {
    fetchTableSavedOrders();
  }, [fetchTableSavedOrders]);

  useEffect(() => {
    fetchKdsLineStates();
  }, [fetchKdsLineStates]);

  useEffect(() => {
    fetchKdsDismissed();
  }, [fetchKdsDismissed]);

  useEffect(() => {
    const id = setInterval(() => {
      fetchTableSavedOrders();
      fetchKdsDismissed();
    }, SAVED_POLL_MS);
    return () => clearInterval(id);
  }, [fetchTableSavedOrders, fetchKdsDismissed]);

  useEffect(() => {
    if (!socket?.on) return;
    const sync = () => {
      setOnline(!!socket.connected);
      if (socket.connected) {
        fetchKdsLineStates();
        fetchKdsDismissed();
      }
    };
    socket.on('connect', sync);
    socket.on('disconnect', sync);
    sync();
    return () => {
      socket.off('connect', sync);
      socket.off('disconnect', sync);
    };
  }, [socket, fetchKdsLineStates, fetchKdsDismissed]);

  useEffect(() => {
    if (!socket?.on) return;
    const onDismissed = (payload) => {
      const g = payload?.global;
      const b = payload?.byKitchen;
      if (!Array.isArray(g) || !Array.isArray(b)) return;
      const ng = new Set(g.map(String).filter(Boolean));
      const nb = new Set(b.map(String).filter(Boolean));
      saveDismissed(ng, nb);
      setDismissed({ global: ng, byKitchen: nb });
    };
    socket.on('kds:dismissed', onDismissed);
    return () => {
      socket.off('kds:dismissed', onDismissed);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket?.on) return;
    const refreshSaved = () => {
      fetchTableSavedOrders();
    };
    socket.on('order:updated', refreshSaved);
    socket.on('orders:cleared', refreshSaved);
    return () => {
      socket.off('order:updated', refreshSaved);
      socket.off('orders:cleared', refreshSaved);
    };
  }, [socket, fetchTableSavedOrders]);

  useEffect(() => {
    if (!socket?.on) return;
    const onKitchensUpdated = () => {
      fetchKitchens();
    };
    const onConnect = () => {
      fetchKitchens();
    };
    socket.on('kitchens:updated', onKitchensUpdated);
    socket.on('connect', onConnect);
    return () => {
      socket.off('kitchens:updated', onKitchensUpdated);
      socket.off('connect', onConnect);
    };
  }, [socket, fetchKitchens]);

  useEffect(() => {
    if (!socket?.on) return;
    const onLineStates = (payload) => {
      if (!payload || typeof payload !== 'object') return;
      if (payload.replace === true) {
        setLineStatesByOrder(normalizeKdsLineStatesClient(payload.value));
        return;
      }
      if (payload.removeOrder === true && payload.orderId) {
        setLineStatesByOrder((prev) => {
          if (!prev[payload.orderId]) return prev;
          const next = { ...prev };
          delete next[payload.orderId];
          return next;
        });
        return;
      }
      if (payload.orderId && payload.lines && typeof payload.lines === 'object') {
        setLineStatesByOrder((prev) => ({
          ...prev,
          [payload.orderId]: { ...(prev[payload.orderId] || {}), ...payload.lines }
        }));
      }
    };
    socket.on('kds:line-states', onLineStates);
    return () => {
      socket.off('kds:line-states', onLineStates);
    };
  }, [socket]);

  useEffect(() => {
    if (stationKitchenId) {
      setActiveTab(stationKitchenId);
      return;
    }
    if (activeTab === 'ALL') return;
    if (kitchens.length === 0 || !kitchens.some((k) => k.id === activeTab)) {
      setActiveTab('ALL');
    }
  }, [kitchens, activeTab, stationKitchenId]);

  const activeKitchen = useMemo(() => {
    if (stationKitchenId) {
      return kitchens.find((k) => k.id === stationKitchenId) ?? null;
    }
    if (activeTab === 'ALL') return null;
    return kitchens.find((k) => k.id === activeTab) ?? null;
  }, [activeTab, kitchens, stationKitchenId]);

  const visibleOrders = useMemo(() => {
    let list = (orders || []).filter((o) => isKitchenOrder(o, savedKitchenStartByOrderId));
    const tabForDismiss = stationKitchenId || activeTab;
    list = list.filter((o) => {
      if (stationKitchenId) {
        return !isDismissedOnCurrentView(dismissed, o.id, tabForDismiss);
      }
      if (activeTab === 'ALL') {
        return !isOrderHiddenOnAllOverview(dismissed, o, kitchens);
      }
      return !isDismissedOnCurrentView(dismissed, o.id, tabForDismiss);
    });
    if (stationKitchenId) {
      if (!activeKitchen) return [];
      return list.filter((o) => getVisibleItemIndicesForKitchen(o, activeKitchen).length > 0);
    }
    if (activeTab === 'ALL' || !activeKitchen) return list;
    return list.filter((o) => getVisibleItemIndicesForKitchen(o, activeKitchen).length > 0);
  }, [orders, dismissed, activeTab, activeKitchen, savedKitchenStartByOrderId, stationKitchenId, kitchens]);

  useEffect(() => {
    const validOrderIds = new Set((orders || []).map((o) => o?.id).filter(Boolean));
    setLineStatesByOrder((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        if (!validOrderIds.has(k)) {
          delete next[k];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [orders]);

  const patchKdsLineStatesRemote = useCallback(async (orderId, lines) => {
    try {
      await fetch(api.kdsLineStates, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, lines })
      });
    } catch {
      /* ignore */
    }
  }, [api.kdsLineStates]);

  const handleLineStateChange = useCallback(
    (orderId, updater) => {
      setLineStatesByOrder((prev) => {
        const prevOrder = { ...(prev[orderId] ?? {}) };
        const nextOrder = typeof updater === 'function' ? updater(prevOrder) : updater;
        const next = { ...prev, [orderId]: nextOrder };
        patchKdsLineStatesRemote(orderId, nextOrder);
        return next;
      });
    },
    [patchKdsLineStatesRemote]
  );

  const consolidationGroups = useMemo(() => {
    const includeLine =
      activeKitchen != null
        ? (order, item, index) => {
            const vis = getVisibleItemIndicesForKitchen(order, activeKitchen);
            return new Set(vis).has(index);
          }
        : undefined;
    return aggregateConsolidationByCategory(
      visibleOrders,
      (order, item, index) => {
        const key = itemRowKey(order?.id, item, index);
        const st = lineStatesByOrder[order?.id]?.[key] ?? LINE_STATUS.received;
        return st === LINE_STATUS.finished;
      },
      includeLine
    );
  }, [visibleOrders, lineStatesByOrder, activeKitchen]);

  const handleBonKlaar = useCallback(
    (orderId) => {
      if (!orderId) return;
      setDismissed((prev) => {
        const nextGlobal = new Set(prev.global);
        const nextByKitchen = new Set(prev.byKitchen);
        const tab = stationKitchenId || activeTab;
        if (tab === 'ALL') nextGlobal.add(orderId);
        else nextByKitchen.add(`${tab}::${orderId}`);
        saveDismissed(nextGlobal, nextByKitchen);
        broadcastDismissed(nextGlobal, nextByKitchen);
        patchKdsDismissedRemote(tab, orderId);
        return { global: nextGlobal, byKitchen: nextByKitchen };
      });
    },
    [activeTab, stationKitchenId, patchKdsDismissedRemote]
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#f0f0f0] text-neutral-900">
      <KdsHeader
        kitchens={kitchens}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        online={online}
        stationKitchen={
          stationKitchenId
            ? {
                id: stationKitchenId,
                name:
                  stationKitchenName ||
                  kitchens.find((k) => k.id === stationKitchenId)?.name ||
                  stationKitchenId
              }
            : null
        }
        standaloneAdminSession={standaloneAdminSession}
        onStationLogout={onStationLogout}
        onSettingsClick={canOpenKdsSettings ? () => setSettingsOpen(true) : undefined}
      />
      <div className="flex min-h-0 flex-1 gap-3 p-3">
        <ConsolidationSidebar groups={consolidationGroups} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
          <div className="flex shrink-0 items-center justify-between gap-2">
            {standalone ? (
              <span className="text-sm font-medium text-neutral-500">{t('kds.kitchenDisplay')}</span>
            ) : onBack ? (
              <button
                type="button"
                onClick={() => onBack()}
                className="rounded-lg bg-[#2d2d2d] px-3 py-2 text-sm font-semibold text-white hover:bg-[#3d3d3d]"
              >
                {t('kds.backToPos')}
              </button>
            ) : null}
            {currentUser?.label ? (
              <span className="text-sm text-neutral-600">{currentUser.label}</span>
            ) : null}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
            {visibleOrders.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white/60 p-8 text-neutral-500 text-center px-4">
                {t('kds.emptyOrders')}
              </div>
            ) : (
              <div className="flex flex-wrap content-start gap-4 pb-4">
                {visibleOrders.map((order) => (
                  <KdsOrderCard
                    key={order.id}
                    order={order}
                    readOnly={standaloneAdminSession}
                    visibleItemIndices={activeKitchen ? getVisibleItemIndicesForKitchen(order, activeKitchen) : null}
                    tableLabel={tableDisplayName(order)}
                    staffName={order?.user?.name || t('kds.staffFallback')}
                    timerStartAt={getKitchenTimerStartAt(order, savedKitchenStartByOrderId)}
                    onBonKlaar={standaloneAdminSession ? undefined : handleBonKlaar}
                    lineState={lineStatesByOrder[order.id]}
                    onLineStateChange={standaloneAdminSession ? undefined : handleLineStateChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {canOpenKdsSettings ? (
        <KdsSettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          apiPrefix={apiPrefix}
          kitchenId={loggedInKitchenId}
          kitchenName={loggedInKitchenName || undefined}
        />
      ) : null}
    </div>
  );
}
