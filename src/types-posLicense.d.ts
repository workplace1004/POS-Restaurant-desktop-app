export {};

declare global {
  interface Window {
    /** Optional native hook: 64-char hex SHA-256 fingerprint for this workstation (e.g. Electron). */
    posDeviceFingerprint?: string | (() => string | Promise<string>);
    posLicense?: {
      getDeviceFingerprint: () => Promise<
        | { ok: true; deviceFingerprint: string }
        | { ok: false; error: string }
      >;
      activateLicense: (licenseKey: string) => Promise<{
        ok: boolean;
        error?: string;
        message?: string;
      }>;
      getLicenseStatus: () => Promise<{
        valid: boolean;
        reason: string;
        expiresAt: string | null;
        email: string | null;
      }>;
      onLicenseInvalidated: (cb: (detail: { reason?: string }) => void) => () => void;
      onLicenseUpdated: (cb: () => void) => () => void;
    };
  }
}
