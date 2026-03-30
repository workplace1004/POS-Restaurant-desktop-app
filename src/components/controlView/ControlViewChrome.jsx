import React from 'react';
import {
  CONTROL_SIDEBAR_ITEMS,
  TOP_NAV_ITEMS,
  SUB_NAV_ITEMS,
  CASH_REGISTER_SUB_NAV_ITEMS,
  EXTERNAL_DEVICES_SUB_NAV_ITEMS,
  REPORT_TABS
} from './constants.js';
import { SidebarIcon, TopNavIcon, ReportTabIcon } from './ControlViewIcons.jsx';

export function ControlViewSidebar({
  tr,
  currentUser,
  onBack,
  onRequestLogout,
  controlSidebarId,
  setControlSidebarId
}) {
  return (
    <aside className="w-1/5 shrink-0 flex flex-col bg-pos-panel border-r border-pos-border">
      <nav className="flex flex-col gap-0.5 flex-1 p-3">
        {CONTROL_SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`flex items-center gap-3 px-2 py-3 rounded-lg text-left text-md transition-colors ${
              controlSidebarId === item.id
                ? 'bg-pos-bg text-pos-text font-medium'
                : 'text-pos-muted active:bg-green-500 active:text-pos-text'
            }`}
            onClick={() => setControlSidebarId(item.id)}
          >
            <SidebarIcon id={item.icon} className="w-6 h-6 shrink-0" />
            {tr(`control.sidebar.${item.id}`, item.label)}
          </button>
        ))}
      </nav>
      <div className="p-4 w-full flex flex-col items-center gap-2">
        {currentUser && (
          <p className="text-pos-text text-xl font-medium truncate px-1">{currentUser.label}</p>
        )}
        <div className="flex flex-col">
          <button
            type="button"
            className="px-3 py-1 rounded-lg text-pos-muted active:text-pos-text active:bg-green-500 text-2xl"
            onClick={() => onBack?.()}
          >
            {tr('backName', 'Back')}
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-lg text-rose-500 active:text-pos-text active:bg-green-500 text-2xl font-medium"
            onClick={onRequestLogout}
          >
            {tr('logOut', 'Log out')}
          </button>
        </div>
      </div>
    </aside>
  );
}

export function ControlViewMainNav({
  tr,
  controlSidebarId,
  topNavId,
  setTopNavId,
  subNavId,
  setSubNavId,
  reportTabId,
  setReportTabId,
  onCashRegisterSubNavSelect
}) {
  return (
    <>
      {controlSidebarId === 'personalize' && (
        <div className="flex items-center gap-1 py-2 px-4 justify-between w-full bg-pos-bg/50">
          {TOP_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`flex items-center gap-2 px-2 py-3 rounded-lg text-lg transition-colors ${
                topNavId === item.id
                  ? 'bg-pos-panel text-pos-text font-medium border border-pos-border'
                  : 'text-pos-muted active:text-pos-text active:bg-green-500 border border-transparent'
              }`}
              onClick={() => {
                setTopNavId(item.id);
                if (item.id === 'categories-products') setSubNavId('Price Groups');
                if (item.id === 'cash-register') setSubNavId('Template Settings');
                if (item.id === 'external-devices') setSubNavId('Printer');
              }}
            >
              <TopNavIcon id={item.icon} className="w-6 h-6 shrink-0" />
              {tr(`control.topNav.${item.id}`, item.label)}
            </button>
          ))}
        </div>
      )}

      {controlSidebarId === 'reports' && (
        <div className="flex items-center gap-1 px-4 py-2 justify-around w-full bg-pos-bg/50">
          {REPORT_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                reportTabId === item.id
                  ? 'bg-pos-panel text-pos-text font-medium border border-pos-border'
                  : 'text-pos-muted active:text-pos-text active:bg-green-500 border border-transparent'
              }`}
              onClick={() => setReportTabId(item.id)}
            >
              <ReportTabIcon id={item.icon} className="w-5 h-5 shrink-0" />
              {tr(`control.reportTabs.${item.id}`, item.label)}
            </button>
          ))}
        </div>
      )}

      {controlSidebarId === 'personalize' && topNavId === 'categories-products' && (
        <div className="flex items-center w-full justify-between gap-1 px-4 bg-pos-bg">
          {SUB_NAV_ITEMS.map((label) => (
            <button
              key={label}
              type="button"
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                subNavId === label
                  ? 'bg-pos-panel text-pos-text font-medium'
                  : 'text-pos-muted active:text-pos-text active:bg-green-500'
              }`}
              onClick={() => setSubNavId(label)}
            >
              {tr(`control.subNav.${label}`, label)}
            </button>
          ))}
        </div>
      )}

      {controlSidebarId === 'personalize' && topNavId === 'cash-register' && (
        <div className="flex items-center w-full justify-around gap-1 px-4 py-3 bg-pos-bg">
          {CASH_REGISTER_SUB_NAV_ITEMS.map((label) => (
            <button
              key={label}
              type="button"
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                subNavId === label
                  ? 'bg-pos-panel text-pos-text font-medium'
                  : 'text-pos-muted active:text-pos-text active:bg-green-500'
              }`}
              onClick={() => onCashRegisterSubNavSelect(label)}
            >
              {tr(`control.subNav.${label}`, label)}
            </button>
          ))}
        </div>
      )}

      {controlSidebarId === 'personalize' && topNavId === 'external-devices' && (
        <div className="flex items-center w-full justify-between gap-1 px-4 bg-pos-bg">
          {EXTERNAL_DEVICES_SUB_NAV_ITEMS.map((label) => (
            <button
              key={label}
              type="button"
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                subNavId === label
                  ? 'bg-pos-panel text-pos-text font-medium'
                  : 'text-pos-muted active:text-pos-text active:bg-green-500'
              }`}
              onClick={() => setSubNavId(label)}
            >
              {tr(`control.subNav.${label}`, label)}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
