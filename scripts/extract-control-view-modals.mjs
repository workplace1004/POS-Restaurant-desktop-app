/**
 * One-off: extracts modal JSX from ControlView.jsx into controlView/ControlViewModals.jsx
 * and replaces the block with <ControlViewModals ... />.
 * Run: node scripts/extract-control-view-modals.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const controlViewPath = path.join(root, 'src', 'components', 'ControlView.jsx');
const outPath = path.join(root, 'src', 'components', 'controlView', 'ControlViewModals.jsx');

const MODAL_START_LINE = 5427; // 1-based inclusive
const MODAL_END_LINE = 9198; // 1-based inclusive

const BLACKLIST = new Set([
  'props',
  'React',
  'null',
  'undefined',
  'true',
  'false',
  'void',
  'typeof',
  'class',
  'const',
  'let',
  'var',
  'function',
  'return',
  'if',
  'else',
  'switch',
  'case',
  'break',
  'continue',
  'default',
  'new',
  'this',
  'super',
  'import',
  'export',
  'from',
  'async',
  'await',
  'try',
  'catch',
  'finally',
  'throw',
  'instanceof',
  'in',
  'of',
  'key',
  'ref',
  'div',
  'span',
  'button',
  'input',
  'label',
  'svg',
  'path',
  'form',
  'select',
  'option',
  'textarea',
  'img',
  'style',
  'className',
  'children',
  'open',
  'type',
  'value',
  'checked',
  'disabled',
  'readOnly',
  'placeholder',
  'autoComplete',
  'aria',
  'role',
  'tabIndex',
  'htmlFor',
  'xmlns',
  'viewBox',
  'strokeWidth',
  'strokeLinecap',
  'strokeLinejoin',
  'fill',
  'stroke',
  'width',
  'height',
  'transform',
  'd',
  'id',
  'e',
  'c',
  't',
  'p',
  'o',
  'x',
  'y',
  'i',
  'k',
  'v',
  'n',
  'a',
  'b',
  'r',
  's',
  'd',
  'w',
  'h',
  'u',
  'el',
  'ex',
  'err',
  'res',
  'req',
  'prev',
  'next',
  'idx',
  'evt',
  'ev',
  'map',
  'filter',
  'reduce',
  'find',
  'some',
  'every',
  'sort',
  'join',
  'split',
  'push',
  'pop',
  'length',
  'String',
  'Number',
  'Boolean',
  'Array',
  'Object',
  'Date',
  'Math',
  'JSON',
  'parseInt',
  'parseFloat',
  'isNaN',
  'encodeURIComponent',
  'decodeURIComponent',
  'console',
  'window',
  'document',
  'localStorage',
  'fetch',
  'Promise',
  'Set',
  'Map',
  'Error',
]);

function extractTopLevelBindings(src, endLine1Based) {
  const names = new Set();
  const lines = src.split(/\r?\n/);
  const endIdx = endLine1Based - 1;

  const fnIdx = lines.findIndex((l) => /export function ControlView\s*\(/.test(l));
  if (fnIdx === -1) return names;

  // Params: ControlView({ a, b, ... })
  const fnLine = lines[fnIdx];
  const mParams = fnLine.match(/ControlView\s*\(\s*\{([^}]*)\}\s*\)/);
  if (mParams) {
    for (const part of mParams[1].split(',')) {
      const p = part.trim().split(/\s+/)[0];
      if (p && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(p)) names.add(p);
    }
  }

  // Body opens with `) {` on the function line — one `{` for function body
  let depth = 0;
  const bodyOpen = (fnLine.match(/\)\s*\{/g) || []).length;
  if (bodyOpen) depth = 1;

  for (let i = fnIdx + 1; i <= endIdx && i < lines.length; i++) {
    const line = lines[i];
    if (depth === 1) {
      const t = line.trim();
      if (t.startsWith('const [')) {
        const m = t.match(/^\s*const\s*\[\s*(\w+)\s*,\s*(\w+)\s*\]/);
        if (m) {
          names.add(m[1]);
          names.add(m[2]);
        } else {
          const m2 = t.match(/^\s*const\s*\[\s*(\w+)\s*,/);
          if (m2) names.add(m2[1]);
        }
      } else if (t.startsWith('const {') && t.includes('useLanguage')) {
        const inner = line.match(/\{\s*([^}]+)\s*\}/);
        if (inner) {
          for (const part of inner[1].split(',')) {
            const name = part.trim().split(/\s+/)[0];
            if (name && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) names.add(name);
          }
        }
      } else if (/^\s*const\s+(\w+)\s*=/.test(t)) {
        const m = t.match(/^\s*const\s+(\w+)\s*=/);
        if (m) names.add(m[1]);
      }
    }

    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    depth += openBraces - closeBraces;
    if (depth <= 0) break;
  }

  return names;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const text = fs.readFileSync(controlViewPath, 'utf8');
const lines = text.split(/\r?\n/);

const modalSlice = lines.slice(MODAL_START_LINE - 1, MODAL_END_LINE).join('\n');

const preModal = lines.slice(0, MODAL_START_LINE - 1).join('\n');
const bindings = extractTopLevelBindings(text, MODAL_START_LINE - 1);

const used = [];
for (const name of bindings) {
  if (BLACKLIST.has(name)) continue;
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) continue;
  if (new RegExp(`\\b${escapeRe(name)}\\b`).test(modalSlice)) used.push(name);
}

used.sort((a, b) => b.length - a.length);

const headerImports = `import React from 'react';
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
  normalizeFlowerPotToItem
} from './controlViewUtils.js';
`;

const assigns = used.map((n) => `  const ${n} = props.${n};`).join('\n');

const out = `${headerImports}
export function ControlViewModals(props) {
${assigns}
  return (
    <>
${modalSlice}
    </>
  );
}
`;

fs.writeFileSync(outPath, out, 'utf8');

const callProps = used.map((n) => `        ${n}={${n}}`).join('\n');
const replacement = `      <ControlViewModals
${callProps}
      />`;

const newPre = lines.slice(0, MODAL_START_LINE - 1);
const newPost = lines.slice(MODAL_END_LINE);
const importLine = `import { ControlViewModals } from './controlView/ControlViewModals.jsx';`;

let newText = [...newPre, replacement, ...newPost].join('\n');

if (!newText.includes('ControlViewModals.jsx')) {
  const insertAt = newText.indexOf("import { ControlViewTablesContent }");
  if (insertAt === -1) {
    throw new Error('Could not find insert point for ControlViewModals import');
  }
  const lineEnd = newText.indexOf('\n', insertAt);
  newText = newText.slice(0, lineEnd + 1) + importLine + '\n' + newText.slice(lineEnd + 1);
}

fs.writeFileSync(controlViewPath, newText, 'utf8');

console.log('Wrote', outPath);
console.log('Updated', controlViewPath);
console.log('Props count:', used.length);
