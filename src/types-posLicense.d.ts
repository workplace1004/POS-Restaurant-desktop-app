export {};

declare global {
  interface Window {
    posLicense?: {
      activateLicense: (licenseKey: string) => Promise<{
        ok: boolean;
        error?: string;
        message?: string;
      }>;
      getDeviceFingerprint: () => Promise<{
        ok: boolean;
        deviceFingerprint?: string;
        /** v1-only fingerprint; accepted for licenses issued before v2. */
        legacyDeviceFingerprint?: string | null;
        motherboardUuid?: string | null;
        error?: string;
      }>;
      importLicenseBundle: (
        payload:
          | {
              licenseKey: string;
              license: Record<string, unknown>;
              signature: string;
            }
          | { base64: string }
      ) => Promise<{
        ok: boolean;
        error?: string;
        message?: string;
      }>;
      /** OS file picker with "All Files" as the first/default filter (Windows). */
      pickLicenseFile: () => Promise<
        | { canceled: true }
        | { canceled: false; base64: string }
        | { canceled: false; error: string; message?: string }
      >;
      getLicenseStorePath: () => Promise<string>;
      removeLicense: () => Promise<{ ok: boolean; error?: string; message?: string }>;
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
