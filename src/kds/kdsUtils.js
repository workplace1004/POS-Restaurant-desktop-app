/** Parse subproduct tokens from order item notes (same convention as OrderPanel). */
export function parseItemNotes(item) {
  const parseNoteToken = (token) => {
    const raw = String(token || '').trim();
    if (!raw) return null;
    const [labelPart, pricePart] = raw.split('::');
    const label = String(labelPart || '').trim();
    if (!label) return null;
    if (pricePart == null) return { label, price: 0 };
    const parsed = Number(pricePart);
    if (!Number.isFinite(parsed)) return { label, price: 0 };
    return { label, price: parsed };
  };
  return String(item?.notes || '')
    .split(/[;,]/)
    .map((n) => parseNoteToken(n))
    .filter(Boolean);
}

export function getItemLabel(item) {
  return item?.product?.name ?? '—';
}

/** Category for KDS grouping; falls back when API omits nested category. */
export function getItemCategoryMeta(item) {
  const c = item?.product?.category;
  if (c && typeof c === 'object') {
    const name = String(c.name || '').trim() || '—';
    const sortOrder = Number.isFinite(Number(c.sortOrder)) ? Number(c.sortOrder) : 0;
    const id = String(c.id || name);
    return { id, name, sortOrder };
  }
  return { id: '__other', name: 'Overig', sortOrder: 99999 };
}

export function getItemQuantity(item) {
  return Math.max(1, Number(item?.quantity) || 1);
}

export function getProductIdFromOrderItem(item) {
  const id = item?.productId ?? item?.product?.id;
  return id != null && id !== '' ? String(id) : null;
}

/** Set of product ids assigned to a kitchen (Control → Set product). */
export function getKitchenProductIdSet(kitchen) {
  return new Set((Array.isArray(kitchen?.productIds) ? kitchen.productIds : []).map((x) => String(x)));
}

/**
 * Indices of order lines to show on this kitchen's KDS: matching products plus course headers
 * when this station has at least one matching line.
 */
export function getVisibleItemIndicesForKitchen(order, kitchen) {
  const items = order?.items ?? [];
  if (!kitchen || items.length === 0) return items.map((_, i) => i);

  const idSet = getKitchenProductIdSet(kitchen);
  if (idSet.size === 0) return [];

  const flags = items.map((item) => {
    const name = getItemLabel(item);
    if (getLineStyle(name) === 'course') return 'course';
    const pid = getProductIdFromOrderItem(item);
    return pid && idSet.has(pid) ? 'match' : 'skip';
  });

  if (!flags.some((f) => f === 'match')) return [];

  return items
    .map((_, index) => {
      const f = flags[index];
      if (f === 'match' || f === 'course') return index;
      return -1;
    })
    .filter((i) => i >= 0);
}

const DRINK_KEYWORDS = /\b(cola|fanta|sprite|water|bier|wine|wijn|thee|coffee|koffie|drank|juice|sap|red bull|monster)\b/i;

export function getLineStyle(productName) {
  const n = String(productName || '').trim();
  if (/^\*+[\s\S]*\*+$/.test(n) || /^\*{3,}/.test(n)) {
    return 'course';
  }
  if (/\bV\.?\s*G\.?\b|\bHG\b|voorgerecht|hoofdgerecht/i.test(n)) {
    return 'course';
  }
  if (DRINK_KEYWORDS.test(n)) {
    return 'drink';
  }
  return 'food';
}

export function formatElapsed(createdAt) {
  const start = new Date(createdAt || Date.now()).getTime();
  if (Number.isNaN(start)) return '00:00';
  const sec = Math.max(0, Math.floor((Date.now() - start) / 1000));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Stable key for a line item (matches KdsOrderCard). */
export function itemRowKey(orderId, item, index) {
  return item?.id || `fallback-${orderId ?? 'o'}-${index}`;
}

/** KDS line workflow: black (received) → green (started) → red (finished) */
export const LINE_STATUS = {
  received: 'received',
  started: 'started',
  finished: 'finished'
};

/**
 * Aggregate { name -> qty } for consolidation panel.
 * @param {(order: object, item: object, index: number) => boolean} [isLineFinished] — if true, line is excluded (red / done).
 * @param {(order: object, item: object, index: number) => boolean} [includeLine] — if false, line is excluded (e.g. wrong kitchen station).
 */
export function aggregateConsolidation(orders, isLineFinished, includeLine) {
  const map = new Map();
  for (const order of orders || []) {
    const items = order?.items || [];
    items.forEach((item, index) => {
      if (includeLine && !includeLine(order, item, index)) return;
      if (isLineFinished?.(order, item, index)) return;
      const name = getItemLabel(item);
      const q = getItemQuantity(item);
      map.set(name, (map.get(name) || 0) + q);
    });
  }
  return Array.from(map.entries())
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Like aggregateConsolidation, but grouped by product category (category sort order, then name).
 * @returns {{ categoryId: string, categoryName: string, categorySortOrder: number, lines: { name: string, qty: number }[] }[]}
 */
export function aggregateConsolidationByCategory(orders, isLineFinished, includeLine) {
  const byCat = new Map();
  for (const order of orders || []) {
    const items = order?.items || [];
    items.forEach((item, index) => {
      if (includeLine && !includeLine(order, item, index)) return;
      if (isLineFinished?.(order, item, index)) return;
      const meta = getItemCategoryMeta(item);
      const catKey = meta.id;
      if (!byCat.has(catKey)) {
        byCat.set(catKey, { sortOrder: meta.sortOrder, name: meta.name, products: new Map() });
      }
      const bucket = byCat.get(catKey);
      const name = getItemLabel(item);
      const q = getItemQuantity(item);
      bucket.products.set(name, (bucket.products.get(name) || 0) + q);
    });
  }
  const groups = Array.from(byCat.entries()).map(([categoryId, g]) => ({
    categoryId,
    categoryName: g.name,
    categorySortOrder: g.sortOrder,
    lines: Array.from(g.products.entries())
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }));
  groups.sort((a, b) => {
    if (a.categorySortOrder !== b.categorySortOrder) return a.categorySortOrder - b.categorySortOrder;
    const n = a.categoryName.localeCompare(b.categoryName);
    if (n !== 0) return n;
    return a.categoryId.localeCompare(b.categoryId);
  });
  return groups;
}

/**
 * Parses `table-saved-orders` into orderId → savedAt (ISO string from "Add to table").
 * Later entries in the array win (same order sent to kitchen again → timer restarts from last click).
 */
export function buildSavedTableKitchenStartMap(value) {
  const map = new Map();
  if (!Array.isArray(value)) return map;
  for (const raw of value) {
    if (raw == null) continue;
    let orderId;
    let savedAt = null;
    if (typeof raw === 'string') {
      orderId = String(raw).trim();
    } else if (typeof raw === 'object') {
      orderId = String(raw.orderId ?? raw.id ?? '').trim();
      savedAt = raw.savedAt != null ? String(raw.savedAt) : null;
    }
    if (!orderId) continue;
    map.set(orderId, savedAt);
  }
  return map;
}

/**
 * Show on KDS only after cashier taps "Add to table" (order id is stored in table-saved-orders).
 * Open draft orders on a table must not appear until then.
 */
export function isKitchenOrder(order, savedKitchenStartMap) {
  const oid = order?.id != null ? String(order.id) : '';
  if (!oid) return false;
  if (order.status !== 'open') return false;
  if (!order.tableId) return false;
  const m = savedKitchenStartMap instanceof Map ? savedKitchenStartMap : new Map();
  if (!m.has(oid)) return false;
  const items = order.items;
  return Array.isArray(items) && items.length > 0;
}

/** Elapsed timer on KDS should start at "Add to table", not order creation. */
export function getKitchenTimerStartAt(order, savedKitchenStartMap) {
  const m = savedKitchenStartMap instanceof Map ? savedKitchenStartMap : new Map();
  const oid = order?.id != null ? String(order.id) : '';
  const savedAt = oid ? m.get(oid) : undefined;
  if (savedAt) return savedAt;
  return order?.updatedAt ?? order?.createdAt;
}
