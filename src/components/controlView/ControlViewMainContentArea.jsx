import React, { useState } from 'react';
import { Dropdown } from '../Dropdown';
import { KeyboardWithNumpad } from '../KeyboardWithNumpad';
import { SmallKeyboardWithNumpad } from '../SmallKeyboardWithNumpad';
import { PaginationArrows } from '../PaginationArrows';
import { ControlViewCategoriesProductsContent } from './ControlViewCategoriesProductsContent';
import { ControlViewExternalSimpleDevices } from './ControlViewExternalSimpleDevices';
import { ControlViewCashmatic } from './ControlViewCashmatic';
import { ControlViewPayworld } from './ControlViewPayworld';
import { ControlViewExternalPrinter } from './ControlViewExternalPrinter';
import { TopNavIcon, ReportTabIcon } from './controlViewNavIcons';
import { DISABLE_CONTROL_TABLES_TOP_NAV } from './controlViewUtils.js';
import { buildFinancialReportPrintLines } from '../../lib/financialReportPrintLines.js';
import { buildUserReportPrintLines } from '../../lib/userReportPrintLines.js';
import { printPeriodicReportLines, splitPeriodicReportBodyIntoChunks } from '../../lib/periodicReportDisplay.js';
import { ReportPrintErrorModal } from './ReportPrintErrorModal.jsx';

export function ControlViewMainContentArea({ ctx }) {
  const [reportPrintErrorMessage, setReportPrintErrorMessage] = useState(null);
  const {
    BARCODE_SCANNER_TYPE_OPTIONS,
    CASH_REGISTER_SUB_NAV_ITEMS,
    CREDIT_CARD_TYPE_OPTIONS,
    EXTERNAL_DEVICES_SUB_NAV_ITEMS,
    GROUPING_RECEIPT_OPTIONS,
    LANGUAGE_OPTIONS,
    PERIODIC_REPORT_TIME_OPTIONS,
    PRICE_DISPLAY_TYPE_OPTIONS,
    PRINTERS_PAGE_SIZE,
    PRINTER_TAB_DEFS,
    PRINTING_ORDER_OPTIONS,
    REPORT_GENERATE_UNTIL_OPTIONS,
    REPORT_SETTINGS_ROWS,
    REPORT_TABS,
    RFID_READER_TYPE_OPTIONS,
    SCALE_PORT_OPTIONS,
    SCALE_TYPE_OPTIONS,
    SUB_NAV_ITEMS,
    TOP_NAV_ITEMS,
    appLanguage,
    barcodeScannerType,
    canCategoriesScrollDown,
    canCategoriesScrollUp,
    canDiscountsScrollDown,
    canDiscountsScrollUp,
    canKitchenScrollDown,
    canKitchenScrollUp,
    canLabelsScrollDown,
    canLabelsScrollUp,
    canPaymentTypesScrollDown,
    canPaymentTypesScrollUp,
    canPriceGroupsScrollDown,
    canPriceGroupsScrollUp,
    canProductsScrollDown,
    canProductsScrollUp,
    canSubproductsScrollDown,
    canSubproductsScrollUp,
    canTableLocationsScrollDown,
    canTableLocationsScrollUp,
    canUsersScrollDown,
    canUsersScrollUp,
    cashmaticConnectionType,
    cashmaticIpAddress,
    cashmaticName,
    cashmaticPassword,
    cashmaticPort,
    cashmaticUrl,
    cashmaticUsername,
    cashmaticKeyboardOnChange,
    cashmaticKeyboardValue,
    categories,
    categoriesListRef,
    controlSidebarId,
    creditCardType,
    discounts,
    discountsListRef,
    finalTicketsCompanyData1,
    finalTicketsCompanyData2,
    finalTicketsCompanyData3,
    finalTicketsCompanyData4,
    finalTicketsCompanyData5,
    finalTicketsPrintLogo,
    finalTicketsPrintPaymentType,
    finalTicketsPrintingOrder,
    finalTicketsProforma,
    finalTicketsThankText,
    finalTicketsTicketTearable,
    finalTicketsKeyboardOnChange,
    finalTicketsKeyboardValue,
    financialReportKind,
    userReportKind,
    filteredProducts,
    handleMoveCategory,
    handleSaveAppLanguage,
    handleSaveBarcodeScanner,
    handleSaveCashmatic,
    handleSaveCreditCard,
    handleSaveFinalTickets,
    handleSavePayworld,
    handleSavePriceDisplay,
    handleSaveProductionTickets,
    handleMakePeriodicReport,
    handleSaveReportSettings,
    handleSaveRfidReader,
    handleSaveScale,
    kitchenListRef,
    kitchens,
    lang,
    labelsList,
    labelsListRef,
    labelsPrinter,
    labelsType,
    labelsTypeOptions,
    labelsPrinterOptions,
    mapTranslatedOptions,
    openCategoryModal,
    openEditCategoryModal,
    openEditDiscountModal,
    openEditKitchenModal,
    openEditLabelModal,
    openEditPaymentTypeModal,
    openEditPriceGroupModal,
    openEditPrinterModal,
    openEditProductModal,
    openProductKioskConfiguration,
    openEditSubproductModal,
    openEditTableLocationModal,
    openEditUserModal,
    openKitchenProductsModal,
    openNewDiscountModal,
    openNewKitchenModal,
    openNewLabelModal,
    openNewPaymentTypeModal,
    openNewPrinterModal,
    openNewUserModal,
    openPriceGroupModal,
    openProductModal,
    openProductSubproductsModal,
    openSetTablesModal,
    openSubproductModal,
    openTableLocationModal,
    paymentTypes,
    paymentTypesListRef,
    paymentTypesLoading,
    payworldIpAddress,
    payworldName,
    payworldPort,
    payworldKeyboardOnChange,
    payworldKeyboardValue,
    periodicReportEndDate,
    periodicReportEndTime,
    periodicReportLines,
    periodicReportLoading,
    periodicReportStartDate,
    periodicReportStartTime,
    priceDisplayType,
    priceGroups,
    priceGroupsListRef,
    printerTab,
    printers,
    printersPage,
    prodTicketsDisplayCategories,
    prodTicketsEatInTakeOutOnderaan,
    prodTicketsGroupingReceipt,
    prodTicketsKeukenprinterBuzzer,
    prodTicketsNextCoursePrinter1,
    prodTicketsNextCoursePrinter2,
    prodTicketsNextCoursePrinter3,
    prodTicketsNextCoursePrinter4,
    prodTicketsPrinterOverboeken,
    prodTicketsPrintingOrder,
    prodTicketsProductenIndividueel,
    prodTicketsSpaceAbove,
    prodTicketsTicketTearable,
    productionTicketsPrinterOptions,
    productHasSubproductsById,
    productSearch,
    products,
    productsCategoryTabsRef,
    productsListRef,
    reportGenerateUntil,
    reportSettings,
    reportTabId,
    rfidReaderType,
    saveLabelsSettings,
    savingAppLanguage,
    savingBarcodeScanner,
    savingCashmatic,
    savingCreditCard,
    savingFinalTickets,
    savingPayworld,
    savingPriceDisplay,
    savingProdTickets,
    savingReportSettings,
    savingRfidReader,
    savingScale,
    scalePort,
    scaleType,
    scrollCategoriesByPage,
    scrollDiscountsByPage,
    scrollKitchenByPage,
    scrollLabelsByPage,
    scrollPaymentTypesByPage,
    scrollPriceGroupsByPage,
    scrollProductsByPage,
    scrollSubproductsByPage,
    scrollTableLocationsByPage,
    scrollUsersByPage,
    selectedCategoryId,
    selectedProductId,
    selectedSubproductGroupId,
    selectedSubproductId,
    setAppLanguage,
    setBarcodeScannerType,
    setCashmaticActiveField,
    setCashmaticConnectionType,
    setCashmaticIpAddress,
    setCashmaticName,
    setCashmaticPassword,
    setCashmaticPort,
    setCashmaticUrl,
    setCashmaticUsername,
    setCreditCardType,
    setDefaultPrinter,
    setDeleteConfirmCategoryId,
    setDeleteConfirmDiscountId,
    setDeleteConfirmId,
    setDeleteConfirmKitchenId,
    setDeleteConfirmLabelId,
    setDeleteConfirmPaymentTypeId,
    setDeleteConfirmPrinterId,
    setDeleteConfirmProductId,
    setDeleteConfirmSubproductId,
    setDeleteConfirmTableLocationId,
    setDeleteConfirmUserId,
    setFinalTicketsActiveField,
    setFinalTicketsCompanyData1,
    setFinalTicketsCompanyData2,
    setFinalTicketsCompanyData3,
    setFinalTicketsCompanyData4,
    setFinalTicketsCompanyData5,
    setFinalTicketsPrintLogo,
    setFinalTicketsPrintPaymentType,
    setFinalTicketsPrintingOrder,
    setFinalTicketsProforma,
    setFinalTicketsThankText,
    setFinalTicketsTicketTearable,
    setPayworldActiveField,
    setPayworldIpAddress,
    setPayworldName,
    setPayworldPort,
    setPeriodicReportEndDate,
    setPeriodicReportEndTime,
    setPeriodicReportStartDate,
    setPeriodicReportStartTime,
    setPriceDisplayType,
    setPrinterTab,
    setPrintersPage,
    setProdTicketsDisplayCategories,
    setProdTicketsEatInTakeOutOnderaan,
    setProdTicketsGroupingReceipt,
    setProdTicketsKeukenprinterBuzzer,
    setProdTicketsNextCoursePrinter1,
    setProdTicketsNextCoursePrinter2,
    setProdTicketsNextCoursePrinter3,
    setProdTicketsNextCoursePrinter4,
    setProdTicketsPrinterOverboeken,
    setProdTicketsPrintingOrder,
    setProdTicketsProductenIndividueel,
    setProdTicketsSpaceAbove,
    setProdTicketsTicketTearable,
    setProductSearch,
    setFinancialReportKind,
    setUserReportKind,
    setReportGenerateUntil,
    setReportTabId,
    setRfidReaderType,
    setScalePort,
    setScaleType,
    setSelectedCategoryId,
    setSelectedProductId,
    setSelectedSubproductGroupId,
    setSelectedSubproductId,
    setShowDeviceSettingsModal,
    setShowManageGroupsModal,
    setShowProductSearchKeyboard,
    setShowProductionMessagesModal,
    setShowSystemSettingsModal,
    setSubNavId,
    setTopNavId,
    subNavId,
    subproductGroups,
    subproducts,
    subproductsGroupTabsRef,
    subproductsListRef,
    tableLocations,
    tableLocationsListRef,
    tableLocationsLoading,
    togglePaymentTypeActive,
    topNavId,
    tr,
    updateCategoriesScrollState,
    updateDiscountsScrollState,
    updateKitchenScrollState,
    updateLabelsScrollState,
    updatePaymentTypesScrollState,
    updatePriceGroupsScrollState,
    updateProductsScrollState,
    updateSubproductsScrollState,
    updateTableLocationsScrollState,
    updateUsersScrollState,
    users,
    usersListRef
  } = ctx;

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Top navigation - Personalize only */}
      {controlSidebarId === 'personalize' && (
        <div className="flex items-center gap-1 py-2 px-4 justify-between w-full bg-pos-bg/50">
          {TOP_NAV_ITEMS.map((item) => {
            const tablesNavOff = DISABLE_CONTROL_TABLES_TOP_NAV && item.id === 'tables';
            return (
              <button
                key={item.id}
                type="button"
                disabled={tablesNavOff}
                className={`flex items-center gap-2 px-2 py-3 rounded-lg text-lg transition-colors ${tablesNavOff
                  ? 'opacity-40 cursor-not-allowed text-black/60 border border-transparent'
                  : topNavId === item.id
                    ? 'bg-rose-600 text-white font-medium'
                    : 'text-black active:text-white active:bg-rose-500 border border-transparent'
                  }`}
                onClick={() => {
                  if (tablesNavOff) return;
                  setTopNavId(item.id);
                  if (item.id === 'categories-products') setSubNavId('Price Groups');
                  if (item.id === 'cash-register') setSubNavId('Payment types');
                  if (item.id === 'external-devices') setSubNavId('Printer');
                }}
              >
                <TopNavIcon id={item.icon} className="w-6 h-6 shrink-0" />
                {tr(`control.topNav.${item.id}`, item.label)}
              </button>
            );
          })}
        </div>
      )}

      {/* Reports tabs - when Reports sidebar selected */}
      {controlSidebarId === 'reports' && (
        <div className="flex items-center gap-1 px-4 py-2 justify-around w-full bg-pos-bg/50">
          {REPORT_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${reportTabId === item.id
                ? 'font-medium bg-rose-500 text-white border border-pos-border'
                : 'text-black active:text-white active:bg-rose-500 border border-transparent'
                }`}
              onClick={() => setReportTabId(item.id)}
            >
              <ReportTabIcon id={item.icon} className="w-5 h-5 shrink-0" />
              {tr(`control.reportTabs.${item.id}`, item.label)}
            </button>
          ))}
        </div>
      )}

      {/* Sub-navigation - Categories and products */}
      {controlSidebarId === 'personalize' && topNavId === 'categories-products' && (
        <div className="flex items-center w-full justify-between gap-1 px-4 bg-pos-bg">
          {SUB_NAV_ITEMS.map((label) => (
            <button
              key={label}
              type="button"
              className={`px-4 py-2 rounded-lg text-lg transition-colors ${subNavId === label
                ? 'bg-rose-600 text-white font-medium'
                : 'text-black active:text-white active:bg-rose-500'
                }`}
              onClick={() => setSubNavId(label)}
            >
              {tr(`control.subNav.${label}`, label)}
            </button>
          ))}
        </div>
      )}

      {/* Sub-navigation - Cash Register Settings */}
      {controlSidebarId === 'personalize' && topNavId === 'cash-register' && (
        <div className="flex items-center w-full justify-around gap-1 px-4 py-3 bg-pos-bg">
          {CASH_REGISTER_SUB_NAV_ITEMS.map((label) => (
            <button
              key={label}
              type="button"
              className={`px-4 py-2 rounded-lg transition-colors ${subNavId === label
                ? 'bg-rose-600 text-white font-medium'
                : 'text-black active:text-white active:bg-rose-500'
                }`}
              onClick={() => {
                setSubNavId(label);
                if (label === 'Device Settings') setShowDeviceSettingsModal(true);
                if (label === 'System Settings') setShowSystemSettingsModal(true);
                if (label === 'Production messages') setShowProductionMessagesModal(true);
              }}
            >
              {tr(`control.subNav.${label}`, label)}
            </button>
          ))}
        </div>
      )}

      {/* Sub-navigation - External Devices (matches Categories and products tab style) */}
      {controlSidebarId === 'personalize' && topNavId === 'external-devices' && (
        <div className="flex items-center w-full justify-between gap-1 px-4 bg-pos-bg">
          {EXTERNAL_DEVICES_SUB_NAV_ITEMS.map((label) => (
            <button
              key={label}
              type="button"
              className={`px-4 h-[68px] w-[100px] py-2 rounded-lg text-lg transition-colors ${subNavId === label
                ? 'bg-rose-600 text-white font-medium'
                : 'text-black active:text-white active:bg-rose-500'
                }`}
              onClick={() => setSubNavId(label)}
            >
              {tr(`control.subNav.${label}`, label)}
            </button>
          ))}
        </div>
      )}

      {/* Content area */}
      <main className="flex-1 overflow-hidden px-4 pt-2">
        {controlSidebarId === 'reports' ? (
          <div className="flex flex-col h-full gap-4">
            {reportTabId === 'financial' && (
              <div className="flex gap-4 flex-col min-h-0 flex-1 w-full">
                <div className="shrink-0 flex justify-around gap-2 h-[46px] w-full items-center px-2">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg text-lg font-medium min-w-[100px] transition-colors ${financialReportKind === 'z'
                      ? 'bg-rose-600 text-white'
                      : 'text-pos-text active:bg-rose-500 active:text-white'
                      }`}
                    onClick={() => setFinancialReportKind('z')}
                  >
                    Z
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg text-lg font-medium min-w-[100px] transition-colors ${financialReportKind === 'x'
                      ? 'bg-rose-600 text-white'
                      : 'text-pos-text active:bg-rose-500 active:text-white'
                      }`}
                    onClick={() => setFinancialReportKind('x')}
                  >
                    X
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg text-lg font-medium min-w-[100px] transition-colors ${financialReportKind === 'history'
                      ? 'bg-rose-600 text-white'
                      : 'text-pos-text active:bg-rose-500 active:text-white'
                      }`}
                    onClick={() => setFinancialReportKind('history')}
                  >
                    {tr('control.reports.history', 'History')}
                  </button>
                </div>
                <div className="relative grid grid-cols-2 flex-1 px-4 min-h-0 gap-4">
                  <div className="flex flex-col min-h-0 gap-3">
                    <div
                      key={financialReportKind}
                      id="financial-report-pospoint-scroll"
                      className="flex-1 overflow-auto rounded-xl border border-pos-border bg-white text-gray-800 p-4 min-h-[400px]"
                    >
                      <div className="text-sm font-mono space-y-1 whitespace-pre-wrap text-center">
                        {financialReportKind === 'history' ? (
                          <div className="text-left space-y-4">
                            <div className="text-center border-b border-dotted border-gray-400 pb-2 mb-4 font-semibold text-base">
                              {tr('control.reports.financialHistoryTitle', 'Financial report history')}
                            </div>
                            <div className="font-medium">{tr('control.reports.zReports', 'Z reports (close of day)')}</div>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                              <li>11-04-2026 09:44 — Z FINANCIEEL #2</li>
                              <li>10-04-2026 23:58 — Z FINANCIEEL #1</li>
                              <li>09-04-2026 23:45 — Z FINANCIEEL #3</li>
                            </ul>
                            <div className="font-medium mt-6">{tr('control.reports.xReports', 'X reports (interim)')}</div>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                              <li>11-04-2026 08:00 — X FINANCIEEL #4</li>
                              <li>10-04-2026 14:30 — X FINANCIEEL #3</li>
                              <li>10-04-2026 09:00 — X FINANCIEEL #2</li>
                            </ul>
                          </div>
                        ) : (
                          <>
                            <div className="text-base font-medium mb-2">pospoint demo</div>
                            <div className="mb-2">BE.0.0.0</div>
                            <div className="flex justify-between border-b border-dotted border-gray-400 pb-1 mb-2">
                              <span>Date : {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</span>
                              <span>Tijd: {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
                            </div>
                            <div className="border-b border-dotted border-gray-400 pb-2 mb-4 font-semibold">
                              {financialReportKind === 'z' ? 'Z FINANCIEEL #2' : 'X FINANCIEEL #4'}
                            </div>
                            <div className="text-left space-y-1">
                              <div className="font-medium">Terminals:</div>
                              <div>Kassa 2 — 16/01-08:26 =&gt; 25/01-11:04</div>
                              <div>Kassa 4 — 13/01-19:07 =&gt; 25/02-14:27</div>
                              <div className="mt-4 font-medium">BTW per tarief</div>
                              <table className="w-full border-collapse mt-1 text-left">
                                <thead>
                                  <tr className="border-b border-gray-300">
                                    <th className="py-1">MvH NS</th>
                                    <th className="py-1">MvH NR</th>
                                    <th className="py-1">Btw</th>
                                    <th className="py-1">{tr('total', 'Total')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-gray-200">
                                    <td className="py-1">{financialReportKind === 'z' ? '333.73' : '128.40'}</td>
                                    <td className="py-1">{financialReportKind === 'z' ? '2.83' : '0.00'}</td>
                                    <td className="py-1">{financialReportKind === 'z' ? '19.85' : '8.12'}</td>
                                    <td className="py-1">{financialReportKind === 'z' ? '350.75' : '136.52'}</td>
                                  </tr>
                                  <tr className="font-medium">
                                    <td className="py-1">{tr('total', 'Total')}</td>
                                    <td className="py-1">{financialReportKind === 'z' ? '333.73' : '128.40'}</td>
                                    <td className="py-1">{financialReportKind === 'z' ? '2.83' : '0.00'}</td>
                                    <td className="py-1">{financialReportKind === 'z' ? '350.75' : '136.52'}</td>
                                  </tr>
                                </tbody>
                              </table>
                              <div className="mt-4 font-medium">Betalingen</div>
                              <div>Cash — {financialReportKind === 'z' ? '174.75' : '62.00'}</div>
                              <div>Credit Card — {financialReportKind === 'z' ? '117.00' : '48.52'}</div>
                              <div>Visa — {financialReportKind === 'z' ? '59.00' : '26.00'}</div>
                              <div className="font-medium">
                                {tr('total', 'Total')} {financialReportKind === 'z' ? '350.75' : '136.52'}
                              </div>
                              <div className="mt-4 font-medium">Eat-in / Take-out</div>
                              <div>
                                {financialReportKind === 'z' ? '10 Take-Out — 350.75' : '4 Take-Out — 136.52'}
                              </div>
                              <div className="font-medium">
                                {tr('total', 'Total')} {financialReportKind === 'z' ? '350.75' : '136.52'}
                              </div>
                              <div className="mt-4 font-medium">Ticket types</div>
                              <div>
                                {financialReportKind === 'z' ? '11 Counter Sales — 350.75' : '5 Counter Sales — 136.52'}
                              </div>
                              <div className="font-medium">
                                {tr('total', 'Total')} {financialReportKind === 'z' ? '350.75' : '136.52'}
                              </div>
                              <div className="mt-4 font-medium">Issued VAT tickets:</div>
                              <div>NS: {financialReportKind === 'z' ? '10' : '4'}</div>
                              <div>NR: {financialReportKind === 'z' ? '1' : '0'}</div>
                              <div className="mt-2">Number of return tickets: {financialReportKind === 'z' ? '1' : '0'}</div>
                              <div>Drawer opened without sale: 0</div>
                              <div>Pro Forma tickets: {financialReportKind === 'z' ? '7' : '2'}</div>
                              <div>Pro Forma returns: 0</div>
                              <div>
                                Pro Forma turnover (incl. VAT): {financialReportKind === 'z' ? '126.20' : '34.50'}
                              </div>
                              <div>Gift vouchers sold: 0</div>
                              <div>Value of gift vouchers sold: 0.00</div>
                              <div>Applied discounts: 0</div>
                              <div>Total discount amount (incl. VAT): 0.00</div>
                              <div>Total cash rounding amount: 0.00</div>
                              <div>Credit top-up: 0.00</div>
                              <div>Staff consumption: 0.00</div>
                              <div>Online payment cash refunded: 0.00</div>
                              <div>Number of online orders: 0.00</div>
                              <div>Database ID: {financialReportKind === 'z' ? '2' : '4'}</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2 py-2 shrink-0">
                      <div className="flex-1" />
                      <PaginationArrows
                        canPrev={true}
                        canNext={true}
                        onPrev={() => {
                          const el = document.getElementById('financial-report-pospoint-scroll');
                          if (el) el.scrollBy({ top: -200, behavior: 'smooth' });
                        }}
                        onNext={() => {
                          const el = document.getElementById('financial-report-pospoint-scroll');
                          if (el) el.scrollBy({ top: 200, behavior: 'smooth' });
                        }}
                        className="relative py-0"
                      />
                      <div className="flex-1" />
                    </div>
                  </div>
                  <div className="flex flex-col h-full gap-3 shrink-0 justify-center items-center">
                    <div className="flex items-center gap-4 w-full justify-center">
                      <label className="text-pos-text shrink-0">{tr('control.reports.createTo', 'Create to :')}</label>
                      <Dropdown options={mapTranslatedOptions(REPORT_GENERATE_UNTIL_OPTIONS)} value={reportGenerateUntil} onChange={setReportGenerateUntil} placeholder={tr('control.reports.currentTime', 'Current time')} className="text-sm min-w-[180px] max-w-[180px]" />
                    </div>
                    <button
                      type="button"
                      className="flex mt-4 items-center gap-2 px-4 py-2 rounded-lg border border-pos-border text-black active:bg-rose-500 active:text-white justify-center w-[120px]"
                      onClick={async () => {
                        try {
                          const lines = buildFinancialReportPrintLines(financialReportKind, tr);
                          await printPeriodicReportLines(lines);
                        } catch (e) {
                          setReportPrintErrorMessage(
                            e?.message || tr('control.reports.printFailed', 'Could not print on the main printer.'),
                          );
                        }
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      {tr('control.reports.print', 'Print')}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {reportTabId === 'user' && (
              <div className="flex gap-4 flex-col min-h-0 flex-1 w-full">
                <div className="shrink-0 flex justify-around gap-2 h-[46px] w-full items-center px-2">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg text-lg font-medium min-w-[100px] transition-colors ${userReportKind === 'z'
                      ? 'bg-rose-600 text-white'
                      : 'text-pos-text active:bg-rose-500 active:text-white'
                      }`}
                    onClick={() => setUserReportKind('z')}
                  >
                    Z
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg text-lg font-medium min-w-[100px] transition-colors ${userReportKind === 'x'
                      ? 'bg-rose-600 text-white'
                      : 'text-pos-text active:bg-rose-500 active:text-white'
                      }`}
                    onClick={() => setUserReportKind('x')}
                  >
                    X
                  </button>
                </div>
                <div className="relative grid grid-cols-2 flex-1 px-4 min-h-0 gap-4">
                  <div className="flex flex-col min-h-0 gap-3">
                    <div
                      key={userReportKind}
                      id="user-report-pospoint-scroll"
                      className="flex-1 overflow-auto rounded-xl border border-pos-border bg-white text-gray-800 p-4 min-h-[400px]"
                    >
                      <div className="text-sm font-mono space-y-1 whitespace-pre-wrap text-center">
                        <div className="text-base font-medium mb-2">pospoint demo</div>
                        <div className="mb-2">BE.0.0.0</div>
                        <div className="flex justify-between border-b border-dotted border-gray-400 pb-1 mb-2 text-xs sm:text-sm">
                          <span>Date : {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</span>
                          <span>Tijd: {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
                        </div>
                        <div className="border-b border-dotted border-gray-400 pb-2 mb-4 font-semibold">
                          {userReportKind === 'z'
                            ? tr('control.reports.userZReportTitle', 'Z USER REPORT #1')
                            : tr('control.reports.userXReportTitle', 'X USER REPORT #3')}
                        </div>
                        <div className="text-left space-y-2">
                          <div className="font-medium">{tr('control.reports.userReportPerUser', 'Per user')}</div>
                          <table className="w-full border-collapse text-left text-xs sm:text-sm">
                            <thead>
                              <tr className="border-b border-gray-300">
                                <th className="py-1 pr-2">{tr('control.reports.userColumnUser', 'User')}</th>
                                <th className="py-1 pr-2">{tr('control.reports.userColumnTickets', 'Tickets')}</th>
                                <th className="py-1">{tr('control.reports.userColumnAmount', 'Amount')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userReportKind === 'z' ? (
                                <>
                                  <tr className="border-b border-gray-200"><td className="py-1">Kiosk</td><td className="py-1">124</td><td className="py-1">2840.65</td></tr>
                                  <tr className="border-b border-gray-200"><td className="py-1">Admin</td><td className="py-1">38</td><td className="py-1">912.40</td></tr>
                                  <tr className="border-b border-gray-200"><td className="py-1">Waiter 2</td><td className="py-1">22</td><td className="py-1">416.20</td></tr>
                                </>
                              ) : (
                                <>
                                  <tr className="border-b border-gray-200"><td className="py-1">Kiosk</td><td className="py-1">42</td><td className="py-1">986.30</td></tr>
                                  <tr className="border-b border-gray-200"><td className="py-1">Admin</td><td className="py-1">15</td><td className="py-1">298.10</td></tr>
                                  <tr className="border-b border-gray-200"><td className="py-1">Waiter 2</td><td className="py-1">8</td><td className="py-1">142.85</td></tr>
                                </>
                              )}
                            </tbody>
                          </table>
                          <div className="font-medium pt-2">
                            {userReportKind === 'z' ? (
                              <>
                                <div>{tr('total', 'Total')} {tr('control.reports.userColumnTickets', 'Tickets')}: 184</div>
                                <div>{tr('total', 'Total')} {tr('control.reports.userColumnAmount', 'Amount')}: 4169.25</div>
                                <div className="mt-2 text-gray-700">{tr('control.reports.userReportDiscountsZ', 'Discounts applied (Z): 12')}</div>
                                <div className="text-gray-700">{tr('control.reports.userReportVoidsZ', 'Void lines (Z): 3')}</div>
                                <div className="mt-2">Database ID: 1</div>
                              </>
                            ) : (
                              <>
                                <div>{tr('total', 'Total')} {tr('control.reports.userColumnTickets', 'Tickets')}: 65</div>
                                <div>{tr('total', 'Total')} {tr('control.reports.userColumnAmount', 'Amount')}: 1427.25</div>
                                <div className="mt-2 text-gray-700">{tr('control.reports.userReportDiscountsX', 'Discounts applied (X): 4')}</div>
                                <div className="text-gray-700">{tr('control.reports.userReportVoidsX', 'Void lines (X): 1')}</div>
                                <div className="mt-2">Database ID: 3</div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2 py-2 shrink-0">
                      <div className="flex-1" />
                      <PaginationArrows
                        canPrev={true}
                        canNext={true}
                        onPrev={() => {
                          const el = document.getElementById('user-report-pospoint-scroll');
                          if (el) el.scrollBy({ top: -200, behavior: 'smooth' });
                        }}
                        onNext={() => {
                          const el = document.getElementById('user-report-pospoint-scroll');
                          if (el) el.scrollBy({ top: 200, behavior: 'smooth' });
                        }}
                        className="relative py-0"
                      />
                      <div className="flex-1" />
                    </div>
                  </div>
                  <div className="flex flex-col h-full gap-3 shrink-0 justify-center items-center">
                    <button
                      type="button"
                      className="flex items-center h-[40px] w-[120px] gap-2 px-4 py-2 rounded-lg bg-pos-panel border border-pos-border text-pos-text active:bg-rose-500"
                      onClick={async () => {
                        try {
                          const lines = buildUserReportPrintLines(userReportKind, tr);
                          await printPeriodicReportLines(lines);
                        } catch (e) {
                          setReportPrintErrorMessage(
                            e?.message || tr('control.reports.printFailed', 'Could not print on the main printer.'),
                          );
                        }
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      {tr('control.reports.print', 'Print')}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {reportTabId === 'periodic' && (
              <div className="flex flex-col gap-4 flex-1 min-h-0">
                {/* Date and time row */}
                <div className="flex flex-wrap items-center justify-around gap-3 shrink-0">
                  <Dropdown options={PERIODIC_REPORT_TIME_OPTIONS} value={periodicReportStartTime} onChange={setPeriodicReportStartTime} placeholder="00:00" className="text-sm min-w-[80px]" />
                  <input type="text" value={periodicReportStartDate} onChange={(e) => setPeriodicReportStartDate(e.target.value)} placeholder="dd-mm-yyyy" className="w-[120px] px-3 py-2 rounded-lg bg-pos-panel border border-pos-border text-pos-text" />
                  <span className="text-pos-text">{tr('control.reports.to', 'to')}</span>
                  <Dropdown options={PERIODIC_REPORT_TIME_OPTIONS} value={periodicReportEndTime} onChange={setPeriodicReportEndTime} placeholder="24:00" className="text-sm min-w-[80px]" />
                  <input type="text" value={periodicReportEndDate} onChange={(e) => setPeriodicReportEndDate(e.target.value)} placeholder="dd-mm-yyyy" className="w-[120px] px-3 py-2 rounded-lg bg-pos-panel border border-pos-border text-pos-text" />
                  <button
                    type="button"
                    disabled={periodicReportLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-pos-border text-black active:bg-rose-500 active:text-white font-medium disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => void handleMakePeriodicReport()}
                  >
                    {periodicReportLoading
                      ? tr('control.reports.generating', 'Generating…')
                      : tr('control.reports.makeReport', 'Make report')}
                  </button>
                </div>
                {/* Report area (left) + Info panel (right) */}
                <div className="flex gap-4 flex-1 min-h-0">
                  <div className="relative flex-1 min-w-0 flex flex-col rounded-xl border border-pos-border bg-white min-h-[400px] overflow-hidden">
                    <div
                      id="periodic-report-scroll"
                      className="flex-1 overflow-auto p-5 text-gray-800 min-h-[300px] flex justify-center items-center flex-col"
                    >
                      {periodicReportLines == null ? (
                        <p className="text-gray-500 font-sans text-base">
                          {tr('control.reports.selectPeriodHint', 'Select period and click "Make report" to generate the report.')}
                        </p>
                      ) : (
                        <>
                          {periodicReportLines[0]?.trim() ? (
                            <div className="shrink-0 text-center font-sans font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight py-3 px-2">
                              {periodicReportLines[0].trim()}
                            </div>
                          ) : null}
                          <div className="mt-1 flex-1 min-h-0 flex flex-col gap-1 text-left">
                            {splitPeriodicReportBodyIntoChunks(
                              periodicReportLines.length > 1 ? periodicReportLines.slice(1).join('\n') : '',
                            ).map((chunk, i) =>
                              chunk.kind === 'title' ? (
                                <div
                                  key={`pt-${i}`}
                                  className="shrink-0 text-center font-sans font-bold text-gray-900 text-2xl sm:text-3xl leading-tight tracking-tight py-2 px-2"
                                >
                                  {chunk.text}
                                </div>
                              ) : chunk.text ? (
                                <pre
                                  key={`pm-${i}`}
                                  className="font-mono text-base sm:text-lg leading-relaxed whitespace-pre-wrap tabular-nums text-gray-900 m-0 w-full text-left"
                                >
                                  {chunk.text}
                                </pre>
                              ) : null,
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 w-[280px] rounded-xl border border-pos-border bg-white p-4 text-gray-800 leading-relaxed">
                    <p className="font-medium text-gray-900 mb-2">{tr('control.reports.periodicInfo1', 'In this new management system we work with 24:00 instead of 00:00 as the end point as in the web panel.')}</p>
                    <p className="mb-2">{tr('control.reports.periodicExample', 'Example,')}</p>
                    <p className="mb-2">{tr('control.reports.periodicExample2', 'all turnover of 27-02-2026')}</p>
                    <p className="font-medium mt-3">{tr('control.reports.periodicEarlier', 'Earlier:')}</p>
                    <p className="mb-2">{tr('control.reports.periodicEarlierExample', '00:00 27-02-2026 to 00:00 28-02-2026')}</p>
                    <p className="font-medium mt-3">{tr('control.reports.periodicNot', 'Not:')}</p>
                    <p>{tr('control.reports.periodicNotExample', '00:00 27-02-2026 to 24:00 27-02-2026')}</p>
                    <div className="flex-1 flex justify-center mt-4">
                      <button
                        type="button"
                        disabled={!periodicReportLines?.length}
                        className="flex items-center text-2xl gap-2 px-10 py-3 rounded-lg bg-rose-600 text-white font-medium active:bg-rose-500 disabled:opacity-40 disabled:pointer-events-none"
                        onClick={async () => {
                          try {
                            await printPeriodicReportLines(periodicReportLines);
                          } catch (e) {
                            setReportPrintErrorMessage(
                              e?.message || tr('control.reports.printFailed', 'Could not print on the main printer.'),
                            );
                          }
                        }}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        {tr('control.reports.print', 'Print')}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}
            {reportTabId === 'settings' && (
              <div className="rounded-xl border border-pos-border bg-pos-panel/30 p-4 pb-[60px] min-h-[650px]">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-pos-border">
                        <th className="text-pos-text font-medium py-2 pr-4"></th>
                        <th className="text-pos-text font-medium py-2 px-3 text-center w-16">Z</th>
                        <th className="text-pos-text font-medium py-2 px-3 text-center w-16">X</th>
                        <th className="text-pos-text font-medium py-2 px-3 text-center w-20">{tr('control.reports.periodic', 'Periodic')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {REPORT_SETTINGS_ROWS.map((row) => (
                        <tr key={row.id} className="border-b border-pos-border/70">
                          <td className="text-pos-text py-2 pr-4">{tr(row.labelKey, row.fallback)}</td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={reportSettings[row.id]?.z ?? false}
                              onChange={(e) => setReportSetting(row.id, 'z', e.target.checked)}
                              className="w-5 h-5 rounded border-pos-border bg-pos-bg text-green-600 focus:ring-green-500"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={reportSettings[row.id]?.x ?? false}
                              onChange={(e) => setReportSetting(row.id, 'x', e.target.checked)}
                              className="w-5 h-5 rounded border-pos-border bg-pos-bg text-green-600 focus:ring-green-500"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={reportSettings[row.id]?.periodic ?? false}
                              onChange={(e) => setReportSetting(row.id, 'periodic', e.target.checked)}
                              className="w-5 h-5 rounded border-pos-border bg-pos-bg text-green-600 focus:ring-green-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-center mt-20">
                  <button
                    type="button"
                    className="flex items-center text-xl gap-2 px-[70px] py-3 rounded-lg bg-rose-600 text-white font-medium active:bg-rose-500 disabled:opacity-50"
                    disabled={savingReportSettings}
                    onClick={handleSaveReportSettings}
                  >
                    <svg fill="currentColor" className="w-6 h-6" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                    {tr('control.save', 'Save')}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : controlSidebarId === 'users' ? (
          <div className="relative min-h-[1900px] rounded-xl border border-pos-border text-xl bg-pos-panel/30 p-4 pb-[60px]">
            <div className="flex items-center w-full justify-center mb-2">
              <button
                type="button"
                className="px-6 py-3 rounded-lg font-medium border border-pos-border text-black active:text-white active:bg-rose-500 active:border-white/30 transition-colors"
                onClick={openNewUserModal}
              >
                {tr('control.users.new', 'New user')}
              </button>
            </div>
            {users.length === 0 ? (
              <ul className="w-full flex flex-col"><li className="text-pos-muted text-xl font-medium text-center py-4">{tr('control.users.empty', 'No users yet.')}</li></ul>
            ) : (
              <>
                <div
                  ref={usersListRef}
                  className="max-h-[1750px] bg-white min-h-[1750px] text-xl overflow-y-auto rounded-lg"
                  onScroll={updateUsersScrollState}
                >
                  <ul className="w-full flex flex-col">
                    {[...users].sort((a, b) => (a.name || '').localeCompare(b.name || '')).map((u) => (
                      <li
                        key={u.id}
                        className="flex items-center w-full gap-3 px-4 py-2 bg-pos-bg text-pos-text"
                      >
                        <span className="font-medium min-w-0 max-w-[38%] truncate shrink-0">{u.name || '—'}</span>
                        <span className="flex-1 text-center text-pos-muted truncate px-1">
                          {u?.role === 'admin'
                            ? tr('control.userModal.roleAdmin', 'Admin')
                            : tr('control.userModal.roleWaiter', 'Waiter')}
                        </span>
                        <div className="flex items-center gap-2 shrink-0 ml-auto">
                          <button
                            type="button"
                            className="p-2 rounded text-black mr-5 active:text-rose-500"
                            onClick={() => openEditUserModal(u)}
                            aria-label={tr('control.edit', 'Edit')}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button
                            type="button"
                            className="p-2 rounded text-black active:text-rose-500"
                            onClick={() => setDeleteConfirmUserId(u.id)}
                            aria-label={tr('delete', 'Delete')}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <PaginationArrows
                  canPrev={canUsersScrollUp}
                  canNext={canUsersScrollDown}
                  onPrev={() => scrollUsersByPage('up')}
                  onNext={() => scrollUsersByPage('down')}
                />
              </>
            )}
          </div>
        ) : controlSidebarId === 'language' ? (
          <div className="rounded-xl border border-pos-border bg-pos-panel/30 p-8 min-h-[1900px]">
            <h2 className="text-pos-text text-4xl font-medium mb-6">{tr('control.languageTitle', 'Language')}</h2>
            <p className="text-pos-muted text-xl mb-8">{tr('control.languageDescription', 'Select the language for the application.')}</p>
            <div className="flex flex-wrap gap-4 w-full flex justify-center min-h-[200px] items-center">
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAppLanguage(opt.value)}
                  className={`px-8 py-4 rounded-xl text-2xl font-medium border-2 transition-colors ${appLanguage === opt.value
                    ? 'border-rose-500 text-rose-400'
                    : 'border-pos-border text-black active:text-white active:border-pos-muted active:bg-rose-500'
                    }`}
                >
                  {tr(`control.languageOption.${opt.value}`, opt.label)}
                </button>
              ))}
            </div>
            <div className="mt-10 flex w-full justify-center">
              <button
                type="button"
                className="flex items-center gap-4 px-[70px] py-3 rounded-lg bg-rose-600 text-white font-medium active:bg-rose-500 disabled:opacity-50 text-2xl"
                disabled={savingAppLanguage || appLanguage === lang}
                onClick={handleSaveAppLanguage}
              >
                <svg fill="currentColor" width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                {tr('control.save', 'Save')}
              </button>
            </div>
            <p className="text-pos-muted text-lg mt-8 text-center">{tr('control.currentLanguage', 'Current language')}: {tr(`control.languageOption.${appLanguage}`, LANGUAGE_OPTIONS.find((o) => o.value === appLanguage)?.label ?? 'English')}</p>
          </div>
        ) : topNavId === 'cash-register' ? (
          <div className={
            subNavId === 'Payment types'
              ? "relative min-h-[580px] rounded-xl border border-pos-border bg-pos-panel/30 p-4"
              : "relative min-h-[580px] rounded-xl p-4"
          }>

            {subNavId === 'Payment types' && (
              <div className="relative flex flex-col min-h-[610px] pb-[90px]">
                <div className="flex items-center justify-center mb-2">
                  <button
                    type="button"
                    className="px-6 py-3 rounded-lg font-medium border border-pos-border text-black active:text-white active:bg-rose-500 active:border-white/30 transition-colors disabled:opacity-50"
                    disabled={paymentTypesLoading}
                    onClick={openNewPaymentTypeModal}
                  >
                    {tr('control.paymentTypes.new', 'New Payment Method')}
                  </button>
                </div>
                {(() => {
                  if (paymentTypesLoading) {
                    return (
                      <ul className="w-full flex flex-col">
                        <li className="text-pos-muted text-xl py-4">{tr('control.paymentTypes.loading', 'Loading payment methods...')}</li>
                      </ul>
                    );
                  }
                  const sorted = [...paymentTypes].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
                  if (sorted.length === 0) {
                    return (
                      <ul className="w-full flex flex-col">
                        <li className="text-pos-muted text-xl font-medium text-center py-4">{tr('control.paymentTypes.empty', 'No payment methods yet.')}</li>
                      </ul>
                    );
                  }
                  return (
                    <>
                      <div
                        ref={paymentTypesListRef}
                        className="max-h-[1600px] min-h-[1600px] bg-white overflow-y-auto rounded-lg"
                        onScroll={updatePaymentTypesScrollState}
                      >
                        <ul className="w-full flex flex-col">
                          {sorted.map((pt) => (
                            <li
                              key={pt.id}
                              className="flex items-center w-full px-4 py-1 bg-pos-bg transition-colors"
                            >
                              <span className="flex-1 text-black text-lg font-medium">{pt.name}</span>
                              <span className="w-[160px] absolute right-1/2 left-1/2 shrink-0 text-black text-lg mr-2">
                                {tr(`control.paymentTypes.integration.${pt.integration}`, pt.integration || '—')}
                              </span>
                              <button
                                type="button"
                                className="p-2 rounded text-black active:text-rose-500 shrink-0"
                                aria-label={pt.active ? tr('control.paymentTypes.deactivate', 'Deactivate') : tr('control.paymentTypes.activate', 'Activate')}
                                onClick={() => togglePaymentTypeActive(pt.id)}
                              >
                                {pt.active ? (
                                  <span className="w-5 h-5 inline-flex justify-center items-center text-rose-500">{'\u2713'}</span>
                                ) : (
                                  <span className="w-5 h-5 inline-block rounded-full border-2 border-black" />
                                )}
                              </button>
                              <button
                                type="button"
                                className="p-2 rounded text-black active:text-rose-500 shrink-0"
                                onClick={() => openEditPaymentTypeModal(pt)}
                                aria-label={tr('control.edit', 'Edit')}
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </button>
                              <button
                                type="button"
                                className="p-2 mr-5 rounded text-black active:text-rose-500 shrink-0"
                                onClick={() => setDeleteConfirmPaymentTypeId(pt.id)}
                                aria-label={tr('delete', 'Delete')}
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
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
                  );
                })()}
              </div>
            )}
          </div>
        ) : topNavId === 'categories-products' ? (
          <ControlViewCategoriesProductsContent
            tr={tr}
            subNavId={subNavId}
            openPriceGroupModal={openPriceGroupModal}
            priceGroups={priceGroups}
            priceGroupsListRef={priceGroupsListRef}
            updatePriceGroupsScrollState={updatePriceGroupsScrollState}
            openEditPriceGroupModal={openEditPriceGroupModal}
            setDeleteConfirmId={setDeleteConfirmId}
            canPriceGroupsScrollUp={canPriceGroupsScrollUp}
            canPriceGroupsScrollDown={canPriceGroupsScrollDown}
            scrollPriceGroupsByPage={scrollPriceGroupsByPage}
            categories={categories}
            openCategoryModal={openCategoryModal}
            categoriesListRef={categoriesListRef}
            updateCategoriesScrollState={updateCategoriesScrollState}
            handleMoveCategory={handleMoveCategory}
            openEditCategoryModal={openEditCategoryModal}
            setDeleteConfirmCategoryId={setDeleteConfirmCategoryId}
            canCategoriesScrollUp={canCategoriesScrollUp}
            canCategoriesScrollDown={canCategoriesScrollDown}
            scrollCategoriesByPage={scrollCategoriesByPage}
            selectedCategoryId={selectedCategoryId}
            openProductModal={openProductModal}
            productSearch={productSearch}
            setProductSearch={setProductSearch}
            setShowProductSearchKeyboard={setShowProductSearchKeyboard}
            setSelectedCategoryId={setSelectedCategoryId}
            setSelectedProductId={setSelectedProductId}
            selectedProductId={selectedProductId}
            productsCategoryTabsRef={productsCategoryTabsRef}
            productsListRef={productsListRef}
            updateProductsScrollState={updateProductsScrollState}
            filteredProducts={filteredProducts}
            productHasSubproductsById={productHasSubproductsById}
            openProductSubproductsModal={openProductSubproductsModal}
            openEditProductModal={openEditProductModal}
            openProductKioskConfiguration={openProductKioskConfiguration}
            setDeleteConfirmProductId={setDeleteConfirmProductId}
            canProductsScrollUp={canProductsScrollUp}
            canProductsScrollDown={canProductsScrollDown}
            scrollProductsByPage={scrollProductsByPage}
            openSubproductModal={openSubproductModal}
            setShowManageGroupsModal={setShowManageGroupsModal}
            subproductGroups={subproductGroups}
            selectedSubproductGroupId={selectedSubproductGroupId}
            setSelectedSubproductGroupId={setSelectedSubproductGroupId}
            setSelectedSubproductId={setSelectedSubproductId}
            subproductsGroupTabsRef={subproductsGroupTabsRef}
            subproductsListRef={subproductsListRef}
            updateSubproductsScrollState={updateSubproductsScrollState}
            subproducts={subproducts}
            selectedSubproductId={selectedSubproductId}
            openEditSubproductModal={openEditSubproductModal}
            setDeleteConfirmSubproductId={setDeleteConfirmSubproductId}
            canSubproductsScrollUp={canSubproductsScrollUp}
            canSubproductsScrollDown={canSubproductsScrollDown}
            scrollSubproductsByPage={scrollSubproductsByPage}
            openNewKitchenModal={openNewKitchenModal}
            kitchens={kitchens}
            kitchenListRef={kitchenListRef}
            updateKitchenScrollState={updateKitchenScrollState}
            openKitchenProductsModal={openKitchenProductsModal}
            openEditKitchenModal={openEditKitchenModal}
            setDeleteConfirmKitchenId={setDeleteConfirmKitchenId}
            canKitchenScrollUp={canKitchenScrollUp}
            canKitchenScrollDown={canKitchenScrollDown}
            scrollKitchenByPage={scrollKitchenByPage}
            openNewDiscountModal={openNewDiscountModal}
            discounts={discounts}
            discountsListRef={discountsListRef}
            updateDiscountsScrollState={updateDiscountsScrollState}
            openEditDiscountModal={openEditDiscountModal}
            setDeleteConfirmDiscountId={setDeleteConfirmDiscountId}
            canDiscountsScrollUp={canDiscountsScrollUp}
            canDiscountsScrollDown={canDiscountsScrollDown}
            scrollDiscountsByPage={scrollDiscountsByPage}
          />
        ) : topNavId === 'external-devices' ? (
          <div className="relative min-h-[1770px] rounded-xl justify-center border border-pos-border bg-pos-panel/30 p-4">
            {subNavId === 'Printer' && (
              <ControlViewExternalPrinter
                tr={tr}
                PRINTER_TAB_DEFS={PRINTER_TAB_DEFS}
                printerTab={printerTab}
                setPrinterTab={setPrinterTab}
                openNewPrinterModal={openNewPrinterModal}
                printers={printers}
                PRINTERS_PAGE_SIZE={PRINTERS_PAGE_SIZE}
                printersPage={printersPage}
                setDefaultPrinter={setDefaultPrinter}
                openEditPrinterModal={openEditPrinterModal}
                setDeleteConfirmPrinterId={setDeleteConfirmPrinterId}
                setPrintersPage={setPrintersPage}
                finalTicketsCompanyData1={finalTicketsCompanyData1}
                setFinalTicketsCompanyData1={setFinalTicketsCompanyData1}
                finalTicketsCompanyData2={finalTicketsCompanyData2}
                setFinalTicketsCompanyData2={setFinalTicketsCompanyData2}
                finalTicketsCompanyData3={finalTicketsCompanyData3}
                setFinalTicketsCompanyData3={setFinalTicketsCompanyData3}
                finalTicketsCompanyData4={finalTicketsCompanyData4}
                setFinalTicketsCompanyData4={setFinalTicketsCompanyData4}
                finalTicketsCompanyData5={finalTicketsCompanyData5}
                setFinalTicketsCompanyData5={setFinalTicketsCompanyData5}
                setFinalTicketsActiveField={setFinalTicketsActiveField}
                finalTicketsThankText={finalTicketsThankText}
                setFinalTicketsThankText={setFinalTicketsThankText}
                finalTicketsProforma={finalTicketsProforma}
                setFinalTicketsProforma={setFinalTicketsProforma}
                finalTicketsPrintPaymentType={finalTicketsPrintPaymentType}
                setFinalTicketsPrintPaymentType={setFinalTicketsPrintPaymentType}
                finalTicketsTicketTearable={finalTicketsTicketTearable}
                setFinalTicketsTicketTearable={setFinalTicketsTicketTearable}
                finalTicketsPrintLogo={finalTicketsPrintLogo}
                setFinalTicketsPrintLogo={setFinalTicketsPrintLogo}
                mapTranslatedOptions={mapTranslatedOptions}
                PRINTING_ORDER_OPTIONS={PRINTING_ORDER_OPTIONS}
                finalTicketsPrintingOrder={finalTicketsPrintingOrder}
                setFinalTicketsPrintingOrder={setFinalTicketsPrintingOrder}
                savingFinalTickets={savingFinalTickets}
                handleSaveFinalTickets={handleSaveFinalTickets}
                finalTicketsKeyboardValue={finalTicketsKeyboardValue}
                finalTicketsKeyboardOnChange={finalTicketsKeyboardOnChange}
                prodTicketsDisplayCategories={prodTicketsDisplayCategories}
                setProdTicketsDisplayCategories={setProdTicketsDisplayCategories}
                prodTicketsSpaceAbove={prodTicketsSpaceAbove}
                setProdTicketsSpaceAbove={setProdTicketsSpaceAbove}
                prodTicketsTicketTearable={prodTicketsTicketTearable}
                setProdTicketsTicketTearable={setProdTicketsTicketTearable}
                prodTicketsKeukenprinterBuzzer={prodTicketsKeukenprinterBuzzer}
                setProdTicketsKeukenprinterBuzzer={setProdTicketsKeukenprinterBuzzer}
                prodTicketsProductenIndividueel={prodTicketsProductenIndividueel}
                setProdTicketsProductenIndividueel={setProdTicketsProductenIndividueel}
                prodTicketsEatInTakeOutOnderaan={prodTicketsEatInTakeOutOnderaan}
                setProdTicketsEatInTakeOutOnderaan={setProdTicketsEatInTakeOutOnderaan}
                productionTicketsPrinterOptions={productionTicketsPrinterOptions}
                prodTicketsNextCoursePrinter1={prodTicketsNextCoursePrinter1}
                setProdTicketsNextCoursePrinter1={setProdTicketsNextCoursePrinter1}
                prodTicketsNextCoursePrinter2={prodTicketsNextCoursePrinter2}
                setProdTicketsNextCoursePrinter2={setProdTicketsNextCoursePrinter2}
                prodTicketsNextCoursePrinter3={prodTicketsNextCoursePrinter3}
                setProdTicketsNextCoursePrinter3={setProdTicketsNextCoursePrinter3}
                prodTicketsNextCoursePrinter4={prodTicketsNextCoursePrinter4}
                setProdTicketsNextCoursePrinter4={setProdTicketsNextCoursePrinter4}
                prodTicketsPrintingOrder={prodTicketsPrintingOrder}
                setProdTicketsPrintingOrder={setProdTicketsPrintingOrder}
                GROUPING_RECEIPT_OPTIONS={GROUPING_RECEIPT_OPTIONS}
                prodTicketsGroupingReceipt={prodTicketsGroupingReceipt}
                setProdTicketsGroupingReceipt={setProdTicketsGroupingReceipt}
                prodTicketsPrinterOverboeken={prodTicketsPrinterOverboeken}
                setProdTicketsPrinterOverboeken={setProdTicketsPrinterOverboeken}
                savingProdTickets={savingProdTickets}
                handleSaveProductionTickets={handleSaveProductionTickets}
                labelsList={labelsList}
                labelsTypeOptions={labelsTypeOptions}
                labelsType={labelsType}
                saveLabelsSettings={saveLabelsSettings}
                labelsPrinterOptions={labelsPrinterOptions}
                labelsPrinter={labelsPrinter}
                openNewLabelModal={openNewLabelModal}
                labelsListRef={labelsListRef}
                updateLabelsScrollState={updateLabelsScrollState}
                openEditLabelModal={openEditLabelModal}
                setDeleteConfirmLabelId={setDeleteConfirmLabelId}
                canLabelsScrollUp={canLabelsScrollUp}
                canLabelsScrollDown={canLabelsScrollDown}
                scrollLabelsByPage={scrollLabelsByPage}
              />
            )}
            {(subNavId === 'Price Display' || subNavId === 'RFID Reader' || subNavId === 'Barcode Scanner' || subNavId === 'Credit Card' || subNavId === 'Libra') && (
              <ControlViewExternalSimpleDevices
                subNavId={subNavId}
                tr={tr}
                mapTranslatedOptions={mapTranslatedOptions}
                PRICE_DISPLAY_TYPE_OPTIONS={PRICE_DISPLAY_TYPE_OPTIONS}
                RFID_READER_TYPE_OPTIONS={RFID_READER_TYPE_OPTIONS}
                BARCODE_SCANNER_TYPE_OPTIONS={BARCODE_SCANNER_TYPE_OPTIONS}
                CREDIT_CARD_TYPE_OPTIONS={CREDIT_CARD_TYPE_OPTIONS}
                SCALE_TYPE_OPTIONS={SCALE_TYPE_OPTIONS}
                SCALE_PORT_OPTIONS={SCALE_PORT_OPTIONS}
                priceDisplayType={priceDisplayType}
                setPriceDisplayType={setPriceDisplayType}
                savingPriceDisplay={savingPriceDisplay}
                handleSavePriceDisplay={handleSavePriceDisplay}
                rfidReaderType={rfidReaderType}
                setRfidReaderType={setRfidReaderType}
                savingRfidReader={savingRfidReader}
                handleSaveRfidReader={handleSaveRfidReader}
                barcodeScannerType={barcodeScannerType}
                setBarcodeScannerType={setBarcodeScannerType}
                savingBarcodeScanner={savingBarcodeScanner}
                handleSaveBarcodeScanner={handleSaveBarcodeScanner}
                creditCardType={creditCardType}
                setCreditCardType={setCreditCardType}
                savingCreditCard={savingCreditCard}
                handleSaveCreditCard={handleSaveCreditCard}
                scaleType={scaleType}
                setScaleType={setScaleType}
                scalePort={scalePort}
                setScalePort={setScalePort}
                savingScale={savingScale}
                handleSaveScale={handleSaveScale}
              />
            )}
            {subNavId === 'Cashmatic' && (
              <ControlViewCashmatic
                tr={tr}
                cashmaticName={cashmaticName}
                setCashmaticName={setCashmaticName}
                setCashmaticActiveField={setCashmaticActiveField}
                cashmaticConnectionType={cashmaticConnectionType}
                setCashmaticConnectionType={setCashmaticConnectionType}
                cashmaticIpAddress={cashmaticIpAddress}
                setCashmaticIpAddress={setCashmaticIpAddress}
                cashmaticPort={cashmaticPort}
                setCashmaticPort={setCashmaticPort}
                cashmaticUsername={cashmaticUsername}
                setCashmaticUsername={setCashmaticUsername}
                cashmaticPassword={cashmaticPassword}
                setCashmaticPassword={setCashmaticPassword}
                cashmaticUrl={cashmaticUrl}
                setCashmaticUrl={setCashmaticUrl}
                savingCashmatic={savingCashmatic}
                handleSaveCashmatic={handleSaveCashmatic}
                cashmaticKeyboardValue={cashmaticKeyboardValue}
                cashmaticKeyboardOnChange={cashmaticKeyboardOnChange}
              />
            )}
            {subNavId === 'Payworld' && (
              <ControlViewPayworld
                tr={tr}
                payworldName={payworldName}
                setPayworldName={setPayworldName}
                setPayworldActiveField={setPayworldActiveField}
                payworldIpAddress={payworldIpAddress}
                setPayworldIpAddress={setPayworldIpAddress}
                payworldPort={payworldPort}
                setPayworldPort={setPayworldPort}
                savingPayworld={savingPayworld}
                handleSavePayworld={handleSavePayworld}
                payworldKeyboardValue={payworldKeyboardValue}
                payworldKeyboardOnChange={payworldKeyboardOnChange}
              />
            )}
          </div>
        ) : topNavId === 'tables' ? (() => {
          return (
            <div className="relative rounded-xl border border-pos-border bg-pos-panel/30 p-4 min-h-[690px] pb-16">
              <div className="flex items-center w-full justify-center mb-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg font-medium bg-pos-panel border border-pos-border text-pos-text active:bg-rose-500 active:border-white/30 transition-colors disabled:opacity-50"
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
                  {tableLocationsLoading ? (
                    <li className="text-pos-muted py-4 text-center">{tr('control.tables.loading', 'Loading table locations...')}</li>
                  ) : tableLocations.length === 0 ? (
                    <li className="text-pos-muted py-6 text-center">{tr('control.tables.empty', 'No table locations yet.')}</li>
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
                          className="flex justify-between relative items-center w-full px-4 py-2 bg-pos-bg border-y border-pos-panel text-pos-text"
                        >
                          <span className="font-medium">{loc.name}</span>
                          <div className="flex absolute right-1/2 items-center justify-center">
                            <button
                              type="button"
                              className={`w-full text-center px-3 py-1 rounded-lg active:bg-rose-500 ${hasSavedLayout ? 'text-white' : 'text-pos-muted active:text-pos-text'
                                }`}
                              onClick={() => openSetTablesModal(loc)}
                            >
                              {tr('control.tables.setTables', 'Set tables')}
                            </button>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              className="p-1 rounded text-pos-text active:bg-rose-500"
                              onClick={() => openEditTableLocationModal(loc)}
                              aria-label="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button
                              type="button"
                              className="p-1 rounded text-pos-text active:bg-rose-500"
                              onClick={() => setDeleteConfirmTableLocationId(loc.id)}
                              aria-label="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
        })() : null}
      </main>
      <ReportPrintErrorModal
        open={!!reportPrintErrorMessage}
        message={reportPrintErrorMessage || ''}
        onClose={() => setReportPrintErrorMessage(null)}
      />
    </div>

  );
}
