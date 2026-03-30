import {
  FUNCTION_BUTTON_SLOT_COUNT,
  FUNCTION_BUTTON_ITEM_IDS,
  OPTION_BUTTON_SLOT_COUNT,
  OPTION_BUTTON_ITEM_IDS,
  OPTION_BUTTON_LOCKED_ID,
  DEFAULT_OPTION_BUTTON_LAYOUT,
  TABLE_TEMPLATE_OPTIONS
} from './constants.js';

export function normalizeFunctionButtonSlots(value) {
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

export function normalizeOptionButtonSlots(value) {
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

export function createDefaultBoard(table, color = '#facc15') {
  const tableW = Math.max(60, Number(table?.width) || 120);
  const tableH = Math.max(40, Number(table?.height) || 80);
  const boardW = Math.max(120, Math.round(tableW + 40));
  const boardH = Math.max(120, Math.round(tableH + 40));
  return {
    id: `board-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    color,
    x: 0,
    y: 0,
    width: boardW,
    height: boardH,
    rotation: 0
  };
}

export function normalizeBoardToItem(b, defaultColor = '#facc15') {
  return {
  id: b?.id && typeof b.id === 'string' ? b.id : `board-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  color: typeof b?.color === 'string' && b.color.trim() ? b.color.trim() : defaultColor,
  x: Number(b?.x) || 0,
  y: Number(b?.y) || 0,
  width: Math.max(10, Number(b?.width) || 120),
  height: Math.max(10, Number(b?.height) || 120),
  rotation: Number(b?.rotation) || 0
  };
}

export function createDefaultFlowerPot() {
  return {
    id: `flowerpot-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    x: 0,
    y: 0,
    width: 60,
    height: 72,
    rotation: 0
  };
}

export function normalizeFlowerPotToItem(fp) {
  return {
    id: fp?.id && typeof fp.id === 'string' ? fp.id : `flowerpot-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    x: Number(fp?.x) || 0,
    y: Number(fp?.y) || 0,
    width: Math.max(10, Number(fp?.width) || 60),
    height: Math.max(10, Number(fp?.height) || 72),
    rotation: Number(fp?.rotation) || 0
  };
}

export function createDefaultLayoutTable(index = 1, templateType = '4table') {
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
    templateType: tpl.id,
    boards: [],
    flowerPots: []
  };
}

export function normalizeLayoutEditorDraft(raw, locationName = 'Restaurant') {
  const hasTablesArray = Array.isArray(raw?.tables);
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
          : (Number(table?.chairs) || 4) >= 6
            ? '6table'
            : (Number(table?.chairs) || 4) >= 5
              ? '5table'
              : '4table',
        boards: (() => {
          if (Array.isArray(table?.boards) && table.boards.length > 0) {
            return table.boards.map((b) => normalizeBoardToItem(b));
          }
          if (table?.board && typeof table.board === 'object') {
            return [normalizeBoardToItem(table.board)];
          }
          if (typeof table?.boardColor === 'string' && table.boardColor.trim()) {
            return [normalizeBoardToItem(createDefaultBoard(table, table.boardColor.trim()))];
          }
          return [];
        })(),
        flowerPots:
          Array.isArray(table?.flowerPots) && table.flowerPots.length > 0
            ? table.flowerPots.map((fp) => normalizeFlowerPotToItem(fp))
            : table?.flowerPot && typeof table.flowerPot === 'object'
              ? [normalizeFlowerPotToItem(table.flowerPot)]
              : []
      }))
    : [];
  return {
    floorName: String(raw?.floorName || locationName || 'Restaurant'),
    floorWidth: Math.min(979, Math.max(400, Number(raw?.floorWidth) ?? 979)),
    floorHeight: Number(raw?.floorHeight) ?? 595.5,
    bookingCapacity: Math.max(0, Number(raw?.bookingCapacity) || 0),
    floors: Math.max(1, Number(raw?.floors) || 1),
    tables: hasTablesArray ? tables : [createDefaultLayoutTable(1)]
  };
}
