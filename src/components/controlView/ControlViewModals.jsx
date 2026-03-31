import React from 'react';
import { Dropdown } from '../Dropdown';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { KeyboardWithNumpad } from '../KeyboardWithNumpad';
import { SmallKeyboardWithNumpad } from '../SmallKeyboardWithNumpad';
import { CalendarModal } from '../CalendarModal';
import { PaginationArrows } from '../PaginationArrows';
import { PrinterModal } from '../PrinterModal';
import { publicAssetUrl } from '../../lib/publicAssetUrl.js';

import {
  API,
  KITCHEN_ADMIN_CREDENTIAL_ID,
  CONTROL_SIDEBAR_ITEMS,
  LANGUAGE_OPTIONS,
  TOP_NAV_ITEMS,
  SUB_NAV_ITEMS,
  CASH_REGISTER_SUB_NAV_ITEMS,
  EXTERNAL_DEVICES_SUB_NAV_ITEMS,
  PRINTER_TAB_DEFS,
  PRINTING_ORDER_OPTIONS,
  PRINTER_DISABLED_OPTIONS,
  SUBPRODUCT_VAT_OPTIONS,
  GROUPING_RECEIPT_OPTIONS,
  SCHEDULED_ORDERS_PRODUCTION_FLOW_OPTIONS,
  SCHEDULED_ORDERS_LOADING_OPTIONS,
  SCHEDULED_ORDERS_MODE_OPTIONS,
  SCHEDULED_ORDERS_INVOICE_LAYOUT_OPTIONS,
  SCHEDULED_ORDERS_CHECKOUT_AT_OPTIONS,
  PRICE_DISPLAY_TYPE_OPTIONS,
  RFID_READER_TYPE_OPTIONS,
  BARCODE_SCANNER_TYPE_OPTIONS,
  CREDIT_CARD_TYPE_OPTIONS,
  SCALE_TYPE_OPTIONS,
  SCALE_PORT_OPTIONS,
  REPORT_TABS,
  REPORT_GENERATE_UNTIL_OPTIONS,
  PERIODIC_REPORT_TIME_OPTIONS,
  USER_AVATAR_COLORS,
  USER_PRIVILEGE_AVATAR_COLORS,
  USER_PRIVILEGE_OPTIONS,
  DEFAULT_USER_PRIVILEGES,
  DISCOUNT_TRIGGER_OPTIONS,
  DISCOUNT_TYPE_OPTIONS,
  DISCOUNT_ON_OPTIONS,
  REPORT_SETTINGS_ROWS,
  DEFAULT_REPORT_SETTINGS,
  DEFAULT_PRINTERS,
  PRINTERS_PAGE_SIZE,
  VAT_OPTIONS,
  DEVICE_SETTINGS_TABS,
  DEVICE_SETTINGS_TAB_LABEL_KEYS,
  FUNCTION_BUTTON_ITEMS,
  FUNCTION_BUTTON_SLOT_COUNT,
  FUNCTION_BUTTON_ITEM_IDS,
  FUNCTION_BUTTON_ITEM_BY_ID,
  OPTION_BUTTON_ITEMS,
  OPTION_BUTTON_SLOT_COUNT,
  OPTION_BUTTON_LOCKED_ID,
  OPTION_BUTTON_ITEM_IDS,
  OPTION_BUTTON_ITEM_BY_ID,
  DEFAULT_OPTION_BUTTON_LAYOUT,
  SYSTEM_SETTINGS_TABS,
  SYSTEM_SETTINGS_TAB_LABEL_KEYS,
  LEEGGOED_OPTIONS,
  SAVINGS_DISCOUNT_OPTIONS,
  TICKET_VOUCHER_VALIDITY_OPTIONS,
  TICKET_SCHEDULED_PRINT_MODE_OPTIONS,
  TICKET_SCHEDULED_CUSTOMER_SORT_OPTIONS,
  BARCODE_TYPE_OPTIONS,
  TABLE_LOCATION_BACKGROUND_OPTIONS,
  SET_TABLES_ZOOM_MIN,
  SET_TABLES_ZOOM_MAX,
  SET_TABLES_ZOOM_STEP,
  TABLE_TEMPLATE_OPTIONS,
  TABLE_BOARD_COLOR_OPTIONS,
  PAYMENT_INTEGRATION_OPTIONS,
  VAT_PERCENT_OPTIONS,
  EXTRA_PRICE_PRINTER_OPTIONS,
  VERVALTYPE_OPTIONS,
  PURCHASE_UNIT_OPTIONS,
  PURCHASE_SUPPLIER_OPTIONS,
  KIOSK_SUBS_OPTIONS
} from './constants.js';
import {
  normalizeFunctionButtonSlots,
  normalizeOptionButtonSlots,
  normalizeLayoutEditorDraft,
  createDefaultLayoutTable,
  createDefaultBoard,
  normalizeBoardToItem,
  createDefaultFlowerPot,
  normalizeFlowerPotToItem,
  safeNumberInputValue,
  layoutEditorReadTableX,
  layoutEditorReadTableY
} from './controlViewUtils.js';

export function ControlViewModals(props) {
  const deviceScheduledPrintCustomerProductionReceipt = props.deviceScheduledPrintCustomerProductionReceipt;
  const deviceScheduledDeliveryNoteToTurnover = props.deviceScheduledDeliveryNoteToTurnover;
  const deviceScheduledPrintProductionReceipt = props.deviceScheduledPrintProductionReceipt;
  const devicePrinterProductionMessageOnVat = props.devicePrinterProductionMessageOnVat;
  const deviceOrdersPrintBarcodeAfterCreate = props.deviceOrdersPrintBarcodeAfterCreate;
  const sysCashButtonVisibleMultiplePayment = props.sysCashButtonVisibleMultiplePayment;
  const updateProductionMessagesScrollState = props.updateProductionMessagesScrollState;
  const handleOptionButtonDragStartFromSlot = props.handleOptionButtonDragStartFromSlot;
  const productSubproductsRightSelectedIds = props.productSubproductsRightSelectedIds;
  const devicePrinterReprintWithNextCourse = props.devicePrinterReprintWithNextCourse;
  const handleRemoveProductSubproductLinks = props.handleRemoveProductSubproductLinks;
  const handleRemoveFunctionButtonFromSlot = props.handleRemoveFunctionButtonFromSlot;
  const handleAddOrUpdateProductionMessage = props.handleAddOrUpdateProductionMessage;
  const productSubproductsLeftSelectedIds = props.productSubproductsLeftSelectedIds;
  const deviceOrdersCustomerCanBeModified = props.deviceOrdersCustomerCanBeModified;
  const updateManageGroupsPaginationState = props.updateManageGroupsPaginationState;
  const deviceAutoLogoutAfterTransaction = props.deviceAutoLogoutAfterTransaction;
  const deviceDisableCashButtonInPayment = props.deviceDisableCashButtonInPayment;
  const deviceScheduledPrintBarcodeLabel = props.deviceScheduledPrintBarcodeLabel;
  const deviceScheduledWebOrderAutoPrint = props.deviceScheduledWebOrderAutoPrint;
  const selectedFunctionButtonPoolItemId = props.selectedFunctionButtonPoolItemId;
  const deleteConfirmProductionMessageId = props.deleteConfirmProductionMessageId;
  const handleRemoveOptionButtonFromSlot = props.handleRemoveOptionButtonFromSlot;
  const hasSelectedRemovableOptionButton = props.hasSelectedRemovableOptionButton;
  const kitchenProductsRightSelectedIds = props.kitchenProductsRightSelectedIds;
  const loadingProductSubproductsLinked = props.loadingProductSubproductsLinked;
  const setTablesSelectedFlowerPotIndex = props.setTablesSelectedFlowerPotIndex;
  const selectedFunctionButtonSlotIndex = props.selectedFunctionButtonSlotIndex;
  const sysQrOrdersAutomatischAfrekenen = props.sysQrOrdersAutomatischAfrekenen;
  const canProductionMessagesScrollDown = props.canProductionMessagesScrollDown;
  const updateDiscountTargetScrollState = props.updateDiscountTargetScrollState;
  const handleAddProductSubproductLinks = props.handleAddProductSubproductLinks;
  const handleRemoveKitchenProductLinks = props.handleRemoveKitchenProductLinks;
  const kitchenProductsModalCategories = props.kitchenProductsModalCategories;
  const kitchenProductsLeftSelectedIds = props.kitchenProductsLeftSelectedIds;
  const deviceOpenCashDrawerAfterOrder = props.deviceOpenCashDrawerAfterOrder;
  const deviceOrdersBookTableToWaiting = props.deviceOrdersBookTableToWaiting;
  const selectedOptionButtonPoolItemId = props.selectedOptionButtonPoolItemId;
  const sysTicketScheduledCustomerSort = props.sysTicketScheduledCustomerSort;
  const scrollSubproductAttachToByPage = props.scrollSubproductAttachToByPage;
  const handleFunctionButtonDropOnSlot = props.handleFunctionButtonDropOnSlot;
  const getUniqueProductPrinterOptions = props.getUniqueProductPrinterOptions;
  const kitchenProductsCategoryFilter = props.kitchenProductsCategoryFilter;
  const setKitchenProductsCategoryFilter = props.setKitchenProductsCategoryFilter;
  const loadingKitchenProductsCatalog = props.loadingKitchenProductsCatalog;
  const categoryDisplayOnCashRegister = props.categoryDisplayOnCashRegister;
  const productSubproductsLeftListRef = props.productSubproductsLeftListRef;
  const positioningSelectedPoolItemId = props.positioningSelectedPoolItemId;
  const deviceAutoReturnToCounterSale = props.deviceAutoReturnToCounterSale;
  const devicePrinterGroupingProducts = props.devicePrinterGroupingProducts;
  const devicePrinterPrintZeroTickets = props.devicePrinterPrintZeroTickets;
  const devicePrinterGiftVoucherAtMin = props.devicePrinterGiftVoucherAtMin;
  const deviceScheduledProductionFlow = props.deviceScheduledProductionFlow;
  const selectedOptionButtonSlotIndex = props.selectedOptionButtonSlotIndex;
  const canProductionMessagesScrollUp = props.canProductionMessagesScrollUp;
  const subproductAttachToCategoryIds = props.subproductAttachToCategoryIds;
  const handleFunctionButtonDragStart = props.handleFunctionButtonDragStart;
  const handleFunctionButtonSlotClick = props.handleFunctionButtonSlotClick;
  const handleDeleteProductionMessage = props.handleDeleteProductionMessage;
  const positioningSelectedProductId = props.positioningSelectedProductId;
  const positioningSelectedCellIndex = props.positioningSelectedCellIndex;
  const advancedVoorverpakVervaltype = props.advancedVoorverpakVervaltype;
  const deleteConfirmTableLocationId = props.deleteConfirmTableLocationId;
  const devicePrinterShowErrorScreen = props.devicePrinterShowErrorScreen;
  const devicePrinterNextCourseOrder = props.devicePrinterNextCourseOrder;
  const deviceOrdersFastCustomerName = props.deviceOrdersFastCustomerName;
  const deviceScheduledInvoiceLayout = props.deviceScheduledInvoiceLayout;
  const sysEnkelQROrdersKeukenscherm = props.sysEnkelQROrdersKeukenscherm;
  const formatDateForCurrentLanguage = props.formatDateForCurrentLanguage;
  const closeProductPositioningModal = props.closeProductPositioningModal;
  const saveProductPositioningLayout = props.saveProductPositioningLayout;
  const closeProductSubproductsModal = props.closeProductSubproductsModal;
  const handleSaveProductSubproducts = props.handleSaveProductSubproducts;
  const handleOptionButtonDropOnSlot = props.handleOptionButtonDropOnSlot;
  const handleAddKitchenProductLinks = props.handleAddKitchenProductLinks;
  const canDiscountTargetScrollDown = props.canDiscountTargetScrollDown;
  const kitchenProductsRightListRef = props.kitchenProductsRightListRef;
  const showProductSubproductsModal = props.showProductSubproductsModal;
  const showProductPositioningModal = props.showProductPositioningModal;
  const positioningLayoutByCategory = props.positioningLayoutByCategory;
  const tableLocationSelectionStart = props.tableLocationSelectionStart;
  const setTablesSelectedBoardIndex = props.setTablesSelectedBoardIndex;
  const deviceAutoReturnToTablePlan = props.deviceAutoReturnToTablePlan;
  const deviceOpenPriceWithoutPopup = props.deviceOpenPriceWithoutPopup;
  const devicePrinterQROrderPrinter = props.devicePrinterQROrderPrinter;
  const sysTegoedAutomatischInladen = props.sysTegoedAutomatischInladen;
  const sysKlantgegevensQRAfdrukken = props.sysKlantgegevensQRAfdrukken;
  const sysSavingsPointsPerDiscount = props.sysSavingsPointsPerDiscount;
  const sysTicketScheduledPrintMode = props.sysTicketScheduledPrintMode;
  const showProductionMessagesModal = props.showProductionMessagesModal;
  const productSubproductsAvailable = props.productSubproductsAvailable;
  const removeProductSubproductLink = props.removeProductSubproductLink;
  const handleOptionButtonDragStart = props.handleOptionButtonDragStart;
  const handleOptionButtonSlotClick = props.handleOptionButtonSlotClick;
  const cancelEditProductionMessage = props.cancelEditProductionMessage;
  const kitchenProductsLeftListRef = props.kitchenProductsLeftListRef;
  const positioningColorByCategory = props.positioningColorByCategory;
  const advancedSubproductRequires = props.advancedSubproductRequires;
  const syncExtraPricesScrollEdges = props.syncExtraPricesScrollEdges;
  const sysArrangeProductsManually = props.sysArrangeProductsManually;
  const deleteConfirmPaymentTypeId = props.deleteConfirmPaymentTypeId;
  const editingProductionMessageId = props.editingProductionMessageId;
  const positioningCategoryTabsRef = props.positioningCategoryTabsRef;
  const scrollDiscountTargetByPage = props.scrollDiscountTargetByPage;
  const handleSubproductNameChange = props.handleSubproductNameChange;
  const subproductKeyboardOnChange = props.subproductKeyboardOnChange;
  const updateSelectedSetFlowerPot = props.updateSelectedSetFlowerPot;
  const startEditProductionMessage = props.startEditProductionMessage;
  const canDiscountTargetScrollUp = props.canDiscountTargetScrollUp;
  const productSubproductsProduct = props.productSubproductsProduct;
  const productSubproductsGroupId = props.productSubproductsGroupId;
  const productSubproductsListRef = props.productSubproductsListRef;
  const showProductSearchKeyboard = props.showProductSearchKeyboard;
  const advancedKassaPhotoPreview = props.advancedKassaPhotoPreview;
  const notificationSoldOutPieces = props.notificationSoldOutPieces;
  const tableLocationSelectionEnd = props.tableLocationSelectionEnd;
  const tableLocationNameInputRef = props.tableLocationNameInputRef;
  const devicePrinterStandardMode = props.devicePrinterStandardMode;
  const deviceOrdersConfirmOnHold = props.deviceOrdersConfirmOnHold;
  const deviceScheduledCheckoutAt = props.deviceScheduledCheckoutAt;
  const sysVatRateVariousProducts = props.sysVatRateVariousProducts;
  const sysNieuwstePrijsGebruiken = props.sysNieuwstePrijsGebruiken;
  const productionMessagesListRef = props.productionMessagesListRef;
  const subproductAttachToListRef = props.subproductAttachToListRef;
  const deleteConfirmSubproductId = props.deleteConfirmSubproductId;
  const handleDeleteTableLocation = props.handleDeleteTableLocation;
  const selectedSetFlowerPotIndex = props.selectedSetFlowerPotIndex;
  const hasSelectedFunctionButton = props.hasSelectedFunctionButton;
  const assignedFunctionButtonIds = props.assignedFunctionButtonIds;
  const userModalKeyboardOnChange = props.userModalKeyboardOnChange;
  const closeKitchenProductsModal = props.closeKitchenProductsModal;
  const handleSaveKitchenProducts = props.handleSaveKitchenProducts;
  const showKitchenProductsModal = props.showKitchenProductsModal;
  const productSubproductsLinked = props.productSubproductsLinked;
  const savingProductSubproducts = props.savingProductSubproducts;
  const setTablesSelectedTableId = props.setTablesSelectedTableId;
  const deviceAskInvoiceOrTicket = props.deviceAskInvoiceOrTicket;
  const deviceCategoryDisplayIds = props.deviceCategoryDisplayIds;
  const sysOneWachtorderPerKlant = props.sysOneWachtorderPerKlant;
  const sysTicketVoucherValidity = props.sysTicketVoucherValidity;
  const subproductProductionName = props.subproductProductionName;
  const handleSaveDeviceSettings = props.handleSaveDeviceSettings;
  const handleSaveSystemSettings = props.handleSaveSystemSettings;
  const handleSavePrinterPayload = props.handleSavePrinterPayload;
  const discountKeyboardOnChange = props.discountKeyboardOnChange;
  const kitchenProductsAvailable = props.kitchenProductsAvailable;
  const removeKitchenProductLink = props.removeKitchenProductLink;
  const deleteConfirmDiscountId = props.deleteConfirmDiscountId;
  const deleteConfirmCategoryId = props.deleteConfirmCategoryId;
  const savingPositioningLayout = props.savingPositioningLayout;
  const advancedGroupingReceipt = props.advancedGroupingReceipt;
  const tableLocationBackground = props.tableLocationBackground;
  const setTableLocationBackground = props.setTableLocationBackground;
  const setTableLocationTextColor = props.setTableLocationTextColor;
  const setTableLocationName = props.setTableLocationName;
  const setTableLocationSelectionStart = props.setTableLocationSelectionStart;
  const setTableLocationSelectionEnd = props.setTableLocationSelectionEnd;
  const showDeviceSettingsModal = props.showDeviceSettingsModal;
  const showSystemSettingsModal = props.showSystemSettingsModal;
  const sysLimitOneUserPerTable = props.sysLimitOneUserPerTable;
  const sysSavingsPointsPerEuro = props.sysSavingsPointsPerEuro;
  const savingProductionMessage = props.savingProductionMessage;
  const canManageGroupsPageDown = props.canManageGroupsPageDown;
  const productKeyboardOnChange = props.productKeyboardOnChange;
  const subproductKeyboardValue = props.subproductKeyboardValue;
  const closeTableLocationModal = props.closeTableLocationModal;
  const handleSaveTableLocation = props.handleSaveTableLocation;
  const addSetTableWithTemplate = props.addSetTableWithTemplate;
  const unassignedOptionButtons = props.unassignedOptionButtons;
  const handleDeletePaymentType = props.handleDeletePaymentType;
  const discountProductOptions = props.discountProductOptions;
  const deleteConfirmKitchenId = props.deleteConfirmKitchenId;
  const kitchenProductsKitchen = props.kitchenProductsKitchen;
  const kitchenProductsCatalog = props.kitchenProductsCatalog;
  const positioningSubproducts = props.positioningSubproducts;
  const deleteConfirmProductId = props.deleteConfirmProductId;
  const advancedPagerVerplicht = props.advancedPagerVerplicht;
  const advancedLabelExtraInfo = props.advancedLabelExtraInfo;
  const advancedBewarenGebruik = props.advancedBewarenGebruik;
  const extraPricesScrollEdges = props.extraPricesScrollEdges;
  const webshopOnlineOrderable = props.webshopOnlineOrderable;
  const showTableLocationModal = props.showTableLocationModal;
  const tableLocationTextColor = props.tableLocationTextColor;
  const showSetBoardColorModal = props.showSetBoardColorModal;
  const deviceAskSendToKitchen = props.deviceAskSendToKitchen;
  const deviceScheduledPrinter = props.deviceScheduledPrinter;
  const deviceScheduledLoading = props.deviceScheduledLoading;
  const sysCategorieenPerKassa = props.sysCategorieenPerKassa;
  const paymentTypeIntegration = props.paymentTypeIntegration;
  const productionMessageInput = props.productionMessageInput;
  const setProductionMessageInput = props.setProductionMessageInput;
  const deleteConfirmPrinterId = props.deleteConfirmPrinterId;
  const subproductModalGroupId = props.subproductModalGroupId;
  const subproductKioskPicture = props.subproductKioskPicture;
  const setSubproductActiveField = props.setSubproductActiveField;
  const setSubproductKeyName = props.setSubproductKeyName;
  const setSubproductProductionName = props.setSubproductProductionName;
  const setSubproductPrice = props.setSubproductPrice;
  const setSubproductVatTakeOut = props.setSubproductVatTakeOut;
  const setSubproductVatEatIn = props.setSubproductVatEatIn;
  const setSubproductModalGroupId = props.setSubproductModalGroupId;
  const setSubproductKioskPicture = props.setSubproductKioskPicture;
  const setSubproductAttachToCategoryIds = props.setSubproductAttachToCategoryIds;
  const setSubproductFieldErrors = props.setSubproductFieldErrors;
  const getFunctionButtonLabel = props.getFunctionButtonLabel;
  const handleDeletePriceGroup = props.handleDeletePriceGroup;
  const handleDeleteSubproduct = props.handleDeleteSubproduct;
  const updateSelectedSetTable = props.updateSelectedSetTable;
  const updateSelectedSetBoard = props.updateSelectedSetBoard;
  const handleSelectBoardColor = props.handleSelectBoardColor;
  const userModalKeyboardValue = props.userModalKeyboardValue;
  const discountTargetListRef = props.discountTargetListRef;
  const discountCalendarField = props.discountCalendarField;
  const kitchenProductsLinked = props.kitchenProductsLinked;
  const savingKitchenProducts = props.savingKitchenProducts;
  const positioningCategoryId = props.positioningCategoryId;
  const productProductionName = props.productProductionName;
  const barcodeButtonSpinning = props.barcodeButtonSpinning;
  const advancedLeeggoedPrijs = props.advancedLeeggoedPrijs;
  const advancedHoudbareDagen = props.advancedHoudbareDagen;
  const declarationExpiryDays = props.declarationExpiryDays;
  const setTablesLocationName = props.setTablesLocationName;
  const showSetTableTypeModal = props.showSetTableTypeModal;
  const setTablesDraggingType = props.setTablesDraggingType;
  const sysUseStockManagement = props.sysUseStockManagement;
  const sysAutoAcceptQROrders = props.sysAutoAcceptQROrders;
  const showManageGroupsModal = props.showManageGroupsModal;
  const subproductFieldErrors = props.subproductFieldErrors;
  const selectedManageGroupId = props.selectedManageGroupId;
  const canManageGroupsPageUp = props.canManageGroupsPageUp;
  const handleGenerateBarcode = props.handleGenerateBarcode;
  const selectedSetBoardIndex = props.selectedSetBoardIndex;
  const handleRemoveFlowerPot = props.handleRemoveFlowerPot;
  const startSetFlowerPotDrag = props.startSetFlowerPotDrag;
  const closePaymentTypeModal = props.closePaymentTypeModal;
  const handleSavePaymentType = props.handleSavePaymentType;
  const discountKeyboardValue = props.discountKeyboardValue;
  const userAvatarColorIndex = props.userAvatarColorIndex;
  const productDisplayNumber = props.productDisplayNumber;
  const extraPricesScrollRef = props.extraPricesScrollRef;
  const websitePhotoFileName = props.websitePhotoFileName;
  const kioskPictureFileName = props.kioskPictureFileName;
  const deviceUseSubproducts = props.deviceUseSubproducts;
  const deviceCounterSaleVat = props.deviceCounterSaleVat;
  const savingDeviceSettings = props.savingDeviceSettings;
  const sysLeeggoedTerugname = props.sysLeeggoedTerugname;
  const savingSystemSettings = props.savingSystemSettings;
  const showPaymentTypeModal = props.showPaymentTypeModal;
  const deleteConfirmLabelId = props.deleteConfirmLabelId;
  const subproductVatTakeOut = props.subproductVatTakeOut;
  const deleteConfirmGroupId = props.deleteConfirmGroupId;
  const mapTranslatedOptions = props.mapTranslatedOptions;
  const getOptionButtonLabel = props.getOptionButtonLabel;
  const closePriceGroupModal = props.closePriceGroupModal;
  const handleSavePriceGroup = props.handleSavePriceGroup;
  const handleDeleteCategory = props.handleDeleteCategory;
  const productKeyboardValue = props.productKeyboardValue;
  const closeSubproductModal = props.closeSubproductModal;
  const handleSaveSubproduct = props.handleSaveSubproduct;
  const handleDeleteDiscount = props.handleDeleteDiscount;
  const deleteConfirmUserId = props.deleteConfirmUserId;
  const showPriceGroupModal = props.showPriceGroupModal;
  const categoryActiveField = props.categoryActiveField;
  const productTabsUnlocked = props.productTabsUnlocked;
  const savingTableLocation = props.savingTableLocation;
  const setTablesCanvasZoom = props.setTablesCanvasZoom;
  const setSetTablesCanvasZoom = props.setSetTablesCanvasZoom;
  const setSetTablesSelectedTableId = props.setSetTablesSelectedTableId;
  const setSetTablesSelectedBoardIndex = props.setSetTablesSelectedBoardIndex;
  const setSetTablesSelectedFlowerPotIndex = props.setSetTablesSelectedFlowerPotIndex;
  const setTablesDraggingId = props.setTablesDraggingId;
  const deviceTimeoutLogout = props.deviceTimeoutLogout;
  const deviceScheduledMode = props.deviceScheduledMode;
  const functionButtonSlots = props.functionButtonSlots;
  const sysLoginWithoutCode = props.sysLoginWithoutCode;
  const sysAspect169Windows = props.sysAspect169Windows;
  const sysUsePlaceSettings = props.sysUsePlaceSettings;
  const sysPriceCounterSale = props.sysPriceCounterSale;
  const showSubproductModal = props.showSubproductModal;
  const subproductSaveError = props.subproductSaveError;
  const manageGroupsListRef = props.manageGroupsListRef;
  const manageGroupsDragRef = props.manageGroupsDragRef;
  const handleLogoutConfirm = props.handleLogoutConfirm;
  const handleDeleteProduct = props.handleDeleteProduct;
  const handleSaveEditGroup = props.handleSaveEditGroup;
  const closeSetTablesModal = props.closeSetTablesModal;
  const saveSetTablesLayout = props.saveSetTablesLayout;
  const handleDeletePrinter = props.handleDeletePrinter;
  const handleDeleteKitchen = props.handleDeleteKitchen;
  const discountCombinable = props.discountCombinable;
  const categoryNextCourse = props.categoryNextCourse;
  const selectedCategoryId = props.selectedCategoryId;
  const productCategoryIds = props.productCategoryIds;
  const productFieldErrors = props.productFieldErrors;
  const advancedWeegschaal = props.advancedWeegschaal;
  const showSetTablesModal = props.showSetTablesModal;
  const setTablesCanvasRef = props.setTablesCanvasRef;
  const deviceTableSaleVat = props.deviceTableSaleVat;
  const sysSavingsDiscount = props.sysSavingsDiscount;
  const productionMessages = props.productionMessages;
  const subproductVatEatIn = props.subproductVatEatIn;
  const closeCategoryModal = props.closeCategoryModal;
  const handleSaveCategory = props.handleSaveCategory;
  const handleAddFlowerPot = props.handleAddFlowerPot;
  const closeDiscountModal = props.closeDiscountModal;
  const handleSaveDiscount = props.handleSaveDiscount;
  const showDiscountModal = props.showDiscountModal;
  const discountStartDate = props.discountStartDate;
  const discountTargetIds = props.discountTargetIds;
  const categoriesLoading = props.categoriesLoading;
  const showCategoryModal = props.showCategoryModal;
  const categoryInWebshop = props.categoryInWebshop;
  const productVatTakeOut = props.productVatTakeOut;
  const advancedOpenPrice = props.advancedOpenPrice;
  const advancedBoldPrint = props.advancedBoldPrint;
  const purchasePriceExcl = props.purchasePriceExcl;
  const purchasePriceIncl = props.purchasePriceIncl;
  const stockNotification = props.stockNotification;
  const tableLocationName = props.tableLocationName;
  const deviceSettingsTab = props.deviceSettingsTab;
  const deviceFixedBorder = props.deviceFixedBorder;
  const deviceAlwaysOnTop = props.deviceAlwaysOnTop;
  const optionButtonSlots = props.optionButtonSlots;
  const systemSettingsTab = props.systemSettingsTab;
  const sysUsePriceGroups = props.sysUsePriceGroups;
  const sysPriceTableSale = props.sysPriceTableSale;
  const paymentTypeActive = props.paymentTypeActive;
  const savingPaymentType = props.savingPaymentType;
  const labelMarginBottom = props.labelMarginBottom;
  const subproductKeyName = props.subproductKeyName;
  const closeProductModal = props.closeProductModal;
  const handleSaveProduct = props.handleSaveProduct;
  const handleRemoveBoard = props.handleRemoveBoard;
  const startSetTableDrag = props.startSetTableDrag;
  const startSetBoardDrag = props.startSetBoardDrag;
  const handleDeleteGroup = props.handleDeleteGroup;
  const closePrinterModal = props.closePrinterModal;
  const handleDeleteLabel = props.handleDeleteLabel;
  const closeKitchenModal = props.closeKitchenModal;
  const handleSaveKitchen = props.handleSaveKitchen;
  const discountTargetId = props.discountTargetId;
  const showKitchenModal = props.showKitchenModal;
  const kitchenModalName = props.kitchenModalName;
  const setKitchenModalName = props.setKitchenModalName;
  const savingPriceGroup = props.savingPriceGroup;
  const showProductModal = props.showProductModal;
  const productSaveError = props.productSaveError;
  const purchaseSupplier = props.purchaseSupplier;
  const productInWebshop = props.productInWebshop;
  const setTablesDragRef = props.setTablesDragRef;
  const sysPriceTakeAway = props.sysPriceTakeAway;
  const sysPriceDelivery = props.sysPriceDelivery;
  const showPrinterModal = props.showPrinterModal;
  const editingPrinterId = props.editingPrinterId;
  const labelMarginRight = props.labelMarginRight;
  const subproductGroups = props.subproductGroups;
  const savingSubproduct = props.savingSubproduct;
  const editingGroupName = props.editingGroupName;
  const setEditingGroupName = props.setEditingGroupName;
  const pageManageGroups = props.pageManageGroups;
  const handleDeleteUser = props.handleDeleteUser;
  const showLogoutModal = props.showLogoutModal;
  const discountTrigger = props.discountTrigger;
  const discountEndDate = props.discountEndDate;
  const deleteConfirmId = props.deleteConfirmId;
  const setDeleteConfirmId = props.setDeleteConfirmId;
  const setDeleteConfirmCategoryId = props.setDeleteConfirmCategoryId;
  const setDeleteConfirmProductId = props.setDeleteConfirmProductId;
  const setDeleteConfirmSubproductId = props.setDeleteConfirmSubproductId;
  const setDeleteConfirmGroupId = props.setDeleteConfirmGroupId;
  const setDeleteConfirmTableLocationId = props.setDeleteConfirmTableLocationId;
  const setDeleteConfirmProductionMessageId = props.setDeleteConfirmProductionMessageId;
  const setDeleteConfirmPaymentTypeId = props.setDeleteConfirmPaymentTypeId;
  const setDeleteConfirmPrinterId = props.setDeleteConfirmPrinterId;
  const setDeleteConfirmLabelId = props.setDeleteConfirmLabelId;
  const setDeleteConfirmUserId = props.setDeleteConfirmUserId;
  const setDeleteConfirmDiscountId = props.setDeleteConfirmDiscountId;
  const setDeleteConfirmKitchenId = props.setDeleteConfirmKitchenId;
  const productVatEatIn = props.productVatEatIn;
  const productAddition = props.productAddition;
  const productPrinter1 = props.productPrinter1;
  const productPrinter2 = props.productPrinter2;
  const productPrinter3 = props.productPrinter3;
  const extraPricesRows = props.extraPricesRows;
  const paymentTypeName = props.paymentTypeName;
  const setPaymentTypeName = props.setPaymentTypeName;
  const setPaymentTypeActive = props.setPaymentTypeActive;
  const setPaymentTypeIntegration = props.setPaymentTypeIntegration;
  const labelMarginLeft = props.labelMarginLeft;
  const subproductPrice = props.subproductPrice;
  const closeLabelModal = props.closeLabelModal;
  const handleSaveLabel = props.handleSaveLabel;
  const userPrivileges = props.userPrivileges;
  const discountPieces = props.discountPieces;
  const savingDiscount = props.savingDiscount;
  const priceGroupName = props.priceGroupName;
  const setPriceGroupName = props.setPriceGroupName;
  const savingCategory = props.savingCategory;
  const productKeyName = props.productKeyName;
  const productBarcode = props.productBarcode;
  const expirationDate = props.expirationDate;
  const setTablesDraft = props.setTablesDraft;
  const sysBarcodeType = props.sysBarcodeType;
  const showLabelModal = props.showLabelModal;
  const labelMarginTop = props.labelMarginTop;
  const subproductName = props.subproductName;
  const editingGroupId = props.editingGroupId;
  const setEditingGroupId = props.setEditingGroupId;
  const handleAddGroup = props.handleAddGroup;
  const handleAddBoard = props.handleAddBoard;
  const removeSetTable = props.removeSetTable;
  const closeUserModal = props.closeUserModal;
  const handleSaveUser = props.handleSaveUser;
  const showUserModal = props.showUserModal;
  const discountValue = props.discountValue;
  const savingKitchen = props.savingKitchen;
  const priceGroupTax = props.priceGroupTax;
  const setPriceGroupTax = props.setPriceGroupTax;
  const savingProduct = props.savingProduct;
  const productSearch = props.productSearch;
  const websiteRemark = props.websiteRemark;
  const kioskTakeAway = props.kioskTakeAway;
  const kioskSubtitle = props.kioskSubtitle;
  const labelStandard = props.labelStandard;
  const userModalTab = props.userModalTab;
  const discountName = props.discountName;
  const discountType = props.discountType;
  const categoryName = props.categoryName;
  const setCategoryName = props.setCategoryName;
  const setCategoryActiveField = props.setCategoryActiveField;
  const setCategoryInWebshop = props.setCategoryInWebshop;
  const setCategoryDisplayOnCashRegister = props.setCategoryDisplayOnCashRegister;
  const setCategoryNextCourse = props.setCategoryNextCourse;
  const productPrice = props.productPrice;
  const purchaseUnit = props.purchaseUnit;
  const supplierCode = props.supplierCode;
  const websiteOrder = props.websiteOrder;
  const shortWebText = props.shortWebText;
  const kioskMinSubs = props.kioskMinSubs;
  const kioskMaxSubs = props.kioskMaxSubs;
  const paymentTypes = props.paymentTypes;
  const newGroupName = props.newGroupName;
  const setNewGroupName = props.setNewGroupName;
  const priceGroups = props.priceGroups;
  const productName = props.productName;
  const purchaseVat = props.purchaseVat;
  const unitContent = props.unitContent;
  const labelHeight = props.labelHeight;
  const savingLabel = props.savingLabel;
  const subproducts = props.subproducts;
  const savingGroup = props.savingGroup;
  const addSetTable = props.addSetTable;
  const savingUser = props.savingUser;
  const discountOn = props.discountOn;
  const setDiscountOn = props.setDiscountOn;
  const setDiscountTrigger = props.setDiscountTrigger;
  const setDiscountType = props.setDiscountType;
  const setDiscountValue = props.setDiscountValue;
  const setDiscountStartDate = props.setDiscountStartDate;
  const setDiscountEndDate = props.setDiscountEndDate;
  const setDiscountPieces = props.setDiscountPieces;
  const setDiscountCombinable = props.setDiscountCombinable;
  const setDiscountTargetId = props.setDiscountTargetId;
  const setDiscountTargetIds = props.setDiscountTargetIds;
  const setDiscountName = props.setDiscountName;
  const setDiscountActiveField = props.setDiscountActiveField;
  const setDiscountCalendarField = props.setDiscountCalendarField;
  const setProductTab = props.setProductTab;
  const setProductName = props.setProductName;
  const setProductKeyName = props.setProductKeyName;
  const setProductProductionName = props.setProductProductionName;
  const setProductPrice = props.setProductPrice;
  const setProductVatTakeOut = props.setProductVatTakeOut;
  const setProductVatEatIn = props.setProductVatEatIn;
  const setProductCategoryIds = props.setProductCategoryIds;
  const setProductAddition = props.setProductAddition;
  const setProductBarcode = props.setProductBarcode;
  const setProductPrinter1 = props.setProductPrinter1;
  const setProductPrinter2 = props.setProductPrinter2;
  const setProductPrinter3 = props.setProductPrinter3;
  const setProductActiveField = props.setProductActiveField;
  const setProductFieldErrors = props.setProductFieldErrors;
  const setAdvancedOpenPrice = props.setAdvancedOpenPrice;
  const setAdvancedWeegschaal = props.setAdvancedWeegschaal;
  const setAdvancedSubproductRequires = props.setAdvancedSubproductRequires;
  const setAdvancedLeeggoedPrijs = props.setAdvancedLeeggoedPrijs;
  const setAdvancedPagerVerplicht = props.setAdvancedPagerVerplicht;
  const setAdvancedBoldPrint = props.setAdvancedBoldPrint;
  const setAdvancedGroupingReceipt = props.setAdvancedGroupingReceipt;
  const setAdvancedLabelExtraInfo = props.setAdvancedLabelExtraInfo;
  const setAdvancedKassaPhotoPreview = props.setAdvancedKassaPhotoPreview;
  const setAdvancedVoorverpakVervaltype = props.setAdvancedVoorverpakVervaltype;
  const setAdvancedHoudbareDagen = props.setAdvancedHoudbareDagen;
  const setAdvancedBewarenGebruik = props.setAdvancedBewarenGebruik;
  const setExtraPricesRows = props.setExtraPricesRows;
  const setExtraPricesSelectedIndex = props.setExtraPricesSelectedIndex;
  const setPurchaseVat = props.setPurchaseVat;
  const setPurchasePriceExcl = props.setPurchasePriceExcl;
  const setPurchasePriceIncl = props.setPurchasePriceIncl;
  const setProfitPct = props.setProfitPct;
  const setPurchaseUnit = props.setPurchaseUnit;
  const setUnitContent = props.setUnitContent;
  const setStock = props.setStock;
  const setPurchaseSupplier = props.setPurchaseSupplier;
  const setSupplierCode = props.setSupplierCode;
  const setStockNotification = props.setStockNotification;
  const setExpirationDate = props.setExpirationDate;
  const setDeclarationExpiryDays = props.setDeclarationExpiryDays;
  const setNotificationSoldOutPieces = props.setNotificationSoldOutPieces;
  const setProductInWebshop = props.setProductInWebshop;
  const setWebshopOnlineOrderable = props.setWebshopOnlineOrderable;
  const setWebsiteRemark = props.setWebsiteRemark;
  const setWebsiteOrder = props.setWebsiteOrder;
  const setShortWebText = props.setShortWebText;
  const setWebsitePhotoFileName = props.setWebsitePhotoFileName;
  const setKioskInfo = props.setKioskInfo;
  const setKioskTakeAway = props.setKioskTakeAway;
  const setKioskEatIn = props.setKioskEatIn;
  const setKioskSubtitle = props.setKioskSubtitle;
  const setKioskMinSubs = props.setKioskMinSubs;
  const setKioskMaxSubs = props.setKioskMaxSubs;
  const setKioskPictureFileName = props.setKioskPictureFileName;
  const setShowProductSearchKeyboard = props.setShowProductSearchKeyboard;
  const setShowManageGroupsModal = props.setShowManageGroupsModal;
  const setSelectedManageGroupId = props.setSelectedManageGroupId;
  const setShowSetTableTypeModal = props.setShowSetTableTypeModal;
  const setShowSetBoardColorModal = props.setShowSetBoardColorModal;
  const setShowDeviceSettingsModal = props.setShowDeviceSettingsModal;
  const setShowSystemSettingsModal = props.setShowSystemSettingsModal;
  const setShowProductionMessagesModal = props.setShowProductionMessagesModal;
  const setProductionMessagesPage = props.setProductionMessagesPage;
  const setShowLogoutModal = props.setShowLogoutModal;
  const setSystemSettingsTab = props.setSystemSettingsTab;
  const setSysUseStockManagement = props.setSysUseStockManagement;
  const setSysUsePriceGroups = props.setSysUsePriceGroups;
  const setSysLoginWithoutCode = props.setSysLoginWithoutCode;
  const setSysCategorieenPerKassa = props.setSysCategorieenPerKassa;
  const setSysAutoAcceptQROrders = props.setSysAutoAcceptQROrders;
  const setSysQrOrdersAutomatischAfrekenen = props.setSysQrOrdersAutomatischAfrekenen;
  const setSysEnkelQROrdersKeukenscherm = props.setSysEnkelQROrdersKeukenscherm;
  const setSysAspect169Windows = props.setSysAspect169Windows;
  const setSysVatRateVariousProducts = props.setSysVatRateVariousProducts;
  const setSysArrangeProductsManually = props.setSysArrangeProductsManually;
  const setSysLimitOneUserPerTable = props.setSysLimitOneUserPerTable;
  const setSysOneWachtorderPerKlant = props.setSysOneWachtorderPerKlant;
  const setSysCashButtonVisibleMultiplePayment = props.setSysCashButtonVisibleMultiplePayment;
  const setSysUsePlaceSettings = props.setSysUsePlaceSettings;
  const setSysTegoedAutomatischInladen = props.setSysTegoedAutomatischInladen;
  const setSysNieuwstePrijsGebruiken = props.setSysNieuwstePrijsGebruiken;
  const setSysLeeggoedTerugname = props.setSysLeeggoedTerugname;
  const setSysKlantgegevensQRAfdrukken = props.setSysKlantgegevensQRAfdrukken;
  const setSysPriceTakeAway = props.setSysPriceTakeAway;
  const setSysPriceDelivery = props.setSysPriceDelivery;
  const setSysPriceCounterSale = props.setSysPriceCounterSale;
  const setSysPriceTableSale = props.setSysPriceTableSale;
  const setSysSavingsPointsPerEuro = props.setSysSavingsPointsPerEuro;
  const setSysSavingsPointsPerDiscount = props.setSysSavingsPointsPerDiscount;
  const setSysSavingsDiscount = props.setSysSavingsDiscount;
  const setSysTicketVoucherValidity = props.setSysTicketVoucherValidity;
  const setSysTicketScheduledPrintMode = props.setSysTicketScheduledPrintMode;
  const setSysTicketScheduledCustomerSort = props.setSysTicketScheduledCustomerSort;
  const setSysBarcodeType = props.setSysBarcodeType;
  const setDeviceSettingsTab = props.setDeviceSettingsTab;
  const setDeviceUseSubproducts = props.setDeviceUseSubproducts;
  const setDeviceAutoLogoutAfterTransaction = props.setDeviceAutoLogoutAfterTransaction;
  const setDeviceAutoReturnToTablePlan = props.setDeviceAutoReturnToTablePlan;
  const setDeviceDisableCashButtonInPayment = props.setDeviceDisableCashButtonInPayment;
  const setDeviceOpenPriceWithoutPopup = props.setDeviceOpenPriceWithoutPopup;
  const setDeviceOpenCashDrawerAfterOrder = props.setDeviceOpenCashDrawerAfterOrder;
  const setDeviceAutoReturnToCounterSale = props.setDeviceAutoReturnToCounterSale;
  const setDeviceAskSendToKitchen = props.setDeviceAskSendToKitchen;
  const setDeviceCounterSaleVat = props.setDeviceCounterSaleVat;
  const setDeviceTableSaleVat = props.setDeviceTableSaleVat;
  const setDeviceTimeoutLogout = props.setDeviceTimeoutLogout;
  const setDeviceFixedBorder = props.setDeviceFixedBorder;
  const setDeviceAlwaysOnTop = props.setDeviceAlwaysOnTop;
  const setDeviceAskInvoiceOrTicket = props.setDeviceAskInvoiceOrTicket;
  const setDevicePrinterGroupingProducts = props.setDevicePrinterGroupingProducts;
  const setDevicePrinterShowErrorScreen = props.setDevicePrinterShowErrorScreen;
  const setDevicePrinterProductionMessageOnVat = props.setDevicePrinterProductionMessageOnVat;
  const setDevicePrinterNextCourseOrder = props.setDevicePrinterNextCourseOrder;
  const setDevicePrinterStandardMode = props.setDevicePrinterStandardMode;
  const setDevicePrinterQROrderPrinter = props.setDevicePrinterQROrderPrinter;
  const setDevicePrinterReprintWithNextCourse = props.setDevicePrinterReprintWithNextCourse;
  const setDevicePrinterPrintZeroTickets = props.setDevicePrinterPrintZeroTickets;
  const setDevicePrinterGiftVoucherAtMin = props.setDevicePrinterGiftVoucherAtMin;
  const setDeviceCategoryDisplayIds = props.setDeviceCategoryDisplayIds;
  const setDeviceOrdersConfirmOnHold = props.setDeviceOrdersConfirmOnHold;
  const setDeviceOrdersPrintBarcodeAfterCreate = props.setDeviceOrdersPrintBarcodeAfterCreate;
  const setDeviceOrdersCustomerCanBeModified = props.setDeviceOrdersCustomerCanBeModified;
  const setDeviceOrdersBookTableToWaiting = props.setDeviceOrdersBookTableToWaiting;
  const setDeviceOrdersFastCustomerName = props.setDeviceOrdersFastCustomerName;
  const setDeviceScheduledPrinter = props.setDeviceScheduledPrinter;
  const setDeviceScheduledProductionFlow = props.setDeviceScheduledProductionFlow;
  const setDeviceScheduledLoading = props.setDeviceScheduledLoading;
  const setDeviceScheduledMode = props.setDeviceScheduledMode;
  const setDeviceScheduledInvoiceLayout = props.setDeviceScheduledInvoiceLayout;
  const setDeviceScheduledCheckoutAt = props.setDeviceScheduledCheckoutAt;
  const setDeviceScheduledPrintBarcodeLabel = props.setDeviceScheduledPrintBarcodeLabel;
  const setDeviceScheduledDeliveryNoteToTurnover = props.setDeviceScheduledDeliveryNoteToTurnover;
  const setDeviceScheduledPrintProductionReceipt = props.setDeviceScheduledPrintProductionReceipt;
  const setDeviceScheduledPrintCustomerProductionReceipt = props.setDeviceScheduledPrintCustomerProductionReceipt;
  const setDeviceScheduledWebOrderAutoPrint = props.setDeviceScheduledWebOrderAutoPrint;
  const setSelectedOptionButtonPoolItemId = props.setSelectedOptionButtonPoolItemId;
  const setSelectedOptionButtonSlotIndex = props.setSelectedOptionButtonSlotIndex;
  const setSelectedFunctionButtonPoolItemId = props.setSelectedFunctionButtonPoolItemId;
  const setSelectedFunctionButtonSlotIndex = props.setSelectedFunctionButtonSlotIndex;
  const setProductSearch = props.setProductSearch;
  const setProductSubproductsGroupId = props.setProductSubproductsGroupId;
  const setProductSubproductsLeftSelectedIds = props.setProductSubproductsLeftSelectedIds;
  const setProductSubproductsRightSelectedIds = props.setProductSubproductsRightSelectedIds;
  const categories = props.categories;
  const productTab = props.productTab;
  const kioskEatIn = props.kioskEatIn;
  const labelWidth = props.labelWidth;
  const flowerPots = props.flowerPots;
  const discounts = props.discounts;
  const profitPct = props.profitPct;
  const kioskInfo = props.kioskInfo;
  const labelName = props.labelName;
  const showToast = props.showToast;
  const topNavId = props.topNavId;
  const subNavId = props.subNavId;
  const userName = props.userName;
  const products = props.products;
  const printers = props.printers;
  const userPin = props.userPin;
  const boards = props.boards;
  const toast = props.toast;
  const stock = props.stock;
  const tr = props.tr;

  const layoutEditorSelectedTable =
    showSetTablesModal && topNavId === 'tables' && setTablesSelectedTableId != null && Array.isArray(setTablesDraft?.tables)
      ? setTablesDraft.tables.find((t) => String(t.id) === String(setTablesSelectedTableId)) ?? null
      : null;

  const layoutEditorBoards = layoutEditorSelectedTable?.boards ?? [];
  const layoutEditorFlowerPots = layoutEditorSelectedTable?.flowerPots ?? [];

  const layoutEditorSelectedBoardIndex =
    selectedSetBoardIndex != null && selectedSetBoardIndex >= 0 && selectedSetBoardIndex < layoutEditorBoards.length
      ? selectedSetBoardIndex
      : null;
  const layoutEditorSelectedBoard =
    layoutEditorSelectedBoardIndex != null ? layoutEditorBoards[layoutEditorSelectedBoardIndex] : null;

  const layoutEditorSelectedFlowerPotIndex =
    selectedSetFlowerPotIndex != null && selectedSetFlowerPotIndex >= 0 && selectedSetFlowerPotIndex < layoutEditorFlowerPots.length
      ? selectedSetFlowerPotIndex
      : null;
  const layoutEditorSelectedFlowerPot =
    layoutEditorSelectedFlowerPotIndex != null ? layoutEditorFlowerPots[layoutEditorSelectedFlowerPotIndex] : null;

  return (
    <>
      <DeleteConfirmModal
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => handleDeletePriceGroup(deleteConfirmId)}
        message={tr('control.confirm.deletePriceGroup', 'Are you sure you want to delete this price group?')}
      />
      <DeleteConfirmModal
        open={deleteConfirmCategoryId !== null}
        onClose={() => setDeleteConfirmCategoryId(null)}
        onConfirm={() => handleDeleteCategory(deleteConfirmCategoryId)}
        message={tr('control.confirm.deleteCategory', 'Are you sure you want to delete this category?')}
      />
      <DeleteConfirmModal
        open={deleteConfirmProductId !== null}
        onClose={() => setDeleteConfirmProductId(null)}
        onConfirm={() => handleDeleteProduct(deleteConfirmProductId)}
        message={tr('control.confirm.deleteProduct', 'Are you sure you want to delete this product?')}
      />
      <DeleteConfirmModal
        open={deleteConfirmSubproductId !== null}
        onClose={() => setDeleteConfirmSubproductId(null)}
        onConfirm={() => handleDeleteSubproduct(deleteConfirmSubproductId)}
        message={tr('control.confirm.deleteSubproduct', 'Are you sure you want to delete this subproduct?')}
      />
      <DeleteConfirmModal
        open={deleteConfirmGroupId !== null}
        onClose={() => setDeleteConfirmGroupId(null)}
        onConfirm={() => handleDeleteGroup(deleteConfirmGroupId)}
        message={tr('control.confirm.deleteGroup', 'Are you sure you want to delete this group? Subproducts in it will also be deleted.')}
      />
      <DeleteConfirmModal
        open={deleteConfirmTableLocationId !== null}
        onClose={() => setDeleteConfirmTableLocationId(null)}
        onConfirm={() => handleDeleteTableLocation(deleteConfirmTableLocationId)}
        message={tr('control.confirm.deleteTableLocation', 'Are you sure you want to delete this table location?')}
      />
      <DeleteConfirmModal
        open={deleteConfirmProductionMessageId !== null}
        onClose={() => setDeleteConfirmProductionMessageId(null)}
        onConfirm={() => handleDeleteProductionMessage(deleteConfirmProductionMessageId)}
        message={tr('control.confirm.deleteProductionMessage', 'Are you sure you want to delete this production message?')}
      />
      <DeleteConfirmModal
        open={deleteConfirmPaymentTypeId !== null}
        onClose={() => setDeleteConfirmPaymentTypeId(null)}
        onConfirm={() => handleDeletePaymentType(deleteConfirmPaymentTypeId)}
        message={tr('control.confirm.deletePaymentType', 'Are you sure you want to delete this payment method?')}
      />
      <DeleteConfirmModal
        open={deleteConfirmPrinterId !== null}
        onClose={() => setDeleteConfirmPrinterId(null)}
        onConfirm={() => handleDeletePrinter(deleteConfirmPrinterId)}
        message={tr('control.confirm.deletePrinter', 'Are you sure you want to delete this printer?')}
      />
      <DeleteConfirmModal
        open={deleteConfirmLabelId !== null}
        onClose={() => setDeleteConfirmLabelId(null)}
        onConfirm={() => handleDeleteLabel(deleteConfirmLabelId)}
        message={tr('control.confirm.deleteLabel', 'Are you sure you want to delete this label?')}
      />
      <DeleteConfirmModal
        open={deleteConfirmUserId !== null}
        onClose={() => setDeleteConfirmUserId(null)}
        onConfirm={() => handleDeleteUser(deleteConfirmUserId)}
        message={tr('control.confirm.deleteUser', 'Are you sure you want to delete this user?')}
      />
      <DeleteConfirmModal
        open={deleteConfirmDiscountId !== null}
        onClose={() => setDeleteConfirmDiscountId(null)}
        onConfirm={() => handleDeleteDiscount(deleteConfirmDiscountId)}
        message={tr('control.confirm.deleteDiscount', 'Are you sure you want to delete this discount?')}
      />
      <DeleteConfirmModal
        open={deleteConfirmKitchenId !== null}
        onClose={() => setDeleteConfirmKitchenId(null)}
        onConfirm={() => handleDeleteKitchen(deleteConfirmKitchenId)}
        message={tr('control.confirm.deleteKitchen', 'Are you sure you want to delete this kitchen?')}
      />

      {/* New / Edit user modal — General + Privileges tabs, keyboard like other modals */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative bg-pos-bg rounded-xl border border-pos-border shadow-2xl h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-2 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={closeUserModal} aria-label="Close">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex justify-around mt-[20px] shrink-0">
              <button type="button" className={`px-8 py-4 text-md font-medium border-b-2 transition-colors ${userModalTab === 'general' ? 'border-blue-500 text-blue-500 bg-pos-panel/50' : 'border-transparent text-pos-text active:bg-green-500'}`} onClick={() => setUserModalTab('general')}>{tr('control.userModal.general', 'General')}</button>
              <button type="button" className={`px-8 py-4 text-md font-medium border-b-2 transition-colors ${userModalTab === 'privileges' ? 'border-blue-500 text-blue-500 bg-pos-panel/50' : 'border-transparent text-pos-text active:bg-green-500'}`} onClick={() => setUserModalTab('privileges')}>{tr('control.userModal.privileges', 'Privileges')}</button>
            </div>
            <div className="flex-1 overflow-hidden px-6 py-4">
              {userModalTab === 'general' ? (
                <div className="grid grid-cols-2 mx-auto">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center">
                      <label className="text-pos-text text-sm font-medium shrink-0 min-w-[100px] max-w-[100px]">{tr('control.userModal.name', 'Name')}:</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onFocus={() => setUserModalActiveField('name')}
                        placeholder=""
                        className="px-4 py-3 rounded-lg max-w-[150px] bg-pos-panel border border-pos-border text-pos-text placeholder-pos-muted focus:outline-none focus:border-green-500 text-sm"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="text-pos-text text-sm font-medium shrink-0 min-w-[100px] max-w-[100px]">{tr('control.userModal.pincode', 'Pincode')}:</label>
                      <input
                        type="text"
                        value={userPin}
                        onChange={(e) => setUserPin(e.target.value)}
                        onFocus={() => setUserModalActiveField('pincode')}
                        placeholder=""
                        className="px-4 py-3 rounded-lg max-w-[150px] bg-pos-panel border border-pos-border text-pos-text placeholder-pos-muted focus:outline-none focus:border-green-500 text-sm"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="text-pos-text text-sm font-medium mb-2">{tr('control.userModal.privileges', 'Privileges')}</div>
                    <div className="grid grid-cols-3 gap-4">
                      {USER_PRIVILEGE_AVATAR_COLORS.map((color, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`w-14 h-14 rounded-full border-4 transition-colors ${userAvatarColorIndex === idx ? 'border-gray-400 ring-2 ring-offset-2 ring-offset-pos-bg ring-gray-300' : 'border-transparent active:opacity-90'} active:bg-green-500`}
                          style={{ backgroundColor: color }}
                          onClick={() => setUserAvatarColorIndex(idx)}
                          aria-label={tr('control.userModal.avatarColor', 'Avatar color {n}').replace('{n}', String(idx + 1))}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="">
                  <div className="grid grid-cols-3 gap-x-12 w-full gap-y-5">
                    {USER_PRIVILEGE_OPTIONS.map((p) => (
                      <label key={p.id} className="flex items-center gap-3 cursor-pointer">
                        <span className="text-pos-text min-w-[200px] max-w-[200px]">{tr(`control.userModal.privilege.${p.id}`, p.label)}</span>
                        <input
                          type="checkbox"
                          checked={!!userPrivileges[p.id]}
                          onChange={(e) => setUserPrivileges((prev) => ({ ...prev, [p.id]: e.target.checked }))}
                          className="w-10 h-10 rounded border-pos-border bg-pos-panel text-green-600 focus:ring-green-500"
                        />
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-center mt-20">
                    <button type="button" className="flex items-center gap-4 px-6 py-3 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50 text-md" disabled={savingUser} onClick={handleSaveUser}>
                      <svg fill="currentColor" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                      {tr('control.save', 'Save')}
                    </button>
                  </div>
                </div>
              )}
              {userModalTab === 'general' && (
                <div className="flex justify-center mt-14">
                  <button type="button" className="flex items-center gap-4 px-6 py-3 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50 text-md" disabled={savingUser} onClick={handleSaveUser}>
                    <svg fill="currentColor" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                    {tr('control.save', 'Save')}
                  </button>
                </div>
              )}
            </div>
            <div className="shrink-0 w-full flex justify-center">
              <KeyboardWithNumpad value={userModalKeyboardValue} onChange={userModalKeyboardOnChange} />
            </div>
          </div>
        </div>
      )}

      {/* New / Edit discount modal */}
      {showDiscountModal && (
        (() => {
          const discountTargetOptions = discountOn === 'categories'
            ? categories
              .filter((c) => c && c.id != null)
              .map((c) => ({ value: c.id, label: c.name || `#${c.id}` }))
            : discountProductOptions;
          const discountTargetOptionMap = new Map(discountTargetOptions.map((o) => [String(o.value), o.label]));
          const visibleDiscountTargetOptions = discountTargetOptions.filter((o) => !discountTargetIds.includes(o.value));
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative bg-pos-bg rounded-xl shadow-2xl max-w-[90%] w-full justify-center items-center mx-4 overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="absolute top-4 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={closeDiscountModal} aria-label="Close">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex-1 min-h-0 overflow-auto w-full">
                  <div className="p-6 pb-0 flex text-sm space-y-3 w-full pt-14">
                    <div className='flex flex-col w-2/3 gap-3'>
                      <div className='flex w-full gap-5'>
                        <div className="flex items-center">
                          <label className="block font-medium min-w-[100px] text-gray-200">{tr('name', 'Name')} : </label>
                          <input
                            type="text"
                            value={discountName}
                            onChange={(e) => setDiscountName(e.target.value)}
                            onFocus={() => setDiscountActiveField('name')}
                            onClick={() => setDiscountActiveField('name')}
                            placeholder={tr('control.discounts.modal.discountNamePlaceholder', 'Discount name')}
                            className="px-4 w-[150px] bg-pos-panel h-[40px] py-3 border border-gray-300 rounded-lg text-gray-200 placeholder:text-gray-500"
                          />
                        </div>
                        <div className="flex w-full items-center">
                          <label className="block font-medium text-gray-200 min-w-[100px]">{tr('control.discounts.modal.discountOn', 'Discount on')} : </label>
                          <Dropdown options={DISCOUNT_ON_OPTIONS.map((opt) => ({ ...opt, label: tr(`control.discounts.on.${opt.value}`, opt.label) }))} value={discountOn} onChange={setDiscountOn} placeholder={tr('control.discounts.on.products', 'Products')} className="text-md min-w-[150px]" />
                        </div>
                      </div>
                      <div className="flex w-full items-center flex-wrap">
                        <div className="flex items-center">
                          <label className="block min-w-[100px] font-medium text-gray-200">{tr('control.discounts.modal.trigger', 'Trigger')} : </label>
                          <Dropdown options={DISCOUNT_TRIGGER_OPTIONS.map((opt) => ({ ...opt, label: tr(`control.discounts.trigger.${opt.value}`, opt.label) }))} value={discountTrigger} onChange={setDiscountTrigger} placeholder={tr('control.discounts.trigger.number', 'Number')} className="text-md min-w-[150px]" />
                        </div>
                        <div className="flex gap-5 items-center pl-5">
                          <input
                            type="text"
                            value={discountPieces}
                            onChange={(e) => setDiscountPieces(e.target.value)}
                            onFocus={() => setDiscountActiveField('pieces')}
                            onClick={() => setDiscountActiveField('pieces')}
                            placeholder=""
                            className="px-4 w-[70px] bg-pos-panel h-[40px] py-3 border border-gray-300 rounded-lg text-gray-200"
                          />
                          <label className="block font-medium text-gray-200">{tr('control.discounts.modal.pieces', 'Piece(s)')}</label>
                        </div>
                        <div className="flex items-center gap-3 pl-5">
                          <div className="flex items-center justify-start">
                            <input type="checkbox" checked={discountCombinable} onChange={(e) => setDiscountCombinable(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                          </div>
                          <label className="block items-center font-medium text-gray-200">{tr('control.discounts.modal.combinable', 'Combinable')}</label>
                        </div>
                      </div>
                      <div className="flex w-full items-center flex-wrap">
                        <div className="flex items-center">
                          <label className="block min-w-[100px] font-medium text-gray-200">{tr('control.optionButton.discount', 'Discount')} : </label>
                          <Dropdown options={DISCOUNT_TYPE_OPTIONS.map((opt) => ({ ...opt, label: tr(`control.discounts.type.${opt.value}`, opt.label) }))} value={discountType} onChange={setDiscountType} placeholder={tr('control.discounts.type.amount', 'Amount')} className="text-md min-w-[150px]" />
                        </div>
                        <div className="flex items-center pl-5 gap-5">
                          <input
                            type="text"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            onFocus={() => setDiscountActiveField('value')}
                            onClick={() => setDiscountActiveField('value')}
                            placeholder="0"
                            className="flex-1 px-4 max-w-[70px] h-[40px] py-3 border border-gray-300 rounded-lg bg-pos-panel text-gray-200"
                          />
                          <span className="text-md text-gray-200 shrink-0">{tr('control.discounts.modal.currency', 'euro')}</span>
                        </div>
                      </div>
                      <div className="flex w-full items-center">
                        <label className="block min-w-[100px] font-medium text-gray-200">{tr('control.discounts.modal.startDate', 'Starting date')} : </label>
                        <div className="flex items-center gap-5 w-[150px]">
                          <input
                            type="text"
                            readOnly
                            value={formatDateForCurrentLanguage(discountStartDate)}
                            placeholder={tr('control.discounts.modal.datePlaceholder', 'MM/DD/YYYY')}
                            className="flex-1 px-4 h-[40px] w-[150px] py-3 border border-gray-300 rounded-lg bg-pos-panel text-gray-200 cursor-pointer focus:border-green-500 focus:outline-none"
                            onClick={() => setDiscountCalendarField('start')}
                          />
                          <button type="button" className="p-2 rounded-lg bg-pos-panel border border-gray-300 text-gray-200 active:bg-green-500 shrink-0" onClick={() => setDiscountCalendarField('start')} aria-label={tr('control.discounts.modal.openCalendar', 'Open calendar')}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex w-full items-center">
                        <label className="block min-w-[100px] font-medium text-gray-200 mb-2">{tr('control.discounts.modal.endDate', 'End date')} : </label>
                        <div className="flex items-center gap-5 w-[150px]">
                          <input
                            type="text"
                            readOnly
                            value={formatDateForCurrentLanguage(discountEndDate)}
                            placeholder={tr('control.discounts.modal.datePlaceholder', 'MM/DD/YYYY')}
                            className="flex-1 px-4 h-[40px] py-3 w-[150px] border border-gray-300 rounded-lg bg-pos-panel text-gray-200 cursor-pointer focus:border-green-500 focus:outline-none"
                            onClick={() => setDiscountCalendarField('end')}
                          />
                          <button type="button" className="p-2 rounded-lg bg-pos-panel border border-gray-300 text-gray-200 active:bg-green-500 shrink-0" onClick={() => setDiscountCalendarField('end')} aria-label={tr('control.discounts.modal.openCalendar', 'Open calendar')}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col w-1/3 max-w-md items-center gap-3">
                      <Dropdown
                        options={visibleDiscountTargetOptions}
                        value={discountTargetId}
                        onChange={(v) => {
                          if (!v) return;
                          setDiscountTargetIds((prev) => (prev.includes(v) ? prev : [...prev, v]));
                          setDiscountTargetId('');
                        }}
                        placeholder={discountOn === 'categories' ? tr('control.discounts.on.categories', 'Categories') : tr('control.discounts.on.products', 'Products')}
                        className="text-md min-w-[150px] w-full"
                      />
                      <div
                        ref={discountTargetListRef}
                        className="w-full min-h-[220px] max-h-[220px] rounded-lg border border-gray-300 bg-pos-panel/30 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                        onScroll={updateDiscountTargetScrollState}
                      >
                        <ul className="p-2">
                          {discountTargetIds.map((id) => (
                            <li key={id} className="text-md py-1.5 px-2 flex items-center justify-between gap-2 text-gray-200 active:bg-green-500 rounded">
                              <span className="truncate">{discountTargetOptionMap.get(String(id)) || String(id)}</span>
                              <button
                                type="button"
                                className="p-1 rounded active:bg-green-500"
                                onClick={() => setDiscountTargetIds((prev) => prev.filter((x) => x !== id))}
                                aria-label="Remove"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex w-full justify-around gap-2 items-center pt-2">
                        <button
                          type="button"
                          className="p-2 rounded-lg text-pos-muted active:text-pos-text active:bg-green-500 border border-gray-300 disabled:opacity-40 disabled:pointer-events-none"
                          aria-label="Scroll up"
                          disabled={!canDiscountTargetScrollUp}
                          onClick={() => scrollDiscountTargetByPage('up')}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <button
                          type="button"
                          className="p-2 rounded-lg text-pos-muted active:text-pos-text active:bg-green-500 border border-gray-300 disabled:opacity-40 disabled:pointer-events-none"
                          aria-label="Scroll down"
                          disabled={!canDiscountTargetScrollDown}
                          onClick={() => scrollDiscountTargetByPage('down')}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center pb-5 shrink-0">
                  <button
                    type="button"
                    className="flex items-center text-md gap-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50"
                    disabled={savingDiscount}
                    onClick={handleSaveDiscount}
                  >
                    <svg fill="#ffffff" width="14px" height="14px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                    {tr('control.save', 'Save')}
                  </button>
                </div>
                <div className="shrink-0">
                  <KeyboardWithNumpad value={discountKeyboardValue} onChange={discountKeyboardOnChange} />
                </div>
                {discountCalendarField && (
                  <CalendarModal
                    open
                    onClose={() => setDiscountCalendarField(null)}
                    value={discountCalendarField === 'start' ? discountStartDate : discountEndDate}
                    onChange={(date) => {
                      const yyyy = date.getFullYear();
                      const mm = String(date.getMonth() + 1).padStart(2, '0');
                      const dd = String(date.getDate()).padStart(2, '0');
                      const iso = `${yyyy}-${mm}-${dd}`;
                      if (discountCalendarField === 'start') setDiscountStartDate(iso);
                      else setDiscountEndDate(iso);
                    }}
                  />
                )}
              </div>
            </div>
          );
        })()
      )}

      {/* New / Edit table location modal */}
      {showTableLocationModal && topNavId === 'tables' && (
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
      )}

      {showSetTablesModal && topNavId === 'tables' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative bg-pos-bg rounded-xl border border-pos-border shadow-2xl w-full overflow-hidden flex flex-col">
            <button
              type="button"
              className="absolute top-4 right-4 z-20 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500"
              onClick={closeSetTablesModal}
              aria-label="Close"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <div className="shrink-0 border-r border-pos-border bg-black px-3 py-3 text-sm">
                <div className="flex gap-2">
                  <h3 className="text-pos-text text-lg font-semibold">
                    {tr('control.tables.setTables', 'Set tables')} - {setTablesLocationName || 'Restaurant'}
                  </h3>
                  <button type="button" className="px-3 py-2 rounded border border-pos-border bg-pos-panel active:bg-green-500 text-sm" onClick={addSetTable}>
                    + {tr('control.tables.table', 'table')}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-rose-500 text-white text-sm font-medium active:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={props.handleDeleteSetTablesSelection ?? (() => {})}
                    disabled={!setTablesSelectedTableId}
                  >
                    {tr('control.tables.delete', 'Delete')}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-yellow-500 text-black text-sm font-medium active:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={props.handleClearSetTablesLayout ?? (() => {})}
                    disabled={!setTablesDraft?.tables?.length}
                  >
                    {tr('control.tables.clear', 'Clear')}
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 rounded border border-pos-border bg-pos-panel active:bg-green-500 text-sm"
                    onClick={handleAddBoard}
                    disabled={!setTablesSelectedTableId}
                  >
                    + {tr('control.tables.board', 'board')}
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 rounded border border-pos-border bg-pos-panel active:bg-green-500 text-sm"
                    onClick={handleAddFlowerPot}
                    disabled={!setTablesSelectedTableId}
                  >
                    + flower pot
                  </button>
                  <button
                    type="button"
                    className="px-5 py-2 rounded-lg bg-green-600 text-white active:bg-green-500 text-sm"
                    onClick={saveSetTablesLayout}
                  >
                    {tr('control.save', 'Save')}
                  </button>
                  <button
                    type="button"
                    className="px-5 py-2 rounded-lg bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 text-sm"
                    onClick={closeSetTablesModal}
                  >
                    {tr('cancel', 'Cancel')}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 p-1 min-w-0 bg-[#1f2b36] flex justify-center items-center">
              <div ref={setTablesCanvasRef} className="min-w-[980px] max-w-[980px] min-h-[580px] max-h-[580px] rounded-lg border border-pos-border bg-[#2f3e50] relative overflow-auto">
                <div
                  style={{
                    transform: `scale(${setTablesCanvasZoom / 100})`,
                    transformOrigin: '0 0',
                    width: `${setTablesDraft.floorWidth ?? 979}px`,
                    height: `${setTablesDraft.floorHeight ?? 614}px`,
                    minWidth: `${setTablesDraft.floorWidth ?? 979}px`,
                    minHeight: `${setTablesDraft.floorHeight ?? 614}px`
                  }}
                  className="relative"
                >
                  {setTablesDraft.tables.map((table) => {
                    const template = TABLE_TEMPLATE_OPTIONS.find((item) => item.id === table.templateType) || null;
                    const sizeStyle = table.round
                      ? { width: `${Math.max(70, table.width)}px`, height: `${Math.max(70, table.width)}px` }
                      : { width: `${table.width}px`, height: `${table.height}px` };
                    const tableIdStr = String(table.id);
                    return (
                      <div
                        key={table.id}
                        role="button"
                        tabIndex={0}
                        className={`absolute flex items-center justify-center font-semibold border-2 text-white transition-colors overflow-hidden touch-none select-none ${table.round
                          ? 'rounded-full border-transparent bg-transparent'
                          : 'rounded-md border-transparent bg-transparent'
                          } ${String(setTablesSelectedTableId) === tableIdStr && selectedSetBoardIndex == null && selectedSetFlowerPotIndex == null ? 'ring-4 ring-yellow-400' : ''} ${String(setTablesDraggingId) === tableIdStr ? 'cursor-grabbing' : 'cursor-grab'} active:bg-green-500`}
                        style={{
                          left: `${Math.max(0, layoutEditorReadTableX(table))}px`,
                          top: `${Math.max(0, layoutEditorReadTableY(table))}px`,
                          transform: `rotate(${table.rotation || 0}deg)`,
                          zIndex: 20,
                          ...sizeStyle
                        }}
                        onClick={() => {
                          setSetTablesSelectedTableId(table.id);
                          setSetTablesSelectedBoardIndex(null);
                          setSetTablesSelectedFlowerPotIndex(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSetTablesSelectedTableId(table.id);
                            setSetTablesSelectedBoardIndex(null);
                            setSetTablesSelectedFlowerPotIndex(null);
                          }
                        }}
                        onPointerDown={(event) => {
                          if (event.button !== 0 && event.pointerType === 'mouse') return;
                          startSetTableDrag(event, table);
                        }}
                        onMouseDown={(event) => {
                          if (typeof globalThis.PointerEvent !== 'undefined') return;
                          if (event.button !== 0) return;
                          event.preventDefault();
                          startSetTableDrag(event, table);
                        }}
                      >
                        {template ? (
                          <img src={publicAssetUrl(template.src)} alt={table.name} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                        ) : null}
                        <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)] pointer-events-none">{table.name}</span>
                      </div>
                    );
                  })}
                  {setTablesDraft.tables.flatMap((table) =>
                    (Array.isArray(table.boards) ? table.boards : []).map((board, idx) => {
                      const isSelected = String(setTablesSelectedTableId) === String(table.id) && selectedSetBoardIndex === idx;
                      const isDraggingBoard = String(setTablesDraggingId) === String(table.id) && setTablesDraggingType === 'board' && setTablesDragRef.current?.boardIndex === idx;
                      return (
                        <div
                          key={board.id || `board-${table.id}-${idx}`}
                          role="button"
                          tabIndex={0}
                          className={`absolute border-2 touch-none select-none ${isSelected ? 'border-yellow-300' : 'border-transparent'} ${isDraggingBoard ? 'cursor-grabbing' : 'cursor-grab'} active:bg-green-500`}
                          style={{
                            left: `${Math.max(0, Number(board.x) || 0)}px`,
                            top: `${Math.max(0, Number(board.y) || 0)}px`,
                            width: `${Math.max(10, Number(board.width) || 10)}px`,
                            height: `${Math.max(10, Number(board.height) || 10)}px`,
                            transform: `rotate(${Number(board.rotation) || 0}deg)`,
                            zIndex: 10,
                            backgroundColor: board.color || '#facc15',
                            opacity: 0.55
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSetTablesSelectedTableId(table.id);
                            setSetTablesSelectedBoardIndex(idx);
                            setSetTablesSelectedFlowerPotIndex(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSetTablesSelectedTableId(table.id);
                              setSetTablesSelectedBoardIndex(idx);
                              setSetTablesSelectedFlowerPotIndex(null);
                            }
                          }}
                          onPointerDown={(event) => {
                            if (event.button !== 0 && event.pointerType === 'mouse') return;
                            startSetBoardDrag(event, table, idx);
                          }}
                          onMouseDown={(event) => {
                            if (typeof globalThis.PointerEvent !== 'undefined') return;
                            if (event.button !== 0) return;
                            event.preventDefault();
                            startSetBoardDrag(event, table, idx);
                          }}
                        />
                      );
                    })
                  )}
                  {setTablesDraft.tables.flatMap((table) =>
                    (Array.isArray(table.flowerPots) ? table.flowerPots : []).map((fp, idx) => {
                      const isSelected = String(setTablesSelectedTableId) === String(table.id) && selectedSetFlowerPotIndex === idx;
                      const isDragging = String(setTablesDraggingId) === String(table.id) && setTablesDraggingType === 'flowerPot' && setTablesDragRef.current?.flowerPotIndex === idx;
                      return (
                        <div
                          key={fp.id || `flowerpot-${table.id}-${idx}`}
                          role="button"
                          tabIndex={0}
                          className={`absolute border-2 touch-none select-none ${isSelected ? 'border-yellow-300' : 'border-transparent'} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} active:bg-green-500`}
                          style={{
                            left: `${Math.max(0, Number(fp.x) || 0)}px`,
                            top: `${Math.max(0, Number(fp.y) || 0)}px`,
                            width: `${Math.max(10, Number(fp.width) || 10)}px`,
                            height: `${Math.max(10, Number(fp.height) || 10)}px`,
                            transform: `rotate(${Number(fp.rotation) || 0}deg)`,
                            zIndex: 30
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSetTablesSelectedTableId(table.id);
                            setSetTablesSelectedBoardIndex(null);
                            setSetTablesSelectedFlowerPotIndex(idx);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSetTablesSelectedTableId(table.id);
                              setSetTablesSelectedBoardIndex(null);
                              setSetTablesSelectedFlowerPotIndex(idx);
                            }
                          }}
                          onPointerDown={(event) => {
                            if (event.button !== 0 && event.pointerType === 'mouse') return;
                            startSetFlowerPotDrag(event, table, idx);
                          }}
                          onMouseDown={(event) => {
                            if (typeof globalThis.PointerEvent !== 'undefined') return;
                            if (event.button !== 0) return;
                            event.preventDefault();
                            startSetFlowerPotDrag(event, table, idx);
                          }}
                        >
                          <img src={publicAssetUrl('/flowerpot.svg')} alt="Flower pot" className="w-full h-full object-contain pointer-events-none" />
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg border border-pos-border bg-pos-panel p-1 shadow-lg">
                  <button
                    type="button"
                    className="w-9 h-9 rounded-md border border-pos-border bg-pos-bg active:bg-green-500 text-pos-text text-xl font-bold flex items-center justify-center"
                    onClick={() => setSetTablesCanvasZoom((z) => Math.max(SET_TABLES_ZOOM_MIN, z - SET_TABLES_ZOOM_STEP))}
                    aria-label="Zoom out"
                  >
                    −
                  </button>
                  <span className="min-w-[3ch] text-center text-sm text-pos-text px-1">{setTablesCanvasZoom}%</span>
                  <button
                    type="button"
                    className="w-9 h-9 rounded-md border border-pos-border bg-pos-bg active:bg-green-500 text-pos-text text-xl font-bold flex items-center justify-center"
                    onClick={() => setSetTablesCanvasZoom((z) => Math.min(SET_TABLES_ZOOM_MAX, z + SET_TABLES_ZOOM_STEP))}
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className='px-5 py-2'>
              <div className="flex flex-col gap-2 w-full items-center">
                {!layoutEditorSelectedBoard && !layoutEditorSelectedFlowerPot ? (
                  <div className="flex gap-5">
                    <div className="flex items-center h-[40px]">
                      <span className="shrink-0">{tr('name', 'Name')} :&nbsp;</span>
                      <input
                        type="text"
                        value={layoutEditorSelectedTable?.name || ''}
                        onChange={(e) => updateSelectedSetTable({ name: e.target.value })}
                        className="min-w-[100px] max-w-[100px] px-1 py-2 rounded bg-pos-panel border border-pos-border text-pos-text"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'x', label: 'x' },
                        { key: 'y', label: 'y' },
                        { key: 'width', label: tr('control.tables.width', 'Width') },
                        ...(!layoutEditorSelectedTable?.round ? [{ key: 'height', label: tr('control.tables.height', 'Height') }] : [])
                      ].map((field) => (
                        <div key={field.key} className="flex items-center gap-2 mr-5">
                          <span className="min-w-[70px] max-w-[70px] shrink-0">{field.label}</span>
                          <input
                            type="number"
                            value={safeNumberInputValue(
                              field.key === 'x'
                                ? layoutEditorReadTableX(layoutEditorSelectedTable)
                                : field.key === 'y'
                                  ? layoutEditorReadTableY(layoutEditorSelectedTable)
                                  : layoutEditorSelectedTable?.[field.key],
                              0
                            )}
                            onChange={(e) => {
                              const nextVal = Number(e.target.value);
                              const safe = Number.isFinite(nextVal) ? nextVal : 0;
                              if (field.key === 'width') updateSelectedSetTable({ width: Math.max(60, safe) });
                              else if (field.key === 'height') updateSelectedSetTable({ height: Math.max(40, safe) });
                              else updateSelectedSetTable({ [field.key]: safe });
                            }}
                            className="min-w-[70px] max-w-[70px] px-2 py-2 rounded bg-pos-panel border border-pos-border text-pos-text"
                          />
                          <button
                            type="button"
                            className="w-8 h-10 rounded text-xl bg-pos-panel border border-pos-border active:bg-green-500"
                            onClick={() => {
                              const current =
                                field.key === 'x'
                                  ? layoutEditorReadTableX(layoutEditorSelectedTable)
                                  : field.key === 'y'
                                    ? layoutEditorReadTableY(layoutEditorSelectedTable)
                                    : Number(layoutEditorSelectedTable?.[field.key]) || 0;
                              const nextVal = current - 10;
                              if (field.key === 'width') updateSelectedSetTable({ width: Math.max(60, nextVal) });
                              else if (field.key === 'height') updateSelectedSetTable({ height: Math.max(40, nextVal) });
                              else updateSelectedSetTable({ [field.key]: nextVal });
                            }}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            className="w-8 h-10 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                            onClick={() => {
                              const current =
                                field.key === 'x'
                                  ? layoutEditorReadTableX(layoutEditorSelectedTable)
                                  : field.key === 'y'
                                    ? layoutEditorReadTableY(layoutEditorSelectedTable)
                                    : Number(layoutEditorSelectedTable?.[field.key]) || 0;
                              const nextVal = current + 10;
                              if (field.key === 'width') updateSelectedSetTable({ width: Math.max(60, nextVal) });
                              else if (field.key === 'height') updateSelectedSetTable({ height: Math.max(40, nextVal) });
                              else updateSelectedSetTable({ [field.key]: nextVal });
                            }}
                          >
                            +
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 -ml-5">
                      <div className="flex items-center gap-3 w-full justify-between">
                        <span className="min-w-[70px] max-w-[70px] shrink-0">{tr('control.tables.rotation', 'Rotation')}</span>
                        <input
                          type="range"
                          min={0}
                          max={360}
                          value={safeNumberInputValue(layoutEditorSelectedTable?.rotation, 0)}
                          onChange={(e) => updateSelectedSetTable({ rotation: Number(e.target.value) || 0 })}
                          className="flex-1 max-w-[85px]"
                        />
                        <input
                          type="number"
                          min={0}
                          max={360}
                          value={safeNumberInputValue(layoutEditorSelectedTable?.rotation, 0)}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            const clamped = Number.isFinite(v) ? Math.min(360, Math.max(0, v)) : 0;
                            updateSelectedSetTable({ rotation: clamped });
                          }}
                          className="min-w-[40px] max-w-[80px] px-2 py-2 rounded bg-pos-panel border border-pos-border text-pos-text text-left"
                        />
                      </div>

                      <label className="flex items-center gap-3">
                        <span className="min-w-[70px] max-w-[70px] shrink-0">{tr('control.tables.round', 'Round')}</span>
                        <input
                          type="checkbox"
                          checked={!!layoutEditorSelectedTable?.round}
                          onChange={(e) => updateSelectedSetTable({ round: e.target.checked })}
                          className="w-7 h-7"
                        />
                      </label>
                    </div>

                  </div>
                ) : null}

                {layoutEditorSelectedBoard ? (
                  <div className="flex">
                    <div className='grid grid-cols-2 gap-2'>
                      {[
                        { key: 'x', label: 'board x' },
                        { key: 'y', label: 'board y' },
                        { key: 'width', label: tr('control.tables.width', 'Width') },
                        { key: 'height', label: tr('control.tables.height', 'Height') }
                      ].map((field) => (
                        <div key={`board-${field.key}`} className="flex items-center gap-2 mr-5">
                          <span className="min-w-[70px] max-w-[70px] shrink-0">{field.label}</span>
                          <input
                            type="number"
                            value={safeNumberInputValue(layoutEditorSelectedBoard[field.key], 0)}
                            onChange={(e) => {
                              const nextVal = Number(e.target.value);
                              const safe = Number.isFinite(nextVal) ? nextVal : 0;
                              if (field.key === 'width') updateSelectedSetBoard({ width: Math.max(10, safe) });
                              else if (field.key === 'height') updateSelectedSetBoard({ height: Math.max(10, safe) });
                              else updateSelectedSetBoard({ [field.key]: safe });
                            }}
                            className="min-w-[70px] max-w-[70px] px-3 py-2 rounded bg-pos-panel border border-pos-border text-pos-text"
                          />
                          <button
                            type="button"
                            className="w-10 h-10 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                            onClick={() => {
                              const current = Number(layoutEditorSelectedBoard[field.key]) || 0;
                              const nextVal = current - 10;
                              if (field.key === 'width') updateSelectedSetBoard({ width: Math.max(10, nextVal) });
                              else if (field.key === 'height') updateSelectedSetBoard({ height: Math.max(10, nextVal) });
                              else updateSelectedSetBoard({ [field.key]: nextVal });
                            }}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            className="w-10 h-10 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                            onClick={() => {
                              const current = Number(layoutEditorSelectedBoard[field.key]) || 0;
                              const nextVal = current + 10;
                              if (field.key === 'width') updateSelectedSetBoard({ width: Math.max(10, nextVal) });
                              else if (field.key === 'height') updateSelectedSetBoard({ height: Math.max(10, nextVal) });
                              else updateSelectedSetBoard({ [field.key]: nextVal });
                            }}
                          >
                            +
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center h-[40px]">
                      <span className="min-w-[70px] max-w-[70px] shrink-0">{tr('control.tables.rotation', 'Rotation')}</span>
                      <input
                        type="range"
                        min={0}
                        max={360}
                        value={safeNumberInputValue(layoutEditorSelectedBoard.rotation, 0)}
                        onChange={(e) => updateSelectedSetBoard({ rotation: Number(e.target.value) || 0 })}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        min={0}
                        max={360}
                        value={safeNumberInputValue(layoutEditorSelectedBoard.rotation, 0)}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          const clamped = Number.isFinite(v) ? Math.min(360, Math.max(0, v)) : 0;
                          updateSelectedSetBoard({ rotation: clamped });
                        }}
                        className="min-w-[40px] max-w-[80px] px-2 py-2 rounded bg-pos-panel border border-pos-border text-pos-text text-left"
                      />
                    </div>
                  </div>
                ) : null}

                {layoutEditorSelectedFlowerPot ? (
                  <div className="flex flex-row flex-wrap items-start gap-5 text-pos-text">
                    {/* Vertical: flower pot x, flower pot y */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {[
                        { key: 'x', label: 'flower pot x' },
                        { key: 'y', label: 'flower pot y' }
                      ].map((field) => (
                        <div key={`flowerpot-${field.key}`} className="flex items-center gap-2">
                          <span className="min-w-[100px] max-w-[100px] shrink-0">{field.label}</span>
                          <input
                            type="number"
                            value={safeNumberInputValue(layoutEditorSelectedFlowerPot[field.key], 0)}
                            onChange={(e) => {
                              const nextVal = Number(e.target.value);
                              const safe = Number.isFinite(nextVal) ? nextVal : 0;
                              updateSelectedSetFlowerPot({ [field.key]: safe });
                            }}
                            className="min-w-[70px] max-w-[70px] px-3 py-2 rounded bg-pos-panel border border-pos-border text-pos-text"
                          />
                          <button
                            type="button"
                            className="w-10 h-10 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                            onClick={() => {
                              const current = Number(layoutEditorSelectedFlowerPot[field.key]) || 0;
                              updateSelectedSetFlowerPot({ [field.key]: current - 10 });
                            }}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            className="w-10 h-10 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                            onClick={() => {
                              const current = Number(layoutEditorSelectedFlowerPot[field.key]) || 0;
                              updateSelectedSetFlowerPot({ [field.key]: current + 10 });
                            }}
                          >
                            +
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Vertical: width, height */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {[
                        { key: 'width', label: tr('control.tables.width', 'Width') },
                        { key: 'height', label: tr('control.tables.height', 'Height') }
                      ].map((field) => (
                        <div key={`flowerpot-${field.key}`} className="flex items-center gap-2">
                          <span className="min-w-[100px] max-w-[100px] shrink-0">{field.label}</span>
                          <input
                            type="number"
                            value={safeNumberInputValue(layoutEditorSelectedFlowerPot[field.key], 0)}
                            onChange={(e) => {
                              const nextVal = Number(e.target.value);
                              const safe = Number.isFinite(nextVal) ? nextVal : 0;
                              if (field.key === 'width') updateSelectedSetFlowerPot({ width: Math.max(10, safe) });
                              else updateSelectedSetFlowerPot({ height: Math.max(10, safe) });
                            }}
                            className="min-w-[70px] max-w-[70px] px-3 py-2 rounded bg-pos-panel border border-pos-border text-pos-text"
                          />
                          <button
                            type="button"
                            className="w-10 h-10 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                            onClick={() => {
                              const current = Number(layoutEditorSelectedFlowerPot[field.key]) || 0;
                              const nextVal = current - 10;
                              if (field.key === 'width') updateSelectedSetFlowerPot({ width: Math.max(10, nextVal) });
                              else updateSelectedSetFlowerPot({ height: Math.max(10, nextVal) });
                            }}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            className="w-10 h-10 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                            onClick={() => {
                              const current = Number(layoutEditorSelectedFlowerPot[field.key]) || 0;
                              const nextVal = current + 10;
                              if (field.key === 'width') updateSelectedSetFlowerPot({ width: Math.max(10, nextVal) });
                              else updateSelectedSetFlowerPot({ height: Math.max(10, nextVal) });
                            }}
                          >
                            +
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Rotation */}
                    <div className="flex items-center shrink-0">
                      <span className="min-w-[70px] max-w-[70px] shrink-0">{tr('control.tables.rotation', 'Rotation')}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={360}
                          value={safeNumberInputValue(layoutEditorSelectedFlowerPot.rotation, 0)}
                          onChange={(e) => updateSelectedSetFlowerPot({ rotation: Number(e.target.value) || 0 })}
                          className="w-[100px] max-w-[120px]"
                        />
                        <input
                          type="number"
                          min={0}
                          max={360}
                          value={safeNumberInputValue(layoutEditorSelectedFlowerPot.rotation, 0)}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            const clamped = Number.isFinite(v) ? Math.min(360, Math.max(0, v)) : 0;
                            updateSelectedSetFlowerPot({ rotation: clamped });
                          }}
                          className="min-w-[40px] max-w-[80px] px-2 py-2 rounded bg-pos-panel border border-pos-border text-pos-text text-left"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSetTableTypeModal && showSetTablesModal && topNavId === 'tables' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-pos-bg rounded-xl border border-pos-border shadow-2xl max-w-[900px] w-full p-6 text-sm">
            <div className="grid grid-cols-3 gap-4">
              {TABLE_TEMPLATE_OPTIONS.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className="rounded-xl border border-pos-border bg-pos-panel active:bg-green-500 p-5 flex flex-col items-center gap-4"
                  onClick={() => addSetTableWithTemplate(template.id)}
                >
                  <img src={publicAssetUrl(template.src)} alt={template.id} className="w-[170px] h-[170px] object-contain" />
                </button>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="button"
                className="px-6 py-3 rounded-lg bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 text-sm"
                onClick={() => setShowSetTableTypeModal(false)}
              >
                {tr('cancel', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSetBoardColorModal && showSetTablesModal && topNavId === 'tables' && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-pos-bg rounded-xl border border-pos-border shadow-2xl max-w-[640px] w-full p-6 text-sm">
            <h3 className="text-pos-text text-lg font-semibold text-center mb-6">
              {tr('control.tables.chooseBoardColor', 'Choose board color')}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {TABLE_BOARD_COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="h-16 rounded-lg border-2 border-pos-border active:bg-green-500"
                  style={{ backgroundColor: color }}
                  onClick={() => handleSelectBoardColor(color)}
                  aria-label={`Board color ${color}`}
                />
              ))}
            </div>
            <div className="flex justify-center mt-6 gap-3">
              <button
                type="button"
                className="px-6 py-3 rounded-lg bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 text-sm"
                onClick={() => setShowSetBoardColorModal(false)}
              >
                {tr('cancel', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Device Settings modal */}
      {showDeviceSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative text-sm bg-pos-bg rounded-xl shadow-2xl max-w-[1430px] h-[1000px] w-full mx-4 overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-2 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={() => setShowDeviceSettingsModal(false)} aria-label="Close">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex mt-16 mb-4 px-6 w-full justify-around text-sm shrink-0 overflow-x-auto">
              {DEVICE_SETTINGS_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`px-4 py-2 font-medium whitespace-nowrap border-b-2 transition-colors ${deviceSettingsTab === tab ? 'border-blue-500 text-pos-text' : 'border-transparent text-pos-muted active:text-pos-text'} active:bg-green-500`}
                  onClick={() => {
                    setDeviceSettingsTab(tab);
                    setSelectedOptionButtonPoolItemId(null);
                    setSelectedFunctionButtonPoolItemId(null);
                  }}
                >
                  {tr(DEVICE_SETTINGS_TAB_LABEL_KEYS[tab], tab)}
                </button>
              ))}
            </div>
            <div className="p-4 overflow-auto flex-1">
              {deviceSettingsTab === 'General' && (
                <div className="grid grid-cols-1 text-sm md:grid-cols-2 gap-x-10 gap-y-4">
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[350px] max-w-[350px]">{tr('control.device.general.useSubproducts', 'Use of subproducts:')}</span>
                      <input type="checkbox" checked={deviceUseSubproducts} onChange={(e) => setDeviceUseSubproducts(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[350px] max-w-[350px]">{tr('control.device.general.autoLogoutAfterTransaction', 'Automatically log out after transaction:')}</span>
                      <input type="checkbox" checked={deviceAutoLogoutAfterTransaction} onChange={(e) => setDeviceAutoLogoutAfterTransaction(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[350px] max-w-[350px]">{tr('control.device.general.autoReturnToTablePlan', 'Automatically return to table plan:')}</span>
                      <input type="checkbox" checked={deviceAutoReturnToTablePlan} onChange={(e) => setDeviceAutoReturnToTablePlan(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[350px] max-w-[350px]">{tr('control.device.general.disableCashButton', 'Disable cash button in payment popup:')}</span>
                      <input type="checkbox" checked={deviceDisableCashButtonInPayment} onChange={(e) => setDeviceDisableCashButtonInPayment(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[350px] max-w-[350px]">{tr('control.device.general.openPriceWithoutPopup', 'Open price without popup and without comma:')}</span>
                      <input type="checkbox" checked={deviceOpenPriceWithoutPopup} onChange={(e) => setDeviceOpenPriceWithoutPopup(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.device.general.openCashDrawerAfterOrder', 'Open cash drawer after order:')}</span>
                      <input type="checkbox" checked={deviceOpenCashDrawerAfterOrder} onChange={(e) => setDeviceOpenCashDrawerAfterOrder(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.device.general.autoReturnToCounterSale', 'Automatically return to counter sale:')}</span>
                      <input type="checkbox" checked={deviceAutoReturnToCounterSale} onChange={(e) => setDeviceAutoReturnToCounterSale(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.device.general.askSendToKitchen', 'Ask to send to the kitchen screen:')}</span>
                      <input type="checkbox" checked={deviceAskSendToKitchen} onChange={(e) => setDeviceAskSendToKitchen(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.device.general.counterSaleVat', 'Counter sale VAT:')}</span>
                      <Dropdown options={mapTranslatedOptions(VAT_OPTIONS)} value={deviceCounterSaleVat} onChange={setDeviceCounterSaleVat} placeholder={tr('control.external.select', 'Select')} className="text-sm min-w-[150px]" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.device.general.tableSaleVat', 'Table sale VAT:')}</span>
                      <Dropdown options={mapTranslatedOptions(VAT_OPTIONS)} value={deviceTableSaleVat} onChange={setDeviceTableSaleVat} placeholder={tr('control.external.select', 'Select')} className="text-sm min-w-[150px]" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.device.general.timeoutLogout', 'Timeout log out:')}</span>
                      <div className="flex items-center gap-2">
                        <button type="button" className="p-2 px-3 rounded bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 text-sm font-medium" onClick={() => setDeviceTimeoutLogout((n) => Math.max(0, n - 1))}>−</button>
                        <input type="number" min={0} value={safeNumberInputValue(deviceTimeoutLogout, 0)} onChange={(e) => setDeviceTimeoutLogout(Number(e.target.value) || 0)} className="w-16 px-2 py-2 bg-pos-panel border border-gray-300 rounded text-pos-text text-sm text-center h-[40px]" />
                        <button type="button" className="p-2 px-3 rounded bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 text-sm font-medium" onClick={() => setDeviceTimeoutLogout((n) => n + 1)}>+</button>
                      </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.device.general.fixedBorder', 'Fixed edge: (Windows)')}</span>
                      <input type="checkbox" checked={deviceFixedBorder} onChange={(e) => setDeviceFixedBorder(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.device.general.alwaysOnTop', 'Always in the foreground: (Windows)')}</span>
                      <input type="checkbox" checked={deviceAlwaysOnTop} onChange={(e) => setDeviceAlwaysOnTop(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-3 cursor-pointer shrink-0">
                        <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.device.general.askInvoiceOrTicket', 'Ask a question about an invoice or ticket')}</span>
                        <input type="checkbox" checked={deviceAskInvoiceOrTicket} onChange={(e) => setDeviceAskInvoiceOrTicket(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                      </label>
                      <Dropdown options={[{ value: '-', label: '-' }]} value="-" onChange={() => { }} placeholder="-" className="text-sm min-w-[120px] opacity-60 pointer-events-none" disabled />
                    </div>
                  </div>
                </div>
              )}
              {deviceSettingsTab === 'Printer' && (
                <div className="grid grid-cols-1 text-sm md:grid-cols-2 gap-x-10 gap-y-4">
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.device.printer.groupingProducts', 'Grouping products on the ticket:')}</span>
                      <input type="checkbox" checked={devicePrinterGroupingProducts} onChange={(e) => setDevicePrinterGroupingProducts(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.device.printer.displayErrorScreen', 'Display error screen on printer error:')}</span>
                      <input type="checkbox" checked={devicePrinterShowErrorScreen} onChange={(e) => setDevicePrinterShowErrorScreen(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.device.printer.printProductionOnVat', 'Print production message on VAT ticket:')}</span>
                      <input type="checkbox" checked={devicePrinterProductionMessageOnVat} onChange={(e) => setDevicePrinterProductionMessageOnVat(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.device.printer.nextCourseOrder', 'Next course order:')}</span>
                      <Dropdown options={mapTranslatedOptions(PRINTING_ORDER_OPTIONS)} value={devicePrinterNextCourseOrder} onChange={setDevicePrinterNextCourseOrder} placeholder={tr('control.external.asRegistered', 'As Registered')} className="text-sm min-w-[150px] max-w-[150px]" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.device.printer.standardModeTicket', 'Standard mode ticket printing:')}</span>
                      <Dropdown options={mapTranslatedOptions(GROUPING_RECEIPT_OPTIONS)} value={devicePrinterStandardMode} onChange={setDevicePrinterStandardMode} placeholder={tr('control.external.enable', 'Enable')} className="text-sm min-w-[150px] max-w-[150px]" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.device.printer.qrOrderPrinter', 'QR order printer:')}</span>
                      <Dropdown
                        options={[{ value: '', label: tr('control.external.disabled', 'Disabled') }, ...printers.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((p) => ({ value: p.id, label: p.name }))]}
                        value={devicePrinterQROrderPrinter}
                        onChange={setDevicePrinterQROrderPrinter}
                        placeholder={tr('control.external.selectPrinter', 'Select printer')}
                        className="text-sm min-w-[150px] max-w-[150px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text  min-w-[300px] max-w-[300px]">{tr('control.device.printer.reprintWithNextCourse', 'Reprint products with next course:')}</span>
                      <input type="checkbox" checked={devicePrinterReprintWithNextCourse} onChange={(e) => setDevicePrinterReprintWithNextCourse(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text  min-w-[300px] max-w-[300px]">{tr('control.device.printer.printZeroTickets', 'Print 0 euro tickets:')}</span>
                      <input type="checkbox" checked={devicePrinterPrintZeroTickets} onChange={(e) => setDevicePrinterPrintZeroTickets(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text  min-w-[300px] max-w-[300px]">{tr('control.device.printer.printGiftVoucherAtMin', 'Print gift voucher at minimum amount:')}</span>
                      <input type="checkbox" checked={devicePrinterGiftVoucherAtMin} onChange={(e) => setDevicePrinterGiftVoucherAtMin(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                  </div>
                </div>
              )}
              {deviceSettingsTab === 'Category display' && (
                <div className="grid grid-cols-1 text-sm px-4 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-4">
                  {categoriesLoading ? null : (
                    categories.map((cat) => {
                      const isChecked = deviceCategoryDisplayIds.length === 0 || deviceCategoryDisplayIds.includes(cat.id);
                      return (
                        <label key={cat.id} className="flex items-center gap-5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setDeviceCategoryDisplayIds((prev) => {
                                const allIds = categories.map((c) => c.id);
                                if (prev.length === 0) return allIds.filter((id) => id !== cat.id);
                                if (prev.includes(cat.id)) return prev.filter((id) => id !== cat.id);
                                return [...prev, cat.id];
                              });
                            }}
                            className="w-5 h-5 rounded border-gray-300"
                          />
                          <span className="text-pos-text  min-w-[150px] max-w-[150px] truncate">{cat.name || cat.id}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              )}
              {deviceSettingsTab === 'Orders in waiting' && (
                <div className="grid px-4 grid-cols-1 text-sm md:grid-cols-2 gap-x-10 gap-y-4">
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[300px] max-w-[300px]">{tr('control.device.orders.confirmOnHold', 'Confirm on hold orders:')}</span>
                      <input type="checkbox" checked={deviceOrdersConfirmOnHold} onChange={(e) => setDeviceOrdersConfirmOnHold(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[300px] max-w-[300px]">{tr('control.device.orders.printBarcodeAfterCreate', 'Print barcode ticket after order creation:')}</span>
                      <input type="checkbox" checked={deviceOrdersPrintBarcodeAfterCreate} onChange={(e) => setDeviceOrdersPrintBarcodeAfterCreate(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[330px] max-w-[330px] shrink-0">{tr('control.device.orders.customerCanBeModified', 'Customer on hold order can be modified:')}</span>
                      <input type="checkbox" checked={deviceOrdersCustomerCanBeModified} onChange={(e) => setDeviceOrdersCustomerCanBeModified(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[330px] max-w-[330px]">{tr('control.device.orders.bookTableToWaiting', 'Book table to waiting order:')}</span>
                      <input type="checkbox" checked={deviceOrdersBookTableToWaiting} onChange={(e) => setDeviceOrdersBookTableToWaiting(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[330px] max-w-[330px]">{tr('control.device.orders.fastCustomerName', 'Fast customer name on hold orders:')}</span>
                      <input type="checkbox" checked={deviceOrdersFastCustomerName} onChange={(e) => setDeviceOrdersFastCustomerName(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                  </div>
                </div>
              )}
              {deviceSettingsTab === 'Scheduled orders' && (
                <div className="grid grid-cols-1 text-sm md:grid-cols-2 px-4 gap-x-10 gap-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-5">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.device.scheduled.printer', 'Scheduled orders printer:')}</span>
                      <Dropdown
                        options={[{ value: '', label: tr('control.external.disabled', 'Disabled') }, ...printers.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((p) => ({ value: p.id, label: p.name }))]}
                        value={deviceScheduledPrinter}
                        onChange={setDeviceScheduledPrinter}
                        placeholder={tr('control.external.selectPrinter', 'Select printer')}
                        className="text-sm min-w-[150px] max-w-[150px]"
                      />
                    </div>
                    <div className="flex items-center gap-5">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.device.scheduled.productionFlow', 'Scheduled orders production ticket flow:')}</span>
                      <Dropdown options={mapTranslatedOptions(SCHEDULED_ORDERS_PRODUCTION_FLOW_OPTIONS)} value={deviceScheduledProductionFlow} onChange={setDeviceScheduledProductionFlow} placeholder={tr('control.external.select', 'Select')} className="text-sm min-w-[150px] max-w-[150px]" />
                    </div>
                    <div className="flex items-center gap-5">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.device.scheduled.loading', 'Scheduled orders loading:')}</span>
                      <Dropdown options={mapTranslatedOptions(SCHEDULED_ORDERS_LOADING_OPTIONS)} value={deviceScheduledLoading} onChange={setDeviceScheduledLoading} placeholder={tr('control.external.select', 'Select')} className="text-sm min-w-[150px] max-w-[150px]" />
                    </div>
                    <div className="flex items-center gap-5">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.device.scheduled.mode', 'Scheduled order mode:')}</span>
                      <Dropdown options={mapTranslatedOptions(SCHEDULED_ORDERS_MODE_OPTIONS)} value={deviceScheduledMode} onChange={setDeviceScheduledMode} placeholder={tr('control.external.select', 'Select')} className="text-sm min-w-[150px] max-w-[150px]" />
                    </div>
                    <div className="flex items-center gap-5">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.device.scheduled.invoiceLayout', 'Scheduled order invoice layout:')}</span>
                      <Dropdown options={mapTranslatedOptions(SCHEDULED_ORDERS_INVOICE_LAYOUT_OPTIONS)} value={deviceScheduledInvoiceLayout} onChange={setDeviceScheduledInvoiceLayout} placeholder={tr('control.external.select', 'Select')} className="text-sm min-w-[150px] max-w-[150px]" />
                    </div>
                    <div className="flex items-center gap-5">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.device.scheduled.checkoutAt', 'Scheduled order checkout at:')}</span>
                      <Dropdown options={mapTranslatedOptions(SCHEDULED_ORDERS_CHECKOUT_AT_OPTIONS)} value={deviceScheduledCheckoutAt} onChange={setDeviceScheduledCheckoutAt} placeholder={tr('control.external.select', 'Select')} className="text-sm min-w-[150px] max-w-[150px]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[350px] max-w-[350px] shrink-0">{tr('control.device.scheduled.printLabel', 'Print barcode label:')}</span>
                      <input type="checkbox" checked={deviceScheduledPrintBarcodeLabel} onChange={(e) => setDeviceScheduledPrintBarcodeLabel(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[350px] max-w-[350px]">{tr('control.device.scheduled.deliveryNoteToTurnover', 'Add delivery note to turnover when printing:')}</span>
                      <input type="checkbox" checked={deviceScheduledDeliveryNoteToTurnover} onChange={(e) => setDeviceScheduledDeliveryNoteToTurnover(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[350px] max-w-[350px]">{tr('control.device.scheduled.printProductionReceipt', 'When new planning order print production receipt:')}</span>
                      <input type="checkbox" checked={deviceScheduledPrintProductionReceipt} onChange={(e) => setDeviceScheduledPrintProductionReceipt(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[350px] max-w-[350px]">{tr('control.device.scheduled.printCustomerProductionReceipt', 'When new planning order print customer production receipt:')}</span>
                      <input type="checkbox" checked={deviceScheduledPrintCustomerProductionReceipt} onChange={(e) => setDeviceScheduledPrintCustomerProductionReceipt(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[350px] max-w-[350px]">{tr('control.device.scheduled.webOrderAutoPrint', 'Automatically print scheduled web order production slip:')}</span>
                      <input type="checkbox" checked={deviceScheduledWebOrderAutoPrint} onChange={(e) => setDeviceScheduledWebOrderAutoPrint(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                  </div>
                </div>
              )}
              {deviceSettingsTab === 'Option buttons' && (
                <div className="px-4 py-2">
                  <div className="mx-auto max-w-[1000px] flex gap-8">
                    <div className="flex-1 border border-[#aeb3bf] bg-[#d7d8de] px-3 py-5">
                      <div className="grid grid-cols-7 gap-3">
                        {Array.from({ length: OPTION_BUTTON_SLOT_COUNT }).map((_, slotIndex) => {
                          const assignedId = optionButtonSlots[slotIndex];
                          const assignedLabel = getOptionButtonLabel(assignedId);
                          const isSelected = selectedOptionButtonSlotIndex === slotIndex;
                          return (
                            <button
                              key={`option-slot-${slotIndex}`}
                              type="button"
                              draggable={!!assignedId && assignedId !== OPTION_BUTTON_LOCKED_ID}
                              onDragStart={(event) => handleOptionButtonDragStartFromSlot(event, slotIndex)}
                              onClick={() => handleOptionButtonSlotClick(slotIndex)}
                              onDragOver={(event) => event.preventDefault()}
                              onDrop={(event) => handleOptionButtonDropOnSlot(event, slotIndex)}
                              className={`h-[74px] max-w-[70px] min-w-[70px] border px-2 text-center text-[12px] leading-[1.2] whitespace-pre-line transition-colors ${assignedId ? 'bg-[#b7b9c2] text-[#31353d]' : 'bg-[#dde0e7] text-transparent'
                                } ${isSelected ? 'border-blue-500' : 'border-[#bcc0ca]'} active:brightness-95`}
                            >
                              {assignedLabel || ' '}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-10 text-center">
                        <button
                          type="button"
                          onClick={handleRemoveOptionButtonFromSlot}
                          disabled={!hasSelectedRemovableOptionButton}
                          className={`text-[20px] ${hasSelectedRemovableOptionButton
                            ? 'text-[#858d99] active:text-[#5c6370]'
                            : 'text-[#9ca3af] opacity-60 cursor-not-allowed'
                            } active:bg-green-500`}
                        >
                          {tr('control.optionButtons.removeFromPlace', 'Remove from place')}
                        </button>
                      </div>
                    </div>
                    <div className="w-[380px] border border-[#aeb3bf] bg-[#d7d8de] px-6 py-5 flex flex-col">
                      <div className="flex-1 overflow-auto space-y-4 text-center">
                        {unassignedOptionButtons.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            draggable
                            onDragStart={(event) => handleOptionButtonDragStart(event, item.id)}
                            onClick={() => {
                              setSelectedOptionButtonPoolItemId(item.id);
                              setSelectedOptionButtonSlotIndex(null);
                            }}
                            className={`w-full text-[14px] min-w-[250px] leading-[1.15] whitespace-pre-line text-[#4a505c] active:text-[#2e333c] cursor-grab active:cursor-grabbing ${selectedOptionButtonPoolItemId === item.id ? 'text-rose-500' : ''}`}
                          >
                            {tr(item.labelKey, item.fallbackLabel)}
                          </button>
                        ))}
                        {unassignedOptionButtons.length === 0 ? (
                          <div className="text-[20px] text-[#8a919e]">-</div>
                        ) : null}
                      </div>
                      <div className="pt-4 flex items-center justify-around text-[18px] text-[#596170]">
                        <span aria-hidden>↑</span>
                        <span aria-hidden>↓</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {deviceSettingsTab === 'Function buttons' && (
                <div className="px-8 py-2">
                  <div className="mx-auto rounded-sm bg-[#7f7f84] p-3">
                    <div className="grid grid-cols-4 gap-6">
                      {Array.from({ length: FUNCTION_BUTTON_SLOT_COUNT }).map((_, slotIndex) => {
                        const assignedId = functionButtonSlots[slotIndex];
                        const assignedLabel = getFunctionButtonLabel(assignedId);
                        const isSelected = selectedFunctionButtonSlotIndex === slotIndex;
                        return (
                          <button
                            key={`function-slot-${slotIndex}`}
                            type="button"
                            onClick={() => handleFunctionButtonSlotClick(slotIndex)}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => handleFunctionButtonDropOnSlot(event, slotIndex)}
                            className={`h-[40px] border bg-transparent text-md text-white transition-colors ${isSelected ? 'border-blue-400' : 'border-[#a8a8ad]'
                              } active:bg-green-500`}
                          >
                            {assignedLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mx-auto mt-5 max-w-[1030px] border border-[#9d9da3] bg-transparent py-3">
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleRemoveFunctionButtonFromSlot}
                        disabled={!hasSelectedFunctionButton}
                        className={`text-xl ${hasSelectedFunctionButton
                          ? 'text-[#8e959d] active:text-[#b2b8be]'
                          : 'text-[#646d76] opacity-50 cursor-not-allowed'
                          } active:bg-green-500`}
                      >
                        {tr('control.functionButtons.removeFromPlace', 'Remove from place')}
                      </button>
                    </div>
                    <div className="mt-4 space-y-5 text-center flex flex-col">
                      {FUNCTION_BUTTON_ITEMS.filter((item) => !assignedFunctionButtonIds.has(item.id)).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          draggable
                          onDragStart={(event) => handleFunctionButtonDragStart(event, item.id)}
                          onClick={() => {
                            setSelectedFunctionButtonPoolItemId(item.id);
                            setSelectedFunctionButtonSlotIndex(null);
                          }}
                          className={`text-xl text-gray active:text-[#4b5d68] cursor-grab active:cursor-grabbing ${selectedFunctionButtonPoolItemId === item.id ? 'text-rose-500' : ''}`}
                        >
                          {tr(item.labelKey, item.fallbackLabel)}
                        </button>
                      ))}
                      {FUNCTION_BUTTON_ITEMS.filter((item) => !assignedFunctionButtonIds.has(item.id)).length === 0 ? (
                        <div className="text-xl text-[#54616b]">-</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
              {deviceSettingsTab !== 'General' && deviceSettingsTab !== 'Printer' && deviceSettingsTab !== 'Category display' && deviceSettingsTab !== 'Orders in waiting' && deviceSettingsTab !== 'Scheduled orders' && deviceSettingsTab !== 'Option buttons' && deviceSettingsTab !== 'Function buttons' && (
                <p className="text-pos-muted text-xl py-4">Settings for “{deviceSettingsTab}” will be available here.</p>
              )}
            </div>
            <div className="w-full flex items-center px-4 pt-5 pb-5 justify-center shrink-0">
              <button
                type="button"
                className="flex items-center text-lg gap-4 px-6 py-3 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50"
                disabled={savingDeviceSettings}
                onClick={handleSaveDeviceSettings}
              >
                <svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                {tr('control.save', 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Settings modal */}
      {showSystemSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative px-10 text-xl bg-pos-bg rounded-xl shadow-2xl w-full mx-4 overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-2 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={() => setShowSystemSettingsModal(false)} aria-label="Close">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex mt-10 mb-2 px-10 w-full justify-around text-xl shrink-0 overflow-x-auto">
              {SYSTEM_SETTINGS_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`px-4 pb-2 font-medium whitespace-nowrap border-b-2 transition-colors ${systemSettingsTab === tab ? 'border-blue-500 text-pos-text' : 'border-transparent text-pos-muted active:text-pos-text'} active:bg-green-500`}
                  onClick={() => setSystemSettingsTab(tab)}
                >
                  {tr(SYSTEM_SETTINGS_TAB_LABEL_KEYS[tab], tab)}
                </button>
              ))}
            </div>
            <div className="p-6 overflow-auto flex-1 text-sm">
              {systemSettingsTab === 'General' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.useStockManagement', 'Use of stock management:')}</span>
                      <input type="checkbox" checked={sysUseStockManagement} onChange={(e) => setSysUseStockManagement(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.usePriceGroups', 'Use of price groups:')}</span>
                      <input type="checkbox" checked={sysUsePriceGroups} onChange={(e) => setSysUsePriceGroups(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.loginWithoutCode', 'Log in without code:')}</span>
                      <input type="checkbox" checked={sysLoginWithoutCode} onChange={(e) => setSysLoginWithoutCode(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.categoriesPerRegister', 'Categories per register:')}</span>
                      <input type="checkbox" checked={sysCategorieenPerKassa} onChange={(e) => setSysCategorieenPerKassa(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.autoAcceptQROrders', 'Automatically accept QR orders:')}</span>
                      <input type="checkbox" checked={sysAutoAcceptQROrders} onChange={(e) => setSysAutoAcceptQROrders(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.qrOrdersAutoCheckout', 'QR orders auto checkout:')}</span>
                      <input type="checkbox" checked={sysQrOrdersAutomatischAfrekenen} onChange={(e) => setSysQrOrdersAutomatischAfrekenen(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.sendOnlyQROrdersToKitchen', 'Send only QR orders to kitchen screen:')}</span>
                      <input type="checkbox" checked={sysEnkelQROrdersKeukenscherm} onChange={(e) => setSysEnkelQROrdersKeukenscherm(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.aspect169Windows', '16:9 aspect (Windows):')}</span>
                      <input type="checkbox" checked={sysAspect169Windows} onChange={(e) => setSysAspect169Windows(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.sys.general.vatRateVariousProducts', 'VAT rate of various products:')}</span>
                      <Dropdown options={VAT_PERCENT_OPTIONS.filter((o) => o.value !== '')} value={sysVatRateVariousProducts} onChange={setSysVatRateVariousProducts} placeholder={tr('control.external.select', 'Select')} className="text-am min-w-[150px]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.arrangeProductsManually', 'Arrange products manually:')}</span>
                      <input type="checkbox" checked={sysArrangeProductsManually} onChange={(e) => setSysArrangeProductsManually(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.limitOneUserPerTable', 'Limit one user per table:')}</span>
                      <input type="checkbox" checked={sysLimitOneUserPerTable} onChange={(e) => setSysLimitOneUserPerTable(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.oneWaitingOrderPerCustomer', 'One waiting order per customer:')}</span>
                      <input type="checkbox" checked={sysOneWachtorderPerKlant} onChange={(e) => setSysOneWachtorderPerKlant(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.cashButtonVisibleMultiplePayment', 'Cash button visible with multiple payment options:')}</span>
                      <input type="checkbox" checked={sysCashButtonVisibleMultiplePayment} onChange={(e) => setSysCashButtonVisibleMultiplePayment(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.usePlaceSettings', 'Use of place settings:')}</span>
                      <input type="checkbox" checked={sysUsePlaceSettings} onChange={(e) => setSysUsePlaceSettings(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.autoLoadCredit', 'Auto load credit:')}</span>
                      <input type="checkbox" checked={sysTegoedAutomatischInladen} onChange={(e) => setSysTegoedAutomatischInladen(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.useLatestPrice', 'Use latest price:')}</span>
                      <input type="checkbox" checked={sysNieuwstePrijsGebruiken} onChange={(e) => setSysNieuwstePrijsGebruiken(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.sys.general.depositReturn', 'Deposit return:')}</span>
                      <Dropdown options={mapTranslatedOptions(LEEGGOED_OPTIONS)} value={sysLeeggoedTerugname} onChange={setSysLeeggoedTerugname} placeholder={tr('control.external.select', 'Select')} className="min-w-[150px] max-w-[150px]" />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.general.printCustomerDetailsOnQR', 'Print customer details on QR:')}</span>
                      <input type="checkbox" checked={sysKlantgegevensQRAfdrukken} onChange={(e) => setSysKlantgegevensQRAfdrukken(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                  </div>
                </div>
              )}
              {systemSettingsTab === 'Prices' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  <div className="flex flex-col border border-gray-400 rounded-lg p-6 gap-8">
                    <p className="text-pos-text font-medium text-2xl flex justify-center items-center mb-5">{tr('control.sys.prices.standardPriceGroup', 'Standard price group')}</p>
                    <div className="flex items-center gap-10">
                      <span className="text-pos-text min-w-[150px] max-w-[150px] shrink-0">{tr('control.sys.prices.takeAwayMeals', 'Take-away meals of selected customer:')}</span>
                      <Dropdown
                        options={[{ value: '', label: '—' }, ...(priceGroups || []).sort((a, b) => (a.name || '').localeCompare(b.name || '')).map((pg) => ({ value: pg.id, label: pg.name || pg.id }))]}
                        value={sysPriceTakeAway}
                        onChange={setSysPriceTakeAway}
                        placeholder={tr('control.external.select', 'Select')}
                        className="text-sm min-w-[150px]"
                      />
                    </div>
                    <div className="flex items-center gap-10">
                      <span className="text-pos-text min-w-[150px] max-w-[150px] shrink-0">{tr('control.sys.prices.deliveryOfCustomer', 'Delivery of selected customer:')}</span>
                      <Dropdown
                        options={[{ value: '', label: '—' }, ...(priceGroups || []).sort((a, b) => (a.name || '').localeCompare(b.name || '')).map((pg) => ({ value: pg.id, label: pg.name || pg.id }))]}
                        value={sysPriceDelivery}
                        onChange={setSysPriceDelivery}
                        placeholder={tr('control.external.select', 'Select')}
                        className="text-sm min-w-[150px]"
                      />
                    </div>
                    <div className="flex items-center gap-10">
                      <span className="text-pos-text min-w-[150px] max-w-[150px] shrink-0">{tr('control.sys.prices.counterSale', 'Counter sale:')}</span>
                      <Dropdown
                        options={[{ value: '', label: '—' }, ...(priceGroups || []).sort((a, b) => (a.name || '').localeCompare(b.name || '')).map((pg) => ({ value: pg.id, label: pg.name || pg.id }))]}
                        value={sysPriceCounterSale}
                        onChange={setSysPriceCounterSale}
                        placeholder={tr('control.external.select', 'Select')}
                        className="text-sm min-w-[150px]"
                      />
                    </div>
                    <div className="flex items-center gap-10">
                      <span className="text-pos-text min-w-[150px] max-w-[150px] shrink-0">{tr('control.sys.prices.tableSale', 'Table sale:')}</span>
                      <Dropdown
                        options={[{ value: '', label: '—' }, ...(priceGroups || []).sort((a, b) => (a.name || '').localeCompare(b.name || '')).map((pg) => ({ value: pg.id, label: pg.name || pg.id }))]}
                        value={sysPriceTableSale}
                        onChange={setSysPriceTableSale}
                        placeholder={tr('control.external.select', 'Select')}
                        className="text-sm min-w-[150px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col border border-gray-400 rounded-lg p-6 gap-8">
                    <p className="text-pos-text font-medium text-2xl flex justify-center items-center mb-5">{tr('control.sys.prices.customerSavingsCard', 'Customer savings card settings')}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[150px] max-w-[150px] shrink-0">{tr('control.sys.prices.pointsPerEuro', 'Points / euro:')}</span>
                      <div className="flex items-center gap-2">
                        <button type="button" className="p-1 px-3 rounded bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 text-3xl" onClick={() => setSysSavingsPointsPerEuro((n) => Math.max(0, n - 1))}>−</button>
                        <input type="number" min={0} value={safeNumberInputValue(sysSavingsPointsPerEuro, 0)} onChange={(e) => setSysSavingsPointsPerEuro(Number(e.target.value) || 0)} className="w-20 px-3 py-2 bg-pos-panel border border-pos-border rounded text-pos-text text-xl text-center" />
                        <button type="button" className="p-1 px-3 rounded bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 text-3xl" onClick={() => setSysSavingsPointsPerEuro((n) => n + 1)}>+</button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[150px] max-w-[150px] shrink-0">{tr('control.sys.prices.pointsPerDiscount', 'Points / discount:')}</span>
                      <div className="flex items-center gap-2">
                        <button type="button" className="p-1 px-3 rounded bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 text-3xl" onClick={() => setSysSavingsPointsPerDiscount((n) => Math.max(0, n - 1))}>−</button>
                        <input type="number" min={0} value={safeNumberInputValue(sysSavingsPointsPerDiscount, 0)} onChange={(e) => setSysSavingsPointsPerDiscount(Number(e.target.value) || 0)} className="w-20 px-3 py-2 bg-pos-panel border border-pos-border rounded text-pos-text text-xl text-center" />
                        <button type="button" className="p-1 px-3 rounded bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 text-3xl" onClick={() => setSysSavingsPointsPerDiscount((n) => n + 1)}>+</button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[150px] max-w-[150px] shrink-0">{tr('control.sys.prices.discount', 'Discount:')}</span>
                      <Dropdown options={mapTranslatedOptions(SAVINGS_DISCOUNT_OPTIONS)} value={sysSavingsDiscount} onChange={setSysSavingsDiscount} placeholder={tr('control.external.disabled', 'Disabled')} className="text-sm min-w-[150px]" />
                    </div>
                  </div>
                </div>
              )}
              {systemSettingsTab === 'Ticket' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  <div className="flex flex-col gap-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.ticket.askVatPrinter', 'Ask for VAT ticket printer:')}</span>
                      <input type="checkbox" checked={sysUsePlaceSettings} onChange={(e) => setSysUsePlaceSettings(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.ticket.productionPrinterCascade', 'Production printer cascade:')}</span>
                      <input type="checkbox" checked={sysTegoedAutomatischInladen} onChange={(e) => setSysTegoedAutomatischInladen(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.ticket.displaySubproductsWithoutPrice', 'Display sub-products without price on VAT ticket:')}</span>
                      <input type="checkbox" checked={sysNieuwstePrijsGebruiken} onChange={(e) => setSysNieuwstePrijsGebruiken(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.ticket.pricePerKiloPrints', 'Price per kilo prints:')}</span>
                      <input type="checkbox" checked={sysNieuwstePrijsGebruiken} onChange={(e) => setSysNieuwstePrijsGebruiken(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-pos-text min-w-[270px] max-w-[270px]">{tr('control.sys.ticket.printUnitPrice', 'Print unit price:')}</span>
                      <input type="checkbox" checked={sysKlantgegevensQRAfdrukken} onChange={(e) => setSysKlantgegevensQRAfdrukken(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.sys.ticket.typeBarcodeGenerated', 'Type barcode of generated barcode:')}</span>
                      <Dropdown options={BARCODE_TYPE_OPTIONS} value={sysBarcodeType} onChange={setSysBarcodeType} placeholder="Code39" className="text-sm min-w-[150px]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.sys.ticket.validityPeriodVoucher', 'Validity period voucher:')}</span>
                      <Dropdown options={mapTranslatedOptions(TICKET_VOUCHER_VALIDITY_OPTIONS)} value={sysTicketVoucherValidity} onChange={setSysTicketVoucherValidity} placeholder={tr('control.external.select', 'Select')} className="text-sm min-w-[150px]" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.sys.ticket.scheduledOrdersPrintMode', 'Scheduled orders print mode:')}</span>
                      <Dropdown options={mapTranslatedOptions(TICKET_SCHEDULED_PRINT_MODE_OPTIONS)} value={sysTicketScheduledPrintMode} onChange={setSysTicketScheduledPrintMode} placeholder={tr('control.external.select', 'Select')} className="text-sm min-w-[150px]" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-pos-text min-w-[270px] max-w-[270px] shrink-0">{tr('control.sys.ticket.scheduledOrdersCustomerSort', 'Scheduled orders customer sort:')}</span>
                      <Dropdown options={mapTranslatedOptions(TICKET_SCHEDULED_CUSTOMER_SORT_OPTIONS)} value={sysTicketScheduledCustomerSort} onChange={setSysTicketScheduledCustomerSort} placeholder={tr('control.external.select', 'Select')} className="text-sm min-w-[150px]" />
                    </div>
                  </div>
                </div>
              )}
              {systemSettingsTab !== 'General' && systemSettingsTab !== 'Prices' && systemSettingsTab !== 'Ticket' && (
                <p className="text-pos-muted text-xl py-4">Settings for “{systemSettingsTab}” will be available here.</p>
              )}
            </div>
            <div className="w-full flex items-center px-6 py-8 justify-center shrink-0">
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50 text-xl"
                disabled={savingSystemSettings}
                onClick={handleSaveSystemSettings}
              >
                <svg fill="currentColor" width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                {tr('control.save', 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New / Edit payment type modal */}
      {showPaymentTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative flex flex-col bg-pos-bg justify-between items-center rounded-xl border border-pos-border shadow-2xl max-w-[90%] w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-2 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={closePaymentTypeModal} aria-label="Close">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-6 flex flex-col gap-4 pt-14 text-sm">
              <div className="flex items-center gap-2">
                <label className="text-pos-text font-medium shrink-0 min-w-[130px]">{tr('control.paymentTypes.name', 'Name :')}</label>
                <input
                  type="text"
                  value={paymentTypeName}
                  onChange={(e) => setPaymentTypeName(e.target.value)}
                  placeholder={tr('control.paymentTypes.namePlaceholder', 'e.g. Cash, Bancontact')}
                  className="flex-1 max-w-[200px] px-4 py-3 h-[40px] rounded-lg bg-pos-panel border border-gray-300 text-gray-200 placeholder-pos-muted focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pos-text font-medium shrink-0 min-w-[130px]">{tr('control.paymentTypes.active', 'Active :')}</span>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={paymentTypeActive} onChange={(e) => setPaymentTypeActive(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                </label>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-pos-text font-medium shrink-0 min-w-[130px]">{tr('control.paymentTypes.integration', 'Integration:')}</label>
                <Dropdown
                  options={mapTranslatedOptions(PAYMENT_INTEGRATION_OPTIONS)}
                  value={paymentTypeIntegration}
                  onChange={setPaymentTypeIntegration}
                  placeholder={tr('control.paymentTypes.selectIntegration', 'Select integration')}
                  className="flex-1 min-w-[200px] max-w-[280px] text-md"
                />
              </div>
              <div className="flex justify-center pt-5 pb-5">
                <button
                  type="button"
                  className="flex items-center text-lg gap-4 px-6 py-3 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50"
                  disabled={savingPaymentType || !(paymentTypeName || '').trim()}
                  onClick={handleSavePaymentType}
                >
                  <svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                  {tr('control.save', 'Save')}
                </button>
              </div>
            </div>
            <div className="shrink-0">
              <KeyboardWithNumpad value={paymentTypeName} onChange={setPaymentTypeName} />
            </div>
          </div>
        </div>
      )}

      {toast ? (
        <div className="fixed top-6 right-6 z-[100] pointer-events-none">
          <div
            className={`min-w-[320px] max-w-[520px] px-4 py-3 rounded-lg shadow-xl border text-xl ${toast.type === 'success'
              ? 'bg-emerald-700/90 border-emerald-500 text-emerald-100'
              : 'bg-rose-700/90 border-rose-500 text-rose-100'
              }`}
          >
            {toast.text}
          </div>
        </div>
      ) : null}

      <PrinterModal
        open={showPrinterModal}
        initialPrinter={editingPrinterId ? (printers.find((p) => p.id === editingPrinterId) ?? null) : null}
        onClose={closePrinterModal}
        onSave={handleSavePrinterPayload}
        onNotify={showToast}
      />

      {/* New / Edit label modal */}
      {showLabelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-pos-bg rounded-xl shadow-2xl max-w-[90%] w-full justify-center items-center mx-4 overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-2 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={closeLabelModal} aria-label="Close">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-6 flex w-full pt-14 overflow-auto text-sm">
              <div className='flex flex-col gap-3 w-1/3'>
                <div className="flex gap-2 w-full items-center">
                  <label className="block min-w-[80px] max-w-[80px] font-medium text-gray-200">{tr('name', 'Name')} : </label>
                  <input type="text" value={labelName} onChange={(e) => setLabelName(e.target.value)} placeholder={tr('control.labelModal.placeholder', 'e.g. 5.6cm x 3.5cm')} className="px-4 w-[150px] bg-pos-panel h-[40px] py-3 border border-gray-300 rounded-lg text-gray-200" />
                </div>
                <div className="flex gap-2 w-full items-center">
                  <label className="block min-w-[80px] max-w-[80px] font-medium text-gray-200">{tr('control.labelModal.height', 'Height')} : </label>
                  <input type="text" value={labelHeight} onChange={(e) => setLabelHeight(e.target.value)} className="px-4 w-[150px] bg-pos-panel h-[40px] py-3 border border-gray-300 rounded-lg text-gray-200" />
                </div>
                <div className="flex gap-2 w-full items-center">
                  <label className="block min-w-[80px] max-w-[80px] font-medium text-gray-200">{tr('control.labelModal.width', 'Width')} : </label>
                  <input type="text" value={labelWidth} onChange={(e) => setLabelWidth(e.target.value)} className="px-4 w-[150px] bg-pos-panel h-[40px] py-3 border border-gray-300 rounded-lg text-gray-200" />
                </div>
              </div>
              <div className="flex gap-2 w-1/3 justify-center">
                <div className='flex gap-2 w-full h-[40px] justify-center items-center'>
                  <label className="block min-w-[120px] max-w-[120px] font-medium text-gray-200">{tr('control.labelModal.standard', 'Standard')} : </label>
                  <input type="checkbox" checked={labelStandard} onChange={(e) => setLabelStandard(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                </div>
              </div>
              <div className='flex flex-col gap-3 w-1/4'>
                <div className="flex gap-2 w-full items-center justify-center">
                  <label className="block min-w-[120px] max-w-[120px] font-medium text-gray-200">{tr('control.labelModal.marginLeft', 'Margin left')} : </label>
                  <input type="text" inputMode="numeric" value={labelMarginLeft} onChange={(e) => setLabelMarginLeft(e.target.value)} className="px-4 w-[150px] bg-pos-panel h-[40px] py-3 border border-gray-300 rounded-lg text-gray-200" />
                </div>
                <div className="flex gap-2 w-full items-center justify-center">
                  <label className="block min-w-[120px] max-w-[120px] font-medium text-gray-200 mb-2">{tr('control.labelModal.marginRight', 'Margin right')} : </label>
                  <input type="text" inputMode="numeric" value={labelMarginRight} onChange={(e) => setLabelMarginRight(e.target.value)} className="px-4 w-[150px] bg-pos-panel h-[40px] py-3 border border-gray-300 rounded-lg text-gray-200" />
                </div>
                <div className="flex gap-2 w-full items-center justify-center">
                  <label className="block min-w-[120px] max-w-[120px] font-medium text-gray-200 mb-2">{tr('control.labelModal.marginBottom', 'Margin bottom')} : </label>
                  <input type="text" inputMode="numeric" value={labelMarginBottom} onChange={(e) => setLabelMarginBottom(e.target.value)} className="px-4 w-[150px] bg-pos-panel h-[40px] py-3 border border-gray-300 rounded-lg text-gray-200" />
                </div>
                <div className="flex gap-2 w-full items-center justify-center">
                  <label className="block min-w-[120px] max-w-[120px] font-medium text-gray-200 mb-2">{tr('control.labelModal.marginTop', 'Margin top')} : </label>
                  <input type="text" inputMode="numeric" value={labelMarginTop} onChange={(e) => setLabelMarginTop(e.target.value)} className="px-4 w-[150px] bg-pos-panel h-[40px] py-3 border border-gray-300 rounded-lg text-gray-200" />
                </div>
              </div>
            </div>
            <div className="flex justify-center pt-5 pb-5">
              <button type="button" className="flex items-center text-md gap-4 px-6 py-3 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50" disabled={savingLabel || !(labelName || '').trim()} onClick={handleSaveLabel}>
                <svg fill="#ffffff" width="14px" height="14px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                {tr('control.save', 'Save')}
              </button>
            </div>
            <KeyboardWithNumpad value={labelName} onChange={setLabelName} />
          </div>
        </div>
      )}

      {/* Production messages modal */}
      {showProductionMessagesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-pos-bg rounded-xl shadow-2xl max-w-5xl justify-center items-center w-full mx-4 overflow-hidden flex flex-col h-[700px]" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-2 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={() => { setShowProductionMessagesModal(false); setProductionMessagesPage(0); cancelEditProductionMessage(); }} aria-label="Close">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="w-full flex items-center justify-center mt-[30px] px-6 gap-4 py-4 shrink-0 pr-14">
              <div className="flex gap-2 items-center gap-[100px]">
                <input
                  type="text"
                  value={productionMessageInput}
                  onChange={(e) => setProductionMessageInput(e.target.value)}
                  placeholder="New message"
                  className="px-4 py-2 bg-pos-panel border border-pos-border rounded-lg min-w-[400px] text-pos-text text-sm"
                />
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50 text-sm shrink-0"
                  disabled={savingProductionMessage || !(productionMessageInput || '').trim()}
                  onClick={handleAddOrUpdateProductionMessage}
                >
                  {savingProductionMessage ? tr('control.saving', 'Saving...') : editingProductionMessageId ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
            <div className="flex-1 flex flex-col rounded-xl p-6 py-0 w-full min-h-0 overflow-hidden pb-24 relative">
              {(() => {
                const sorted = [...productionMessages].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
                const scrollProductionMessages = (dir) => {
                  if (productionMessagesListRef.current) {
                    productionMessagesListRef.current.scrollBy({ top: dir * 120, behavior: 'smooth' });
                  }
                };
                return (
                  <>
                    <ul
                      ref={productionMessagesListRef}
                      className="overflow-auto min-h-[300px] mx-10 border border-pos-border rounded-xl relative p-2"
                      onScroll={updateProductionMessagesScrollState}
                    >
                      {sorted.map((m) => (
                        <li key={m.id} className="flex items-center px-4 py-1 border-b border-pos-border last:border-b-0 gap-2">
                          <span className="flex-1 text-pos-text text-sm break-words min-w-0">{m.text || ''}</span>
                          <button type="button" className="p-2 shrink-0 rounded text-pos-text active:bg-green-500" onClick={() => startEditProductionMessage(m)} aria-label="Edit">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button type="button" className="p-2 shrink-0 rounded text-pos-text active:bg-green-500" onClick={() => setDeleteConfirmProductionMessageId(m.id)} aria-label="Delete">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-center gap-10 py-3">
                      <button
                        type="button"
                        className="p-3 rounded-lg bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                        disabled={!canProductionMessagesScrollUp}
                        onClick={() => scrollProductionMessages(-1)}
                        aria-label={tr('scrollUp', 'Scroll up')}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M11 17V5.414l3.293 3.293a.999.999 0 101.414-1.414l-5-5a.999.999 0 00-1.414 0l-5 5a.997.997 0 000 1.414.999.999 0 001.414 0L9 5.414V17a1 1 0 102 0z" fill="currentColor" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-3 rounded-lg bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                        disabled={!canProductionMessagesScrollDown}
                        onClick={() => scrollProductionMessages(1)}
                        aria-label={tr('scrollDown', 'Scroll down')}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M10.707 17.707l5-5a.999.999 0 10-1.414-1.414L11 14.586V3a1 1 0 10-2 0v11.586l-3.293-3.293a.999.999 0 10-1.414 1.414l5 5a.999.999 0 001.414 0z" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="shrink-0">
              <KeyboardWithNumpad value={productionMessageInput} onChange={setProductionMessageInput} />
            </div>
          </div>
        </div>
      )}

      {/* New price group modal */}
      {showPriceGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-pos-bg rounded-xl shadow-2xl max-w-[90%] w-full justify-center items-center mx-4 overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-2 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={closePriceGroupModal} aria-label="Close">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-6 flex flex-col space-y-6 w-full justify-center items-center pt-20">
              <div className='w-full flex flex-col justify-center items-center gap-10'>
                <div className="flex gap-2 w-full items-center justify-center">
                  <label className="block text-md min-w-[100px] font-medium text-gray-200">{tr('name', 'Name')} : </label>
                  <input
                    type="text"
                    value={priceGroupName}
                    onChange={(e) => setPriceGroupName(e.target.value)}
                    placeholder={tr('control.enterName', 'Enter name')}
                    className="px-4 w-[200px] bg-pos-panel h-[40px] py-3 text-md border border-gray-300 rounded-lg text-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>
                <div className="flex gap-2 w-full items-center justify-center">
                  <label className="block text-md pr-[60px] font-medium text-gray-200">{tr('control.vat', 'VAT')} : </label>
                  <Dropdown
                    options={VAT_OPTIONS.map((o) => ({ ...o, label: tr(`vatOption.${o.value}`, o.label) }))}
                    value={priceGroupTax}
                    onChange={setPriceGroupTax}
                    placeholder={tr('control.selectVat', 'Select VAT')}
                    className="text-md min-w-[200px]"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center py-10">
              <button
                type="button"
                className="flex items-center text-md gap-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50"
                disabled={savingPriceGroup}
                onClick={handleSavePriceGroup}
              >
                <svg fill="#ffffff" width="14px" height="14px" viewBox="0 0 16 16" id="save-16px" xmlns="http://www.w3.org/2000/svg">
                  <path id="Path_42" data-name="Path 42" d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" />
                </svg>
                {tr('control.save', 'Save')}
              </button>
            </div>
            <KeyboardWithNumpad value={priceGroupName} onChange={setPriceGroupName} />
          </div>
        </div>
      )}

      {/* New / Edit kitchen modal */}
      {showKitchenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-pos-bg rounded-xl shadow-2xl max-w-[90%] w-full justify-center items-center mx-4 overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-2 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={closeKitchenModal} aria-label="Close">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-6 flex flex-col space-y-6 w-full justify-center items-center pt-20">
              <div className="w-full flex flex-col justify-center items-center gap-10">
                <div className="flex gap-2 w-full items-center justify-center">
                  <label className="block text-md min-w-[100px] font-medium text-gray-200">{tr('name', 'Name')} : </label>
                  <input
                    type="text"
                    value={kitchenModalName}
                    onChange={(e) => setKitchenModalName(e.target.value)}
                    placeholder={tr('control.enterName', 'Enter name')}
                    className="px-4 w-[200px] bg-pos-panel h-[40px] py-3 text-md border border-gray-300 rounded-lg text-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center py-10">
              <button
                type="button"
                className="flex items-center text-md gap-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50"
                disabled={savingKitchen}
                onClick={handleSaveKitchen}
              >
                <svg fill="#ffffff" width="14px" height="14px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" />
                </svg>
                {tr('control.save', 'Save')}
              </button>
            </div>
            <KeyboardWithNumpad value={kitchenModalName} onChange={setKitchenModalName} />
          </div>
        </div>
      )}

      {/* Kitchen — assign products (same pattern as Product → Subproducts modal) */}
      {showKitchenProductsModal && kitchenProductsKitchen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="relative bg-pos-bg rounded-xl min-w-[600px] border border-pos-border shadow-2xl p-6 text-sm max-h-[90vh] overflow-auto [scrollbar-width:none]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-2 right-4 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500"
              onClick={closeKitchenProductsModal}
              aria-label="Close"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-4 mt-6">
              <Dropdown
                options={[
                  { value: '', label: tr('control.kitchen.allCategories', 'All categories') },
                  ...kitchenProductsModalCategories.map((c) => ({ value: c.id, label: c.name }))
                ]}
                value={kitchenProductsCategoryFilter}
                onChange={setKitchenProductsCategoryFilter}
                className="w-full max-w-[200px]"
              />
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch min-h-[280px]">
                <div className="flex flex-col rounded-lg border border-pos-border bg-pos-panel/30 overflow-hidden min-w-0">
                  <div className="px-3 py-2 border-b border-pos-border bg-pos-panel/50 font-medium text-pos-text shrink-0">
                    {tr('control.kitchen.availableProducts', 'Available products')}
                  </div>
                  <label
                    className={`flex items-center gap-2 px-3 py-2 border-b border-pos-border text-pos-text shrink-0 cursor-pointer active:bg-green-500 ${!kitchenProductsAvailable.length ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={
                        kitchenProductsAvailable.length > 0 &&
                        kitchenProductsAvailable.every((p) => kitchenProductsLeftSelectedIds.has(p.id))
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setKitchenProductsLeftSelectedIds(new Set(kitchenProductsAvailable.map((p) => p.id)));
                        } else {
                          setKitchenProductsLeftSelectedIds(new Set());
                        }
                      }}
                      className="rounded"
                    />
                    <span>{tr('control.productSubproducts.selectAll', 'Select all')}</span>
                  </label>
                  <div
                    ref={kitchenProductsLeftListRef}
                    className="flex-1 overflow-y-auto p-2 min-h-[350px] max-h-[350px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {loadingKitchenProductsCatalog ? null : kitchenProductsCatalog.length === 0 ? (
                      <div className="text-pos-muted px-2 py-4">{tr('control.kitchen.productsEmpty', 'No products yet.')}</div>
                    ) : kitchenProductsAvailable.length === 0 ? (
                      <div className="text-pos-muted px-2 py-4">
                        {kitchenProductsCategoryFilter
                          ? tr('control.kitchen.noProductsInCategory', 'No products in this category.')
                          : tr('control.kitchen.allLinkedOrEmpty', 'All matching products are linked.')}
                      </div>
                    ) : (
                      <ul className="space-y-1">
                        {kitchenProductsAvailable.map((p) => (
                          <li key={p.id}>
                            <label className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer active:bg-green-500 text-pos-text">
                              <input
                                type="checkbox"
                                checked={kitchenProductsLeftSelectedIds.has(p.id)}
                                onChange={(e) => {
                                  setKitchenProductsLeftSelectedIds((prev) => {
                                    const next = new Set(prev);
                                    if (e.target.checked) next.add(p.id);
                                    else next.delete(p.id);
                                    return next;
                                  });
                                }}
                                className="rounded"
                              />
                              <span className="truncate">{p.name || p.id}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="px-3 py-2 border-t border-pos-border shrink-0">
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center gap-2 py-2 rounded bg-green-600/80 active:bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAddKitchenProductLinks}
                      disabled={!kitchenProductsLeftSelectedIds.size || loadingKitchenProductsCatalog}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {tr('control.productSubproducts.add', 'Add')}
                    </button>
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center text-pos-muted shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>

                <div className="flex flex-col rounded-lg border border-pos-border bg-pos-panel/30 overflow-hidden min-w-0">
                  <div className="px-3 py-2 border-b border-pos-border bg-pos-panel/50 font-medium text-pos-text shrink-0">
                    {tr('control.kitchen.linkedProducts', 'Linked to kitchen')}
                  </div>
                  <label
                    className={`flex items-center gap-2 px-3 py-2 border-b border-pos-border text-pos-text shrink-0 cursor-pointer active:bg-green-500 ${!kitchenProductsLinked.length ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={
                        kitchenProductsLinked.length > 0 &&
                        kitchenProductsLinked.every((l) => kitchenProductsRightSelectedIds.has(l.productId))
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setKitchenProductsRightSelectedIds(new Set(kitchenProductsLinked.map((l) => l.productId)));
                        } else {
                          setKitchenProductsRightSelectedIds(new Set());
                        }
                      }}
                      className="rounded"
                    />
                    <span>{tr('control.productSubproducts.selectAll', 'Select all')}</span>
                  </label>
                  <div
                    ref={kitchenProductsRightListRef}
                    className="flex-1 overflow-y-auto p-2 min-h-[350px] max-h-[350px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {loadingKitchenProductsCatalog ? null : kitchenProductsLinked.length === 0 ? (
                      <div className="text-pos-muted px-2 py-4">
                        {tr('control.kitchen.noLinkedProducts', 'No products linked yet.')}
                      </div>
                    ) : (
                      <ul className="space-y-1">
                        {kitchenProductsLinked.map((link) => (
                          <li key={link.productId}>
                            <label className="flex items-center justify-between gap-2 px-3 py-2 rounded cursor-pointer active:bg-green-500 text-pos-text group">
                              <div className="flex items-center gap-2 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={kitchenProductsRightSelectedIds.has(link.productId)}
                                  onChange={(e) => {
                                    setKitchenProductsRightSelectedIds((prev) => {
                                      const next = new Set(prev);
                                      if (e.target.checked) next.add(link.productId);
                                      else next.delete(link.productId);
                                      return next;
                                    });
                                  }}
                                  className="rounded shrink-0"
                                  onClick={(ev) => ev.stopPropagation()}
                                />
                                <span className="truncate">{link.productName}</span>
                              </div>
                              <button
                                type="button"
                                className="p-1 rounded active:bg-green-500 text-pos-muted active:text-red-400 shrink-0 opacity-0 group-active:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeKitchenProductLink(link.productId);
                                }}
                                aria-label={tr('delete', 'Delete')}
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="px-3 py-2 border-t border-pos-border shrink-0">
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center gap-2 py-2 rounded bg-red-600/80 active:bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleRemoveKitchenProductLinks}
                      disabled={!kitchenProductsRightSelectedIds.size || loadingKitchenProductsCatalog}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {tr('control.productSubproducts.remove', 'Remove')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center shrink-0">
              <button
                type="button"
                className="px-6 py-3 rounded-lg bg-green-600 text-white text-sm font-medium active:bg-green-500 disabled:opacity-50"
                onClick={handleSaveKitchenProducts}
                disabled={savingKitchenProducts || loadingKitchenProductsCatalog || !kitchenProductsKitchen}
              >
                {savingKitchenProducts ? tr('control.saving', 'Saving...') : tr('control.save', 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit category modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-pos-bg rounded-xl shadow-2xl max-w-[90%] w-full justify-center items-center mx-4 overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-4 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={closeCategoryModal} aria-label="Close">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-6 flex flex-col space-y-6 w-full justify-center text-sm items-center pt-20">
              <div className="w-full flex flex-col justify-center items-center gap-5">
                <div className="flex gap-2 w-full items-center justify-center">
                  <label className="block min-w-[150px] max-w-[150px] font-medium text-gray-200">{tr('name', 'Name')} : </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="px-4 w-[200px] bg-pos-panel h-[40px] py-3 border border-gray-300 rounded-lg text-gray-200"
                    onFocus={() => setCategoryActiveField('name')}
                    onClick={() => setCategoryActiveField('name')}
                  />
                </div>
                <div className="flex gap-2 w-full items-center justify-center">
                  <label className="block min-w-[150px] max-w-[150px] font-medium text-gray-200">{tr('control.inWebshop', 'In webshop')} : </label>
                  <div className="w-[200px] flex items-center justify-start">
                    <input
                      type="checkbox"
                      checked={categoryInWebshop}
                      onChange={(e) => setCategoryInWebshop(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                  </div>
                </div>
                <div className="flex gap-2 w-full items-center justify-center">
                  <label className="block  min-w-[150px] max-w-[150px] font-medium text-gray-200">{tr('control.displayOnThisCashRegister', 'Display on this cash register')} : </label>
                  <div className="w-[200px] flex items-center justify-start">
                    <input
                      type="checkbox"
                      checked={categoryDisplayOnCashRegister}
                      onChange={(e) => setCategoryDisplayOnCashRegister(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                  </div>
                </div>
                <div className="flex gap-2 w-full items-center justify-center">
                  <label className="block min-w-[150px] max-w-[150px] font-medium text-gray-200">{tr('nextCourse', 'Next course')} : </label>
                  <input
                    type="text"
                    value={categoryNextCourse}
                    onChange={(e) => setCategoryNextCourse(e.target.value)}
                    className="px-4 w-[200px] bg-pos-panel h-[40px] py-3 border border-gray-300 rounded-lg text-gray-200"
                    onFocus={() => setCategoryActiveField('nextCourse')}
                    onClick={() => setCategoryActiveField('nextCourse')}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center pt-5 pb-5">
              <button
                type="button"
                className="flex items-center text-md gap-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50"
                disabled={savingCategory}
                onClick={handleSaveCategory}
              >
                <svg fill="#ffffff" width="14px" height="14px" viewBox="0 0 16 16" id="save-16px" xmlns="http://www.w3.org/2000/svg">
                  <path id="Path_42" data-name="Path 42" d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" />
                </svg>
                {tr('control.save', 'Save')}
              </button>
            </div>
            <KeyboardWithNumpad
              value={categoryActiveField === 'name' ? categoryName : categoryNextCourse}
              onChange={categoryActiveField === 'name' ? setCategoryName : setCategoryNextCourse}
            />
          </div>
        </div>
      )}

      {/* New / Edit product modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-pos-bg rounded-xl shadow-2xl max-w-[90%] min-h-[705px] max-h-[705px] w-full justify-center items-center mx-4 overflow-hidden flex flex-col max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-2 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={closeProductModal} aria-label="Close">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex gap-1 w-full justify-around px-10 pt-5 shrink-0 pr-14">
              {[
                { id: 'general', label: tr('control.productModal.tab.general', 'General') },
                { id: 'advanced', label: tr('control.productModal.tab.advanced', 'Advanced') },
                { id: 'extra_prices', label: tr('control.productModal.tab.extraPrices', 'Extra prices') },
                { id: 'purchase_stock', label: tr('control.productModal.tab.purchaseStock', 'Purchase and stock') },
                { id: 'webshop', label: tr('control.productModal.tab.webshop', 'Webshop') },
                { id: 'kiosk', label: tr('control.productModal.tab.kiosk', 'Kiosk') },
              ].map((tab) => {
                const isLocked = tab.id !== 'general' && !productTabsUnlocked;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    disabled={isLocked}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${productTab === tab.id ? 'bg-green-600 text-white border border-b-0 border-pos-border' : isLocked ? 'text-pos-muted opacity-50 cursor-not-allowed' : 'text-white active:text-pos-text'} active:bg-green-500`}
                    onClick={() => !isLocked && setProductTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            {productSaveError ? (
              <div className="shrink-0 px-6 pt-2">
                <p
                  role="alert"
                  className="rounded-lg border border-rose-500/60 bg-rose-500/15 px-3 py-2 text-sm text-rose-100"
                >
                  {productSaveError}
                </p>
              </div>
            ) : null}
            {/* Single scrollable area for all tabs so keyboard stays fixed at bottom */}
            <div className="flex-1 min-h-0 w-full overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {productTab === 'general' && (
                <div className="p-6 pb-0">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="flex text-md flex-col gap-3">
                      <div className="flex w-full items-center gap-1">
                        <label className="text-md min-w-[125px] font-medium text-gray-200">{tr('name', 'Name')}:</label>
                        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className={`h-[40px] min-w-[150px] max-w-[150px] px-4 py-3 border rounded-lg text-pos-text text-md caret-white ${productFieldErrors.name ? 'bg-rose-500/40 border-rose-400' : 'bg-pos-panel border-pos-border'}`} onFocus={() => setProductActiveField('name')} onClick={() => setProductActiveField('name')} />
                      </div>
                      <div className="flex items-center gap-1">
                        <label className="min-w-[125px] font-medium text-gray-200 text-md">{tr('control.productModal.testName', 'Test name')}:</label>
                        <input type="text" value={productKeyName} onChange={(e) => setProductKeyName(e.target.value)} className={`min-w-[150px] max-w-[150px] px-4 h-[40px] py-3 border rounded-lg text-pos-text text-md ${productFieldErrors.keyName ? 'bg-rose-500/40 border-rose-400' : 'bg-pos-panel border-pos-border'}`} onFocus={() => setProductActiveField('keyName')} onClick={() => setProductActiveField('keyName')} />
                      </div>
                      <div className="flex items-center gap-1">
                        <label className="min-w-[125px] font-medium text-gray-200 text-md">{tr('control.productModal.productionName', 'Production name')}:</label>
                        <input type="text" value={productProductionName} onChange={(e) => setProductProductionName(e.target.value)} className={`min-w-[150px] max-w-[150px] px-4 h-[40px] py-3 border rounded-lg text-pos-text text-md ${productFieldErrors.productionName ? 'bg-rose-500/40 border-rose-400' : 'bg-pos-panel border-pos-border'}`} onFocus={() => setProductActiveField('productionName')} onClick={() => setProductActiveField('productionName')} />
                      </div>
                      <div className="flex items-center gap-1">
                        <label className="min-w-[125px] font-medium text-gray-200 text-md">{tr('control.productModal.price', 'Price')}:</label>
                        <input type="text" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="min-w-[150px] max-w-[150px] px-4 h-[40px] py-3 bg-pos-panel border border-pos-border rounded-lg text-pos-text text-md max-w-[150px]" onFocus={() => setProductActiveField('price')} onClick={() => setProductActiveField('price')} />
                      </div>
                      <div className="flex items-center gap-1">
                        <label className="min-w-[125px] font-medium text-gray-200 text-md">{tr('control.productModal.vatTakeOut', 'VAT Take out')}:</label>
                        <Dropdown options={VAT_PERCENT_OPTIONS} value={productVatTakeOut} onChange={(v) => { setProductVatTakeOut(v); setProductFieldErrors((e) => ({ ...e, vatTakeOut: false })); }} placeholder="--" className="text-md min-w-[150px]" hasError={productFieldErrors.vatTakeOut} />
                      </div>
                      <div className="flex items-center gap-1">
                        <label className="min-w-[125px] font-medium text-gray-200 text-md">{tr('control.productModal.vatEatIn', 'VAT Eat in')}:</label>
                        <Dropdown options={VAT_PERCENT_OPTIONS} value={productVatEatIn} onChange={(v) => { setProductVatEatIn(v); setProductFieldErrors((e) => ({ ...e, vatEatIn: false })); }} placeholder="--" className="text-md min-w-[150px]" hasError={productFieldErrors.vatEatIn} />
                      </div>
                      {productTabsUnlocked ? (
                        <div className="flex items-center gap-1 h-[40px]">
                          <label className="min-w-[125px] font-medium text-gray-200 text-md">{tr('control.productModal.id', 'Id')}:</label>
                          <span className="text-pos-text text-md">{productDisplayNumber != null ? productDisplayNumber : '—'}</span>
                        </div>
                      )
                        : (
                          <div className="flex items-center gap-1 h-[40px]">
                          </div>
                        )
                      }
                    </div>
                    <div className='flex flex-col w-full gap-4 max-h-[340px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
                      {(() => {
                        const ids = [...productCategoryIds];
                        let numVisible = 1;
                        if (productTabsUnlocked && categories.length > 0) {
                          for (let i = 0; i < categories.length; i++) {
                            const prevId = i > 0 ? ids[i - 1] : '';
                            if (i > 0 && !prevId) break;
                            const selectedIds = ids.slice(0, i + 1);
                            const optionsForNext = categories.filter((c) => !selectedIds.includes(c.id));
                            if (!ids[i]) {
                              numVisible = i + 1;
                              break;
                            }
                            if (optionsForNext.length < 1) {
                              numVisible = i + 1;
                              break;
                            }
                            numVisible = i + 2;
                          }
                        }
                        while (ids.length < numVisible) ids.push('');
                        return Array.from({ length: numVisible }, (_, i) => {
                          const prevIds = ids.slice(0, i);
                          const optionsForI = i === 0 ? categories : categories.filter((c) => !prevIds.includes(c.id));
                          return (
                            <div key={i} className="flex gap-1 w-full h-[40px]">
                              <label className="pr-5 font-medium text-md items-center justify-center flex h-[40px] text-gray-200">{tr('control.productModal.category', 'Category')}:</label>
                              <Dropdown
                                options={optionsForI.map((c) => ({ value: c.id, label: c.name }))}
                                value={ids[i] || ''}
                                onChange={(v) => {
                                  setProductCategoryIds((prev) => {
                                    const next = [...prev];
                                    while (next.length <= i) next.push('');
                                    next[i] = v;
                                    for (let j = i + 1; j < next.length; j++) next[j] = '';
                                    return next;
                                  });
                                }}
                                placeholder="--"
                                className="text-md w-full min-w-[150px]"
                              />
                            </div>
                          );
                        });
                      })()}
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-1 items-center w-full">
                        <label className="min-w-[80px] font-medium text-md text-gray-200">{tr('control.productModal.addition', 'Addition')}:</label>
                        <Dropdown options={[{ value: 'Subproducts', label: tr('control.productModal.subproducts', 'Subproducts') }]} value={productAddition} onChange={setProductAddition} placeholder="--" className="text-md w-full min-w-[150px]" />
                      </div>
                      <div className="flex gap-1 items-center">
                        <label className="min-w-[80px] font-medium text-md text-gray-200">{tr('control.productModal.barcode', 'Barcode')}:</label>
                        <div className="flex gap-2 items-center w-full">
                          <input type="text" value={productBarcode} onChange={(e) => setProductBarcode(e.target.value)} className="min-w-[150px] max-w-[150px] px-4 h-[40px] py-3 bg-pos-panel border border-pos-border rounded-lg text-pos-text text-md" onFocus={() => setProductActiveField('barcode')} onClick={() => setProductActiveField('barcode')} />
                          <button type="button" className="p-2 rounded-full bg-pos-panel border border-pos-border text-pos-text active:bg-green-500 disabled:opacity-70" aria-label="Generate barcode" onClick={handleGenerateBarcode}>
                            <svg className={`w-5 h-5 ${barcodeButtonSpinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-1 items-center">
                        <label className="min-w-[80px] font-medium text-md text-gray-200">{tr('control.productModal.printer1', 'Printer 1')}:</label>
                        <Dropdown
                          options={getUniqueProductPrinterOptions(productPrinter1, [productPrinter2, productPrinter3])}
                          value={productPrinter1}
                          onChange={setProductPrinter1}
                          className="text-md w-full min-w-[150px]"
                        />
                      </div>
                      <div className="flex gap-1 items-center">
                        <label className="min-w-[80px] font-medium text-md text-gray-200">{tr('control.productModal.printer2', 'Printer 2')}:</label>
                        <Dropdown
                          options={getUniqueProductPrinterOptions(productPrinter2, [productPrinter1, productPrinter3])}
                          value={productPrinter2}
                          onChange={setProductPrinter2}
                          className="text-md w-full min-w-[150px]"
                        />
                      </div>
                      <div className="flex gap-1 items-center">
                        <label className="min-w-[80px] font-medium text-md text-gray-200">{tr('control.productModal.printer3', 'Printer 3')}:</label>
                        <Dropdown
                          options={getUniqueProductPrinterOptions(productPrinter3, [productPrinter1, productPrinter2])}
                          value={productPrinter3}
                          onChange={setProductPrinter3}
                          className="text-md w-full min-w-[150px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full justify-center gap-4">
                    <button type="button" className="flex items-center text-md gap-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50" disabled={savingProduct} onClick={handleSaveProduct}>
                      <svg fill="#ffffff" width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                      {tr('control.productModal.addAndClose', 'Add and close')}
                    </button>
                  </div>
                </div>
              )}
              {productTab === 'advanced' && (
                <div className="p-6 pb-0 flex w-full flex-col px-10 text-sm">
                  <div className="flex w-full gap-10">
                    <div className="flex flex-col gap-3">
                      <div className='flex items-center'>
                        <label className="flex items-center gap-2 min-w-[170px] text-pos-text">{tr('control.productModal.advanced.openPrice', 'Open price')}:</label>
                        <input type="checkbox" checked={advancedOpenPrice} onChange={(e) => setAdvancedOpenPrice(e.target.checked)} className="rounded border-pos-border w-5 h-5" />
                      </div>
                      <div className='flex items-center'>
                        <label className="flex items-center min-w-[170px] gap-2 text-pos-text">{tr('control.productModal.advanced.libra', 'Libra')}:</label>
                        <input type="checkbox" checked={advancedWeegschaal} onChange={(e) => setAdvancedWeegschaal(e.target.checked)} className="rounded border-pos-border w-5 h-5" />
                      </div>
                      <div className='flex items-center'>
                        <label className="flex items-center min-w-[170px] gap-2 text-pos-text">{tr('control.productModal.advanced.subproductRequires', 'Subproduct requires')} :</label>
                        <input type="checkbox" checked={advancedSubproductRequires} onChange={(e) => setAdvancedSubproductRequires(e.target.checked)} className="rounded border-pos-border w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1">
                        <label className="block text-pos-text mb-1 min-w-[170px] text-md">{tr('control.productModal.advanced.emptyPrice', 'Empty price')}:</label>
                        <input type="text" value={advancedLeeggoedPrijs} onChange={(e) => setAdvancedLeeggoedPrijs(e.target.value)} onFocus={() => setProductActiveField('leeggoedPrijs')} className="w-full h-[40px] border border-pos-border rounded-lg px-3 py-2 bg-pos-bg text-pos-text max-w-[100px]" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className='flex items-center'>
                        <label className="flex min-w-[140px] items-center gap-2 text-pos-text">{tr('control.productModal.advanced.pagerRequired', 'Pager required')}:</label>
                        <input type="checkbox" checked={advancedPagerVerplicht} onChange={(e) => setAdvancedPagerVerplicht(e.target.checked)} className="rounded border-pos-border w-5 h-5" />
                      </div>
                      <div className='flex items-center'>
                        <label className="flex min-w-[140px] items-center gap-2 text-pos-text">{tr('control.productModal.advanced.boldPrint', 'Bold print')}:</label>
                        <input type="checkbox" checked={advancedBoldPrint} onChange={(e) => setAdvancedBoldPrint(e.target.checked)} className="rounded border-pos-border w-5 h-5" />
                      </div>
                      <div className='flex items-center'>
                        <label className="flex min-w-[140px] items-center gap-2 text-pos-text">{tr('control.productModal.advanced.groupingReceipt', 'Grouping receipt')}:</label>
                        <input type="checkbox" checked={advancedGroupingReceipt} onChange={(e) => setAdvancedGroupingReceipt(e.target.checked)} className="rounded border-pos-border w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 ml-10">
                      <div className="flex items-center">
                        <label className="block min-w-[150px] text-pos-text mb-1">{tr('control.productModal.advanced.labelExtraInfo', 'Label extra info')}:</label>
                        <input type="text" value={advancedLabelExtraInfo} onChange={(e) => setAdvancedLabelExtraInfo(e.target.value)} onFocus={() => setProductActiveField('labelExtraInfo')} className="w-full h-[40px] border border-pos-border rounded-lg px-3 py-2 bg-pos-bg text-pos-text max-w-[160px]" />
                      </div>
                      <div className="flex items-center">
                        <label className="block min-w-[150px] text-pos-text mb-1">{tr('control.productModal.advanced.cashRegisterPhoto', 'Cash register photo')}:</label>
                        <div className="flex items-center gap-3">
                          {!advancedKassaPhotoPreview ? (
                            <label className="px-4 py-2 border border-pos-border rounded-lg text-pos-text active:bg-green-500 cursor-pointer shrink-0 text-md">
                              {tr('control.productModal.chooseFileSimple', 'Select')}
                              <input
                                type="file"
                                className="hidden focus:border-green-500 focus:outline-none"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file && file.type.startsWith('image/')) {
                                    const dataUrl = await new Promise((resolve, reject) => {
                                      const reader = new FileReader();
                                      reader.onload = () => resolve(String(reader.result || ''));
                                      reader.onerror = () => reject(reader.error);
                                      reader.readAsDataURL(file);
                                    }).catch(() => '');
                                    if (dataUrl) setAdvancedKassaPhotoPreview(dataUrl);
                                  }
                                  e.target.value = '';
                                }}
                              />
                            </label>
                          ) : (
                            <>
                              <img src={advancedKassaPhotoPreview} alt="Cash register" className="w-16 h-16 object-cover rounded-lg border border-pos-border shrink-0" />
                              <button
                                type="button"
                                className="px-4 py-2 border border-pos-border rounded-lg text-pos-text active:bg-green-500 shrink-0"
                                onClick={() => {
                                  setAdvancedKassaPhotoPreview(null);
                                }}
                              >
                                Remove
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <label className="block min-w-[150px] text-pos-text">{tr('control.productModal.advanced.prepackExpiryType', 'Pre-pack expiry type')}:</label>
                        <Dropdown options={VERVALTYPE_OPTIONS} value={advancedVoorverpakVervaltype} onChange={setAdvancedVoorverpakVervaltype} placeholder={tr('control.productModal.select', 'Select…')} className="bg-pos-bg text-pos-text min-w-[160px]" />
                      </div>
                      <div className="flex items-center">
                        <label className="block min-w-[150px] text-pos-text">{tr('control.productModal.advanced.shelfLife', 'Shelf life')}:</label>
                        <input type="text" value={advancedHoudbareDagen} onChange={(e) => setAdvancedHoudbareDagen(e.target.value)} onFocus={() => setProductActiveField('houdbareDagen')} className="w-full h-[40px] border border-pos-border max-w-[160px] rounded-lg px-3 py-2 bg-pos-bg text-pos-text text-md" />
                      </div>
                      <div className="flex text-md">
                        <label className="block min-w-[150px] text-pos-text">{tr('control.productModal.advanced.storageUse', 'Storage, use')}:</label>
                        <textarea value={advancedBewarenGebruik} onChange={(e) => setAdvancedBewarenGebruik(e.target.value)} onFocus={() => setProductActiveField('bewarenGebruik')} rows={4} className="w-full border border-pos-border max-w-[160px] rounded-lg px-3 py-2 bg-pos-bg text-pos-text resize-none" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button type="button" className="flex items-center gap-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50" onClick={handleSaveProduct} disabled={savingProduct}>
                      <svg fill="#ffffff" width="14px" height="14px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                      {tr('control.save', 'Save')}
                    </button>
                  </div>
                </div>
              )}
              {productTab === 'extra_prices' && (
                <div className="p-6 flex flex-col gap-3 pb-0">
                  <div className="flex gap-4 w-full justify-around text-sm text-pos-text">
                    <div className="font-medium">{tr('control.productModal.extraPrices.pricegroup', 'Pricegroup')}</div>
                    <div className="font-medium">{tr('control.productModal.extraPrices.otherName', 'Other name')}</div>
                    <div className="font-medium">{tr('control.productModal.extraPrices.otherPrinter', 'Other printer')}</div>
                    <div className="font-medium">{tr('control.productModal.extraPrices.otherPrice', 'Other price')}</div>
                  </div>
                  <div
                    ref={extraPricesScrollRef}
                    onScroll={syncExtraPricesScrollEdges}
                    className="max-h-[250px] min-h-[250px] overflow-x-auto overflow-y-auto text-sm border-collapse border border-pos-border scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden]"
                  >
                    <table className="w-full h-full rounded-lg text-pos-text">
                      <tbody className="w-full">
                        {extraPricesRows.map((row, idx) => (
                          <tr key={idx} className="bg-pos-bg">
                            <td className="min-w-[200px] px-4 py-1">
                              <span className="px-3 max-w-[200px] min-h-[40px] max-h-[40px] py-2 block flex justify-center rounded-lg text-pos-text">{row.priceGroupLabel}</span>
                            </td>
                            <td className=" min-w-[250px] min-h-[40px] max-h-[40px] px-4 py-1">
                              <div className='w-full flex justify-center items-center'>
                                <input
                                  type="text"
                                  value={row.otherName}
                                  onChange={(e) => setExtraPricesRows((prev) => prev.map((r, i) => i === idx ? { ...r, otherName: e.target.value } : r))}
                                  onFocus={() => { setExtraPricesSelectedIndex(idx); setProductActiveField('extraOtherName'); }}
                                  className="w-full max-w-[150px] min-h-[40px] max-h-[40px] rounded-lg px-3 py-2 border border-pos-border flex justify-center bg-pos-panel text-pos-text"
                                />
                              </div>
                            </td>
                            <td className="min-w-[200px] min-h-[40px] max-h-[40px] px-4 py-1">
                              <div className="w-full flex justify-center items-center">
                                <div className="w-full max-w-[150px] min-w-0">
                                  <Dropdown
                                    options={EXTRA_PRICE_PRINTER_OPTIONS}
                                    value={row.otherPrinter}
                                    onChange={(v) => setExtraPricesRows((prev) => prev.map((r, i) => i === idx ? { ...r, otherPrinter: v } : r))}
                                    placeholder="--"
                                    className="w-full min-h-[40px] max-h-[40px] bg-pos-bg text-pos-text"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="min-w-[200px] min-h-[40px] max-h-[40px] px-4 py-1">
                              <input
                                type="text"
                                value={row.otherPrice}
                                onChange={(e) => setExtraPricesRows((prev) => prev.map((r, i) => i === idx ? { ...r, otherPrice: e.target.value } : r))}
                                onFocus={() => { setExtraPricesSelectedIndex(idx); setProductActiveField('extraOtherPrice'); }}
                                className="w-full min-h-[40px] max-h-[40px] rounded-lg ml-[50px] max-w-[120px] px-3 py-2 border border-pos-border bg-pos-panel text-pos-text"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-around px-[200px]">
                    <button
                      type="button"
                      className="p-2 px-4 bg-pos-panel rounded-lg text-white active:bg-green-500 disabled:opacity-50 text-lg font-medium"
                      disabled={extraPricesScrollEdges.atTop}
                      onClick={() => {
                        const el = extraPricesScrollRef.current;
                        if (!el) return;
                        const step = Math.min(56, Math.max(40, Math.round(el.clientHeight * 0.45)));
                        el.scrollBy({ top: -step, behavior: 'smooth' });
                      }}
                      aria-label={tr('control.productModal.extraPrices.scrollUp', 'Scroll up')}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="p-2 px-4 rounded-lg bg-pos-panel text-white active:bg-green-500 disabled:opacity-50 text-lg font-medium"
                      disabled={extraPricesScrollEdges.atBottom}
                      onClick={() => {
                        const el = extraPricesScrollRef.current;
                        if (!el) return;
                        const step = Math.min(56, Math.max(40, Math.round(el.clientHeight * 0.45)));
                        el.scrollBy({ top: step, behavior: 'smooth' });
                      }}
                      aria-label={tr('control.productModal.extraPrices.scrollDown', 'Scroll down')}
                    >
                      ↓
                    </button>
                  </div>
                  <div className="flex justify-center text-md">
                    <button type="button" className="flex text-md items-center gap-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50" onClick={handleSaveProduct} disabled={savingProduct}>
                      <svg fill="#ffffff" width="14px" height="14px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                      {tr('control.save', 'Save')}
                    </button>
                  </div>
                </div>
              )}
              {productTab === 'purchase_stock' && (
                <div className="p-6 flex flex-col gap-6 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-3">
                      <div className='flex items-center'>
                        <label className="block min-w-[150px] text-pos-text text-md">{tr('control.productModal.purchase.purchaseVat', 'Purchase VAT')}:</label>
                        <Dropdown options={VAT_PERCENT_OPTIONS} value={purchaseVat} onChange={setPurchaseVat} placeholder="--" className="min-w-[120px] bg-pos-bg text-pos-text text-md" />
                      </div>
                      <div className='flex items-center'>
                        <label className="block text-pos-text min-w-[150px] text-md">{tr('control.productModal.purchase.purchasePriceExcl', 'Purchase price excl')}:</label>
                        <input type="text" value={purchasePriceExcl} onChange={(e) => setPurchasePriceExcl(e.target.value)} onFocus={() => setProductActiveField('purchasePriceExcl')} className="border max-w-[120px] h-[40px] border-pos-border rounded-lg px-3 py-2 bg-pos-bg text-pos-text text-md" />
                      </div>
                      <div className='flex items-center'>
                        <label className="block text-pos-text min-w-[150px] text-md">{tr('control.productModal.purchase.purchasePriceIncl', 'Purchase price incl.')}:</label>
                        <input type="text" value={purchasePriceIncl} onChange={(e) => setPurchasePriceIncl(e.target.value)} onFocus={() => setProductActiveField('purchasePriceIncl')} className="border max-w-[120px] h-[40px] border-pos-border rounded-lg px-3 py-2 bg-pos-bg text-pos-text text-md" />
                      </div>
                      <div className='flex items-center'>
                        <label className="block text-pos-text min-w-[150px] text-md">{tr('control.productModal.purchase.profitPercentage', 'Profit percentage')}:</label>
                        <input type="text" value={profitPct} onChange={(e) => setProfitPct(e.target.value)} onFocus={() => setProductActiveField('profitPct')} className="border border-pos-border rounded-lg px-3 max-w-[120px] h-[40px] py-2 bg-pos-bg text-pos-text text-md" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className='flex items-center'>
                        <label className="block min-w-[110px] text-pos-text text-md">{tr('control.productModal.purchase.unit', 'Unit')}:</label>
                        <Dropdown options={PURCHASE_UNIT_OPTIONS} value={purchaseUnit} onChange={setPurchaseUnit} placeholder="--" className="min-w-[150px] bg-pos-bg text-pos-text text-md" />
                      </div>
                      <div className='flex items-center'>
                        <label className="block min-w-[110px] text-pos-text text-md">{tr('control.productModal.purchase.unitContent', 'Unit content')}:</label>
                        <input type="text" value={unitContent} onChange={(e) => setUnitContent(e.target.value)} onFocus={() => setProductActiveField('unitContent')} className="border min-w-[150px] max-w-[150px] border-pos-border rounded-lg px-3 py-2 h-[40px] bg-pos-bg text-pos-text text-md" />
                      </div>
                      <div className='flex items-center'>
                        <label className="block min-w-[110px] text-pos-text text-md">{tr('control.productModal.purchase.stock', 'Stock')}:</label>
                        <input type="text" value={stock} onChange={(e) => setStock(e.target.value)} onFocus={() => setProductActiveField('stock')} className="border border-pos-border rounded-lg min-w-[150px] max-w-[150px] px-3 py-2 h-[40px] bg-pos-bg text-pos-text text-md" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className='flex items-center'>
                        <label className="block text-pos-text min-w-[105px]">{tr('control.productModal.purchase.supplier', 'Supplier')}:</label>
                        <Dropdown options={PURCHASE_SUPPLIER_OPTIONS} value={purchaseSupplier} onChange={setPurchaseSupplier} placeholder="--" className="min-w-[150px] bg-pos-bg text-pos-text" />
                      </div>
                      <div className='flex items-center'>
                        <label className="block text-pos-text min-w-[105px]">{tr('control.productModal.purchase.supplierCode', 'Supplier code')}:</label>
                        <input type="text" value={supplierCode} onChange={(e) => setSupplierCode(e.target.value)} onFocus={() => setProductActiveField('supplierCode')} className="border max-w-[150px] h-[40px] border-pos-border rounded-lg px-3 py-2 bg-pos-bg text-pos-text" />
                      </div>
                      <div className='flex items-center'>
                        <label className="flex min-w-[105px] items-centertext-pos-text">
                          {tr('control.productModal.purchase.stockNotification', 'Stock notification')}
                        </label>
                        <input type="checkbox" checked={stockNotification} onChange={(e) => setStockNotification(e.target.checked)} className="rounded w-5 h-5 border-pos-border" />
                      </div>
                      <div className='flex items-center'>
                        <label className="blockflex min-w-[105px] text-pos-text">{tr('control.productModal.purchase.expirationDate', 'Expiration date')}:</label>
                        <input type="text" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} onFocus={() => setProductActiveField('expirationDate')} className="border border-pos-border max-w-[150px] h-[40px] rounded-lg px-3 py-2 bg-pos-bg text-pos-text" placeholder="" />
                      </div>
                      <div className='flex items-center'>
                        <label className="blockflex min-w-[105px] max-w-[105px] text-pos-text">{tr('control.productModal.purchase.declarationOfExpiry', 'Declaration of expiry')}:</label>
                        <div className="flex items-center gap-2">
                          <input type="text" value={declarationExpiryDays} onChange={(e) => setDeclarationExpiryDays(e.target.value)} onFocus={() => setProductActiveField('declarationExpiryDays')} className="border max-w-[50px] h-[40px] border-pos-border rounded-lg px-3 py-2 bg-pos-bg text-pos-text" />
                          <span className="text-pos-text">{tr('control.productModal.purchase.daysInAdvance', 'days in advance')}</span>
                        </div>
                      </div>
                      <div className='flex items-center'>
                        <label className="blockflex min-w-[105px] max-w-[105px] text-pos-text">{tr('control.productModal.purchase.notificationSoldOut', 'Notification sold out')}:</label>
                        <div className="flex items-center gap-2">
                          <input type="text" value={notificationSoldOutPieces} onChange={(e) => setNotificationSoldOutPieces(e.target.value)} onFocus={() => setProductActiveField('notificationSoldOutPieces')} className="border max-w-[50px] h-[40px] border-pos-border rounded-lg px-3 py-2 bg-pos-bg text-pos-text" />
                          <span className="text-pos-text">{tr('control.productModal.purchase.piecesInAdvance', 'pieces in advance')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button type="button" className="flex items-center text-md gap-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50" onClick={handleSaveProduct} disabled={savingProduct}>
                      <svg fill="#ffffff" width="14px" height="14px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                      {tr('control.save', 'Save')}
                    </button>
                  </div>
                </div>
              )}
              {productTab === 'webshop' && (
                <div className="p-6 flex flex-col gap-6">
                  <div className="grid text-sm grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3">
                      <div className='flex items-center'>
                        <label className="flex min-w-[150px] items-center text-pos-text">{tr('control.productModal.webshop.inWebshop', 'In webshop')}:</label>
                        <input type="checkbox" checked={productInWebshop} onChange={(e) => setProductInWebshop(e.target.checked)} className="w-5 h-5 rounded border-pos-border" />
                      </div>
                      <div className='flex items-center'>
                        <label className="flex items-center min-w-[150px] text-pos-text">{tr('control.productModal.webshop.onlineOrderable', 'Online orderable')}:</label>
                        <input type="checkbox" checked={webshopOnlineOrderable} onChange={(e) => setWebshopOnlineOrderable(e.target.checked)} className="w-5 h-5 rounded border-pos-border" />
                      </div>
                      <div className='flex items-center'>
                        <label className="block text-pos-text min-w-[150px]">{tr('control.productModal.webshop.websiteRemark', 'Website remark')}:</label>
                        <input type="text" value={websiteRemark} onChange={(e) => setWebsiteRemark(e.target.value)} onFocus={() => setProductActiveField('websiteRemark')} className="border max-w-[150px] h-[40px] border-pos-border rounded-lg px-3 py-2 bg-pos-bg text-pos-text" />
                      </div>
                      <div className='flex items-center'>
                        <label className="block text-pos-text min-w-[150px]">{tr('control.productModal.webshop.websiteOrder', 'Website order')}:</label>
                        <input type="text" value={websiteOrder} onChange={(e) => setWebsiteOrder(e.target.value)} onFocus={() => setProductActiveField('websiteOrder')} className="border max-w-[150px] h-[40px] border-pos-border rounded-lg px-3 py-2 bg-pos-bg text-pos-text" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className='flex items-center'>
                        <label className="block text-pos-text min-w-[150px]">{tr('control.productModal.webshop.shortWebText', 'Short web text')}:</label>
                        <input type="text" value={shortWebText} onChange={(e) => setShortWebText(e.target.value)} onFocus={() => setProductActiveField('shortWebText')} className="border max-w-[150px] h-[40px] border-pos-border rounded-lg px-3 py-2 bg-pos-bg text-pos-text" />
                      </div>
                      <div className='flex items-center'>
                        <label className="block text-pos-text min-w-[150px]">{tr('control.productModal.webshop.websitePhoto', 'Website photo')}:</label>
                        <div className="flex gap-3 items-center">
                          <label className="px-4 py-2 border border-pos-border rounded-lg text-pos-text active:bg-green-500 cursor-pointer shrink-0">
                            {tr('control.productModal.chooseFile', 'Choose File')}
                            <input type="file" className="hidden focus:border-green-500 focus:outline-none" accept="image/*" onChange={(e) => setWebsitePhotoFileName(e.target.files?.[0]?.name ?? '')} />
                          </label>
                          <span className="text-pos-muted">{websitePhotoFileName || tr('control.productModal.noFileChosen', 'No file chosen')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center pt-20">
                    <button type="button" className="flex items-center gap-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50" onClick={handleSaveProduct} disabled={savingProduct}>
                      <svg fill="#ffffff" width="14px" height="14px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                      {tr('control.save', 'Save')}
                    </button>
                  </div>
                </div>
              )}
              {productTab === 'kiosk' && (
                <div className="p-6 flex flex-col gap-6 overflow-y-hidden">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className='flex flex-col gap-5'>
                      <div className='flex items-center'>
                        <label className="block w-[150px] text-pos-text">{tr('control.productModal.kiosk.kioskInfo', 'Kiosk info')}:</label>
                        <input type="text" value={kioskInfo} onChange={(e) => setKioskInfo(e.target.value)} onFocus={() => setProductActiveField('kioskInfo')} className="border border-pos-border rounded-lg px-3 py-2 h-[40px] bg-pos-bg text-pos-text" />
                      </div>
                      <div className='flex items-center'>
                        <label className="flex min-w-[150px] items-center text-pos-text">
                          {tr('control.productModal.kiosk.kioskTakeAway', 'Kiosk take away')}:
                        </label>
                        <input type="checkbox" checked={kioskTakeAway} onChange={(e) => setKioskTakeAway(e.target.checked)} className="w-5 h-5 rounded border-pos-border" />
                      </div>
                      <div className='flex items-center'>
                        <label className="block w-[150px] text-pos-text">{tr('control.productModal.kiosk.kioskEatIn', 'Kiosk eat in')}:</label>
                        <input type="text" value={kioskEatIn} onChange={(e) => setKioskEatIn(e.target.value)} onFocus={() => setProductActiveField('kioskEatIn')} className="border border-pos-border rounded-lg px-3 py-2 h-[40px] bg-pos-bg text-pos-text max-w-md" />
                      </div>
                      <div className='flex items-center'>
                        <label className="block w-[150px] text-pos-text">{tr('control.productModal.kiosk.kioskSubtitle', 'Kiosk subtitle')}:</label>
                        <input type="text" value={kioskSubtitle} onChange={(e) => setKioskSubtitle(e.target.value)} onFocus={() => setProductActiveField('kioskSubtitle')} className="border border-pos-border rounded-lg px-3 py-2 h-[40px] bg-pos-bg text-pos-text" />
                      </div>
                      <div className='flex items-center'>
                        <label className="block text-pos-text w-[150px]">{tr('control.productModal.kiosk.kioskMinSubs', 'Kiosk min. subs')}:</label>
                        <Dropdown options={KIOSK_SUBS_OPTIONS} value={kioskMinSubs} onChange={setKioskMinSubs} className="min-w-[200px] bg-pos-bg text-pos-text" />
                      </div>
                      <div className='flex items-center'>
                        <label className="block text-pos-text w-[150px]">{tr('control.productModal.kiosk.kioskMaxSubs', 'Kiosk max. subs')}:</label>
                        <Dropdown options={KIOSK_SUBS_OPTIONS} value={kioskMaxSubs} onChange={setKioskMaxSubs} className="min-w-[200px] bg-pos-bg text-pos-text" />
                      </div>
                    </div>
                    <div className='flex items-start gap-2'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <label className="block text-pos-text pr-10">{tr('control.productModal.kiosk.kioskPicture', 'Kiosk picture')}:</label>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="px-4 py-2 border border-pos-border rounded-lg text-pos-text active:bg-green-500 cursor-pointer shrink-0">
                            {tr('control.productModal.chooseFile', 'Choose File')}
                            <input
                              type="file"
                              className="hidden focus:border-green-500 focus:outline-none"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                e.target.value = '';
                                if (!file || !file.type.startsWith('image/')) return;
                                const dataUrl = await new Promise((resolve, reject) => {
                                  const reader = new FileReader();
                                  reader.onload = () => resolve(String(reader.result || ''));
                                  reader.onerror = () => reject(reader.error);
                                  reader.readAsDataURL(file);
                                }).catch(() => '');
                                if (dataUrl) setKioskPictureFileName(dataUrl);
                              }}
                            />
                          </label>
                          {kioskPictureFileName ? (
                            <div className="flex items-center gap-2 pl-1">
                              {kioskPictureFileName.startsWith('data:') || /^https?:/i.test(kioskPictureFileName) ? (
                                <img
                                  src={kioskPictureFileName}
                                  alt=""
                                  className="h-16 w-16 object-cover rounded-lg border border-pos-border shrink-0"
                                />
                              ) : (
                                <span className="text-pos-muted text-sm max-w-[200px] truncate">{kioskPictureFileName}</span>
                              )}
                              <button
                                type="button"
                                className="px-2 py-1 text-sm border border-pos-border rounded-lg text-pos-text active:bg-green-500 shrink-0"
                                onClick={() => setKioskPictureFileName('')}
                              >
                                {tr('control.productModal.removePhoto', 'Remove')}
                              </button>
                            </div>
                          ) : (
                            <span className="text-pos-muted pl-1">{tr('control.productModal.noFileChosen', 'No file chosen')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button type="button" className="flex items-center text-md gap-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50" onClick={handleSaveProduct} disabled={savingProduct}>
                      <svg fill="#ffffff" width="14px" height="14px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                      {tr('control.save', 'Save')}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Keyboard fixed at bottom in every tab */}
            <div className="shrink-0">
              <KeyboardWithNumpad value={productKeyboardValue} onChange={productKeyboardOnChange} />
            </div>
          </div>
        </div>
      )}

      {/* Product positioning modal */}
      {showProductPositioningModal && (() => {
        const GRID_COLUMNS = 6;
        const GRID_ROWS = 8;
        const PAGE_SIZE = GRID_COLUMNS * GRID_ROWS;
        const positionCategoryId = positioningCategoryId || selectedCategoryId || categories[0]?.id || null;
        const positioningProducts = products
          .filter((p) => p.categoryId === positionCategoryId)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((p) => ({ ...p, type: 'product', _positioningId: `p:${p.id}` }));
        const allItems = [...positioningProducts, ...positioningSubproducts];
        const itemMap = new Map(allItems.map((it) => [it._positioningId, it]));
        const hasStoredLayout = Array.isArray(positioningLayoutByCategory[positionCategoryId]);
        let cells = [];
        if (hasStoredLayout) {
          const existingLayout = positioningLayoutByCategory[positionCategoryId].slice(0, PAGE_SIZE);
          while (existingLayout.length < PAGE_SIZE) existingLayout.push(null);
          cells = existingLayout.map((id) => (id && itemMap.has(id) ? id : null));
        } else {
          // No auto-placement: keep grid empty until user drags items from sidebar.
          cells = Array.from({ length: PAGE_SIZE }, () => null);
        }
        const pages = 1;
        const categoryColors = positioningColorByCategory[positionCategoryId] || {};
        const categoryIndex = categories.findIndex((c) => c.id === positionCategoryId);
        const canPrevCategory = categoryIndex > 0;
        const canNextCategory = categoryIndex >= 0 && categoryIndex < categories.length - 1;
        const COLOR_OPTIONS = [
          { id: 'green', className: 'bg-[#83c664] text-white' },
          { id: 'blue', className: 'bg-[#0000ff] text-white' },
          { id: 'pink', className: 'bg-[#e97c64] text-white' },
          { id: 'orange', className: 'bg-[#f0961c] text-white' },
          { id: 'yellow', className: 'bg-[#ff2d3d] text-white' },
          { id: 'gray', className: 'bg-[#4ab3ff] text-white' },
        ];
        const tileClassByColorId = (colorId, fallbackType) => {
          const found = COLOR_OPTIONS.find((c) => c.id === colorId);
          if (found) return found.className;
          return fallbackType === 'subproduct' ? 'bg-amber-500 text-white' : 'bg-[#83c664] text-white';
        };
        const updateLayout = (nextCells) => {
          if (!positionCategoryId) return;
          const normalized = Array.from({ length: PAGE_SIZE }, (_, i) => nextCells[i] || null);
          setPositioningLayoutByCategory((prev) => ({ ...prev, [positionCategoryId]: normalized }));
        };
        const removeFromPlace = () => {
          let idx = Number.isInteger(positioningSelectedCellIndex) ? positioningSelectedCellIndex : -1;
          if (idx < 0 || idx >= PAGE_SIZE) {
            if (positioningSelectedProductId) {
              idx = cells.findIndex((id) => {
                const item = id ? itemMap.get(id) : null;
                return item?.id === positioningSelectedProductId;
              });
            }
          }
          if (idx < 0 || idx >= PAGE_SIZE) return;
          const next = [...cells];
          next[idx] = null;
          updateLayout(next);
          if (positionCategoryId) {
            setPositioningColorByCategory((prev) => {
              const byCategory = { ...(prev[positionCategoryId] || {}) };
              delete byCategory[String(idx)];
              return { ...prev, [positionCategoryId]: byCategory };
            });
          }
          setPositioningSelectedProductId(null);
          setPositioningSelectedCellIndex(null);
          setPositioningSelectedPoolItemId(null);
        };
        const applyColorToSelectedCell = (colorId) => {
          if (!positionCategoryId) return;
          if (!Number.isInteger(positioningSelectedCellIndex) || positioningSelectedCellIndex < 0 || positioningSelectedCellIndex >= PAGE_SIZE) return;
          setPositioningColorByCategory((prev) => {
            const byCategory = { ...(prev[positionCategoryId] || {}) };
            byCategory[String(positioningSelectedCellIndex)] = colorId;
            return { ...prev, [positionCategoryId]: byCategory };
          });
          // After applying a color, require explicit re-selection for another change.
          setPositioningSelectedProductId(null);
          setPositioningSelectedCellIndex(null);
        };
        const handleDragStartFromPool = (event, itemId) => {
          event.dataTransfer.setData('text/plain', JSON.stringify({ itemId, source: 'pool' }));
          event.dataTransfer.effectAllowed = 'move';
        };
        const handleDragStartFromCell = (event, index, itemId) => {
          event.dataTransfer.setData('text/plain', JSON.stringify({ itemId, source: 'cell', index }));
          event.dataTransfer.effectAllowed = 'move';
        };
        const handleDropOnCell = (event, targetIndex) => {
          event.preventDefault();
          let payload = null;
          try {
            payload = JSON.parse(event.dataTransfer.getData('text/plain') || '{}');
          } catch {
            return;
          }
          const itemId = payload?.itemId;
          if (!itemId || !itemMap.has(itemId)) return;
          const next = [...cells];
          const sourceIndex = next.findIndex((id) => id === itemId);
          const movingFromCell = sourceIndex >= 0;
          const targetItemBeforeMove = next[targetIndex];
          if (sourceIndex >= 0) next[sourceIndex] = null;
          if (payload?.source === 'cell' && Number.isInteger(payload?.index) && payload.index >= 0 && payload.index < PAGE_SIZE && payload.index !== targetIndex) {
            const targetItem = next[targetIndex];
            if (targetItem) next[payload.index] = targetItem;
          }
          next[targetIndex] = itemId;
          updateLayout(next);
          if (positionCategoryId) {
            setPositioningColorByCategory((prev) => {
              const byCategory = { ...(prev[positionCategoryId] || {}) };
              const sourceKey = String(sourceIndex);
              const targetKey = String(targetIndex);
              const sourceColor = movingFromCell ? byCategory[sourceKey] : undefined;
              const targetColor = byCategory[targetKey];

              if (movingFromCell && sourceIndex !== targetIndex) {
                if (sourceColor) byCategory[targetKey] = sourceColor; else delete byCategory[targetKey];
                if (targetItemBeforeMove && targetColor) byCategory[sourceKey] = targetColor; else delete byCategory[sourceKey];
              } else if (!movingFromCell) {
                // Item comes from pool: target cell gets item without inheriting previous tile color.
                delete byCategory[targetKey];
              }
              return { ...prev, [positionCategoryId]: byCategory };
            });
          }
        };
        const handleDropOnPool = (event) => {
          event.preventDefault();
          let payload = null;
          try {
            payload = JSON.parse(event.dataTransfer.getData('text/plain') || '{}');
          } catch {
            return;
          }
          const itemId = payload?.itemId;
          if (!itemId || !itemMap.has(itemId)) return;
          const next = cells.map((id) => (id === itemId ? null : id));
          updateLayout(next);
        };
        const handleCellClick = (idx) => {
          const itemIdAtCell = cells[idx];
          const itemAtCell = itemIdAtCell ? itemMap.get(itemIdAtCell) : null;
          const hasPoolSelection = positioningSelectedPoolItemId && itemMap.has(positioningSelectedPoolItemId);
          const hasGridSelection = Number.isInteger(positioningSelectedCellIndex) && positioningSelectedCellIndex >= 0 && positioningSelectedCellIndex < PAGE_SIZE;
          const selectedItemId = hasGridSelection ? cells[positioningSelectedCellIndex] : null;

          if (hasPoolSelection && !itemIdAtCell) {
            const next = [...cells];
            next[idx] = positioningSelectedPoolItemId;
            updateLayout(next);
            setPositioningSelectedPoolItemId(null);
            return;
          }
          if (hasGridSelection && selectedItemId && itemMap.has(selectedItemId) && idx !== positioningSelectedCellIndex) {
            const sourceIndex = positioningSelectedCellIndex;
            const targetIndex = idx;
            const next = [...cells];
            const targetItemBeforeMove = next[targetIndex];
            next[sourceIndex] = targetItemBeforeMove;
            next[targetIndex] = selectedItemId;
            updateLayout(next);
            if (positionCategoryId) {
              setPositioningColorByCategory((prev) => {
                const byCategory = { ...(prev[positionCategoryId] || {}) };
                const sourceKey = String(sourceIndex);
                const targetKey = String(targetIndex);
                const sourceColor = byCategory[sourceKey];
                const targetColor = byCategory[targetKey];
                if (sourceColor) byCategory[targetKey] = sourceColor; else delete byCategory[targetKey];
                if (targetColor) byCategory[sourceKey] = targetColor; else delete byCategory[sourceKey];
                return { ...prev, [positionCategoryId]: byCategory };
              });
            }
            setPositioningSelectedProductId(null);
            setPositioningSelectedCellIndex(null);
            return;
          }
          if (itemAtCell) {
            if (positioningSelectedCellIndex === idx && positioningSelectedProductId === itemAtCell.id) {
              setPositioningSelectedProductId(null);
              setPositioningSelectedCellIndex(null);
              setPositioningSelectedPoolItemId(null);
              return;
            }
            setPositioningSelectedProductId(itemAtCell.id);
            setPositioningSelectedCellIndex(idx);
            setPositioningSelectedPoolItemId(null);
          }
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-pos-bg rounded-xl shadow-2xl max-w-[90%] w-full justify-center items-center mx-4 overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="absolute top-4 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500"
                onClick={closeProductPositioningModal}
                aria-label="Close positioning modal"
              >
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="flex-1 min-h-0 w-full p-6 flex flex-col pt-20">
                <div className="flex items-center gap-2 mb-4 shrink-0">
                  <button
                    type="button"
                    className="p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500 disabled:opacity-40 shrink-0"
                    disabled={!canPrevCategory}
                    onClick={() => {
                      if (!canPrevCategory) return;
                      setPositioningCategoryId(categories[categoryIndex - 1].id);
                      setPositioningSelectedProductId(null);
                      setPositioningSelectedCellIndex(null);
                    }}
                    aria-label="Previous category"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div ref={positioningCategoryTabsRef} className="flex-1 overflow-x-auto min-w-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex min-w-max border-b border-gray-300">
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          data-category-id={String(c.id)}
                          type="button"
                          onClick={() => { setPositioningCategoryId(c.id); setPositioningSelectedProductId(null); setPositioningSelectedCellIndex(null); setPositioningSelectedPoolItemId(null); }}
                          className={`px-4 py-2 text-sm font-medium border-r border-gray-300 ${c.id === positionCategoryId ? 'bg-green-600 text-white' : 'bg-pos-panel text-gray-200 active:bg-green-500'
                            }`}
                        >
                          {(c.name || '').toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500 disabled:opacity-40 shrink-0"
                    disabled={!canNextCategory}
                    onClick={() => {
                      if (!canNextCategory) return;
                      setPositioningCategoryId(categories[categoryIndex + 1].id);
                      setPositioningSelectedProductId(null);
                      setPositioningSelectedCellIndex(null);
                    }}
                    aria-label="Next category"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>

                <div className="flex justify-center gap-4 mb-4 shrink-0">
                  {Array.from({ length: pages }, (_, i) => (
                    <span key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-gray-300' : 'bg-gray-600'}`} />
                  ))}
                </div>

                <div className="flex-1 min-h-0 grid grid-cols-[200px_1fr] gap-4">
                  <div
                    className="border border-gray-300 bg-pos-panel/50 p-3 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-lg"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDropOnPool}
                  >
                    <div className="grid grid-cols-1 gap-2">
                      {allItems
                        .filter((it) => !cells.includes(it._positioningId))
                        .map((item) => (
                          <button
                            key={item._positioningId}
                            type="button"
                            draggable
                            onDragStart={(e) => handleDragStartFromPool(e, item._positioningId)}
                            onClick={() => {
                              setPositioningSelectedPoolItemId(item._positioningId);
                              setPositioningSelectedProductId(null);
                              setPositioningSelectedCellIndex(null);
                            }}
                            className={`text-left px-3 py-2 rounded border text-md ${item.type === 'product' ? 'bg-green-500/90 text-white border-green-600' : 'bg-amber-500/90 text-white border-amber-600'
                              } ${positioningSelectedPoolItemId === item._positioningId ? 'ring-2 ring-white' : ''}`}
                          >
                            <div className="truncate">{item.name}</div>
                            <div className="text-xs opacity-90">€{Number(item._positioningPrice ?? item.price ?? 0).toFixed(2)} · {item.type}</div>
                          </button>
                        ))}
                    </div>
                  </div>
                  <div className="grid gap-0 flex h-full justify-center items-center bg-pos-panel/30 rounded-lg overflow-hidden" style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))` }}>
                    {cells.map((itemId, idx) => {
                      const item = itemId ? itemMap.get(itemId) : null;
                      const selected = item && positioningSelectedProductId === item.id && positioningSelectedCellIndex === idx;
                      const selectedColorId = categoryColors[String(idx)];
                      const tileClass = item
                        ? tileClassByColorId(selectedColorId, item.type)
                        : 'bg-pos-panel/50';
                      return (
                        <div
                          key={item?.id || `empty-${idx}`}
                          role="button"
                          tabIndex={0}
                          className={`h-[55px] border border-gray-300 px-2 text-center text-md cursor-pointer ${tileClass} ${selected ? 'ring-2 ring-gray-300' : ''}`}
                          style={selected ? { boxShadow: 'inset 0 0 0 2px #000000' } : undefined}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropOnCell(e, idx)}
                          onClick={() => handleCellClick(idx)}
                          onKeyDown={(e) => e.key === 'Enter' && handleCellClick(idx)}
                        >
                          {item ? (
                            <div
                              draggable
                              onDragStart={(e) => handleDragStartFromCell(e, idx, item._positioningId)}
                              className="w-full h-full"
                            >
                              <div className="truncate text-md">{item.name}</div>
                              <div className="text-md">€{Number(item._positioningPrice ?? item.price ?? 0).toFixed(2)}</div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 shrink-0 pt-5 pb-5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-6 py-2 rounded-lg border border-gray-300 text-md font-medium text-gray-200 bg-pos-panel active:bg-green-500 disabled:opacity-50 disabled:pointer-events-none"
                      disabled={!Number.isInteger(positioningSelectedCellIndex)}
                      onClick={removeFromPlace}
                    >
                      {tr('control.functionButtons.removeFromPlace', 'Remove from place')}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {COLOR_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        disabled={!Number.isInteger(positioningSelectedCellIndex)}
                        onClick={() => applyColorToSelectedCell(option.id)}
                        className={`w-14 h-8 rounded border border-gray-300 text-md ${option.className} ${Number.isInteger(positioningSelectedCellIndex) &&
                          categoryColors[String(positioningSelectedCellIndex)] === option.id
                          ? 'ring-2 ring-gray-300'
                          : ''
                          }`}
                        aria-label={`Set tile color ${option.id}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="flex items-center text-md gap-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50"
                    disabled={savingPositioningLayout}
                    onClick={saveProductPositioningLayout}
                  >
                    <svg fill="#ffffff" width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" /></svg>
                    {savingPositioningLayout ? tr('control.saving', 'Saving...') : tr('control.save', 'Save')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Product search keyboard modal */}
      {showProductSearchKeyboard && subNavId === 'Products' && (
        <div className="fixed inset-0 z-10 flex items-end justify-center">
          <div className="relative bg-pos-bg rounded-t-xl shadow-2xl w-[90%] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-1 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={() => setShowProductSearchKeyboard(false)} aria-label="Close">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-2 shrink-0 pt-10 flex w-full justify-center">
              <KeyboardWithNumpad value={productSearch} onChange={setProductSearch} />
            </div>
          </div>
        </div>
      )}

      {/* Product row -> Subproducts modal */}
      {showProductSubproductsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative bg-pos-bg rounded-xl min-w-[600px] border border-pos-border shadow-2xl p-6 text-sm max-h-[90vh] overflow-auto [scrollbar-width:none]" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-2 right-4 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={closeProductSubproductsModal} aria-label="Close">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="space-y-4 mt-6">
              <Dropdown
                options={[
                  { value: '', label: tr('control.productSubproducts.withoutGroup', 'Without group') },
                  ...subproductGroups.map((g) => ({ value: g.id, label: g.name }))
                ]}
                value={productSubproductsGroupId}
                onChange={setProductSubproductsGroupId}
                className="w-full max-w-[200px]"
              />
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch min-h-[280px]">
                {/* Left: Available in group */}
                <div className="flex flex-col rounded-lg border border-pos-border bg-pos-panel/30 overflow-hidden min-w-0">
                  <div className="px-3 py-2 border-b border-pos-border bg-pos-panel/50 font-medium text-pos-text shrink-0">
                    {tr('control.productSubproducts.available', 'Available in group')}
                  </div>
                  <label className="flex items-center gap-2 px-3 py-2 border-b border-pos-border text-pos-text shrink-0 cursor-pointer active:bg-green-500">
                    <input
                      type="checkbox"
                      checked={productSubproductsAvailable.length > 0 && productSubproductsAvailable.every((sp) => productSubproductsLeftSelectedIds.has(sp.id))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProductSubproductsLeftSelectedIds(new Set(productSubproductsAvailable.map((sp) => sp.id)));
                        } else {
                          setProductSubproductsLeftSelectedIds(new Set());
                        }
                      }}
                      className="rounded"
                    />
                    <span>{tr('control.productSubproducts.selectAll', 'Select all')}</span>
                  </label>
                  <div
                    ref={productSubproductsLeftListRef}
                    className="flex-1 overflow-y-auto p-2 min-h-[350px] max-h-[350px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {!productSubproductsGroupId ? (
                      <div className="text-pos-muted px-2 py-4">{tr('control.productSubproducts.selectGroupFirst', 'Select a group above')}</div>
                    ) : productSubproductsAvailable.length === 0 ? (
                      <div className="text-pos-muted px-2 py-4">{tr('control.productSubproducts.allLinked', 'All subproducts in this group are linked')}</div>
                    ) : (
                      <ul className="space-y-1">
                        {productSubproductsAvailable.map((sp) => (
                          <li key={sp.id}>
                            <label className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer active:bg-green-500 text-pos-text">
                              <input
                                type="checkbox"
                                checked={productSubproductsLeftSelectedIds.has(sp.id)}
                                onChange={(e) => {
                                  setProductSubproductsLeftSelectedIds((prev) => {
                                    const next = new Set(prev);
                                    if (e.target.checked) next.add(sp.id);
                                    else next.delete(sp.id);
                                    return next;
                                  });
                                }}
                                className="rounded"
                              />
                              <span className="truncate">{sp.name}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="px-3 py-2 border-t border-pos-border shrink-0">
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center gap-2 py-2 rounded bg-green-600/80 active:bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAddProductSubproductLinks}
                      disabled={!productSubproductsLeftSelectedIds.size}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      {tr('control.productSubproducts.add', 'Add')}
                    </button>
                  </div>
                </div>

                {/* Center: transfer hint (optional visual spacer on desktop) */}
                <div className="hidden md:flex items-center justify-center text-pos-muted shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                </div>

                {/* Right: Linked to product */}
                <div className="flex flex-col rounded-lg border border-pos-border bg-pos-panel/30 overflow-hidden min-w-0">
                  <div className="px-3 py-2 border-b border-pos-border bg-pos-panel/50 font-medium text-pos-text shrink-0">
                    {tr('control.productSubproducts.linked', 'Linked to product')}
                  </div>
                  <label className={`flex items-center gap-2 px-3 py-2 border-b border-pos-border text-pos-text shrink-0 cursor-pointer active:bg-green-500 ${!productSubproductsLinked.length ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input
                      type="checkbox"
                      checked={productSubproductsLinked.length > 0 && productSubproductsLinked.every((l) => productSubproductsRightSelectedIds.has(l.subproductId))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProductSubproductsRightSelectedIds(new Set(productSubproductsLinked.map((l) => l.subproductId)));
                        } else {
                          setProductSubproductsRightSelectedIds(new Set());
                        }
                      }}
                      className="rounded"
                    />
                    <span>{tr('control.productSubproducts.selectAll', 'Select all')}</span>
                  </label>
                  <div
                    ref={productSubproductsListRef}
                    className="flex-1 overflow-y-auto p-2 min-h-[350px] max-h-[350px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {loadingProductSubproductsLinked ? null : productSubproductsLinked.length === 0 ? (
                      <div className="text-pos-muted px-2 py-4">{tr('control.productSubproducts.noLinkedYet', 'No subproducts linked yet.')}</div>
                    ) : (
                      <ul className="space-y-1">
                        {productSubproductsLinked.map((link) => (
                          <li key={link.subproductId}>
                            <label className="flex items-center justify-between gap-2 px-3 py-2 rounded cursor-pointer active:bg-green-500 text-pos-text group">
                              <div className="flex items-center gap-2 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={productSubproductsRightSelectedIds.has(link.subproductId)}
                                  onChange={(e) => {
                                    setProductSubproductsRightSelectedIds((prev) => {
                                      const next = new Set(prev);
                                      if (e.target.checked) next.add(link.subproductId);
                                      else next.delete(link.subproductId);
                                      return next;
                                    });
                                  }}
                                  className="rounded shrink-0"
                                  onClick={(ev) => ev.stopPropagation()}
                                />
                                <span className="truncate">{link.subproductName}</span>
                              </div>
                              <button
                                type="button"
                                className="p-1 rounded active:bg-green-500 text-pos-muted active:text-red-400 shrink-0 opacity-0 group-active:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeProductSubproductLink(link.subproductId);
                                }}
                                aria-label={tr('delete', 'Delete')}
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="px-3 py-2 border-t border-pos-border shrink-0">
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center gap-2 py-2 rounded bg-red-600/80 active:bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleRemoveProductSubproductLinks}
                      disabled={!productSubproductsRightSelectedIds.size}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      {tr('control.productSubproducts.remove', 'Remove')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center shrink-0">
              <button
                type="button"
                className="px-6 py-3 rounded-lg bg-green-600 text-white text-sm font-medium active:bg-green-500 disabled:opacity-50"
                onClick={handleSaveProductSubproducts}
                disabled={savingProductSubproducts || !productSubproductsProduct}
              >
                {savingProductSubproducts ? tr('control.saving', 'Saving...') : tr('control.save', 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New / Edit subproduct modal */}
      {showSubproductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative bg-pos-bg rounded-xl border border-pos-border shadow-2xl max-w-[90%] w-full justify-center items-center mx-4 overflow-hidden flex flex-col max-h-[90vh] text-sm" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-4 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={closeSubproductModal} aria-label="Close">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex-1 min-h-0 overflow-auto w-full">
              <div className="p-6 flex flex-col w-full text-sm pt-14 gap-3">
                {subproductSaveError ? (
                  <div className="w-full shrink-0">
                    <p role="alert" className="rounded-lg border border-rose-500/60 bg-rose-500/15 px-3 py-2 text-sm text-rose-100">
                      {subproductSaveError}
                    </p>
                  </div>
                ) : null}
                <div className="flex w-full flex-row flex-wrap gap-y-3">
                  <div className='flex flex-col gap-3 w-1/3'>
                    <div className="flex gap-2 w-full items-center">
                      <label className="block min-w-[110px] text-md font-medium text-gray-200 mb-2">{tr('control.subproductModal.name', 'Name :')} </label>
                      <input
                        type="text"
                        value={subproductName}
                        onChange={(e) => handleSubproductNameChange(e.target.value)}
                        onFocus={() => setSubproductActiveField('name')}
                        onClick={() => setSubproductActiveField('name')}
                        placeholder=""
                        className={`px-4 w-[150px] h-[40px] py-3 text-md border rounded-lg text-gray-200 caret-white ${subproductFieldErrors.name ? 'bg-rose-500/40 border-rose-500' : 'bg-pos-panel border-gray-300'}`}
                      />
                    </div>
                    <div className="flex gap-2 w-full items-center">
                      <label className="block min-w-[110px] text-md font-medium text-gray-200 mb-2">{tr('control.subproductModal.keyName', 'Key name :')} </label>
                      <input
                        type="text"
                        value={subproductKeyName}
                        onChange={(e) => { setSubproductKeyName(e.target.value); setSubproductFieldErrors((err) => ({ ...err, keyName: false })); }}
                        onFocus={() => setSubproductActiveField('keyName')}
                        onClick={() => setSubproductActiveField('keyName')}
                        placeholder=""
                        className={`px-4 w-[150px] h-[40px] py-3 text-md border rounded-lg text-gray-200 ${subproductFieldErrors.keyName ? 'bg-rose-500/40 border-rose-500' : 'bg-pos-panel border-gray-300'}`}
                      />
                    </div>
                    <div className="flex gap-2 w-full items-center">
                      <label className="block min-w-[110px] text-md font-medium text-gray-200 mb-2">{tr('control.subproductModal.productionName', 'Production name :')} </label>
                      <input
                        type="text"
                        value={subproductProductionName}
                        onChange={(e) => { setSubproductProductionName(e.target.value); setSubproductFieldErrors((err) => ({ ...err, productionName: false })); }}
                        onFocus={() => setSubproductActiveField('productionName')}
                        onClick={() => setSubproductActiveField('productionName')}
                        placeholder=""
                        className={`px-4 w-[150px] h-[40px] py-3 text-md border rounded-lg text-gray-200 ${subproductFieldErrors.productionName ? 'bg-rose-500/40 border-rose-500' : 'bg-pos-panel border-gray-300'}`}
                      />
                    </div>
                    <div className="flex gap-2 w-full items-center">
                      <label className="block min-w-[110px] text-md font-medium text-gray-200 mb-2">{tr('control.subproductModal.price', 'Price :')} </label>
                      <input
                        type="text"
                        value={subproductPrice}
                        onChange={(e) => setSubproductPrice(e.target.value)}
                        onFocus={() => setSubproductActiveField('price')}
                        onClick={() => setSubproductActiveField('price')}
                        placeholder=""
                        className="px-4 w-[150px] bg-pos-panel h-[40px] py-3 text-md border border-gray-300 rounded-lg text-gray-200"
                      />
                    </div>
                    <div className="flex gap-2 w-full items-center">
                      <label className="block min-w-[110px] text-md font-medium text-gray-200 mb-2">{tr('control.subproductModal.vatTakeOut', 'VAT Take out :')} </label>
                      <Dropdown options={SUBPRODUCT_VAT_OPTIONS} value={subproductVatTakeOut} onChange={(v) => { setSubproductVatTakeOut(v); setSubproductFieldErrors((err) => ({ ...err, vatTakeOut: false })); }} placeholder="--" className="text-md min-w-[150px]" hasError={subproductFieldErrors.vatTakeOut} />
                    </div>
                    <div className="flex gap-2 w-full items-center">
                      <label className="block min-w-[110px] text-md font-medium text-gray-200 mb-2">{tr('control.subproductModal.vatEatIn', 'VAT Eat in :')} </label>
                      <Dropdown options={SUBPRODUCT_VAT_OPTIONS} value={subproductVatEatIn} onChange={(v) => { setSubproductVatEatIn(v); setSubproductFieldErrors((err) => ({ ...err, vatEatIn: false })); }} placeholder="--" className="text-md min-w-[150px]" hasError={subproductFieldErrors.vatEatIn} />
                    </div>
                  </div>
                  <div className='flex flex-col gap-3 w-1/3'>
                    <div className="flex gap-2 w-full items-center">
                      <label className="block min-w-[100px] text-md font-medium text-gray-200 mb-2">{tr('control.subproductModal.group', 'Group :')} </label>
                      <Dropdown
                        options={subproductGroups.map((g) => ({ value: g.id, label: g.name }))}
                        value={subproductModalGroupId}
                        onChange={(v) => { setSubproductModalGroupId(v); setSubproductFieldErrors((err) => ({ ...err, group: false })); }}
                        placeholder="--"
                        className="text-md min-w-[150px]"
                        hasError={subproductFieldErrors.group}
                      />
                    </div>
                    <div className="flex gap-2 w-full items-center">
                      <label className="block min-w-[100px] text-md font-medium text-gray-200 mb-2">{tr('control.subproductModal.kioskPicture', 'Kiosk picture :')} </label>
                      <div className="w-[200px] flex items-center justify-start flex-wrap gap-2">
                        {!subproductKioskPicture ? (
                          <label className="px-4 py-2 border border-gray-300 rounded-lg text-gray-200 active:bg-green-500 cursor-pointer shrink-0 text-md">
                            {tr('control.subproductModal.select', 'Select')}
                            <input
                              type="file"
                              className="hidden focus:border-green-500 focus:outline-none"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file && file.type.startsWith('image/')) {
                                  const dataUrl = await new Promise((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onload = () => resolve(String(reader.result || ''));
                                    reader.onerror = () => reject(reader.error);
                                    reader.readAsDataURL(file);
                                  }).catch(() => '');
                                  if (dataUrl) setSubproductKioskPicture(dataUrl);
                                }
                                e.target.value = '';
                              }}
                            />
                          </label>
                        ) : (
                          <>
                            <img src={subproductKioskPicture} alt="Kiosk" className="w-16 h-16 object-cover rounded-lg border border-gray-300 shrink-0" />
                            <button
                              type="button"
                              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-200 active:bg-green-500 text-md shrink-0"
                              onClick={() => setSubproductKioskPicture('')}
                            >
                              {tr('control.subproductModal.remove', 'Remove')}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-1/3 items-center gap-3">
                    <label className="block text-md font-medium text-gray-200">{tr('control.subproductModal.attachTo', 'Attach To')}</label>
                    <div ref={subproductAttachToListRef} className="border border-gray-300 rounded-lg bg-pos-panel/30 w-full h-[220px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      <ul className="p-2">
                        {categories.length === 0 ? (
                          <li className="text-pos-muted text-md py-2 px-2">{tr('control.subproductModal.noCategoriesAvailable', 'No categories available')}</li>
                        ) : (
                          categories.map((c) => {
                            const attached = subproductAttachToCategoryIds.includes(c.id);
                            const toggle = () => setSubproductAttachToCategoryIds((prev) => attached ? prev.filter((id) => id !== c.id) : [...prev, c.id]);
                            return (
                              <li
                                key={c.id}
                                role="button"
                                tabIndex={0}
                                className={`text-md py-1.5 px-2 flex items-center gap-2 cursor-pointer rounded select-none ${attached ? 'text-gray-200 font-medium bg-pos-panel' : 'text-pos-muted'} active:bg-green-500`}
                                onClick={toggle}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
                                aria-label={attached ? tr('control.subproductModal.attachedToHint', 'Attached to {name}. Click to detach.').replace('{name}', c.name || '') : tr('control.subproductModal.attachToHint', 'Click to attach to {name}').replace('{name}', c.name || '')}
                              >
                                <span className="uppercase font-medium truncate flex-1 min-w-0">{(c.name || '').toUpperCase()}</span>
                                <input
                                  type="checkbox"
                                  checked={attached}
                                  onChange={() => { }}
                                  onClick={(e) => { e.stopPropagation(); toggle(); }}
                                  className="w-5 h-5 rounded border-gray-300 cursor-pointer shrink-0"
                                  aria-label={attached ? tr('control.subproductModal.detachFromHint', 'Detach from {name}').replace('{name}', c.name || '') : tr('control.subproductModal.attachToCategoryHint', 'Attach to {name}').replace('{name}', c.name || '')}
                                />
                              </li>
                            );
                          })
                        )}
                      </ul>
                    </div>
                    <div className="flex w-full justify-around gap-2 items-center pt-2">
                      <button type="button" className="p-2 rounded-lg text-pos-muted active:text-pos-text active:bg-green-500 border border-gray-300" aria-label="Scroll attach list up" onClick={() => scrollSubproductAttachToByPage('up')}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                      </button>
                      <button type="button" className="p-2 rounded-lg text-pos-muted active:text-pos-text active:bg-green-500 border border-gray-300" aria-label="Scroll attach list down" onClick={() => scrollSubproductAttachToByPage('down')}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center shrink-0">
              <button
                type="button"
                className="flex items-center text-md gap-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50"
                disabled={savingSubproduct}
                onClick={handleSaveSubproduct}
              >
                <svg fill="#ffffff" width="14px" height="14px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M-5.732,2.97-7.97.732a2.474,2.474,0,0,0-1.483-.7A.491.491,0,0,0-9.591,0H-18.5A2.5,2.5,0,0,0-21,2.5v11A2.5,2.5,0,0,0-18.5,16h11A2.5,2.5,0,0,0-5,13.5V4.737A2.483,2.483,0,0,0-5.732,2.97ZM-13,1V5.455h-3.591V1Zm-4.272,14V10.545h8.544V15ZM-6,13.5A1.5,1.5,0,0,1-7.5,15h-.228V10.045a.5.5,0,0,0-.5-.5h-9.544a.5.5,0,0,0-.5.5V15H-18.5A1.5,1.5,0,0,1-20,13.5V2.5A1.5,1.5,0,0,1-18.5,1h.909V5.955a.5.5,0,0,0,.5.5h7.5a.5.5,0,0,0,.5-.5v-4.8a1.492,1.492,0,0,1,.414.285l2.238,2.238A1.511,1.511,0,0,1-6,4.737Z" transform="translate(21)" />
                </svg>
                {tr('control.save', 'Save')}
              </button>
            </div>
            <div className="shrink-0">
              <KeyboardWithNumpad value={subproductKeyboardValue} onChange={subproductKeyboardOnChange} />
            </div>
          </div>
        </div>
      )}

      {/* Manage Groups modal */}
      {showManageGroupsModal && (() => {
        const sortedGroups = [...subproductGroups].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-pos-bg rounded-xl shadow-2xl max-w-[90%] w-full justify-center items-center mx-4 overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="absolute top-4 right-4 z-10 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500" onClick={() => { setShowManageGroupsModal(false); setSelectedManageGroupId(null); }} aria-label="Close">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="flex-1 min-h-0 overflow-auto w-full">
                <div className="p-6 flex flex-col space-y-6 w-full justify-center items-center pt-14">
                  <div className="w-full flex flex-col justify-center items-center gap-5 max-w-xl">
                    <div className="flex gap-2 w-full items-center justify-center flex-wrap">
                      <label className="block text-md pr-[20px] font-medium text-gray-200 mb-2">{tr('control.subproducts.manageGroups.newGroup', 'New group :')} </label>
                      <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder={tr('control.subproducts.manageGroups.newGroupPlaceholder', 'New group name')}
                        className="px-4 w-[200px] bg-pos-panel h-[40px] py-3 text-md border border-gray-300 rounded-lg text-gray-200 placeholder:text-gray-500"
                      />
                      <button type="button" className="flex ml-20 items-center text-md gap-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50 shrink-0" disabled={savingGroup} onClick={handleAddGroup}>
                        {tr('control.subproducts.manageGroups.add', 'Add')}
                      </button>
                    </div>
                    <div
                      ref={manageGroupsListRef}
                      className={`w-full border border-gray-300 max-h-[250px] min-h-[250px] overflow-y-auto rounded-lg overflow-hidden bg-pos-panel/30 cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${sortedGroups.length === 0 ? 'min-h-[180px]' : ''}`}
                      onScroll={updateManageGroupsPaginationState}
                      onPointerDown={(e) => {
                        if (e.pointerType === 'mouse' && e.button !== 0) return;
                        // Do not capture pointer for drag-scroll when interacting with controls — capture
                        // would steal clicks from edit/delete (and other) buttons inside the list.
                        const t = e.target;
                        if (t && typeof t.closest === 'function' && t.closest('button, input, textarea, select, a, label')) return;
                        const el = manageGroupsListRef.current;
                        if (!el) return;
                        manageGroupsDragRef.current = {
                          active: true,
                          startY: e.clientY,
                          startScrollTop: el.scrollTop,
                          pointerId: e.pointerId,
                        };
                        e.currentTarget.setPointerCapture?.(e.pointerId);
                      }}
                      onPointerMove={(e) => {
                        const drag = manageGroupsDragRef.current;
                        if (!drag.active) return;
                        const el = manageGroupsListRef.current;
                        if (!el) return;
                        const deltaY = e.clientY - drag.startY;
                        el.scrollTop = drag.startScrollTop - deltaY;
                      }}
                      onPointerUp={(e) => {
                        const drag = manageGroupsDragRef.current;
                        if (!drag.active) return;
                        manageGroupsDragRef.current = { active: false, startY: 0, startScrollTop: 0, pointerId: null };
                        e.currentTarget.releasePointerCapture?.(e.pointerId);
                        updateManageGroupsPaginationState();
                      }}
                      onPointerCancel={(e) => {
                        const drag = manageGroupsDragRef.current;
                        if (!drag.active) return;
                        manageGroupsDragRef.current = { active: false, startY: 0, startScrollTop: 0, pointerId: null };
                        e.currentTarget.releasePointerCapture?.(e.pointerId);
                        updateManageGroupsPaginationState();
                      }}
                    >
                      <table className="w-full border-collapse">
                        <tbody>
                          {sortedGroups.length === 0 ? (
                            <tr>
                              <td colSpan={2} className="py-10 px-4 align-middle">
                                <div className="flex flex-col items-center justify-center gap-3 text-center text-pos-muted" role="status">
                                  <svg className="w-24 h-24 shrink-0" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <path
                                      d="M20 28h22l6 8h30a6 6 0 016 6v36a6 6 0 01-6 6H26a6 6 0 01-6-6V34a6 6 0 016-6z"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                      strokeLinejoin="round"
                                      opacity="0.45"
                                    />
                                    <path
                                      d="M26 44h44M26 56h32M26 68h24"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeDasharray="5 5"
                                      opacity="0.35"
                                    />
                                    <circle cx="68" cy="36" r="16" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
                                    <path d="M62 36h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
                                  </svg>
                                  <p className="text-md max-w-sm text-gray-400">
                                    {tr('control.subproducts.manageGroups.noGroups', 'No groups yet. Add one above.')}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            sortedGroups.map((grp) => (
                              <tr
                                key={grp.id}
                                className={`border-b border-gray-300 w-full items-center min-h-[40px] flex justify-between ${selectedManageGroupId === grp.id ? 'bg-pos-panel/70' : ''} active:bg-green-500`}
                                onClick={(e) => { if (!e.target.closest('button')) setSelectedManageGroupId(grp.id); }}
                              >
                                <td className="flex-1 min-w-0 py-2 px-3">
                                  {editingGroupId === grp.id ? (
                                    <div className="flex items-center w-full justify-between gap-2 flex-wrap">
                                      <input
                                        type="text"
                                        value={editingGroupName}
                                        onChange={(e) => setEditingGroupName(e.target.value)}
                                        className="flex min-w-[200px] max-w-[200px] px-4 h-[40px] py-3 bg-pos-panel border border-gray-300 rounded-lg text-gray-200 text-md"
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <div className="flex items-center gap-2 shrink-0">
                                        <button type="button" className="flex items-center text-md gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium active:bg-green-500 disabled:opacity-50 shrink-0" disabled={savingGroup} onClick={(e) => { e.stopPropagation(); handleSaveEditGroup(); }}>{tr('control.save', 'Save')}</button>
                                        <button type="button" className="flex items-center text-md gap-2 px-4 py-2 rounded-lg bg-pos-panel border border-gray-300 text-gray-200 font-medium active:bg-green-500 shrink-0" onClick={(e) => { e.stopPropagation(); setEditingGroupId(null); setEditingGroupName(''); }}>{tr('cancel', 'Cancel')}</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="font-medium text-md text-gray-200">{grp.name}</span>
                                  )}
                                </td>
                                {editingGroupId !== grp.id && (
                                  <td className="relative z-[1] py-2 px-3 text-right flex items-center gap-1 shrink-0">
                                    <button type="button" className="p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500 inline-flex align-middle" onClick={(e) => { e.stopPropagation(); setEditingGroupId(grp.id); setEditingGroupName(grp.name || ''); }} aria-label={tr('control.edit', 'Edit')}>
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button type="button" className="p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500 inline-flex align-middle" onClick={(e) => { e.stopPropagation(); setDeleteConfirmGroupId(grp.id); }} aria-label={tr('delete', 'Delete')}>
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex w-full justify-around gap-4 items-center pt-2">
                      <button
                        type="button"
                        className="p-2 rounded-lg text-pos-muted active:text-pos-text active:bg-green-500 border border-gray-300 disabled:opacity-40 disabled:pointer-events-none"
                        disabled={savingGroup || !canManageGroupsPageUp}
                        onClick={() => pageManageGroups('up')}
                        aria-label="Previous page"
                      >
                        <img src={publicAssetUrl('/arrow-up.svg')} alt="" className="w-5 h-5 invert opacity-90" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-lg text-pos-muted active:text-pos-text active:bg-green-500 border border-gray-300 disabled:opacity-40 disabled:pointer-events-none"
                        disabled={savingGroup || !canManageGroupsPageDown}
                        onClick={() => pageManageGroups('down')}
                        aria-label="Next page"
                      >
                        <img src={publicAssetUrl('/arrow-down.svg')} alt="" className="w-5 h-5 invert opacity-90" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <KeyboardWithNumpad
                  value={editingGroupId ? editingGroupName : newGroupName}
                  onChange={editingGroupId ? setEditingGroupName : setNewGroupName}
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* Logout confirmation modal — same style as delete modal */}
      <DeleteConfirmModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        message={tr('logoutConfirm', 'Are you sure you want to log out?')}
      />
    </>
  );
}
