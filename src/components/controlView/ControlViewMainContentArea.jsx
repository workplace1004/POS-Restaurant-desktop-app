import React from 'react';
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

export function ControlViewMainContentArea({ ctx }) {
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
    categoriesLoading,
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
    openProductPositioningModal,
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
    periodicReportStartDate,
    periodicReportStartTime,
    priceDisplayType,
    priceGroups,
    priceGroupsListRef,
    priceGroupsLoading,
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
    productsLoading,
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
    savingTemplateSettings,
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
    setReportGenerateUntil,
    setReportTabId,
    setRfidReaderType,
    setSavingTemplateSettings,
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
    setTemplateTheme,
    setTopNavId,
    subNavId,
    subproductGroups,
    subproductGroupsLoading,
    subproducts,
    subproductsGroupTabsRef,
    subproductsListRef,
    subproductsLoading,
    tableLocations,
    tableLocationsListRef,
    tableLocationsLoading,
    templateTheme,
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
    usersListRef,
    usersLoading
  } = ctx;

  return (
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top navigation - Personalize only */}
        {controlSidebarId === 'personalize' && (
          <div className="flex items-center gap-1 py-2 px-4 justify-between w-full bg-pos-bg/50">
            {TOP_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`flex items-center gap-2 px-2 py-3 rounded-lg text-lg transition-colors ${topNavId === item.id
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

        {/* Reports tabs - when Reports sidebar selected */}
        {controlSidebarId === 'reports' && (
          <div className="flex items-center gap-1 px-4 py-2 justify-around w-full bg-pos-bg/50">
            {REPORT_TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${reportTabId === item.id
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

        {/* Sub-navigation - Categories and products */}
        {controlSidebarId === 'personalize' && topNavId === 'categories-products' && (
          <div className="flex items-center w-full justify-between gap-1 px-4 bg-pos-bg">
            {SUB_NAV_ITEMS.map((label) => (
              <button
                key={label}
                type="button"
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${subNavId === label
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

        {/* Sub-navigation - Cash Register Settings */}
        {controlSidebarId === 'personalize' && topNavId === 'cash-register' && (
          <div className="flex items-center w-full justify-around gap-1 px-4 py-3 bg-pos-bg">
            {CASH_REGISTER_SUB_NAV_ITEMS.map((label) => (
              <button
                key={label}
                type="button"
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${subNavId === label
                  ? 'bg-pos-panel text-pos-text font-medium'
                  : 'text-pos-muted active:text-pos-text active:bg-green-500'
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

        {/* Sub-navigation - External Devices */}
        {controlSidebarId === 'personalize' && topNavId === 'external-devices' && (
          <div className="flex items-center w-full justify-between gap-1 px-4 bg-pos-bg">
            {EXTERNAL_DEVICES_SUB_NAV_ITEMS.map((label) => (
              <button
                key={label}
                type="button"
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${subNavId === label
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

        {/* Content area */}
        <main className="flex-1 overflow-hidden px-4 pt-2">
          {controlSidebarId === 'reports' ? (
            <div className="flex flex-col h-full gap-4">
              {reportTabId === 'financial' && (
                <div className="flex gap-4 flex-col min-h-0 flex-1 w-full">
                  <div className="shrink-0 flex justify-around gap-2 h-[46px] w-full items-center">
                    <span className="text-pos-text text-sm font-medium">Z</span>
                    <span className="text-pos-text text-sm font-medium">X</span>
                    <button type="button" className="text-pos-text active:underline text-sm active:bg-green-500">{tr('control.reports.history', 'History')}</button>
                  </div>
                  <div className="relative grid grid-cols-2 flex-1 px-4 min-h-0 gap-4">
                    <div className="flex flex-col min-h-0 gap-3">
                      <div id="financial-report-pospoint-scroll" className="flex-1 overflow-auto rounded-xl border border-pos-border bg-white text-gray-800 p-4 min-h-[400px]">
                        <div className="text-sm font-mono space-y-1 whitespace-pre-wrap text-center">
                          <div className="text-base font-medium mb-2">pospoint demo</div>
                          <div className="mb-2">BE.0.0.0</div>
                          <div className="flex justify-between border-b border-dotted border-gray-400 pb-1 mb-2">
                            <span>Date : {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</span>
                            <span>Tijd: {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
                          </div>
                          <div className="border-b border-dotted border-gray-400 pb-2 mb-4 font-semibold text-sm">Z FINANCIEEL #2</div>
                          <div className="text-left space-y-1">
                            <div className="font-medium">Terminals:</div>
                            <div>Kassa 2 — 16/01-08:26 =&gt; 25/01-11:04</div>
                            <div>Kassa 4 — 13/01-19:07 =&gt; 25/02-14:27</div>
                            <div className="mt-4 font-medium">BTW per tarief</div>
                            <table className="w-full border-collapse text-sm mt-1 text-left">
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
                                  <td className="py-1">333.73</td>
                                  <td className="py-1">2.83</td>
                                  <td className="py-1">19.85</td>
                                  <td className="py-1">350.75</td>
                                </tr>
                                <tr className="font-medium">
                                  <td className="py-1">{tr('total', 'Total')}</td>
                                  <td className="py-1">333.73</td>
                                  <td className="py-1">2.83</td>
                                  <td className="py-1">350.75</td>
                                </tr>
                              </tbody>
                            </table>
                            <div className="mt-4 font-medium">Betalingen</div>
                            <div>Cash — 174.75</div>
                            <div>Credit Card — 117.00</div>
                            <div>Visa — 59.00</div>
                            <div className="font-medium">{tr('total', 'Total')} 350.75</div>
                            <div className="mt-4 font-medium">Eat-in / Take-out</div>
                            <div>10 Take-Out — 350.75</div>
                            <div className="font-medium">{tr('total', 'Total')} 350.75</div>
                            <div className="mt-4 font-medium">Ticket types</div>
                            <div>11 Counter Sales — 350.75</div>
                            <div className="font-medium">{tr('total', 'Total')} 350.75</div>
                            <div className="mt-4 font-medium">Issued VAT tickets:</div>
                            <div>NS: 10</div>
                            <div>NR: 1</div>
                            <div className="mt-2">Number of return tickets: 1</div>
                            <div>Drawer opened without sale: 0</div>
                            <div>Pro Forma tickets: 7</div>
                            <div>Pro Forma returns: 0</div>
                            <div>Pro Forma turnover (incl. VAT): 126.20</div>
                            <div>Gift vouchers sold: 0</div>
                            <div>Value of gift vouchers sold: 0.00</div>
                            <div>Applied discounts: 0</div>
                            <div>Total discount amount (incl. VAT): 0.00</div>
                            <div>Total cash rounding amount: 0.00</div>
                            <div>Credit top-up: 0.00</div>
                            <div>Staff consumption: 0.00</div>
                            <div>Online payment cash refunded: 0.00</div>
                            <div>Number of online orders: 0.00</div>
                            <div>Database ID: 2</div>
                          </div>
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
                        <label className="text-pos-text text-sm shrink-0">{tr('control.reports.createTo', 'Create to :')}</label>
                        <Dropdown options={mapTranslatedOptions(REPORT_GENERATE_UNTIL_OPTIONS)} value={reportGenerateUntil} onChange={setReportGenerateUntil} placeholder={tr('control.reports.currentTime', 'Current time')} className="text-sm min-w-[180px] max-w-[180px]" />
                      </div>
                      <button type="button" className="flex mt-4 items-center gap-2 px-4 py-2 rounded-lg bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 text-sm justify-center w-[120px]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        {tr('control.reports.print', 'Print')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {reportTabId === 'user' && (
                <div className="flex gap-4 flex-col min-h-[650px] max-h-[650px] w-full">
                  <div className="shrink-0 flex justify-around gap-2 h-[46px] w-full items-center">
                    <span className="text-pos-text text-sm font-medium">Z</span>
                    <span className="text-pos-text text-sm font-medium">X</span>
                  </div>
                  <div className="relative grid grid-cols-2 h-full gap-4">
                    <div className='flex flex-col h-full gap-3'>
                      <div className="flex-1 overflow-auto rounded-xl border border-pos-border bg-white text-gray-800 p-4 min-h-[400px]">
                        <div className="">

                        </div>

                      </div>
                      <div className="flex items-center justify-between px-2 py-2">
                        <div className="flex-1" />
                        <PaginationArrows canPrev={true} canNext={true} onPrev={() => { }} onNext={() => { }} className="relative py-0" />
                        <div className="flex-1" />
                      </div>
                    </div>
                    <div className='flex justify-center items-center'>
                      <button type="button" className="flex items-center h-[40px] w-[120px] gap-2 px-4 py-2 rounded-lg bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 text-sm">
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
                    <input type="text" value={periodicReportStartDate} onChange={(e) => setPeriodicReportStartDate(e.target.value)} placeholder="dd-mm-yyyy" className="w-[120px] px-3 py-2 rounded-lg bg-pos-panel border border-pos-border text-pos-text text-sm" />
                    <span className="text-pos-text text-sm">{tr('control.reports.to', 'to')}</span>
                    <Dropdown options={PERIODIC_REPORT_TIME_OPTIONS} value={periodicReportEndTime} onChange={setPeriodicReportEndTime} placeholder="24:00" className="text-sm min-w-[80px]" />
                    <input type="text" value={periodicReportEndDate} onChange={(e) => setPeriodicReportEndDate(e.target.value)} placeholder="dd-mm-yyyy" className="w-[120px] px-3 py-2 rounded-lg bg-pos-panel border border-pos-border text-pos-text text-sm" />
                    <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 text-sm font-medium">
                      {tr('control.reports.makeReport', 'Make report')}
                    </button>
                  </div>
                  {/* Report area (left) + Info panel (right) */}
                  <div className="flex gap-4 flex-1 min-h-0">
                    <div className="relative flex-1 min-w-0 flex flex-col rounded-xl border border-pos-border bg-white min-h-[400px] overflow-hidden">
                      <div className="flex-1 overflow-auto p-4 text-gray-800 min-h-[300px]">
                        <p className="text-gray-500 text-sm">{tr('control.reports.selectPeriodHint', 'Select period and click "Make report" to generate the report.')}</p>
                      </div>
                      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 shrink-0">
                        <div className="flex-1" />
                        <PaginationArrows canPrev={true} canNext={true} onPrev={() => { }} onNext={() => { }} className="relative py-0" />
                        <div className="flex-1 flex justify-end">
                          <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 text-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            {tr('control.reports.print', 'Print')}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 w-[280px] rounded-xl border border-pos-border bg-white p-4 text-gray-800 text-sm leading-relaxed">
                      <p className="font-medium text-gray-900 mb-2 text-sm">{tr('control.reports.periodicInfo1', 'In this new management system we work with 24:00 instead of 00:00 as the end point as in the web panel.')}</p>
                      <p className="mb-2">{tr('control.reports.periodicExample', 'Example,')}</p>
                      <p className="mb-2">{tr('control.reports.periodicExample2', 'all turnover of 27-02-2026')}</p>
                      <p className="font-medium mt-3">{tr('control.reports.periodicEarlier', 'Earlier:')}</p>
                      <p className="mb-2">{tr('control.reports.periodicEarlierExample', '00:00 27-02-2026 to 00:00 28-02-2026')}</p>
                      <p className="font-medium mt-3">{tr('control.reports.periodicNot', 'Not:')}</p>
                      <p>{tr('control.reports.periodicNotExample', '00:00 27-02-2026 to 24:00 27-02-2026')}</p>
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
                          <th className="text-pos-text text-sm font-medium py-2 pr-4"></th>
                          <th className="text-pos-text text-sm font-medium py-2 px-3 text-center w-16">Z</th>
                          <th className="text-pos-text text-sm font-medium py-2 px-3 text-center w-16">X</th>
                          <th className="text-pos-text text-sm font-medium py-2 px-3 text-center w-20">{tr('control.reports.periodic', 'Periodic')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {REPORT_SETTINGS_ROWS.map((row) => (
                          <tr key={row.id} className="border-b border-pos-border/70">
                            <td className="text-pos-text text-sm py-2 pr-4">{tr(row.labelKey, row.fallback)}</td>
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
                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50 text-sm"
                      disabled={savingReportSettings}
                      onClick={handleSaveReportSettings}
                    >
                      <svg fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                      {tr('control.save', 'Save')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : controlSidebarId === 'users' ? (
            <div className="relative min-h-[750px] rounded-xl border border-pos-border bg-pos-panel/30 p-4 pb-[60px]">
              <div className="flex items-center w-full justify-center mb-2">
                <button
                  type="button"
                  className="px-6 py-3 rounded-lg text-sm font-medium bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 active:border-white/30 transition-colors disabled:opacity-50"
                  disabled={usersLoading}
                  onClick={openNewUserModal}
                >
                  {tr('control.users.new', 'New user')}
                </button>
              </div>
              {usersLoading ? (
                <ul className="w-full flex flex-col"><li className="text-pos-muted text-xl py-4">{tr('loginLoadingUsers', 'Loading users...')}</li></ul>
              ) : users.length === 0 ? (
                <ul className="w-full flex flex-col"><li className="text-pos-muted text-xl font-medium text-center py-4">{tr('control.users.empty', 'No users yet.')}</li></ul>
              ) : (
                <>
                  <div
                    ref={usersListRef}
                    className="max-h-[610px] overflow-y-auto rounded-lg [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    onScroll={updateUsersScrollState}
                  >
                    <ul className="w-full flex flex-col">
                      {[...users].sort((a, b) => (a.name || '').localeCompare(b.name || '')).map((u) => (
                        <li
                          key={u.id}
                          className="flex items-center w-full gap-3 px-4 py-2 bg-pos-bg border-y border-pos-panel text-pos-text text-sm"
                        >
                          <span className="font-medium min-w-0 max-w-[38%] truncate shrink-0">{u.name || '—'}</span>
                          <span className="flex-1 text-center text-pos-muted text-sm truncate px-1">
                            {u?.role === 'admin'
                              ? tr('control.userModal.roleAdmin', 'Admin')
                              : tr('control.userModal.roleWaiter', 'Waiter')}
                          </span>
                          <div className="flex items-center gap-2 shrink-0 ml-auto">
                            <button
                              type="button"
                              className="p-2 rounded text-pos-text mr-5 active:text-green-500"
                              onClick={() => openEditUserModal(u)}
                              aria-label={tr('control.edit', 'Edit')}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button
                              type="button"
                              className="p-2 rounded text-pos-text active:text-rose-500"
                              onClick={() => setDeleteConfirmUserId(u.id)}
                              aria-label={tr('delete', 'Delete')}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
            <div className="rounded-xl border border-pos-border bg-pos-panel/30 p-8 min-h-[750px]">
              <h2 className="text-pos-text text-2xl font-medium mb-6">{tr('control.languageTitle', 'Language')}</h2>
              <p className="text-pos-muted text-xl mb-8">{tr('control.languageDescription', 'Select the language for the application.')}</p>
              <div className="flex flex-wrap gap-4 w-full flex justify-center min-h-[200px] items-center">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAppLanguage(opt.value)}
                    className={`px-8 py-4 rounded-xl text-xl font-medium border-2 transition-colors ${appLanguage === opt.value
                      ? 'bg-pos-panel border-green-500 text-green-400'
                      : 'bg-pos-bg border-pos-border text-pos-text active:border-pos-muted active:bg-green-500'
                      }`}
                  >
                    {tr(`control.languageOption.${opt.value}`, opt.label)}
                  </button>
                ))}
              </div>
              <div className="mt-10 flex w-full justify-center">
                <button
                  type="button"
                  className="flex items-center gap-4 px-6 py-3 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50 text-2xl"
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
            <div className="relative min-h-[580px] rounded-xl border border-pos-border bg-pos-panel/30 p-4 pb-[60px]">
              {subNavId === 'Template Settings' && (
                <div className="flex flex-col items-center justify-center min-h-[580px] gap-4">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setTemplateTheme('light')}
                      className={`px-6 py-3 rounded-xl text-sm font-medium transition-colors min-w-[150px] ${templateTheme === 'light'
                        ? 'bg-pos-panel border-2 border-green-500 text-green-400'
                        : 'bg-pos-bg border border-pos-border text-pos-muted active:text-pos-text active:border-pos-border'
                        }`}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateTheme('dark')}
                      className={`px-6 py-3 rounded-xl text-sm font-medium transition-colors min-w-[150px] ${templateTheme === 'dark'
                        ? 'bg-gray-900 border-2 border-green-500 text-green-400'
                        : 'bg-[#1a1a1a] border border-pos-border text-pos-muted active:text-pos-text'
                        }`}
                    >
                      Dark
                    </button>
                  </div>
                  <div className="flex justify-center pt-5 pb-5">
                    <button
                      type="button"
                      disabled={savingTemplateSettings}
                      onClick={() => {
                        setSavingTemplateSettings(true);
                        try {
                          if (typeof localStorage !== 'undefined') localStorage.setItem('pos-template-theme', templateTheme);
                        } finally {
                          setSavingTemplateSettings(false);
                        }
                      }}
                      className="flex items-center text-lg gap-4 px-6 py-3 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50"
                    >
                      <svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" />
                      </svg>
                      {tr('control.save', 'Save')}
                    </button>
                  </div>
                </div>
              )}
              {subNavId === 'Payment types' && (
                <div className="relative flex flex-col min-h-[610px] pb-[60px]">
                  <div className="flex items-center justify-center mb-2">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg text-sm font-medium bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 active:border-white/30 transition-colors disabled:opacity-50"
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
                          className="max-h-[510px] overflow-y-auto rounded-lg border border-pos-border [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                          onScroll={updatePaymentTypesScrollState}
                        >
                          <ul className="w-full flex flex-col">
                            {sorted.map((pt) => (
                              <li
                                key={pt.id}
                                className="flex items-center w-full px-4 py-1 border-b border-pos-border last:border-b-0 bg-pos-bg transition-colors"
                              >
                                <span className="flex-1 text-pos-text text-sm font-medium">{pt.name}</span>
                                <span className="w-[160px] shrink-0 text-pos-muted text-xs mr-2">
                                  {tr(`control.paymentTypes.integration.${pt.integration}`, pt.integration || '—')}
                                </span>
                                <button
                                  type="button"
                                  className="p-2 rounded text-pos-text active:bg-green-500 shrink-0"
                                  aria-label={pt.active ? tr('control.paymentTypes.deactivate', 'Deactivate') : tr('control.paymentTypes.activate', 'Activate')}
                                  onClick={() => togglePaymentTypeActive(pt.id)}
                                >
                                  {pt.active ? (
                                    <span className="w-4 h-4 inline-flex justify-center items-center text-green-500 text-sm">{'\u2713'}</span>
                                  ) : (
                                    <span className="w-4 h-4 inline-block rounded-full border-2 border-pos-muted" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  className="p-2 rounded text-pos-text active:bg-green-500 shrink-0"
                                  onClick={() => openEditPaymentTypeModal(pt)}
                                  aria-label={tr('control.edit', 'Edit')}
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button
                                  type="button"
                                  className="p-2 mr-5 rounded text-pos-text active:bg-green-500 shrink-0"
                                  onClick={() => setDeleteConfirmPaymentTypeId(pt.id)}
                                  aria-label={tr('delete', 'Delete')}
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
              priceGroupsLoading={priceGroupsLoading}
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
              categoriesLoading={categoriesLoading}
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
              productsLoading={productsLoading}
              openProductModal={openProductModal}
              openProductPositioningModal={openProductPositioningModal}
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
              setDeleteConfirmProductId={setDeleteConfirmProductId}
              canProductsScrollUp={canProductsScrollUp}
              canProductsScrollDown={canProductsScrollDown}
              scrollProductsByPage={scrollProductsByPage}
              subproductsLoading={subproductsLoading}
              openSubproductModal={openSubproductModal}
              setShowManageGroupsModal={setShowManageGroupsModal}
              subproductGroups={subproductGroups}
              selectedSubproductGroupId={selectedSubproductGroupId}
              setSelectedSubproductGroupId={setSelectedSubproductGroupId}
              setSelectedSubproductId={setSelectedSubproductId}
              subproductsGroupTabsRef={subproductsGroupTabsRef}
              subproductsListRef={subproductsListRef}
              updateSubproductsScrollState={updateSubproductsScrollState}
              subproductGroupsLoading={subproductGroupsLoading}
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
            <div className="rounded-xl border border-pos-border bg-pos-panel/30 p-8 py-2 min-h-[650px] max-h-[550px]">
              {false && subNavId === 'Printer' && (
                <div className="flex flex-col">
                  <div className="flex justify-around mb-6 shrink-0">
                    {PRINTER_TAB_DEFS.map(({ id, labelKey, fallback }) => (
                      <button
                        key={id}
                        type="button"
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${printerTab === id ? 'border-blue-500 text-pos-text' : 'border-transparent text-pos-muted active:text-pos-text'} active:bg-green-500`}
                        onClick={() => setPrinterTab(id)}
                      >
                        {tr(labelKey, fallback)}
                      </button>
                    ))}
                  </div>
                  {printerTab === 'General' && (
                    <div className="relative min-h-[580px] rounded-xl border border-pos-border bg-pos-panel/30 p-4 pb-[60px]">
                      <div className="flex items-center w-full justify-center mb-2">
                        <button
                          type="button"
                          className="px-6 py-3 rounded-lg text-sm font-medium bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 active:border-white/30 transition-colors disabled:opacity-50"
                          onClick={openNewPrinterModal}
                        >
                          {tr('control.printer.addPrinter', 'Add printer')}
                        </button>
                      </div>
                      {(() => {
                        const sorted = [...printers].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
                        const total = sorted.length;
                        const totalPages = Math.max(1, Math.ceil(total / PRINTERS_PAGE_SIZE));
                        const page = Math.min(printersPage, totalPages - 1);
                        const start = page * PRINTERS_PAGE_SIZE;
                        const paginated = sorted.slice(start, start + PRINTERS_PAGE_SIZE);
                        const canPrev = page > 0;
                        const canNext = page < totalPages - 1;
                        return sorted.length === 0 ? (
                          <ul className="w-full flex flex-col">
                            <li className="text-pos-muted text-xl font-medium text-center py-4">{tr('control.printer.empty', 'No printers yet.')}</li>
                          </ul>
                        ) : (
                          <>
                            <div className="max-h-[510px] overflow-y-auto rounded-lg [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                              <ul className="w-full flex flex-col">
                                {paginated.map((p) => (
                                  <li
                                    key={p.id}
                                    className="flex items-center w-full justify-between px-4 py-2 bg-pos-bg border-y border-pos-panel text-pos-text text-sm"
                                  >
                                    <div className="flex items-center gap-2 shrink-0">
                                      <button
                                        type="button"
                                        className="p-2 flex justify-center rounded text-pos-text active:bg-green-500 shrink-0"
                                        onClick={() => setDefaultPrinter(p.id)}
                                        aria-label={p.isDefault ? tr('control.printer.defaultPrinter', 'Default printer') : tr('control.printer.setAsDefault', 'Set as default')}
                                      >
                                        {p.isDefault ? (
                                          <span className="w-4 h-4 inline-flex justify-center items-center text-green-500 text-sm">{'\u2713'}</span>
                                        ) : (
                                          <span className="w-4 h-4 inline-block rounded-full border-2 border-pos-muted" />
                                        )}
                                      </button>
                                    </div>
                                    <span className="flex-1 text-center font-medium">{p.name}</span>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <button
                                        type="button"
                                        className="p-2 mr-5 rounded text-pos-text active:bg-green-500"
                                        onClick={() => openEditPrinterModal(p)}
                                        aria-label={tr('control.edit', 'Edit')}
                                      >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                      </button>
                                      <button
                                        type="button"
                                        className="p-2 rounded text-pos-text active:text-rose-500"
                                        onClick={() => setDeleteConfirmPrinterId(p.id)}
                                        aria-label={tr('delete', 'Delete')}
                                      >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                      </button>
                                    </div>
                                    <PaginationArrows
                                      canPrev={canPrev}
                                      canNext={canNext}
                                      onPrev={() => setPrintersPage((p) => Math.max(0, p - 1))}
                                      onNext={() => setPrintersPage((p) => Math.min(totalPages - 1, p + 1))}
                                    />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                  {printerTab === 'Final tickets' && (
                    <div className="relative min-h-[580px] rounded-xl border border-pos-border bg-pos-panel/30 p-4 pb-[60px]">
                      <div className="grid grid-cols-1 text-sm md:grid-cols-2 gap-x-10 gap-y-4 mb-6">
                        <div className="flex flex-col gap-4">
                          <div className='flex items-start gap-2'>
                            <label className="block text-pos-text font-medium min-w-[130px] max-w-[130px]">{tr('control.finalTickets.companyData', 'Company data:')}</label>
                            <div className='grid grid-cols-2 items-start gap-4'>
                              <input type="text" value={finalTicketsCompanyData1} onChange={(e) => setFinalTicketsCompanyData1(e.target.value)} onFocus={() => setFinalTicketsActiveField('companyData1')} className="px-4 min-w-[100px] max-w-[100px] flex py-3 bg-pos-panel h-[40px] border border-gray-300 rounded-lg justify-start items-start text-gray-200" />
                              {[2, 3, 4, 5].map((i) => (
                                <div key={i}>
                                  <input type="text" value={i === 2 ? finalTicketsCompanyData2 : i === 3 ? finalTicketsCompanyData3 : i === 4 ? finalTicketsCompanyData4 : finalTicketsCompanyData5} onChange={(e) => { if (i === 2) setFinalTicketsCompanyData2(e.target.value); else if (i === 3) setFinalTicketsCompanyData3(e.target.value); else if (i === 4) setFinalTicketsCompanyData4(e.target.value); else setFinalTicketsCompanyData5(e.target.value); }} onFocus={() => setFinalTicketsActiveField('companyData' + i)} className="px-4 min-w-[100px] max-w-[100px] py-3 bg-pos-panel h-[40px] border border-gray-300 rounded-lg text-gray-200" placeholder="" />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <label className="block text-pos-text font-medium min-w-[130px] max-w-[130px]">{tr('control.finalTickets.thankText', 'Thank text:')}</label>
                            <input type="text" value={finalTicketsThankText} onChange={(e) => setFinalTicketsThankText(e.target.value)} onFocus={() => setFinalTicketsActiveField('thankText')} className="px-4 min-w-[200px] max-w-[200px] py-3 bg-pos-panel h-[40px] border border-gray-300 rounded-lg text-gray-200" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex gap-2 items-center">
                            <label className="block text-pos-text font-medium min-w-[180px] max-w-[180px]">{tr('control.finalTickets.proformaTicket', 'Proforma ticket:')}</label>
                            <input type="checkbox" checked={finalTicketsProforma} onChange={(e) => setFinalTicketsProforma(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                          </div>
                          <div className="flex gap-2 items-center">
                            <label className="block text-pos-text font-medium min-w-[180px] max-w-[180px]">{tr('control.finalTickets.printPaymentType', 'Print payment type:')}</label>
                            <input type="checkbox" checked={finalTicketsPrintPaymentType} onChange={(e) => setFinalTicketsPrintPaymentType(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                          </div>
                          <div className="flex gap-2 items-center">
                            <label className="block text-pos-text font-medium min-w-[180px] max-w-[180px]">{tr('control.finalTickets.ticketTearable', 'Ticket tearable:')}</label>
                            <input type="checkbox" checked={finalTicketsTicketTearable} onChange={(e) => setFinalTicketsTicketTearable(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                          </div>
                          <div className="flex gap-2 items-center">
                            <label className="block text-pos-text font-medium min-w-[180px] max-w-[180px]">{tr('control.finalTickets.printLogo', 'Print logo:')}</label>
                            <input type="checkbox" checked={finalTicketsPrintLogo} onChange={(e) => setFinalTicketsPrintLogo(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="block text-pos-text font-medium min-w-[180px] max-w-[180px] shrink-0">{tr('control.finalTickets.printingOrder', 'Printing order of ticket:')}</label>
                            <Dropdown options={mapTranslatedOptions(PRINTING_ORDER_OPTIONS)} value={finalTicketsPrintingOrder} onChange={setFinalTicketsPrintingOrder} placeholder={tr('control.external.select', 'Select')} className="min-w-[150px]" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center pt-5 pb-5">
                        <button type="button" className="flex items-center text-lg gap-4 px-6 py-3 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50" disabled={savingFinalTickets} onClick={handleSaveFinalTickets}>
                          <svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                          {tr('control.save', 'Save')}
                        </button>
                      </div>
                      <div className="shrink-0">
                        <SmallKeyboardWithNumpad value={finalTicketsKeyboardValue} onChange={finalTicketsKeyboardOnChange} />
                      </div>
                    </div>
                  )}
                  {printerTab === 'Production Tickets' && (
                    <div className="relative min-h-[580px] rounded-xl border border-pos-border bg-pos-panel/30 p-4 pb-[60px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mb-6 text-sm">
                        <div className="flex flex-col gap-4">
                          <div className="flex gap-10 items-center">
                            <label className="block text-pos-text font-medium min-w-[200px] max-w-[200px]">{tr('control.prodTickets.displayCategories', 'Display categories on production ticket:')}</label>
                            <input type="checkbox" checked={prodTicketsDisplayCategories} onChange={(e) => setProdTicketsDisplayCategories(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                          </div>
                          <div className="flex gap-10 items-center">
                            <label className="block text-pos-text font-medium min-w-[200px] max-w-[200px]">{tr('control.prodTickets.spaceAbove', 'Space above ticket:')}</label>
                            <input type="checkbox" checked={prodTicketsSpaceAbove} onChange={(e) => setProdTicketsSpaceAbove(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                          </div>
                          <div className="flex gap-10 items-center">
                            <label className="block text-pos-text font-medium min-w-[200px] max-w-[200px]">{tr('control.finalTickets.ticketTearable', 'Ticket tearable:')}</label>
                            <input type="checkbox" checked={prodTicketsTicketTearable} onChange={(e) => setProdTicketsTicketTearable(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                          </div>
                          <div className="flex gap-10 items-center">
                            <label className="block text-pos-text font-medium min-w-[200px] max-w-[200px]">{tr('control.prodTickets.keukenprinterBuzzer', 'Kitchen printer buzzer:')}</label>
                            <input type="checkbox" checked={prodTicketsKeukenprinterBuzzer} onChange={(e) => setProdTicketsKeukenprinterBuzzer(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                          </div>
                          <div className="flex gap-10 items-center">
                            <label className="block text-pos-text font-medium min-w-[200px] max-w-[200px]">{tr('control.prodTickets.productsIndividually', 'Print products individually:')}</label>
                            <input type="checkbox" checked={prodTicketsProductenIndividueel} onChange={(e) => setProdTicketsProductenIndividueel(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                          </div>
                          <div className="flex gap-10 items-center">
                            <label className="block text-pos-text font-medium min-w-[200px] max-w-[200px]">{tr('control.prodTickets.eatInTakeOutBottom', 'Print Eat in / Take out at bottom:')}</label>
                            <input type="checkbox" checked={prodTicketsEatInTakeOutOnderaan} onChange={(e) => setProdTicketsEatInTakeOutOnderaan(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-3">
                            <label className="block text-pos-text font-medium min-w-[180px] max-w-[180px] shrink-0">{tr('control.prodTickets.nextCoursePrinter', 'Next course printer {n}:').replace('{n}', '1')}</label>
                            <Dropdown options={mapTranslatedOptions(productionTicketsPrinterOptions)} value={prodTicketsNextCoursePrinter1} onChange={setProdTicketsNextCoursePrinter1} placeholder={tr('control.external.disabled', 'Disabled')} className="min-w-[150px]" />
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="block text-pos-text font-medium min-w-[180px] max-w-[180px] shrink-0">{tr('control.prodTickets.nextCoursePrinter', 'Next course printer {n}:').replace('{n}', '2')}</label>
                            <Dropdown options={mapTranslatedOptions(productionTicketsPrinterOptions)} value={prodTicketsNextCoursePrinter2} onChange={setProdTicketsNextCoursePrinter2} placeholder={tr('control.external.disabled', 'Disabled')} className="min-w-[150px]" />
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="block text-pos-text font-medium min-w-[180px] max-w-[180px] shrink-0">{tr('control.prodTickets.nextCoursePrinter', 'Next course printer {n}:').replace('{n}', '3')}</label>
                            <Dropdown options={mapTranslatedOptions(productionTicketsPrinterOptions)} value={prodTicketsNextCoursePrinter3} onChange={setProdTicketsNextCoursePrinter3} placeholder={tr('control.external.disabled', 'Disabled')} className="min-w-[150px]" />
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="block text-pos-text font-medium min-w-[180px] max-w-[180px] shrink-0">{tr('control.prodTickets.nextCoursePrinter', 'Next course printer {n}:').replace('{n}', '4')}</label>
                            <Dropdown options={mapTranslatedOptions(productionTicketsPrinterOptions)} value={prodTicketsNextCoursePrinter4} onChange={setProdTicketsNextCoursePrinter4} placeholder={tr('control.external.disabled', 'Disabled')} className="min-w-[150px]" />
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="block text-pos-text font-medium min-w-[180px] max-w-[180px] shrink-0">{tr('control.prodTickets.printingOrder', 'Printing order of production ticket:')}</label>
                            <Dropdown options={mapTranslatedOptions(PRINTING_ORDER_OPTIONS)} value={prodTicketsPrintingOrder} onChange={setProdTicketsPrintingOrder} placeholder={tr('control.external.select', 'Select')} className="min-w-[150px]" />
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="block text-pos-text font-medium min-w-[180px] max-w-[180px] shrink-0">{tr('control.prodTickets.groupingReceipt', 'Grouping receipt:')}</label>
                            <Dropdown options={mapTranslatedOptions(GROUPING_RECEIPT_OPTIONS)} value={prodTicketsGroupingReceipt} onChange={setProdTicketsGroupingReceipt} placeholder={tr('control.external.select', 'Select')} className="min-w-[150px]" />
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="block text-pos-text font-medium min-w-[180px] max-w-[180px] shrink-0">{tr('control.prodTickets.transferPrinter', 'Transfer printer:')}</label>
                            <Dropdown options={mapTranslatedOptions(productionTicketsPrinterOptions)} value={prodTicketsPrinterOverboeken} onChange={setProdTicketsPrinterOverboeken} placeholder={tr('control.external.disabled', 'Disabled')} className="min-w-[150px]" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center pt-5 pb-5 text-md">
                        <button type="button" className="flex items-center gap-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50" disabled={savingProdTickets} onClick={handleSaveProductionTickets}>
                          <svg fill="#ffffff" width="14px" height="14px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                          {tr('control.save', 'Save')}
                        </button>
                      </div>
                    </div>
                  )}
                  {printerTab === 'Labels' && (() => {
                    const sortedLabels = [...labelsList].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
                    return (
                      <div className="relative min-h-[400px] max-h-[580px] rounded-xl border border-pos-border bg-pos-panel/30 p-4 pb-[60px]">
                        <div className="flex flex-wrap items-center justify-center w-full gap-4 mb-2">
                          <Dropdown options={labelsTypeOptions} value={labelsType} onChange={(v) => saveLabelsSettings({ type: v })} placeholder={tr('control.labels.selectPlaceholder', 'Select')} className="text-sm min-w-[200px]" />
                          <Dropdown options={labelsPrinterOptions} value={labelsPrinter} onChange={(v) => saveLabelsSettings({ printer: v })} placeholder={tr('control.labels.selectPrinter', 'Select printer')} className="text-sm min-w-[200px]" />
                          <button type="button" className="px-6 py-3 rounded-lg text-sm font-medium bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 active:border-white/30 transition-colors disabled:opacity-50" onClick={openNewLabelModal}>
                            {tr('control.labels.new', 'New label')}
                          </button>
                        </div>
                        {sortedLabels.length === 0 ? (
                          <ul className="w-full flex flex-col">
                            <li className="text-pos-muted text-xl font-medium text-center py-4">{tr('control.labels.empty', 'No labels yet.')}</li>
                          </ul>
                        ) : (
                          <>
                            <div
                              ref={labelsListRef}
                              onScroll={updateLabelsScrollState}
                              className="max-h-[450px] overflow-y-auto rounded-lg [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                            >
                              <ul className="w-full flex flex-col">
                                {sortedLabels.map((item) => (
                                  <li
                                    key={item.id}
                                    className="flex items-center w-full justify-between px-4 py-2 bg-pos-bg border-y border-pos-panel text-pos-text text-sm"
                                  >
                                    <span className="flex-1 text-left font-medium">{item.sizeLabel || item.name || ''}</span>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <button
                                        type="button"
                                        className="p-2 mr-5 rounded text-pos-text active:bg-green-500"
                                        onClick={() => openEditLabelModal(item)}
                                        aria-label={tr('control.edit', 'Edit')}
                                      >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                      </button>
                                      <button
                                        type="button"
                                        className="p-2 rounded text-pos-text active:text-rose-500"
                                        onClick={() => setDeleteConfirmLabelId(item.id)}
                                        aria-label={tr('delete', 'Delete')}
                                      >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <PaginationArrows
                              canPrev={canLabelsScrollUp}
                              canNext={canLabelsScrollDown}
                              onPrev={() => scrollLabelsByPage('up')}
                              onNext={() => scrollLabelsByPage('down')}
                            />
                          </>
                        )}
                      </div>
                    );
                  })()}
                  {printerTab !== 'General' && printerTab !== 'Final tickets' && printerTab !== 'Production Tickets' && printerTab !== 'Labels' && (
                    <p className="text-pos-muted text-xl py-4">{tr('control.printerTabPlaceholder', 'Settings for "{tab}" will be available here.').replace('{tab}', printerTab)}</p>
                  )}
                </div>
              )}
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
                    {tableLocationsLoading ? (
                      <li className="text-pos-muted text-sm py-4 text-center">{tr('control.tables.loading', 'Loading table locations...')}</li>
                    ) : tableLocations.length === 0 ? (
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
                                className={`w-full text-center px-3 py-1 rounded-lg text-sm active:bg-green-500 ${hasSavedLayout ? 'text-white' : 'text-pos-muted active:text-pos-text'
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
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </button>
                              <button
                                type="button"
                                className="p-1 rounded text-pos-text active:bg-green-500"
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
      </div>

  );
}
