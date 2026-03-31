const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('posLicense', {
  getDeviceFingerprint: () => ipcRenderer.invoke('pos-license:device-fingerprint'),
  activateLicense: (licenseKey) => ipcRenderer.invoke('pos-license:activate', licenseKey),
  importLicenseBundle: (bundle) => ipcRenderer.invoke('pos-license:import-bundle', bundle),
  getLicenseStorePath: () => ipcRenderer.invoke('pos-license:license-store-path'),
  removeLicense: () => ipcRenderer.invoke('pos-license:remove'),
  getLicenseStatus: () => ipcRenderer.invoke('pos-license:status'),
  onLicenseInvalidated: (cb) => {
    const listener = (_e, detail) => cb(detail);
    ipcRenderer.on('pos-license:invalidated', listener);
    return () => ipcRenderer.removeListener('pos-license:invalidated', listener);
  },
  onLicenseUpdated: (cb) => {
    const listener = () => cb();
    ipcRenderer.on('pos-license:updated', listener);
    return () => ipcRenderer.removeListener('pos-license:updated', listener);
  }
});
