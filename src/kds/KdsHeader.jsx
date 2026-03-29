import React, { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const iconBtnClass =
  'inline-flex items-center justify-center rounded-xl bg-[#2d2d2d] p-4 min-h-[56px] min-w-[56px] text-white hover:bg-[#3d3d3d] active:bg-[#454545] transition-colors';

function IconSignOut({ className = 'h-9 w-9' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
}

function IconSettings({ className = 'h-9 w-9' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export function KdsHeader({
  kitchens = [],
  activeTab,
  onTabChange,
  online,
  stationKitchen = null,
  standaloneAdminSession = false,
  onStationLogout,
  onSettingsClick
}) {
  const { t } = useLanguage();
  const tabs = useMemo(
    () => [{ id: 'ALL', label: t('all') }, ...kitchens.map((k) => ({ id: k.id, label: k.name || k.id }))],
    [kitchens, t]
  );

  const settingsButton =
    onSettingsClick != null ? (
      <button
        type="button"
        onClick={onSettingsClick}
        className={iconBtnClass}
        aria-label={t('kds.settings')}
        title={t('kds.settings')}
      >
        <IconSettings />
      </button>
    ) : null;

  if (stationKitchen) {
    return (
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#121212] text-white border-b border-black/40">
        <div className="flex flex-wrap items-baseline gap-3 min-w-0">
          <span className="text-2xl font-bold tracking-tight">{t('kds.title')}</span>
          <span className="rounded-lg bg-[#c0392b] px-3 py-1 text-sm font-semibold">
            {stationKitchen.name || stationKitchen.id}
          </span>
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${online ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {online ? t('kds.online') : t('kds.offline')}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-20">
          {onStationLogout ? (
            <button
              type="button"
              onClick={onStationLogout}
              className={iconBtnClass}
              aria-label={t('kds.signOut')}
              title={t('kds.signOut')}
            >
              <IconSignOut />
            </button>
          ) : null}
          {settingsButton}
        </div>
      </header>
    );
  }

  if (standaloneAdminSession && onStationLogout) {
    return (
      <header className="flex shrink-0 flex-col gap-3 px-4 py-3 bg-[#121212] text-white border-b border-black/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-3 min-w-0">
            <span className="text-2xl font-bold tracking-tight">{t('kds.title')}</span>
            <span className="rounded-lg bg-amber-600 px-3 py-1 text-sm font-semibold text-white shadow">
              {t('kds.admin')}
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-wide ${online ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {online ? t('kds.online') : t('kds.offline')}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-20">
            <button
              type="button"
              onClick={onStationLogout}
              className={iconBtnClass}
              aria-label={t('kds.signOut')}
              title={t('kds.signOut')}
            >
              <IconSignOut />
            </button>
            {settingsButton}
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-2" aria-label={t('kds.stationsNavAria')}>
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[#c0392b] text-white shadow'
                    : 'bg-[#2d2d2d] text-white/90 hover:bg-[#3d3d3d]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>
    );
  }

  return (
    <header className="flex shrink-0 items-center gap-4 px-4 py-3 bg-[#121212] text-white border-b border-black/40">
      <div className="flex items-baseline gap-3 min-w-0">
        <span className="text-2xl font-bold tracking-tight">{t('kds.title')}</span>
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${online ? 'text-emerald-400' : 'text-red-400'}`}
        >
          {online ? t('kds.online') : t('kds.offline')}
        </span>
      </div>
      <nav className="flex flex-wrap items-center gap-2" aria-label={t('kds.stationsNavAria')}>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-[#c0392b] text-white shadow'
                  : 'bg-[#2d2d2d] text-white/90 hover:bg-[#3d3d3d]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
