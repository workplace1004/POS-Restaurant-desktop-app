import React from 'react';
import { Dropdown } from '../Dropdown';
import { KeyboardWithNumpad } from '../KeyboardWithNumpad';

const TABLE_LOCATION_BACKGROUND_OPTIONS = [
  { value: '', labelKey: 'control.tables.backgroundDefault', fallback: 'Default' },
  { value: 'white', labelKey: 'control.tables.backgroundWhite', fallback: 'White' },
  { value: 'gray', labelKey: 'control.tables.backgroundGray', fallback: 'Gray' },
  { value: 'blue', labelKey: 'control.tables.backgroundBlue', fallback: 'Blue' }
];

export function ControlViewTableLocationModal({
  tr,
  mapTranslatedOptions,
  showTableLocationModal,
  topNavId,
  closeTableLocationModal,
  tableLocationNameInputRef,
  tableLocationName,
  setTableLocationName,
  tableLocationSelectionStart,
  tableLocationSelectionEnd,
  setTableLocationSelectionStart,
  setTableLocationSelectionEnd,
  tableLocationBackground,
  setTableLocationBackground,
  tableLocationTextColor,
  setTableLocationTextColor,
  savingTableLocation,
  handleSaveTableLocation
}) {
  if (!showTableLocationModal || topNavId !== 'tables') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-pos-bg rounded-xl shadow-2xl max-w-[90%] w-full justify-center items-center mx-4 overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="absolute top-4 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={closeTableLocationModal} aria-label="Close">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="p-6 flex flex-col space-y-6 w-full justify-center items-center pt-20">
          <div className="w-full flex flex-col justify-center items-center gap-10">
            <div className="flex gap-2 w-full items-center justify-center">
              <label className="block min-w-[200px] text-md min-w-[100px] font-medium text-gray-200 mb-2">{tr('control.tables.tableName', 'Table Name :')}</label>
              <input
                type="text"
                ref={tableLocationNameInputRef}
                value={tableLocationName}
                onChange={(e) => setTableLocationName(e.target.value)}
                onClick={(e) => {
                  setTableLocationSelectionStart(e.target.selectionStart ?? 0);
                  setTableLocationSelectionEnd(e.target.selectionEnd ?? 0);
                }}
                onKeyUp={(e) => {
                  setTableLocationSelectionStart(e.target.selectionStart ?? 0);
                  setTableLocationSelectionEnd(e.target.selectionEnd ?? 0);
                }}
                onSelect={(e) => {
                  setTableLocationSelectionStart(e.target.selectionStart ?? 0);
                  setTableLocationSelectionEnd(e.target.selectionEnd ?? 0);
                }}
                placeholder={tr('control.tables.tableNamePlaceholder', 'e.g. room 1')}
                className="px-4 w-[200px] bg-pos-panel h-[40px] py-3 text-md border border-gray-300 rounded-lg text-gray-200 caret-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="flex gap-2 w-full items-center justify-center">
              <label className="block min-w-[200px] text-md min-w-[100px] font-medium text-gray-200 mb-2">{tr('control.tables.background', 'Background :')}</label>
              <Dropdown
                options={mapTranslatedOptions(TABLE_LOCATION_BACKGROUND_OPTIONS)}
                value={tableLocationBackground}
                onChange={setTableLocationBackground}
                placeholder={tr('control.tables.backgroundDefault', 'Default')}
                className="text-md min-w-[200px]"
              />
            </div>
            <div className="flex gap-2 w-full items-center justify-center">
              <label className="block min-w-[200px] text-md min-w-[100px] font-medium text-gray-200 mb-2">{tr('control.tables.textColor', 'Text color :')}</label>
              <div className="w-[200px] flex gap-6 items-center justify-start">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tableLocationTextColor" checked={tableLocationTextColor === 'light'} onChange={() => setTableLocationTextColor('light')} className="w-5 h-5 rounded border-gray-300" />
                  <span className="text-gray-200 text-md">{tr('control.tables.textColorLight', 'light')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tableLocationTextColor" checked={tableLocationTextColor === 'dark'} onChange={() => setTableLocationTextColor('dark')} className="w-5 h-5 rounded border-gray-300" />
                  <span className="text-gray-200 text-md">{tr('control.tables.textColorDark', 'dark')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-5 pb-5">
          <button
            type="button"
            className="flex items-center text-lg gap-4 px-6 py-3 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50"
            disabled={savingTableLocation}
            onClick={handleSaveTableLocation}
          >
            <svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 16 16" id="save-16px" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
            Save
          </button>
        </div>
        <div className="shrink-0">
          <KeyboardWithNumpad
            value={tableLocationName}
            onChange={setTableLocationName}
            selectionStart={tableLocationSelectionStart}
            selectionEnd={tableLocationSelectionEnd}
            onSelectionChange={(start, end) => {
              setTableLocationSelectionStart(start);
              setTableLocationSelectionEnd(end);
            }}
          />
        </div>
      </div>
    </div>
  );
}
