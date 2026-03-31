export {};

declare global {
  interface Window {
    posLicense?: {
      activateLicense: (licenseKey: string) => Promise<{
        ok: boolean;
        error?: string;
        message?: string;
      }>;
      importLicenseBundle: (bundle: {
        licenseKey: string;
        license: Record<string, unknown>;
        signature: string;
      }) => Promise<{
        ok: boolean;
        error?: string;
        message?: string;
      }>;
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
