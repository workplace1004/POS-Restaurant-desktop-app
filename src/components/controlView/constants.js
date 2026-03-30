export { POS_API_PREFIX as API } from '../../lib/apiOrigin.js';

/** Seeded KDS admin credential (same id as `seed.js`); hidden from Configuration → Kitchen list. */
export const KITCHEN_ADMIN_CREDENTIAL_ID = 'kitchen-kds-admin';

export const CONTROL_SIDEBAR_ITEMS = [
  { id: 'personalize', label: 'Personalize Cash Register', icon: 'monitor' },
  // { id: 'reports', label: 'Reports', icon: 'chart' },
  { id: 'users', label: 'Users', icon: 'users' },
  { id: 'language', label: 'Language', icon: 'language' }
];

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'nl', label: 'Dutch' },
  { value: 'fr', label: 'French' },
  { value: 'tr', label: 'Turkish' }
];

export const TOP_NAV_ITEMS = [
  { id: 'categories-products', label: 'Categories and products', icon: 'box' },
  { id: 'cash-register', label: 'Cash Register Settings', icon: 'gear' },
  { id: 'external-devices', label: 'External Devices', icon: 'printer' },
  { id: 'tables', label: 'Tables', icon: 'table' }
];

export const SUB_NAV_ITEMS = [
  'Price Groups',
  'Categories',
  'Products',
  'Subproducts',
  'Discounts',
  'Kitchen'
];

export const CASH_REGISTER_SUB_NAV_ITEMS = [
  'Template Settings',
  'Device Settings',
  'System Settings',
  'Payment types',
  'Production messages'
];

export const EXTERNAL_DEVICES_SUB_NAV_ITEMS = [
  'Printer',
  'Price Display',
  'RFID Reader',
  'Barcode Scanner',
  'Credit Card',
  'Libra',
  'Cashmatic',
  'Payworld'
];

export const PRINTER_TAB_DEFS = [
  { id: 'General', labelKey: 'control.printerTabs.general', fallback: 'General' },
  { id: 'Final tickets', labelKey: 'control.printerTabs.finalTickets', fallback: 'Final tickets' },
  { id: 'Production Tickets', labelKey: 'control.printerTabs.productionTickets', fallback: 'Production Tickets' },
  { id: 'Labels', labelKey: 'control.printerTabs.labels', fallback: 'Labels' },
];

export const PRINTING_ORDER_OPTIONS = [
  { value: 'as-registered', labelKey: 'control.external.asRegistered', fallback: 'As Registered' },
  { value: 'reverse', labelKey: 'control.external.reverse', fallback: 'Reverse' }
];

export const PRINTER_DISABLED_OPTIONS = [
  { value: 'disabled', labelKey: 'control.external.disabled', fallback: 'Disabled' }
];

export const SUBPRODUCT_VAT_OPTIONS = [
  { value: '', label: '--' },
  { value: '0', label: '0%' },
  { value: '6', label: '6%' },
  { value: '12', label: '12%' },
  { value: '21', label: '21%' }
];

export const GROUPING_RECEIPT_OPTIONS = [
  { value: 'enable', labelKey: 'control.external.enable', fallback: 'Enable' },
  { value: 'disable', labelKey: 'control.external.disable', fallback: 'Disable' }
];

export const SCHEDULED_ORDERS_PRODUCTION_FLOW_OPTIONS = [
  { value: 'scheduled-orders-print', labelKey: 'control.device.scheduledOrders.scheduledOrdersPrint', fallback: 'Scheduled orders…' },
  { value: 'default', labelKey: 'control.device.scheduledOrders.default', fallback: 'Default' }
];

export const SCHEDULED_ORDERS_LOADING_OPTIONS = [
  { value: '0', labelKey: 'control.device.scheduledOrders.daysAgo0', fallback: '0 days ago' },
  { value: '1', labelKey: 'control.device.scheduledOrders.daysAgo1', fallback: '1 day ago' },
  { value: '7', labelKey: 'control.device.scheduledOrders.daysAgo7', fallback: '7 days ago' },
  { value: '30', labelKey: 'control.device.scheduledOrders.daysAgo30', fallback: '30 days ago' }
];

export const SCHEDULED_ORDERS_MODE_OPTIONS = [
  { value: 'labels', labelKey: 'control.device.scheduledOrders.labels', fallback: 'Labels' },
  { value: 'list', labelKey: 'control.device.scheduledOrders.list', fallback: 'List' }
];

export const SCHEDULED_ORDERS_INVOICE_LAYOUT_OPTIONS = [
  { value: 'standard', labelKey: 'control.device.scheduledOrders.standard', fallback: 'Standard' },
  { value: 'compact', labelKey: 'control.device.scheduledOrders.compact', fallback: 'Compact' }
];

export const SCHEDULED_ORDERS_CHECKOUT_AT_OPTIONS = [
  { value: 'delivery-note', labelKey: 'control.device.scheduledOrders.deliveryNote', fallback: 'Delivery note' },
  { value: 'order-date', labelKey: 'control.device.scheduledOrders.orderDate', fallback: 'Order date' }
];

export const PRICE_DISPLAY_TYPE_OPTIONS = [
  { value: 'disabled', labelKey: 'control.external.disabled', fallback: 'Disabled' }
];

export const RFID_READER_TYPE_OPTIONS = [
  { value: 'disabled', labelKey: 'control.external.disabled', fallback: 'Disabled' },
  { value: 'serial', labelKey: 'control.external.serial', fallback: 'Serial' },
  { value: 'usb-nfc', labelKey: 'control.external.rfidReaderType.usbNfc', fallback: 'USB NFC' }
];

export const BARCODE_SCANNER_TYPE_OPTIONS = [
  { value: 'disabled', labelKey: 'control.external.disabled', fallback: 'Disabled' },
  { value: 'serial', labelKey: 'control.external.serial', fallback: 'Serial' },
  { value: 'keyboard-input', labelKey: 'control.external.barcodeScannerType.keyboardInput', fallback: 'Keyboard input' },
  { value: 'tcp-ip', labelKey: 'control.external.barcodeScannerType.tcpIp', fallback: 'TCP / IP' }
];

export const CREDIT_CARD_TYPE_OPTIONS = [
  { value: 'disabled', labelKey: 'control.external.disabled', fallback: 'Disabled' },
  { value: 'payworld', labelKey: 'control.external.creditCardType.payworld', fallback: 'Payworld' },
  { value: 'viva-wallet', labelKey: 'control.external.creditCardType.vivaWallet', fallback: 'Viva wallet' }
];

export const SCALE_TYPE_OPTIONS = [
  { value: 'disabled', labelKey: 'control.external.disabled', fallback: 'Disabled' },
  { value: 'toshiba-sl4700', labelKey: 'control.external.scaleType.toshibaSl4700', fallback: 'Toshiba SL4700' },
  { value: 'marques-b0', labelKey: 'control.external.scaleType.marquesB0', fallback: 'Marques B0' },
  { value: 'cas-protocol', labelKey: 'control.external.scaleType.casProtocol', fallback: 'CAS Protocol' },
  { value: 'aurora', labelKey: 'control.external.scaleType.aurora', fallback: 'Aurora' },
  { value: 'longfly', labelKey: 'control.external.scaleType.longfly', fallback: 'Longfly' },
  { value: 'dollar', labelKey: 'control.external.scaleType.dollar', fallback: 'Dollar' },
  { value: 'elzab', labelKey: 'control.external.scaleType.elzab', fallback: 'Elzab' },
  { value: 'marques-mobba-mode-a', labelKey: 'control.external.scaleType.marquesMobbaModeA', fallback: 'Marques Mobba Mode A' },
  { value: 'adam-azextra', labelKey: 'control.external.scaleType.adamAzextra', fallback: 'Adam AZextra' },
  { value: 'dialog-06', labelKey: 'control.external.scaleType.dialog06', fallback: 'Dialog 06' }
];

export const SCALE_PORT_OPTIONS = [
  { value: '', label: '' },
  { value: 'COM 1', label: 'COM 1' },
  { value: 'COM 2', label: 'COM 2' },
  { value: 'COM 3', label: 'COM 3' },
  { value: 'COM 4', label: 'COM 4' }
];

export const REPORT_TABS = [
  { id: 'financial', label: 'Financial Reports', icon: 'document' },
  { id: 'user', label: 'User Reports', icon: 'person' },
  { id: 'periodic', label: 'Periodic Reports', icon: 'chart' },
  { id: 'settings', label: 'Settings', icon: 'gear' }
];

export const REPORT_GENERATE_UNTIL_OPTIONS = [
  { value: 'current-time', labelKey: 'control.reports.currentTime', fallback: 'Current time' }
];

export const PERIODIC_REPORT_TIME_OPTIONS = Array.from({ length: 25 }, (_, i) => {
  const h = i === 24 ? '24' : String(i).padStart(2, '0');
  const label = i === 24 ? '24:00' : `${h}:00`;
  return { value: label, label };
});

export const USER_AVATAR_COLORS = ['#ef4444', '#22c55e', '#38bdf8', '#ec4899', '#a78bfa'];
// User modal privilege avatars: blue, green, yellow, red, gray, dark gray, orange, magenta, pink
export const USER_PRIVILEGE_AVATAR_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#9ca3af', '#4b5563', '#f97316', '#d946ef', '#f472b6'];

export const USER_PRIVILEGE_OPTIONS = [
  { id: 'roundTables', label: 'Rounding tables:' },
  { id: 'adjustCustomers', label: 'Customize customers:' },
  { id: 'openDrawer', label: 'Open drawer:' },
  { id: 'discount', label: 'Discount:' },
  { id: 'tableReturns', label: 'Table returns:' },
  { id: 'historyReturns', label: 'History of returns:' },
  { id: 'looseReturns', label: 'Individual returns:' },
  { id: 'showInSellerList', label: 'Show in seller list:' },
  { id: 'cancelPlannedOrders', label: 'Canceling planned orders:' },
  { id: 'cashMachineReceiveManually', label: 'With cash machine recieve cash manually:' },
  { id: 'createNewCustomer', label: 'Create new customer:' },
  { id: 'revenueVisible', label: 'Turnover visible:' }
];

export const DEFAULT_USER_PRIVILEGES = Object.fromEntries(USER_PRIVILEGE_OPTIONS.map((p) => [p.id, true]));

export const DISCOUNT_TRIGGER_OPTIONS = [
  { value: 'number', label: 'Number' },
  { value: 'weight', label: 'Weight' },
  { value: 'min-amount', label: 'Minimum amount' },
  { value: 'time', label: 'Time' }
];

export const DISCOUNT_TYPE_OPTIONS = [
  { value: 'amount', label: 'Amount' },
  { value: 'percent', label: 'Percent' },
  { value: 'free_products', label: 'Free products' },
  { value: 'number', label: '+ Number' },
  { value: 'weight', label: '+ Weight' },
  { value: 'different_price_group', label: 'Different price group' },
];

export const DISCOUNT_ON_OPTIONS = [
  { value: 'products', label: 'Products' },
  { value: 'categories', label: 'Categories' },
  { value: 'all-products', label: 'All products' }
];

export const REPORT_SETTINGS_ROWS = [
  { id: 'category-totals', labelKey: 'control.reports.settings.categoryTotals', fallback: 'Category totals:' },
  { id: 'product-totals', labelKey: 'control.reports.settings.productTotals', fallback: 'Product totals:' },
  { id: 'vat-totals', labelKey: 'control.reports.settings.vatTotals', fallback: 'VAT totals:' },
  { id: 'payments', labelKey: 'control.reports.settings.payments', fallback: 'Payments:' },
  { id: 'ticket-types', labelKey: 'control.reports.settings.ticketTypes', fallback: 'Ticket types:' },
  { id: 'eat-in-take-out', labelKey: 'control.reports.settings.eatInTakeOut', fallback: 'Eat-in / Take-out:' },
  { id: 'open-tables', labelKey: 'control.reports.settings.openTables', fallback: 'Open tables:' },
  { id: 'hour-totals', labelKey: 'control.reports.settings.hourTotals', fallback: 'Hour totals:' },
  { id: 'hour-totals-per-user', labelKey: 'control.reports.settings.hourTotalsPerUser', fallback: 'Hour totals per user:' }
];

export const DEFAULT_REPORT_SETTINGS = Object.fromEntries(
  REPORT_SETTINGS_ROWS.map((row) => {
    const allChecked = ['vat-totals', 'payments', 'ticket-types', 'eat-in-take-out'].includes(row.id);
    return [row.id, { z: allChecked, x: allChecked, periodic: allChecked }];
  })
);

export const DEFAULT_PRINTERS = [
  { id: 'p1', name: 'RP4xx Series 200DPI TSC', isDefault: false, sortOrder: 0 },
  { id: 'p2', name: 'ip printer', isDefault: true, sortOrder: 1 },
  { id: 'p3', name: 'Xprinter XP-420B', isDefault: false, sortOrder: 2 },
  { id: 'p4', name: 'bar printer', isDefault: false, sortOrder: 3 },
  { id: 'p5', name: 'extra kitchen printer', isDefault: false, sortOrder: 4 },
  { id: 'p6', name: 'extra printer', isDefault: false, sortOrder: 5 }
];

export const VAT_OPTIONS = [
  { value: 'standard', labelKey: 'control.external.standard', fallback: 'Standard' },
  { value: 'take-out', labelKey: 'control.external.takeOut', fallback: 'Take-out' },
  { value: 'eat-in', labelKey: 'control.external.eatIn', fallback: 'Eat-in' }
];

export const DEVICE_SETTINGS_TABS = [
  'General',
  'Printer',
  'Category display',
  'Orders in waiting',
  'Scheduled orders',
  'Option buttons',
  'Function buttons'
];
export const DEVICE_SETTINGS_TAB_LABEL_KEYS = {
  General: 'control.deviceSettingsTab.general',
  Printer: 'control.deviceSettingsTab.printer',
  'Category display': 'control.deviceSettingsTab.categoryDisplay',
  'Orders in waiting': 'control.deviceSettingsTab.ordersInWaiting',
  'Scheduled orders': 'control.deviceSettingsTab.scheduledOrders',
  'Option buttons': 'control.deviceSettingsTab.optionButtons',
  'Function buttons': 'control.deviceSettingsTab.functionButtons'
};

export const FUNCTION_BUTTON_ITEMS = [
  { id: 'tables', labelKey: 'control.functionButton.tables', fallbackLabel: 'Tafels' },
  { id: 'weborders', labelKey: 'control.functionButton.weborders', fallbackLabel: 'Weborders' },
  { id: 'in-wacht', labelKey: 'control.functionButton.inWaiting', fallbackLabel: 'In Wacht' },
  { id: 'geplande-orders', labelKey: 'control.functionButton.scheduledOrders', fallbackLabel: 'Geplande orders' },
  { id: 'reservaties', labelKey: 'control.functionButton.reservations', fallbackLabel: 'Reservaties' },
  { id: 'verkopers', labelKey: 'control.functionButton.sellers', fallbackLabel: 'Verkopers' }
];

export const FUNCTION_BUTTON_SLOT_COUNT = 4;
export const FUNCTION_BUTTON_ITEM_IDS = FUNCTION_BUTTON_ITEMS.map((item) => item.id);
export const FUNCTION_BUTTON_ITEM_BY_ID = Object.fromEntries(
  FUNCTION_BUTTON_ITEMS.map((item) => [item.id, item])
);

export const OPTION_BUTTON_ITEMS = [
  { id: 'extra-bc-bedrag', labelKey: 'control.optionButton.extraBcAmount', fallbackLabel: 'Extra BC amount' },
  { id: 'bc-refund', labelKey: 'control.optionButton.bcRefund', fallbackLabel: 'BC Refund' },
  { id: 'stock-retour', labelKey: 'control.optionButton.stockRetour', fallbackLabel: 'Stock return' },
  { id: 'product-labels', labelKey: 'control.optionButton.productLabels', fallbackLabel: 'Product Labels' },
  { id: 'ticket-afdrukken', labelKey: 'control.optionButton.printTicket', fallbackLabel: 'Add ticket' },
  { id: 'tegoed', labelKey: 'control.optionButton.credit', fallbackLabel: 'Credit' },
  { id: 'tickets-optellen', labelKey: 'control.optionButton.sumTickets', fallbackLabel: 'Ticket To' },
  { id: 'product-info', labelKey: 'control.optionButton.productInfo', fallbackLabel: 'Product info' },
  { id: 'personeel-ticket', labelKey: 'control.optionButton.staffTicket', fallbackLabel: 'Staff consumables' },
  { id: 'productie-bericht', labelKey: 'control.optionButton.productionMessage', fallbackLabel: 'Production message' },
  { id: 'prijs-groep', labelKey: 'control.optionButton.priceGroup', fallbackLabel: 'Price group' },
  { id: 'discount', labelKey: 'control.optionButton.discount', fallbackLabel: 'Discount' },
  { id: 'kadobon', labelKey: 'control.optionButton.giftVoucher', fallbackLabel: 'Gift voucher' },
  { id: 'various', labelKey: 'control.optionButton.various', fallbackLabel: 'Miscellaneous' },
  { id: 'plu', labelKey: 'control.optionButton.plu', fallbackLabel: 'PLU' },
  { id: 'product-zoeken', labelKey: 'control.optionButton.searchProduct', fallbackLabel: 'Search Product' },
  { id: 'lade', labelKey: 'control.optionButton.drawer', fallbackLabel: 'Drawer' },
  { id: 'klanten', labelKey: 'control.optionButton.customers', fallbackLabel: 'Customers' },
  { id: 'historiek', labelKey: 'control.optionButton.history', fallbackLabel: 'History' },
  { id: 'subtotaal', labelKey: 'control.optionButton.subtotal', fallbackLabel: 'Subtotaal' },
  { id: 'terugname', labelKey: 'control.optionButton.return', fallbackLabel: 'Return name' },
  { id: 'meer', labelKey: 'control.optionButton.more', fallbackLabel: 'Meer...' },
  { id: 'eat-in-take-out', labelKey: 'control.optionButton.eatInTakeOut', fallbackLabel: 'Take Out' },
  { id: 'externe-apps', labelKey: 'control.optionButton.externalApps', fallbackLabel: 'External Apps' },
  { id: 'voor-verpakken', labelKey: 'control.optionButton.forPacking', fallbackLabel: 'Pre-packaging' },
  { id: 'leeggoed-terugnemen', labelKey: 'control.optionButton.depositReturn', fallbackLabel: 'Return empty containers' },
  { id: 'webshop-tijdsloten', labelKey: 'control.optionButton.webshopTimeslots', fallbackLabel: 'Webshop time slots' }
];
export const OPTION_BUTTON_SLOT_COUNT = 28;
export const OPTION_BUTTON_LOCKED_ID = 'meer';
export const OPTION_BUTTON_ITEM_IDS = OPTION_BUTTON_ITEMS.map((item) => item.id);
export const OPTION_BUTTON_ITEM_BY_ID = Object.fromEntries(
  OPTION_BUTTON_ITEMS.map((item) => [item.id, item])
);
export const DEFAULT_OPTION_BUTTON_LAYOUT = [
  'extra-bc-bedrag', '', 'bc-refund', 'stock-retour', 'product-labels', '', '',
  'ticket-afdrukken', '', 'tegoed', 'tickets-optellen', '', 'product-info', 'personeel-ticket',
  'productie-bericht', 'prijs-groep', 'discount', 'kadobon', 'various', 'plu', 'product-zoeken',
  'lade', 'klanten', 'historiek', 'subtotaal', 'terugname', '', 'meer'
];
export const SYSTEM_SETTINGS_TABS = ['General', 'Prices', 'Ticket'];
export const SYSTEM_SETTINGS_TAB_LABEL_KEYS = {
  General: 'control.systemSettingsTab.general',
  Prices: 'control.systemSettingsTab.prices',
  Ticket: 'control.systemSettingsTab.ticket'
};

export const LEEGGOED_OPTIONS = [
  { value: 'by-customers-name', labelKey: 'control.sys.deposit.byCustomersName', fallback: 'By customers name' },
  { value: 'other', labelKey: 'control.sys.deposit.other', fallback: 'Other' }
];

export const SAVINGS_DISCOUNT_OPTIONS = [
  { value: '', labelKey: 'control.external.disabled', fallback: 'Disabled' },
  { value: 'percentage', labelKey: 'control.sys.savings.percentage', fallback: 'Percentage' },
  { value: 'amount', labelKey: 'control.sys.savings.amount', fallback: 'Amount' }
];

export const TICKET_VOUCHER_VALIDITY_OPTIONS = [
  { value: '1', labelKey: 'control.sys.voucher.month1', fallback: '1 month' },
  { value: '3', labelKey: 'control.sys.voucher.month3', fallback: '3 months' },
  { value: '6', labelKey: 'control.sys.voucher.month6', fallback: '6 months' },
  { value: '12', labelKey: 'control.sys.voucher.month12', fallback: '12 months' }
];

export const TICKET_SCHEDULED_PRINT_MODE_OPTIONS = [
  { value: 'Production ticket', labelKey: 'control.sys.scheduledPrint.productionTicket', fallback: 'Production ticket' },
  { value: 'label-small', labelKey: 'control.sys.scheduledPrint.smallLabel', fallback: 'Small label' },
  { value: 'label-large', labelKey: 'control.sys.scheduledPrint.largeLabel', fallback: 'Large label' },
  { value: 'label-Production ticket + Small label', labelKey: 'control.sys.scheduledPrint.prodPlusSmall', fallback: 'Production ticket + Small label' },
  { value: 'Production ticket + Large label', labelKey: 'control.sys.scheduledPrint.prodPlusLarge', fallback: 'Production ticket + Large label' }
];

export const TICKET_SCHEDULED_CUSTOMER_SORT_OPTIONS = [
  { value: 'as-registered', labelKey: 'control.external.asRegistered', fallback: 'As Registered' },
  { value: 'Alphabetical first name', labelKey: 'control.sys.customerSort.alphabeticalFirstName', fallback: 'Alphabetical first name' },
  { value: 'Alphabetical last name', labelKey: 'control.sys.customerSort.alphabeticalLastName', fallback: 'Alphabetical last name' }
];

export const BARCODE_TYPE_OPTIONS = [
  { value: 'Code39', label: 'Code39' },
  { value: 'Code93', label: 'Code93' },
  { value: 'Code128', label: 'Code128' },
  { value: 'Interleaved2of5', label: 'Interleaved 2 of 5' }
];

export const TABLE_LOCATION_BACKGROUND_OPTIONS = [
  { value: '', labelKey: 'control.tables.backgroundDefault', fallback: 'Default' },
  { value: 'white', labelKey: 'control.tables.backgroundWhite', fallback: 'White' },
  { value: 'gray', labelKey: 'control.tables.backgroundGray', fallback: 'Gray' },
  { value: 'blue', labelKey: 'control.tables.backgroundBlue', fallback: 'Blue' }
];

export const SET_TABLES_ZOOM_MIN = 50;
export const SET_TABLES_ZOOM_MAX = 150;
export const SET_TABLES_ZOOM_STEP = 10;

export const TABLE_TEMPLATE_OPTIONS = [
  { id: '4table', src: '/4table.svg', chairs: 4, width: 130, height: 155 },
  { id: '5table', src: '/5table.svg', chairs: 5, width: 145, height: 173 },
  { id: '6table', src: '/6table.svg', chairs: 6, width: 150, height: 179 }
];

export const TABLE_BOARD_COLOR_OPTIONS = [
  '#facc15', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#ef4444', // red
  '#a855f7', // purple
  '#ffffff'  // white
];

export const PAYMENT_INTEGRATION_OPTIONS = [
  { value: 'manual_cash', labelKey: 'control.paymentTypes.integration.manual_cash', fallback: 'Manual Cash' },
  { value: 'cashmatic', labelKey: 'control.paymentTypes.integration.cashmatic', fallback: 'Cashmatic' },
  { value: 'payworld', labelKey: 'control.paymentTypes.integration.payworld', fallback: 'Payworld' },
  { value: 'generic', labelKey: 'control.paymentTypes.integration.generic', fallback: 'Manual Card' }
];

export const VAT_PERCENT_OPTIONS = [
  { value: '', label: '--' },
  { value: '0', label: '0%' },
  { value: '6', label: '6%' },
  { value: '9', label: '9%' },
  { value: '12', label: '12%' },
  { value: '21', label: '21%' }
];

export const EXTRA_PRICE_PRINTER_OPTIONS = [
  { value: 'Disabled', label: 'Disabled' }
];

export const VERVALTYPE_OPTIONS = [
  { value: 'Shelf life', label: 'Shelf life' },
  { value: 'Expiration date', label: 'Expiration date' }
];

export const PURCHASE_UNIT_OPTIONS = [
  { value: 'Piece', label: 'Piece' },
  { value: 'Kg', label: 'Kg' },
  { value: 'Liter', label: 'Liter' },
  { value: 'Meter', label: 'Meter' }
];

export const PURCHASE_SUPPLIER_OPTIONS = [
  { value: '', label: '--' }
];

export const KIOSK_SUBS_OPTIONS = [
  { value: 'unlimited', label: 'Unlimited' },
  ...Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))
];
