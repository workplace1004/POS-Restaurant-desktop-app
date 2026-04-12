import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dropdown } from '../Dropdown';
import { POS_API_PREFIX as API } from '../../lib/apiOrigin.js';

const KIOSK_MIN_MAX_OPTIONS = [
  { value: 'unlimited', label: 'Unlimited' },
  ...Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))
];

function groupKey(step) {
  if (!step || step.groupId === null || step.groupId === undefined) return null;
  return step.groupId === '' ? '' : String(step.groupId);
}

export function ControlViewProductKioskConfigurationModal({
  tr,
  open,
  product,
  onClose,
  showToast
}) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [steps, setSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(1);

  const productId = product?.id;

  const loadSteps = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/products/${productId}/kiosk-group-configuration`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Load failed');
      setSteps(Array.isArray(data.steps) ? data.steps : []);
      const firstWithGroup = (data.steps || []).find((s) => groupKey(s) != null);
      setActiveStep(firstWithGroup ? firstWithGroup.step : 1);
    } catch (e) {
      showToast?.('error', e?.message || tr('control.kioskConfig.loadFailed', 'Could not load configuration.'));
      setSteps([]);
    } finally {
      setLoading(false);
    }
  }, [productId, product?.name, showToast, tr]);

  useEffect(() => {
    if (!open || !productId) return;
    loadSteps();
  }, [open, productId, loadSteps]);

  const currentStep = steps[activeStep - 1];
  const currentGk = currentStep ? groupKey(currentStep) : null;

  /** Subproduct group name for the active step (API `groupName`). */
  const groupDisplayName = useMemo(() => {
    if (!currentStep || currentGk == null) return '';
    const raw = currentStep.groupName;
    if (raw != null && String(raw).trim() !== '') return String(raw).trim();
    return tr('control.productSubproducts.withoutGroup', 'Without group');
  }, [currentStep, currentGk, tr]);

  const numActiveSteps = steps.filter((s) => groupKey(s) != null).length;

  /** Center header: group name for the step being configured, else product name. */
  const modalHeaderTitle = useMemo(() => {
    const productName = product?.name || '';
    if (loading) return productName;
    if (numActiveSteps === 0) return productName;
    if (currentGk == null || !groupDisplayName) return productName;
    return groupDisplayName;
  }, [loading, numActiveSteps, currentGk, groupDisplayName, product?.name]);

  const defaultSubproductOptions = useMemo(() => {
    const dash = { value: '', label: tr('control.kioskConfig.defaultNone', '---') };
    if (!currentStep?.links?.length) return [dash];
    return [
      dash,
      ...currentStep.links.map((l) => ({
        value: String(l.subproductId),
        label: l.subproductName || l.subproductId
      }))
    ];
  }, [currentStep, tr]);

  const updateCurrentConfig = useCallback(
    (patch) => {
      const idx = activeStep - 1;
      setSteps((prev) =>
        prev.map((s, i) => (i === idx ? { ...s, config: { ...s.config, ...patch } } : s))
      );
    },
    [activeStep]
  );

  const handleSave = async () => {
    if (!productId) return;
    const groupConfigs = {};
    for (const s of steps) {
      const gk = groupKey(s);
      if (gk === null) continue;
      groupConfigs[gk === '' ? '' : gk] = s.config;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/products/${productId}/kiosk-group-configuration`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupConfigs })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || tr('control.kioskConfig.saveFailed', 'Save failed'));
      showToast?.('success', tr('control.kioskConfig.saved', 'Configuration saved.'));
      onClose?.();
    } catch (e) {
      showToast?.('error', e?.message || tr('control.kioskConfig.saveFailed', 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const removeLinkedSubproduct = async (subproductId) => {
    if (!productId) return;
    const payload = [];
    for (const s of steps) {
      const gk = groupKey(s);
      if (gk === null) continue;
      const gid = gk === '' ? '' : gk;
      for (const l of s.links) {
        if (l.subproductId === subproductId) continue;
        payload.push({ groupId: gid, subproductId: l.subproductId });
      }
    }
    try {
      const res = await fetch(`${API}/products/${productId}/subproduct-links`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: payload })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to update links');
      await loadSteps();
      showToast?.('success', tr('control.kioskConfig.linkRemoved', 'Subproduct removed.'));
    } catch (e) {
      showToast?.('error', e?.message || tr('control.kioskConfig.linkRemoveFailed', 'Could not remove subproduct.'));
    }
  };

  if (!open || !product) return null;

  const cfg = currentStep?.config || {};
  /** When false, only single selection applies; default/min/max kiosk options are not used. */
  const multiselectOn = cfg.multiselect !== false;
  /** Kiosk section title override; empty → use subproduct group name (see KioskView). */
  const titleFieldValue =
    (cfg.title ?? '').trim() !== '' ? cfg.title : groupDisplayName;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
      />
      <div
        className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-black/15 bg-white text-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kiosk-config-group-title"
      >
        <div className="relative flex shrink-0 items-center justify-center border-b border-black/10 px-4 py-4 pr-14">
          <h2
            id="kiosk-config-group-title"
            className="text-center text-xl font-semibold leading-tight text-black sm:text-2xl"
          >
            {modalHeaderTitle}
          </h2>
          <button
            type="button"
            className="absolute top-4 right-4 rounded-lg p-2 text-black active:bg-black/10"
            onClick={onClose}
            aria-label={tr('close', 'Close')}
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex shrink-0 justify-center gap-2 border-b border-black/10 px-2 py-3">
          {Array.from({ length: 9 }, (_, i) => {
            const n = i + 1;
            const stepRow = steps[i];
            const hasGroup = stepRow && groupKey(stepRow) != null;
            const active = activeStep === n;
            return (
              <button
                key={n}
                type="button"
                disabled={!hasGroup}
                onClick={() => hasGroup && setActiveStep(n)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-25 ${active ? 'bg-rose-600 text-white' : 'bg-white/10 text-black active:bg-white/20'
                  }`}
              >
                {n}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {loading ? (
            <p className="py-12 text-center text-lg text-black/80">{tr('loading', 'Loading…')}</p>
          ) : numActiveSteps === 0 ? (
            <p className="py-12 text-center text-lg text-black/80">
              {tr(
                'control.kioskConfig.noGroups',
                'Link subproducts (with groups) to this product first — use Subproducts on the product row.'
              )}
            </p>
          ) : currentGk === null ? (
            <p className="py-8 text-center text-black/70">
              {tr('control.kioskConfig.emptyStep', 'No group for this step.')}
            </p>
          ) : (
            <div className="mx-auto max-w-xl space-y-5">
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-x-4 gap-y-4 text-lg">
                <label className="text-black/90">{tr('control.kioskConfig.title', 'Title')} :</label>
                <input
                  type="text"
                  readOnly
                  tabIndex={-1}
                  value={titleFieldValue}
                  placeholder={groupDisplayName}
                  className="cursor-default rounded-lg border border-black/20 bg-neutral-100 px-3 py-2.5 text-black placeholder:text-neutral-500"
                  aria-readonly="true"
                />

                <span className="text-black/90 leading-tight">
                  {tr('control.kioskConfig.mandatoryPosKiosk', 'Mandatory in POS and kiosk')} :
                </span>
                <input
                  type="checkbox"
                  checked={!!cfg.mandatoryPosKiosk}
                  onChange={(e) => updateCurrentConfig({ mandatoryPosKiosk: e.target.checked })}
                  className="h-6 w-6 justify-self-start rounded border-white/30"
                />

                <span className="text-black/90">{tr('control.kioskConfig.multiselect', 'Multiselect')} :</span>
                <input
                  type="checkbox"
                  checked={cfg.multiselect !== false}
                  onChange={(e) => updateCurrentConfig({ multiselect: e.target.checked })}
                  className="h-6 w-6 justify-self-start rounded border-white/30"
                />

                <span className="text-black/90 leading-tight">
                  {tr('control.kioskConfig.defaultChecked', 'Checked by default')} :
                </span>
                <Dropdown
                  options={defaultSubproductOptions}
                  value={cfg.defaultSubproductId != null ? String(cfg.defaultSubproductId) : ''}
                  onChange={(v) => updateCurrentConfig({ defaultSubproductId: v })}
                  disabled={!multiselectOn}
                  className="min-h-[44px] w-full justify-start rounded-lg border border-white/20 bg-white px-3 py-2 text-left text-black"
                />

                <span className="text-black/90 leading-tight">
                  {tr('control.kioskConfig.minKiosk', 'Minimum selection in kiosk')} :
                </span>
                <Dropdown
                  options={KIOSK_MIN_MAX_OPTIONS}
                  value={
                    cfg.minKiosk != null && String(cfg.minKiosk).trim() !== ''
                      ? String(cfg.minKiosk)
                      : 'unlimited'
                  }
                  onChange={(v) => updateCurrentConfig({ minKiosk: v })}
                  disabled={!multiselectOn}
                  className="min-h-[44px] w-full justify-start rounded-lg border border-white/20 bg-white px-3 py-2 text-left text-black"
                />

                <span className="text-black/90 leading-tight">
                  {tr('control.kioskConfig.maxKiosk', 'Maximum selection in kiosk')} :
                </span>
                <Dropdown
                  options={KIOSK_MIN_MAX_OPTIONS}
                  value={
                    cfg.maxKiosk != null && String(cfg.maxKiosk).trim() !== ''
                      ? String(cfg.maxKiosk)
                      : 'unlimited'
                  }
                  onChange={(v) => updateCurrentConfig({ maxKiosk: v })}
                  disabled={!multiselectOn}
                  className="min-h-[44px] w-full justify-start rounded-lg border border-white/20 bg-white px-3 py-2 text-left text-black"
                />
              </div>

              <div className="border-t border-black/10 pt-4">
                <ul className="space-y-2">
                  {(currentStep.links || []).map((l) => (
                    <li
                      key={l.subproductId}
                      className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-3 py-2 text-lg"
                    >
                      <span className="min-w-0 text-black">
                        <span className="text-black/60">- </span>
                        {l.subproductName || l.subproductId}
                      </span>
                      <button
                        type="button"
                        className="shrink-0 rounded p-2 text-rose-400 active:text-white active:bg-rose-500"
                        aria-label={tr('delete', 'Delete')}
                        onClick={() => removeLinkedSubproduct(l.subproductId)}
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 px-5 py-4 w-full flex justify-center">
          <button
            type="button"
            disabled={saving || loading || numActiveSteps === 0}
            onClick={handleSave}
            className="w-[70%] rounded-xl bg-rose-500 py-4 text-xl font-semibold text-white active:bg-rose-500 disabled:opacity-50"
          >
            {saving ? tr('control.saving', 'Saving…') : tr('control.save', 'Save')}
          </button>
        </div>
      </div>
    </div>
  );
}
