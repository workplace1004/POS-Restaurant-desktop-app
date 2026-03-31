import React from 'react';
import { PaginationArrows } from '../PaginationArrows';

/** Top nav "Tables" — table locations list and actions. */
export function ControlViewTablesContent({
  tr,
  tableLocationsLoading,
  tableLocations,
  tableLocationsListRef,
  updateTableLocationsScrollState,
  openTableLocationModal,
  openSetTablesModal,
  openEditTableLocationModal,
  setDeleteConfirmTableLocationId,
  canTableLocationsScrollUp,
  canTableLocationsScrollDown,
  scrollTableLocationsByPage
}) {
  return (
    <div className="relative rounded-xl border border-pos-border bg-pos-panel/30 p-4 min-h-[690px] pb-16">
      <div className="flex items-center w-full justify-center mb-4">
        <button
          type="button"
          className="px-4 py-2 rounded-lg text-sm font-medium bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 active:border-white/30 transition-colors disabled:opacity-50"
          disabled={tableLocationsLoading}
          onClick={openTableLocationModal}
        >
          {tr('control.tables.new', 'New table setting')}
        </button>
      </div>
      <div
        ref={tableLocationsListRef}
        className="w-full max-h-[560px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        onScroll={updateTableLocationsScrollState}
      >
        <ul className="w-full flex flex-col">
          {tableLocationsLoading ? null : tableLocations.length === 0 ? (
            <li className="text-pos-muted text-sm py-6 text-center">{tr('control.tables.empty', 'No table locations yet.')}</li>
          ) : (
            tableLocations.map((loc) => {
              const hasSavedLayout = (() => {
                try {
                  if (loc?.layoutJson == null || loc.layoutJson === '') return false;
                  const parsed = JSON.parse(loc.layoutJson);
                  return Array.isArray(parsed?.tables) && parsed.tables.length > 0;
                } catch {
                  return false;
                }
              })();
              return (
                <li
                  key={loc.id}
                  className="flex justify-between relative items-center w-full px-4 py-2 bg-pos-bg border-y border-pos-panel text-pos-text text-sm"
                >
                  <span className="font-medium">{loc.name}</span>
                  <div className="flex absolute right-1/2 items-center justify-center">
                    <button
                      type="button"
                      className={`w-full text-center px-3 py-1 rounded-lg text-sm active:bg-green-500 ${
                        hasSavedLayout ? 'text-white' : 'text-pos-muted active:text-pos-text'
                      }`}
                      onClick={() => openSetTablesModal(loc)}
                    >
                      {tr('control.tables.setTables', 'Set tables')}
                    </button>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="p-1 rounded text-pos-text active:bg-green-500"
                      onClick={() => openEditTableLocationModal(loc)}
                      aria-label="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="p-1 rounded text-pos-text active:bg-green-500"
                      onClick={() => setDeleteConfirmTableLocationId(loc.id)}
                      aria-label="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
      {tableLocations.length > 0 && (
        <PaginationArrows
          canPrev={canTableLocationsScrollUp}
          canNext={canTableLocationsScrollDown}
          onPrev={() => scrollTableLocationsByPage('up')}
          onNext={() => scrollTableLocationsByPage('down')}
        />
      )}
    </div>
  );
}
