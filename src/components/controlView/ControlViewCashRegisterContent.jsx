import React, { useMemo } from 'react';
import { PaginationArrows } from '../PaginationArrows';

export function ControlViewCashRegisterContent({
  tr,
  subNavId,
  templateTheme,
  setTemplateTheme,
  savingTemplateSettings,
  setSavingTemplateSettings,
  paymentTypesLoading,
  openNewPaymentTypeModal,
  paymentTypes,
  paymentTypesListRef,
  updatePaymentTypesScrollState,
  canPaymentTypesScrollUp,
  canPaymentTypesScrollDown,
  scrollPaymentTypesByPage,
  togglePaymentTypeActive,
  openEditPaymentTypeModal,
  onRequestDeletePaymentType,
  movePaymentType
}) {
  const sortedPaymentTypes = useMemo(
    () => [...paymentTypes].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [paymentTypes]
  );

  const handleSaveTemplate = () => {
    setSavingTemplateSettings(true);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('pos-template-theme', templateTheme);
      }
    } finally {
      setSavingTemplateSettings(false);
    }
  };

  if (subNavId === 'Template Settings') {
    return (
      <div className="relative min-h-[650px] rounded-xl border border-pos-border bg-pos-panel/30 p-4 pb-[60px] flex flex-col items-center justify-start pt-12">
        <p className="text-pos-text text-lg font-medium mb-6 text-center">
          {tr('control.cashRegister.templateAppearance', 'Cash register appearance')}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['light', 'dark'].map((theme) => (
            <button
              key={theme}
              type="button"
              className={`px-8 py-4 rounded-lg text-sm font-medium border transition-colors ${
                templateTheme === theme
                  ? 'bg-pos-panel text-pos-text border-green-500'
                  : 'bg-pos-bg text-pos-muted border-pos-border active:bg-green-500 active:text-pos-text'
              }`}
              onClick={() => setTemplateTheme(theme)}
            >
              {tr(`control.theme.${theme}`, theme === 'light' ? 'Light' : 'Dark')}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={savingTemplateSettings}
          onClick={handleSaveTemplate}
          className="px-6 py-3 rounded-lg text-sm font-medium bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 active:border-white/30 transition-colors disabled:opacity-50"
        >
          {tr('control.save', 'Save')}
        </button>
      </div>
    );
  }

  if (subNavId === 'Payment types') {
    return (
      <div className="relative min-h-[650px] rounded-xl border border-pos-border bg-pos-panel/30 p-4 pb-[60px]">
        <div className="flex items-center w-full justify-center mb-2">
          <button
            type="button"
            className="px-6 py-3 rounded-lg text-sm font-medium bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 active:border-white/30 transition-colors disabled:opacity-50"
            disabled={paymentTypesLoading}
            onClick={openNewPaymentTypeModal}
          >
            {tr('control.paymentTypes.new', 'New Payment Method')}
          </button>
        </div>
        {paymentTypesLoading ? null : sortedPaymentTypes.length === 0 ? (
          <ul className="w-full flex flex-col">
            <li className="text-pos-muted text-xl font-medium text-center py-4">{tr('control.paymentTypes.empty', 'No payment methods yet.')}</li>
          </ul>
        ) : (
          <>
            <div
              ref={paymentTypesListRef}
              className="max-h-[510px] overflow-y-auto rounded-lg [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              onScroll={updatePaymentTypesScrollState}
            >
              <ul className="w-full flex flex-col">
                {sortedPaymentTypes.map((pt, index) => (
                  <li
                    key={pt.id}
                    className="flex items-center w-full justify-between gap-2 px-4 py-2 bg-pos-bg border-y border-pos-panel text-pos-text text-sm"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        className="p-2 rounded text-pos-text active:text-rose-500 disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={() => movePaymentType(pt.id, 'down')}
                        disabled={index >= sortedPaymentTypes.length - 1}
                        aria-label="Move down"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded text-pos-text active:text-rose-500 disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={() => movePaymentType(pt.id, 'up')}
                        disabled={index <= 0}
                        aria-label="Move up"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v14" />
                        </svg>
                      </button>
                    </div>
                    <span className="flex-1 text-center font-medium truncate" title={pt.name}>
                      {pt.name}
                    </span>
                    <button
                      type="button"
                      className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 max-w-[120px] truncate"
                      onClick={() => togglePaymentTypeActive(pt.id)}
                    >
                      {pt.active !== false
                        ? tr('control.paymentTypes.deactivate', 'Deactivate')
                        : tr('control.paymentTypes.activate', 'Activate')}
                    </button>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        className="p-2 rounded text-pos-text mr-2 active:text-green-500"
                        onClick={() => openEditPaymentTypeModal(pt)}
                        aria-label="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded text-pos-text active:text-rose-500"
                        onClick={() => onRequestDeletePaymentType(pt.id)}
                        aria-label="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <PaginationArrows
              canPrev={canPaymentTypesScrollUp}
              canNext={canPaymentTypesScrollDown}
              onPrev={() => scrollPaymentTypesByPage('up')}
              onNext={() => scrollPaymentTypesByPage('down')}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-pos-border bg-pos-panel/30 p-8 min-h-[400px] flex items-center justify-center">
      <p className="text-pos-muted text-lg text-center max-w-md">
        {tr(
          'control.cashRegister.modalTabHint',
          'A settings window should have opened. You can also select this tab again to reopen it.'
        )}
      </p>
    </div>
  );
}
