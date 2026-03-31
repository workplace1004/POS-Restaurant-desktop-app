import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { KeyboardWithNumpad } from './KeyboardWithNumpad';
import { SmallKeyboardWithNumpad } from './SmallKeyboardWithNumpad';
import { PrinterModal } from './PrinterModal';
import { ControlViewDiscountModal } from './controlView/ControlViewDiscountModal';
import { ControlViewCategoryModal } from './controlView/ControlViewCategoryModal';
import { ControlViewProductModal } from './controlView/ControlViewProductModal';
import { ControlViewProductPositioningModal } from './controlView/ControlViewProductPositioningModal';
import { ControlViewProductSubproductsModal } from './controlView/ControlViewProductSubproductsModal';
import { ControlViewSubproductModal } from './controlView/ControlViewSubproductModal';
import { ControlViewManageGroupsModal } from './controlView/ControlViewManageGroupsModal';
import { ControlViewKitchenAssignProductsModal } from './controlView/ControlViewKitchenAssignProductsModal';
import { ControlViewProductionMessagesModal } from './controlView/ControlViewProductionMessagesModal';
import { ControlViewSystemSettingsModal } from './controlView/ControlViewSystemSettingsModal';
import { ControlViewDeviceSettingsModal } from './controlView/ControlViewDeviceSettingsModal';
import { ControlViewTableLocationModal } from './controlView/ControlViewTableLocationModal';
import { ControlViewLabelModal } from './controlView/ControlViewLabelModal';
import { ControlViewPriceGroupModal } from './controlView/ControlViewPriceGroupModal';
import { ControlViewKitchenModal } from './controlView/ControlViewKitchenModal';
import { ControlViewPaymentTypeModal } from './controlView/ControlViewPaymentTypeModal';
import { ControlViewUserModal, DEFAULT_USER_PRIVILEGES } from './controlView/ControlViewUserModal';
import { IconChart } from './controlView/controlViewNavIcons';
import { ControlViewMainContentArea } from './controlView/ControlViewMainContentArea';
import {
  safeNumberInputValue,
  layoutEditorReadTableX,
  layoutEditorReadTableY,
  SET_TABLES_LAYOUT_CANVAS_WIDTH,
  SET_TABLES_LAYOUT_CANVAS_HEIGHT
} from './controlView/controlViewUtils.js';
import { useLanguage } from '../contexts/LanguageContext';
import { POS_API_PREFIX as API } from '../lib/apiOrigin.js';
import { publicAssetUrl, resolveMediaSrc } from '../lib/publicAssetUrl.js';

/** Seeded KDS admin credential (same id as `seed.js`); hidden from Configuration → Kitchen list. */
const KITCHEN_ADMIN_CREDENTIAL_ID = 'kitchen-kds-admin';

const CONTROL_SIDEBAR_ITEMS = [
  { id: 'personalize', label: 'Personalize Cash Register', icon: 'monitor' },
  // { id: 'reports', label: 'Reports', icon: 'chart' },
  { id: 'users', label: 'Users', icon: 'users' },
  { id: 'language', label: 'Language', icon: 'language' }
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'nl', label: 'Dutch' },
  { value: 'fr', label: 'French' },
  { value: 'tr', label: 'Turkish' }
];

const TOP_NAV_ITEMS = [
  { id: 'categories-products', label: 'Categories and products', icon: 'box' },
  { id: 'cash-register', label: 'Cash Register Settings', icon: 'gear' },
  { id: 'external-devices', label: 'External Devices', icon: 'printer' },
  { id: 'tables', label: 'Tables', icon: 'table' }
];

const SUB_NAV_ITEMS = [
  'Price Groups',
  'Categories',
  'Products',
  'Subproducts',
  'Discounts',
  'Kitchen'
];

const CASH_REGISTER_SUB_NAV_ITEMS = [
  'Template Settings',
  'Device Settings',
  'System Settings',
  'Payment types',
  'Production messages'
];

const EXTERNAL_DEVICES_SUB_NAV_ITEMS = [
  'Printer',
  'Price Display',
  'RFID Reader',
  'Barcode Scanner',
  'Credit Card',
  'Libra',
  'Cashmatic',
  'Payworld'
];

const PRINTER_TAB_DEFS = [
  { id: 'General', labelKey: 'control.printerTabs.general', fallback: 'General' },
  { id: 'Final tickets', labelKey: 'control.printerTabs.finalTickets', fallback: 'Final tickets' },
  { id: 'Production Tickets', labelKey: 'control.printerTabs.productionTickets', fallback: 'Production Tickets' },
  { id: 'Labels', labelKey: 'control.printerTabs.labels', fallback: 'Labels' },
];

const PRINTING_ORDER_OPTIONS = [
  { value: 'as-registered', labelKey: 'control.external.asRegistered', fallback: 'As Registered' },
  { value: 'reverse', labelKey: 'control.external.reverse', fallback: 'Reverse' }
];

const PRINTER_DISABLED_OPTIONS = [
  { value: 'disabled', labelKey: 'control.external.disabled', fallback: 'Disabled' }
];

const GROUPING_RECEIPT_OPTIONS = [
  { value: 'enable', labelKey: 'control.external.enable', fallback: 'Enable' },
  { value: 'disable', labelKey: 'control.external.disable', fallback: 'Disable' }
];

const PRICE_DISPLAY_TYPE_OPTIONS = [
  { value: 'disabled', labelKey: 'control.external.priceDisplayType.disabled', fallback: 'Disabled' },
  { value: 'two-line-display', labelKey: 'control.external.priceDisplayType.twoLineDisplay', fallback: 'Two-line display' },
  { value: 'color-display', labelKey: 'control.external.priceDisplayType.colorDisplay', fallback: 'Color display' }
];

const RFID_READER_TYPE_OPTIONS = [
  { value: 'disabled', labelKey: 'control.external.disabled', fallback: 'Disabled' },
  { value: 'serial', labelKey: 'control.external.serial', fallback: 'Serial' },
  { value: 'usb-nfc', labelKey: 'control.external.rfidReaderType.usbNfc', fallback: 'USB NFC' }
];

const BARCODE_SCANNER_TYPE_OPTIONS = [
  { value: 'disabled', labelKey: 'control.external.disabled', fallback: 'Disabled' },
  { value: 'serial', labelKey: 'control.external.serial', fallback: 'Serial' },
  { value: 'keyboard-input', labelKey: 'control.external.barcodeScannerType.keyboardInput', fallback: 'Keyboard input' },
  { value: 'tcp-ip', labelKey: 'control.external.barcodeScannerType.tcpIp', fallback: 'TCP / IP' }
];

const CREDIT_CARD_TYPE_OPTIONS = [
  { value: 'disabled', labelKey: 'control.external.disabled', fallback: 'Disabled' },
  { value: 'payworld', labelKey: 'control.external.creditCardType.payworld', fallback: 'Payworld' },
  { value: 'viva-wallet', labelKey: 'control.external.creditCardType.vivaWallet', fallback: 'Viva wallet' }
];

const SCALE_TYPE_OPTIONS = [
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

const SCALE_PORT_OPTIONS = [
  { value: '', label: '' },
  { value: 'COM 1', label: 'COM 1' },
  { value: 'COM 2', label: 'COM 2' },
  { value: 'COM 3', label: 'COM 3' },
  { value: 'COM 4', label: 'COM 4' }
];

const REPORT_TABS = [
  { id: 'financial', label: 'Financial Reports', icon: 'document' },
  { id: 'user', label: 'User Reports', icon: 'person' },
  { id: 'periodic', label: 'Periodic Reports', icon: 'chart' },
  { id: 'settings', label: 'Settings', icon: 'gear' }
];

const REPORT_GENERATE_UNTIL_OPTIONS = [
  { value: 'current-time', labelKey: 'control.reports.currentTime', fallback: 'Current time' }
];

const PERIODIC_REPORT_TIME_OPTIONS = Array.from({ length: 25 }, (_, i) => {
  const h = i === 24 ? '24' : String(i).padStart(2, '0');
  const label = i === 24 ? '24:00' : `${h}:00`;
  return { value: label, label };
});


const DISCOUNT_TRIGGER_OPTIONS = [
  { value: 'number', label: 'Number' },
  { value: 'weight', label: 'Weight' },
  { value: 'min-amount', label: 'Minimum amount' },
  { value: 'time', label: 'Time' }
];

const DISCOUNT_TYPE_OPTIONS = [
  { value: 'amount', label: 'Amount' },
  { value: 'percent', label: 'Percent' },
  { value: 'free_products', label: 'Free products' },
  { value: 'number', label: '+ Number' },
  { value: 'weight', label: '+ Weight' },
  { value: 'different_price_group', label: 'Different price group' },
];

const DISCOUNT_ON_OPTIONS = [
  { value: 'products', label: 'Products' },
  { value: 'categories', label: 'Categories' },
  { value: 'all-products', label: 'All products' }
];

const REPORT_SETTINGS_ROWS = [
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

const DEFAULT_REPORT_SETTINGS = Object.fromEntries(
  REPORT_SETTINGS_ROWS.map((row) => {
    const allChecked = ['vat-totals', 'payments', 'ticket-types', 'eat-in-take-out'].includes(row.id);
    return [row.id, { z: allChecked, x: allChecked, periodic: allChecked }];
  })
);

const DEFAULT_LABELS_LIST = [
  { id: 'lbl1', sizeLabel: '5.6cm x 3.5cm', sortOrder: 0 }
];

const DEFAULT_PRINTERS = [
  { id: 'p1', name: 'RP4xx Series 200DPI TSC', isDefault: false, sortOrder: 0 },
  { id: 'p2', name: 'ip printer', isDefault: true, sortOrder: 1 },
  { id: 'p3', name: 'Xprinter XP-420B', isDefault: false, sortOrder: 2 },
  { id: 'p4', name: 'bar printer', isDefault: false, sortOrder: 3 },
  { id: 'p5', name: 'extra kitchen printer', isDefault: false, sortOrder: 4 },
  { id: 'p6', name: 'extra printer', isDefault: false, sortOrder: 5 }
];

const VAT_OPTIONS = [
  { value: 'standard', labelKey: 'control.external.standard', fallback: 'Standard' },
  { value: 'take-out', labelKey: 'control.external.takeOut', fallback: 'Take-out' },
  { value: 'eat-in', labelKey: 'control.external.eatIn', fallback: 'Eat-in' }
];

const FUNCTION_BUTTON_ITEMS = [
  { id: 'tables', labelKey: 'control.functionButton.tables', fallbackLabel: 'Tafels' },
  { id: 'weborders', labelKey: 'control.functionButton.weborders', fallbackLabel: 'Weborders' },
  { id: 'in-wacht', labelKey: 'control.functionButton.inWaiting', fallbackLabel: 'In Wacht' },
  { id: 'geplande-orders', labelKey: 'control.functionButton.scheduledOrders', fallbackLabel: 'Geplande orders' },
  { id: 'reservaties', labelKey: 'control.functionButton.reservations', fallbackLabel: 'Reservaties' },
  { id: 'verkopers', labelKey: 'control.functionButton.sellers', fallbackLabel: 'Verkopers' }
];

const FUNCTION_BUTTON_SLOT_COUNT = 4;
const FUNCTION_BUTTON_ITEM_IDS = FUNCTION_BUTTON_ITEMS.map((item) => item.id);
const FUNCTION_BUTTON_ITEM_BY_ID = Object.fromEntries(
  FUNCTION_BUTTON_ITEMS.map((item) => [item.id, item])
);

const OPTION_BUTTON_ITEMS = [
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
const OPTION_BUTTON_SLOT_COUNT = 28;
const OPTION_BUTTON_LOCKED_ID = 'meer';
const OPTION_BUTTON_ITEM_IDS = OPTION_BUTTON_ITEMS.map((item) => item.id);
const OPTION_BUTTON_ITEM_BY_ID = Object.fromEntries(
  OPTION_BUTTON_ITEMS.map((item) => [item.id, item])
);
const DEFAULT_OPTION_BUTTON_LAYOUT = [
  'extra-bc-bedrag', '', 'bc-refund', 'stock-retour', 'product-labels', '', '',
  'ticket-afdrukken', '', 'tegoed', 'tickets-optellen', '', 'product-info', 'personeel-ticket',
  'productie-bericht', 'prijs-groep', 'discount', 'kadobon', 'various', 'plu', 'product-zoeken',
  'lade', 'klanten', 'historiek', 'subtotaal', 'terugname', '', 'meer'
];

function normalizeFunctionButtonSlots(value) {
  if (!Array.isArray(value)) return Array(FUNCTION_BUTTON_SLOT_COUNT).fill('');
  const next = Array(FUNCTION_BUTTON_SLOT_COUNT).fill('');
  const used = new Set();
  for (let i = 0; i < FUNCTION_BUTTON_SLOT_COUNT; i += 1) {
    const candidate = String(value[i] || '').trim();
    if (!candidate) continue;
    if (!FUNCTION_BUTTON_ITEM_IDS.includes(candidate)) continue;
    if (used.has(candidate)) continue;
    next[i] = candidate;
    used.add(candidate);
  }
  return next;
}

function normalizeOptionButtonSlots(value) {
  if (!Array.isArray(value)) return [...DEFAULT_OPTION_BUTTON_LAYOUT];
  const next = Array(OPTION_BUTTON_SLOT_COUNT).fill('');
  const used = new Set();
  for (let i = 0; i < OPTION_BUTTON_SLOT_COUNT; i += 1) {
    const candidate = String(value[i] || '').trim();
    if (!candidate) continue;
    if (!OPTION_BUTTON_ITEM_IDS.includes(candidate)) continue;
    if (used.has(candidate)) continue;
    next[i] = candidate;
    used.add(candidate);
  }
  if (!next.includes(OPTION_BUTTON_LOCKED_ID)) {
    next[OPTION_BUTTON_SLOT_COUNT - 1] = OPTION_BUTTON_LOCKED_ID;
  }
  return next;
}

const TABLE_TEMPLATE_OPTIONS = [
  { id: '4table', src: '/4table.svg', chairs: 4, width: 130, height: 155 },
  { id: '5table', src: '/5table.svg', chairs: 5, width: 145, height: 173 },
  { id: '6table', src: '/6table.svg', chairs: 6, width: 150, height: 179 }
];

const TABLE_BOARD_COLOR_OPTIONS = [
  '#facc15', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#ef4444', // red
  '#a855f7', // purple
  '#ffffff'  // white
];

const createDefaultBoard = (_table, color = '#facc15') => ({
  id: `board-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  color,
  x: 100,
  y: 100,
  width: 30,
  height: 180,
  rotation: 0
});

const normalizeBoardToItem = (b, defaultColor = '#facc15') => ({
  id: b?.id && typeof b.id === 'string' ? b.id : `board-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  color: typeof b?.color === 'string' && b.color.trim() ? b.color.trim() : defaultColor,
  x: Number(b?.x) || 0,
  y: Number(b?.y) || 0,
  width: Math.max(10, Number(b?.width) || 120),
  height: Math.max(10, Number(b?.height) || 120),
  rotation: Number(b?.rotation) || 0
});

const createDefaultFlowerPot = () => ({
  id: `flowerpot-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  x: 200,
  y: 200,
  width: 60,
  height: 72,
  rotation: 0
});

const normalizeFlowerPotToItem = (fp) => ({
  id: fp?.id && typeof fp.id === 'string' ? fp.id : `flowerpot-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  x: Number(fp?.x) || 0,
  y: Number(fp?.y) || 0,
  width: Math.max(10, Number(fp?.width) || 60),
  height: Math.max(10, Number(fp?.height) || 72),
  rotation: Number(fp?.rotation) || 0
});

const createDefaultLayoutTable = (index = 1, templateType = '4table') => {
  const tpl = TABLE_TEMPLATE_OPTIONS.find((item) => item.id === templateType) || TABLE_TEMPLATE_OPTIONS[0];
  return {
    id: `tbl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: `T-${String(index).padStart(2, '0')}`,
    x: 120 + (index - 1) * 180,
    y: 120 + ((index - 1) % 3) * 120,
    width: tpl.width,
    height: tpl.height,
    chairs: tpl.chairs,
    rotation: 0,
    round: false,
    templateType: tpl.id
  };
};

/** Keep tables, boards, and flower pots inside the fixed Set tables canvas (979×614 px). */
function clampSetTablesDraftToFloor(draft) {
  if (!draft || typeof draft !== 'object') return draft;
  const canvasW = SET_TABLES_LAYOUT_CANVAS_WIDTH;
  const canvasH = SET_TABLES_LAYOUT_CANVAS_HEIGHT;
  const clampRotatedPosition = (x, y, width, height, rotationDeg) => {
    const w = Math.max(1, Number(width) || 1);
    const h = Math.max(1, Number(height) || 1);
    const rotation = Number(rotationDeg) || 0;
    const rad = (rotation * Math.PI) / 180;
    const cx = w / 2;
    const cy = h / 2;
    const corners = [
      [0, 0],
      [w, 0],
      [w, h],
      [0, h]
    ];
    let minDx = Number.POSITIVE_INFINITY;
    let maxDx = Number.NEGATIVE_INFINITY;
    let minDy = Number.POSITIVE_INFINITY;
    let maxDy = Number.NEGATIVE_INFINITY;
    for (const [px, py] of corners) {
      const dx = px - cx;
      const dy = py - cy;
      const rx = dx * Math.cos(rad) - dy * Math.sin(rad) + cx;
      const ry = dx * Math.sin(rad) + dy * Math.cos(rad) + cy;
      minDx = Math.min(minDx, rx);
      maxDx = Math.max(maxDx, rx);
      minDy = Math.min(minDy, ry);
      maxDy = Math.max(maxDy, ry);
    }
    const minX = -minDx;
    const maxX = canvasW - maxDx;
    const minY = -minDy;
    const maxY = canvasH - maxDy;
    return {
      x: Math.min(Math.max(Number(x) || 0, minX), Math.max(minX, maxX)),
      y: Math.min(Math.max(Number(y) || 0, minY), Math.max(minY, maxY))
    };
  };

  const clampOneTable = (table) => {
    const tw = table.round ? Math.max(70, Number(table.width) || 0) : Math.max(60, Number(table.width) || 0);
    const th = table.round ? tw : Math.max(40, Number(table.height) || 0);
    const x = layoutEditorReadTableX(table);
    const y = layoutEditorReadTableY(table);
    const { x: nx, y: ny } = table.round
      ? {
        x: Math.min(Math.max(0, x), Math.max(0, canvasW - tw)),
        y: Math.min(Math.max(0, y), Math.max(0, canvasH - th))
      }
      : clampRotatedPosition(x, y, tw, th, Number(table.rotation) || 0);
    return { ...table, x: nx, y: ny };
  };
  const clampOneBoard = (b) => {
    const bw = Math.max(10, Number(b?.width) || 10);
    const bh = Math.max(10, Number(b?.height) || 10);
    const { x: bx, y: by } = clampRotatedPosition(Number(b?.x) || 0, Number(b?.y) || 0, bw, bh, Number(b?.rotation) || 0);
    return { ...b, x: bx, y: by, width: bw, height: bh };
  };
  const clampOneFlowerPot = (fp) => {
    const fw = Math.max(10, Number(fp?.width) || 10);
    const fh = Math.max(10, Number(fp?.height) || 10);
    const { x: fx, y: fy } = clampRotatedPosition(Number(fp?.x) || 0, Number(fp?.y) || 0, fw, fh, Number(fp?.rotation) || 0);
    return { ...fp, x: fx, y: fy, width: fw, height: fh };
  };

  return {
    ...draft,
    floorWidth: canvasW,
    floorHeight: canvasH,
    tables: (Array.isArray(draft.tables) ? draft.tables : []).map(clampOneTable),
    boards: (Array.isArray(draft.boards) ? draft.boards : []).map(clampOneBoard),
    flowerPots: (Array.isArray(draft.flowerPots) ? draft.flowerPots : []).map(clampOneFlowerPot)
  };
}

const normalizeLayoutEditorDraft = (raw, locationName = 'Restaurant') => {
  const hasTablesArray = Array.isArray(raw?.tables);
  const hasTopLevelBoards = Array.isArray(raw?.boards);
  const hasTopLevelFlowerPots = Array.isArray(raw?.flowerPots);
  const tables = Array.isArray(raw?.tables)
    ? raw.tables.map((table, index) => ({
      id: String(table?.id || `tbl-${index + 1}`),
      name: String(table?.name || `T-${String(index + 1).padStart(2, '0')}`),
      x: Number(table?.x) || 0,
      y: Number(table?.y) || 0,
      width: Math.max(60, Number(table?.width) || 120),
      height: Math.max(40, Number(table?.height) || 80),
      chairs: Math.max(0, Number(table?.chairs) || 4),
      rotation: Number(table?.rotation) || 0,
      round: !!table?.round,
      templateType: TABLE_TEMPLATE_OPTIONS.some((tpl) => tpl.id === table?.templateType)
        ? table.templateType
        : ((Number(table?.chairs) || 4) >= 6 ? '6table' : (Number(table?.chairs) || 4) >= 5 ? '5table' : '4table')
    }))
    : [];
  const legacyBoards = Array.isArray(raw?.tables)
    ? raw.tables.flatMap((table) => {
      if (Array.isArray(table?.boards) && table.boards.length > 0) return table.boards.map((b) => normalizeBoardToItem(b));
      if (table?.board && typeof table.board === 'object') return [normalizeBoardToItem(table.board)];
      if (typeof table?.boardColor === 'string' && table.boardColor.trim()) return [normalizeBoardToItem(createDefaultBoard(table, table.boardColor.trim()))];
      return [];
    })
    : [];
  const legacyFlowerPots = Array.isArray(raw?.tables)
    ? raw.tables.flatMap((table) => (
      Array.isArray(table?.flowerPots) && table.flowerPots.length > 0
        ? table.flowerPots.map((fp) => normalizeFlowerPotToItem(fp))
        : (table?.flowerPot && typeof table.flowerPot === 'object' ? [normalizeFlowerPotToItem(table.flowerPot)] : [])
    ))
    : [];
  const boards = hasTopLevelBoards ? raw.boards.map((b) => normalizeBoardToItem(b)) : legacyBoards;
  const flowerPots = hasTopLevelFlowerPots ? raw.flowerPots.map((fp) => normalizeFlowerPotToItem(fp)) : legacyFlowerPots;
  const base = {
    floorName: String(raw?.floorName || locationName || 'Restaurant'),
    floorWidth: SET_TABLES_LAYOUT_CANVAS_WIDTH,
    floorHeight: SET_TABLES_LAYOUT_CANVAS_HEIGHT,
    bookingCapacity: Math.max(0, Number(raw?.bookingCapacity) || 0),
    floors: Math.max(1, Number(raw?.floors) || 1),
    tables: hasTablesArray ? tables : [createDefaultLayoutTable(1)],
    boards,
    flowerPots
  };
  return clampSetTablesDraftToFloor(base);
};

const EXTRA_PRICE_PRINTER_OPTIONS = [
  { value: 'Disabled', label: 'Disabled' }
];

const VERVALTYPE_OPTIONS = [
  { value: 'Shelf life', label: 'Shelf life' },
  { value: 'Expiration date', label: 'Expiration date' }
];

const PURCHASE_UNIT_OPTIONS = [
  { value: 'Piece', label: 'Piece' },
  { value: 'Kg', label: 'Kg' },
  { value: 'Liter', label: 'Liter' },
  { value: 'Meter', label: 'Meter' }
];

const PURCHASE_SUPPLIER_OPTIONS = [
  { value: '', label: '--' }
];

const KIOSK_SUBS_OPTIONS = [
  { value: 'unlimited', label: 'Unlimited' },
  ...Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))
];

function IconMonitor({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconUsers({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconLanguage({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  );
}

function SidebarIcon({ id, className }) {
  if (id === 'monitor') return <IconMonitor className={className} />;
  if (id === 'chart') return <IconChart className={className} />;
  if (id === 'users') return <IconUsers className={className} />;
  if (id === 'language') return <IconLanguage className={className} />;
  return null;
}

export function ControlView({ currentUser, onLogout, onBack, fetchTableLayouts, fetchTables, onFunctionButtonsSaved }) {
  const { lang, setLang, t } = useLanguage();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [controlSidebarId, setControlSidebarId] = useState('personalize');
  const [appLanguage, setAppLanguage] = useState(() => (LANGUAGE_OPTIONS.some((o) => o.value === lang) ? lang : 'en'));
  const [savingAppLanguage, setSavingAppLanguage] = useState(false);
  const [topNavId, setTopNavId] = useState('categories-products');
  const [subNavId, setSubNavId] = useState('Price Groups');
  const [reportTabId, setReportTabId] = useState('financial');
  const [reportGenerateUntil, setReportGenerateUntil] = useState('current-time');
  const [periodicReportStartTime, setPeriodicReportStartTime] = useState('00:00');
  const [periodicReportStartDate, setPeriodicReportStartDate] = useState(() => {
    const d = new Date();
    return [String(d.getDate()).padStart(2, '0'), String(d.getMonth() + 1).padStart(2, '0'), d.getFullYear()].join('-');
  });
  const [periodicReportEndTime, setPeriodicReportEndTime] = useState('24:00');
  const [periodicReportEndDate, setPeriodicReportEndDate] = useState(() => {
    const d = new Date();
    return [String(d.getDate()).padStart(2, '0'), String(d.getMonth() + 1).padStart(2, '0'), d.getFullYear()].join('-');
  });
  const [reportSettings, setReportSettings] = useState(() => ({ ...DEFAULT_REPORT_SETTINGS }));
  const [savingReportSettings, setSavingReportSettings] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const usersListRef = useRef(null);
  const [canUsersScrollUp, setCanUsersScrollUp] = useState(false);
  const [canUsersScrollDown, setCanUsersScrollDown] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userPin, setUserPin] = useState('');
  const [savingUser, setSavingUser] = useState(false);
  const [deleteConfirmUserId, setDeleteConfirmUserId] = useState(null);
  const [userModalTab, setUserModalTab] = useState('general');
  const [userAvatarColorIndex, setUserAvatarColorIndex] = useState(0);
  const [userModalActiveField, setUserModalActiveField] = useState(null);
  const [userPrivileges, setUserPrivileges] = useState(() => ({ ...DEFAULT_USER_PRIVILEGES }));

  const [discounts, setDiscounts] = useState([]);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [editingDiscountId, setEditingDiscountId] = useState(null);
  const [discountName, setDiscountName] = useState('');
  const [discountTrigger, setDiscountTrigger] = useState('number');
  const [discountType, setDiscountType] = useState('amount');
  const [discountValue, setDiscountValue] = useState('');
  const [discountStartDate, setDiscountStartDate] = useState('');
  const [discountEndDate, setDiscountEndDate] = useState('');
  const [discountOn, setDiscountOn] = useState('products');
  const [discountPieces, setDiscountPieces] = useState('');
  const [discountCombinable, setDiscountCombinable] = useState(false);
  const [discountTargetId, setDiscountTargetId] = useState('');
  const [discountTargetIds, setDiscountTargetIds] = useState([]);
  const [discountProductOptions, setDiscountProductOptions] = useState([]);
  const discountTargetListRef = useRef(null);
  const [canDiscountTargetScrollUp, setCanDiscountTargetScrollUp] = useState(false);
  const [canDiscountTargetScrollDown, setCanDiscountTargetScrollDown] = useState(false);
  const [discountKeyboardValue, setDiscountKeyboardValue] = useState('');
  const [savingDiscount, setSavingDiscount] = useState(false);
  const [deleteConfirmDiscountId, setDeleteConfirmDiscountId] = useState(null);
  const [discountCalendarField, setDiscountCalendarField] = useState(null); // 'start' | 'end' | null
  const discountsListRef = useRef(null);
  const [canDiscountsScrollUp, setCanDiscountsScrollUp] = useState(false);
  const [canDiscountsScrollDown, setCanDiscountsScrollDown] = useState(false);

  const [kitchens, setKitchens] = useState([]);
  const [deleteConfirmKitchenId, setDeleteConfirmKitchenId] = useState(null);
  const [showKitchenModal, setShowKitchenModal] = useState(false);
  const [editingKitchenId, setEditingKitchenId] = useState(null);
  const [kitchenModalName, setKitchenModalName] = useState('');
  const [savingKitchen, setSavingKitchen] = useState(false);
  const kitchenListRef = useRef(null);
  const [canKitchenScrollUp, setCanKitchenScrollUp] = useState(false);
  const [canKitchenScrollDown, setCanKitchenScrollDown] = useState(false);
  const [showKitchenProductsModal, setShowKitchenProductsModal] = useState(false);
  const [kitchenProductsKitchen, setKitchenProductsKitchen] = useState(null);
  const [kitchenProductsCatalog, setKitchenProductsCatalog] = useState([]);
  const [kitchenProductsModalCategories, setKitchenProductsModalCategories] = useState([]);
  const [kitchenProductsCategoryFilter, setKitchenProductsCategoryFilter] = useState('');
  const [kitchenProductsLinked, setKitchenProductsLinked] = useState([]);
  const [kitchenProductsLeftSelectedIds, setKitchenProductsLeftSelectedIds] = useState(() => new Set());
  const [kitchenProductsRightSelectedIds, setKitchenProductsRightSelectedIds] = useState(() => new Set());
  const [loadingKitchenProductsCatalog, setLoadingKitchenProductsCatalog] = useState(false);
  const [savingKitchenProducts, setSavingKitchenProducts] = useState(false);
  const kitchenProductsLeftListRef = useRef(null);
  const kitchenProductsRightListRef = useRef(null);

  const [priceGroups, setPriceGroups] = useState([]);
  const [priceGroupsLoading, setPriceGroupsLoading] = useState(false);
  const priceGroupsListRef = useRef(null);
  const [canPriceGroupsScrollUp, setCanPriceGroupsScrollUp] = useState(false);
  const [canPriceGroupsScrollDown, setCanPriceGroupsScrollDown] = useState(false);
  const [showPriceGroupModal, setShowPriceGroupModal] = useState(false);
  const [editingPriceGroupId, setEditingPriceGroupId] = useState(null);
  const [priceGroupName, setPriceGroupName] = useState('');
  const [priceGroupTax, setPriceGroupTax] = useState('standard');
  const [savingPriceGroup, setSavingPriceGroup] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryNextCourse, setCategoryNextCourse] = useState('');
  const [categoryInWebshop, setCategoryInWebshop] = useState(true);
  const [categoryDisplayOnCashRegister, setCategoryDisplayOnCashRegister] = useState(true);
  const [categoryActiveField, setCategoryActiveField] = useState('name');
  const [savingCategory, setSavingCategory] = useState(false);
  const [deleteConfirmCategoryId, setDeleteConfirmCategoryId] = useState(null);
  const categoriesListRef = useRef(null);
  const [canCategoriesScrollUp, setCanCategoriesScrollUp] = useState(false);
  const [canCategoriesScrollDown, setCanCategoriesScrollDown] = useState(false);
  const productsListRef = useRef(null);
  const productsCategoryTabsRef = useRef(null);
  const [canProductsScrollUp, setCanProductsScrollUp] = useState(false);
  const [canProductsScrollDown, setCanProductsScrollDown] = useState(false);
  const subproductsListRef = useRef(null);
  const subproductsGroupTabsRef = useRef(null);
  const [canSubproductsScrollUp, setCanSubproductsScrollUp] = useState(false);
  const [canSubproductsScrollDown, setCanSubproductsScrollDown] = useState(false);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productHasSubproductsById, setProductHasSubproductsById] = useState({});
  const [showProductSubproductsModal, setShowProductSubproductsModal] = useState(false);
  const [productSubproductsProduct, setProductSubproductsProduct] = useState(null);
  const [productSubproductsGroupId, setProductSubproductsGroupId] = useState('');
  const [productSubproductsOptions, setProductSubproductsOptions] = useState([]);
  const [productSubproductsByGroup, setProductSubproductsByGroup] = useState({});
  const [productSubproductsLeftSelectedIds, setProductSubproductsLeftSelectedIds] = useState(() => new Set());
  const [productSubproductsRightSelectedIds, setProductSubproductsRightSelectedIds] = useState(() => new Set());
  const [productSubproductsLinked, setProductSubproductsLinked] = useState([]);
  const productSubproductsLeftListRef = useRef(null);
  const productSubproductsListRef = useRef(null);
  const [loadingProductSubproductsLinked, setLoadingProductSubproductsLinked] = useState(false);
  const [savingProductSubproducts, setSavingProductSubproducts] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProductPositioningModal, setShowProductPositioningModal] = useState(false);
  const [positioningCategoryId, setPositioningCategoryId] = useState(null);
  const [positioningSelectedProductId, setPositioningSelectedProductId] = useState(null);
  const [positioningSelectedCellIndex, setPositioningSelectedCellIndex] = useState(null);
  const [positioningSelectedPoolItemId, setPositioningSelectedPoolItemId] = useState(null);
  const [positioningSubproducts, setPositioningSubproducts] = useState([]);
  const [positioningLayoutByCategory, setPositioningLayoutByCategory] = useState({});
  const [positioningColorByCategory, setPositioningColorByCategory] = useState({});
  const [savingPositioningLayout, setSavingPositioningLayout] = useState(false);
  const [positioningLayoutSaveMessage, setPositioningLayoutSaveMessage] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [productTab, setProductTab] = useState('general');
  const [productTabsUnlocked, setProductTabsUnlocked] = useState(false);
  const [productDisplayNumber, setProductDisplayNumber] = useState(null);
  const [productName, setProductName] = useState('');
  const [productKeyName, setProductKeyName] = useState('');
  const [productProductionName, setProductProductionName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productVatTakeOut, setProductVatTakeOut] = useState('');
  const [productVatEatIn, setProductVatEatIn] = useState('');
  const [productCategoryIds, setProductCategoryIds] = useState(['']);
  const [productAddition, setProductAddition] = useState('Subproducts');
  const [productBarcode, setProductBarcode] = useState('');
  const [productPrinter1, setProductPrinter1] = useState('');
  const [productPrinter2, setProductPrinter2] = useState('');
  const [productPrinter3, setProductPrinter3] = useState('');
  const [productActiveField, setProductActiveField] = useState('name');
  const [savingProduct, setSavingProduct] = useState(false);
  const [deleteConfirmProductId, setDeleteConfirmProductId] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [showProductSearchKeyboard, setShowProductSearchKeyboard] = useState(false);
  const [barcodeButtonSpinning, setBarcodeButtonSpinning] = useState(false);
  const [productFieldErrors, setProductFieldErrors] = useState({ name: false, keyName: false, productionName: false, vatTakeOut: false, vatEatIn: false });
  const [advancedOpenPrice, setAdvancedOpenPrice] = useState(false);
  const [advancedWeegschaal, setAdvancedWeegschaal] = useState(false);
  const [advancedSubproductRequires, setAdvancedSubproductRequires] = useState(false);
  const [advancedLeeggoedPrijs, setAdvancedLeeggoedPrijs] = useState('0.00');
  const [advancedPagerVerplicht, setAdvancedPagerVerplicht] = useState(false);
  const [advancedBoldPrint, setAdvancedBoldPrint] = useState(false);
  const [advancedGroupingReceipt, setAdvancedGroupingReceipt] = useState(true);
  const [advancedLabelExtraInfo, setAdvancedLabelExtraInfo] = useState('');
  const [advancedVoorverpakVervaltype, setAdvancedVoorverpakVervaltype] = useState('Shelf life');
  const [advancedHoudbareDagen, setAdvancedHoudbareDagen] = useState('0');
  const [advancedBewarenGebruik, setAdvancedBewarenGebruik] = useState('');
  const [advancedKassaPhotoPreview, setAdvancedKassaPhotoPreview] = useState(null);

  const [extraPricesRows, setExtraPricesRows] = useState([]);
  const [extraPricesSelectedIndex, setExtraPricesSelectedIndex] = useState(0);
  const extraPricesScrollRef = useRef(null);
  const [extraPricesScrollEdges, setExtraPricesScrollEdges] = useState({ atTop: true, atBottom: true });

  const syncExtraPricesScrollEdges = useCallback(() => {
    const el = extraPricesScrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight + 1) {
      setExtraPricesScrollEdges({ atTop: true, atBottom: true });
      return;
    }
    setExtraPricesScrollEdges({
      atTop: scrollTop <= 1,
      atBottom: scrollTop + clientHeight >= scrollHeight - 1
    });
  }, []);

  const [purchaseVat, setPurchaseVat] = useState('');
  const [purchasePriceExcl, setPurchasePriceExcl] = useState('0.00');
  const [purchasePriceIncl, setPurchasePriceIncl] = useState('0.00');
  const [profitPct, setProfitPct] = useState('0.00');
  const [purchaseUnit, setPurchaseUnit] = useState('Piece');
  const [unitContent, setUnitContent] = useState('0');
  const [stock, setStock] = useState('0');
  const [purchaseSupplier, setPurchaseSupplier] = useState('');
  const [supplierCode, setSupplierCode] = useState('');
  const [stockNotification, setStockNotification] = useState(true);
  const [expirationDate, setExpirationDate] = useState('');
  const [declarationExpiryDays, setDeclarationExpiryDays] = useState('0');
  const [notificationSoldOutPieces, setNotificationSoldOutPieces] = useState('');

  const [productInWebshop, setProductInWebshop] = useState(false);
  const [webshopOnlineOrderable, setWebshopOnlineOrderable] = useState(true);
  const [websiteRemark, setWebsiteRemark] = useState('');
  const [websiteOrder, setWebsiteOrder] = useState('0');
  const [shortWebText, setShortWebText] = useState('');
  const [websitePhotoFileName, setWebsitePhotoFileName] = useState('');

  const [kioskInfo, setKioskInfo] = useState('');
  const [kioskTakeAway, setKioskTakeAway] = useState(true);
  const [kioskEatIn, setKioskEatIn] = useState('');
  const [kioskSubtitle, setKioskSubtitle] = useState('');
  const [kioskPictureFileName, setKioskPictureFileName] = useState('');
  const [kioskMinSubs, setKioskMinSubs] = useState('unlimited');
  const [kioskMaxSubs, setKioskMaxSubs] = useState('unlimited');

  const [tableLocations, setTableLocations] = useState([]);
  const [tableLocationsLoading, setTableLocationsLoading] = useState(false);
  const [showTableLocationModal, setShowTableLocationModal] = useState(false);
  const [editingTableLocationId, setEditingTableLocationId] = useState(null);
  const [tableLocationName, setTableLocationName] = useState('');
  const [tableLocationSelectionStart, setTableLocationSelectionStart] = useState(0);
  const [tableLocationSelectionEnd, setTableLocationSelectionEnd] = useState(0);
  const [tableLocationBackground, setTableLocationBackground] = useState('');
  const [tableLocationTextColor, setTableLocationTextColor] = useState('light');
  const [savingTableLocation, setSavingTableLocation] = useState(false);
  const [deleteConfirmTableLocationId, setDeleteConfirmTableLocationId] = useState(null);
  const tableLocationsListRef = useRef(null);
  const [canTableLocationsScrollUp, setCanTableLocationsScrollUp] = useState(false);
  const [canTableLocationsScrollDown, setCanTableLocationsScrollDown] = useState(false);
  const tableLocationNameInputRef = useRef(null);
  const [showSetTablesModal, setShowSetTablesModal] = useState(false);
  const [setTablesLocationId, setSetTablesLocationId] = useState(null);
  const [setTablesLocationName, setSetTablesLocationName] = useState('');
  const [setTablesDraft, setSetTablesDraft] = useState(() => normalizeLayoutEditorDraft(null, 'Restaurant'));
  const [setTablesSelectedTableId, setSetTablesSelectedTableId] = useState(null);
  const [setTablesSelectedBoardIndex, setSetTablesSelectedBoardIndex] = useState(null);
  const [setTablesSelectedFlowerPotIndex, setSetTablesSelectedFlowerPotIndex] = useState(null);
  const [showSetTableTypeModal, setShowSetTableTypeModal] = useState(false);
  const [showSetBoardColorModal, setShowSetBoardColorModal] = useState(false);
  const [showSetTablesNumberModal, setShowSetTablesNumberModal] = useState(false);
  const [showSetTablesNameModal, setShowSetTablesNameModal] = useState(false);
  const [setTablesNumberValue, setSetTablesNumberValue] = useState('');
  const [setTablesNameValue, setSetTablesNameValue] = useState('');
  const [setTablesNameSelectionStart, setSetTablesNameSelectionStart] = useState(0);
  const [setTablesNameSelectionEnd, setSetTablesNameSelectionEnd] = useState(0);
  const setTablesNumberCommitRef = useRef(null);
  const setTablesCanvasRef = useRef(null);
  const setTablesCanvasZoom = 100;
  const setTablesDragRef = useRef({
    active: false,
    type: null, // 'table' | 'board' | 'flowerPot'
    tableId: null,
    index: null,
    offsetX: 0,
    offsetY: 0
  });

  const [templateTheme, setTemplateTheme] = useState(() => {
    try {
      return (typeof localStorage !== 'undefined' && localStorage.getItem('pos-template-theme')) || 'light';
    } catch {
      return 'light';
    }
  });
  const [savingTemplateSettings, setSavingTemplateSettings] = useState(false);

  const [showDeviceSettingsModal, setShowDeviceSettingsModal] = useState(false);
  const [deviceSettingsTab, setDeviceSettingsTab] = useState('General');
  const [deviceUseSubproducts, setDeviceUseSubproducts] = useState(true);
  const [deviceAutoLogoutAfterTransaction, setDeviceAutoLogoutAfterTransaction] = useState(false);
  const [deviceAutoReturnToTablePlan, setDeviceAutoReturnToTablePlan] = useState(false);
  const [deviceDisableCashButtonInPayment, setDeviceDisableCashButtonInPayment] = useState(false);
  const [deviceOpenPriceWithoutPopup, setDeviceOpenPriceWithoutPopup] = useState(false);
  const [deviceOpenCashDrawerAfterOrder, setDeviceOpenCashDrawerAfterOrder] = useState(true);
  const [deviceAutoReturnToCounterSale, setDeviceAutoReturnToCounterSale] = useState(false);
  const [deviceAskSendToKitchen, setDeviceAskSendToKitchen] = useState(false);
  const [deviceCounterSaleVat, setDeviceCounterSaleVat] = useState('take-out');
  const [deviceTableSaleVat, setDeviceTableSaleVat] = useState('eat-in');
  const [deviceTimeoutLogout, setDeviceTimeoutLogout] = useState(0);
  const [deviceFixedBorder, setDeviceFixedBorder] = useState(true);
  const [deviceAlwaysOnTop, setDeviceAlwaysOnTop] = useState(true);
  const [deviceAskInvoiceOrTicket, setDeviceAskInvoiceOrTicket] = useState(false);
  const [savingDeviceSettings, setSavingDeviceSettings] = useState(false);
  const [devicePrinterGroupingProducts, setDevicePrinterGroupingProducts] = useState(true);
  const [devicePrinterShowErrorScreen, setDevicePrinterShowErrorScreen] = useState(true);
  const [devicePrinterProductionMessageOnVat, setDevicePrinterProductionMessageOnVat] = useState(false);
  const [devicePrinterNextCourseOrder, setDevicePrinterNextCourseOrder] = useState('as-registered');
  const [devicePrinterStandardMode, setDevicePrinterStandardMode] = useState('enable');
  const [devicePrinterQROrderPrinter, setDevicePrinterQROrderPrinter] = useState('');
  const [devicePrinterReprintWithNextCourse, setDevicePrinterReprintWithNextCourse] = useState(false);
  const [devicePrinterPrintZeroTickets, setDevicePrinterPrintZeroTickets] = useState(false);
  const [devicePrinterGiftVoucherAtMin, setDevicePrinterGiftVoucherAtMin] = useState(false);
  const [deviceCategoryDisplayIds, setDeviceCategoryDisplayIds] = useState([]); // empty = all categories displayed
  const [deviceOrdersConfirmOnHold, setDeviceOrdersConfirmOnHold] = useState(false);
  const [deviceOrdersPrintBarcodeAfterCreate, setDeviceOrdersPrintBarcodeAfterCreate] = useState(false);
  const [deviceOrdersCustomerCanBeModified, setDeviceOrdersCustomerCanBeModified] = useState(false);
  const [deviceOrdersBookTableToWaiting, setDeviceOrdersBookTableToWaiting] = useState(false);
  const [deviceOrdersFastCustomerName, setDeviceOrdersFastCustomerName] = useState(false);
  const [deviceScheduledPrinter, setDeviceScheduledPrinter] = useState('');
  const [deviceScheduledProductionFlow, setDeviceScheduledProductionFlow] = useState('scheduled-orders-print');
  const [deviceScheduledLoading, setDeviceScheduledLoading] = useState('0');
  const [deviceScheduledMode, setDeviceScheduledMode] = useState('labels');
  const [deviceScheduledInvoiceLayout, setDeviceScheduledInvoiceLayout] = useState('standard');
  const [deviceScheduledCheckoutAt, setDeviceScheduledCheckoutAt] = useState('delivery-note');
  const [deviceScheduledPrintBarcodeLabel, setDeviceScheduledPrintBarcodeLabel] = useState(true);
  const [deviceScheduledDeliveryNoteToTurnover, setDeviceScheduledDeliveryNoteToTurnover] = useState(true);
  const [deviceScheduledPrintProductionReceipt, setDeviceScheduledPrintProductionReceipt] = useState(true);
  const [deviceScheduledPrintCustomerProductionReceipt, setDeviceScheduledPrintCustomerProductionReceipt] = useState(true);
  const [deviceScheduledWebOrderAutoPrint, setDeviceScheduledWebOrderAutoPrint] = useState(true);
  const [functionButtonSlots, setFunctionButtonSlots] = useState(() =>
    Array(FUNCTION_BUTTON_SLOT_COUNT).fill('')
  );
  const [selectedFunctionButtonSlotIndex, setSelectedFunctionButtonSlotIndex] = useState(null);
  const [selectedFunctionButtonPoolItemId, setSelectedFunctionButtonPoolItemId] = useState(null);
  const [optionButtonSlots, setOptionButtonSlots] = useState(() =>
    normalizeOptionButtonSlots(null)
  );
  const [selectedOptionButtonSlotIndex, setSelectedOptionButtonSlotIndex] = useState(null);
  const [selectedOptionButtonPoolItemId, setSelectedOptionButtonPoolItemId] = useState(null);

  const [showSystemSettingsModal, setShowSystemSettingsModal] = useState(false);
  const [systemSettingsTab, setSystemSettingsTab] = useState('General');
  const [sysUseStockManagement, setSysUseStockManagement] = useState(true);
  const [sysUsePriceGroups, setSysUsePriceGroups] = useState(true);
  const [sysLoginWithoutCode, setSysLoginWithoutCode] = useState(true);
  const [sysCategorieenPerKassa, setSysCategorieenPerKassa] = useState(true);
  const [sysAutoAcceptQROrders, setSysAutoAcceptQROrders] = useState(false);
  const [sysQrOrdersAutomatischAfrekenen, setSysQrOrdersAutomatischAfrekenen] = useState(false);
  const [sysEnkelQROrdersKeukenscherm, setSysEnkelQROrdersKeukenscherm] = useState(false);
  const [sysAspect169Windows, setSysAspect169Windows] = useState(false);
  const [sysVatRateVariousProducts, setSysVatRateVariousProducts] = useState('12');
  const [sysArrangeProductsManually, setSysArrangeProductsManually] = useState(true);
  const [sysLimitOneUserPerTable, setSysLimitOneUserPerTable] = useState(false);
  const [sysOneWachtorderPerKlant, setSysOneWachtorderPerKlant] = useState(false);
  const [sysCashButtonVisibleMultiplePayment, setSysCashButtonVisibleMultiplePayment] = useState(true);
  const [sysUsePlaceSettings, setSysUsePlaceSettings] = useState(false);
  const [sysTegoedAutomatischInladen, setSysTegoedAutomatischInladen] = useState(true);
  const [sysNieuwstePrijsGebruiken, setSysNieuwstePrijsGebruiken] = useState(true);
  const [sysLeeggoedTerugname, setSysLeeggoedTerugname] = useState('by-customers-name');
  const [sysKlantgegevensQRAfdrukken, setSysKlantgegevensQRAfdrukken] = useState(false);
  const [savingSystemSettings, setSavingSystemSettings] = useState(false);
  const [sysPriceTakeAway, setSysPriceTakeAway] = useState('');
  const [sysPriceDelivery, setSysPriceDelivery] = useState('');
  const [sysPriceCounterSale, setSysPriceCounterSale] = useState('');
  const [sysPriceTableSale, setSysPriceTableSale] = useState('');
  const [sysSavingsPointsPerEuro, setSysSavingsPointsPerEuro] = useState(0);
  const [sysSavingsPointsPerDiscount, setSysSavingsPointsPerDiscount] = useState(0);
  const [sysSavingsDiscount, setSysSavingsDiscount] = useState('');
  const [sysTicketVoucherValidity, setSysTicketVoucherValidity] = useState('3');
  const [sysTicketScheduledPrintMode, setSysTicketScheduledPrintMode] = useState('label-large');
  const [sysTicketScheduledCustomerSort, setSysTicketScheduledCustomerSort] = useState('as-registered');
  const [sysBarcodeType, setSysBarcodeType] = useState('Code39');

  const [paymentTypes, setPaymentTypes] = useState([]);
  const [paymentTypesLoading, setPaymentTypesLoading] = useState(false);
  const paymentTypesListRef = useRef(null);
  const [canPaymentTypesScrollUp, setCanPaymentTypesScrollUp] = useState(false);
  const [canPaymentTypesScrollDown, setCanPaymentTypesScrollDown] = useState(false);
  const [showPaymentTypeModal, setShowPaymentTypeModal] = useState(false);
  const [editingPaymentTypeId, setEditingPaymentTypeId] = useState(null);
  const [paymentTypeName, setPaymentTypeName] = useState('');
  const [paymentTypeActive, setPaymentTypeActive] = useState(true);
  const [paymentTypeIntegration, setPaymentTypeIntegration] = useState('generic');
  const [savingPaymentType, setSavingPaymentType] = useState(false);
  const [deleteConfirmPaymentTypeId, setDeleteConfirmPaymentTypeId] = useState(null);

  const [showProductionMessagesModal, setShowProductionMessagesModal] = useState(false);
  const [productionMessages, setProductionMessages] = useState([]);
  const [productionMessageInput, setProductionMessageInput] = useState('');
  const [productionMessagesPage, setProductionMessagesPage] = useState(0);
  const PRODUCTION_MESSAGES_PAGE_SIZE = 5;
  const PRODUCTION_MESSAGES_PAGE_SIZE1 = 8;
  const [editingProductionMessageId, setEditingProductionMessageId] = useState(null);
  const [deleteConfirmProductionMessageId, setDeleteConfirmProductionMessageId] = useState(null);
  const productionMessagesListRef = useRef(null);
  const [canProductionMessagesScrollUp, setCanProductionMessagesScrollUp] = useState(false);
  const [canProductionMessagesScrollDown, setCanProductionMessagesScrollDown] = useState(false);

  const [printerTab, setPrinterTab] = useState('General');
  const [printers, setPrinters] = useState(() => {
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_printers');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (_) { }
    return DEFAULT_PRINTERS.map((p, i) => ({ ...p, sortOrder: i }));
  });
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [editingPrinterId, setEditingPrinterId] = useState(null);
  const [deleteConfirmPrinterId, setDeleteConfirmPrinterId] = useState(null);
  const [printersPage, setPrintersPage] = useState(0);
  const PRINTERS_PAGE_SIZE = 7;

  const [finalTicketsCompanyData1, setFinalTicketsCompanyData1] = useState('');
  const [finalTicketsCompanyData2, setFinalTicketsCompanyData2] = useState('');
  const [finalTicketsCompanyData3, setFinalTicketsCompanyData3] = useState('');
  const [finalTicketsCompanyData4, setFinalTicketsCompanyData4] = useState('');
  const [finalTicketsCompanyData5, setFinalTicketsCompanyData5] = useState('');
  const [finalTicketsThankText, setFinalTicketsThankText] = useState('Thank you and goodbye');
  const [finalTicketsProforma, setFinalTicketsProforma] = useState(false);
  const [finalTicketsPrintPaymentType, setFinalTicketsPrintPaymentType] = useState(false);
  const [finalTicketsTicketTearable, setFinalTicketsTicketTearable] = useState(false);
  const [finalTicketsPrintLogo, setFinalTicketsPrintLogo] = useState(false);
  const [finalTicketsPrintingOrder, setFinalTicketsPrintingOrder] = useState('as-registered');
  const [finalTicketsActiveField, setFinalTicketsActiveField] = useState(null);
  const [savingFinalTickets, setSavingFinalTickets] = useState(false);

  const [prodTicketsDisplayCategories, setProdTicketsDisplayCategories] = useState(false);
  const [prodTicketsSpaceAbove, setProdTicketsSpaceAbove] = useState(false);
  const [prodTicketsTicketTearable, setProdTicketsTicketTearable] = useState(false);
  const [prodTicketsKeukenprinterBuzzer, setProdTicketsKeukenprinterBuzzer] = useState(false);
  const [prodTicketsProductenIndividueel, setProdTicketsProductenIndividueel] = useState(false);
  const [prodTicketsEatInTakeOutOnderaan, setProdTicketsEatInTakeOutOnderaan] = useState(false);
  const [prodTicketsNextCoursePrinter1, setProdTicketsNextCoursePrinter1] = useState('disabled');
  const [prodTicketsNextCoursePrinter2, setProdTicketsNextCoursePrinter2] = useState('disabled');
  const [prodTicketsNextCoursePrinter3, setProdTicketsNextCoursePrinter3] = useState('disabled');
  const [prodTicketsNextCoursePrinter4, setProdTicketsNextCoursePrinter4] = useState('disabled');
  const [prodTicketsPrintingOrder, setProdTicketsPrintingOrder] = useState('as-registered');
  const [prodTicketsGroupingReceipt, setProdTicketsGroupingReceipt] = useState('enable');
  const [prodTicketsPrinterOverboeken, setProdTicketsPrinterOverboeken] = useState('disabled');
  const [savingProdTickets, setSavingProdTickets] = useState(false);

  const [labelsType, setLabelsType] = useState('production-labels');
  const [labelsPrinter, setLabelsPrinter] = useState('p3');
  const [labelsList, setLabelsList] = useState(() => {
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_printer_labels_list');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (_) { }
    return DEFAULT_LABELS_LIST.map((l, i) => ({ ...l, sortOrder: i }));
  });
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [labelName, setLabelName] = useState('');
  const [labelHeight, setLabelHeight] = useState('');
  const [labelWidth, setLabelWidth] = useState('');
  const [labelStandard, setLabelStandard] = useState(false);
  const [labelMarginLeft, setLabelMarginLeft] = useState('0');
  const [labelMarginRight, setLabelMarginRight] = useState('0');
  const [labelMarginBottom, setLabelMarginBottom] = useState('0');
  const [labelMarginTop, setLabelMarginTop] = useState('0');
  const [deleteConfirmLabelId, setDeleteConfirmLabelId] = useState(null);
  const labelsListRef = useRef(null);
  const [canLabelsScrollUp, setCanLabelsScrollUp] = useState(false);
  const [canLabelsScrollDown, setCanLabelsScrollDown] = useState(false);
  const [labelsListPage, setLabelsListPage] = useState(0);

  const [priceDisplayType, setPriceDisplayType] = useState('disabled');
  const [priceDisplayKeyboardValue, setPriceDisplayKeyboardValue] = useState('');
  const [savingPriceDisplay, setSavingPriceDisplay] = useState(false);

  const [rfidReaderType, setRfidReaderType] = useState('disabled');
  const [rfidReaderKeyboardValue, setRfidReaderKeyboardValue] = useState('');
  const [savingRfidReader, setSavingRfidReader] = useState(false);

  const [barcodeScannerType, setBarcodeScannerType] = useState('disabled');
  const [barcodeScannerKeyboardValue, setBarcodeScannerKeyboardValue] = useState('');
  const [savingBarcodeScanner, setSavingBarcodeScanner] = useState(false);

  const [creditCardType, setCreditCardType] = useState('disabled');
  const [creditCardKeyboardValue, setCreditCardKeyboardValue] = useState('');
  const [savingCreditCard, setSavingCreditCard] = useState(false);

  const [scaleType, setScaleType] = useState('disabled');
  const [scalePort, setScalePort] = useState('');
  const [scaleKeyboardValue, setScaleKeyboardValue] = useState('');
  const [savingScale, setSavingScale] = useState(false);

  const [cashmaticName, setCashmaticName] = useState('Cashmatic Terminal');
  const [cashmaticConnectionType, setCashmaticConnectionType] = useState('tcp');
  const [cashmaticIpAddress, setCashmaticIpAddress] = useState('');
  const [cashmaticPort, setCashmaticPort] = useState('');
  const [cashmaticUsername, setCashmaticUsername] = useState('');
  const [cashmaticPassword, setCashmaticPassword] = useState('');
  const [cashmaticUrl, setCashmaticUrl] = useState('');
  const [cashmaticActiveField, setCashmaticActiveField] = useState('name');
  const [savingCashmatic, setSavingCashmatic] = useState(false);
  const [cashmaticTerminalId, setCashmaticTerminalId] = useState(null);

  const [payworldName, setPayworldName] = useState('Payworld Terminal');
  const [payworldIpAddress, setPayworldIpAddress] = useState('');
  const [payworldPort, setPayworldPort] = useState('5015');
  const [payworldActiveField, setPayworldActiveField] = useState('name');
  const [savingPayworld, setSavingPayworld] = useState(false);
  const [payworldTerminalId, setPayworldTerminalId] = useState(null);

  const [subproductGroups, setSubproductGroups] = useState([]);
  const [subproductGroupsLoading, setSubproductGroupsLoading] = useState(false);
  const [selectedSubproductGroupId, setSelectedSubproductGroupId] = useState(null);
  const [selectedSubproductId, setSelectedSubproductId] = useState(null);
  const [subproducts, setSubproducts] = useState([]);
  const [subproductsLoading, setSubproductsLoading] = useState(false);
  const [subproductSearch, setSubproductSearch] = useState('');
  const [showSubproductModal, setShowSubproductModal] = useState(false);
  const [showManageGroupsModal, setShowManageGroupsModal] = useState(false);
  const [editingSubproductId, setEditingSubproductId] = useState(null);
  const [subproductName, setSubproductName] = useState('');
  const [subproductKeyName, setSubproductKeyName] = useState('');
  const [subproductProductionName, setSubproductProductionName] = useState('');
  const [subproductActiveField, setSubproductActiveField] = useState('name');
  const [subproductPrice, setSubproductPrice] = useState('');
  const [subproductVatTakeOut, setSubproductVatTakeOut] = useState('');
  const [subproductVatEatIn, setSubproductVatEatIn] = useState('');
  const [subproductModalGroupId, setSubproductModalGroupId] = useState(null);
  const [subproductKioskPicture, setSubproductKioskPicture] = useState('');
  const [subproductAttachToCategoryIds, setSubproductAttachToCategoryIds] = useState([]);
  const subproductAttachToListRef = useRef(null);
  const [subproductAddCategoryId, setSubproductAddCategoryId] = useState('');
  const [savingSubproduct, setSavingSubproduct] = useState(false);
  const [deleteConfirmSubproductId, setDeleteConfirmSubproductId] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [showAddGroupInline, setShowAddGroupInline] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [deleteConfirmGroupId, setDeleteConfirmGroupId] = useState(null);
  const [savingGroup, setSavingGroup] = useState(false);
  const [selectedManageGroupId, setSelectedManageGroupId] = useState(null);
  const manageGroupsListRef = useRef(null);
  const manageGroupsDragRef = useRef({ active: false, startY: 0, startScrollTop: 0, pointerId: null });
  const positioningCategoryTabsRef = useRef(null);
  const [canManageGroupsPageUp, setCanManageGroupsPageUp] = useState(false);
  const [canManageGroupsPageDown, setCanManageGroupsPageDown] = useState(false);
  const LOCALE_BY_LANG = { en: 'en-US', nl: 'nl-NL', fr: 'fr-FR', tr: 'tr-TR' };

  const showToast = useCallback((type, text) => {
    setToast({ id: Date.now(), type, text });
  }, []);

  const fetchPaymentTypes = useCallback(async () => {
    setPaymentTypesLoading(true);
    try {
      const res = await fetch(`${API}/payment-methods`);
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data?.data)) setPaymentTypes(data.data);
      else throw new Error(data?.error || 'Failed to load payment methods');
    } catch (e) {
      showToast('error', e?.message || 'Failed to load payment methods');
    } finally {
      setPaymentTypesLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPaymentTypes();
  }, [fetchPaymentTypes]);

  const updateManageGroupsPaginationState = useCallback(() => {
    const el = manageGroupsListRef.current;
    if (!el) {
      setCanManageGroupsPageUp(false);
      setCanManageGroupsPageDown(false);
      return;
    }
    const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
    setCanManageGroupsPageUp(el.scrollTop > 0);
    setCanManageGroupsPageDown(el.scrollTop < maxScrollTop - 1);
  }, []);

  const pageManageGroups = useCallback((direction) => {
    const el = manageGroupsListRef.current;
    if (!el) return;
    const pageHeight = Math.max(120, Math.floor(el.clientHeight * 0.92));
    const delta = direction === 'down' ? pageHeight : -pageHeight;
    el.scrollBy({ top: delta, behavior: 'smooth' });
  }, []);

  const updateTableLocationsScrollState = useCallback(() => {
    const el = tableLocationsListRef.current;
    if (!el) {
      setCanTableLocationsScrollUp(false);
      setCanTableLocationsScrollDown(false);
      return;
    }
    const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
    setCanTableLocationsScrollUp(el.scrollTop > 0);
    setCanTableLocationsScrollDown(el.scrollTop < maxScrollTop - 1);
  }, []);

  const scrollTableLocationsByPage = useCallback((direction) => {
    const el = tableLocationsListRef.current;
    if (!el) return;
    const pageHeight = Math.max(120, Math.floor(el.clientHeight * 0.92));
    const delta = direction === 'down' ? pageHeight : -pageHeight;
    el.scrollBy({ top: delta, behavior: 'smooth' });
  }, []);

  const updateDiscountsScrollState = useCallback(() => {
    const el = discountsListRef.current;
    if (!el) {
      setCanDiscountsScrollUp(false);
      setCanDiscountsScrollDown(false);
      return;
    }
    const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
    setCanDiscountsScrollUp(el.scrollTop > 0);
    setCanDiscountsScrollDown(el.scrollTop < maxScrollTop - 1);
  }, []);

  const scrollDiscountsByPage = useCallback((direction) => {
    const el = discountsListRef.current;
    if (!el) return;
    const pageHeight = Math.max(120, Math.floor(el.clientHeight * 0.92));
    const delta = direction === 'down' ? pageHeight : -pageHeight;
    el.scrollBy({ top: delta, behavior: 'smooth' });
  }, []);

  const updateKitchenScrollState = useCallback(() => {
    const el = kitchenListRef.current;
    if (!el) {
      setCanKitchenScrollUp(false);
      setCanKitchenScrollDown(false);
      return;
    }
    const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
    setCanKitchenScrollUp(el.scrollTop > 0);
    setCanKitchenScrollDown(el.scrollTop < maxScrollTop - 1);
  }, []);

  const scrollKitchenByPage = useCallback((direction) => {
    const el = kitchenListRef.current;
    if (!el) return;
    const pageHeight = Math.max(120, Math.floor(el.clientHeight * 0.92));
    const delta = direction === 'down' ? pageHeight : -pageHeight;
    el.scrollBy({ top: delta, behavior: 'smooth' });
  }, []);

  const updateCategoriesScrollState = useCallback(() => {
    const el = categoriesListRef.current;
    if (!el) {
      setCanCategoriesScrollUp(false);
      setCanCategoriesScrollDown(false);
      return;
    }
    const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
    setCanCategoriesScrollUp(el.scrollTop > 0);
    setCanCategoriesScrollDown(el.scrollTop < maxScrollTop - 1);
  }, []);

  const scrollCategoriesByPage = useCallback((direction) => {
    const el = categoriesListRef.current;
    if (!el) return;
    const pageHeight = Math.max(120, Math.floor(el.clientHeight * 0.92));
    const delta = direction === 'down' ? pageHeight : -pageHeight;
    el.scrollBy({ top: delta, behavior: 'smooth' });
  }, []);

  const updateProductsScrollState = useCallback(() => {
    const el = productsListRef.current;
    if (!el) {
      setCanProductsScrollUp(false);
      setCanProductsScrollDown(false);
      return;
    }
    const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
    setCanProductsScrollUp(el.scrollTop > 0);
    setCanProductsScrollDown(el.scrollTop < maxScrollTop - 1);
  }, []);

  const scrollProductsByPage = useCallback((direction) => {
    const el = productsListRef.current;
    if (!el) return;
    const pageHeight = Math.max(120, Math.floor(el.clientHeight * 0.92));
    const delta = direction === 'down' ? pageHeight : -pageHeight;
    el.scrollBy({ top: delta, behavior: 'smooth' });
  }, []);

  const updateSubproductsScrollState = useCallback(() => {
    const el = subproductsListRef.current;
    if (!el) {
      setCanSubproductsScrollUp(false);
      setCanSubproductsScrollDown(false);
      return;
    }
    const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
    setCanSubproductsScrollUp(el.scrollTop > 0);
    setCanSubproductsScrollDown(el.scrollTop < maxScrollTop - 1);
  }, []);

  const scrollSubproductsByPage = useCallback((direction) => {
    const el = subproductsListRef.current;
    if (!el) return;
    const pageHeight = Math.max(120, Math.floor(el.clientHeight * 0.92));
    const delta = direction === 'down' ? pageHeight : -pageHeight;
    el.scrollBy({ top: delta, behavior: 'smooth' });
  }, []);

  const scrollSubproductAttachToByPage = useCallback((direction) => {
    const el = subproductAttachToListRef.current;
    if (!el) return;
    const pageHeight = Math.max(80, Math.floor(el.clientHeight * 0.9));
    const delta = direction === 'down' ? pageHeight : -pageHeight;
    el.scrollBy({ top: delta, behavior: 'smooth' });
  }, []);

  const updateProductionMessagesScrollState = useCallback(() => {
    const el = productionMessagesListRef.current;
    if (!el) {
      setCanProductionMessagesScrollUp(false);
      setCanProductionMessagesScrollDown(false);
      return;
    }
    const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
    setCanProductionMessagesScrollUp(el.scrollTop > 0);
    setCanProductionMessagesScrollDown(el.scrollTop < maxScrollTop - 1);
  }, []);

  const updateDiscountTargetScrollState = useCallback(() => {
    const el = discountTargetListRef.current;
    if (!el) {
      setCanDiscountTargetScrollUp(false);
      setCanDiscountTargetScrollDown(false);
      return;
    }
    const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
    setCanDiscountTargetScrollUp(el.scrollTop > 0);
    setCanDiscountTargetScrollDown(el.scrollTop < maxScrollTop - 1);
  }, []);

  const scrollDiscountTargetByPage = useCallback((direction) => {
    const el = discountTargetListRef.current;
    if (!el) return;
    const pageHeight = Math.max(80, Math.floor(el.clientHeight * 0.9));
    const delta = direction === 'down' ? pageHeight : -pageHeight;
    el.scrollBy({ top: delta, behavior: 'smooth' });
  }, []);

  const updatePriceGroupsScrollState = useCallback(() => {
    const el = priceGroupsListRef.current;
    if (!el) {
      setCanPriceGroupsScrollUp(false);
      setCanPriceGroupsScrollDown(false);
      return;
    }
    const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
    setCanPriceGroupsScrollUp(el.scrollTop > 0);
    setCanPriceGroupsScrollDown(el.scrollTop < maxScrollTop - 1);
  }, []);

  const scrollPriceGroupsByPage = useCallback((direction) => {
    const el = priceGroupsListRef.current;
    if (!el) return;
    const pageHeight = Math.max(120, Math.floor(el.clientHeight * 0.92));
    const delta = direction === 'down' ? pageHeight : -pageHeight;
    el.scrollBy({ top: delta, behavior: 'smooth' });
  }, []);

  const updatePaymentTypesScrollState = useCallback(() => {
    const el = paymentTypesListRef.current;
    if (!el) {
      setCanPaymentTypesScrollUp(false);
      setCanPaymentTypesScrollDown(false);
      return;
    }
    const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
    setCanPaymentTypesScrollUp(el.scrollTop > 0);
    setCanPaymentTypesScrollDown(el.scrollTop < maxScrollTop - 1);
  }, []);

  const scrollPaymentTypesByPage = useCallback((direction) => {
    const el = paymentTypesListRef.current;
    if (!el) return;
    const pageHeight = Math.max(120, Math.floor(el.clientHeight * 0.92));
    const delta = direction === 'down' ? pageHeight : -pageHeight;
    el.scrollBy({ top: delta, behavior: 'smooth' });
  }, []);

  const updateUsersScrollState = useCallback(() => {
    const el = usersListRef.current;
    if (!el) {
      setCanUsersScrollUp(false);
      setCanUsersScrollDown(false);
      return;
    }
    const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
    setCanUsersScrollUp(el.scrollTop > 0);
    setCanUsersScrollDown(el.scrollTop < maxScrollTop - 1);
  }, []);

  const scrollUsersByPage = useCallback((direction) => {
    const el = usersListRef.current;
    if (!el) return;
    const pageHeight = Math.max(120, Math.floor(el.clientHeight * 0.92));
    const delta = direction === 'down' ? pageHeight : -pageHeight;
    el.scrollBy({ top: delta, behavior: 'smooth' });
  }, []);

  const updateLabelsScrollState = useCallback(() => {
    const el = labelsListRef.current;
    if (!el) {
      setCanLabelsScrollUp(false);
      setCanLabelsScrollDown(false);
      return;
    }
    const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
    setCanLabelsScrollUp(el.scrollTop > 0);
    setCanLabelsScrollDown(el.scrollTop < maxScrollTop - 1);
  }, []);

  const scrollLabelsByPage = useCallback((direction) => {
    const el = labelsListRef.current;
    if (!el) return;
    const pageHeight = Math.max(120, Math.floor(el.clientHeight * 0.92));
    const delta = direction === 'down' ? pageHeight : -pageHeight;
    el.scrollBy({ top: delta, behavior: 'smooth' });
  }, []);

  const formatDateForCurrentLanguage = useCallback((isoDate) => {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString(LOCALE_BY_LANG[lang] || 'en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  }, [lang]);

  useEffect(() => {
    if (!showManageGroupsModal) return;
    updateManageGroupsPaginationState();
  }, [showManageGroupsModal, subproductGroups, updateManageGroupsPaginationState]);

  useEffect(() => {
    if (topNavId !== 'categories-products' || subNavId !== 'Discounts') return;
    updateDiscountsScrollState();
  }, [topNavId, subNavId, discounts, updateDiscountsScrollState]);

  useEffect(() => {
    if (topNavId !== 'categories-products' || subNavId !== 'Kitchen') return;
    updateKitchenScrollState();
  }, [topNavId, subNavId, kitchens, updateKitchenScrollState]);

  useEffect(() => {
    if (!showDiscountModal) return;
    updateDiscountTargetScrollState();
  }, [showDiscountModal, discountTargetIds, updateDiscountTargetScrollState]);

  useEffect(() => {
    if (topNavId !== 'categories-products' || subNavId !== 'Categories') return;
    updateCategoriesScrollState();
  }, [topNavId, subNavId, categories, updateCategoriesScrollState]);

  useEffect(() => {
    if (topNavId !== 'categories-products' || subNavId !== 'Products') return;
    updateProductsScrollState();
  }, [topNavId, subNavId, selectedCategoryId, products, productSearch, updateProductsScrollState]);

  useEffect(() => {
    if (topNavId !== 'categories-products' || subNavId !== 'Subproducts') return;
    updateSubproductsScrollState();
  }, [topNavId, subNavId, selectedSubproductGroupId, subproducts, updateSubproductsScrollState]);

  useEffect(() => {
    if (topNavId !== 'categories-products' || subNavId !== 'Price Groups') return;
    updatePriceGroupsScrollState();
  }, [topNavId, subNavId, priceGroups, updatePriceGroupsScrollState]);

  useEffect(() => {
    if (topNavId !== 'cash-register' || subNavId !== 'Payment types') return;
    updatePaymentTypesScrollState();
  }, [topNavId, subNavId, paymentTypes, updatePaymentTypesScrollState]);

  useEffect(() => {
    if (controlSidebarId !== 'users') return;
    updateUsersScrollState();
  }, [controlSidebarId, users, updateUsersScrollState]);

  useEffect(() => {
    if (topNavId !== 'tables') return;
    updateTableLocationsScrollState();
  }, [topNavId, tableLocations, updateTableLocationsScrollState]);

  useEffect(() => {
    if (!showProductionMessagesModal) return;
    updateProductionMessagesScrollState();
  }, [showProductionMessagesModal, productionMessages, updateProductionMessagesScrollState]);

  useEffect(() => {
    if (topNavId !== 'cash-register' || subNavId !== 'Printer' || printerTab !== 'Labels') return;
    updateLabelsScrollState();
  }, [topNavId, subNavId, printerTab, labelsList, updateLabelsScrollState]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const fetchPriceGroups = useCallback(async () => {
    setPriceGroupsLoading(true);
    try {
      const res = await fetch(`${API}/price-groups`);
      const data = await res.json();
      setPriceGroups(Array.isArray(data) ? data : []);
    } catch {
      setPriceGroups([]);
    } finally {
      setPriceGroupsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch(`${API}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (subNavId === 'Price Groups') fetchPriceGroups();
  }, [subNavId, fetchPriceGroups]);

  useEffect(() => {
    if (subNavId === 'Categories') fetchCategories();
  }, [subNavId, fetchCategories]);

  const [discountsPage, setDiscountsPage] = useState(0);
  useEffect(() => {
    if (topNavId !== 'categories-products' || subNavId !== 'Discounts') setDiscountsPage(0);
  }, [topNavId, subNavId]);

  useEffect(() => {
    if (subNavId === 'Products') fetchCategories();
  }, [subNavId, fetchCategories]);

  useEffect(() => {
    if (showProductModal) fetchPriceGroups();
  }, [showProductModal, fetchPriceGroups]);

  useEffect(() => {
    if (!showProductModal || !priceGroups.length) return;
    setExtraPricesRows((prev) => {
      const byId = new Map(prev.filter((r) => r.priceGroupId).map((r) => [r.priceGroupId, r]));
      return priceGroups.map((pg) => {
        const ex = byId.get(pg.id);
        return {
          priceGroupId: pg.id,
          priceGroupLabel: pg.name,
          otherName: ex?.otherName ?? '',
          otherPrinter: ex?.otherPrinter ?? '',
          otherPrice: ex?.otherPrice ?? ''
        };
      });
    });
  }, [showProductModal, priceGroups]);

  const fetchProducts = useCallback(async (categoryId) => {
    if (!categoryId) {
      setProducts([]);
      return;
    }
    setProductsLoading(true);
    try {
      const res = await fetch(`${API}/categories/${categoryId}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (subNavId === 'Products' && selectedCategoryId) fetchProducts(selectedCategoryId);
  }, [subNavId, selectedCategoryId, fetchProducts]);

  useEffect(() => {
    if (subNavId !== 'Products') return;
    if (!Array.isArray(products) || products.length === 0) return;

    let cancelled = false;
    const toCheck = products
      .map((p) => p?.id)
      .filter((id) => id != null && productHasSubproductsById[id] == null);
    if (toCheck.length === 0) return;

    (async () => {
      for (const id of toCheck) {
        if (cancelled) return;
        try {
          const res = await fetch(`${API}/products/${id}/subproduct-links`);
          const data = await res.json().catch(() => ({}));
          const links = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
          const hasAny = links.length > 0;
          if (!cancelled) {
            setProductHasSubproductsById((prev) => (prev[id] === hasAny ? prev : { ...prev, [id]: hasAny }));
          }
        } catch {
          // ignore
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [subNavId, products, productHasSubproductsById]);

  useEffect(() => {
    if (subNavId === 'Products' && categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [subNavId, categories, selectedCategoryId]);

  useEffect(() => {
    if (topNavId !== 'categories-products' || subNavId !== 'Products') return;
    if (!selectedCategoryId || !productsCategoryTabsRef.current) return;
    const selectedTab = productsCategoryTabsRef.current.querySelector(`[data-category-id="${String(selectedCategoryId)}"]`);
    if (selectedTab && typeof selectedTab.scrollIntoView === 'function') {
      selectedTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [topNavId, subNavId, selectedCategoryId, categories]);

  useEffect(() => {
    if (!showProductPositioningModal) return;
    if (!positioningCategoryId && categories.length > 0) {
      setPositioningCategoryId(selectedCategoryId || categories[0].id);
    }
  }, [showProductPositioningModal, positioningCategoryId, categories, selectedCategoryId]);

  useEffect(() => {
    if (!showProductModal || productTab !== 'extra_prices') return;
    const id = requestAnimationFrame(() => {
      syncExtraPricesScrollEdges();
    });
    return () => cancelAnimationFrame(id);
  }, [showProductModal, productTab, extraPricesRows.length, syncExtraPricesScrollEdges]);

  useEffect(() => {
    let alive = true;
    const loadSavedPositioningLayout = async () => {
      try {
        const res = await fetch(`${API}/settings/product-positioning-layout`);
        const data = await res.json().catch(() => null);
        const value = data?.value;
        if (alive && value && typeof value === 'object') {
          setPositioningLayoutByCategory(value);
          return;
        }
      } catch {
        // fallback to local draft when api is unavailable
      }
      try {
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('pos_product_positioning_layout') : null;
        if (alive && raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') setPositioningLayoutByCategory(parsed);
        }
      } catch {
        // ignore broken local positioning data
      }
    };
    loadSavedPositioningLayout();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const loadSavedPositioningColors = async () => {
      try {
        const res = await fetch(`${API}/settings/product-positioning-colors`);
        const data = await res.json().catch(() => null);
        const value = data?.value;
        if (alive && value && typeof value === 'object') {
          setPositioningColorByCategory(value);
          return;
        }
      } catch {
        // fallback to local draft when api is unavailable
      }
      try {
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('pos_product_positioning_colors') : null;
        if (alive && raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') setPositioningColorByCategory(parsed);
        }
      } catch {
        // ignore broken local color data
      }
    };
    loadSavedPositioningColors();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('pos_product_positioning_layout', JSON.stringify(positioningLayoutByCategory));
      }
    } catch {
      // ignore localStorage write failures
    }
  }, [positioningLayoutByCategory]);

  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('pos_product_positioning_colors', JSON.stringify(positioningColorByCategory));
      }
    } catch {
      // ignore localStorage write failures
    }
  }, [positioningColorByCategory]);

  const fetchPositioningSubproducts = useCallback(async (categoryId) => {
    if (!categoryId) {
      setPositioningSubproducts([]);
      return;
    }
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('pos_subproduct_extra') : null;
      const extraMap = raw ? JSON.parse(raw) : {};
      const attachedIds = Object.entries(extraMap || {})
        .filter(([, value]) => Array.isArray(value?.attachToCategoryIds) && value.attachToCategoryIds.includes(categoryId))
        .map(([id]) => id);
      if (attachedIds.length === 0) {
        setPositioningSubproducts([]);
        return;
      }
      const groupsRes = await fetch(`${API}/subproduct-groups`);
      const groups = await groupsRes.json().catch(() => []);
      const safeGroups = Array.isArray(groups) ? groups : [];
      const listNested = await Promise.all(
        safeGroups.map(async (g) => {
          const res = await fetch(`${API}/subproduct-groups/${g.id}/subproducts`);
          const data = await res.json().catch(() => []);
          return Array.isArray(data) ? data : [];
        })
      );
      const allSubproducts = listNested.flat();
      const filtered = allSubproducts
        .filter((sp) => attachedIds.includes(sp.id))
        .map((sp) => {
          const ex = extraMap?.[sp.id] || {};
          const parsedPrice = parseFloat(ex?.price);
          return {
            ...sp,
            type: 'subproduct',
            _positioningId: `s:${sp.id}`,
            _positioningPrice: Number.isFinite(parsedPrice) ? parsedPrice : Number(sp.price ?? 0),
          };
        });
      setPositioningSubproducts(filtered);
    } catch {
      setPositioningSubproducts([]);
    }
  }, []);

  useEffect(() => {
    if (!showProductPositioningModal) return;
    const categoryId = positioningCategoryId || selectedCategoryId || categories[0]?.id || null;
    if (!categoryId) return;
    fetchProducts(categoryId);
    fetchPositioningSubproducts(categoryId);
  }, [showProductPositioningModal, positioningCategoryId, selectedCategoryId, categories, fetchProducts, fetchPositioningSubproducts]);

  useEffect(() => {
    if (!showProductPositioningModal) return;
    const categoryId = positioningCategoryId || selectedCategoryId || categories[0]?.id || null;
    if (!categoryId) return;
    setPositioningLayoutByCategory((prev) => {
      if (Array.isArray(prev?.[categoryId])) return prev;
      // Persist explicit empty layout so POS does not auto-fallback to full product list.
      return { ...prev, [categoryId]: Array.from({ length: 25 }, () => null) };
    });
  }, [showProductPositioningModal, positioningCategoryId, selectedCategoryId, categories]);

  useEffect(() => {
    if (!showProductPositioningModal) return;
    const categoryId = positioningCategoryId || selectedCategoryId || categories[0]?.id || null;
    if (!categoryId || !positioningCategoryTabsRef.current) return;
    const selectedTab = positioningCategoryTabsRef.current.querySelector(`[data-category-id="${String(categoryId)}"]`);
    if (selectedTab && typeof selectedTab.scrollIntoView === 'function') {
      selectedTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [showProductPositioningModal, positioningCategoryId, selectedCategoryId, categories]);

  const openProductPositioningModal = () => {
    setPositioningCategoryId(selectedCategoryId || categories[0]?.id || null);
    setPositioningSelectedProductId(null);
    setPositioningSelectedCellIndex(null);
    setPositioningSelectedPoolItemId(null);
    setShowProductPositioningModal(true);
  };

  const closeProductPositioningModal = () => {
    setShowProductPositioningModal(false);
    setPositioningSelectedProductId(null);
    setPositioningSelectedCellIndex(null);
    setPositioningSelectedPoolItemId(null);
    setPositioningLayoutSaveMessage('');
  };

  const saveProductPositioningLayout = useCallback(async () => {
    setSavingPositioningLayout(true);
    setPositioningLayoutSaveMessage('');
    try {
      const [layoutRes, colorRes] = await Promise.all([
        fetch(`${API}/settings/product-positioning-layout`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: positioningLayoutByCategory || {} })
        }),
        fetch(`${API}/settings/product-positioning-colors`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: positioningColorByCategory || {} })
        })
      ]);
      if (!layoutRes.ok || !colorRes.ok) {
        const layoutErr = layoutRes.ok ? null : await layoutRes.json().catch(() => null);
        const colorErr = colorRes.ok ? null : await colorRes.json().catch(() => null);
        throw new Error(layoutErr?.error || colorErr?.error || 'Failed to save positioning layout');
      }
      showToast('success', 'Layout and colors saved.');
      closeProductPositioningModal();
    } catch (err) {
      showToast('error', err?.message || 'Failed to save layout');
    } finally {
      setSavingPositioningLayout(false);
    }
  }, [positioningLayoutByCategory, positioningColorByCategory, showToast, closeProductPositioningModal]);

  const fetchSubproductGroups = useCallback(async () => {
    setSubproductGroupsLoading(true);
    try {
      const res = await fetch(`${API}/subproduct-groups`);
      const data = await res.json();
      setSubproductGroups(Array.isArray(data) ? data : []);
    } catch {
      setSubproductGroups([]);
    } finally {
      setSubproductGroupsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (subNavId === 'Subproducts') {
      fetchSubproductGroups();
      fetchCategories();
    }
  }, [subNavId, fetchSubproductGroups, fetchCategories]);

  const fetchTableLocations = useCallback(async () => {
    setTableLocationsLoading(true);
    try {
      const res = await fetch(`${API}/rooms`);
      const data = await res.json();
      setTableLocations(Array.isArray(data) ? data : []);
    } catch {
      setTableLocations([]);
    } finally {
      setTableLocationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (topNavId === 'tables') fetchTableLocations();
  }, [topNavId, fetchTableLocations]);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await fetch(`${API}/users`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (controlSidebarId === 'users') fetchUsers();
  }, [controlSidebarId, fetchUsers]);

  const fetchSubproducts = useCallback(async (groupId) => {
    if (!groupId) {
      setSubproducts([]);
      return;
    }
    setSubproductsLoading(true);
    try {
      const res = await fetch(`${API}/subproduct-groups/${groupId}/subproducts`);
      const data = await res.json();
      setSubproducts(Array.isArray(data) ? data : []);
    } catch {
      setSubproducts([]);
    } finally {
      setSubproductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (subNavId === 'Subproducts' && selectedSubproductGroupId) fetchSubproducts(selectedSubproductGroupId);
  }, [subNavId, selectedSubproductGroupId, fetchSubproducts]);

  useEffect(() => {
    if (subNavId === 'Subproducts' && subproductGroups.length > 0 && !selectedSubproductGroupId) {
      setSelectedSubproductGroupId(subproductGroups[0].id);
    }
  }, [subNavId, subproductGroups, selectedSubproductGroupId]);

  useEffect(() => {
    if (topNavId !== 'categories-products' || subNavId !== 'Subproducts') return;
    if (!selectedSubproductGroupId || !subproductsGroupTabsRef.current) return;
    const selectedTab = subproductsGroupTabsRef.current.querySelector(`[data-group-id="${String(selectedSubproductGroupId)}"]`);
    if (selectedTab && typeof selectedTab.scrollIntoView === 'function') {
      selectedTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [topNavId, subNavId, selectedSubproductGroupId, subproductGroups]);

  const openProductSubproductsModal = useCallback(async (product) => {
    setProductSubproductsProduct(product);
    setShowProductSubproductsModal(true);
    let groups = subproductGroups;
    if (!groups.length) {
      try {
        const res = await fetch(`${API}/subproduct-groups`);
        const data = await res.json().catch(() => []);
        groups = Array.isArray(data) ? data : [];
        setSubproductGroups(groups);
      } catch {
        groups = [];
      }
    }
    setProductSubproductsGroupId('');
    setProductSubproductsLeftSelectedIds(new Set());
    setProductSubproductsRightSelectedIds(new Set());
    setProductSubproductsOptions([]);
    setProductSubproductsLinked([]);
    setLoadingProductSubproductsLinked(true);
    try {
      const res = await fetch(`${API}/products/${product.id}/subproduct-links`);
      const data = await res.json().catch(() => []);
      const links = Array.isArray(data) ? data : [];
      setProductSubproductsLinked(links.map((l) => ({
        subproductId: l.subproductId,
        subproductName: l.subproductName,
        groupId: l.groupId || '',
        groupName: l.groupName || ''
      })));
      // Only preselect group when this product already has linked subproducts.
      const firstLinkedGroupId = links.find((l) => l?.groupId)?.groupId || '';
      if (firstLinkedGroupId && groups.some((g) => g.id === firstLinkedGroupId)) {
        setProductSubproductsGroupId(firstLinkedGroupId);
      }
    } catch {
      setProductSubproductsLinked([]);
    } finally {
      setLoadingProductSubproductsLinked(false);
    }
  }, [subproductGroups]);

  const closeProductSubproductsModal = useCallback(() => {
    setShowProductSubproductsModal(false);
    setProductSubproductsProduct(null);
    setProductSubproductsGroupId('');
    setProductSubproductsLeftSelectedIds(new Set());
    setProductSubproductsRightSelectedIds(new Set());
    setProductSubproductsOptions([]);
    setProductSubproductsLinked([]);
    setLoadingProductSubproductsLinked(false);
    setSavingProductSubproducts(false);
  }, []);

  useEffect(() => {
    if (!showProductSubproductsModal || !productSubproductsGroupId) {
      setProductSubproductsOptions([]);
      setProductSubproductsLeftSelectedIds(new Set());
      return;
    }
    let alive = true;
    const loadGroupSubproducts = async () => {
      try {
        const res = await fetch(`${API}/subproduct-groups/${productSubproductsGroupId}/subproducts`);
        const data = await res.json().catch(() => []);
        if (!alive) return;
        const list = Array.isArray(data) ? data : [];
        setProductSubproductsOptions(list);
        setProductSubproductsLeftSelectedIds(new Set());
      } catch {
        if (!alive) return;
        setProductSubproductsOptions([]);
        setProductSubproductsLeftSelectedIds(new Set());
      }
    };
    loadGroupSubproducts();
    return () => {
      alive = false;
    };
  }, [showProductSubproductsModal, productSubproductsGroupId]);

  const productSubproductsAvailable = useMemo(() => {
    const linkedIds = new Set(productSubproductsLinked.map((l) => l.subproductId));
    return productSubproductsOptions.filter((sp) => !linkedIds.has(sp.id));
  }, [productSubproductsOptions, productSubproductsLinked]);

  const handleAddProductSubproductLinks = useCallback(() => {
    if (!productSubproductsLeftSelectedIds.size) return;
    const group = subproductGroups.find((g) => g.id === productSubproductsGroupId);
    const toAdd = productSubproductsAvailable.filter((sp) => productSubproductsLeftSelectedIds.has(sp.id));
    if (!toAdd.length) return;
    setProductSubproductsLinked((prev) => {
      const existingIds = new Set(prev.map((l) => l.subproductId));
      const newLinks = toAdd
        .filter((sp) => !existingIds.has(sp.id))
        .map((sp) => ({
          subproductId: sp.id,
          subproductName: sp.name,
          groupId: group?.id || productSubproductsGroupId || '',
          groupName: group?.name || ''
        }));
      return [...prev, ...newLinks];
    });
    setProductSubproductsLeftSelectedIds(new Set());
  }, [productSubproductsLeftSelectedIds, productSubproductsAvailable, subproductGroups, productSubproductsGroupId]);

  const handleRemoveProductSubproductLinks = useCallback(() => {
    if (!productSubproductsRightSelectedIds.size) return;
    setProductSubproductsLinked((prev) =>
      prev.filter((l) => !productSubproductsRightSelectedIds.has(l.subproductId))
    );
    setProductSubproductsRightSelectedIds(new Set());
  }, [productSubproductsRightSelectedIds]);

  const removeProductSubproductLink = useCallback((subproductId) => {
    setProductSubproductsLinked((prev) => prev.filter((x) => x.subproductId !== subproductId));
  }, []);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onLogout?.();
  };

  const tr = useCallback((key, fallback) => {
    const translated = t(key);
    return translated === key ? fallback : translated;
  }, [t]);

  const handleSaveProductSubproducts = useCallback(async () => {
    if (!productSubproductsProduct?.id) return;
    setSavingProductSubproducts(true);
    try {
      const linksPayload = productSubproductsLinked.map((l) => ({
        groupId: l.groupId || '',
        subproductId: l.subproductId
      }));
      const res = await fetch(`${API}/products/${productSubproductsProduct.id}/subproduct-links`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: linksPayload })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || tr('control.productSubproducts.saveFailed', 'Failed to save product subproducts'));
      }
      // Reflect linked-subproducts state immediately in the products list UI.
      setProductHasSubproductsById((prev) => ({
        ...prev,
        [productSubproductsProduct.id]: linksPayload.length > 0
      }));
      showToast('success', tr('control.productSubproducts.saved', 'Product subproducts saved.'));
      closeProductSubproductsModal();
    } catch (err) {
      showToast('error', err?.message || tr('control.productSubproducts.saveFailed', 'Failed to save product subproducts.'));
    } finally {
      setSavingProductSubproducts(false);
    }
  }, [closeProductSubproductsModal, productSubproductsLinked, productSubproductsProduct, showToast, tr]);

  const mapTranslatedOptions = useCallback((opts) =>
    opts.map((o) => ({ value: o.value, label: o.labelKey ? tr(o.labelKey, o.fallback) : o.label }))
    , [tr]);
  const getFunctionButtonLabel = useCallback((id) => {
    const item = FUNCTION_BUTTON_ITEM_BY_ID[id];
    if (!item) return '';
    return tr(item.labelKey, item.fallbackLabel);
  }, [tr]);
  const getOptionButtonLabel = useCallback((id) => {
    const item = OPTION_BUTTON_ITEM_BY_ID[id];
    if (!item) return '';
    return tr(item.labelKey, item.fallbackLabel);
  }, [tr]);

  useEffect(() => {
    if (LANGUAGE_OPTIONS.some((o) => o.value === lang)) setAppLanguage(lang);
  }, [lang]);

  const handleSaveAppLanguage = () => {
    setSavingAppLanguage(true);
    try {
      setLang(appLanguage);
      showToast('success', tr('control.languageUpdated', 'Language updated.'));
    } finally {
      setSavingAppLanguage(false);
    }
  };

  const openPriceGroupModal = () => {
    setEditingPriceGroupId(null);
    setPriceGroupName('');
    setPriceGroupTax('standard');
    setShowPriceGroupModal(true);
  };

  const openEditPriceGroupModal = (pg) => {
    setEditingPriceGroupId(pg.id);
    setPriceGroupName(pg.name || '');
    setPriceGroupTax(pg.tax && VAT_OPTIONS.some((o) => o.value === pg.tax) ? pg.tax : 'standard');
    setShowPriceGroupModal(true);
  };

  const closePriceGroupModal = () => {
    setShowPriceGroupModal(false);
    setEditingPriceGroupId(null);
  };

  const handleSavePriceGroup = async () => {
    setSavingPriceGroup(true);
    const payload = { name: priceGroupName.trim() || 'New price group', tax: priceGroupTax };
    try {
      if (editingPriceGroupId) {
        const res = await fetch(`${API}/price-groups/${editingPriceGroupId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const updated = await res.json();
        if (res.ok && updated) {
          setPriceGroups((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          closePriceGroupModal();
        } else fetchPriceGroups();
      } else {
        const res = await fetch(`${API}/price-groups`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const created = await res.json();
        if (res.ok && created) {
          setPriceGroups((prev) => [...prev, created]);
          closePriceGroupModal();
        } else fetchPriceGroups();
      }
    } catch {
      fetchPriceGroups();
    } finally {
      setSavingPriceGroup(false);
    }
  };

  const handleDeletePriceGroup = async (id) => {
    try {
      const res = await fetch(`${API}/price-groups/${id}`, { method: 'DELETE' });
      if (res.ok) setPriceGroups((prev) => prev.filter((p) => p.id !== id));
      else fetchPriceGroups();
    } catch {
      fetchPriceGroups();
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const openCategoryModal = () => {
    setEditingCategoryId(null);
    setCategoryName('');
    setCategoryNextCourse('');
    setCategoryInWebshop(true);
    setCategoryDisplayOnCashRegister(true);
    setCategoryActiveField('name');
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryName(cat.name || '');
    setCategoryNextCourse(cat.nextCourse || '');
    setCategoryInWebshop(cat.inWebshop !== false);
    setCategoryDisplayOnCashRegister(cat.displayOnCashRegister !== false);
    setCategoryActiveField('name');
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategoryId(null);
  };

  const handleSaveCategory = async () => {
    setSavingCategory(true);
    const payload = {
      name: categoryName.trim() || 'New category',
      inWebshop: categoryInWebshop,
      displayOnCashRegister: categoryDisplayOnCashRegister,
      nextCourse: categoryNextCourse.trim() || null
    };
    try {
      if (editingCategoryId) {
        const res = await fetch(`${API}/categories/${editingCategoryId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const updated = await res.json();
        if (res.ok && updated) {
          setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
          closeCategoryModal();
        } else fetchCategories();
      } else {
        const res = await fetch(`${API}/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const created = await res.json();
        if (res.ok && created) {
          setCategories((prev) => [...prev, created]);
          closeCategoryModal();
        } else fetchCategories();
      }
    } catch {
      fetchCategories();
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await fetch(`${API}/categories/${id}`, { method: 'DELETE' });
      if (res.ok) setCategories((prev) => prev.filter((c) => c.id !== id));
      else fetchCategories();
    } catch {
      fetchCategories();
    } finally {
      setDeleteConfirmCategoryId(null);
    }
  };

  const handleMoveCategory = async (id, direction) => {
    const idx = categories.findIndex((c) => c.id === id);
    if (idx < 0) return;
    const nextIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= categories.length) return;
    const curr = categories[idx];
    const other = categories[nextIdx];
    const currOrder = curr.sortOrder;
    const otherOrder = other.sortOrder;
    try {
      await fetch(`${API}/categories/${curr.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: otherOrder })
      });
      await fetch(`${API}/categories/${other.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: currOrder })
      });
      setCategories((prev) => {
        const list = [...prev];
        list[idx] = { ...list[idx], sortOrder: otherOrder };
        list[nextIdx] = { ...list[nextIdx], sortOrder: currOrder };
        return list.sort((a, b) => a.sortOrder - b.sortOrder);
      });
    } catch {
      fetchCategories();
    }
  };

  const openProductModal = () => {
    setEditingProductId(null);
    setProductTab('general');
    setProductName('');
    setProductKeyName('');
    setProductProductionName('');
    setProductPrice('');
    setProductVatTakeOut('');
    setProductVatEatIn('');
    setProductCategoryIds([selectedCategoryId || '']);
    setProductAddition('Subproducts');
    setProductBarcode('');
    setProductPrinter1('');
    setProductPrinter2('');
    setProductPrinter3('');
    setProductActiveField('name');
    setProductFieldErrors({ name: false, keyName: false, productionName: false, vatTakeOut: false, vatEatIn: false });
    setProductTabsUnlocked(true);
    setProductDisplayNumber(null);
    setAdvancedKassaPhotoPreview(null);
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setEditingProductId(product.id);
    setProductTab('general');
    setProductName(product.name || '');
    setProductKeyName(product.keyName ?? '');
    setProductProductionName(product.productionName ?? '');
    setProductPrice(String(product.price ?? ''));
    setProductVatTakeOut(product.vatTakeOut ?? '');
    setProductVatEatIn(product.vatEatIn ?? '');
    let categoryIds = [product.categoryId || selectedCategoryId || ''];
    if (product.categoryIdsJson) {
      try {
        const parsed = JSON.parse(product.categoryIdsJson);
        if (Array.isArray(parsed) && parsed.length) categoryIds = parsed;
      } catch (_) { }
    }
    setProductCategoryIds(categoryIds);
    setProductAddition(product.addition ?? 'Subproducts');
    setProductBarcode(product.barcode ?? '');
    setProductPrinter1(product.printer1 || '');
    setProductPrinter2(product.printer2 || '');
    setProductPrinter3(product.printer3 || '');
    setProductActiveField('name');
    setProductFieldErrors({ name: false, keyName: false, productionName: false, vatTakeOut: false, vatEatIn: false });
    setProductTabsUnlocked(true);
    setProductDisplayNumber(product.number != null ? product.number : null);

    setAdvancedOpenPrice(!!product.openPrice);
    setAdvancedWeegschaal(!!product.weegschaal);
    setAdvancedSubproductRequires(!!product.subproductRequires);
    setAdvancedLeeggoedPrijs(product.leeggoedPrijs ?? '0.00');
    setAdvancedPagerVerplicht(!!product.pagerVerplicht);
    setAdvancedBoldPrint(!!product.boldPrint);
    setAdvancedGroupingReceipt(product.groupingReceipt !== false);
    setAdvancedLabelExtraInfo(product.labelExtraInfo ?? '');
    setAdvancedVoorverpakVervaltype(product.voorverpakVervaltype ?? 'Shelf life');
    setAdvancedHoudbareDagen(product.houdbareDagen ?? '0');
    setAdvancedBewarenGebruik(product.bewarenGebruik ?? '');
    setAdvancedKassaPhotoPreview(product.kassaPhotoPath ?? null);

    let rows = [];
    if (product.extraPricesJson) {
      try {
        const parsed = JSON.parse(product.extraPricesJson);
        if (Array.isArray(parsed)) rows = parsed;
      } catch (_) { }
    }
    setExtraPricesRows(rows);
    setExtraPricesSelectedIndex(0);

    setPurchaseVat(product.purchaseVat ?? '');
    setPurchasePriceExcl(product.purchasePriceExcl ?? '0.00');
    setPurchasePriceIncl(product.purchasePriceIncl ?? '0.00');
    setProfitPct(product.profitPct ?? '0.00');
    setPurchaseUnit(product.unit ?? 'Piece');
    setUnitContent(product.unitContent ?? '0');
    setStock(product.stock ?? '0');
    setPurchaseSupplier(product.supplierCode ?? '');
    setSupplierCode(product.supplierCode ?? '');
    setStockNotification(product.stockNotification !== false);
    setExpirationDate(product.expirationDate ?? '');
    setDeclarationExpiryDays(product.declarationExpiryDays ?? '0');
    setNotificationSoldOutPieces(product.notificationSoldOutPieces ?? '');

    setProductInWebshop(!!product.inWebshop);
    setWebshopOnlineOrderable(product.onlineOrderable !== false);
    setWebsiteRemark(product.websiteRemark ?? '');
    setWebsiteOrder(product.websiteOrder ?? '0');
    setShortWebText(product.shortWebText ?? '');
    setWebsitePhotoFileName(product.websitePhotoPath ?? '');

    setKioskInfo(product.kioskInfo ?? '');
    setKioskTakeAway(product.kioskTakeAway !== false);
    setKioskEatIn(product.kioskEatIn ?? '');
    setKioskSubtitle(product.kioskSubtitle ?? '');
    setKioskMinSubs(product.kioskMinSubs ?? 'unlimited');
    setKioskMaxSubs(product.kioskMaxSubs ?? 'unlimited');
    setKioskPictureFileName(product.kioskPicturePath ?? '');

    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setAdvancedKassaPhotoPreview(null);
    setExtraPricesRows([]);
    setExtraPricesSelectedIndex(0);
    setProductCategoryIds(['']);
    setShowProductModal(false);
    setEditingProductId(null);
  };

  const validateProductRequired = () => {
    const name = !productName.trim();
    const keyName = !productKeyName.trim();
    const productionName = !productProductionName.trim();
    const vatTakeOut = !productVatTakeOut;
    const vatEatIn = !productVatEatIn;
    setProductFieldErrors({ name, keyName, productionName, vatTakeOut, vatEatIn });
    return !name && !keyName && !productionName && !vatTakeOut && !vatEatIn;
  };

  const buildProductPayload = () => {
    const categoryId = (productCategoryIds[0] || '') || selectedCategoryId;
    const payload = {
      name: productName.trim() || 'New product',
      price: parseFloat(productPrice) || 0,
      categoryId: categoryId || undefined,
      keyName: productKeyName.trim() || null,
      productionName: productProductionName.trim() || null,
      vatTakeOut: productVatTakeOut || null,
      vatEatIn: productVatEatIn || null,
      barcode: productBarcode.trim() || null,
      printer1: productPrinter1 || null,
      printer2: productPrinter2 || null,
      printer3: productPrinter3 || null,
      addition: productAddition || null,
      categoryIdsJson: JSON.stringify(productCategoryIds.filter(Boolean)),
      openPrice: advancedOpenPrice,
      weegschaal: advancedWeegschaal,
      subproductRequires: advancedSubproductRequires,
      leeggoedPrijs: advancedLeeggoedPrijs || null,
      pagerVerplicht: advancedPagerVerplicht,
      boldPrint: advancedBoldPrint,
      groupingReceipt: advancedGroupingReceipt,
      labelExtraInfo: advancedLabelExtraInfo.trim() || null,
      kassaPhotoPath: advancedKassaPhotoPreview || null,
      voorverpakVervaltype: advancedVoorverpakVervaltype || null,
      houdbareDagen: advancedHoudbareDagen || null,
      bewarenGebruik: advancedBewarenGebruik.trim() || null,
      extraPricesJson: JSON.stringify(extraPricesRows.map((r) => ({ priceGroupId: r.priceGroupId, priceGroupLabel: r.priceGroupLabel, otherName: r.otherName || '', otherPrinter: r.otherPrinter || '', otherPrice: r.otherPrice || '' }))),
      purchaseVat: purchaseVat || null,
      purchasePriceExcl: purchasePriceExcl || null,
      purchasePriceIncl: purchasePriceIncl || null,
      profitPct: profitPct || null,
      unit: purchaseUnit || null,
      unitContent: unitContent || null,
      stock: stock || null,
      supplierCode: supplierCode.trim() || null,
      stockNotification: stockNotification,
      expirationDate: expirationDate || null,
      declarationExpiryDays: declarationExpiryDays || null,
      notificationSoldOutPieces: notificationSoldOutPieces || null,
      inWebshop: productInWebshop,
      onlineOrderable: webshopOnlineOrderable,
      websiteRemark: websiteRemark.trim() || null,
      websiteOrder: websiteOrder || null,
      shortWebText: shortWebText.trim() || null,
      websitePhotoPath: websitePhotoFileName || null,
      kioskInfo: kioskInfo.trim() || null,
      kioskTakeAway: kioskTakeAway,
      kioskEatIn: kioskEatIn.trim() || null,
      kioskSubtitle: kioskSubtitle.trim() || null,
      kioskMinSubs: kioskMinSubs || null,
      kioskMaxSubs: kioskMaxSubs || null,
      kioskPicturePath: kioskPictureFileName || null
    };
    return payload;
  };

  const handleSaveProduct = async () => {
    if (!validateProductRequired()) return;
    const categoryId = (productCategoryIds[0] || '') || selectedCategoryId;
    if (!categoryId) return;
    setSavingProduct(true);
    const payload = buildProductPayload();
    try {
      if (editingProductId) {
        const res = await fetch(`${API}/products/${editingProductId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const updated = await res.json();
        if (res.ok && updated) {
          setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          closeProductModal();
        } else fetchProducts(selectedCategoryId);
      } else {
        const res = await fetch(`${API}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, categoryId })
        });
        const created = await res.json();
        if (res.ok && created) {
          setProducts((prev) => [...prev, created].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
          closeProductModal();
        } else fetchProducts(selectedCategoryId);
      }
    } catch {
      fetchProducts(selectedCategoryId);
    } finally {
      setSavingProduct(false);
    }
  };

  const productKeyboardValue = productActiveField === 'name' ? productName : productActiveField === 'keyName' ? productKeyName : productActiveField === 'productionName' ? productProductionName : productActiveField === 'price' ? productPrice : productActiveField === 'barcode' ? productBarcode : productActiveField === 'leeggoedPrijs' ? advancedLeeggoedPrijs : productActiveField === 'labelExtraInfo' ? advancedLabelExtraInfo : productActiveField === 'houdbareDagen' ? advancedHoudbareDagen : productActiveField === 'bewarenGebruik' ? advancedBewarenGebruik : productActiveField === 'extraOtherName' ? (extraPricesRows[extraPricesSelectedIndex]?.otherName ?? '') : productActiveField === 'extraOtherPrice' ? (extraPricesRows[extraPricesSelectedIndex]?.otherPrice ?? '') : productActiveField === 'purchasePriceExcl' ? purchasePriceExcl : productActiveField === 'purchasePriceIncl' ? purchasePriceIncl : productActiveField === 'profitPct' ? profitPct : productActiveField === 'unitContent' ? unitContent : productActiveField === 'stock' ? stock : productActiveField === 'supplierCode' ? supplierCode : productActiveField === 'expirationDate' ? expirationDate : productActiveField === 'declarationExpiryDays' ? declarationExpiryDays : productActiveField === 'notificationSoldOutPieces' ? notificationSoldOutPieces : productActiveField === 'websiteRemark' ? websiteRemark : productActiveField === 'websiteOrder' ? websiteOrder : productActiveField === 'shortWebText' ? shortWebText : productActiveField === 'kioskInfo' ? kioskInfo : productActiveField === 'kioskEatIn' ? kioskEatIn : productActiveField === 'kioskSubtitle' ? kioskSubtitle : '';
  const productKeyboardOnChange = productActiveField === 'name'
    ? (v) => {
      // Typing in Name should mirror to Test name and Production name.
      setProductName(v);
      setProductKeyName(v);
      setProductProductionName(v);
      setProductFieldErrors((e) => ({ ...e, name: false, keyName: false, productionName: false }));
    }
    : productActiveField === 'keyName'
      ? (v) => { setProductKeyName(v); setProductFieldErrors((e) => ({ ...e, keyName: false })); }
      : productActiveField === 'productionName'
        ? (v) => { setProductProductionName(v); setProductFieldErrors((e) => ({ ...e, productionName: false })); }
        : productActiveField === 'price'
          ? setProductPrice
          : productActiveField === 'barcode'
            ? setProductBarcode
            : productActiveField === 'leeggoedPrijs'
              ? setAdvancedLeeggoedPrijs
              : productActiveField === 'labelExtraInfo'
                ? setAdvancedLabelExtraInfo
                : productActiveField === 'houdbareDagen'
                  ? setAdvancedHoudbareDagen
                  : productActiveField === 'bewarenGebruik'
                    ? setAdvancedBewarenGebruik
                    : productActiveField === 'extraOtherName'
                      ? (v) => setExtraPricesRows((prev) => { const next = prev.map((r, i) => i === extraPricesSelectedIndex ? { ...r, otherName: v } : r); return next; })
                      : productActiveField === 'extraOtherPrice'
                        ? (v) => setExtraPricesRows((prev) => { const next = prev.map((r, i) => i === extraPricesSelectedIndex ? { ...r, otherPrice: v } : r); return next; })
                        : productActiveField === 'purchasePriceExcl'
                          ? setPurchasePriceExcl
                          : productActiveField === 'purchasePriceIncl'
                            ? setPurchasePriceIncl
                            : productActiveField === 'profitPct'
                              ? setProfitPct
                              : productActiveField === 'unitContent'
                                ? setUnitContent
                                : productActiveField === 'stock'
                                  ? setStock
                                  : productActiveField === 'supplierCode'
                                    ? setSupplierCode
                                    : productActiveField === 'expirationDate'
                                      ? setExpirationDate
                                      : productActiveField === 'declarationExpiryDays'
                                        ? setDeclarationExpiryDays
                                        : productActiveField === 'notificationSoldOutPieces'
                                          ? setNotificationSoldOutPieces
                                          : productActiveField === 'websiteRemark'
                                            ? setWebsiteRemark
                                            : productActiveField === 'websiteOrder'
                                              ? setWebsiteOrder
                                              : productActiveField === 'shortWebText'
                                                ? setShortWebText
                                                : productActiveField === 'kioskInfo'
                                                  ? setKioskInfo
                                                  : productActiveField === 'kioskEatIn'
                                                    ? setKioskEatIn
                                                    : productActiveField === 'kioskSubtitle'
                                                      ? setKioskSubtitle
                                                      : () => { };

  const handleGenerateBarcode = () => {
    const digits = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join('');
    setProductBarcode(digits);
    setBarcodeButtonSpinning(true);
    setTimeout(() => setBarcodeButtonSpinning(false), 600);
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`${API}/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        if (selectedProductId === id) setSelectedProductId(null);
      } else fetchProducts(selectedCategoryId);
    } catch {
      fetchProducts(selectedCategoryId);
    } finally {
      setDeleteConfirmProductId(null);
    }
  };

  const handleMoveProduct = async (direction) => {
    if (!selectedProductId) return;
    const idx = products.findIndex((p) => p.id === selectedProductId);
    if (idx < 0) return;
    const nextIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= products.length) return;
    const curr = products[idx];
    const other = products[nextIdx];
    const currOrder = curr.sortOrder ?? idx;
    const otherOrder = other.sortOrder ?? nextIdx;
    try {
      await fetch(`${API}/products/${curr.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: otherOrder })
      });
      await fetch(`${API}/products/${other.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: currOrder })
      });
      setProducts((prev) => {
        const list = [...prev];
        list[idx] = { ...list[idx], sortOrder: otherOrder };
        list[nextIdx] = { ...list[nextIdx], sortOrder: currOrder };
        return list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      });
    } catch {
      fetchProducts(selectedCategoryId);
    }
  };

  const filteredProducts = productSearch.trim()
    ? products.filter((p) => (p.name || '').toLowerCase().includes(productSearch.trim().toLowerCase()))
    : products;

  const filteredSubproducts = subproductSearch.trim()
    ? subproducts.filter((s) => (s.name || '').toLowerCase().includes(subproductSearch.trim().toLowerCase()))
    : subproducts;

  const handleSubproductNameChange = useCallback((value) => {
    setSubproductName(value);
    setSubproductKeyName(value);
    setSubproductProductionName(value);
  }, []);

  const subproductKeyboardValue = subproductActiveField === 'name'
    ? subproductName
    : subproductActiveField === 'keyName'
      ? subproductKeyName
      : subproductActiveField === 'productionName'
        ? subproductProductionName
        : subproductActiveField === 'price'
          ? subproductPrice
          : '';

  const subproductKeyboardOnChange = subproductActiveField === 'name'
    ? handleSubproductNameChange
    : subproductActiveField === 'keyName'
      ? setSubproductKeyName
      : subproductActiveField === 'productionName'
        ? setSubproductProductionName
        : subproductActiveField === 'price'
          ? setSubproductPrice
          : () => { };

  const openSubproductModal = () => {
    setEditingSubproductId(null);
    setSubproductName('');
    setSubproductKeyName('');
    setSubproductProductionName('');
    setSubproductActiveField('name');
    setSubproductPrice('');
    setSubproductVatTakeOut('');
    setSubproductVatEatIn('');
    setSubproductModalGroupId(selectedSubproductGroupId || (subproductGroups[0]?.id ?? null));
    setSubproductKioskPicture('');
    setSubproductAttachToCategoryIds([]);
    setSubproductAddCategoryId('');
    setShowSubproductModal(true);
  };

  const openEditSubproductModal = (sp) => {
    setEditingSubproductId(sp.id);
    setSubproductName(sp.name || '');
    setSubproductActiveField('name');
    setSubproductModalGroupId(selectedSubproductGroupId);
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_subproduct_extra');
      const extra = raw ? JSON.parse(raw) : {};
      const e = extra[sp.id] || {};
      setSubproductKeyName(e.keyName || '');
      setSubproductProductionName(e.productionName || '');
      setSubproductPrice(e.price != null ? String(e.price) : '');
      setSubproductVatTakeOut(e.vatTakeOut ?? '');
      setSubproductVatEatIn(e.vatEatIn ?? '');
      setSubproductKioskPicture(e.kioskPicture || '');
      setSubproductAttachToCategoryIds(Array.isArray(e.attachToCategoryIds) ? e.attachToCategoryIds : []);
    } catch {
      setSubproductKeyName('');
      setSubproductProductionName('');
      setSubproductPrice('');
      setSubproductVatTakeOut('');
      setSubproductVatEatIn('');
      setSubproductKioskPicture('');
      setSubproductAttachToCategoryIds([]);
    }
    setShowSubproductModal(true);
  };

  const closeSubproductModal = () => {
    setShowSubproductModal(false);
    setEditingSubproductId(null);
    setSubproductName('');
    setSubproductKeyName('');
    setSubproductProductionName('');
    setSubproductActiveField('name');
    setSubproductPrice('');
    setSubproductAttachToCategoryIds([]);
    setSubproductAddCategoryId('');
  };

  const persistSubproductExtra = (id, data) => {
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_subproduct_extra');
      const extra = raw ? JSON.parse(raw) : {};
      extra[id] = data;
      if (typeof localStorage !== 'undefined') localStorage.setItem('pos_subproduct_extra', JSON.stringify(extra));
    } catch (_) { }
  };

  const handleSaveSubproduct = async () => {
    const groupId = subproductModalGroupId || selectedSubproductGroupId;
    if (!groupId && !editingSubproductId) return;
    setSavingSubproduct(true);
    const name = subproductName.trim() || 'New subproduct';
    const extraData = {
      keyName: subproductKeyName.trim(),
      productionName: subproductProductionName.trim(),
      price: subproductPrice.trim(),
      vatTakeOut: subproductVatTakeOut,
      vatEatIn: subproductVatEatIn,
      kioskPicture: subproductKioskPicture.trim(),
      attachToCategoryIds: subproductAttachToCategoryIds
    };
    try {
      if (editingSubproductId) {
        const res = await fetch(`${API}/subproducts/${editingSubproductId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });
        const updated = await res.json();
        if (res.ok && updated) {
          setSubproducts((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
          persistSubproductExtra(editingSubproductId, extraData);
          closeSubproductModal();
        } else fetchSubproducts(selectedSubproductGroupId);
      } else {
        const res = await fetch(`${API}/subproducts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, groupId })
        });
        const created = await res.json();
        if (res.ok && created) {
          setSubproducts((prev) => [...prev, created].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
          persistSubproductExtra(created.id, extraData);
          closeSubproductModal();
        } else fetchSubproducts(selectedSubproductGroupId);
      }
    } catch {
      fetchSubproducts(selectedSubproductGroupId);
    } finally {
      setSavingSubproduct(false);
    }
  };

  const handleDeleteSubproduct = async (id) => {
    try {
      const res = await fetch(`${API}/subproducts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubproducts((prev) => prev.filter((s) => s.id !== id));
        if (selectedSubproductId === id) setSelectedSubproductId(null);
      } else fetchSubproducts(selectedSubproductGroupId);
    } catch {
      fetchSubproducts(selectedSubproductGroupId);
    } finally {
      setDeleteConfirmSubproductId(null);
    }
  };

  const handleMoveSubproduct = async (direction) => {
    if (!selectedSubproductId) return;
    const idx = subproducts.findIndex((s) => s.id === selectedSubproductId);
    if (idx < 0) return;
    const nextIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= subproducts.length) return;
    const curr = subproducts[idx];
    const other = subproducts[nextIdx];
    const currOrder = curr.sortOrder ?? idx;
    const otherOrder = other.sortOrder ?? nextIdx;
    try {
      await fetch(`${API}/subproducts/${curr.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: otherOrder })
      });
      await fetch(`${API}/subproducts/${other.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: currOrder })
      });
      setSubproducts((prev) => {
        const list = [...prev];
        list[idx] = { ...list[idx], sortOrder: otherOrder };
        list[nextIdx] = { ...list[nextIdx], sortOrder: currOrder };
        return list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      });
    } catch {
      fetchSubproducts(selectedSubproductGroupId);
    }
  };

  const handleAddGroup = async () => {
    const name = newGroupName.trim() || 'New group';
    setSavingGroup(true);
    try {
      const res = await fetch(`${API}/subproduct-groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const created = await res.json();
      if (res.ok && created) {
        setSubproductGroups((prev) => [...prev, created].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
        setNewGroupName('');
        setShowAddGroupInline(false);
      } else fetchSubproductGroups();
    } catch {
      fetchSubproductGroups();
    } finally {
      setSavingGroup(false);
    }
  };

  const handleSaveEditGroup = async () => {
    if (!editingGroupId) return;
    const name = editingGroupName.trim() || 'New group';
    setSavingGroup(true);
    try {
      const res = await fetch(`${API}/subproduct-groups/${editingGroupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const updated = await res.json();
      if (res.ok && updated) {
        setSubproductGroups((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        setEditingGroupId(null);
        setEditingGroupName('');
      } else fetchSubproductGroups();
    } catch {
      fetchSubproductGroups();
    } finally {
      setSavingGroup(false);
    }
  };

  const handleMoveGroup = async (groupId, direction) => {
    const sorted = [...subproductGroups].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const idx = sorted.findIndex((g) => g.id === groupId);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const curr = sorted[idx];
    const other = sorted[swapIdx];
    const currOrder = curr.sortOrder ?? idx;
    const otherOrder = other.sortOrder ?? swapIdx;
    setSavingGroup(true);
    try {
      await fetch(`${API}/subproduct-groups/${curr.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sortOrder: otherOrder }) });
      await fetch(`${API}/subproduct-groups/${other.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sortOrder: currOrder }) });
      setSubproductGroups((prev) => prev.map((g) => (g.id === curr.id ? { ...g, sortOrder: otherOrder } : g.id === other.id ? { ...g, sortOrder: currOrder } : g)).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
    } catch {
      fetchSubproductGroups();
    } finally {
      setSavingGroup(false);
    }
  };

  const openTableLocationModal = () => {
    setEditingTableLocationId(null);
    setTableLocationName('');
    setTableLocationSelectionStart(0);
    setTableLocationSelectionEnd(0);
    setTableLocationBackground('');
    setTableLocationTextColor('light');
    setShowTableLocationModal(true);
  };

  const openEditTableLocationModal = (loc) => {
    const nextName = loc.name || '';
    setEditingTableLocationId(loc.id);
    setTableLocationName(nextName);
    setTableLocationSelectionStart(nextName.length);
    setTableLocationSelectionEnd(nextName.length);
    setTableLocationBackground(typeof loc?.background === 'string' ? loc.background : '');
    setTableLocationTextColor(loc?.textColor === 'dark' ? 'dark' : 'light');
    setShowTableLocationModal(true);
  };

  const closeTableLocationModal = () => {
    setShowTableLocationModal(false);
    setEditingTableLocationId(null);
    setTableLocationName('');
    setTableLocationSelectionStart(0);
    setTableLocationSelectionEnd(0);
    setTableLocationBackground('');
    setTableLocationTextColor('light');
  };

  useEffect(() => {
    if (!showTableLocationModal) return;
    const input = tableLocationNameInputRef.current;
    if (!input) return;
    if (document.activeElement !== input) input.focus();
    const pos = Math.min(String(tableLocationName || '').length, Math.max(0, tableLocationSelectionStart));
    try {
      input.setSelectionRange(pos, Math.min(String(tableLocationName || '').length, Math.max(0, tableLocationSelectionEnd)));
    } catch { }
  }, [showTableLocationModal, tableLocationName, tableLocationSelectionStart, tableLocationSelectionEnd]);

  const handleSaveTableLocation = async () => {
    const name = tableLocationName.trim() || 'New location';
    setSavingTableLocation(true);
    try {
      if (editingTableLocationId) {
        const res = await fetch(`${API}/rooms/${editingTableLocationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, background: tableLocationBackground, textColor: tableLocationTextColor })
        });
        const updated = await res.json();
        if (res.ok && updated) {
          setTableLocations((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
          closeTableLocationModal();
        } else fetchTableLocations();
      } else {
        const res = await fetch(`${API}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, background: tableLocationBackground, textColor: tableLocationTextColor })
        });
        const created = await res.json();
        if (res.ok && created) {
          setTableLocations((prev) => [...prev, created].sort((a, b) => (a.name || '').localeCompare(b.name || '')));
          closeTableLocationModal();
        } else fetchTableLocations();
      }
    } catch {
      fetchTableLocations();
    } finally {
      setSavingTableLocation(false);
    }
  };

  const handleDeleteTableLocation = async (id) => {
    try {
      const res = await fetch(`${API}/rooms/${id}`, { method: 'DELETE' });
      if (res.ok) setTableLocations((prev) => prev.filter((t) => t.id !== id));
      else fetchTableLocations();
    } catch {
      fetchTableLocations();
    }
    setDeleteConfirmTableLocationId(null);
  };

  const openSetTablesModal = async (loc) => {
    const locationId = String(loc?.id || '');
    const locationName = String(loc?.name || 'Restaurant');
    const emptyDraft = () => ({ ...normalizeLayoutEditorDraft(null, locationName), tables: [] });
    let draft = emptyDraft();
    if (loc?.layoutJson != null && loc.layoutJson !== '') {
      try {
        const parsed = JSON.parse(loc.layoutJson);
        if (parsed && typeof parsed === 'object') draft = normalizeLayoutEditorDraft(parsed, locationName);
      } catch {
        // keep empty draft
      }
    }
    setSetTablesLocationId(locationId);
    setSetTablesLocationName(locationName);
    setSetTablesDraft(draft);
    setSetTablesSelectedTableId(draft.tables[0]?.id || null);
    setShowSetTablesModal(true);
  };

  const closeSetTablesModal = () => {
    setShowSetTablesModal(false);
    setShowSetTableTypeModal(false);
    setShowSetBoardColorModal(false);
    setSetTablesLocationId(null);
    setSetTablesLocationName('');
    setSetTablesSelectedTableId(null);
    setSetTablesSelectedBoardIndex(null);
    setSetTablesSelectedFlowerPotIndex(null);
  };

  const selectedSetTable = setTablesDraft.tables.find((table) => table.id === setTablesSelectedTableId) || null;
  const boards = Array.isArray(setTablesDraft.boards) ? setTablesDraft.boards : [];
  const flowerPots = Array.isArray(setTablesDraft.flowerPots) ? setTablesDraft.flowerPots : [];
  const selectedSetBoardIndex = setTablesSelectedBoardIndex != null && setTablesSelectedBoardIndex >= 0 && setTablesSelectedBoardIndex < boards.length ? setTablesSelectedBoardIndex : null;
  const selectedSetBoard = selectedSetBoardIndex != null ? boards[selectedSetBoardIndex] : null;
  const selectedSetFlowerPotIndex = setTablesSelectedFlowerPotIndex != null && setTablesSelectedFlowerPotIndex >= 0 && setTablesSelectedFlowerPotIndex < flowerPots.length ? setTablesSelectedFlowerPotIndex : null;
  const selectedSetFlowerPot = selectedSetFlowerPotIndex != null ? flowerPots[selectedSetFlowerPotIndex] : null;

  const openSetTablesNumberModal = useCallback((value, onCommit) => {
    setSetTablesNumberValue(String(safeNumberInputValue(value, 0)));
    setTablesNumberCommitRef.current = onCommit;
    setShowSetTablesNumberModal(true);
  }, []);
  const closeSetTablesNumberModal = useCallback(() => {
    setShowSetTablesNumberModal(false);
    setTablesNumberCommitRef.current = null;
  }, []);
  const applySetTablesNumberModal = useCallback(() => {
    const raw = String(setTablesNumberValue ?? '').trim();
    const parsed = Number(raw);
    const safe = Number.isFinite(parsed) ? parsed : 0;
    if (typeof setTablesNumberCommitRef.current === 'function') setTablesNumberCommitRef.current(safe);
    closeSetTablesNumberModal();
  }, [closeSetTablesNumberModal, setTablesNumberValue]);
  const appendSetTablesNumberKey = useCallback((key) => {
    setSetTablesNumberValue((prev) => `${String(prev ?? '')}${String(key)}`);
  }, []);
  const backspaceSetTablesNumberKey = useCallback(() => {
    setSetTablesNumberValue((prev) => String(prev ?? '').slice(0, -1));
  }, []);
  const clearSetTablesNumberKey = useCallback(() => {
    setSetTablesNumberValue('');
  }, []);
  const openSetTablesNameModal = useCallback(() => {
    if (!selectedSetTable) return;
    const name = String(selectedSetTable?.name ?? '');
    setSetTablesNameValue(name);
    setSetTablesNameSelectionStart(name.length);
    setSetTablesNameSelectionEnd(name.length);
    setShowSetTablesNameModal(true);
  }, [selectedSetTable]);
  const closeSetTablesNameModal = useCallback(() => {
    setShowSetTablesNameModal(false);
  }, []);
  const applySetTablesNameModal = useCallback(() => {
    updateSelectedSetTable({ name: setTablesNameValue });
    setShowSetTablesNameModal(false);
  }, [setTablesNameValue]);

  const readSetTablesPointerPosition = useCallback((clientX, clientY) => {
    const canvasEl = setTablesCanvasRef.current;
    if (!canvasEl) return { x: 0, y: 0 };
    const rect = canvasEl.getBoundingClientRect();
    const zoomFactor = Math.max(0.01, (Number(setTablesCanvasZoom) || 100) / 100);
    return {
      x: (clientX - rect.left) / zoomFactor,
      y: (clientY - rect.top) / zoomFactor
    };
  }, [setTablesCanvasZoom]);

  const startSetItemDrag = useCallback((event, payload) => {
    const point = readSetTablesPointerPosition(event.clientX, event.clientY);
    setTablesDragRef.current = {
      active: true,
      type: payload.type,
      tableId: payload.tableId ?? null,
      index: payload.index ?? null,
      offsetX: point.x - (Number(payload.x) || 0),
      offsetY: point.y - (Number(payload.y) || 0)
    };
  }, [readSetTablesPointerPosition]);

  useEffect(() => {
    if (!showSetTablesModal) return undefined;
    const onPointerMove = (event) => {
      const drag = setTablesDragRef.current;
      if (!drag.active) return;
      const point = readSetTablesPointerPosition(event.clientX, event.clientY);
      const x = point.x - drag.offsetX;
      const y = point.y - drag.offsetY;
      setSetTablesDraft((prev) => {
        if (!prev || typeof prev !== 'object') return prev;
        if (drag.type === 'table' && drag.tableId != null) {
          return clampSetTablesDraftToFloor({
            ...prev,
            tables: (Array.isArray(prev.tables) ? prev.tables : []).map((t) => (
              t.id === drag.tableId ? { ...t, x, y } : t
            ))
          });
        }
        if (drag.type === 'board' && drag.index != null) {
          const nextBoards = [...(Array.isArray(prev.boards) ? prev.boards : [])];
          if (drag.index < 0 || drag.index >= nextBoards.length) return prev;
          nextBoards[drag.index] = { ...nextBoards[drag.index], x, y };
          return clampSetTablesDraftToFloor({ ...prev, boards: nextBoards });
        }
        if (drag.type === 'flowerPot' && drag.index != null) {
          const nextFlowerPots = [...(Array.isArray(prev.flowerPots) ? prev.flowerPots : [])];
          if (drag.index < 0 || drag.index >= nextFlowerPots.length) return prev;
          nextFlowerPots[drag.index] = { ...nextFlowerPots[drag.index], x, y };
          return clampSetTablesDraftToFloor({ ...prev, flowerPots: nextFlowerPots });
        }
        return prev;
      });
    };
    const onPointerUp = () => {
      if (!setTablesDragRef.current.active) return;
      setTablesDragRef.current.active = false;
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [readSetTablesPointerPosition, showSetTablesModal]);

  const updateSelectedSetTable = (patch) => {
    if (!setTablesSelectedTableId) return;
    setSetTablesDraft((prev) =>
      clampSetTablesDraftToFloor({
        ...prev,
        tables: prev.tables.map((table) => {
          if (table.id !== setTablesSelectedTableId) return table;
          return { ...table, ...patch };
        })
      })
    );
  };

  const updateSelectedSetBoard = (patch) => {
    if (selectedSetBoardIndex == null) return;
    setSetTablesDraft((prev) =>
      clampSetTablesDraftToFloor({
        ...prev,
        boards: (() => {
          const nextBoards = [...(Array.isArray(prev.boards) ? prev.boards : [])];
          if (selectedSetBoardIndex >= nextBoards.length) return nextBoards;
          nextBoards[selectedSetBoardIndex] = { ...nextBoards[selectedSetBoardIndex], ...patch };
          return nextBoards;
        })()
      })
    );
  };

  const updateSelectedSetFlowerPot = (patch) => {
    if (selectedSetFlowerPotIndex == null) return;
    setSetTablesDraft((prev) =>
      clampSetTablesDraftToFloor({
        ...prev,
        flowerPots: (() => {
          const nextFlowerPots = [...(Array.isArray(prev.flowerPots) ? prev.flowerPots : [])];
          if (selectedSetFlowerPotIndex >= nextFlowerPots.length) return nextFlowerPots;
          nextFlowerPots[selectedSetFlowerPotIndex] = { ...nextFlowerPots[selectedSetFlowerPotIndex], ...patch };
          return nextFlowerPots;
        })()
      })
    );
  };

  const addSetTable = () => {
    setShowSetTableTypeModal(true);
  };

  const addSetTableWithTemplate = (templateType) => {
    setSetTablesDraft((prev) => {
      const nextTable = createDefaultLayoutTable(prev.tables.length + 1, templateType);
      const next = { ...prev, tables: [...prev.tables, nextTable] };
      setSetTablesSelectedTableId(nextTable.id);
      return clampSetTablesDraftToFloor(next);
    });
    setShowSetTableTypeModal(false);
  };

  const handleAddBoard = () => {
    setShowSetBoardColorModal(true);
  };

  const handleRemoveBoard = () => {
    if (selectedSetBoardIndex == null) return;
    setSetTablesDraft((prev) => {
      const prevBoards = Array.isArray(prev.boards) ? prev.boards : [];
      if (prevBoards.length === 0) return prev;
      const idx = selectedSetBoardIndex < prevBoards.length ? selectedSetBoardIndex : prevBoards.length - 1;
      const nextBoards = prevBoards.filter((_, i) => i !== idx);
      return clampSetTablesDraftToFloor({
        ...prev,
        boards: nextBoards
      });
    });
    setSetTablesSelectedBoardIndex(null);
  };

  const handleSelectBoardColor = (color) => {
    setSetTablesDraft((prev) =>
      clampSetTablesDraftToFloor({
        ...prev,
        boards: [...(Array.isArray(prev.boards) ? prev.boards : []), { ...createDefaultBoard(null, color), color }]
      })
    );
    setSetTablesSelectedTableId(null);
    setSetTablesSelectedFlowerPotIndex(null);
    const nextBoardIndex = boards.length;
    setSetTablesSelectedBoardIndex(nextBoardIndex);
    setShowSetBoardColorModal(false);
  };

  const handleAddFlowerPot = () => {
    setSetTablesDraft((prev) => {
      const next = clampSetTablesDraftToFloor({
        ...prev,
        flowerPots: [...(Array.isArray(prev.flowerPots) ? prev.flowerPots : []), createDefaultFlowerPot()]
      });
      return next;
    });
    setSetTablesSelectedTableId(null);
    setSetTablesSelectedBoardIndex(null);
    setSetTablesSelectedFlowerPotIndex(flowerPots.length);
  };

  const handleRemoveFlowerPot = () => {
    if (selectedSetFlowerPotIndex == null) return;
    setSetTablesDraft((prev) => {
      const prevFlowerPots = Array.isArray(prev.flowerPots) ? prev.flowerPots : [];
      if (prevFlowerPots.length === 0) return prev;
      const idx = selectedSetFlowerPotIndex < prevFlowerPots.length ? selectedSetFlowerPotIndex : prevFlowerPots.length - 1;
      const nextFlowerPots = prevFlowerPots.filter((_, i) => i !== idx);
      return clampSetTablesDraftToFloor({
        ...prev,
        flowerPots: nextFlowerPots
      });
    });
    setSetTablesSelectedFlowerPotIndex(null);
  };

  const removeSetTable = () => {
    if (!setTablesSelectedTableId) return;
    setSetTablesDraft((prev) => {
      const nextTables = prev.tables.filter((table) => table.id !== setTablesSelectedTableId);
      setSetTablesSelectedTableId(nextTables[0]?.id || null);
      return clampSetTablesDraftToFloor({ ...prev, tables: nextTables });
    });
  };

  /** Remove selected flower pot, else board, else the whole table. */
  const handleDeleteSetTablesSelection = () => {
    const fpCount = flowerPots.length;
    const boardCount = boards.length;
    const fpSelected =
      selectedSetFlowerPotIndex != null && selectedSetFlowerPotIndex >= 0 && selectedSetFlowerPotIndex < fpCount;
    const boardSelected =
      selectedSetBoardIndex != null && selectedSetBoardIndex >= 0 && selectedSetBoardIndex < boardCount;
    if (fpSelected) {
      handleRemoveFlowerPot();
      return;
    }
    if (boardSelected) {
      handleRemoveBoard();
      return;
    }
    removeSetTable();
  };

  const handleClearSetTablesLayout = () => {
    setSetTablesDraft((prev) => clampSetTablesDraftToFloor({ ...prev, tables: [], boards: [], flowerPots: [] }));
    setSetTablesSelectedTableId(null);
    setSetTablesSelectedBoardIndex(null);
    setSetTablesSelectedFlowerPotIndex(null);
  };

  const saveSetTablesLayout = async () => {
    if (!setTablesLocationId) return;
    const draftToSave = clampSetTablesDraftToFloor(setTablesDraft);
    setSetTablesDraft(draftToSave);
    try {
      const patchRes = await fetch(`${API}/rooms/${setTablesLocationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layoutJson: JSON.stringify(draftToSave) })
      });
      if (!patchRes.ok) throw new Error('Failed to save table layout');
      const names = (draftToSave.tables || [])
        .map((t) => String(t?.name ?? '').trim())
        .filter(Boolean);
      if (names.length > 0) {
        const syncRes = await fetch(`${API}/tables/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId: setTablesLocationId, names })
        });
        if (!syncRes.ok) throw new Error('Failed to sync tables');
      }
      setTableLocations((prev) =>
        prev.map((r) =>
          r.id === setTablesLocationId ? { ...r, layoutJson: JSON.stringify(draftToSave) } : r
        )
      );
      if (typeof fetchTableLayouts === 'function') fetchTableLayouts();
      if (typeof fetchTables === 'function') fetchTables();
      showToast('success', tr('control.tables.layoutSaved', 'Table layout saved.'));
      closeSetTablesModal();
    } catch {
      showToast('error', tr('control.tables.layoutSaveFailed', 'Failed to save table layout.'));
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      const res = await fetch(`${API}/subproduct-groups/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubproductGroups((prev) => prev.filter((g) => g.id !== id));
        if (selectedSubproductGroupId === id) setSelectedSubproductGroupId(null);
      } else fetchSubproductGroups();
    } catch {
      fetchSubproductGroups();
    } finally {
      setDeleteConfirmGroupId(null);
    }
  };

  const applyDeviceSettingsToState = (saved) => {
    if (!saved || typeof saved !== 'object') return;
    if (saved.useSubproducts != null) setDeviceUseSubproducts(!!saved.useSubproducts);
    if (saved.autoLogoutAfterTransaction != null) setDeviceAutoLogoutAfterTransaction(!!saved.autoLogoutAfterTransaction);
    if (saved.autoReturnToTablePlan != null) setDeviceAutoReturnToTablePlan(!!saved.autoReturnToTablePlan);
    if (saved.disableCashButtonInPayment != null) setDeviceDisableCashButtonInPayment(!!saved.disableCashButtonInPayment);
    if (saved.openPriceWithoutPopup != null) setDeviceOpenPriceWithoutPopup(!!saved.openPriceWithoutPopup);
    if (saved.openCashDrawerAfterOrder != null) setDeviceOpenCashDrawerAfterOrder(!!saved.openCashDrawerAfterOrder);
    if (saved.autoReturnToCounterSale != null) setDeviceAutoReturnToCounterSale(!!saved.autoReturnToCounterSale);
    if (saved.askSendToKitchen != null) setDeviceAskSendToKitchen(!!saved.askSendToKitchen);
    if (saved.counterSaleVat != null) setDeviceCounterSaleVat(saved.counterSaleVat);
    if (saved.tableSaleVat != null) setDeviceTableSaleVat(saved.tableSaleVat);
    if (saved.timeoutLogout != null) setDeviceTimeoutLogout(Number(saved.timeoutLogout) || 0);
    if (saved.fixedBorder != null) setDeviceFixedBorder(!!saved.fixedBorder);
    if (saved.alwaysOnTop != null) setDeviceAlwaysOnTop(!!saved.alwaysOnTop);
    if (saved.askInvoiceOrTicket != null) setDeviceAskInvoiceOrTicket(!!saved.askInvoiceOrTicket);
    if (saved.printerGroupingProducts != null) setDevicePrinterGroupingProducts(!!saved.printerGroupingProducts);
    if (saved.printerShowErrorScreen != null) setDevicePrinterShowErrorScreen(!!saved.printerShowErrorScreen);
    if (saved.printerProductionMessageOnVat != null) setDevicePrinterProductionMessageOnVat(!!saved.printerProductionMessageOnVat);
    if (saved.printerNextCourseOrder != null) setDevicePrinterNextCourseOrder(saved.printerNextCourseOrder);
    if (saved.printerStandardMode != null) setDevicePrinterStandardMode(saved.printerStandardMode);
    if (saved.printerQROrderPrinter != null) setDevicePrinterQROrderPrinter(saved.printerQROrderPrinter || '');
    if (saved.printerReprintWithNextCourse != null) setDevicePrinterReprintWithNextCourse(!!saved.printerReprintWithNextCourse);
    if (saved.printerPrintZeroTickets != null) setDevicePrinterPrintZeroTickets(!!saved.printerPrintZeroTickets);
    if (saved.printerGiftVoucherAtMin != null) setDevicePrinterGiftVoucherAtMin(!!saved.printerGiftVoucherAtMin);
    if (Array.isArray(saved.categoryDisplayIds)) setDeviceCategoryDisplayIds(saved.categoryDisplayIds);
    if (saved.ordersConfirmOnHold != null) setDeviceOrdersConfirmOnHold(!!saved.ordersConfirmOnHold);
    if (saved.ordersPrintBarcodeAfterCreate != null) setDeviceOrdersPrintBarcodeAfterCreate(!!saved.ordersPrintBarcodeAfterCreate);
    if (saved.ordersCustomerCanBeModified != null) setDeviceOrdersCustomerCanBeModified(!!saved.ordersCustomerCanBeModified);
    if (saved.ordersBookTableToWaiting != null) setDeviceOrdersBookTableToWaiting(!!saved.ordersBookTableToWaiting);
    if (saved.ordersFastCustomerName != null) setDeviceOrdersFastCustomerName(!!saved.ordersFastCustomerName);
    if (saved.scheduledPrinter != null) setDeviceScheduledPrinter(saved.scheduledPrinter || '');
    if (saved.scheduledProductionFlow != null) setDeviceScheduledProductionFlow(saved.scheduledProductionFlow);
    if (saved.scheduledLoading != null) setDeviceScheduledLoading(saved.scheduledLoading);
    if (saved.scheduledMode != null) setDeviceScheduledMode(saved.scheduledMode);
    if (saved.scheduledInvoiceLayout != null) setDeviceScheduledInvoiceLayout(saved.scheduledInvoiceLayout);
    if (saved.scheduledCheckoutAt != null) setDeviceScheduledCheckoutAt(saved.scheduledCheckoutAt);
    if (saved.scheduledPrintBarcodeLabel != null) setDeviceScheduledPrintBarcodeLabel(!!saved.scheduledPrintBarcodeLabel);
    if (saved.scheduledDeliveryNoteToTurnover != null) setDeviceScheduledDeliveryNoteToTurnover(!!saved.scheduledDeliveryNoteToTurnover);
    if (saved.scheduledPrintProductionReceipt != null) setDeviceScheduledPrintProductionReceipt(!!saved.scheduledPrintProductionReceipt);
    if (saved.scheduledPrintCustomerProductionReceipt != null) setDeviceScheduledPrintCustomerProductionReceipt(!!saved.scheduledPrintCustomerProductionReceipt);
    if (saved.scheduledWebOrderAutoPrint != null) setDeviceScheduledWebOrderAutoPrint(!!saved.scheduledWebOrderAutoPrint);
    if (saved.optionButtonLayout != null) setOptionButtonSlots(normalizeOptionButtonSlots(saved.optionButtonLayout));
    setSelectedFunctionButtonSlotIndex(null);
    setSelectedOptionButtonSlotIndex(null);
  };

  useEffect(() => {
    if (!showDeviceSettingsModal) return;
    fetchCategories();
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_device_settings');
      const saved = raw ? JSON.parse(raw) : {};
      applyDeviceSettingsToState(saved);
    } catch (_) { }
    let cancelled = false;
    (async () => {
      try {
        const [deviceRes, layoutRes] = await Promise.all([
          fetch(`${API}/settings/device-settings`),
          fetch(`${API}/settings/function-buttons-layout`)
        ]);
        if (cancelled) return;
        if (deviceRes.ok) {
          const deviceData = await deviceRes.json().catch(() => ({}));
          const saved = deviceData?.value;
          if (saved && typeof saved === 'object') {
            applyDeviceSettingsToState(saved);
            if (typeof localStorage !== 'undefined') localStorage.setItem('pos_device_settings', JSON.stringify(saved));
          }
        }
        if (layoutRes.ok) {
          const layoutData = await layoutRes.json().catch(() => ({}));
          setFunctionButtonSlots(normalizeFunctionButtonSlots(layoutData?.value));
        } else if (!cancelled) {
          setFunctionButtonSlots(normalizeFunctionButtonSlots([]));
        }
      } catch {
        if (!cancelled) setFunctionButtonSlots(normalizeFunctionButtonSlots([]));
      }
    })();
    return () => { cancelled = true; };
  }, [showDeviceSettingsModal, fetchCategories]);

  const handleSaveDeviceSettings = async () => {
    setSavingDeviceSettings(true);
    try {
      const payload = {
        useSubproducts: deviceUseSubproducts,
        autoLogoutAfterTransaction: deviceAutoLogoutAfterTransaction,
        autoReturnToTablePlan: deviceAutoReturnToTablePlan,
        disableCashButtonInPayment: deviceDisableCashButtonInPayment,
        openPriceWithoutPopup: deviceOpenPriceWithoutPopup,
        openCashDrawerAfterOrder: deviceOpenCashDrawerAfterOrder,
        autoReturnToCounterSale: deviceAutoReturnToCounterSale,
        askSendToKitchen: deviceAskSendToKitchen,
        counterSaleVat: deviceCounterSaleVat,
        tableSaleVat: deviceTableSaleVat,
        timeoutLogout: deviceTimeoutLogout,
        fixedBorder: deviceFixedBorder,
        alwaysOnTop: deviceAlwaysOnTop,
        askInvoiceOrTicket: deviceAskInvoiceOrTicket,
        printerGroupingProducts: devicePrinterGroupingProducts,
        printerShowErrorScreen: devicePrinterShowErrorScreen,
        printerProductionMessageOnVat: devicePrinterProductionMessageOnVat,
        printerNextCourseOrder: devicePrinterNextCourseOrder,
        printerStandardMode: devicePrinterStandardMode,
        printerQROrderPrinter: devicePrinterQROrderPrinter,
        printerReprintWithNextCourse: devicePrinterReprintWithNextCourse,
        printerPrintZeroTickets: devicePrinterPrintZeroTickets,
        printerGiftVoucherAtMin: devicePrinterGiftVoucherAtMin,
        categoryDisplayIds: deviceCategoryDisplayIds,
        ordersConfirmOnHold: deviceOrdersConfirmOnHold,
        ordersPrintBarcodeAfterCreate: deviceOrdersPrintBarcodeAfterCreate,
        ordersCustomerCanBeModified: deviceOrdersCustomerCanBeModified,
        ordersBookTableToWaiting: deviceOrdersBookTableToWaiting,
        ordersFastCustomerName: deviceOrdersFastCustomerName,
        scheduledPrinter: deviceScheduledPrinter,
        scheduledProductionFlow: deviceScheduledProductionFlow,
        scheduledLoading: deviceScheduledLoading,
        scheduledMode: deviceScheduledMode,
        scheduledInvoiceLayout: deviceScheduledInvoiceLayout,
        scheduledCheckoutAt: deviceScheduledCheckoutAt,
        scheduledPrintBarcodeLabel: deviceScheduledPrintBarcodeLabel,
        scheduledDeliveryNoteToTurnover: deviceScheduledDeliveryNoteToTurnover,
        scheduledPrintProductionReceipt: deviceScheduledPrintProductionReceipt,
        scheduledPrintCustomerProductionReceipt: deviceScheduledPrintCustomerProductionReceipt,
        scheduledWebOrderAutoPrint: deviceScheduledWebOrderAutoPrint,
        optionButtonLayout: optionButtonSlots
      };
      const deviceRes = await fetch(`${API}/settings/device-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: payload })
      });
      if (!deviceRes.ok) {
        const errData = await deviceRes.json().catch(() => ({}));
        throw new Error(errData?.error || 'Failed to save device settings');
      }
      if (typeof localStorage !== 'undefined') localStorage.setItem('pos_device_settings', JSON.stringify(payload));
      const layoutRes = await fetch(`${API}/settings/function-buttons-layout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: functionButtonSlots })
      });
      const layoutData = await layoutRes.json().catch(() => ({}));
      if (!layoutRes.ok) {
        throw new Error(layoutData?.error || 'Failed to save function buttons layout');
      }
      setFunctionButtonSlots(normalizeFunctionButtonSlots(layoutData?.value));
      setSelectedFunctionButtonSlotIndex(null);
      setShowDeviceSettingsModal(false);
      if (typeof onFunctionButtonsSaved === 'function') onFunctionButtonsSaved();
      showToast('success', 'Device settings saved.');
    } catch (err) {
      showToast('error', err?.message || 'Failed to save device settings.');
    } finally {
      setSavingDeviceSettings(false);
    }
  };

  const handleFunctionButtonDragStart = (event, itemId) => {
    if (!itemId) return;
    event.dataTransfer.setData('text/plain', itemId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleFunctionButtonDropOnSlot = (event, slotIndex) => {
    event.preventDefault();
    if (slotIndex < 0 || slotIndex >= FUNCTION_BUTTON_SLOT_COUNT) return;
    const droppedId = String(event.dataTransfer.getData('text/plain') || '').trim();
    if (!FUNCTION_BUTTON_ITEM_IDS.includes(droppedId)) return;
    setFunctionButtonSlots((prev) => {
      const next = [...prev];
      const existingIndex = next.findIndex((id) => id === droppedId);
      if (existingIndex >= 0) next[existingIndex] = '';
      next[slotIndex] = droppedId;
      return next;
    });
    setSelectedFunctionButtonSlotIndex(slotIndex);
  };

  const handleRemoveFunctionButtonFromSlot = () => {
    if (!Number.isInteger(selectedFunctionButtonSlotIndex)) return;
    setFunctionButtonSlots((prev) => {
      const next = [...prev];
      if (!next[selectedFunctionButtonSlotIndex]) return prev;
      next[selectedFunctionButtonSlotIndex] = '';
      return next;
    });
    setSelectedFunctionButtonPoolItemId(null);
  };

  const hasSelectedFunctionButton = Number.isInteger(selectedFunctionButtonSlotIndex)
    && !!functionButtonSlots[selectedFunctionButtonSlotIndex];
  const assignedFunctionButtonIds = new Set(functionButtonSlots.filter(Boolean));
  const assignedOptionButtonIds = new Set(optionButtonSlots.filter(Boolean));
  const unassignedOptionButtons = OPTION_BUTTON_ITEMS.filter((item) => !assignedOptionButtonIds.has(item.id));

  const handleOptionButtonDragStart = (event, itemId) => {
    if (!itemId) return;
    event.dataTransfer.setData('text/plain', itemId);
    event.dataTransfer.effectAllowed = 'move';
  };
  const handleOptionButtonDragStartFromSlot = (event, slotIndex) => {
    const itemId = String(optionButtonSlots[slotIndex] || '').trim();
    if (!itemId || itemId === OPTION_BUTTON_LOCKED_ID) return;
    event.dataTransfer.setData('text/plain', itemId);
    event.dataTransfer.effectAllowed = 'move';
    setSelectedOptionButtonSlotIndex(slotIndex);
  };

  const handleOptionButtonDropOnSlot = (event, slotIndex) => {
    event.preventDefault();
    if (slotIndex < 0 || slotIndex >= OPTION_BUTTON_SLOT_COUNT) return;
    const droppedId = String(event.dataTransfer.getData('text/plain') || '').trim();
    if (!OPTION_BUTTON_ITEM_IDS.includes(droppedId)) return;
    setOptionButtonSlots((prev) => {
      const next = [...prev];
      if (next[slotIndex] === OPTION_BUTTON_LOCKED_ID && droppedId !== OPTION_BUTTON_LOCKED_ID) {
        return prev;
      }
      const existingIndex = next.findIndex((id) => id === droppedId);
      if (existingIndex >= 0) next[existingIndex] = '';
      next[slotIndex] = droppedId;
      return next;
    });
    setSelectedOptionButtonSlotIndex(slotIndex);
  };

  const handleRemoveOptionButtonFromSlot = () => {
    if (!Number.isInteger(selectedOptionButtonSlotIndex)) return;
    setOptionButtonSlots((prev) => {
      const next = [...prev];
      if (!next[selectedOptionButtonSlotIndex]) return prev;
      if (next[selectedOptionButtonSlotIndex] === OPTION_BUTTON_LOCKED_ID) return prev;
      next[selectedOptionButtonSlotIndex] = '';
      return next;
    });
    setSelectedOptionButtonPoolItemId(null);
  };

  const handleOptionButtonSlotClick = (slotIndex) => {
    const assignedId = optionButtonSlots[slotIndex];
    const hasPoolSelection = selectedOptionButtonPoolItemId && OPTION_BUTTON_ITEM_IDS.includes(selectedOptionButtonPoolItemId);
    const hasGridSelection = Number.isInteger(selectedOptionButtonSlotIndex) && optionButtonSlots[selectedOptionButtonSlotIndex];

    if (hasPoolSelection && !assignedId) {
      setOptionButtonSlots((prev) => {
        const next = [...prev];
        next[slotIndex] = selectedOptionButtonPoolItemId;
        return next;
      });
      setSelectedOptionButtonPoolItemId(null);
      setSelectedOptionButtonSlotIndex(null);
      return;
    }
    if (hasGridSelection && selectedOptionButtonSlotIndex !== slotIndex && optionButtonSlots[selectedOptionButtonSlotIndex] !== OPTION_BUTTON_LOCKED_ID) {
      const sourceId = optionButtonSlots[selectedOptionButtonSlotIndex];
      if (optionButtonSlots[slotIndex] === OPTION_BUTTON_LOCKED_ID && sourceId !== OPTION_BUTTON_LOCKED_ID) return;
      setOptionButtonSlots((prev) => {
        const next = [...prev];
        const targetId = next[slotIndex];
        next[selectedOptionButtonSlotIndex] = targetId || '';
        next[slotIndex] = sourceId;
        return next;
      });
      setSelectedOptionButtonSlotIndex(null);
      setSelectedOptionButtonPoolItemId(null);
      return;
    }
    if (assignedId) {
      setSelectedOptionButtonSlotIndex(slotIndex);
      setSelectedOptionButtonPoolItemId(null);
    }
  };

  const handleFunctionButtonSlotClick = (slotIndex) => {
    const assignedId = functionButtonSlots[slotIndex];
    const hasPoolSelection = selectedFunctionButtonPoolItemId && FUNCTION_BUTTON_ITEM_IDS.includes(selectedFunctionButtonPoolItemId);
    const hasGridSelection = Number.isInteger(selectedFunctionButtonSlotIndex) && functionButtonSlots[selectedFunctionButtonSlotIndex];

    if (hasPoolSelection && !assignedId) {
      setFunctionButtonSlots((prev) => {
        const next = [...prev];
        next[slotIndex] = selectedFunctionButtonPoolItemId;
        return next;
      });
      setSelectedFunctionButtonPoolItemId(null);
      setSelectedFunctionButtonSlotIndex(null);
      return;
    }
    if (hasGridSelection && selectedFunctionButtonSlotIndex !== slotIndex) {
      const sourceId = functionButtonSlots[selectedFunctionButtonSlotIndex];
      setFunctionButtonSlots((prev) => {
        const next = [...prev];
        const targetId = next[slotIndex];
        next[selectedFunctionButtonSlotIndex] = targetId || '';
        next[slotIndex] = sourceId;
        return next;
      });
      setSelectedFunctionButtonSlotIndex(null);
      setSelectedFunctionButtonPoolItemId(null);
      return;
    }
    if (assignedId) {
      setSelectedFunctionButtonSlotIndex(slotIndex);
      setSelectedFunctionButtonPoolItemId(null);
    }
  };

  const hasSelectedOptionButton = Number.isInteger(selectedOptionButtonSlotIndex)
    && !!optionButtonSlots[selectedOptionButtonSlotIndex];
  const hasSelectedRemovableOptionButton = Number.isInteger(selectedOptionButtonSlotIndex)
    && !!optionButtonSlots[selectedOptionButtonSlotIndex]
    && optionButtonSlots[selectedOptionButtonSlotIndex] !== OPTION_BUTTON_LOCKED_ID;

  useEffect(() => {
    if (!showSystemSettingsModal) return;
    fetchPriceGroups();
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_system_settings');
      const saved = raw ? JSON.parse(raw) : {};
      if (saved.useStockManagement != null) setSysUseStockManagement(!!saved.useStockManagement);
      if (saved.usePriceGroups != null) setSysUsePriceGroups(!!saved.usePriceGroups);
      if (saved.loginWithoutCode != null) setSysLoginWithoutCode(!!saved.loginWithoutCode);
      if (saved.categorieenPerKassa != null) setSysCategorieenPerKassa(!!saved.categorieenPerKassa);
      if (saved.autoAcceptQROrders != null) setSysAutoAcceptQROrders(!!saved.autoAcceptQROrders);
      if (saved.qrOrdersAutomatischAfrekenen != null) setSysQrOrdersAutomatischAfrekenen(!!saved.qrOrdersAutomatischAfrekenen);
      if (saved.enkelQROrdersKeukenscherm != null) setSysEnkelQROrdersKeukenscherm(!!saved.enkelQROrdersKeukenscherm);
      if (saved.aspect169Windows != null) setSysAspect169Windows(!!saved.aspect169Windows);
      if (saved.vatRateVariousProducts != null) setSysVatRateVariousProducts(saved.vatRateVariousProducts);
      if (saved.arrangeProductsManually != null) setSysArrangeProductsManually(!!saved.arrangeProductsManually);
      if (saved.limitOneUserPerTable != null) setSysLimitOneUserPerTable(!!saved.limitOneUserPerTable);
      if (saved.oneWachtorderPerKlant != null) setSysOneWachtorderPerKlant(!!saved.oneWachtorderPerKlant);
      if (saved.cashButtonVisibleMultiplePayment != null) setSysCashButtonVisibleMultiplePayment(!!saved.cashButtonVisibleMultiplePayment);
      if (saved.usePlaceSettings != null) setSysUsePlaceSettings(!!saved.usePlaceSettings);
      if (saved.tegoedAutomatischInladen != null) setSysTegoedAutomatischInladen(!!saved.tegoedAutomatischInladen);
      if (saved.nieuwstePrijsGebruiken != null) setSysNieuwstePrijsGebruiken(!!saved.nieuwstePrijsGebruiken);
      if (saved.leeggoedTerugname != null) setSysLeeggoedTerugname(saved.leeggoedTerugname);
      if (saved.klantgegevensQRAfdrukken != null) setSysKlantgegevensQRAfdrukken(!!saved.klantgegevensQRAfdrukken);
      if (saved.priceTakeAway != null) setSysPriceTakeAway(saved.priceTakeAway || '');
      if (saved.priceDelivery != null) setSysPriceDelivery(saved.priceDelivery || '');
      if (saved.priceCounterSale != null) setSysPriceCounterSale(saved.priceCounterSale || '');
      if (saved.priceTableSale != null) setSysPriceTableSale(saved.priceTableSale || '');
      if (saved.savingsPointsPerEuro != null) setSysSavingsPointsPerEuro(Number(saved.savingsPointsPerEuro) || 0);
      if (saved.savingsPointsPerDiscount != null) setSysSavingsPointsPerDiscount(Number(saved.savingsPointsPerDiscount) || 0);
      if (saved.savingsDiscount != null) setSysSavingsDiscount(saved.savingsDiscount || '');
      if (saved.ticketVoucherValidity != null) setSysTicketVoucherValidity(saved.ticketVoucherValidity);
      if (saved.ticketScheduledPrintMode != null) setSysTicketScheduledPrintMode(saved.ticketScheduledPrintMode);
      if (saved.ticketScheduledCustomerSort != null) setSysTicketScheduledCustomerSort(saved.ticketScheduledCustomerSort);
      if (saved.barcodeType != null) setSysBarcodeType(saved.barcodeType);
    } catch (_) { }
  }, [showSystemSettingsModal, fetchPriceGroups]);

  const handleSaveSystemSettings = async () => {
    setSavingSystemSettings(true);
    try {
      const payload = {
        useStockManagement: sysUseStockManagement,
        usePriceGroups: sysUsePriceGroups,
        loginWithoutCode: sysLoginWithoutCode,
        categorieenPerKassa: sysCategorieenPerKassa,
        autoAcceptQROrders: sysAutoAcceptQROrders,
        qrOrdersAutomatischAfrekenen: sysQrOrdersAutomatischAfrekenen,
        enkelQROrdersKeukenscherm: sysEnkelQROrdersKeukenscherm,
        aspect169Windows: sysAspect169Windows,
        vatRateVariousProducts: sysVatRateVariousProducts,
        arrangeProductsManually: sysArrangeProductsManually,
        limitOneUserPerTable: sysLimitOneUserPerTable,
        oneWachtorderPerKlant: sysOneWachtorderPerKlant,
        cashButtonVisibleMultiplePayment: sysCashButtonVisibleMultiplePayment,
        usePlaceSettings: sysUsePlaceSettings,
        tegoedAutomatischInladen: sysTegoedAutomatischInladen,
        nieuwstePrijsGebruiken: sysNieuwstePrijsGebruiken,
        leeggoedTerugname: sysLeeggoedTerugname,
        klantgegevensQRAfdrukken: sysKlantgegevensQRAfdrukken,
        priceTakeAway: sysPriceTakeAway,
        priceDelivery: sysPriceDelivery,
        priceCounterSale: sysPriceCounterSale,
        priceTableSale: sysPriceTableSale,
        savingsPointsPerEuro: sysSavingsPointsPerEuro,
        savingsPointsPerDiscount: sysSavingsPointsPerDiscount,
        savingsDiscount: sysSavingsDiscount,
        ticketVoucherValidity: sysTicketVoucherValidity,
        ticketScheduledPrintMode: sysTicketScheduledPrintMode,
        ticketScheduledCustomerSort: sysTicketScheduledCustomerSort,
        barcodeType: sysBarcodeType
      };
      if (typeof localStorage !== 'undefined') localStorage.setItem('pos_system_settings', JSON.stringify(payload));
      setShowSystemSettingsModal(false);
    } finally {
      setSavingSystemSettings(false);
    }
  };

  const openNewPaymentTypeModal = () => {
    setEditingPaymentTypeId(null);
    setPaymentTypeName('');
    setPaymentTypeActive(true);
    setPaymentTypeIntegration('generic');
    setShowPaymentTypeModal(true);
  };

  const openEditPaymentTypeModal = (pt) => {
    setEditingPaymentTypeId(pt.id);
    setPaymentTypeName(pt.name || '');
    setPaymentTypeActive(pt.active !== false);
    setPaymentTypeIntegration(pt.integration || 'generic');
    setShowPaymentTypeModal(true);
  };

  const closePaymentTypeModal = () => {
    setShowPaymentTypeModal(false);
    setEditingPaymentTypeId(null);
    setPaymentTypeName('');
    setPaymentTypeActive(true);
    setPaymentTypeIntegration('generic');
  };

  const handleSavePaymentType = async () => {
    const name = (paymentTypeName || '').trim();
    if (!name) return;
    setSavingPaymentType(true);
    try {
      const body = { name, active: paymentTypeActive, integration: paymentTypeIntegration };
      if (editingPaymentTypeId) {
        const res = await fetch(`${API}/payment-methods/${editingPaymentTypeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to save payment method');
      } else {
        const res = await fetch(`${API}/payment-methods`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to create payment method');
      }
      await fetchPaymentTypes();
      closePaymentTypeModal();
    } catch (e) {
      showToast('error', e?.message || 'Save failed');
    } finally {
      setSavingPaymentType(false);
    }
  };

  const togglePaymentTypeActive = async (id) => {
    const pt = paymentTypes.find((p) => p.id === id);
    if (!pt) return;
    try {
      const res = await fetch(`${API}/payment-methods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !pt.active }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to update');
      await fetchPaymentTypes();
    } catch (e) {
      showToast('error', e?.message || 'Update failed');
    }
  };

  const handleDeletePaymentType = async (id) => {
    try {
      const res = await fetch(`${API}/payment-methods/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to delete');
      }
      await fetchPaymentTypes();
      if (editingPaymentTypeId === id) {
        setShowPaymentTypeModal(false);
        setEditingPaymentTypeId(null);
      }
      showToast('success', tr('control.paymentTypes.deleted', 'Payment method deleted.'));
    } catch (e) {
      showToast('error', e?.message || 'Delete failed');
    } finally {
      setDeleteConfirmPaymentTypeId(null);
    }
  };

  const movePaymentType = async (id, direction) => {
    const sorted = [...paymentTypes].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const idx = sorted.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const swap = direction === 'up' ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= sorted.length) return;
    [sorted[idx], sorted[swap]] = [sorted[swap], sorted[idx]];
    const orderedIds = sorted.map((p) => p.id);
    try {
      const res = await fetch(`${API}/payment-methods/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to reorder');
      await fetchPaymentTypes();
    } catch (e) {
      showToast('error', e?.message || 'Reorder failed');
    }
  };

  const persistProductionMessages = (next) => {
    setProductionMessages(next);
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem('pos_production_messages', JSON.stringify(next));
    } catch (_) { }
  };

  useEffect(() => {
    if (!showProductionMessagesModal) return;
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_production_messages');
      const list = raw ? JSON.parse(raw) : [];
      setProductionMessages(Array.isArray(list) ? list : []);
      setProductionMessageInput('');
      setEditingProductionMessageId(null);
    } catch (_) {
      setProductionMessages([]);
    }
  }, [showProductionMessagesModal]);

  const handleAddOrUpdateProductionMessage = () => {
    const text = (productionMessageInput || '').trim();
    if (!text) return;
    const sorted = [...productionMessages].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    if (editingProductionMessageId) {
      const next = sorted.map((m) => (m.id === editingProductionMessageId ? { ...m, text } : m));
      persistProductionMessages(next);
      setEditingProductionMessageId(null);
    } else {
      const newId = 'pm-' + Date.now();
      const next = [...sorted, { id: newId, text, sortOrder: sorted.length }];
      persistProductionMessages(next);
    }
    setProductionMessageInput('');
  };

  const startEditProductionMessage = (m) => {
    setEditingProductionMessageId(m.id);
    setProductionMessageInput(m.text || '');
  };

  const cancelEditProductionMessage = () => {
    setEditingProductionMessageId(null);
    setProductionMessageInput('');
  };

  const handleDeleteProductionMessage = (id) => {
    const next = productionMessages.filter((m) => m.id !== id).map((m, i) => ({ ...m, sortOrder: i }));
    persistProductionMessages(next);
    setDeleteConfirmProductionMessageId(null);
    if (editingProductionMessageId === id) cancelEditProductionMessage();
  };

  const moveProductionMessage = (id, direction) => {
    const sorted = [...productionMessages].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const idx = sorted.findIndex((m) => m.id === id);
    if (idx < 0) return;
    const swap = direction === 'up' ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= sorted.length) return;
    [sorted[idx], sorted[swap]] = [sorted[swap], sorted[idx]];
    const withOrder = sorted.map((m, i) => ({ ...m, sortOrder: i }));
    persistProductionMessages(withOrder);
  };

  const persistPrinters = (next) => {
    setPrinters(next);
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem('pos_printers', JSON.stringify(next));
    } catch (_) { }
  };

  const parseSerialComPort = (connectionString = '') => {
    const s = String(connectionString || '').trim();
    if (!s) return '';
    if (s.startsWith('serial://')) return (s.substring(9).split('?')[0] || '').trim().toUpperCase();
    if (s.startsWith('\\\\.\\')) return s.substring(4).trim().toUpperCase();
    return s.trim().toUpperCase();
  };

  const parseNetworkAddress = (connectionString = '') => {
    const s = String(connectionString || '').trim();
    if (!s.startsWith('tcp://')) return { ipAddress: '', port: '9100' };
    const [ipAddress = '', port = '9100'] = s.substring(6).split(':');
    return { ipAddress: ipAddress.trim(), port: String(port || '9100').trim() };
  };

  const parseCashmaticConnectionString = (connectionString = '') => {
    const pickFromConfig = (config, keys) => {
      for (const key of keys) {
        if (config[key] != null && String(config[key]).trim() !== '') return String(config[key]).trim();
        const lower = key.toLowerCase();
        const match = Object.keys(config).find((k) => k.toLowerCase() === lower && config[k] != null && String(config[k]).trim() !== '');
        if (match) return String(config[match]).trim();
      }
      return '';
    };

    const raw = String(connectionString || '').trim();
    if (!raw) {
      return { ip: '', port: '', username: '', password: '', url: '' };
    }

    let config = {};
    try {
      config = JSON.parse(raw);
    } catch {
      if (raw.startsWith('tcp://')) {
        const [ip = '', port = '50301'] = raw.substring(6).split(':');
        return { ip: ip.trim(), port: String(port || '50301').trim(), username: '', password: '', url: '' };
      }
      return { ip: raw, port: '', username: '', password: '', url: '' };
    }

    const url = pickFromConfig(config, ['url', 'apiUrl', 'api_url', 'endpoint']);
    const ip = pickFromConfig(config, ['ip', 'ipAddress', 'ip_address']) || (() => {
      if (!url) return '';
      try {
        return new URL(url).hostname || '';
      } catch {
        return '';
      }
    })();
    const port = pickFromConfig(config, ['port']) || (() => {
      if (!url) return '';
      try {
        return String(new URL(url).port || '');
      } catch {
        return '';
      }
    })();
    const username =
      pickFromConfig(config, ['username', 'userName', 'user_name', 'user', 'login']) ||
      (() => {
        if (!url) return '';
        try {
          return new URL(url).username || '';
        } catch {
          return '';
        }
      })();
    const password =
      pickFromConfig(config, ['password', 'pass', 'pwd']) ||
      (() => {
        if (!url) return '';
        try {
          return new URL(url).password || '';
        } catch {
          return '';
        }
      })();

    return { ip, port, username, password, url };
  };

  const mapApiPrinterToUi = (p, index) => {
    const apiType = String(p?.type || '').toLowerCase();
    const connection = String(p?.connection_string || '');
    if (apiType === 'serial') {
      return {
        id: p.id,
        name: p.name || '',
        type: 'COM',
        comPort: parseSerialComPort(connection),
        baudrate: String(p?.baud_rate ?? '9600'),
        characters: '48',
        printerName: '',
        ipAddress: '',
        port: '',
        standard: p?.is_main === 1,
        isDefault: p?.is_main === 1,
        numberOfPrints: 1,
        productionTicketSize: 'normal',
        vatTicketSize: 'normal',
        spaceBetweenProducts: 'none',
        logo: 'disable',
        printerType: 'Esc',
        sortOrder: index,
      };
    }
    if (apiType === 'windows') {
      if (connection.startsWith('tcp://')) {
        const { ipAddress, port } = parseNetworkAddress(connection);
        return {
          id: p.id,
          name: p.name || '',
          type: 'Network',
          comPort: '',
          baudrate: '9600',
          characters: '48',
          printerName: '',
          ipAddress,
          port,
          standard: p?.is_main === 1,
          isDefault: p?.is_main === 1,
          numberOfPrints: 1,
          productionTicketSize: 'normal',
          vatTicketSize: 'normal',
          spaceBetweenProducts: 'none',
          logo: 'disable',
          printerType: 'Esc',
          sortOrder: index,
        };
      }
      return {
        id: p.id,
        name: p.name || '',
        type: 'USB',
        comPort: '',
        baudrate: '9600',
        characters: '48',
        printerName: connection || '',
        ipAddress: '',
        port: '',
        standard: p?.is_main === 1,
        isDefault: p?.is_main === 1,
        numberOfPrints: 1,
        productionTicketSize: 'normal',
        vatTicketSize: 'normal',
        spaceBetweenProducts: 'none',
        logo: 'disable',
        printerType: 'Esc',
        sortOrder: index,
      };
    }
    return {
      id: p?.id ?? `p-${index}`,
      name: p?.name || '',
      type: 'COM',
      comPort: '',
      baudrate: '9600',
      characters: '48',
      printerName: '',
      ipAddress: '',
      port: '',
      standard: false,
      isDefault: false,
      numberOfPrints: 1,
      productionTicketSize: 'normal',
      vatTicketSize: 'normal',
      spaceBetweenProducts: 'none',
      logo: 'disable',
      printerType: 'Esc',
      sortOrder: index,
    };
  };

  const fetchPrintersFromDb = useCallback(async () => {
    try {
      const res = await fetch(`${API}/printers`);
      const data = await res.json().catch(() => null);
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      if (!Array.isArray(list)) return;
      const mapped = list.map((p, i) => mapApiPrinterToUi(p, i));
      if (mapped.length) {
        persistPrinters(mapped);
      } else {
        persistPrinters([]);
      }
    } catch {
      // Keep existing local state when backend is unavailable.
    }
  }, []);

  useEffect(() => {
    fetchPrintersFromDb();
  }, [fetchPrintersFromDb]);

  const openNewPrinterModal = () => {
    setEditingPrinterId(null);
    setShowPrinterModal(true);
  };

  const openEditPrinterModal = (p) => {
    setEditingPrinterId(p.id);
    setShowPrinterModal(true);
  };

  const closePrinterModal = () => {
    setShowPrinterModal(false);
    setEditingPrinterId(null);
  };

  const handleSavePrinterPayload = async (payload) => {
    const sorted = [...printers].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const type = String(payload?.type || 'COM');
    const apiType = type === 'COM' ? 'serial' : 'windows';
    const connectionString =
      type === 'COM'
        ? `serial://${(payload?.comPort || '').trim().toUpperCase()}`
        : type === 'USB'
          ? String(payload?.printerName || '').trim()
          : `tcp://${String(payload?.ipAddress || '').trim()}:${String(payload?.port || '9100').trim()}`;
    const requestBody = {
      name: String(payload?.name || '').trim(),
      type: apiType,
      connection_string: connectionString,
      baud_rate: type === 'COM' ? payload?.baudrate : null,
      data_bits: null,
      parity: null,
      stop_bits: null,
      is_main: payload?.standard ? 1 : 0,
      enabled: 1,
    };
    try {
      const endpoint = editingPrinterId ? `${API}/printers/${editingPrinterId}` : `${API}/printers`;
      const method = editingPrinterId ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchPrintersFromDb();
      showToast('success', 'Printer saved to database.');
      closePrinterModal();
    } catch {
      // Fallback to old local-only behavior if DB save fails.
      if (editingPrinterId) {
        const next = sorted.map((p) => (p.id === editingPrinterId ? { ...p, ...payload } : p));
        persistPrinters(next);
      } else {
        const newId = 'prn-' + Date.now();
        const next = [...sorted, { id: newId, ...payload, isDefault: false, sortOrder: sorted.length }];
        persistPrinters(next);
      }
      showToast('error', 'Failed to save printer to database. Saved locally only.');
      closePrinterModal();
    }
  };

  const setDefaultPrinter = async (id) => {
    try {
      const res = await fetch(`${API}/printers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_main: 1 }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchPrintersFromDb();
      showToast('success', 'Default printer updated.');
    } catch {
      const next = printers.map((p) => ({ ...p, isDefault: p.id === id }));
      persistPrinters(next);
      showToast('error', 'Failed to update default printer in database. Updated locally only.');
    }
  };

  const handleDeletePrinter = async (id) => {
    try {
      const res = await fetch(`${API}/printers/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
      await fetchPrintersFromDb();
      setDeleteConfirmPrinterId(null);
      showToast('success', 'Printer deleted.');
    } catch {
      const next = printers.filter((p) => p.id !== id).map((p, i) => ({ ...p, sortOrder: i }));
      persistPrinters(next);
      setDeleteConfirmPrinterId(null);
      showToast('error', 'Failed to delete printer from database. Deleted locally only.');
    }
  };

  const movePrinter = (id, direction) => {
    const sorted = [...printers].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const idx = sorted.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const swap = direction === 'up' ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= sorted.length) return;
    [sorted[idx], sorted[swap]] = [sorted[swap], sorted[idx]];
    const withOrder = sorted.map((p, i) => ({ ...p, sortOrder: i }));
    persistPrinters(withOrder);
  };

  useEffect(() => {
    if (printerTab !== 'Final tickets') return;
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_printer_final_tickets');
      if (raw) {
        const s = JSON.parse(raw);
        if (s.companyData1 != null) setFinalTicketsCompanyData1(s.companyData1);
        if (s.companyData2 != null) setFinalTicketsCompanyData2(s.companyData2);
        if (s.companyData3 != null) setFinalTicketsCompanyData3(s.companyData3);
        if (s.companyData4 != null) setFinalTicketsCompanyData4(s.companyData4);
        if (s.companyData5 != null) setFinalTicketsCompanyData5(s.companyData5);
        if (s.thankText != null) setFinalTicketsThankText(s.thankText);
        if (s.proforma != null) setFinalTicketsProforma(!!s.proforma);
        if (s.printPaymentType != null) setFinalTicketsPrintPaymentType(!!s.printPaymentType);
        if (s.ticketTearable != null) setFinalTicketsTicketTearable(!!s.ticketTearable);
        if (s.printLogo != null) setFinalTicketsPrintLogo(!!s.printLogo);
        if (s.printingOrder != null) setFinalTicketsPrintingOrder(s.printingOrder);
      }
    } catch (_) { }
  }, [printerTab]);

  const finalTicketsKeyboardValue = finalTicketsActiveField === 'companyData1' ? finalTicketsCompanyData1
    : finalTicketsActiveField === 'companyData2' ? finalTicketsCompanyData2
      : finalTicketsActiveField === 'companyData3' ? finalTicketsCompanyData3
        : finalTicketsActiveField === 'companyData4' ? finalTicketsCompanyData4
          : finalTicketsActiveField === 'companyData5' ? finalTicketsCompanyData5
            : finalTicketsActiveField === 'thankText' ? finalTicketsThankText
              : '';

  const finalTicketsKeyboardOnChange = (v) => {
    if (finalTicketsActiveField === 'companyData1') setFinalTicketsCompanyData1(v);
    else if (finalTicketsActiveField === 'companyData2') setFinalTicketsCompanyData2(v);
    else if (finalTicketsActiveField === 'companyData3') setFinalTicketsCompanyData3(v);
    else if (finalTicketsActiveField === 'companyData4') setFinalTicketsCompanyData4(v);
    else if (finalTicketsActiveField === 'companyData5') setFinalTicketsCompanyData5(v);
    else if (finalTicketsActiveField === 'thankText') setFinalTicketsThankText(v);
  };

  const handleSaveFinalTickets = () => {
    setSavingFinalTickets(true);
    try {
      const payload = {
        companyData1: finalTicketsCompanyData1,
        companyData2: finalTicketsCompanyData2,
        companyData3: finalTicketsCompanyData3,
        companyData4: finalTicketsCompanyData4,
        companyData5: finalTicketsCompanyData5,
        thankText: finalTicketsThankText,
        proforma: finalTicketsProforma,
        printPaymentType: finalTicketsPrintPaymentType,
        ticketTearable: finalTicketsTicketTearable,
        printLogo: finalTicketsPrintLogo,
        printingOrder: finalTicketsPrintingOrder
      };
      if (typeof localStorage !== 'undefined') localStorage.setItem('pos_printer_final_tickets', JSON.stringify(payload));
    } finally {
      setSavingFinalTickets(false);
    }
  };

  useEffect(() => {
    if (printerTab !== 'Production Tickets') return;
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_printer_production_tickets');
      if (raw) {
        const s = JSON.parse(raw);
        if (s.displayCategories != null) setProdTicketsDisplayCategories(!!s.displayCategories);
        if (s.spaceAbove != null) setProdTicketsSpaceAbove(!!s.spaceAbove);
        if (s.ticketTearable != null) setProdTicketsTicketTearable(!!s.ticketTearable);
        if (s.keukenprinterBuzzer != null) setProdTicketsKeukenprinterBuzzer(!!s.keukenprinterBuzzer);
        if (s.productenIndividueel != null) setProdTicketsProductenIndividueel(!!s.productenIndividueel);
        if (s.eatInTakeOutOnderaan != null) setProdTicketsEatInTakeOutOnderaan(!!s.eatInTakeOutOnderaan);
        if (s.nextCoursePrinter1 != null) setProdTicketsNextCoursePrinter1(s.nextCoursePrinter1);
        if (s.nextCoursePrinter2 != null) setProdTicketsNextCoursePrinter2(s.nextCoursePrinter2);
        if (s.nextCoursePrinter3 != null) setProdTicketsNextCoursePrinter3(s.nextCoursePrinter3);
        if (s.nextCoursePrinter4 != null) setProdTicketsNextCoursePrinter4(s.nextCoursePrinter4);
        if (s.printingOrder != null) setProdTicketsPrintingOrder(s.printingOrder);
        if (s.groupingReceipt != null) setProdTicketsGroupingReceipt(s.groupingReceipt);
        if (s.printerOverboeken != null) setProdTicketsPrinterOverboeken(s.printerOverboeken);
      }
    } catch (_) { }
  }, [printerTab]);

  const handleSaveProductionTickets = () => {
    setSavingProdTickets(true);
    try {
      const payload = {
        displayCategories: prodTicketsDisplayCategories,
        spaceAbove: prodTicketsSpaceAbove,
        ticketTearable: prodTicketsTicketTearable,
        keukenprinterBuzzer: prodTicketsKeukenprinterBuzzer,
        productenIndividueel: prodTicketsProductenIndividueel,
        eatInTakeOutOnderaan: prodTicketsEatInTakeOutOnderaan,
        nextCoursePrinter1: prodTicketsNextCoursePrinter1,
        nextCoursePrinter2: prodTicketsNextCoursePrinter2,
        nextCoursePrinter3: prodTicketsNextCoursePrinter3,
        nextCoursePrinter4: prodTicketsNextCoursePrinter4,
        printingOrder: prodTicketsPrintingOrder,
        groupingReceipt: prodTicketsGroupingReceipt,
        printerOverboeken: prodTicketsPrinterOverboeken
      };
      if (typeof localStorage !== 'undefined') localStorage.setItem('pos_printer_production_tickets', JSON.stringify(payload));
    } finally {
      setSavingProdTickets(false);
    }
  };

  const productionTicketsPrinterOptions = [
    ...PRINTER_DISABLED_OPTIONS,
    ...printers.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((p) => ({ value: p.id, label: p.name }))
  ];

  const sortedPrintersForProductModal = [...printers].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const getUniqueProductPrinterOptions = (currentPrinterId, otherPrinterIds = []) => {
    const usedIds = new Set(
      (Array.isArray(otherPrinterIds) ? otherPrinterIds : [])
        .map((id) => String(id || '').trim())
        .filter(Boolean)
    );
    return [
      { value: '', label: tr('control.productModal.disabled', 'Disabled') },
      ...sortedPrintersForProductModal
        .filter((p) => p.id === currentPrinterId || !usedIds.has(p.id))
        .map((p) => ({ value: p.id, label: p.name }))
    ];
  };

  const labelsPrinterOptions = printers.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((p) => ({ value: p.id, label: p.name }));

  const labelsTypeOptions = useMemo(
    () => [{ value: 'production-labels', label: tr('control.labels.type.productionLabels', 'Production labels') }],
    [tr]
  );

  useEffect(() => {
    if (printerTab !== 'Labels') return;
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_printer_labels');
      if (raw) {
        const s = JSON.parse(raw);
        if (s.type != null) setLabelsType(s.type);
        if (s.printer != null) setLabelsPrinter(s.printer);
      }
      const rawList = typeof localStorage !== 'undefined' && localStorage.getItem('pos_printer_labels_list');
      if (rawList) {
        const list = JSON.parse(rawList);
        if (Array.isArray(list) && list.length) setLabelsList(list);
      }
    } catch (_) { }
  }, [printerTab]);

  useEffect(() => {
    if (printerTab !== 'Labels') setLabelsListPage(0);
  }, [printerTab]);

  const persistLabelsList = (next) => {
    setLabelsList(next);
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem('pos_printer_labels_list', JSON.stringify(next));
    } catch (_) { }
  };

  const saveLabelsSettings = (updates) => {
    try {
      if (typeof localStorage === 'undefined') return;
      const raw = localStorage.getItem('pos_printer_labels');
      const prev = raw ? JSON.parse(raw) : {};
      const next = { type: labelsType, printer: labelsPrinter, ...updates };
      localStorage.setItem('pos_printer_labels', JSON.stringify(next));
      if (updates.type != null) setLabelsType(updates.type);
      if (updates.printer != null) setLabelsPrinter(updates.printer);
    } catch (_) { }
  };

  const openNewLabelModal = () => {
    setEditingLabelId(null);
    setLabelName('');
    setLabelHeight('');
    setLabelWidth('');
    setLabelStandard(false);
    setLabelMarginLeft('0');
    setLabelMarginRight('0');
    setLabelMarginBottom('0');
    setLabelMarginTop('0');
    setShowLabelModal(true);
  };

  const openEditLabelModal = (item) => {
    setEditingLabelId(item.id);
    setLabelName(item.name ?? item.sizeLabel ?? '');
    setLabelHeight(String(item.height ?? ''));
    setLabelWidth(String(item.width ?? ''));
    setLabelStandard(!!item.standard);
    setLabelMarginLeft(String(item.marginLeft ?? '0'));
    setLabelMarginRight(String(item.marginRight ?? '0'));
    setLabelMarginBottom(String(item.marginBottom ?? '0'));
    setLabelMarginTop(String(item.marginTop ?? '0'));
    setShowLabelModal(true);
  };

  const closeLabelModal = () => {
    setShowLabelModal(false);
    setEditingLabelId(null);
    setLabelName('');
    setLabelHeight('');
    setLabelWidth('');
    setLabelStandard(false);
    setLabelMarginLeft('0');
    setLabelMarginRight('0');
    setLabelMarginBottom('0');
    setLabelMarginTop('0');
  };

  const handleSaveLabel = () => {
    const name = (labelName || '').trim();
    if (!name) return;
    const sorted = [...labelsList].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const payload = {
      name,
      sizeLabel: name,
      height: labelHeight.trim() || undefined,
      width: labelWidth.trim() || undefined,
      standard: labelStandard,
      marginLeft: Number(labelMarginLeft) || 0,
      marginRight: Number(labelMarginRight) || 0,
      marginBottom: Number(labelMarginBottom) || 0,
      marginTop: Number(labelMarginTop) || 0
    };
    if (editingLabelId) {
      const next = sorted.map((l) => (l.id === editingLabelId ? { ...l, ...payload } : l));
      persistLabelsList(next);
    } else {
      const newId = 'lbl-' + Date.now();
      const next = [...sorted, { id: newId, ...payload, sortOrder: sorted.length }];
      persistLabelsList(next);
    }
    closeLabelModal();
  };

  const handleDeleteLabel = (id) => {
    const next = labelsList.filter((l) => l.id !== id).map((l, i) => ({ ...l, sortOrder: i }));
    persistLabelsList(next);
    setDeleteConfirmLabelId(null);
  };

  const moveLabel = (id, direction) => {
    const sorted = [...labelsList].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const idx = sorted.findIndex((l) => l.id === id);
    if (idx < 0) return;
    const swap = direction === 'up' ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= sorted.length) return;
    [sorted[idx], sorted[swap]] = [sorted[swap], sorted[idx]];
    const withOrder = sorted.map((l, i) => ({ ...l, sortOrder: i }));
    persistLabelsList(withOrder);
  };

  useEffect(() => {
    if (topNavId !== 'external-devices' || subNavId !== 'Price Display') return;
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_price_display');
      if (raw) {
        const s = JSON.parse(raw);
        if (s.type != null) setPriceDisplayType(s.type);
      }
    } catch (_) { }
  }, [topNavId, subNavId]);

  useEffect(() => {
    if (topNavId !== 'external-devices' || subNavId !== 'RFID Reader') return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${API}/settings/rfid-reader`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && data.type != null) {
          setRfidReaderType(data.type);
          return;
        }
      } catch (_) { }
      try {
        const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_rfid_reader');
        if (raw && !cancelled) {
          const s = JSON.parse(raw);
          if (s.type != null) setRfidReaderType(s.type);
        }
      } catch (_) { }
    };
    load();
    return () => { cancelled = true; };
  }, [topNavId, subNavId]);

  useEffect(() => {
    if (topNavId !== 'external-devices' || subNavId !== 'Barcode Scanner') return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${API}/settings/barcode-scanner`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && data.type != null) {
          setBarcodeScannerType(data.type);
          return;
        }
      } catch (_) { }
      try {
        const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_barcode_scanner');
        if (raw && !cancelled) {
          const s = JSON.parse(raw);
          if (s.type != null) setBarcodeScannerType(s.type);
        }
      } catch (_) { }
    };
    load();
    return () => { cancelled = true; };
  }, [topNavId, subNavId]);

  useEffect(() => {
    if (topNavId !== 'external-devices' || subNavId !== 'Credit Card') return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${API}/settings/credit-card`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && data.type != null) {
          setCreditCardType(data.type);
          return;
        }
      } catch (_) { }
      try {
        const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_credit_card');
        if (raw && !cancelled) {
          const s = JSON.parse(raw);
          if (s.type != null) setCreditCardType(s.type);
        }
      } catch (_) { }
    };
    load();
    return () => { cancelled = true; };
  }, [topNavId, subNavId]);

  useEffect(() => {
    if (topNavId !== 'external-devices' || subNavId !== 'Libra') return;
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_scale');
      if (raw) {
        const s = JSON.parse(raw);
        if (s.type != null) setScaleType(s.type);
        if (s.port != null) setScalePort(s.port);
      }
    } catch (_) { }
  }, [topNavId, subNavId]);

  useEffect(() => {
    if (topNavId !== 'external-devices' || subNavId !== 'Cashmatic') return;
    let cancelled = false;
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_cashmatic');
      if (raw) {
        const s = JSON.parse(raw);
        if (s.name != null) setCashmaticName(String(s.name));
        if (s.connectionType != null) setCashmaticConnectionType(String(s.connectionType).toLowerCase() === 'api' ? 'api' : 'tcp');
        if (s.ip != null) setCashmaticIpAddress(String(s.ip));
        if (s.port != null) setCashmaticPort(String(s.port));
        if (s.username != null) setCashmaticUsername(String(s.username));
        if (s.password != null) setCashmaticPassword(String(s.password));
        if (s.url != null) setCashmaticUrl(String(s.url));
        // Backward compatibility with old "ipPort" format
        if ((s.ip == null || s.port == null) && s.ipPort) {
          const [ip, port] = String(s.ipPort).split(':');
          if (ip && s.ip == null) setCashmaticIpAddress(ip);
          if (port && s.port == null) setCashmaticPort(port);
        }
      }
    } catch (_) { }
    const loadCashmaticFromDb = async () => {
      try {
        const res = await fetch(`${API}/payment-terminals`);
        const data = await res.json().catch(() => null);
        if (!res.ok) return;
        const terminals = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        const cashmatic = terminals.find((t) => String(t?.type || '').toLowerCase() === 'cashmatic');
        if (!cashmatic || cancelled) return;
        const parsed = parseCashmaticConnectionString(cashmatic.connection_string);
        setCashmaticTerminalId(cashmatic.id || null);
        if (cashmatic.name != null) setCashmaticName(String(cashmatic.name));
        if (cashmatic.connection_type != null) {
          setCashmaticConnectionType(String(cashmatic.connection_type).toLowerCase() === 'api' ? 'api' : 'tcp');
        }
        if (parsed.ip) setCashmaticIpAddress(parsed.ip);
        if (parsed.port) setCashmaticPort(parsed.port);
        if (parsed.username) setCashmaticUsername(parsed.username);
        if (parsed.password) setCashmaticPassword(parsed.password);
        if (parsed.url) setCashmaticUrl(parsed.url);
      } catch {
        // Keep local values if backend is unavailable.
      }
    };
    loadCashmaticFromDb();
    return () => {
      cancelled = true;
    };
  }, [topNavId, subNavId]);

  useEffect(() => {
    if (topNavId !== 'external-devices' || subNavId !== 'Payworld') return;
    let cancelled = false;
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_payworld');
      if (raw) {
        const s = JSON.parse(raw);
        if (s.name != null) setPayworldName(String(s.name));
        if (s.ip != null) setPayworldIpAddress(String(s.ip));
        if (s.port != null) setPayworldPort(String(s.port));
      }
    } catch (_) { }
    const loadPayworldFromDb = async () => {
      try {
        const res = await fetch(`${API}/payment-terminals`);
        const data = await res.json().catch(() => null);
        if (!res.ok) return;
        const terminals = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        const payworld = terminals.find((t) => String(t?.type || '').toLowerCase() === 'payworld');
        if (!payworld || cancelled) return;
        let parsed = {};
        try {
          parsed = typeof payworld.connection_string === 'string' ? JSON.parse(payworld.connection_string) : (payworld.connection_string || {});
        } catch (_) { }
        setPayworldTerminalId(payworld.id || null);
        if (payworld.name != null) setPayworldName(String(payworld.name));
        if (parsed.ip != null) setPayworldIpAddress(String(parsed.ip));
        if (parsed.port != null) setPayworldPort(String(parsed.port));
      } catch {
        // Keep local values if backend is unavailable.
      }
    };
    loadPayworldFromDb();
    return () => { cancelled = true; };
  }, [topNavId, subNavId]);

  useEffect(() => {
    if (controlSidebarId !== 'reports' || reportTabId !== 'settings') return;
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_report_settings');
      if (raw) {
        const s = JSON.parse(raw);
        if (s && typeof s === 'object') setReportSettings((prev) => ({ ...prev, ...s }));
      }
    } catch (_) { }
  }, [controlSidebarId, reportTabId]);

  const handleSavePriceDisplay = () => {
    setSavingPriceDisplay(true);
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem('pos_price_display', JSON.stringify({ type: priceDisplayType }));
    } finally {
      setSavingPriceDisplay(false);
    }
  };

  const handleSaveRfidReader = async () => {
    setSavingRfidReader(true);
    try {
      const res = await fetch(`${API}/settings/rfid-reader`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: rfidReaderType }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to save');
      if (typeof localStorage !== 'undefined') localStorage.setItem('pos_rfid_reader', JSON.stringify({ type: rfidReaderType }));
      showToast('success', tr('control.saved', 'Saved.'));
    } catch (e) {
      showToast('error', e?.message || tr('control.saveFailed', 'Save failed.'));
    } finally {
      setSavingRfidReader(false);
    }
  };

  const handleSaveBarcodeScanner = async () => {
    setSavingBarcodeScanner(true);
    try {
      const res = await fetch(`${API}/settings/barcode-scanner`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: barcodeScannerType }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to save');
      if (typeof localStorage !== 'undefined') localStorage.setItem('pos_barcode_scanner', JSON.stringify({ type: barcodeScannerType }));
      showToast('success', tr('control.saved', 'Saved.'));
    } catch (e) {
      showToast('error', e?.message || tr('control.saveFailed', 'Save failed.'));
    } finally {
      setSavingBarcodeScanner(false);
    }
  };

  const handleSaveCreditCard = async () => {
    setSavingCreditCard(true);
    try {
      const res = await fetch(`${API}/settings/credit-card`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: creditCardType }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to save');
      if (typeof localStorage !== 'undefined') localStorage.setItem('pos_credit_card', JSON.stringify({ type: creditCardType }));
      showToast('success', tr('control.saved', 'Saved.'));
    } catch (e) {
      showToast('error', e?.message || tr('control.saveFailed', 'Save failed.'));
    } finally {
      setSavingCreditCard(false);
    }
  };

  const handleSaveScale = () => {
    setSavingScale(true);
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem('pos_scale', JSON.stringify({ type: scaleType, port: scalePort }));
    } finally {
      setSavingScale(false);
    }
  };

  const handleSaveCashmatic = async () => {
    setSavingCashmatic(true);
    try {
      const trimmedUsername = String(cashmaticUsername || '').trim();
      const trimmedPassword = String(cashmaticPassword || '').trim();
      const trimmedIp = String(cashmaticIpAddress || '').trim();
      const trimmedUrl = String(cashmaticUrl || '').trim();
      const trimmedPort = String(cashmaticPort || '').trim();
      const resolvedPort = trimmedPort || '50301';
      const validPort = Number.parseInt(resolvedPort, 10);
      if (!trimmedUsername || !trimmedPassword) {
        throw new Error('Cashmatic username and password are required.');
      }
      if (cashmaticConnectionType === 'tcp' && !trimmedIp) {
        throw new Error('Cashmatic IP address is required for TCP/IP.');
      }
      if (cashmaticConnectionType === 'tcp' && /^[0-9]+$/.test(trimmedIp)) {
        throw new Error('Cashmatic IP address is invalid. Please enter a full IP like 192.168.1.60.');
      }
      if (cashmaticConnectionType === 'api' && !trimmedUrl && !trimmedIp) {
        throw new Error('Cashmatic URL or IP address is required for API mode.');
      }
      if (!Number.isInteger(validPort) || validPort < 1 || validPort > 65535) {
        throw new Error('Cashmatic port must be a number between 1 and 65535.');
      }

      const connectionConfig = cashmaticConnectionType === 'api'
        ? {
          url: trimmedUrl,
          ip: trimmedIp,
          port: resolvedPort,
          username: trimmedUsername,
          password: trimmedPassword,
        }
        : {
          ip: trimmedIp,
          port: resolvedPort,
          username: trimmedUsername,
          password: trimmedPassword,
        };

      const terminalPayload = {
        name: String(cashmaticName || '').trim() || 'Cashmatic Terminal',
        type: 'cashmatic',
        connection_type: cashmaticConnectionType === 'api' ? 'api' : 'tcp',
        connection_string: JSON.stringify(connectionConfig),
        enabled: 1,
        is_main: 1,
      };

      let terminalId = cashmaticTerminalId;
      if (!terminalId) {
        const listRes = await fetch(`${API}/payment-terminals`);
        const listData = await listRes.json().catch(() => null);
        const list = Array.isArray(listData?.data) ? listData.data : (Array.isArray(listData) ? listData : []);
        const existing = list.find((t) => String(t?.type || '').toLowerCase() === 'cashmatic');
        if (existing?.id) terminalId = existing.id;
      }

      const endpoint = terminalId ? `${API}/payment-terminals/${terminalId}` : `${API}/payment-terminals`;
      const method = terminalId ? 'PUT' : 'POST';
      const saveRes = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(terminalPayload),
      });
      const saved = await saveRes.json().catch(() => ({}));
      if (!saveRes.ok) {
        throw new Error(saved?.error || `Failed to save Cashmatic terminal (HTTP ${saveRes.status})`);
      }
      if (saved?.id) setCashmaticTerminalId(saved.id);

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('pos_cashmatic', JSON.stringify({
          name: terminalPayload.name,
          connectionType: cashmaticConnectionType,
          ip: connectionConfig.ip,
          port: connectionConfig.port,
          username: connectionConfig.username,
          password: connectionConfig.password,
          url: connectionConfig.url || '',
          ipPort: `${connectionConfig.ip}${connectionConfig.port ? `:${connectionConfig.port}` : ''}`,
        }));
      }
      showToast('success', 'Cashmatic settings saved.');
    } catch (err) {
      showToast('error', err?.message || 'Failed to save Cashmatic settings.');
    } finally {
      setSavingCashmatic(false);
    }
  };

  const handleSavePayworld = async () => {
    setSavingPayworld(true);
    try {
      const trimmedIp = String(payworldIpAddress || '').trim();
      const trimmedPort = String(payworldPort || '').trim();
      const resolvedPort = trimmedPort || '5015';
      const validPort = Number.parseInt(resolvedPort, 10);
      if (!trimmedIp) {
        throw new Error('Payworld IP address is required.');
      }
      if (/^[0-9]+$/.test(trimmedIp)) {
        throw new Error('Payworld IP address is invalid. Please enter a full IP like 192.168.1.60.');
      }
      if (!Number.isInteger(validPort) || validPort < 1 || validPort > 65535) {
        throw new Error('Payworld port must be a number between 1 and 65535.');
      }
      const connectionConfig = { ip: trimmedIp, port: resolvedPort };
      const terminalPayload = {
        name: String(payworldName || '').trim() || 'Payworld Terminal',
        type: 'payworld',
        connection_type: 'tcp',
        connection_string: JSON.stringify(connectionConfig),
        enabled: 1,
        is_main: 1,
      };
      let terminalId = payworldTerminalId;
      if (!terminalId) {
        const listRes = await fetch(`${API}/payment-terminals`);
        const listData = await listRes.json().catch(() => null);
        const list = Array.isArray(listData?.data) ? listData.data : (Array.isArray(listData) ? listData : []);
        const existing = list.find((t) => String(t?.type || '').toLowerCase() === 'payworld');
        if (existing?.id) terminalId = existing.id;
      }
      const endpoint = terminalId ? `${API}/payment-terminals/${terminalId}` : `${API}/payment-terminals`;
      const method = terminalId ? 'PUT' : 'POST';
      const saveRes = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(terminalPayload),
      });
      const saved = await saveRes.json().catch(() => ({}));
      if (!saveRes.ok) {
        throw new Error(saved?.error || `Failed to save Payworld terminal (HTTP ${saveRes.status})`);
      }
      if (saved?.id) setPayworldTerminalId(saved.id);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('pos_payworld', JSON.stringify({
          name: terminalPayload.name,
          ip: connectionConfig.ip,
          port: connectionConfig.port,
        }));
      }
      showToast('success', 'Payworld settings saved.');
    } catch (err) {
      showToast('error', err?.message || 'Failed to save Payworld settings.');
    } finally {
      setSavingPayworld(false);
    }
  };

  const cashmaticKeyboardValue =
    cashmaticActiveField === 'name' ? cashmaticName
      : cashmaticActiveField === 'ip' ? cashmaticIpAddress
        : cashmaticActiveField === 'port' ? cashmaticPort
          : cashmaticActiveField === 'username' ? cashmaticUsername
            : cashmaticActiveField === 'password' ? cashmaticPassword
              : cashmaticActiveField === 'url' ? cashmaticUrl
                : '';

  const cashmaticKeyboardOnChange = (v) => {
    if (cashmaticActiveField === 'name') setCashmaticName(v);
    else if (cashmaticActiveField === 'ip') setCashmaticIpAddress(v);
    else if (cashmaticActiveField === 'port') setCashmaticPort(v);
    else if (cashmaticActiveField === 'username') setCashmaticUsername(v);
    else if (cashmaticActiveField === 'password') setCashmaticPassword(v);
    else if (cashmaticActiveField === 'url') setCashmaticUrl(v);
  };

  const payworldKeyboardValue =
    payworldActiveField === 'name' ? payworldName
      : payworldActiveField === 'ip' ? payworldIpAddress
        : payworldActiveField === 'port' ? payworldPort
          : '';

  const payworldKeyboardOnChange = (v) => {
    if (payworldActiveField === 'name') setPayworldName(v);
    else if (payworldActiveField === 'ip') setPayworldIpAddress(v);
    else if (payworldActiveField === 'port') setPayworldPort(v);
  };

  const setReportSetting = (rowId, column, value) => {
    setReportSettings((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [column]: value }
    }));
  };

  const handleSaveReportSettings = () => {
    setSavingReportSettings(true);
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem('pos_report_settings', JSON.stringify(reportSettings));
    } finally {
      setSavingReportSettings(false);
    }
  };

  const openNewUserModal = () => {
    setEditingUserId(null);
    setUserName('');
    setUserPin('');
    setUserModalTab('general');
    setUserAvatarColorIndex(0);
    setUserModalActiveField(null);
    setUserPrivileges({ ...DEFAULT_USER_PRIVILEGES });
    setShowUserModal(true);
  };

  const openEditUserModal = async (u) => {
    setEditingUserId(u.id);
    setUserName(u.name || '');
    setUserPin('');
    setUserModalTab('general');
    setUserAvatarColorIndex(0);
    setUserModalActiveField(null);
    setUserPrivileges({ ...DEFAULT_USER_PRIVILEGES });
    try {
      const res = await fetch(`${API}/users/${u.id}`);
      const data = await res.json();
      if (res.ok && data) {
        setUserName(data.name || '');
        setUserPin(data.pin != null ? String(data.pin) : '');
      } else {
        showToast('error', data?.error || 'Failed to load user details');
      }
    } catch {
      showToast('error', 'Failed to load user details');
    }
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setEditingUserId(null);
    setUserName('');
    setUserPin('');
    setUserModalTab('general');
    setUserAvatarColorIndex(0);
    setUserModalActiveField(null);
    setUserPrivileges({ ...DEFAULT_USER_PRIVILEGES });
  };

  const handleSaveUser = async () => {
    setSavingUser(true);
    try {
      if (editingUserId) {
        const body = { name: userName.trim() || 'New user' };
        if (userPin !== '') body.pin = userPin;
        const res = await fetch(`${API}/users/${editingUserId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const updated = await res.json();
        if (res.ok && updated) {
          setUsers((prev) => prev.map((u) => (u.id === editingUserId ? { ...u, ...updated } : u)));
          closeUserModal();
        }
      } else {
        const res = await fetch(`${API}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: userName.trim() || 'New user', pin: userPin || '1234' })
        });
        const created = await res.json();
        if (res.ok && created) {
          setUsers((prev) => [...prev, created].sort((a, b) => (a.name || '').localeCompare(b.name || '')));
          closeUserModal();
        }
      }
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`${API}/users/${id}`, { method: 'DELETE' });
      if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
      else fetchUsers();
    } catch {
      fetchUsers();
    }
    setDeleteConfirmUserId(null);
  };

  useEffect(() => {
    if (topNavId !== 'categories-products' || subNavId !== 'Discounts') return;
    try {
      const raw = typeof localStorage !== 'undefined' && localStorage.getItem('pos_discounts');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) setDiscounts(list);
      }
    } catch (_) { }
  }, [topNavId, subNavId]);

  useEffect(() => {
    if (!showDiscountModal) return;
    let alive = true;
    const loadProductsForDiscounts = async () => {
      const normalizeOptions = (list) => {
        const seen = new Set();
        return list
          .filter((p) => p && p.id != null)
          .map((p) => ({ value: p.id, label: p.name || `#${p.id}` }))
          .filter((opt) => {
            const key = String(opt.value);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
      };
      // Load through categories endpoints to avoid /api/products 404 noise
      try {
        const categoriesRes = await fetch(`${API}/categories`);
        const categoriesData = await categoriesRes.json();
        const cats = Array.isArray(categoriesData) ? categoriesData : [];
        const settled = await Promise.allSettled(
          cats
            .filter((c) => c?.id != null)
            .map((c) =>
              fetch(`${API}/categories/${c.id}/products`)
                .then((r) => (r.ok ? r.json() : []))
                .catch(() => [])
            )
        );
        if (!alive) return;
        const merged = settled
          .filter((x) => x.status === 'fulfilled')
          .flatMap((x) => (Array.isArray(x.value) ? x.value : []));
        setDiscountProductOptions(normalizeOptions(merged));
      } catch {
        if (alive) setDiscountProductOptions([]);
      }
    };
    loadProductsForDiscounts();
    return () => { alive = false; };
  }, [showDiscountModal]);

  const openNewDiscountModal = () => {
    setEditingDiscountId(null);
    setDiscountName('');
    setDiscountTrigger('number');
    setDiscountType('amount');
    setDiscountValue('');
    const today = new Date().toISOString().slice(0, 10);
    setDiscountStartDate(today);
    setDiscountEndDate(today);
    setDiscountOn('products');
    setDiscountTargetId('');
    setDiscountTargetIds([]);
    setDiscountPieces('');
    setDiscountCombinable(false);
    setDiscountKeyboardValue('');
    setShowDiscountModal(true);
  };

  const openEditDiscountModal = (d) => {
    setEditingDiscountId(d.id);
    setDiscountName(d.name || '');
    setDiscountTrigger(d.trigger || 'number');
    setDiscountType(d.type || 'amount');
    setDiscountValue(String(d.value ?? ''));
    setDiscountStartDate(d.startDate || '');
    setDiscountEndDate(d.endDate || '');
    setDiscountOn(d.discountOn || 'products');
    const ids = Array.isArray(d.targetIds) ? d.targetIds.filter(Boolean) : (d.targetId ? [d.targetId] : []);
    setDiscountTargetIds(ids);
    setDiscountTargetId('');
    setDiscountPieces(String(d.pieces ?? ''));
    setDiscountCombinable(!!d.combinable);
    setDiscountKeyboardValue('');
    setShowDiscountModal(true);
  };

  const closeDiscountModal = () => {
    setShowDiscountModal(false);
    setEditingDiscountId(null);
    setDiscountName('');
    setDiscountTargetId('');
    setDiscountTargetIds([]);
    setDiscountKeyboardValue('');
    setDiscountCalendarField(null);
  };

  const persistDiscounts = (list) => {
    setDiscounts(list);
    if (typeof localStorage !== 'undefined') localStorage.setItem('pos_discounts', JSON.stringify(list));
  };

  const handleSaveDiscount = () => {
    setSavingDiscount(true);
    try {
      const payload = {
        id: editingDiscountId || `d-${Date.now()}`,
        name: discountName.trim() || 'New discount',
        trigger: discountTrigger,
        type: discountType,
        value: discountValue.trim(),
        startDate: discountStartDate,
        endDate: discountEndDate,
        discountOn,
        targetId: discountTargetIds[0] || '',
        targetIds: discountTargetIds,
        pieces: discountPieces.trim(),
        combinable: discountCombinable
      };
      if (editingDiscountId) {
        const next = discounts.map((d) => (d.id === editingDiscountId ? payload : d));
        persistDiscounts(next);
      } else {
        persistDiscounts([...discounts, payload]);
      }
      closeDiscountModal();
    } finally {
      setSavingDiscount(false);
    }
  };

  const handleDeleteDiscount = (id) => {
    persistDiscounts(discounts.filter((d) => d.id !== id));
    setDeleteConfirmDiscountId(null);
  };

  const fetchKitchens = useCallback(async () => {
    try {
      const res = await fetch(`${API}/kitchens`);
      const data = await res.json().catch(() => []);
      if (!res.ok) return;
      const list = Array.isArray(data) ? data : [];
      setKitchens(list.filter((k) => k?.id !== KITCHEN_ADMIN_CREDENTIAL_ID));
    } catch {
      setKitchens([]);
    }
  }, []);

  useEffect(() => {
    if (topNavId !== 'categories-products' || subNavId !== 'Kitchen') return;
    fetchKitchens();
  }, [topNavId, subNavId, fetchKitchens]);

  const openNewKitchenModal = () => {
    setEditingKitchenId(null);
    setKitchenModalName('');
    setShowKitchenModal(true);
  };

  const openEditKitchenModal = (m) => {
    setEditingKitchenId(m?.id ?? null);
    setKitchenModalName(m?.name || '');
    setShowKitchenModal(true);
  };

  const closeKitchenModal = () => {
    setShowKitchenModal(false);
    setEditingKitchenId(null);
    setKitchenModalName('');
  };

  const handleSaveKitchen = async () => {
    setSavingKitchen(true);
    try {
      const name = kitchenModalName.trim() || tr('control.kitchen.defaultNewName', 'New Kitchen');
      if (editingKitchenId) {
        const res = await fetch(`${API}/kitchens/${editingKitchenId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });
        if (!res.ok) throw new Error('save failed');
        const updated = await res.json();
        setKitchens((prev) =>
          prev
            .map((k) =>
              k.id === updated.id
                ? { ...k, id: updated.id, name: updated.name, productIds: updated.productIds ?? k.productIds ?? [] }
                : k
            )
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        );
      } else {
        const res = await fetch(`${API}/kitchens`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });
        if (!res.ok) throw new Error('save failed');
        const created = await res.json();
        setKitchens((prev) =>
          [...prev, { ...created, productIds: created.productIds ?? [] }].sort((a, b) =>
            (a.name || '').localeCompare(b.name || '')
          )
        );
      }
      closeKitchenModal();
    } catch {
      await fetchKitchens();
    } finally {
      setSavingKitchen(false);
    }
  };

  const handleDeleteKitchen = async (id) => {
    try {
      const res = await fetch(`${API}/kitchens/${id}`, { method: 'DELETE' });
      if (res.ok) setKitchens((prev) => prev.filter((k) => k.id !== id));
      else await fetchKitchens();
    } catch {
      await fetchKitchens();
    }
    setDeleteConfirmKitchenId(null);
  };

  const closeKitchenProductsModal = useCallback(() => {
    setShowKitchenProductsModal(false);
    setKitchenProductsKitchen(null);
    setKitchenProductsCatalog([]);
    setKitchenProductsModalCategories([]);
    setKitchenProductsCategoryFilter('');
    setKitchenProductsLinked([]);
    setKitchenProductsLeftSelectedIds(new Set());
    setKitchenProductsRightSelectedIds(new Set());
  }, []);

  const openKitchenProductsModal = useCallback(async (kitchen) => {
    if (!kitchen?.id) return;
    setKitchenProductsKitchen(kitchen);
    setKitchenProductsCategoryFilter('');
    setKitchenProductsLeftSelectedIds(new Set());
    setKitchenProductsRightSelectedIds(new Set());
    setShowKitchenProductsModal(true);
    setLoadingKitchenProductsCatalog(true);
    setKitchenProductsCatalog([]);
    setKitchenProductsModalCategories([]);
    setKitchenProductsLinked([]);
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch(`${API}/categories`),
        fetch(`${API}/products/catalog`)
      ]);
      const catsRaw = await catRes.json().catch(() => []);
      const data = await prodRes.json().catch(() => []);
      const catalog = prodRes.ok && Array.isArray(data) ? data : [];
      setKitchenProductsCatalog(catalog);
      const catOpts = Array.isArray(catsRaw)
        ? catsRaw.map((c) => ({ id: c.id, name: c.name || c.id })).filter((c) => c.id)
        : [];
      setKitchenProductsModalCategories(catOpts);
      const linkedIds = Array.isArray(kitchen.productIds) ? kitchen.productIds : [];
      const linked = linkedIds.map((id) => {
        const p = catalog.find((x) => x.id === id);
        return {
          productId: id,
          productName: p?.name || id,
          categoryName: p?.categoryName || ''
        };
      });
      setKitchenProductsLinked(linked);
    } catch {
      setKitchenProductsCatalog([]);
      setKitchenProductsModalCategories([]);
    } finally {
      setLoadingKitchenProductsCatalog(false);
    }
  }, []);

  useEffect(() => {
    if (!showKitchenProductsModal) return;
    setKitchenProductsLeftSelectedIds(new Set());
  }, [showKitchenProductsModal, kitchenProductsCategoryFilter]);

  const kitchenProductsOptionsFiltered = useMemo(() => {
    if (!kitchenProductsCategoryFilter) return kitchenProductsCatalog;
    return kitchenProductsCatalog.filter((p) => p.categoryId === kitchenProductsCategoryFilter);
  }, [kitchenProductsCatalog, kitchenProductsCategoryFilter]);

  const kitchenProductsAvailable = useMemo(() => {
    const linkedIds = new Set(kitchenProductsLinked.map((l) => l.productId));
    const takenByOtherKitchen = new Set();
    const currentKitchenId = kitchenProductsKitchen?.id;
    for (const k of kitchens) {
      if (!k?.id || k.id === currentKitchenId) continue;
      for (const pid of Array.isArray(k.productIds) ? k.productIds : []) {
        if (pid) takenByOtherKitchen.add(pid);
      }
    }
    return kitchenProductsOptionsFiltered.filter(
      (p) => p?.id && !linkedIds.has(p.id) && !takenByOtherKitchen.has(p.id)
    );
  }, [kitchenProductsOptionsFiltered, kitchenProductsLinked, kitchens, kitchenProductsKitchen?.id]);

  const handleAddKitchenProductLinks = useCallback(() => {
    if (!kitchenProductsLeftSelectedIds.size) return;
    const toAdd = kitchenProductsAvailable.filter((p) => kitchenProductsLeftSelectedIds.has(p.id));
    if (!toAdd.length) return;
    setKitchenProductsLinked((prev) => {
      const existing = new Set(prev.map((l) => l.productId));
      const newRows = toAdd
        .filter((p) => !existing.has(p.id))
        .map((p) => ({
          productId: p.id,
          productName: p.name || p.id,
          categoryName: p.categoryName || ''
        }));
      return [...prev, ...newRows];
    });
    setKitchenProductsLeftSelectedIds(new Set());
  }, [kitchenProductsLeftSelectedIds, kitchenProductsAvailable]);

  const handleRemoveKitchenProductLinks = useCallback(() => {
    if (!kitchenProductsRightSelectedIds.size) return;
    setKitchenProductsLinked((prev) => prev.filter((l) => !kitchenProductsRightSelectedIds.has(l.productId)));
    setKitchenProductsRightSelectedIds(new Set());
  }, [kitchenProductsRightSelectedIds]);

  const removeKitchenProductLink = useCallback((productId) => {
    setKitchenProductsLinked((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const handleSaveKitchenProducts = useCallback(async () => {
    if (!kitchenProductsKitchen?.id) return;
    setSavingKitchenProducts(true);
    try {
      const productIds = kitchenProductsLinked.map((l) => l.productId);
      const res = await fetch(`${API}/kitchens/${kitchenProductsKitchen.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds })
      });
      if (!res.ok) throw new Error('save failed');
      await res.json();
      await fetchKitchens();
      closeKitchenProductsModal();
    } catch {
      await fetchKitchens();
    } finally {
      setSavingKitchenProducts(false);
    }
  }, [kitchenProductsKitchen, kitchenProductsLinked, closeKitchenProductsModal, fetchKitchens]);

  return (
    <div className="flex h-full bg-pos-bg text-pos-text">
      {/* Control left sidebar */}
      <aside className="w-1/5 shrink-0 flex flex-col bg-pos-panel border-r border-pos-border">
        <nav className="flex flex-col gap-0.5 flex-1 p-3">
          {CONTROL_SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`flex items-center gap-3 px-2 py-3 rounded-lg text-left text-md transition-colors ${controlSidebarId === item.id
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
              onClick={() => setShowLogoutModal(true)}
            >
              {tr('logOut', 'Log out')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <ControlViewMainContentArea
        ctx={{
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
          usersLoading,
        }}
      />
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

      <ControlViewUserModal
        tr={tr}
        showUserModal={showUserModal}
        closeUserModal={closeUserModal}
        userModalTab={userModalTab}
        setUserModalTab={setUserModalTab}
        userName={userName}
        setUserName={setUserName}
        userPin={userPin}
        setUserPin={setUserPin}
        userModalActiveField={userModalActiveField}
        setUserModalActiveField={setUserModalActiveField}
        userAvatarColorIndex={userAvatarColorIndex}
        setUserAvatarColorIndex={setUserAvatarColorIndex}
        userPrivileges={userPrivileges}
        setUserPrivileges={setUserPrivileges}
        savingUser={savingUser}
        handleSaveUser={handleSaveUser}
      />

      {/* New / Edit discount modal */}
      <ControlViewDiscountModal
        tr={tr}
        showDiscountModal={showDiscountModal}
        closeDiscountModal={closeDiscountModal}
        categories={categories}
        discountProductOptions={discountProductOptions}
        discountTargetIds={discountTargetIds}
        discountOn={discountOn}
        discountTargetId={discountTargetId}
        setDiscountTargetId={setDiscountTargetId}
        setDiscountTargetIds={setDiscountTargetIds}
        discountName={discountName}
        setDiscountName={setDiscountName}
        discountOnOptions={DISCOUNT_ON_OPTIONS}
        setDiscountOn={setDiscountOn}
        discountTriggerOptions={DISCOUNT_TRIGGER_OPTIONS}
        discountTrigger={discountTrigger}
        setDiscountTrigger={setDiscountTrigger}
        discountPieces={discountPieces}
        setDiscountPieces={setDiscountPieces}
        discountCombinable={discountCombinable}
        setDiscountCombinable={setDiscountCombinable}
        discountTypeOptions={DISCOUNT_TYPE_OPTIONS}
        discountType={discountType}
        setDiscountType={setDiscountType}
        discountValue={discountValue}
        setDiscountValue={setDiscountValue}
        formatDateForCurrentLanguage={formatDateForCurrentLanguage}
        discountStartDate={discountStartDate}
        discountEndDate={discountEndDate}
        setDiscountCalendarField={setDiscountCalendarField}
        discountTargetListRef={discountTargetListRef}
        updateDiscountTargetScrollState={updateDiscountTargetScrollState}
        canDiscountTargetScrollUp={canDiscountTargetScrollUp}
        canDiscountTargetScrollDown={canDiscountTargetScrollDown}
        scrollDiscountTargetByPage={scrollDiscountTargetByPage}
        savingDiscount={savingDiscount}
        handleSaveDiscount={handleSaveDiscount}
        discountKeyboardValue={discountKeyboardValue}
        setDiscountKeyboardValue={setDiscountKeyboardValue}
        discountCalendarField={discountCalendarField}
        setDiscountStartDate={setDiscountStartDate}
        setDiscountEndDate={setDiscountEndDate}
      />

      {/* New / Edit table location modal */}
      <ControlViewTableLocationModal
        tr={tr}
        mapTranslatedOptions={mapTranslatedOptions}
        showTableLocationModal={showTableLocationModal}
        topNavId={topNavId}
        closeTableLocationModal={closeTableLocationModal}
        tableLocationNameInputRef={tableLocationNameInputRef}
        tableLocationName={tableLocationName}
        setTableLocationName={setTableLocationName}
        tableLocationSelectionStart={tableLocationSelectionStart}
        tableLocationSelectionEnd={tableLocationSelectionEnd}
        setTableLocationSelectionStart={setTableLocationSelectionStart}
        setTableLocationSelectionEnd={setTableLocationSelectionEnd}
        tableLocationBackground={tableLocationBackground}
        setTableLocationBackground={setTableLocationBackground}
        tableLocationTextColor={tableLocationTextColor}
        setTableLocationTextColor={setTableLocationTextColor}
        savingTableLocation={savingTableLocation}
        handleSaveTableLocation={handleSaveTableLocation}
      />

      {showSetTablesModal && topNavId === 'tables' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative bg-pos-bg rounded-xl max-w-[979px] border border-pos-border shadow-2xl w-full overflow-hidden flex flex-col">
            <button
              type="button"
              className="absolute top-1 right-4 z-20 p-2 rounded text-pos-muted active:text-pos-text active:bg-green-500"
              onClick={closeSetTablesModal}
              aria-label="Close"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="shrink-0 border-b border-pos-border bg-black flex justify-center items-center w-full py-2 overflow-auto text-sm max-h-[min(280px,45%)]">
              <div className="space-y-3 text-pos-text">
                <div className="flex gap-2">
                  <button type="button" className="px-3 py-2 rounded border border-pos-border bg-pos-panel active:bg-green-500 text-sm" onClick={addSetTable}>
                    + {tr('control.tables.table', 'table')}
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 rounded border border-pos-border bg-pos-panel active:bg-green-500 text-sm"
                    onClick={handleAddBoard}
                  >
                    + {tr('control.tables.board', 'board')}
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 rounded border border-pos-border bg-pos-panel active:bg-green-500 text-sm"
                    onClick={handleAddFlowerPot}
                  >
                    + flower pot
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 ml-10 rounded bg-rose-500 text-white text-sm font-medium active:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={handleDeleteSetTablesSelection}
                    disabled={selectedSetTable == null && selectedSetBoard == null && selectedSetFlowerPot == null}
                  >
                    {tr('control.tables.delete', 'Delete')}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-yellow-500 text-black text-sm font-medium active:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={handleClearSetTablesLayout}
                    disabled={!setTablesDraft.tables?.length}
                  >
                    {tr('control.tables.clear', 'Clear')}
                  </button>
                  <button
                    type="button"
                    className="px-5 py-2 ml-10 rounded-lg bg-green-600 text-white active:bg-green-500 text-sm"
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

            <div className="min-h-0 min-w-0 bg-[#1f2b36] flex flex-col  min-h-[614px] max-h-[614px] min-w-[979px] max-w-[979px]">
              <div ref={setTablesCanvasRef} className="w-full flex-1 rounded-lg border border-pos-border bg-[#2f3e50] relative overflow-y-hidden overflow-x-hidden">
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
                    return (
                      <button
                        key={table.id}
                        type="button"
                        className={`absolute flex items-center justify-center font-semibold border-2 text-white transition-colors overflow-hidden ${table.round
                          ? 'rounded-full border-transparent bg-transparent'
                          : 'rounded-md border-transparent bg-transparent'
                          } ${setTablesSelectedTableId === table.id && selectedSetBoardIndex == null && selectedSetFlowerPotIndex == null ? 'border-4 border-yellow-400' : ''} active:bg-green-500`}
                        style={{
                          left: `${layoutEditorReadTableX(table)}px`,
                          top: `${layoutEditorReadTableY(table)}px`,
                          transform: `rotate(${safeNumberInputValue(table.rotation, 0)}deg)`,
                          zIndex: 20,
                          touchAction: 'none',
                          ...sizeStyle
                        }}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSetTablesSelectedTableId(table.id);
                          setSetTablesSelectedBoardIndex(null);
                          setSetTablesSelectedFlowerPotIndex(null);
                          startSetItemDrag(e, {
                            type: 'table',
                            tableId: table.id,
                            x: layoutEditorReadTableX(table),
                            y: layoutEditorReadTableY(table)
                          });
                        }}
                        onClick={() => {
                          setSetTablesSelectedTableId(table.id);
                          setSetTablesSelectedBoardIndex(null);
                          setSetTablesSelectedFlowerPotIndex(null);
                        }}
                      >
                        {template ? (
                          <img src={publicAssetUrl(template.src)} alt={table.name} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                        ) : null}
                        <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">{table.name}</span>
                      </button>
                    );
                  })}
                  {boards.map((board, idx) => {
                      const isSelected = setTablesSelectedBoardIndex === idx;
                      return (
                        <button
                          key={board.id || `board-${idx}`}
                          type="button"
                          className={`absolute border-2 ${isSelected ? 'border-yellow-300' : 'border-transparent'} active:bg-green-500`}
                          style={{
                            left: `${Number(board.x) || 0}px`,
                            top: `${Number(board.y) || 0}px`,
                            width: `${Math.max(10, Number(board.width) || 10)}px`,
                            height: `${Math.max(10, Number(board.height) || 10)}px`,
                            transform: `rotate(${Number(board.rotation) || 0}deg)`,
                            zIndex: 10,
                            backgroundColor: board.color || '#facc15',
                            opacity: 0.55,
                            touchAction: 'none'
                          }}
                          onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSetTablesSelectedTableId(null);
                            setSetTablesSelectedBoardIndex(idx);
                            setSetTablesSelectedFlowerPotIndex(null);
                            startSetItemDrag(e, {
                              type: 'board',
                              index: idx,
                              x: Number(board.x) || 0,
                              y: Number(board.y) || 0
                            });
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSetTablesSelectedTableId(null);
                            setSetTablesSelectedBoardIndex(idx);
                            setSetTablesSelectedFlowerPotIndex(null);
                          }}
                        />
                      );
                    })}
                  {flowerPots.map((fp, idx) => {
                      const isSelected = setTablesSelectedFlowerPotIndex === idx;
                      return (
                        <button
                          key={fp.id || `flowerpot-${idx}`}
                          type="button"
                          className={`absolute border-2 ${isSelected ? 'border-yellow-300' : 'border-transparent'} active:bg-green-500`}
                          style={{
                            left: `${Number(fp.x) || 0}px`,
                            top: `${Number(fp.y) || 0}px`,
                            width: `${Math.max(10, Number(fp.width) || 10)}px`,
                            height: `${Math.max(10, Number(fp.height) || 10)}px`,
                            transform: `rotate(${Number(fp.rotation) || 0}deg)`,
                            zIndex: 30,
                            touchAction: 'none'
                          }}
                          onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSetTablesSelectedTableId(null);
                            setSetTablesSelectedBoardIndex(null);
                            setSetTablesSelectedFlowerPotIndex(idx);
                            startSetItemDrag(e, {
                              type: 'flowerPot',
                              index: idx,
                              x: Number(fp.x) || 0,
                              y: Number(fp.y) || 0
                            });
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSetTablesSelectedTableId(null);
                            setSetTablesSelectedBoardIndex(null);
                            setSetTablesSelectedFlowerPotIndex(idx);
                          }}
                        >
                          <img src={publicAssetUrl('/flowerpot.svg')} alt="Flower pot" className="w-full h-full object-contain pointer-events-none" />
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="min-h-0 min-w-0 bg-[#1f2b36] py-2 flex flex-row flex-wrap items-center w-full justify-center gap-5 text-pos-text">
              {!selectedSetBoard && !selectedSetFlowerPot ? (
                <>
                  {/* Horizontal: label + name */}
                  <div className="flex flex-row items-center gap-2 shrink-0">
                    <span className="shrink-0 whitespace-nowrap">{tr('name', 'Name')}</span>
                    <input
                      type="text"
                      value={selectedSetTable?.name || ''}
                      readOnly
                      onClick={openSetTablesNameModal}
                      className="min-w-[120px] max-w-[120px] px-2 py-2 rounded bg-pos-panel border border-pos-border text-pos-text"
                    />
                  </div>

                  {/* Vertical: x, y */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {[
                      { key: 'x', label: 'x' },
                      { key: 'y', label: 'y' }
                    ].map((field) => (
                      <div key={field.key} className="flex items-center gap-1">
                        <span className="shrink-0">{field.label}   : &nbsp;&nbsp;&nbsp;</span>
                        <input
                          type="number"
                          value={safeNumberInputValue(
                            selectedSetTable
                              ? field.key === 'x'
                                ? layoutEditorReadTableX(selectedSetTable)
                                : layoutEditorReadTableY(selectedSetTable)
                              : 0,
                            0
                          )}
                          onChange={(e) => {
                            const nextVal = Number(e.target.value);
                            const safe = Number.isFinite(nextVal) ? nextVal : 0;
                            updateSelectedSetTable({ [field.key]: safe });
                          }}
                          readOnly
                          onClick={() => openSetTablesNumberModal(
                            selectedSetTable
                              ? field.key === 'x'
                                ? layoutEditorReadTableX(selectedSetTable)
                                : layoutEditorReadTableY(selectedSetTable)
                              : 0,
                            (safe) => updateSelectedSetTable({ [field.key]: safe })
                          )}
                          className="min-w-[80px] max-w-[80px] px-1 py-2 rounded bg-pos-panel border border-pos-border text-pos-text"
                        />
                        <button
                          type="button"
                          className="w-10 h-10 px-3 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                          onClick={() => {
                            const current =
                              field.key === 'x'
                                ? layoutEditorReadTableX(selectedSetTable)
                                : layoutEditorReadTableY(selectedSetTable);
                            updateSelectedSetTable({ [field.key]: current - 10 });
                          }}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="w-10 h-10 px-3 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                          onClick={() => {
                            const current =
                              field.key === 'x'
                                ? layoutEditorReadTableX(selectedSetTable)
                                : layoutEditorReadTableY(selectedSetTable);
                            updateSelectedSetTable({ [field.key]: current + 10 });
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
                      ...(!selectedSetTable?.round ? [{ key: 'height', label: tr('control.tables.height', 'Height') }] : [])
                    ].map((field) => (
                      <div key={field.key} className="flex items-center gap-1">
                        <span className="shrink-0">{field.label}   : &nbsp;&nbsp;&nbsp;</span>
                        <input
                          type="number"
                          value={safeNumberInputValue(selectedSetTable ? selectedSetTable[field.key] : 0, 0)}
                          onChange={(e) => {
                            const nextVal = Number(e.target.value);
                            const safe = Number.isFinite(nextVal) ? nextVal : 0;
                            if (field.key === 'width') updateSelectedSetTable({ width: Math.max(60, safe) });
                            else updateSelectedSetTable({ height: Math.max(40, safe) });
                          }}
                          readOnly
                          onClick={() => openSetTablesNumberModal(
                            selectedSetTable ? selectedSetTable[field.key] : 0,
                            (safe) => {
                              if (field.key === 'width') updateSelectedSetTable({ width: Math.max(60, safe) });
                              else updateSelectedSetTable({ height: Math.max(40, safe) });
                            }
                          )}
                          className="min-w-[80px] max-w-[80px] px-1 py-2 rounded bg-pos-panel border border-pos-border text-pos-text"
                        />
                        <button
                          type="button"
                          className="w-10 h-10 px-3 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                          onClick={() => {
                            const current = Number(selectedSetTable?.[field.key]) || 0;
                            const nextVal = current - 10;
                            if (field.key === 'width') updateSelectedSetTable({ width: Math.max(60, nextVal) });
                            else updateSelectedSetTable({ height: Math.max(40, nextVal) });
                          }}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="w-10 h-10 px-3 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                          onClick={() => {
                            const current = Number(selectedSetTable?.[field.key]) || 0;
                            const nextVal = current + 10;
                            if (field.key === 'width') updateSelectedSetTable({ width: Math.max(60, nextVal) });
                            else updateSelectedSetTable({ height: Math.max(40, nextVal) });
                          }}
                        >
                          +
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Vertical: rotation, round */}
                  <div className="flex flex-col gap-3 shrink-0">
                    <div className="flex items-center gap-1">
                      <span className="shrink-0">{tr('control.tables.rotation', 'Rotation')}  : &nbsp;&nbsp;&nbsp;</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={360}
                          value={safeNumberInputValue(selectedSetTable?.rotation, 0)}
                          onChange={(e) => updateSelectedSetTable({ rotation: Number(e.target.value) || 0 })}
                          className="w-[100px] max-w-[120px]"
                        />
                        <input
                          type="number"
                          min={0}
                          max={360}
                          value={safeNumberInputValue(selectedSetTable?.rotation, 0)}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            const clamped = Number.isFinite(v) ? Math.min(360, Math.max(0, v)) : 0;
                            updateSelectedSetTable({ rotation: clamped });
                          }}
                          readOnly
                          onClick={() => openSetTablesNumberModal(
                            selectedSetTable?.rotation ?? 0,
                            (safe) => updateSelectedSetTable({ rotation: Math.min(360, Math.max(0, safe)) })
                          )}
                          className="min-w-[56px] max-w-[64px] px-2 py-2 rounded bg-pos-panel border border-pos-border text-pos-text text-left"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <span className="shrink-0">{tr('control.tables.round', 'Round')}   : &nbsp;&nbsp;&nbsp;</span>
                      <input
                        type="checkbox"
                        checked={!!selectedSetTable?.round}
                        onChange={(e) => updateSelectedSetTable({ round: e.target.checked })}
                        className="w-7 h-7"
                      />
                    </label>
                  </div>
                </>
              ) : null}

              {selectedSetBoard ? (
                <div className="flex flex-row flex-wrap items-start gap-5 text-pos-text">
                  {/* Vertical: board x, board y */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {[
                      { key: 'x', label: 'board x' },
                      { key: 'y', label: 'board y' }
                    ].map((field) => (
                      <div key={`board-${field.key}`} className="flex items-center gap-1">
                        <span className="shrink-0">{field.label}   : &nbsp;&nbsp;&nbsp;</span>
                        <input
                          type="number"
                          value={safeNumberInputValue(selectedSetBoard[field.key], 0)}
                          onChange={(e) => {
                            const nextVal = Number(e.target.value);
                            const safe = Number.isFinite(nextVal) ? nextVal : 0;
                            updateSelectedSetBoard({ [field.key]: safe });
                          }}
                          readOnly
                          onClick={() => openSetTablesNumberModal(
                            selectedSetBoard[field.key],
                            (safe) => updateSelectedSetBoard({ [field.key]: safe })
                          )}
                          className="min-w-[80px] max-w-[80px] px-1 py-2 rounded bg-pos-panel border border-pos-border text-pos-text"
                        />
                        <button
                          type="button"
                          className="w-10 h-10 px-3 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                          onClick={() => {
                            const current = Number(selectedSetBoard[field.key]) || 0;
                            updateSelectedSetBoard({ [field.key]: current - 10 });
                          }}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="w-10 h-10 px-3 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                          onClick={() => {
                            const current = Number(selectedSetBoard[field.key]) || 0;
                            updateSelectedSetBoard({ [field.key]: current + 10 });
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
                      <div key={`board-${field.key}`} className="flex items-center gap-1">
                        <span className="shrink-0">{field.label}   : &nbsp;&nbsp;&nbsp;</span>
                        <input
                          type="number"
                          value={safeNumberInputValue(selectedSetBoard[field.key], 0)}
                          onChange={(e) => {
                            const nextVal = Number(e.target.value);
                            const safe = Number.isFinite(nextVal) ? nextVal : 0;
                            if (field.key === 'width') updateSelectedSetBoard({ width: Math.max(10, safe) });
                            else updateSelectedSetBoard({ height: Math.max(10, safe) });
                          }}
                          readOnly
                          onClick={() => openSetTablesNumberModal(
                            selectedSetBoard[field.key],
                            (safe) => {
                              if (field.key === 'width') updateSelectedSetBoard({ width: Math.max(10, safe) });
                              else updateSelectedSetBoard({ height: Math.max(10, safe) });
                            }
                          )}
                          className="min-w-[80px] max-w-[80px] px-1 py-2 rounded bg-pos-panel border border-pos-border text-pos-text"
                        />
                        <button
                          type="button"
                          className="w-10 h-10 px-3 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                          onClick={() => {
                            const current = Number(selectedSetBoard[field.key]) || 0;
                            const nextVal = current - 10;
                            if (field.key === 'width') updateSelectedSetBoard({ width: Math.max(10, nextVal) });
                            else updateSelectedSetBoard({ height: Math.max(10, nextVal) });
                          }}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="w-10 h-10 px-3 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                          onClick={() => {
                            const current = Number(selectedSetBoard[field.key]) || 0;
                            const nextVal = current + 10;
                            if (field.key === 'width') updateSelectedSetBoard({ width: Math.max(10, nextVal) });
                            else updateSelectedSetBoard({ height: Math.max(10, nextVal) });
                          }}
                        >
                          +
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Rotation */}
                  <div className="flex items-center shrink-0">
                    <span className="shrink-0">{tr('control.tables.rotation', 'Rotation')}   : &nbsp;&nbsp;&nbsp;</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={360}
                        value={safeNumberInputValue(selectedSetBoard.rotation, 0)}
                        onChange={(e) => updateSelectedSetBoard({ rotation: Number(e.target.value) || 0 })}
                        className="w-[100px] max-w-[120px]"
                      />
                      <input
                        type="number"
                        min={0}
                        max={360}
                        value={safeNumberInputValue(selectedSetBoard.rotation, 0)}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          const clamped = Number.isFinite(v) ? Math.min(360, Math.max(0, v)) : 0;
                          updateSelectedSetBoard({ rotation: clamped });
                        }}
                        readOnly
                        onClick={() => openSetTablesNumberModal(
                          selectedSetBoard.rotation,
                          (safe) => updateSelectedSetBoard({ rotation: Math.min(360, Math.max(0, safe)) })
                        )}
                        className="min-w-[56px] max-w-[64px] px-2 py-2 rounded bg-pos-panel border border-pos-border text-pos-text text-left"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedSetFlowerPot ? (
                <div className="flex flex-row flex-wrap items-start gap-5 text-pos-text">
                  {/* Vertical: flower pot x, flower pot y */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {[
                      { key: 'x', label: 'flower pot x' },
                      { key: 'y', label: 'flower pot y' }
                    ].map((field) => (
                      <div key={`flowerpot-${field.key}`} className="flex items-center gap-1">
                        <span className="shrink-0">{field.label}   : &nbsp;&nbsp;&nbsp;</span>
                        <input
                          type="number"
                          value={safeNumberInputValue(selectedSetFlowerPot[field.key], 0)}
                          onChange={(e) => {
                            const nextVal = Number(e.target.value);
                            const safe = Number.isFinite(nextVal) ? nextVal : 0;
                            updateSelectedSetFlowerPot({ [field.key]: safe });
                          }}
                          readOnly
                          onClick={() => openSetTablesNumberModal(
                            selectedSetFlowerPot[field.key],
                            (safe) => updateSelectedSetFlowerPot({ [field.key]: safe })
                          )}
                          className="min-w-[80px] max-w-[80px] px-1 py-2 rounded bg-pos-panel border border-pos-border text-pos-text"
                        />
                        <button
                          type="button"
                          className="w-10 h-10 px-3 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                          onClick={() => {
                            const current = Number(selectedSetFlowerPot[field.key]) || 0;
                            updateSelectedSetFlowerPot({ [field.key]: current - 10 });
                          }}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="w-10 h-10 px-3 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                          onClick={() => {
                            const current = Number(selectedSetFlowerPot[field.key]) || 0;
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
                      <div key={`flowerpot-${field.key}`} className="flex items-center gap-1">
                        <span className="shrink-0">{field.label}   : &nbsp;&nbsp;&nbsp;</span>
                        <input
                          type="number"
                          value={safeNumberInputValue(selectedSetFlowerPot[field.key], 0)}
                          onChange={(e) => {
                            const nextVal = Number(e.target.value);
                            const safe = Number.isFinite(nextVal) ? nextVal : 0;
                            if (field.key === 'width') updateSelectedSetFlowerPot({ width: Math.max(10, safe) });
                            else updateSelectedSetFlowerPot({ height: Math.max(10, safe) });
                          }}
                          readOnly
                          onClick={() => openSetTablesNumberModal(
                            selectedSetFlowerPot[field.key],
                            (safe) => {
                              if (field.key === 'width') updateSelectedSetFlowerPot({ width: Math.max(10, safe) });
                              else updateSelectedSetFlowerPot({ height: Math.max(10, safe) });
                            }
                          )}
                          className="min-w-[80px] max-w-[80px] px-1 py-2 rounded bg-pos-panel border border-pos-border text-pos-text"
                        />
                        <button
                          type="button"
                          className="w-10 h-10 px-3 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                          onClick={() => {
                            const current = Number(selectedSetFlowerPot[field.key]) || 0;
                            const nextVal = current - 10;
                            if (field.key === 'width') updateSelectedSetFlowerPot({ width: Math.max(10, nextVal) });
                            else updateSelectedSetFlowerPot({ height: Math.max(10, nextVal) });
                          }}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="w-10 h-10 px-3 rounded bg-pos-panel border border-pos-border active:bg-green-500"
                          onClick={() => {
                            const current = Number(selectedSetFlowerPot[field.key]) || 0;
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
                    <span className="shrink-0">{tr('control.tables.rotation', 'Rotation')}   : &nbsp;&nbsp;&nbsp;</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={360}
                        value={safeNumberInputValue(selectedSetFlowerPot.rotation, 0)}
                        onChange={(e) => updateSelectedSetFlowerPot({ rotation: Number(e.target.value) || 0 })}
                        className="w-[100px] max-w-[120px]"
                      />
                      <input
                        type="number"
                        min={0}
                        max={360}
                        value={safeNumberInputValue(selectedSetFlowerPot.rotation, 0)}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          const clamped = Number.isFinite(v) ? Math.min(360, Math.max(0, v)) : 0;
                          updateSelectedSetFlowerPot({ rotation: clamped });
                        }}
                        readOnly
                        onClick={() => openSetTablesNumberModal(
                          selectedSetFlowerPot.rotation,
                          (safe) => updateSelectedSetFlowerPot({ rotation: Math.min(360, Math.max(0, safe)) })
                        )}
                        className="min-w-[56px] max-w-[64px] px-2 py-2 rounded bg-pos-panel border border-pos-border text-pos-text text-left"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {showSetTablesNumberModal && showSetTablesModal && topNavId === 'tables' && (
        <div className="fixed inset-0 z-[62] flex items-center justify-center bg-black/70 p-4" onClick={closeSetTablesNumberModal}>
          <div className="w-full max-w-[560px] bg-pos-bg rounded-xl border border-pos-border shadow-2xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3">
              <input
                type="text"
                value={setTablesNumberValue}
                readOnly
                className="w-full px-3 py-2 rounded bg-pos-panel border border-pos-border text-pos-text text-xl text-center"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C'].map((k) => (
                <button
                  key={k}
                  type="button"
                  className="h-12 rounded bg-pos-panel border border-pos-border text-pos-text text-xl active:bg-green-500"
                  onClick={() => (k === 'C' ? clearSetTablesNumberKey() : appendSetTablesNumberKey(k))}
                >
                  {k}
                </button>
              ))}
              <button
                type="button"
                className="h-12 rounded bg-pos-panel border border-pos-border text-pos-text text-xl active:bg-green-500"
                onClick={() => appendSetTablesNumberKey('0')}
                aria-label="Zero"
              >
                0
              </button>
              <button
                type="button"
                className="h-12 rounded bg-pos-panel border border-pos-border text-pos-text text-xl active:bg-green-500"
                onClick={backspaceSetTablesNumberKey}
                aria-label="Backspace"
              >
                ←
              </button>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-pos-panel border border-pos-border text-pos-text active:bg-green-500"
                onClick={closeSetTablesNumberModal}
              >
                {tr('cancel', 'Cancel')}
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-green-600 text-white active:bg-green-500"
                onClick={applySetTablesNumberModal}
              >
                {tr('ok', 'OK')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSetTablesNameModal && showSetTablesModal && topNavId === 'tables' && (
        <div className="fixed inset-0 z-[63] flex items-center justify-center bg-black/70 p-4" onClick={closeSetTablesNameModal}>
          <div className="w-full max-w-[760px] bg-pos-bg rounded-xl border border-pos-border shadow-2xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3">
              <input
                type="text"
                value={setTablesNameValue}
                onChange={(e) => setSetTablesNameValue(e.target.value)}
                onSelect={(e) => {
                  const el = e.target;
                  setSetTablesNameSelectionStart(el.selectionStart ?? 0);
                  setSetTablesNameSelectionEnd(el.selectionEnd ?? 0);
                }}
                className="w-full px-3 py-2 rounded bg-pos-panel border border-pos-border text-pos-text text-xl"
                autoFocus
              />
            </div>
            <SmallKeyboardWithNumpad
              value={setTablesNameValue}
              onChange={setSetTablesNameValue}
              selectionStart={setTablesNameSelectionStart}
              selectionEnd={setTablesNameSelectionEnd}
              onSelectionChange={(start, end) => {
                setSetTablesNameSelectionStart(start);
                setSetTablesNameSelectionEnd(end);
              }}
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-pos-panel border border-pos-border text-pos-text active:bg-green-500"
                onClick={closeSetTablesNameModal}
              >
                {tr('cancel', 'Cancel')}
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-green-600 text-white active:bg-green-500"
                onClick={applySetTablesNameModal}
              >
                {tr('ok', 'OK')}
              </button>
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
      <ControlViewDeviceSettingsModal
        tr={tr}
        mapTranslatedOptions={mapTranslatedOptions}
        vatOptions={VAT_OPTIONS}
        printingOrderOptions={PRINTING_ORDER_OPTIONS}
        groupingReceiptOptions={GROUPING_RECEIPT_OPTIONS}
        showDeviceSettingsModal={showDeviceSettingsModal}
        closeDeviceSettingsModal={() => setShowDeviceSettingsModal(false)}
        deviceSettingsTab={deviceSettingsTab}
        onSelectDeviceSettingsTab={(tab) => {
          setDeviceSettingsTab(tab);
          setSelectedOptionButtonPoolItemId(null);
          setSelectedFunctionButtonPoolItemId(null);
        }}
        printers={printers}
        categories={categories}
        categoriesLoading={categoriesLoading}
        savingDeviceSettings={savingDeviceSettings}
        handleSaveDeviceSettings={handleSaveDeviceSettings}
        optionButtonItems={OPTION_BUTTON_ITEMS}
        functionButtonItems={FUNCTION_BUTTON_ITEMS}
        optionButtonSlots={optionButtonSlots}
        functionButtonSlots={functionButtonSlots}
        getOptionButtonLabel={getOptionButtonLabel}
        getFunctionButtonLabel={getFunctionButtonLabel}
        selectedOptionButtonSlotIndex={selectedOptionButtonSlotIndex}
        setSelectedOptionButtonSlotIndex={setSelectedOptionButtonSlotIndex}
        selectedOptionButtonPoolItemId={selectedOptionButtonPoolItemId}
        setSelectedOptionButtonPoolItemId={setSelectedOptionButtonPoolItemId}
        handleOptionButtonSlotClick={handleOptionButtonSlotClick}
        handleOptionButtonDragStartFromSlot={handleOptionButtonDragStartFromSlot}
        handleOptionButtonDropOnSlot={handleOptionButtonDropOnSlot}
        handleRemoveOptionButtonFromSlot={handleRemoveOptionButtonFromSlot}
        handleOptionButtonDragStart={handleOptionButtonDragStart}
        selectedFunctionButtonSlotIndex={selectedFunctionButtonSlotIndex}
        setSelectedFunctionButtonSlotIndex={setSelectedFunctionButtonSlotIndex}
        selectedFunctionButtonPoolItemId={selectedFunctionButtonPoolItemId}
        setSelectedFunctionButtonPoolItemId={setSelectedFunctionButtonPoolItemId}
        handleFunctionButtonSlotClick={handleFunctionButtonSlotClick}
        handleFunctionButtonDropOnSlot={handleFunctionButtonDropOnSlot}
        handleRemoveFunctionButtonFromSlot={handleRemoveFunctionButtonFromSlot}
        handleFunctionButtonDragStart={handleFunctionButtonDragStart}
        deviceUseSubproducts={deviceUseSubproducts}
        setDeviceUseSubproducts={setDeviceUseSubproducts}
        deviceAutoLogoutAfterTransaction={deviceAutoLogoutAfterTransaction}
        setDeviceAutoLogoutAfterTransaction={setDeviceAutoLogoutAfterTransaction}
        deviceAutoReturnToTablePlan={deviceAutoReturnToTablePlan}
        setDeviceAutoReturnToTablePlan={setDeviceAutoReturnToTablePlan}
        deviceDisableCashButtonInPayment={deviceDisableCashButtonInPayment}
        setDeviceDisableCashButtonInPayment={setDeviceDisableCashButtonInPayment}
        deviceOpenPriceWithoutPopup={deviceOpenPriceWithoutPopup}
        setDeviceOpenPriceWithoutPopup={setDeviceOpenPriceWithoutPopup}
        deviceOpenCashDrawerAfterOrder={deviceOpenCashDrawerAfterOrder}
        setDeviceOpenCashDrawerAfterOrder={setDeviceOpenCashDrawerAfterOrder}
        deviceAutoReturnToCounterSale={deviceAutoReturnToCounterSale}
        setDeviceAutoReturnToCounterSale={setDeviceAutoReturnToCounterSale}
        deviceAskSendToKitchen={deviceAskSendToKitchen}
        setDeviceAskSendToKitchen={setDeviceAskSendToKitchen}
        deviceCounterSaleVat={deviceCounterSaleVat}
        setDeviceCounterSaleVat={setDeviceCounterSaleVat}
        deviceTableSaleVat={deviceTableSaleVat}
        setDeviceTableSaleVat={setDeviceTableSaleVat}
        deviceTimeoutLogout={deviceTimeoutLogout}
        setDeviceTimeoutLogout={setDeviceTimeoutLogout}
        deviceFixedBorder={deviceFixedBorder}
        setDeviceFixedBorder={setDeviceFixedBorder}
        deviceAlwaysOnTop={deviceAlwaysOnTop}
        setDeviceAlwaysOnTop={setDeviceAlwaysOnTop}
        deviceAskInvoiceOrTicket={deviceAskInvoiceOrTicket}
        setDeviceAskInvoiceOrTicket={setDeviceAskInvoiceOrTicket}
        devicePrinterGroupingProducts={devicePrinterGroupingProducts}
        setDevicePrinterGroupingProducts={setDevicePrinterGroupingProducts}
        devicePrinterShowErrorScreen={devicePrinterShowErrorScreen}
        setDevicePrinterShowErrorScreen={setDevicePrinterShowErrorScreen}
        devicePrinterProductionMessageOnVat={devicePrinterProductionMessageOnVat}
        setDevicePrinterProductionMessageOnVat={setDevicePrinterProductionMessageOnVat}
        devicePrinterNextCourseOrder={devicePrinterNextCourseOrder}
        setDevicePrinterNextCourseOrder={setDevicePrinterNextCourseOrder}
        devicePrinterStandardMode={devicePrinterStandardMode}
        setDevicePrinterStandardMode={setDevicePrinterStandardMode}
        devicePrinterQROrderPrinter={devicePrinterQROrderPrinter}
        setDevicePrinterQROrderPrinter={setDevicePrinterQROrderPrinter}
        devicePrinterReprintWithNextCourse={devicePrinterReprintWithNextCourse}
        setDevicePrinterReprintWithNextCourse={setDevicePrinterReprintWithNextCourse}
        devicePrinterPrintZeroTickets={devicePrinterPrintZeroTickets}
        setDevicePrinterPrintZeroTickets={setDevicePrinterPrintZeroTickets}
        devicePrinterGiftVoucherAtMin={devicePrinterGiftVoucherAtMin}
        setDevicePrinterGiftVoucherAtMin={setDevicePrinterGiftVoucherAtMin}
        deviceCategoryDisplayIds={deviceCategoryDisplayIds}
        setDeviceCategoryDisplayIds={setDeviceCategoryDisplayIds}
        deviceOrdersConfirmOnHold={deviceOrdersConfirmOnHold}
        setDeviceOrdersConfirmOnHold={setDeviceOrdersConfirmOnHold}
        deviceOrdersPrintBarcodeAfterCreate={deviceOrdersPrintBarcodeAfterCreate}
        setDeviceOrdersPrintBarcodeAfterCreate={setDeviceOrdersPrintBarcodeAfterCreate}
        deviceOrdersCustomerCanBeModified={deviceOrdersCustomerCanBeModified}
        setDeviceOrdersCustomerCanBeModified={setDeviceOrdersCustomerCanBeModified}
        deviceOrdersBookTableToWaiting={deviceOrdersBookTableToWaiting}
        setDeviceOrdersBookTableToWaiting={setDeviceOrdersBookTableToWaiting}
        deviceOrdersFastCustomerName={deviceOrdersFastCustomerName}
        setDeviceOrdersFastCustomerName={setDeviceOrdersFastCustomerName}
        deviceScheduledPrinter={deviceScheduledPrinter}
        setDeviceScheduledPrinter={setDeviceScheduledPrinter}
        deviceScheduledProductionFlow={deviceScheduledProductionFlow}
        setDeviceScheduledProductionFlow={setDeviceScheduledProductionFlow}
        deviceScheduledLoading={deviceScheduledLoading}
        setDeviceScheduledLoading={setDeviceScheduledLoading}
        deviceScheduledMode={deviceScheduledMode}
        setDeviceScheduledMode={setDeviceScheduledMode}
        deviceScheduledInvoiceLayout={deviceScheduledInvoiceLayout}
        setDeviceScheduledInvoiceLayout={setDeviceScheduledInvoiceLayout}
        deviceScheduledCheckoutAt={deviceScheduledCheckoutAt}
        setDeviceScheduledCheckoutAt={setDeviceScheduledCheckoutAt}
        deviceScheduledPrintBarcodeLabel={deviceScheduledPrintBarcodeLabel}
        setDeviceScheduledPrintBarcodeLabel={setDeviceScheduledPrintBarcodeLabel}
        deviceScheduledDeliveryNoteToTurnover={deviceScheduledDeliveryNoteToTurnover}
        setDeviceScheduledDeliveryNoteToTurnover={setDeviceScheduledDeliveryNoteToTurnover}
        deviceScheduledPrintProductionReceipt={deviceScheduledPrintProductionReceipt}
        setDeviceScheduledPrintProductionReceipt={setDeviceScheduledPrintProductionReceipt}
        deviceScheduledPrintCustomerProductionReceipt={deviceScheduledPrintCustomerProductionReceipt}
        setDeviceScheduledPrintCustomerProductionReceipt={setDeviceScheduledPrintCustomerProductionReceipt}
        deviceScheduledWebOrderAutoPrint={deviceScheduledWebOrderAutoPrint}
        setDeviceScheduledWebOrderAutoPrint={setDeviceScheduledWebOrderAutoPrint}
      />

      {/* System Settings modal */}
      <ControlViewSystemSettingsModal
        tr={tr}
        mapTranslatedOptions={mapTranslatedOptions}
        showSystemSettingsModal={showSystemSettingsModal}
        closeSystemSettingsModal={() => setShowSystemSettingsModal(false)}
        systemSettingsTab={systemSettingsTab}
        setSystemSettingsTab={setSystemSettingsTab}
        priceGroups={priceGroups}
        savingSystemSettings={savingSystemSettings}
        handleSaveSystemSettings={handleSaveSystemSettings}
        sysUseStockManagement={sysUseStockManagement}
        setSysUseStockManagement={setSysUseStockManagement}
        sysUsePriceGroups={sysUsePriceGroups}
        setSysUsePriceGroups={setSysUsePriceGroups}
        sysLoginWithoutCode={sysLoginWithoutCode}
        setSysLoginWithoutCode={setSysLoginWithoutCode}
        sysCategorieenPerKassa={sysCategorieenPerKassa}
        setSysCategorieenPerKassa={setSysCategorieenPerKassa}
        sysAutoAcceptQROrders={sysAutoAcceptQROrders}
        setSysAutoAcceptQROrders={setSysAutoAcceptQROrders}
        sysQrOrdersAutomatischAfrekenen={sysQrOrdersAutomatischAfrekenen}
        setSysQrOrdersAutomatischAfrekenen={setSysQrOrdersAutomatischAfrekenen}
        sysEnkelQROrdersKeukenscherm={sysEnkelQROrdersKeukenscherm}
        setSysEnkelQROrdersKeukenscherm={setSysEnkelQROrdersKeukenscherm}
        sysAspect169Windows={sysAspect169Windows}
        setSysAspect169Windows={setSysAspect169Windows}
        sysVatRateVariousProducts={sysVatRateVariousProducts}
        setSysVatRateVariousProducts={setSysVatRateVariousProducts}
        sysArrangeProductsManually={sysArrangeProductsManually}
        setSysArrangeProductsManually={setSysArrangeProductsManually}
        sysLimitOneUserPerTable={sysLimitOneUserPerTable}
        setSysLimitOneUserPerTable={setSysLimitOneUserPerTable}
        sysOneWachtorderPerKlant={sysOneWachtorderPerKlant}
        setSysOneWachtorderPerKlant={setSysOneWachtorderPerKlant}
        sysCashButtonVisibleMultiplePayment={sysCashButtonVisibleMultiplePayment}
        setSysCashButtonVisibleMultiplePayment={setSysCashButtonVisibleMultiplePayment}
        sysUsePlaceSettings={sysUsePlaceSettings}
        setSysUsePlaceSettings={setSysUsePlaceSettings}
        sysTegoedAutomatischInladen={sysTegoedAutomatischInladen}
        setSysTegoedAutomatischInladen={setSysTegoedAutomatischInladen}
        sysNieuwstePrijsGebruiken={sysNieuwstePrijsGebruiken}
        setSysNieuwstePrijsGebruiken={setSysNieuwstePrijsGebruiken}
        sysLeeggoedTerugname={sysLeeggoedTerugname}
        setSysLeeggoedTerugname={setSysLeeggoedTerugname}
        sysKlantgegevensQRAfdrukken={sysKlantgegevensQRAfdrukken}
        setSysKlantgegevensQRAfdrukken={setSysKlantgegevensQRAfdrukken}
        sysPriceTakeAway={sysPriceTakeAway}
        setSysPriceTakeAway={setSysPriceTakeAway}
        sysPriceDelivery={sysPriceDelivery}
        setSysPriceDelivery={setSysPriceDelivery}
        sysPriceCounterSale={sysPriceCounterSale}
        setSysPriceCounterSale={setSysPriceCounterSale}
        sysPriceTableSale={sysPriceTableSale}
        setSysPriceTableSale={setSysPriceTableSale}
        sysSavingsPointsPerEuro={sysSavingsPointsPerEuro}
        setSysSavingsPointsPerEuro={setSysSavingsPointsPerEuro}
        sysSavingsPointsPerDiscount={sysSavingsPointsPerDiscount}
        setSysSavingsPointsPerDiscount={setSysSavingsPointsPerDiscount}
        sysSavingsDiscount={sysSavingsDiscount}
        setSysSavingsDiscount={setSysSavingsDiscount}
        sysBarcodeType={sysBarcodeType}
        setSysBarcodeType={setSysBarcodeType}
        sysTicketVoucherValidity={sysTicketVoucherValidity}
        setSysTicketVoucherValidity={setSysTicketVoucherValidity}
        sysTicketScheduledPrintMode={sysTicketScheduledPrintMode}
        setSysTicketScheduledPrintMode={setSysTicketScheduledPrintMode}
        sysTicketScheduledCustomerSort={sysTicketScheduledCustomerSort}
        setSysTicketScheduledCustomerSort={setSysTicketScheduledCustomerSort}
      />

      {/* New / Edit payment type modal */}
      <ControlViewPaymentTypeModal
        tr={tr}
        mapTranslatedOptions={mapTranslatedOptions}
        showPaymentTypeModal={showPaymentTypeModal}
        closePaymentTypeModal={closePaymentTypeModal}
        paymentTypeName={paymentTypeName}
        setPaymentTypeName={setPaymentTypeName}
        paymentTypeActive={paymentTypeActive}
        setPaymentTypeActive={setPaymentTypeActive}
        paymentTypeIntegration={paymentTypeIntegration}
        setPaymentTypeIntegration={setPaymentTypeIntegration}
        savingPaymentType={savingPaymentType}
        handleSavePaymentType={handleSavePaymentType}
      />

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
      <ControlViewLabelModal
        tr={tr}
        showLabelModal={showLabelModal}
        closeLabelModal={closeLabelModal}
        labelName={labelName}
        setLabelName={setLabelName}
        labelHeight={labelHeight}
        setLabelHeight={setLabelHeight}
        labelWidth={labelWidth}
        setLabelWidth={setLabelWidth}
        labelStandard={labelStandard}
        setLabelStandard={setLabelStandard}
        labelMarginLeft={labelMarginLeft}
        setLabelMarginLeft={setLabelMarginLeft}
        labelMarginRight={labelMarginRight}
        setLabelMarginRight={setLabelMarginRight}
        labelMarginBottom={labelMarginBottom}
        setLabelMarginBottom={setLabelMarginBottom}
        labelMarginTop={labelMarginTop}
        setLabelMarginTop={setLabelMarginTop}
        handleSaveLabel={handleSaveLabel}
      />

      {/* Production messages modal */}
      <ControlViewProductionMessagesModal
        tr={tr}
        showProductionMessagesModal={showProductionMessagesModal}
        closeProductionMessagesModal={() => { setShowProductionMessagesModal(false); setProductionMessagesPage(0); cancelEditProductionMessage(); }}
        productionMessageInput={productionMessageInput}
        setProductionMessageInput={setProductionMessageInput}
        editingProductionMessageId={editingProductionMessageId}
        handleAddOrUpdateProductionMessage={handleAddOrUpdateProductionMessage}
        productionMessages={productionMessages}
        productionMessagesListRef={productionMessagesListRef}
        updateProductionMessagesScrollState={updateProductionMessagesScrollState}
        canProductionMessagesScrollUp={canProductionMessagesScrollUp}
        canProductionMessagesScrollDown={canProductionMessagesScrollDown}
        startEditProductionMessage={startEditProductionMessage}
        setDeleteConfirmProductionMessageId={setDeleteConfirmProductionMessageId}
      />

      {/* New price group modal */}
      <ControlViewPriceGroupModal
        tr={tr}
        vatOptions={VAT_OPTIONS}
        showPriceGroupModal={showPriceGroupModal}
        closePriceGroupModal={closePriceGroupModal}
        priceGroupName={priceGroupName}
        setPriceGroupName={setPriceGroupName}
        priceGroupTax={priceGroupTax}
        setPriceGroupTax={setPriceGroupTax}
        savingPriceGroup={savingPriceGroup}
        handleSavePriceGroup={handleSavePriceGroup}
      />

      {/* New / Edit kitchen modal */}
      <ControlViewKitchenModal
        tr={tr}
        showKitchenModal={showKitchenModal}
        closeKitchenModal={closeKitchenModal}
        kitchenModalName={kitchenModalName}
        setKitchenModalName={setKitchenModalName}
        savingKitchen={savingKitchen}
        handleSaveKitchen={handleSaveKitchen}
      />

      {/* Kitchen — assign products (same pattern as Product → Subproducts modal) */}
      <ControlViewKitchenAssignProductsModal
        tr={tr}
        showKitchenProductsModal={showKitchenProductsModal}
        kitchenProductsKitchen={kitchenProductsKitchen}
        closeKitchenProductsModal={closeKitchenProductsModal}
        loadingKitchenProductsCatalog={loadingKitchenProductsCatalog}
        kitchenProductsModalCategories={kitchenProductsModalCategories}
        kitchenProductsCategoryFilter={kitchenProductsCategoryFilter}
        setKitchenProductsCategoryFilter={setKitchenProductsCategoryFilter}
        kitchenProductsCatalog={kitchenProductsCatalog}
        kitchenProductsAvailable={kitchenProductsAvailable}
        kitchenProductsLeftSelectedIds={kitchenProductsLeftSelectedIds}
        setKitchenProductsLeftSelectedIds={setKitchenProductsLeftSelectedIds}
        kitchenProductsLeftListRef={kitchenProductsLeftListRef}
        handleAddKitchenProductLinks={handleAddKitchenProductLinks}
        kitchenProductsLinked={kitchenProductsLinked}
        kitchenProductsRightSelectedIds={kitchenProductsRightSelectedIds}
        setKitchenProductsRightSelectedIds={setKitchenProductsRightSelectedIds}
        kitchenProductsRightListRef={kitchenProductsRightListRef}
        removeKitchenProductLink={removeKitchenProductLink}
        handleRemoveKitchenProductLinks={handleRemoveKitchenProductLinks}
        handleSaveKitchenProducts={handleSaveKitchenProducts}
        savingKitchenProducts={savingKitchenProducts}
      />

      {/* Add / Edit category modal */}
      <ControlViewCategoryModal
        tr={tr}
        showCategoryModal={showCategoryModal}
        closeCategoryModal={closeCategoryModal}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        setCategoryActiveField={setCategoryActiveField}
        categoryInWebshop={categoryInWebshop}
        setCategoryInWebshop={setCategoryInWebshop}
        categoryDisplayOnCashRegister={categoryDisplayOnCashRegister}
        setCategoryDisplayOnCashRegister={setCategoryDisplayOnCashRegister}
        categoryNextCourse={categoryNextCourse}
        setCategoryNextCourse={setCategoryNextCourse}
        savingCategory={savingCategory}
        handleSaveCategory={handleSaveCategory}
        categoryActiveField={categoryActiveField}
      />

      {/* New / Edit product modal */}
      <ControlViewProductModal
        tr={tr}
        showProductModal={showProductModal}
        closeProductModal={closeProductModal}
        productTab={productTab}
        setProductTab={setProductTab}
        productTabsUnlocked={productTabsUnlocked}
        productName={productName}
        setProductName={setProductName}
        productFieldErrors={productFieldErrors}
        setProductFieldErrors={setProductFieldErrors}
        productKeyName={productKeyName}
        setProductKeyName={setProductKeyName}
        productProductionName={productProductionName}
        setProductProductionName={setProductProductionName}
        productPrice={productPrice}
        setProductPrice={setProductPrice}
        productVatTakeOut={productVatTakeOut}
        setProductVatTakeOut={setProductVatTakeOut}
        productVatEatIn={productVatEatIn}
        setProductVatEatIn={setProductVatEatIn}
        productDisplayNumber={productDisplayNumber}
        productCategoryIds={productCategoryIds}
        setProductCategoryIds={setProductCategoryIds}
        categories={categories}
        productAddition={productAddition}
        setProductAddition={setProductAddition}
        productBarcode={productBarcode}
        setProductBarcode={setProductBarcode}
        handleGenerateBarcode={handleGenerateBarcode}
        barcodeButtonSpinning={barcodeButtonSpinning}
        getUniqueProductPrinterOptions={getUniqueProductPrinterOptions}
        productPrinter1={productPrinter1}
        productPrinter2={productPrinter2}
        productPrinter3={productPrinter3}
        setProductPrinter1={setProductPrinter1}
        setProductPrinter2={setProductPrinter2}
        setProductPrinter3={setProductPrinter3}
        savingProduct={savingProduct}
        handleSaveProduct={handleSaveProduct}
        setProductActiveField={setProductActiveField}
        advancedOpenPrice={advancedOpenPrice}
        setAdvancedOpenPrice={setAdvancedOpenPrice}
        advancedWeegschaal={advancedWeegschaal}
        setAdvancedWeegschaal={setAdvancedWeegschaal}
        advancedSubproductRequires={advancedSubproductRequires}
        setAdvancedSubproductRequires={setAdvancedSubproductRequires}
        advancedLeeggoedPrijs={advancedLeeggoedPrijs}
        setAdvancedLeeggoedPrijs={setAdvancedLeeggoedPrijs}
        advancedPagerVerplicht={advancedPagerVerplicht}
        setAdvancedPagerVerplicht={setAdvancedPagerVerplicht}
        advancedBoldPrint={advancedBoldPrint}
        setAdvancedBoldPrint={setAdvancedBoldPrint}
        advancedGroupingReceipt={advancedGroupingReceipt}
        setAdvancedGroupingReceipt={setAdvancedGroupingReceipt}
        advancedLabelExtraInfo={advancedLabelExtraInfo}
        setAdvancedLabelExtraInfo={setAdvancedLabelExtraInfo}
        advancedKassaPhotoPreview={advancedKassaPhotoPreview}
        setAdvancedKassaPhotoPreview={setAdvancedKassaPhotoPreview}
        advancedVoorverpakVervaltype={advancedVoorverpakVervaltype}
        setAdvancedVoorverpakVervaltype={setAdvancedVoorverpakVervaltype}
        advancedHoudbareDagen={advancedHoudbareDagen}
        setAdvancedHoudbareDagen={setAdvancedHoudbareDagen}
        advancedBewarenGebruik={advancedBewarenGebruik}
        setAdvancedBewarenGebruik={setAdvancedBewarenGebruik}
        extraPricesScrollRef={extraPricesScrollRef}
        syncExtraPricesScrollEdges={syncExtraPricesScrollEdges}
        extraPricesRows={extraPricesRows}
        setExtraPricesRows={setExtraPricesRows}
        setExtraPricesSelectedIndex={setExtraPricesSelectedIndex}
        extraPricesScrollEdges={extraPricesScrollEdges}
        purchaseVat={purchaseVat}
        setPurchaseVat={setPurchaseVat}
        purchasePriceExcl={purchasePriceExcl}
        setPurchasePriceExcl={setPurchasePriceExcl}
        purchasePriceIncl={purchasePriceIncl}
        setPurchasePriceIncl={setPurchasePriceIncl}
        profitPct={profitPct}
        setProfitPct={setProfitPct}
        purchaseUnit={purchaseUnit}
        setPurchaseUnit={setPurchaseUnit}
        unitContent={unitContent}
        setUnitContent={setUnitContent}
        stock={stock}
        setStock={setStock}
        purchaseSupplier={purchaseSupplier}
        setPurchaseSupplier={setPurchaseSupplier}
        supplierCode={supplierCode}
        setSupplierCode={setSupplierCode}
        stockNotification={stockNotification}
        setStockNotification={setStockNotification}
        expirationDate={expirationDate}
        setExpirationDate={setExpirationDate}
        declarationExpiryDays={declarationExpiryDays}
        setDeclarationExpiryDays={setDeclarationExpiryDays}
        notificationSoldOutPieces={notificationSoldOutPieces}
        setNotificationSoldOutPieces={setNotificationSoldOutPieces}
        productInWebshop={productInWebshop}
        setProductInWebshop={setProductInWebshop}
        webshopOnlineOrderable={webshopOnlineOrderable}
        setWebshopOnlineOrderable={setWebshopOnlineOrderable}
        websiteRemark={websiteRemark}
        setWebsiteRemark={setWebsiteRemark}
        websiteOrder={websiteOrder}
        setWebsiteOrder={setWebsiteOrder}
        shortWebText={shortWebText}
        setShortWebText={setShortWebText}
        websitePhotoFileName={websitePhotoFileName}
        setWebsitePhotoFileName={setWebsitePhotoFileName}
        kioskInfo={kioskInfo}
        setKioskInfo={setKioskInfo}
        kioskTakeAway={kioskTakeAway}
        setKioskTakeAway={setKioskTakeAway}
        kioskEatIn={kioskEatIn}
        setKioskEatIn={setKioskEatIn}
        kioskSubtitle={kioskSubtitle}
        setKioskSubtitle={setKioskSubtitle}
        kioskMinSubs={kioskMinSubs}
        setKioskMinSubs={setKioskMinSubs}
        kioskMaxSubs={kioskMaxSubs}
        setKioskMaxSubs={setKioskMaxSubs}
        kioskPictureFileName={kioskPictureFileName}
        setKioskPictureFileName={setKioskPictureFileName}
        productKeyboardValue={productKeyboardValue}
        productKeyboardOnChange={productKeyboardOnChange}
      />

      {/* Product positioning modal */}
      <ControlViewProductPositioningModal
        tr={tr}
        showProductPositioningModal={showProductPositioningModal}
        closeProductPositioningModal={closeProductPositioningModal}
        positioningCategoryId={positioningCategoryId}
        setPositioningCategoryId={setPositioningCategoryId}
        selectedCategoryId={selectedCategoryId}
        categories={categories}
        products={products}
        positioningSubproducts={positioningSubproducts}
        positioningLayoutByCategory={positioningLayoutByCategory}
        setPositioningLayoutByCategory={setPositioningLayoutByCategory}
        positioningColorByCategory={positioningColorByCategory}
        setPositioningColorByCategory={setPositioningColorByCategory}
        positioningSelectedProductId={positioningSelectedProductId}
        setPositioningSelectedProductId={setPositioningSelectedProductId}
        positioningSelectedCellIndex={positioningSelectedCellIndex}
        setPositioningSelectedCellIndex={setPositioningSelectedCellIndex}
        positioningSelectedPoolItemId={positioningSelectedPoolItemId}
        setPositioningSelectedPoolItemId={setPositioningSelectedPoolItemId}
        positioningCategoryTabsRef={positioningCategoryTabsRef}
        saveProductPositioningLayout={saveProductPositioningLayout}
        savingPositioningLayout={savingPositioningLayout}
      />

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
      <ControlViewProductSubproductsModal
        tr={tr}
        showProductSubproductsModal={showProductSubproductsModal}
        closeProductSubproductsModal={closeProductSubproductsModal}
        loadingProductSubproductsLinked={loadingProductSubproductsLinked}
        subproductGroups={subproductGroups}
        productSubproductsGroupId={productSubproductsGroupId}
        setProductSubproductsGroupId={setProductSubproductsGroupId}
        productSubproductsAvailable={productSubproductsAvailable}
        productSubproductsLeftSelectedIds={productSubproductsLeftSelectedIds}
        setProductSubproductsLeftSelectedIds={setProductSubproductsLeftSelectedIds}
        productSubproductsLeftListRef={productSubproductsLeftListRef}
        handleAddProductSubproductLinks={handleAddProductSubproductLinks}
        productSubproductsLinked={productSubproductsLinked}
        productSubproductsRightSelectedIds={productSubproductsRightSelectedIds}
        setProductSubproductsRightSelectedIds={setProductSubproductsRightSelectedIds}
        productSubproductsListRef={productSubproductsListRef}
        removeProductSubproductLink={removeProductSubproductLink}
        handleRemoveProductSubproductLinks={handleRemoveProductSubproductLinks}
        handleSaveProductSubproducts={handleSaveProductSubproducts}
        savingProductSubproducts={savingProductSubproducts}
        productSubproductsProduct={productSubproductsProduct}
      />

      {/* New / Edit subproduct modal */}
      <ControlViewSubproductModal
        tr={tr}
        showSubproductModal={showSubproductModal}
        closeSubproductModal={closeSubproductModal}
        subproductName={subproductName}
        handleSubproductNameChange={handleSubproductNameChange}
        setSubproductActiveField={setSubproductActiveField}
        subproductKeyName={subproductKeyName}
        setSubproductKeyName={setSubproductKeyName}
        subproductProductionName={subproductProductionName}
        setSubproductProductionName={setSubproductProductionName}
        subproductPrice={subproductPrice}
        setSubproductPrice={setSubproductPrice}
        subproductVatTakeOut={subproductVatTakeOut}
        setSubproductVatTakeOut={setSubproductVatTakeOut}
        subproductVatEatIn={subproductVatEatIn}
        setSubproductVatEatIn={setSubproductVatEatIn}
        subproductGroups={subproductGroups}
        subproductModalGroupId={subproductModalGroupId}
        setSubproductModalGroupId={setSubproductModalGroupId}
        subproductKioskPicture={subproductKioskPicture}
        setSubproductKioskPicture={setSubproductKioskPicture}
        categories={categories}
        subproductAttachToCategoryIds={subproductAttachToCategoryIds}
        setSubproductAttachToCategoryIds={setSubproductAttachToCategoryIds}
        subproductAttachToListRef={subproductAttachToListRef}
        scrollSubproductAttachToByPage={scrollSubproductAttachToByPage}
        savingSubproduct={savingSubproduct}
        handleSaveSubproduct={handleSaveSubproduct}
        subproductKeyboardValue={subproductKeyboardValue}
        subproductKeyboardOnChange={subproductKeyboardOnChange}
      />

      {/* Manage Groups modal */}
      <ControlViewManageGroupsModal
        tr={tr}
        showManageGroupsModal={showManageGroupsModal}
        closeManageGroupsModal={() => { setShowManageGroupsModal(false); setSelectedManageGroupId(null); }}
        subproductGroups={subproductGroups}
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        savingGroup={savingGroup}
        handleAddGroup={handleAddGroup}
        manageGroupsListRef={manageGroupsListRef}
        manageGroupsDragRef={manageGroupsDragRef}
        updateManageGroupsPaginationState={updateManageGroupsPaginationState}
        selectedManageGroupId={selectedManageGroupId}
        setSelectedManageGroupId={setSelectedManageGroupId}
        editingGroupId={editingGroupId}
        setEditingGroupId={setEditingGroupId}
        editingGroupName={editingGroupName}
        setEditingGroupName={setEditingGroupName}
        handleSaveEditGroup={handleSaveEditGroup}
        setDeleteConfirmGroupId={setDeleteConfirmGroupId}
        canManageGroupsPageUp={canManageGroupsPageUp}
        canManageGroupsPageDown={canManageGroupsPageDown}
        pageManageGroups={pageManageGroups}
      />

      {/* Logout confirmation modal — same style as delete modal */}
      <DeleteConfirmModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        message={tr('logoutConfirm', 'Are you sure you want to log out?')}
      />
    </div>
  );
}



