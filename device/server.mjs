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

/**
 * Canonical material from baseboard (motherboard) + system product DMI/WMI.
 * `deviceFingerprint` — SHA-256 hex (64 chars): this is the **Device ID** used for license binding
 *   and must be pasted into the license issuer. Not the same as the DMI system UUID string.
 * `motherboardUuid` — raw `sys.uuid` from systeminformation (BIOS/DMI “system UUID”); informational only.
 */
async function computeDeviceIdentity() {
  const [bb, sys] = await Promise.all([si.baseboard(), si.system()]);

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

  const raw = [
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

  const deviceFingerprint = crypto.createHash('sha256').update(raw, 'utf8').digest('hex');
  const motherboardUuid = String(sys.uuid || '').trim() || null;

  return { deviceFingerprint, motherboardUuid };
}

const app = express();
app.use(cors({ origin: true }));

app.get('/device-id', async (req, res) => {
  try {
    const { deviceFingerprint, motherboardUuid } = await computeDeviceIdentity();
    res.json({ ok: true, deviceFingerprint, motherboardUuid });
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
