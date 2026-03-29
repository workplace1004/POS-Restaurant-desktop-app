import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function ConsolidationSidebar({ groups }) {
  const { t } = useLanguage();
  const hasAny = Array.isArray(groups) && groups.some((g) => g?.lines?.length > 0);

  return (
    <aside className="flex w-[250px] shrink-0 flex-col rounded-xl bg-[#1a202c] p-3 text-white shadow-lg">
      <h2 className="mb-3 text-center text-xl font-semibold uppercase tracking-wide text-white/90">
        {t('kds.consolidation')}
      </h2>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto scrollbar-hide">
        {!hasAny ? (
          <p className="text-center text-xl text-white/50 py-6">—</p>
        ) : (
          groups.map((group) => {
            if (!group?.lines?.length) return null;
            return (
              <section key={group.categoryId} className="flex flex-col gap-1.5">
                <h3 className="border-b border-white/20 pb-1 text-center text-sm font-semibold uppercase tracking-wide text-white/70">
                  {group.categoryName}
                </h3>
                <div className="flex flex-col gap-1.5">
                  {group.lines.map((row) => (
                    <div
                      key={`${group.categoryId}-${row.name}`}
                      className="flex items-center justify-between gap-2 rounded-lg bg-green-500 px-2.5 py-2"
                    >
                      <span className="min-w-0 truncate text-xl font-medium">{row.name}</span>
                      <span className="shrink-0 rounded-full bg-rose-500 px-2.5 py-0.5 text-xl font-semibold tabular-nums">
                        {row.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </aside>
  );
}
