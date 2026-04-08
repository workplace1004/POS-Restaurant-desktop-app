import React from 'react';
import { publicAssetUrl } from './publicAssetUrl.js';

/** Same status / default greens as TableShapeSvg (keep in sync). */
const TABLE_GREEN = '#1F8E41';
const TABLE_RED = '#B91C1C';

/**
 * True when any `open` order in the hook/API order list belongs to this floor table.
 * Matches tablet/handheld: `orders` from usePos can be correct when GET /tables omits nested `orders`.
 */
export function tableHasOpenOrderOnFloor(tableId, layoutOrTableName, orders) {
  if (!Array.isArray(orders) || orders.length === 0) return false;
  const tid = tableId != null ? String(tableId) : '';
  const nameNorm = String(layoutOrTableName || '').trim().toLowerCase();
  return orders.some((o) => {
    if (o?.status !== 'open') return false;
    if (tid && String(o?.tableId || '') === tid) return true;
    if (nameNorm) {
      const tn = String(o?.table?.name ?? '').trim().toLowerCase();
      if (tn === nameNorm) return true;
    }
    return false;
  });
}

function getTableFillForStatus(hasOpenOrders, _wasPaidRecently) {
  if (hasOpenOrders) return TABLE_RED;
  return TABLE_GREEN;
}

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/** Valid layout table base color (#rgb / #rrggbb / #rrggbbaa). */
export function parseLayoutTableColor(raw) {
  const s = typeof raw === 'string' ? raw.trim() : '';
  if (!s || !HEX_COLOR.test(s)) return null;
  return s;
}

/**
 * Merge floor-level and per-table flower pots (legacy layouts may nest pots under tables).
 */
export function mergeLayoutFlowerPots(layout, layoutTables) {
  const tables = Array.isArray(layoutTables) ? layoutTables : [];
  const nested = tables.flatMap((layoutTable) =>
    Array.isArray(layoutTable?.flowerPots) ? layoutTable.flowerPots : []
  );
  const top = layout && Array.isArray(layout.flowerPots) ? layout.flowerPots : [];
  if (layout && Object.prototype.hasOwnProperty.call(layout, 'flowerPots')) {
    return [...top, ...nested];
  }
  if (nested.length > 0) return nested;
  return top;
}

/**
 * Previously applied a full-tile red wash; that hid the floor behind the table hit area.
 * Open vs free is shown only on the table SVG fill (see getLayoutTableSurfaceFill / TableShapeSvg).
 */
export function getTableStatusOverlayClass(_hasOpenOrders, _wasPaidRecently) {
  return '';
}

/**
 * SVG surface fill: status colors win; otherwise optional per-table layout color, else default green.
 */
export function getLayoutTableSurfaceFill(layoutTable, hasOpenOrders, wasPaidRecently) {
  const statusFill = getTableFillForStatus(hasOpenOrders, wasPaidRecently);
  if (hasOpenOrders || wasPaidRecently) return statusFill;
  const custom = parseLayoutTableColor(layoutTable?.tableColor);
  return custom || statusFill;
}

export function layoutTableShowsCenterDecoration(layoutTable) {
  const v = layoutTable?.centerDecoration;
  if (v === true || v === 1) return true;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    return s === '1' || s === 'true' || s === 'flowerpot' || s === 'flowers' || s === 'flower';
  }
  return false;
}

/** Small flower pot on the table surface (between shape and table number). */
export function TableCenterDecoration({ layoutTable, className = '' }) {
  if (!layoutTableShowsCenterDecoration(layoutTable)) return null;
  return (
    <span
      className={`pointer-events-none absolute inset-0 z-[5] flex items-center justify-center pt-[8%] ${className}`.trim()}
      aria-hidden
    >
      <img
        src={publicAssetUrl('/flowerpot.svg')}
        alt=""
        className="w-[32%] max-w-[48px] h-auto object-contain opacity-95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
      />
    </span>
  );
}
