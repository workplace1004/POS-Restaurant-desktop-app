import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import si from 'systeminformation';

const PORT = Number(process.env.DEVICE_AGENT_PORT || 39471);

/** Strip generic BIOS/OEM placeholder values so we only hash real identifiers. */
function norm(s) {
  const t = String(s ?? '')
    .trim()
    .replace(/\s+/g, ' ');
  if (!t) return '';
  const lower = t.toLowerCase();
  if (lower.includes('o.e.m') || lower.includes('o.a.m')) return '';
  if (
    lower === 'default string' ||
    lower === 'not specified' ||
    lower === 'none' ||
    lower === 'n/a' ||
    lower === 'unknown' ||
    lower === 'system serial number'
  ) {
    return '';
  }
  return t;
}

function sha256Hex(utf8) {
  return crypto.createHash('sha256').update(utf8, 'utf8').digest('hex');
}

/**
 * Legacy v1: baseboard + system DMI only (collides on identical OEM placeholders / clones).
 */
function buildV1Raw(bb, sys) {
  const bbs = norm(bb.serial);
  const bbm = norm(bb.manufacturer);
  const bbmo = norm(bb.model);
  const bbv = norm(bb.version);
  const uuid = norm(sys.uuid);
  const syss = norm(sys.serial);

  const parts = [bbs, bbm, bbmo, bbv, uuid, syss].filter(Boolean);
  if (parts.length === 0) {
    throw new Error('no_hardware_identifiers');
  }

  return [
    'pos-board-fp/v1',
    'bbs',
    bbs,
    'bbm',
    bbm,
    'bbmo',
    bbmo,
    'bbv',
    bbv,
    'sys-uuid',
    uuid,
    'sys-serial',
    syss
  ].join('|');
}

/**
 * v2: v1 material plus BIOS, chassis, physical disk serials, OS host/serial, CPU —
 * reduces collisions when baseboard/system strings match across PCs.
 */
function buildV2ExtraRaw(bios, chassis, diskLayout, osInfo, cpu) {
  const diskSerials = Array.isArray(diskLayout)
    ? diskLayout
        .map((d) => norm(d?.serialNum ?? d?.serial ?? ''))
        .filter(Boolean)
        .sort()
    : [];

  return [
    'pos-board-fp-extra/v1',
    'bios-ser',
    norm(bios?.serial),
    'bios-vendor',
    norm(bios?.vendor),
    'chassis-ser',
    norm(chassis?.serial),
    'disk-serials',
    diskSerials.join(','),
    'os-host',
    norm(osInfo?.hostname),
    'os-ser',
    norm(osInfo?.serial),
    'cpu',
    [norm(cpu?.manufacturer), norm(cpu?.brand), String(cpu?.speed ?? '').trim()].filter(Boolean).join('|')
  ].join('|');
}

/**
 * `deviceFingerprint` — primary (v2) SHA-256 hex: use for **new** license issuance.
 * `legacyDeviceFingerprint` — v1 only: still accepted for already-activated licenses.
 */
async function computeDeviceIdentity() {
  const [bb, sys, bios, chassis, diskLayout, osInfo, cpu] = await Promise.all([
    si.baseboard(),
    si.system(),
    si.bios().catch(() => ({})),
    si.chassis().catch(() => ({})),
    si.diskLayout().catch(() => []),
    si.osInfo().catch(() => ({})),
    si.cpu().catch(() => ({}))
  ]);

  const v1Raw = buildV1Raw(bb, sys);
  const legacyDeviceFingerprint = sha256Hex(v1Raw);

  const v2Raw = `${v1Raw}|${buildV2ExtraRaw(bios, chassis, diskLayout, osInfo, cpu)}`;
  const deviceFingerprint = sha256Hex(v2Raw);

  const motherboardUuid = String(sys.uuid || '').trim() || null;

  return { deviceFingerprint, legacyDeviceFingerprint, motherboardUuid };
}

const app = express();
app.use(cors({ origin: true }));

app.get('/device-id', async (req, res) => {
  try {
    const { deviceFingerprint, legacyDeviceFingerprint, motherboardUuid } = await computeDeviceIdentity();
    res.json({ ok: true, deviceFingerprint, legacyDeviceFingerprint, motherboardUuid });
  } catch (e) {
    const code = e?.message;
    console.error('[device-agent]', e);
    if (code === 'no_hardware_identifiers') {
      return res.status(500).json({ ok: false, error: 'no_hardware_identifiers' });
    }
    return res.status(500).json({ ok: false, error: 'fingerprint_failed' });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`POS device agent (baseboard/system id) http://127.0.0.1:${PORT}/device-id`);
});
