/**
 * Decrypts license files produced by `license-server` (`encryptLicenseFilePlaintext`).
 * Must stay in sync with `license-server/src/licenseFileCrypto.js`.
 */
const crypto = require('crypto');

const LICENSE_FILE_MAGIC = Buffer.from('PRFL', 'ascii');
const LICENSE_FILE_CRYPTO_VERSION = 1;
const IV_LEN = 12;
const TAG_LEN = 16;

function getLicenseFileEncryptionKeyBuffer() {
  const hex = String(process.env.VITE_LICENSE_FILE_ENCRYPTION_KEY || process.env.LICENSE_FILE_ENCRYPTION_KEY || '').trim();
  if (!/^[a-fA-F0-9]{64}$/.test(hex)) return null;
  const key = Buffer.from(hex, 'hex');
  return key.length === 32 ? key : null;
}

function isEncryptedLicenseFile(buf) {
  if (!Buffer.isBuffer(buf)) return false;
  return (
    buf.length >= LICENSE_FILE_MAGIC.length + 1 + IV_LEN + TAG_LEN + 1 &&
    buf.slice(0, LICENSE_FILE_MAGIC.length).equals(LICENSE_FILE_MAGIC)
  );
}

/**
 * @param {Buffer} buf MAGIC | v1 | iv(12) | ciphertext | tag(16)
 * @returns {object} parsed JSON payload
 */
function decryptLicenseFileBuffer(buf) {
  if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
  if (!isEncryptedLicenseFile(buf)) {
    throw new Error('bad_magic');
  }
  if (buf[4] !== LICENSE_FILE_CRYPTO_VERSION) {
    throw new Error('unsupported_version');
  }
  const iv = buf.slice(5, 5 + IV_LEN);
  const tag = buf.slice(-TAG_LEN);
  const ciphertext = buf.slice(5 + IV_LEN, -TAG_LEN);
  const key = getLicenseFileEncryptionKeyBuffer();
  if (!key) {
    throw new Error('no_decryption_key');
  }
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(plain.toString('utf8'));
}

module.exports = {
  LICENSE_FILE_MAGIC,
  isEncryptedLicenseFile,
  decryptLicenseFileBuffer,
  getLicenseFileEncryptionKeyBuffer
};
