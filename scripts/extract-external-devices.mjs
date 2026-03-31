import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const controlPath = path.join(root, 'src/components/ControlView.jsx');
const lines = fs.readFileSync(controlPath, 'utf8').split(/\r?\n/);
const slice = lines.slice(5297, 5829);
const body = slice.map((s) => s.replace(/^            /, '')).join('\n');

const header = `import React from 'react';
import { Dropdown } from '../Dropdown';
import { SmallKeyboardWithNumpad } from '../SmallKeyboardWithNumpad';
import { PaginationArrows } from '../PaginationArrows';
import {
  PRINTER_TAB_DEFS,
  PRINTING_ORDER_OPTIONS,
  GROUPING_RECEIPT_OPTIONS,
  PRICE_DISPLAY_TYPE_OPTIONS,
  RFID_READER_TYPE_OPTIONS,
  BARCODE_SCANNER_TYPE_OPTIONS,
  CREDIT_CARD_TYPE_OPTIONS,
  SCALE_TYPE_OPTIONS,
  SCALE_PORT_OPTIONS,
  PRINTERS_PAGE_SIZE
} from './constants.js';

/** Main content when top nav is External Devices (all device sub-tabs). */
export function ControlViewExternalDevicesContent(props) {
  const {
`;

const footer = `  } = props;

  return (
${body}
  );
}
`;

// Props: collect from ControlView - we'll use spread in parent; for now destructure nothing and use props.xxx in body
// Actually body uses bare identifiers - we need to destructure all from props OR change body to props.foo
// Simplest fix: use ...props and with(body) - not valid JS
// Replace: export function ControlViewExternalDevicesContent(props) { return ( body ); } 
// and prefix every identifier - impossible automatically

// INSTEAD: destructure a giant list in the function from props

const outPath = path.join(root, 'src/components/controlView/ControlViewExternalDevicesContent.raw.txt');
fs.writeFileSync(outPath, body);
console.log('raw lines', body.split('\n').length);
