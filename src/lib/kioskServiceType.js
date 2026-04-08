const STORAGE_KEY = 'pos-kiosk-service-type';

export function loadKioskServiceType() {
  try {
    if (typeof window === 'undefined') return 'dine_in';
    const v = window.sessionStorage.getItem(STORAGE_KEY);
    if (v === 'takeaway' || v === 'dine_in') return v;
  } catch {
    /* ignore */
  }
  return 'dine_in';
}

export function saveKioskServiceType(value) {
  try {
    if (typeof window === 'undefined') return;
    if (value === 'takeaway' || value === 'dine_in') {
      window.sessionStorage.setItem(STORAGE_KEY, value);
    }
  } catch {
    /* ignore */
  }
}
