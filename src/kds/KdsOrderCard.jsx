import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  formatElapsed,
  getItemCategoryMeta,
  getItemLabel,
  getItemQuantity,
  getLineStyle,
  itemRowKey,
  LINE_STATUS,
  parseItemNotes
} from './kdsUtils';

function statusTextClass(status) {
  if (status === LINE_STATUS.finished) return 'text-red-600';
  if (status === LINE_STATUS.started) return 'text-emerald-600';
  return 'text-neutral-900';
}

export function KdsOrderCard({
  order,
  visibleItemIndices = null,
  tableLabel,
  staffName,
  onBonKlaar,
  timerStartAt,
  lineState,
  onLineStateChange,
  /** Admin KDS: show status from stations but do not allow taps or Bon klaar. */
  readOnly = false
}) {
  const { t } = useLanguage();
  const start = timerStartAt ?? order?.createdAt;
  const [elapsed, setElapsed] = useState(() => formatElapsed(start));
  const items = order?.items ?? [];

  const indicesToShow = useMemo(() => {
    if (visibleItemIndices == null) return items.map((_, i) => i);
    const sorted = [...visibleItemIndices].sort((a, b) => a - b);
    return sorted.filter((i) => i >= 0 && i < items.length);
  }, [items, visibleItemIndices]);

  const indicesKey = visibleItemIndices == null ? 'all' : indicesToShow.join(',');

  const rowsByCategory = useMemo(() => {
    const rows = indicesToShow.map((index) => ({
      index,
      meta: getItemCategoryMeta(items[index])
    }));
    rows.sort((a, b) => {
      if (a.meta.sortOrder !== b.meta.sortOrder) return a.meta.sortOrder - b.meta.sortOrder;
      const byName = a.meta.name.localeCompare(b.meta.name);
      if (byName !== 0) return byName;
      const byId = a.meta.id.localeCompare(b.meta.id);
      if (byId !== 0) return byId;
      return a.index - b.index;
    });
    return rows;
  }, [items, indicesToShow, indicesKey]);

  const itemKeysSignature = useMemo(
    () => indicesToShow.map((index) => itemRowKey(order?.id, items[index], index)).join(','),
    [items, order?.id, indicesKey]
  );

  useEffect(() => {
    if (readOnly || !onLineStateChange || !order?.id) return;
    onLineStateChange(order.id, (prev) => {
      const next = { ...(prev ?? {}) };
      const validKeys = new Set(
        indicesToShow.map((index) => itemRowKey(order?.id, items[index], index))
      );
      for (const k of validKeys) {
        if (!(k in next)) next[k] = LINE_STATUS.received;
      }
      for (const k of Object.keys(next)) {
        if (!validKeys.has(k)) delete next[k];
      }
      return next;
    });
  }, [order?.id, itemKeysSignature, onLineStateChange, readOnly]);

  useEffect(() => {
    setElapsed(formatElapsed(start));
    const t = setInterval(() => setElapsed(formatElapsed(start)), 1000);
    return () => clearInterval(t);
  }, [start]);

  const cycleLine = (key) => {
    if (readOnly || !key || !onLineStateChange || !order?.id) return;
    onLineStateChange(order.id, (prev) => {
      const p = prev ?? {};
      const cur = p[key] ?? LINE_STATUS.received;
      let nextStatus = cur;
      if (cur === LINE_STATUS.received) nextStatus = LINE_STATUS.started;
      else if (cur === LINE_STATUS.started) nextStatus = LINE_STATUS.finished;
      else nextStatus = LINE_STATUS.finished;
      return { ...p, [key]: nextStatus };
    });
  };

  const ls = lineState ?? {};

  const allLinesFinished =
    indicesToShow.length > 0 &&
    indicesToShow.every((index) => {
      const item = items[index];
      const key = itemRowKey(order?.id, item, index);
      return (ls[key] ?? LINE_STATUS.received) === LINE_STATUS.finished;
    });

  return (
    <article
      className={`flex min-w-[260px] max-w-[320px] flex-col rounded-xl bg-white shadow-md ring-1 ring-black/5 ${readOnly ? 'select-none' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 border-b border-neutral-200 px-3 pt-2 pb-2">
        <span className="text-xs font-semibold uppercase text-[#c0392b] truncate max-w-[40%]">
          {staffName || '—'}
        </span>
        <span className="flex-1 text-center text-lg font-bold text-neutral-900 leading-tight">
          {tableLabel}
        </span>
        <span className="text-sm font-semibold tabular-nums text-sky-600 shrink-0">{elapsed}</span>
      </div>
      <div className="flex flex-1 flex-col divide-y divide-neutral-200 px-2 py-1 min-h-[120px]">
        {rowsByCategory.map(({ index, meta }, rowIdx) => {
          const item = items[index];
          const key = itemRowKey(order?.id, item, index);
          const name = getItemLabel(item);
          const qty = getItemQuantity(item);
          const style = getLineStyle(name);
          const notes = parseItemNotes(item);
          const st = ls[key] ?? LINE_STATUS.received;
          const color = statusTextClass(st);
          const showCatHeader =
            rowIdx === 0 || rowsByCategory[rowIdx - 1].meta.id !== meta.id;

          if (style === 'course') {
            return (
              <React.Fragment key={key}>
                {showCatHeader ? (
                  <div
                    className={`px-1 pb-0 text-xs font-bold uppercase tracking-wide text-neutral-500 ${rowIdx === 0 ? 'pt-0' : 'pt-2'}`}
                  >
                    {meta.name}
                  </div>
                ) : null}
                <div className="py-2 text-sm">
                  {readOnly ? (
                    <div className={`w-full text-center font-semibold ${color}`}>{name}</div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => cycleLine(key)}
                      className={`w-full text-center font-semibold cursor-pointer select-none active:opacity-80 ${color}`}
                    >
                      {name}
                    </button>
                  )}
                </div>
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key={key}>
              {showCatHeader ? (
                <div
                  className={`px-1 pb-0 text-xs font-bold uppercase tracking-wide text-neutral-500 ${rowIdx === 0 ? 'pt-0' : 'pt-2'}`}
                >
                  {meta.name}
                </div>
              ) : null}
              <div className="py-1.5 text-2xl">
                {readOnly ? (
                  <div className={`w-full text-left font-bold ${color}`}>
                    {qty}x {name}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => cycleLine(key)}
                    className={`w-full text-left cursor-pointer select-none font-bold active:opacity-80 ${color}`}
                  >
                    {qty}x {name}
                  </button>
                )}
                {notes.map((note, idx) => (
                  <p key={idx} className={`pl-3 text-xl ${color}`}>
                    • {note.label}
                  </p>
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {allLinesFinished && !readOnly ? (
        <div className="flex justify-end p-2 pt-1">
          <button
            type="button"
            onClick={() => onBonKlaar?.(order?.id)}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-500 active:bg-emerald-700"
          >
            {t('kds.bonKlaar')}
          </button>
        </div>
      ) : null}
    </article>
  );
}
