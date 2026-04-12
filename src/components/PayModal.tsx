import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { POS_API_PREFIX as API } from '../lib/apiOrigin.js';
import { publicAssetUrl } from '../lib/publicAssetUrl.js';
import { formatPaymentAmount, roundCurrency, sumAmountsByIntegration } from '../lib/payDifferentlyUtils.js';

const PAY_METHOD_ICON_PNG = {
    manual_cash: '/cash.png',
    cashmatic: '/cashmatic.png',
    payworld: '/payworld.png',
    generic: '/card.png',
};

function payMethodIconSrc(integ) {
    const key = PAY_METHOD_ICON_PNG[integ] != null ? integ : 'generic';
    return publicAssetUrl(PAY_METHOD_ICON_PNG[key] || PAY_METHOD_ICON_PNG.generic);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Same UI and terminal flow as OrderPanel “Pay differently”.
 * After Cashmatic/Payworld succeeds, calls onProceedAfterTerminals (order settlement / kiosk create order).
 */
export function PayModal({
    open,
    targetTotal,
    onClose,
    onProceedAfterTerminals,
    onPaymentError,
    overlayClassName = 'z-50',
    payworldOverlayClassName = 'fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4',
}) {
    const { t } = useLanguage();
    const tr = (key, fallback) => {
        const translated = t(key);
        return translated === key ? fallback : translated;
    };

    const [paymentAmounts, setPaymentAmounts] = useState({});
    const [activePaymentMethods, setActivePaymentMethods] = useState([]);
    const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [payModalTargetTotal, setPayModalTargetTotal] = useState(0);
    const [payConfirmLoading, setPayConfirmLoading] = useState(false);
    const [showPayworldStatusModal, setShowPayworldStatusModal] = useState(false);
    const [payworldStatus, setPayworldStatus] = useState({ state: 'IDLE', message: '', details: null });
    const [payModalLayerVisible, setPayModalLayerVisible] = useState(false);
    const [payModalExiting, setPayModalExiting] = useState(false);
    const payModalExitingRef = useRef(false);

    const activeCashmaticSessionIdRef = useRef(null);
    const cancelCashmaticRequestedRef = useRef(false);
    const activePayworldSessionIdRef = useRef(null);
    const cancelPayworldRequestedRef = useRef(false);

    const reportError = useCallback(
        (message) => {
            if (onPaymentError) onPaymentError(message);
        },
        [onPaymentError],
    );

    const finalizePayModalClose = useCallback(() => {
        if (!payModalExitingRef.current) return;
        payModalExitingRef.current = false;
        setPayModalExiting(false);
        setPayModalLayerVisible(false);
        onClose?.();
    }, [onClose]);

    const beginPayModalExit = useCallback(() => {
        if (payModalExitingRef.current || !payModalLayerVisible) return;
        payModalExitingRef.current = true;
        setPayModalExiting(true);
    }, [payModalLayerVisible]);

    const handlePayModalPanelAnimationEnd = useCallback(
        (e: React.AnimationEvent<HTMLDivElement>) => {
            if (e.target !== e.currentTarget) return;
            if (e.animationName !== 'kiosk-subproduct-modal-panel-out') return;
            finalizePayModalClose();
        },
        [finalizePayModalClose],
    );

    useLayoutEffect(() => {
        if (open) {
            payModalExitingRef.current = false;
            setPayModalExiting(false);
            setPayModalLayerVisible(true);
        }
    }, [open]);

    useEffect(() => {
        if (!open && payModalLayerVisible && !payModalExitingRef.current) {
            beginPayModalExit();
        }
    }, [open, payModalLayerVisible, beginPayModalExit]);

    useEffect(() => {
        if (!open) return undefined;
        let cancelled = false;
        const tt = Math.max(0, roundCurrency(targetTotal));
        setPayModalTargetTotal(tt);
        setPaymentAmounts({});
        setSelectedPayment(null);
        setActivePaymentMethods([]);
        setPayConfirmLoading(false);
        setShowPayworldStatusModal(false);
        setPayworldStatus({ state: 'IDLE', message: '', details: null });
        activeCashmaticSessionIdRef.current = null;
        activePayworldSessionIdRef.current = null;
        cancelCashmaticRequestedRef.current = false;
        cancelPayworldRequestedRef.current = false;

        (async () => {
            setPaymentMethodsLoading(true);
            try {
                const res = await fetch(`${API}/payment-methods?active=1`);
                const data = await res.json().catch(() => ({}));
                if (!res.ok || cancelled) return;
                const list = Array.isArray(data?.data) ? data.data : [];
                const sorted = [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
                if (cancelled) return;
                setActivePaymentMethods(sorted);
                setPaymentAmounts(Object.fromEntries(sorted.map((m) => [m.id, 0])));
            } catch {
                if (!cancelled) setActivePaymentMethods([]);
            } finally {
                if (!cancelled) setPaymentMethodsLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [open, targetTotal]);

    const payModalTotalAssigned = activePaymentMethods.reduce(
        (sum, m) => sum + (Number(paymentAmounts[m.id]) || 0),
        0,
    );
    const payModalSplitComplete =
        (payModalTargetTotal <= 0.009 && payModalTotalAssigned <= 0.009) ||
        (payModalTargetTotal > 0.009 && Math.abs(payModalTotalAssigned - payModalTargetTotal) <= 0.009);
    const remainingToAssign = roundCurrency(Math.max(0, payModalTargetTotal - payModalTotalAssigned));

    const handlePaymentMethodClick = (method) => {
        if (!method?.id || payModalSplitComplete) return;
        if (remainingToAssign > 0.009) {
            setPaymentAmounts((prev) => ({
                ...prev,
                [method.id]: (Number(prev[method.id]) || 0) + remainingToAssign,
            }));
            setSelectedPayment(method.id);
        } else {
            setSelectedPayment(method.id);
        }
    };

    const handlePayReset = () => {
        setPaymentAmounts(Object.fromEntries(activePaymentMethods.map((m) => [m.id, 0])));
        setSelectedPayment(null);
    };

    const runCashmaticPayment = async (amountEuro) => {
        const cents = Math.round((Number(amountEuro) || 0) * 100);
        if (cents <= 0) return;

        const startRes = await fetch(`${API}/cashmatic/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: cents }),
        });
        const startData = await startRes.json().catch(() => ({}));
        if (!startRes.ok) {
            throw new Error(startData?.error || 'Unable to start Cashmatic payment.');
        }

        const sessionId = startData?.data?.sessionId;
        if (!sessionId) throw new Error('Cashmatic session did not start.');
        activeCashmaticSessionIdRef.current = sessionId;
        cancelCashmaticRequestedRef.current = false;

        for (let i = 0; i < 90; i += 1) {
            if (cancelCashmaticRequestedRef.current) {
                await fetch(`${API}/cashmatic/cancel/${encodeURIComponent(sessionId)}`, { method: 'POST' }).catch(() => { });
                throw new Error('Cashmatic payment cancelled.');
            }
            await sleep(1000);
            const statusRes = await fetch(`${API}/cashmatic/status/${encodeURIComponent(sessionId)}`);
            const statusData = await statusRes.json().catch(() => ({}));
            if (!statusRes.ok) {
                throw new Error(statusData?.error || 'Unable to read Cashmatic payment status.');
            }

            const state = String(statusData?.data?.state || '').toUpperCase();
            if (state === 'PAID' || state === 'FINISHED' || state === 'FINISHED_MANUAL') {
                await fetch(`${API}/cashmatic/finish/${encodeURIComponent(sessionId)}`, { method: 'POST' });
                activeCashmaticSessionIdRef.current = null;
                return;
            }
            if (state === 'CANCELLED' || state === 'ERROR') {
                throw new Error(statusData?.error || `Cashmatic payment ${state.toLowerCase()}.`);
            }
        }

        await fetch(`${API}/cashmatic/cancel/${encodeURIComponent(sessionId)}`, { method: 'POST' }).catch(() => { });
        activeCashmaticSessionIdRef.current = null;
        throw new Error('Cashmatic payment timeout. Please try again.');
    };

    const runPayworldPayment = async (amountEuro) => {
        const amount = roundCurrency(Number(amountEuro) || 0);
        if (amount <= 0) return;

        setShowPayworldStatusModal(true);
        setPayworldStatus({
            state: 'IN_PROGRESS',
            message: tr('orderPanel.payworldConnecting', 'Connecting to terminal...'),
            details: null,
        });

        const startRes = await fetch(`${API}/payworld/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount }),
        });
        const startData = await startRes.json().catch(() => ({}));
        if (!startRes.ok || startData?.ok === false) {
            setShowPayworldStatusModal(false);
            throw new Error(startData?.error || 'Unable to start Payworld payment.');
        }

        const sessionId = startData?.sessionId || startData?.data?.sessionId;
        if (!sessionId) {
            setShowPayworldStatusModal(false);
            throw new Error('Payworld session did not start.');
        }

        activePayworldSessionIdRef.current = sessionId;
        cancelPayworldRequestedRef.current = false;
        setPayworldStatus({
            state: 'IN_PROGRESS',
            message: tr('orderPanel.payworldInProgress', 'Payment in progress on terminal...'),
            details: null,
        });

        for (let i = 0; i < 150; i += 1) {
            if (cancelPayworldRequestedRef.current) {
                await fetch(`${API}/payworld/cancel/${encodeURIComponent(sessionId)}`, { method: 'POST' }).catch(() => { });
                setPayworldStatus({
                    state: 'CANCELLED',
                    message: tr('orderPanel.paymentCancelled', 'Payment cancelled.'),
                    details: null,
                });
                throw new Error(tr('orderPanel.paymentCancelled', 'Payment cancelled.'));
            }
            await sleep(1000);
            const statusRes = await fetch(`${API}/payworld/status/${encodeURIComponent(sessionId)}`);
            const statusData = await statusRes.json().catch(() => ({}));
            if (!statusRes.ok || statusData?.ok === false) {
                setShowPayworldStatusModal(false);
                throw new Error(statusData?.error || 'Unable to read Payworld payment status.');
            }

            const state = String(statusData?.state || '').toUpperCase();
            const statusMessage = String(statusData?.message || '').trim();
            const details = statusData?.details || null;
            setPayworldStatus({
                state: state || 'IN_PROGRESS',
                message: statusMessage || tr('orderPanel.payworldInProgress', 'Payment in progress on terminal...'),
                details,
            });
            if (state === 'APPROVED') {
                setPayworldStatus({
                    state: 'APPROVED',
                    message: statusMessage || tr('orderPanel.payworldApproved', 'Payment approved.'),
                    details,
                });
                await sleep(800);
                setShowPayworldStatusModal(false);
                activePayworldSessionIdRef.current = null;
                return;
            }
            if (state === 'DECLINED' || state === 'CANCELLED' || state === 'ERROR') {
                setShowPayworldStatusModal(false);
                throw new Error(statusMessage || `Payworld payment ${state.toLowerCase()}.`);
            }
        }

        await fetch(`${API}/payworld/cancel/${encodeURIComponent(sessionId)}`, { method: 'POST' }).catch(() => { });
        setPayworldStatus({
            state: 'ERROR',
            message: tr('orderPanel.payworldTimeout', 'Payworld payment timeout. Please try again.'),
            details: null,
        });
        setShowPayworldStatusModal(false);
        activePayworldSessionIdRef.current = null;
        throw new Error('Payworld payment timeout. Please try again.');
    };

    const payworldStateUpper = String(payworldStatus.state || '').toUpperCase();
    let payworldStatusTitle = tr('orderPanel.payworldStatusReady', 'Ready.');
    if (payworldStateUpper === 'IN_PROGRESS') {
        payworldStatusTitle = tr('orderPanel.payworldStatusInProgress', 'Payment in progress on terminal...');
    } else if (payworldStateUpper === 'APPROVED') {
        payworldStatusTitle = tr('orderPanel.payworldStatusApproved', 'Payment approved.');
    } else if (payworldStateUpper === 'DECLINED') {
        payworldStatusTitle = tr('orderPanel.payworldStatusDeclined', 'Payment declined.');
    } else if (payworldStateUpper === 'CANCELLED') {
        payworldStatusTitle = tr('orderPanel.payworldStatusCancelled', 'Payment cancelled.');
    } else if (payworldStateUpper === 'ERROR') {
        payworldStatusTitle = tr('orderPanel.payworldStatusError', 'Error during payment.');
    }

    const handleAbortPayworld = async () => {
        const activeSessionId = activePayworldSessionIdRef.current;
        if (!activeSessionId) {
            setPayworldStatus({
                state: 'ERROR',
                message: tr('orderPanel.payworldNoActiveSession', 'No active Payworld session to cancel.'),
                details: null,
            });
            return;
        }

        cancelPayworldRequestedRef.current = true;
        setPayworldStatus({
            state: 'IN_PROGRESS',
            message: tr('orderPanel.payworldCancelling', 'Payment is being cancelled on the terminal...'),
            details: null,
        });

        await fetch(`${API}/payworld/cancel/${encodeURIComponent(activeSessionId)}`, { method: 'POST' }).catch(() => { });
    };

    const handleCancel = async () => {
        if (payModalExitingRef.current) return;
        if (payConfirmLoading) {
            cancelCashmaticRequestedRef.current = true;
            cancelPayworldRequestedRef.current = true;
            const activeSessionId = activeCashmaticSessionIdRef.current;
            if (activeSessionId) {
                await fetch(`${API}/cashmatic/cancel/${encodeURIComponent(activeSessionId)}`, { method: 'POST' }).catch(() => { });
            }
            const activePayworldSessionId = activePayworldSessionIdRef.current;
            if (activePayworldSessionId) {
                await fetch(`${API}/payworld/cancel/${encodeURIComponent(activePayworldSessionId)}`, { method: 'POST' }).catch(() => { });
            }
            setShowPayworldStatusModal(false);
            reportError(tr('orderPanel.paymentCancelled', 'Payment cancelled.'));
        }
        beginPayModalExit();
    };

    const handleConfirmPayment = async () => {
        if (payConfirmLoading || payModalExiting) return;
        if (paymentMethodsLoading || activePaymentMethods.length === 0) {
            reportError(tr('orderPanel.noPaymentMethods', 'No active payment methods. Add them under Control → Payment types.'));
            return;
        }

        const assignedTotal = roundCurrency(
            activePaymentMethods.reduce((sum, m) => sum + (Number(paymentAmounts[m.id]) || 0), 0),
        );
        const modalTotal = roundCurrency(payModalTargetTotal);

        if (modalTotal > 0.009 && assignedTotal <= 0) {
            reportError(tr('orderPanel.assignedAmountGreaterThanZero', 'Assigned amount must be greater than 0.'));
            return;
        }
        if (Math.abs(assignedTotal - modalTotal) > 0.009) {
            reportError(`Assigned amount (€${assignedTotal.toFixed(2)}) must match total (€${modalTotal.toFixed(2)}).`);
            return;
        }
        if (!activePaymentMethods.length) {
            reportError(
                tr('orderPanel.noPaymentMethods', 'No active payment methods. Add them under Control → Payment types.'),
            );
            return;
        }

        try {
            setPayConfirmLoading(true);
            const cashmaticTotal = sumAmountsByIntegration(activePaymentMethods, paymentAmounts, 'cashmatic');
            if (cashmaticTotal > 0) {
                await runCashmaticPayment(cashmaticTotal);
            }
            const payworldTotal = sumAmountsByIntegration(activePaymentMethods, paymentAmounts, 'payworld');
            if (payworldTotal > 0) {
                await runPayworldPayment(payworldTotal);
            }
            await onProceedAfterTerminals(activePaymentMethods, paymentAmounts, payModalTargetTotal);
        } catch (err) {
            reportError(err?.message || tr('orderPanel.paymentFailed', 'Payment failed.'));
        } finally {
            setPayConfirmLoading(false);
            activeCashmaticSessionIdRef.current = null;
            activePayworldSessionIdRef.current = null;
            cancelCashmaticRequestedRef.current = false;
            cancelPayworldRequestedRef.current = false;
        }
    };

    if (!payModalLayerVisible && !showPayworldStatusModal) return null;

    return (
        <>
            {payModalLayerVisible ? (
            <div
                className={`fixed inset-0 flex items-center justify-center ${overlayClassName}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="pay-differently-title"
            >
                <button
                    type="button"
                    tabIndex={-1}
                    className={`kiosk-subproduct-modal-backdrop absolute inset-0 border-0 bg-black/50 p-0 cursor-default${payModalExiting ? ' kiosk-subproduct-modal-backdrop--exiting' : ''}`}
                    aria-label={tr('orderPanel.closePaymentModal', 'Close')}
                    onClick={() => {
                        if (!payModalExiting) void handleCancel();
                    }}
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                <div
                    className={`kiosk-subproduct-modal-panel flex flex-col bg-white rounded-xl shadow-2xl max-w-[1800px] w-full max-h-[90vh] overflow-auto text-black${payModalExiting ? ' kiosk-subproduct-modal-panel--exiting pointer-events-none' : ' pointer-events-auto'}`}
                    onClick={(e) => e.stopPropagation()}
                    onAnimationEnd={handlePayModalPanelAnimationEnd}
                >
                    <h2 id="pay-differently-title" className="sr-only">
                        {t('payDifferently')}
                    </h2>
                    <div className="flex flex-col items-center justify-center">
                        <div className="p-6 min-w-[56%] w-full h-full flex flex-col">
                            <div className="text-5xl font-semibold mb-10 flex w-full justify-center items-center">
                                {t('total')}: €{payModalTargetTotal.toFixed(2)}
                            </div>
                            <div className="grid grid-cols-4 gap-4 w-full mb-4 h-full items-start justify-center">
                                {paymentMethodsLoading ? (
                                    <div className="col-span-full text-sm text-black py-6 text-center">
                                        {tr('orderPanel.loadingPaymentMethods', 'Loading payment methods...')}
                                    </div>
                                ) : activePaymentMethods.length === 0 ? (
                                    <div className="col-span-full text-sm text-black py-6 text-center max-w-lg px-4">
                                        {tr(
                                            'orderPanel.noPaymentMethods',
                                            'No active payment methods. Configure them under Control → Payment types.',
                                        )}
                                    </div>
                                ) : (
                                    activePaymentMethods.map((m) => {
                                        const amt = Number(paymentAmounts[m.id]) || 0;
                                        const isHighlighted = selectedPayment === m.id || amt > 0;
                                        const integ = m.integration || 'generic';
                                        return (
                                            <div key={m.id} className="flex flex-col items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    disabled={payModalSplitComplete || payModalExiting}
                                                    onClick={() => handlePaymentMethodClick(m)}
                                                        className={`rounded-lg border-2 p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isHighlighted ? 'bg-rose-500 border-rose-700' : 'bg-white border-black'
                                                        }`}
                                                    aria-label={m.name}
                                                >
                                                    {integ === 'manual_cash' ||
                                                        integ === 'cashmatic' ||
                                                        integ === 'payworld' ||
                                                        integ === 'generic' ? (
                                                        <img
                                                            src={payMethodIconSrc(integ)}
                                                            alt=""
                                                            className="max-h-[100px] min-w-[200px] w-[200px] h-[100px] object-contain"
                                                            onError={(e) => {
                                                                const el = e.currentTarget;
                                                                if (integ === 'payworld' && el.dataset.svgFallback !== '1') {
                                                                    el.dataset.svgFallback = '1';
                                                                    el.src = publicAssetUrl('/payworld.svg');
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="flex items-center justify-center w-[200px] min-h-[100px] px-2 py-3 text-xl font-semibold text-center text-black bg-white rounded leading-tight">
                                                            {m.name}
                                                        </span>
                                                    )}
                                                </button>
                                                <div className="text-2xl font-semibold tabular-nums text-center text-black" aria-live="polite">
                                                    <span className="block text-xl font-normal mb-0.5 truncate">{m.name}</span>
                                                    {formatPaymentAmount(amt)}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                        <div className="p-6 w-full">
                            <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
                                <span className="text-3xl font-semibold tabular-nums whitespace-nowrap">
                                    {t('assigned')}: €{payModalTotalAssigned.toFixed(2)}
                                </span>
                                <input
                                    readOnly
                                    className="w-[200px] py-2 px-3 border-2 border-black rounded-lg text-3xl outline-none cursor-default focus:border-rose-500 focus:outline-none"
                                    value={remainingToAssign.toFixed(2)}
                                    aria-label={tr('orderPanel.remainingToAssign', 'Remaining to assign')}
                                />
                                <button
                                    type="button"
                                    disabled={payModalExiting}
                                    className="py-2 px-6 min-h-[56px] rounded-lg text-3xl font-medium border-2 border-black bg-white text-black active:text-white active:border-white active:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handlePayReset}
                                >
                                    {t('reset')}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-around px-6 gap-4 w-full pt-6 pb-6">
                        <button
                            type="button"
                            disabled={payModalExiting}
                            className="w-[300px] h-[70px] py-2 px-4 rounded-lg text-3xl font-medium bg-white text-black active:text-white active:border-white active:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => void handleCancel()}
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="button"
                            disabled={
                                payModalExiting ||
                                Math.abs(payModalTotalAssigned - payModalTargetTotal) > 0.009 ||
                                payConfirmLoading ||
                                paymentMethodsLoading ||
                                activePaymentMethods.length === 0
                            }
                            className={`w-[300px] h-[70px] py-2 px-4 rounded-lg text-3xl font-medium ${payModalExiting ||
                                Math.abs(payModalTotalAssigned - payModalTargetTotal) > 0.009 ||
                                payConfirmLoading ||
                                paymentMethodsLoading ||
                                activePaymentMethods.length === 0
                                ? 'bg-rose-500/40 text-white cursor-not-allowed'
                                : 'bg-rose-600 text-white active:text-white active:border-white active:bg-rose-500 cursor-pointer'
                                }`}
                            onClick={() => void handleConfirmPayment()}
                        >
                            {payConfirmLoading ? t('processing') : t('toConfirm')}
                        </button>
                    </div>
                </div>
                </div>
            </div>
            ) : null}

            {showPayworldStatusModal ? (
                <div
                    className={payworldOverlayClassName}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="payworld-status-title"
                >
                    <div className="bg-white rounded-lg shadow-xl px-10 py-8 max-w-2xl w-full mx-4 border border-black">
                        <h2 id="payworld-status-title" className="text-3xl mb-6 font-semibold text-black text-center">
                            {tr('orderPanel.payworldModalTitle', 'Payworld / PAX A35 Payment')}
                        </h2>
                        <div className="space-y-4 text-black">
                            <div className="flex justify-between items-center text-2xl">
                                <span>{tr('orderPanel.payworldAmount', 'Amount')}:</span>
                                <span className="font-semibold">€ {payModalTargetTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-2xl">
                                <span>{tr('orderPanel.payworldStatusLabel', 'Status')}:</span>
                                <span className="font-semibold">{payworldStatusTitle}</span>
                            </div>
                            {payworldStatus.message ? (
                                <div className="rounded-md bg-white px-4 py-3 text-xl whitespace-pre-line">{payworldStatus.message}</div>
                            ) : null}
                        </div>
                        <div className="mt-8 flex justify-center gap-4">
                            {String(payworldStatus.state || '').toUpperCase() === 'IN_PROGRESS' ? (
                                <button
                                    type="button"
                                    className="min-w-[220px] py-4 bg-white text-black rounded text-2xl active:bg-rose-500"
                                    onClick={() => void handleAbortPayworld()}
                                >
                                    {tr('orderPanel.cancelPayworld', 'Cancel Payment')}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                            className="min-w-[220px] py-4 bg-white text-black rounded text-2xl active:bg-rose-500"
                                    onClick={() => setShowPayworldStatusModal(false)}
                                >
                                    {tr('orderPanel.closePayworldModal', 'Close')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
